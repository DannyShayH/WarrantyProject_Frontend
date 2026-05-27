import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Backdrop, Field, Input, TextArea, PillButton, SectionHeader, RequireLogin } from '../components/ui'
import pageStyles from './Page.module.css'
import styles from './PageRegister.module.css'

export default function PageRegister(){
    const { go } = useOutletContext()
    const { user, addProduct } = useAuth()

    const [title, setTitle] = useState('')
    const [purchased, setPurchased] = useState('')
    const [retailer, setRetailer] = useState('')
    const [orderNumber, setOrderNumber] = useState('')
    const [price, setPrice] = useState('')
    const [notes, setNotes] = useState('')
    const [errors, setErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)
    const [warrantyMonths, setWarrantyMonths] = useState('')

    if(!user) return <RequireLogin go={go} />

    const submit = (submit) => { 
        submit.preventDefault()
        const err = {}
        if(!title.trim()) err.title = 'product title is required'
        if(!purchased) err.purchased = 'purchase date is required'
        if(!warrantyMonths) err.warrantyMonths = 'warranty duration is required'
        else if (parseInt(warrantyMonths) <= 0) err.warrantyMonths = 'must be at least 1 month'
        else if (!Number.isInteger(Number(warrantyMonths))) err.warrantyMonths = 'must be a whole number e.g 1'
        setErrors(err)
        if (Object.keys(err).length) return
        setSubmitting(true)
        setTimeout(() => {
            addProduct({productName: title, purchased, warrantyMonths: parseInt(warrantyMonths), retailer, orderNumber, price, notes })
            go('profile')
        }, 400)
    }

    return (
        <>
        <div className={pageStyles.page} data-screen="register">
            <Backdrop variant="soft" />
            <main className={pageStyles.main} style={{ maxWidth: 1300 }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
                    <div>
                        <div style={{ fontFamily: 'var(--font)', fontSize: 14, color: 'var(--ink-faint)', letterSpacing: 1, textTransform: 'uppercase' }}>
                            step 1 of 1
                        </div>
                        <h1 style={{ fontFamily: 'var(--font)', fontSize: 56, color: '#fff', margin: '8px 0 0', lineHeight: 1.05, fontWeight: 500 }}>
                            register a product
                        </h1>
                        <p style={{ fontFamily: 'var(--font)', fontSize: 18, color: 'var(--ink-dim)', margin: '12px 0 0', maxWidth: 640 }}>
                            add the basics and we'll ping you 30 days before it runs out
                        </p>
                    </div>
                    <PillButton variant="ghost" onClick={() => go('profile')}>← back</PillButton>
                </div>

                <form onSubmit={submit} className={styles.formCard}>

                    <SectionHeader num="1" title="product details" />

                    <Field label="product title" required error={errors.title} hint="e.g. Sony WH-1000XM5 Headphones">
                        <Input value={title} onChange={setTitle} placeholder="what did you buy?" error={errors.title} />
                    </Field>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <Field label="purchase date" required error={errors.purchased}>
                            <Input type="date" value={purchased} onChange={setPurchased} error={errors.purchased} />
                        </Field>
                        <Field label="warranty duration (months)" required error={errors.warrantyMonths}>
                        <Input type="number" value={warrantyMonths} onChange={setWarrantyMonths} placeholder="e.g. 24" />
                    </Field>
                    </div>

                    <SectionHeader num="2" title="receipt info" subtitle="optional - but super useful for claims" />

                    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 0.8fr', gap: 16 }}>
                        <Field label="retailer / store">
                            <Input value={retailer} onChange={setRetailer} placeholder="Best Buy, Amazon, Apple..." />
                        </Field>
                        <Field label="order / receipt #">
                            <Input value={orderNumber} onChange={setOrderNumber} placeholder="e.g 112-3456789" />
                        </Field>
                        <Field label="price paid">
                            <Input value={price} onChange={setPrice} placeholder="$0.00" />
                        </Field>
                    </div>

                    <Field label="notes" hint="serial number, model, anything useful">
                        <TextArea value={notes} onChange={setNotes} placeholder="serial #, model, where you stored the box..." rows={3} />
                    </Field>

                    <div className={styles.tipBox}>
                        <strong style={{ color: 'var(--green-b)' }}>tip:</strong> most warranties run 1-2 years.
                        check the receipt or product page if unsure.
                    </div>

                    <div style={{ display: 'flex', gap: 12, marginTop: 4, justifyContent: 'flex-end' }}>
                        <PillButton variant="ghost" onClick={() => go('profile')}>cancel</PillButton>
                        <PillButton type="submit" disabled={submitting}>
                            {submitting ? 'saving...' : 'register product'}
                        </PillButton>
                    </div>
                </form>
            </main>
        </div>
        </>
    )
}