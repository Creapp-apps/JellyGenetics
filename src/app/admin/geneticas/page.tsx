'use client'

import { useState } from 'react'
import { useAdminStore, type Genetic } from '@/store/useAdminStore'
import styles from '../admin.module.css'

const EMPTY_GENETIC: Omit<Genetic, 'id' | 'createdAt'> = {
    slug: '', name: '', type: 'Hybrid', thc: '', cbd: '', terpene: '', terpeneColor: '#00FF88',
    terpenes: [], description: '', effects: [], floweringTime: '', yield: '', difficulty: 'Medium',
    seedType: 'fem', lineage: { mother: '', father: '' }, packs: [{ size: '3-Pack', price: 0, stock: 0 }],
    featured: false, soldout: false,
}

export default function AdminGeneticasPage() {
    const { genetics, addGenetic, updateGenetic, deleteGenetic } = useAdminStore()
    const [modalOpen, setModalOpen] = useState(false)
    const [editId, setEditId] = useState<string | null>(null)
    const [form, setForm] = useState(EMPTY_GENETIC)
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

    const openCreate = () => {
        setEditId(null)
        setForm(EMPTY_GENETIC)
        setModalOpen(true)
    }

    const openEdit = (g: Genetic) => {
        setEditId(g.id)
        setForm(g)
        setModalOpen(true)
    }

    const handleSave = () => {
        if (!form.name || !form.slug) return
        if (editId) {
            updateGenetic(editId, form)
        } else {
            addGenetic({ ...form, id: Date.now().toString(), createdAt: new Date().toISOString().split('T')[0] } as Genetic)
        }
        setModalOpen(false)
    }

    const handleDelete = (id: string) => {
        deleteGenetic(id)
        setDeleteConfirm(null)
    }

    const updateField = <K extends keyof typeof form>(field: K, value: (typeof form)[K]) =>
        setForm((prev) => ({ ...prev, [field]: value }))

    return (
        <>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Genéticas</h1>
                    <p className={styles.pageSubtitle}>{genetics.length} genéticas registradas</p>
                </div>
                <button className={styles.addBtn} onClick={openCreate}>+ Nueva Genética</button>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Tipo</th>
                            <th>THC</th>
                            <th>Terpeno</th>
                            <th>Precio</th>
                            <th>Destacada</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {genetics.map((g) => (
                            <tr key={g.id}>
                                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{g.name}</td>
                                <td>
                                    <span className={`${styles.badge} ${g.type === 'Indica' ? styles.badgePurple : g.type === 'Sativa' ? styles.badgeYellow : styles.badgeGreen}`}>
                                        {g.type}
                                    </span>
                                </td>
                                <td>{g.thc}</td>
                                <td>
                                    <span className={styles.colorDot} style={{ background: g.terpeneColor }} />
                                    {g.terpene}
                                </td>
                                <td>${g.packs[0]?.price.toLocaleString() || '—'}</td>
                                <td>
                                    <button
                                        className={`${styles.toggle} ${g.featured ? styles.toggleActive : ''}`}
                                        onClick={() => updateGenetic(g.id, { featured: !g.featured })}
                                    />
                                </td>
                                <td>
                                    {g.soldout ? (
                                        <span className={`${styles.badge} ${styles.badgeRed}`}>Agotado</span>
                                    ) : (
                                        <span className={`${styles.badge} ${styles.badgeGreen}`}>Disponible</span>
                                    )}
                                </td>
                                <td>
                                    <div className={styles.actions}>
                                        <button className={styles.actionBtn} onClick={() => openEdit(g)}>Editar</button>
                                        <button className={`${styles.actionBtn} ${styles.actionBtnDanger}`} onClick={() => setDeleteConfirm(g.id)}>
                                            Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {genetics.length === 0 && (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>🧬</div>
                        <p>No hay genéticas. Creá la primera.</p>
                    </div>
                )}
            </div>

            {/* Delete Confirm */}
            {deleteConfirm && (
                <div className={styles.modalOverlay} onClick={() => setDeleteConfirm(null)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()} style={{ maxWidth: 400, textAlign: 'center' }}>
                        <h3 className={styles.modalTitle}>¿Eliminar genética?</h3>
                        <p style={{ color: 'var(--text-tertiary)', margin: 'var(--space-4) 0' }}>Esta acción no se puede deshacer.</p>
                        <div className={styles.formActions} style={{ justifyContent: 'center' }}>
                            <button className={styles.cancelBtn} onClick={() => setDeleteConfirm(null)}>Cancelar</button>
                            <button className={styles.saveBtn} style={{ background: '#ef4444' }} onClick={() => handleDelete(deleteConfirm)}>
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create/Edit Modal */}
            {modalOpen && (
                <div className={styles.modalOverlay} onClick={() => setModalOpen(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>{editId ? 'Editar' : 'Nueva'} Genética</h3>
                            <button className={styles.modalClose} onClick={() => setModalOpen(false)}>✕</button>
                        </div>

                        <div className={styles.formGrid}>
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>Nombre</label>
                                <input className={styles.formInput} value={form.name} onChange={(e) => updateField('name', e.target.value)} placeholder="Jupiter Jelly" />
                            </div>
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>Slug</label>
                                <input className={styles.formInput} value={form.slug} onChange={(e) => updateField('slug', e.target.value)} placeholder="jupiter-jelly" />
                            </div>
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>Tipo</label>
                                <select className={`${styles.formInput} ${styles.formSelect}`} value={form.type} onChange={(e) => updateField('type', e.target.value as Genetic['type'])}>
                                    <option value="Indica">Indica</option>
                                    <option value="Sativa">Sativa</option>
                                    <option value="Hybrid">Hybrid</option>
                                </select>
                            </div>
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>Dificultad</label>
                                <select className={`${styles.formInput} ${styles.formSelect}`} value={form.difficulty} onChange={(e) => updateField('difficulty', e.target.value)}>
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                            </div>
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>THC</label>
                                <input className={styles.formInput} value={form.thc} onChange={(e) => updateField('thc', e.target.value)} placeholder="28%" />
                            </div>
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>CBD</label>
                                <input className={styles.formInput} value={form.cbd} onChange={(e) => updateField('cbd', e.target.value)} placeholder="0.5%" />
                            </div>
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>Terpeno Dominante</label>
                                <input className={styles.formInput} value={form.terpene} onChange={(e) => updateField('terpene', e.target.value)} placeholder="Myrcene" />
                            </div>
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>Color del Terpeno</label>
                                <input type="color" className={styles.formInput} value={form.terpeneColor} onChange={(e) => updateField('terpeneColor', e.target.value)} style={{ height: 42, padding: 4 }} />
                            </div>
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>Floración</label>
                                <input className={styles.formInput} value={form.floweringTime} onChange={(e) => updateField('floweringTime', e.target.value)} placeholder="56-63d" />
                            </div>
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>Rendimiento</label>
                                <input className={styles.formInput} value={form.yield} onChange={(e) => updateField('yield', e.target.value)} placeholder="500-600 g/m²" />
                            </div>
                            <div className={`${styles.formField} ${styles.formFieldFull}`}>
                                <label className={styles.formLabel}>Descripción</label>
                                <textarea className={`${styles.formInput} ${styles.formTextarea}`} value={form.description} onChange={(e) => updateField('description', e.target.value)} placeholder="Descripción de la genética..." />
                            </div>
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>Madre</label>
                                <input className={styles.formInput} value={form.lineage.mother} onChange={(e) => updateField('lineage', { ...form.lineage, mother: e.target.value })} placeholder="Jelly Cake" />
                            </div>
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>Padre</label>
                                <input className={styles.formInput} value={form.lineage.father} onChange={(e) => updateField('lineage', { ...form.lineage, father: e.target.value })} placeholder="Jupiter OG" />
                            </div>
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>Precio (3-Pack)</label>
                                <input type="number" className={styles.formInput} value={form.packs[0]?.price || 0} onChange={(e) => updateField('packs', [{ ...form.packs[0], size: '3-Pack', price: Number(e.target.value) }])} />
                            </div>
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>Stock</label>
                                <input type="number" className={styles.formInput} value={form.packs[0]?.stock || 0} onChange={(e) => updateField('packs', [{ ...form.packs[0], size: '3-Pack', stock: Number(e.target.value) }])} />
                            </div>
                        </div>

                        <div className={styles.formActions}>
                            <button className={styles.cancelBtn} onClick={() => setModalOpen(false)}>Cancelar</button>
                            <button className={styles.saveBtn} onClick={handleSave}>
                                {editId ? 'Guardar Cambios' : 'Crear Genética'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
