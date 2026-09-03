'use client'

import Link from 'next/link'
import { useAdminStore } from '@/store/useAdminStore'
import { formatDateTime } from '@/lib/utils'
import styles from '../admin.module.css'

const ORDER_STATUS_BADGE: Record<string, string> = {
    pendiente: styles.badgeYellow,
    pagado: styles.badgeBlue,
    enviado: styles.badgePurple,
    entregado: styles.badgeGreen,
    cancelado: styles.badgeRed,
}

export default function DashboardPage() {
    const genetics = useAdminStore((s) => s.genetics)
    const orders = useAdminStore((s) => s.orders)
    const posts = useAdminStore((s) => s.posts)
    const coupons = useAdminStore((s) => s.coupons)

    const totalRevenue = orders
        .filter((o) => o.status !== 'cancelado')
        .reduce((sum, o) => sum + o.total, 0)

    const pendingOrders = orders.filter((o) => o.status === 'pendiente').length

    return (
        <>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Dashboard</h1>
                    <p className={styles.pageSubtitle}>Visión general de tu tienda</p>
                </div>
            </div>

            {/* Stats */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Genéticas</span>
                    <span className={`${styles.statValue} ${styles.statAccent}`}>{genetics.length}</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Pedidos Totales</span>
                    <span className={styles.statValue}>{orders.length}</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Ingresos</span>
                    <span className={`${styles.statValue} ${styles.statAccent}`}>
                        ${totalRevenue.toLocaleString()}
                    </span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Pendientes</span>
                    <span className={styles.statValue} style={{ color: pendingOrders > 0 ? '#FFD700' : undefined }}>
                        {pendingOrders}
                    </span>
                </div>
            </div>

            {/* Recent Orders */}
            <div className={styles.pageHeader} style={{ marginBottom: 'var(--space-4)' }}>
                <h2 className={styles.pageTitle} style={{ fontSize: 'var(--text-lg)' }}>
                    Pedidos Recientes
                </h2>
                <Link href="/admin/pedidos" className={styles.addBtn}>
                    Ver Todos →
                </Link>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Pedido</th>
                            <th>Cliente</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.slice(0, 5).map((order) => (
                            <tr key={order.id}>
                                <td style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>
                                    {order.orderNumber}
                                </td>
                                <td>{order.customerName}</td>
                                <td>${order.total.toLocaleString()} MXN</td>
                                <td>
                                    <span className={`${styles.badge} ${ORDER_STATUS_BADGE[order.status] || ''}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap', fontSize: '12px' }}>
                                    {formatDateTime(order.date)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Quick Actions */}
            <div style={{ marginTop: 'var(--space-8)' }}>
                <h2 className={styles.pageTitle} style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-4)' }}>
                    Acciones Rápidas
                </h2>
                <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                    <Link href="/admin/geneticas" className={styles.addBtn}>🧬 Nueva Genética</Link>
                    <Link href="/admin/blog" className={styles.addBtn} style={{ background: '#8B5CF6' }}>📝 Nuevo Artículo</Link>
                    <Link href="/admin/cupones" className={styles.addBtn} style={{ background: '#FFD700', color: '#000' }}>🎟️ Nuevo Cupón</Link>
                </div>
            </div>
        </>
    )
}
