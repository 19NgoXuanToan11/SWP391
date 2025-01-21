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
  
        {/* Brands */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">Brands</h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="text-pink-500 focus:ring-pink-500" />
              <span>La Roche-Posay (120)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                defaultChecked
                className="text-pink-500 focus:ring-pink-500"
              />
              <span>L’Oréal (85)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="text-pink-500 focus:ring-pink-500" />
              <span>Innisfree (64)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="text-pink-500 focus:ring-pink-500" />
              <span>Laneige (59)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="text-pink-500 focus:ring-pink-500" />
              <span>Artistry (25)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="text-pink-500 focus:ring-pink-500" />
              <span>Hada Labo (40)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="text-pink-500 focus:ring-pink-500" />
              <span>Shiseido (10)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="text-pink-500 focus:ring-pink-500" />
              <span>Obagi (72)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="text-pink-500 focus:ring-pink-500" />
              <span>Dear Klairs (33)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="text-pink-500 focus:ring-pink-500" />
              <span>Perfect Diary Beauty (120)</span>
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
          </div>
        </div>
  
        {/* Skin Type */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">Skin Type</h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="text-pink-500 focus:ring-pink-500" />
              <span>Normal/All Skin Types (118)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="text-pink-500 focus:ring-pink-500" />
              <span>Oily/Combination (41)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="text-pink-500 focus:ring-pink-500" />
              <span>Sensitive (35)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="text-pink-500 focus:ring-pink-500" />
              <span>Dry/Combination (22)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="text-pink-500 focus:ring-pink-500" />
              <span>Acne (19)</span>
            </label>
          </div>
        </div>

        {/* Capacity */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">Capacity</h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="text-pink-500 focus:ring-pink-500" />
              <span>5ml(1)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="text-pink-500 focus:ring-pink-500" />
              <span>105ml (1)</span>
            </label>
          </div>
        </div>

        {/* Gender */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">Gender</h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="text-pink-500 focus:ring-pink-500" />
              <span>Male and Female (19)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="text-pink-500 focus:ring-pink-500" />
              <span>Female (7)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="text-pink-500 focus:ring-pink-500" />
              <span>Male (2)</span>
            </label>
          </div>
        </div>
  
        {/* Brand Origin */}
        <div>
          <h3 className="text-lg font-bold mb-2">Brand Origin</h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="text-pink-500 focus:ring-pink-500" />
              <span>Korea (82)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="text-pink-500 focus:ring-pink-500" />
              <span>France (59)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="text-pink-500 focus:ring-pink-500" />
              <span>USA (43)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="text-pink-500 focus:ring-pink-500" />
              <span>Japan (36)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="text-pink-500 focus:ring-pink-500" />
              <span>Vietnam (24)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="text-pink-500 focus:ring-pink-500" />
              <span>Germany (16)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="text-pink-500 focus:ring-pink-500" />
              <span>China (7)</span>
            </label>
          </div>
        </div>
      </div>
    );
  };
  
  