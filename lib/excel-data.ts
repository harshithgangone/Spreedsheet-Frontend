export interface CellData {
  value: string
  type: "text" | "number" | "formula" | "date"
  formula?: string
  style?: {
    bold?: boolean
    italic?: boolean
    color?: string
    backgroundColor?: string
  }
}

export interface GridData {
  [cellId: string]: CellData
}

export function generateEmptyGrid(rows: number, columns: number): GridData {
  const grid: GridData = {}

  // Generate column letters (A, B, C, ..., Z, AA, AB, ...)
  const generateColumnLetter = (index: number): string => {
    let result = ""
    while (index >= 0) {
      result = String.fromCharCode(65 + (index % 26)) + result
      index = Math.floor(index / 26) - 1
    }
    return result
  }

  // Create empty cells for the grid
  for (let col = 0; col < columns; col++) {
    const colLetter = generateColumnLetter(col)
    for (let row = 1; row <= rows; row++) {
      const cellId = `${colLetter}${row}`
      grid[cellId] = {
        value: "",
        type: "text",
        style: {},
      }
    }
  }

  // Add some sample data
  grid["A1"] = { value: "Task Name", type: "text", style: { bold: true } }
  grid["B1"] = { value: "Status", type: "text", style: { bold: true } }
  grid["C1"] = { value: "Priority", type: "text", style: { bold: true } }
  grid["D1"] = { value: "Due Date", type: "text", style: { bold: true } }
  grid["E1"] = { value: "Assigned To", type: "text", style: { bold: true } }

  grid["A2"] = { value: "Launch social media campaign", type: "text", style: {} }
  grid["B2"] = { value: "In Progress", type: "text", style: {} }
  grid["C2"] = { value: "High", type: "text", style: {} }
  grid["D2"] = { value: "2024-12-15", type: "date", style: {} }
  grid["E2"] = { value: "John Doe", type: "text", style: {} }

  grid["A3"] = { value: "Update website design", type: "text", style: {} }
  grid["B3"] = { value: "Pending", type: "text", style: {} }
  grid["C3"] = { value: "Medium", type: "text", style: {} }
  grid["D3"] = { value: "2024-12-20", type: "date", style: {} }
  grid["E3"] = { value: "Jane Smith", type: "text", style: {} }

  return grid
}
