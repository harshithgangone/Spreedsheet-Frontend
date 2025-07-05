"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, ArrowUp, ArrowDown, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import type { JobRequest } from "@/lib/mock-data"

interface SpreadsheetTableProps {
  data: JobRequest[]
  selectedRows: number[]
  onRowSelect: (rows: number[]) => void
  onSort: (key: string) => void
  sortConfig: { key: string; direction: "asc" | "desc" } | null
}

export function SpreadsheetTable({ data, selectedRows, onRowSelect, onSort, sortConfig }: SpreadsheetTableProps) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)

  const handleRowSelect = (index: number) => {
    if (selectedRows.includes(index)) {
      onRowSelect(selectedRows.filter((row) => row !== index))
    } else {
      onRowSelect([...selectedRows, index])
    }
  }

  const handleSelectAll = () => {
    if (selectedRows.length === data.length) {
      onRowSelect([])
    } else {
      onRowSelect(data.map((_, index) => index))
    }
  }

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="w-4 h-4 text-blue-600" />
    ) : (
      <ArrowDown className="w-4 h-4 text-blue-600" />
    )
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "In-process": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Need to start": "bg-gray-100 text-gray-800 border-gray-200",
      Complete: "bg-green-100 text-green-800 border-green-200",
      Blocked: "bg-red-100 text-red-800 border-red-200",
    }

    return (
      <Badge variant="outline" className={cn("font-medium", statusConfig[status as keyof typeof statusConfig])}>
        {status}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      High: "bg-red-100 text-red-700",
      Medium: "bg-yellow-100 text-yellow-700",
      Low: "bg-blue-100 text-blue-700",
    }

    return (
      <Badge className={cn("font-medium", priorityConfig[priority as keyof typeof priorityConfig])}>{priority}</Badge>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="w-12 px-4 py-3">
              <Checkbox checked={selectedRows.length === data.length} onCheckedChange={handleSelectAll} />
            </th>
            <th className="text-left px-4 py-3 font-medium text-gray-700">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSort("id")}
                className="h-auto p-0 font-medium text-gray-700 hover:text-gray-900"
              >
                #{getSortIcon("id")}
              </Button>
            </th>
            <th className="text-left px-4 py-3 font-medium text-gray-700 min-w-[300px]">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSort("jobRequest")}
                className="h-auto p-0 font-medium text-gray-700 hover:text-gray-900"
              >
                Job Request
                {getSortIcon("jobRequest")}
              </Button>
            </th>
            <th className="text-left px-4 py-3 font-medium text-gray-700">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSort("submitted")}
                className="h-auto p-0 font-medium text-gray-700 hover:text-gray-900"
              >
                Submitted
                {getSortIcon("submitted")}
              </Button>
            </th>
            <th className="text-left px-4 py-3 font-medium text-gray-700">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSort("status")}
                className="h-auto p-0 font-medium text-gray-700 hover:text-gray-900"
              >
                Status
                {getSortIcon("status")}
              </Button>
            </th>
            <th className="text-left px-4 py-3 font-medium text-gray-700">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSort("submitter")}
                className="h-auto p-0 font-medium text-gray-700 hover:text-gray-900"
              >
                Submitter
                {getSortIcon("submitter")}
              </Button>
            </th>
            <th className="text-left px-4 py-3 font-medium text-gray-700">URL</th>
            <th className="text-left px-4 py-3 font-medium text-gray-700">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSort("assigned")}
                className="h-auto p-0 font-medium text-gray-700 hover:text-gray-900"
              >
                Assigned
                {getSortIcon("assigned")}
              </Button>
            </th>
            <th className="text-left px-4 py-3 font-medium text-gray-700">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSort("priority")}
                className="h-auto p-0 font-medium text-gray-700 hover:text-gray-900"
              >
                Priority
                {getSortIcon("priority")}
              </Button>
            </th>
            <th className="text-left px-4 py-3 font-medium text-gray-700">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSort("dueDate")}
                className="h-auto p-0 font-medium text-gray-700 hover:text-gray-900"
              >
                Due Date
                {getSortIcon("dueDate")}
              </Button>
            </th>
            <th className="text-left px-4 py-3 font-medium text-gray-700">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSort("estValue")}
                className="h-auto p-0 font-medium text-gray-700 hover:text-gray-900"
              >
                Est. Value
                {getSortIcon("estValue")}
              </Button>
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={row.id}
              className={cn(
                "border-b hover:bg-gray-50 transition-colors cursor-pointer",
                selectedRows.includes(index) && "bg-blue-50",
                hoveredRow === index && "bg-gray-50",
              )}
              onMouseEnter={() => setHoveredRow(index)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              <td className="px-4 py-3">
                <Checkbox checked={selectedRows.includes(index)} onCheckedChange={() => handleRowSelect(index)} />
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">{row.id}</td>
              <td className="px-4 py-3 text-sm text-gray-900 font-medium">{row.jobRequest}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{row.submitted}</td>
              <td className="px-4 py-3">{getStatusBadge(row.status)}</td>
              <td className="px-4 py-3 text-sm text-gray-900">{row.submitter}</td>
              <td className="px-4 py-3">
                <a
                  href={row.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 inline-flex items-center text-sm transition-colors"
                >
                  {row.url.replace("https://", "").replace("www.", "")}
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">{row.assigned}</td>
              <td className="px-4 py-3">{getPriorityBadge(row.priority)}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{row.dueDate}</td>
              <td className="px-4 py-3 text-sm text-gray-900 font-medium">{row.estValue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
