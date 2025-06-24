import React, { useState } from 'react'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useAuth } from '../context/AuthContext'
import { FcGoogle } from 'react-icons/fc'
import api from '../services/api'

const Login = () => {
  const { login } = useAuth()
  const auth = getAuth()
  const [form, setForm] = useState({ email: '', password: '' })

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    try {
      const userCred = await signInWithEmailAndPassword(auth, form.email, form.password)
      const token = await userCred.user.getIdToken()
      const backendRes = await api.post('/auth/login', { token })
      setUser({
        ...backendRes.data.user,
        accessToken: backendRes.data.accessToken
      })
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12">
      <button onClick={login} className="btn flex gap-2 items-center">
        <FcGoogle /> Sign in with Google
      </button>
      <form onSubmit={handleEmailLogin} className="mt-6 space-y-3 bg-gray-900 p-4 rounded">
        <input placeholder="Email" className="input" onChange={e => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Password" className="input" onChange={e => setForm({ ...form, password: e.target.value })} />
        <button type="submit" className="btn">Login with Email</button>
      </form>
    </div>
  )
}
