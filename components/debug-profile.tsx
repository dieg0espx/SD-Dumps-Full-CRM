"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DebugProfile() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const fetchProfile = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        console.log("🔍 Current user:", user)
        
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()
        
        console.log("🔍 Profile query result:", { profile, error })
        setProfile(profile)
      }
    } catch (error) {
      console.error("🔍 Error fetching profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const addTestAddress = async () => {
    if (!profile) return
    
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({ 
          address: "123 Test Street, San Diego, CA 92101",
          updated_at: new Date().toISOString()
        })
        .eq("id", profile.id)
        .select()
      
      console.log("🔍 Update result:", { data, error })
      if (data) {
        setProfile(data[0])
      }
    } catch (error) {
      console.error("🔍 Error updating profile:", error)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Debug Profile Data</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button onClick={fetchProfile} disabled={loading}>
            {loading ? "Loading..." : "Refresh Profile"}
          </Button>
          
          <Button onClick={addTestAddress} disabled={!profile}>
            Add Test Address
          </Button>
          
          <div className="bg-gray-100 p-4 rounded">
            <h4 className="font-semibold mb-2">Profile Data:</h4>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(profile, null, 2)}
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
