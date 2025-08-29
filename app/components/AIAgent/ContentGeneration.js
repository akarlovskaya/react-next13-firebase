"use client";
import { useState } from "react";
import { aiAgent } from "../../lib/ai-agent.js";
import toast from "react-hot-toast";
import Spinner from "../Loader.js";

export default function ContentGeneration({ onPostGenerated }) {
  const [topic, setTopic] = useState("");
  const [customInstructions, setCustomInstructions] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPost, setGeneratedPost] = useState(null);
  const [isScheduling, setIsScheduling] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!topic.trim()) {
      toast.error("Please enter a topic for your post");
      return;
    }

    setIsGenerating(true);
    try {
      // Create a mock article object for the topic
      const mockArticle = {
        title: topic,
        summary: `Content about ${topic}`,
        source: "Manual Input",
        publishedAt: new Date(),
        relevance: 0.9,
      };

      const result = await aiAgent.generateAndSchedulePost(
        mockArticle,
        customInstructions
      );

      if (result.success) {
        setGeneratedPost({
          content:
            result.postData?.content || "Generated content will appear here",
          tags: result.postData?.tags || [],
          scheduledTime: result.postData?.scheduledTime || new Date(),
          imagePrompt: result.postData?.imagePrompt || "",
        });
        toast.success("Post generated successfully!");
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

  const handleSchedule = async () => {
    if (!generatedPost) return;

    setIsScheduling(true);
    try {
      // Schedule the generated post
      const result = await aiAgent.socialMediaAgent.schedulePost(generatedPost);

      if (result.success) {
        toast.success("Post scheduled for approval!");
        setGeneratedPost(null);
        setTopic("");
        setCustomInstructions("");

        // Refresh pending posts
        if (onPostGenerated) {
          onPostGenerated();
        }
      } else {
        toast.error(result.error || "Failed to schedule post");
      }
    } catch (error) {
      console.error("Error scheduling post:", error);
      toast.error("Failed to schedule post. Please try again.");
    } finally {
      setIsScheduling(false);
    }
  };

  const handleRegenerate = async () => {
    if (!topic.trim()) return;

    setIsGenerating(true);
    try {
      const mockArticle = {
        title: topic,
        summary: `Content about ${topic}`,
        source: "Manual Input",
        publishedAt: new Date(),
        relevance: 0.9,
      };

      const result = await aiAgent.generateAndSchedulePost(
        mockArticle,
        customInstructions
      );

      if (result.success) {
        setGeneratedPost({
          content:
            result.postData?.content || "Generated content will appear here",
          tags: result.postData?.tags || [],
          scheduledTime: result.postData?.scheduledTime || new Date(),
          imagePrompt: result.postData?.imagePrompt || "",
        });
        toast.success("Post regenerated successfully!");
      } else {
        toast.error(result.error || "Failed to regenerate post");
      }
    } catch (error) {
      console.error("Error regenerating post:", error);
      toast.error("Failed to regenerate post. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEdit = (field, value) => {
    setGeneratedPost((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Manual Post Generation
        </h2>
        <p className="text-gray-600 mt-1">
          Create custom fitness posts with AI assistance
        </p>
      </div>

      {/* Generation Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <form onSubmit={handleGenerate}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Post Topic *
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Morning workout routine, Healthy meal prep, Fitness motivation"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Instructions
              </label>
              <textarea
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="e.g., Make it motivational, Focus on beginners, Include workout tips"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={isGenerating || !topic.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md transition-colors flex items-center"
            >
              {isGenerating ? (
                <>
                  <Spinner show={true} />
                  <span className="ml-2">Generating...</span>
                </>
              ) : (
                <>
                  <span className="mr-2">✨</span>
                  Generate Post
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Generated Post Preview */}
      {generatedPost && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Generated Post Preview
            </h3>
            <button
              onClick={handleRegenerate}
              disabled={isGenerating}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {isGenerating ? "Regenerating..." : "🔄 Regenerate"}
            </button>
          </div>

          {/* Post Content */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Post Content
            </label>
            <textarea
              value={generatedPost.content}
              onChange={(e) => handleEdit("content", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              maxLength={280}
            />
            <p className="text-xs text-gray-500 mt-1">
              {generatedPost.content.length}/280 characters
            </p>
          </div>

          {/* Tags */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <input
              type="text"
              value={generatedPost.tags.join(", ")}
              onChange={(e) =>
                handleEdit(
                  "tags",
                  e.target.value
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter((tag) => tag)
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="#fitness, #workout, #motivation"
            />
          </div>

          {/* Scheduled Time */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Scheduled Time
            </label>
            <input
              type="datetime-local"
              value={
                generatedPost.scheduledTime
                  ? new Date(generatedPost.scheduledTime)
                      .toISOString()
                      .slice(0, 16)
                  : ""
              }
              onChange={(e) =>
                handleEdit("scheduledTime", new Date(e.target.value))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Image Prompt */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AI Image Prompt
            </label>
            <textarea
              value={generatedPost.imagePrompt}
              onChange={(e) => handleEdit("imagePrompt", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="2"
              placeholder="Description for AI image generation"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => setGeneratedPost(null)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSchedule}
              disabled={isScheduling}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors flex items-center"
            >
              {isScheduling ? (
                <>
                  <Spinner show={true} />
                  <span className="ml-2">Scheduling...</span>
                </>
              ) : (
                <>
                  <span className="mr-2">📅</span>
                  Schedule for Approval
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-2">
          💡 Tips for Better Posts
        </h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>
            • Be specific about your topic (e.g., "HIIT workout for beginners"
            vs "workout")
          </li>
          <li>• Use custom instructions to guide the AI's tone and focus</li>
          <li>• Review and edit generated content before scheduling</li>
          <li>
            • Schedule posts during optimal engagement times (morning, lunch,
            evening)
          </li>
        </ul>
      </div>
    </div>
  );
}
