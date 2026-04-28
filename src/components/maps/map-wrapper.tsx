"use client"

import dynamic from "next/dynamic"

export const TerritoryMapDynamic = dynamic(
  () => import("./territory-map").then((m) => m.TerritoryMap),
  { 
    ssr: false, 
    loading: () => <div className="w-full h-105 bg-zinc-100 rounded-xl animate-pulse" /> 
  }
)
