export function Sidebar() {
    return (
        <div className="col-span-1 bg-white rounded-lg p-4 shadow-md">
            <h2 className="text-lg font-semibold mt-6 mb-4">Thương hiệu</h2>
            <input
              type="text"
              placeholder="Tìm kiếm"
              className="w-full border rounded-lg p-2 mb-4"
            />
            <ul className="space-y-2">
              <li className="text-gray-600 hover:text-pink-500 cursor-pointer">
                Chanel
              </li>
              <li className="text-gray-600 hover:text-pink-500 cursor-pointer">
                Dior
              </li>
              <li className="text-gray-600 hover:text-pink-500 cursor-pointer">
                Cocoon
              </li>
              <li className="text-gray-600 hover:text-pink-500 cursor-pointer">
                Maybelline
              </li>
              <li className="text-gray-600 hover:text-pink-500 cursor-pointer">
                L'Oréal
              </li>
              <li className="text-gray-600 hover:text-pink-500 cursor-pointer">
                Estee Lauder
              </li>
              <li className="text-gray-600 hover:text-pink-500 cursor-pointer">
                MAC Cosmetics
              </li>
              <li className="text-gray-600 hover:text-pink-500 cursor-pointer">
                Clinique
              </li>
              <li className="text-gray-600 hover:text-pink-500 cursor-pointer">
                Bobbi Brown
              </li>
              <li className="text-gray-600 hover:text-pink-500 cursor-pointer">
                Lancome
              </li>
            </ul>
          </div>
    );
  }
  