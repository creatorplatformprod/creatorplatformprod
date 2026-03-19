import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Loader2, Save, Shield, Unlock, User } from "lucide-react";
import { api } from "@/lib/api";
import { useFanAuth } from "@/contexts/FanAuthContext";
import { useFeedbackToasts } from "@/hooks/useFeedbackToasts";

const isGoogleFanAccount = (fanLike: any) => {
  if (!fanLike) return false;
  const provider = String(fanLike?.provider || fanLike?.authProvider || fanLike?.loginProvider || "").toLowerCase();
  const authType = String(fanLike?.authType || fanLike?.authMethod || "").toLowerCase();
  const hasGoogleId = Boolean(fanLike?.googleId || fanLike?.googleSub || fanLike?.googleUid);
  const avatar = String(fanLike?.avatar || "").toLowerCase();
  const email = String(fanLike?.email || "").toLowerCase();
  return (
    provider.includes("google") ||
    authType.includes("google") ||
    hasGoogleId ||
    avatar.includes("googleusercontent.com") ||
    email.endsWith("@gmail.com") && provider === "oauth"
  );
};

const isGoogleHostedAvatar = (value: string) =>
  String(value || "").toLowerCase().includes("googleusercontent.com");

const FanAccount = () => {
  const { fan, refreshFan } = useFanAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [unlocks, setUnlocks] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [meFan, setMeFan] = useState<any>(null);
  const [profile, setProfile] = useState({ displayName: "", bio: "", avatar: "" });
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  useFeedbackToasts({ success: message, error });

  useEffect(() => {
    const load = async () => {
      if (!localStorage.getItem("fan_token")) {
        window.location.href = "/";
        return;
      }
      setLoading(true);
      setError("");
      try {
        const [me, unlocksResult] = await Promise.all([api.getCurrentFan(), api.getFanUnlocks()]);
        if (me?.success && me.fan) {
          setMeFan(me.fan);
          setProfile({
            displayName: me.fan.displayName || "",
            bio: me.fan.bio || "",
            avatar: me.fan.avatar || ""
          });
        }
        if (unlocksResult?.success) {
          setUnlocks(unlocksResult.unlocks || []);
        }
      } catch (err: any) {
        setError(err?.message || "Failed to load fan account");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const hasPassword = useMemo(() => !isGoogleFanAccount(meFan || fan), [meFan, fan]);
  const googleAvatarManaged = useMemo(
    () => isGoogleFanAccount(meFan || fan) && isGoogleHostedAvatar(profile.avatar),
    [meFan, fan, profile.avatar]
  );

  const saveProfile = async () => {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const result = await api.updateFanProfile(profile);
      if (!result?.success) {
        throw new Error(result?.error || "Failed to update profile");
      }
      await refreshFan();
      setMessage("Profile updated.");
    } catch (err: any) {
      setError(err?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setError("Please fill in all password fields.");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }
    if (passwordData.newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    setPasswordSaving(true);
    setError("");
    setMessage("");
    try {
      const result = await api.changeFanPassword(passwordData);
      if (!result?.success) {
        throw new Error(result?.error || "Failed to change password");
      }
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setMessage("Password updated.");
    } catch (err: any) {
      setError(err?.message || "Failed to change password");
    } finally {
      setPasswordSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen feed-bg flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen feed-bg px-4 py-6">
      <div className="mx-auto max-w-3xl space-y-5">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="post-card rounded-xl p-5">
          <h1 className="text-xl font-semibold text-foreground">Account Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">{fan?.email || "Account"}</p>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}
        {message && <p className="text-sm text-emerald-400">{message}</p>}

        <section className="post-card rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-foreground font-medium">
            <User className="h-4 w-4" />
            Profile
          </div>
          <input
            value={profile.displayName}
            onChange={(e) => setProfile((prev) => ({ ...prev, displayName: e.target.value }))}
            placeholder="Display name"
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-foreground"
          />
          {googleAvatarManaged ? (
            <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-muted-foreground">
              Profile image is currently synced from your Google account.
            </div>
          ) : (
            <input
              value={profile.avatar}
              onChange={(e) => setProfile((prev) => ({ ...prev, avatar: e.target.value }))}
              placeholder="Profile image URL"
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-foreground"
            />
          )}
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))}
            placeholder="Bio"
            rows={3}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-foreground"
          />
          <button
            onClick={saveProfile}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </section>

        <section className="post-card rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-foreground font-medium">
            <Shield className="h-4 w-4" />
            Security
          </div>
          {hasPassword ? (
            <>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                placeholder="Current password"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-foreground"
              />
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
                placeholder="New password"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-foreground"
              />
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirm new password"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-foreground"
              />
              <button
                onClick={savePassword}
                disabled={passwordSaving}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-foreground disabled:opacity-60"
              >
                {passwordSaving ? "Updating..." : "Change Password"}
              </button>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">This account uses Google sign-in. Password changes are managed through your Google account.</p>
          )}
        </section>

        <section className="post-card rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-foreground font-medium">
            <Unlock className="h-4 w-4" />
            Unlocked Content
          </div>
          {unlocks.length === 0 ? (
            <p className="text-sm text-muted-foreground">No unlocked content yet.</p>
          ) : (
            <div className="space-y-2">
              {unlocks.map((item, index) => (
                <a
                  key={`${item.accessToken}-${index}`}
                  href={item.url}
                  className="block rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 hover:bg-gray-100"
                >
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.creatorUsername || "creator"}</p>
                </a>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default FanAccount;
