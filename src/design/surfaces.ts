/** Canonical catalog surfaces and the supported legacy input spelling. */
export const interfaceSurfaces = ["site", "webapp", "both"] as const;
export const surfaceInputs = [...interfaceSurfaces, "system"] as const;

/** Resolves the deprecated surface spelling before filtering or validating data. */
export function normalizeSurface(value: unknown): unknown {
  return value === "system" ? "webapp" : value;
}
