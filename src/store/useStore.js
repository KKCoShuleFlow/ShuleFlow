// store/useStore.js
import { create } from 'zustand'

export const useStore = create((set) => ({
  students: [],
  setStudents: (data) => set({ students: data }),

  payments: [],
  setPayments: (data) => set({ payments: data })
}))

// app/dashboard/page.jsx
'use client'

import { useEffect, useState } from 'react'
import { getDashboardStats } from '@/lib/feeService'

export default function Dashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    getDashboardStats().then(setStats)
  }, [])

  if (!stats) return <p>Loading...</p>

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4">
        <Card title="Students" value={stats.totalStudents} />
        <Card title="Revenue" value={`$${stats.revenue}`} />
      </div>
    </div>
  )
}

const Card = ({ title, value }) => (
  <div className="bg-white p-4 rounded-2xl shadow">
    <p className="text-gray-500 text-sm">{title}</p>
    <p className="text-xl font-bold">{value}</p>
  </div>
)