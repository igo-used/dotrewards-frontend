"use client"

import React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Instagram, Twitter, MessageCircle, Globe, CheckCircle } from 'lucide-react'
import "@/types/telegram"

interface SocialShareCardProps {
  onClaim: () => void;
}

interface Platform {
  id: string;
  name: string;
  icon: React.ReactNode;
  dots: number;
  action: string;
  url: string;
}

export function SocialShareCard({ onClaim }: SocialShareCardProps) {
  const [sharing, setSharing] = useState(false)
  const [currentPlatform, setCurrentPlatform] = useState<string | null>(null)
  const [claimedPlatforms, setClaimedPlatforms] = useState<string[]>([])
  const [error, setError] = useState("")
  
  const socialPlatforms: Platform[] = [
    { 
      id: "instagram",
      name: "Instagram", 
      icon: <Instagram className="h-5 w-5" />, 
      dots: 15,
      action: "Post to Story",
      url: "https://instagram.com/yourprofile"
    },
    { 
      id: "twitter",
      name: "X (Twitter)", 
      icon: <Twitter className="h-5 w-5" />, 
      dots: 20,
      action: "Share Profile",
      url: "https://twitter.com/yourprofile"
    },
    { 
      id: "telegram",
      name: "Telegram", 
      icon: <MessageCircle className="h-5 w-5" />, 
      dots: 15,
      action: "Share Channel",
      url: "https://t.me/yourchannel"
    },
    { 
      id: "website",
      name: "Website", 
      icon: <Globe className="h-5 w-5" />, 
      dots: 20,
      action: "Share Link",
      url: "https://yourwebsite.com"
    }
  ]
  
  const handleShare = async (platform: Platform) => {
    setSharing(true)
    setCurrentPlatform(platform.id)
    setError("")
    
    try {
      // Open share dialog - Fixed with proper optional chaining and null checking
      if (window.Telegram?.WebApp?.openLink) {
        window.Telegram.WebApp.openLink(platform.url)
      } else {
        window.open(platform.url, "_blank")
      }
      
      // Confirm the share
      const confirmed = window.confirm("Did you share the content? Click OK to claim your reward.")
      
      if (confirmed) {
        // Record the share in the backend
        const response = await fetch("/api/claim", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            telegramId: window.Telegram?.WebApp?.initDataUnsafe?.user?.id,
            claimType: "social",
            platform: platform.id
          }),
        })
        
        if (!response.ok) {
          throw new Error("Failed to claim reward")
        }
        
        const data = await response.json()
        
        if (data.success) {
          setClaimedPlatforms(prev => [...prev, platform.id])
          if (onClaim) {
            onClaim()
          }
        } else {
          setError(data.message || "Failed to claim reward")
        }
      }
    } catch (error) {
      console.error("Failed to share:", error)
      setError("Something went wrong. Please try again.")
    } finally {
      setSharing(false)
      setCurrentPlatform(null)
    }
  }
  
  return (
    <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Social Sharing</CardTitle>
        <CardDescription>Share our profiles to earn more dots</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {socialPlatforms.map((platform, index) => {
          const isClaimed = claimedPlatforms.includes(platform.id)
          
          return (
            <motion.div 
              key={platform.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-gray-800 bg-gray-800/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gray-700 p-2 rounded-full">
                        {platform.icon}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-white">{platform.name}</h3>
                        <p className="text-xs text-gray-400">{platform.dots} dots</p>
                      </div>
                    </div>
                    {isClaimed ? (
                      <div className="flex items-center text-[#d1ff00]">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        <span className="text-xs">Claimed</span>
                      </div>
                    ) : (
                      <Button 
                        size="sm" 
                        className="bg-[#d1ff00] hover:bg-[#b8e600] text-black text-xs font-bold"
                        onClick={() => handleShare(platform)}
                        disabled={sharing}
                      >
                        {sharing && currentPlatform === platform.id ? (
                          <span className="flex items-center">
                            <span className="animate-spin mr-1">⟳</span> Sharing...
                          </span>
                        ) : (
                          platform.action
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
        {error && (
          <div className="text-red-500 text-sm text-center mt-2">{error}</div>
        )}
      </CardContent>
    </Card>
  )
}