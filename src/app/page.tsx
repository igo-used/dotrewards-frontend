"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RewardModel } from "@/components/reward-model"
import { DailyClaimCard } from "@/components/daily-claim-card"
import { SocialShareCard } from "@/components/social-share-card"
import { UserStats } from "@/components/user-stats"
import { motion } from "framer-motion"

export default function Home() {
  const [user, setUser] = useState(null)
  const [dots, setDots] = useState(0)
  const [lastClaim, setLastClaim] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    // Initialize Telegram WebApp
    const tg = window.Telegram?.WebApp
    if (tg) {
      tg.expand()
      tg.ready()

      // Get user data from Telegram
      if (tg.initDataUnsafe?.user) {
        setUser(tg.initDataUnsafe.user)

        // Verify and authenticate with backend
        verifyTelegramUser(tg.initData)
          .then(() => fetchUserStats(tg.initDataUnsafe.user.id))
          .catch((err) => {
            console.error("Authentication failed:", err)
            setError("Authentication failed. Please try again.")
            setIsLoading(false)
          })
      } else {
        setError("Please open this app from Telegram")
        setIsLoading(false)
      }
    } else {
      setError("Telegram WebApp is not available")
      setIsLoading(false)
    }
  }, [])

  const verifyTelegramUser = async (initData) => {
    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ initData }),
      })

      if (!response.ok) {
        throw new Error("Verification failed")
      }

      return await response.json()
    } catch (error) {
      console.error("Failed to verify user:", error)
      throw error
    }
  }

  const fetchUserStats = async (userId) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/user/${userId}`)

      if (!response.ok) {
        throw new Error("Failed to fetch user data")
      }

      const data = await response.json()
      setDots(data.dots)
      setLastClaim(data.lastClaim)
    } catch (error) {
      console.error("Failed to fetch user stats:", error)
      setError("Failed to load your rewards data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClaimSuccess = () => {
    fetchUserStats(user.id)
  }

  if (error) {
    return (
      <div className="container max-w-md mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Error</h1>
        <p className="text-gray-400 mb-4">{error}</p>
        <Button
          className="bg-[#d1ff00] hover:bg-[#b8e600] text-black font-bold"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container max-w-md mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Loading...</h1>
        <div className="animate-spin text-[#d1ff00] text-4xl">⟳</div>
      </div>
    )
  }

  return (
    <main className="container max-w-md mx-auto p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold text-white text-center mb-2">DotRewards</h1>
        <p className="text-gray-400 text-center mb-6">Collect dots daily, earn real tokens!</p>

        <UserStats dots={dots} lastClaim={lastClaim} />

        <RewardModel />

        <Tabs defaultValue="daily" className="mt-6">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="daily">Daily Claim</TabsTrigger>
            <TabsTrigger value="social">Social Sharing</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="mt-0">
            <DailyClaimCard lastClaim={lastClaim} onClaim={handleClaimSuccess} />
          </TabsContent>

          <TabsContent value="social" className="mt-0">
            <SocialShareCard onClaim={handleClaimSuccess} />
          </TabsContent>
        </Tabs>
      </motion.div>
    </main>
  )
}

