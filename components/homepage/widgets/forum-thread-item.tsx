"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Clock, Eye, ThumbsUp } from "lucide-react"

interface ForumThreadItemProps {
  topic: {
    id: string | number
    title: string
    url: string
    category_id: number
    author: {
      username: string
      name: string
      avatar_template?: string
    }
    reply_count: number
    view_count: number
    like_count: number
    last_activity: string
    created_at: string
    is_hot: boolean
    is_pinned: boolean
    tags: string[]
    excerpt: string
    category_info: {
      name: string
      icon: string
      color: string
    }
    avatar_url?: string | null
  }
}

export function ForumThreadItem({ topic }: ForumThreadItemProps) {
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  const getAuthorInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <a
      href={topic.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 bg-white hover:bg-gray-50"
    >
      <div className="flex items-start gap-3">
        {/* User Avatar */}
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage 
            src={topic.avatar_url || undefined} 
            alt={topic.author.name}
          />
          <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
            {getAuthorInitials(topic.author.name)}
          </AvatarFallback>
        </Avatar>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title Row */}
          <div className="flex items-start gap-2 mb-2">
            <h3 className="font-medium text-gray-900 text-sm leading-tight line-clamp-2 flex-1">
              {topic.title}
            </h3>
            {topic.is_hot && (
              <span className="text-lg flex-shrink-0" title="Hot Thread">
                🔥
              </span>
            )}
            {topic.is_pinned && (
              <Badge variant="secondary" className="text-xs flex-shrink-0">
                Pinned
              </Badge>
            )}
          </div>

          {/* Metadata Row */}
          <div className="flex items-center gap-3 text-xs text-gray-500">
            {/* Category */}
            <div className="flex items-center gap-1">
              <span 
                className="text-sm"
                style={{ color: topic.category_info.color }}
              >
                {topic.category_info.icon}
              </span>
              <span className="font-medium">
                {topic.category_info.name}
              </span>
            </div>

            {/* Separator */}
            <span>•</span>

            {/* Engagement Metrics */}
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              <span>{topic.reply_count} Replies</span>
            </div>

            {/* Separator */}
            <span>•</span>

            {/* Last Activity */}
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>
                Last reply by {topic.author.username} {formatTimeAgo(topic.last_activity)}
              </span>
            </div>
          </div>

          {/* Additional Stats (Optional) */}
          {(topic.view_count > 0 || topic.like_count > 0) && (
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
              {topic.view_count > 0 && (
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{topic.view_count} views</span>
                </div>
              )}
              {topic.like_count > 0 && (
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-3 w-3" />
                  <span>{topic.like_count} likes</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </a>
  )
}
