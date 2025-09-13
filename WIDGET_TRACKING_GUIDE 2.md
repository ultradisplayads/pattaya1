# Widget Position Tracking Guide

This guide explains how to use the widget position tracking system that monitors and logs widget positions, placements, and grid information in real-time.

## Overview

The widget tracking system provides comprehensive monitoring of:
- Widget positions (x, y coordinates)
- Widget sizes (width, height)
- Grid placement (row, column, row span, column span)
- Real-time tracking during drag and resize operations
- Historical position data
- Grid utilization statistics

## Files Created/Modified

### New Files
- `lib/widget-tracker.ts` - Core tracking utility
- `app/test-widget-tracking/page.tsx` - Test page for demonstration
- `WIDGET_TRACKING_GUIDE.md` - This documentation

### Modified Files
- `components/DynamicDashboard.js` - Added tracking integration
- `components/homepage/dynamic-modular-homepage.tsx` - Added tracking integration
- `components/homepage/resizable-widget-wrapper.tsx` - Added tracking integration

## Quick Start

### 1. Basic Usage

```typescript
import { trackLayoutChange, trackWidgetResize, trackWidgetDrag, widgetTracker } from "@/lib/widget-tracker"

// Initialize the tracker
widgetTracker.initializeGrid({
  totalRows: 10,
  totalColumns: 12,
  gridWidth: 1200,
  gridHeight: 500,
  rowHeight: 50,
  margin: [10, 10],
  containerPadding: [10, 10]
});

// Track layout changes
trackLayoutChange(layout, widgets, 'layout-change');

// Track individual widget operations
trackWidgetResize(widgetId, dimensions, widgetName);
trackWidgetDrag(widgetId, position, widgetName);
```

### 2. Integration with React Grid Layout

```typescript
<ResponsiveGridLayout
  onLayoutChange={(newLayout) => {
    setLayout(newLayout);
    trackLayoutChange(newLayout, widgets, 'layout-change');
  }}
  onDragStop={(layout, oldItem, newItem) => {
    const widget = widgets.find(w => w.id === newItem.i);
    trackWidgetDrag(newItem.i, { x: newItem.x, y: newItem.y }, widget?.name);
  }}
  onResizeStop={(layout, oldItem, newItem) => {
    const widget = widgets.find(w => w.id === newItem.i);
    trackWidgetResize(newItem.i, newItem, widget?.name);
  }}
  // ... other props
>
```

## API Reference

### WidgetTracker Class

#### Methods

**`initializeGrid(gridInfo: GridInfo)`**
- Initializes the tracker with grid configuration
- Should be called once when the dashboard loads

**`trackLayoutChange(layout: any[], widgets: any[], operation: string)`**
- Tracks all widgets in a layout
- Operations: 'initial', 'drag', 'resize', 'layout-change'

**`trackWidgetResize(widgetId: string, dimensions: any, widgetName?: string)`**
- Tracks individual widget resize operations

**`trackWidgetDrag(widgetId: string, position: {x: number, y: number}, widgetName?: string)`**
- Tracks individual widget drag operations

**`getCurrentPositions(): WidgetPosition[]`**
- Returns current positions of all widgets

**`getGridStatistics()`**
- Returns grid utilization statistics

**`exportLayout(): string`**
- Exports current layout as JSON string

**`startContinuousLogging()`**
- Starts continuous logging during operations

**`stopContinuousLogging()`**
- Stops continuous logging

### Utility Functions

```typescript
// Quick access functions
trackLayoutChange(layout, widgets, operation)
trackWidgetResize(widgetId, dimensions, widgetName)
trackWidgetDrag(widgetId, position, widgetName)
getCurrentWidgetPositions()
exportWidgetLayout()
startWidgetTracking()
stopWidgetTracking()
```

## Console Output Examples

### Layout Change Logging
```
🎯 Widget Layout LAYOUT-CHANGE
📊 Grid Statistics: {totalWidgets: 6, gridRows: 5, gridColumns: 12, occupiedCells: 18}
┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
│ Widget      │ ID          │ Position    │ Size        │ Row/Col     │ Span        │
├─────────────┼─────────────┼─────────────┼─────────────┼─────────────┼─────────────┤
│ Weather     │ widget-1    │ (0, 0)      │ 4×2         │ 0/0         │ 2×4         │
│ News Feed   │ widget-2    │ (4, 0)      │ 4×2         │ 0/4         │ 2×4         │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
```

### Individual Widget Operations
```
🔧 Widget Resized: Weather Widget (widget-1)
   New Size: 6×3 (3×6 cells)
   Position: Row 0, Column 0

🎯 Widget Moved: News Feed (widget-2)
   New Position: Row 2, Column 4
   Movement: +0 columns, +2 rows
```

## Configuration Options

```typescript
const config = {
  enableConsoleLogging: true,    // Enable console output
  enableDetailedLogging: true,   // Show detailed information
  logInterval: 100,              // Logging interval in ms
  trackHistory: true,            // Keep position history
  maxHistorySize: 100            // Max history entries
}

const tracker = new WidgetTracker(config);
```

## Testing

### Test Page
Visit `/test-widget-tracking` to see the tracking system in action:

1. Open browser Developer Console (F12)
2. Drag and resize widgets
3. Use the control buttons to log positions and export data
4. Observe real-time console logging

### Manual Testing
```typescript
// Get current positions
const positions = getCurrentWidgetPositions();
console.log('Current positions:', positions);

// Export layout data
const layoutData = exportWidgetLayout();
console.log('Layout data:', layoutData);

// Get grid statistics
const stats = widgetTracker.getGridStatistics();
console.log('Grid stats:', stats);
```

## Data Structure

### WidgetPosition Interface
```typescript
interface WidgetPosition {
  id: string
  name: string
  x: number              // Grid X coordinate
  y: number              // Grid Y coordinate
  w: number              // Width in grid units
  h: number              // Height in grid units
  row: number            // Row number (same as y)
  column: number         // Column number (same as x)
  rowSpan: number        // Rows spanned (same as h)
  columnSpan: number     // Columns spanned (same as w)
  isDraggable: boolean
  isResizable: boolean
  static: boolean
  timestamp: number
  operation: 'initial' | 'drag' | 'resize' | 'layout-change'
}
```

### GridInfo Interface
```typescript
interface GridInfo {
  totalRows: number
  totalColumns: number
  gridWidth: number
  gridHeight: number
  rowHeight: number
  margin: [number, number]
  containerPadding: [number, number]
}
```

## Integration Examples

### With Existing Dashboard
The tracking is already integrated into:
- `DynamicDashboard.js` - Full dashboard with tracking buttons
- `dynamic-modular-homepage.tsx` - Homepage with widget tracking
- `resizable-widget-wrapper.tsx` - Individual widget wrapper

### Custom Integration
```typescript
// In your component
import { widgetTracker } from "@/lib/widget-tracker"

useEffect(() => {
  // Initialize tracking
  widgetTracker.initializeGrid({
    totalRows: 10,
    totalColumns: 12,
    gridWidth: 1200,
    gridHeight: 500,
    rowHeight: 50,
    margin: [10, 10],
    containerPadding: [10, 10]
  });
}, []);

// Track layout changes
const handleLayoutChange = (newLayout) => {
  setLayout(newLayout);
  trackLayoutChange(newLayout, widgets, 'layout-change');
};
```

## Performance Considerations

- Tracking is lightweight and doesn't impact performance
- History is limited to prevent memory leaks
- Continuous logging can be started/stopped as needed
- Console logging can be disabled in production

## Troubleshooting

### Common Issues

1. **No console output**: Check if `enableConsoleLogging` is true
2. **Missing position data**: Ensure `initializeGrid()` is called
3. **Incorrect coordinates**: Verify grid configuration matches your layout

### Debug Mode
```typescript
// Enable detailed logging
widgetTracker.config.enableDetailedLogging = true;

// Check current configuration
console.log('Tracker config:', widgetTracker.config);
```

## Future Enhancements

Potential improvements:
- Export to different formats (CSV, XML)
- Visual grid overlay
- Position validation
- Collision detection
- Performance metrics
- Integration with analytics

## Support

For issues or questions:
1. Check the console output for error messages
2. Verify grid configuration matches your layout
3. Test with the provided test page
4. Review the API documentation above
