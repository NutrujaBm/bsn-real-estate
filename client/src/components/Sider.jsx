import { useState } from "react";

function Slider({ images }) {
  const [imageIndex, setImageIndex] = useState(null);

  const changeSlide = (direction) => {
    if (direction === "left") {
      setImageIndex(imageIndex === 0 ? images.length - 1 : imageIndex - 1);
    } else {
      setImageIndex(imageIndex === images.length - 1 ? 0 : imageIndex + 1);
    }
  };

  return (
    <div className="slider flex gap-5 w-full h-[350px] sm:h-[280px]">
      {imageIndex !== null && (
        <div className="fullSlider fixed top-0 left-0 w-full h-full bg-white flex justify-between items-center z-50">
          <div
            className="arrow flex items-center justify-center cursor-pointer px-5"
            onClick={() => changeSlide("left")}
          >
            <img
              src="/arrows.png"
              alt="Left Arrow"
              className="w-10 hover:invert-50"
            />
          </div>
          <div className="img-container flex-10 flex justify-center items-center w-full h-full p-5">
            <img
              src={images[imageIndex]}
              alt="Slider Image"
              className="max-w-[90%] max-h-[90%] object-contain rounded-lg"
            />
          </div>
          <div
            className="close absolute top-[50px] right-[50px] cursor-pointer"
            onClick={() => setImageIndex(null)}
          >
            <img
              src="/close-black.png"
              alt="Close"
              className="w-8 hover:invert-50"
            />
          </div>
          <div
            className="arrow flex items-center justify-center cursor-pointer px-5"
            onClick={() => changeSlide("right")}
          >
            <img
              src="/arrows.png"
              alt="Right Arrow"
              className="w-10 rotate-180 hover:invert-50"
            />
          </div>
        </div>
      )}
      <div className="big-image flex-3">
        <img
          src={images[0]}
          alt="Big Image"
          onClick={() => setImageIndex(0)}
          className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="small-image flex-1 flex flex-col justify-between gap-5">
        {images.slice(1).map((image, index) => (
          <img
            src={image}
            alt="Thumbnail"
            key={index}
            onClick={() => setImageIndex(index + 1)}
            className="h-[100px] object-cover rounded-lg transition-transform duration-300 hover:scale-105 hover:shadow-lg sm:h-[80px]"
          />
        ))}
      </div>
    </div>
  );
}

export default Slider;
