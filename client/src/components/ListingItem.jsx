import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import {
  IoBusOutline,
  IoBedOutline,
  IoBagHandleOutline,
  IoCheckboxOutline,
  IoExpandOutline,
} from "react-icons/io5";
import { PiBathtub, PiDoorOpen, PiHospital } from "react-icons/pi";
import { FaMapMarkerAlt, FaUniversity } from "react-icons/fa";
import { formatDistanceToNowStrict } from "date-fns";
import { th } from "date-fns/locale";

function ListingItem({ listing }) {
  const timeAgo = formatDistanceToNowStrict(new Date(listing.updatedAt), {
    addSuffix: true,
    locale: th,
  });

  return (
    <div className=" bg-white rounded-lg shadow-md border p-4 w-72">
      <div className="relative overflow-hidden">
        <Link to={`/listing/${listing._id}`} className="block relative group">
          <img
            src={
              listing.imageUrls[0] ||
              "https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg"
            }
            alt="listing cover"
            className="h-[300px] sm:h-[220px] w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 border-4 border-slate-800 pointer-events-none"></div>
          <h3 className="absolute top-1 left-1 bg-red-500 text-white text-sm px-2 py-1 rounded-br-lg shadow">
            {listing.price.toLocaleString()} บาท
          </h3>
        </Link>
      </div>
      <div className="flex flex-col gap-3 mt-4">
        <h2 className="text-lg font-bold truncate hover:underline">
          <Link to={`/listing/${listing._id}`}>{listing.title}</Link>
        </h2>
        <div className="text-sm text-gray-600 flex items-start gap-2">
          <FaMapMarkerAlt className="text-red-500" />
          <p>
            ที่อยู่ {listing.address}, แขวง {listing.subdistrict}, เขต{" "}
            {listing.district}, จังหวัด {listing.province}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
            <IoBedOutline className="text-lg bg-amber-200 w-8 h-8 p-1 rounded-md" />
            <span>
              {listing.bedroom === 0
                ? "ห้องสตูดิโอ"
                : `${listing.bedroom} ห้องนอน`}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
            <PiBathtub className="text-lg bg-amber-200 w-7 h-7 p-1 rounded-md" />
            <span>{listing.bathroom} ห้องน้ำ</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1 w-full">
            <IoExpandOutline className="text-lg bg-amber-200 w-7 h-7 p-1 rounded-md" />
            <span>พื้นที่ใช้สอย {listing.size} (ตร.ม.)</span>
          </div>
        </div>
      </div>
      <hr className="border-gray-300 mt-5 mb-5" />
      <div className="flex items-center gap-4">
        {/* <span className="text-sm text-gray-500">{timeAgo}</span> */}

        <div className="flex gap-4 ml-auto">
          <span className="text-sm text-gray-500">{timeAgo}</span>
        </div>
      </div>
    </div>
  );
}

export default ListingItem;
