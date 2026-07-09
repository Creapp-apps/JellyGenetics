'use client'

import { useState } from 'react'
import { useAdminStore, type Coupon } from '@/store/useAdminStore'
import styles from '../admin.module.css'

const EMPTY: Omit<Coupon, 'id' | 'createdAt'> = {
    code: '', type: 'percentage', value: 10, minPurchase: 0,
    maxUses: 100, usedCount: 0, expiresAt: '', active: true,
}

export default function AdminCuponesPage() {
    const { coupons, addCoupon, updateCoupon, deleteCoupon } = useAdminStore()
    const [modalOpen, setModalOpen] = useState(false)
    const [editId, setEditId] = useState<string | null>(null)
    const [form, setForm] = useState(EMPTY)
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

    const openCreate = () => { setEditId(null); setForm(EMPTY); setModalOpen(true) }
    const openEdit = (c: Coupon) => { setEditId(c.id); setForm(c); setModalOpen(true) }

    const handleSave = () => {
        if (!form.code) return
        if (editId) {
            updateCoupon(editId, form)
        } else {
            addCoupon({ ...form, id: Date.now().toString(), createdAt: new Date().toISOString().split('T')[0] } as Coupon)
        }
        setModalOpen(false)
    }

    return (
        <>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Cupones</h1>
                    <p className={styles.pageSubtitle}>{coupons.length} cupones</p>
                </div>
                <button className={styles.addBtn} onClick={openCreate}>+ Nuevo Cupón</button>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Descuento</th>
                            <th>Compra Mín.</th>
                            <th>Usos</th>
                            <th>Expira</th>
                            <th>Activo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coupons.map((c) => (
                            <tr key={c.id}>
                                <td style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--brand-amber)', letterSpacing: '0.05em' }}>
                                    {c.code}
                                </td>
                                <td style={{ fontWeight: 600 }}>
                                    {c.type === 'percentage' ? `${c.value}%` : `$${c.value}`}
                                </td>
                                <td>{c.minPurchase > 0 ? `$${c.minPurchase.toLocaleString()}` : '—'}</td>
                                <td>
                                    <span className={`${styles.badge} ${c.usedCount >= c.maxUses ? styles.badgeRed : styles.badgeGray}`}>
                                        {c.usedCount}/{c.maxUses}
                                    </span>
                                </td>
                                <td style={{ color: 'var(--text-muted)' }}>
                                    {c.expiresAt || 'Sin vencimiento'}
                                </td>
                                <td>
                                    <button
                                        className={`${styles.toggle} ${c.active ? styles.toggleActive : ''}`}
                                        onClick={() => updateCoupon(c.id, { active: !c.active })}
                                    />
                                </td>
                                <td>
                                    <div className={styles.actions}>
                                        <button className={styles.actionBtn} onClick={() => openEdit(c)}>Editar</button>
                                        <button className={`${styles.actionBtn} ${styles.actionBtnDanger}`} onClick={() => setDeleteConfirm(c.id)}>Eliminar</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {coupons.length === 0 && <div className={styles.emptyState}><div className={styles.emptyIcon}>🎟️</div><p>No hay cupones. Creá el primero.</p></div>}
            </div>

            {deleteConfirm && (
                <div className={styles.modalOverlay} onClick={() => setDeleteConfirm(null)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()} style={{ maxWidth: 400, textAlign: 'center' }}>
                        <h3 className={styles.modalTitle}>¿Eliminar cupón?</h3>
                        <div className={styles.formActions} style={{ justifyContent: 'center' }}>
                            <button className={styles.cancelBtn} onClick={() => setDeleteConfirm(null)}>Cancelar</button>
                            <button className={styles.saveBtn} style={{ background: '#ef4444' }} onClick={() => { deleteCoupon(deleteConfirm); setDeleteConfirm(null) }}>Eliminar</button>
                        </div>
                    </div>
                </div>
            )}

            {modalOpen && (
                <div className={styles.modalOverlay} onClick={() => setModalOpen(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>{editId ? 'Editar' : 'Nuevo'} Cupón</h3>
                            <button className={styles.modalClose} onClick={() => setModalOpen(false)}>✕</button>
                        </div>
                        <div className={styles.formGrid}>
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>Código</label>
                                <input className={styles.formInput} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="JELLY20" style={{ textTransform: 'uppercase' }} />
                            </div>
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>Tipo</label>
                                <select className={`${styles.formInput} ${styles.formSelect}`} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Coupon['type'] })}>
                                    <option value="percentage">Porcentaje (%)</option>
                                    <option value="fixed">Monto fijo ($)</option>
                                </select>
                            </div>
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>{form.type === 'percentage' ? 'Porcentaje' : 'Monto'}</label>
                                <input type="number" className={styles.formInput} value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} />
                            </div>
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>Compra mínima ($)</label>
                                <input type="number" className={styles.formInput} value={form.minPurchase} onChange={(e) => setForm({ ...form, minPurchase: Number(e.target.value) })} />
                            </div>
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>Usos máximos</label>
                                <input type="number" className={styles.formInput} value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: Number(e.target.value) })} />
                            </div>
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>Fecha de expiración</label>
                                <input type="date" className={styles.formInput} value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
                            </div>
                        </div>
                        <div className={styles.formActions}>
                            <button className={styles.cancelBtn} onClick={() => setModalOpen(false)}>Cancelar</button>
                            <button className={styles.saveBtn} onClick={handleSave}>{editId ? 'Guardar' : 'Crear Cupón'}</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
