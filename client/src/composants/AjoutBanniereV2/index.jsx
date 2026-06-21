import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation} from 'swiper/modules';
import BanniereBox from "../BanniereBox/index";
export default function AjoutBanniereV2(props){
    return(
        <>
        <div className="!pt-5 w-full flex  
          items-center">
          <Swiper
                slidesPerView={props.items}
                spaceBetween={10}
                navigation={true}
                modules={[Navigation]}
                className="smlBtn"
              >
                <SwiperSlide>
                  <BanniereBox image={"https://robe-rose-poudre.com/cdn/shop/files/Sc905954246e74a7a8c759fe184d1353el.webp?crop=center&height=1200&v=1740644205&width=1200"} 
                  info={"left"} link={"/"} />
                </SwiperSlide>
                 <SwiperSlide>
                  <BanniereBox image={"https://robe-rose-poudre.com/cdn/shop/files/S5919f4af018f47aab44b3ff1979ba0a8i.webp?crop=center&height=1200&v=1740644190&width=1200"} 
                  info={"left"} link={"/"} />
                </SwiperSlide>
                <SwiperSlide>
                  <BanniereBox image={"https://robe-rose-poudre.com/cdn/shop/files/S6f8e980fba724e5d9f738d0093ae3927S.webp?crop=center&height=1200&v=1740730832&width=1200"} 
                  info={"left"} link={"/"} />
                </SwiperSlide>
                <SwiperSlide>
                  <BanniereBox image={"https://robe-rose-poudre.com/cdn/shop/files/Se9841dcf07f642db8ffb9c991fcc85db0.webp?crop=center&height=1200&v=1741334972&width=1200"} 
                  info={"left"} link={"/"} />
                </SwiperSlide>
                <SwiperSlide>
                  <BanniereBox image={"https://robe-rose-poudre.com/cdn/shop/files/S4d014d61045c4479aa0101140d05f59fZ.webp?crop=center&height=1200&v=1740730833&width=1200"} 
                  info={"left"} link={"/"} />
                </SwiperSlide>
                <SwiperSlide>
                  <BanniereBox image={"https://robe-rose-poudre.com/cdn/shop/files/S10f8834843964beaa326aa01bb239f4ev.webp?crop=center&height=1200&v=1740644190&width=1200"} 
                  info={"left"} link={"/"} />
                </SwiperSlide>
                <SwiperSlide>
                  <BanniereBox image={"https://robe-rose-poudre.com/cdn/shop/files/Sdb423c850fab4ebd83ec195239ad31b8N.webp?crop=center&height=1200&v=1740644171&width=1200"} 
                  info={"left"} link={"/"} />
                </SwiperSlide>
          
                </Swiper>
        </div>
        </>
    )
}