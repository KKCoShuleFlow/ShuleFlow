import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"

import App from "./App"

import "./styles/erp.css"
import "./styles/stripe.css"
import "./styles/unicorn.css"
import "./index.css"

import { startEngineLoop } from "./lib/core/engineLoop"

// ✅ START ENGINE ONCE (outside React render system)
startEngineLoop()


if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js")
  })
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
)