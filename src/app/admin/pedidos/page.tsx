'use client'

import { useAdminStore, type Order } from '@/store/useAdminStore'
import { formatDateTime } from '@/lib/utils'
import styles from '../admin.module.css'

const STATUS_BADGE: Record<string, string> = {
    pendiente: styles.badgeYellow,
    pagado: styles.badgeBlue,
    enviado: styles.badgePurple,
    entregado: styles.badgeGreen,
    cancelado: styles.badgeRed,
}

const STATUS_FLOW: Order['status'][] = ['pendiente', 'pagado', 'enviado', 'entregado']

export default function AdminPedidosPage() {
    const { orders, updateOrderStatus } = useAdminStore()

    const totalRevenue = orders.filter((o) => o.status !== 'cancelado').reduce((s, o) => s + o.total, 0)

    const nextStatus = (current: Order['status']): Order['status'] | null => {
        const idx = STATUS_FLOW.indexOf(current)
        return idx >= 0 && idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : null
    }

    return (
        <>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Pedidos</h1>
                    <p className={styles.pageSubtitle}>{orders.length} pedidos · ${totalRevenue.toLocaleString()} MXN en ingresos</p>
                </div>
            </div>

            <div className={styles.statsGrid}>
                {(['pendiente', 'pagado', 'enviado', 'entregado'] as const).map((status) => (
                    <div key={status} className={styles.statCard}>
                        <span className={styles.statLabel}>{status}</span>
                        <span className={styles.statValue}>{orders.filter((o) => o.status === status).length}</span>
                    </div>
                ))}
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Pedido</th>
                            <th>Cliente</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Fecha</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => {
                            const next = nextStatus(order.status)
                            return (
                                <tr key={order.id}>
                                    <td style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)' }}>
                                        {order.orderNumber}
                                    </td>
                                    <td>
                                        <div>{order.customerName}</div>
                                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{order.customerEmail}</div>
                                        {order.shippingAddress && (
                                            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, opacity: 0.8, maxWidth: 250, overflowWrap: 'break-word' }}>
                                                📍 {order.shippingAddress}
                                            </div>
                                        )}
                                    </td>
                                    <td style={{ maxWidth: 200 }}>
                                        {order.items.map((item, i) => (
                                            <div key={i} style={{ fontSize: 12 }}>
                                                {item.qty}x {item.name}
                                            </div>
                                        ))}
                                    </td>
                                    <td style={{ fontWeight: 600 }}>${order.total.toLocaleString()}</td>
                                    <td>
                                        <span className={`${styles.badge} ${STATUS_BADGE[order.status] || ''}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap', fontSize: '12px' }}>
                                        {formatDateTime(order.date)}
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            {next && (
                                                <button className={styles.actionBtn} onClick={() => updateOrderStatus(order.id, next)}>
                                                    → {next}
                                                </button>
                                            )}
                                            {order.status !== 'cancelado' && order.status !== 'entregado' && (
                                                <button
                                                    className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                                                    onClick={() => updateOrderStatus(order.id, 'cancelado')}
                                                >
                                                    Cancelar
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                {orders.length === 0 && <div className={styles.emptyState}><div className={styles.emptyIcon}>📦</div><p>No hay pedidos todavía.</p></div>}
            </div>
        </>
    )
}
