import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";
import { firestore } from "./firebase.js";

// Simplified AI Agent Configuration
const AI_CONFIG = {
  discovery: {
    sources: [
      "https://www.acefitness.org/resources/pros/expert-articles/",
      "https://www.ideafit.com/nutrition/research-news/",
      "https://womenshealth.gov/blog",
    ],
    maxArticles: 20, // Store more articles for 7-day window
  },
};

// Content Discovery Agent
export class ContentDiscoveryAgent {
  constructor() {
    this.sources = AI_CONFIG.discovery.sources;
  }

  async discoverContent() {
    try {
      const articles = [];

      // Fetch from multiple sources
      for (const source of this.sources) {
        const sourceArticles = await this.scrapeSource(source);
        articles.push(...sourceArticles);
      }

      // Filter and store articles
      const filteredArticles = this.filterArticles(articles);

      // Store in Firestore
      await this.storeArticles(filteredArticles);

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
          source: url,
          link: url,
          discoveredAt: new Date(),
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
      .filter((article) => article.relevance > 0.5)
      .sort((a, b) => b.relevance - a.relevance);
  }

  async storeArticles(articles) {
    try {
      for (const article of articles) {
        // Check if article already exists (by title + source)
        const existingQuery = query(
          collection(firestore, "discoveredArticles"),
          where("title", "==", article.title),
          where("source", "==", article.source)
        );

        const existingDocs = await getDocs(existingQuery);

        if (existingDocs.empty) {
          // Store new article
          await addDoc(collection(firestore, "discoveredArticles"), {
            ...article,
            discoveredAt: Timestamp.now(),
            approved: false,
            status: "pending_review",
          });
        }
      }
    } catch (error) {
      console.error("Error storing articles:", error);
      throw new Error("Failed to store articles");
    }
  }

  async getArticlesFromLast7Days() {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const q = query(
        collection(firestore, "discoveredArticles"),
        where("discoveredAt", ">=", Timestamp.fromDate(sevenDaysAgo)),
        orderBy("discoveredAt", "desc")
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching articles:", error);
      throw new Error("Failed to fetch articles");
    }
  }

  async approveArticle(articleId) {
    try {
      // This would update the article status in Firestore
      // For now, just return success
      return { success: true, message: "Article approved" };
    } catch (error) {
      console.error("Error approving article:", error);
      throw new Error("Failed to approve article");
    }
  }
}

// Main AI Agent Coordinator (Simplified)
export class AIAgentCoordinator {
  constructor() {
    this.discoveryAgent = new ContentDiscoveryAgent();
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

  async getArticlesFromLast7Days() {
    try {
      return await this.discoveryAgent.getArticlesFromLast7Days();
    } catch (error) {
      console.error("Failed to fetch articles:", error);
      throw error;
    }
  }

  async approveArticle(articleId) {
    try {
      return await this.discoveryAgent.approveArticle(articleId);
    } catch (error) {
      console.error("Article approval failed:", error);
      throw error;
    }
  }
}

// Export the main coordinator
export const aiAgent = new AIAgentCoordinator();
