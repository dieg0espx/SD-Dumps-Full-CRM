"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2 } from "lucide-react"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ContainerType {
  id: string
  name: string
  size: string
  description: string | null
  price_per_day: number
  available_quantity: number
}

interface InventoryManagerProps {
  containerTypes: ContainerType[]
}

export function InventoryManager({ containerTypes: initialContainerTypes }: InventoryManagerProps) {
  const [containerTypes, setContainerTypes] = useState(initialContainerTypes)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingContainer, setEditingContainer] = useState<ContainerType | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Form state
  const [name, setName] = useState("")
  const [size, setSize] = useState("")
  const [description, setDescription] = useState("")
  const [pricePerDay, setPricePerDay] = useState("")
  const [availableQuantity, setAvailableQuantity] = useState("")

  const supabase = createClient()

  const resetForm = () => {
    setName("")
    setSize("")
    setDescription("")
    setPricePerDay("")
    setAvailableQuantity("")
    setEditingContainer(null)
  }

  const openEditDialog = (container: ContainerType) => {
    setEditingContainer(container)
    setName(container.name)
    setSize(container.size)
    setDescription(container.description || "")
    setPricePerDay(container.price_per_day.toString())
    setAvailableQuantity(container.available_quantity.toString())
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const containerData = {
        name: name.trim(),
        size: size.trim(),
        description: description.trim() || null,
        price_per_day: Number.parseFloat(pricePerDay),
        available_quantity: Number.parseInt(availableQuantity),
      }

      if (editingContainer) {
        // Update existing container
        const { data, error } = await supabase
          .from("container_types")
          .update(containerData)
          .eq("id", editingContainer.id)
          .select()
          .single()

        if (error) throw error

        setContainerTypes((prev) => prev.map((ct) => (ct.id === editingContainer.id ? data : ct)))
      } else {
        // Create new container
        const { data, error } = await supabase.from("container_types").insert(containerData).select().single()

        if (error) throw error

        setContainerTypes((prev) => [...prev, data])
      }

      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error saving container:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this container type?")) return

    try {
      const { error } = await supabase.from("container_types").delete().eq("id", id)

      if (error) throw error

      setContainerTypes((prev) => prev.filter((ct) => ct.id !== id))
    } catch (error) {
      console.error("Error deleting container:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Container Types</h2>
          <p className="text-gray-600">Manage your container inventory</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Container Type
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingContainer ? "Edit Container Type" : "Add Container Type"}</DialogTitle>
              <DialogDescription>
                {editingContainer ? "Update the container type details" : "Create a new container type for rental"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Small Dumpster"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="size">Size</Label>
                <Input
                  id="size"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  placeholder="e.g., 10 Yard"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the container"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pricePerDay">Price per Day ($)</Label>
                  <Input
                    id="pricePerDay"
                    type="number"
                    step="0.01"
                    value={pricePerDay}
                    onChange={(e) => setPricePerDay(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="availableQuantity">Available Quantity</Label>
                  <Input
                    id="availableQuantity"
                    type="number"
                    value={availableQuantity}
                    onChange={(e) => setAvailableQuantity(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : editingContainer ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {containerTypes.map((container) => (
          <Card key={container.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    {container.name} - {container.size}
                  </CardTitle>
                  <CardDescription>{container.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(container)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(container.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Price per Day</p>
                    <p className="font-semibold">{formatCurrency(container.price_per_day)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Available</p>
                    <Badge variant={container.available_quantity > 0 ? "default" : "destructive"}>
                      {container.available_quantity} units
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
