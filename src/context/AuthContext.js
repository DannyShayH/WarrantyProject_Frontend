import { createContext, useContext, useState, useEffect } from 'react'
import * as React from 'react'
import { jwtDecode } from 'jwt-decode'

const AuthCtx = createContext(null)
const API = 'https://warrantyproject-api.greymansshop.dk/api'
// const API = 'http://localhost:7070/api'

export function AuthProvider({ children }){
    const [user, setUser] = useState(() => {
        const email = localStorage.getItem('email')
        return email ? { email } : null
    })
    const [products, setProducts] = useState([])

    // Get products when user logs in
    useEffect(() => {
        if(!user) return
        const token = localStorage.getItem('token')
        const headers = { Authorization: `Bearer ${token}` }

        const safeFetch = (url) =>
            fetch(url, { headers }).then(r => r.ok ? r.json() : [])

        Promise.all([
            safeFetch(`${API}/product/user/${localStorage.getItem('userId')}`),
            safeFetch(`${API}/warranty/all`),
            safeFetch(`${API}/receipt/all`),
            safeFetch(`${API}/product-registration/all`)
        ])
        .then(([products, warranties, receipts, registrations]) => {
            const merged = products.map(p => {
                const warranty = warranties.find(w => w.id === p.warrantyId) || null
                const registration = registrations.find(r => r.productId === p.id) || null
                const receipt = registration ? receipts.find(r => r.id === registration.receiptId) || null : null

                const result = {
                    ...p,
                    purchased: warranty?.startDate || null,
                    expires: warranty?.endDate || null,
                    warrantyMonths: warranty?.warrantyMonths || null,
                    price: receipt?.price || null,
                    retailer: receipt?.description || null,
                    orderNumber: receipt?.id || null
                }
                console.log('merged product:', result)
                return result
            })
            setProducts(merged)
        })
        .catch(err => console.error(err))
    }, [user])

    const login = async (email, password) => {
        const res = await fetch(`${API}/security/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
        if(!res.ok) throw new Error('Invalid credentials')
            const data = await res.json()
            console.log('login response:', data)

            const decoded = jwtDecode(data.token)
            console.log('decoded token:', decoded)


            localStorage.setItem('token', data.token)
            localStorage.setItem('email', data.email)

            const usersRes = await fetch(`${API}/user/all`, {
                headers: { Authorization: `Bearer ${data.token}`}
            })
            const users = await usersRes.json()
            const currentUser = users.find(u => u.email === data.email)
            localStorage.setItem('userId', currentUser.id)
            setUser({ email: data.email, id: currentUser.id })
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('email')
        localStorage.removeItem('userId')
        setUser(null)
        setProducts([])
    }

    const register = async (email, password) => {
    const res = await fetch(`${API}/security/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ email, password })
        })
        if(!res.ok) throw new Error('registration failed')
            await login(email, password)
    }

    const addProduct = async (p) => {
        const token = localStorage.getItem('token')
        const userId = localStorage.getItem('userId')
        const today = new Date().toISOString().split('T')[0]

        const productRes = await fetch(`${API}/product`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
            body: JSON.stringify({ productName: p.productName, userId: parseInt(userId) })
        })
        const newProduct = await productRes.json()

        await fetch(`${API}/warranty`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
            body: JSON.stringify({
                productId: newProduct.id,
                warrantyMonths: p.warrantyMonths,
                startDate: p.purchased
            })
        })

        const regRes = await fetch(`${API}/product-registration`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
            body: JSON.stringify({
                userId: parseInt(userId),
                productId: newProduct.id,
                purchasedAt: p.purchased,
                registeredAt: today
            })
        })
        const registration = await regRes.json()

        if(p.price) {
            const receiptRes = await fetch(`${API}/receipt`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
                body: JSON.stringify({
                    productRegistrationId: registration.id,
                    purchasedAt: p.purchased,
                    description: p.retailer || p.productName,
                    price: parseFloat(p.price)
                })
            })
            const newReceipt = await receiptRes.json()

            await fetch(`${API}/product-registration/${registration.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
                body: JSON.stringify({
                    id: registration.id,
                    userId: parseInt(userId),
                    productId: newProduct.id,
                    receiptId: newReceipt.id,
                    purchasedAt: p.purchased,
                    registeredAt: today
                })
            })
        }
        setUser(prev => ({...prev}))
    }

    const removeProduct = async (id) => {
        const token = localStorage.getItem('token')
        await fetch(`${API}/product/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}`}
        })
        setProducts(prev => prev.filter(p => p.id !== id))
    }

    const value = { user, products, register, login, logout, addProduct, removeProduct }
    return React.createElement(AuthCtx.Provider, { value }, children )
    
}

export function useAuth() {
        return useContext(AuthCtx)
    }