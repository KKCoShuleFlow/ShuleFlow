let state = null
const listeners = new Set()

export function setStore(newState) {
  state = {
    ...state,
    ...newState,
  }

  listeners.forEach((fn) => fn(state))
}

export function getStore() {
  return state
}

export function subscribe(callback) {
  listeners.add(callback)

  if (state) callback(state)

  return () => listeners.delete(callback)
}