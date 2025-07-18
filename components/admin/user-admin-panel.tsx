"use client"

import { useState } from "react"
import { Users, Shield, Eye, EyeOff, Edit, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

interface User {
  id: string
  email: string
  name: string
  role: "admin" | "business" | "user"
  verified: boolean
  active: boolean
  createdAt: string
  lastLogin: string
  businessId?: string
}

interface UserAdminPanelProps {
  users: User[]
  onUpdateUser: (user: User) => void
  onDeleteUser: (userId: string) => void
  onAddUser: (user: Omit<User, "id">) => void
  currentUserRole: "admin" | "business" | "user"
}

export function UserAdminPanel({ users, onUpdateUser, onDeleteUser, onAddUser, currentUserRole }: UserAdminPanelProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const canEditUser = (user: User) => {
    if (currentUserRole === "admin") return true
    if (currentUserRole === "business" && user.role === "user" && user.businessId) return true
    return false
  }

  const handleEditUser = (user: User) => {
    setSelectedUser({ ...user })
    setIsEditing(true)
  }

  const handleSaveUser = () => {
    if (selectedUser) {
      onUpdateUser(selectedUser)
      setIsEditing(false)
      setSelectedUser(null)
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "business":
        return "bg-blue-100 text-blue-800"
      case "user":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="w-6 h-6" />
          <h2 className="text-2xl font-bold">User Management</h2>
        </div>
        {currentUserRole === "admin" && (
          <Button onClick={() => setIsEditing(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <div className="flex-1">
          <Input placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="business">Business</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* User List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{user.name}</CardTitle>
                <div className="flex space-x-1">
                  {canEditUser(user) && (
                    <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                  {currentUserRole === "admin" && (
                    <Button variant="ghost" size="sm" onClick={() => onDeleteUser(user.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">{user.email}</p>
              <div className="flex items-center justify-between mb-2">
                <Badge className={getRoleBadgeColor(user.role)}>{user.role}</Badge>
                <div className="flex items-center space-x-2">
                  {user.verified ? (
                    <Shield className="w-4 h-4 text-green-500" />
                  ) : (
                    <Shield className="w-4 h-4 text-gray-400" />
                  )}
                  {user.active ? (
                    <Eye className="w-4 h-4 text-green-500" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-red-500" />
                  )}
                </div>
              </div>
              <div className="text-xs text-gray-500">
                <p>Created: {new Date(user.createdAt).toLocaleDateString()}</p>
                <p>Last Login: {new Date(user.lastLogin).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit User Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">{selectedUser ? "Edit User" : "Add New User"}</h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={selectedUser?.name || ""}
                  onChange={(e) => setSelectedUser((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={selectedUser?.email || ""}
                  onChange={(e) => setSelectedUser((prev) => (prev ? { ...prev, email: e.target.value } : null))}
                />
              </div>

              {currentUserRole === "admin" && (
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={selectedUser?.role || "user"}
                    onValueChange={(value: "admin" | "business" | "user") =>
                      setSelectedUser((prev) => (prev ? { ...prev, role: value } : null))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={selectedUser?.verified || false}
                    onCheckedChange={(checked) =>
                      setSelectedUser((prev) => (prev ? { ...prev, verified: checked } : null))
                    }
                  />
                  <Label>Verified</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={selectedUser?.active || false}
                    onCheckedChange={(checked) =>
                      setSelectedUser((prev) => (prev ? { ...prev, active: checked } : null))
                    }
                  />
                  <Label>Active</Label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveUser}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
