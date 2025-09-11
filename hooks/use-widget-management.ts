import { useState, useEffect, useCallback } from 'react';
import { buildApiUrl } from '@/lib/strapi-config';

interface AdminControls {
  allowUserResizing: boolean;
  allowUserMoving: boolean;
  isMandatory: boolean;
  canBeDeleted: boolean;
  isLocked: boolean;
  requiresAdminApproval?: boolean;
  maxInstances?: number;
  restrictedToRoles?: string[];
}

interface WidgetPosition {
  gridColumn: number;
  gridRow: number;
  order: number;
  section: string;
}

interface WidgetSize {
  width: string;
  height: string;
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
}

interface WidgetManagement {
  id: number;
  widgetName: string;
  widgetType: string;
  displayName: string;
  description: string;
  category: string;
  isActive: boolean;
  adminControls: AdminControls;
  defaultPosition: WidgetPosition;
  defaultSize: WidgetSize;
  priority: number;
  version: string;
  lastModified: string;
}

interface WidgetPermissions {
  canResize: (widgetId: string) => boolean;
  canDrag: (widgetId: string) => boolean;
  canDelete: (widgetId: string) => boolean;
  isMandatory: (widgetId: string) => boolean;
  isLocked: (widgetId: string) => boolean;
  getMaxInstances: (widgetId: string) => number;
  isRoleRestricted: (widgetId: string, userRole: string) => boolean;
}

interface UseWidgetManagementReturn {
  widgets: WidgetManagement[];
  loading: boolean;
  error: string | null;
  permissions: WidgetPermissions;
  getWidgetByType: (widgetType: string) => WidgetManagement | null;
  getWidgetsByCategory: (category: string) => WidgetManagement[];
  getMandatoryWidgets: () => WidgetManagement[];
  getDeletableWidgets: () => WidgetManagement[];
  refreshWidgets: () => Promise<void>;
}

export function useWidgetManagement(): UseWidgetManagementReturn {
  const [widgets, setWidgets] = useState<WidgetManagement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWidgets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${buildApiUrl()}/api/widget-managements?populate=*`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch widgets: ${response.statusText}`);
      }
      
      const data = await response.json();
      setWidgets(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch widgets');
      console.error('Error fetching widgets:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWidgets();
  }, [fetchWidgets]);

  const getWidgetByType = useCallback((widgetType: string): WidgetManagement | null => {
    return widgets.find(widget => widget.widgetType === widgetType) || null;
  }, [widgets]);

  const getWidgetsByCategory = useCallback((category: string): WidgetManagement[] => {
    return widgets.filter(widget => widget.category === category);
  }, [widgets]);

  const getMandatoryWidgets = useCallback((): WidgetManagement[] => {
    return widgets.filter(widget => widget.adminControls?.isMandatory);
  }, [widgets]);

  const getDeletableWidgets = useCallback((): WidgetManagement[] => {
    return widgets.filter(widget => widget.adminControls?.canBeDeleted);
  }, [widgets]);

  const permissions: WidgetPermissions = {
    canResize: (widgetId: string) => {
      const widget = getWidgetByType(widgetId);
      return widget?.adminControls?.allowUserResizing && !widget?.adminControls?.isLocked;
    },
    
    canDrag: (widgetId: string) => {
      const widget = getWidgetByType(widgetId);
      return widget?.adminControls?.allowUserMoving && !widget?.adminControls?.isLocked;
    },
    
    canDelete: (widgetId: string) => {
      const widget = getWidgetByType(widgetId);
      return widget?.adminControls?.canBeDeleted && 
             !widget?.adminControls?.isMandatory && 
             !widget?.adminControls?.isLocked;
    },
    
    isMandatory: (widgetId: string) => {
      const widget = getWidgetByType(widgetId);
      return widget?.adminControls?.isMandatory || false;
    },
    
    isLocked: (widgetId: string) => {
      const widget = getWidgetByType(widgetId);
      return widget?.adminControls?.isLocked || false;
    },
    
    getMaxInstances: (widgetId: string) => {
      const widget = getWidgetByType(widgetId);
      return widget?.adminControls?.maxInstances || 1;
    },
    
    isRoleRestricted: (widgetId: string, userRole: string) => {
      const widget = getWidgetByType(widgetId);
      const restrictedRoles = widget?.adminControls?.restrictedToRoles;
      
      if (!restrictedRoles || restrictedRoles.length === 0) {
        return false;
      }
      
      return !restrictedRoles.includes(userRole);
    }
  };

  return {
    widgets,
    loading,
    error,
    permissions,
    getWidgetByType,
    getWidgetsByCategory,
    getMandatoryWidgets,
    getDeletableWidgets,
    refreshWidgets: fetchWidgets
  };
}

// Hook for individual widget permissions
export function useWidgetPermissions() {
  const { permissions } = useWidgetManagement();
  return permissions;
}

// Hook for widget configuration
export function useWidgetConfig(widgetType: string) {
  const { getWidgetByType, loading, error } = useWidgetManagement();
  const widget = getWidgetByType(widgetType);
  
  return {
    widget,
    loading,
    error,
    isActive: widget?.isActive || false,
    adminControls: widget?.adminControls,
    defaultPosition: widget?.defaultPosition,
    defaultSize: widget?.defaultSize,
    priority: widget?.priority || 0
  };
}
