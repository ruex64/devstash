import React, { useState } from 'react'
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const Register = () => {
  const [form, setForm] = useState({ email: '', password: '', name: '' })
  const { setUser } = useAuth()
  const auth = getAuth()

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      const userCred = await createUserWithEmailAndPassword(auth, form.email, form.password)
      await updateProfile(userCred.user, { displayName: form.name })
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
    <form onSubmit={handleRegister} className="bg-gray-900 p-6 rounded shadow max-w-md mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4">Register with Email</h2>
      <input className="input" placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} />
      <input className="input" placeholder="Email" type="email" onChange={e => setForm({ ...form, email: e.target.value })} />
      <input className="input" placeholder="Password" type="password" onChange={e => setForm({ ...form, password: e.target.value })} />
      <button type="submit" className="btn">Register</button>
    </form>
  )
}
export default Register
