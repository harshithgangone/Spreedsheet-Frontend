"use client"

import { useState, useEffect } from "react"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  Copy,
  Paste,
  Scissors,
  Trash2,
  Plus,
  Minus,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Type,
  Hash,
  Calendar,
} from "lucide-react"

interface ContextMenuWrapperProps {
  children: React.ReactNode
  selectedCells: string[]
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

export function ContextMenuWrapper({
  children,
  selectedCells,
  onCopy,
  onPaste,
  onCut,
  onDelete,
  onInsertRow,
  onInsertColumn,
  onDeleteRow,
  onDeleteColumn,
  onFormatCell,
}: ContextMenuWrapperProps) {
  const [clipboardData, setClipboardData] = useState<string | null>(null)

  useEffect(() => {
    // Check if clipboard has data
    navigator.clipboard.readText().then((text) => {
      setClipboardData(text)
    }).catch(() => {
      setClipboardData(null)
    })
  }, [])

  const hasSelection = selectedCells.length > 0

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem onClick={onCut} disabled={!hasSelection}>
          <Scissors className="mr-2 h-4 w-4" />
          Cut
          <span className="ml-auto text-xs text-muted-foreground">Ctrl+X</span>
        </ContextMenuItem>
        <ContextMenuItem onClick={onCopy} disabled={!hasSelection}>
          <Copy className="mr-2 h-4 w-4" />
          Copy
          <span className="ml-auto text-xs text-muted-foreground">Ctrl+C</span>
        </ContextMenuItem>
        <ContextMenuItem onClick={onPaste} disabled={!clipboardData}>
          <Paste className="mr-2 h-4 w-4" />
          Paste
          <span className="ml-auto text-xs text-muted-foreground">Ctrl+V</span>
        </ContextMenuItem>
        
        <ContextMenuSeparator />
        
        <ContextMenuItem onClick={() => onInsertRow("above")}>
          <ArrowUp className="mr-2 h-4 w-4" />
          Insert Row Above
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onInsertRow("below")}>
          <ArrowDown className="mr-2 h-4 w-4" />
          Insert Row Below
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onInsertColumn("left")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Insert Column Left
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onInsertColumn("right")}>
          <ArrowRight className="mr-2 h-4 w-4" />
          Insert Column Right
        </ContextMenuItem>
        
        <ContextMenuSeparator />
        
        <ContextMenuItem onClick={onDeleteRow} disabled={!hasSelection}>
          <Minus className="mr-2 h-4 w-4" />
          Delete Row
        </ContextMenuItem>
        <ContextMenuItem onClick={onDeleteColumn} disabled={!hasSelection}>
          <Minus className="mr-2 h-4 w-4" />
          Delete Column
        </ContextMenuItem>
        <ContextMenuItem onClick={onDelete} disabled={!hasSelection}>
          <Trash2 className="mr-2 h-4 w-4" />
          Clear Contents
        </ContextMenuItem>
        
        <ContextMenuSeparator />
        
        <ContextMenuItem onClick={() => onFormatCell("text")}>
          <Type className="mr-2 h-4 w-4" />
          Format as Text
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onFormatCell("number")}>
          <Hash className="mr-2 h-4 w-4" />
          Format as Number
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onFormatCell("date")}>
          <Calendar className="mr-2 h-4 w-4" />
          Format as Date
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}