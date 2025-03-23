"use client"

import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Coins } from "lucide-react"

export function UserStats({ dots, lastClaim }) {
  const formatDate = (dateString) => {
    if (!dateString) return "Never"
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Your Balance</p>
              <div className="flex items-center">
                <h2 className="text-2xl font-bold text-white">{dots || 0}</h2>
                <span className="ml-1 text-sm text-gray-400">dots</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Last claim: {formatDate(lastClaim)}</p>
            </div>
            <div className="bg-[#d1ff00] p-3 rounded-full">
              <Coins className="h-6 w-6 text-black" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-800">
            <p className="text-xs text-gray-400">
              Collect dots daily and by sharing our profiles.
              <span className="text-[#d1ff00]">1000 dots = 1 token</span> when you redeem.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

