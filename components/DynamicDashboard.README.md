# DynamicDashboard Component

A fully-featured, customizable dashboard grid component built with React that allows users to drag, resize, and manage widgets with real-time persistence and lazy loading capabilities.

## Features

### 🎯 Core Functionality
- **Dynamic Grid System**: Drag, resize, and rearrange widgets using react-grid-layout
- **User Personalization**: Save and load custom layouts per user
- **Admin Controls**: Configurable widget behavior (resizable, mandatory, etc.)
- **Click-to-Expand Modals**: Full-screen detailed views for each widget
- **Lazy Loading**: Performance optimization with intersection observer
- **Responsive Design**: Works across all device sizes

### 🔧 Technical Features
- **Real-time Persistence**: Automatic saving of layout changes
- **Mock API Integration**: Ready-to-replace placeholder API calls
- **TypeScript Ready**: Well-documented with clear interfaces
- **Performance Optimized**: Lazy loading and efficient re-renders
- **Accessibility**: Keyboard navigation and screen reader support

## Installation

The component requires the following dependencies:

```bash
pnpm add react-grid-layout react-intersection-observer
```

## Usage

### Basic Implementation

```jsx
import DynamicDashboard from './components/DynamicDashboard';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DynamicDashboard />
    </div>
  );
}
```

### Test Page

Visit `/test-dynamic-dashboard` to see the component in action with all features demonstrated.

## API Integration

### Widget Configuration (Strapi)

The component expects widget configurations from your Strapi backend with the following structure:

```javascript
{
  id: 'unique-widget-id',           // e.g., 'hot-deals-1'
  name: 'Widget Display Name',      // e.g., 'Hot Deals'
  allowUserResizingAndMoving: boolean,  // Admin control
  isMandatory: boolean,             // Admin control
  defaultSize: { w: 6, h: 4 },      // Default dimensions
  defaultPosition: { x: 0, y: 0 }   // Default position
}
```

### User Layout Persistence

#### Save Layout
```javascript
POST /api/users/me/layout
Content-Type: application/json

{
  "layout": [
    { "i": "widget-id", "x": 0, "y": 0, "w": 6, "h": 4 },
    // ... more layout items
  ]
}
```

#### Load Layout
```javascript
GET /api/users/me/layout

Response:
{
  "layout": [
    { "i": "widget-id", "x": 0, "y": 0, "w": 6, "h": 4 },
    // ... saved layout items
  ]
}
```

## Widget Types & Admin Controls

### Admin Configuration Options

For each widget in Strapi, admins can configure:

1. **Allow User Resizing & Moving** (`allowUserResizingAndMoving`)
   - `true`: Users can drag and resize the widget
   - `false`: Widget is locked in position and size

2. **Is Mandatory** (`isMandatory`)
   - `true`: Widget cannot be deleted by users
   - `false`: Users can remove the widget from their dashboard

### Widget Examples

```javascript
// Advertisement Banner - Locked and Mandatory
{
  id: 'ad-banner',
  name: 'Advertisement',
  allowUserResizingAndMoving: false,
  isMandatory: true
}

// Hot Deals - Mandatory but Resizable
{
  id: 'hot-deals-1',
  name: 'Hot Deals',
  allowUserResizingAndMoving: true,
  isMandatory: true
}

// Sports Fixtures - Optional Widget
{
  id: 'sports-fixtures',
  name: 'Sports Fixtures',
  allowUserResizingAndMoving: true,
  isMandatory: false
}
```

## Performance Features

### Lazy Loading
- Widgets below the fold are lazy-loaded using `react-intersection-observer`
- Placeholder content is shown while loading
- Improves initial page load performance

### Optimized Re-renders
- Uses `useCallback` for event handlers
- Efficient state management
- Minimal re-renders on layout changes

## Styling

The component includes comprehensive CSS styling in `DynamicDashboard.css`:

- **Responsive Design**: Mobile-first approach
- **Modern UI**: Clean, professional appearance
- **Smooth Animations**: Transitions and hover effects
- **Accessibility**: High contrast and keyboard navigation

### Customization

You can customize the appearance by:

1. Modifying `DynamicDashboard.css`
2. Overriding CSS classes in your application
3. Using CSS variables for theming

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Development

### File Structure
```
components/
├── DynamicDashboard.js      # Main component
├── DynamicDashboard.css     # Styles
└── DynamicDashboard.README.md # This documentation
```

### Key Functions

- `saveLayoutToApi()`: Saves user layout to backend
- `loadUserLayout()`: Loads user's saved layout
- `fetchWidgetConfigs()`: Fetches widget configurations from Strapi
- `handleLayoutChange()`: Handles drag/resize events
- `handleExpandWidget()`: Opens widget in modal
- `handleDeleteWidget()`: Removes widget from dashboard

## Integration with Existing System

### Strapi Backend
1. Create widget configuration content type
2. Add admin interface for widget management
3. Implement API endpoints for layout persistence
4. Configure permissions for user data

### Frontend Integration
1. Replace mock API calls with real endpoints
2. Add authentication headers to API requests
3. Implement error handling and loading states
4. Add analytics tracking for user interactions

## Future Enhancements

- **Widget Templates**: Pre-defined widget layouts
- **Collaborative Dashboards**: Shared layouts between users
- **Advanced Filtering**: Filter widgets by category
- **Export/Import**: Save layouts as files
- **Real-time Updates**: Live widget content updates
- **Widget Marketplace**: Third-party widget support

## Troubleshooting

### Common Issues

1. **Widgets not loading**: Check API endpoints and network requests
2. **Layout not saving**: Verify user authentication and API permissions
3. **Performance issues**: Ensure lazy loading is working correctly
4. **Styling conflicts**: Check CSS specificity and imports

### Debug Mode

Enable console logging by setting `NODE_ENV=development` to see detailed API calls and state changes.

## License

This component is part of the Pattaya project and follows the same licensing terms.
