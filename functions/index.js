// Load environment variables
require("dotenv").config();
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const nodemailer = require("nodemailer");

// Initialize Firebase
const admin = require("firebase-admin");
admin.initializeApp();

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
    console.log("Event params:", event.params);

    if (!snapshot) {
      console.log("No data associated with the event");
      return;
    }

    // const db = getFirestore();
    const participantData = snapshot.data();

    // Only process newly created participants with 'pending' status
    if (participantData.status !== "pending") {
      console.log("Participant already processed or not pending");
      return;
    }

    await transporter
      .sendMail({
        from: '"Test" <hello@vanklas.info>',
        to: participantData.email,
        subject: "You Watch Class Changes",
        html: `<p>Hi ${participantData.userName}, you've subscribed to watch the class changes!</p>`,
      })
      .then(console.log)
      .catch(console.error);
  }
);
