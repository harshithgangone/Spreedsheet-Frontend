"use client"

import { useState, useRef, useCallback, useEffect, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { GridData, CellData } from "@/lib/excel-data"
import { ContextMenuWrapper } from "@/components/context-menu"

interface EnhancedExcelGridProps {
  gridData: GridData
  selectedCells: string[]
  onCellSelect: (cells: string[]) => void
  onCellUpdate: (cellId: string, value: string) => void
  hiddenColumns: string[]
  searchQuery: string
  frozenRows: number
  frozenColumns: number
  onCopy: () => void
  onPaste: () => void
  onCut: () => void
  onDelete: () => void
  onInsertRow: (direction: "above" | "below") => void
  onInsertColumn: (direction: "left" | "right") => void
  onDeleteRow: () => void
  onDeleteColumn: () => void
  onFormatCell: (format: "text" | "number" | "date") => void
}

export function EnhancedExcelGrid({
  gridData,
  selectedCells,
  onCellSelect,
  onCellUpdate,
  hiddenColumns,
  searchQuery,
  frozenRows,
  frozenColumns,
  onCopy,
  onPaste,
  onCut,
  onDelete,
  onInsertRow,
  onInsertColumn,
  onDeleteRow,
  onDeleteColumn,
  onFormatCell,
}: EnhancedExcelGridProps) {
  const [editingCell, setEditingCell] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")
  const [activeCell, setActiveCell] = useState<string>("A1")
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectionStart, setSelectionStart] = useState<string | null>(null)
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({})
  const [resizingColumn, setResizingColumn] = useState<string | null>(null)
  
  const gridRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const resizeStartX = useRef<number>(0)
  const resizeStartWidth = useRef<number>(0)

  // Generate column letters
  const generateColumnLetter = (index: number): string => {
    let result = ""
    while (index >= 0) {
      result = String.fromCharCode(65 + (index % 26)) + result
      index = Math.floor(index / 26) - 1
    }
    return result
  }

  // Get all available columns from grid data
  const allColumns = useMemo(() => {
    return Array.from(
      new Set(
        Object.keys(gridData)
          .map((key) => key.match(/^([A-Z]+)/)?.[1])
          .filter(Boolean),
      ),
    ).sort()
  }, [gridData])

  const visibleColumns = allColumns.filter((col) => !hiddenColumns.includes(col))
  const totalRows = 100

  // Calculate formula values
  const calculateFormula = useCallback((formula: string, cellId: string): string => {
    try {
      // Simple formula calculation (can be extended)
      if (formula.startsWith("=SUM(")) {
        const range = formula.match(/=SUM\(([A-Z]+\d+):([A-Z]+\d+)\)/)?.[1]
        if (range) {
          // Basic SUM implementation
          return "42" // Placeholder
        }
      }
      if (formula.startsWith("=")) {
        // Basic arithmetic
        const expr = formula.slice(1).replace(/[A-Z]+\d+/g, (match) => {
          const cellValue = gridData[match]?.value || "0"
          return isNaN(Number(cellValue)) ? "0" : cellValue
        })
        try {
          return String(eval(expr))
        } catch {
          return "#ERROR"
        }
      }
      return formula
    } catch {
      return "#ERROR"
    }
  }, [gridData])

  // Focus input when editing starts
  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editingCell])

  // Keyboard navigation and shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (editingCell) return

      // Handle Ctrl shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'c':
            e.preventDefault()
            onCopy()
            break
          case 'v':
            e.preventDefault()
            onPaste()
            break
          case 'x':
            e.preventDefault()
            onCut()
            break
          case 'z':
            e.preventDefault()
            // Undo functionality would be handled by parent
            break
          case 'y':
            e.preventDefault()
            // Redo functionality would be handled by parent
            break
        }
        return
      }

      const [currentCol, currentRowStr] = activeCell.match(/^([A-Z]+)(\d+)$/) || []
      const currentRow = Number.parseInt(currentRowStr)
      const currentColIndex = visibleColumns.indexOf(currentCol)

      let newCell = activeCell

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault()
          if (currentRow > 1) {
            newCell = `${currentCol}${currentRow - 1}`
          }
          break
        case "ArrowDown":
          e.preventDefault()
          if (currentRow < totalRows) {
            newCell = `${currentCol}${currentRow + 1}`
          }
          break
        case "ArrowLeft":
          e.preventDefault()
          if (currentColIndex > 0) {
            newCell = `${visibleColumns[currentColIndex - 1]}${currentRow}`
          }
          break
        case "ArrowRight":
        case "Tab":
          e.preventDefault()
          if (currentColIndex < visibleColumns.length - 1) {
            newCell = `${visibleColumns[currentColIndex + 1]}${currentRow}`
          }
          break
        case "Enter":
          e.preventDefault()
          handleCellEdit(activeCell)
          break
        case "Delete":
        case "Backspace":
          e.preventDefault()
          onDelete()
          break
        case "F2":
          e.preventDefault()
          handleCellEdit(activeCell)
          break
        default:
          // Start editing if alphanumeric key is pressed
          if (e.key.length === 1 && /[a-zA-Z0-9=]/.test(e.key)) {
            handleCellEdit(activeCell, e.key)
          }
          break
      }

      if (newCell !== activeCell) {
        setActiveCell(newCell)
        if (!e.shiftKey) {
          onCellSelect([newCell])
        } else {
          // Extend selection
          const range = getCellRange(selectionStart || activeCell, newCell)
          onCellSelect(range)
        }
        scrollToCell(newCell)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeCell, editingCell, visibleColumns, onCellSelect, onCopy, onPaste, onCut, onDelete, selectionStart])

  // Mouse events for column resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (resizingColumn) {
        const deltaX = e.clientX - resizeStartX.current
        const newWidth = Math.max(50, resizeStartWidth.current + deltaX)
        setColumnWidths(prev => ({
          ...prev,
          [resizingColumn]: newWidth
        }))
      }
    }

    const handleMouseUp = () => {
      setResizingColumn(null)
    }

    if (resizingColumn) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [resizingColumn])

  const scrollToCell = (cellId: string) => {
    const cellElement = document.getElementById(`cell-${cellId}`)
    if (cellElement && gridRef.current) {
      const container = gridRef.current
      const cellRect = cellElement.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()

      // Scroll vertically if needed
      if (cellRect.top < containerRect.top + 40) {
        container.scrollTop -= containerRect.top + 40 - cellRect.top
      } else if (cellRect.bottom > containerRect.bottom) {
        container.scrollTop += cellRect.bottom - containerRect.bottom
      }

      // Scroll horizontally if needed
      if (cellRect.left < containerRect.left + 48) {
        container.scrollLeft -= containerRect.left + 48 - cellRect.left
      } else if (cellRect.right > containerRect.right) {
        container.scrollLeft += cellRect.right - containerRect.right
      }
    }
  }

  const handleCellClick = useCallback(
    (cellId: string, e: React.MouseEvent) => {
      if (e.shiftKey && selectionStart) {
        // Range selection
        const range = getCellRange(selectionStart, cellId)
        onCellSelect(range)
      } else if (e.ctrlKey || e.metaKey) {
        // Multi-selection
        const newSelection = selectedCells.includes(cellId)
          ? selectedCells.filter((id) => id !== cellId)
          : [...selectedCells, cellId]
        onCellSelect(newSelection)
      } else {
        // Single selection
        onCellSelect([cellId])
        setSelectionStart(cellId)
      }
      setActiveCell(cellId)
    },
    [selectedCells, selectionStart, onCellSelect],
  )

  const handleCellDoubleClick = useCallback((cellId: string) => {
    handleCellEdit(cellId)
  }, [])

  const handleCellEdit = useCallback(
    (cellId: string, initialValue?: string) => {
      const currentValue = gridData[cellId]?.value || ""
      setEditingCell(cellId)
      setEditValue(initialValue || currentValue)
      setActiveCell(cellId)
    },
    [gridData],
  )

  const handleCellSave = useCallback(() => {
    if (editingCell) {
      onCellUpdate(editingCell, editValue)
      setEditingCell(null)
      setEditValue("")
    }
  }, [editingCell, editValue, onCellUpdate])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault()
        handleCellSave()
        // Move to next row
        const [col, rowStr] = editingCell?.match(/^([A-Z]+)(\d+)$/) || []
        const row = Number.parseInt(rowStr)
        if (col && row < totalRows) {
          const nextCell = `${col}${row + 1}`
          setActiveCell(nextCell)
          onCellSelect([nextCell])
          scrollToCell(nextCell)
        }
      } else if (e.key === "Escape") {
        setEditingCell(null)
        setEditValue("")
      } else if (e.key === "Tab") {
        e.preventDefault()
        handleCellSave()
        // Move to next column
        const [col, rowStr] = editingCell?.match(/^([A-Z]+)(\d+)$/) || []
        const row = Number.parseInt(rowStr)
        const colIndex = visibleColumns.indexOf(col)
        if (colIndex < visibleColumns.length - 1) {
          const nextCell = `${visibleColumns[colIndex + 1]}${row}`
          setActiveCell(nextCell)
          onCellSelect([nextCell])
          scrollToCell(nextCell)
        }
      }
    },
    [editingCell, handleCellSave, onCellSelect, visibleColumns],
  )

  const getCellRange = (start: string, end: string): string[] => {
    const [startCol, startRowStr] = start.match(/^([A-Z]+)(\d+)$/) || []
    const [endCol, endRowStr] = end.match(/^([A-Z]+)(\d+)$/) || []
    const startRow = Number.parseInt(startRowStr)
    const endRow = Number.parseInt(endRowStr)
    const startColIndex = visibleColumns.indexOf(startCol)
    const endColIndex = visibleColumns.indexOf(endCol)

    const range: string[] = []
    const minRow = Math.min(startRow, endRow)
    const maxRow = Math.max(startRow, endRow)
    const minCol = Math.min(startColIndex, endColIndex)
    const maxCol = Math.max(startColIndex, endColIndex)

    for (let row = minRow; row <= maxRow; row++) {
      for (let col = minCol; col <= maxCol; col++) {
        range.push(`${visibleColumns[col]}${row}`)
      }
    }

    return range
  }

  const highlightSearchText = (text: string) => {
    if (!searchQuery || !text) return text

    const regex = new RegExp(`(${searchQuery})`, "gi")
    const parts = text.split(regex)

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      ),
    )
  }

  const handleColumnResize = (column: string, e: React.MouseEvent) => {
    e.preventDefault()
    setResizingColumn(column)
    resizeStartX.current = e.clientX
    resizeStartWidth.current = columnWidths[column] || 96
  }

  const getColumnWidth = (column: string) => {
    return columnWidths[column] || 96
  }

  const getCellValue = (cellId: string) => {
    const cellData = gridData[cellId]
    if (!cellData) return ""
    
    if (cellData.formula) {
      return calculateFormula(cellData.formula, cellId)
    }
    return cellData.value
  }

  return (
    <ContextMenuWrapper
      selectedCells={selectedCells}
      onCopy={onCopy}
      onPaste={onPaste}
      onCut={onCut}
      onDelete={onDelete}
      onInsertRow={onInsertRow}
      onInsertColumn={onInsertColumn}
      onDeleteRow={onDeleteRow}
      onDeleteColumn={onDeleteColumn}
      onFormatCell={onFormatCell}
    >
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        {/* Cell Reference Display */}
        <div className="flex-shrink-0 bg-white border-b z-30">
          <div className="flex items-center px-2 sm:px-4 py-2 bg-gray-50 border-b">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Cell:</span>
                <span className="text-sm font-mono bg-white px-2 py-1 border rounded">{activeCell}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Value:</span>
                <span className="text-sm bg-white px-2 py-1 border rounded min-w-[100px]">
                  {getCellValue(activeCell)}
                </span>
              </div>
              {searchQuery && <span className="text-xs text-gray-500">Searching for "{searchQuery}"</span>}
            </div>
          </div>
        </div>

        {/* Main Grid Container */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Fixed Column Headers */}
          <div className="flex-shrink-0 bg-white border-b border-gray-300 z-20">
            <div className="flex">
              {/* Top-left corner cell */}
              <div className="w-12 h-8 bg-gray-100 border-r border-gray-300 flex items-center justify-center sticky left-0 z-30 flex-shrink-0">
                <span className="text-xs font-medium text-gray-600">#</span>
              </div>

              {/* Column headers */}
              <div className="flex overflow-x-auto excel-scrollbar-horizontal">
                {visibleColumns.map((col, index) => (
                  <div
                    key={col}
                    className={cn(
                      "h-8 px-2 bg-gray-100 border-r border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors flex-shrink-0 relative",
                      index < frozenColumns && "sticky z-20 bg-blue-50"
                    )}
                    style={{ 
                      width: getColumnWidth(col),
                      left: index < frozenColumns ? `${48 + visibleColumns.slice(0, index).reduce((sum, c) => sum + getColumnWidth(c), 0)}px` : undefined
                    }}
                    onClick={() => {
                      const columnCells = Array.from({ length: totalRows }, (_, i) => `${col}${i + 1}`)
                      onCellSelect(columnCells)
                    }}
                  >
                    <span className="text-sm font-medium text-gray-700">{col}</span>
                    {/* Resize handle */}
                    <div
                      className="absolute right-0 top-0 w-2 h-full cursor-col-resize hover:bg-blue-300 opacity-0 hover:opacity-100"
                      onMouseDown={(e) => handleColumnResize(col, e)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scrollable Data Area */}
          <div className="flex-1 overflow-auto excel-scrollbar" ref={gridRef}>
            <div className="relative">
              {/* Data Rows */}
              {Array.from({ length: totalRows }, (_, rowIndex) => {
                const rowNumber = rowIndex + 1
                const isFrozenRow = rowIndex < frozenRows
                
                return (
                  <div 
                    key={rowNumber} 
                    className={cn(
                      "flex border-b border-gray-200 hover:bg-green-25 transition-colors",
                      isFrozenRow && "sticky z-10 bg-blue-50"
                    )}
                    style={{
                      top: isFrozenRow ? `${rowIndex * 32}px` : undefined
                    }}
                  >
                    {/* Row number */}
                    <div
                      className={cn(
                        "w-12 h-8 px-1 bg-gray-50 border-r border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors sticky left-0 z-10 flex-shrink-0",
                        isFrozenRow && "bg-blue-50"
                      )}
                      onClick={() => {
                        const rowCells = visibleColumns.map((col) => `${col}${rowNumber}`)
                        onCellSelect(rowCells)
                      }}
                    >
                      <span className="text-xs text-gray-600">{rowNumber}</span>
                    </div>

                    {/* Data cells */}
                    <div className="flex">
                      {visibleColumns.map((col, colIndex) => {
                        const cellId = `${col}${rowNumber}`
                        const cellData = gridData[cellId]
                        const cellValue = getCellValue(cellId)
                        const isSelected = selectedCells.includes(cellId)
                        const isActive = activeCell === cellId
                        const isEditing = editingCell === cellId
                        const isFrozenCol = colIndex < frozenColumns

                        return (
                          <div
                            key={cellId}
                            id={`cell-${cellId}`}
                            className={cn(
                              "h-8 border-r border-gray-200 border-b border-gray-200 cursor-cell relative flex items-center flex-shrink-0",
                              isSelected && "bg-blue-100",
                              isActive && "ring-2 ring-blue-500 ring-inset",
                              !isSelected && !isActive && "hover:bg-green-50",
                              isFrozenCol && "sticky z-10 bg-white",
                              isFrozenCol && isSelected && "bg-blue-100",
                              cellData?.style?.bold && "font-bold",
                              cellData?.style?.italic && "italic"
                            )}
                            style={{ 
                              width: getColumnWidth(col),
                              left: isFrozenCol ? `${48 + visibleColumns.slice(0, colIndex).reduce((sum, c) => sum + getColumnWidth(c), 0)}px` : undefined,
                              backgroundColor: cellData?.style?.backgroundColor,
                              color: cellData?.style?.color
                            }}
                            onClick={(e) => handleCellClick(cellId, e)}
                            onDoubleClick={() => handleCellDoubleClick(cellId)}
                          >
                            {isEditing ? (
                              <Input
                                ref={inputRef}
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={handleCellSave}
                                onKeyDown={handleKeyDown}
                                className="h-6 text-xs border-0 p-1 focus:ring-0 bg-transparent w-full"
                              />
                            ) : (
                              <div className="text-xs w-full px-1 overflow-hidden">
                                <div className="truncate">
                                  {cellValue ? highlightSearchText(cellValue) : ""}
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </ContextMenuWrapper>
  )
}