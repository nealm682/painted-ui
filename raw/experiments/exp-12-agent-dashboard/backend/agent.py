"""
Workforce Advisor — Strands Agent

Receives a user prompt, reasons with Claude, and returns structured A2UI patches
that the frontend renders with Painted UI choreography.
"""

import json
from strands import Agent
from strands.models.anthropic import AnthropicModel

SYSTEM_PROMPT = """\
You are a Workforce Advisor AI. You help HR leaders and executives understand
their workforce data, spot trends, and make decisions.

When responding, you MUST output ONLY a valid JSON array of UI patches.
Each patch is an object with these fields:
  - op: "add" | "update" | "remove"
  - id: a unique string id (e.g. "metric-headcount")
  - kind: (required for "add") one of "metric", "card", "table", "text", "actions"
  - props: an object with component-specific properties

Component prop schemas:

metric: { label: string, value: string, delta?: string }
card:   { title: string, subtitle?: string, badge?: string, badgeVariant?: "default"|"outline"|"destructive", body?: string, items?: string[] }
text:   { heading?: string, text: string }
table:  { title?: string, columns: string[], rows: (string | {badge: string, variant?: string})[][] }
actions: { actions: { label: string, action: string, variant?: "default"|"outline" }[] }

Operations:
- op "add": create a new component (must have unique id, kind, and props)
- op "update": modify an existing component (id required, props contains only changed fields)
- op "remove": remove a component from the screen (only id required)
- op "scene": set scene-level intent (no id/kind/props; see below)

Semantic intent (the WHY of each change — the choreographer turns it into motion):
Any add/update/remove patch MAY carry an optional "intent" object:
  "intent": {
    "action": "reveal" | "compare" | "focus" | "expand" | "collapse" | "drillDown" | "return" | "filter" | "sort" | "replace" | "confirm" | "warn" | "resolve" | "connect",
    "importance": "high" | "normal",
    "cause": "short reason string",
    "relationship": ["ids of related components"]
  }
Example: {"op": "update", "id": "metric-attrition", "props": {"delta": "+2.1%"}, "intent": {"action": "warn", "importance": "high", "cause": "quarterly-change", "relationship": ["card-manager-quality"]}}

A "scene" patch directs attention for the whole screen:
  {"op": "scene", "intent": {"mode": "overview" | "investigate" | "act", "focus": "component-id", "supporting": ["ids"], "tempo": "deliberate" | "brisk", "continuity": "preserve" | "reset"}}
Emit a scene patch when the user's question shifts what matters most (e.g. drilling into one metric: focus it, list supporting ids, tempo "deliberate").

Guidelines:
- For the FIRST response (empty stage), start with 2-4 metrics, a card, text, table, and actions
- For FOLLOW-UP responses (stage has content), ONLY send patches that change — use "update" and "remove" ops
- Do NOT re-add components that already exist and haven't changed
- Keep existing components stable — the UI animates mutations smoothly at 60fps
- Communicate MEANING, never motion: use intent verbs to say WHY something changed. NEVER specify durations, easings, coordinates, or animation names — the client's choreographer decides all expression.
- Use intent sparingly and honestly: most patches need none; "warn"/"focus"/"drillDown" only when that is truly what's happening
- Use realistic, plausible HR/workforce data
- Be concise but insightful
- Output ONLY the JSON array, no markdown, no explanation
"""


def create_agent(api_key: str) -> Agent:
    """Create a Strands agent with Claude via Anthropic."""
    model = AnthropicModel(
        client_args={"api_key": api_key},
        model_id="claude-opus-4-8",
        max_tokens=4096,
    )
    return Agent(
        model=model,
        system_prompt=SYSTEM_PROMPT,
    )


def run_agent(
    api_key: str,
    prompt: str,
    current_stage: list[dict] | None = None,
    history: list[dict] | None = None,
) -> list[dict]:
    """Run the agent and parse the JSON patch array from its response."""
    agent = create_agent(api_key)

    # Load conversation history into the agent
    if history:
        for msg in history:
            agent.messages.append({
                "role": msg["role"],
                "content": [{"type": "text", "text": msg["content"]}],
            })

    # Build the full prompt with current stage context
    full_prompt = prompt
    if current_stage:
        stage_json = json.dumps(current_stage, indent=2)
        full_prompt = (
            f"CURRENT STAGE (components already on screen):\n{stage_json}\n\n"
            f"USER REQUEST: {prompt}\n\n"
            f"Respond with ONLY the patches needed to fulfill this request. "
            f"Use 'update' or 'remove' for existing components. Only 'add' new ones if needed."
        )

    result = agent(full_prompt)

    # Extract text from the agent result
    text = str(result)

    # Parse JSON — strip markdown fencing if present
    text = text.strip()
    if text.startswith("```"):
        text = text.split("\n", 1)[1]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()
    if text.startswith("json"):
        text = text[4:].strip()

    patches = json.loads(text)
    if not isinstance(patches, list):
        patches = [patches]

    return patches
