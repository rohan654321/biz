// components/EventReviews.tsx
"use client";

import { Star } from "lucide-react";

export default function EventReviews() {
  const reviews = [
    {
      title: "ACETECH Delhi",
      location: "New Delhi, India",
      review:
        'Exhibitors directory should have been provided to visitors of the show"',
      name: "Hitesh Verma",
      date: "14 Jul 2025",
      rating: 5,
    },
    {
      title: "ACETECH Delhi",
      location: "New Delhi, India",
      review:
        'Exhibitors directory should have been provided to visitors of the show"',
      name: "Hitesh Verma",
      date: "14 Jul 2025",
      rating: 5,
    },
    {
      title: "ACETECH Delhi",
      location: "New Delhi, India",
      review:
        'Exhibitors directory should have been provided to visitors of the show"',
      name: "Hitesh Verma",
      date: "14 Jul 2025",
      rating: 5,
    },
    {
      title: "ACETECH Delhi",
      location: "New Delhi, India",
      review:
        'Exhibitors directory should have been provided to visitors of the show"',
      name: "Hitesh Verma",
      date: "14 Jul 2025",
      rating: 5,
    },
  ];

  return (
    <section className="py-12 px-6 bg-white">
      {/* Heading */}
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-[#0A2B61]">
          We are the world's largest eventgoer community
        </h2>
        <p className="text-gray-600 mt-2">
          Every minute 570 people are finding new opportunities at events
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg overflow-hidden"
          >
            {/* Top gray section */}
            <div className="bg-gray-300 h-28"></div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-bold">{review.title}</h3>
              <p className="text-sm text-gray-500">{review.location}</p>

              <p className="text-sm mt-3">{review.review}</p>

              {/* Rating */}
              <div className="flex items-center mt-3">
                {[...Array(review.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Reviewer */}
              <div className="flex justify-between items-center mt-3 text-sm text-gray-600">
                <span className="font-medium">{review.name}</span>
                <span>{review.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
