"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface SpreadsheetTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const tabs = [
  { name: "Sheet1", count: 0 },
  { name: "Sheet2", count: 0 },
  { name: "Sheet3", count: 0 },
]

export function SpreadsheetTabs({ activeTab, onTabChange }: SpreadsheetTabsProps) {
  return (
    <div className="flex items-center border-t bg-white px-2 sm:px-4 py-1 min-h-[40px] flex-shrink-0 overflow-x-auto">
      <div className="flex items-center space-x-1">
        {tabs.map((tab) => (
          <Button
            key={tab.name}
            variant="ghost"
            size="sm"
            onClick={() => {
              onTabChange(tab.name)
              console.log(`Switched to tab: ${tab.name}`)
            }}
            className={cn(
              "px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-t-md border-b-2 transition-all duration-200 h-8 flex-shrink-0",
              activeTab === tab.name
                ? "border-blue-500 text-blue-600 bg-blue-50"
                : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300 hover:bg-gray-50",
            )}
          >
            <span className="truncate">{tab.name}</span>
          </Button>
        ))}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => console.log("Add new sheet clicked")}
          className="px-2 py-1.5 text-gray-400 hover:text-gray-600 transition-colors h-8 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
