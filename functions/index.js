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
          <body style="font-family: Arial, sans-serif; color: #333333; background-color: #f9f9f9; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; 
            border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);">
              <h2 style="color: #002379;">You're now watching "${formattedWorkoutName}" class updates!</h2>
    
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
    
              <p>This means they'll be notified about class changes when you send them a notification using 
              Notify Class Bell button.</p>
    
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
      const instructorEmail =
        notification.instructorEmail || `hello@${process.env.MAILGUN_DOMAIN}`;

      console.log("Recipient emails:", emails);

      // 4. Send email via Nodemailer
      await transporter.sendMail({
        from: `"Vanklas Class Notification" <hello@${process.env.MAILGUN_DOMAIN}>`,
        to: emails.join(", "),
        cc: instructorEmail, // Instructor gets a copy
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
          <body style="font-family: Arial, sans-serif; color: #333333; background-color: #f9f9f9; 
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
                  style="color: #0066cc;">Contact the instructor directly</a>.
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

// exports.unsubscribeEmail = async () => {
//   console.log("🔥 ENTERED unsubscribeEmail - STARTING EXECUTION");
// };
