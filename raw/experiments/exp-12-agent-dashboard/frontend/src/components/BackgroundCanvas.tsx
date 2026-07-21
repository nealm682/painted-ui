import { useRef, useEffect } from 'react'

/**
 * Decorative canvas layer — ambient particles and subtle grid.
 * Purely cosmetic. Sits behind all A2UI components.
 */

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  hue: number
}

const PARTICLE_COUNT = 40
const COLORS = ['#f3a64b', '#7fe1cc', '#ab9cff', '#ef8f87']

export function BackgroundCanvas({ mood = 'neutral' }: { mood?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const moodRef = useRef(mood)
  moodRef.current = mood

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf: number
    let W = 0
    let H = 0

    function resize() {
      W = canvas!.parentElement?.clientWidth || window.innerWidth
      H = canvas!.parentElement?.clientHeight || window.innerHeight
      canvas!.width = W
      canvas!.height = H
    }

    resize()
    window.addEventListener('resize', resize)

    // Initialize particles
    const particles = particlesRef.current
    if (particles.length === 0) {
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.2,
          size: Math.random() * 2 + 0.5,
          alpha: Math.random() * 0.15 + 0.03,
          hue: Math.floor(Math.random() * COLORS.length),
        })
      }
    }

    function speedForMood(): number {
      switch (moodRef.current) {
        case 'calm': return 0.3
        case 'energetic': return 1.5
        case 'none': return 0
        default: return 0.7
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, W, H)
      const speed = speedForMood()

      // Draw subtle dot grid
      ctx!.fillStyle = 'rgba(255, 255, 255, 0.02)'
      const gridSize = 60
      for (let x = gridSize; x < W; x += gridSize) {
        for (let y = gridSize; y < H; y += gridSize) {
          ctx!.beginPath()
          ctx!.arc(x, y, 1, 0, Math.PI * 2)
          ctx!.fill()
        }
      }

      // Draw and update particles
      for (const p of particles) {
        p.x += p.vx * speed
        p.y += p.vy * speed

        // Wrap around
        if (p.x < 0) p.x = W
        if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H
        if (p.y > H) p.y = 0

        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx!.fillStyle = COLORS[p.hue]
        ctx!.globalAlpha = p.alpha
        ctx!.fill()
        ctx!.globalAlpha = 1
      }

      // Draw faint connection lines between nearby particles
      ctx!.strokeStyle = 'rgba(255, 255, 255, 0.015)'
      ctx!.lineWidth = 0.5
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = dx * dx + dy * dy
          if (dist < 15000) {
            ctx!.beginPath()
            ctx!.moveTo(particles[i].x, particles[i].y)
            ctx!.lineTo(particles[j].x, particles[j].y)
            ctx!.stroke()
          }
        }
      }

      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}
