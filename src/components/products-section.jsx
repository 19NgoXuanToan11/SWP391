export function ProductsSection() {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Beauty Influencer",
      image: "/images/testimonials/sarah.jpg",
      rating: 5,
      comment: "The transformation in my skin is incredible. The personalized skincare routine they provided completely changed my life. My acne cleared up within weeks!",
      before: "/images/testimonials/sarah-before.jpg",
      after: "/images/testimonials/sarah-after.jpg"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Professional Model",
      image: "/images/testimonials/michael.jpg",
      rating: 5,
      comment: "As a model, my skin needs to be perfect. Their products have become an essential part of my daily routine. The results speak for themselves!",
      before: "/images/testimonials/michael-before.jpg",
      after: "/images/testimonials/michael-after.jpg"
    },
    {
      id: 3,
      name: "Emma Williams",
      role: "Skincare Enthusiast",
      image: "/images/testimonials/emma.jpg",
      rating: 5,
      comment: "I've tried countless products, but nothing compares to this. The natural ingredients and scientific approach make all the difference.",
      before: "/images/testimonials/emma-before.jpg",
      after: "/images/testimonials/emma-after.jpg"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-violet-50 via-pink-50 to-violet-50">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Real Results, Real Stories
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          See how our skincare solutions have transformed lives and boosted confidence.
        </p>
      </div>

      {/* Testimonials Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-3xl shadow-xl overflow-hidden transform hover:-translate-y-2 transition-all duration-300"
            >
              {/* Profile Section */}
              <div className="relative h-48 bg-gradient-to-r from-violet-600 to-pink-600 p-6">
                <div className="absolute bottom-0 left-6 transform translate-y-1/2">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg object-cover"
                  />
                </div>
                <div className="absolute top-6 right-6">
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-6 h-6 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="pt-16 p-6">
                <h3 className="text-xl font-bold text-gray-900">{testimonial.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{testimonial.role}</p>
                <p className="text-gray-600 leading-relaxed mb-6">
                  "{testimonial.comment}"
                </p>

                {/* Before/After */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="relative h-40 rounded-xl overflow-hidden">
                      <img
                        src={testimonial.before}
                        alt="Before"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                        Before
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="relative h-40 rounded-xl overflow-hidden">
                      <img
                        src={testimonial.after}
                        alt="After"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                        After
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-violet-600 to-pink-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2">
            Start Your Transformation
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
