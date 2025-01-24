import oilySkin from "../assets/pictures/oily_skin.jpg";
import drySkin from "../assets/pictures/dry_skin.jpg";
import combinationSkin from "../assets/pictures/combination_skin.jpg";
import { Link } from "react-router-dom";

export function SkinTypes() {
  const skinTypes = [
    {
      title: "Oily Skin",
      description:
        "High amount of sebum production, leading to shine and enlarged pores.",
      symptoms: [
        "Shiny appearance",
        "Enlarged pores",
        "Prone to acne",
        "Thick skin texture",
      ],
      recommendations: [
        "Use oil-free products",
        "Try salicylic acid",
        "Regular exfoliation",
      ],
      image: oilySkin,
      color: "rose",
    },
    {
      title: "Dry Skin",
      description:
        "Lacks natural moisture, resulting in tightness and potential flaking.",
      symptoms: [
        "Rough texture",
        "Flaking",
        "Tight feeling",
        "Fine lines visible",
      ],
      recommendations: [
        "Rich moisturizers",
        "Gentle cleansers",
        "Hydrating serums",
      ],
      image: drySkin,
      color: "amber",
    },
    {
      title: "Combination Skin",
      description:
        "Mix of oily and dry areas, typically oily T-zone with dry cheeks.",
      symptoms: [
        "Oily T-zone",
        "Dry cheeks",
        "Variable pore size",
        "Occasional breakouts",
      ],
      recommendations: [
        "Zone-specific care",
        "Balanced products",
        "Gentle toning",
      ],
      image: combinationSkin,
      color: "pink",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 py-16 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Understanding Your <span className="text-pink-500">Skin Type</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover your skin type and get personalized recommendations for the
          perfect skincare routine.
        </p>
      </div>

      {/* Skin Types Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {skinTypes.map((type) => (
          <div
            key={type.title}
            className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
          >
            {/* Image Container */}
            <div className="relative h-64 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
              <img
                src={type.image}
                alt={type.title}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
              />
              <h3 className="absolute bottom-4 left-6 text-2xl font-bold text-white z-20">
                {type.title}
              </h3>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <p className="text-gray-600 leading-relaxed">
                {type.description}
              </p>

              {/* Symptoms */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Common Symptoms
                </h4>
                <ul className="space-y-2">
                  {type.symptoms.map((symptom) => (
                    <li
                      key={symptom}
                      className="flex items-center text-gray-600"
                    >
                      <svg
                        className="w-5 h-5 text-pink-400 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {symptom}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Recommendations
                </h4>
                <ul className="space-y-2">
                  {type.recommendations.map((rec) => (
                    <li key={rec} className="flex items-center text-gray-600">
                      <svg
                        className="w-5 h-5 text-rose-400 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button className="w-full py-3 px-4 bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-xl font-medium hover:from-rose-500 hover:to-pink-600 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2">
                Learn More
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="max-w-3xl mx-auto mt-16 text-center">
        <div className="bg-pink-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Not sure about your skin type?
          </h2>
          <p className="text-gray-600 mb-6">
            Take our comprehensive skin analysis quiz to get a detailed
            assessment and personalized recommendations.
          </p>
          <Link to="/quiz-landing">
            <button className="inline-flex items-center px-6 py-3 bg-pink-500 text-white font-medium rounded-xl hover:bg-pink-600 transition-colors duration-200">
              Take the Quiz
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
