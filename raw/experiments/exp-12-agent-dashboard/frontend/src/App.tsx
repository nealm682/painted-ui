import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { A2UIRenderer } from '@/components/a2ui/A2UIRenderer'
import { BackgroundCanvas } from '@/components/BackgroundCanvas'
import { applyPatch, getAllNodes, clearStage, onStageChange } from '@/painted-ui/stage.js'
import { getFrameCount, subscribe } from '@/painted-ui/animator.js'
import { MOODS } from '@/painted-ui/choreographer.js'
import { streamDemo } from './demo-stream'

const BACKEND_URL = 'http://localhost:8000'

async function streamFromBackend(
  apiKey: string,
  prompt: string,
  mood: string,
  currentNodes: any[],
  conversationId: string,
  onPatch: (patch: any) => void,
  onDone: () => void,
  onError: (err: string) => void,
) {
  const res = await fetch(`${BACKEND_URL}/api/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt,
      api_key: apiKey,
      mood,
      current_stage: currentNodes,
      conversation_id: conversationId,
    }),
  })

  if (!res.ok) {
    onError(`Server error: ${res.status}`)
    return
  }

  const reader = res.body?.getReader()
  if (!reader) { onError('No response body'); return }

  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    for (const line of lines) {
      if (line.startsWith('data:')) {
        const data = line.slice(5).trim()
        if (!data) continue
        try {
          const parsed = JSON.parse(data)
          if (parsed.error) {
            onError(parsed.error)
            return
          }
          if (parsed.mood !== undefined) {
            continue
          }
          onPatch(parsed)
        } catch { /* skip non-JSON lines */ }
      }
    }
  }
  onDone()
}

export default function App() {
  const [apiKey, setApiKey] = useState('')
  const [prompt, setPrompt] = useState('')
  const [nodes, setNodes] = useState<any[]>([])
  const [streaming, setStreaming] = useState(false)
  const [mood, setMood] = useState<string>('neutral')
  const [fps, setFps] = useState(0)
  const [agentStatus, setAgentStatus] = useState<string>('idle')
  const [error, setError] = useState<string | null>(null)
  const [conversationId] = useState(() => crypto.randomUUID())

  // Listen for stage changes and re-render
  useEffect(() => {
    const unsub = onStageChange(() => {
      setNodes(getAllNodes())
    })
    return unsub
  }, [])

  // FPS counter
  useEffect(() => {
    let lastFrame = getFrameCount()
    let lastTime = performance.now()

    const unsub = subscribe(() => {
      const now = performance.now()
      if (now - lastTime >= 1000) {
        const currentFrame = getFrameCount()
        setFps(Math.round((currentFrame - lastFrame) / ((now - lastTime) / 1000)))
        lastFrame = currentFrame
        lastTime = now
      }
    })
    return unsub
  }, [])

  const runDemo = useCallback(() => {
    if (streaming) return
    clearStage()
    setStreaming(true)
    setError(null)
    setAgentStatus('thinking')

    setTimeout(() => {
      setAgentStatus('streaming')
      streamDemo(
        (patch) => applyPatch(patch, mood),
        () => {
          setStreaming(false)
          setAgentStatus('done')
        },
      )
    }, 400)
  }, [streaming, mood])

  const runAgent = useCallback(async (userPrompt: string) => {
    if (streaming) return
    setStreaming(true)
    setError(null)
    setAgentStatus('thinking')

    const currentNodes = getAllNodes().map((n: any) => ({
      id: n.id, kind: n.kind,
      ...Object.fromEntries(
        Object.entries(n).filter(([k]) => !k.startsWith('_') && k !== 'id' && k !== 'kind')
      ),
    }))

    await streamFromBackend(
      apiKey,
      userPrompt,
      mood,
      currentNodes,
      conversationId,
      (patch) => {
        setAgentStatus('streaming')
        applyPatch(patch, mood)
      },
      () => {
        setStreaming(false)
        setAgentStatus('done')
      },
      (err) => {
        setStreaming(false)
        setAgentStatus('error')
        setError(err)
      },
    )
  }, [streaming, mood, apiKey, conversationId])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    if (apiKey.trim()) {
      runAgent(prompt)
    } else {
      runDemo()
    }
    setPrompt('')
  }, [prompt, runAgent, runDemo])

  const handleAction = useCallback((action: string) => {
    console.log('Action triggered:', action)
  }, [])

  const isThinking = agentStatus === 'thinking' && nodes.length > 0

  return (
    <div className="min-h-screen flex flex-col relative">
      <BackgroundCanvas mood={mood} />

      {/* Top bar */}
      <header className="relative z-10 border-b border-border bg-background/80 backdrop-blur-sm px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-semibold text-foreground tracking-tight">
            Workforce Advisor
          </h1>
          <Badge variant="outline" className="text-[10px] text-dim">
            Exp-12
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          {/* Mood selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-dim uppercase tracking-wider">Mood</span>
            {MOODS.map((m: string) => (
              <button
                key={m}
                onClick={() => setMood(m)}
                className={`px-2 py-0.5 text-[10px] rounded-full transition-colors ${
                  mood === m
                    ? 'bg-primary text-primary-foreground'
                    : 'text-dim hover:text-foreground'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* FPS indicator */}
          <span className="text-[10px] text-dim font-mono tabular-nums">
            {fps} fps
          </span>

          {/* Agent status */}
          <Badge
            variant={agentStatus === 'streaming' ? 'default' : 'outline'}
            className={`text-[10px] ${agentStatus === 'thinking' ? 'animate-pulse' : ''}`}
          >
            {agentStatus}
          </Badge>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 overflow-y-auto p-6">
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            {error}
          </div>
        )}

        {nodes.length === 0 && !streaming ? (
          <div className="flex items-center justify-center h-full min-h-[400px]">
            <div className="text-center space-y-3 max-w-md">
              <p className="text-muted-foreground text-sm">
                Ask the Workforce Advisor a question, or press the demo button to see
                choreographed A2UI components in action.
              </p>
              <Button onClick={runDemo} size="sm" variant="outline">
                Run Demo Stream
              </Button>
            </div>
          </div>
        ) : (
          <div className={`max-w-5xl mx-auto space-y-4 ${isThinking ? 'thinking-shimmer' : ''}`}>
            {/* Metrics row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <A2UIRenderer
                nodes={nodes.filter((n) => n.kind === 'metric')}
                onAction={handleAction}
              />
            </div>

            {/* Cards, text, tables */}
            <div className="space-y-4">
              <A2UIRenderer
                nodes={nodes.filter((n) => n.kind !== 'metric')}
                onAction={handleAction}
              />
            </div>
          </div>
        )}
      </main>

      {/* Bottom input bar */}
      <footer className="relative z-10 border-t border-border bg-background/80 backdrop-blur-sm px-6 py-3">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex gap-2">
          <Input
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Anthropic API Key (optional for demo)"
            type="password"
            className="w-56 text-xs"
          />
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask the workforce advisor..."
            className="flex-1"
            disabled={streaming}
          />
          <Button type="submit" disabled={streaming} size="sm">
            {streaming ? 'Streaming...' : 'Send'}
          </Button>
        </form>
      </footer>
    </div>
  )
}
