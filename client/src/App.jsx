import React from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'

const App = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="p-4">
        {!user ? (
          <>
            <Login />
            <div className="text-center text-sm text-gray-400 mt-6">or</div>
            <Register />
          </>
        ) : (
          <div className="text-center mt-10">
            <h1 className="text-2xl font-bold">Welcome back, {user.displayName}</h1>
            <p className="text-gray-400">Role: {user.role}</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
