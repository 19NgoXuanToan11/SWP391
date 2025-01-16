const skinTypes = [
  {
    title: "Oily skin",
    description:
      "High amount of sebum, skin exhibits continuing oiliness throughout the day and appears shiny or greasy.",
    image: "https://via.placeholder.com/400x300?text=OilySkin",
  },
  {
    title: "Acne skin",
    description:
      "Acne is a common skin condition characterized by whiteheads, blackheads, and inflammation of the skin.",
    image: "https://via.placeholder.com/400x300?text=AcneSkin",
  },
  {
    title: "Dry skin",
    description:
      "To keep the skin healthy and hydrated, use a gentle cleanser and apply a healthy water lock in spread cream.",
    image: "https://via.placeholder.com/400x300?text=DrySkin",
  },
];

export function SkinTypes() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-100 to-pink-200 p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header Section */}
        <div className="text-center p-8 bg-pink-50">
          <h2 className="text-3xl font-bold text-pink-600 mb-2">Create Account</h2>
          <p className="text-gray-600">Join us today and start your journey</p>
        </div>

        {/* Social Register Button */}
        <div className="px-8 pt-6">
          <button className="w-full mb-4 py-3 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
              alt="Google Logo"
              className="h-5 w-5"
            />
            Sign up with Google
          </button>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or register with email</span>
            </div>
          </div>
        </div>

        {/* Register Form */}
        <form className="px-8 pb-8">
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="First name"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Last name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Create a password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Confirm your password"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                I agree to the{' '}
                <a href="#" className="text-pink-600 hover:text-pink-500">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-pink-600 hover:text-pink-500">
                  Privacy Policy
                </a>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium"
            >
              Create Account
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center pb-8 px-8">
          <p className="text-gray-600">
            Already have an account?{' '}
            <a href="#" className="text-pink-600 font-medium hover:text-pink-500">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
