const KEY = "fees_cache_v1"
const QUEUE_KEY = "fees_queue_v1"

/* ---------------- CACHE ---------------- */

export function saveFeesCache(data) {
  localStorage.setItem(KEY, JSON.stringify(data))
}

export function getFeesCache() {
  const raw = localStorage.getItem(KEY)
  return raw ? JSON.parse(raw) : []
}

/* ---------------- QUEUE (offline actions) ---------------- */

export function addToQueue(action) {
  const queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]")
  queue.push({
    ...action,
    time: new Date().toISOString()
  })

  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
}

export function getQueue() {
  return JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]")
}

export function clearQueue() {
  localStorage.removeItem(QUEUE_KEY)
}