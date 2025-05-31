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
import type { CallRecord, WandaCaller } from "../types";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<WandaCaller | null>(null);
  const [callHistory, setCallHistory] = useState<CallRecord[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
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
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Wanda
              </h1>
              <span className="text-slate-600">Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">
                {user?.phoneNumber}
              </span>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">
            Welcome back{profile?.name ? `, ${profile.name}` : ""}! 👋
          </h2>
          <p className="text-slate-600">
            Ready to discover amazing places? Call Wanda anytime at{" "}
            <a
              href="tel:+18436489138"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              (843) 648-9138
            </a>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                <span className="mr-2">👤</span>
                Your Profile
              </h3>

              {profile ? (
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

                  {profile.foodPreferences &&
                    profile.foodPreferences.length > 0 && (
                      <div>
                        <span className="text-sm text-slate-500">
                          Food Preferences:
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {profile.foodPreferences.map((pref, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                            >
                              {pref}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  {profile.activitiesPreferences &&
                    profile.activitiesPreferences.length > 0 && (
                      <div>
                        <span className="text-sm text-slate-500">
                          Activity Preferences:
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {profile.activitiesPreferences.map((pref, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                            >
                              {pref}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  {profile.shoppingPreferences &&
                    profile.shoppingPreferences.length > 0 && (
                      <div>
                        <span className="text-sm text-slate-500">
                          Shopping Preferences:
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {profile.shoppingPreferences.map((pref, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
                            >
                              {pref}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  {profile.entertainmentPreferences &&
                    profile.entertainmentPreferences.length > 0 && (
                      <div>
                        <span className="text-sm text-slate-500">
                          Entertainment Preferences:
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {profile.entertainmentPreferences.map(
                            (pref, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full"
                              >
                                {pref}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-500 mb-4">
                    No profile information yet
                  </p>
                  <p className="text-sm text-slate-400">
                    Call Wanda and update your profile to get personalized
                    recommendations!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Call History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                <span className="mr-2">📞</span>
                Call History
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
                          </div>

                          <p className="text-sm text-slate-600 mb-1">
                            {new Date(call.createdAt).toLocaleString()}
                          </p>

                          {call.directionsPlaceName && (
                            <p className="text-sm text-slate-700">
                              <span className="font-medium">Searched for:</span>{" "}
                              {call.directionsPlaceName}
                            </p>
                          )}

                          {call.summary && (
                            <p className="text-sm text-slate-600 mt-2 italic">
                              {call.summary}
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
                    href="tel:+18436489138"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
                  >
                    Call (843) 648-9138
                    <span className="ml-2">📱</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
