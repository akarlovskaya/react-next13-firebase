const nodemailer = require("nodemailer");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");

// Initialize SMTP transporter
const transporter = nodemailer.createTransport({
  host: "smtp.mailgun.org", // Mailgun SMTP server
  port: 587, // TLS port
  secure: false, // True for port 465 (SSL)
  auth: {
    user: process.env.MAILGUN_SMTP_USER, // From .env (e.g., postmaster@sandboxXXX.mailgun.org)
    pass: process.env.MAILGUN_SMTP_PASS, // Your SMTP password
  },
});

exports.sendemail = onDocumentCreated("emails/{docId}", async (event) => {
  const emailDocRef = event.data.ref; // Reference to the document that triggered the function
  const emailDocId = event.params.docId; // Get the document ID

  try {
    const { to, subject, html } = event.data.data();

    if (!to) throw new Error('Missing "to" address');
    if (!html) throw new Error("Missing email content");

    const info = await transporter.sendMail({
      from: '"Vanklas" <hello@vanklas.com>',
      to,
      subject: subject || "Vanklas Notification",
      html: html || "<p>Hello</p>",
    });

    console.log("Message sent: %s", info.messageId);

    // Write delivery status back to Firestore
    await emailDocRef.update({
      status: "delivered",
      messageId: info.messageId,
      deliveredAt: admin.firestore.FieldValue.serverTimestamp(),
      error: null, // Clear any previous error
    });
  } catch (error) {
    console.error("Full error:", error);

    // Write error status to Firestore
    await emailDocRef.update({
      status: "failed",
      error: {
        message: error.message,
        stack: error.stack || null,
        code: error.code || null,
      },
      failedAt: new Date().toISOString(), // Stores as a string
    });

    throw new functions.https.HttpsError("internal", error.message);
  }
});
