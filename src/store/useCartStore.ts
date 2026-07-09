import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Coupon } from './useAdminStore'

export interface CartItem {
    id: string // format: 'prodId-option' to distinguish sizes/packs
    productId: string
    name: string
    type: 'seed' | 'merch'
    image: string
    price: number
    quantity: number
    optionSelected: string // e.g. "3-Pack", "M"
    maxStock: number
}

interface CartState {
    items: CartItem[]
    coupon: Coupon | null
    shippingCost: number

    // Actions
    addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void

    // Coupon Actions
    applyCoupon: (coupon: Coupon) => void
    removeCoupon: () => void

    // Math Selectors
    getSubtotal: () => number
    getDiscountAmount: () => number
    getTotal: () => number
    getItemCount: () => number
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            coupon: null,
            shippingCost: 0,

            addItem: (newItem, quantity = 1) => {
                const items = get().items
                const existingIndex = items.findIndex((x) => x.id === newItem.id)

                if (existingIndex > -1) {
                    const currentQty = items[existingIndex].quantity
                    const targetQty = Math.min(currentQty + quantity, newItem.maxStock)
                    const updated = [...items]
                    updated[existingIndex] = { ...updated[existingIndex], quantity: targetQty }
                    set({ items: updated })
                } else {
                    const targetQty = Math.min(quantity, newItem.maxStock)
                    set({ items: [...items, { ...newItem, quantity: targetQty }] })
                }
            },

            removeItem: (id) => {
                set({ items: get().items.filter((x) => x.id !== id) })
            },

            updateQuantity: (id, quantity) => {
                const items = get().items
                const index = items.findIndex((x) => x.id === id)
                if (index > -1) {
                    const targetQty = Math.max(1, Math.min(quantity, items[index].maxStock))
                    const updated = [...items]
                    updated[index] = { ...updated[index], quantity: targetQty }
                    set({ items: updated })
                }
            },

            clearCart: () => set({ items: [], coupon: null }),

            applyCoupon: (coupon) => {
                const subtotal = get().getSubtotal()
                if (subtotal >= coupon.minPurchase) {
                    set({ coupon })
                }
            },

            removeCoupon: () => set({ coupon: null }),

            getSubtotal: () => {
                return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0)
            },

            getDiscountAmount: () => {
                const coupon = get().coupon
                if (!coupon) return 0
                const subtotal = get().getSubtotal()
                if (coupon.type === 'percentage') {
                    return Number(((subtotal * coupon.value) / 100).toFixed(2))
                } else {
                    return Math.min(coupon.value, subtotal)
                }
            },

            getTotal: () => {
                const subtotal = get().getSubtotal()
                const discount = get().getDiscountAmount()
                return Math.max(0, subtotal - discount + get().shippingCost)
            },

            getItemCount: () => {
                return get().items.reduce((sum, item) => sum + item.quantity, 0)
            },
        }),
        {
            name: 'jelly-cart-store',
        }
    )
)
