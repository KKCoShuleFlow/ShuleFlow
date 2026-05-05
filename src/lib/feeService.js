// lib/feeService.js

import { supabase } from './supabaseClient'
import { addOfflineAction } from './db'

export const addPayment = async (payment) => {
  if (!navigator.onLine) {
    await addOfflineAction({
      table: 'payments',
      payload: payment
    })
    return { offline: true }
  }

  return await supabase.from('payments').insert([payment])
}

export const getDashboardStats = async () => {
  const { data: students } = await supabase.from('students').select('*')
  const { data: payments } = await supabase.from('payments').select('*')

  const revenue = payments.reduce((sum, p) => sum + Number(p.amount), 0)

  return {
    totalStudents: students.length,
    revenue
  }
}