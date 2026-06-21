import { useState, useEffect, useContext } from "react";
import { Link, Routes, Route, NavLink, useNavigate } from "react-router-dom";
import { MyContext } from "../../../router";
import { fetchDataFromApi } from "../../../utils/api";
import CircularProgress from "@mui/material/CircularProgress";
import { FaStore, FaBoxOpen, FaShoppingBag, FaMoneyBillWave, FaChartLine, FaCog } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import SellerDashboard from "./SellerDashboard";
import SellerProducts from "./SellerProducts";
import SellerOrders from "./SellerOrders";
import SellerRevenue from "./SellerRevenue";
import SellerSettings from "./SellerSettings";

export default function SellerSpace() {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const [seller, setSeller] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!context.isLogin) { navigate("/connexion"); return; }
    if (!context.userData?.isSeller) { navigate("/devenir-vendeur"); return; }

    fetchDataFromApi("/api/seller/profil").then((res) => {
      if (res?.success) setSeller(res.data);
      setIsLoading(false);
    });
  }, [context.isLogin, context.userData]);

  if (isLoading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <CircularProgress />
    </div>
  );

  const navItems = [
    { to: "/espace-vendeur", label: "Dashboard", icon: MdDashboard, exact: true },
    { to: "/espace-vendeur/produits", label: "Mes Produits", icon: FaBoxOpen },
    { to: "/espace-vendeur/commandes", label: "Commandes", icon: FaShoppingBag },
    { to: "/espace-vendeur/revenus", label: "Revenus", icon: FaMoneyBillWave },
    { to: "/espace-vendeur/parametres", label: "Paramètres", icon: FaCog },
  ];

  return (
    <section className="!py-6 w-full bg-[#f8f9fa] min-h-screen">
      <div className="w-[95%] !mx-auto">
        {/* Header boutique */}
        <div className="bg-white shadow-sm rounded-xl !p-5 !mb-6 flex items-center gap-4">
          <div className="w-[60px] h-[60px] rounded-full overflow-hidden bg-pink-100 flex items-center justify-center">
            {seller?.shopLogo
              ? <img src={seller.shopLogo} className="w-full h-full object-cover" />
              : <FaStore className="text-[28px] text-primary" />
            }
          </div>
          <div>
            <h1 className="text-[20px] font-[700]">{seller?.shopName}</h1>
            <p className="text-[13px] text-gray-500">{seller?.shopDescription || "Votre boutique sur Suguba"}</p>
          </div>
          <Link to="/" className="!ml-auto text-[13px] text-primary hover:underline">
            Voir ma boutique →
          </Link>
        </div>

        <div className="flex gap-5">
          {/* Sidebar vendeur */}
          <div className="w-[20%]">
            <div className="bg-white shadow-sm rounded-xl overflow-hidden sticky top-[10px]">
              {navItems.map(({ to, label, icon: Icon, exact }) => (
                <NavLink key={to} to={to} end={exact}
                  className={({ isActive }) =>
                    `flex items-center gap-3 !px-5 !py-3 text-[14px] font-[500] transition-all border-b border-gray-50
                    ${isActive ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-50"}`
                  }>
                  <Icon className="text-[17px]" /> {label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Contenu */}
          <div className="w-[80%]">
            <Routes>
              <Route index element={<SellerDashboard seller={seller} />} />
              <Route path="produits" element={<SellerProducts />} />
              <Route path="commandes" element={<SellerOrders />} />
              <Route path="revenus" element={<SellerRevenue />} />
              <Route path="parametres" element={<SellerSettings seller={seller} setSeller={setSeller} />} />
            </Routes>
          </div>
        </div>
      </div>
    </section>
  );
}