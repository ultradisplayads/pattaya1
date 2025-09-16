"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { UserMentionInput } from "./user-mention-input"
import { useAuth } from "@/components/auth/auth-provider"
import { Send, MessageCircle } from "lucide-react"

interface CreatePostFormProps {
  topicId: string
  parentPostId?: string
  onPostCreated?: (post: any) => void
  onCancel?: () => void
  placeholder?: string
  compact?: boolean
}

export function CreatePostForm({ 
  topicId, 
  parentPostId, 
  onPostCreated, 
  onCancel, 
  placeholder = "Write a reply...",
  compact = false 
}: CreatePostFormProps) {
  const { user, firebaseUser } = useAuth()
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!content.trim()) {
      setError("Please enter some content")
      return
    }

    if (!user) {
      setError("Please log in to post a reply")
      return
    }

    setLoading(true)
    setError("")

    try {
      // Get Firebase token
      const firebaseToken = firebaseUser ? await firebaseUser.getIdToken() : null
      
      if (!firebaseToken) {
        setError("Authentication token not available")
        return
      }

      const response = await fetch("/api/forum/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${firebaseToken}`,
        },
        body: JSON.stringify({
          content: content.trim(),
          topic: topicId,
          author: user.uid,
          parentPost: parentPostId || null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create post")
      }

      const data = await response.json()
      
      // Reset form
      setContent("")
      
      // Notify parent component
      onPostCreated?.(data.data)
      
    } catch (error: any) {
      setError(error.message || "Failed to create post")
    } finally {
      setLoading(false)
    }
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="space-y-2">
        {error && (
          <div className="p-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded">
            {error}
          </div>
        )}
        
        <UserMentionInput
          value={content}
          onChange={setContent}
          placeholder={placeholder}
        />
        
        <div className="flex gap-2">
          <Button type="submit" size="sm" disabled={loading}>
            {loading ? "Posting..." : (
              <>
                <Send className="h-3 w-3 mr-1" />
                Reply
              </>
            )}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" size="sm" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    )
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MessageCircle className="h-4 w-4 inline mr-1" />
              Your Reply
            </label>
            <UserMentionInput
              value={content}
              onChange={setContent}
              placeholder={placeholder}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Posting..." : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Post Reply
                </>
              )}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
