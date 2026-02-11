import { useState, useEffect, useRef } from 'react';
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
  Instagram,
  Camera,
  Upload,
  DollarSign,
  Layers,
  FileText,
  TrendingUp,
  Home,
  Copy,
  CheckCircle2,
  ArrowUpRight,
  ChevronUp,
  ChevronDown,
  Clock,
  X,
} from 'lucide-react';
import { api } from '@/lib/api';
import AccountMenu from '@/components/AccountMenu';

const CreatorDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'status-cards' | 'collections' | 'analytics' | 'unlock'>('overview');
  const [user, setUser] = useState<any>(null);
  
  const [statusCards, setStatusCards] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [hasPublicChanges, setHasPublicChanges] = useState(false);
  const [isPublicPublished, setIsPublicPublished] = useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState('');
  const [collectionSearch, setCollectionSearch] = useState('');
  const [collectionFiles, setCollectionFiles] = useState<File[]>([]);
  const [collectionPreviews, setCollectionPreviews] = useState<{ file: File; url: string }[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<any | null>(null);
  const [selectedCollectionLoading, setSelectedCollectionLoading] = useState(false);
  const collectionUploadInputRef = useRef<HTMLInputElement | null>(null);
  const collectionFormRef = useRef<HTMLDivElement | null>(null);
  const [uploadingCollectionMedia, setUploadingCollectionMedia] = useState(false);
  const [statusCardFile, setStatusCardFile] = useState<File | null>(null);
  const [statusCardPreviewUrl, setStatusCardPreviewUrl] = useState<string>('');
  const [selectedPostCardId, setSelectedPostCardId] = useState('');
  const [postCardSearch, setPostCardSearch] = useState('');
  const [uploadingStatusCardMedia, setUploadingStatusCardMedia] = useState(false);
  const statusCardUploadInputRef = useRef<HTMLInputElement | null>(null);
  const profileBaselineRef = useRef('');
  const postCardBaselineRef = useRef('');
  const collectionBaselineRef = useRef('');
  const [isProfileDirty, setIsProfileDirty] = useState(false);
  const [isPostCardDirty, setIsPostCardDirty] = useState(false);
  const [isCollectionDirty, setIsCollectionDirty] = useState(false);
  const [profileAutoSaveState, setProfileAutoSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

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
    avatar: '',
    coverImage: '',
    coverOverlay: 0.45,
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
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [uploadingCoverImage, setUploadingCoverImage] = useState(false);

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

  const serializeForDirtyCheck = (value: any) => JSON.stringify(value ?? {});

  useEffect(() => {
    if (!profileBaselineRef.current) {
      profileBaselineRef.current = serializeForDirtyCheck(profileData);
    }
    if (!postCardBaselineRef.current) {
      postCardBaselineRef.current = serializeForDirtyCheck(statusCardForm);
    }
    if (!collectionBaselineRef.current) {
      collectionBaselineRef.current = serializeForDirtyCheck(collectionForm);
    }
  }, []);

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

  const refreshPublicWebsiteState = (username?: string) => {
    if (!username) return;
    const isPublished =
      localStorage.getItem(`publicWebsitePublished:${username}`) === 'true';
    const isDirty =
      localStorage.getItem(`publicWebsiteDirty:${username}`) === 'true';
    setIsPublicPublished(isPublished);
    setHasPublicChanges(isDirty);
  };

  const markPublicWebsiteDirty = () => {
    if (!user?.username) return;
    localStorage.setItem(`publicWebsiteDirty:${user.username}`, 'true');
    refreshPublicWebsiteState(user.username);
  };

  const getProfileDraftKey = (username?: string) =>
    username ? `publicWebsiteProfileDraft:${username}` : '';

  const readProfileDraft = (username?: string) => {
    const key = getProfileDraftKey(username);
    if (!key) return null;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : null;
    } catch {
      return null;
    }
  };

  const loadUserData = async () => {
    try {
      setLoading(true);
      const userResult = await api.getCurrentUser();
      if (userResult.success && userResult.user) {
        setUser(userResult.user);
        refreshPublicWebsiteState(userResult.user.username);
        const nextProfileData = {
          displayName: userResult.user.displayName || '',
          bio: userResult.user.bio || '',
          avatar: userResult.user.avatar || '',
          coverImage: userResult.user.coverImage || '',
          coverOverlay: Number.isFinite(Number(userResult.user.coverOverlay))
            ? Number(userResult.user.coverOverlay)
            : 0.45,
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
        };
        const draft = readProfileDraft(userResult.user.username);
        const mergedProfileData = draft ? { ...nextProfileData, ...draft } : nextProfileData;
        setProfileData(mergedProfileData);
        profileBaselineRef.current = serializeForDirtyCheck(mergedProfileData);
        setIsProfileDirty(false);
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

  useEffect(() => {
    if (!user?.username) return;
    refreshPublicWebsiteState(user.username);
    const handleStorage = (event: StorageEvent) => {
      if (
        event.key === `publicWebsitePublished:${user.username}` ||
        event.key === `publicWebsiteDirty:${user.username}`
      ) {
        refreshPublicWebsiteState(user.username);
      }
    };

    const intervalId = window.setInterval(
      () => refreshPublicWebsiteState(user.username),
      2000
    );
    window.addEventListener('storage', handleStorage);
    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('storage', handleStorage);
    };
  }, [user?.username]);

  useEffect(() => {
    if (collectionFiles.length === 0) {
      setCollectionPreviews([]);
      return;
    }
    const next = collectionFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file)
    }));
    setCollectionPreviews(next);
    return () => {
      next.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [collectionFiles]);

  useEffect(() => {
    if (!statusCardFile) {
      setStatusCardPreviewUrl('');
      return;
    }
    const url = URL.createObjectURL(statusCardFile);
    setStatusCardPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [statusCardFile]);

  useEffect(() => {
    if (!selectedCollectionId) {
      setSelectedCollection(null);
      return;
    }
    const match = collections.find((collection) => collection._id === selectedCollectionId);
    setSelectedCollection(match || null);

    let cancelled = false;
    setSelectedCollectionLoading(true);
    api.getCollection(selectedCollectionId)
      .then((result) => {
        if (cancelled) return;
        if (result?.success && result.collection) {
          setSelectedCollection(result.collection);
        }
      })
      .catch(() => {
        // Keep the best available local data.
      })
      .finally(() => {
        if (!cancelled) {
          setSelectedCollectionLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedCollectionId, collections]);

  useEffect(() => {
    setIsProfileDirty(
      serializeForDirtyCheck(profileData) !== profileBaselineRef.current
    );
  }, [profileData]);

  useEffect(() => {
    if (!user?.username) return;
    if (!isProfileDirty) return;

    setProfileAutoSaveState('saving');
    const timer = window.setTimeout(() => {
      try {
        const key = getProfileDraftKey(user.username);
        if (!key) return;
        localStorage.setItem(key, JSON.stringify(profileData));
        profileBaselineRef.current = serializeForDirtyCheck(profileData);
        setIsProfileDirty(false);
        setProfileAutoSaveState('saved');
        markPublicWebsiteDirty();
      } catch (err: any) {
        setProfileAutoSaveState('error');
        setError(err.message || 'Failed to auto-save profile draft');
      }
    }, 700);

    return () => window.clearTimeout(timer);
  }, [profileData, isProfileDirty, user?.username]);

  useEffect(() => {
    setIsPostCardDirty(
      serializeForDirtyCheck(statusCardForm) !== postCardBaselineRef.current
    );
  }, [statusCardForm]);

  useEffect(() => {
    setIsCollectionDirty(
      serializeForDirtyCheck(collectionForm) !== collectionBaselineRef.current
    );
  }, [collectionForm]);

  const hasUnsavedChanges =
    isProfileDirty ||
    isPostCardDirty ||
    isCollectionDirty ||
    collectionFiles.length > 0 ||
    !!statusCardFile;

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const requestTabChange = (nextTab: typeof activeTab) => {
    if (nextTab === activeTab) return;
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm(
        'You have unsaved changes. Leave this tab and discard them?'
      );
      if (!confirmLeave) return;
    }
    setActiveTab(nextTab);
    setError('');
    setSuccess('');
    setInfoMessage('');
  };

  const publishAllCollections = async () => {
    const collectionsResult = await api.getMyCollections();
    if (!collectionsResult?.success) return;
    const unpublished = (collectionsResult.collections || []).filter(
      (collection: any) => !collection?.isPublished
    );
    if (unpublished.length === 0) return;
    await Promise.all(
      unpublished.map((collection: any) =>
        api.updateCollection(collection._id, { isPublished: true })
      )
    );
  };

  const publishProfileDraft = async () => {
    if (!user?.username) return;
    const key = getProfileDraftKey(user.username);
    if (!key) return;
    let draft: any = null;
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        draft = JSON.parse(raw);
      }
    } catch {
      draft = null;
    }
    if (!draft || typeof draft !== 'object') return;
    const result = await api.updateProfile(draft);
    if (!result?.success) {
      throw new Error(result?.error || 'Failed to publish profile changes');
    }
    localStorage.removeItem(key);
  };

  const handleUpdateWebsite = async () => {
    if (!user?.username) return false;
    setLoading(true);
    setError('');
    try {
      await publishAllCollections();
      await publishProfileDraft();
      localStorage.setItem(`publicWebsitePublished:${user.username}`, 'true');
      localStorage.setItem(`publicWebsiteDirty:${user.username}`, 'false');
      refreshPublicWebsiteState(user.username);
      setSuccess('Public website published with your latest saved changes.');
      await loadUserData();
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to publish website');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setError('');
      setSuccess('');
      if (!user?.username) return;
      const key = getProfileDraftKey(user.username);
      if (!key) return;
      localStorage.setItem(key, JSON.stringify(profileData));
      profileBaselineRef.current = serializeForDirtyCheck(profileData);
      setIsProfileDirty(false);
      setProfileAutoSaveState('saved');
      markPublicWebsiteDirty();
      setSuccess('Profile draft saved. Publish from Preview to make it live.');
    } catch (err: any) {
      setError(err.message || 'Failed to save profile draft');
    }
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile) return;
    try {
      setUploadingAvatar(true);
      setError('');
      const uploadResult = await api.uploadFile(avatarFile);
      if (uploadResult?.url) {
        setProfileData({ ...profileData, avatar: uploadResult.url });
        setAvatarFile(null);
        setSuccess('Avatar uploaded. Profile will auto-save.');
      } else {
        setError('Failed to upload avatar');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSavePostCard = async () => {
    if (!statusCardForm.text.trim() && !statusCardForm.imageUrl.trim()) {
      setError('Add text or media before saving');
      return;
    }
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      const payload = {
        text: statusCardForm.text,
        // Keep empty string so editing can intentionally clear existing media.
        imageUrl: statusCardForm.imageUrl,
        isLocked: statusCardForm.isLocked,
        order: statusCardForm.order
      };
      const result = selectedPostCardId
        ? await api.updateStatusCard(selectedPostCardId, payload)
        : await api.createStatusCard(payload);
      if (result.success) {
        setSuccess(selectedPostCardId ? 'Post card updated.' : 'Post card created.');
        markPublicWebsiteDirty();
        const resetPostCard = { text: '', imageUrl: '', isLocked: false, order: 0 };
        setStatusCardForm(resetPostCard);
        postCardBaselineRef.current = serializeForDirtyCheck(resetPostCard);
        setIsPostCardDirty(false);
        setStatusCardFile(null);
        setSelectedPostCardId('');
        await loadUserData();
      } else {
        setError(result.error || 'Failed to save post card');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save post card');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadCoverImage = async () => {
    if (!coverImageFile) return;
    try {
      setUploadingCoverImage(true);
      setError('');
      const uploadResult = await api.uploadFile(coverImageFile);
      if (uploadResult?.url) {
        setProfileData({ ...profileData, coverImage: uploadResult.url });
        setCoverImageFile(null);
        setSuccess('Cover image uploaded. Profile draft will auto-save.');
      } else {
        setError('Failed to upload cover image');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload cover image');
    } finally {
      setUploadingCoverImage(false);
    }
  };

  const handleEditPostCard = (card: any) => {
    const nextPostCard = {
      text: card.text || '',
      imageUrl: card.imageUrl || '',
      isLocked: !!card.isLocked,
      order: Number(card.order) || 0
    };
    setSelectedPostCardId(card._id || '');
    setStatusCardForm(nextPostCard);
    postCardBaselineRef.current = serializeForDirtyCheck(nextPostCard);
    setIsPostCardDirty(false);
    setStatusCardFile(null);
    setStatusCardPreviewUrl('');
    setTimeout(() => {
      collectionFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  const handleDeletePostCardById = async (cardId: string) => {
    if (!cardId) return;
    const confirmDelete = window.confirm('Delete this post card? This cannot be undone.');
    if (!confirmDelete) return;
    try {
      setLoading(true);
      setError('');
      const result = await api.deleteStatusCard(cardId);
      if (result.success) {
        setSuccess('Post card deleted.');
        markPublicWebsiteDirty();
        if (selectedPostCardId === cardId) {
          const resetPostCard = { text: '', imageUrl: '', isLocked: false, order: 0 };
          setSelectedPostCardId('');
          setStatusCardForm(resetPostCard);
          postCardBaselineRef.current = serializeForDirtyCheck(resetPostCard);
          setIsPostCardDirty(false);
          setStatusCardFile(null);
          setStatusCardPreviewUrl('');
        }
        await loadUserData();
      } else {
        setError(result.error || 'Failed to delete post card');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete post card');
    } finally {
      setLoading(false);
    }
  };

  const handleMovePostCard = async (cardId: string, direction: 'up' | 'down') => {
    const ordered = [...statusCards].sort((a, b) => {
      const aOrder = Number.isFinite(Number(a.order)) ? Number(a.order) : 0;
      const bOrder = Number.isFinite(Number(b.order)) ? Number(b.order) : 0;
      return aOrder - bOrder;
    });

    const currentIndex = ordered.findIndex((card) => card._id === cardId);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= ordered.length) return;

    const reordered = [...ordered];
    const [moved] = reordered.splice(currentIndex, 1);
    reordered.splice(targetIndex, 0, moved);
    const withOrder = reordered.map((card, index) => ({ ...card, order: index }));

    setStatusCards(withOrder);
    try {
      setLoading(true);
      setError('');
      await Promise.all(
        withOrder.map((card) => api.updateStatusCard(card._id, { order: card.order }))
      );
      setSuccess('Post card order updated.');
      markPublicWebsiteDirty();
      await loadUserData();
    } catch (err: any) {
      setError(err.message || 'Failed to update post card order');
      await loadUserData();
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
        markPublicWebsiteDirty();
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
        setSuccess('Media uploaded. You can now save the post card.');
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
    if (collectionFiles.length === 0) {
      setError('Please choose one or more content files to upload');
      return;
    }
    if (!selectedCollectionId) {
      setError('Create or select a collection before uploading content');
      return;
    }

    try {
      setUploadingCollectionMedia(true);
      setError('');
      const targetCollectionId = selectedCollectionId;

      let uploadedCount = 0;
      for (const file of collectionFiles) {
        const uploadResult = await api.uploadFile(file);
        if (!uploadResult?.url) {
          throw new Error(`Upload failed for ${file.name}`);
        }

        const attachResult = await api.addCollectionMedia(targetCollectionId, {
          url: uploadResult.url,
          thumbnailUrl: uploadResult.thumbnailUrl || uploadResult.url,
          mediaType: uploadResult.mediaType,
          size: uploadResult.size
        });

        if (!attachResult.success) {
          throw new Error(attachResult.error || `Failed to attach ${file.name}`);
        }
        uploadedCount += 1;
      }

      setSuccess(`Uploaded ${uploadedCount} item${uploadedCount === 1 ? '' : 's'} to collection!`);
      markPublicWebsiteDirty();
      setSelectedCollectionId(targetCollectionId);
      setCollectionFiles([]);
      await loadUserData();
    } catch (err: any) {
      setError(err.message || 'Failed to upload content');
    } finally {
      setUploadingCollectionMedia(false);
    }
  };

  const handleAddMoreCollectionFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setCollectionFiles((prev) => [...prev, ...Array.from(files)]);
  };

  const handleRemoveSelectedFile = (index: number) => {
    setCollectionFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleCreateCollection = async () => {
    if (!collectionForm.title.trim()) {
      setError('Collection title is required');
      return;
    }
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      const tags = collectionForm.tags.split(',').map(t => t.trim()).filter(t => t);
      const result = await api.createCollection({
        title: collectionForm.title,
        description: collectionForm.description || undefined,
        price: Number(collectionForm.price) || 0,
        currency: collectionForm.currency,
        tags: tags.length > 0 ? tags : undefined,
        media: []
      });
      if (!result?.success) {
        setError(result?.error || 'Failed to create collection');
        return;
      }
      const createdId =
        result.collection?._id ||
        result.collection?.id ||
        result.collectionId ||
        result.id;
      if (!createdId) {
        setError('Collection created but no ID was returned');
        return;
      }

      setSuccess('Collection created. You can now upload content.');
      markPublicWebsiteDirty();
      setSelectedCollectionId(createdId);
      collectionBaselineRef.current = serializeForDirtyCheck(collectionForm);
      setIsCollectionDirty(false);
      setCollectionFiles([]);
      setCollectionPreviews([]);
      await loadUserData();
    } catch (err: any) {
      setError(err.message || 'Failed to create collection');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCollection = async () => {
    if (!selectedCollectionId) {
      setError('Select a collection to delete');
      return;
    }
    const confirmDelete = window.confirm('Delete this collection and all its content? This cannot be undone.');
    if (!confirmDelete) return;

    try {
      setLoading(true);
      setError('');
      const result = await api.deleteCollection(selectedCollectionId);
      if (result.success) {
        setSuccess('Collection deleted.');
        markPublicWebsiteDirty();
        setSelectedCollectionId('');
        setSelectedCollection(null);
        const resetCollection = { title: '', description: '', price: 0, currency: 'USD', tags: '' };
        setCollectionForm(resetCollection);
        collectionBaselineRef.current = serializeForDirtyCheck(resetCollection);
        setIsCollectionDirty(false);
        setCollectionFiles([]);
        setCollectionPreviews([]);
        await loadUserData();
      } else {
        setError(result.error || 'Failed to delete collection');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete collection');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCollectionById = async (collectionId: string, collectionTitle?: string) => {
    if (!collectionId) return;
    const confirmDelete = window.confirm(
      `Delete "${collectionTitle || 'this collection'}" and all its content? This cannot be undone.`
    );
    if (!confirmDelete) return;

    try {
      setLoading(true);
      setError('');
      const result = await api.deleteCollection(collectionId);
      if (result.success) {
        setSuccess('Collection deleted.');
        markPublicWebsiteDirty();
        if (selectedCollectionId === collectionId) {
          setSelectedCollectionId('');
          setSelectedCollection(null);
          const resetCollection = { title: '', description: '', price: 0, currency: 'USD', tags: '' };
          setCollectionForm(resetCollection);
          collectionBaselineRef.current = serializeForDirtyCheck(resetCollection);
          setIsCollectionDirty(false);
          setCollectionFiles([]);
          setCollectionPreviews([]);
        }
        await loadUserData();
      } else {
        setError(result.error || 'Failed to delete collection');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete collection');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveExistingMedia = async (mediaIndex: number) => {
    if (!selectedCollectionId || !selectedCollection?.media) return;
    const previousMedia = selectedCollection.media;
    const nextMedia = previousMedia.filter((_: any, idx: number) => idx !== mediaIndex);
    try {
      setLoading(true);
      setError('');
      const result = await api.updateCollection(selectedCollectionId, { media: nextMedia });
      const updatedMedia = result?.collection?.media;
      const didUpdate = Array.isArray(updatedMedia) ? updatedMedia.length === nextMedia.length : false;
      if (result.success && didUpdate) {
        setSelectedCollection((prev: any) => (prev ? { ...prev, media: nextMedia } : prev));
        setSuccess('Content removed from collection.');
        markPublicWebsiteDirty();
        await loadUserData();
      } else {
        setSelectedCollection((prev: any) => (prev ? { ...prev, media: previousMedia } : prev));
        setError(result.error || 'Failed to remove content (server did not update media)');
      }
    } catch (err: any) {
      setSelectedCollection((prev: any) => (prev ? { ...prev, media: previousMedia } : prev));
      setError(err.message || 'Failed to remove content');
    } finally {
      setLoading(false);
    }
  };

  const handleMoveExistingMedia = async (mediaIndex: number, direction: 'up' | 'down') => {
    if (!selectedCollectionId || !selectedCollection?.media) return;
    const previousMedia = [...selectedCollection.media];
    const targetIndex = direction === 'up' ? mediaIndex - 1 : mediaIndex + 1;
    if (targetIndex < 0 || targetIndex >= previousMedia.length) return;

    const nextMedia = [...previousMedia];
    const [moved] = nextMedia.splice(mediaIndex, 1);
    nextMedia.splice(targetIndex, 0, moved);
    try {
      setLoading(true);
      setError('');
      const result = await api.updateCollection(selectedCollectionId, { media: nextMedia });
      const updatedMedia = result?.collection?.media;
      if (result.success && Array.isArray(updatedMedia) && updatedMedia.length === nextMedia.length) {
        setSelectedCollection((prev: any) => (prev ? { ...prev, media: updatedMedia } : prev));
        setSuccess('Collection media order updated.');
        markPublicWebsiteDirty();
        await loadUserData();
      } else {
        setError(result.error || 'Failed to reorder media');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to reorder media');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCollection = (collection: any) => {
    const nextCollectionForm = {
      title: collection.title || '',
      description: collection.description || '',
      price: Number(collection.price) || 0,
      currency: collection.currency || 'USD',
      tags: Array.isArray(collection.tags) ? collection.tags.join(', ') : ''
    };
    setCollectionForm(nextCollectionForm);
    collectionBaselineRef.current = serializeForDirtyCheck(nextCollectionForm);
    setIsCollectionDirty(false);
    setSelectedCollectionId(collection._id || '');
    setTimeout(() => {
      collectionFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  const handleSaveCollectionDetails = async () => {
    if (!selectedCollectionId) {
      setError('Select a collection to save changes');
      return;
    }
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      const tags = collectionForm.tags.split(',').map(t => t.trim()).filter(t => t);
      const result = await api.updateCollection(selectedCollectionId, {
        title: collectionForm.title,
        // Allow clearing description/tags by sending empty values instead of undefined.
        description: collectionForm.description,
        price: collectionForm.price,
        currency: collectionForm.currency,
        tags
      });
      if (result.success) {
        setSuccess('Collection updated.');
        markPublicWebsiteDirty();
        collectionBaselineRef.current = serializeForDirtyCheck(collectionForm);
        setIsCollectionDirty(false);
        setSelectedCollectionId(selectedCollectionId);
        await loadUserData();
      } else {
        setError(result.error || 'Failed to update collection');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update collection');
    } finally {
      setLoading(false);
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
    navigate(`/public/${user.username}`);
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

  const formatFileSize = (bytes: number) => {
    if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const size = bytes / Math.pow(1024, index);
    return `${size.toFixed(size >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
  };

  const getMediaSrcCandidates = (url?: string) => {
    if (!url) return [];
    const candidates: string[] = [];
    try {
      const parsed = new URL(url);
      const placeholderHosts = new Set(['cdn.example.com', 'example.com', 'your-r2-domain.com']);
      if (placeholderHosts.has(parsed.hostname)) {
        const apiBase = import.meta.env.VITE_API_URL;
        if (apiBase) {
          const apiOrigin = String(apiBase).replace(/\/+$/, '');
          candidates.push(`${apiOrigin}/api/media${parsed.pathname}`);
        }
        const envBase = import.meta.env.VITE_MEDIA_BASE_URL;
        if (envBase) {
          candidates.push(`${String(envBase).replace(/\/+$/, '')}${parsed.pathname}`);
        }
        if (typeof window !== 'undefined' && window.location?.origin) {
          candidates.push(`${String(window.location.origin).replace(/\/+$/, '')}${parsed.pathname}`);
        }
      }
    } catch {
      // ignore parse errors
    }
    candidates.push(url);
    return Array.from(new Set(candidates.filter(Boolean)));
  };

  const isVideoMedia = (media: any) => {
    const type = String(media?.mediaType || '').toLowerCase();
    if (type) {
      return type.includes('video');
    }
    const url = String(media?.url || '');
    return /\.(mp4|webm|mov|ogg|avi)(\?|#|$)/i.test(url);
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
    <div className="creator-dashboard min-h-screen feed-bg">
        {/* Top Navbar */}
        <nav className="creator-top-nav sticky top-0 z-50 nav-elevated">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-14">
              {/* Left - Brand */}
              <div className="flex items-center gap-3">
                <div className="brand-wordmark"><span className="brand-accent">Six</span><span className="text-white">Seven</span><span className="brand-accent">Creator</span></div>
                <div className="w-px h-6 bg-white/[0.10]" />
                <span className="text-sm font-semibold text-foreground tracking-tight">Dashboard</span>
              </div>
              
              {/* Right - Actions */}
              <div className="flex items-center gap-2">
                <Button 
                  onClick={handlePreviewPublic} 
                  variant="ghost" 
                  size="sm" 
                  className="dash-btn-ghost text-muted-foreground hover:text-foreground text-xs h-8 gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Preview</span>
                </Button>
                <Button 
                  onClick={handlePublicWebsite} 
                  size="sm"
                  className="dash-btn-primary shadow-sm h-8 text-xs px-3.5"
                >
                  Public Website
                </Button>
                <AccountMenu currentUser={user} />
              </div>
            </div>
          </div>
        </nav>

        <div className="flex min-h-[calc(100vh-52px)]">
        {/* â”€â”€ Left Sidebar Nav â”€â”€ */}
        <aside className="creator-sidebar hidden lg:flex flex-col w-[220px] flex-shrink-0 border-r border-white/[0.06] bg-[rgba(8,11,20,0.4)]">
          {/* Creator avatar + name */}
          <div className="px-4 pt-5 pb-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden bg-secondary border border-border flex-shrink-0">
                {profileData.avatar ? (
                  <img src={profileData.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs font-bold text-foreground bg-gradient-to-br from-indigo-500 to-cyan-500">
                    {(profileData.displayName || user?.username || '?')[0]?.toUpperCase()}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{profileData.displayName || user?.username || 'Creator'}</p>
                <p className="text-[10px] text-muted-foreground truncate">@{user?.username || 'username'}</p>
              </div>
            </div>
          </div>

          {/* Nav items */}
          <nav className="flex-1 px-2 py-3 space-y-0.5">
            {[
              { key: 'overview' as const, icon: Home, label: 'Overview' },
              { key: 'collections' as const, icon: Image, label: 'Collections' },
              { key: 'unlock' as const, icon: Unlock, label: 'Unlock Everything' },
              { key: 'status-cards' as const, icon: MessageSquare, label: 'Post Cards' },
              { key: 'analytics' as const, icon: BarChart3, label: 'Analytics' },
              { key: 'profile' as const, icon: Settings, label: 'Settings' },
            ].map(item => (
              <button
                key={item.key}
                onClick={() => requestTabChange(item.key)}
                className={`creator-nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                  activeTab === item.key
                    ? 'bg-white/[0.08] text-foreground font-medium shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.04]'
                }`}
              >
                <item.icon className={`w-4 h-4 flex-shrink-0 ${activeTab === item.key ? 'text-primary' : ''}`} />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Sidebar stats */}
          <div className="px-3 py-3 border-t border-white/[0.06]">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center py-2 rounded-lg bg-white/[0.02]">
                <div className="text-sm font-bold text-foreground">{collections.length}</div>
                <div className="text-[9px] text-muted-foreground uppercase tracking-wider">Collections</div>
              </div>
              <div className="text-center py-2 rounded-lg bg-white/[0.02]">
                <div className="text-sm font-bold text-foreground">{statusCards.length}</div>
                <div className="text-[9px] text-muted-foreground uppercase tracking-wider">Posts</div>
              </div>
            </div>
          </div>
        </aside>

        {/* â”€â”€ Main Content Area â”€â”€ */}
        <div className="creator-main flex-1 min-w-0">
          {/* Mobile tab bar (horizontal, shown only on < lg) */}
          <div className="creator-mobile-tabs lg:hidden sticky top-[52px] z-40 bg-[rgba(8,11,20,0.92)] backdrop-blur-xl border-b border-white/[0.06]">
            <div className="flex overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {[
                { key: 'overview' as const, icon: Home, label: 'Overview' },
                { key: 'collections' as const, icon: Image, label: 'Collections' },
                { key: 'unlock' as const, icon: Unlock, label: 'Unlock' },
                { key: 'status-cards' as const, icon: MessageSquare, label: 'Post Cards' },
                { key: 'analytics' as const, icon: BarChart3, label: 'Analytics' },
                { key: 'profile' as const, icon: Settings, label: 'Settings' },
              ].map(item => (
                <button
                  key={item.key}
                  onClick={() => requestTabChange(item.key)}
                  className={`creator-mobile-tab-item flex items-center gap-1.5 px-4 py-3 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === item.key
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="creator-content-shell px-4 sm:px-6 lg:px-8 py-5 sm:py-6 max-w-5xl">

        {/* Messages */}
        {infoMessage && (
          <div className="mb-4 alert-info">
            <p className="text-sm text-blue-600 dark:text-blue-400">{infoMessage}</p>
          </div>
        )}
        {success && (
          <div className="mb-4 alert-success">
            <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
          </div>
        )}
        {error && (
          <div className="mb-4 alert-error">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* â•â•â•â•â•â•â•â•â•â• Overview Tab â•â•â•â•â•â•â•â•â•â• */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Welcome header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                  Welcome back{profileData.displayName ? `, ${profileData.displayName}` : ''}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Here's how your platform is performing</p>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <div className="dot-live" />
                <span className="text-[10px] font-medium text-emerald-400">Live</span>
              </div>
            </div>

            {/* North Star Metric + Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Revenue - North Star (larger card) */}
              <div className="lg:col-span-1 card-elevated p-5 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Revenue</span>
                    <div className="flex items-center gap-1 text-emerald-400">
                      <TrendingUp className="w-3 h-3" />
                      <span className="text-[10px] font-semibold">+12.5%</span>
                    </div>
                  </div>
                  <p className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">${analyticsTotals.revenue.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
                </div>
                {/* Subtle gradient overlay */}
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-emerald-500/[0.05] to-transparent rounded-tl-full pointer-events-none" />
              </div>

              {/* Other stats */}
              <div className="lg:col-span-2 grid grid-cols-3 gap-3">
                <div className="card-elevated p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg bg-violet-500/10 flex items-center justify-center">
                      <Layers className="w-3.5 h-3.5 text-violet-400" />
                    </div>
                  </div>
                  <p className="text-xl font-bold text-foreground">{collections.length}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Collections</p>
                </div>
                <div className="card-elevated p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <FileText className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                  </div>
                  <p className="text-xl font-bold text-foreground">{statusCards.length}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Posts</p>
                </div>
                <div className="card-elevated p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                      <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                  </div>
                  <p className="text-xl font-bold text-foreground">{analyticsTotals.orders}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Orders</p>
                </div>
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="card-elevated p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Revenue Overview</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Your earnings over the last 30 days</p>
                </div>
              </div>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsSeries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="label" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} axisLine={false} tickLine={false} width={50} />
                    <Tooltip
                      contentStyle={{ background: 'rgba(12,17,25,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                      labelStyle={{ color: 'white', marginBottom: '4px' }}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Actions + Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Quick Actions */}
              <div className="card-elevated p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => requestTabChange('collections')}
                    className="quick-action-btn w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center">
                        <Plus className="w-4 h-4 text-indigo-400" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-semibold text-foreground">Create Collection</p>
                        <p className="text-[10px] text-muted-foreground">Upload premium content</p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </button>
                  <button
                    onClick={() => requestTabChange('status-cards')}
                    className="quick-action-btn w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center">
                        <Edit className="w-4 h-4 text-violet-400" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-semibold text-foreground">New Post Card</p>
                        <p className="text-[10px] text-muted-foreground">Share an update with fans</p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </button>
                  <button
                    onClick={handlePreviewPublic}
                    className="quick-action-btn w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center">
                        <Eye className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-semibold text-foreground">Preview Public Site</p>
                        <p className="text-[10px] text-muted-foreground">See how fans see your page</p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </button>
                </div>
              </div>

              {/* Recent Sales */}
              <div className="card-elevated p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-foreground">Recent Sales</h3>
                  <button
                    onClick={() => requestTabChange('analytics')}
                    className="dashboard-link-btn text-[10px] text-primary hover:text-primary/80 font-medium cursor-pointer bg-transparent border-none"
                  >
                    View all
                  </button>
                </div>
                {salesList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="w-10 h-10 rounded-full bg-white/[0.04] flex items-center justify-center mb-3">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground">No sales yet</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">Sales will appear here as they come in</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {salesList.slice(0, 5).map((sale: any, i: number) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                            {(sale.buyerEmail || sale.buyer || '?')[0]?.toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-foreground truncate">{sale.collectionTitle || 'Collection'}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{sale.buyerEmail || sale.buyer || 'Anonymous'}</p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-emerald-400 flex-shrink-0">+${(sale.amount || 0).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Getting Started Checklist */}
            <div className="card-elevated p-5">
              <h3 className="text-sm font-semibold text-foreground mb-1">Getting Started</h3>
              <p className="text-xs text-muted-foreground mb-4">Complete these steps to launch your creator page</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { label: 'Set up profile', done: !!(profileData.displayName && profileData.bio), action: () => requestTabChange('profile') },
                  { label: 'Upload avatar', done: !!profileData.avatar, action: () => requestTabChange('profile') },
                  { label: 'Create a collection', done: collections.length > 0, action: () => requestTabChange('collections') },
                  { label: 'Publish your site', done: isPublicPublished, action: handlePublicWebsite },
                ].map((step, i) => (
                  <button
                    key={i}
                    onClick={step.action}
                    className={`checklist-btn flex items-center gap-3 px-3 py-3 rounded-xl border transition-all cursor-pointer ${
                      step.done
                        ? 'bg-emerald-500/[0.06] border-emerald-500/20'
                        : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      step.done ? 'bg-emerald-500/20' : 'bg-white/[0.06]'
                    }`}>
                      {step.done ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <span className="text-[10px] font-bold text-muted-foreground">{i + 1}</span>
                      )}
                    </div>
                    <span className={`text-xs font-medium ${step.done ? 'text-emerald-400' : 'text-foreground'}`}>{step.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="card-elevated p-5 sm:p-7 space-y-6">
            {/* Profile Media Upload */}
            <div className="space-y-4 p-4 bg-secondary/30 rounded-xl">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-secondary border-2 border-border">
                    {profileData.avatar ? (
                      <img 
                        src={profileData.avatar} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Camera className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-semibold text-foreground mb-1">Profile Picture</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    Shown next to your name on public and preview pages.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                      className="text-sm"
                    />
                    <Button
                      onClick={handleUploadAvatar}
                      disabled={!avatarFile || uploadingAvatar}
                      size="sm"
                      className="dash-btn-secondary"
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      {uploadingAvatar ? 'Uploading...' : 'Upload Avatar'}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="border-t border-border/60 pt-4">
                <h3 className="font-semibold text-foreground mb-1">Cover Image</h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Displayed behind your profile header and Unlock Everything button.
                </p>
                <div className="rounded-lg overflow-hidden border border-border bg-background/60 mb-3 h-28">
                  {profileData.coverImage ? (
                    <img src={profileData.coverImage} alt="Cover" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-500/20 via-violet-500/10 to-cyan-500/20" />
                  )}
                </div>
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-muted-foreground">Cover Overlay Intensity</label>
                    <span className="text-xs text-foreground">{Math.round((Number(profileData.coverOverlay || 0.45)) * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.15"
                    max="0.85"
                    step="0.01"
                    value={Number(profileData.coverOverlay || 0.45)}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        coverOverlay: Math.max(0.15, Math.min(0.85, parseFloat(e.target.value) || 0.45))
                      })
                    }
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Higher value darkens the cover more for better text readability.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCoverImageFile(e.target.files?.[0] || null)}
                    className="text-sm"
                  />
                  <Button
                    onClick={handleUploadCoverImage}
                    disabled={!coverImageFile || uploadingCoverImage}
                    size="sm"
                    className="dash-btn-secondary"
                  >
                    <Upload className="w-4 h-4 mr-1" />
                    {uploadingCoverImage ? 'Uploading...' : 'Upload Cover'}
                  </Button>
                </div>
              </div>
            </div>

            {/* â”€â”€ Section: Profile â”€â”€ */}
            <h3 className="form-section-header">Profile</h3>
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
            </div>

            {/* â”€â”€ Section: Social Links â”€â”€ */}
            <h3 className="form-section-header">Social Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  Social links saved here appear on your public website sidebar and footer.
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

            </div>

            {/* â”€â”€ Section: Advanced â”€â”€ */}
            <h3 className="form-section-header">Advanced</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  Add your bot to a chat and use that chatâ€™s ID. Youâ€™ll get a message for each payment and completion.
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

            <div className="dashboard-sticky-action-bar flex items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground">
                {profileAutoSaveState === 'saving'
                  ? 'Saving profile draft...'
                  : profileAutoSaveState === 'error'
                  ? 'Draft auto-save failed. Try editing again.'
                  : isProfileDirty
                  ? 'Unsaved changes'
                  : 'Draft saved. Publish to make live'}
              </span>
              <Button onClick={handleSaveProfile} className="w-full md:w-auto dash-btn-secondary">
                <Save className="w-4 h-4 mr-2" />
                Save Draft Now
              </Button>
            </div>
          </div>
        )}

        {/* Post Cards Tab */}
        {activeTab === 'status-cards' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
            <div className="xl:col-span-4 card-container space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="card-title">Post Cards</h2>
                <span className="text-xs text-muted-foreground">{statusCards.length} total</span>
              </div>
              <Input
                value={postCardSearch}
                onChange={(e) => setPostCardSearch(e.target.value)}
                placeholder="Search post cards..."
              />
              <Button
                type="button"
                className="w-full dash-btn-secondary"
                onClick={() => {
                  const resetPostCard = { text: '', imageUrl: '', isLocked: false, order: 0 };
                  setSelectedPostCardId('');
                  setStatusCardForm(resetPostCard);
                  postCardBaselineRef.current = serializeForDirtyCheck(resetPostCard);
                  setIsPostCardDirty(false);
                  setStatusCardFile(null);
                  setStatusCardPreviewUrl('');
                }}
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                New Post Card
              </Button>
              <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
                {loading ? (
                  <div className="border border-dashed border-border rounded-lg p-5 text-center text-xs text-muted-foreground">
                    Loading post cards...
                  </div>
                ) : statusCards.length === 0 ? (
                  <div className="border border-dashed border-border rounded-lg p-5 text-center text-xs text-muted-foreground">
                    No post cards yet.
                  </div>
                ) : (
                  (() => {
                    const orderedCards = [...statusCards].sort((a, b) => {
                      const aOrder = Number.isFinite(Number(a.order)) ? Number(a.order) : 0;
                      const bOrder = Number.isFinite(Number(b.order)) ? Number(b.order) : 0;
                      return aOrder - bOrder;
                    });
                    const filteredCards = orderedCards.filter((card) => {
                      const term = postCardSearch.trim().toLowerCase();
                      if (!term) return true;
                      return String(card.text || '').toLowerCase().includes(term);
                    });
                    return filteredCards.map((card, index) => {
                      const isActive = selectedPostCardId === card._id;
                      const absoluteIndex = orderedCards.findIndex((item) => item._id === card._id);
                      const isFirst = absoluteIndex <= 0;
                      const isLast = absoluteIndex === orderedCards.length - 1;
                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleEditPostCard(card)}
                          className={`w-full text-left border rounded-lg p-3 transition-colors ${
                            isActive ? 'border-primary/60 bg-primary/10' : 'border-border bg-background hover:border-primary/40'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h4 className="text-sm font-semibold text-foreground truncate">
                                {card.text || 'Untitled post card'}
                              </h4>
                              <p className="text-[11px] text-muted-foreground mt-0.5">
                                {card.imageUrl ? 'Has media' : 'Text only'} {card.isLocked ? '• Locked' : ''} • Order {Number.isFinite(Number(card.order)) ? Number(card.order) : 0}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                type="button"
                                size="sm"
                                className="dash-btn-secondary h-6 w-6 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMovePostCard(card._id, 'up');
                                }}
                                disabled={isFirst}
                                aria-label="Move up"
                              >
                                <ChevronUp className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                className="dash-btn-secondary h-6 w-6 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMovePostCard(card._id, 'down');
                                }}
                                disabled={isLast}
                                aria-label="Move down"
                              >
                                <ChevronDown className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                className="dash-btn-secondary rounded-full text-[10px] h-6 px-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditPostCard(card);
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                className="btn-collection-danger rounded-full text-[10px] h-6 px-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeletePostCardById(card._id);
                                }}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </button>
                      );
                    });
                  })()
                )}
              </div>
            </div>

            <div className="xl:col-span-8 card-container space-y-5" ref={collectionFormRef}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Post Card Editor</h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedPostCardId ? 'Editing selected post card.' : 'Create a post card and publish updates to your homepage.'}
                  </p>
                </div>
                {selectedPostCardId && (
                  <Button
                    type="button"
                    className="btn-collection-danger"
                    onClick={() => handleDeletePostCardById(selectedPostCardId)}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                    Delete Post Card
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="input-label">Text Content</label>
                  <Textarea
                    value={statusCardForm.text}
                    onChange={(e) => setStatusCardForm({ ...statusCardForm, text: e.target.value })}
                    placeholder="Your update..."
                    rows={4}
                  />
                </div>
                <div>
                  <label className="input-label">Media URL (Optional)</label>
                  <Input
                    value={statusCardForm.imageUrl}
                    onChange={(e) => setStatusCardForm({ ...statusCardForm, imageUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
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
                    Lock this post card
                  </label>
                </div>
              </div>

              <div className="dashboard-sticky-action-bar flex flex-wrap items-center gap-2">
                <Button onClick={handleSavePostCard} className="dash-btn-primary">
                  <Save className="w-4 h-4 mr-2" />
                  {selectedPostCardId ? 'Save Changes' : 'Create Post Card'}
                </Button>
                {selectedPostCardId && (
                  <span className="text-[11px] text-muted-foreground">Post Card ID: {selectedPostCardId}</span>
                )}
                <span className="text-[11px] text-muted-foreground ml-auto">
                  {isPostCardDirty ? 'Unsaved changes' : 'All changes saved'}
                </span>
              </div>

              <div className="border-t border-border/70 pt-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-foreground">Media Manager</h3>
                  <span className="text-xs text-muted-foreground">Upload one image or video per post card</span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  <div className="space-y-3">
                    <div>
                      <label className="input-label">Upload image/video (max 25MB)</label>
                      <Input
                        ref={statusCardUploadInputRef}
                        type="file"
                        accept="image/*,video/*"
                        onChange={(e) => setStatusCardFile(e.target.files?.[0] || null)}
                      />
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <Button
                          type="button"
                          className="dash-btn-secondary text-[11px] h-7 px-3"
                          onClick={() => statusCardUploadInputRef.current?.click()}
                        >
                          Select media
                        </Button>
                        <Button
                          type="button"
                          className="dash-btn-secondary text-[11px] h-7 px-3"
                          onClick={() => setStatusCardFile(null)}
                          disabled={!statusCardFile}
                        >
                          Clear selected media
                        </Button>
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={handleUploadStatusCardImage}
                      disabled={uploadingStatusCardMedia || !statusCardFile}
                      className="w-full dash-btn-primary"
                    >
                      {uploadingStatusCardMedia ? 'Uploading...' : 'Upload Media'}
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div className="text-xs font-medium text-muted-foreground">Preview</div>
                    {statusCardPreviewUrl ? (
                      <div className="relative border border-border rounded-md overflow-hidden bg-muted/20">
                        {statusCardFile?.type?.startsWith('image/') ? (
                          <img src={statusCardPreviewUrl} alt="" className="h-28 w-full object-cover" />
                        ) : (
                          <video src={statusCardPreviewUrl} className="h-28 w-full object-cover" muted controls preload="metadata" />
                        )}
                      </div>
                    ) : statusCardForm.imageUrl ? (
                      <div className="relative border border-border rounded-md overflow-hidden bg-muted/20">
                        {isVideoMedia({ url: statusCardForm.imageUrl }) ? (
                          <video
                            src={getMediaSrcCandidates(statusCardForm.imageUrl)[0] || statusCardForm.imageUrl}
                            className="h-28 w-full object-cover"
                            muted
                            controls
                            preload="metadata"
                          />
                        ) : (
                          <img
                            src={getMediaSrcCandidates(statusCardForm.imageUrl)[0] || statusCardForm.imageUrl}
                            alt=""
                            className="h-28 w-full object-cover"
                          />
                        )}
                      </div>
                    ) : (
                      <div className="border border-dashed border-border rounded-lg p-4 text-xs text-muted-foreground text-center">
                        Select or upload media to preview it here.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Collections Tab */}
        {activeTab === 'collections' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
            <div className="xl:col-span-4 card-container space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="card-title">Collections</h2>
                <span className="text-xs text-muted-foreground">{collections.length} total</span>
              </div>
              <Input
                value={collectionSearch}
                onChange={(e) => setCollectionSearch(e.target.value)}
                placeholder="Search collections..."
              />
              <Button
                type="button"
                onClick={() => {
                  const resetCollection = { title: '', description: '', price: 0, currency: 'USD', tags: '' };
                  setSelectedCollectionId('');
                  setSelectedCollection(null);
                  setCollectionForm(resetCollection);
                  collectionBaselineRef.current = serializeForDirtyCheck(resetCollection);
                  setIsCollectionDirty(false);
                  setCollectionFiles([]);
                  setCollectionPreviews([]);
                }}
                className="w-full dash-btn-secondary rounded-full h-9 text-xs"
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                New Collection
              </Button>
              <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
                {loading ? (
                  <div className="border border-dashed border-border rounded-lg p-5 text-center text-xs text-muted-foreground">
                    Loading collections...
                  </div>
                ) : collections.length === 0 ? (
                  <div className="border border-dashed border-border rounded-lg p-5 text-center text-xs text-muted-foreground">
                    No collections yet.
                  </div>
                ) : (
                  collections
                    .filter((collection) => {
                      const term = collectionSearch.trim().toLowerCase();
                      if (!term) return true;
                      return (
                        String(collection.title || '').toLowerCase().includes(term) ||
                        String(collection.description || '').toLowerCase().includes(term)
                      );
                    })
                    .map((collection, index) => {
                      const isActive = selectedCollectionId === collection._id;
                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleEditCollection(collection)}
                          className={`w-full text-left border rounded-lg p-3 transition-colors ${
                            isActive ? 'border-primary/60 bg-primary/10' : 'border-border bg-background hover:border-primary/40'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h4 className="text-sm font-semibold text-foreground truncate">{collection.title}</h4>
                              <p className="text-[11px] text-muted-foreground mt-0.5">
                                {(collection.media?.length || 0)} items • ${Number(collection.price || 0).toFixed(2)} {collection.currency || 'USD'}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="dash-btn-secondary rounded-full text-[10px] h-6 px-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditCollection(collection);
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="btn-collection-danger rounded-full border-transparent text-[10px] h-6 px-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteCollectionById(collection._id, collection.title);
                                }}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </button>
                      );
                    })
                )}
              </div>
            </div>

            <div className="xl:col-span-8 card-container space-y-5" ref={collectionFormRef}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Collection Editor</h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedCollectionId ? `Editing: ${selectedCollection?.title || collectionForm.title || 'Untitled collection'}` : 'Create a collection first, then upload content.'}
                  </p>
                </div>
                {selectedCollectionId && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="btn-collection-danger rounded-full border-transparent text-xs h-8 px-3"
                    onClick={handleDeleteCollection}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                    Delete Collection
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <div className="space-y-3">
                  <div>
                    <label className="input-label">Title</label>
                    <Input
                      value={collectionForm.title}
                      onChange={(e) => setCollectionForm({ ...collectionForm, title: e.target.value })}
                      placeholder="My Exclusive Collection"
                    />
                  </div>
                  <div>
                    <label className="input-label">Description</label>
                    <Textarea
                      value={collectionForm.description}
                      onChange={(e) => setCollectionForm({ ...collectionForm, description: e.target.value })}
                      placeholder="Describe your collection..."
                      rows={3}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="input-label">Price</label>
                      <Input
                        type="number"
                        value={collectionForm.price}
                        onChange={(e) => setCollectionForm({ ...collectionForm, price: parseFloat(e.target.value) })}
                        placeholder="4.99"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="input-label">Currency</label>
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
                    <label className="input-label">Tags (comma separated)</label>
                    <Input
                      value={collectionForm.tags}
                      onChange={(e) => setCollectionForm({ ...collectionForm, tags: e.target.value })}
                      placeholder="art, photography, exclusive"
                    />
                  </div>
                </div>
              </div>

              <div className="dashboard-sticky-action-bar flex flex-wrap items-center gap-2">
                {!selectedCollectionId ? (
                  <Button
                    type="button"
                    onClick={handleCreateCollection}
                    className="dash-btn-primary rounded-full h-9 text-xs px-4"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                    Create Collection
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSaveCollectionDetails}
                    className="dash-btn-primary rounded-full h-9 text-xs px-4"
                  >
                    <Save className="h-3.5 w-3.5 mr-1.5" />
                    Save Changes
                  </Button>
                )}
                {selectedCollectionId && (
                  <span className="text-[11px] text-muted-foreground">
                    Collection ID: {selectedCollectionId}
                  </span>
                )}
                <span className="text-[11px] text-muted-foreground ml-auto">
                  {isCollectionDirty || collectionFiles.length > 0 ? 'Unsaved changes' : 'All changes saved'}
                </span>
              </div>

              <div className="border-t border-border/70 pt-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-foreground">Media Manager</h3>
                  <span className="text-xs text-muted-foreground">Step 2 of 2: upload and organize content</span>
                </div>

                {!selectedCollectionId && (
                  <div className="border border-dashed border-border rounded-lg p-5 text-center text-sm text-muted-foreground">
                    Create or select a collection from the left panel to enable uploads.
                  </div>
                )}

                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-3 ${!selectedCollectionId ? 'opacity-60 pointer-events-none' : ''}`}>
                  <div className="space-y-3">
                    <div>
                      <label className="input-label">Content (image/video, max 25MB each)</label>
                      <Input
                        ref={collectionUploadInputRef}
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        onChange={(e) => {
                          handleAddMoreCollectionFiles(e.target.files);
                          if (e.target.value) {
                            e.target.value = '';
                          }
                        }}
                      />
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="dash-btn-secondary rounded-full text-[11px] h-7 px-3"
                          onClick={() => collectionUploadInputRef.current?.click()}
                        >
                          Add more content
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="dash-btn-secondary rounded-full text-[11px] h-7 px-3"
                          onClick={() => {
                            setCollectionFiles([]);
                            setCollectionPreviews([]);
                          }}
                          disabled={collectionFiles.length === 0}
                        >
                          Clear selected content
                        </Button>
                        {collectionFiles.length > 0 && (
                          <span className="text-[11px] text-muted-foreground">
                            {collectionFiles.length} selected
                          </span>
                        )}
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={handleUploadCollectionMedia}
                      disabled={uploadingCollectionMedia || !selectedCollectionId}
                      className="w-full dash-btn-primary rounded-full h-9 text-xs"
                    >
                      {uploadingCollectionMedia ? 'Uploading...' : 'Upload to Selected Collection'}
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div className="text-xs font-medium text-muted-foreground">Selected Files Preview</div>
                    {collectionPreviews.length === 0 ? (
                      <div className="border border-dashed border-border rounded-lg p-4 text-xs text-muted-foreground text-center">
                        Select one or more content files to preview them here.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {collectionPreviews.map((preview, index) => (
                          <div key={`${preview.file.name}-${preview.file.lastModified}-${index}`} className="relative border border-border rounded-md overflow-hidden bg-muted/20">
                            <button
                              type="button"
                              onClick={() => handleRemoveSelectedFile(index)}
                              className="absolute right-1 top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                              aria-label={`Remove ${preview.file.name}`}
                            >
                              <X className="h-3 w-3" />
                            </button>
                            {preview.file.type.startsWith('image/') ? (
                              <img src={preview.url} alt={preview.file.name} className="h-20 w-full object-cover" />
                            ) : (
                              <video src={preview.url} className="h-20 w-full object-cover" muted controls preload="metadata" />
                            )}
                            <div className="px-2 py-1">
                              <div className="text-[11px] text-foreground truncate" title={preview.file.name}>
                                {preview.file.name}
                              </div>
                              <div className="text-[10px] text-muted-foreground">{formatFileSize(preview.file.size)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {selectedCollectionId && (
                      <div className="pt-3 space-y-2">
                        <div className="text-xs font-medium text-muted-foreground">Existing Content</div>
                        {selectedCollectionLoading ? (
                          <div className="border border-dashed border-border rounded-lg p-4 text-xs text-muted-foreground text-center">
                            Loading existing content...
                          </div>
                        ) : selectedCollection?.media?.length > 0 ? (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {selectedCollection.media.map((media: any, index: number) => {
                              const originalThumb = media.thumbnailUrl || media.url;
                              const originalFull = media.url;
                              const imageSources = getMediaSrcCandidates(originalThumb || originalFull);
                              const videoSources = getMediaSrcCandidates(originalFull);
                              const posterSources = getMediaSrcCandidates(originalThumb || originalFull);
                              const isVideo = isVideoMedia(media);
                              return (
                                <div key={`${media.url || 'media'}-${index}`} className="relative border border-border rounded-md overflow-hidden bg-muted/20">
                                  <div className="absolute left-1 top-1 z-10 flex items-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() => handleMoveExistingMedia(index, 'up')}
                                      className="flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 disabled:opacity-40"
                                      disabled={index === 0}
                                      aria-label="Move media up"
                                    >
                                      <ChevronUp className="h-3 w-3" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleMoveExistingMedia(index, 'down')}
                                      className="flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 disabled:opacity-40"
                                      disabled={index === selectedCollection.media.length - 1}
                                      aria-label="Move media down"
                                    >
                                      <ChevronDown className="h-3 w-3" />
                                    </button>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveExistingMedia(index)}
                                    className="absolute right-1 top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                                    aria-label="Remove existing content"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                  {isVideo ? (
                                    videoSources.length > 0 ? (
                                      <video
                                        src={videoSources[0]}
                                        poster={posterSources[0] || undefined}
                                        data-src-index="0"
                                        className="h-20 w-full object-cover relative z-10"
                                        muted
                                        preload="metadata"
                                        onError={(e) => {
                                          const target = e.currentTarget as HTMLVideoElement;
                                          const nextIndex = Number(target.dataset.srcIndex || '0') + 1;
                                          if (nextIndex < videoSources.length) {
                                            target.dataset.srcIndex = String(nextIndex);
                                            target.src = videoSources[nextIndex];
                                            if (posterSources[nextIndex]) {
                                              target.poster = posterSources[nextIndex];
                                            }
                                          } else {
                                            target.style.display = 'none';
                                          }
                                        }}
                                      />
                                    ) : null
                                  ) : (
                                    imageSources.length > 0 ? (
                                      <img
                                        src={imageSources[0]}
                                        alt=""
                                        data-src-index="0"
                                        className="h-20 w-full object-cover relative z-10"
                                        loading="lazy"
                                        decoding="async"
                                        onError={(e) => {
                                          const target = e.currentTarget as HTMLImageElement;
                                          const nextIndex = Number(target.dataset.srcIndex || '0') + 1;
                                          if (nextIndex < imageSources.length) {
                                            target.dataset.srcIndex = String(nextIndex);
                                            target.src = imageSources[nextIndex];
                                          } else {
                                            target.style.display = 'none';
                                          }
                                        }}
                                      />
                                    ) : null
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="border border-dashed border-border rounded-lg p-4 text-xs text-muted-foreground text-center">
                            No existing content yet.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Unlock Everything Tab */}
        {activeTab === 'unlock' && (
          <div className="space-y-6">
            <div className="card-container">
              <h2 className="card-title">Unlock Everything Price</h2>
              <p className="card-description">
                Set the price for the Unlock Everything button. This gives clients access to all of your collections.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="input-label">
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
                  <label className="input-label">
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
              <Button onClick={handleSaveUnlockAllPrice} className="w-full mt-4 dash-btn-primary">
                <Save className="w-4 h-4 mr-2" />
                Save Price
              </Button>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {analyticsTotals.orders === 0 && analyticsSeries.length === 0 && (
              <div className="card-elevated p-8">
                <div className="flex flex-col items-center justify-center text-center py-8 px-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/15 to-teal-500/15 border border-white/[0.06] flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-emerald-400/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                  </div>
                  <p className="text-sm font-medium text-foreground mb-1">No analytics yet</p>
                  <p className="text-xs text-muted-foreground max-w-[260px] leading-relaxed">
                    Revenue, orders, and performance trends will appear here after your first sale.
                  </p>
                </div>
              </div>
            )}
            <div className="card-elevated p-6 sm:p-8 space-y-4">
              <div className="flex flex-col gap-2">
                <h2 className="section-title">Sales Analytics</h2>
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
              <div className="stat-card-glow">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Gross Revenue</p>
                <p className="text-2xl font-bold text-foreground mt-2">
                  {formatMoney(analyticsTotals.revenue, analyticsCurrency)}
                </p>
              </div>
              <div className="stat-card-glow">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Orders</p>
                <p className="text-2xl font-bold text-foreground mt-2">{analyticsTotals.orders}</p>
              </div>
              <div className="stat-card-glow">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Creator Net</p>
                <p className="text-2xl font-bold text-foreground mt-2">
                  {formatMoney(analyticsTotals.net, analyticsCurrency)}
                </p>
              </div>
              <div className="stat-card-glow">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Platform Fee</p>
                <p className="text-2xl font-bold text-foreground mt-2">
                  {formatMoney(analyticsTotals.platformFee, analyticsCurrency)}
                </p>
              </div>
            </div>

            <div className="card-elevated p-6 sm:p-8">
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

            <div className="card-elevated p-6 sm:p-8 space-y-4">
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
                            {sale.createdAt ? format(parseISO(sale.createdAt), 'MMM d, yyyy') : 'â€”'}
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
                          <p className="text-sm text-foreground font-medium">{sale.emailMasked || 'â€”'}</p>
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
                            {sale.createdAt ? format(parseISO(sale.createdAt), 'MMM d, yyyy') : 'â€”'}
                          </td>
                          <td className="px-4 py-3 text-foreground">{sale.collectionTitle}</td>
                          <td className="px-4 py-3 text-foreground">
                            {formatMoney(sale.amount, sale.currency)}
                          </td>
                          <td className="px-4 py-3 text-foreground">
                            {formatMoney(sale.creatorAmount, sale.currency)}
                          </td>
                          <td className="px-4 py-3 text-foreground capitalize">{sale.status}</td>
                          <td className="px-4 py-3 text-foreground">{sale.emailMasked || 'â€”'}</td>
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
                    className="dash-btn-secondary"
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
                    className="dash-btn-secondary"
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
      </div>
    </div>
  );
};

export default CreatorDashboard;


