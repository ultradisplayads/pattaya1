"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Camera, Upload, MapPin, Hash, X, Check, AlertCircle, Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { buildApiUrl } from "@/lib/strapi-config"
import { useRouter } from "next/navigation"

interface UploadedFile {
  file: File
  preview: string
  id: string
}

interface LocationData {
  latitude: number
  longitude: number
  address?: string
  city?: string
  country: string
}

export default function PhotoUploadPage() {
  const { user, getStrapiToken } = useAuth()
  const router = useRouter()
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [caption, setCaption] = useState("")
  const [hashtags, setHashtags] = useState<string[]>([])
  const [newHashtag, setNewHashtag] = useState("")
  const [location, setLocation] = useState<LocationData | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
    }))
    setFiles(prev => [...prev, ...newFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.heic']
    },
    multiple: true
  })

  const removeFile = (id: string) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id)
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview)
      }
      return prev.filter(f => f.id !== id)
    })
  }

  const addHashtag = () => {
    if (newHashtag.trim() && !hashtags.includes(newHashtag.trim())) {
      setHashtags(prev => [...prev, newHashtag.trim()])
      setNewHashtag("")
    }
  }

  const removeHashtag = (hashtag: string) => {
    setHashtags(prev => prev.filter(h => h !== hashtag))
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser")
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          country: "Thailand"
        })
      },
      (error) => {
        setError("Unable to retrieve your location")
        console.error("Geolocation error:", error)
      }
    )
  }

  const uploadPhotos = async () => {
    if (!user) {
      setError("You must be logged in to upload photos")
      return
    }

    if (files.length === 0) {
      setError("Please select at least one photo to upload")
      return
    }

    setUploading(true)
    setError("")
    setUploadProgress(0)

    try {
      // For now, allow uploads without authentication
      // TODO: Implement proper authentication later
      const token = getStrapiToken()
      console.log("Auth token:", token ? "Found" : "Not found - proceeding without auth")

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        // Convert file to base64 for direct upload
        const base64Image = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(file.file)
        })

        // Create hashtags (simplified - skip if errors)
        const hashtagIds = []
        try {
          for (const hashtagName of hashtags) {
            const hashtagHeaders: Record<string, string> = {
              'Content-Type': 'application/json'
            }
            if (token) {
              hashtagHeaders['Authorization'] = `Bearer ${token}`
            }

            const hashtagResponse = await fetch(buildApiUrl('hashtags/create-or-find'), {
              method: 'POST',
              headers: hashtagHeaders,
              body: JSON.stringify({ name: hashtagName })
            })

            if (hashtagResponse.ok) {
              const hashtagData = await hashtagResponse.json()
              hashtagIds.push(hashtagData.data.id)
            } else {
              console.warn(`Failed to create hashtag: ${hashtagName}`)
            }
          }
        } catch (hashtagError) {
          console.warn('Hashtag creation failed, continuing without hashtags:', hashtagError)
        }

        // Create photo record
        const photoData = {
          image: base64Image, // Use base64 image directly
          caption: caption || null,
          hashtags: hashtagIds,
          location: location || {
            latitude: 12.9236,
            longitude: 100.8825,
            address: "Pattaya, Thailand",
            city: "Pattaya",
            country: "Thailand"
          },
          uploaded_at: new Date().toISOString()
        }

        const photoHeaders: Record<string, string> = {
          'Content-Type': 'application/json'
        }
        if (token) {
          photoHeaders['Authorization'] = `Bearer ${token}`
        }

        const photoResponse = await fetch(buildApiUrl('photos'), {
          method: 'POST',
          headers: photoHeaders,
          body: JSON.stringify({ data: photoData })
        })

        if (!photoResponse.ok) {
          throw new Error(`Failed to create photo record for: ${file.file.name}`)
        }

        setUploadProgress(((i + 1) / files.length) * 100)
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/photos')
      }, 3000)

    } catch (error) {
      console.error('Upload error:', error)
      setError(error instanceof Error ? error.message : 'Failed to upload photos')
    } finally {
      setUploading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Login Required</h2>
            <p className="text-gray-600 mb-4">You need to be logged in to upload photos.</p>
            <Button onClick={() => router.push('/auth/login')}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Camera className="w-8 h-8 mr-3 text-blue-500" />
            Upload Photos
          </h1>
          <p className="text-gray-600 mt-2">Share your Pattaya moments with the community</p>
        </div>

        {success && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-600 mr-2" />
                <div>
                  <span className="text-green-800 font-medium">Photos uploaded successfully!</span>
                  <p className="text-green-700 text-sm mt-1">Your photos are now live in the gallery!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                <span className="text-red-800">{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>Select Photos</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                {isDragActive ? (
                  <p className="text-blue-600">Drop the photos here...</p>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-2">Drag & drop photos here, or click to select</p>
                    <p className="text-sm text-gray-500">Supports JPG, PNG, HEIC formats</p>
                  </div>
                )}
              </div>

              {files.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Selected Photos ({files.length})</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {files.map((file) => (
                      <div key={file.id} className="relative">
                        <img
                          src={file.preview}
                          alt={file.file.name}
                          className="w-full h-24 object-cover rounded"
                        />
                        <button
                          onClick={() => removeFile(file.id)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Details Section */}
          <Card>
            <CardHeader>
              <CardTitle>Photo Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Caption */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Caption (Optional)
                </label>
                <Textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Describe your photo..."
                  rows={3}
                />
              </div>

              {/* Hashtags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hashtags
                </label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newHashtag}
                    onChange={(e) => setNewHashtag(e.target.value)}
                    placeholder="Add hashtag..."
                    onKeyPress={(e) => e.key === 'Enter' && addHashtag()}
                  />
                  <Button onClick={addHashtag} size="sm">
                    <Hash className="w-4 h-4" />
                  </Button>
                </div>
                {hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {hashtags.map((hashtag) => (
                      <Badge key={hashtag} variant="secondary" className="flex items-center gap-1">
                        #{hashtag}
                        <button
                          onClick={() => removeHashtag(hashtag)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="space-y-2">
                  <Button
                    onClick={getCurrentLocation}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Use Current Location
                  </Button>
                  {location && (
                    <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      <p>Lat: {location.latitude.toFixed(6)}</p>
                      <p>Lng: {location.longitude.toFixed(6)}</p>
                      {location.address && <p>Address: {location.address}</p>}
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Progress */}
              {uploading && (
                <div>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                    <span>Uploading...</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Upload Button */}
              <Button
                onClick={uploadPhotos}
                disabled={uploading || files.length === 0}
                className="w-full"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload {files.length} Photo{files.length !== 1 ? 's' : ''}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
