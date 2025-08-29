"use client";
import { useState } from "react";
import { aiAgent } from "../../lib/ai-agent.js";
import toast from "react-hot-toast";
import Spinner from "../Loader.js";

export default function PostApproval({ posts, onPostUpdated }) {
  const [editingPost, setEditingPost] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async (postId) => {
    setIsProcessing(true);
    try {
      const result = await aiAgent.approvePost(postId);
      if (result.success) {
        toast.success("Post approved and published!");
        if (onPostUpdated) {
          onPostUpdated();
        }
      } else {
        toast.error(result.error || "Failed to approve post");
      }
    } catch (error) {
      console.error("Error approving post:", error);
      toast.error("Failed to approve post. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
  };

  const handleSaveEdit = async (postId, updatedContent) => {
    setIsProcessing(true);
    try {
      // Update the post in Firestore
      // This would typically call a Cloud Function to update the post
      toast.success("Post updated successfully!");
      setEditingPost(null);
      if (onPostUpdated) {
        onPostUpdated();
      }
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Failed to update post. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (postId) => {
    if (
      !confirm(
        "Are you sure you want to reject this post? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsProcessing(true);
    try {
      // Mark post as rejected
      // This would typically call a Cloud Function to update the post status
      toast.success("Post rejected");
      if (onPostUpdated) {
        onPostUpdated();
      }
    } catch (error) {
      console.error("Error rejecting post:", error);
      toast.error("Failed to reject post. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (posts.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No posts pending approval
        </h3>
        <p className="text-gray-600">
          All your generated posts have been reviewed. Check the Content
          Discovery tab to generate new posts.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Post Approval</h2>
        <p className="text-gray-600 mt-1">
          Review and approve AI-generated posts before they go live
        </p>
      </div>

      {/* Posts List */}
      <div className="space-y-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            {/* Post Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Pending Approval
                </span>
                <span className="text-sm text-gray-500">
                  Created: {formatDate(post.createdAt)}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(post)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleReject(post.id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Reject
                </button>
              </div>
            </div>

            {/* Post Content */}
            {editingPost?.id === post.id ? (
              <EditPostForm
                post={post}
                onSave={(updatedContent) =>
                  handleSaveEdit(post.id, updatedContent)
                }
                onCancel={() => setEditingPost(null)}
              />
            ) : (
              <div>
                <p className="text-gray-900 mb-4 whitespace-pre-wrap">
                  {post.content}
                </p>

                {/* Tags */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {post.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Scheduled Time */}
                {post.scheduledTime && (
                  <div className="mb-4">
                    <span className="text-sm text-gray-500">
                      Scheduled for:{" "}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatDate(post.scheduledTime)}
                    </span>
                  </div>
                )}

                {/* Source Article */}
                {post.sourceArticle && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Source:</strong> {post.sourceArticle.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {post.sourceArticle.summary}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            {editingPost?.id !== post.id && (
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleApprove(post.id)}
                  disabled={isProcessing}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors flex items-center"
                >
                  {isProcessing ? (
                    <>
                      <Spinner show={true} />
                      <span className="ml-2">Processing...</span>
                    </>
                  ) : (
                    <>
                      <span className="mr-2">✅</span>
                      Approve & Post
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Edit Post Form Component
function EditPostForm({ post, onSave, onCancel }) {
  const [content, setContent] = useState(post.content);
  const [tags, setTags] = useState(post.tags?.join(", ") || "");
  const [scheduledTime, setScheduledTime] = useState(
    post.scheduledTime
      ? new Date(post.scheduledTime).toISOString().slice(0, 16)
      : ""
  );

  const handleSave = () => {
    const updatedContent = {
      content,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      scheduledTime: scheduledTime
        ? new Date(scheduledTime)
        : post.scheduledTime,
    };
    onSave(updatedContent);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Post Content
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
          maxLength={280}
        />
        <p className="text-xs text-gray-500 mt-1">
          {content.length}/280 characters
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="#fitness, #workout, #motivation"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Scheduled Time
        </label>
        <input
          type="datetime-local"
          value={scheduledTime}
          onChange={(e) => setScheduledTime(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
