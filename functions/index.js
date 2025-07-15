import { onUpdate } from "firebase-functions/v2/firestore";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { logger } from "firebase-functions/logger";

initializeApp();

export const sendCancellationEmails = onUpdate(
  { document: "workouts/{workoutId}" },
  async (event) => {
    const beforeData = event.data.before.data();
    const afterData = event.data.after.data();

    if (beforeData.status !== "cancelled" && afterData.status === "cancelled") {
      const db = getFirestore();
      const participants = await db
        .collection(`workouts/${event.params.workoutId}/participants`)
        .get();

      const batch = db.batch();
      const mailCollection = db.collection("mail");

      participants.forEach((doc) => {
        const user = doc.data();
        batch.set(mailCollection.doc(), {
          to: user.email,
          message: {
            subject: `Cancelled: ${afterData.className}`,
            html: `
              <h2>Class Cancelled</h2>
              <p>${afterData.className} on ${new Date(
              afterData.time
            ).toLocaleString()} has been cancelled.</p>
            `,
          },
        });
      });

      await batch.commit();
      logger.log(
        `Sent cancellation emails to ${participants.size} participants`
      );
    }
    return null;
  }
);
