export interface CellData {
  value: string
  type: "text" | "number" | "formula" | "date"
  formula?: string
  style?: {
    bold?: boolean
    italic?: boolean
    underline?: boolean
    color?: string
    backgroundColor?: string
    textAlign?: 'left' | 'center' | 'right'
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
        style: {
          textAlign: 'left'
        },
      }
    }
  }

  // Add some sample data with formatting
  grid["A1"] = { 
    value: "Task Name", 
    type: "text", 
    style: { 
      bold: true, 
      textAlign: 'left' 
    } 
  }
  grid["B1"] = { 
    value: "Status", 
    type: "text", 
    style: { 
      bold: true, 
      textAlign: 'center' 
    } 
  }
  grid["C1"] = { 
    value: "Priority", 
    type: "text", 
    style: { 
      bold: true, 
      textAlign: 'center' 
    } 
  }
  grid["D1"] = { 
    value: "Due Date", 
    type: "text", 
    style: { 
      bold: true, 
      textAlign: 'center' 
    } 
  }
  grid["E1"] = { 
    value: "Assigned To", 
    type: "text", 
    style: { 
      bold: true, 
      textAlign: 'left' 
    } 
  }

  grid["A2"] = { 
    value: "Launch social media campaign", 
    type: "text", 
    style: { textAlign: 'left' } 
  }
  grid["B2"] = { 
    value: "In Progress", 
    type: "text", 
    style: { 
      textAlign: 'center',
      color: '#f59e0b',
      bold: true
    } 
  }
  grid["C2"] = { 
    value: "High", 
    type: "text", 
    style: { 
      textAlign: 'center',
      color: '#dc2626',
      bold: true
    } 
  }
  grid["D2"] = { 
    value: "2024-12-15", 
    type: "date", 
    style: { textAlign: 'center' } 
  }
  grid["E2"] = { 
    value: "John Doe", 
    type: "text", 
    style: { textAlign: 'left' } 
  }

  grid["A3"] = { 
    value: "Update website design", 
    type: "text", 
    style: { textAlign: 'left' } 
  }
  grid["B3"] = { 
    value: "Pending", 
    type: "text", 
    style: { 
      textAlign: 'center',
      color: '#6b7280',
      italic: true
    } 
  }
  grid["C3"] = { 
    value: "Medium", 
    type: "text", 
    style: { 
      textAlign: 'center',
      color: '#f59e0b'
    } 
  }
  grid["D3"] = { 
    value: "2024-12-20", 
    type: "date", 
    style: { textAlign: 'center' } 
  }
  grid["E3"] = { 
    value: "Jane Smith", 
    type: "text", 
    style: { textAlign: 'left' } 
  }

  return grid
}