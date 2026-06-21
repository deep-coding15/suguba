import React, { useContext } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Link } from "react-router-dom";
import { MyContext } from "../../router";

export default function DefileCat() {
  const context = useContext(MyContext);

  // On garde seulement les catégories parentes (sans parentId)
  const parentCats = context.catData?.filter(cat => !cat.parentId) || [];

  return (
    <div className="cateSwip !pt-4 !py-8">
      <div className="w-[95%] !mx-auto">
        <Swiper
          slidesPerView={7}
          spaceBetween={20}
          navigation={true}
          modules={[Navigation]}
          className="mySwiper"
        >
          {parentCats.map((cat) => (
            <SwiperSlide key={cat._id}>
              <Link to={`/listeProduits?category=${cat._id}&name=${cat.name}`}>
                <div className="items !py-3 rounded-sm bg-white text-center flex items-center justify-center flex-col">
                  <img
                    src={cat.images?.[0] || "/placeholder.png"}
                    className="w-[70px] transition-all !rounded-full overflow-hidden"
                    alt={cat.name}
                  />
                  <h3 className="text-[15px] font-[500]">{cat.name}</h3>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}





{/*import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation} from 'swiper/modules';
import { Link } from "react-router-dom";

export default function DefileCat(){
return(
    <div className=" cateSwip !pt-4 !py-8">
        <div className="w-[95%] !mx-auto">

                <Swiper
        slidesPerView={7}
        spaceBetween={20}
        navigation={true}
        modules={[Navigation]}
        className="mySwiper"
      >
        <SwiperSlide>
          <Link to="/">
          <div className="items !py-3 rounded-sm bg-white text-center flex items-center justify-center flex-col">
                <img src="https://imgs.search.brave.com/ZjsVbazMDabw7oQBVBgyFMGQmRUKrnwTECR9ML9KQPw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2RmLzYy/L2Y5L2RmNjJmOTY3/NDcyMGM5YTQ0MGM3/OGRiZWFjM2NhNzU3/LmpwZw"
                 className="w-[70px] transition-all !rounded-full overflow-hidden"/>
                <h3 className="text-[15px] font-[500]">Habits</h3>
          </div>
          </Link>
       </SwiperSlide>
       <SwiperSlide>
          <Link to="/">
          <div className="items !py-3 rounded-sm bg-white text-center flex items-center justify-center flex-col">
                <img src="https://imgs.search.brave.com/ZjsVbazMDabw7oQBVBgyFMGQmRUKrnwTECR9ML9KQPw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2RmLzYy/L2Y5L2RmNjJmOTY3/NDcyMGM5YTQ0MGM3/OGRiZWFjM2NhNzU3/LmpwZw"
                 className="w-[70px] transition-all !rounded-full overflow-hidden"/>
                <h3 className="text-[15px] font-[500]">Chaussures</h3>
          </div>
          </Link>
       </SwiperSlide>
       <SwiperSlide>
          <Link to="/">
          <div className="items !py-3 rounded-sm bg-white text-center flex items-center justify-center flex-col">
                <img src="https://imgs.search.brave.com/ZjsVbazMDabw7oQBVBgyFMGQmRUKrnwTECR9ML9KQPw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2RmLzYy/L2Y5L2RmNjJmOTY3/NDcyMGM5YTQ0MGM3/OGRiZWFjM2NhNzU3/LmpwZw"
                 className="w-[70px] transition-all !rounded-full overflow-hidden"/>
                <h3 className="text-[15px] font-[500]">Accessoires</h3>
          </div>
          </Link>
       </SwiperSlide>
       <SwiperSlide>
          <Link to="/">
          <div className="items !py-3 rounded-sm bg-white text-center flex items-center justify-center flex-col">
                <img src="https://imgs.search.brave.com/ZjsVbazMDabw7oQBVBgyFMGQmRUKrnwTECR9ML9KQPw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2RmLzYy/L2Y5L2RmNjJmOTY3/NDcyMGM5YTQ0MGM3/OGRiZWFjM2NhNzU3/LmpwZw"
                 className="w-[70px] transition-all !rounded-full overflow-hidden"/>
                <h3 className="text-[15px] font-[500]">Electroniques</h3>
          </div>
          </Link>
       </SwiperSlide>
       <SwiperSlide>
          <Link to="/">
          <div className="items !py-3 rounded-sm bg-white text-center flex items-center justify-center flex-col">
                <img src="https://imgs.search.brave.com/ZjsVbazMDabw7oQBVBgyFMGQmRUKrnwTECR9ML9KQPw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2RmLzYy/L2Y5L2RmNjJmOTY3/NDcyMGM5YTQ0MGM3/OGRiZWFjM2NhNzU3/LmpwZw"
                 className="w-[70px] transition-all !rounded-full overflow-hidden"/>
                <h3 className="text-[15px] font-[500]">Aliments</h3>
          </div>
          </Link>
       </SwiperSlide>
       <SwiperSlide>
          <Link to="/">
          <div className="items !py-3 rounded-sm bg-white text-center flex items-center justify-center flex-col">
                <img src="https://imgs.search.brave.com/ZjsVbazMDabw7oQBVBgyFMGQmRUKrnwTECR9ML9KQPw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2RmLzYy/L2Y5L2RmNjJmOTY3/NDcyMGM5YTQ0MGM3/OGRiZWFjM2NhNzU3/LmpwZw"
                 className="w-[70px] transition-all !rounded-full overflow-hidden"/>
                <h3 className="text-[15px] font-[500]">Sacs</h3>
          </div>
          </Link>
       </SwiperSlide>
       <SwiperSlide>
          <Link to="/">
          <div className="items !py-3 rounded-sm bg-white text-center flex items-center justify-center flex-col">
                <img src="https://imgs.search.brave.com/ZjsVbazMDabw7oQBVBgyFMGQmRUKrnwTECR9ML9KQPw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2RmLzYy/L2Y5L2RmNjJmOTY3/NDcyMGM5YTQ0MGM3/OGRiZWFjM2NhNzU3/LmpwZw"
                 className="w-[70px] transition-all !rounded-full overflow-hidden"/>
                <h3 className="text-[15px] font-[500]">Cosmetiques</h3>
          </div>
          </Link>
       </SwiperSlide>
       <SwiperSlide>
          <Link to="/">
          <div className="items !py-3 rounded-sm bg-white text-center flex items-center justify-center flex-col">
                <img src="https://imgs.search.brave.com/ZjsVbazMDabw7oQBVBgyFMGQmRUKrnwTECR9ML9KQPw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2RmLzYy/L2Y5L2RmNjJmOTY3/NDcyMGM5YTQ0MGM3/OGRiZWFjM2NhNzU3/LmpwZw"
                 className="w-[70px] transition-all !rounded-full overflow-hidden"/>
                <h3 className="text-[15px] font-[500]">Textiles</h3>
          </div>
          </Link>
       </SwiperSlide>
        
        
    </Swiper>  
    </div>
    </div>
)

}*/}