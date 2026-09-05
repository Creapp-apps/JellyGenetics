'use client'

import { useState, useEffect } from 'react'
import { useAdminStore, type FAQItem } from '@/store/useAdminStore'
import styles from '../admin.module.css'

const CATEGORIES = ['Genéticas & Semillas', 'Envíos & Entregas', 'Pagos & Facturación', 'Cultivo & Soporte']

const EMPTY: Omit<FAQItem, 'id'> = { question: '', answer: '', category: CATEGORIES[0], order: 0 }

export default function AdminFaqsPage() {
    const { faqs, addFaq, updateFaq, deleteFaq, fetchFaqs } = useAdminStore()
    const [modalOpen, setModalOpen] = useState(false)
    const [editId, setEditId] = useState<string | null>(null)
    const [form, setForm] = useState(EMPTY)
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

    useEffect(() => {
        fetchFaqs()
    }, [fetchFaqs])

    const openCreate = () => { setEditId(null); setForm({ ...EMPTY, order: faqs.length }); setModalOpen(true) }
    const openEdit = (f: FAQItem) => { setEditId(f.id); setForm(f); setModalOpen(true) }

    const handleSave = () => {
        if (!form.question || !form.answer) return
        if (editId) {
            updateFaq(editId, form)
        } else {
            addFaq({ ...form, id: Date.now().toString() })
        }
        setModalOpen(false)
    }

    const grouped = CATEGORIES.map((cat) => ({
        category: cat,
        items: faqs.filter((f) => f.category === cat),
    })).filter((g) => g.items.length > 0)

    return (
        <>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>FAQs</h1>
                    <p className={styles.pageSubtitle}>{faqs.length} preguntas en {grouped.length} categorías</p>
                </div>
                <button className={styles.addBtn} onClick={openCreate}>+ Nueva Pregunta</button>
            </div>

            {grouped.length === 0 && (
                <div className={styles.tableWrapper}>
                    <div className={styles.emptyState}><div className={styles.emptyIcon}>❓</div><p>No hay FAQs. Creá la primera.</p></div>
                </div>
            )}

            {grouped.map((group) => (
                <div key={group.category} style={{ marginBottom: 'var(--space-6)' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontWeight: 600, marginBottom: 'var(--space-3)', color: 'var(--text-secondary)' }}>
                        {group.category}
                    </h3>
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead><tr><th>Pregunta</th><th>Acciones</th></tr></thead>
                            <tbody>
                                {group.items.map((f) => (
                                    <tr key={f.id}>
                                        <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{f.question}</td>
                                        <td>
                                            <div className={styles.actions}>
                                                <button className={styles.actionBtn} onClick={() => openEdit(f)}>Editar</button>
                                                <button className={`${styles.actionBtn} ${styles.actionBtnDanger}`} onClick={() => setDeleteConfirm(f.id)}>Eliminar</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}

            {deleteConfirm && (
                <div className={styles.modalOverlay} onClick={() => setDeleteConfirm(null)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()} style={{ maxWidth: 400, textAlign: 'center' }}>
                        <h3 className={styles.modalTitle}>¿Eliminar pregunta?</h3>
                        <div className={styles.formActions} style={{ justifyContent: 'center' }}>
                            <button className={styles.cancelBtn} onClick={() => setDeleteConfirm(null)}>Cancelar</button>
                            <button className={styles.saveBtn} style={{ background: '#ef4444' }} onClick={() => { deleteFaq(deleteConfirm); setDeleteConfirm(null) }}>Eliminar</button>
                        </div>
                    </div>
                </div>
            )}

            {modalOpen && (
                <div className={styles.modalOverlay} onClick={() => setModalOpen(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>{editId ? 'Editar' : 'Nueva'} Pregunta</h3>
                            <button className={styles.modalClose} onClick={() => setModalOpen(false)}>✕</button>
                        </div>
                        <div className={styles.formGrid}>
                            <div className={`${styles.formField} ${styles.formFieldFull}`}>
                                <label className={styles.formLabel}>Categoría</label>
                                <select className={`${styles.formInput} ${styles.formSelect}`} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className={`${styles.formField} ${styles.formFieldFull}`}>
                                <label className={styles.formLabel}>Pregunta</label>
                                <input className={styles.formInput} value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} placeholder="¿Cuál es la tasa de germinación?" />
                            </div>
                            <div className={`${styles.formField} ${styles.formFieldFull}`}>
                                <label className={styles.formLabel}>Respuesta</label>
                                <textarea className={`${styles.formInput} ${styles.formTextarea}`} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} placeholder="Respuesta detallada..." style={{ minHeight: 120 }} />
                            </div>
                        </div>
                        <div className={styles.formActions}>
                            <button className={styles.cancelBtn} onClick={() => setModalOpen(false)}>Cancelar</button>
                            <button className={styles.saveBtn} onClick={handleSave}>{editId ? 'Guardar' : 'Crear FAQ'}</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
