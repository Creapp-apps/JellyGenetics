import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatDateTime(dateStr?: string | null): string {
    if (!dateStr) return '-'
    try {
        const date = new Date(dateStr)
        if (isNaN(date.getTime())) return String(dateStr)

        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()

        // If date string only has YYYY-MM-DD without time info
        if (typeof dateStr === 'string' && dateStr.length === 10 && !dateStr.includes('T')) {
            return `${day}/${month}/${year}`
        }

        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')

        return `${day}/${month}/${year} · ${hours}:${minutes} hs`
    } catch {
        return String(dateStr)
    }
}

