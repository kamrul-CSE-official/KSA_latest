"use client"

import { Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useEffect, useState, useRef } from "react"

const loadingMessages = [
  "Warping through hyperspace...",
  "Brewing digital coffee...",
  "Assembling pixel puzzle...",
  "Taming wild algorithms...",
  "Waking up the server hamsters...",
  "Compressing singularity...",
  "Rendering magic...",
  "Almost there... (no, really)",
  "Calculating quantum probabilities...",
  "Aligning digital chakras...",
  "Polishing pixels to perfection...",
]

const shapes = ["✨", "🌟", "💫", "⚡", "🔮", "🌈", "🌠", "🎆", "🪄", "🌌", "🎇", "💥", "🌊", "🔥", "❄️", "🍃"]

const colors = [
  "#FF5E5B",
  "#D8D8F6",
  "#39A0ED",
  "#FFCC00",
  "#7B61FF",
  "#00C2A8",
  "#FF6B6B",
  "#FFA8A8",
  "#91F291",
  "#43AA8B",
]

export default function GlobalLoading() {
  const [message, setMessage] = useState(loadingMessages[0])
  const [progress, setProgress] = useState(0)
  const [shapeIndex, setShapeIndex] = useState(0)
  const [primaryColor, setPrimaryColor] = useState(colors[0])
  const [secondaryColor, setSecondaryColor] = useState(colors[5])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // For the particle system
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      if (canvas) {
        canvas.width = canvas.offsetWidth * window.devicePixelRatio
        canvas.height = canvas.offsetHeight * window.devicePixelRatio
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      }
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Particle class
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      opacity: number
      life: number
      maxLife: number

      constructor(x: number, y: number) {
        this.x = x
        this.y = y
        this.size = Math.random() * 5 + 1
        this.speedX = Math.random() * 3 - 1.5
        this.speedY = Math.random() * 3 - 1.5
        this.color = colors[Math.floor(Math.random() * colors.length)]
        this.opacity = 1
        this.life = 0
        this.maxLife = Math.random() * 100 + 50
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY
        this.life++
        this.opacity = 1 - this.life / this.maxLife

        if (this.size > 0.2) this.size -= 0.05
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle =
          this.color +
          Math.floor(this.opacity * 255)
            .toString(16)
            .padStart(2, "0")
        ctx.fill()
      }
    }

    const particles: Particle[] = []
    let lastTime = 0
    let particleTimer = 0

    // Animation loop
    const animate = (timestamp: number) => {
      const deltaTime = timestamp - lastTime
      lastTime = timestamp
      particleTimer += deltaTime

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Add new particles
      if (particleTimer > 100) {
        const centerX = canvas.width / 2 / window.devicePixelRatio
        const centerY = canvas.height / 2 / window.devicePixelRatio
        const radius = 50
        const angle = Math.random() * Math.PI * 2

        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius

        particles.push(new Particle(x, y))
        particleTimer = 0
      }

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update()
        particles[i].draw(ctx)

        // Remove dead particles
        if (particles[i].life >= particles[i].maxLife) {
          particles.splice(i, 1)
          i--
        }
      }

      requestAnimationFrame(animate)
    }

    animate(0)

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  // Cycling animations
  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessage(loadingMessages[Math.floor(Math.random() * loadingMessages.length)])
    }, 2500)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        // Make progress more interesting with occasional jumps and slowdowns
        const increment = Math.random() * 15
        return prev >= 100 ? 0 : Math.min(100, prev + increment)
      })
    }, 300)

    const shapeInterval = setInterval(() => {
      setShapeIndex((prev) => (prev + 1) % shapes.length)
    }, 500)

    const colorInterval = setInterval(() => {
      const colorIndex1 = Math.floor(Math.random() * colors.length)
      let colorIndex2 = Math.floor(Math.random() * colors.length)
      // Ensure different colors
      while (colorIndex1 === colorIndex2) {
        colorIndex2 = Math.floor(Math.random() * colors.length)
      }
      setPrimaryColor(colors[colorIndex1])
      setSecondaryColor(colors[colorIndex2])
    }, 5000)

    return () => {
      clearInterval(messageInterval)
      clearInterval(progressInterval)
      clearInterval(shapeInterval)
      clearInterval(colorInterval)
    }
  }, [])

  return (
    <AnimatePresence>
      <motion.div
        key="global-loader"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center bg-background/90 backdrop-blur-xl z-[9999]"
        style={{
          background: `radial-gradient(circle at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.9) 100%)`,
        }}
      >
        {/* Canvas for particle system */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ opacity: 0.7 }}
        />

        <div className="relative flex flex-col items-center gap-8 p-8 max-w-md">
          {/* Animated glow effect */}
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none opacity-30"
            style={{
              background: `radial-gradient(circle at center, ${primaryColor}40 0%, transparent 70%)`,
              filter: "blur(20px)",
            }}
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          {/* Animated border */}
          <motion.div
            className="absolute inset-0 border-2 border-primary/20 rounded-xl pointer-events-none overflow-hidden"
            style={{ borderColor: `${primaryColor}40` }}
            animate={{
              borderColor: [`${primaryColor}40`, `${secondaryColor}40`, `${primaryColor}40`],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            {/* Border light effect */}
            <motion.div
              className="absolute top-0 left-0 w-full h-full"
              style={{
                background: `linear-gradient(90deg, transparent, ${primaryColor}40, transparent)`,
              }}
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          </motion.div>

          {/* Floating shapes background */}
          <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
            {[...Array(16)].map((_, i) => (
              <motion.span
                key={i}
                className="absolute text-2xl opacity-20"
                initial={{
                  x: Math.random() * 100 - 50 + "%",
                  y: Math.random() * 100 - 50 + "%",
                  rotate: Math.random() * 360,
                  scale: Math.random() * 0.5 + 0.5,
                }}
                animate={{
                  x: [null, Math.random() * 100 - 50 + "%"],
                  y: [null, Math.random() * 100 - 50 + "%"],
                  rotate: [null, Math.random() * 360],
                  scale: [null, Math.random() * 0.5 + 0.5],
                }}
                transition={{
                  duration: 10 + Math.random() * 20,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              >
                {shapes[Math.floor(Math.random() * shapes.length)]}
              </motion.span>
            ))}
          </div>

          <div className="flex flex-col items-center gap-6 z-10">
            {/* Main loader with trail effect */}
            <motion.div
              className="relative"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              {/* Glow effect behind loader */}
              <motion.div
                className="absolute inset-0 rounded-full blur-xl"
                style={{
                  background: primaryColor,
                  opacity: 0.5,
                  transform: "scale(1.5)",
                }}
                animate={{
                  opacity: [0.3, 0.7, 0.3],
                  scale: [1.3, 1.7, 1.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />

              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  repeat: Number.POSITIVE_INFINITY,
                }}
              >
                <Loader2
                  className={cn("w-20 h-20", "drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]")}
                  style={{ color: primaryColor }}
                />
              </motion.div>

              {/* Orbiting particles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full"
                  style={{
                    background: i % 2 === 0 ? primaryColor : secondaryColor,
                    boxShadow: `0 0 10px ${i % 2 === 0 ? primaryColor : secondaryColor}`,
                  }}
                  animate={{
                    x: Math.cos(i * 60 * (Math.PI / 180)) * 50 - 6,
                    y: Math.sin(i * 60 * (Math.PI / 180)) * 50 - 6,
                    scale: [1, 1.5, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 0.2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>

            {/* Dynamic message with shape */}
            <motion.div
              className="flex items-center gap-3 text-xl font-medium"
              style={{ color: "white", textShadow: `0 0 10px ${primaryColor}` }}
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <motion.span
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                style={{ filter: `drop-shadow(0 0 5px ${secondaryColor})` }}
              >
                {shapes[shapeIndex]}
              </motion.span>
              <motion.span
                animate={{
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                {message}
              </motion.span>
            </motion.div>

            {/* Creative progress indicator */}
            <div className="w-full">
              <motion.div
                className="h-4 w-full rounded-full overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  boxShadow: "0 0 10px rgba(0,0,0,0.3) inset",
                }}
                initial={{ scaleX: 0.8, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="h-full rounded-full relative"
                  style={{
                    width: `${progress}%`,
                    background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
                    boxShadow: `0 0 10px ${primaryColor}`,
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute right-0 top-0 h-full w-20"
                    style={{
                      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
                    }}
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>
              </motion.div>

              {/* Percentage indicator */}
              <motion.div
                className="flex justify-between items-center text-sm mt-2"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <span className="text-white/70">Loading...</span>
                <span className="font-bold" style={{ color: progress >= 90 ? secondaryColor : "white" }}>
                  {Math.min(100, Math.round(progress))}%
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
