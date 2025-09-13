/**
 * Widget Position Tracker
 * 
 * A utility to track and log widget positions, placements, and grid information
 * in real-time during resize and drag operations.
 */

export interface WidgetPosition {
  id: string
  name: string
  x: number
  y: number
  w: number
  h: number
  row: number
  column: number
  rowSpan: number
  columnSpan: number
  isDraggable: boolean
  isResizable: boolean
  static: boolean
  timestamp: number
  operation: 'initial' | 'drag' | 'resize' | 'layout-change'
}

export interface GridInfo {
  totalRows: number
  totalColumns: number
  gridWidth: number
  gridHeight: number
  rowHeight: number
  margin: [number, number]
  containerPadding: [number, number]
}

export interface WidgetTrackerConfig {
  enableConsoleLogging: boolean
  enableDetailedLogging: boolean
  logInterval: number // milliseconds
  trackHistory: boolean
  maxHistorySize: number
}

export class WidgetTracker {
  private config: WidgetTrackerConfig
  private positionHistory: WidgetPosition[] = []
  private currentPositions: Map<string, WidgetPosition> = new Map()
  private gridInfo: GridInfo | null = null
  private logIntervalId: NodeJS.Timeout | null = null
  private lastLogTime = 0

  constructor(config: Partial<WidgetTrackerConfig> = {}) {
    this.config = {
      enableConsoleLogging: true,
      enableDetailedLogging: true,
      logInterval: 100, // Log every 100ms during operations
      trackHistory: true,
      maxHistorySize: 100,
      ...config
    }
  }

  /**
   * Initialize the tracker with grid information
   */
  public initializeGrid(gridInfo: GridInfo) {
    this.gridInfo = gridInfo
    this.log('Grid initialized:', gridInfo)
  }

  /**
   * Track widget positions from react-grid-layout
   */
  public trackLayoutChange(layout: any[], widgets: any[], operation: 'initial' | 'drag' | 'resize' | 'layout-change' = 'layout-change') {
    const timestamp = Date.now()
    
    // Calculate grid statistics
    const maxY = Math.max(...layout.map(item => item.y + item.h), 0)
    const maxX = Math.max(...layout.map(item => item.x + item.w), 0)
    
    const newPositions: WidgetPosition[] = layout.map(item => {
      const widget = widgets.find(w => w.id === item.i)
      
      const position: WidgetPosition = {
        id: item.i,
        name: widget?.name || 'Unknown Widget',
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h,
        row: item.y,
        column: item.x,
        rowSpan: item.h,
        columnSpan: item.w,
        isDraggable: item.isDraggable !== false,
        isResizable: item.isResizable !== false,
        static: item.static === true,
        timestamp,
        operation
      }

      this.currentPositions.set(item.i, position)
      return position
    })

    // Add to history if tracking is enabled
    if (this.config.trackHistory) {
      this.positionHistory.push(...newPositions)
      
      // Trim history if it exceeds max size
      if (this.positionHistory.length > this.config.maxHistorySize) {
        this.positionHistory = this.positionHistory.slice(-this.config.maxHistorySize)
      }
    }

    // Log positions
    this.logWidgetPositions(newPositions, operation, {
      totalWidgets: layout.length,
      gridRows: maxY + 1,
      gridColumns: maxX + 1,
      occupiedCells: this.calculateOccupiedCells(layout)
    })
  }

  /**
   * Track individual widget resize
   */
  public trackWidgetResize(widgetId: string, dimensions: any, widgetName?: string) {
    const timestamp = Date.now()
    
    const position: WidgetPosition = {
      id: widgetId,
      name: widgetName || 'Unknown Widget',
      x: dimensions.x || 0,
      y: dimensions.y || 0,
      w: dimensions.w || dimensions.width || 1,
      h: dimensions.h || dimensions.height || 1,
      row: dimensions.y || 0,
      column: dimensions.x || 0,
      rowSpan: dimensions.h || dimensions.height || 1,
      columnSpan: dimensions.w || dimensions.width || 1,
      isDraggable: true,
      isResizable: true,
      static: false,
      timestamp,
      operation: 'resize'
    }

    this.currentPositions.set(widgetId, position)
    
    if (this.config.trackHistory) {
      this.positionHistory.push(position)
    }

    this.logWidgetResize(position, dimensions)
  }

  /**
   * Track individual widget drag
   */
  public trackWidgetDrag(widgetId: string, position: {x: number, y: number}, widgetName?: string) {
    const timestamp = Date.now()
    
    const currentPos = this.currentPositions.get(widgetId)
    const newPosition: WidgetPosition = {
      id: widgetId,
      name: widgetName || currentPos?.name || 'Unknown Widget',
      x: position.x,
      y: position.y,
      w: currentPos?.w || 1,
      h: currentPos?.h || 1,
      row: position.y,
      column: position.x,
      rowSpan: currentPos?.h || 1,
      columnSpan: currentPos?.w || 1,
      isDraggable: true,
      isResizable: currentPos?.isResizable || true,
      static: false,
      timestamp,
      operation: 'drag'
    }

    this.currentPositions.set(widgetId, newPosition)
    
    if (this.config.trackHistory) {
      this.positionHistory.push(newPosition)
    }

    this.logWidgetDrag(newPosition, currentPos)
  }

  /**
   * Start continuous logging during operations
   */
  public startContinuousLogging() {
    if (this.logIntervalId) {
      clearInterval(this.logIntervalId)
    }

    this.logIntervalId = setInterval(() => {
      const now = Date.now()
      if (now - this.lastLogTime >= this.config.logInterval) {
        this.logCurrentState()
        this.lastLogTime = now
      }
    }, this.config.logInterval)
  }

  /**
   * Stop continuous logging
   */
  public stopContinuousLogging() {
    if (this.logIntervalId) {
      clearInterval(this.logIntervalId)
      this.logIntervalId = null
    }
  }

  /**
   * Get current widget positions
   */
  public getCurrentPositions(): WidgetPosition[] {
    return Array.from(this.currentPositions.values())
  }

  /**
   * Get position history
   */
  public getPositionHistory(): WidgetPosition[] {
    return [...this.positionHistory]
  }

  /**
   * Get grid statistics
   */
  public getGridStatistics() {
    const positions = this.getCurrentPositions()
    if (positions.length === 0) return null

    const maxY = Math.max(...positions.map(p => p.y + p.h), 0)
    const maxX = Math.max(...positions.map(p => p.x + p.w), 0)
    
    return {
      totalWidgets: positions.length,
      gridRows: maxY + 1,
      gridColumns: maxX + 1,
      occupiedCells: this.calculateOccupiedCells(positions),
      gridUtilization: this.calculateGridUtilization(positions, maxX + 1, maxY + 1)
    }
  }

  /**
   * Export current layout as JSON
   */
  public exportLayout(): string {
    const data = {
      timestamp: Date.now(),
      gridInfo: this.gridInfo,
      currentPositions: this.getCurrentPositions(),
      statistics: this.getGridStatistics()
    }
    return JSON.stringify(data, null, 2)
  }

  /**
   * Clear all tracking data
   */
  public clear() {
    this.positionHistory = []
    this.currentPositions.clear()
    this.stopContinuousLogging()
  }

  // Private methods

  private log(message: string, data?: any) {
    if (this.config.enableConsoleLogging) {
      console.log(`[WidgetTracker] ${message}`, data || '')
    }
  }

  private logWidgetPositions(positions: WidgetPosition[], operation: string, stats: any) {
    if (!this.config.enableConsoleLogging) return

    console.group(`🎯 Widget Layout ${operation.toUpperCase()}`)
    console.log(`📊 Grid Statistics:`, stats)
    
    if (this.config.enableDetailedLogging) {
      console.table(positions.map(p => ({
        'Widget': p.name,
        'ID': p.id,
        'Position': `(${p.x}, ${p.y})`,
        'Size': `${p.w}×${p.h}`,
        'Row/Col': `${p.row}/${p.column}`,
        'Span': `${p.rowSpan}×${p.columnSpan}`,
        'Draggable': p.isDraggable ? '✅' : '❌',
        'Resizable': p.isResizable ? '✅' : '❌',
        'Static': p.static ? '🔒' : '🔓'
      })))
    } else {
      positions.forEach(pos => {
        console.log(`📦 ${pos.name} (${pos.id}): Row ${pos.row}, Col ${pos.column}, Size ${pos.w}×${pos.h}`)
      })
    }
    
    console.groupEnd()
  }

  private logWidgetResize(position: WidgetPosition, dimensions: any) {
    if (!this.config.enableConsoleLogging) return

    console.log(`🔧 Widget Resized: ${position.name} (${position.id})`)
    console.log(`   New Size: ${position.w}×${position.h} (${position.columnSpan}×${position.rowSpan} cells)`)
    console.log(`   Position: Row ${position.row}, Column ${position.column}`)
    
    if (this.config.enableDetailedLogging) {
      console.log(`   Dimensions:`, dimensions)
    }
  }

  private logWidgetDrag(position: WidgetPosition, previousPosition?: WidgetPosition) {
    if (!this.config.enableConsoleLogging) return

    console.log(`🎯 Widget Moved: ${position.name} (${position.id})`)
    console.log(`   New Position: Row ${position.row}, Column ${position.column}`)
    
    if (previousPosition) {
      const deltaX = position.x - previousPosition.x
      const deltaY = position.y - previousPosition.y
      console.log(`   Movement: ${deltaX > 0 ? '+' : ''}${deltaX} columns, ${deltaY > 0 ? '+' : ''}${deltaY} rows`)
    }
  }

  private logCurrentState() {
    const positions = this.getCurrentPositions()
    const stats = this.getGridStatistics()
    
    console.log(`📊 Current Widget State:`, {
      totalWidgets: positions.length,
      gridSize: stats ? `${stats.gridColumns}×${stats.gridRows}` : 'Unknown',
      utilization: stats ? `${Math.round(stats.gridUtilization * 100)}%` : 'Unknown'
    })
  }

  private calculateOccupiedCells(positions: any[]): number {
    const occupied = new Set<string>()
    
    positions.forEach(pos => {
      for (let x = pos.x; x < pos.x + pos.w; x++) {
        for (let y = pos.y; y < pos.y + pos.h; y++) {
          occupied.add(`${x},${y}`)
        }
      }
    })
    
    return occupied.size
  }

  private calculateGridUtilization(positions: any[], totalColumns: number, totalRows: number): number {
    const occupiedCells = this.calculateOccupiedCells(positions)
    const totalCells = totalColumns * totalRows
    return totalCells > 0 ? occupiedCells / totalCells : 0
  }
}

// Global instance for easy access
export const widgetTracker = new WidgetTracker({
  enableConsoleLogging: true,
  enableDetailedLogging: true,
  logInterval: 100,
  trackHistory: true,
  maxHistorySize: 50
})

// Utility functions for easy integration
export const trackLayoutChange = (layout: any[], widgets: any[], operation?: string) => {
  widgetTracker.trackLayoutChange(layout, widgets, operation as any)
}

export const trackWidgetResize = (widgetId: string, dimensions: any, widgetName?: string) => {
  widgetTracker.trackWidgetResize(widgetId, dimensions, widgetName)
}

export const trackWidgetDrag = (widgetId: string, position: {x: number, y: number}, widgetName?: string) => {
  widgetTracker.trackWidgetDrag(widgetId, position, widgetName)
}

export const getCurrentWidgetPositions = () => {
  return widgetTracker.getCurrentPositions()
}

export const exportWidgetLayout = () => {
  return widgetTracker.exportLayout()
}

export const startWidgetTracking = () => {
  widgetTracker.startContinuousLogging()
}

export const stopWidgetTracking = () => {
  widgetTracker.stopContinuousLogging()
}
