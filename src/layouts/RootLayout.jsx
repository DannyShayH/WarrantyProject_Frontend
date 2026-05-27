import {Outlet, useNavigate, useLocation } from 'react-router-dom'
import TopNav from '../components/TopNav'
import { Footer } from '../components/ui'

const ROUTE_MAP = {
    index: '/',
    login: '/login',
    signup: '/signup',
    register: '/register',
    profile: '/profile',
    contact: '/contact',
}

export default function RootLayout() {
    const navigate = useNavigate()
    const location = useLocation()

    const go = (name) => navigate(ROUTE_MAP[name] ?? `/${name}`)

    const currentRoute = location.pathname === '/' ? 'index' : location.pathname.replace(/^\//, '')

    const outletCtx = { go }

    return(
        <>
        <div style={{minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'var(--font)'}}>
            <TopNav route={currentRoute} go = { go } />
            <Outlet context={outletCtx} />
            <Footer />
        </div>
        </>
    )
}