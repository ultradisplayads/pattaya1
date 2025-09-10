"use client"

import { useState, useEffect } from "react"
import { Responsive, WidthProvider } from 'react-grid-layout';
import { trackLayoutChange, trackWidgetResize, trackWidgetDrag, widgetTracker, getCurrentWidgetPositions, exportWidgetLayout } from "@/lib/widget-tracker"
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface TestWidget {
  id: string
  name: string
  description: string
}

export default function TestWidgetTrackingPage() {
  const [widgets] = useState<TestWidget[]>([
    { id: "widget-1", name: "Weather Widget", description: "Current weather conditions" },
    { id: "widget-2", name: "News Feed", description: "Latest news and updates" },
    { id: "widget-3", name: "Social Media", description: "Social media integration" },
    { id: "widget-4", name: "Analytics", description: "Website analytics and metrics" },
    { id: "widget-5", name: "Hot Deals", description: "Latest deals and promotions" },
    { id: "widget-6", name: "Radio Player", description: "Live radio streaming" }
  ])

  const [layout, setLayout] = useState([
    { i: "widget-1", x: 0, y: 0, w: 4, h: 2 },
    { i: "widget-2", x: 4, y: 0, w: 4, h: 2 },
    { i: "widget-3", x: 8, y: 0, w: 4, h: 2 },
    { i: "widget-4", x: 0, y: 2, w: 6, h: 3 },
    { i: "widget-5", x: 6, y: 2, w: 6, h: 2 },
    { i: "widget-6", x: 6, y: 4, w: 6, h: 1 }
  ])

  useEffect(() => {
    // Initialize widget tracker
    widgetTracker.initializeGrid({
      totalRows: 10,
      totalColumns: 12,
      gridWidth: 1200,
      gridHeight: 500,
      rowHeight: 50,
      margin: [10, 10],
      containerPadding: [10, 10]
    });

    // Track initial layout
    trackLayoutChange(layout, widgets, 'initial');
  }, [])

  const handleLayoutChange = (newLayout: any[]) => {
    setLayout(newLayout);
    trackLayoutChange(newLayout, widgets, 'layout-change');
  }

  const handleDragStop = (layout: any[], oldItem: any, newItem: any) => {
    const widget = widgets.find(w => w.id === newItem.i);
    trackWidgetDrag(newItem.i, { x: newItem.x, y: newItem.y }, widget?.name);
  }

  const handleResizeStop = (layout: any[], oldItem: any, newItem: any) => {
    const widget = widgets.find(w => w.id === newItem.i);
    trackWidgetResize(newItem.i, newItem, widget?.name);
  }

  const logCurrentPositions = () => {
    const positions = getCurrentWidgetPositions();
    console.log('📊 Current Widget Positions:', positions);
    console.table(positions.map(p => ({
      'Widget': p.name,
      'ID': p.id,
      'Position': `(${p.x}, ${p.y})`,
      'Size': `${p.w}×${p.h}`,
      'Row/Col': `${p.row}/${p.column}`,
      'Span': `${p.rowSpan}×${p.columnSpan}`,
      'Operation': p.operation
    })));
  }

  const exportLayout = () => {
    const layoutData = exportWidgetLayout();
    console.log('📋 Exported Layout:', layoutData);
    navigator.clipboard.writeText(layoutData).then(() => {
      alert('Layout data copied to clipboard!');
    });
  }

  const getGridStatistics = () => {
    const stats = widgetTracker.getGridStatistics();
    console.log('📈 Grid Statistics:', stats);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Widget Tracking Test Page</h1>
          <p className="text-gray-600 mb-6">
            This page demonstrates the widget position tracking functionality. 
            Drag and resize widgets to see real-time position logging in the console.
          </p>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={logCurrentPositions}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
            >
              📊 Log Current Positions
            </button>
            <button
              onClick={exportLayout}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium"
            >
              📋 Export Layout
            </button>
            <button
              onClick={getGridStatistics}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium"
            >
              📈 Grid Statistics
            </button>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">📝 Instructions:</h3>
            <ul className="text-yellow-700 space-y-1">
              <li>• Open your browser's Developer Console (F12)</li>
              <li>• Drag widgets around to see position tracking</li>
              <li>• Resize widgets to see size change tracking</li>
              <li>• Use the buttons above to log current positions and export data</li>
              <li>• All widget movements are logged with detailed information</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Interactive Widget Grid</h2>
          
          <ResponsiveGridLayout
            className="layout"
            layouts={{ lg: layout }}
            onLayoutChange={handleLayoutChange}
            onDragStop={handleDragStop}
            onResizeStop={handleResizeStop}
            onDragStart={() => widgetTracker.startContinuousLogging()}
            onResizeStart={() => widgetTracker.startContinuousLogging()}
            onDrag={(layout, oldItem, newItem) => {
              const widget = widgets.find(w => w.id === newItem.i);
              trackWidgetDrag(newItem.i, { x: newItem.x, y: newItem.y }, widget?.name);
            }}
            onResize={(layout, oldItem, newItem) => {
              const widget = widgets.find(w => w.id === newItem.i);
              trackWidgetResize(newItem.i, newItem, widget?.name);
            }}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={50}
            width={1200}
            isDraggable={true}
            isResizable={true}
            margin={[10, 10]}
            containerPadding={[10, 10]}
            useCSSTransforms={true}
            preventCollision={false}
            compactType="vertical"
          >
            {widgets.map((widget) => (
              <div key={widget.id} className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-800">{widget.name}</h3>
                  <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                    {widget.id}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{widget.description}</p>
                <div className="mt-3 text-xs text-gray-500">
                  <div>🖱️ Drag to move</div>
                  <div>📏 Resize from corners</div>
                </div>
              </div>
            ))}
          </ResponsiveGridLayout>
        </div>
      </div>
    </div>
  )
}
