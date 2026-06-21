import { useState, useEffect } from "react";
import { IoStatsChartSharp } from "react-icons/io5";
import { AiTwotonePieChart } from "react-icons/ai";
import { BsBank } from "react-icons/bs";
import { RiProductHuntLine } from "react-icons/ri";
import { IoBagCheckOutline } from "react-icons/io5";
import { FaUsers, FaStore } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { fetchDataFromApi } from "../../utils/api";

export default function DashboardBoxes() {
  const [stats, setStats] = useState({
    orders: 0, revenue: 0, commission: 0, products: 0, users: 0, sellers: 0
  });

  useEffect(() => {
    Promise.all([
      fetchDataFromApi("/api/orders?page=1&perPage=1000"),
      fetchDataFromApi("/api/product/produit-nombre"),
      fetchDataFromApi("/api/user/liste-utilisateurs"),
      fetchDataFromApi("/api/seller/liste-vendeurs"),
    ]).then(([orders, products, users, sellers]) => {
      const allOrders = orders?.data || [];
      setStats({
        orders: allOrders.length,
        revenue: allOrders.reduce((s, o) => s + (o.totalAmt || 0), 0),
        commission: allOrders.reduce((s, o) => s + (o.totalCommission || 0), 0),
        products: products?.nombreDeProduits || 0,
        users: users?.data?.length || 0,
        sellers: sellers?.data?.length || 0,
      });
    });
  }, []);

  const boxes = [
    { label: "Commandes", value: stats.orders, icon: IoBagCheckOutline, color: "#3872fa" },
    { label: "Chiffre d'affaires", value: `${stats.revenue.toLocaleString()} Fcfa`, icon: AiTwotonePieChart, color: "#10b981" },
    { label: "Commissions Suguba", value: `${stats.commission.toLocaleString()} Fcfa`, icon: BsBank, color: "#7928ca" },
    { label: "Produits", value: stats.products, icon: RiProductHuntLine, color: "#312be1" },
    { label: "Utilisateurs", value: stats.users, icon: FaUsers, color: "#f59e0b" },
    { label: "Vendeurs", value: stats.sellers, icon: FaStore, color: "#ef4444" },
  ];

  return (
    <Swiper slidesPerView={4} spaceBetween={10} navigation modules={[Navigation]} className="dashboardBoxesSlider !mb-6">
      {boxes.map(({ label, value, icon: Icon, color }) => (
        <SwiperSlide key={label}>
          <div className="box !p-5 cursor-pointer !rounded-xl bg-white hover:!bg-[#fafafa] !border !border-[rgba(0,0,0,0.06)] flex items-center gap-4 shadow-sm">
            <Icon style={{ color }} className="!text-[38px]" />
            <div className="info w-[60%]">
              <p className="text-[12px] text-gray-400 !mb-0">{label}</p>
              <b className="text-[15px] font-[700]">{value}</b>
            </div>
            <IoStatsChartSharp style={{ color }} className="!text-[40px] opacity-40" />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}



{/*import { IoStatsChartSharp } from "react-icons/io5";
import { AiTwotonePieChart } from "react-icons/ai";
import { BsBank } from "react-icons/bs";
import { RiProductHuntLine } from "react-icons/ri";
import { IoBagCheckOutline } from "react-icons/io5";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import "swiper/css/navigation";
import { Navigation} from 'swiper/modules';


export default function DashboardBoxes (){
    return(
        <>
         <Swiper
        slidesPerView={4}
        spaceBetween={10}
        navigation={true}
        modules={[Navigation]}  
        className="dashboardBoxesSlider"
      >
        <SwiperSlide>
            <div className="box p-5 cursor-pointer !rounded-md bg-white hover:!bg-[#fafafa]
             !border !border-[rgba(0,0,0,0.1)] flex items-center gap-4">
                < IoBagCheckOutline className=" !text-[40px] !text-[#3872fa]"/>
                <div className="info w-[70%]">
                    <h3>commandes</h3>
                    <b>3335</b>
                </div>
                <IoStatsChartSharp className=" !text-[50px] !text-[#3872fa]"/>
             </div>
        </SwiperSlide>
         <SwiperSlide>
            <div className="box p-5 cursor-pointer !rounded-md bg-white hover:!bg-[#fafafa]
             !border !border-[rgba(0,0,0,0.1)] flex items-center gap-4">
                <AiTwotonePieChart  className=" !text-[40px] !text-[#10b981]"/>
                <div className="info w-[70%]">
                    <h3>Ventes</h3>
                    <b>333 453Fcfa</b>
                </div>
                <IoStatsChartSharp className=" !text-[50px] !text-[#10b981]"/>
             </div>
        </SwiperSlide>
         <SwiperSlide>
            <div className="box p-5 cursor-pointer !rounded-md bg-white hover:bg-[#fafafa]
             !border !border-[rgba(0,0,0,0.1)] flex items-center gap-4">
                <BsBank className=" !text-[40px] !text-[#7928ca]"/>
                <div className="info w-[70%]">
                    <h3>Revenues</h3>
                    <b>223 123Fcfa</b>
                </div>
                <IoStatsChartSharp className=" !text-[50px] !text-[#7928ca]"/>
             </div>
        </SwiperSlide>
         <SwiperSlide>
            <div className="box p-5 cursor-pointer !rounded-md bg-white hover:bg-[#fafafa]
             !border !border-[rgba(0,0,0,0.1)] flex items-center gap-4">
                <RiProductHuntLine   className=" !text-[40px] !text-[#312be1d8]"/>
                <div className="info w-[70%]">
                    <h3> Produits</h3>
                    <b>3335</b>
                </div>
                <IoStatsChartSharp className=" !text-[50px] !text-[#312be1d8]"/>
             </div>
        </SwiperSlide>
      </Swiper>

        </>
    )
}*/}