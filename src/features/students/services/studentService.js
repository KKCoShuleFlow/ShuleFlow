import { db } from "../../../db"

// ADD
export async function addStudent(student) {
  return await db.students.add({
    id: crypto.randomUUID(),
    name: student.name,
    class: student.class,
    isDeleted: false,
    created_at: Date.now()
  })
}

// GET (FILTER OUT DELETED)
export async function getStudents() {
  const all = await db.students.toArray()
  return all.filter(s => !s.isDeleted)
}

// SOFT DELETE
export async function deleteStudent(id) {
  return await db.students.update(id, {
    isDeleted: true
  })
}