"use client";
import { useState, useEffect } from "react";
import { useUserData } from "../lib/hooks.js";
import { aiAgent } from "../lib/ai-agent.js";
import ArticleDiscovery from "./AIAgent/ArticleDiscovery.js";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AIAgentDashboard() {
  const { user } = useUserData();
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [approvedArticles, setApprovedArticles] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (user && user.uid === process.env.NEXT_PUBLIC_AI_AGENT_ACCESS_USER_ID) {
      // User has access - load articles
      loadArticles();
    }
  }, [user]);

  const loadArticles = async () => {
    setIsLoading(true);
    try {
      const discoveredArticles = await aiAgent.getArticlesFromLast7Days();
      setArticles(discoveredArticles);

      // Count approved articles
      const approved = discoveredArticles.filter((article) => article.approved);
      setApprovedArticles(approved);
    } catch (error) {
      console.error("Failed to load articles:", error);
      toast.error("Failed to load articles. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshContent = async () => {
    setIsLoading(true);
    try {
      await aiAgent.runContentDiscovery();
      await loadArticles(); // Reload articles after discovery
      toast.success("Content discovery completed!");
    } catch (error) {
      console.error("Content discovery failed:", error);
      toast.error("Failed to discover new content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleArticleApproval = async (articleId, approved) => {
    try {
      if (approved) {
        const result = await aiAgent.approveArticle(articleId);
        if (result.success) {
          toast.success("Article approved!");
          // Update local state
          setArticles((prev) =>
            prev.map((article) =>
              article.id === articleId
                ? { ...article, approved: true }
                : article
            )
          );
          setApprovedArticles((prev) =>
            prev.filter((article) => article.id !== articleId)
          );
        }
      }
    } catch (error) {
      console.error("Failed to approve article:", error);
      toast.error("Failed to approve article. Please try again.");
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
    <>
      {user?.uid === process.env.NEXT_PUBLIC_AI_AGENT_ACCESS_USER_ID ? (
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                AI Content Discovery Dashboard
              </h1>
              <p className="text-gray-600">
                Discover fitness articles from the last 7 days and approve the
                ones you want to use for content creation.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mb-6 flex justify-between items-center">
              <div className="flex space-x-4">
                <button
                  onClick={handleRefreshContent}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md transition-colors flex items-center"
                >
                  {isLoading ? (
                    <>
                      <span className="mr-2">⏳</span>
                      Discovering...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">🔍</span>
                      Discover New Content
                    </>
                  )}
                </button>

                <button
                  onClick={loadArticles}
                  disabled={isLoading}
                  className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Refresh List
                </button>
              </div>

              <div className="text-sm text-gray-600">
                Last updated: {new Date().toLocaleString()}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">📰</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      Total Articles
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {articles.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">✅</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      Approved Articles
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {approvedArticles.length}
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
                      Pending Review
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {articles.length - approvedArticles.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Articles List */}
            <div className="bg-white rounded-lg shadow">
              <ArticleDiscovery
                articles={articles}
                onArticleApproval={handleArticleApproval}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                You are not authorized to access this page
              </h2>
              <p className="text-gray-600">
                Return to{" "}
                <Link
                  href="/"
                  className="text-navy-light font-semibold hover:underline"
                >
                  Home Page
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
