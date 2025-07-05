"use client"

import { useState, useCallback } from "react"
import { SpreadsheetHeader } from "@/components/spreadsheet-header"
import { SpreadsheetToolbar } from "@/components/spreadsheet-toolbar"
import { ExcelGrid } from "@/components/excel-grid"
import { SpreadsheetTabs } from "@/components/spreadsheet-tabs"
import { generateEmptyGrid, type GridData } from "@/lib/excel-data"

export default function Home() {
  const [activeTab, setActiveTab] = useState("All Orders")
  const [gridData, setGridData] = useState<GridData>(generateEmptyGrid(100, 20)) // 100 rows, 20 columns
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCells, setSelectedCells] = useState<string[]>([])
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([])

  // Handle cell data updates
  const handleCellUpdate = useCallback((cellId: string, value: string) => {
    setGridData((prevData) => ({
      ...prevData,
      [cellId]: {
        ...prevData[cellId],
        value,
        formula: value.startsWith("=") ? value : undefined,
      },
    }))
    console.log(`Updated cell ${cellId} to: ${value}`)
  }, [])

  // Handle adding new columns
  const handleAddColumn = useCallback(() => {
    const currentColumns = Object.keys(gridData)
      .map((key) => key.match(/^([A-Z]+)/)?.[1])
      .filter(Boolean)

    const maxCol = Math.max(
      ...currentColumns.map((col) => {
        let num = 0
        for (let i = 0; i < col!.length; i++) {
          num = num * 26 + (col!.charCodeAt(i) - 64)
        }
        return num
      }),
    )

    const newColLetter = String.fromCharCode(65 + maxCol) // Next letter
    const newGridData = { ...gridData }

    // Add new column cells
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

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    console.log(`Searching for: ${query}`)
  }, [])

  // Handle hide columns
  const handleHideColumns = useCallback(() => {
    if (selectedCells.length > 0) {
      const columnsToHide = [...new Set(selectedCells.map((cell) => cell.match(/^([A-Z]+)/)?.[1]).filter(Boolean))]
      setHiddenColumns((prev) => (prev.length > 0 ? [] : columnsToHide))
      console.log(`${hiddenColumns.length > 0 ? "Showing" : "Hiding"} columns:`, columnsToHide)
    }
  }, [selectedCells, hiddenColumns])

  // Toolbar actions
  const handleFilter = () => {
    console.log("Filter clicked - opening filter dialog")
    alert("Filter functionality activated! You can now filter data.")
  }

  const handleImport = () => {
    console.log("Import clicked")
    alert("Import CSV/Excel files here!")
  }

  const handleExport = () => {
    console.log("Export clicked - generating CSV")
    const csvData = Object.entries(gridData)
      .filter(([_, cell]) => cell.value)
      .map(([cellId, cell]) => `${cellId},${cell.value}`)
      .join("\n")

    const blob = new Blob([`Cell,Value\n${csvData}`], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "excel-data.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleShare = () => {
    console.log("Share clicked")
    navigator.clipboard.writeText(window.location.href)
    alert("Link copied to clipboard! Share this spreadsheet with others.")
  }

  const handleNewAction = () => {
    console.log("New Action clicked")
    alert("New action created! You can now add tasks or data.")
  }

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <SpreadsheetHeader onSearch={handleSearch} searchQuery={searchQuery} />
      <SpreadsheetToolbar
        onHideFields={handleHideColumns}
        onSort={() => console.log("Sort menu opened")}
        onFilter={handleFilter}
        onImport={handleImport}
        onExport={handleExport}
        onShare={handleShare}
        onNewAction={handleNewAction}
        onAddColumn={handleAddColumn}
        onAnswerQuestion={() => alert("AI Assistant: How can I help you with your spreadsheet?")}
        onExtract={() => alert("Data extraction completed! Check the results.")}
        hiddenFieldsCount={hiddenColumns.length}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <ExcelGrid
            gridData={gridData}
            selectedCells={selectedCells}
            onCellSelect={setSelectedCells}
            onCellUpdate={handleCellUpdate}
            hiddenColumns={hiddenColumns}
            searchQuery={searchQuery}
          />
        </div>

        <SpreadsheetTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  )
}
