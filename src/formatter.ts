// ---------------------------------------------------------------------------
// VMWare MCP – Output Formatter
// ---------------------------------------------------------------------------
// Encodes tool results as TOON (Token-Oriented Object Notation) to minimise
// token usage when the output is consumed by LLMs.  Falls back to pretty JSON
// if TOON encoding fails for any reason – correctness over compactness.
// ---------------------------------------------------------------------------

import { encode } from '@toon-format/toon';

/**
 * Format an arbitrary value for LLM consumption.
 *
 * 1. Attempts TOON encoding (compact, schema-aware, ~40 % fewer tokens).
 * 2. Falls back to indented JSON on failure so we never lose data.
 */
export const formatForLLM = (data: unknown): string => {
  try {
    return encode(data);
  } catch {
    // TOON can't handle every exotic shape — degrade gracefully.
    return JSON.stringify(data, null, 2);
  }
};
