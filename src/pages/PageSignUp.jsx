import { useState, useMemo } from 'react'
import { useOutletContext, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Backdrop, AuthShell, Field, Input, PillButton } from '../components/ui'
import pageStyles from './Page.module.css'
import styles from './PageRegister.module.css'

const BULLETS = [
    { title: 'everything in one place', body: 'headphones, appliances, tools - keep every warranty side-by-side.'},
    { title: 'reminders before it\'s too late', body: "we'll email you 30 days before any warranty runs out."},
    { title: 'free forever, no card needed', body: "add unlimited products. We don't sell your data."},
    { title: 'your data stays yours', body: 'export or delete any time. no lock.in.' },
]

export default function PageSignUp(){
    const { go } = useOutletContext()
    const { register } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [errors, setErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)


    const strength = useMemo(() => {
        let s = 0
        if(password.length >= 8) s++
        if(/[A-Z]/.test(password)) s++
        if(/[0-9]/.test(password)) s++
        if(/[^A-Za-z0-9]/.test(password)) s++
        return s
    }, [password])

    const strengthLabel = ['too weak', 'weak', 'fair', 'strong', 'excellent!'][strength]
    const strengthColor = ['var(--danger)', 'var(--danger)', 'var(--warn)', 'var(--green-b)', 'var(--green-b)'][strength]

    const submit = async (e) => {
        e.preventDefault()
        const err = {}
        if (!email) err.email = 'email is required'
        else if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) err.email = "that doesn't look like an email"
        if (!password) err.password = 'password is required'
        else if(password.length < 8) err.password = 'needs to be at least 8 characters'
        if(confirm !== password) err.confirm = 'passwords do not match'
            setErrors(err)
        if(Object.keys(err).length) return

        setSubmitting(true)
        try {
                await register(email, password)
                go('profile')
        } catch {
            setErrors({ email: 'something went wrong, try again'})
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <>
        <div className={pageStyles.page} data-screen="signup">
            <Backdrop variant="soft" />
            <main className={pageStyles.main} style={{ maxWidth: 1100}}>
                <AuthShell
                title="welcome aboard"
                subtitle="a free home for every receipt and warranty you'd otherwise lose. Takes 30 seconds - no credit card."
                bullets={BULLETS}
                footer={<>already have an account?<Link to="/login" style={{ color: 'var(--green-b)'}}>login</Link></>}
                >
                    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 18}}>
                        
                        <Field label="email" required error={errors.email}>
                            <Input type="email" value={email} onChange={setEmail} placeholder="you@email.com" error={errors.email} autoFocus />
                        </Field>

                        <Field label="password" required error={errors.password} 
                        hint={!errors.password && password ? `strength: ${strengthLabel}` : 'at least 8 characters'} >
                            <Input type="password" value={password} onChange={setPassword} placeholder="create a strong password" error={errors.password} />
                            {password && (
                                <div className={styles.strengthBars}>
                                    {[0,1,2,3].map(i => (
                                        <div key={i} className={styles.strengthBar}
                                        style={{ background: i < strength ? strengthColor : 'rgba(244,237,237,0.1)'}} />
                                    ))}
                                </div>
                            )}
                        </Field>

                        <Field label="confirm password" required error={errors.confirm}>
                            <Input type="password" value={confirm} onChange={setConfirm}
                            placeholder="re-enter your password" error={errors.confirm} />
                        </Field>

                        <PillButton type="submit" size="lg" disabled={submitting} style={{ marginTop: 8}}>
                            {submitting ? 'creating account...' : 'create my free account →'}
                        </PillButton>

                        <p style={{ fontFamily: 'var(--font)', fontSize: 13, color: 'var(--ink-faint)', textAlign: 'center', lineHeight: 1.5}}>
                        by creating an account you agree to our terms and privacy policy
                        </p>
                    </form>
                </AuthShell>
            </main>
        </div>
        </>
    )
}