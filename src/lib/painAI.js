// // import { calculatePain } from "../lib/painAI"

// export function calculatePain(students, fees) {
//   let totalExpected = 0
//   let totalPaid = 0
//   let overdueStudents = 0

//   const riskMap = {
//     "Fee Crisis": 0,
//     "Unpaid Students": 0,
//     "Collection Weakness": 0
//   }

//   students.forEach(s => {
//     const sFees = fees.filter(f => f.studentId === s.id)

//     const expected = sFees.reduce((a, f) => a + Number(f.amount || 0), 0)
//     const paid = sFees.reduce((a, f) => a + Number(f.paid || 0), 0)

//     totalExpected += expected
//     totalPaid += paid

//     const balance = expected - paid

//     if (balance > 0) {
//       overdueStudents++
//       riskMap["Fee Crisis"] += balance
//       riskMap["Unpaid Students"] += 1
//     }

//     if (expected > 0) {
//       riskMap["Collection Weakness"] += paid / expected
//     }
//   })

//   const result = Object.entries(riskMap).map(([key, value]) => ({
//     name: key,
//     value: Math.round(value),
//   }))

//   result.sort((a, b) => b.value - a.value)

//   return {
//     mostPainful: result[0],
//     chart: result,
//     summary: {
//       totalExpected,
//       totalPaid,
//       overdueStudents
//     }
//   }
// }












export function calculatePain(students = [], fees = []) {
  // 1. Guard clause for empty data
  if (!students.length) {
    return { 
      mostPainful: { name: "N/A", value: 0 }, 
      chart: [], 
      summary: { totalExpected: 0, totalPaid: 0, overdueStudents: 0 } 
    };
  }

  let totalExpected = 0;
  let totalPaid = 0;
  let overdueStudents = 0;
  
  const riskMap = {
    "Fee Crisis": 0,
    "Unpaid Students": 0,
    "Collection Weakness": 0
  };

  students.forEach(s => {
    const sFees = fees.filter(f => f.studentId === s.id);
    const expected = sFees.reduce((a, f) => a + Number(f.amount || 0), 0);
    const paid = sFees.reduce((a, f) => a + Number(f.paid || 0), 0);

    totalExpected += expected;
    totalPaid += paid;

    const balance = expected - paid;

    if (balance > 0) {
      overdueStudents++;
      riskMap["Fee Crisis"] += balance;
      riskMap["Unpaid Students"] += 1;
    }

    // 2. Fix: Check for zero to avoid NaN in Collection Weakness
    if (expected > 0) {
      riskMap["Collection Weakness"] += (paid / expected) * 100; 
    }
  });

  const result = Object.entries(riskMap).map(([name, value]) => ({
    name,
    value: Math.round(value),
  }));

  result.sort((a, b) => b.value - a.value);

  return {
    // 3. Fix: Fallback for mostPainful
    mostPainful: result[0] || { name: "None", value: 0 },
    chart: result,
    summary: { totalExpected, totalPaid, overdueStudents }
  };
}
