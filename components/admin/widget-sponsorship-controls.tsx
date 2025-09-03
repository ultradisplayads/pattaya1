'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Loader2, Building2, ExternalLink } from "lucide-react";
import { strapiAPI, type WidgetConfig } from "@/lib/strapi-api";

interface WidgetSponsorshipControlsProps {
  widgetId: string;
  widgetName: string;
  onConfigUpdate?: (config: WidgetConfig) => void;
  className?: string;
}

export function WidgetSponsorshipControls({
  widgetId,
  widgetName,
  onConfigUpdate,
  className = ''
}: WidgetSponsorshipControlsProps) {
  const [config, setConfig] = useState<WidgetConfig['attributes']>({
    widgetId,
    isSponsoredWidget: false,
    sponsorName: '',
    sponsorBanner: '',
    sponsorLogo: '',
    sponsorUrl: '',
    displayText: '',
    sponsorshipType: 'banner',
    createdAt: '',
    updatedAt: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWidgetConfig();
  }, [widgetId]);

  const loadWidgetConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      const widgetConfig = await strapiAPI.getWidgetConfig(widgetId);
      if (widgetConfig) {
        setConfig(widgetConfig.attributes);
      }
    } catch (error) {
      console.error('Failed to load widget config:', error);
      setError('Failed to load configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      const updatedConfig = await strapiAPI.updateWidgetConfig(widgetId, config);
      setConfig(updatedConfig.attributes);
      onConfigUpdate?.(updatedConfig);
    } catch (error) {
      console.error('Failed to save widget config:', error);
      setError('Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = (updates: Partial<WidgetConfig['attributes']>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading configuration...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Sponsorship Controls - {widgetName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Enable Sponsorship */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="sponsored-toggle">Enable Sponsorship</Label>
            <p className="text-sm text-muted-foreground">
              Mark this widget as sponsored content
            </p>
          </div>
          <Switch
            id="sponsored-toggle"
            checked={config.isSponsoredWidget}
            onCheckedChange={(checked) => updateConfig({ isSponsoredWidget: checked })}
          />
        </div>

        {config.isSponsoredWidget && (
          <>
            {/* Sponsor Name */}
            <div className="space-y-2">
              <Label htmlFor="sponsor-name">Sponsor Name *</Label>
              <Input
                id="sponsor-name"
                placeholder="Enter sponsor company name"
                value={config.sponsorName || ''}
                onChange={(e) => updateConfig({ sponsorName: e.target.value })}
              />
            </div>

            {/* Sponsorship Type */}
            <div className="space-y-2">
              <Label>Sponsorship Type</Label>
              <Select
                value={config.sponsorshipType || 'banner'}
                onValueChange={(value: 'banner' | 'content' | 'mixed') => 
                  updateConfig({ sponsorshipType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="banner">Banner Only</SelectItem>
                  <SelectItem value="content">Content Integration</SelectItem>
                  <SelectItem value="mixed">Banner + Content</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Banner: Show sponsor banner • Content: Mix sponsored posts • Mixed: Both
              </p>
            </div>

            {/* Display Text */}
            <div className="space-y-2">
              <Label htmlFor="display-text">Custom Display Text</Label>
              <Input
                id="display-text"
                placeholder="Custom sponsorship message (optional)"
                value={config.displayText || ''}
                onChange={(e) => updateConfig({ displayText: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to use: "Sponsored by {config.sponsorName}"
              </p>
            </div>

            {/* Sponsor Logo */}
            <div className="space-y-2">
              <Label htmlFor="sponsor-logo">Sponsor Logo URL</Label>
              <Input
                id="sponsor-logo"
                placeholder="https://example.com/logo.png"
                value={config.sponsorLogo || ''}
                onChange={(e) => updateConfig({ sponsorLogo: e.target.value })}
              />
            </div>

            {/* Sponsor Website */}
            <div className="space-y-2">
              <Label htmlFor="sponsor-url">Sponsor Website</Label>
              <Input
                id="sponsor-url"
                placeholder="https://sponsor-website.com"
                value={config.sponsorUrl || ''}
                onChange={(e) => updateConfig({ sponsorUrl: e.target.value })}
              />
            </div>

            {/* Preview */}
            {config.sponsorName && (
              <div className="space-y-2">
                <Label>Preview</Label>
                <Card className="widget-sponsor-banner">
                  <CardContent className="py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-4 w-4 text-amber-600" />
                        <div className="flex items-center gap-2">
                          <Badge className="sponsored-badge-outline">
                            Sponsored
                          </Badge>
                          <span className="text-sm font-medium text-amber-900">
                            {config.displayText || `Sponsored by ${config.sponsorName}`}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {config.sponsorLogo && (
                          <img 
                            src={config.sponsorLogo} 
                            alt={`${config.sponsorName} logo`}
                            className="h-6 w-auto max-w-24 object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        )}
                        {config.sponsorUrl && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={config.sponsorUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t">
          <Button 
            onClick={handleSave} 
            disabled={saving || (config.isSponsoredWidget && !config.sponsorName?.trim())}
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Configuration
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
