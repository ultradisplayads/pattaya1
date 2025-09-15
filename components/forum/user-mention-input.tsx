"use client"

import React, { useState, useRef, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth/auth-provider"

interface UserMentionInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

interface User {
  id: string
  username: string
  email: string
  avatar?: string
}

export function UserMentionInput({
  value,
  onChange,
  placeholder = "Write your post...",
  className = "",
  disabled = false
}: UserMentionInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<User[]>([])
  const [mentionStart, setMentionStart] = useState(-1)
  const [mentionQuery, setMentionQuery] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { user } = useAuth()

  // Search for users when mention query changes
  useEffect(() => {
    if (mentionQuery.length > 0) {
      searchUsers(mentionQuery)
    } else {
      setSuggestions([])
    }
  }, [mentionQuery])

  const searchUsers = async (query: string) => {
    try {
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}&limit=5`)
      if (response.ok) {
        const data = await response.json()
        setSuggestions(data.users || [])
      }
    } catch (error) {
      console.error('Error searching users:', error)
      setSuggestions([])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    const cursorPosition = e.target.selectionStart

    onChange(newValue)

    // Check for @ mentions
    const textBeforeCursor = newValue.substring(0, cursorPosition)
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/)

    if (mentionMatch) {
      setMentionStart(cursorPosition - mentionMatch[0].length)
      setMentionQuery(mentionMatch[1])
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
      setMentionStart(-1)
      setMentionQuery("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === 'Escape') {
        e.preventDefault()
        // Handle keyboard navigation for suggestions
        if (e.key === 'Enter') {
          selectUser(suggestions[0])
        } else if (e.key === 'Escape') {
          setShowSuggestions(false)
        }
      }
    }
  }

  const selectUser = (user: User) => {
    if (mentionStart === -1) return

    const beforeMention = value.substring(0, mentionStart)
    const afterMention = value.substring(mentionStart + mentionQuery.length + 1) // +1 for @
    const newValue = `${beforeMention}@${user.username} ${afterMention}`

    onChange(newValue)
    setShowSuggestions(false)
    setMentionStart(-1)
    setMentionQuery("")

    // Focus back to textarea
    setTimeout(() => {
      if (textareaRef.current) {
        const newCursorPosition = beforeMention.length + user.username.length + 2 // +2 for @ and space
        textareaRef.current.focus()
        textareaRef.current.setSelectionRange(newCursorPosition, newCursorPosition)
      }
    }, 0)
  }

  const renderMentionedUsers = () => {
    const mentionRegex = /@(\w+)/g
    const parts = []
    let lastIndex = 0
    let match

    while ((match = mentionRegex.exec(value)) !== null) {
      // Add text before mention
      if (match.index > lastIndex) {
        parts.push(value.substring(lastIndex, match.index))
      }

      // Add mention as badge
      parts.push(
        <Badge key={match.index} variant="secondary" className="mx-1">
          @{match[1]}
        </Badge>
      )

      lastIndex = match.index + match[0].length
    }

    // Add remaining text
    if (lastIndex < value.length) {
      parts.push(value.substring(lastIndex))
    }

    return parts
  }

  return (
    <div className="relative">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`min-h-[120px] ${className}`}
        disabled={disabled}
      />

      {/* Mention Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute bottom-full left-0 mb-2 w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => selectUser(suggestion)}
              className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 text-left border-b border-gray-100 last:border-b-0"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={suggestion.avatar} />
                <AvatarFallback>{suggestion.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-sm">{suggestion.username}</div>
                <div className="text-xs text-gray-500">{suggestion.email}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Mention Preview (optional - shows how mentions will look) */}
      {value.includes('@') && (
        <div className="mt-2 p-3 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500 mb-2">Preview:</div>
          <div className="text-sm">
            {renderMentionedUsers()}
          </div>
        </div>
      )}
    </div>
  )
}
