'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getFirestore, doc, getDoc } from "firebase/firestore"
import { toast } from "react-toastify"
import { Clock } from "lucide-react"

const CountdownPage = () => {
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [countdown, setCountdown] = useState<string>("Loading...")
  const [loading, setLoading] = useState<boolean>(true)

  const db = getFirestore()
  const settingsDocRef = doc(db, "Settings", "ApplicationLimits")

  useEffect(() => {
    const fetchStartTime = async () => {
      try {
        const docSnapshot = await getDoc(settingsDocRef)
        if (docSnapshot.exists()) {
          const data = docSnapshot.data()
          const fetchedStartTime = data.startDateTime
          if (fetchedStartTime) {
            setStartTime(new Date(fetchedStartTime))
          } else {
            toast.error("Start time not found in settings.")
          }
        }
      } catch (error) {
        console.error("Error fetching start time:", error)
        toast.error("Failed to fetch start time.")
      } finally {
        setLoading(false)
      }
    }

    fetchStartTime()
  }, [])

  useEffect(() => {
    if (startTime) {
      const interval = setInterval(() => {
        const now = new Date()
        const diff = startTime.getTime() - now.getTime()

        if (diff <= 0) {
          setCountdown("Applications are now open!")
          clearInterval(interval)
          return
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)

        setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`)
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [startTime])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="flex flex-col items-center">
          {/* Logo Section */}
          <img
            src="/hit_logo.png"
            alt="Logo"
            className="h-16 w-auto mb-4"
          />
          <CardTitle className="text-3xl font-bold flex items-center gap-2">
            <Clock className="w-8 h-8" />
            Application Countdown
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8 space-y-4">
          {startTime ? (
            <>
              <p className="text-lg">
                Applications will start on:{" "}
                <span className="font-bold">
                  {startTime.toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </p>
              <p className="text-4xl font-bold">{countdown}</p>
            </>
          ) : (
            <p className="text-lg">Start time is not set in the system.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default CountdownPage
