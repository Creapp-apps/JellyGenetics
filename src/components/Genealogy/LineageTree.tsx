'use client'

import { motion } from 'framer-motion'
import type { GeneticLineage } from '@/lib/data'
import styles from './LineageTree.module.css'

interface LineageTreeProps {
    lineage: GeneticLineage
    childName: string
    terpeneColor: string
}

export default function LineageTree({ lineage, childName, terpeneColor }: LineageTreeProps) {
    return (
        <div className={styles.tree}>
            {/* Parents row */}
            <div className={styles.parentsRow}>
                <motion.div
                    className={styles.parentNode}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <span className={styles.nodeLabel}>Mother</span>
                    <div className={styles.nodeBox}>
                        <span className={styles.dnaIcon}>♀</span>
                        <span className={styles.nodeName}>{lineage.mother.name}</span>
                    </div>
                </motion.div>

                <div className={styles.crossSymbol}>
                    <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        ×
                    </motion.span>
                </div>

                <motion.div
                    className={styles.parentNode}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <span className={styles.nodeLabel}>Father</span>
                    <div className={styles.nodeBox}>
                        <span className={styles.dnaIcon}>♂</span>
                        <span className={styles.nodeName}>{lineage.father.name}</span>
                    </div>
                </motion.div>
            </div>

            {/* Connection lines */}
            <div className={styles.connections}>
                <motion.div
                    className={styles.lineLeft}
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                />
                <motion.div
                    className={styles.lineHorizontal}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                />
                <motion.div
                    className={styles.lineRight}
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                />
            </div>

            {/* Center vertical line */}
            <motion.div
                className={styles.lineCenter}
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, duration: 0.4 }}
            />

            {/* Child node */}
            <motion.div
                className={styles.childNode}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1, duration: 0.6 }}
            >
                <div
                    className={styles.childBox}
                    style={{
                        borderColor: terpeneColor,
                        boxShadow: `0 0 30px ${terpeneColor}25`,
                    }}
                >
                    <span className={styles.childDna}>🧬</span>
                    <span className={styles.childName}>{childName}</span>
                </div>
            </motion.div>

            {/* DNA helix decoration */}
            <div className={styles.helixDecor}>
                {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className={styles.helixDot}
                        style={{
                            left: `${50 + Math.sin(i * 0.8) * 15}%`,
                            top: `${10 + i * 10}%`,
                            background: i % 2 === 0 ? terpeneColor : 'var(--brand-purple)',
                            opacity: 0.15,
                        }}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 0.15, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                    />
                ))}
            </div>
        </div>
    )
}
