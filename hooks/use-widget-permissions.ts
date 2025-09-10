import { useState, useEffect } from 'react';

export interface WidgetPermission {
  allowResize: boolean;
  allowDrag: boolean;
  allowDelete: boolean;
  isLocked: boolean;
}

export interface WidgetConfigs {
  [widgetId: string]: WidgetPermission;
}

export function useWidgetPermissions() {
  const [widgetConfigs, setWidgetConfigs] = useState<WidgetConfigs>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin-widget-configs/configs');
      
      if (!response.ok) {
        throw new Error('Failed to fetch widget permissions');
      }
      
      const configs = await response.json();
      setWidgetConfigs(configs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching widget permissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const getWidgetPermission = (widgetId: string): WidgetPermission => {
    return widgetConfigs[widgetId] || {
      allowResize: true,
      allowDrag: true,
      allowDelete: true,
      isLocked: false
    };
  };

  const canResize = (widgetId: string): boolean => {
    const permission = getWidgetPermission(widgetId);
    return !permission.isLocked && permission.allowResize;
  };

  const canDrag = (widgetId: string): boolean => {
    const permission = getWidgetPermission(widgetId);
    return !permission.isLocked && permission.allowDrag;
  };

  const canDelete = (widgetId: string): boolean => {
    const permission = getWidgetPermission(widgetId);
    return !permission.isLocked && permission.allowDelete;
  };

  const isLocked = (widgetId: string): boolean => {
    const permission = getWidgetPermission(widgetId);
    return permission.isLocked;
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  return {
    widgetConfigs,
    loading,
    error,
    getWidgetPermission,
    canResize,
    canDrag,
    canDelete,
    isLocked,
    refetch: fetchPermissions
  };
}
