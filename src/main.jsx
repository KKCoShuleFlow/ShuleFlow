import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom" // ✅ THIS WAS MISSING
import { AuthProvider } from "./context/AuthContext"


import App from "./App"
import "./styles/erp.css"
import "./styles/stripe.css"
import "./styles/unicorn.css"
import './index.css'

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>

  <AuthProvider>

    <App />
    
    </AuthProvider>
  </BrowserRouter>
)



