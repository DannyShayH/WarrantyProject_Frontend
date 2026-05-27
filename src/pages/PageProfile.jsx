import { useOutletContext } from "react-router-dom";
import { useAuth } from '../context/AuthContext'
import { Backdrop, PillButton, RequireLogin } from '../components/ui'
import WarrantyTable from '../components/WarrantyTable'
import pageStyles from './Page.module.css'

export default function PageProfile() {
    const { go }= useOutletContext()
    const { user, products, removeProduct } = useAuth()

    if(!user) return <RequireLogin go={go} />

    return(
        <>
        <div className={pageStyles.page} data-screen="profile">
        <Backdrop variant="flat" />
        <main className={pageStyles.main}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28, flexWrap: 'wrap', gap: 16}}>
                <div>
                    <div style={{ fontFamily: 'var(--font)', fontSize: 56, color: '#fff', margin: '6px 0 0', fontWeight: 500}}>
                    hey, {user.email.split('@')[0]}
                    </div>
                    <h1 style={{ fontFamily: 'var(--font)', fontSize: 56, color: '#fff', margin: '6px 0 0', fontWeight: 500}}>
                    My Warranties
                    </h1>
                </div>
                <PillButton size="md" onClick={() => go('register')}>+ register product</PillButton>
            </div>
            <WarrantyTable products={products} removeProduct={removeProduct} go={go} />
        </main>
        </div>
        </>
    )
}