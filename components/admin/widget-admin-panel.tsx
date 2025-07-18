"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, Save, X, Key, Rss, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface WidgetConfig {
  id: string
  type: string
  name: string
  description: string
  size: "small" | "medium" | "large" | "hero"
  position: number
  visible: boolean
  config: {
    apiKeys?: Record<string, string>
    rssFeeds?: string[]
    advertisements?: {
      enabled: boolean
      slots: number
      content: string[]
    }
    customContent?: string
    refreshInterval?: number
    theme?: string
  }
}

interface WidgetAdminPanelProps {
  widgets: WidgetConfig[]
  onUpdateWidget: (widget: WidgetConfig) => void
  onDeleteWidget: (widgetId: string) => void
  onAddWidget: (widget: Omit<WidgetConfig, "id">) => void
  userRole: "admin" | "business" | "user"
}

export function WidgetAdminPanel({
  widgets,
  onUpdateWidget,
  onDeleteWidget,
  onAddWidget,
  userRole,
}: WidgetAdminPanelProps) {
  const [selectedWidget, setSelectedWidget] = useState<WidgetConfig | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<WidgetConfig | null>(null)

  const widgetTypes = [
    { value: "weather", label: "Weather Widget" },
    { value: "news", label: "News Feed" },
    { value: "events", label: "Events Calendar" },
    { value: "social", label: "Social Feed" },
    { value: "business", label: "Business Spotlight" },
    { value: "deals", label: "Deals & Offers" },
    { value: "traffic", label: "Traffic Info" },
    { value: "reviews", label: "Reviews" },
  ]

  const handleEditWidget = (widget: WidgetConfig) => {
    setSelectedWidget(widget)
    setEditForm({ ...widget })
    setIsEditing(true)
  }

  const handleSaveWidget = () => {
    if (editForm) {
      onUpdateWidget(editForm)
      setIsEditing(false)
      setSelectedWidget(null)
      setEditForm(null)
    }
  }

  const handleAddNewWidget = () => {
    const newWidget: Omit<WidgetConfig, "id"> = {
      type: "weather",
      name: "New Widget",
      description: "Widget description",
      size: "medium",
      position: widgets.length,
      visible: true,
      config: {
        apiKeys: {},
        rssFeeds: [],
        advertisements: {
          enabled: false,
          slots: 0,
          content: [],
        },
        refreshInterval: 300000, // 5 minutes
      },
    }
    onAddWidget(newWidget)
  }

  const canEditWidget = (widget: WidgetConfig) => {
    if (userRole === "admin") return true
    if (userRole === "business" && widget.type === "business") return true
    return false
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Widget Management</h2>
        {userRole === "admin" && (
          <Button onClick={handleAddNewWidget}>
            <Plus className="w-4 h-4 mr-2" />
            Add Widget
          </Button>
        )}
      </div>

      {/* Widget List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((widget) => (
          <Card key={widget.id} className="relative">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{widget.name}</CardTitle>
                <div className="flex space-x-1">
                  {canEditWidget(widget) && (
                    <Button variant="ghost" size="sm" onClick={() => handleEditWidget(widget)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                  {userRole === "admin" && (
                    <Button variant="ghost" size="sm" onClick={() => onDeleteWidget(widget.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">{widget.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Type: {widget.type}</span>
                <span>Size: {widget.size}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span
                  className={`text-xs px-2 py-1 rounded ${widget.visible ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {widget.visible ? "Visible" : "Hidden"}
                </span>
                <span className="text-xs text-gray-500">Position: {widget.position}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Widget Modal */}
      {isEditing && editForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Edit Widget: {editForm.name}</h3>
              <Button variant="ghost" onClick={() => setIsEditing(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <Tabs defaultValue="general" className="space-y-4">
              <TabsList>
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="api-keys">API Keys</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="ads">Advertisements</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Widget Name</Label>
                    <Input
                      id="name"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Widget Type</Label>
                    <Select value={editForm.type} onValueChange={(value) => setEditForm({ ...editForm, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {widgetTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="size">Size</Label>
                    <Select
                      value={editForm.size}
                      onValueChange={(value: "small" | "medium" | "large" | "hero") =>
                        setEditForm({ ...editForm, size: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                        <SelectItem value="hero">Hero</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      type="number"
                      value={editForm.position}
                      onChange={(e) => setEditForm({ ...editForm, position: Number.parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={editForm.visible}
                      onCheckedChange={(checked) => setEditForm({ ...editForm, visible: checked })}
                    />
                    <Label>Visible</Label>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="api-keys" className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Key className="w-4 h-4" />
                  <h4 className="font-semibold">API Keys Configuration</h4>
                </div>

                <div className="space-y-3">
                  {Object.entries(editForm.config.apiKeys || {}).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Label className="w-32">{key}:</Label>
                      <Input
                        type="password"
                        value={value}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            config: {
                              ...editForm.config,
                              apiKeys: { ...editForm.config.apiKeys, [key]: e.target.value },
                            },
                          })
                        }
                      />
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    onClick={() => {
                      const keyName = prompt("Enter API key name:")
                      if (keyName) {
                        setEditForm({
                          ...editForm,
                          config: {
                            ...editForm.config,
                            apiKeys: { ...editForm.config.apiKeys, [keyName]: "" },
                          },
                        })
                      }
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add API Key
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Rss className="w-4 h-4" />
                  <h4 className="font-semibold">Content Configuration</h4>
                </div>

                <div>
                  <Label htmlFor="custom-content">Custom Content</Label>
                  <Textarea
                    id="custom-content"
                    value={editForm.config.customContent || ""}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        config: { ...editForm.config, customContent: e.target.value },
                      })
                    }
                    rows={4}
                  />
                </div>

                <div>
                  <Label>RSS Feeds</Label>
                  <div className="space-y-2">
                    {(editForm.config.rssFeeds || []).map((feed, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={feed}
                          onChange={(e) => {
                            const newFeeds = [...(editForm.config.rssFeeds || [])]
                            newFeeds[index] = e.target.value
                            setEditForm({
                              ...editForm,
                              config: { ...editForm.config, rssFeeds: newFeeds },
                            })
                          }}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newFeeds = (editForm.config.rssFeeds || []).filter((_, i) => i !== index)
                            setEditForm({
                              ...editForm,
                              config: { ...editForm.config, rssFeeds: newFeeds },
                            })
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditForm({
                          ...editForm,
                          config: {
                            ...editForm.config,
                            rssFeeds: [...(editForm.config.rssFeeds || []), ""],
                          },
                        })
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add RSS Feed
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="refresh-interval">Refresh Interval (ms)</Label>
                  <Input
                    id="refresh-interval"
                    type="number"
                    value={editForm.config.refreshInterval || 300000}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        config: { ...editForm.config, refreshInterval: Number.parseInt(e.target.value) },
                      })
                    }
                  />
                </div>
              </TabsContent>

              <TabsContent value="ads" className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <DollarSign className="w-4 h-4" />
                  <h4 className="font-semibold">Advertisement Configuration</h4>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={editForm.config.advertisements?.enabled || false}
                    onCheckedChange={(checked) =>
                      setEditForm({
                        ...editForm,
                        config: {
                          ...editForm.config,
                          advertisements: { ...editForm.config.advertisements, enabled: checked },
                        },
                      })
                    }
                  />
                  <Label>Enable Advertisements</Label>
                </div>

                {editForm.config.advertisements?.enabled && (
                  <>
                    <div>
                      <Label htmlFor="ad-slots">Number of Ad Slots</Label>
                      <Input
                        id="ad-slots"
                        type="number"
                        value={editForm.config.advertisements?.slots || 0}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            config: {
                              ...editForm.config,
                              advertisements: {
                                ...editForm.config.advertisements,
                                slots: Number.parseInt(e.target.value),
                              },
                            },
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label>Advertisement Content</Label>
                      <div className="space-y-2">
                        {(editForm.config.advertisements?.content || []).map((content, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Textarea
                              value={content}
                              onChange={(e) => {
                                const newContent = [...(editForm.config.advertisements?.content || [])]
                                newContent[index] = e.target.value
                                setEditForm({
                                  ...editForm,
                                  config: {
                                    ...editForm.config,
                                    advertisements: {
                                      ...editForm.config.advertisements,
                                      content: newContent,
                                    },
                                  },
                                })
                              }}
                              rows={2}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newContent = (editForm.config.advertisements?.content || []).filter(
                                  (_, i) => i !== index,
                                )
                                setEditForm({
                                  ...editForm,
                                  config: {
                                    ...editForm.config,
                                    advertisements: {
                                      ...editForm.config.advertisements,
                                      content: newContent,
                                    },
                                  },
                                })
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditForm({
                              ...editForm,
                              config: {
                                ...editForm.config,
                                advertisements: {
                                  ...editForm.config.advertisements,
                                  content: [...(editForm.config.advertisements?.content || []), ""],
                                },
                              },
                            })
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Advertisement
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveWidget}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
