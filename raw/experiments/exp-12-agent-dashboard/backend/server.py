"""
FastAPI server — SSE relay for the Workforce Advisor agent.

The frontend POSTs a prompt + API key, and receives raw token chunks via
Server-Sent Events. The client-side brace-depth parser (Loop 3) assembles
complete patches — keeping parsing client-side so the same code path works
for cloud LLMs and on-device SLMs alike.
"""

import json
import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sse_starlette.sse import EventSourceResponse

from agent import run_agent, stream_agent


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Workforce Advisor backend ready")
    yield


app = FastAPI(title="Workforce Advisor", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory conversation store (keyed by conversation_id)
conversations: dict[str, list[dict]] = {}


class QueryRequest(BaseModel):
    prompt: str
    api_key: str
    mood: str = "neutral"
    current_stage: list[dict] | None = None
    conversation_id: str | None = None


@app.post("/api/query")
async def query(req: QueryRequest):
    """
    Run the Strands agent and stream back A2UI patches as SSE events.
    """
    conv_id = req.conversation_id or "default"

    # Get or create conversation history
    if conv_id not in conversations:
        conversations[conv_id] = []

    history = conversations[conv_id]

    async def generate():
        """
        Phase A (Painted UI): raw token relay. The server streams token
        chunks as they arrive from the model — no parsing server-side.
        The client's brace-depth parser (Loop 3) assembles complete patches
        from the raw text, so token pacing IS the timing source.
        """
        full_response = ""
        try:
            async for text_chunk in stream_agent(
                req.api_key, req.prompt, req.current_stage, history,
            ):
                full_response += text_chunk
                yield {
                    "event": "token",
                    "data": json.dumps({"text": text_chunk}),
                }

            # Store this turn in conversation history
            history.append({"role": "user", "content": req.prompt})
            history.append({"role": "assistant", "content": full_response})

            # Keep history bounded (last 10 turns = 20 messages)
            while len(history) > 20:
                history.pop(0)

            yield {
                "event": "done",
                "data": json.dumps({"mood": req.mood}),
            }

        except Exception as e:
            import traceback
            traceback.print_exc()
            yield {
                "event": "error",
                "data": json.dumps({"error": str(e)}),
            }

    return EventSourceResponse(generate())


@app.get("/health")
async def health():
    return {"status": "ok"}
