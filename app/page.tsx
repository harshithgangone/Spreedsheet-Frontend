"use client"

import { useState, useCallback, useEffect } from "react"
import { SpreadsheetHeader } from "@/components/spreadsheet-header"
import { SpreadsheetToolbarEnhanced } from "@/components/spreadsheet-toolbar-enhanced"
import { EnhancedExcelGrid } from "@/components/enhanced-excel-grid"
import { SpreadsheetTabs } from "@/components/spreadsheet-tabs"
import { FormulaBar } from "@/components/formula-bar"
import { generateEmptyGrid, type GridData, type CellData } from "@/lib/excel-data"
import { UndoRedoManager, ClipboardManager, parseFormula, formatCellValue } from "@/lib/spreadsheet-utils"

export default function Home() {
  const [activeTab, setActiveTab] = useState("Sheet1")
  const [gridData, setGridData] = useState<GridData>(generateEmptyGrid(100, 20))
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCells, setSelectedCells] = useState<string[]>(["A1"])
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([])
  const [frozenRows, setFrozenRows] = useState(0)
  const [frozenColumns, setFrozenColumns] = useState(0)
  
  // Managers
  const [undoRedoManager] = useState(() => new UndoRedoManager())
  const [clipboardManager] = useState(() => new ClipboardManager())
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const [hasClipboard, setHasClipboard] = useState(false)

  // Update undo/redo state
  useEffect(() => {
    setCanUndo(undoRedoManager.canUndo())
    setCanRedo(undoRedoManager.canRedo())
  }, [gridData, undoRedoManager])

  // Update clipboard state
  useEffect(() => {
    setHasClipboard(clipboardManager.hasData())
  }, [clipboardManager])

  // Handle cell data updates
  const handleCellUpdate = useCallback((cellId: string, value: string) => {
    setGridData((prevData) => {
      const oldValue = prevData[cellId]?.value || ""
      
      // Add to undo stack
      undoRedoManager.addAction({
        type: 'cell_update',
        cellId,
        oldValue,
        newValue: value
      })

      // Parse formula if it starts with =
      const processedValue = value.startsWith('=') ? value : value
      
      const newData = {
        ...prevData,
        [cellId]: {
          ...prevData[cellId],
          value: processedValue,
          formula: value.startsWith('=') ? value : undefined,
        },
      }

      // Recalculate formulas that depend on this cell
      Object.keys(newData).forEach(key => {
        const cell = newData[key]
        if (cell.formula && cell.formula.includes(cellId)) {
          const calculatedValue = parseFormula(cell.formula, newData)
          newData[key] = { ...cell, value: calculatedValue }
        }
      })

      return newData
    })
    console.log(`Updated cell ${cellId} to: ${value}`)
  }, [undoRedoManager])

  // Undo/Redo operations
  const handleUndo = useCallback(() => {
    const action = undoRedoManager.undo()
    if (action && action.type === 'cell_update' && action.cellId && action.oldValue !== undefined) {
      setGridData(prevData => ({
        ...prevData,
        [action.cellId!]: {
          ...prevData[action.cellId!],
          value: action.oldValue!,
          formula: action.oldValue!.startsWith('=') ? action.oldValue! : undefined,
        }
      }))
    }
  }, [undoRedoManager])

  const handleRedo = useCallback(() => {
    const action = undoRedoManager.redo()
    if (action && action.type === 'cell_update' && action.cellId && action.newValue !== undefined) {
      setGridData(prevData => ({
        ...prevData,
        [action.cellId!]: {
          ...prevData[action.cellId!],
          value: action.newValue!,
          formula: action.newValue!.startsWith('=') ? action.newValue! : undefined,
        }
      }))
    }
  }, [undoRedoManager])

  // Clipboard operations
  const handleCopy = useCallback(() => {
    const cellsData: Record<string, any> = {}
    selectedCells.forEach(cellId => {
      cellsData[cellId] = gridData[cellId] || { value: "", type: "text", style: {} }
    })
    clipboardManager.copy(cellsData, selectedCells.join(','))
    setHasClipboard(true)
    console.log('Copied cells:', selectedCells)
  }, [selectedCells, gridData, clipboardManager])

  const handlePaste = useCallback(() => {
    const clipboardData = clipboardManager.paste()
    if (!clipboardData || selectedCells.length === 0) return

    const targetCell = selectedCells[0]
    const [targetCol, targetRowStr] = targetCell.match(/^([A-Z]+)(\d+)$/) || []
    const targetRow = parseInt(targetRowStr)

    if (!targetCol || !targetRow) return

    setGridData(prevData => {
      const newData = { ...prevData }
      
      Object.entries(clipboardData.cells).forEach(([sourceCellId, cellData]) => {
        const [sourceCol, sourceRowStr] = sourceCellId.match(/^([A-Z]+)(\d+)$/) || []
        const sourceRow = parseInt(sourceRowStr)
        
        if (sourceCol && sourceRow) {
          // Calculate offset
          const colOffset = getColumnIndex(targetCol) - getColumnIndex(sourceCol)
          const rowOffset = targetRow - sourceRow
          
          // Calculate new position
          const newCol = getColumnLetter(getColumnIndex(sourceCol) + colOffset)
          const newRow = sourceRow + rowOffset
          const newCellId = `${newCol}${newRow}`
          
          if (newRow > 0 && newRow <= 100) {
            newData[newCellId] = { ...cellData }
          }
        }
      })
      
      return newData
    })
    console.log('Pasted to:', targetCell)
  }, [selectedCells, clipboardManager])

  const handleCut = useCallback(() => {
    handleCopy()
    handleDelete()
  }, [handleCopy])

  const handleDelete = useCallback(() => {
    setGridData(prevData => {
      const newData = { ...prevData }
      selectedCells.forEach(cellId => {
        if (newData[cellId]) {
          undoRedoManager.addAction({
            type: 'cell_update',
            cellId,
            oldValue: newData[cellId].value,
            newValue: ""
          })
          newData[cellId] = { ...newData[cellId], value: "", formula: undefined }
        }
      })
      return newData
    })
  }, [selectedCells, undoRedoManager])

  // Formatting operations
  const handleFormatBold = useCallback(() => {
    setGridData(prevData => {
      const newData = { ...prevData }
      selectedCells.forEach(cellId => {
        if (!newData[cellId]) {
          newData[cellId] = { value: "", type: "text", style: {} }
        }
        newData[cellId] = {
          ...newData[cellId],
          style: {
            ...newData[cellId].style,
            bold: !newData[cellId].style?.bold
          }
        }
      })
      return newData
    })
  }, [selectedCells])

  const handleFormatItalic = useCallback(() => {
    setGridData(prevData => {
      const newData = { ...prevData }
      selectedCells.forEach(cellId => {
        if (!newData[cellId]) {
          newData[cellId] = { value: "", type: "text", style: {} }
        }
        newData[cellId] = {
          ...newData[cellId],
          style: {
            ...newData[cellId].style,
            italic: !newData[cellId].style?.italic
          }
        }
      })
      return newData
    })
  }, [selectedCells])

  const handleFormatUnderline = useCallback(() => {
    // Implementation for underline formatting
    console.log('Format underline:', selectedCells)
  }, [selectedCells])

  // Alignment operations
  const handleAlignLeft = useCallback(() => {
    console.log('Align left:', selectedCells)
  }, [selectedCells])

  const handleAlignCenter = useCallback(() => {
    console.log('Align center:', selectedCells)
  }, [selectedCells])

  const handleAlignRight = useCallback(() => {
    console.log('Align right:', selectedCells)
  }, [selectedCells])

  // Number formatting
  const handleFormatNumber = useCallback((format: "text" | "number" | "currency" | "percentage" | "date") => {
    setGridData(prevData => {
      const newData = { ...prevData }
      selectedCells.forEach(cellId => {
        if (newData[cellId]) {
          const formattedValue = formatCellValue(newData[cellId].value, format)
          newData[cellId] = {
            ...newData[cellId],
            value: formattedValue,
            type: format as any
          }
        }
      })
      return newData
    })
  }, [selectedCells])

  // Row/Column operations
  const handleInsertRow = useCallback((direction: "above" | "below") => {
    console.log(`Insert row ${direction}:`, selectedCells)
  }, [selectedCells])

  const handleInsertColumn = useCallback((direction: "left" | "right") => {
    console.log(`Insert column ${direction}:`, selectedCells)
  }, [selectedCells])

  const handleDeleteRow = useCallback(() => {
    console.log('Delete row:', selectedCells)
  }, [selectedCells])

  const handleDeleteColumn = useCallback(() => {
    console.log('Delete column:', selectedCells)
  }, [selectedCells])

  const handleFormatCell = useCallback((format: "text" | "number" | "date") => {
    handleFormatNumber(format)
  }, [handleFormatNumber])

  // Freeze operations
  const handleFreezeRows = useCallback(() => {
    const activeRow = selectedCells[0] ? parseInt(selectedCells[0].match(/\d+/)?.[0] || "1") : 1
    setFrozenRows(activeRow - 1)
    console.log(`Frozen rows: ${activeRow - 1}`)
  }, [selectedCells])

  const handleFreezeColumns = useCallback(() => {
    const activeCol = selectedCells[0] ? selectedCells[0].match(/^([A-Z]+)/)?.[1] : "A"
    const colIndex = activeCol ? getColumnIndex(activeCol) : 0
    setFrozenColumns(colIndex)
    console.log(`Frozen columns: ${colIndex}`)
  }, [selectedCells])

  // Other operations
  const handleAddColumn = useCallback(() => {
    const currentColumns = Object.keys(gridData)
      .map((key) => key.match(/^([A-Z]+)/)?.[1])
      .filter(Boolean)

    const maxCol = Math.max(
      ...currentColumns.map((col) => getColumnIndex(col!)),
    )

    const newColLetter = getColumnLetter(maxCol + 1)
    const newGridData = { ...gridData }

    for (let row = 1; row <= 100; row++) {
      const cellId = `${newColLetter}${row}`
      newGridData[cellId] = {
        value: "",
        type: "text",
        style: {},
      }
    }

    setGridData(newGridData)
    console.log(`Added new column: ${newColLetter}`)
  }, [gridData])

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    console.log(`Searching for: ${query}`)
  }, [])

  const handleHideColumns = useCallback(() => {
    if (selectedCells.length > 0) {
      const columnsToHide = [...new Set(selectedCells.map((cell) => cell.match(/^([A-Z]+)/)?.[1]).filter(Boolean))]
      setHiddenColumns((prev) => (prev.length > 0 ? [] : columnsToHide))
      console.log(`${hiddenColumns.length > 0 ? "Showing" : "Hiding"} columns:`, columnsToHide)
    }
  }, [selectedCells, hiddenColumns])

  // Get active cell value for formula bar
  const getActiveCellValue = () => {
    const activeCell = selectedCells[0] || "A1"
    return gridData[activeCell]?.value || ""
  }

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <SpreadsheetHeader onSearch={handleSearch} searchQuery={searchQuery} />
      
      <SpreadsheetToolbarEnhanced
        selectedCells={selectedCells}
        onFormatBold={handleFormatBold}
        onFormatItalic={handleFormatItalic}
        onFormatUnderline={handleFormatUnderline}
        onAlignLeft={handleAlignLeft}
        onAlignCenter={handleAlignCenter}
        onAlignRight={handleAlignRight}
        onFormatNumber={handleFormatNumber}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onCopy={handleCopy}
        onPaste={handlePaste}
        onCut={handleCut}
        onFreezeRows={handleFreezeRows}
        onFreezeColumns={handleFreezeColumns}
        canUndo={canUndo}
        canRedo={canRedo}
        hasClipboard={hasClipboard}
      />

      <FormulaBar
        activeCell={selectedCells[0] || "A1"}
        cellValue={getActiveCellValue()}
        onCellUpdate={handleCellUpdate}
        onCancel={() => {}}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <EnhancedExcelGrid
            gridData={gridData}
            selectedCells={selectedCells}
            onCellSelect={setSelectedCells}
            onCellUpdate={handleCellUpdate}
            hiddenColumns={hiddenColumns}
            searchQuery={searchQuery}
            frozenRows={frozenRows}
            frozenColumns={frozenColumns}
            onCopy={handleCopy}
            onPaste={handlePaste}
            onCut={handleCut}
            onDelete={handleDelete}
            onInsertRow={handleInsertRow}
            onInsertColumn={handleInsertColumn}
            onDeleteRow={handleDeleteRow}
            onDeleteColumn={handleDeleteColumn}
            onFormatCell={handleFormatCell}
          />
        </div>

        <SpreadsheetTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  )
}

// Helper functions
function getColumnIndex(letter: string): number {
  let result = 0
  for (let i = 0; i < letter.length; i++) {
    result = result * 26 + (letter.charCodeAt(i) - 64)
  }
  return result - 1
}

function getColumnLetter(index: number): string {
  let result = ""
  index += 1
  while (index > 0) {
    index--
    result = String.fromCharCode(65 + (index % 26)) + result
    index = Math.floor(index / 26)
  }
  return result
}