import { create } from "zustand";

export interface MapState {}

export const useMapStore = create<MapState>(() => ({}));
