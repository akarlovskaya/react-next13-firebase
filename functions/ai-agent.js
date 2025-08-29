const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
const cheerio = require("cheerio");

// Initialize Firebase Admin (reuse existing instance)
if (!admin.apps.length) {
  admin.initializeApp();
}

// AI Agent Configuration
const AI_CONFIG = {
  discovery: {
    sources: [
      "https://www.acefitness.org/resources/pros/expert-articles/",
      "https://www.ideafit.com/nutrition/research-news/",
      "https://womenshealth.gov/blog"
    ],
    maxArticles: 20,
    userAgent: "Mozilla/5.0 (compatible; FitnessBot/1.0)",
    timeout: 10000
  },
  scraping: {
    selectors: {
      article: "article, .post, .news-item, .entry, .blog-post, .article",
      title: "h1, h2, h3, .title, .headline, .post-title",
      link: "a"
    },
    relevanceThreshold: 0.3
  },
  storage: {
    collection: "discoveredArticles",
    duplicateCheck: true
  },
  access: {
    authorizedUserId: process.env.AI_AGENT_ACCESS_USER_ID
  }
};

// Access control helper function
/**
 * Checks if the authenticated user has access to AI Agent functions
 * @param {Object} context - Firebase function context
 * @throws {functions.https.HttpsError} If user is not authenticated or authorized
 */
function checkUserAccess(context) {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated"
    );
  }

  if (context.auth.uid !== AI_CONFIG.access.authorizedUserId) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Access denied. Only authorized users can use AI Agent functions."
    );
  }
}

// Content Discovery Function
exports.discoverContent = functions.https.onCall(async (data, context) => {
  try {
    // Check user access
    checkUserAccess(context);

    console.log(
      "Starting content discovery for sources:",
      AI_CONFIG.discovery.sources
    );

    const articles = [];

    for (const source of AI_CONFIG.discovery.sources) {
      try {
        console.log(`Scraping source: ${source}`);
        const response = await axios.get(source, {
          timeout: AI_CONFIG.discovery.timeout,
          headers: {
            "User-Agent": AI_CONFIG.discovery.userAgent
          }
        });

        const $ = cheerio.load(response.data);
        const sourceArticles = scrapeArticles($, source);
        articles.push(...sourceArticles);

        console.log(`Found ${sourceArticles.length} articles from ${source}`);
      } catch (error) {
        console.error(`Error scraping ${source}:`, error.message);
        // Continue with other sources even if one fails
      }
    }

    // Filter and rank articles
    const filteredArticles = filterArticles(articles);
    console.log(`Total articles after filtering: ${filteredArticles.length}`);

    // Store articles in Firestore
    const storedCount = await storeArticles(filteredArticles);
    console.log(`Stored ${storedCount} new articles`);

    return {
      success: true,
      articles: filteredArticles.slice(0, AI_CONFIG.discovery.maxArticles),
      message: `Discovered ${filteredArticles.length} articles, stored ${storedCount} new ones`,
      stats: {
        totalDiscovered: articles.length,
        totalFiltered: filteredArticles.length,
        totalStored: storedCount,
        sourcesProcessed: AI_CONFIG.discovery.sources.length
      }
    };
  } catch (error) {
    console.error("Content discovery error:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to discover content: " + error.message
    );
  }
});

// Get Articles from Last 7 Days
exports.getArticlesFromLast7Days = functions.https.onCall(
  async (data, context) => {
    try {
      // Check user access
      checkUserAccess(context);

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const q = admin
        .firestore()
        .collection(AI_CONFIG.storage.collection)
        .where(
          "discoveredAt",
          ">=",
          admin.firestore.Timestamp.fromDate(sevenDaysAgo)
        )
        .orderBy("discoveredAt", "desc");

      const snapshot = await q.get();
      const articles = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log(`Retrieved ${articles.length} articles from last 7 days`);

      return {
        success: true,
        articles,
        count: articles.length
      };
    } catch (error) {
      console.error("Error fetching articles:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Failed to fetch articles: " + error.message
      );
    }
  }
);

// Approve Article
exports.approveArticle = functions.https.onCall(async (data, context) => {
  try {
    // Check user access
    checkUserAccess(context);

    const {articleId} = data;

    if (!articleId) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Article ID is required"
      );
    }

    // Update article status in Firestore
    await admin
      .firestore()
      .collection(AI_CONFIG.storage.collection)
      .doc(articleId)
      .update({
        approved: true,
        approvedAt: admin.firestore.FieldValue.serverTimestamp(),
        approvedBy: context.auth.uid,
        status: "approved"
      });

    console.log(`Article ${articleId} approved by user ${context.auth.uid}`);

    return {
      success: true,
      message: "Article approved successfully",
      articleId,
      approvedAt: new Date()
    };
  } catch (error) {
    console.error("Error approving article:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to approve article: " + error.message
    );
  }
});

// Helper Functions
/**
 * Scrapes articles from a parsed HTML document
 * @param {Object} $ - Cheerio object for HTML parsing
 * @param {string} source - Source URL for the articles
 * @return {Array} Array of scraped articles
 */
function scrapeArticles($, source) {
  const articles = [];

  $(AI_CONFIG.scraping.selectors.article).each((i, element) => {
    const title = $(element)
      .find(AI_CONFIG.scraping.selectors.title)
      .first()
      .text()
      .trim();

    const link = $(element)
      .find(AI_CONFIG.scraping.selectors.link)
      .first()
      .attr("href");

    if (title && link) {
      const fullLink = link.startsWith("http") ?
        link :
        new URL(link, source).href;

      articles.push({
        title,
        source,
        link: fullLink,
        discoveredAt: new Date(),
        relevance: calculateRelevance(title),
        scrapedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
  });

  return articles;
}

/**
 * Calculates relevance score for an article title
 * @param {string} title - Article title to analyze
 * @return {number} Relevance score between 0 and 1
 */
function calculateRelevance(title) {
  const fitnessKeywords = [
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
    "gym",
    "cardio",
    "strength",
    "yoga",
    "pilates",
    "diet",
    "weight loss",
    "muscle",
    "endurance",
    "flexibility"
  ];

  const text = title.toLowerCase();
  let score = 0;

  fitnessKeywords.forEach((keyword) => {
    if (text.includes(keyword)) {
      score += 0.1;
    }
  });

  return Math.min(score, 1.0);
}

/**
 * Filters and sorts articles by relevance
 * @param {Array} articles - Array of articles to filter
 * @return {Array} Filtered and sorted articles
 */
function filterArticles(articles) {
  return articles
    .filter(
      (article) => article.relevance > AI_CONFIG.scraping.relevanceThreshold
    )
    .sort((a, b) => b.relevance - a.relevance);
}

/**
 * Stores articles in Firestore with duplicate checking
 * @param {Array} articles - Array of articles to store
 * @return {number} Count of newly stored articles
 */
async function storeArticles(articles) {
  let storedCount = 0;

  try {
    for (const article of articles) {
      if (AI_CONFIG.storage.duplicateCheck) {
        // Check if article already exists (by title + source)
        const existingQuery = admin
          .firestore()
          .collection(AI_CONFIG.storage.collection)
          .where("title", "==", article.title)
          .where("source", "==", article.source);

        const existingDocs = await existingQuery.get();

        if (existingDocs.empty) {
          // Store new article
          await admin
            .firestore()
            .collection(AI_CONFIG.storage.collection)
            .add({
              ...article,
              discoveredAt: admin.firestore.FieldValue.serverTimestamp(),
              approved: false,
              status: "pending_review",
              createdAt: admin.firestore.FieldValue.serverTimestamp()
            });
          storedCount++;
        }
      } else {
        // Store all articles without duplicate check
        await admin
          .firestore()
          .collection(AI_CONFIG.storage.collection)
          .add({
            ...article,
            discoveredAt: admin.firestore.FieldValue.serverTimestamp(),
            approved: false,
            status: "pending_review",
            createdAt: admin.firestore.FieldValue.serverTimestamp()
          });
        storedCount++;
      }
    }
  } catch (error) {
    console.error("Error storing articles:", error);
    throw new Error("Failed to store articles: " + error.message);
  }

  return storedCount;
}

// Scheduled function to run content discovery daily
exports.dailyContentDiscovery = functions.pubsub
  .schedule("every 24 hours")
  .timeZone("America/Vancouver")
  .onRun(async (context) => {
    try {
      console.log("Starting scheduled daily content discovery");

      // This would trigger the content discovery process
      // You can call the discoverContent function here or implement
      // a separate scheduled version

      console.log("Daily content discovery completed successfully");
      return null;
    } catch (error) {
      console.error("Daily content discovery failed:", error);
      return null;
    }
  });

// Health check function for AI Agent
exports.aiAgentHealth = functions.https.onCall(async (data, context) => {
  try {
    // Check user access
    checkUserAccess(context);
    return {
      success: true,
      status: "healthy",
      timestamp: new Date().toISOString(),
      config: {
        sources: AI_CONFIG.discovery.sources.length,
        maxArticles: AI_CONFIG.discovery.maxArticles,
        relevanceThreshold: AI_CONFIG.scraping.relevanceThreshold
      },
      version: "1.0.0"
    };
  } catch (error) {
    console.error("Health check failed:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Health check failed: " + error.message
    );
  }
});
