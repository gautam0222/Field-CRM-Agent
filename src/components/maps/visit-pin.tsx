import L from "leaflet"

const sentimentColors: Record<string, string> = {
  positive: "#10b981",
  neutral: "#f59e0b",
  negative: "#ef4444",
}

export function createVisitPin(sentiment?: string | null) {
  const color = sentimentColors[sentiment ?? "neutral"] ?? sentimentColors.neutral

  return L.divIcon({
    className: "",
    html: `
      <span style="
        display:block;
        width:16px;
        height:16px;
        border-radius:9999px;
        background:${color};
        border:3px solid white;
        box-shadow:0 4px 12px rgba(24,24,27,.25);
      "></span>
    `,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  })
}
