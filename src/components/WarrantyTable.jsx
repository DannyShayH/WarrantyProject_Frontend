import { useState, useRef } from 'react'
import { PillButton, Input } from './ui'
import styles from './WarrantyTable.module.css'

function daysBetween(a, b) {
    return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000)
}

function fmtDate(s) {
    if(!s) return '-'
    return new Date(s).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric'})
}

function timeLeft(expires) {
    const days = daysBetween(new Date(), expires)
    if (days < 0) return { text: 'Expired', urgency: 'expired', days}
    if (days < 30) return { text: `${days}d left`, urgency: 'soon', days}
    if (days < 90) return { text: `${days}d left`, urgency: 'warn', days}
    const months = Math.floor(days / 30)
    if (months < 12) return { text: `${months}mo left`, urgency: 'ok', days}
    const years = Math.floor(days / 365)
    const rem = Math.floor((days % 365) / 30)
    return { text: rem ? `${years}y ${rem}mo left` : `${years}y left`, urgency: 'ok', days}
}

const URGENCY_STYLE = {
    expired: { text: 'var(--danger)',   bg: 'rgba(199,80,55,0.14)',   border: 'rgba(199,80,55,0.4)'},
    soon:    { text: 'var(--danger)',   bg: 'rgba(199,80,55,0.14)',   border: 'rgba(199,80,55,0.4)'},
    warn:    { text: 'var(--warn)',     bg: 'rgba(250,184,40,0.14)',  border: 'rgba(250,184,40,0.4)'},
    ok:      { text: 'var(--green-b)', bg: 'rgba(137,222,159,0.14)', border: 'rgba(137,222,159,0.4)'},
}

function ProductDetail({ product, onClose }) {
    const t = timeLeft(product.expires)
    const c = URGENCY_STYLE[t.urgency]
    const [retailer, setRetailer] = useState(product.retailer || '')
    const [orderNumber, setOrderNumber] = useState(product.orderNumber || '')
    const [description, setDescription] = useState(product.description || '')
    const [saved, setSaved] = useState(false)

    const handleSave = () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    return (
        <div onClick={onClose} style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
            display: 'grid', placeItems: 'center', padding: 24
        }}>
            <div onClick={e => e.stopPropagation()} style={{
                background: 'rgba(20,24,17,0.95)',
                border: '1px solid rgba(244,237,237,0.1)',
                borderRadius: 'var(--radius-xl)',
                padding: 36, width: '100%', maxWidth: 560,
                boxShadow: '0 32px 80px rgba(0,0,0,0.6)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                    <div>
                        <div style={{ fontFamily: 'var(--font)', fontSize: 24, color: '#fff', fontWeight: 500 }}>
                            {product.productName}
                        </div>
                        <span className={styles.badge} style={{ color: c.text, background: c.bg, border: `1px solid ${c.border}`, marginTop: 8, display: 'inline-block' }}>
                            {t.text}
                        </span>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--ink-dim)', fontSize: 22, cursor: 'pointer', lineHeight: 1 }}>✕</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                    <div style={{ background: 'rgba(244,237,237,0.05)', borderRadius: 'var(--radius-md)', padding: 16 }}>
                        <div style={{ fontFamily: 'var(--font)', fontSize: 12, color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: 1 }}>purchased</div>
                        <div style={{ fontFamily: 'var(--font)', fontSize: 18, color: '#fff', marginTop: 4 }}>{fmtDate(product.purchased)}</div>
                    </div>
                    <div style={{ background: 'rgba(244,237,237,0.05)', borderRadius: 'var(--radius-md)', padding: 16 }}>
                        <div style={{ fontFamily: 'var(--font)', fontSize: 12, color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: 1 }}>expires</div>
                        <div style={{ fontFamily: 'var(--font)', fontSize: 18, color: '#fff', marginTop: 4 }}>{fmtDate(product.expires)}</div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                        <div style={{ fontFamily: 'var(--font)', fontSize: 14, color: 'var(--ink-dim)', marginBottom: 6 }}>retailer / store</div>
                        <Input value={retailer} onChange={setRetailer} placeholder="Best Buy, Amazon, Apple..." />
                    </div>
                    <div>
                        <div style={{ fontFamily: 'var(--font)', fontSize: 14, color: 'var(--ink-dim)', marginBottom: 6 }}>order / receipt #</div>
                        <Input value={orderNumber} onChange={setOrderNumber} placeholder="e.g. 112-3456789" />
                    </div>
                    <div>
                        <div style={{ fontFamily: 'var(--font)', fontSize: 14, color: 'var(--ink-dim)', marginBottom: 6 }}>description</div>
                        <Input value={description} onChange={setDescription} placeholder="notes about this product..." />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
                    <PillButton variant="ghost" size="sm" onClick={onClose}>close</PillButton>
                    <PillButton size="sm" onClick={handleSave}>
                        {saved ? '✓ saved' : 'save changes'}
                    </PillButton>
                </div>
            </div>
        </div>
    )
}

function ProductRow({ product, confirming, onDelete, onClick }) {
    const t = timeLeft(product.expires)
    const c = URGENCY_STYLE[t.urgency]

    return (
        <div className={styles.row} onClick={onClick}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
                <div className={styles.rowIcon}>{product.productName[0]}</div>
                <div style={{ minWidth: 0 }}>
                    <div className={styles.rowName}>{product.productName}</div>
                    {product.receipt && <div className={styles.rowSub}>📎 {product.receipt}</div>}
                </div>
            </div>
            <div className={styles.rowDate}>{fmtDate(product.purchased)}</div>
            <div className={styles.rowDate}>{fmtDate(product.expires)}</div>
            <div>
                <span className={styles.badge} style={{ color: c.text, background: c.bg, border: `1px solid ${c.border}` }}>
                    {t.text}
                </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <PillButton size="sm" variant={confirming ? 'dangerConfirm' : 'danger'} onClick={(e) => { e.stopPropagation(); onDelete() }}>
                    {confirming ? 'sure?' : 'Delete'}
                </PillButton>
            </div>
        </div>
    )
}

function EmptyState({ query, filter, go, clearFilters }) {
    const isFiltered = query || filter !== 'all'
    return (
        <div className={styles.empty}>
            <div className={styles.emptyIcon}>{isFiltered ? '?' : '+'}</div>
            <h3 className={styles.emptyTitle}>{isFiltered ? 'nothing here' : 'no warranties yet'}</h3>
            <p className={styles.emptyBody}>
                {isFiltered ? 'clear your search or filter to see everything' : "add your first product and we'll ping you before coverage runs out"}
            </p>
            {isFiltered
                ? <PillButton variant="ghost" onClick={clearFilters}>clear filters</PillButton>
                : <PillButton onClick={() => go('register')}>+ add your first product</PillButton>
            }
        </div>
    )
}

function StatCard({ label, value, accent, hint }) {
    return (
        <div className={styles.statCard}>
            <div className={styles.statCardBar} style={{ background: accent }} />
            <div className={styles.statCardLabel}>{label}</div>
            <div className={styles.statCardValue}>{value}</div>
            {hint && <div className={styles.statCardHint}>{hint}</div>}
        </div>
    )
}

function SegBtn({ active, children, onClick }) {
    return (
        <button className={`${styles.segBtn}${active ? ` ${styles.segBtnActive}` : ''}`} onClick={onClick}>
            {children}
        </button>
    )
}

export default function WarrantyTable({ products = [], removeProduct, go }) {
    const [sort, setSort] = useState('urgent')
    const [filter, setFilter] = useState('all')
    const [query, setQuery] = useState('')
    const [confirmingId, setConfirmingId] = useState(null)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const timerRef = useRef()

    const enriched = products.map(product => ({ ...product, time: timeLeft(product.expires) }))

    const filtered = enriched.filter(product => {
        if(query && !product.productName.toLowerCase().includes(query.toLowerCase())) return false
        if(filter === 'soon' && !['soon','warn'].includes(product.time.urgency)) return false
        if(filter === 'active' && product.time.urgency === 'expired') return false
        if(filter === 'expired' && product.time.urgency !== 'expired') return false
        return true
    })

    const sorted = [...filtered].sort((a, b) => {
        if(sort === 'urgent') return a.time.days - b.time.days
        if(sort === 'newest') return new Date(b.purchased) - new Date(a.purchased)
        if(sort === 'name') return a.productName.localeCompare(b.productName)
        return 0
    })

    const stats = {
        total: products.length,
        soon: enriched.filter(product => ['soon','warn'].includes(product.time.urgency)).length,
        expired: enriched.filter(product => product.time.urgency === 'expired').length,
    }

    const handleDelete = (id) => {
        if (confirmingId === id) {
            removeProduct(id)
            setConfirmingId(null)
            clearTimeout(timerRef.current)
        } else {
            setConfirmingId(id)
            clearTimeout(timerRef.current)
            timerRef.current = setTimeout(() => setConfirmingId(null), 3000)
        }
    }

    return (
        <>
        {selectedProduct && (
            <ProductDetail
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
        )}

        <div className={styles.statStrip}>
            <StatCard label="total tracked" value={stats.total} accent="var(--green-b)" />
            <StatCard label="expiring soon" value={stats.soon} accent="var(--warn)" />
            <StatCard label="expired" value={stats.expired} accent="var(--danger)" />
        </div>

        <div className={styles.toolbar}>
            <div className={styles.toolbarLeft}>
                <SegBtn active={filter === 'all'} onClick={() => setFilter('all')}>all ({products.length})</SegBtn>
                <SegBtn active={filter === 'soon'} onClick={() => setFilter('soon')}>expiring soon ({stats.soon})</SegBtn>
                <SegBtn active={filter === 'active'} onClick={() => setFilter('active')}>active</SegBtn>
                <SegBtn active={filter === 'expired'} onClick={() => setFilter('expired')}>expired ({stats.expired})</SegBtn>
            </div>
            <div className={styles.toolbarRight}>
                <Input
                    value={query}
                    onChange={setQuery}
                    placeholder="search products..."
                    style={{ minWidth: 240 }}
                />
                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className={styles.select}
                    style={{ minWidth: 100 }}
                >
                    <option value="urgent" style={{ background: '#1a1a1a' }}>most urgent first</option>
                    <option value="newest" style={{ background: '#1a1a1a' }}>newest first</option>
                    <option value="name"   style={{ background: '#1a1a1a' }}>a → z</option>
                </select>
            </div>
        </div>

        <div className={styles.table}>
            <div className={styles.tableHead}>
                <div>Product</div>
                <div>Purchased</div>
                <div>Expires</div>
                <div>Time left</div>
                <div className={styles.tableHeadAction}>Actions</div>
            </div>
            {sorted.length === 0 ? (
                <EmptyState
                    query={query}
                    filter={filter}
                    go={go}
                    clearFilters={() => { setFilter('all'); setQuery('') }}
                />
            ) : (
                sorted.map(p => (
                    <ProductRow
                        key={p.id}
                        product={p}
                        confirming={confirmingId === p.id}
                        onDelete={() => handleDelete(p.id)}
                        onClick={() => setSelectedProduct(p)}
                    />
                ))
            )}
        </div>
        </>
    )
}