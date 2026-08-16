export const colors = {
  paper: "#F2EEE3",
  card: "#FBF9F3",
  ink: "#20241F",
  inkMuted: "#6B6F62",
  hairline: "#DAD3C1",

  green: "#1F7A5C",
  greenSoft: "rgba(31, 122, 92, 0.12)",

  amber: "#E8A33D",
  amberSoft: "rgba(232, 163, 61, 0.18)",

  slate: "#3E5C76",
  slateSoft: "rgba(62, 92, 118, 0.12)",

  clay: "#C1503A",
  claySoft: "rgba(193, 80, 58, 0.12)",

  white: "#FFFFFF",
} as const;

// Cada tipo de contrato tiene un color fijo que se usa consistentemente
// en tarjetas, mapa y detalle — el color siempre comunica lo mismo.
export const contractTypeColors: Record<string, { solid: string; soft: string; label: string }> = {
  temporal: { solid: colors.amber, soft: colors.amberSoft, label: "Temporal" },
  fijo: { solid: colors.green, soft: colors.greenSoft, label: "Fijo" },
  horas: { solid: colors.slate, soft: colors.slateSoft, label: "Por horas" },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 40,
};

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 22,
  pill: 999,
};

export const type = {
  eyebrow: {
    fontSize: 11,
    fontWeight: "700" as const,
    letterSpacing: 1.4,
    textTransform: "uppercase" as const,
  },
  display: {
    fontSize: 30,
    fontWeight: "800" as const,
    letterSpacing: -0.4,
    color: colors.ink,
  },
  h1: {
    fontSize: 23,
    fontWeight: "800" as const,
    color: colors.ink,
  },
  h2: {
    fontSize: 17,
    fontWeight: "700" as const,
    color: colors.ink,
  },
  body: {
    fontSize: 15,
    fontWeight: "400" as const,
    lineHeight: 21,
    color: colors.ink,
  },
  bodyStrong: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: colors.ink,
  },
  caption: {
    fontSize: 12,
    fontWeight: "500" as const,
    color: colors.inkMuted,
  },
  label: {
    fontSize: 13,
    fontWeight: "700" as const,
    letterSpacing: 0.2,
    color: colors.ink,
  },
};