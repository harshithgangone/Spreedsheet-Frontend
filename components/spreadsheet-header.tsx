"use client"

import { ChevronRight, Search, Bell, Folder } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface SpreadsheetHeaderProps {
  onSearch: (query: string) => void
  searchQuery: string
}

export function SpreadsheetHeader({ onSearch, searchQuery }: SpreadsheetHeaderProps) {
  return (
    <div className="flex items-center justify-between px-2 md:px-4 py-2 border-b bg-white min-h-[60px] flex-shrink-0">
      <div className="flex items-center space-x-2">
        <Folder className="w-5 h-5 text-green-600 hidden sm:block" />
        <div className="flex items-center space-x-1 text-sm text-gray-600">
          <button className="hover:text-gray-900 cursor-pointer transition-colors px-1 py-0.5 rounded hover:bg-gray-100 hidden md:block">
            Workspace
          </button>
          <ChevronRight className="w-4 h-4 hidden md:block" />
          <button className="hover:text-gray-900 cursor-pointer transition-colors px-1 py-0.5 rounded hover:bg-gray-100 hidden sm:block">
            Folder 2
          </button>
          <ChevronRight className="w-4 h-4 hidden sm:block" />
          <span className="font-medium text-gray-900 px-1">Excel Spreadsheet</span>
        </div>
      </div>

      <div className="flex items-center space-x-2 md:space-x-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search cells..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-10 w-32 sm:w-48 md:w-64 h-8 text-sm border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="relative p-2">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
              2
            </span>
          </Button>

          <div className="flex items-center space-x-2">
            <Avatar className="w-7 h-7">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback className="text-xs">JD</AvatarFallback>
            </Avatar>
            <div className="text-sm hidden lg:block">
              <div className="font-medium text-gray-900">John Doe</div>
              <div className="text-gray-500 text-xs">john.doe@company.com</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
