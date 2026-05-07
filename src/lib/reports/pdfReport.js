import { jsPDF } from "jspdf"

export function generatePDFReport(report) {
  const doc = new jsPDF()

  doc.setFontSize(16)
  doc.text("SCHOOL INTELLIGENCE REPORT", 10, 10)

  doc.setFontSize(12)

  doc.text(`Students: ${report.summary.students}`, 10, 30)
  doc.text(`Unpaid Fees: ${report.summary.unpaid}`, 10, 40)
  doc.text(`Attendance: ${report.summary.attendance}%`, 10, 50)
  doc.text(`Risk Score: ${report.summary.riskScore}`, 10, 60)

  doc.text("Insights:", 10, 80)

  report.insights.forEach((i, idx) => {
    doc.text(`- ${i}`, 10, 90 + idx * 10)
  })

  doc.save("school-report.pdf")
}