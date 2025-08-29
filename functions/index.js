// Load environment variables
require("dotenv").config();
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const nodemailer = require("nodemailer");
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const axios = require("axios");
const cheerio = require("cheerio");
const OpenAI = require("openai");

// Initialize Firebase
admin.initializeApp();
const db = admin.firestore();

// Email transporter setup
const transporter = nodemailer.createTransport({
  // Real Mailgun configuration
  host: "smtp.mailgun.org",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAILGUN_SMTP_USER,
    pass: process.env.MAILGUN_SMTP_PASS,
  },
});

/**
 * Formats workout names from URL parameters into display-ready text
 * @param {string} workoutId - The workout ID from URL params (e.g., "sunrise-strength-bootcamp")
 * @return {string} Formatted workout name (e.g., "Sunrise Strength Bootcamp")
 */
function formatWorkoutName(workoutId) {
  console.log("formatWorkoutName called with:", workoutId);
  if (!workoutId.includes("-")) {
    // If no hyphen, just capitalize the first letter
    return workoutId.charAt(0).toUpperCase() + workoutId.slice(1);
  }

  let formatted = workoutId
    .split("-")
    .map((word) => {
      // Preserve acronyms (like HIIT)
      if (word === word.toUpperCase() && word.length <= 4) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
  // Handle special cases
  formatted = formatted
    .replace(/\s+&\s+/g, " & ") // Fix ampersand spacing
    .replace(/\s+-\s+/g, " – ") // Replace hyphens between words with en-dashes
    .replace(/\s+\+\s+/g, " + "); // Fix plus sign spacing

  return formatted;
}

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.log("Nodemailer connection error:", error);
  } else {
    console.log("Nodemailer is ready to send messages", success);
  }
});

// Cloud Function to email class subsription to notifications
exports.sendFollowNotification = onDocumentCreated(
  "users/{userId}/workouts/{workoutId}/participants/{participantId}",
  async (event) => {
    console.log("🔥 FUNCTION ENTERED - STARTING EXECUTION");
    console.log("PRODUCTION MODE - SENDING REAL EMAIL");
    console.log("🔥 FUNCTION TRIGGERED AT PATH:", event.params);
    const snapshot = event.data;
    console.log("Function triggered!");
    console.log("Document data:", snapshot);
    console.log("😍 Event params:", event.params);

    if (!snapshot) {
      console.log("No data associated with the event");
      return;
    }

    const participantData = snapshot.data();
    console.log("PARTICIPANT data", participantData);

    // Only process newly created participants with 'pending' status
    if (participantData.status !== "pending") {
      console.log("Participant already processed or not pending");
      return;
    }

    try {
      // Get instructor details
      const instructorRef = db.doc(`users/${event.params.userId}`);
      const instructorSnap = await instructorRef.get();
      if (!instructorSnap.exists) {
        console.log("Instructor not found");
        return;
      }
      const instructor = instructorSnap.data();
      console.log("INSTRUCTOR data", instructor);
      const formattedWorkoutName = formatWorkoutName(event.params.workoutId);

      // Email to participant
      const participantEmail = {
        to: participantData.email,
        subject: `You're now watching updates for ${formattedWorkoutName} class`,
        html: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <title>Class Subscription Confirmation</title>
          </head>
          <body style="font-family: Arial, sans-serif; color: #333333 !important; 
            background-color: #f9f9f9; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; 
            border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);">
              <h2 style="color: #002379;">You're now watching "${formattedWorkoutName}" class updates!</h2>
    
              <p>Hi ${participantData.userName},</p>
    
              <p>Thanks for subscribing! <br />
              You're now set to receive updates about changes 
              to the <strong>"${formattedWorkoutName}"</strong> class.</p>
    
              <p>We'll keep you updated with schedule changes or any important announcements from the instructor.</p>
    
              <p>If you have any questions, feel free to reach out anytime.</p>
    
              <p style="margin-top: 25px;">
                Best regards,<br />
                <strong>The Vanklas Team</strong>
              </p>
            </div>
            <div style="text-align: center; margin-top: 20px;">
              <a href="https://vanklas.info" style="margin: 0 5px;">Vanklas</a>
              <a href="https://www.linkedin.com/company/106700596/admin/dashboard/" style="margin: 0 5px;">
              LinkedIn</a>
            </div>
          </body>
        </html>
      `,
      };

      // Email to instructor
      const instructorEmail = {
        to: instructor.contactEmail,
        subject: `A new participant has started to follow your ${formattedWorkoutName} class`,
        html: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <title>New Class Follower Notification</title>
          </head>
          <body style="font-family: Arial, sans-serif; color: #333333 !important; 
          background-color: #f9f9f9; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; 
            border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);">
              <h2 style="color: #002379;">New Follower for Your "${formattedWorkoutName}" Class! 👋</h2>
    
              <p>Hi ${instructor.displayName},</p>
    
              <p>We're excited to let you know that <strong>${participantData.userName}</strong> 
              has subscribed to follow updates for your <strong>"${formattedWorkoutName}"</strong> class.</p>
    
              <p>This means they'll be notified about class changes when you send them a notification using 
              Notify Class Bell button.</p>
    
              <p style="margin-top: 25px;">Keep up the great work!<br />
                <strong>The Vanklas Team</strong>
              </p>
              
            </div>
            <div style="text-align: center; margin-top: 20px;">
              <a href="https://vanklas.info" style="margin: 0 5px;">Vanklas</a>
              <a href="https://www.linkedin.com/company/106700596/admin/dashboard/" style="margin: 0 5px;">
              LinkedIn</a>
              <p style="font-size: 12px; color: #999999; margin-top: 30px; border-top: 1px solid #eeeeee; 
              padding-top: 15px;">
                You're receiving this notification because you're the instructor of this class.
              </p>
            </div>
          </body>
        </html>
      `,
      };

      console.log("INSTRUCTOR instructorEmail", instructorEmail);
      console.log("participantEmail", participantEmail);

      // Send both emails
      await transporter.sendMail({
        from: `"Vanklas" <hello@${process.env.MAILGUN_DOMAIN}>`,
        ...participantEmail,
      });

      await transporter.sendMail({
        from: `"Vanklas" <hello@${process.env.MAILGUN_DOMAIN}`,
        ...instructorEmail,
      });
    } catch (error) {
      console.error("Error sending follow notification emails:", error);
      throw error;
    }
  }
);

// Cloud Function to send class updates from instructor to participants
exports.sendClassNotification = onDocumentCreated(
  "users/{userId}/workouts/{workoutId}/notifications/{notificationId}",
  async (event) => {
    console.log("🔥 ENTERED sendClassNotification - STARTING EXECUTION");
    const snapshot = event.data;
    const { userId, workoutId } = event.params;
    const notification = snapshot.data();
    console.log("Notification event:", event);
    console.log("Notification event.params:", event.params);
    console.log("Notification event.data:", event.data);
    console.log("Notification data:", notification);

    try {
      // 1. Get class details
      const workoutDoc = await admin
        .firestore()
        .collection("users")
        .doc(userId)
        .collection("workouts")
        .doc(workoutId)
        .get();

      if (!workoutDoc.exists) {
        console.log("Workout exists?", workoutDoc.exists);
        throw new Error("Class not found");
      }

      // 2. Fetch participants
      const participantsSnapshot = await admin
        .firestore()
        .collection("users")
        .doc(userId)
        .collection("workouts")
        .doc(workoutId)
        .collection("participants")
        .get();

      console.log(`Found ${participantsSnapshot.size} participants`);

      if (participantsSnapshot.empty) {
        throw new Error("No participants found");
      }

      // 3. Send emails
      const emails = participantsSnapshot.docs
        .map((doc) => doc.data().email)
        .filter((email) => email && email.includes("@")); // Remove empty emails
      const className = formatWorkoutName(workoutId) || "your class";
      const instructorName = notification.instructorName || "the instructor";
      const instructorUserName = notification.instructorUserName || "";
      const instructorEmail =
        notification.instructorEmail || `hello@${process.env.MAILGUN_DOMAIN}`;
      const unsubscribeUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${instructorUserName}/${workoutId}`;

      console.log("Recipient emails:", emails);
      // 4. Send email via Nodemailer
      // to participants
      await transporter.sendMail({
        from: `"Vanklas Class Notification" <hello@${process.env.MAILGUN_DOMAIN}>`,
        to: emails.join(", "),
        // to: `hello@${process.env.MAILGUN_DOMAIN}`,
        // bcc: emails,
        subject: notification.subject,
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Class Update: ${className}</title>
          </head>
          <body style="font-family: Arial, sans-serif; color: #333333 !important; background-color: #f9f9f9; 
          padding: 20px; margin: 0;">
            <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; 
            border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);">
              <h1 style="color: #002379; margin-top: 0;">${
                notification.subject
              }</h1>
              
              <div style="font-size: 16px; line-height: 1.6;">
                ${notification.message.replace(/\n/g, "<br>")}
              </div>
              <hr style="border: none; height: 1px; background-color: #e0e0e0; margin: 25px 0;" />

              <div style="font-size: 14px; color: #666666;">
                <p>
                  You're receiving this email because you're subscribed to 
                  <strong>${instructorName}</strong>'s 
                  "<strong>${className}</strong>" class notifications.
                </p>
                
                <p>
                  Questions? <a href="mailto:${instructorEmail}" 
                  style="color: #0066cc;">Contact</a> the instructor directly.
                </p>
      
                <p style="margin-top: 25px;">
                  Best regards,<br />
                  <strong>The Vanklas Team</strong>
                </p>
              </div>
              <div style="text-align: center; margin-top: 20px;">
                <a href="https://vanklas.info" style="margin: 0 5px;">Vanklas</a>
                <a href="https://www.linkedin.com/company/106700596/admin/dashboard/" style="margin: 0 5px;">
                LinkedIn</a>
                <p>
                  <small style="font-size: 12px; color: #999999;">
                    If you no longer wish to receive the class updates,
                    <a href="${unsubscribeUrl}">unfollow</a> the class.
                  </small>
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
        // Plain text fallback
        text: `${notification.message}\n\n---\nYou're receiving this email because you're subscribed to 
        ${instructorName}'s "${className}" class notifications.\nQuestions? Contact the instructor at 
        ${instructorEmail}.\n\nBest regards,\nThe Vanklas Team`,
      });

      // to instructor
      await transporter.sendMail({
        from: `"Vanklas Class Notification" <hello@${process.env.MAILGUN_DOMAIN}>`,
        to: instructorEmail, // Instructor gets a copy
        // to: `hello@${process.env.MAILGUN_DOMAIN}`,
        // bcc: emails,
        subject: notification.subject,
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Class Update: ${className}</title>
          </head>
          <body style="font-family: Arial, sans-serif; color: #333333 !important; background-color: #f9f9f9; 
          padding: 20px; margin: 0;">
            <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; 
            border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);">
            <p>
              <small style="font-size: 12px; color: #999999;">
                This is a copy of the notification sent to your class followers.
              </small>
            </p>
              <h1 style="color: #002379; margin-top: 0;">${
                notification.subject
              }</h1>
              
              <div style="font-size: 16px; line-height: 1.6;">
                ${notification.message.replace(/\n/g, "<br>")}
              </div>
              <hr style="border: none; height: 1px; background-color: #e0e0e0; margin: 25px 0;" />

              <div style="font-size: 14px; color: #666666;">
                <p>
                  You're receiving this email because you're subscribed to 
                  <strong>${instructorName}</strong>'s 
                  "<strong>${className}</strong>" class notifications.
                </p>
                
                <p>
                  Questions? <a href="mailto:${instructorEmail}" 
                  style="color: #0066cc;">Contact</a> the instructor directly.
                </p>
      
                <p style="margin-top: 25px;">
                  Best regards,<br />
                  <strong>The Vanklas Team</strong>
                </p>
              </div>
              <div style="text-align: center; margin-top: 20px;">
                <a href="https://vanklas.info" style="margin: 0 5px;">Vanklas</a>
                <a href="https://www.linkedin.com/company/106700596/admin/dashboard/" style="margin: 0 5px;">
                LinkedIn</a>
              </div>
            </div>
          </body>
          </html>
        `,
        // Plain text fallback
        text: `${notification.message}\n\n---\nYou're receiving this email because you're subscribed to 
        ${instructorName}'s "${className}" class notifications.\nQuestions? Contact the instructor at 
        ${instructorEmail}.\n\nBest regards,\nThe Vanklas Team`,
      });

      // 4. Update notification status
      await snapshot.ref.update({
        status: "sent",
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
        recipientCount: emails.length,
      });
    } catch (error) {
      console.error("❌ FULL ERROR:", error);
      await snapshot.ref.update({
        status: "failed",
        error: error.message,
      });
      console.error("Failed to send notification:", error);
    }
  }
);

/** To Do - when need to implement Global Unsubscribe (Footer Link, "stop all emails" legal requirement)
 * with Mailgun's Suppression Lists, have to switch from smtp to API key and use Mailgun Unsubscribe webhook.
 */

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: functions.config().openai.api_key,
});

// Content Discovery Function
exports.discoverContent = functions.https.onCall(async (data, context) => {
  try {
    // Check if user is authenticated
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated"
      );
    }

    const sources = [
      "https://www.acefitness.org/news/",
      "https://www.ideafit.com/news/",
      "https://www.fitness.org/news/",
      "https://www.nsca.com/news/",
    ];

    const articles = [];

    for (const source of sources) {
      try {
        const response = await axios.get(source, {
          timeout: 10000,
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; FitnessBot/1.0)",
          },
        });

        const $ = cheerio.load(response.data);
        const sourceArticles = scrapeArticles($, source);
        articles.push(...sourceArticles);
      } catch (error) {
        console.error(`Error scraping ${source}:`, error.message);
      }
    }

    // Filter and rank articles
    const filteredArticles = filterArticles(articles);

    return {
      success: true,
      articles: filteredArticles.slice(0, 10),
    };
  } catch (error) {
    console.error("Content discovery error:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to discover content"
    );
  }
});

// Content Generation Function
exports.generatePost = functions.https.onCall(async (data, context) => {
  try {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated"
      );
    }

    const { article, customInstructions } = data;

    if (!article || !article.title) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Article data is required"
      );
    }

    const prompt = buildPrompt(article, customInstructions);

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a fitness content creator who writes engaging social media posts. Keep posts under 280 characters, include relevant hashtags, and make them motivational.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const generatedContent = completion.choices[0].message.content;

    // Parse the response
    let parsedContent;
    try {
      parsedContent = JSON.parse(generatedContent);
    } catch (e) {
      // Fallback if JSON parsing fails
      parsedContent = {
        content: generatedContent,
        tags: extractTags(generatedContent),
        imageDescription: `Create a motivational fitness image related to: ${article.title}`,
      };
    }

    return {
      success: true,
      postData: {
        content: parsedContent.content,
        tags: parsedContent.tags || extractTags(parsedContent.content),
        scheduledTime: suggestScheduleTime(),
        imagePrompt:
          parsedContent.imageDescription ||
          `Create a motivational fitness image related to: ${article.title}`,
        sourceArticle: article,
      },
    };
  } catch (error) {
    console.error("Content generation error:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to generate post content"
    );
  }
});

// Image Generation Function
exports.generateImage = functions.https.onCall(async (data, context) => {
  try {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated"
      );
    }

    const { prompt } = data;

    if (!prompt) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Image prompt is required"
      );
    }

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      size: "1024x1024",
      quality: "standard",
      n: 1,
    });

    const imageUrl = response.data[0].url;

    // Download and store image in Firebase Storage
    const imageResponse = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });
    const bucket = admin.storage().bucket();
    const fileName = `ai-generated-images/${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}.png`;

    await bucket.file(fileName).save(imageResponse.data, {
      metadata: {
        contentType: "image/png",
      },
    });

    // Make the file publicly accessible
    await bucket.file(fileName).makePublic();

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    return {
      success: true,
      imageUrl: publicUrl,
      fileName: fileName,
    };
  } catch (error) {
    console.error("Image generation error:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to generate image"
    );
  }
});

// Social Media Posting Function
exports.postToSocialMedia = functions.https.onCall(async (data, context) => {
  try {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated"
      );
    }

    const { postId, platforms } = data;

    if (!postId) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Post ID is required"
      );
    }

    // Get post data from Firestore
    const postDoc = await admin
      .firestore()
      .collection("scheduledPosts")
      .doc(postId)
      .get();

    if (!postDoc.exists) {
      throw new functions.https.HttpsError("not-found", "Post not found");
    }

    const postData = postDoc.data();

    // Here you would integrate with actual social media APIs
    // For now, we'll simulate successful posting

    // Update post status
    await admin
      .firestore()
      .collection("scheduledPosts")
      .doc(postId)
      .update({
        status: "posted",
        postedAt: admin.firestore.FieldValue.serverTimestamp(),
        postedTo: platforms || ["twitter"],
      });

    return {
      success: true,
      message: "Post published successfully",
      postId: postId,
    };
  } catch (error) {
    console.error("Social media posting error:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to post to social media"
    );
  }
});

// Helper Functions
function scrapeArticles($, source) {
  const articles = [];

  // Generic article scraping - adjust selectors based on each source
  $("article, .post, .news-item, .entry").each((i, element) => {
    const title = $(element)
      .find("h1, h2, h3, .title, .headline")
      .first()
      .text()
      .trim();
    const summary = $(element)
      .find(".summary, .excerpt, .description, p")
      .first()
      .text()
      .trim();
    const link = $(element).find("a").first().attr("href");

    if (title && summary) {
      articles.push({
        title,
        summary: summary.substring(0, 200) + "...",
        source,
        link: link ? new URL(link, source).href : source,
        publishedAt: new Date(),
        relevance: calculateRelevance(title, summary),
      });
    }
  });

  return articles;
}

function calculateRelevance(title, summary) {
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
  ];

  const text = (title + " " + summary).toLowerCase();
  let score = 0;

  fitnessKeywords.forEach((keyword) => {
    if (text.includes(keyword)) {
      score += 0.1;
    }
  });

  return Math.min(score, 1.0);
}

function filterArticles(articles) {
  return articles
    .filter((article) => article.relevance > 0.3)
    .sort((a, b) => b.relevance - a.relevance);
}

function buildPrompt(article, customInstructions) {
  return `
    Create an engaging social media post about: ${article.title}
    
    Article summary: ${article.summary}
    
    Requirements:
    - Keep it under 280 characters for Twitter
    - Include relevant fitness hashtags
    - Make it engaging and motivational
    - Include a call-to-action
    
    Custom instructions: ${
      customInstructions || "Make it inspiring and actionable"
    }
    
    Format the response as JSON with:
    {
      "content": "post text",
      "tags": ["tag1", "tag2"],
      "imageDescription": "description for AI image generation"
    }
  `;
}

function extractTags(content) {
  const hashtags = content.match(/#\w+/g) || [];
  const defaultTags = [
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
  ];

  const allTags = [...new Set([...hashtags, ...defaultTags])];
  return allTags.slice(0, 5);
}

function suggestScheduleTime() {
  const now = new Date();
  const morning = new Date(now);
  morning.setHours(7, 0, 0, 0);

  const lunch = new Date(now);
  lunch.setHours(12, 0, 0, 0);

  const evening = new Date(now);
  evening.setHours(18, 0, 0, 0);

  if (now < morning) return morning;
  if (now < lunch) return lunch;
  if (now < evening) return evening;

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(7, 0, 0, 0);
  return tomorrow;
}

// Scheduled function to run content discovery daily
exports.dailyContentDiscovery = functions.pubsub
  .schedule("every 24 hours")
  .onRun(async (context) => {
    try {
      // This would trigger the content discovery process
      // and notify users of new content opportunities

      console.log("Daily content discovery completed");
      return null;
    } catch (error) {
      console.error("Daily content discovery failed:", error);
      return null;
    }
  });
