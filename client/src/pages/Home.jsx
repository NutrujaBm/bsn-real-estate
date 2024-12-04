import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";

function Home() {
  const [offerListings, setOfferListings] = useState([]);
  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/listing/get?offer=true&limit=8");
        const data = await res.json();
        setOfferListings(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchOfferListings();
  }, []);

  return (
    <div>
      {/* top */}
      <div
        className="relative flex flex-col gap-6 justify-center items-center px-3 w-full text-white"
        style={{
          background: `url(https://cdn.pixabay.com/photo/2014/05/16/11/47/thailand-345514_1280.jpg) center no-repeat`,
          backgroundSize: "cover",
          height: "80vh", // ความสูง 80% ของหน้าจอ
          width: "100vw", // ความกว้าง 100% ของหน้าจอ
        }}
      >
        <div className="absolute inset-0 bg-black/50 z-0"></div>
        <h1 className="text-slate-100 font-bold text-3xl lg:text-6xl z-10 text-center leading-relaxed">
          เราจะช่วยคุณค้นหาสถานที่ที่คุณชื่นชอบ <br />
          <span className="text-slate-300 leading-loose text-">
            ด้วยแหล่งเช่าคอนโดและอพาร์ทเมนต์ใกล้ตัวคุณ
          </span>
        </h1>

        <Link
          to={"/search"}
          className="text-base sm:text-lg text-blue-500 font-bold hover:underline z-10 mt-4 bg-white p-5 rounded-full shadow-lg"
        >
          ดูรายละเอียด เพิ่มเติม
        </Link>
      </div>

      {/* swiper
      <Swiper navigation slidesPerView={1} loop={true}>
        {offerListings && offerListings.length > 0 ? (
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                style={{
                  background: `url(${
                    listing.imageUrls && listing.imageUrls.length > 0
                      ? listing.imageUrls[0]
                      : "https://cdn.pixabay.com/photo/2014/05/16/11/47/thailand-345514_1280.jpg" // fallback image
                  }) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="h-[500px]"
              ></div>
            </SwiperSlide>
          ))
        ) : (
          <SwiperSlide>
            <div
              style={{
                background: `url(https://cdn.pixabay.com/photo/2014/05/16/11/47/thailand-345514_1280.jpg) center no-repeat`,
                backgroundSize: "cover",
              }}
              className="h-[500px]"
            ></div>
          </SwiperSlide>
        )}
      </Swiper> */}

      {/* listing results for offer, sale and rent */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListings && offerListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                โพสต์ อสังหาริมทรัพย์ล่าสุด
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?offer=true"}
              >
                ดูรายการอสังหาริมทรัพย์
              </Link>
            </div>
            {/* ใช้ grid สำหรับการจัดตำแหน่งโพสต์ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-45 gap-y-5">
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
