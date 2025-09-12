"use client";

import { useState, useEffect } from 'react';
import { 
  Settings, 
  Shield, 
  Filter, 
  Users, 
  Hash, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  XCircle,
  RefreshCw,
  Play,
  Pause,
  BarChart3,
  Eye,
  EyeOff,
  Trash2,
  Edit,
  Plus,
  Search,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { buildApiUrl } from '@/lib/strapi-config';

interface ModerationPost {
  id: number;
  source_platform: string;
  author_name: string;
  author_handle: string;
  post_text: string;
  timestamp: string;
  status: 'Pending Review' | 'Approved' | 'Rejected' | 'Quarantined';
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  category: string;
  ai_analysis: {
    is_safe: boolean;
    is_english: boolean;
    is_relevant: boolean;
    confidence_score: number;
    model_version: string;
  };
  moderation_notes?: string;
}

interface BannedUser {
  id: number;
  platform: string;
  user_handle_or_id: string;
  reason: string;
  description?: string;
  banned_at: string;
  active: boolean;
}

interface SafetyKeyword {
  id: number;
  term: string;
  category: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description?: string;
  active: boolean;
}

interface TrustedChannel {
  id: number;
  platform: string;
  channel_name: string;
  channel_handle: string;
  trust_level: 'High' | 'Medium' | 'Low';
  auto_approve: boolean;
  verification_status: 'Verified' | 'Pending' | 'Rejected';
  active: boolean;
}

export function SocialFeedAdminPanel({ className }: { className?: string }) {
  const [activeTab, setActiveTab] = useState('moderation');
  const [moderationPosts, setModerationPosts] = useState<ModerationPost[]>([]);
  const [bannedUsers, setBannedUsers] = useState<BannedUser[]>([]);
  const [safetyKeywords, setSafetyKeywords] = useState<SafetyKeyword[]>([]);
  const [trustedChannels, setTrustedChannels] = useState<TrustedChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    pendingReview: 0,
    approved: 0,
    rejected: 0,
    quarantined: 0,
    totalBannedUsers: 0,
    totalKeywords: 0,
    totalTrustedChannels: 0
  });

  // New item forms
  const [newBannedUser, setNewBannedUser] = useState({
    platform: '',
    user_handle_or_id: '',
    reason: '',
    description: ''
  });
  const [newSafetyKeyword, setNewSafetyKeyword] = useState({
    term: '',
    category: '',
    severity: 'Medium' as const,
    description: ''
  });
  const [newTrustedChannel, setNewTrustedChannel] = useState({
    platform: '',
    channel_name: '',
    channel_handle: '',
    trust_level: 'Medium' as const,
    auto_approve: false
  });

  const fetchModerationQueue = async () => {
    try {
      const response = await fetch(buildApiUrl('api/social-feed/moderation-queue?status=Pending Review&limit=50'));
      if (response.ok) {
        const data = await response.json();
        setModerationPosts(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch moderation queue:', error);
    }
  };

  const fetchBannedUsers = async () => {
    try {
      const response = await fetch(buildApiUrl('api/banned-social-users/banned-social-users'));
      if (response.ok) {
        const data = await response.json();
        setBannedUsers(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch banned users:', error);
    }
  };

  const fetchSafetyKeywords = async () => {
    try {
      const response = await fetch(buildApiUrl('api/content-safety-keywords/content-safety-keywords'));
      if (response.ok) {
        const data = await response.json();
        setSafetyKeywords(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch safety keywords:', error);
    }
  };

  const fetchTrustedChannels = async () => {
    try {
      const response = await fetch(buildApiUrl('api/trusted-channels/trusted-channels'));
      if (response.ok) {
        const data = await response.json();
        setTrustedChannels(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch trusted channels:', error);
    }
  };

  const fetchAllData = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchModerationQueue(),
      fetchBannedUsers(),
      fetchSafetyKeywords(),
      fetchTrustedChannels()
    ]);
    
    // Calculate stats
    setStats({
      pendingReview: moderationPosts.filter(p => p.status === 'Pending Review').length,
      approved: moderationPosts.filter(p => p.status === 'Approved').length,
      rejected: moderationPosts.filter(p => p.status === 'Rejected').length,
      quarantined: moderationPosts.filter(p => p.status === 'Quarantined').length,
      totalBannedUsers: bannedUsers.filter(u => u.active).length,
      totalKeywords: safetyKeywords.filter(k => k.active).length,
      totalTrustedChannels: trustedChannels.filter(c => c.active).length
    });
    
    setLoading(false);
    setRefreshing(false);
  };

  const moderatePost = async (postId: number, action: 'Approved' | 'Rejected' | 'Quarantined', notes?: string) => {
    try {
      const response = await fetch(buildApiUrl(`api/social-feed/moderate/${postId}`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, notes })
      });

      if (response.ok) {
        // Update local state
        setModerationPosts(prev => 
          prev.map(p => 
            p.id === postId 
              ? { ...p, status: action, moderation_notes: notes }
              : p
          )
        );
      }
    } catch (error) {
      console.error('Failed to moderate post:', error);
    }
  };

  const addBannedUser = async () => {
    try {
      const response = await fetch(buildApiUrl('api/banned-social-users/banned-social-users'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newBannedUser,
          banned_at: new Date().toISOString(),
          active: true
        })
      });

      if (response.ok) {
        setNewBannedUser({ platform: '', user_handle_or_id: '', reason: '', description: '' });
        fetchBannedUsers();
      }
    } catch (error) {
      console.error('Failed to add banned user:', error);
    }
  };

  const addSafetyKeyword = async () => {
    try {
      const response = await fetch(buildApiUrl('api/content-safety-keywords/content-safety-keywords'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newSafetyKeyword,
          added_at: new Date().toISOString(),
          active: true,
          case_sensitive: false
        })
      });

      if (response.ok) {
        setNewSafetyKeyword({ term: '', category: '', severity: 'Medium', description: '' });
        fetchSafetyKeywords();
      }
    } catch (error) {
      console.error('Failed to add safety keyword:', error);
    }
  };

  const addTrustedChannel = async () => {
    try {
      const response = await fetch(buildApiUrl('api/trusted-channels/trusted-channels'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newTrustedChannel,
          added_at: new Date().toISOString(),
          active: true,
          verification_status: 'Pending'
        })
      });

      if (response.ok) {
        setNewTrustedChannel({ platform: '', channel_name: '', channel_handle: '', trust_level: 'Medium', auto_approve: false });
        fetchTrustedChannels();
      }
    } catch (error) {
      console.error('Failed to add trusted channel:', error);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Pending Review':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'Quarantined':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'Rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'text-red-600 bg-red-100';
      case 'High':
        return 'text-orange-600 bg-orange-100';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'Low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Social Feed Administration</h2>
          <p className="text-muted-foreground">Manage content moderation, safety filters, and AI settings</p>
        </div>
        <Button
          onClick={fetchAllData}
          disabled={refreshing}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh All
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold">{stats.pendingReview}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Banned Users</p>
                <p className="text-2xl font-bold">{stats.totalBannedUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Safety Keywords</p>
                <p className="text-2xl font-bold">{stats.totalKeywords}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Trusted Channels</p>
                <p className="text-2xl font-bold">{stats.totalTrustedChannels}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Admin Panel */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="moderation">Moderation Queue</TabsTrigger>
          <TabsTrigger value="banned-users">Banned Users</TabsTrigger>
          <TabsTrigger value="safety-keywords">Safety Keywords</TabsTrigger>
          <TabsTrigger value="trusted-channels">Trusted Channels</TabsTrigger>
        </TabsList>

        {/* Moderation Queue Tab */}
        <TabsContent value="moderation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Moderation Queue</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {moderationPosts.map((post) => (
                    <div key={post.id} className="p-4 rounded-lg border">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(post.status)}
                          <span className="font-medium">{post.author_name}</span>
                          <span className="text-sm text-muted-foreground">{post.author_handle}</span>
                          <Badge variant="outline">{post.source_platform}</Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getSeverityColor(post.ai_analysis?.confidence_score > 0.8 ? 'High' : 'Medium')}>
                            {Math.round((post.ai_analysis?.confidence_score || 0) * 100)}% Confidence
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm mb-3">{post.post_text}</p>
                      
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-3">
                        <span>Sentiment: {post.sentiment}</span>
                        <span>Category: {post.category}</span>
                        <span>Safe: {post.ai_analysis?.is_safe ? 'Yes' : 'No'}</span>
                        <span>English: {post.ai_analysis?.is_english ? 'Yes' : 'No'}</span>
                        <span>Relevant: {post.ai_analysis?.is_relevant ? 'Yes' : 'No'}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          onClick={() => moderatePost(post.id, 'Approved')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => moderatePost(post.id, 'Quarantined')}
                        >
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Quarantine
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => moderatePost(post.id, 'Rejected')}
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Banned Users Tab */}
        <TabsContent value="banned-users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Banned Users Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add New Banned User */}
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-3">Add New Banned User</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select value={newBannedUser.platform} onValueChange={(value) => setNewBannedUser(prev => ({ ...prev, platform: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="X">X/Twitter</SelectItem>
                      <SelectItem value="Instagram">Instagram</SelectItem>
                      <SelectItem value="Facebook">Facebook</SelectItem>
                      <SelectItem value="TikTok">TikTok</SelectItem>
                      <SelectItem value="Bluesky">Bluesky</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Input
                    placeholder="User Handle or ID"
                    value={newBannedUser.user_handle_or_id}
                    onChange={(e) => setNewBannedUser(prev => ({ ...prev, user_handle_or_id: e.target.value }))}
                  />
                  
                  <Select value={newBannedUser.reason} onValueChange={(value) => setNewBannedUser(prev => ({ ...prev, reason: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Spam">Spam</SelectItem>
                      <SelectItem value="Inappropriate Content">Inappropriate Content</SelectItem>
                      <SelectItem value="Harassment">Harassment</SelectItem>
                      <SelectItem value="Fake Account">Fake Account</SelectItem>
                      <SelectItem value="Copyright Violation">Copyright Violation</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Input
                    placeholder="Description (optional)"
                    value={newBannedUser.description}
                    onChange={(e) => setNewBannedUser(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <Button onClick={addBannedUser} className="mt-3">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Banned User
                </Button>
              </div>

              {/* Banned Users List */}
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {bannedUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{user.user_handle_or_id}</div>
                        <div className="text-sm text-muted-foreground">
                          {user.platform} • {user.reason} • {new Date(user.banned_at).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge variant={user.active ? "destructive" : "secondary"}>
                        {user.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Safety Keywords Tab */}
        <TabsContent value="safety-keywords" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Safety Keywords</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add New Safety Keyword */}
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-3">Add New Safety Keyword</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Keyword or Term"
                    value={newSafetyKeyword.term}
                    onChange={(e) => setNewSafetyKeyword(prev => ({ ...prev, term: e.target.value }))}
                  />
                  
                  <Select value={newSafetyKeyword.category} onValueChange={(value) => setNewSafetyKeyword(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Explicit Content">Explicit Content</SelectItem>
                      <SelectItem value="Violence">Violence</SelectItem>
                      <SelectItem value="Hate Speech">Hate Speech</SelectItem>
                      <SelectItem value="Spam">Spam</SelectItem>
                      <SelectItem value="Political">Political</SelectItem>
                      <SelectItem value="Religious">Religious</SelectItem>
                      <SelectItem value="Drugs">Drugs</SelectItem>
                      <SelectItem value="Gambling">Gambling</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={newSafetyKeyword.severity} onValueChange={(value) => setNewSafetyKeyword(prev => ({ ...prev, severity: value as any }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Input
                    placeholder="Description (optional)"
                    value={newSafetyKeyword.description}
                    onChange={(e) => setNewSafetyKeyword(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <Button onClick={addSafetyKeyword} className="mt-3">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Safety Keyword
                </Button>
              </div>

              {/* Safety Keywords List */}
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {safetyKeywords.map((keyword) => (
                    <div key={keyword.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{keyword.term}</div>
                        <div className="text-sm text-muted-foreground">
                          {keyword.category} • {keyword.severity}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getSeverityColor(keyword.severity)}>
                          {keyword.severity}
                        </Badge>
                        <Badge variant={keyword.active ? "default" : "secondary"}>
                          {keyword.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trusted Channels Tab */}
        <TabsContent value="trusted-channels" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trusted Channels Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add New Trusted Channel */}
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-3">Add New Trusted Channel</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select value={newTrustedChannel.platform} onValueChange={(value) => setNewTrustedChannel(prev => ({ ...prev, platform: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="X">X/Twitter</SelectItem>
                      <SelectItem value="Instagram">Instagram</SelectItem>
                      <SelectItem value="Facebook">Facebook</SelectItem>
                      <SelectItem value="TikTok">TikTok</SelectItem>
                      <SelectItem value="Bluesky">Bluesky</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Input
                    placeholder="Channel Name"
                    value={newTrustedChannel.channel_name}
                    onChange={(e) => setNewTrustedChannel(prev => ({ ...prev, channel_name: e.target.value }))}
                  />
                  
                  <Input
                    placeholder="Channel Handle"
                    value={newTrustedChannel.channel_handle}
                    onChange={(e) => setNewTrustedChannel(prev => ({ ...prev, channel_handle: e.target.value }))}
                  />
                  
                  <Select value={newTrustedChannel.trust_level} onValueChange={(value) => setNewTrustedChannel(prev => ({ ...prev, trust_level: value as any }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Trust Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-4 mt-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newTrustedChannel.auto_approve}
                      onChange={(e) => setNewTrustedChannel(prev => ({ ...prev, auto_approve: e.target.checked }))}
                    />
                    <span className="text-sm">Auto-approve posts from this channel</span>
                  </label>
                </div>
                <Button onClick={addTrustedChannel} className="mt-3">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Trusted Channel
                </Button>
              </div>

              {/* Trusted Channels List */}
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {trustedChannels.map((channel) => (
                    <div key={channel.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{channel.channel_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {channel.platform} • {channel.channel_handle} • {channel.trust_level} Trust
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={channel.auto_approve ? "default" : "secondary"}>
                          {channel.auto_approve ? "Auto-approve" : "Manual"}
                        </Badge>
                        <Badge variant={channel.active ? "default" : "secondary"}>
                          {channel.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
