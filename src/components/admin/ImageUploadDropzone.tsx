'use client'

import React, { useState, useRef, DragEvent, ChangeEvent } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabaseClient'
import styles from './ImageUploadDropzone.module.css'

interface ImageUploadDropzoneProps {
    value?: string
    onChange: (url: string) => void
    label?: string
    bucketName?: string
}

export function ImageUploadDropzone({
    value,
    onChange,
    label = 'Foto del Producto',
    bucketName = 'products',
}: ImageUploadDropzoneProps) {
    const [isDragging, setIsDragging] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [fileName, setFileName] = useState<string>('')
    const fileInputRef = useRef<HTMLInputElement>(null)

    const processFile = async (file: File) => {
        if (!file || !file.type.startsWith('image/')) {
            alert('Por favor selecciona un archivo de imagen válido (PNG, JPG, WEBP, etc.)')
            return
        }

        setFileName(file.name)
        setUploading(true)

        try {
            // 1. Try to upload to Supabase Storage if available
            if (supabase) {
                const fileExt = file.name.split('.').pop() || 'png'
                const filePath = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`

                const { data, error } = await supabase.storage
                    .from(bucketName)
                    .upload(filePath, file, { cacheControl: '3600', upsert: true })

                if (!error && data?.path) {
                    const { data: publicUrlData } = supabase.storage
                        .from(bucketName)
                        .getPublicUrl(data.path)

                    if (publicUrlData?.publicUrl) {
                        onChange(publicUrlData.publicUrl)
                        setUploading(false)
                        return
                    }
                }
            }

            // 2. Fallback: Base64 Data URL (guarantees preview and storage without bucket setup)
            const reader = new FileReader()
            reader.onload = () => {
                if (typeof reader.result === 'string') {
                    onChange(reader.result)
                }
                setUploading(false)
            }
            reader.onerror = () => {
                console.error('Error reading file as data URL')
                setUploading(false)
            }
            reader.readAsDataURL(file)
        } catch (err) {
            console.error('Upload error fallback:', err)
            // Fallback to base64
            const reader = new FileReader()
            reader.onload = () => {
                if (typeof reader.result === 'string') {
                    onChange(reader.result)
                }
                setUploading(false)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0]
            processFile(file)
        }
    }

    const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]
            processFile(file)
        }
    }

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation()
        onChange('')
        setFileName('')
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleTriggerBrowse = () => {
        fileInputRef.current?.click()
    }

    return (
        <div className={styles.container}>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className={styles.hiddenInput}
                onChange={handleFileInputChange}
            />

            {value ? (
                /* Preview State */
                <div className={styles.previewWrapper}>
                    <div className={styles.previewImageContainer}>
                        {value.startsWith('http') || value.startsWith('/') || value.startsWith('data:') ? (
                            <img
                                src={value}
                                alt="Vista previa del producto"
                                className={styles.previewImg}
                            />
                        ) : (
                            <div className={styles.iconWrapper}>🖼️</div>
                        )}
                    </div>
                    <div className={styles.previewInfo}>
                        <div className={styles.previewTitle}>
                            {fileName || 'Imagen del producto cargada'}
                        </div>
                        <div className={styles.previewMeta}>
                            Listo para mostrarse en la tienda
                        </div>
                        <div className={styles.previewActions}>
                            <button
                                type="button"
                                className={styles.changeBtn}
                                onClick={handleTriggerBrowse}
                            >
                                🔄 Cambiar Foto
                            </button>
                            <button
                                type="button"
                                className={styles.deleteBtn}
                                onClick={handleRemove}
                            >
                                🗑️ Eliminar Foto
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                /* Drag & Drop State */
                <div
                    className={`${styles.dropzone} ${isDragging ? styles.dropzoneActive : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={handleTriggerBrowse}
                >
                    {uploading ? (
                        <div className={styles.loadingOverlay}>
                            <span>⏳ Subiendo imagen...</span>
                        </div>
                    ) : (
                        <>
                            <div className={styles.iconWrapper}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="17 8 12 3 7 8" />
                                    <line x1="12" y1="3" x2="12" y2="15" />
                                </svg>
                            </div>
                            <div className={styles.promptTitle}>
                                Arrastra y suelta una imagen aquí
                            </div>
                            <div className={styles.promptSubtitle}>
                                o haz clic para explorar tus archivos (PNG, JPG, WEBP)
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}
