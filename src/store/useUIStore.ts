import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  ageVerified: boolean
  mobileMenuOpen: boolean
  cartDrawerOpen: boolean
  isPortalOpen: boolean
  hasOpenedPack: boolean
  setAgeVerified: (verified: boolean) => void
  toggleMobileMenu: () => void
  closeMobileMenu: () => void
  toggleCartDrawer: () => void
  closeCartDrawer: () => void
  setIsPortalOpen: (open: boolean) => void
  setHasOpenedPack: (opened: boolean) => void
  resetPackOpening: () => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      ageVerified: false,
      mobileMenuOpen: false,
      cartDrawerOpen: false,
      isPortalOpen: false,
      hasOpenedPack: false,
      setAgeVerified: (verified) => set({ ageVerified: verified }),
      toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
      closeMobileMenu: () => set({ mobileMenuOpen: false }),
      toggleCartDrawer: () => set((state) => ({ cartDrawerOpen: !state.cartDrawerOpen })),
      closeCartDrawer: () => set({ cartDrawerOpen: false }),
      setIsPortalOpen: (open) => set({ isPortalOpen: open }),
      setHasOpenedPack: (opened) => set({ hasOpenedPack: opened, isPortalOpen: opened }),
      resetPackOpening: () => set({ hasOpenedPack: false, isPortalOpen: false }),
    }),
    {
      name: 'jelly-ui-storage',
      partialize: (state) => ({
        ageVerified: state.ageVerified,
        hasOpenedPack: state.hasOpenedPack,
        isPortalOpen: state.hasOpenedPack,
      }),
    }
  )
)

