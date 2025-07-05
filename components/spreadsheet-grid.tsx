"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowUpDown, ArrowUp, ArrowDown, ExternalLink, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import type { JobRequest } from "@/lib/mock-data"

interface SpreadsheetGridProps {
  data: JobRequest[]
  selectedCells: string[]
  onCellSelect: (cells: string[]) => void
  onCellUpdate: (rowIndex: number, field: string, value: string) => void
  onSort: (key: string) => void
  sortConfig: { key: string; direction: "asc" | "desc" } | null
  hiddenFields: string[]
  searchQuery: string
}

export function SpreadsheetGrid({
  data,
  selectedCells,
  onCellSelect,
  onCellUpdate,
  onSort,
  sortConfig,
  hiddenFields,
  searchQuery,
}: SpreadsheetGridProps) {
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [editingCell, setEditingCell] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")
  const [hoveredCell, setHoveredCell] = useState<string | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input when editing starts
  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editingCell])

  const handleRowSelect = useCallback((index: number) => {
    setSelectedRows((prev) => (prev.includes(index) ? prev.filter((row) => row !== index) : [...prev, index]))
  }, [])

  const handleSelectAll = useCallback(() => {
    setSelectedRows((prev) => (prev.length === data.length ? [] : data.map((_, index) => index)))
  }, [data.length])

  const handleCellClick = useCallback((rowIndex: number, field: string, currentValue: string) => {
    const cellId = `${rowIndex}-${field}`
    setEditingCell(cellId)
    setEditValue(currentValue)
    console.log(`Editing cell: ${cellId}`)
  }, [])

  const handleCellSave = useCallback(() => {
    if (editingCell) {
      const [rowIndex, field] = editingCell.split("-")
      onCellUpdate(Number.parseInt(rowIndex), field, editValue)
      setEditingCell(null)
      setEditValue("")
    }
  }, [editingCell, editValue, onCellUpdate])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleCellSave()
      } else if (e.key === "Escape") {
        setEditingCell(null)
        setEditValue("")
      }
    },
    [handleCellSave],
  )

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="w-3 h-3 text-gray-400 ml-1" />
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="w-3 h-3 text-blue-600 ml-1" />
    ) : (
      <ArrowDown className="w-3 h-3 text-blue-600 ml-1" />
    )
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "In-process": "bg-yellow-100 text-yellow-800 border-yellow-300",
      "Need to start": "bg-gray-100 text-gray-800 border-gray-300",
      Complete: "bg-green-100 text-green-800 border-green-300",
      Blocked: "bg-red-100 text-red-800 border-red-300",
    }

    return (
      <Badge
        variant="outline"
        className={cn(
          "font-medium text-xs px-2 py-0.5 rounded-md border",
          statusConfig[status as keyof typeof statusConfig],
        )}
      >
        {status}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      High: "bg-red-100 text-red-700 border-red-300",
      Medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
      Low: "bg-blue-100 text-blue-700 border-blue-300",
    }

    return (
      <Badge
        className={cn(
          "font-medium text-xs px-2 py-0.5 rounded-md border",
          priorityConfig[priority as keyof typeof priorityConfig],
        )}
      >
        {priority}
      </Badge>
    )
  }

  const highlightSearchText = (text: string) => {
    if (!searchQuery) return text

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

  const columns = [
    { key: "select", label: "", width: "w-12", fixed: true },
    { key: "id", label: "#", width: "w-16" },
    { key: "jobRequest", label: "Job Request", width: "min-w-[200px] sm:min-w-[350px]" },
    { key: "submitted", label: "Submitted", width: "w-24 sm:w-32" },
    { key: "status", label: "Status", width: "w-28 sm:w-32" },
    { key: "submitter", label: "Submitter", width: "w-28 sm:w-36" },
    { key: "url", label: "URL", width: "w-32 sm:w-48" },
    { key: "assigned", label: "Assigned", width: "w-28 sm:w-36" },
    { key: "priority", label: "Priority", width: "w-24 sm:w-28" },
    { key: "dueDate", label: "Due Date", width: "w-24 sm:w-32" },
    { key: "estValue", label: "Est. Value", width: "w-28 sm:w-36" },
  ].filter((col) => !hiddenFields.includes(col.key))

  // Generate 100 total rows (data + empty rows)
  const totalRows = 100
  const emptyRowsCount = Math.max(0, totalRows - data.length)

  return (
    <div className="flex-1 overflow-auto bg-white custom-scrollbar" ref={gridRef}>
      {/* Header with Q3 Financial Overview */}
      <div className="sticky top-0 z-20 bg-white border-b">
        <div className="flex items-center px-2 sm:px-4 py-2 bg-gray-50 border-b">
          <Info className="w-4 h-4 text-blue-600 mr-2" />
          <span className="text-sm font-medium text-gray-700">Q3 Financial Overview</span>
          {searchQuery && (
            <span className="ml-4 text-xs text-gray-500">
              Found {data.length} results for "{searchQuery}"
            </span>
          )}
        </div>
      </div>

      {/* Spreadsheet Grid */}
      <div className="relative">
        <table className="w-full border-collapse min-w-[800px]">
          <thead className="sticky top-[41px] z-10 bg-white">
            <tr className="border-b border-gray-300">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "text-left font-medium text-gray-700 text-sm border-r border-gray-200 bg-gray-50",
                    column.width,
                    column.key === "select" ? "px-2 sm:px-3 py-2" : "px-2 sm:px-4 py-3",
                  )}
                >
                  {column.key === "select" ? (
                    <Checkbox
                      checked={selectedRows.length === data.length && data.length > 0}
                      onCheckedChange={handleSelectAll}
                      className="border-gray-400"
                    />
                  ) : column.key === "url" ? (
                    <span className="text-xs sm:text-sm">{column.label}</span>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSort(column.key)}
                      className="h-auto p-0 font-medium text-gray-700 hover:text-gray-900 text-xs sm:text-sm"
                    >
                      {column.label}
                      {getSortIcon(column.key)}
                    </Button>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Data rows */}
            {data.map((row, rowIndex) => (
              <tr
                key={row.id}
                className={cn(
                  "border-b border-gray-200 hover:bg-green-50 transition-colors",
                  selectedRows.includes(rowIndex) && "bg-green-100",
                  rowIndex % 2 === 0 ? "bg-white" : "bg-green-25",
                )}
              >
                <td className="px-2 sm:px-3 py-3 border-r border-gray-200 bg-white sticky left-0 z-10">
                  <Checkbox
                    checked={selectedRows.includes(rowIndex)}
                    onCheckedChange={() => handleRowSelect(rowIndex)}
                    className="border-gray-400"
                  />
                </td>

                {columns.slice(1).map((column) => {
                  const cellId = `${rowIndex}-${column.key}`
                  const cellValue = row[column.key as keyof JobRequest]
                  const isEditing = editingCell === cellId

                  return (
                    <td
                      key={column.key}
                      className="px-2 sm:px-4 py-3 border-r border-gray-200 cursor-pointer hover:bg-green-50 relative"
                      onClick={() => !isEditing && handleCellClick(rowIndex, column.key, cellValue.toString())}
                      onMouseEnter={() => setHoveredCell(cellId)}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      {isEditing ? (
                        <Input
                          ref={inputRef}
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={handleCellSave}
                          onKeyDown={handleKeyDown}
                          className="h-8 text-xs sm:text-sm border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="text-xs sm:text-sm min-h-[20px] flex items-center">
                          {column.key === "status" ? (
                            getStatusBadge(cellValue.toString())
                          ) : column.key === "priority" ? (
                            getPriorityBadge(cellValue.toString())
                          ) : column.key === "url" ? (
                            <a
                              href={cellValue.toString()}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 inline-flex items-center transition-colors"
                              onClick={(e) => {
                                e.stopPropagation()
                                console.log(`Opening URL: ${cellValue}`)
                              }}
                            >
                              <span className="truncate max-w-[100px] sm:max-w-[200px]">
                                {cellValue.toString().replace("https://", "").replace("www.", "")}
                              </span>
                              <ExternalLink className="w-3 h-3 ml-1 flex-shrink-0" />
                            </a>
                          ) : column.key === "jobRequest" ? (
                            <span
                              className={cn(
                                "font-medium text-gray-900",
                                hoveredCell === cellId && "bg-blue-100 px-1 rounded",
                              )}
                            >
                              {highlightSearchText(cellValue.toString())}
                            </span>
                          ) : (
                            <span
                              className={cn(
                                column.key === "estValue" ? "font-medium text-gray-900" : "text-gray-600",
                                hoveredCell === cellId && "bg-blue-100 px-1 rounded",
                              )}
                            >
                              {highlightSearchText(cellValue.toString())}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}

            {/* Empty rows for Excel-like experience */}
            {Array.from({ length: emptyRowsCount }).map((_, index) => {
              const rowNumber = data.length + index + 1
              return (
                <tr key={`empty-${index}`} className="border-b border-gray-200 hover:bg-green-50">
                  <td className="px-2 sm:px-3 py-3 border-r border-gray-200 bg-white sticky left-0 z-10">
                    <span className="text-gray-400 text-xs">{rowNumber}</span>
                  </td>
                  {columns.slice(1).map((column) => {
                    const cellId = `${rowNumber}-${column.key}`
                    const isEditing = editingCell === cellId

                    return (
                      <td
                        key={column.key}
                        className="px-2 sm:px-4 py-3 border-r border-gray-200 cursor-pointer hover:bg-green-50 min-h-[44px]"
                        onClick={() => !isEditing && handleCellClick(rowNumber - 1, column.key, "")}
                        onMouseEnter={() => setHoveredCell(cellId)}
                        onMouseLeave={() => setHoveredCell(null)}
                      >
                        {isEditing ? (
                          <Input
                            ref={inputRef}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={handleCellSave}
                            onKeyDown={handleKeyDown}
                            className="h-8 text-xs sm:text-sm border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                        ) : (
                          <div className="text-xs sm:text-sm min-h-[20px] flex items-center">
                            {hoveredCell === cellId && <span className="text-gray-400">Click to edit</span>}
                          </div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
