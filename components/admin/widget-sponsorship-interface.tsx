'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Building2, Save, X } from 'lucide-react';

interface WidgetSponsorshipData {
  isSponsored: boolean;
  sponsorName: string;
  sponsorLogo?: string;
  sponsorUrl?: string;
  sponsorshipType: 'banner' | 'content' | 'mixed';
  displayText?: string;
}

interface WidgetSponsorshipInterfaceProps {
  widgetId: string;
  widgetTitle: string;
  currentSponsorship?: WidgetSponsorshipData;
  isEditMode: boolean;
  onSave: (sponsorshipData: WidgetSponsorshipData) => void;
  onCancel?: () => void;
  className?: string;
}

export function WidgetSponsorshipInterface({
  widgetId,
  widgetTitle,
  currentSponsorship,
  isEditMode,
  onSave,
  onCancel,
  className = ''
}: WidgetSponsorshipInterfaceProps) {
  const [sponsorshipData, setSponsorshipData] = useState<WidgetSponsorshipData>(
    currentSponsorship || {
      isSponsored: false,
      sponsorName: '',
      sponsorLogo: '',
      sponsorUrl: '',
      sponsorshipType: 'banner',
      displayText: ''
    }
  );

  const handleSave = () => {
    onSave(sponsorshipData);
  };

  const handleCancel = () => {
    setSponsorshipData(currentSponsorship || {
      isSponsored: false,
      sponsorName: '',
      sponsorLogo: '',
      sponsorUrl: '',
      sponsorshipType: 'banner',
      displayText: ''
    });
    onCancel?.();
  };

  // Display sponsor banner when sponsored and not in edit mode
  if (sponsorshipData.isSponsored && !isEditMode) {
    return (
      <div className={`mb-4 ${className}`}>
        <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50">
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4 text-amber-600" />
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-300">
                    Sponsored
                  </Badge>
                  <span className="text-sm font-medium text-amber-900">
                    {sponsorshipData.displayText || `Sponsored by ${sponsorshipData.sponsorName}`}
                  </span>
                </div>
              </div>
              {sponsorshipData.sponsorLogo && (
                <img 
                  src={sponsorshipData.sponsorLogo} 
                  alt={`${sponsorshipData.sponsorName} logo`}
                  className="h-6 w-auto max-w-24 object-contain"
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Edit interface - only show when in edit mode
  if (!isEditMode) {
    return null;
  }

  return (
    <Card className={`mb-4 ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Widget Sponsorship Settings
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Configure sponsorship settings for "{widgetTitle}" widget
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable Sponsorship Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="sponsored-toggle" className="text-sm font-medium">
              Mark as Sponsored
            </Label>
            <p className="text-xs text-muted-foreground">
              Enable sponsorship display for this widget
            </p>
          </div>
          <Switch
            id="sponsored-toggle"
            checked={sponsorshipData.isSponsored}
            onCheckedChange={(checked) => 
              setSponsorshipData(prev => ({ ...prev, isSponsored: checked }))
            }
          />
        </div>

        {sponsorshipData.isSponsored && (
          <>
            <Separator />
            
            {/* Sponsor Name */}
            <div className="space-y-2">
              <Label htmlFor="sponsor-name" className="text-sm font-medium">
                Sponsor Name *
              </Label>
              <Input
                id="sponsor-name"
                placeholder="Enter sponsor company name"
                value={sponsorshipData.sponsorName}
                onChange={(e) => 
                  setSponsorshipData(prev => ({ ...prev, sponsorName: e.target.value }))
                }
              />
            </div>

            {/* Display Text */}
            <div className="space-y-2">
              <Label htmlFor="display-text" className="text-sm font-medium">
                Display Text
              </Label>
              <Input
                id="display-text"
                placeholder="Custom sponsorship message (optional)"
                value={sponsorshipData.displayText}
                onChange={(e) => 
                  setSponsorshipData(prev => ({ ...prev, displayText: e.target.value }))
                }
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to use default: "Sponsored by {sponsorshipData.sponsorName}"
              </p>
            </div>

            {/* Sponsor Logo URL */}
            <div className="space-y-2">
              <Label htmlFor="sponsor-logo" className="text-sm font-medium">
                Sponsor Logo URL
              </Label>
              <Input
                id="sponsor-logo"
                placeholder="https://example.com/logo.png"
                value={sponsorshipData.sponsorLogo}
                onChange={(e) => 
                  setSponsorshipData(prev => ({ ...prev, sponsorLogo: e.target.value }))
                }
              />
            </div>

            {/* Sponsor Website URL */}
            <div className="space-y-2">
              <Label htmlFor="sponsor-url" className="text-sm font-medium">
                Sponsor Website URL
              </Label>
              <Input
                id="sponsor-url"
                placeholder="https://sponsor-website.com"
                value={sponsorshipData.sponsorUrl}
                onChange={(e) => 
                  setSponsorshipData(prev => ({ ...prev, sponsorUrl: e.target.value }))
                }
              />
            </div>

            {/* Sponsorship Type */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Sponsorship Type</Label>
              <div className="flex gap-2">
                {(['banner', 'content', 'mixed'] as const).map((type) => (
                  <Button
                    key={type}
                    variant={sponsorshipData.sponsorshipType === type ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => 
                      setSponsorshipData(prev => ({ ...prev, sponsorshipType: type }))
                    }
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Banner: Show sponsor banner only • Content: Sponsored content mixed in • Mixed: Both
              </p>
            </div>

            {/* Preview */}
            {sponsorshipData.sponsorName && (
              <>
                <Separator />
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Preview</Label>
                  <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50">
                    <CardContent className="py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Building2 className="h-4 w-4 text-amber-600" />
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-300">
                              Sponsored
                            </Badge>
                            <span className="text-sm font-medium text-amber-900">
                              {sponsorshipData.displayText || `Sponsored by ${sponsorshipData.sponsorName}`}
                            </span>
                          </div>
                        </div>
                        {sponsorshipData.sponsorLogo && (
                          <img 
                            src={sponsorshipData.sponsorLogo} 
                            alt={`${sponsorshipData.sponsorName} logo`}
                            className="h-6 w-auto max-w-24 object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </>
        )}

        {/* Action Buttons */}
        <Separator />
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={sponsorshipData.isSponsored && !sponsorshipData.sponsorName.trim()}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
