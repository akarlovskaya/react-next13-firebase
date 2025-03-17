import React from "react";
import Link from "next/link";

const AboutUsPage = () => {
  return (
    <section className="max-w-4xl mx-auto p-6 text-gray-800">
      <h1 className="text-3xl font-bold text-center mb-6">About Us</h1>
      <p className="mb-6">
        At <span className="font-semibold">Vanklas</span>, we believe finding
        local fitness activities should be easy and accessible. Whether
        you&#39;re searching for a personal trainer in Vancouver, a group
        fitness class in Coquitlam, Zumba in Richmond, or a running or cycling
        social club in Langley, we connect you with passionate local instructors
        who bring movement to life.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Our Story</h2>
      <p className="mb-6">
        Founded by a certified group fitness instructor with a background in
        both fitness and technology,{" "}
        <span className="font-semibold">Vanklas</span> was created to bridge the
        gap between fitness professionals and participants. We understand both
        the importance and challenge of promoting fitness classes and finding
        workouts that fit different schedules, locations, and styles.
      </p>
      <p className="mb-6">
        That&#39;s why we built this platform to make it easier for fitness
        lovers across the Metro Vancouver region to discover local classes and
        for independent instructors to grow their community without the hassle
        of endless social media promotion.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Who We&#39;re For</h2>
      <ul className="list-disc pl-6 mb-6">
        <li className="mb-2">
          <span className="font-semibold">Participants</span> &mdash; Whether
          you're a beginner or a fitness enthusiast, you can explore group
          fitness classes in Port Coquitlam, find a dance workout in North
          Vancouver, or join a boot camp in Burnaby &mdash; all while connecting
          with the right instructor for your style.
        </li>
        <li>
          <span className="font-semibold">Instructors</span> &mdash; We empower
          independent fitness professionals to showcase their expertise, grow
          their following, and connect with new clients effortlessly in their
          local communities.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-4">
        Why We&#39;re Different
      </h2>
      <p className="mb-6">
        We&#39;re a <strong>community-driven</strong> platform built to support
        both instructors and participants. We know that when people join a
        fitness class, they&#39;re not just looking for a workout—they&#39;re
        looking for the right instructor. Energy, teaching style, and
        personality matter just as much as professionalism and expertise.
      </p>
      <p className="mb-6">
        That&#39;s why <span className="font-semibold">Vanklas</span> puts
        instructors first. Instead of searching by gym or studio, participants
        can easily find all the classes an instructor teaches &mdash; whether
        they&#39;re in a gym, community center, or private studio . No more
        scattered schedules or missed opportunities &mdash;if someone loves an
        instructor&#39;s class, they can follow them and discover every session
        they offer nearby.
      </p>
      <p className="mb-6">
        For <strong>fitness professionals</strong>, this platform is more than
        just a class listing—it&#39;s a way to promote themselves as fitness
        professionals. Whether you teach in multiple locations across Metro
        Vancouver or run independent sessions,{" "}
        <span className="font-semibold">Vanklas</span> helps you connect with
        the right participants and build a loyal following.
      </p>
      <p className="font-semibold text-lg text-center">
        Because at the end of the day,{" "}
        <strong className="text-navy">fitness is personal</strong> &mdash; and
        the right instructor makes all the difference.
      </p>

      <div className="text-center mt-8 mb-10">
        <p className="mb-10">Join the community!</p>
        <Link
          href="/sign-up"
          className="w-60 bg-orange-dark text-white px-7 py-3 font-medium rounded shadow-md focus:outline-none focus:shadow-outline hover:bg-orange-light"
        >
          Sign Up
        </Link>
      </div>
    </section>
  );
};

export default AboutUsPage;
