import React, { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import { FirestoreProfile, FirestoreLinks } from "../../../types/firebase";

interface ProfileFormProps {
  profile: FirestoreProfile | null;
  links: FirestoreLinks | null;
  onSaveProfile: (profile: Partial<FirestoreProfile>) => Promise<void>;
  onSaveLinks: (links: Partial<FirestoreLinks>) => Promise<void>;
  isLoading: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  links,
  onSaveProfile,
  onSaveLinks,
  isLoading,
}) => {
  const [profileData, setProfileData] = useState<Partial<FirestoreProfile>>({});
  const [linksData, setLinksData] = useState<Partial<FirestoreLinks>>({});

  useEffect(() => {
    if (profile) {
      setProfileData(profile);
    }
  }, [profile]);

  useEffect(() => {
    if (links) {
      setLinksData(links);
    }
  }, [links]);

  const updateProfileField = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const updateLinksField = (field: string, value: string) => {
    setLinksData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    await onSaveProfile(profileData);
  };

  const handleSaveLinks = async () => {
    await onSaveLinks(linksData);
  };

  return (
    <div className="space-y-8">
      {/* Profile Section */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-6">Personal Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={profileData.name || ""}
              onChange={(e) => updateProfileField("name", e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Short Name
            </label>
            <input
              type="text"
              value={profileData.short_name || ""}
              onChange={(e) => updateProfileField("short_name", e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Primary Email
            </label>
            <input
              type="email"
              value={profileData.email || ""}
              onChange={(e) => updateProfileField("email", e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Business Email
            </label>
            <input
              type="email"
              value={profileData.business_email || ""}
              onChange={(e) => updateProfileField("business_email", e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Primary Phone
            </label>
            <input
              type="text"
              value={profileData.primary_phone || ""}
              onChange={(e) => updateProfileField("primary_phone", e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Secondary Phone
            </label>
            <input
              type="text"
              value={profileData.secondary_phone || ""}
              onChange={(e) => updateProfileField("secondary_phone", e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              City
            </label>
            <input
              type="text"
              value={profileData.city || ""}
              onChange={(e) => updateProfileField("city", e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Country
            </label>
            <input
              type="text"
              value={profileData.country || ""}
              onChange={(e) => updateProfileField("country", e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Full Address
            </label>
            <input
              type="text"
              value={profileData.full_address || ""}
              onChange={(e) => updateProfileField("full_address", e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Bio
            </label>
            <textarea
              value={profileData.bio || ""}
              onChange={(e) => updateProfileField("bio", e.target.value)}
              rows={4}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleSaveProfile}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Profile
              </>
            )}
          </button>
        </div>
      </div>

      {/* Social Links Section */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-6">Social Links</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              LinkedIn URL
            </label>
            <input
              type="url"
              value={linksData.linkedin || ""}
              onChange={(e) => updateLinksField("linkedin", e.target.value)}
              placeholder="https://linkedin.com/in/..."
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              GitHub URL
            </label>
            <input
              type="url"
              value={linksData.github || ""}
              onChange={(e) => updateLinksField("github", e.target.value)}
              placeholder="https://github.com/..."
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Facebook URL
            </label>
            <input
              type="url"
              value={linksData.facebook || ""}
              onChange={(e) => updateLinksField("facebook", e.target.value)}
              placeholder="https://facebook.com/..."
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              WhatsApp Number
            </label>
            <input
              type="text"
              value={linksData.whatsapp || ""}
              onChange={(e) => updateLinksField("whatsapp", e.target.value)}
              placeholder="+880..."
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleSaveLinks}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Links
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
