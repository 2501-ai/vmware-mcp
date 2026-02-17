// ---------------------------------------------------------------------------
// VMWare MCP – Output Sanitizer
// ---------------------------------------------------------------------------
// Strips verbose/noisy fields from govc JSON output to reduce token usage
// when results are consumed by LLMs.
// ---------------------------------------------------------------------------

/**
 * Keys that are never useful for an LLM agent.
 * These appear across many vSphere managed object types.
 *
 * CONSERVATIVE list — only keys we are 100% sure are pure noise.
 * When in doubt, keep it. Nulls and empty arrays are already stripped.
 */
const NOISY_KEYS = new Set([
  // Every alarm *definition* on the object, even if not triggered.
  // Extremely verbose (10+ entries per object). Agents should check
  // `triggeredAlarmState` and `overallStatus` instead.
  'declaredAlarmState',

  // Custom field schema definitions (not actual values — those are `customValue`)
  'availableField',

  // Opaque numeric role IDs — meaningless without the AuthorizationManager
  'effectiveRole',

  // Internal vSphere API method names that are disabled on the object
  'disabledMethod',

  // Storage I/O Resource Management config — very niche tuning knobs
  'iormConfiguration',

  // Internal HostDatastoreBrowser managed object reference
  'browser',
]);

/**
 * Detect a managed object reference: `{ type: "SomeType", value: "some-id" }`.
 */
const isMoRef = (val: unknown): val is { type: string; value: string } =>
  typeof val === 'object' &&
  val !== null &&
  !Array.isArray(val) &&
  Object.keys(val).length === 2 &&
  typeof (val as Record<string, unknown>).type === 'string' &&
  typeof (val as Record<string, unknown>).value === 'string';

/**
 * Check if an array consists entirely of managed object references.
 */
const isMoRefArray = (arr: unknown[]): arr is Array<{ type: string; value: string }> =>
  arr.length > 0 && arr.every(isMoRef);

/**
 * Compact a MoRef into `"Type:value"` so the type information is preserved
 * but the object overhead is eliminated.
 */
const compactMoRef = (ref: { type: string; value: string }): string => `${ref.type}:${ref.value}`;

/**
 * Recursively sanitize a parsed govc JSON result.
 *
 * - Removes keys in `NOISY_KEYS`
 * - Removes `null` values and empty arrays
 * - Compacts MoRef objects `{ type, value }` → `"Type:value"`
 * - Compacts arrays of MoRefs into arrays of compact strings
 */
export const sanitize = (data: unknown): unknown => {
  if (data === null || data === undefined) return undefined;

  if (Array.isArray(data)) {
    if (data.length === 0) return undefined;

    // Compact arrays of pure MoRefs into "Type:value" strings
    if (isMoRefArray(data)) {
      return data.map(compactMoRef);
    }

    const cleaned = data.map(sanitize).filter((v) => v !== undefined);
    return cleaned.length > 0 ? cleaned : undefined;
  }

  if (typeof data === 'object') {
    // Compact standalone MoRef objects
    if (isMoRef(data)) {
      return compactMoRef(data);
    }

    const result: Record<string, unknown> = {};
    let hasKeys = false;

    for (const [key, val] of Object.entries(data as Record<string, unknown>)) {
      if (NOISY_KEYS.has(key)) continue;

      const cleaned = sanitize(val);
      if (cleaned !== undefined) {
        result[key] = cleaned;
        hasKeys = true;
      }
    }

    return hasKeys ? result : undefined;
  }

  // Primitives pass through
  return data;
};
