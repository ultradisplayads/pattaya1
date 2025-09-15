"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Smile, ThumbsUp, Heart, Laugh, Eye, Frown, Angry } from "lucide-react"

interface ReactionPickerProps {
  postId?: string
  topicId?: string
  currentReactions?: string[]
  onReactionChange?: (reaction: string | null, counts: ReactionCounts) => void
  disabled?: boolean
}

interface ReactionCounts {
  like: number
  love: number
  laugh: number
  wow: number
  sad: number
  angry: number
}

const REACTION_TYPES = [
  { type: 'like', emoji: '👍', icon: ThumbsUp, label: 'Like', color: 'text-blue-500' },
  { type: 'love', emoji: '❤️', icon: Heart, label: 'Love', color: 'text-red-500' },
  { type: 'laugh', emoji: '😂', icon: Laugh, label: 'Laugh', color: 'text-yellow-500' },
  { type: 'wow', emoji: '😮', icon: Eye, label: 'Wow', color: 'text-purple-500' },
  { type: 'sad', emoji: '😢', icon: Frown, label: 'Sad', color: 'text-gray-500' },
  { type: 'angry', emoji: '😡', icon: Angry, label: 'Angry', color: 'text-orange-500' }
]

export function ForumReactionPicker({ 
  postId, 
  topicId, 
  currentReactions = [], 
  onReactionChange,
  disabled = false 
}: ReactionPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [reactionCounts, setReactionCounts] = useState<ReactionCounts>({
    like: 0,
    love: 0,
    laugh: 0,
    wow: 0,
    sad: 0,
    angry: 0
  })

  const handleReaction = async (reactionType: string) => {
    if (isLoading || disabled) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/forum-reactions/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: reactionType,
          ...(postId ? { postId } : { topicId })
        })
      })

      if (response.ok) {
        const data = await response.json()
        setReactionCounts(data.counts)
        
        if (onReactionChange) {
          onReactionChange(data.action === 'removed' ? null : reactionType, data.counts)
        }
      }
    } catch (error) {
      console.error('Error adding reaction:', error)
    } finally {
      setIsLoading(false)
      setIsOpen(false)
    }
  }

  const getTotalReactions = () => {
    return Object.values(reactionCounts).reduce((sum, count) => sum + count, 0)
  }

  const getCurrentUserReaction = () => {
    // This would come from the current user's reactions
    return currentReactions[0] || null
  }

  return (
    <div className="flex items-center gap-2">
      {/* Quick Like Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleReaction('like')}
        disabled={isLoading || disabled}
        className={`h-8 px-2 text-sm transition-all duration-200 hover:scale-105 ${
          getCurrentUserReaction() === 'like' 
            ? 'bg-blue-100 text-blue-700 border-blue-300' 
            : 'hover:bg-blue-50 hover:text-blue-600'
        } ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        <span className="text-base">👍</span>
        {reactionCounts.like > 0 && (
          <span className="ml-1 font-medium">{reactionCounts.like}</span>
        )}
      </Button>

      {/* Reaction Picker */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            disabled={disabled}
            className="h-8 px-2 text-sm hover:bg-gray-100"
          >
            <Smile className="h-4 w-4" />
            {getTotalReactions() > 0 && (
              <span className="ml-1 font-medium">{getTotalReactions()}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="start">
          <div className="flex items-center gap-1">
            {REACTION_TYPES.map((reaction) => {
              const IconComponent = reaction.icon
              const count = reactionCounts[reaction.type as keyof ReactionCounts]
              const isActive = getCurrentUserReaction() === reaction.type
              
              return (
                <Button
                  key={reaction.type}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleReaction(reaction.type)}
                  disabled={isLoading}
                  className={`h-10 w-10 p-0 relative group transition-all duration-200 hover:scale-110 ${
                    isActive ? 'bg-gray-100' : 'hover:bg-gray-50'
                  }`}
                  title={`${reaction.label}${count > 0 ? ` (${count})` : ''}`}
                >
                  <span className="text-lg">{reaction.emoji}</span>
                  {count > 0 && (
                    <span className="absolute -top-1 -right-1 bg-white border border-gray-200 rounded-full h-4 w-4 flex items-center justify-center text-xs font-medium text-gray-600">
                      {count}
                    </span>
                  )}
                </Button>
              )
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
