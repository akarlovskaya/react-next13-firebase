// Load environment variables
require("dotenv").config();
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const nodemailer = require("nodemailer");
const admin = require("firebase-admin");

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

// Cloud Function
exports.sendFollowNotification = onDocumentCreated(
  "users/{userId}/workouts/{workoutId}/participants/{participantId}",
  async (event) => {
    console.log("🔥 FUNCTION ENTERED - STARTING EXECUTION");
    console.log("PRODUCTION MODE - SENDING REAL EMAIL");
    console.log("🔥 FUNCTION TRIGGERED AT PATH:", event.params);
    const snapshot = event.data;
    console.log("Function triggered!");
    console.log("Document data:", snapshot);
    console.log("😍 Evvent params:", event.params);

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
          <body style="font-family: Arial, sans-serif; color: #333333; background-color: #f9f9f9; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; 
            border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);">
              <h2 style="color: #002379;">You're now watching "${formattedWorkoutName}" updates!</h2>
    
              <p>Hi ${participantData.userName},</p>
    
              <p>Thanks for subscribing! You're now set to receive updates about changes 
              to the <strong>"${formattedWorkoutName}"</strong> class.</p>
    
              <p>We'll keep you in the loop with schedule changes, updates, or any important announcements.</p>
    
              <p>If you have any questions, feel free to reach out anytime.</p>
    
              <p style="margin-top: 30px;">Best regards,<br />The Vanklas Team</p>
            </div>
          </body>
        </html>
      `,
      };

      // Email to instructor
      // ADD email signature and avatar
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
          <body style="font-family: Arial, sans-serif; color: #333333; background-color: #f9f9f9; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; 
            border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);">
              <h2 style="color: #002379;">New Follower for Your "${formattedWorkoutName}" Class! 👋</h2>
    
              <p>Hi ${instructor.displayName},</p>
    
              <p>We're excited to let you know that <strong>${participantData.userName}</strong> 
              has subscribed to follow updates for your <strong>"${formattedWorkoutName}"</strong> class.</p>
    
              <p>This means they'll be notified about any changes you make to the class schedule or details.</p>
    
              <p style="margin-top: 30px;">Keep up the great work!<br />The Vanklas Team</p>
              
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
        from: '"Vanklas" <hello@vanklas.com>',
        ...participantEmail,
      });

      await transporter.sendMail({
        from: '"Vanklas" <hello@vanklas.com>',
        ...instructorEmail,
      });
    } catch (error) {
      console.error("Error sending follow notification emails:", error);
      throw error;
    }
  }
);
