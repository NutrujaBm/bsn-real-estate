import { useState } from "react";
import { Link } from "react-router-dom";
import { provincesData } from "../lib/provincesData";
import {
  getDistrictsByProvince,
  getSubdistrictsByDistrict,
} from "../utils/locationUtils.js";
import { FaSearch } from "react-icons/fa";
import { FiFilter } from "react-icons/fi";

function SearchBar() {
  const [query, setQuery] = useState({
    province: "",
    type: "",
    minPrice: 0,
    maxPrice: 0,
    district: "",
    subdistrict: "",
    bedroom: "",
    bathroom: "",
    size: "",
    amenities: [],
  });

  const [isAdvancedSearch, setAdvancedSearch] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState({
    province: "",
    district: "",
    subdistrict: "",
  });
  const [districts, setDistricts] = useState([]);
  const [subdistricts, setSubdistricts] = useState([]);

  const toggleDropdown = () => setAdvancedSearch((prev) => !prev);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    if (type === "checkbox") {
      setQuery((prev) => {
        const amenities = checked
          ? [...prev.amenities, name]
          : prev.amenities.filter((amenity) => amenity !== name);
        return { ...prev, amenities };
      });
    } else {
      setQuery((prev) => ({ ...prev, [name]: value }));
      if (name === "province") {
        const newDistricts = getDistrictsByProvince(value);
        setDistricts(newDistricts);
        setSelectedLocation({ province: value, district: "", subdistrict: "" });
        setSubdistricts([]);
      } else if (name === "district") {
        const newSubdistricts = getSubdistrictsByDistrict(
          selectedLocation.province,
          value
        );
        setSubdistricts(newSubdistricts);
        setSelectedLocation((prev) => ({
          ...prev,
          district: value,
          subdistrict: "",
        }));
      } else if (name === "subdistrict") {
        setSelectedLocation((prev) => ({ ...prev, subdistrict: value }));
      }
    }
  };

  return (
    <div className="relative py-4">
      <form className="flex flex-col md:flex-row gap-4 px-6 py-4 bg-white border border-gray-200 rounded-lg shadow-lg">
        {/* Province selection */}
        <select
          name="province"
          id="province"
          onChange={handleChange}
          value={selectedLocation.province}
          className="w-full md:w-60 p-3 border rounded-md"
        >
          <option value="">เลือกจังหวัด</option>
          {provincesData.map((province) => (
            <option key={province.name} value={province.name}>
              {province.name}
            </option>
          ))}
        </select>

        {/* Type selection */}
        <select
          name="type"
          id="type"
          onChange={handleChange}
          className="w-full md:w-60 p-3 border rounded-md"
        >
          <option value="">เลือกประเภท</option>
          <option value="condo">คอนโด</option>
          <option value="apartment">อพาร์ทเมนต์</option>
        </select>

        {/* Price input */}
        <div className="flex items-center">
          <input
            type="number"
            name="minPrice"
            min={0}
            max={10000000}
            placeholder="ราคาขั้นต่ำ"
            onChange={handleChange}
            className="w-full md:w-40 p-3 border rounded-md"
          />
        </div>

        {/* Buttons */}
        <div className="flex space-x-4">
          {/* ปุ่ม Filter */}
          <button
            type="button"
            onClick={toggleDropdown}
            className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white"
          >
            <FiFilter size={24} />
          </button>

          {/* ปุ่ม ค้นหา */}
          <Link
            to={`/list?province=${query.province}&type=${query.type}&minPrice=${query.minPrice}&maxPrice=${query.maxPrice}&district=${query.district}&subdistrict=${query.subdistrict}&bedroom=${query.bedroom}&bathroom=${query.bathroom}&size=${query.size}`}
            className="flex items-center justify-center w-40 h-12 bg-blue-600 text-white rounded-lg"
          >
            <FaSearch size={20} className="mr-2" />
            ค้นหา
          </Link>
        </div>
      </form>

      {isAdvancedSearch && (
        <AdvancedSearchForm
          districts={districts}
          subdistricts={subdistricts}
          onDistrictChange={handleChange}
          query={query}
          setQuery={setQuery}
        />
      )}
    </div>
  );
}

// Advanced Search Form
function AdvancedSearchForm({ districts, subdistricts, onDistrictChange }) {
  return (
    <div className="absolute top-full left-0 w-full p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label htmlFor="district" className="block mb-2">
            เขต / อำเภอ
          </label>
          <select
            name="district"
            onChange={onDistrictChange}
            className="w-full p-3 border rounded-md"
          >
            <option value="">เขต / อำเภอ</option>
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="subdistrict" className="block mb-2">
            แขวง / ตำบล
          </label>
          <select
            name="subdistrict"
            onChange={onDistrictChange}
            className="w-full p-3 border rounded-md"
          >
            <option value="">แขวง / ตำบล</option>
            {subdistricts.map((subdistrict) => (
              <option key={subdistrict} value={subdistrict}>
                {subdistrict}
              </option>
            ))}
          </select>
        </div>
        {/* Add more fields as needed */}
      </div>
    </div>
  );
}

export default SearchBar;
