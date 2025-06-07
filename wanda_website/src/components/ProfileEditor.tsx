import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import type { WandaCaller } from "../types";

interface PreferenceSectionProps {
  title: string;
  type: 'food' | 'activities' | 'shopping' | 'entertainment';
  color: string;
  emoji: string;
  preferences: string[];
  newValue: string;
  onNewValueChange: (value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

function PreferenceSection({
  title,
  type,
  color,
  emoji,
  preferences,
  newValue,
  onNewValueChange,
  onAdd,
  onRemove,
}: PreferenceSectionProps) {
  return (
    <div className="space-y-3">
      <h4 className="font-medium text-slate-700 flex items-center">
        <span className="mr-2">{emoji}</span>
        {title}
      </h4>
      
      {/* Existing preferences */}
      <div className="flex flex-wrap gap-2">
        {preferences.map((pref, index) => (
          <span
            key={index}
            className={`px-3 py-1 ${color} text-sm rounded-full flex items-center group`}
          >
            {pref}
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="ml-2 opacity-60 hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {/* Add new preference */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newValue}
          onChange={(e) => onNewValueChange(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAdd();
            }
          }}
          placeholder={`Add ${title.toLowerCase()}`}
          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="button"
          onClick={onAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
}

interface ProfileEditorProps {
  profile: WandaCaller | null;
  phoneNumber: string;
  onUpdate: (updatedProfile: WandaCaller) => void;
  onClose: () => void;
}

export default function ProfileEditor({
  profile,
  phoneNumber,
  onUpdate,
  onClose,
}: ProfileEditorProps) {
  const [formData, setFormData] = useState({
    name: profile?.name || "",
    age: profile?.age || "",
    city: profile?.city || "",
    foodPreferences: profile?.foodPreferences || [],
    activitiesPreferences: profile?.activitiesPreferences || [],
    shoppingPreferences: profile?.shoppingPreferences || [],
    entertainmentPreferences: profile?.entertainmentPreferences || [],
  });

  const [newPreferences, setNewPreferences] = useState({
    food: "",
    activities: "",
    shopping: "",
    entertainment: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addPreference = (type: keyof typeof newPreferences) => {
    const value = newPreferences[type].trim();
    if (!value) return;

    const fieldName = `${type}Preferences` as keyof typeof formData;
    const currentPrefs = formData[fieldName] as string[];
    
    if (!currentPrefs.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: [...currentPrefs, value],
      }));
    }

    setNewPreferences((prev) => ({
      ...prev,
      [type]: "",
    }));
  };

  const removePreference = (type: string, index: number) => {
    const fieldName = `${type}Preferences` as keyof typeof formData;
    const currentPrefs = formData[fieldName] as string[];
    
    setFormData((prev) => ({
      ...prev,
      [fieldName]: currentPrefs.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const cleanPhoneNumber = phoneNumber.replace("+1", "");
      const docRef = doc(db, "callers", cleanPhoneNumber);

      const updateData: Partial<WandaCaller> = {
        name: formData.name.trim() || undefined,
        age: formData.age ? Number(formData.age) : undefined,
        city: formData.city.trim() || undefined,
        foodPreferences: formData.foodPreferences,
        activitiesPreferences: formData.activitiesPreferences,
        shoppingPreferences: formData.shoppingPreferences,
        entertainmentPreferences: formData.entertainmentPreferences,
      };

      // Remove undefined values
      Object.keys(updateData).forEach((key) => {
        if (updateData[key as keyof typeof updateData] === undefined) {
          delete updateData[key as keyof typeof updateData];
        }
      });

      await updateDoc(docRef, updateData);

      const updatedProfile: WandaCaller = {
        phoneNumber,
        createdAt: profile?.createdAt || new Date().toISOString(),
        lastCalledAt: profile?.lastCalledAt,
        ...updateData,
      };

      onUpdate(updatedProfile);
      onClose();
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Edit Profile</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">
                Basic Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your age"
                    min="1"
                    max="120"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your city"
                />
              </div>
            </div>

            {/* Preferences */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">
                Preferences
              </h3>

              <PreferenceSection
                title="Food Preferences"
                type="food"
                color="bg-blue-100 text-blue-800"
                emoji="🍽️"
                preferences={formData.foodPreferences}
                newValue={newPreferences.food}
                onNewValueChange={(value) => setNewPreferences(prev => ({ ...prev, food: value }))}
                onAdd={() => addPreference('food')}
                onRemove={(index) => removePreference('food', index)}
              />

              <PreferenceSection
                title="Activity Preferences"
                type="activities"
                color="bg-green-100 text-green-800"
                emoji="🎯"
                preferences={formData.activitiesPreferences}
                newValue={newPreferences.activities}
                onNewValueChange={(value) => setNewPreferences(prev => ({ ...prev, activities: value }))}
                onAdd={() => addPreference('activities')}
                onRemove={(index) => removePreference('activities', index)}
              />

              <PreferenceSection
                title="Shopping Preferences"
                type="shopping"
                color="bg-purple-100 text-purple-800"
                emoji="🛍️"
                preferences={formData.shoppingPreferences}
                newValue={newPreferences.shopping}
                onNewValueChange={(value) => setNewPreferences(prev => ({ ...prev, shopping: value }))}
                onAdd={() => addPreference('shopping')}
                onRemove={(index) => removePreference('shopping', index)}
              />

              <PreferenceSection
                title="Entertainment Preferences"
                type="entertainment"
                color="bg-yellow-100 text-yellow-800"
                emoji="🎭"
                preferences={formData.entertainmentPreferences}
                newValue={newPreferences.entertainment}
                onNewValueChange={(value) => setNewPreferences(prev => ({ ...prev, entertainment: value }))}
                onAdd={() => addPreference('entertainment')}
                onRemove={(index) => removePreference('entertainment', index)}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
