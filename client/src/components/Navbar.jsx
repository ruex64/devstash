import React from 'react'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()

  return (
    <nav className="w-full px-6 py-4 bg-black border-b border-gray-800 flex justify-between items-center">
      <h1 className="text-xl font-bold">DevStash</h1>
      {user && (
        <button
          onClick={logout}
          className="px-4 py-2 text-sm rounded bg-red-600 hover:bg-red-700"
        >
          Logout
        </button>
      )}
    </nav>
  )
}

export default Navbar
