"use client";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ArticleDiscovery({
  articles,
  onArticleApproval,
  isLoading,
}) {
  const [selectedArticles, setSelectedArticles] = useState(new Set());

  const handleCheckboxChange = (articleId, checked) => {
    if (checked) {
      setSelectedArticles((prev) => new Set([...prev, articleId]));
    } else {
      setSelectedArticles((prev) => {
        const newSet = new Set(prev);
        newSet.delete(articleId);
        return newSet;
      });
    }
  };

  const handleApproveSelected = async () => {
    if (selectedArticles.size === 0) {
      toast.error("Please select at least one article to approve");
      return;
    }

    try {
      for (const articleId of selectedArticles) {
        await onArticleApproval(articleId, true);
      }

      setSelectedArticles(new Set());
      toast.success(`Approved ${selectedArticles.size} article(s)!`);
    } catch (error) {
      console.error("Failed to approve articles:", error);
      toast.error("Failed to approve some articles. Please try again.");
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    const dateObj = date instanceof Date ? date : date.toDate();
    const now = new Date();
    const diffTime = Math.abs(now - dateObj);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;

    return dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getSourceName = (url) => {
    try {
      const hostname = new URL(url).hostname;
      return hostname.replace("www.", "");
    } catch {
      return url;
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading articles...</p>
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-6xl mb-4">📰</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No articles found
        </h3>
        <p className="text-gray-600 mb-4">
          No articles have been discovered in the last 7 days.
        </p>
        <p className="text-sm text-gray-500">
          Click "Discover New Content" to find fresh fitness articles.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Articles from Last 7 Days
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {articles.length} articles found • Select the ones you want to
            approve for content creation
          </p>
        </div>

        {selectedArticles.size > 0 && (
          <button
            onClick={handleApproveSelected}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors flex items-center"
          >
            <span className="mr-2">✅</span>
            Approve Selected ({selectedArticles.size})
          </button>
        )}
      </div>

      {/* Articles List */}
      <div className="space-y-3">
        {articles.map((article) => (
          <div
            key={article.id}
            className={`border rounded-lg p-4 transition-colors ${
              article.approved
                ? "bg-green-50 border-green-200"
                : "bg-white border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-start space-x-3">
              {/* Checkbox */}
              <div className="flex-shrink-0 pt-1">
                <input
                  type="checkbox"
                  checked={selectedArticles.has(article.id)}
                  onChange={(e) =>
                    handleCheckboxChange(article.id, e.target.checked)
                  }
                  disabled={article.approved}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
              </div>

              {/* Article Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3
                      className={`text-sm font-medium ${
                        article.approved ? "text-green-800" : "text-gray-900"
                      }`}
                    >
                      {article.title}
                    </h3>

                    <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                      <span>📅 {formatDate(article.discoveredAt)}</span>
                      <span>🔗 {getSourceName(article.source)}</span>
                      {article.approved && (
                        <span className="text-green-600 font-medium">
                          ✅ Approved
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 ml-4">
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Article
                    </a>

                    {!article.approved && (
                      <button
                        onClick={() => onArticleApproval(article.id, true)}
                        className="text-green-600 hover:text-green-800 text-sm font-medium"
                      >
                        Quick Approve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>
            {selectedArticles.size} of {articles.length} articles selected
          </span>
          <span>
            {articles.filter((a) => a.approved).length} articles approved
          </span>
        </div>
      </div>
    </div>
  );
}
