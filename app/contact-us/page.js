import React from "react";
import Link from "next/link";

const ContactUsPage = () => {
  const supportEmail = "support@vanklas.com";
  const salesEmail = "sales@vanklas.com";
  const helloEmail = "hello@vanklas.com";

  return (
    <main className="max-w-4xl mx-auto p-6 text-gray-800 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8 text-navy">
        Contact Us
      </h1>
      <p className="text-lg mb-8">
        We'd love to hear from you! <br />
        Whether you have a question, feedback, or just want to say hello, feel
        free to reach out.
      </p>

      <div className="space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            Support Email
          </h2>
          <a
            href={`mailto:${supportEmail}?Subject=${encodeURIComponent(
              "Support Inquiry"
            )}`}
            className="text-navy hover:underline"
          >
            {supportEmail}
          </a>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            Collaboration Enquiries
          </h2>
          <a
            href={`mailto:${salesEmail}?Subject=${encodeURIComponent(
              "Sales Inquiry"
            )}`}
            className="text-navy hover:underline"
          >
            {salesEmail}
          </a>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            All Other Enquiries
          </h2>
          <a
            href={`mailto:${helloEmail}?Subject=${encodeURIComponent(
              "General Inquiry"
            )}`}
            className="text-navy hover:underline"
          >
            {helloEmail}
          </a>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md mt-8">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <span className="mr-2">✍️</span> Send Us a Message
        </h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Your Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Your Email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Subject</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Subject"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md"
              rows="4"
              placeholder="Your Message"
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-navy text-white px-7 py-3 font-medium rounded shadow-md focus:outline-none focus:shadow-outline hover:bg-gray-900"
          >
            Send Message
          </button>
        </form>
      </div>
    </main>
    // <main className="max-w-4xl mx-auto p-6 text-gray-800 min-h-screen">
    //   <h1 className="text-3xl font-bold text-center mb-6 text-navy">
    //     Contact Us
    //   </h1>
    //   <h2 className="text-2xl font-semibold mt-6 mb-4">Support email</h2>
    //   <a
    //     href={`mailto:${supportEmail}?Subject=${encodeURIComponent(
    //       "Support Inquiry"
    //     )}`}
    //     className="text-navy"
    //   >
    //     {supportEmail}
    //   </a>

    //   <h2 className="text-2xl font-semibold mt-6 mb-4">Sales enquiries</h2>
    //   <a
    //     href={`mailto:${supportEmail}?Subject=${encodeURIComponent(
    //       "Support Inquiry"
    //     )}`}
    //     className="text-navy"
    //   >
    //     {salesEmail}
    //   </a>
    //   <h2 className="text-2xl font-semibold mt-6 mb-4">All other enquiries</h2>
    //   <a
    //     href={`mailto:${supportEmail}?Subject=${encodeURIComponent(
    //       "Support Inquiry"
    //     )}`}
    //     className="text-navy"
    //   >
    //     {helloEmail}
    //   </a>
    // </main>
  );
};

export default ContactUsPage;
