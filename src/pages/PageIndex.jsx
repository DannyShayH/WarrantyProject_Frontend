import { useOutletContext } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Backdrop, PillButton } from '../components/ui'
import CardStack from '../components/CardStack'
import pageStyles from './Page.module.css'
import styles from './PageIndex.module.css'

export default function PageIndex() {
    const { go } = useOutletContext()
    const { user } = useAuth()

    return (
        <div className={pageStyles.page} data-screen="index">
            <Backdrop variant="hero" />
            <div className={styles.heroGrid}>
                <section style={{ position: 'relative', zIndex: 2 }}>
                    <div className={styles.heroPill}>warranty tracking, simplified</div>
                    <h1 className={styles.heroTitle}>
                        never worry about <br />paper in your pockets
                    </h1>
                    <div className={styles.heroTags}>
                        {['Track it.', 'Store it.', 'Claim it'].map(tag => (
                            <div key={tag} className={styles.heroTag}>{tag}</div>
                        ))}
                    </div>
                    <p className={styles.heroBody}>
                        snap a receipt, log the expiry, and Warrantour reminds you before
                        coverage runs out. Your warranties, all in one place - free.
                    </p>
                    <div className={styles.heroCtas}>
                        {user ? (
                            <PillButton size="lg" onClick={() => go('profile')}>open my warranties →</PillButton>
                        ) : (
                            <>
                                <PillButton size="lg" onClick={() => go('signup')}>sign up free →</PillButton>
                                <PillButton size="lg" variant="ghost" onClick={() => go('login')}>login</PillButton>
                            </>
                        )}
                    </div>
                </section>
                <section style={{ position: 'relative', zIndex: 2 }}>
                    <CardStack />
                </section>
            </div>
        </div>
    )
}