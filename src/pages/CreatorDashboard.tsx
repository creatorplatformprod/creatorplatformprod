import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, format, parseISO } from 'date-fns';
import { 
  Settings, 
  Image, 
  Lock, 
  Unlock, 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  Wallet,
  Mail,
  MessageSquare,
  Eye,
  BarChart3,
  Twitter,
  Instagram
} from 'lucide-react';
import { api } from '@/lib/api';

const CreatorDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'status-cards' | 'collections' | 'analytics'>('profile');
  const [user, setUser] = useState<any>(null);
  const [statusCards, setStatusCards] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [selectedCollectionId, setSelectedCollectionId] = useState('');
  const [collectionFile, setCollectionFile] = useState<File | null>(null);
  const [uploadingCollectionMedia, setUploadingCollectionMedia] = useState(false);
  const [statusCardFile, setStatusCardFile] = useState<File | null>(null);
  const [uploadingStatusCardMedia, setUploadingStatusCardMedia] = useState(false);

  // Analytics state
  const [analyticsRange, setAnalyticsRange] = useState('30');
  const [analyticsGroupBy, setAnalyticsGroupBy] = useState<'day' | 'week' | 'month'>('day');
  const [analyticsMetric, setAnalyticsMetric] = useState<'revenue' | 'orders' | 'net' | 'platformFee'>('revenue');
  const [analyticsStatus, setAnalyticsStatus] = useState('completed');
  const [analyticsCollectionId, setAnalyticsCollectionId] = useState('all');
  const [analyticsCurrency, setAnalyticsCurrency] = useState('all');
  const [analyticsSeries, setAnalyticsSeries] = useState<any[]>([]);
  const [analyticsTotals, setAnalyticsTotals] = useState({
    revenue: 0,
    orders: 0,
    net: 0,
    platformFee: 0
  });
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [salesList, setSalesList] = useState<any[]>([]);
  const [salesTotal, setSalesTotal] = useState(0);
  const [salesLimit, setSalesLimit] = useState(25);
  const [salesOffset, setSalesOffset] = useState(0);
  const [salesSort, setSalesSort] = useState('createdAt_desc');
  const [salesSearch, setSalesSearch] = useState('');

  // Profile form state
  const [profileData, setProfileData] = useState({
    displayName: '',
    bio: '',
    walletAddress: '',
    telegramUsername: '',
    telegramBotToken: '',
    telegramChatId: '',
    twitterUrl: '',
    instagramUrl: '',
    tiktokUrl: '',
    twitchUrl: '',
    domainEmail: '',
    unlockAllPrice: 0,
    unlockAllCurrency: 'USD'
  });

  // Status card form state
  const [statusCardForm, setStatusCardForm] = useState({
    text: '',
    imageUrl: '',
    isLocked: false,
    order: 0
  });

  // Collection form state
  const [collectionForm, setCollectionForm] = useState({
    title: '',
    description: '',
    price: 0,
    currency: 'USD',
    tags: ''
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get('token');
    const tabParam = params.get('tab');
    const noticeParam = params.get('notice');
    if (tokenParam) {
      localStorage.setItem('token', tokenParam);
      navigate('/dashboard', { replace: true });
      return;
    }

    if (tabParam === 'profile') {
      setActiveTab('profile');
    }

    if (noticeParam === 'fill-links') {
      setInfoMessage('Fill in your profile links to activate these icons on your public page.');
    }

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const userResult = await api.getCurrentUser();
      if (userResult.success && userResult.user) {
        setUser(userResult.user);
        setProfileData({
          displayName: userResult.user.displayName || '',
          bio: userResult.user.bio || '',
          walletAddress: userResult.user.walletAddress || '',
          telegramUsername: userResult.user.telegramUsername || '',
          telegramBotToken: userResult.user.telegramBotToken || '',
          telegramChatId: userResult.user.telegramChatId || '',
          twitterUrl: userResult.user.twitterUrl || '',
          instagramUrl: userResult.user.instagramUrl || '',
          tiktokUrl: userResult.user.tiktokUrl || '',
          twitchUrl: userResult.user.twitchUrl || '',
          domainEmail: userResult.user.domainEmail || '',
          unlockAllPrice: userResult.user.unlockAllPrice || 0,
          unlockAllCurrency: userResult.user.unlockAllCurrency || 'USD'
        });
      }

      if (userResult.user?.username) {
        const statusCardsResult = await api.getStatusCards(userResult.user.username);
        if (statusCardsResult.success) {
          setStatusCards(statusCardsResult.statusCards || []);
        }

        const collectionsResult = await api.getMyCollections();
        if (collectionsResult.success) {
          setCollections(collectionsResult.collections || []);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
      if (err.message?.includes('Unauthorized') || err.message?.includes('Invalid token')) {
        localStorage.removeItem('token');
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      const result = await api.updateProfile(profileData);
      if (result.success) {
        setSuccess('Profile saved successfully!');
        await loadUserData();
      } else {
        setError(result.error || 'Failed to save profile');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStatusCard = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      const result = await api.createStatusCard({
        text: statusCardForm.text,
        imageUrl: statusCardForm.imageUrl || undefined,
        isLocked: statusCardForm.isLocked,
        order: statusCardForm.order
      });
      if (result.success) {
        setSuccess('Status card added!');
        setStatusCardForm({ text: '', imageUrl: '', isLocked: false, order: 0 });
        setStatusCardFile(null);
        await loadUserData();
      } else {
        setError(result.error || 'Failed to add status card');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add status card');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCollection = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      const tags = collectionForm.tags.split(',').map(t => t.trim()).filter(t => t);
      const result = await api.createCollection({
        title: collectionForm.title,
        description: collectionForm.description || undefined,
        price: collectionForm.price,
        currency: collectionForm.currency,
        tags: tags.length > 0 ? tags : undefined,
        media: [] // Media will be added separately via upload
      });
      if (result.success) {
        setSuccess('Collection created!');
        setCollectionForm({ title: '', description: '', price: 0, currency: 'USD', tags: '' });
        setSelectedCollectionId('');
        setCollectionFile(null);
        await loadUserData();
      } else {
        setError(result.error || 'Failed to create collection');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create collection');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveUnlockAllPrice = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      const parsedPrice = Number.isFinite(profileData.unlockAllPrice)
        ? profileData.unlockAllPrice
        : parseFloat(String(profileData.unlockAllPrice));
      const priceValue = Number.isFinite(parsedPrice) ? parsedPrice : null;
      const result = await api.updateProfile({
        unlockAllPrice: priceValue,
        unlockAllCurrency: profileData.unlockAllCurrency || 'USD'
      });
      if (result.success) {
        setSuccess('Unlock Everything price saved!');
        await loadUserData();
      } else {
        setError(result.error || 'Failed to save unlock price');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save unlock price');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadStatusCardImage = async () => {
    if (!statusCardFile) {
      setError('Please select an image or video to upload');
      return;
    }

    try {
      setUploadingStatusCardMedia(true);
      setError('');
      const uploadResult = await api.uploadFile(statusCardFile);
      if (uploadResult?.url) {
        setStatusCardForm({ ...statusCardForm, imageUrl: uploadResult.url });
        setSuccess('Media uploaded. You can now add the status card.');
      } else {
        setError('Upload failed');
      }
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploadingStatusCardMedia(false);
    }
  };

  const handleUploadCollectionMedia = async () => {
    if (!selectedCollectionId) {
      setError('Please select a collection');
      return;
    }
    if (!collectionFile) {
      setError('Please choose a file to upload');
      return;
    }

    try {
      setUploadingCollectionMedia(true);
      setError('');
      const uploadResult = await api.uploadFile(collectionFile);
      if (!uploadResult?.url) {
        throw new Error('Upload failed');
      }

      const attachResult = await api.addCollectionMedia(selectedCollectionId, {
        url: uploadResult.url,
        thumbnailUrl: uploadResult.thumbnailUrl || uploadResult.url,
        mediaType: uploadResult.mediaType,
        size: uploadResult.size
      });

      if (attachResult.success) {
        setSuccess('Media added to collection!');
        setCollectionFile(null);
        await loadUserData();
      } else {
        setError(attachResult.error || 'Failed to attach media');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload media');
    } finally {
      setUploadingCollectionMedia(false);
    }
  };

  const handleViewProfile = () => {
    if (user?.username) {
      navigate(`/${user.username}`);
    }
  };

  const handlePreviewPublic = () => {
    if (user?.username) {
      navigate(`/preview/${user.username}`);
    }
  };

  const handlePublicWebsite = () => {
    if (!user?.username) return;
    const isPublished = localStorage.getItem(`publicWebsitePublished:${user.username}`) === 'true';
    if (isPublished) {
      navigate(`/public/${user.username}`);
    } else {
      navigate(`/public-unavailable?username=${encodeURIComponent(user.username)}`);
    }
  };

  const formatMoney = (value: number, currencyCode?: string) => {
    const safeCurrency = currencyCode && currencyCode !== 'all' ? currencyCode : 'USD';
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: safeCurrency
      }).format(value || 0);
    } catch {
      return `$${(value || 0).toFixed(2)}`;
    }
  };

  const buildChartSeries = (summary: any) => {
    if (!summary?.range?.start || !summary?.range?.end) return [];
    const start = parseISO(summary.range.start);
    const end = parseISO(summary.range.end);
    const map = new Map<string, any>();
    (summary.series || []).forEach((row: any) => {
      map.set(row.period, row);
    });

    const metricKey = analyticsMetric;
    if (analyticsGroupBy === 'month') {
      const months = eachMonthOfInterval({ start, end });
      return months.map((date) => {
        const period = format(date, 'yyyy-MM');
        const row = map.get(period) || {};
        return {
          period,
          label: format(date, 'MMM yyyy'),
          revenue: row.revenue || 0,
          orders: row.orders || 0,
          net: row.net || 0,
          platformFee: row.platformFee || 0,
          value: row[metricKey] || 0
        };
      });
    }

    if (analyticsGroupBy === 'week') {
      const weeks = eachWeekOfInterval({ start, end }, { weekStartsOn: 1 });
      return weeks.map((date) => {
        const period = format(date, 'yyyy-ww', { weekStartsOn: 1 });
        const row = map.get(period) || {};
        return {
          period,
          label: `Wk ${format(date, 'ww', { weekStartsOn: 1 })}`,
          revenue: row.revenue || 0,
          orders: row.orders || 0,
          net: row.net || 0,
          platformFee: row.platformFee || 0,
          value: row[metricKey] || 0
        };
      });
    }

    const days = eachDayOfInterval({ start, end });
    return days.map((date) => {
      const period = format(date, 'yyyy-MM-dd');
      const row = map.get(period) || {};
      return {
        period,
        label: format(date, 'MMM d'),
        revenue: row.revenue || 0,
        orders: row.orders || 0,
        net: row.net || 0,
        platformFee: row.platformFee || 0,
        value: row[metricKey] || 0
      };
    });
  };

  const loadAnalytics = async () => {
    if (!user?.username) return;
    try {
      setAnalyticsLoading(true);
      setError('');

      const collectionParam =
        analyticsCollectionId === 'bundle'
          ? 'all'
          : analyticsCollectionId !== 'all'
            ? analyticsCollectionId
            : undefined;

      const summaryResult = await api.getSalesSummary({
        range: analyticsRange,
        groupBy: analyticsGroupBy,
        metric: analyticsMetric,
        status: analyticsStatus,
        collectionId: collectionParam,
        currency: analyticsCurrency !== 'all' ? analyticsCurrency : undefined
      });

      if (summaryResult.success) {
        setAnalyticsTotals({
          revenue: summaryResult.totals?.revenue || 0,
          orders: summaryResult.totals?.orders || 0,
          net: summaryResult.totals?.net || 0,
          platformFee: summaryResult.totals?.platformFee || 0
        });
        setAnalyticsSeries(buildChartSeries(summaryResult));
      } else {
        setAnalyticsTotals({ revenue: 0, orders: 0, net: 0, platformFee: 0 });
        setAnalyticsSeries([]);
      }

      const listResult = await api.getSalesList({
        range: analyticsRange,
        status: analyticsStatus,
        collectionId: collectionParam,
        currency: analyticsCurrency !== 'all' ? analyticsCurrency : undefined,
        limit: salesLimit,
        offset: salesOffset,
        sort: salesSort,
        search: salesSearch || undefined
      });

      if (listResult.success) {
        setSalesList(listResult.sales || []);
        setSalesTotal(listResult.total || 0);
      } else {
        setSalesList([]);
        setSalesTotal(0);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load analytics');
    } finally {
      setAnalyticsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab !== 'analytics') return;
    loadAnalytics();
  }, [
    activeTab,
    analyticsRange,
    analyticsGroupBy,
    analyticsMetric,
    analyticsStatus,
    analyticsCollectionId,
    analyticsCurrency,
    salesOffset,
    salesLimit,
    salesSort,
    salesSearch
  ]);

  useEffect(() => {
    setSalesOffset(0);
  }, [analyticsRange, analyticsGroupBy, analyticsMetric, analyticsStatus, analyticsCollectionId, analyticsCurrency, salesSearch]);

  return (
    <div className="min-h-screen feed-bg">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold text-foreground">Creator Dashboard</h1>
              <p className="text-muted-foreground mt-1">Manage your content and profile</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button onClick={handlePreviewPublic} variant="outline" className="w-full sm:w-auto">
                <Eye className="w-4 h-4 mr-2" />
                Preview Public
              </Button>
              <Button onClick={handlePublicWebsite} className="w-full sm:w-auto">
                Public Website
              </Button>
            </div>
          </div>

        {/* Success/Error Messages */}
        {infoMessage && (
          <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-sm text-blue-600 dark:text-blue-400">{infoMessage}</p>
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Tabs */}
          <div className="mb-6 border-b border-border">
            <div className="flex flex-wrap justify-center gap-2 pb-2 sm:justify-start sm:gap-2">
              <button
                onClick={() => {
                  setActiveTab('profile');
                  setError('');
                  setSuccess('');
                  setInfoMessage('');
                }}
                className={`w-[calc(50%-0.25rem)] sm:w-auto px-4 py-2 font-medium transition-colors flex items-center justify-center ${
                  activeTab === 'profile'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Settings className="w-4 h-4 inline mr-2" />
                Profile Settings
              </button>
              <button
                onClick={() => {
                  setActiveTab('status-cards');
                  setError('');
                  setSuccess('');
                  setInfoMessage('');
                }}
                className={`w-[calc(50%-0.25rem)] sm:w-auto px-4 py-2 font-medium transition-colors flex items-center justify-center ${
                  activeTab === 'status-cards'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <MessageSquare className="w-4 h-4 inline mr-2" />
                Status Cards
              </button>
              <button
                onClick={() => {
                  setActiveTab('collections');
                  setError('');
                  setSuccess('');
                  setInfoMessage('');
                }}
                className={`w-[calc(50%-0.25rem)] sm:w-auto px-4 py-2 font-medium transition-colors flex items-center justify-center ${
                  activeTab === 'collections'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Image className="w-4 h-4 inline mr-2" />
                Collections
              </button>
              <button
                onClick={() => {
                  setActiveTab('analytics');
                  setError('');
                  setSuccess('');
                  setInfoMessage('');
                }}
                className={`w-[calc(50%-0.25rem)] sm:w-auto px-4 py-2 font-medium transition-colors flex items-center justify-center ${
                  activeTab === 'analytics'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <BarChart3 className="w-4 h-4 inline mr-2" />
                Analytics
              </button>
            </div>
          </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="post-card rounded-xl p-6 space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Profile Settings</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Display Name
                </label>
                <Input
                  value={profileData.displayName}
                  onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                  placeholder="Your display name"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Bio
                </label>
                <Textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  placeholder="Tell us about yourself"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Telegram Username (Public)
                </label>
                <Input
                  value={profileData.telegramUsername}
                  onChange={(e) => setProfileData({ ...profileData, telegramUsername: e.target.value })}
                  placeholder="yourusername"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Social links saved here appear on your public profile sidebar and footer.
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
                  <Twitter className="w-4 h-4" />
                  Twitter / X URL
                </label>
                <Input
                  value={profileData.twitterUrl}
                  onChange={(e) => setProfileData({ ...profileData, twitterUrl: e.target.value })}
                  placeholder="https://twitter.com/yourhandle"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
                  <Instagram className="w-4 h-4" />
                  Instagram URL
                </label>
                <Input
                  value={profileData.instagramUrl}
                  onChange={(e) => setProfileData({ ...profileData, instagramUrl: e.target.value })}
                  placeholder="https://instagram.com/yourhandle"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
                  <span className="w-4 h-4 inline-flex items-center justify-center">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.8v13.1a2.48 2.48 0 0 1-2.47 2.48 2.48 2.48 0 0 1-2.48-2.48 2.48 2.48 0 0 1 2.48-2.48c.24 0 .47.03.69.08V8.72a6.06 6.06 0 0 0-.69-.04A6.42 6.42 0 0 0 3.13 15.1a6.42 6.42 0 0 0 6.42 6.42 6.42 6.42 0 0 0 6.42-6.42V9.78a8.7 8.7 0 0 0 3.62.78z"/>
                    </svg>
                  </span>
                  TikTok URL
                </label>
                <Input
                  value={profileData.tiktokUrl}
                  onChange={(e) => setProfileData({ ...profileData, tiktokUrl: e.target.value })}
                  placeholder="https://tiktok.com/@yourhandle"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
                  <span className="w-4 h-4 inline-flex items-center justify-center">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4 3h16v10h-5l-3 3h-2v-3H4V3zm2 2v6h4v3.5L13 11h5V5H6zm11.5 9.5h2.5V21h-6v-3h4v-3.5z"/>
                    </svg>
                  </span>
                  Twitch URL
                </label>
                <Input
                  value={profileData.twitchUrl}
                  onChange={(e) => setProfileData({ ...profileData, twitchUrl: e.target.value })}
                  placeholder="https://twitch.tv/yourhandle"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
                  <Wallet className="w-4 h-4" />
                  Wallet Address
                </label>
                <Input
                  value={profileData.walletAddress}
                  onChange={(e) => setProfileData({ ...profileData, walletAddress: e.target.value })}
                  placeholder="0x..."
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Telegram Bot Token
                </label>
                <Input
                  value={profileData.telegramBotToken}
                  onChange={(e) => setProfileData({ ...profileData, telegramBotToken: e.target.value })}
                  placeholder="123456:ABCDEF..."
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Create a Telegram bot (via BotFather) and paste the token here. Payment events will be sent to your Telegram.
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Telegram Chat ID
                </label>
                <Input
                  value={profileData.telegramChatId}
                  onChange={(e) => setProfileData({ ...profileData, telegramChatId: e.target.value })}
                  placeholder="123456789"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Add your bot to a chat and use that chat’s ID. You’ll get a message for each payment and completion.
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Domain Email (Resend From Address)
                </label>
                <Input
                  type="email"
                  value={profileData.domainEmail}
                  onChange={(e) => setProfileData({ ...profileData, domainEmail: e.target.value })}
                  placeholder="alina@yourdomain.com"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Use a sender address from your domain (for example, alina@yourplatformdomain.com). This is the From email for access links and the business email shown in your public footer.
                </p>
              </div>
            </div>

            <Button onClick={handleSaveProfile} className="w-full md:w-auto">
              <Save className="w-4 h-4 mr-2" />
              Save Profile
            </Button>
          </div>
        )}

        {/* Status Cards Tab */}
        {activeTab === 'status-cards' && (
          <div className="space-y-6">
            {/* Add Status Card Form */}
            <div className="post-card rounded-xl p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">Add Status Card</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Text Content
                  </label>
                  <Textarea
                    value={statusCardForm.text}
                    onChange={(e) => setStatusCardForm({ ...statusCardForm, text: e.target.value })}
                    placeholder="Your status message..."
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Image URL (Optional)
                  </label>
                  <Input
                    value={statusCardForm.imageUrl}
                    onChange={(e) => setStatusCardForm({ ...statusCardForm, imageUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium text-foreground block">
                    Or upload image/video (max 25MB)
                  </label>
                  <div className="flex flex-col md:flex-row gap-3">
                    <Input
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => setStatusCardFile(e.target.files?.[0] || null)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleUploadStatusCardImage}
                      disabled={uploadingStatusCardMedia}
                    >
                      {uploadingStatusCardMedia ? 'Uploading...' : 'Upload'}
                    </Button>
                  </div>
                </div>

                {statusCardForm.imageUrl && (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isLocked"
                      checked={statusCardForm.isLocked}
                      onChange={(e) => setStatusCardForm({ ...statusCardForm, isLocked: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <label htmlFor="isLocked" className="text-sm text-foreground flex items-center gap-2">
                      {statusCardForm.isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                      Lock this status card (requires unlock to view)
                    </label>
                  </div>
                )}

                <Button onClick={handleAddStatusCard} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Status Card
                </Button>
              </div>
            </div>

            {/* Existing Status Cards */}
            <div className="post-card rounded-xl p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">Your Status Cards</h3>
              <div className="space-y-4">
                {statusCards.length === 0 ? (
                  <div className="text-muted-foreground text-center py-8 space-y-2">
                    <p className="font-medium text-foreground">No status cards yet</p>
                    <p className="text-sm text-muted-foreground">
                      Status cards appear on your homepage and highlight updates. Add your first one above.
                    </p>
                  </div>
                ) : (
                  statusCards.map((card, index) => (
                    <div key={index} className="border border-border rounded-lg p-4">
                      <p className="text-foreground">{card.text}</p>
                      {card.imageUrl && (
                        <div className="mt-2 flex items-center gap-2">
                          <Image className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Has image</span>
                          {card.isLocked && <Lock className="w-4 h-4 text-primary" />}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Collections Tab */}
        {activeTab === 'collections' && (
          <div className="space-y-6">
            {/* Unlock Everything Price */}
            <div className="post-card rounded-xl p-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">Unlock Everything Price</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Set the price for the “Unlock Everything” button. This gives clients access to all of your collections.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Price
                  </label>
                  <Input
                    type="number"
                    value={profileData.unlockAllPrice}
                    onChange={(e) => setProfileData({ ...profileData, unlockAllPrice: parseFloat(e.target.value) })}
                    placeholder="199.99"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Currency
                  </label>
                  <select
                    value={profileData.unlockAllCurrency}
                    onChange={(e) => setProfileData({ ...profileData, unlockAllCurrency: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>
              <Button onClick={handleSaveUnlockAllPrice} className="w-full mt-4">
                <Save className="w-4 h-4 mr-2" />
                Save Unlock Price
              </Button>
            </div>

            {/* Add Collection Form */}
            <div className="post-card rounded-xl p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">Create Collection</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Collection Title
                  </label>
                  <Input
                    value={collectionForm.title}
                    onChange={(e) => setCollectionForm({ ...collectionForm, title: e.target.value })}
                    placeholder="My Exclusive Collection"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Description
                  </label>
                  <Textarea
                    value={collectionForm.description}
                    onChange={(e) => setCollectionForm({ ...collectionForm, description: e.target.value })}
                    placeholder="Describe your collection..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Price
                    </label>
                    <Input
                      type="number"
                      value={collectionForm.price}
                      onChange={(e) => setCollectionForm({ ...collectionForm, price: parseFloat(e.target.value) })}
                      placeholder="4.99"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Currency
                    </label>
                    <select
                      value={collectionForm.currency}
                      onChange={(e) => setCollectionForm({ ...collectionForm, currency: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Tags (comma separated)
                  </label>
                  <Input
                    value={collectionForm.tags}
                    onChange={(e) => setCollectionForm({ ...collectionForm, tags: e.target.value })}
                    placeholder="art, photography, exclusive"
                  />
                </div>

                <Button onClick={handleAddCollection} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Collection
                </Button>
              </div>
            </div>

            {/* Upload Media to Collection */}
            <div className="post-card rounded-xl p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">Upload Media</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Select Collection
                  </label>
                  <select
                    value={selectedCollectionId}
                    onChange={(e) => setSelectedCollectionId(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  >
                    <option value="">Choose a collection</option>
                    {collections.map((collection) => (
                      <option key={collection._id} value={collection._id}>
                        {collection.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    File (image/video, max 25MB)
                  </label>
                  <Input
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => setCollectionFile(e.target.files?.[0] || null)}
                  />
                </div>

                <Button
                  type="button"
                  onClick={handleUploadCollectionMedia}
                  disabled={uploadingCollectionMedia}
                  className="w-full"
                >
                  {uploadingCollectionMedia ? 'Uploading...' : 'Upload Media'}
                </Button>
              </div>
            </div>

            {/* Existing Collections */}
            <div className="post-card rounded-xl p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">Your Collections</h3>
              <div className="space-y-4">
                {collections.length === 0 ? (
                  <div className="text-muted-foreground text-center py-8 space-y-2">
                    <p className="font-medium text-foreground">No collections yet</p>
                    <p className="text-sm text-muted-foreground">
                      Collections show up in your sidebar and feed. Create one to start selling access.
                    </p>
                  </div>
                ) : (
                  collections.map((collection, index) => (
                    <div key={index} className="border border-border rounded-lg p-4">
                      <h4 className="font-bold text-foreground">{collection.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{collection.description}</p>
                      <div className="mt-2 flex items-center gap-4 text-sm">
                        <span className="text-foreground">${collection.price} {collection.currency}</span>
                        <span className="text-muted-foreground">{collection.media?.length || 0} items</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="post-card rounded-xl p-6 space-y-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold text-foreground">Sales Analytics</h2>
                <p className="text-sm text-muted-foreground">
                  Choose different filters to explore revenue, orders, and payout performance.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Range</label>
                  <select
                    value={analyticsRange}
                    onChange={(e) => setAnalyticsRange(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  >
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                    <option value="365">Last 12 months</option>
                    <option value="all">All time</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Group By</label>
                  <select
                    value={analyticsGroupBy}
                    onChange={(e) => setAnalyticsGroupBy(e.target.value as 'day' | 'week' | 'month')}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  >
                    <option value="day">Day</option>
                    <option value="week">Week</option>
                    <option value="month">Month</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Metric</label>
                  <select
                    value={analyticsMetric}
                    onChange={(e) => setAnalyticsMetric(e.target.value as 'revenue' | 'orders' | 'net' | 'platformFee')}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  >
                    <option value="revenue">Gross Revenue</option>
                    <option value="orders">Orders</option>
                    <option value="net">Creator Net</option>
                    <option value="platformFee">Platform Fee</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Status</label>
                  <select
                    value={analyticsStatus}
                    onChange={(e) => setAnalyticsStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  >
                    <option value="completed">Completed</option>
                    <option value="all">All</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Collection</label>
                  <select
                    value={analyticsCollectionId}
                    onChange={(e) => setAnalyticsCollectionId(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  >
                    <option value="all">All collections</option>
                    <option value="bundle">Unlock Everything</option>
                    {collections.map((collection) => (
                      <option key={collection._id} value={collection._id}>
                        {collection.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Currency</label>
                  <select
                    value={analyticsCurrency}
                    onChange={(e) => setAnalyticsCurrency(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  >
                    <option value="all">All currencies</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="USDC">USDC</option>
                  </select>
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                Tip: filter by currency if you want clean revenue totals for a single currency.
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <div className="post-card rounded-xl p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Gross Revenue</p>
                <p className="text-2xl font-bold text-foreground mt-2">
                  {formatMoney(analyticsTotals.revenue, analyticsCurrency)}
                </p>
              </div>
              <div className="post-card rounded-xl p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Orders</p>
                <p className="text-2xl font-bold text-foreground mt-2">{analyticsTotals.orders}</p>
              </div>
              <div className="post-card rounded-xl p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Creator Net</p>
                <p className="text-2xl font-bold text-foreground mt-2">
                  {formatMoney(analyticsTotals.net, analyticsCurrency)}
                </p>
              </div>
              <div className="post-card rounded-xl p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Platform Fee</p>
                <p className="text-2xl font-bold text-foreground mt-2">
                  {formatMoney(analyticsTotals.platformFee, analyticsCurrency)}
                </p>
              </div>
            </div>

            <div className="post-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-foreground">Sales Trend</h3>
                {analyticsLoading && (
                  <span className="text-xs text-muted-foreground">Loading...</span>
                )}
              </div>
              <div className="h-64 md:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsSeries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="label" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                    <YAxis
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      tickFormatter={(value) =>
                        analyticsMetric === 'orders'
                          ? `${value}`
                          : formatMoney(Number(value), analyticsCurrency)
                      }
                    />
                    <Tooltip
                      formatter={(value: any) =>
                        analyticsMetric === 'orders'
                          ? `${value} orders`
                          : formatMoney(Number(value), analyticsCurrency)
                      }
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                      contentStyle={{ background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="post-card rounded-xl p-6 space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <h3 className="text-xl font-bold text-foreground">Sales List</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    value={salesSearch}
                    onChange={(e) => setSalesSearch(e.target.value)}
                    placeholder="Search order, email, txid..."
                    className="sm:w-64"
                  />
                  <select
                    value={salesSort}
                    onChange={(e) => setSalesSort(e.target.value)}
                    className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  >
                    <option value="createdAt_desc">Newest first</option>
                    <option value="createdAt_asc">Oldest first</option>
                    <option value="amount_desc">Highest amount</option>
                    <option value="amount_asc">Lowest amount</option>
                  </select>
                  <select
                    value={salesLimit}
                    onChange={(e) => setSalesLimit(parseInt(e.target.value, 10))}
                    className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  >
                    <option value="10">10 rows</option>
                    <option value="25">25 rows</option>
                    <option value="50">50 rows</option>
                  </select>
                </div>
              </div>

              <div className="md:hidden space-y-3">
                {salesList.length === 0 ? (
                  <div className="border border-border rounded-lg p-4 text-center text-muted-foreground">
                    No sales to show for these filters.
                  </div>
                ) : (
                  salesList.map((sale: any) => (
                    <div key={sale.id} className="border border-border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Date</p>
                          <p className="text-sm text-foreground font-medium">
                            {sale.createdAt ? format(parseISO(sale.createdAt), 'MMM d, yyyy') : '—'}
                          </p>
                        </div>
                        <span className="text-xs uppercase tracking-wide text-muted-foreground">
                          {sale.status || 'unknown'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Collection</p>
                        <p className="text-sm text-foreground font-medium">{sale.collectionTitle}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Amount</p>
                          <p className="text-sm text-foreground font-medium">
                            {formatMoney(sale.amount, sale.currency)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Net</p>
                          <p className="text-sm text-foreground font-medium">
                            {formatMoney(sale.creatorAmount, sale.currency)}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Buyer</p>
                          <p className="text-sm text-foreground font-medium">{sale.emailMasked || '—'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Order</p>
                          <p className="text-xs text-foreground font-medium break-all">{sale.orderId}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="hidden md:block overflow-x-auto border border-border rounded-lg">
                <table className="min-w-full text-sm">
                  <thead className="bg-muted/40">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Collection</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Amount</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Net</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Buyer</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Order</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesList.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-6 text-center text-muted-foreground">
                          No sales to show for these filters.
                        </td>
                      </tr>
                    ) : (
                      salesList.map((sale: any) => (
                        <tr key={sale.id} className="border-t border-border">
                          <td className="px-4 py-3 text-foreground">
                            {sale.createdAt ? format(parseISO(sale.createdAt), 'MMM d, yyyy') : '—'}
                          </td>
                          <td className="px-4 py-3 text-foreground">{sale.collectionTitle}</td>
                          <td className="px-4 py-3 text-foreground">
                            {formatMoney(sale.amount, sale.currency)}
                          </td>
                          <td className="px-4 py-3 text-foreground">
                            {formatMoney(sale.creatorAmount, sale.currency)}
                          </td>
                          <td className="px-4 py-3 text-foreground capitalize">{sale.status}</td>
                          <td className="px-4 py-3 text-foreground">{sale.emailMasked || '—'}</td>
                          <td className="px-4 py-3 text-muted-foreground">{sale.orderId}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  Showing {salesList.length} of {salesTotal} sales
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSalesOffset(Math.max(salesOffset - salesLimit, 0))}
                    disabled={salesOffset === 0}
                  >
                    Previous
                  </Button>
                  <span>
                    Page {Math.floor(salesOffset / salesLimit) + 1} of {Math.max(1, Math.ceil(salesTotal / salesLimit))}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSalesOffset(salesOffset + salesLimit)}
                    disabled={salesOffset + salesLimit >= salesTotal}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorDashboard;
