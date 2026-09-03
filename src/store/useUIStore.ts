import { create } from 'zustand'

interface UIState {
  ageVerified: boolean
  mobileMenuOpen: boolean
  cartDrawerOpen: boolean
  isPortalOpen: boolean
  setAgeVerified: (verified: boolean) => void
  toggleMobileMenu: () => void
  closeMobileMenu: () => void
  toggleCartDrawer: () => void
  closeCartDrawer: () => void
  setIsPortalOpen: (open: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  ageVerified: false,
  mobileMenuOpen: false,
  cartDrawerOpen: false,
  isPortalOpen: false,
  setAgeVerified: (verified) => set({ ageVerified: verified }),
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),
  toggleCartDrawer: () => set((state) => ({ cartDrawerOpen: !state.cartDrawerOpen })),
  closeCartDrawer: () => set({ cartDrawerOpen: false }),
  setIsPortalOpen: (open) => set({ isPortalOpen: open }),
}))
