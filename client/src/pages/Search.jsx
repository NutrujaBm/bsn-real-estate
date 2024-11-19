import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";

export default function Search() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === "condo" || e.target.id === "apartment") {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }

    // อื่น ๆ ไม่มีการเปลี่ยนแปลง
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("type", sidebardata.type);
    urlParams.set("minPrice", sidebardata.minPrice || 0);
    urlParams.set("maxPrice", sidebardata.maxPrice || Number.MAX_SAFE_INTEGER);
    urlParams.set("sort", sidebardata.sort || "createdAt");
    urlParams.set("order", sidebardata.order || "desc");
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7  border-b-2 md:border-r-2 md:min-h-screen w-[410px]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8 ">
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
            <label className="font-semibold">Type:</label>
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
              <span>อพาร์ตเม้น</span>
            </div>
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="ราคาต่ำสุด"
              value={sidebardata.minPrice || ""}
              onChange={(e) =>
                setSidebardata((prev) => ({
                  ...prev,
                  minPrice: e.target.value,
                }))
              }
              className="border rounded-lg p-3  w-1/2"
            />
            <input
              type="number"
              placeholder="ราคาสูงสุด"
              value={sidebardata.maxPrice || ""}
              onChange={(e) =>
                setSidebardata((prev) => ({
                  ...prev,
                  maxPrice: e.target.value,
                }))
              }
              className="border rounded-lg p-3 w-1/2"
            />
          </div>

          {/* <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Amenities:</label>
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
          </div> */}
          <div className="flex items-center gap-2">
            <label className="font-semibold">เรียงตาม:</label>
            <select
              id="sort_order"
              value={`${sidebardata.sort}_${sidebardata.order}`}
              onChange={(e) => {
                const [sort, order] = e.target.value.split("_");
                setSidebardata((prev) => ({ ...prev, sort, order }));
              }}
              className="border rounded-lg p-3"
            >
              <option value="title_asc">เรียงตามตัวอักษร ก - ฮ</option>
              <option value="title_desc">เรียงตามตัวอักษร ฮ - ก</option>
              <option value="price_asc">ราคา จากต่ำไปสูง</option>
              <option value="price_desc">ราคา จากสูงไปต่ำ</option>
              <option value="createdAt_desc">วันที่ใหม่ล่าสุด</option>
              <option value="createdAt_asc">วันที่เก่าสุด</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
            Search
          </button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          รายการอสังหาริมทรัพย์:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && listings.length === 0 && (
            <p className="text-xl text-slate-700">No listing found!</p>
          )}
          {loading && (
            <p className="text-xl text-slate-700 text-center w-full">
              Loading...
            </p>
          )}

          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}

          {showMore && (
            <button
              onClick={onShowMoreClick}
              className="text-green-700 hover:underline p-7 text-center w-full"
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
