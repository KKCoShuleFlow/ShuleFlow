export const createStudent = (data) => ({
  id: crypto.randomUUID(),
  name: data.name,

  created_at: Date.now(),
  updated_at: Date.now(),

  version: 1,
  sync_status: "pending",
  deleted: false
})