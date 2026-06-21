import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation} from 'swiper/modules';
import { Link } from "react-router-dom";
import ban1 from "../../assets/bab1.jpeg"
import ban2 from "../../assets/bab2.jpeg"
import ban3 from "../../assets/ban3.jpeg"
import ban5 from "../../assets/ban5.jpeg"
import ban51 from "../../assets/ban51.jpeg"

export default function AjoutBanniere(props){
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
                   <Link to="/">
                      <div className="items rounded-lg  overflow-hidden text-center flex items-center justify-center flex-col group">
                           <img src={ban1} className=" w-full transition-all group-hover:scale-105 "/>
                      </div>
                   </Link>
                </SwiperSlide>
                 <SwiperSlide>
                   <Link to="/">
                      <div className="items  rounded-lg overflow-hidden  text-center flex items-center justify-center flex-col group">
                           <img src={ban2} className=" w-full transition-all group-hover:scale-105 "/>
                      </div>
                   </Link>
                </SwiperSlide>
                 <SwiperSlide>
                   <Link to="/">
                      <div className="items  rounded-lg overflow-hidden text-center flex items-center justify-center flex-col group">
                           <img src={ban3}  className=" w-full transition-all group-hover:scale-105 "/>
                      </div>
                   </Link>
                </SwiperSlide>
                 <SwiperSlide>
                   <Link to="/">
                      <div className="items  rounded-lg overflow-hidden text-center flex items-center justify-center flex-col group">
                           <img src={ban1}  className="w-full transition-all group-hover:scale-105 "/>
                      </div>
                   </Link>
                </SwiperSlide>
                 <SwiperSlide>
                   <Link to="/">
                      <div className="items  rounded-lg overflow-hidden text-center flex items-center justify-center flex-col group">
                           <img src={ban5}  className="w-full transition-all group-hover:scale-105 "/>
                      </div>
                   </Link>
                </SwiperSlide>
                <SwiperSlide>
                   <Link to="/">
                      <div className="items  rounded-lg overflow-hidden text-center flex items-center justify-center flex-col group">
                           <img src={ban51} className="w-full transition-all group-hover:scale-105 "/>
                      </div>
                   </Link>
                </SwiperSlide>
                </Swiper>
        </div>
        </>
    )
}