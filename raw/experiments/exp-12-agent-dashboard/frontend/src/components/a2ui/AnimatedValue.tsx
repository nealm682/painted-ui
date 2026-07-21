import { useRef, useEffect, useState } from 'react'

/**
 * Animates between numeric values with counting effect.
 * Parses numbers from strings like "18 days", "$1,247", "4.1%"
 */

function parseNumeric(str: string): { num: number; prefix: string; suffix: string; decimals: number; hasCommas: boolean } | null {
  const match = str.match(/^([^0-9-]*)([-]?[\d,]+\.?\d*)(.*)$/)
  if (!match) return null
  const raw = match[2]
  const hasCommas = raw.includes(',')
  const num = parseFloat(raw.replace(/,/g, ''))
  if (isNaN(num)) return null
  const decMatch = raw.match(/\.(\d+)/)
  return { num, prefix: match[1], suffix: match[3], decimals: decMatch ? decMatch[1].length : 0, hasCommas }
}

function formatNum(n: number, decimals: number, hasCommas: boolean): string {
  const fixed = n.toFixed(decimals)
  if (!hasCommas) return fixed
  const [int, dec] = fixed.split('.')
  const withCommas = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return dec ? `${withCommas}.${dec}` : withCommas
}

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

interface AnimatedValueProps {
  value: string
  className?: string
  duration?: number
}

export function AnimatedValue({ value, className, duration = 600 }: AnimatedValueProps) {
  const prevRef = useRef(value)
  const [display, setDisplay] = useState(value)
  const [flash, setFlash] = useState(false)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const prev = prevRef.current
    prevRef.current = value

    if (prev === value) return

    const prevParsed = parseNumeric(prev)
    const nextParsed = parseNumeric(value)

    // If both are numeric, animate the count
    if (prevParsed && nextParsed && prevParsed.suffix === nextParsed.suffix) {
      const startTime = performance.now()
      const from = prevParsed.num
      const to = nextParsed.num

      setFlash(true)
      setTimeout(() => setFlash(false), duration)

      const tick = () => {
        const elapsed = performance.now() - startTime
        const t = Math.min(1, elapsed / duration)
        const current = from + (to - from) * easeOut(t)
        setDisplay(nextParsed.prefix + formatNum(current, nextParsed.decimals, nextParsed.hasCommas) + nextParsed.suffix)

        if (t < 1) {
          rafRef.current = requestAnimationFrame(tick)
        } else {
          setDisplay(value)
        }
      }

      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(tick)
    } else {
      // Non-numeric change: just flash and swap
      setFlash(true)
      setDisplay(value)
      setTimeout(() => setFlash(false), 400)
    }

    return () => cancelAnimationFrame(rafRef.current)
  }, [value, duration])

  return (
    <span
      className={`${className || ''} ${flash ? 'animated-value-flash' : ''}`}
      style={{ transition: 'color 0.3s' }}
    >
      {display}
    </span>
  )
}
