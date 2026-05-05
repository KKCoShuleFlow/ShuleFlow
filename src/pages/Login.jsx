import { useState } from "react"
import { supabase } from "../lib/supabase"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) alert(error.message)
    else window.location.href = "/admin"
  }

  return (
    <div className="h-screen flex items-center justify-center">

      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="mb-4 text-lg font-bold">Login</h2>

        <input
          placeholder="Email"
          onChange={(e)=>setEmail(e.target.value)}
          className="border p-2 w-full mb-3"
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e)=>setPassword(e.target.value)}
          className="border p-2 w-full mb-3"
        />

        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white w-full p-2 rounded"
        >
          Login
        </button>
      </div>

    </div>
  )
}