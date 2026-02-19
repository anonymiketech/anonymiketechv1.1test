"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SubService {
  id: string
  name: string
  price: number
  quantity?: number
}

interface Service {
  id: string
  name: string
  icon: string
  category: string
  subServices: SubService[]
  createdAt: string
  updatedAt: string
}

interface NetworkItem {
  id: string
  name: string
  icon: string
  category: string
}

export default function DynamicSocialServices() {
  const [services, setServices] = useState<Service[]>([])
  const [networks, setNetworks] = useState<NetworkItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedNetwork, setSelectedNetwork] = useState<Service | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/services")
      const data = await res.json()

      if (data.services && data.services.length > 0) {
        setServices(data.services)
        // Convert to NetworkItem format for display
        const networkItems: NetworkItem[] = data.services.map((service: Service) => ({
          id: service.id,
          name: service.name,
          icon: service.icon,
          category: service.category,
        }))
        setNetworks(networkItems)
      } else {
        // Fallback to default networks if no services exist
        setNetworks(getDefaultNetworks())
      }
      setError(null)
    } catch (err) {
      console.error("Failed to fetch services:", err)
      setError("Failed to load services")
      // Fallback to default networks
      setNetworks(getDefaultNetworks())
    } finally {
      setLoading(false)
    }
  }

  const getDefaultNetworks = (): NetworkItem[] => [
    { id: "instagram", name: "Instagram", icon: "📷", category: "Popular" },
    { id: "youtube", name: "YouTube", icon: "▶️", category: "Popular" },
    { id: "whatsapp", name: "WhatsApp", icon: "💬", category: "Popular" },
    { id: "twitter", name: "X - Twitter", icon: "𝕏", category: "Popular" },
    { id: "telegram-classic", name: "Telegram Classic", icon: "📲", category: "Popular" },
    { id: "telegram-premium", name: "Telegram Premium", icon: "⭐", category: "Popular" },
    { id: "linkedin", name: "LinkedIn", icon: "💼", category: "Popular" },
    { id: "spotify", name: "Spotify", icon: "🎵", category: "Popular" },
    { id: "quora", name: "Quora", icon: "❓", category: "All Platforms" },
    { id: "pinterest", name: "Pinterest", icon: "📌", category: "All Platforms" },
    { id: "chatgpt", name: "ChatGPT", icon: "🤖", category: "Free Services" },
    { id: "canva", name: "Canva", icon: "🎨", category: "Free Services" },
    { id: "google-docs", name: "Google Docs Votes", icon: "📄", category: "Free Services" },
    { id: "tiktok", name: "TikTok", icon: "🎵", category: "Free Services" },
    { id: "facebook", name: "Facebook", icon: "f", category: "Free Services" },
  ]

  const filteredNetworks = networks.filter((network) =>
    network.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleNetworkSelect = (network: NetworkItem) => {
    const service = services.find((s) => s.id === network.id)
    setSelectedNetwork(service || null)
  }

  const groupedNetworks = filteredNetworks.reduce(
    (acc, network) => {
      const category = network.category
      if (!acc[category]) acc[category] = []
      acc[category].push(network)
      return acc
    },
    {} as Record<string, NetworkItem[]>,
  )

  return (
    <div className="w-full space-y-6">
      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 p-4 rounded-lg bg-hacker-terminal/30 border border-hacker-green/20"
      >
        <div className="flex-1 w-full md:w-auto">
          <Input
            placeholder="Search service or order id"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-hacker-terminal border-hacker-green/30 text-hacker-green-bright placeholder:text-hacker-green-dim"
          />
        </div>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-hacker-green border-t-transparent rounded-full"
          />
          <span className="ml-3 text-hacker-green-dim">Loading services...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {/* Services Grid */}
      {!loading && !error && (
        <div className="space-y-8">
          {Object.entries(groupedNetworks).map(([category, categoryNetworks]) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <h3 className="text-lg md:text-xl font-bold text-hacker-green-bright flex items-center gap-3">
                <span className="text-hacker-green">//</span>
                {category}
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                <AnimatePresence mode="popLayout">
                  {categoryNetworks.map((network, index) => (
                    <motion.button
                      key={network.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleNetworkSelect(network)}
                      className={`group relative p-4 rounded-lg border-2 transition-all duration-300 ${
                        selectedNetwork?.id === network.id
                          ? "bg-hacker-green/20 border-hacker-green shadow-lg shadow-hacker-green/30"
                          : "bg-hacker-terminal/40 border-hacker-green/30 hover:border-hacker-green/50 hover:bg-hacker-terminal/60"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2.5">
                        <span className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform">
                          {network.icon}
                        </span>
                        <span className="text-xs sm:text-sm font-medium text-hacker-green-bright text-center line-clamp-2">
                          {network.name}
                        </span>
                      </div>

                      {/* Sub-services indicator */}
                      {selectedNetwork?.id === network.id && selectedNetwork.subServices.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="absolute -top-2 -right-2 bg-hacker-green text-hacker-terminal text-xs font-bold px-2 py-1 rounded-full"
                        >
                          {selectedNetwork.subServices.length}
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Selected Service Details */}
      <AnimatePresence>
        {selectedNetwork && selectedNetwork.subServices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="p-6 bg-hacker-terminal/40 border border-hacker-green/30 rounded-lg space-y-4"
          >
            <h3 className="text-lg font-bold text-hacker-green-bright flex items-center gap-2">
              <span className="text-2xl">{selectedNetwork.icon}</span>
              {selectedNetwork.name} - Sub-Services
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedNetwork.subServices.map((subService) => (
                <motion.div
                  key={subService.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 bg-hacker-terminal/50 rounded-lg border border-hacker-green/20 hover:border-hacker-green/40 transition-all"
                >
                  <div className="flex-1">
                    <p className="text-hacker-green-bright font-semibold">{subService.name}</p>
                    <p className="text-hacker-green-dim text-sm">Price: KSH {subService.price.toFixed(2)}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="ml-4 px-4 py-2 bg-hacker-green/20 border border-hacker-green text-hacker-green-bright rounded-lg hover:bg-hacker-green/30 transition-all flex items-center gap-2 whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    Order
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!loading && networks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-hacker-green-dim">No services available. Please check back later.</p>
        </div>
      )}
    </div>
  )
}
