import { useState } from 'react'
import { useOutletContext, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Backdrop, AuthShell, Field, Input, PillButton } from '../components/ui'
import pageStyles from './Page.module.css'

export default function PageLogin() {
    const { go } = useOutletContext()
    const { login } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)

    const submit = async (submit) => {
        submit.preventDefault()
        const err = {}
        if(!email) err.email = 'email is required'
        else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) err.email = "that doesn't look like an email"
        if(!password) err.password = 'password is required'
        setErrors(err)
        if(Object.keys(err).length) return

        setSubmitting(true)
        try {
            await login(email, password)
            go('profile')
        } catch {
            setErrors({ password: 'invalid email or password'})
        } finally {
            setSubmitting(false)
        }
    }

    return(
        <>
        <div className={pageStyles.page} data-screen="login">
            <Backdrop variant="soft" />
            <main className={pageStyles.main} style={{ maxWidth: 1100 }}>
                <AuthShell title="welcome back" subtitle="Utilize. Track. Never forget" footer={<>no account yet? <Link to="/signup" style={{ color: 'var(--green-b)' }}>sign up today!</Link></>}>
                <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

                    <Field label="email" required error={errors.email}>
                        <Input type="email" value={email} onChange={setEmail} placeholder="you@email.com" error={errors.email} autoFocus />
                    </Field>

                    <Field label="password" required error={errors.password}>
                        <Input type="password" value={password} onChange={setPassword} placeholder="••••••••" error={errors.password} />
                    </Field>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4}}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font)', fontSize: 15, color: 'var(--ink-dim)', cursor: 'pointer'}}>
                            <input type="checkbox" /> remember me
                        </label>
                        <Link to="/contact" style={{ fontFamily: 'var(--font)', fontSize: 15, color: 'var(--green-b)', textDecoration: 'none' }}>
                        forgot password?
                        </Link>
                    </div>

                    <PillButton type="submit" size="lg" disabled={submitting} style={{ marginTop: 8}}>
                    {submitting ? 'signing in...' : 'login'}
                    </PillButton>
                </form>
                </AuthShell>
            </main>
        </div>
        </>
    )
}