import { sendWhatsAppAlert } from "./whatsapp"

export async function notifyParents(students = []) {
  students.forEach(async (s) => {
    if (s.phone) {
      await sendWhatsAppAlert(
        `Hello, update on ${s.name}: Please check school portal.`,
        s.phone
      )
    }
  })
}