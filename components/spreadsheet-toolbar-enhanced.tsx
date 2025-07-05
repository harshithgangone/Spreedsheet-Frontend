"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Palette, Type, Hash, Calendar, Percent, DollarSign, Undo, Redo, Copy, Cast as Paste, Scissors, ChevronDown, Trees as Freeze, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

interface SpreadsheetToolbarEnhancedProps {
  selectedCells: string[]
  onFormatBold: () => void
  onFormatItalic: () => void
  onFormatUnderline: () => void
  onAlignLeft: () => void
  onAlignCenter: () => void
  onAlignRight: () => void
  onFormatNumber: (format: "text" | "number" | "currency" | "percentage" | "date") => void
  onUndo: () => void
  onRedo: () => void
  onCopy: () => void
  onPaste: () => void
  onCut: () => void
  onFreezeRows: () => void
  onFreezeColumns: () => void
  canUndo: boolean
  canRedo: boolean
  hasClipboard: boolean
}

export function SpreadsheetToolbarEnhanced({
  selectedCells,
  onFormatBold,
  onFormatItalic,
  onFormatUnderline,
  onAlignLeft,
  onAlignCenter,
  onAlignRight,
  onFormatNumber,
  onUndo,
  onRedo,
  onCopy,
  onPaste,
  onCut,
  onFreezeRows,
  onFreezeColumns,
  canUndo,
  canRedo,
  hasClipboard,
}: SpreadsheetToolbarEnhancedProps) {
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set())
  const hasSelection = selectedCells.length > 0

  const formatButtons = [
    { icon: Bold, action: onFormatBold, key: "bold", tooltip: "Bold (Ctrl+B)" },
    { icon: Italic, action: onFormatItalic, key: "italic", tooltip: "Italic (Ctrl+I)" },
    { icon: Underline, action: onFormatUnderline, key: "underline", tooltip: "Underline (Ctrl+U)" },
  ]

  const alignButtons = [
    { icon: AlignLeft, action: onAlignLeft, key: "left", tooltip: "Align Left" },
    { icon: AlignCenter, action: onAlignCenter, key: "center", tooltip: "Align Center" },
    { icon: AlignRight, action: onAlignRight, key: "right", tooltip: "Align Right" },
  ]

  return (
    <div className="flex items-center gap-1 px-4 py-2 border-b bg-white">
      {/* Undo/Redo */}
      <div className="flex items-center gap-1 mr-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onUndo}
          disabled={!canUndo}
          className="h-8 w-8 p-0"
          title="Undo (Ctrl+Z)"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRedo}
          disabled={!canRedo}
          className="h-8 w-8 p-0"
          title="Redo (Ctrl+Y)"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      <div className="w-px h-6 bg-gray-300 mx-2" />

      {/* Clipboard */}
      <div className="flex items-center gap-1 mr-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onCut}
          disabled={!hasSelection}
          className="h-8 w-8 p-0"
          title="Cut (Ctrl+X)"
        >
          <Scissors className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCopy}
          disabled={!hasSelection}
          className="h-8 w-8 p-0"
          title="Copy (Ctrl+C)"
        >
          <Copy className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onPaste}
          disabled={!hasClipboard}
          className="h-8 w-8 p-0"
          title="Paste (Ctrl+V)"
        >
          <Paste className="h-4 w-4" />
        </Button>
      </div>

      <div className="w-px h-6 bg-gray-300 mx-2" />

      {/* Font Formatting */}
      <div className="flex items-center gap-1 mr-2">
        {formatButtons.map(({ icon: Icon, action, key, tooltip }) => (
          <Button
            key={key}
            variant="ghost"
            size="sm"
            onClick={action}
            disabled={!hasSelection}
            className={cn(
              "h-8 w-8 p-0",
              activeFormats.has(key) && "bg-blue-100 text-blue-700"
            )}
            title={tooltip}
          >
            <Icon className="h-4 w-4" />
          </Button>
        ))}
      </div>

      <div className="w-px h-6 bg-gray-300 mx-2" />

      {/* Alignment */}
      <div className="flex items-center gap-1 mr-2">
        {alignButtons.map(({ icon: Icon, action, key, tooltip }) => (
          <Button
            key={key}
            variant="ghost"
            size="sm"
            onClick={action}
            disabled={!hasSelection}
            className="h-8 w-8 p-0"
            title={tooltip}
          >
            <Icon className="h-4 w-4" />
          </Button>
        ))}
      </div>

      <div className="w-px h-6 bg-gray-300 mx-2" />

      {/* Number Format */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            disabled={!hasSelection}
            className="h-8 px-2"
          >
            <Hash className="h-4 w-4 mr-1" />
            Format
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => onFormatNumber("text")}>
            <Type className="mr-2 h-4 w-4" />
            Text
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFormatNumber("number")}>
            <Hash className="mr-2 h-4 w-4" />
            Number
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFormatNumber("currency")}>
            <DollarSign className="mr-2 h-4 w-4" />
            Currency
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFormatNumber("percentage")}>
            <Percent className="mr-2 h-4 w-4" />
            Percentage
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFormatNumber("date")}>
            <Calendar className="mr-2 h-4 w-4" />
            Date
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="w-px h-6 bg-gray-300 mx-2" />

      {/* Freeze Options */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 px-2">
            <Freeze className="h-4 w-4 mr-1" />
            Freeze
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={onFreezeRows}>
            <Lock className="mr-2 h-4 w-4" />
            Freeze Rows
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onFreezeColumns}>
            <Lock className="mr-2 h-4 w-4" />
            Freeze Columns
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Selection Info */}
      {hasSelection && (
        <div className="ml-auto text-sm text-gray-600">
          {selectedCells.length} cell{selectedCells.length !== 1 ? 's' : ''} selected
        </div>
      )}
    </div>
  )
}