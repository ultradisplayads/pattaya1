"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserMentionInput } from "./user-mention-input"
import { useAuth } from "@/components/auth/auth-provider"
import { Plus, Send, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ForumCategory {
  id: string
  name: string
  description?: string
  icon?: string
  color?: string
}

interface CreateTopicModalProps {
  isOpen: boolean
  onClose: () => void
  categories: ForumCategory[]
  onTopicCreated?: (topic: any) => void
}

export function CreateTopicModal({ isOpen, onClose, categories, onTopicCreated }: CreateTopicModalProps) {
  const { user, firebaseUser } = useAuth()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !content.trim() || !selectedCategory) {
      setError("Please fill in all required fields")
      return
    }

    if (!user) {
      setError("Please log in to create a topic")
      return
    }

    setLoading(true)
    setError("")

    try {
      console.log('🔥 Creating topic - user:', user)
      console.log('🔥 Creating topic - firebaseUser:', firebaseUser)
      
      // Get Firebase token
      const firebaseToken = firebaseUser ? await firebaseUser.getIdToken() : null
      console.log('🔥 Firebase token:', firebaseToken ? 'Present' : 'Missing')
      
      if (!firebaseToken) {
        setError("Authentication token not available")
        return
      }

      const response = await fetch("/api/forum/topics/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${firebaseToken}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          category: selectedCategory,
          // Don't send author - let the backend set it from the authenticated user
        }),
      })

      console.log('🔥 Response status:', response.status)
      console.log('🔥 Response headers:', Object.fromEntries(response.headers.entries()))
      
      if (!response.ok) {
        let errorData
        try {
          errorData = await response.json()
        } catch (parseError) {
          console.error('🔥 Failed to parse error response as JSON:', parseError)
          const textResponse = await response.text()
          console.error('🔥 Raw error response:', textResponse)
          throw new Error(`Server error: ${response.status} ${response.statusText}`)
        }
        throw new Error(errorData.error || "Failed to create topic")
      }

      const data = await response.json()
      console.log('🔥 Topic created successfully:', data)
      
      // Reset form
      setTitle("")
      setContent("")
      setSelectedCategory("")
      
      // Notify parent component
      onTopicCreated?.(data.data)
      
      // Close modal
      onClose()
      
    } catch (error: any) {
      setError(error.message || "Failed to create topic")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setTitle("")
    setContent("")
    setSelectedCategory("")
    setError("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Topic
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Topic Title *
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a descriptive title for your topic..."
              maxLength={255}
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))
                ) : (
                  <>
                    <SelectItem value="General Discussion">General Discussion</SelectItem>
                    <SelectItem value="Visas & Immigration">Visas & Immigration</SelectItem>
                    <SelectItem value="Nightlife & Entertainment">Nightlife & Entertainment</SelectItem>
                    <SelectItem value="Restaurants & Food">Restaurants & Food</SelectItem>
                    <SelectItem value="Accommodation">Accommodation</SelectItem>
                    <SelectItem value="Transportation">Transportation</SelectItem>
                    <SelectItem value="Business & Work">Business & Work</SelectItem>
                    <SelectItem value="Health & Medical">Health & Medical</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
            {categories.length === 0 && (
              <p className="text-sm text-gray-500 mt-1">
                Using default categories. Categories will be loaded from the database once configured.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Content *
            </label>
            <UserMentionInput
              value={content}
              onChange={setContent}
              placeholder="Share your thoughts, ask questions, or start a discussion..."
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                "Creating..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Create Topic
                </>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
