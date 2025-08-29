"use client";
import { useState, useEffect } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";
import { aiAgent } from "../../lib/ai-agent.js";
import toast from "react-hot-toast";
import Spinner from "../Loader.js";

export default function ContentDiscovery({ onPostGenerated }) {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [customInstructions, setCustomInstructions] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setIsLoading(true);
    try {
      const discoveredContent = await aiAgent.runContentDiscovery();
      setArticles(discoveredContent);
    } catch (error) {
      console.error("Failed to discover content:", error);
      toast.error("Failed to discover content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePost = async (article) => {
    setSelectedArticle(article);
    setIsGenerating(true);

    try {
      const result = await aiAgent.generateAndSchedulePost(
        article,
        customInstructions
      );

      if (result.success) {
        toast.success("Post generated and scheduled for approval!");
        setCustomInstructions("");
        setSelectedArticle(null);

        // Refresh pending posts
        if (onPostGenerated) {
          onPostGenerated();
        }
      } else {
        toast.error(result.error || "Failed to generate post");
      }
    } catch (error) {
      console.error("Error generating post:", error);
      toast.error("Failed to generate post. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefresh = () => {
    loadContent();
  };

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <Spinner show={true} />
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Content Discovery
          </h2>
          <p className="text-gray-600 mt-1">
            Discover trending fitness content and generate engaging social media
            posts
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <span className="mr-2">🔄</span>
          Refresh Content
        </button>
      </div>

      {/* Custom Instructions */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Custom Instructions (Optional)
        </label>
        <textarea
          value={customInstructions}
          onChange={(e) => setCustomInstructions(e.target.value)}
          placeholder="Add specific instructions for post generation (e.g., 'Make it more motivational', 'Focus on beginners')"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
        />
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            {/* Relevance Score */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center">
                <span className="text-sm text-gray-500">Relevance:</span>
                <div className="ml-2 flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${
                        i < Math.round(article.relevance * 5)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-xs text-gray-400">
                {Math.round(article.relevance * 100)}%
              </span>
            </div>

            {/* Article Content */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {article.title}
            </h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {article.summary}
            </p>

            {/* Source */}
            <div className="mb-4">
              <span className="text-xs text-gray-500">Source:</span>
              <a
                href={article.source}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-800 ml-1 truncate block"
              >
                {new URL(article.source).hostname}
              </a>
            </div>

            {/* Action Button */}
            <button
              onClick={() => handleGeneratePost(article)}
              disabled={isGenerating}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center"
            >
              {isGenerating ? (
                <>
                  <Spinner show={true} />
                  <span className="ml-2">Generating...</span>
                </>
              ) : (
                <>
                  <span className="mr-2">✍️</span>
                  Generate Post
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {articles.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No content discovered
          </h3>
          <p className="text-gray-600 mb-4">
            Try refreshing the content or check your content sources.
          </p>
          <button
            onClick={handleRefresh}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Refresh Content
          </button>
        </div>
      )}

      {/* Generation Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Generating Post</h3>
            <p className="text-gray-600 mb-4">
              Generating a post for: <strong>{selectedArticle.title}</strong>
            </p>
            <div className="flex justify-center">
              <Spinner show={true} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
