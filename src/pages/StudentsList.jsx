import { useEffect, useState } from "react"
import { addStudent, getStudents, deleteStudent } from "../features/students/services/studentService"
import { Link } from "react-router-dom"

export default function StudentsList() {
  const [students, setStudents] = useState([])
  const [name, setName] = useState("")
  const [studentClass, setStudentClass] = useState("")
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  // LOAD STUDENTS
  async function load() {
    setLoading(true)
    const data = await getStudents()
    setStudents(data)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  // ADD STUDENT
  async function handleAdd() {
    if (!name.trim() || !studentClass.trim()) return

    await addStudent({
      name: name.trim(),
      class: studentClass.trim()
    })

    setName("")
    setStudentClass("")
    load()
  }

  // DELETE STUDENT
  async function handleDelete(id) {
    const confirmDelete = confirm("Delete this student?")
    if (!confirmDelete) return

    await deleteStudent(id)
    load()
  }

  // SEARCH FILTER
  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.class.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold">👨‍🎓 Students</h1>

      {/* ADD STUDENT */}
      <div className="bg-white p-4 rounded-xl shadow mt-4">

        <h3 className="font-semibold mb-3">Add Student</h3>

        <div className="flex flex-col md:flex-row gap-2">

          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded w-full"
          />

          <input
            placeholder="Class"
            value={studentClass}
            onChange={(e) => setStudentClass(e.target.value)}
            className="border p-2 rounded w-full"
          />

          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 rounded"
          >
            Save
          </button>

        </div>

      </div>

      {/* SEARCH */}
      <div className="mt-4">
        <input
          placeholder="Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full md:w-1/3"
        />
      </div>

      {/* TABLE */}
      <div className="mt-6 bg-white rounded-xl shadow p-4 overflow-x-auto">

        <h3 className="mb-4 font-semibold">Student List</h3>

        {loading ? (
          <p>Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500">No students found</p>
        ) : (
          <table className="w-full text-sm">

            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="p-2">Name</th>
                <th className="p-2">Class</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b hover:bg-gray-50">

                  <td className="p-2">{s.name}</td>
                  <td className="p-2">{s.class}</td>

                  <td className="p-2 flex gap-3">

                    <Link
                      to={`/students/${s.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>

                    <button
                      onClick={() => handleDelete(s.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>

                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        )}

      </div>

    </div>
  )
}