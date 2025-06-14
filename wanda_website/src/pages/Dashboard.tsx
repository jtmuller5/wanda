import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import Navigation from "../components/Navigation";
import ProfileEditor from "../components/ProfileEditor";
import type { CallRecord, WandaCaller } from "../types";

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<WandaCaller | null>(null);
  const [callHistory, setCallHistory] = useState<CallRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProfileEditor, setShowProfileEditor] = useState(false);

  useEffect(() => {
    if (user?.phoneNumber) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user?.phoneNumber) return;

    try {
      // Extract phone number (remove +1)
      const phoneNumber = user.phoneNumber.replace("+1", "");

      // Load caller profile
      const callerDoc = await getDoc(doc(db, "callers", phoneNumber));
      if (callerDoc.exists()) {
        setProfile(callerDoc.data() as WandaCaller);
      }

      // Load call history
      const callsQuery = query(
        collection(db, "calls"),
        where("callerPhoneNumber", "==", user.phoneNumber),
        orderBy("createdAt", "desc")
      );
      const callsSnapshot = await getDocs(callsQuery);
      const calls = callsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as CallRecord[];

      setCallHistory(calls);
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = (updatedProfile: WandaCaller) => {
    setProfile(updatedProfile);
  };

  const getPreferenceCount = () => {
    if (!profile) return 0;
    return (
      (profile.foodPreferences?.length || 0) +
      (profile.activitiesPreferences?.length || 0) +
      (profile.shoppingPreferences?.length || 0) +
      (profile.entertainmentPreferences?.length || 0)
    );
  };

  const getProfileCompleteness = () => {
    if (!profile) return 0;
    let completed = 0;
    const total = 7; // name, age, city, and 4 preference types

    if (profile.name) completed++;
    if (profile.age) completed++;
    if (profile.city) completed++;
    if (profile.foodPreferences?.length) completed++;
    if (profile.activitiesPreferences?.length) completed++;
    if (profile.shoppingPreferences?.length) completed++;
    if (profile.entertainmentPreferences?.length) completed++;

    return Math.round((completed / total) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">
            Welcome back{profile?.name ? `, ${profile.name}` : ""}! 👋
          </h2>
          <p className="text-slate-600">
            Ready to discover amazing places? Call Wanda anytime at{" "}
            <a
              href="tel:+18453883443"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              (845) 388-3443
            </a>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Completeness */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                <span className="mr-2">📊</span>
                Profile Completeness
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600">Progress</span>
                    <span className="font-medium text-slate-800">
                      {getProfileCompleteness()}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getProfileCompleteness()}%` }}
                    ></div>
                  </div>
                </div>

                <div className="text-sm text-slate-600">
                  <p className="mb-2">Completed sections:</p>
                  <ul className="space-y-1">
                    <li
                      className={`flex items-center ${
                        profile?.name ? "text-green-600" : "text-slate-400"
                      }`}
                    >
                      <span className="mr-2">{profile?.name ? "✓" : "○"}</span>
                      Name
                    </li>
                    <li
                      className={`flex items-center ${
                        profile?.age ? "text-green-600" : "text-slate-400"
                      }`}
                    >
                      <span className="mr-2">{profile?.age ? "✓" : "○"}</span>
                      Age
                    </li>
                    <li
                      className={`flex items-center ${
                        profile?.city ? "text-green-600" : "text-slate-400"
                      }`}
                    >
                      <span className="mr-2">{profile?.city ? "✓" : "○"}</span>
                      City
                    </li>
                    <li
                      className={`flex items-center ${
                        profile?.foodPreferences?.length
                          ? "text-green-600"
                          : "text-slate-400"
                      }`}
                    >
                      <span className="mr-2">
                        {profile?.foodPreferences?.length ? "✓" : "○"}
                      </span>
                      Food Preferences
                    </li>
                    <li
                      className={`flex items-center ${
                        profile?.activitiesPreferences?.length
                          ? "text-green-600"
                          : "text-slate-400"
                      }`}
                    >
                      <span className="mr-2">
                        {profile?.activitiesPreferences?.length ? "✓" : "○"}
                      </span>
                      Activity Preferences
                    </li>
                    <li
                      className={`flex items-center ${
                        profile?.shoppingPreferences?.length
                          ? "text-green-600"
                          : "text-slate-400"
                      }`}
                    >
                      <span className="mr-2">
                        {profile?.shoppingPreferences?.length ? "✓" : "○"}
                      </span>
                      Shopping Preferences
                    </li>
                    <li
                      className={`flex items-center ${
                        profile?.entertainmentPreferences?.length
                          ? "text-green-600"
                          : "text-slate-400"
                      }`}
                    >
                      <span className="mr-2">
                        {profile?.entertainmentPreferences?.length ? "✓" : "○"}
                      </span>
                      Entertainment Preferences
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-slate-800 flex items-center">
                  <span className="mr-2">👤</span>
                  Your Profile
                </h3>
                <button
                  onClick={() => setShowProfileEditor(true)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors cursor-pointer"
                >
                  Edit Profile
                </button>
              </div>

              {profile ? (
                <div className="space-y-4">
                  {/* Basic Info */}
                  <div className="space-y-3">
                    {profile.name && (
                      <div>
                        <span className="text-sm text-slate-500">Name:</span>
                        <p className="font-medium text-slate-800">
                          {profile.name}
                        </p>
                      </div>
                    )}

                    {profile.age && (
                      <div>
                        <span className="text-sm text-slate-500">Age:</span>
                        <p className="font-medium text-slate-800">
                          {profile.age}
                        </p>
                      </div>
                    )}

                    {profile.city && (
                      <div>
                        <span className="text-sm text-slate-500">City:</span>
                        <p className="font-medium text-slate-800">
                          {profile.city}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Preferences */}
                  {getPreferenceCount() > 0 && (
                    <div className="border-t border-slate-200 pt-4">
                      <h4 className="text-sm font-medium text-slate-700 mb-3">
                        Your Preferences ({getPreferenceCount()} total)
                      </h4>

                      <div className="space-y-3">
                        {profile.foodPreferences &&
                          profile.foodPreferences.length > 0 && (
                            <div>
                              <span className="text-xs text-slate-500 uppercase tracking-wide">
                                Food:
                              </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {profile.foodPreferences
                                  .slice(0, 3)
                                  .map((pref, index) => (
                                    <span
                                      key={index}
                                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                    >
                                      {pref}
                                    </span>
                                  ))}
                                {profile.foodPreferences.length > 3 && (
                                  <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                                    +{profile.foodPreferences.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                        {profile.activitiesPreferences &&
                          profile.activitiesPreferences.length > 0 && (
                            <div>
                              <span className="text-xs text-slate-500 uppercase tracking-wide">
                                Activities:
                              </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {profile.activitiesPreferences
                                  .slice(0, 3)
                                  .map((pref, index) => (
                                    <span
                                      key={index}
                                      className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                                    >
                                      {pref}
                                    </span>
                                  ))}
                                {profile.activitiesPreferences.length > 3 && (
                                  <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                                    +{profile.activitiesPreferences.length - 3}{" "}
                                    more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                        {profile.shoppingPreferences &&
                          profile.shoppingPreferences.length > 0 && (
                            <div>
                              <span className="text-xs text-slate-500 uppercase tracking-wide">
                                Shopping:
                              </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {profile.shoppingPreferences
                                  .slice(0, 3)
                                  .map((pref, index) => (
                                    <span
                                      key={index}
                                      className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
                                    >
                                      {pref}
                                    </span>
                                  ))}
                                {profile.shoppingPreferences.length > 3 && (
                                  <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                                    +{profile.shoppingPreferences.length - 3}{" "}
                                    more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                        {profile.entertainmentPreferences &&
                          profile.entertainmentPreferences.length > 0 && (
                            <div>
                              <span className="text-xs text-slate-500 uppercase tracking-wide">
                                Entertainment:
                              </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {profile.entertainmentPreferences
                                  .slice(0, 3)
                                  .map((pref, index) => (
                                    <span
                                      key={index}
                                      className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full"
                                    >
                                      {pref}
                                    </span>
                                  ))}
                                {profile.entertainmentPreferences.length >
                                  3 && (
                                  <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                                    +
                                    {profile.entertainmentPreferences.length -
                                      3}{" "}
                                    more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">👤</div>
                  <p className="text-slate-500 mb-4">
                    No profile information yet
                  </p>
                  <p className="text-sm text-slate-400 mb-6">
                    Set up your profile to get personalized recommendations!
                  </p>
                  <button
                    onClick={() => setShowProfileEditor(true)}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
                  >
                    Create Profile
                    <span className="ml-2">✨</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Call History */}
          <div className="lg:col-span-2">
            {/* Quick Stats */}
            {callHistory.length > 0 && (
              <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow p-4 border border-slate-200">
                  <div className="text-2xl font-bold text-blue-600">
                    {callHistory.length}
                  </div>
                  <div className="text-sm text-slate-600">Total Calls</div>
                </div>

                <div className="bg-white rounded-lg shadow p-4 border border-slate-200">
                  <div className="text-2xl font-bold text-green-600">
                    {callHistory.filter((call) => call.directionsSent).length}
                  </div>
                  <div className="text-sm text-slate-600">Directions Sent</div>
                </div>

                <div className="bg-white rounded-lg shadow p-4 border border-slate-200">
                  <div className="text-2xl font-bold text-purple-600">
                    {
                      callHistory.filter(
                        (call) => call.lastSearchResults?.length
                      ).length
                    }
                  </div>
                  <div className="text-sm text-slate-600">Places Searched</div>
                </div>

                <div className="bg-white rounded-lg shadow p-4 border border-slate-200">
                  <div className="text-2xl font-bold text-yellow-600">
                    {getPreferenceCount()}
                  </div>
                  <div className="text-sm text-slate-600">Preferences</div>
                </div>
              </div>
            )}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                <span className="mr-2">📞</span>
                Call History
                {callHistory.length > 0 && (
                  <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {callHistory.length} calls
                  </span>
                )}
              </h3>

              {callHistory.length > 0 ? (
                <div className="space-y-4">
                  {callHistory.map((call) => (
                    <div
                      key={call.id}
                      className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                call.status === "ended"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {call.status || "In Progress"}
                            </span>
                            {call.directionsSent && (
                              <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                                📍 Directions Sent
                              </span>
                            )}
                            {call.lastSearchResults &&
                              call.lastSearchResults.length > 0 && (
                                <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                                  🔍 Places Found
                                </span>
                              )}
                          </div>

                          <p className="text-sm text-slate-600 mb-1">
                            {new Date(call.createdAt).toLocaleString()}
                          </p>

                          {call.directionsPlaceName && (
                            <p className="text-sm text-slate-700">
                              <span className="font-medium">
                                Got directions to:
                              </span>{" "}
                              {call.directionsPlaceName}
                            </p>
                          )}

                          {call.lastSearchResults &&
                            call.lastSearchResults.length > 0 &&
                            !call.directionsPlaceName && (
                              <p className="text-sm text-slate-700">
                                <span className="font-medium">
                                  Found places:
                                </span>{" "}
                                {call.lastSearchResults
                                  .map((place) => place.name)
                                  .join(", ")}
                              </p>
                            )}

                          {call.summary && (
                            <p className="text-sm text-slate-600 mt-2 italic">
                              "{call.summary}"
                            </p>
                          )}
                        </div>

                        <div className="text-right">
                          <p className="text-xs text-slate-500">
                            {call.endedReason && `Ended: ${call.endedReason}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">📞</div>
                  <p className="text-slate-500 mb-2">No calls yet</p>
                  <p className="text-sm text-slate-400 mb-6">
                    Make your first call to Wanda to get started!
                  </p>
                  <a
                    href="tel:+18453883443"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
                  >
                    Call (845) 388-3443
                    <span className="ml-2">📱</span>
                  </a>
                </div>
              )}
            </div>

            
          </div>
        </div>
      </div>

      {/* Profile Editor Modal */}
      {showProfileEditor && user?.phoneNumber && (
        <ProfileEditor
          profile={profile}
          phoneNumber={user.phoneNumber}
          onUpdate={handleProfileUpdate}
          onClose={() => setShowProfileEditor(false)}
        />
      )}
    </div>
  );
}
