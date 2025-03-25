import React from "react";
import Link from "next/link";

function PrivacyPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto p-6 bg-white">
      <h1 className="text-4xl font-bold text-center mt-8 mb-8 text-navy">
        Data and Privacy Policy
      </h1>

      <p className="mb-4">
        This data and privacy policy sets out how personal information on
        Vanklas is collected and retained.
      </p>
      <p className="mb-4">
        Vanklas is currently in beta (testing) phase. By using this application,
        you acknowledge that there may be bugs, errors, or security
        vulnerabilities present. You agree to use this application at your own
        risk. While we take reasonable measures to protect your data, we cannot
        guarantee complete security or performance.
      </p>
      <p className="mb-4">
        While Vanklas is intended for use in Canada, user data is stored and
        processed in the United States. By using Vanklas, you consent to the
        transfer and storage of your data in the United States, where it will be
        processed in accordance with applicable laws.
      </p>
      <p className="mb-4">
        Vanklas is not available to users located in the European Union (EU). We
        do not knowingly collect or process personal data from individuals in
        the EU. If you are accessing this app from an EU country, please
        discontinue use immediately.
      </p>
      <p className="mb-4">
        Vanklas aims to help fitness and wellness instructors (Businesses) gain
        greater visibility and sell their services to their clients (Consumers).
      </p>
      <p className="mb-4">
        To achieve this, Vanklas gathers and stores information from both
        Businesses and Consumers. In some cases, Vanklas acts as the sole data
        controller for this information, meaning it determines how the data is
        used. In other cases, Vanklas shares responsibility as a joint data
        controller with the Business that a Consumer interacts with, meaning
        both parties decide how the data is processed.
      </p>
      <p className="mb-4">
        Vanklas also collects data for maintenance and service improvement and
        to provide customer support.
      </p>

      <section className="space-y-8 mt-8">
        <h2 className="text-2xl font-bold">
          Information Consumers provide to Vanklas
        </h2>
        <p className="mb-4">
          Vanklas acts as the data controller for your registration details,
          general information, technical data. This includes the data you
          provide when creating a Vanklas account, as well as any interactions
          you have directly with Vanklas features. For this type of information,
          Vanklas is responsible for managing and controlling the collected
          data.
        </p>

        <section>
          <h3 className="text-lg font-bold">Registration information</h3>
          <p>At registration we collect the following information:</p>
          <ul>
            <li>Your name</li>
            <li>Your email address </li>
            <li>Account username</li>
          </ul>
          <p>How collected: entered by the user at registration.</p>
          <p>
            Reason for collection: contract / consent / legitimate interest.
          </p>
          <p>
            This information is required for us to create your account, enable
            you to use Vanklas services, help you connect with
            Businesses/Customers, and allow us to offer customer support. We may
            also ask users about their location (city) to show classes that are
            relevant to them. We may need to reach out to users via email with
            important service announcements or account-related updates.
            Additionally, we may contact Business users more frequently with
            service updates, feedback requests, support assistance, and other
            relevant communications.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-bold">Generic information</h3>
          <p>This information can be added by a user:</p>
          <ul>
            <li>Email address</li>
            <li>Photo</li>
            <li>Title and certifications (for Instructors)</li>
            <li>About You section</li>
            <li>Contact Phone</li>
            <li>Social Accounts</li>
          </ul>
          <p>How collected: provided by users in-app</p>
          <p>Reason for collection: consent.</p>
          <p>
            This information is collected in order to share information about
            experience and qualification (for Instructors), help Consumers and
            Businesses to communicate. Photo, Contact Phone and Social Accounts
            information are optional and can be removed at any time.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-bold">Technical data</h3>
          <p>
            We rely on third-party services to support the functionality of our
            app and improve your experience. These services help us with tasks
            such as user authentication, data storage, database management, and
            app deployment. Below is a summary of how we use these services:
          </p>
          <h4>Authentication and Data Storage</h4>
          <p>
            We use a third-party service for user authentication and to securely
            store data such as photos, documents, and other files. Data
            processed includes account information (e.g., email, name) and
            user-uploaded content. This data is stored in secure servers located
            in specific regions and is protected by industry-standard security
            measures, including encryption.
          </p>
          <h4>App Deployment and Hosting</h4>
          <p>
            We use a third-party service to deploy and host our app. This
            service may collect technical data such as IP addresses, browser
            type, and usage logs to ensure the app functions properly.
          </p>
          <p>How collected: automatically from a user of Vanklas.</p>
          <p>Reason for collection: legitimate interest / contract.</p>
          <p>
            We take the security of your data seriously. All data is protected
            using industry-standard security measures, including encryption in
            transit (via HTTPS) and at rest. We rely on third-party services
            that comply with rigorous security standards and certifications to
            ensure your data is handled securely.
          </p>
        </section>
      </section>

      <section className="space-y-8 mt-8">
        <h2 className="text-2xl font-bold">
          Information Consumers provide to Businesses they interact with on
          Vanklas
        </h2>
        <p>
          This section applies to personal information that is provided to
          Businesses by Consumers on Vanklas. Businesses may have their own
          privacy policies which Consumers should be aware of. Vanklas and any
          Business you interact with on Vanklas are the joint data controllers
          for the data collected interactions between a Consumer and a Business
          on Vanklas. This information is only collected in relation to
          Businesses that you interact with on Vanklas and so that those
          Business can provide their services to Consumers. While a Business has
          an account on Vanklas, that Business is in ultimate control of the
          personal information listed in this section. If information exists
          after a Business has terminated its Vanklas account, the information
          is retained for Consumers&#39; own records (e.g. what they have paid
          for and booked etc.) and Vanklas will assume control of it on behalf
          of the Consumer. Vanklas may use personal information generated in
          this section in order to provide customer support, maintenance,
          security and for operational purposes.
        </p>

        <section>
          <h3 className="text-lg font-bold">Participation Information</h3>
          <p>
            How collected: this information is submitted by the consumer in-app
            and can be entered directly by the Business.
          </p>
          <p>
            Reason for collection: consent / contract / legitimate interest /
            legal obligation.
          </p>
          <p>
            The Business may require you to complete participation information
            in order to responsibility operating a fitness and wellness business
            and supply services to Consumers. This might be to comply with laws,
            regulations and in order to comply with important responsibilities
            such as their professional insurance policies and professional
            licenses. This includes contact details, emergency contact details,
            records of which waivers and participation questionnaires you have
            completed. Businesses collect this information in order to provide
            their services safely and responsibly in accordance with laws and
            regulations, and in order to comply with their responsibilities to
            operate safely and to meet external requirements such as maintaining
            insurance policies and professional licenses. Vanklas processes this
            information on the Business&#39;s behalf but does not use this
            information in any way.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-bold">Email Messages</h3>
          <p>
            Logged-in users (Customers) can contact instructors (Businesses)
            directly via email. This feature uses an email link (mailto:) to
            open the user&#39;s default email client, enabling them to send a
            message to the instructor&#39;s email address. The content of the
            email messages sent through this feature is not stored, processed,
            or accessible within Vanklas. Once the email client is opened, all
            communication occurs directly between the Customer and the Business
            via their email services. Since the messages are sent outside of our
            platform, we do not have control over or responsibility for the
            content, security, or retention of these emails.
          </p>
        </section>
      </section>

      <section className="space-y-8 mt-8">
        <h2 className="text-2xl font-bold">
          Responsibility of Businesses on Vanklas
        </h2>
        <p>
          Businesses must collect and retain Consumer personal information only
          as outlined in this agreement and in compliance with all applicable
          data protection and privacy laws. The permissions granted by Consumers
          for Businesses to collect and retain their information are strictly
          limited to purposes necessary for the responsible operation of a
          fitness or wellness business, enabling Consumers to use the
          Business&#39;s services effectively. Businesses should not retain
          Consumer information longer than necessary and must not share it
          outside their organization without obtaining prior consent. If
          Businesses wish to collect Consumer data for purposes not covered in
          this agreement, they must obtain separate opt-in consent from the
          Consumer and provide an opt-out option, independent of Vanklas.
          Businesses may only share Consumer data collected through Vanklas with
          the explicit consent of the Consumer or as required by applicable
          laws.
        </p>
      </section>

      <section className="space-y-8 mt-8">
        <h2 className="text-2xl font-bold">
          Sharing information with third parties
        </h2>
        <p>
          Vanklas shares personal information with third-party services only
          when necessary to enable your use of the platform. We do not disclose
          personally identifiable information to third parties except in the
          following circumstances: To support the functionality of our app and
          enhance your experience. Below is a list of the third-party services
          we use, the types of data they process, and their purposes.
        </p>
        <h3>Firebase by Google</h3>
        <p>
          Purpose: We use Firebase for user authentication (via Google
          Authentication), data storage (for photos and other documents), and
          database management.
        </p>
        <h4>Data Processed:</h4>
        <p>
          Authentication: Email, name, and profile information (if provided via
          Google Authentication). Storage: Photos, documents, and other files
          uploaded by users. Database: User-generated content, app usage data,
          and other relevant information. Data Location: Data stored in Firebase
          is hosted in the us-central1 region. Security: Firebase employs
          industry-standard security measures, including encryption, to protect
          your data.
        </p>
        <p>
          Firebase Privacy Policy: For more information about how Firebase
          handles data, please review{" "}
          <Link
            href="https://firebase.google.com/support/privacy"
            className="text-navy"
          >
            Firebase&#39;s Privacy Policy
          </Link>
          .
        </p>
        <h3>Vercel</h3>
        <p>
          Purpose: We use Vercel for app deployment and hosting. Data Processed:
          Vercel may collect technical data such as IP addresses, browser type,
          and usage logs to ensure the app functions properly.
        </p>
        <p>
          Vercel Privacy Policy: For more information about how Vercel handles
          data, please review{" "}
          <Link
            href="http://vercel.com/legal/privacy-policy"
            className="text-navy"
          >
            Vercel&#39;s Privacy Policy
          </Link>
        </p>
      </section>

      <section className="space-y-8 mt-8">
        <h2 className="text-2xl font-bold">Change of Control</h2>
        <p className="mb-4">
          If there is a change in ownership of Vanklas, some or all personal
          information may be transferred to the new owner or controlling entity.
        </p>
      </section>

      <section className="space-y-8 mt-8">
        <h2 className="text-2xl font-bold">
          Cancellation and revoking consent
        </h2>
        <p className="mb-4">
          If you wish to cancel your account and withdraw your consent for
          Vanklas to process your data, you can do so by contacting us at
          support@vanklas.com. Upon account cancellation, Vanklas will
          permanently terminate your account and delete your registration and
          generic information from our systems.
        </p>
        <p>
          A Consumer&#39;s booking, attendance, transaction history,
          participation details, and message records with any Business they have
          interacted with will be retained in accordance with the Business&#39;s
          policies. If a Consumer wishes to have their booking, attendance,
          transaction history, participation information, or message records
          removed, they must submit this request directly to the relevant
          Business. The Business will determine whether and when they can comply
          with such a request. Please note that Businesses may need to retain
          some or all of this information for a period of time for legitimate
          reasons, as outlined in their policies.
        </p>
      </section>
      <section className="space-y-8 mt-8">
        <h2 className="text-2xl font-bold">Retention</h2>
        <p className="mb-4">
          Vanklas uses industry standard backup procedures and will retain
          backups of our database for up to 30 days.
        </p>
      </section>
      <section className="space-y-8 mt-8">
        <h2 className="text-2xl font-bold">Children</h2>
        <p className="mb-4">
          Vanklas is not intended for use by people aged under 16.
        </p>
      </section>
      <section className="space-y-8 mt-8">
        <h2 className="text-2xl font-bold">
          Information provided by Businesses
        </h2>
        <p className="mb-4">
          Content published by Businesses, such as class details, schedules,
          locations, fees, profile information, and payment options, is made
          publicly available on Vanklas consumer applications. Businesses have
          the ability to edit or remove this content through the Vanklas
          platform. However, please note that some of this information may
          remain stored locally on Consumer devices even after it has been
          updated or deleted from the platform.
        </p>
      </section>

      <section className="space-y-8 mt-8">
        <h2 className="text-2xl font-bold">Cookies & similar technologies</h2>
        <p className="mb-4 bg-gray-300">In progress</p>
      </section>

      <section className="space-y-8 mt-8">
        <h2 className="text-2xl font-bold">Changes to this policy</h2>
        <p className="mb-4">
          We may update this policy periodically. We encourage you to review
          this policy regularly to stay informed about any changes. If we make
          significant changes to how we handle personal data, we will notify you
          via email. By continuing to use Vanklas, you acknowledge and accept
          the terms of this policy.
        </p>
      </section>
      <section className="space-y-8 mt-8">
        <h2 className="text-2xl font-bold">
          Location, governing law and jurisdiction
        </h2>
        <p className="mb-4 ">
          Location of Data Processing: While Vanklas is intended for use in
          Canada, user data is stored and processed in the United States. By
          using Vanklas, you consent to the transfer and storage of your data in
          the United States, where it will be processed in accordance with
          applicable laws. Governing Law and jurisdiction: This Privacy Policy
          is governed by and construed in accordance with the laws of Canada,
          BC. Any disputes arising from this Privacy Policy or your use of
          Vanklas will be subject to the exclusive jurisdiction of the courts
          located in Metro Vancouver, BC, Canada.
        </p>
      </section>
      <section className="space-y-8 mt-8">
        <h2 className="text-2xl font-bold">Contact</h2>
        <p className="mb-4">
          If you need any further information or want to request an account
          cancellation please contact us at support@vanklas.com.
        </p>
      </section>
      <section className="space-y-8 mt-8">
        <p>Updated March 19th, 2025</p>
      </section>
    </main>
  );
}

export default PrivacyPolicyPage;
