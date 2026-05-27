import { useAuth } from '../context/AuthContext'
import { Logo, NavLink, PillButton } from './ui'
import styles from './TopNav.module.css'

export default function TopNav({route, go}){
    const {user, logout } = useAuth()

    const items = user ? [
        { id: 'profile', label: 'My Warranties' },
        { id: 'register', label: 'Register Product' },
        { id: 'contact', label: 'Contact' },
    ]
    : [
        {id: 'index', label: 'Home' },
        {id: 'contact', label: 'Contact' },
    ]

    return (
        <header className={styles.nav}>
            <div className={styles.inner}>
                <div className={styles.logoWrap}>
                    <Logo onClick={() => go('index')} />
                </div>

                <nav className={styles.links}>
                    {items.map(item => (
                        <NavLink key={item.id} active={route === item.id} onClick={() => go(item.id)}>
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className={styles.actions}>
                    {user ? (
                        <>
                        <button 
                        className={styles.userChip}
                        onClick={() => go('profile')}
                        title="Go to my warranties"
                        >
                            <span className={styles.userChipAvatar}>
                                {(user.email[0] || 'U').toUpperCase()}
                            </span>
                            <span className={styles.userChipName}>{user.email.split('@')[0]}</span>
                        </button>
                        <PillButton
                        variant="ghost"
                        size="sm"
                        onClick={() => { logout(); go('index') }}
                        >
                            Logout
                        </PillButton>
                        </>
                    ) : (
                        <>
                        <PillButton variant="ghost" size="sm" onClick={() => go('login')}>Login</PillButton>
                        <PillButton variant="primary" size="sm" onClick={() => go('signup')}>Sign Up</PillButton>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}