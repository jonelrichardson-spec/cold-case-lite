import { create } from "zustand";
import { MIN_CLUSTER_SIZE } from "@/lib/constants";
import type { Filters, SolvedStatus } from "@/lib/types";

interface FilterActions {
  setState: (state: string | null) => void;
  setVicSex: (v: Filters["vicSex"]) => void;
  setWeapon: (v: Filters["weapon"]) => void;
  setVicRace: (v: Filters["vicRace"]) => void;
  setSolveStatus: (v: SolvedStatus | null) => void;
  setMinClusterSize: (n: number) => void;
  reset: () => void;
}

export interface FilterStore extends Filters, FilterActions {
  minClusterSize: number;
}

const INITIAL: Filters & { minClusterSize: number } = {
  state: null,
  vicSex: null,
  weapon: null,
  vicRace: null,
  solveStatus: null,
  minClusterSize: MIN_CLUSTER_SIZE.default,
};

export const useFilterStore = create<FilterStore>((set) => ({
  ...INITIAL,
  setState: (state) => set({ state }),
  setVicSex: (vicSex) => set({ vicSex }),
  setWeapon: (weapon) => set({ weapon }),
  setVicRace: (vicRace) => set({ vicRace }),
  setSolveStatus: (solveStatus) => set({ solveStatus }),
  setMinClusterSize: (minClusterSize) => set({ minClusterSize }),
  reset: () => set(INITIAL),
}));
