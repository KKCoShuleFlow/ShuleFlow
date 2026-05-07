export function resolveConflict(local, remote) {
  if (!local || !remote) return remote || local

  // last-write-wins strategy (simple + safe for MVP)
  const localTime = new Date(local.updatedAt || 0).getTime()
  const remoteTime = new Date(remote.updatedAt || 0).getTime()

  return remoteTime >= localTime ? remote : local
}