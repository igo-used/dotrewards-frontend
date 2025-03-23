"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { CheckCircle, Clock } from "lucide-react"

export function DailyClaimCard({ lastClaim, onClaim }) {
  const [isLoading, setIsLoading] = useState(false)
  const [claimed, setClaimed] = useState(false)
  const [error, setError] = useState("")

  const canClaim = !lastClaim || new Date(lastClaim).getDate() !== new Date().getDate()

  const handleClaim = async () => {
    if (!canClaim) return

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          telegramId: window.Telegram?.WebApp?.initDataUnsafe?.user?.id,
          claimType: "daily",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to claim reward")
      }

      const data = await response.json()
      if (data.success) {
        setClaimed(true)
        setTimeout(() => {
          setClaimed(false)
        if (onClaim) {
  onClaim()
}, 2000)
      } else {
        setError(data.message || "Failed to claim reward")
      }
    } catch (error) {
      console.error("Failed to claim:", error)
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Daily Check-in</CardTitle>
        <CardDescription>Claim 10 dots every day by checking in</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center py-4">
          {canClaim ? (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="text-center">
              <div className="text-5xl font-bold text-white mb-2">10</div>
              <div className="text-sm text-gray-400">dots available</div>
            </motion.div>
          ) : (
            <div className="text-center">
              <Clock className="h-12 w-12 text-gray-500 mx-auto mb-2" />
              <div className="text-sm text-gray-400">Come back tomorrow</div>
              <div className="text-xs text-gray-500 mt-2">Next claim available at midnight</div>
            </div>
          )}
        </div>
        {error && <div className="text-red-500 text-sm text-center mt-2">{error}</div>}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-[#d1ff00] hover:bg-[#b8e600] text-black font-bold"
          disabled={!canClaim || isLoading || claimed}
          onClick={handleClaim}
        >
          {isLoading ? (
            <span className="flex items-center">
              <span className="animate-spin mr-2">⟳</span> Claiming...
            </span>
          ) : claimed ? (
            <span className="flex items-center">
              <CheckCircle className="mr-2 h-4 w-4" /> Claimed!
            </span>
          ) : (
            "Claim Daily Reward"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

