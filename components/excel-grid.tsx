"use client"

import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { GridData } from "@/lib/excel-data"
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Type, Hash, Calendar, Percent, DollarSign } from "lucide-react"

interface ExcelGridProps {
  gridData: GridData
  selectedCells: string[]
  onCellSelect: (cells: string[]) => void
  onCellUpdate: (cellId: string, value: string) => void
  hiddenColumns: string[]
  searchQuery: string
}

export function ExcelGrid({
  gridData,
  selectedCells,
  onCellSelect,
  onCellUpdate,
  hiddenColumns,
  searchQuery,
}: ExcelGridProps) {
  const [editingCell, setEditingCell] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")
  const [activeCell, setActiveCell] = useState<string>("A1")
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectionStart, setSelectionStart] = useState<string | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Generate column letters (A, B, C, ..., Z, AA, AB, ...)
  const generateColumnLetter = (index: number): string => {
    let result = ""
    while (index >= 0) {
      result = String.fromCharCode(65 + (index % 26)) + result
      index = Math.floor(index / 26) - 1
    }
    return result
  }

  // Get all available columns from grid data
  const allColumns = Array.from(
    new Set(
      Object.keys(gridData)
        .map((key) => key.match(/^([A-Z]+)/)?.[1])
        .filter(Boolean),
    ),
  ).sort()

  const visibleColumns = allColumns.filter((col) => !hiddenColumns.includes(col))
  const totalRows = 100

  // Focus input when editing starts
  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editingCell])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (editingCell) return // Don't navigate while editing

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
          onCellUpdate(activeCell, "")
          break
        default:
          // Start editing if alphanumeric key is pressed
          if (e.key.length === 1 && /[a-zA-Z0-9]/.test(e.key)) {
            handleCellEdit(activeCell, e.key)
          }
          break
      }

      if (newCell !== activeCell) {
        setActiveCell(newCell)
        onCellSelect([newCell])
        scrollToCell(newCell)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeCell, editingCell, visibleColumns, onCellSelect, onCellUpdate])

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

  // Formatting functions
  const handleFormatBold = () => {
    selectedCells.forEach(cellId => {
      const currentCell = gridData[cellId] || { value: "", type: "text", style: {} }
      const updatedCell = {
        ...currentCell,
        style: {
          ...currentCell.style,
          bold: !currentCell.style?.bold
        }
      }
      onCellUpdate(cellId, updatedCell.value)
    })
  }

  const handleFormatItalic = () => {
    selectedCells.forEach(cellId => {
      const currentCell = gridData[cellId] || { value: "", type: "text", style: {} }
      const updatedCell = {
        ...currentCell,
        style: {
          ...currentCell.style,
          italic: !currentCell.style?.italic
        }
      }
      onCellUpdate(cellId, updatedCell.value)
    })
  }

  const handleFormatUnderline = () => {
    selectedCells.forEach(cellId => {
      const currentCell = gridData[cellId] || { value: "", type: "text", style: {} }
      const updatedCell = {
        ...currentCell,
        style: {
          ...currentCell.style,
          underline: !currentCell.style?.underline
        }
      }
      onCellUpdate(cellId, updatedCell.value)
    })
  }

  const handleTextAlign = (alignment: 'left' | 'center' | 'right') => {
    selectedCells.forEach(cellId => {
      const currentCell = gridData[cellId] || { value: "", type: "text", style: {} }
      const updatedCell = {
        ...currentCell,
        style: {
          ...currentCell.style,
          textAlign: alignment
        }
      }
      onCellUpdate(cellId, updatedCell.value)
    })
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">
      {/* Cell Reference Display - Fixed at top */}
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
                {gridData[activeCell]?.value || ""}
              </span>
            </div>
            {searchQuery && <span className="text-xs text-gray-500">Searching for "{searchQuery}"</span>}
          </div>
        </div>
      </div>

      {/* Formatting Toolbar */}
      <div className="flex-shrink-0 bg-white border-b z-20">
        <div className="flex items-center px-2 sm:px-4 py-2 gap-2">
          {/* Text Formatting */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFormatBold}
              disabled={selectedCells.length === 0}
              className={cn(
                "h-8 w-8 p-0",
                selectedCells.some(cellId => gridData[cellId]?.style?.bold) && "bg-blue-100 text-blue-700"
              )}
              title="Bold (Ctrl+B)"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFormatItalic}
              disabled={selectedCells.length === 0}
              className={cn(
                "h-8 w-8 p-0",
                selectedCells.some(cellId => gridData[cellId]?.style?.italic) && "bg-blue-100 text-blue-700"
              )}
              title="Italic (Ctrl+I)"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFormatUnderline}
              disabled={selectedCells.length === 0}
              className={cn(
                "h-8 w-8 p-0",
                selectedCells.some(cellId => gridData[cellId]?.style?.underline) && "bg-blue-100 text-blue-700"
              )}
              title="Underline (Ctrl+U)"
            >
              <Underline className="h-4 w-4" />
            </Button>
          </div>

          <div className="w-px h-6 bg-gray-300" />

          {/* Text Alignment */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleTextAlign('left')}
              disabled={selectedCells.length === 0}
              className="h-8 w-8 p-0"
              title="Align Left"
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleTextAlign('center')}
              disabled={selectedCells.length === 0}
              className="h-8 w-8 p-0"
              title="Align Center"
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleTextAlign('right')}
              disabled={selectedCells.length === 0}
              className="h-8 w-8 p-0"
              title="Align Right"
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="w-px h-6 bg-gray-300" />

          {/* Number Formatting */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              disabled={selectedCells.length === 0}
              className="h-8 w-8 p-0"
              title="Text Format"
            >
              <Type className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={selectedCells.length === 0}
              className="h-8 w-8 p-0"
              title="Number Format"
            >
              <Hash className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={selectedCells.length === 0}
              className="h-8 w-8 p-0"
              title="Currency Format"
            >
              <DollarSign className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={selectedCells.length === 0}
              className="h-8 w-8 p-0"
              title="Percentage Format"
            >
              <Percent className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={selectedCells.length === 0}
              className="h-8 w-8 p-0"
              title="Date Format"
            >
              <Calendar className="h-4 w-4" />
            </Button>
          </div>

          {selectedCells.length > 0 && (
            <div className="ml-auto text-sm text-gray-600">
              {selectedCells.length} cell{selectedCells.length !== 1 ? 's' : ''} selected
            </div>
          )}
        </div>
      </div>

      {/* Main Grid Container - FIXED HEADERS WITH SCROLLING CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Fixed Column Headers Row */}
        <div className="flex-shrink-0 bg-white border-b border-gray-300 z-20">
          <div className="flex">
            {/* Top-left corner cell - FIXED */}
            <div className="w-12 h-8 bg-gray-100 border-r border-gray-300 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-medium text-gray-600">#</span>
            </div>

            {/* Column headers - SCROLL WITH CONTENT */}
            <div className="flex">
              {visibleColumns.map((col) => (
                <div
                  key={col}
                  className="w-24 h-8 px-2 bg-gray-100 border-r border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors flex-shrink-0"
                  onClick={() => {
                    const columnCells = Array.from({ length: totalRows }, (_, i) => `${col}${i + 1}`)
                    onCellSelect(columnCells)
                  }}
                >
                  <span className="text-sm font-medium text-gray-700">{col}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scrollable Data Area - BOTH ROWS AND CELLS SCROLL TOGETHER */}
        <div className="flex-1 overflow-auto custom-scrollbar" ref={gridRef}>
          <div className="flex">
            {/* Fixed Row Numbers Column */}
            <div className="flex-shrink-0">
              {Array.from({ length: totalRows }, (_, rowIndex) => {
                const rowNumber = rowIndex + 1
                return (
                  <div
                    key={rowNumber}
                    className="w-12 h-8 px-1 bg-gray-50 border-r border-gray-300 border-b border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => {
                      const rowCells = visibleColumns.map((col) => `${col}${rowNumber}`)
                      onCellSelect(rowCells)
                    }}
                  >
                    <span className="text-xs text-gray-600">{rowNumber}</span>
                  </div>
                )
              })}
            </div>

            {/* Data Cells - SCROLL WITH ROW NUMBERS */}
            <div className="flex-1">
              {Array.from({ length: totalRows }, (_, rowIndex) => {
                const rowNumber = rowIndex + 1
                return (
                  <div key={rowNumber} className="flex border-b border-gray-200 hover:bg-green-25 transition-colors">
                    {visibleColumns.map((col) => {
                      const cellId = `${col}${rowNumber}`
                      const cellData = gridData[cellId]
                      const cellValue = cellData?.value || ""
                      const isSelected = selectedCells.includes(cellId)
                      const isActive = activeCell === cellId
                      const isEditing = editingCell === cellId

                      return (
                        <div
                          key={cellId}
                          id={`cell-${cellId}`}
                          className={cn(
                            "w-24 h-8 border-r border-gray-200 cursor-cell relative flex items-center flex-shrink-0 px-1",
                            isSelected && "bg-blue-100",
                            isActive && "ring-2 ring-blue-500 ring-inset",
                            !isSelected && !isActive && "hover:bg-green-50",
                            cellData?.style?.bold && "font-bold",
                            cellData?.style?.italic && "italic",
                            cellData?.style?.underline && "underline"
                          )}
                          style={{
                            textAlign: cellData?.style?.textAlign || 'left',
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
                            <div className="text-xs w-full overflow-hidden">
                              <div className="truncate">
                                {cellValue ? highlightSearchText(cellValue) : ""}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}