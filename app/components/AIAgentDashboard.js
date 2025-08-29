"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../lib/hooks.js";
import { aiAgent } from "../lib/ai-agent.js";
import ContentDiscovery from "./AIAgent/ContentDiscovery.js";
import PostApproval from "./AIAgent/PostApproval.js";
import ContentGeneration from "./AIAgent/ContentGeneration.js";
import toast from "react-hot-toast";

export default function AIAgentDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = "discovery";
  const [isLoading, setIsLoading] = useState(false);
  const [pendingPosts, setPendingPosts] = useState([]);

  useEffect(() => {
    if (user) {
      loadPendingPosts();
    }
  }, [user]);

  const loadPendingPosts = async () => {
    try {
      const posts = await aiAgent.getPendingPosts();
      setPendingPosts(posts);
    } catch (error) {
      console.error("Failed to load pending posts:", error);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "discovery":
        return <ContentDiscovery onPostGenerated={loadPendingPosts} />;
      case "generation":
        return <ContentGeneration onPostGenerated={loadPendingPosts} />;
      case "approval":
        return (
          <PostApproval posts={pendingPosts} onPostUpdated={loadPendingPosts} />
        );
      default:
        return <ContentDiscovery onPostGenerated={loadPendingPosts} />;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-600">
            Please sign in to access the AI Agent Dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Content Agent Dashboard
          </h1>
          <p className="text-gray-600">
            Automatically discover fitness content, generate engaging posts, and
            manage your social media presence.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: "discovery", name: "Content Discovery", icon: "🔍" },
              { id: "generation", name: "Post Generation", icon: "✍️" },
              { id: "approval", name: "Post Approval", icon: "✅" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
                {tab.id === "approval" && pendingPosts.length > 0 && (
                  <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                    {pendingPosts.length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow">{renderTabContent()}</div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">📊</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Posts</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {pendingPosts.filter((p) => p.status === "posted").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">⏳</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Pending Approval
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {
                    pendingPosts.filter((p) => p.status === "pending_approval")
                      .length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">🚀</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Success Rate
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {pendingPosts.length > 0
                    ? Math.round(
                        (pendingPosts.filter((p) => p.status === "posted")
                          .length /
                          pendingPosts.length) *
                          100
                      )
                    : 0}
                  %
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
