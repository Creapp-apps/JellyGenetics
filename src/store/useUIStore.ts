import { create } from 'zustand'

interface UIState {
  ageVerified: boolean
  mobileMenuOpen: boolean
  cartDrawerOpen: boolean
  setAgeVerified: (verified: boolean) => void
  toggleMobileMenu: () => void
  closeMobileMenu: () => void
  toggleCartDrawer: () => void
  closeCartDrawer: () => void
}

export const useUIStore = create<UIState>((set) => ({
  ageVerified: false,
  mobileMenuOpen: false,
  cartDrawerOpen: false,
  setAgeVerified: (verified) => set({ ageVerified: verified }),
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),
  toggleCartDrawer: () => set((state) => ({ cartDrawerOpen: !state.cartDrawerOpen })),
  closeCartDrawer: () => set({ cartDrawerOpen: false }),
}))
