import { useState } from 'react'
import { Backdrop, Field, Input, TextArea, PillButton } from '../components/ui'
import pageStyles from './Page.module.css'
import styles from './PageContact.module.css'

const TOPICS = ['General', 'Bug report', 'Feature request', 'Account help', 'Other']

const TOPIC_CHIPS = [
    { label: 'general question', v: 'General' },
    { label: 'bug report', v: 'Bug report' },
    { label: 'feature request', v: 'Feature request' },
    { label: 'account help', v: 'Account help' },
    { label: 'other', v: 'Other' },
]

const INFO_CARDS = [
    { icon: '💬', title: 'email support', body: 'support@warrantour.app', hint: 'best for account questions' },
    { icon: '⚡', title: 'avg. response', body: 'under 24 hours', hint: 'weekdays, faster mondays' },
    { icon: '📚', title: 'help center', body: 'browse FAQs →', hint: 'most answers live here' },
]

const TIPS = [
    'mention the product or warranty you\'re asking about',
    'paste any error messages exactly as you saw them',
    'include the email tied to your account',
    'describe what you expected vs what actually happened'
]

export default function PageContact() {
    const [form, setForm] = useState({ topic: 'General', email: '', message: '' })
    const [errors, setErrors] = useState({})
    const [sent, setSent] = useState(false)

    const setField = (key) => (val) => setForm(prev => ({ ...prev, [key]: val }))

    const submit = (e) => {
        e.preventDefault()
        const err = {}
        if (!form.email) err.email = 'Email is required'
        else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) err.email = "that doesn't look right"
        if (!form.message.trim()) err.message = 'message is required'
        else if (form.message.trim().length < 10) err.message = 'needs at least 10 characters'
        setErrors(err)
        if (Object.keys(err).length) return
        setSent(true)
    }

    return (
        <div className={pageStyles.page} data-screen="contact">
            <Backdrop variant="soft" />
            <main className={pageStyles.main} style={{ maxWidth: 1300 }}>

                <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 56px' }}>
                    <div className={styles.heroPill}>we're here to help</div>
                    <h1 style={{ fontFamily: 'var(--font)', fontSize: 64, color: '#fff', lineHeight: 1.05, fontWeight: 500, marginTop: 8 }}>
                        How can we help?
                    </h1>
                    <p style={{ fontFamily: 'var(--font)', fontSize: 20, color: 'var(--ink-dim)', marginTop: 16, lineHeight: 1.5 }}>
                        got a question, found a bug, or just want to say hi?
                        drop us a note - a real human reads every message and replies within a business day.
                    </p>
                </div>

                <div className={styles.infoStrip}>
                    {INFO_CARDS.map(card => (
                        <div key={card.title} className={styles.card}>
                            <div className={styles.cardIcon}>{card.icon}</div>
                            <div className={styles.cardEyebrow}>{card.title}</div>
                            <div className={styles.cardValue}>{card.body}</div>
                            <div className={styles.cardHint}>{card.hint}</div>
                        </div>
                    ))}
                </div>

                <div className={styles.grid}>

                    {/* left: topic chips + tips */}
                    <section>
                        <h3 style={{ fontFamily: 'var(--font)', fontSize: 26, color: '#fff' }}>what's this about?</h3>
                        <p style={{ fontFamily: 'var(--font)', fontSize: 16, color: 'var(--ink-dim)', marginTop: 8, lineHeight: 1.5 }}>
                            pick the closest topic so we can route you faster
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 16 }}>
                            {TOPIC_CHIPS.map(t => (
                                <button
                                    key={t.v}
                                    type="button"
                                    onClick={() => setForm(prev => ({ ...prev, topic: t.v }))}
                                    className={`${styles.segBtn}${form.topic === t.v ? ` ${styles.segBtnActive}` : ''}`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        <div style={{ marginTop: 36 }}>
                            <h3 style={{ fontFamily: 'var(--font)', fontSize: 22, color: '#fff' }}>tips for a faster reply</h3>
                            <ul style={{ listStyle: 'none', padding: 0, margin: '14px 0 0', display: 'grid', gap: 12 }}>
                                {TIPS.map((tip, i) => (
                                    <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontFamily: 'var(--font)', fontSize: 15, color: 'var(--ink-dim)', lineHeight: 1.45 }}>
                                        <span style={{ width: 22, height: 22, flexShrink: 0, borderRadius: 6, background: 'rgba(137,222,159,0.15)', color: 'var(--green-b)', display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 700 }}>
                                            {i + 1}
                                        </span>
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div style={{ marginTop: 32, padding: 18, borderRadius: 14, background: 'rgba(137,222,159,0.06)', border: '1px solid rgba(137,222,159,0.18)', display: 'flex', gap: 14 }}>
                            <span style={{ fontSize: 22 }}>💡</span>
                            <div>
                                <div style={{ fontFamily: 'var(--font)', fontSize: 16, color: '#fff' }}>looking for a quick answer?</div>
                                <div style={{ fontFamily: 'var(--font)', fontSize: 14, color: 'var(--ink-dim)', marginTop: 4, lineHeight: 1.45 }}>
                                    check the help centre first — most setup and account questions are answered there in under a minute
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* right: form */}
                    <section className={styles.formCard}>
                        {sent ? (
                            <div className={styles.success}>
                                <div className={styles.successIcon}>✓</div>
                                <h3 className={styles.successTitle}>message sent!</h3>
                                <p className={styles.successBody}>we'll get back to you at {form.email}</p>
                                <PillButton
                                    variant="ghost"
                                    onClick={() => { setSent(false); setForm({ topic: 'General', email: '', message: '' }) }}
                                    style={{ marginTop: 20 }}
                                >
                                    send another
                                </PillButton>
                            </div>
                        ) : (
                            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                                <Field label="topic" required>
                                    <select
                                        value={form.topic}
                                        onChange={(e) => setForm(prev => ({ ...prev, topic: e.target.value }))}
                                        className={styles.select}
                                    >
                                        {TOPICS.map(t => (
                                            <option key={t} value={t} style={{ background: '#1a1a1a' }}>{t}</option>
                                        ))}
                                    </select>
                                </Field>

                                <Field label="email" required error={errors.email}>
                                    <Input type="email" value={form.email} onChange={setField('email')}
                                        placeholder="you@email.com" error={errors.email} />
                                </Field>

                                <Field label="message" required error={errors.message}
                                    hint={!errors.message && form.message ? `${form.message.length} characters` : undefined}>
                                    <TextArea value={form.message} onChange={setField('message')}
                                        placeholder="tell us what's on your mind…" rows={6} error={errors.message} />
                                </Field>

                                <PillButton type="submit" size="lg">send message</PillButton>
                            </form>
                        )}
                    </section>
                </div>
            </main>
        </div>
    )
}