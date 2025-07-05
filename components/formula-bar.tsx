"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Check, X, Function } from "lucide-react"
import { cn } from "@/lib/utils"

interface FormulaBarProps {
  activeCell: string
  cellValue: string
  onCellUpdate: (cellId: string, value: string) => void
  onCancel: () => void
}

export function FormulaBar({ activeCell, cellValue, onCellUpdate, onCancel }: FormulaBarProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formulaValue, setFormulaValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setFormulaValue(cellValue)
  }, [cellValue])

  const handleStartEdit = () => {
    setIsEditing(true)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  const handleSave = () => {
    onCellUpdate(activeCell, formulaValue)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormulaValue(cellValue)
    setIsEditing(false)
    onCancel()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSave()
    } else if (e.key === "Escape") {
      e.preventDefault()
      handleCancel()
    }
  }

  return (
    <div className="flex items-center border-b bg-white px-2 py-1 gap-2 min-h-[40px]">
      {/* Cell Reference */}
      <div className="flex items-center gap-2 min-w-[120px]">
        <div className="text-sm font-mono bg-gray-100 px-2 py-1 rounded border min-w-[60px] text-center">
          {activeCell}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={handleStartEdit}
        >
          <Function className="h-3 w-3" />
        </Button>
      </div>

      {/* Formula Input */}
      <div className="flex-1 flex items-center gap-1">
        {isEditing ? (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
              onClick={handleCancel}
            >
              <X className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-green-600 hover:text-green-700"
              onClick={handleSave}
            >
              <Check className="h-3 w-3" />
            </Button>
            <Input
              ref={inputRef}
              value={formulaValue}
              onChange={(e) => setFormulaValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
              className="h-7 text-sm border-0 focus:ring-1 focus:ring-blue-500"
              placeholder="Enter formula or value..."
            />
          </>
        ) : (
          <div
            className="flex-1 h-7 px-2 text-sm flex items-center cursor-text hover:bg-gray-50 rounded"
            onClick={handleStartEdit}
          >
            {cellValue || <span className="text-gray-400">Click to edit</span>}
          </div>
        )}
      </div>
    </div>
  )
}