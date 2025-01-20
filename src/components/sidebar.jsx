export function Sidebar() {
    return (
      <div className="w-64 bg-white p-4 rounded-lg shadow-md">
        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search filters..."
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
  
        {/* Reset Filters */}
        <button className="w-full bg-pink-500 text-white py-2 rounded-lg font-semibold hover:bg-pink-600 mb-4">
          Reset All Filters
        </button>
  
        {/* Brands */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">Brands</h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="text-pink-500 focus:ring-pink-500" />
              <span>Brand A (120)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                defaultChecked
                className="text-pink-500 focus:ring-pink-500"
              />
              <span>Brand B (85)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="text-pink-500 focus:ring-pink-500" />
              <span>Brand C (64)</span>
            </label>
          </div>
        </div>
  
        {/* Categories */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">Categories</h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="text-pink-500 focus:ring-pink-500" />
              <span>Skincare (250)</span>
            </label>
            <label className="pl-6 flex items-center space-x-2">
              <input type="checkbox" className="text-pink-500 focus:ring-pink-500" />
              <span>Cleansers (45)</span>
            </label>
            <label className="pl-6 flex items-center space-x-2">
              <input type="checkbox" className="text-pink-500 focus:ring-pink-500" />
              <span>Moisturizers (78)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="text-pink-500 focus:ring-pink-500" />
              <span>Makeup (180)</span>
            </label>
            <label className="pl-6 flex items-center space-x-2">
              <input type="checkbox" className="text-pink-500 focus:ring-pink-500" />
              <span>Face (65)</span>
            </label>
            <label className="pl-6 flex items-center space-x-2">
              <input type="checkbox" className="text-pink-500 focus:ring-pink-500" />
              <span>Eyes (45)</span>
            </label>
          </div>
        </div>
  
        {/* Price Range */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">Price Range</h3>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              placeholder="0"
              className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <span>-</span>
            <input
              type="number"
              placeholder="1000"
              className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
        </div>
  
        {/* Skin Type */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">Skin Type</h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="text-pink-500 focus:ring-pink-500" />
              <span>Dry (89)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="text-pink-500 focus:ring-pink-500" />
              <span>Oily (102)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="text-pink-500 focus:ring-pink-500" />
              <span>Combination (145)</span>
            </label>
          </div>
        </div>
  
        {/* Features */}
        <div>
          <h3 className="text-lg font-bold mb-2">Features</h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="text-pink-500 focus:ring-pink-500" />
              <span>Vegan (78)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="text-pink-500 focus:ring-pink-500" />
              <span>Cruelty-free (156)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="text-pink-500 focus:ring-pink-500" />
              <span>Natural (92)</span>
            </label>
          </div>
        </div>
      </div>
    );
  };
  
  