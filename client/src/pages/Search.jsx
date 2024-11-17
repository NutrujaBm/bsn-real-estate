import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";

function Search() {
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
    minPrice: 0,
    maxPrice: 0,
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const minPriceFromUrl = urlParams.get("minPrice");
    const maxPriceFromUrl = urlParams.get("maxPrice");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true",
        furnished: furnishedFromUrl === "true",
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
        minPrice: minPriceFromUrl || 0,
        maxPrice: maxPriceFromUrl || 0,
      });
    }
  }, [location.search]);

  const fetchListings = async () => {
    setLoading(true);
    const {
      searchTerm,
      type,
      parking,
      furnished,
      sort,
      order,
      minPrice,
      maxPrice,
    } = sidebardata;

    const urlParams = new URLSearchParams();
    if (searchTerm) urlParams.append("searchTerm", searchTerm);
    if (type !== "all") urlParams.append("type", type);
    if (parking) urlParams.append("parking", parking);
    if (furnished) urlParams.append("furnished", furnished);
    if (sort) urlParams.append("sort", sort);
    if (order) urlParams.append("order", order);
    if (minPrice) urlParams.append("minPrice", minPrice);
    if (maxPrice) urlParams.append("maxPrice", maxPrice);

    try {
      const res = await fetch(`/api/listing/get?${urlParams.toString()}`);
      const data = await res.json();
      setListings(data);
      setShowMore(data.length > 8);
    } catch (error) {
      console.error("Error fetching listings:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchListings();
  }, [sidebardata]);

  const handleChange = (e) => {
    const { id, value, checked } = e.target;

    if (["condo", "apartment"].includes(id)) {
      setSidebardata({ ...sidebardata, type: id });
    } else if (id === "searchTerm") {
      setSidebardata({ ...sidebardata, searchTerm: value });
    } else if (["parking", "furnished", "offer"].includes(id)) {
      setSidebardata({ ...sidebardata, [id]: checked });
    } else if (id === "sort_order") {
      const [sort, order] = value.split("_");
      setSidebardata({ ...sidebardata, sort, order });
    } else if (id === "minPrice" || id === "maxPrice") {
      setSidebardata({ ...sidebardata, [id]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(sidebardata);
    navigate(`/search?${urlParams.toString()}`);
  };

  const onShowMoreClick = () => {
    setShowMore(false);
    // Logic to load more listings
    fetchListings();
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <h2>ตัวกรอง:</h2>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">ประเภท:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="condo"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.type === "condo"}
              />
              <span>คอนโด</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="apartment"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.type === "apartment"}
              />
              <span>อพาร์ทเมนต์</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">ราคา:</label>
            <div className="flex gap-2">
              <span>฿</span>
              <input
                type="number"
                id="minPrice"
                min={0}
                placeholder="จาก"
                onChange={handleChange}
                value={sidebardata.minPrice}
              />
              <input
                type="number"
                id="maxPrice"
                min={0}
                placeholder="ไปยัง"
                onChange={handleChange}
                value={sidebardata.maxPrice}
              />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">สิ่งอำนวยความสะดวก:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.parking}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.furnished}
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">เรียงตาม:</label>
            <select
              onChange={handleChange}
              id="sort_order"
              className="border rounded-lg p-3"
              value={`${sidebardata.sort}_${sidebardata.order}`}
            >
              <option value="created_at_desc">แนะนำ</option>
              <option value="alphabet_asc">เรียงตามตัวอักษร ก - ฮ</option>
              <option value="alphabet_desc">เรียงตามตัวอักษร ฮ - ก</option>
              <option value="price_asc">ราคา จากต่ำไปสูง</option>
              <option value="price_desc">ราคา จากสูงไปต่ำ</option>
              <option value="date_desc">วันที่ใหม่ล่าสุด</option>
              <option value="date_asc">วันที่เก่าสุด</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
            Search
          </button>
        </form>
      </div>

      <div className="p-7 flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {loading ? (
            <div>Loading...</div>
          ) : (
            listings
              .slice(0, showMore ? listings.length : 8)
              .map((listing) => (
                <ListingItem key={listing.id} listing={listing} />
              ))
          )}
        </div>
        {showMore && (
          <button
            className="mt-5 bg-blue-500 text-white px-4 py-2 rounded"
            onClick={onShowMoreClick}
          >
            Show more
          </button>
        )}
      </div>
    </div>
  );
}

export default Search;
