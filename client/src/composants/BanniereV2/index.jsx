import React from "react"
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { EffectFade, Navigation, Pagination,Autoplay } from 'swiper/modules';
import Button from "@mui/material/Button";

export default function BanniereV2(){
    return(
        <>
        <Swiper
        loop={true}
        spaceBetween={10}
        effect={"fade"}
        navigation={true}
        pagination={{
          clickable: true,
        }}
         autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }} 
        modules={[EffectFade, Navigation, Pagination,Autoplay]}
        className="BanniereV2 !w-[500px]"
      >
        <SwiperSlide>
         <div className="item !w-full rounded-md overflow-hidden relative">
                 <img src="https://robe-rose-poudre.com/cdn/shop/files/Designsanstitre-2025-04-09T094817.768.png?crop=center&height=1200&v=1744184979&width=1200"
                 />

                 <div className="info absolute top-0 -right-[100%] opacity-0 w-[50%] h-[100%] z-50 p-8
                  flex items-center flex-col justify-center transition-all duration-700">
                  <h4 className="text-[18px] font-[500] w-full mb-3 text-left relative 
                  -right-[100%] opacity-0">
                      Grand jour de promo 
                  </h4>
                  <h2 className="text-[35px] font-[700] w-full relative 
                  -right-[100%] opacity-0">
                    Les articles artisanaux de chez nous
                  </h2>
                  <h3 className=" flex items-center gap-3 text-[18px] font-[500] 
                  w-full mb-3 mt-3 text-left relative 
                  -right-[100%] opacity-0">
                   Commence à partir de {""}<span className=" text-[rgb(231, 116, 146)] text-[30px] font-[700]">5000Fcfa
                   </span>Seulement
                  </h3>
                  <div className="w-full relative 
                  -right-[100%] opacity-0 btn_">
                      <Button className="btn-org ">Acheter maintenant</Button>
                  </div>
                 </div>
            </div>
        </SwiperSlide>
        <SwiperSlide>
         <div className="item !w-full rounded-md overflow-hidden relative">
                 <img src="https://robe-rose-poudre.com/cdn/shop/files/Designsanstitre-2025-04-09T094720.443.png?crop=center&height=1200&v=1744184979&width=1200"
                    />

                 <div className="info absolute top-0 -right-[100%] opacity-0 w-[50%] h-[100%] z-50 p-8
                  flex items-center flex-col justify-center transition-all duration-700">
                  <h4 className="text-[18px] font-[500] w-full mb-3 text-left relative 
                  -right-[100%] opacity-0">
                      Grand jour de promo 
                  </h4>
                  <h2 className="text-[35px] font-[700] w-full relative 
                  -right-[100%] opacity-0">
                    Les articles artisanaux de chez nous
                  </h2>
                  <h3 className=" flex items-center gap-3 text-[18px] font-[500] 
                  w-full mb-3 mt-3 text-left relative 
                  -right-[100%] opacity-0">
                   Commence à partir de {""}<span className=" text-[rgb(231, 116, 146)] text-[30px] font-[700]">5000Fcfa
                   </span>Seulement
                  </h3>
                  <div className="w-full relative 
                  -right-[100%] opacity-0 btn_">
                      <Button className="btn-org">Acheter maintenant</Button>
                  </div>
                 </div>
                  </div>
        </SwiperSlide>
      </Swiper></>
        
            
        
    )
}