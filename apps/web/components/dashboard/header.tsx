"use client"

import { useRouter } from "next/navigation"
import {
  ChevronDown,
  CreditCard,
  LogOut,
  Settings,
  Sparkles,
  User,
} from "lucide-react"
import { signOut, useSession } from "next-auth/react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DashboardHeader() {
  const { data: session } = useSession()
  const router = useRouter()
  const handleLogout = () => {
    signOut({ redirect: true, callbackUrl: "/" })
  }

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-lg font-semibold text-gray-900">Resumind</h1>
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 focus:outline-none">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {session?.user.name}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-700" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {/* User email at the top */}
              <div className="px-3 py-2 text-xs text-gray-500">
                {session?.user.email}
              </div>
              <DropdownMenuSeparator />
              {/* Billing */}
              <DropdownMenuItem>
                <CreditCard className="mr-2 h-4 w-4 text-gray-500" />
                Billing
              </DropdownMenuItem>
              {/* Settings */}
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4 text-gray-500" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* Sign Out */}
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4 text-red-600" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
