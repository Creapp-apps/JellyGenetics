'use client'

import { useState } from 'react'
import { useAdminStore, type MerchItem } from '@/store/useAdminStore'
import { ImageUploadDropzone } from '@/components/admin/ImageUploadDropzone'
import styles from '../admin.module.css'

const CATEGORIES = ['Camisetas', 'Gorras', 'Accesorios', 'Stickers', 'Kits']

const EMPTY: Omit<MerchItem, 'id' | 'createdAt'> = {
    slug: '', name: '', description: '', category: 'Camisetas',
    price: 0, sizes: ['S', 'M', 'L', 'XL'], stock: 0, image: '',
}

export default function AdminMerchPage() {
    const { merch, addMerch, updateMerch, deleteMerch } = useAdminStore()
    const [modalOpen, setModalOpen] = useState(false)
    const [editId, setEditId] = useState<string | null>(null)
    const [form, setForm] = useState(EMPTY)
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

    const openCreate = () => { setEditId(null); setForm(EMPTY); setModalOpen(true) }
    const openEdit = (m: MerchItem) => { setEditId(m.id); setForm(m); setModalOpen(true) }

    const handleSave = () => {
        if (!form.name) return
        const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, '-')
        if (editId) {
            updateMerch(editId, { ...form, slug })
        } else {
            addMerch({ ...form, slug, id: Date.now().toString(), createdAt: new Date().toISOString().split('T')[0] } as MerchItem)
        }
        setModalOpen(false)
    }

    return (
        <>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Merch</h1>
                    <p className={styles.pageSubtitle}>{merch.length} productos</p>
                </div>
                <button className={styles.addBtn} onClick={openCreate}>+ Nuevo Producto</button>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead><tr><th>Foto</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Talles</th><th>Acciones</th></tr></thead>
                    <tbody>
                        {merch.map((m) => (
                            <tr key={m.id}>
                                <td>
                                    <div style={{ width: 40, height: 40, borderRadius: 8, overflow: 'hidden', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.08)' }}>
                                        {m.image ? (
                                            <img src={m.image} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <span style={{ fontSize: 16 }}>👕</span>
                                        )}
                                    </div>
                                </td>
                                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{m.name}</td>
                                <td><span className={`${styles.badge} ${styles.badgePurple}`}>{m.category}</span></td>
                                <td>${m.price.toLocaleString()} MXN</td>
                                <td>{m.stock > 0 ? <span className={`${styles.badge} ${styles.badgeGreen}`}>{m.stock}</span> : <span className={`${styles.badge} ${styles.badgeRed}`}>Agotado</span>}</td>
                                <td style={{ color: 'var(--text-muted)' }}>{m.sizes.join(', ')}</td>
                                <td>
                                    <div className={styles.actions}>
                                        <button className={styles.actionBtn} onClick={() => openEdit(m)}>Editar</button>
                                        <button className={`${styles.actionBtn} ${styles.actionBtnDanger}`} onClick={() => setDeleteConfirm(m.id)}>Eliminar</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {merch.length === 0 && <div className={styles.emptyState}><div className={styles.emptyIcon}>👕</div><p>No hay productos de merch. Creá el primero.</p></div>}
            </div>

            {deleteConfirm && (
                <div className={styles.modalOverlay} onClick={() => setDeleteConfirm(null)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()} style={{ maxWidth: 400, textAlign: 'center' }}>
                        <h3 className={styles.modalTitle}>¿Eliminar producto?</h3>
                        <div className={styles.formActions} style={{ justifyContent: 'center' }}>
                            <button className={styles.cancelBtn} onClick={() => setDeleteConfirm(null)}>Cancelar</button>
                            <button className={styles.saveBtn} style={{ background: '#ef4444' }} onClick={() => { deleteMerch(deleteConfirm); setDeleteConfirm(null) }}>Eliminar</button>
                        </div>
                    </div>
                </div>
            )}

            {modalOpen && (
                <div className={styles.modalOverlay} onClick={() => setModalOpen(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>{editId ? 'Editar' : 'Nuevo'} Producto</h3>
                            <button className={styles.modalClose} onClick={() => setModalOpen(false)}>✕</button>
                        </div>
                        <div className={styles.formGrid}>
                            <div className={`${styles.formField} ${styles.formFieldFull}`}>
                                <label className={styles.formLabel}>Foto del Producto</label>
                                <ImageUploadDropzone
                                    value={form.image}
                                    onChange={(url) => setForm({ ...form, image: url })}
                                    bucketName="merch"
                                />
                            </div>
                            <div className={styles.formField}><label className={styles.formLabel}>Nombre</label><input className={styles.formInput} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Camiseta Jelly" /></div>
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>Categoría</label>
                                <select className={`${styles.formInput} ${styles.formSelect}`} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className={styles.formField}><label className={styles.formLabel}>Precio (MXN)</label><input type="number" className={styles.formInput} value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} /></div>
                            <div className={styles.formField}><label className={styles.formLabel}>Stock</label><input type="number" className={styles.formInput} value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} /></div>
                            <div className={`${styles.formField} ${styles.formFieldFull}`}><label className={styles.formLabel}>Descripción</label><textarea className={`${styles.formInput} ${styles.formTextarea}`} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Descripción del producto..." /></div>
                        </div>
                        <div className={styles.formActions}>
                            <button className={styles.cancelBtn} onClick={() => setModalOpen(false)}>Cancelar</button>
                            <button className={styles.saveBtn} onClick={handleSave}>{editId ? 'Guardar' : 'Crear Producto'}</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
