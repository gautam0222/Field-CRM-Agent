import { create } from "zustand"

import type { Visit } from "@/types/visit"

interface VisitState {
  selectedVisit: Visit | null
  setSelectedVisit: (visit: Visit | null) => void
  clearSelectedVisit: () => void
}

export const useVisitStore = create<VisitState>((set) => ({
  selectedVisit: null,
  setSelectedVisit: (visit) => set({ selectedVisit: visit }),
  clearSelectedVisit: () => set({ selectedVisit: null }),
}))
