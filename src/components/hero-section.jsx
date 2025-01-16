import img1 from "../assets/pictures/1.jpg";
import img2 from "../assets/pictures/2.jpg";
import img3 from "../assets/pictures/3.jpg";
import img4 from "../assets/pictures/4.jpg";

export function HeroSection() {
  const images = [img1, img2, img3, img4];

  return (
    <section className="relative bg-gradient-to-br from-mint-50 to-pink-50 py-20">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-100 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-mint-100 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                Be <span className="text-pink-500">comfortable</span> in your
                skin
              </h1>
              <p className="text-lg text-gray-600 md:text-xl max-w-2xl">
                Your journey into skin care starts here. We build customized
                health and wellness plans after careful assessment of your skin
                condition.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-3 bg-pink-500 text-white rounded-full font-semibold hover:bg-pink-600 transition-colors duration-300">
                Get Started
              </button>
              <button className="px-8 py-3 border-2 border-pink-200 text-pink-500 rounded-full font-semibold hover:bg-pink-100 transition-colors duration-300">
                Learn More
              </button>
            </div>
          </div>

          {/* Image Grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {images.map((image, i) => {
                console.log("Image path:", image);

                return (
                  <div
                    key={i}
                    className="group relative aspect-square overflow-hidden rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105"
                  >
                    <img
                      src={image}
                      alt={`Skincare Treatment ${i + 1}`}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        console.error(`Error loading image ${i + 1}:`, e);
                        console.log("Failed image path:", e.target.src);
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
