import React from "react";
import Link from "next/link";

function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mt-8 mb-8 text-navy">
        Frequently Asked Questions (FAQ)
      </h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          1. Can I book or reserve a spot for a class?
        </h2>
        <p className="text-gray-700">
          If you are a signed-in user (with an existing account), you will have
          access to the Instructor's contact information. You can reach out to
          them directly to inquire whether a reservation for a class is needed
          or there is a Drop-in option.
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          2. How to pay for a class?
        </h2>
        <p className="text-gray-700">
          You pay directly to the Instructor before or after a class, not
          Vanklas. All payments are securely processed through the instructor’s
          preferred payment system. You can view the available payment options
          on the class description page. For any payment-related questions or
          issues, please contact the Instructor directly.
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          3. What is your refund and cancellation policy?
        </h2>
        <p className="text-gray-700">
          Each Instructor sets their own cancellation and refund policies, so we
          recommend to ask their terms before completing the payment. If you’re
          unsure about their policies, feel free to reach out to the provider
          directly for clarification.
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          4. What kind of content is not allowed on Vanklas?
        </h2>
        <p className="text-gray-700">
          Vanklas prohibits content that violates our{" "}
          <strong>Code of Conduct</strong> or <strong>Terms of Use</strong>,
          including but not limited to:
        </p>
        <ul className="list-disc list-inside text-gray-700 mt-2">
          <li>Violence, threats, or harassment.</li>
          <li>
            Hate speech or attacks based on race, ethnicity, religion, gender,
            sexual orientation, disability, or medical condition.
          </li>
          <li>Graphic or violent content shared for sadistic purposes.</li>
          <li>Pornographic or explicitly sexual content.</li>
          <li>Sharing personal information without consent.</li>
          <li>
            Promotion of regulated goods (e.g., firearms, alcohol, tobacco)
            without compliance with applicable laws.
          </li>
        </ul>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          5. What if I see someone promoting harmful behavior?
        </h2>
        <p className="text-gray-700">
          Your safety and enjoyment of Vanklas are our top priorities. If you
          encounter content that you believe violates our Code of Conduct or
          Terms of Use, please report it to us. All reports are handled
          anonymously, meaning the user you report will not be notified that you
          reported them. To report a user, you must specify which part of our
          Terms of Use or Code of Conduct they have violated. Please review the
          list and the relevant sections in our{" "}
          <Link href="/terms-of-service" className="text-navy">
            Terms of Service
          </Link>
          .
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          6. How do I delete my account?
        </h2>
        <p className="text-gray-700">
          To delete your account, simply click the{" "}
          <Link href="/delete-account" className="text-navy">
            Delete Account
          </Link>{" "}
          link. Please note that any instructors you’ve interacted with may
          retain records of your payments, attendance history, and contact
          details for their insurance and tax purposes. If you’d like to review
          or request removal of this information, you’ll need to contact the
          instructor directly. If you encounter any issues during this process,
          please email us at support@vanklas.com from your registered email
          address, and we’ll be happy to assist.
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          7. What if I have questions about Vanklas’s policies?
        </h2>
        <p className="text-gray-700">
          Please review our{" "}
          <Link href="/privacy-policy" className="text-navy">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/terms-of-service" className="text-navy">
            Terms of Service
          </Link>{" "}
          for detailed information. If you still have questions, feel free to
          contact our support team for assistance.
        </p>
      </div>
    </main>
  );
}
export default TermsPage;
