import { useState } from "react"
import { signIn, signUp } from "../lib/auth"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mode, setMode] = useState("login") // login | signup

  const handleSubmit = async () => {
    const fn = mode === "login" ? signIn : signUp
    const { error } = await fn(email, password)

    if (error) {
      alert(error.message)
      return
    }

    if (mode === "signup") {
      alert("Account created. You can now log in.")
      setMode("login")
    } else {
      window.location.href = "/"
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>

        <div style={styles.title}>
          {mode === "login" ? "Login" : "Create Account"}
        </div>

        <input
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleSubmit} style={styles.button}>
          {mode === "login" ? "Login" : "Sign Up"}
        </button>

        <div style={styles.switch}>
          {mode === "login" ? "No account?" : "Already have one?"}
          <span
            style={styles.link}
            onClick={() =>
              setMode(mode === "login" ? "signup" : "login")
            }
          >
            {mode === "login" ? " Sign up" : " Login"}
          </span>
        </div>

      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#050816",
    color: "white"
  },
  card: {
    background: "#0f172a",
    padding: 30,
    borderRadius: 16,
    width: 300
  },
  title: {
    fontSize: 20,
    fontWeight: 900,
    marginBottom: 16
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    border: "none"
  },
  button: {
    width: "100%",
    padding: 10,
    background: "#3b82f6",
    border: "none",
    borderRadius: 8,
    color: "white",
    fontWeight: 700
  },
  switch: {
    marginTop: 12,
    fontSize: 12
  },
  link: {
    color: "#60a5fa",
    cursor: "pointer",
    marginLeft: 4
  }
}