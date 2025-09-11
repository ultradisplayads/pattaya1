'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, RefreshCw } from 'lucide-react';

interface WidgetPermission {
  allowResize: boolean;
  allowDrag: boolean;
  allowDelete: boolean;
  isLocked: boolean;
}

interface WidgetConfigs {
  [widgetId: string]: WidgetPermission;
}

const WIDGET_DESCRIPTIONS = {
  'weather': 'Weather information and forecasts',
  'breaking-news': 'Latest breaking news updates',
  'radio': 'Radio station player',
  'hot-deals': 'Current hot deals and offers',
  'news-hero': 'Featured news articles',
  'business-spotlight': 'Featured business listings',
  'social-feed': 'Social media feed',
  'trending': 'Trending topics and content',
  'youtube': 'YouTube video player',
  'events-calendar': 'Upcoming events calendar',
  'quick-links': 'Quick navigation links',
  'photo-gallery': 'Photo gallery display',
  'forum-activity': 'Forum activity feed',
  'google-reviews': 'Google reviews display',
  'traffic': 'Traffic information'
};

export default function WidgetPermissionsPage() {
  const [widgetConfigs, setWidgetConfigs] = useState<WidgetConfigs>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Fetch widget configurations
  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin-widget-configs/configs', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch widget configurations');
      }

      const configs = await response.json();
      setWidgetConfigs(configs);
    } catch (error) {
      console.error('Error fetching widget configs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load widget configurations',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Save widget configurations
  const saveConfigs = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/admin-widget-configs/configs', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ widgetConfigs }),
      });

      if (!response.ok) {
        throw new Error('Failed to save widget configurations');
      }

      toast({
        title: 'Success',
        description: 'Widget permissions updated successfully',
      });
    } catch (error) {
      console.error('Error saving widget configs:', error);
      toast({
        title: 'Error',
        description: 'Failed to save widget configurations',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  // Update specific widget permission
  const updateWidgetPermission = (widgetId: string, permission: keyof WidgetPermission, value: boolean) => {
    setWidgetConfigs(prev => ({
      ...prev,
      [widgetId]: {
        ...prev[widgetId],
        [permission]: value,
      },
    }));
  };

  // Reset to defaults
  const resetToDefaults = () => {
    const defaultConfigs: WidgetConfigs = {
      "weather": { "allowResize": true, "allowDrag": true, "allowDelete": false, "isLocked": false },
      "breaking-news": { "allowResize": true, "allowDrag": true, "allowDelete": false, "isLocked": false },
      "radio": { "allowResize": true, "allowDrag": true, "allowDelete": true, "isLocked": false },
      "hot-deals": { "allowResize": true, "allowDrag": true, "allowDelete": false, "isLocked": false },
      "news-hero": { "allowResize": true, "allowDrag": true, "allowDelete": false, "isLocked": false },
      "business-spotlight": { "allowResize": true, "allowDrag": true, "allowDelete": true, "isLocked": false },
      "social-feed": { "allowResize": true, "allowDrag": true, "allowDelete": true, "isLocked": false },
      "trending": { "allowResize": true, "allowDrag": true, "allowDelete": true, "isLocked": false },
      "youtube": { "allowResize": true, "allowDrag": true, "allowDelete": true, "isLocked": false },
      "events-calendar": { "allowResize": true, "allowDrag": true, "allowDelete": true, "isLocked": false },
      "quick-links": { "allowResize": true, "allowDrag": true, "allowDelete": true, "isLocked": false },
      "photo-gallery": { "allowResize": true, "allowDrag": true, "allowDelete": true, "isLocked": false },
      "forum-activity": { "allowResize": true, "allowDrag": true, "allowDelete": true, "isLocked": false },
      "google-reviews": { "allowResize": true, "allowDrag": true, "allowDelete": true, "isLocked": false },
      "traffic": { "allowResize": false, "allowDrag": false, "allowDelete": false, "isLocked": true }
    };
    setWidgetConfigs(defaultConfigs);
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Widget Permissions</h1>
          <p className="text-muted-foreground">
            Configure widget permissions for all users. Changes apply globally.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={fetchConfigs}
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={resetToDefaults}
          >
            Reset to Defaults
          </Button>
          <Button
            onClick={saveConfigs}
            disabled={saving}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {Object.entries(widgetConfigs).map(([widgetId, permissions]) => (
          <Card key={widgetId}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="capitalize">
                    {widgetId.replace('-', ' ')}
                  </CardTitle>
                  <CardDescription>
                    {WIDGET_DESCRIPTIONS[widgetId as keyof typeof WIDGET_DESCRIPTIONS] || 'Widget description'}
                  </CardDescription>
                </div>
                {permissions.isLocked && (
                  <Badge variant="destructive">Locked</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label htmlFor={`${widgetId}-resize`}>Allow Resize</Label>
                  <Switch
                    id={`${widgetId}-resize`}
                    checked={permissions.allowResize}
                    onCheckedChange={(checked) => 
                      updateWidgetPermission(widgetId, 'allowResize', checked)
                    }
                    disabled={permissions.isLocked}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`${widgetId}-drag`}>Allow Drag</Label>
                  <Switch
                    id={`${widgetId}-drag`}
                    checked={permissions.allowDrag}
                    onCheckedChange={(checked) => 
                      updateWidgetPermission(widgetId, 'allowDrag', checked)
                    }
                    disabled={permissions.isLocked}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`${widgetId}-delete`}>Allow Delete</Label>
                  <Switch
                    id={`${widgetId}-delete`}
                    checked={permissions.allowDelete}
                    onCheckedChange={(checked) => 
                      updateWidgetPermission(widgetId, 'allowDelete', checked)
                    }
                    disabled={permissions.isLocked}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`${widgetId}-locked`}>Lock Widget</Label>
                  <Switch
                    id={`${widgetId}-locked`}
                    checked={permissions.isLocked}
                    onCheckedChange={(checked) => 
                      updateWidgetPermission(widgetId, 'isLocked', checked)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator />

      <div className="bg-muted/50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Permission Types:</h3>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li><strong>Allow Resize:</strong> Users can resize the widget</li>
          <li><strong>Allow Drag:</strong> Users can drag the widget to different positions</li>
          <li><strong>Allow Delete:</strong> Users can remove the widget from their dashboard</li>
          <li><strong>Lock Widget:</strong> Prevents users from modifying the widget (overrides other settings)</li>
        </ul>
      </div>
    </div>
  );
}
