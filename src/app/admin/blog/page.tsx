'use client'

import { useState, useEffect } from 'react'
import { useAdminStore, type BlogPost } from '@/store/useAdminStore'
import styles from '../admin.module.css'

const CATEGORIES = ['Cultivo', 'Genéticas', 'Ciencia', 'Comunidad']
const COLORS = ['#00FF88', '#FFD700', '#8B5CF6', '#FF6B35', '#3B82F6']

const EMPTY: Omit<BlogPost, 'id'> = {
    slug: '', title: '', excerpt: '', content: '', category: 'Cultivo',
    featured: false, status: 'draft', date: new Date().toISOString().split('T')[0],
    readTime: '5 min', color: '#00FF88', image: '',
}

export default function AdminBlogPage() {
    const { posts, addPost, updatePost, deletePost, fetchBlog } = useAdminStore()
    const [modalOpen, setModalOpen] = useState(false)
    const [editId, setEditId] = useState<string | null>(null)
    const [form, setForm] = useState(EMPTY)
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

    useEffect(() => {
        fetchBlog()
    }, [fetchBlog])

    const openCreate = () => { setEditId(null); setForm(EMPTY); setModalOpen(true) }
    const openEdit = (p: BlogPost) => { setEditId(p.id); setForm({ ...EMPTY, ...p }); setModalOpen(true) }

    const handleSave = () => {
        if (!form.title) return
        const slug = form.slug || form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        if (editId) {
            updatePost(editId, { ...form, slug })
        } else {
            addPost({ ...form, slug, id: Date.now().toString() })
        }
        setModalOpen(false)
    }

    return (
        <>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Blog</h1>
                    <p className={styles.pageSubtitle}>{posts.length} artículos</p>
                </div>
                <button className={styles.addBtn} onClick={openCreate}>+ Nuevo Artículo</button>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead><tr><th>Título</th><th>Categoría</th><th>Estado</th><th>Destacado</th><th>Fecha</th><th>Acciones</th></tr></thead>
                    <tbody>
                        {posts.map((p) => (
                            <tr key={p.id}>
                                <td style={{ fontWeight: 600, color: 'var(--text-primary)', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</td>
                                <td><span className={`${styles.badge} ${styles.badgePurple}`}>{p.category}</span></td>
                                <td><span className={`${styles.badge} ${p.status === 'published' ? styles.badgeGreen : styles.badgeGray}`}>{p.status === 'published' ? 'Publicado' : 'Borrador'}</span></td>
                                <td><button className={`${styles.toggle} ${p.featured ? styles.toggleActive : ''}`} onClick={() => updatePost(p.id, { featured: !p.featured })} /></td>
                                <td style={{ color: 'var(--text-muted)' }}>{p.date}</td>
                                <td>
                                    <div className={styles.actions}>
                                        <button className={styles.actionBtn} onClick={() => openEdit(p)}>Editar</button>
                                        <button className={`${styles.actionBtn} ${styles.actionBtnDanger}`} onClick={() => setDeleteConfirm(p.id)}>Eliminar</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {posts.length === 0 && <div className={styles.emptyState}><div className={styles.emptyIcon}>📝</div><p>No hay artículos. Creá el primero.</p></div>}
            </div>

            {deleteConfirm && (
                <div className={styles.modalOverlay} onClick={() => setDeleteConfirm(null)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()} style={{ maxWidth: 400, textAlign: 'center' }}>
                        <h3 className={styles.modalTitle}>¿Eliminar artículo?</h3>
                        <p style={{ color: 'var(--text-tertiary)', margin: 'var(--space-4) 0' }}>Esta acción no se puede deshacer.</p>
                        <div className={styles.formActions} style={{ justifyContent: 'center' }}>
                            <button className={styles.cancelBtn} onClick={() => setDeleteConfirm(null)}>Cancelar</button>
                            <button className={styles.saveBtn} style={{ background: '#ef4444' }} onClick={() => { deletePost(deleteConfirm); setDeleteConfirm(null) }}>Eliminar</button>
                        </div>
                    </div>
                </div>
            )}

            {modalOpen && (
                <div className={styles.modalOverlay} onClick={() => setModalOpen(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>{editId ? 'Editar' : 'Nuevo'} Artículo</h3>
                            <button className={styles.modalClose} onClick={() => setModalOpen(false)}>✕</button>
                        </div>
                        <div className={styles.formGrid}>
                            <div className={`${styles.formField} ${styles.formFieldFull}`}>
                                <label className={styles.formLabel}>Título</label>
                                <input className={styles.formInput} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Título del artículo" />
                            </div>
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>Categoría</label>
                                <select className={`${styles.formInput} ${styles.formSelect}`} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>Estado</label>
                                <select className={`${styles.formInput} ${styles.formSelect}`} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as BlogPost['status'] })}>
                                    <option value="draft">Borrador</option>
                                    <option value="published">Publicado</option>
                                </select>
                            </div>
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>Tiempo de lectura</label>
                                <input className={styles.formInput} value={form.readTime} onChange={(e) => setForm({ ...form, readTime: e.target.value })} placeholder="5 min" />
                            </div>
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>Color</label>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    {COLORS.map((c) => (
                                        <button key={c} onClick={() => setForm({ ...form, color: c })} style={{
                                            width: 28, height: 28, borderRadius: '50%', background: c, border: form.color === c ? '2px solid white' : '2px solid transparent', cursor: 'pointer',
                                        }} />
                                    ))}
                                </div>
                            </div>
                            <div className={`${styles.formField} ${styles.formFieldFull}`}>
                                <label className={styles.formLabel}>Imagen de Portada (URL o /ruta)</label>
                                <input className={styles.formInput} value={form.image || ''} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="/poprosabud.png o URL externa" />
                            </div>
                            <div className={`${styles.formField} ${styles.formFieldFull}`}>
                                <label className={styles.formLabel}>Extracto</label>
                                <textarea className={`${styles.formInput} ${styles.formTextarea}`} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="Breve resumen..." style={{ minHeight: 60 }} />
                            </div>
                            <div className={`${styles.formField} ${styles.formFieldFull}`}>
                                <label className={styles.formLabel}>Contenido</label>
                                <textarea className={`${styles.formInput} ${styles.formTextarea}`} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Contenido completo del artículo..." style={{ minHeight: 180 }} />
                            </div>
                        </div>
                        <div className={styles.formActions}>
                            <button className={styles.cancelBtn} onClick={() => setModalOpen(false)}>Cancelar</button>
                            <button className={styles.saveBtn} onClick={handleSave}>{editId ? 'Guardar' : 'Crear Artículo'}</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
