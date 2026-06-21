import { useState } from "react";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/styles.min.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

export default function ProductZoom({ images = [] }) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [zoomSliderBig, setZoomSliderBig] = useState(null);
  const [zoomSliderSml, setZoomSliderSml] = useState(null);

  const goto = (index) => {
    setSlideIndex(index);
    zoomSliderBig?.slideTo(index);
    zoomSliderSml?.slideTo(index);
  };

  if (images.length === 0) {
    return (
      <div className="w-full h-[500px] bg-gray-100 flex items-center justify-center rounded-md">
        <p className="text-gray-400">Aucune image</p>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      {/* Thumbnails */}
      <div className="slider w-[15%]">
        <Swiper
          onSwiper={setZoomSliderSml}
          direction="vertical"
          spaceBetween={5}
          slidesPerView={4}
          navigation={false}
          modules={[Navigation]}
          className="zoomProductSliderThumbs !h-[500px] overflow-hidden"
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <div
                className={`item rounded-md cursor-pointer group overflow-hidden transition-opacity duration-200 ${
                  slideIndex === index ? "opacity-100 border-2 border-primary" : "opacity-40"
                }`}
                onClick={() => goto(index)}
              >
                <img
                  src={img}
                  className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                  alt={`Thumbnail ${index}`}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Image principale avec zoom */}
      <div className="zoomContainer w-[85%] !h-[500px] overflow-hidden rounded-md">
        <Swiper
          onSwiper={setZoomSliderBig}
          slidesPerView={1}
          spaceBetween={10}
          navigation={false}
          onSlideChange={(swiper) => setSlideIndex(swiper.activeIndex)}
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <InnerImageZoom
                zoomType="hover"
                zoomScale={1.5}
                src={img}
                alt={`Product ${index}`}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}



