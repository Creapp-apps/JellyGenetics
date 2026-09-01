"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { LucideIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import styles from "./tubelight-navbar.module.css"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}

export function NavBar({ items, className }: NavBarProps) {
  const pathname = usePathname()

  return (
    <div className={`${styles.navWrapper} ${className || ""}`}>
      <div className={styles.navContainer}>
        {items.map((item) => {
          const Icon = item.icon
          // Correctly detect active routes, matching exact or subpath (excluding home path matching everything)
          const isActive =
            pathname === item.url ||
            (item.url !== "/" && pathname?.startsWith(item.url))

          return (
            <Link
              key={item.name}
              href={item.url}
              className={`${styles.navLink} ${isActive ? styles.active : ""}`}
            >
              <span className={styles.desktopText}>{item.name}</span>
              <span className={styles.mobileIcon}>
                <Icon size={18} strokeWidth={2.5} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className={styles.lampBg}
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className={styles.lampContainer}>
                    <div className={styles.glow1} />
                    <div className={styles.glow2} />
                    <div className={styles.glow3} />
                  </div>
                </motion.div>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
