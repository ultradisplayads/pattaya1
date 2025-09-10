import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { InView } from 'react-intersection-observer';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

/**
 * DynamicDashboard Component
 * 
 * A comprehensive dashboard with drag-and-drop functionality, widget management,
 * data persistence, modals, and lazy loading capabilities.
 * 
 * Features:
 * - Responsive grid layout with drag & drop
 * - Widget configuration from Strapi backend simulation
 * - Save/load user layouts via API simulation
 * - Click-to-expand modals
 * - Lazy loading with intersection observer
 * - Admin controls for widget management
 */
const DynamicDashboard = () => {
  // Step 1: Basic Grid State
  const [layout, setLayout] = useState([]);
  
  // Step 3: Widget Configuration State
  const [widgets, setWidgets] = useState([]);
  
  // Step 4: Data Persistence State
  const [isLoading, setIsLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Step 5: Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  
  // Step 5: Lazy Loading State
  const [visibleWidgets, setVisibleWidgets] = useState(new Set());

  /**
   * Step 3: Mock Strapi Widget Configuration
   * Simulates fetching widget configurations from Strapi backend
   */
  const mockWidgetConfigs = [
    {
      id: 'hot-deals-1',
      name: 'Hot Deals',
      allowUserResizingAndMoving: true,
      isMandatory: false,
      category: 'business',
      description: 'Latest deals and promotions'
    },
    {
      id: 'weather-widget',
      name: 'Weather',
      allowUserResizingAndMoving: true,
      isMandatory: true,
      category: 'information',
      description: 'Current weather conditions'
    },
    {
      id: 'banner-ad',
      name: 'Banner Advertisement',
      allowUserResizingAndMoving: false,
      isMandatory: true,
      category: 'advertisement',
      description: 'Fixed banner advertisement'
    },
    {
      id: 'news-feed',
      name: 'News Feed',
      allowUserResizingAndMoving: true,
      isMandatory: false,
      category: 'news',
      description: 'Latest news and updates'
    },
    {
      id: 'social-media',
      name: 'Social Media',
      allowUserResizingAndMoving: true,
      isMandatory: false,
      category: 'social',
      description: 'Social media integration'
    },
    {
      id: 'analytics-dashboard',
      name: 'Analytics',
      allowUserResizingAndMoving: true,
      isMandatory: true,
      category: 'analytics',
      description: 'Website analytics and metrics'
    }
  ];

  /**
   * Step 4: Mock Saved User Layout
   * Simulates loading a user's previously saved layout
   */
  const mockSavedLayout = [
    { i: 'hot-deals-1', x: 0, y: 0, w: 4, h: 2 },
    { i: 'weather-widget', x: 4, y: 0, w: 2, h: 2 },
    { i: 'banner-ad', x: 6, y: 0, w: 6, h: 1 },
    { i: 'news-feed', x: 0, y: 2, w: 3, h: 3 },
    { i: 'social-media', x: 3, y: 2, w: 3, h: 2 },
    { i: 'analytics-dashboard', x: 6, y: 1, w: 6, h: 3 }
  ];

  /**
   * Step 2: Handle Layout Changes
   * Updates layout state when user drags or resizes widgets
   */
  const handleLayoutChange = (newLayout) => {
    setLayout(newLayout);
    setHasUnsavedChanges(true);
    console.log('Layout changed:', newLayout);
  };

  /**
   * Step 4: Save Layout to API
   * Simulates saving the current layout to the backend
   */
  const saveLayoutToApi = async (currentLayout) => {
    try {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Extract only the essential layout data
      const simplifiedLayout = currentLayout.map(item => ({
        i: item.i,
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h
      }));
      
      console.log('Saving layout to /api/users/me/layout:', simplifiedLayout);
      
      // In a real implementation, this would be:
      // const response = await fetch('/api/users/me/layout', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ layout: simplifiedLayout })
      // });
      
      setHasUnsavedChanges(false);
      console.log('Layout saved successfully!');
      
    } catch (error) {
      console.error('Failed to save layout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Step 4: Load User's Saved Layout
   * Simulates loading a user's previously saved layout
   */
  const loadUserLayout = async () => {
    try {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real implementation, this would be:
      // const response = await fetch('/api/users/me/layout');
      // const savedLayout = await response.json();
      
      console.log('Loading saved layout from /api/users/me/layout');
      return mockSavedLayout;
      
    } catch (error) {
      console.error('Failed to load saved layout:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Step 3: Generate Default Layout
   * Creates a default layout based on widget configurations
   */
  const generateDefaultLayout = (widgetConfigs) => {
    return widgetConfigs.map((widget, index) => ({
      i: widget.id,
      x: (index % 3) * 4, // 3 columns
      y: Math.floor(index / 3) * 2, // 2 rows per widget
      w: widget.id === 'banner-ad' ? 12 : 4, // Banner spans full width
      h: widget.id === 'banner-ad' ? 1 : 2, // Banner is shorter
      isDraggable: widget.allowUserResizingAndMoving,
      isResizable: widget.allowUserResizingAndMoving
    }));
  };

  /**
   * Step 5: Handle Widget Expansion
   * Opens modal with widget details
   */
  const handleExpandWidget = (widgetId) => {
    const widget = widgets.find(w => w.id === widgetId);
    setModalContent({
      id: widgetId,
      name: widget?.name || 'Unknown Widget',
      description: widget?.description || 'No description available'
    });
    setIsModalOpen(true);
  };

  /**
   * Step 5: Handle Widget Deletion
   * Removes a widget from the layout (only if not mandatory)
   */
  const handleDeleteWidget = (widgetId) => {
    const widget = widgets.find(w => w.id === widgetId);
    if (widget && !widget.isMandatory) {
      setWidgets(prev => prev.filter(w => w.id !== widgetId));
      setLayout(prev => prev.filter(item => item.i !== widgetId));
      setHasUnsavedChanges(true);
      console.log(`Widget ${widgetId} deleted`);
    }
  };

  /**
   * Step 5: Handle Widget Visibility
   * Tracks which widgets are currently visible for lazy loading
   */
  const handleWidgetInView = (widgetId, inView) => {
    setVisibleWidgets(prev => {
      const newSet = new Set(prev);
      if (inView) {
        newSet.add(widgetId);
      } else {
        newSet.delete(widgetId);
      }
      return newSet;
    });
  };

  /**
   * Step 3 & 4: Initialize Dashboard
   * Loads widget configurations and user's saved layout
   */
  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        // Load widget configurations (simulating Strapi fetch)
        setWidgets(mockWidgetConfigs);
        
        // Try to load user's saved layout
        const savedLayout = await loadUserLayout();
        
        if (savedLayout && savedLayout.length > 0) {
          // Merge saved layout with widget configurations
          const mergedLayout = savedLayout.map(savedItem => {
            const widget = mockWidgetConfigs.find(w => w.id === savedItem.i);
            return {
              ...savedItem,
              isDraggable: widget?.allowUserResizingAndMoving || false,
              isResizable: widget?.allowUserResizingAndMoving || false
            };
          });
          setLayout(mergedLayout);
          console.log('Loaded saved layout:', mergedLayout);
        } else {
          // Generate default layout
          const defaultLayout = generateDefaultLayout(mockWidgetConfigs);
          setLayout(defaultLayout);
          console.log('Generated default layout:', defaultLayout);
        }
        
      } catch (error) {
        console.error('Failed to initialize dashboard:', error);
        // Fallback to default layout
        setWidgets(mockWidgetConfigs);
        setLayout(generateDefaultLayout(mockWidgetConfigs));
      }
    };

    initializeDashboard();
  }, []);

  /**
   * Step 5: Widget Content Component
   * Renders individual widget content with lazy loading
   */
  const WidgetContent = ({ widget, isVisible }) => {
    if (!isVisible) {
      return (
        <div className="widget-placeholder">
          <div className="loading-spinner"></div>
          <p>Loading {widget.name}...</p>
        </div>
      );
    }

    return (
      <div className="widget-content">
        <div className="widget-header">
          <h3>{widget.name}</h3>
          <div className="widget-actions">
            <button 
              className="expand-btn"
              onClick={() => handleExpandWidget(widget.id)}
              title="Expand widget"
            >
              ⚡
            </button>
            {!widget.isMandatory && (
              <button 
                className="delete-btn"
                onClick={() => handleDeleteWidget(widget.id)}
                title="Delete widget"
              >
                ✕
              </button>
            )}
          </div>
        </div>
        <div className="widget-body">
          <p className="widget-description">{widget.description}</p>
          <div className="widget-category">
            Category: <span className="category-badge">{widget.category}</span>
          </div>
          {widget.isMandatory && (
            <div className="mandatory-indicator">🔒 Mandatory</div>
          )}
          {!widget.allowUserResizingAndMoving && (
            <div className="locked-indicator">🔒 Locked</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="dynamic-dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h1>Dynamic Dashboard</h1>
        <div className="dashboard-controls">
          {hasUnsavedChanges && (
            <span className="unsaved-indicator">● Unsaved Changes</span>
          )}
          <button 
            className="save-btn"
            onClick={() => saveLayoutToApi(layout)}
            disabled={isLoading || !hasUnsavedChanges}
          >
            {isLoading ? 'Saving...' : 'Save Layout'}
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layout }}
        onLayoutChange={handleLayoutChange}
        onDragStop={saveLayoutToApi}
        onResizeStop={saveLayoutToApi}
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
          <div key={widget.id} className="widget-container">
            <InView
              triggerOnce={false}
              onChange={(inView) => handleWidgetInView(widget.id, inView)}
            >
              {({ inView, ref }) => (
                <div ref={ref} className="widget-wrapper">
                  <WidgetContent 
                    widget={widget} 
                    isVisible={inView} 
                  />
                </div>
              )}
            </InView>
          </div>
        ))}
      </ResponsiveGridLayout>

      {/* Step 5: Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modalContent?.name}</h2>
              <button 
                className="close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p><strong>Widget ID:</strong> {modalContent?.id}</p>
              <p><strong>Description:</strong> {modalContent?.description}</p>
              <div className="modal-actions">
                <button 
                  className="modal-btn primary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS Styles */}
      <style jsx>{`
        .dynamic-dashboard {
          padding: 20px;
          background-color: #f5f5f5;
          min-height: 100vh;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding: 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .dashboard-header h1 {
          margin: 0;
          color: #333;
        }

        .dashboard-controls {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .unsaved-indicator {
          color: #ff6b6b;
          font-weight: bold;
        }

        .save-btn {
          padding: 10px 20px;
          background: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }

        .save-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .widget-container {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          overflow: hidden;
          transition: transform 0.2s ease;
        }

        .widget-container:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .widget-wrapper {
          height: 100%;
          width: 100%;
        }

        .widget-content {
          padding: 15px;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .widget-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .widget-header h3 {
          margin: 0;
          color: #333;
          font-size: 16px;
        }

        .widget-actions {
          display: flex;
          gap: 5px;
        }

        .expand-btn, .delete-btn {
          width: 24px;
          height: 24px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .expand-btn {
          background: #2196F3;
          color: white;
        }

        .delete-btn {
          background: #f44336;
          color: white;
        }

        .widget-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .widget-description {
          margin: 0;
          color: #666;
          font-size: 14px;
        }

        .widget-category {
          font-size: 12px;
          color: #888;
        }

        .category-badge {
          background: #e3f2fd;
          color: #1976d2;
          padding: 2px 6px;
          border-radius: 12px;
          font-size: 11px;
        }

        .mandatory-indicator, .locked-indicator {
          font-size: 12px;
          color: #ff9800;
          font-weight: bold;
        }

        .widget-placeholder {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #f8f9fa;
          color: #666;
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid #f3f3f3;
          border-top: 2px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 10px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 8px;
          padding: 0;
          max-width: 500px;
          width: 90%;
          max-height: 80vh;
          overflow: hidden;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #eee;
        }

        .modal-header h2 {
          margin: 0;
          color: #333;
        }

        .close-btn {
          width: 30px;
          height: 30px;
          border: none;
          background: #f5f5f5;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }

        .modal-body {
          padding: 20px;
        }

        .modal-body p {
          margin: 10px 0;
          color: #666;
        }

        .modal-actions {
          margin-top: 20px;
          text-align: right;
        }

        .modal-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }

        .modal-btn.primary {
          background: #2196F3;
          color: white;
        }

        /* React Grid Layout overrides */
        .react-grid-item {
          transition: all 200ms ease;
        }

        .react-grid-item.react-draggable-dragging {
          transition: none;
          z-index: 3;
        }

        .react-grid-item.react-grid-placeholder {
          background: rgba(33, 150, 243, 0.2);
          border: 2px dashed #2196F3;
          border-radius: 8px;
          opacity: 0.2;
        }

        .react-grid-item > .react-resizable-handle {
          position: absolute;
          width: 20px;
          height: 20px;
          bottom: 0;
          right: 0;
          background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNiIgaGVpZ2h0PSI2IiB2aWV3Qm94PSIwIDAgNiA2IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8bGluZSB4MT0iNiIgeTE9IjYiIHgyPSI2IiB5Mj0iNiIgc3Ryb2tlPSIjOTk5IiBzdHJva2Utd2lkdGg9IjEiLz4KPGxpbmUgeDE9IjQiIHkxPSI2IiB4Mj0iNiIgeTI9IjQiIHN0cm9rZT0iIzk5OSIgc3Ryb2tlLXdpZHRoPSIxIi8+CjxsaW5lIHgxPSI1IiB5MT0iNiIgeDI9IjYiIHkyPSI1IiBzdHJva2U9IiM5OTkiIHN0cm9rZS13aWR0aD0iMSIvPgo8L3N2Zz4K');
          background-position: bottom right;
          padding: 0 3px 3px 0;
          background-repeat: no-repeat;
          background-origin: content-box;
          box-sizing: border-box;
          cursor: se-resize;
        }
      `}</style>
    </div>
  );
};

export default DynamicDashboard;