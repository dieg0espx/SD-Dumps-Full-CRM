"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { UserIcon, Mail, Phone, Building, Calendar, Shield, User, MapPin, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatPhoneNumber } from "@/lib/phone-utils"

interface UserManagerProps {
  users: any[]
}

export function UserManager({ users: initialUsers }: UserManagerProps) {
  const [users] = useState(initialUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState<any>(null)

  const filteredUsers = users.filter((user) => {
    const addressString = [
      user.street_address,
      user.city,
      user.state,
      user.zip_code
    ].filter(Boolean).join(" ").toLowerCase()
    
    const matchesSearch =
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      addressString.includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === "all" || user.role === roleFilter

    return matchesSearch && matchesRole
  })

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            User Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="search">Search Users</Label>
              <Input
                id="search"
                placeholder="Search by name, email, company, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-48 space-y-2">
              <Label htmlFor="role-filter">Filter by Role</Label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="client">Clients</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => setSelectedUser(user)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <UserIcon className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{user.full_name || "No name"}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="h-3 w-3" />
                            {formatPhoneNumber(user.phone)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.company ? (
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-gray-400" />
                          {user.company}
                        </div>
                      ) : (
                        <span className="text-gray-400">No company</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                        {user.role === "admin" ? (
                          <Shield className="h-3 w-3 mr-1" />
                        ) : (
                          <User className="h-3 w-3 mr-1" />
                        )}
                        {user.role || "client"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.bookingCount || 0} bookings</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-3 w-3" />
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <UserIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-lg">{selectedUser.full_name || "No name"}</div>
                  <Badge variant={selectedUser.role === "admin" ? "default" : "secondary"}>
                    {selectedUser.role === "admin" ? (
                      <Shield className="h-3 w-3 mr-1" />
                    ) : (
                      <User className="h-3 w-3 mr-1" />
                    )}
                    {selectedUser.role || "client"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Email</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{selectedUser.email}</span>
                  </div>
                </div>

                {selectedUser.phone && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Phone</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{formatPhoneNumber(selectedUser.phone)}</span>
                    </div>
                  </div>
                )}

                {selectedUser.company && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Company</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Building className="h-4 w-4 text-gray-400" />
                      <span>{selectedUser.company}</span>
                    </div>
                  </div>
                )}

                {(selectedUser.street_address || selectedUser.city || selectedUser.state || selectedUser.zip_code) && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Address</Label>
                    <div className="space-y-3 mt-1">
                      {selectedUser.street_address && (
                        <div>
                          <Label className="text-xs font-medium text-gray-400">Street Address</Label>
                          <div className="mt-1">
                            <span className="text-sm">{selectedUser.street_address}</span>
                          </div>
                        </div>
                      )}
                      
                      {(selectedUser.city || selectedUser.state || selectedUser.zip_code) && (
                        <div className="grid grid-cols-3 gap-3">
                          {selectedUser.city && (
                            <div>
                              <Label className="text-xs font-medium text-gray-400">City</Label>
                              <div className="mt-1">
                                <span className="text-sm">{selectedUser.city}</span>
                              </div>
                            </div>
                          )}
                          {selectedUser.state && (
                            <div>
                              <Label className="text-xs font-medium text-gray-400">State</Label>
                              <div className="mt-1">
                                <span className="text-sm">{selectedUser.state}</span>
                              </div>
                            </div>
                          )}
                          {selectedUser.zip_code && (
                            <div>
                              <Label className="text-xs font-medium text-gray-400">ZIP Code</Label>
                              <div className="mt-1">
                                <span className="text-sm">{selectedUser.zip_code}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      

                    </div>
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium text-gray-500">Member Since</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{new Date(selectedUser.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-500">Total Bookings</Label>
                  <div className="mt-1">
                    <Badge variant="outline">{selectedUser.bookingCount || 0} bookings</Badge>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t">
                <Label className="text-sm font-medium text-gray-500 mb-3 block">Quick Actions</Label>
                <div className="grid grid-cols-3 gap-2">
                  {selectedUser.phone && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`tel:${selectedUser.phone}`, '_self')}
                      className="flex items-center gap-2"
                    >
                      <Phone className="h-4 w-4" />
                      Call
                    </Button>
                  )}
                  {selectedUser.phone && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`sms:${selectedUser.phone}`, '_self')}
                      className="flex items-center gap-2"
                    >
                      <MessageSquare className="h-4 w-4" />
                      SMS
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`mailto:${selectedUser.email}`, '_self')}
                    className="flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    Email
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
