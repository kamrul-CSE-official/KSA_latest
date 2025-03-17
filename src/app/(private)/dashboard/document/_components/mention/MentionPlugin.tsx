"use client"

import { useEffect, useState } from "react"
import { type User, users as defaultUsers } from "./users"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui//command"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface MentionPluginProps {
  editor: any 
  users?: User[]
  onSelect?: (user: User) => void
}

export default function MentionPlugin({ editor, users = defaultUsers, onSelect }: MentionPluginProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [position, setPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    // This is a simplified example - in a real implementation,
    // you would need to integrate with EditorJS's API more deeply
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "@") {
        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0)
          const rect = range.getBoundingClientRect()

          setPosition({
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX,
          })

          setIsOpen(true)
          setQuery("")
        }
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(query.toLowerCase()))

  const handleSelectUser = (user: User) => {
    if (onSelect) {
      onSelect(user)
    }

    // In a real implementation, you would insert the mention into the editor
    // using EditorJS's API

    setIsOpen(false)
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed z-[100]"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <Command className="rounded-lg border shadow-md">
        <CommandInput placeholder="Search users..." value={query} onValueChange={setQuery} className="h-9" />
        <CommandList>
          <CommandEmpty>No users found</CommandEmpty>
          <CommandGroup heading="Suggestions">
            {filteredUsers.map((user) => (
              <CommandItem
                key={user.id}
                onSelect={() => handleSelectUser(user)}
                className="flex items-center gap-2 p-2"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span>{user.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  )
}

