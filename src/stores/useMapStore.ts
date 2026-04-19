import { create } from "zustand";
import type { Cluster, StateMarker } from "@/lib/types";

export interface MapStats {
  cases: number;
  unsolved: number;
  clusters: number;
}

export interface ReportingBadge {
  state: string | null;
  rate: number | null;
}

export interface MapStoreData {
  stats: MapStats;
  clusters: Cluster[];
  stateMarkers: StateMarker[];
  reporting: ReportingBadge;
  isLoading: boolean;
  isCapped: boolean;
  error: string | null;
  resetSignal: number;
  selectedCluster: Cluster | null;
}

interface MapStoreActions {
  setLoading: (loading: boolean) => void;
  setData: (patch: Partial<MapStoreData>) => void;
  setError: (msg: string | null) => void;
  triggerReset: () => void;
  selectCluster: (cluster: Cluster) => void;
  clearCluster: () => void;
}

export type MapStore = MapStoreData & MapStoreActions;

const INITIAL: MapStoreData = {
  stats: { cases: 0, unsolved: 0, clusters: 0 },
  clusters: [],
  stateMarkers: [],
  reporting: { state: null, rate: null },
  isLoading: false,
  isCapped: false,
  error: null,
  resetSignal: 0,
  selectedCluster: null,
};

export const useMapStore = create<MapStore>((set) => ({
  ...INITIAL,
  setLoading: (isLoading) => set({ isLoading }),
  setData: (patch) => set(patch),
  setError: (error) => set({ error }),
  triggerReset: () =>
    set((s) => ({
      resetSignal: s.resetSignal + 1,
      selectedCluster: null,
    })),
  selectCluster: (cluster) => set({ selectedCluster: cluster }),
  clearCluster: () => set({ selectedCluster: null }),
}));
