import React from "react";

function Search() {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7  border-b-2 md:border-r-2 md:min-h-screen">
        <form className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
              // value={sidebardata.searchTerm}
              // onChange={handleChange}
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">ประเภท:</label>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="condo"
                className="w-5"
                // onChange={handleChange}
                // checked={sidebardata.type === "condo"}
              />
              <span>คอนโด</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="apartment"
                className="w-5"
                // onChange={handleChange}
                // checked={sidebardata.type === "apartment"}
              />
              <span>อพาร์ตเม้นท์</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Amenities:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                // onChange={handleChange}
                // checked={sidebardata.parking}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                // onChange={handleChange}
                // checked={sidebardata.furnished}
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">เรียงตาม:</label>
            <select
              // onChange={handleChange}
              defaultValue={"created_at_desc"}
              id="sort_order"
              className="border rounded-lg p-3"
            >
              {/* <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to hight</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option> */}
              <option value="">แนะนำ</option>
              <option value="alphabet-asc">เรียงตามตัวอักษร ก - ฮ</option>
              <option value="alphabet-desc">เรียงตามตัวอักษร ฮ - ก</option>
              <option value="price-asc">ราคา จากต่ำไปสูง</option>
              <option value="price-desc">ราคา จากสูงไปต่ำ</option>
              <option value="date-newest">วันที่ใหม่ล่าสุด</option>
              <option value="date-oldest">วันที่เก่าสุด</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
            Search
          </button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Listing results:
        </h1>

        {/* <div className="p-7 flex flex-wrap gap-4">
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
        </div> */}
      </div>
    </div>
  );
}

export default Search;
