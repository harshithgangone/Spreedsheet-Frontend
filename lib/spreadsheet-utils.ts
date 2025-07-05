export interface UndoRedoAction {
  type: 'cell_update' | 'format_change' | 'insert_row' | 'insert_column' | 'delete_row' | 'delete_column'
  cellId?: string
  oldValue?: string
  newValue?: string
  data?: any
}

export class UndoRedoManager {
  private undoStack: UndoRedoAction[] = []
  private redoStack: UndoRedoAction[] = []
  private maxStackSize = 100

  addAction(action: UndoRedoAction) {
    this.undoStack.push(action)
    if (this.undoStack.length > this.maxStackSize) {
      this.undoStack.shift()
    }
    this.redoStack = [] // Clear redo stack when new action is added
  }

  canUndo(): boolean {
    return this.undoStack.length > 0
  }

  canRedo(): boolean {
    return this.redoStack.length > 0
  }

  undo(): UndoRedoAction | null {
    const action = this.undoStack.pop()
    if (action) {
      this.redoStack.push(action)
      return action
    }
    return null
  }

  redo(): UndoRedoAction | null {
    const action = this.redoStack.pop()
    if (action) {
      this.undoStack.push(action)
      return action
    }
    return null
  }

  clear() {
    this.undoStack = []
    this.redoStack = []
  }
}

export class ClipboardManager {
  private clipboardData: { cells: Record<string, any>, range: string } | null = null

  copy(cells: Record<string, any>, range: string) {
    this.clipboardData = { cells, range }
    
    // Also copy to system clipboard
    const textData = Object.entries(cells)
      .map(([cellId, data]) => `${cellId}: ${data.value}`)
      .join('\n')
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textData)
    }
  }

  paste(): { cells: Record<string, any>, range: string } | null {
    return this.clipboardData
  }

  hasData(): boolean {
    return this.clipboardData !== null
  }

  clear() {
    this.clipboardData = null
  }
}

export function parseFormula(formula: string, gridData: Record<string, any>): string {
  try {
    if (!formula.startsWith('=')) return formula

    let expression = formula.slice(1)

    // Replace cell references with values
    expression = expression.replace(/[A-Z]+\d+/g, (cellRef) => {
      const cellValue = gridData[cellRef]?.value || '0'
      return isNaN(Number(cellValue)) ? '0' : cellValue
    })

    // Handle SUM function
    expression = expression.replace(/SUM\(([A-Z]+\d+):([A-Z]+\d+)\)/g, (match, start, end) => {
      const sum = calculateRangeSum(start, end, gridData)
      return sum.toString()
    })

    // Handle AVERAGE function
    expression = expression.replace(/AVERAGE\(([A-Z]+\d+):([A-Z]+\d+)\)/g, (match, start, end) => {
      const avg = calculateRangeAverage(start, end, gridData)
      return avg.toString()
    })

    // Evaluate the expression
    const result = eval(expression)
    return isNaN(result) ? '#ERROR' : result.toString()
  } catch (error) {
    return '#ERROR'
  }
}

function calculateRangeSum(start: string, end: string, gridData: Record<string, any>): number {
  const range = getCellsInRange(start, end)
  return range.reduce((sum, cellId) => {
    const value = Number(gridData[cellId]?.value || 0)
    return sum + (isNaN(value) ? 0 : value)
  }, 0)
}

function calculateRangeAverage(start: string, end: string, gridData: Record<string, any>): number {
  const range = getCellsInRange(start, end)
  const sum = calculateRangeSum(start, end, gridData)
  return range.length > 0 ? sum / range.length : 0
}

function getCellsInRange(start: string, end: string): string[] {
  const [startCol, startRow] = parseCellId(start)
  const [endCol, endRow] = parseCellId(end)
  
  const cells: string[] = []
  
  for (let row = startRow; row <= endRow; row++) {
    for (let col = startCol; col <= endCol; col++) {
      cells.push(columnNumberToLetter(col) + row)
    }
  }
  
  return cells
}

function parseCellId(cellId: string): [number, number] {
  const match = cellId.match(/^([A-Z]+)(\d+)$/)
  if (!match) throw new Error('Invalid cell ID')
  
  const col = columnLetterToNumber(match[1])
  const row = parseInt(match[2])
  
  return [col, row]
}

function columnLetterToNumber(letter: string): number {
  let result = 0
  for (let i = 0; i < letter.length; i++) {
    result = result * 26 + (letter.charCodeAt(i) - 64)
  }
  return result
}

function columnNumberToLetter(num: number): string {
  let result = ''
  while (num > 0) {
    num--
    result = String.fromCharCode(65 + (num % 26)) + result
    num = Math.floor(num / 26)
  }
  return result
}

export function formatCellValue(value: string, format: string): string {
  if (!value) return value

  switch (format) {
    case 'currency':
      const num = parseFloat(value)
      return isNaN(num) ? value : `$${num.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
    
    case 'percentage':
      const percent = parseFloat(value)
      return isNaN(percent) ? value : `${(percent * 100).toFixed(2)}%`
    
    case 'date':
      const date = new Date(value)
      return isNaN(date.getTime()) ? value : date.toLocaleDateString()
    
    case 'number':
      const number = parseFloat(value)
      return isNaN(number) ? value : number.toLocaleString()
    
    default:
      return value
  }
}