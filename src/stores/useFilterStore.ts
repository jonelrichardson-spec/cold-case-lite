import { create } from "zustand";

export interface FilterState {}

export const useFilterStore = create<FilterState>(() => ({}));
