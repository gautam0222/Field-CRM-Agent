"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Visit } from "@/types/visit"

// Fix default marker icons broken by webpack
const icon = L.icon({
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize:    [25, 41],
  iconAnchor:  [12, 41],
  popupAnchor: [1, -34],
})

// Zone centre coords for Maharashtra
const ZONE_COORDS: Record<string, [number, number]> = {
  "Mumbai North":  [19.2183, 72.9781],
  "Mumbai South":  [18.9322, 72.8264],
  "Pune":          [18.5204, 73.8567],
  "Nashik":        [19.9975, 73.7898],
  "Nagpur":        [21.1458, 79.0882],
  "Aurangabad":    [19.8762, 75.3433],
}

function FitBounds({ coords }: { coords: [number, number][] }) {
  const map = useMap()
  useEffect(() => {
    if (coords.length > 0) {
      map.fitBounds(coords, { padding: [40, 40] })
    }
  }, [coords, map])
  return null
}

interface Props {
  visits: (Visit & { zone?: string })[]
  zones:  string[]
}

export function TerritoryMap({ visits, zones }: Props) {
  // Build marker data — use zone coords since we don't store lat/lng per visit
  const markers = zones.map((zone) => ({
    zone,
    coords:      ZONE_COORDS[zone] ?? [19.076, 72.877],
    visitCount:  visits.filter((v) => v.rep?.zone === zone).length,
  }))

  const allCoords = markers.map((m) => m.coords)

  return (
    <MapContainer
      center={[19.076, 72.877]}
      zoom={6}
      className="w-full h-full rounded-xl"
      style={{ minHeight: "420px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FitBounds coords={allCoords} />

      {markers.map((m) => (
        <Marker key={m.zone} position={m.coords} icon={icon}>
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">{m.zone}</p>
              <p className="text-zinc-500">{m.visitCount} visits logged</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}