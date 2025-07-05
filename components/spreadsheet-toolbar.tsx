"use client"

import { Button } from "@/components/ui/button"
import {
  EyeOff,
  ArrowUpDown,
  Filter,
  Grid3X3,
  Download,
  Upload,
  Share,
  Plus,
  MessageSquare,
  FileText,
  Eye,
  Columns,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SpreadsheetToolbarProps {
  onHideFields: () => void
  onSort: () => void
  onFilter: () => void
  onImport: () => void
  onExport: () => void
  onShare: () => void
  onNewAction: () => void
  onAddColumn: () => void
  onAnswerQuestion: () => void
  onExtract: () => void
  hiddenFieldsCount?: number
}

export function SpreadsheetToolbar({
  onHideFields,
  onSort,
  onFilter,
  onImport,
  onExport,
  onShare,
  onNewAction,
  onAddColumn,
  onAnswerQuestion,
  onExtract,
  hiddenFieldsCount = 0,
}: SpreadsheetToolbarProps) {
  // Make Share and New Action buttons non-functional as requested
  const handleShare = () => {
    // Do nothing - button should not work
  }

  const handleNewAction = () => {
    // Do nothing - button should not work
  }

  return (
    <div className="flex items-center justify-between px-2 md:px-4 py-2 bg-gray-50 border-b min-h-[50px] flex-shrink-0 overflow-x-auto">
      <div className="flex items-center space-x-1 min-w-0">
        <span className="text-sm font-medium text-gray-700 mr-2 hidden sm:block">Tool bar</span>

        <Button
          variant="ghost"
          size="sm"
          onClick={onAddColumn}
          className="text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-colors h-8 flex-shrink-0"
        >
          <Columns className="w-4 h-4 mr-1" />
          <span className="hidden sm:inline">Add Column</span>
          <span className="sm:hidden">Add</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onHideFields}
          className={cn(
            "text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-colors h-8 flex-shrink-0",
            hiddenFieldsCount > 0 && "bg-blue-100 text-blue-700",
          )}
        >
          {hiddenFieldsCount > 0 ? <Eye className="w-4 h-4 mr-1" /> : <EyeOff className="w-4 h-4 mr-1" />}
          <span className="hidden sm:inline">{hiddenFieldsCount > 0 ? "Show" : "Hide"} columns</span>
          <span className="sm:hidden">{hiddenFieldsCount > 0 ? "Show" : "Hide"}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onSort}
          className="text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-colors h-8 flex-shrink-0"
        >
          <ArrowUpDown className="w-4 h-4 mr-1" />
          <span className="hidden sm:inline">Sort</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onFilter}
          className="text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-colors h-8 flex-shrink-0"
        >
          <Filter className="w-4 h-4 mr-1" />
          <span className="hidden sm:inline">Filter</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => console.log("Cell view toggled")}
          className="text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-colors h-8 flex-shrink-0 hidden md:flex"
        >
          <Grid3X3 className="w-4 h-4 mr-1" />
          <span className="hidden lg:inline">Cell view</span>
        </Button>
      </div>

      <div className="flex items-center space-x-1 md:space-x-2 flex-shrink-0">
        <div className="flex items-center space-x-1 mr-2 hidden sm:flex">
          <Button
            variant="ghost"
            size="sm"
            onClick={onImport}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-colors h-8"
          >
            <Upload className="w-4 h-4 mr-1" />
            <span className="hidden lg:inline">Import</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onExport}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-colors h-8"
          >
            <Download className="w-4 h-4 mr-1" />
            <span className="hidden lg:inline">Export</span>
          </Button>

          {/* Share button - NON-FUNCTIONAL as requested */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="text-gray-400 cursor-not-allowed h-8"
            disabled
          >
            <Share className="w-4 h-4 mr-1" />
            <span className="hidden lg:inline">Share</span>
          </Button>
        </div>

        <div className="flex items-center space-x-1">
          <Button
            size="sm"
            onClick={onAnswerQuestion}
            className="bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors h-8 border border-purple-200 hidden md:flex"
          >
            <MessageSquare className="w-4 h-4 mr-1" />
            <span className="hidden lg:inline">Answer a question</span>
            <span className="lg:hidden">Ask</span>
          </Button>

          <Button
            size="sm"
            onClick={onExtract}
            className="bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors h-8 border border-orange-200 hidden md:flex"
          >
            <FileText className="w-4 h-4 mr-1" />
            <span className="hidden lg:inline">Extract</span>
          </Button>

          {/* New Action button - NON-FUNCTIONAL as requested */}
          <Button
            size="sm"
            onClick={handleNewAction}
            className="bg-gray-300 text-gray-500 cursor-not-allowed h-8 flex-shrink-0"
            disabled
          >
            <Plus className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">New Action</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>
      </div>
    </div>
  )
}