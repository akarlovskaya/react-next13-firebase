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

      // Email to participant
      const participantEmail = {
        to: participantData.email,
        subject: `You Watching ${event.params.workoutId} Class Changes`,
        html: `
        <p>Hi ${participantData.userName},</p>
        <p>You've successfully subscribed to watch "${event.params.workoutId}" class changes.</p>
        <p>Cheers,</p>
        <p>Vanklas Team</p>
      `,
      };

      // Email to instructor
      // TO DO - make class name Uppercase
      // ADD email signature and avatar
      const instructorEmail = {
        to: instructor.contactEmail,
        subject: `New Participant for "${event.params.workoutId}" Class`,
        html: `
              <p>Hi ${instructor.displayName}!</p>
              <p>${participantData.userName} has subscribed to follow your 
              "${event.params.workoutId}" class changes.</p>
              <p>Cheers,</p>
              <p>Vanklas Team</p>
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
