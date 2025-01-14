'use client'

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore"
import { UserIcon as Male, UserIcon as Female, CheckCircle, SettingsIcon } from 'lucide-react'

const Settings = () => {
  const [boyLimit, setBoyLimit] = useState<number>(0)
  const [girlLimit, setGirlLimit] = useState<number>(0)
  const [autoAcceptBoysLimit, setAutoAcceptBoysLimit] = useState<number>(0)
  const [autoAcceptGirlsLimit, setAutoAcceptGirlsLimit] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [saving, setSaving] = useState<boolean>(false)

  const db = getFirestore()
  const settingsDocRef = doc(db, "Settings", "ApplicationLimits")

  useEffect(() => {
    const fetchLimits = async () => {
      try {
        const docSnapshot = await getDoc(settingsDocRef)
        if (docSnapshot.exists()) {
          const data = docSnapshot.data()
          setBoyLimit(data.boyLimit || 0)
          setGirlLimit(data.girlLimit || 0)
          setAutoAcceptBoysLimit(data.autoAcceptBoysLimit || 0)
          setAutoAcceptGirlsLimit(data.autoAcceptGirlsLimit || 0)
        }
      } catch (error) {
        console.error("Error fetching settings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLimits()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await setDoc(settingsDocRef, {
        boyLimit,
        girlLimit,
        autoAcceptBoysLimit,
        autoAcceptGirlsLimit,
      })
      alert("Settings saved successfully!")
    } catch (error) {
      console.error("Error saving settings:", error)
      alert("Failed to save settings. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="h-screen flex items-center justify-center">
  
    <Card className="w-full  max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <SettingsIcon className="w-6 h-6" />
          Application Limits
        </CardTitle>
        <CardDescription>Set the limits for applications and auto-acceptance.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">General Limits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="boyLimit" className="flex items-center gap-2">
                <Male className="w-4 h-4" />
                Boys Limit
              </Label>
              <Input
                id="boyLimit"
                type="number"
                value={boyLimit}
                onChange={(e) => setBoyLimit(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="girlLimit" className="flex items-center gap-2">
                <Female className="w-4 h-4" />
                Girls Limit
              </Label>
              <Input
                id="girlLimit"
                type="number"
                value={girlLimit}
                onChange={(e) => setGirlLimit(Number(e.target.value))}
              />
            </div>
          </div>
        </div>
        <Separator />
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Auto-Accept Limits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="autoAcceptBoysLimit" className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Auto-Accept Boys
              </Label>
              <Input
                id="autoAcceptBoysLimit"
                type="number"
                value={autoAcceptBoysLimit}
                onChange={(e) => setAutoAcceptBoysLimit(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="autoAcceptGirlsLimit" className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Auto-Accept Girls
              </Label>
              <Input
                id="autoAcceptGirlsLimit"
                type="number"
                value={autoAcceptGirlsLimit}
                onChange={(e) => setAutoAcceptGirlsLimit(Number(e.target.value))}
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full"
        >
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </CardFooter>
    </Card>
    </div>
  )
}

export default Settings

