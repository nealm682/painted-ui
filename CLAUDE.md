# CLAUDE.md — Operational schema for the Painted UI wiki

This is a personal, compounding knowledge base on **cheap painted UI**: techniques
for reproducing the illusion that a screen is being "painted live by a model"
(Flipbook-style) at near-zero marginal cost per user. Modeled on Karpathy's
"LLM Wiki" pattern: three layers (raw / wiki / schema), three operations
(ingest / query / lint), navigation via `wiki/index.md` + `wiki/log.md`.

## Roles
- **Neal** curates sources, explores, asks questions, sets direction.
- **The agent (you)** does all reading, summarizing, cross-referencing, filing,
  and bookkeeping. Neal reads the wiki; you write it.

## Guardrails
- Personal side-project wiki. Vendor-neutral, public information only.
  NEVER ingest employer-proprietary/confidential/NDA material. If pasted
  content looks internal, flag it and ask before filing.
- `raw/` is immutable source-of-truth. Never edit raw files. Exception:
  `raw/experiments/` receives Neal's (and agent-built) experiment logs as
  they're created, but once filed they're not rewritten.
- The agent owns `wiki/` entirely; Neal owns sourcing and direction.
- Cite sources on every claim — link to the page in `wiki/sources/`.
- When a new source contradicts an existing claim, add a "⚠️ Contradiction"
  note on the affected page(s); never silently overwrite.

## Layers
- `raw/` — immutable sources: `articles/`, `papers/`, `demos/`,
  `experiments/` (own build logs, benchmarks, screenshots), `assets/`.
- `wiki/` — generated, interlinked markdown: `index.md`, `log.md`,
  `overview.md`, `thesis.md`, `concepts/`, `techniques/`, `entities/`,
  `sources/`, `comparisons/`.
- `CLAUDE.md` — this file. Co-evolve it: when a workflow proves itself,
  write it down here.

## Conventions
- `[[wiki-links]]` between pages (Obsidian graph view compatible). Links are
  relative to `wiki/` root, e.g. `[[concepts/the-illusion]]`.
- Create pages lazily — only when a source justifies them.
- Technique pages must include: what it emulates, how to build it, cost
  profile, fidelity tradeoffs, open questions.
- Entity pages: factual summary + "what I've learned."
- Source pages: citation + key takeaways + list of wiki pages touched.
- `log.md` entries: `## [YYYY-MM-DD] <op> | <subject>` — greppable with
  `grep "^## \[" log.md | tail -5`.

## Operations

### Ingest (Neal drops a source in `raw/` and says "ingest it")
1. Read the full source.
2. Discuss key takeaways with Neal briefly before writing.
3. Write/update a summary page in `wiki/sources/`.
4. Update every relevant concept/technique/entity page (a good source may
   touch 10–15 pages — do the cross-referencing).
5. Flag contradictions rather than silently editing.
6. Update `wiki/index.md`.
7. Append a `wiki/log.md` entry.

### Query (Neal asks a question)
1. Read `wiki/index.md` first, then drill into relevant pages.
2. Answer with citations to wiki pages.
3. Offer to file good answers (comparisons, analyses, new connections) back
   into the wiki as their own pages — compound, don't vanish.
4. Output format may vary: markdown page, comparison table, Marp deck, diagram.

### Lint (Neal says "lint the wiki")
Health-check: contradictions between pages, stale claims superseded by newer
sources, orphan pages, concepts mentioned but lacking a page, missing
cross-links, gaps fillable via web search. Suggest new questions and sources.

## Git
The wiki root is a git repo, published at github.com/nealm682/painted-ui.
Commit after every ingest/lint with a message matching the log entry
(e.g. `ingest: flipbook launch thread`).

**Workflow since 2026-07-19 (native `.git` restored by Neal):** the agent
edits files; **Neal commits and pushes** (`git add -A && git commit && git
push`) since authentication is his. The agent should end any session that
changed files by telling Neal exactly what to commit and suggesting a
message. `painted-ui.git.bundle` is retired — safe to delete and gitignore.
Public-repo voice rule: first-person singular in all public-facing text
(paper, README); no employer references anywhere.

**Sandbox quirk:** the mounted folder allows file writes but not deletes or
new files inside previously-copied directories, so a live `.git` cannot be
maintained from the sandbox. Instead, history lives in
`painted-ui.git.bundle` at the wiki root (single-file overwrite — works).
Session workflow: `git clone painted-ui.git.bundle /tmp/pui && cd /tmp/pui`,
sync current mount files in, commit, then
`git bundle create <mount>/painted-ui/painted-ui.git.bundle --all`.
Neal: native Windows git works normally — you can `git clone
painted-ui.git.bundle` or just `git init` in the folder yourself; the stale
partial `.git/` dir left by the first attempt is safe to delete.

**Second sandbox quirk (observed 2026-07-18):** sandbox reads of files edited
host-side can be stale or *truncated mid-write*. The host files themselves are
fine — only the sandbox view lies. Before committing: check every wiki .md
ends with a trailing newline; rebuild any flagged file in the worktree from
known-good content rather than trusting the mount copy. Newly created files
sync reliably; edited files don't.
