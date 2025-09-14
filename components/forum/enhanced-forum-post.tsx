"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { 
  MoreHorizontal, 
  Flag, 
  Share2, 
  CheckCircle, 
  MessageCircle, 
  Eye,
  Award,
  Pin,
  Lock,
  FileText
} from "lucide-react"
import { ForumReactionPicker } from "./forum-reaction-picker"
import { RichMediaEmbed } from "./rich-media-embed"
import { useAuth } from "@/components/auth/auth-provider"

interface ForumPostProps {
  post: {
    id: string
    content: string
    author: {
      id: string
      username: string
      avatar?: string
      role?: string
    }
    createdAt: string
    isEdited?: boolean
    editedAt?: string
    isBestAnswer?: boolean
    isPinned?: boolean
    isLocked?: boolean
    viewCount?: number
    reactionCounts?: {
      like: number
      love: number
      laugh: number
      wow: number
      sad: number
      angry: number
    }
    userReactions?: string[]
    attachments?: Array<{
      id: string
      url: string
      mime: string
    }>
    topic?: {
      id: string
      title: string
      author: {
        id: string
        username: string
      }
    }
  }
  onMarkBestAnswer?: (postId: string) => void
  onReport?: (postId: string, reason: string) => void
  onShare?: (postId: string) => void
  showTopicInfo?: boolean
}

export function EnhancedForumPost({ 
  post, 
  onMarkBestAnswer, 
  onReport, 
  onShare,
  showTopicInfo = false 
}: ForumPostProps) {
  const { user } = useAuth()
  const [showReactions, setShowReactions] = useState(false)

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString()
  }

  const parseContent = (content: string) => {
    // Parse mentions
    const mentionRegex = /@(\w+)/g
    let parsedContent = content.replace(mentionRegex, '<span class="mention">@$1</span>')

    // Parse URLs for rich media embeds
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const urls = content.match(urlRegex) || []

    return { parsedContent, urls }
  }

  const canMarkBestAnswer = () => {
    if (!post.topic) return false
    return user?.uid === post.topic.author.id || user?.role === 'admin'
  }

  const { parsedContent, urls } = parseContent(post.content)

  return (
    <Card className={`relative ${post.isBestAnswer ? 'border-green-200 bg-green-50' : ''} ${post.isPinned ? 'border-blue-200 bg-blue-50' : ''}`}>
      {/* Best Answer Badge */}
      {post.isBestAnswer && (
        <div className="absolute -top-2 -right-2 z-10">
          <Badge className="bg-green-500 text-white">
            <CheckCircle className="h-3 w-3 mr-1" />
            Best Answer
          </Badge>
        </div>
      )}

      {/* Pinned Badge */}
      {post.isPinned && (
        <div className="absolute -top-2 -left-2 z-10">
          <Badge className="bg-blue-500 text-white">
            <Pin className="h-3 w-3 mr-1" />
            Pinned
          </Badge>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>{post.author.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{post.author.username}</span>
                {post.author.role === 'admin' && (
                  <Badge variant="secondary" className="text-xs">
                    <Award className="h-3 w-3 mr-1" />
                    Admin
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{formatTimeAgo(post.createdAt)}</span>
                {post.isEdited && (
                  <>
                    <span>•</span>
                    <span>edited {formatTimeAgo(post.editedAt || '')}</span>
                  </>
                )}
                {post.viewCount && post.viewCount > 0 && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{post.viewCount}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {canMarkBestAnswer() && !post.isBestAnswer && (
                <DropdownMenuItem onClick={() => onMarkBestAnswer?.(post.id)}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Best Answer
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onShare?.(post.id)}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onReport?.(post.id, 'inappropriate_content')}
                className="text-red-600"
              >
                <Flag className="h-4 w-4 mr-2" />
                Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Topic Info */}
        {showTopicInfo && post.topic && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Topic:</span> {post.topic.title}
            </div>
          </div>
        )}

        {/* Post Content */}
        <div className="prose prose-sm max-w-none mb-4">
          <div 
            dangerouslySetInnerHTML={{ __html: parsedContent }}
            className="break-words"
          />
        </div>

        {/* Rich Media Embeds */}
        {urls.length > 0 && (
          <div className="space-y-3 mb-4">
            {urls.map((url, index) => (
              <RichMediaEmbed key={index} url={url} />
            ))}
          </div>
        )}

        {/* Attachments */}
        {post.attachments && post.attachments.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
            {post.attachments.map((attachment) => (
              <div key={attachment.id} className="relative group">
                {attachment.mime.startsWith('image/') ? (
                  <img
                    src={attachment.url}
                    alt="Attachment"
                    className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => window.open(attachment.url, '_blank')}
                  />
                ) : (
                  <div className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                    <FileText className="h-6 w-6 text-gray-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Reactions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <ForumReactionPicker
            postId={post.id}
            currentReactions={post.userReactions || []}
            onReactionChange={(reaction, counts) => {
              // Handle reaction change
              console.log('Reaction changed:', reaction, counts)
            }}
          />

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Button variant="ghost" size="sm" className="h-8 px-2">
              <MessageCircle className="h-4 w-4 mr-1" />
              Reply
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
