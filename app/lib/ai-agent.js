import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { firestore } from "./firebase.js";

// AI Agent Configuration
const AI_CONFIG = {
  // OpenAI Configuration
  openai: {
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    model: "gpt-4",
    maxTokens: 500,
  },

  // Content Discovery Configuration
  discovery: {
    sources: [
      "https://www.acefitness.org/news/",
      "https://www.ideafit.com/news/",
      "https://www.fitness.org/news/",
      "https://www.nsca.com/news/",
    ],
    keywords: [
      "fitness",
      "workout",
      "exercise",
      "health",
      "wellness",
      "sports",
      "training",
      "nutrition",
      "motivation",
      "fitness trends",
    ],
    maxArticles: 10,
  },

  // Social Media Configuration
  socialMedia: {
    platforms: ["twitter", "linkedin", "instagram"],
    defaultTags: [
      "#fitness",
      "#workout",
      "#health",
      "#wellness",
      "#motivation",
      "#fitnessgoals",
      "#healthy",
      "#exercise",
      "#training",
      "#lifestyle",
    ],
    maxTags: 5,
  },
};

// Content Discovery Agent
export class ContentDiscoveryAgent {
  constructor() {
    this.sources = AI_CONFIG.discovery.sources;
    this.keywords = AI_CONFIG.discovery.keywords;
  }

  async discoverContent() {
    try {
      const articles = [];

      // Fetch from multiple sources
      for (const source of this.sources) {
        const sourceArticles = await this.scrapeSource(source);
        articles.push(...sourceArticles);
      }

      // Filter and rank articles
      const filteredArticles = this.filterArticles(articles);

      return filteredArticles.slice(0, AI_CONFIG.discovery.maxArticles);
    } catch (error) {
      console.error("Content discovery error:", error);
      throw new Error("Failed to discover content");
    }
  }

  async scrapeSource(url) {
    try {
      // This would be implemented in a Cloud Function for server-side scraping
      // For now, we'll return mock data
      return [
        {
          title: "New Fitness Trends for 2024",
          summary:
            "Discover the latest workout routines and fitness innovations",
          source: url,
          publishedAt: new Date(),
          relevance: 0.9,
        },
      ];
    } catch (error) {
      console.error(`Error scraping ${url}:`, error);
      return [];
    }
  }

  filterArticles(articles) {
    return articles
      .filter((article) => article.relevance > 0.7)
      .sort((a, b) => b.relevance - a.relevance);
  }
}

// Content Generation Agent
export class ContentGenerationAgent {
  constructor() {
    this.openaiApiKey = AI_CONFIG.openai.apiKey;
  }

  async generatePost(article, customInstructions = "") {
    try {
      if (!this.openaiApiKey) {
        throw new Error("OpenAI API key not configured");
      }

      const prompt = this.buildPrompt(article, customInstructions);

      // This would call OpenAI API in a Cloud Function
      // For now, return generated content
      const generatedContent = await this.callOpenAI(prompt);

      return {
        content: generatedContent,
        tags: this.extractTags(generatedContent),
        scheduledTime: this.suggestScheduleTime(),
        imagePrompt: this.generateImagePrompt(article),
      };
    } catch (error) {
      console.error("Content generation error:", error);
      throw new Error("Failed to generate post content");
    }
  }

  buildPrompt(article, customInstructions) {
    return `
      Create an engaging social media post about: ${article.title}
      
      Article summary: ${article.summary}
      
      Requirements:
      - Keep it under 280 characters for Twitter
      - Include relevant fitness hashtags
      - Make it engaging and motivational
      - Include a call-to-action
      
      Custom instructions: ${customInstructions}
      
      Format the response as JSON with:
      {
        "content": "post text",
        "tags": ["tag1", "tag2"],
        "imageDescription": "description for AI image generation"
      }
    `;
  }

  async callOpenAI(prompt) {
    // This would be implemented in a Cloud Function
    // For now, return mock generated content
    return {
      content:
        "🔥 New fitness trends are here! Ready to transform your workout routine? 💪 Check out the latest innovations that will take your fitness game to the next level! #FitnessTrends2024 #WorkoutMotivation #FitnessGoals",
      tags: [
        "#FitnessTrends2024",
        "#WorkoutMotivation",
        "#FitnessGoals",
        "#Health",
        "#Wellness",
      ],
      imageDescription:
        "A modern gym with cutting-edge fitness equipment, vibrant lighting, and motivated people working out",
    };
  }

  extractTags(content) {
    const hashtags = content.match(/#\w+/g) || [];
    const defaultTags = AI_CONFIG.socialMedia.defaultTags;

    // Combine hashtags from content with relevant default tags
    const allTags = [...new Set([...hashtags, ...defaultTags])];
    return allTags.slice(0, AI_CONFIG.socialMedia.maxTags);
  }

  suggestScheduleTime() {
    // Suggest optimal posting times (morning, lunch, evening)
    const now = new Date();
    const morning = new Date(now);
    morning.setHours(7, 0, 0, 0);

    const lunch = new Date(now);
    lunch.setHours(12, 0, 0, 0);

    const evening = new Date(now);
    evening.setHours(18, 0, 0, 0);

    // Return the next optimal time
    if (now < morning) return morning;
    if (now < lunch) return lunch;
    if (now < evening) return evening;

    // If past all times today, schedule for tomorrow morning
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(7, 0, 0, 0);
    return tomorrow;
  }

  generateImagePrompt(article) {
    return `Create a motivational fitness image related to: ${article.title}. Style: modern, vibrant, inspiring. Include fitness equipment, energetic colors, and motivational elements.`;
  }
}

// Social Media Agent
export class SocialMediaAgent {
  constructor() {
    this.platforms = AI_CONFIG.socialMedia.platforms;
  }

  async schedulePost(postData, platforms = ["twitter"]) {
    try {
      // Save to Firestore for approval workflow
      const postRef = await addDoc(collection(firestore, "scheduledPosts"), {
        ...postData,
        platforms,
        status: "pending_approval",
        createdAt: new Date(),
        approvedAt: null,
        postedAt: null,
      });

      return {
        success: true,
        postId: postRef.id,
        message: "Post scheduled for approval",
      };
    } catch (error) {
      console.error("Error scheduling post:", error);
      throw new Error("Failed to schedule post");
    }
  }

  async approvePost(postId) {
    try {
      const postRef = doc(firestore, "scheduledPosts", postId);
      await updateDoc(postRef, {
        status: "approved",
        approvedAt: new Date(),
      });

      // Trigger posting process
      await this.postToSocialMedia(postId);

      return { success: true, message: "Post approved and posted" };
    } catch (error) {
      console.error("Error approving post:", error);
      throw new Error("Failed to approve post");
    }
  }

  async postToSocialMedia(postId) {
    try {
      // This would integrate with actual social media APIs
      // For now, just update the status
      const postRef = doc(firestore, "scheduledPosts", postId);
      await updateDoc(postRef, {
        status: "posted",
        postedAt: new Date(),
      });

      return { success: true, message: "Post published successfully" };
    } catch (error) {
      console.error("Error posting to social media:", error);
      throw new Error("Failed to post to social media");
    }
  }

  async getPendingPosts() {
    try {
      const q = query(
        collection(firestore, "scheduledPosts"),
        where("status", "==", "pending_approval"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching pending posts:", error);
      throw new Error("Failed to fetch pending posts");
    }
  }
}

// Main AI Agent Coordinator
export class AIAgentCoordinator {
  constructor() {
    this.discoveryAgent = new ContentDiscoveryAgent();
    this.generationAgent = new ContentGenerationAgent();
    this.socialMediaAgent = new SocialMediaAgent();
  }

  async runContentDiscovery() {
    try {
      const articles = await this.discoveryAgent.discoverContent();
      return articles;
    } catch (error) {
      console.error("Content discovery failed:", error);
      throw error;
    }
  }

  async generateAndSchedulePost(article, customInstructions = "") {
    try {
      // Generate post content
      const postData = await this.generationAgent.generatePost(
        article,
        customInstructions
      );

      // Schedule for approval
      const result = await this.socialMediaAgent.schedulePost(postData);

      return result;
    } catch (error) {
      console.error("Post generation and scheduling failed:", error);
      throw error;
    }
  }

  async approvePost(postId) {
    try {
      return await this.socialMediaAgent.approvePost(postId);
    } catch (error) {
      console.error("Post approval failed:", error);
      throw error;
    }
  }

  async getPendingPosts() {
    try {
      return await this.socialMediaAgent.getPendingPosts();
    } catch (error) {
      console.error("Failed to fetch pending posts:", error);
      throw error;
    }
  }
}

// Export the main coordinator
export const aiAgent = new AIAgentCoordinator();
