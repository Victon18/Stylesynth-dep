import {create} from "zustand";

type OverlayState = {
  open: boolean;
  show: () => void;
  hide: () => void;
  toggle: () => void;
};

export const useOverlayLoader = create<OverlayState>((set) => ({
  open: false,
  show: () => set({ open: true }),
  hide: () => set({ open: false }),
  toggle: () => set((s) => ({ open: !s.open })),
}));

export const showOverlay = () => useOverlayLoader.setState({ open: true });
export const hideOverlay = () => useOverlayLoader.setState({ open: false });
export const toggleOverlay = () => useOverlayLoader.getState().toggle();

