"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  Building, 
  Shield, 
  FileText, 
  BarChart3, 
  Settings,
  AlertTriangle
} from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: Building,
  },
  {
    name: "Controls",
    href: "/controls",
    icon: Shield,
  },
  {
    name: "Procedures",
    href: "/procedures",
    icon: FileText,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    name: "Alerts",
    href: "/alerts",
    icon: AlertTriangle,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {navigation.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary",
              isActive
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            <span className="hidden md:inline-block">{item.name}</span>
          </Link>
        )
      })}
    </nav>
  )
} 