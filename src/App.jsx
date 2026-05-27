import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import RootLayout from './layouts/RootLayout'
import PageIndex from './pages/PageIndex'
import PageLogin from './pages/PageLogin'
import PageSignUp from './pages/PageSignUp'
import PageRegister from './pages/PageRegister'
import PageProfile from './pages/PageProfile'
import PageContact from './pages/PageContact'
import './App.css'

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<PageIndex />} />
          <Route path="login" element={<PageLogin />} />
          <Route path="signup" element={<PageSignUp />} />
          <Route path="register" element={<PageRegister />} />
          <Route path="profile" element={<PageProfile />} />
          <Route path="contact" element={<PageContact />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      </BrowserRouter>
      </AuthProvider>
  )
}

export default App
