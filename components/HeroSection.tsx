"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface Particle {
  id: number
  left: number
  top: number
  duration: number
  delay: number
}

export default function HeroSection() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const generatedParticles: Particle[] = [
      ...Array(20)
    ].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
    }))
    setParticles(generatedParticles)
  }, [])

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url(/hero-bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-hacker-bg/40 via-hacker-bg/60 to-hacker-bg/80"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-hacker-bg/30 to-transparent"></div>

        {/* Animated particles over background */}
        <div className="absolute inset-0 opacity-30">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: particle.duration,
                repeat: Number.POSITIVE_INFINITY,
                delay: particle.delay,
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-tech font-bold glow-text mb-4 text-balance leading-tight"
        >
          ANONYMIKETECH
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-sm sm:text-base md:text-xl lg:text-2xl text-cyan-400 mb-8 font-tech text-balance"
        >
          // Unleashing Digital Innovation & Cyber Excellence
        </motion.p>
      </div>
    </motion.section>
  )
}
