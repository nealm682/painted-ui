/**
 * Painted UI — Loop 3: Brace-Depth Stream Parser
 *
 * Extracts complete top-level JSON objects from arbitrary text fragments,
 * regardless of chunk boundaries, markdown fences, or prose between objects.
 * Tolerates JS-style .5 decimals and trailing commas.
 *
 * This is the client-side parser — the same code path works whether tokens
 * arrive from a cloud LLM via SSE or from an on-device SLM via WebLLM.
 */

const LEADING_DECIMAL = /([:\[,]\s*)\.(\d)/g;
const TRAILING_COMMA = /,\s*([}\]])/g;

export class PatchStreamParser {
  constructor() {
    this.buf = '';
    this.unparsed = 0;
  }

  /**
   * Feed a text fragment in; get completed patch objects out.
   * @param {string} text - raw text chunk (tokens, partial JSON, prose, etc.)
   * @returns {object[]} - zero or more complete patch objects
   */
  feed(text) {
    this.buf += text;
    const out = [];
    let depth = 0;
    let inStr = false;
    let esc = false;
    let start = -1;
    let lastEnd = 0;

    for (let i = 0; i < this.buf.length; i++) {
      const ch = this.buf[i];

      if (inStr) {
        if (esc) { esc = false; continue; }
        if (ch === '\\') { esc = true; continue; }
        if (ch === '"') { inStr = false; }
        continue;
      }

      if (ch === '"') {
        if (depth > 0) inStr = true;
        continue;
      }

      if (ch === '{') {
        if (depth === 0) start = i;
        depth++;
      } else if (ch === '}' && depth > 0) {
        depth--;
        if (depth === 0 && start >= 0) {
          const chunk = this.buf.slice(start, i + 1);
          lastEnd = i + 1;
          try {
            out.push(JSON.parse(chunk));
          } catch {
            try {
              const fixed = chunk
                .replace(LEADING_DECIMAL, '$10.$2')
                .replace(TRAILING_COMMA, '$1');
              out.push(JSON.parse(fixed));
            } catch {
              this.unparsed++;
            }
          }
          start = -1;
        }
      }
    }

    // Keep incomplete object in buffer; discard consumed text
    if (depth > 0 && start >= 0) {
      this.buf = this.buf.slice(start);
    } else if (lastEnd) {
      this.buf = this.buf.slice(lastEnd);
    } else {
      this.buf = '';
    }

    return out;
  }

  /** Reset parser state */
  reset() {
    this.buf = '';
    this.unparsed = 0;
  }
}
