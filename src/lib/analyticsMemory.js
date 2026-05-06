// src/lib/analyticsMemory.js

const KEY = "shuleflow_history"

export function saveSnapshot(snapshot) {
  const existing = JSON.parse(localStorage.getItem(KEY) || "[]")

  const updated = [
    ...existing,
    {
      ...snapshot,
      time: Date.now()
    }
  ].slice(-30) // keep last 30 points

  localStorage.setItem(KEY, JSON.stringify(updated))
}

export function getHistory() {
  return JSON.parse(localStorage.getItem(KEY) || "[]")
}