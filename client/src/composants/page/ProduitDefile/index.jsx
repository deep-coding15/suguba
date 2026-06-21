import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import ProduitItems from "../../page/ProduitItems/index";
import { useEffect, useState } from "react";
import { fetchDataFromApi } from "../../../utils/api";

export default function ProduitDefile({ items, categoryId }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (categoryId) {
      fetchDataFromApi(`/api/product/produit-partCatId/${categoryId}`).then((res) => {
        setProducts(res?.produits || []);
      });
    } else {
      fetchDataFromApi(`/api/product/produits?page=1&perPage=10`).then((res) => {
        setProducts(res?.produits || []);
      });
    }
  }, [categoryId]);

  if (products.length === 0) {
    return <p className="text-center text-gray-400 py-4">Aucun produit disponible</p>;
  }

  return (
    <div className="ProduitDefile py-3">
      <Swiper
        slidesPerView={items}
        spaceBetween={10}
        navigation={true}
        modules={[Navigation]}
        className="mySwiper"
      >
        {products.map((product) => (
          <SwiperSlide key={product._id}>
            <ProduitItems item={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}





{/*import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation} from 'swiper/modules'
import ProduitItems from "../../page/ProduitItems/index";

export default function ProduitDefile(props){

return(
    <div className='ProduitDefile py-3'>
       <Swiper
            slidesPerView={props.items}
            spaceBetween={10}
            navigation={true}
            modules={[Navigation]}
            className="mySwiper">
                              
                    <SwiperSlide>
                        <ProduitItems/>
                    </SwiperSlide>
                     <SwiperSlide>
                        <ProduitItems/>
                    </SwiperSlide>
                     <SwiperSlide>
                        <ProduitItems/>
                    </SwiperSlide>
                     <SwiperSlide>
                        <ProduitItems/>
                    </SwiperSlide>
                     <SwiperSlide>
                        <ProduitItems/>
                    </SwiperSlide>
                     <SwiperSlide>
                        <ProduitItems/>
                    </SwiperSlide>
                     <SwiperSlide>
                        <ProduitItems/>
                    </SwiperSlide>
                     <SwiperSlide>
                        <ProduitItems/>
                    </SwiperSlide>
                     <SwiperSlide>
                        <ProduitItems/>
                    </SwiperSlide>
                     <SwiperSlide>
                        <ProduitItems/>
                    </SwiperSlide>

        </Swiper>
 </div>
)



}*/}