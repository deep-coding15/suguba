import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { fetchDataFromApi } from "../../utils/api";
import Button from "@mui/material/Button";
import { FaPlus, FaStore, FaUsers, FaBoxOpen, FaMoneyBillWave, FaStar } from "react-icons/fa";
import { IoBagCheckOutline } from "react-icons/io5";
import { IoStatsChartSharp } from "react-icons/io5";
import { AiTwotonePieChart } from "react-icons/ai";
import { BsBank } from "react-icons/bs";
import { RiProductHuntLine } from "react-icons/ri";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { AiOutlineEdit } from "react-icons/ai";
import { MdPending, MdNotifications } from "react-icons/md";
import Pagination from "@mui/material/Pagination";
import CircularProgress from "@mui/material/CircularProgress";
import ProgressBar from "../ProgressBar/index";
import Badge from "../Badge/index";
import { Link } from "react-router-dom";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, BarChart, Bar
} from "recharts";

export default function Dashboard() {
  const context = useContext(MyContext);

  const [stats, setStats] = useState({
    totalOrders: 0, totalRevenue: 0, totalCommission: 0,
    totalProducts: 0, totalUsers: 0, totalSellers: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [featuredPending, setFeaturedPending] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openOrder, setOpenOrder] = useState(null);

  useEffect(() => { loadDashboard(); }, []);

  const loadDashboard = async () => {
    setIsLoading(true);
    try {
      const [ordersRes, productsRes, usersRes, sellersRes, featuredRes] = await Promise.all([
        fetchDataFromApi("/api/orders?page=1&perPage=5"),
        fetchDataFromApi("/api/product/produits?page=1&perPage=5"),
        fetchDataFromApi("/api/user/liste-utilisateurs"),
        fetchDataFromApi("/api/seller/liste-vendeurs"),
        fetchDataFromApi("/api/product/demandes-mise-en-avant"),
      ]);

      setRecentOrders(ordersRes?.data || []);
      setRecentProducts(productsRes?.produits || []);
      setFeaturedPending(featuredRes?.data || []);

      const orders = ordersRes?.data || [];
      const totalRevenue = orders.reduce((s, o) => s + (o.totalAmt || 0), 0);
      const totalCommission = orders.reduce((s, o) => s + (o.totalCommission || 0), 0);

      setStats({
        totalOrders: ordersRes?.total || orders.length,
        totalRevenue, totalCommission,
        totalProducts: productsRes?.produits?.length || 0,
        totalUsers: usersRes?.data?.length || 0,
        totalSellers: sellersRes?.data?.length || 0,
      });

      const months = ["Nov", "Déc", "Jan", "Fév", "Mar", "Avr"];
      setChartData(months.map((m) => ({
        name: m,
        Commandes: Math.floor(Math.random() * 50) + 10,
        Revenus: Math.floor(Math.random() * 500000) + 50000,
        Commissions: Math.floor(Math.random() * 50000) + 5000,
      })));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    { label: "Commandes", value: stats.totalOrders, icon: IoBagCheckOutline, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Revenus Bruts", value: `${stats.totalRevenue?.toLocaleString()} Fcfa`, icon: AiTwotonePieChart, color: "text-green-500", bg: "bg-green-50" },
    { label: "Commissions", value: `${stats.totalCommission?.toLocaleString()} Fcfa`, icon: BsBank, color: "text-purple-500", bg: "bg-purple-50" },
    { label: "Produits", value: stats.totalProducts, icon: RiProductHuntLine, color: "text-orange-500", bg: "bg-orange-50" },
    { label: "Utilisateurs", value: stats.totalUsers, icon: FaUsers, color: "text-pink-500", bg: "bg-pink-50" },
    { label: "Vendeurs", value: stats.totalSellers, icon: FaStore, color: "text-yellow-600", bg: "bg-yellow-50" },
  ];

  return (
    <>
      {/* Hero */}
      <div className="w-full !py-4 !px-6 rounded-xl !bg-white !border !border-[rgba(0,0,0,0.08)] flex items-center gap-8 !mb-6 shadow-sm">
        <div className="info flex-1">
          <h1 className="!text-[26px] font-bold leading-9 !mb-1">
            Bonjour, {context?.userData?.name || "Admin"} 👋
          </h1>
          <p className="text-gray-500 text-[14px] !mb-3">Voici l'activité de Suguba aujourd'hui.</p>
          <div className="flex gap-3">
            <Button className="btn-pink !capitalize flex gap-2 !text-[13px]"
              onClick={() => context.setIsOpenFullScreen({ open: true, model: "Ajouter un produit" })}>
              <FaPlus /> Ajouter un produit
            </Button>
            <Button className="!bg-yellow-400 !text-yellow-900 !capitalize flex gap-2 !text-[13px] !font-[600]"
              onClick={() => context.setIsOpenFullScreen({ open: true, model: "Ajouter une Affiche" })}>
              <FaStar /> Gérer les slides
            </Button>
          </div>
        </div>
        <img src="https://imgs.search.brave.com/yidLNeAlOis93k7FwAsb5tKOR46fIEXxKLbeh8vtfq0/rs:fit:0:180:1:0/g:ce/aHR0cHM6Ly93d3cu/YWZyaWNhLW5ld3Ny/b29tLmNvbS9maWxl/cy9sYXJnZS83M2Rl/MmQ3MTcxZTAzYjYv/MjAwLzE1MA"
          className="w-[180px] h-[130px] object-contain" />
      </div>

      {/* Alerte demandes de mise en avant */}
      {featuredPending.length > 0 && (
        <div className="!mb-6 bg-yellow-50 border border-yellow-300 rounded-xl !p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-[42px] h-[42px] bg-yellow-400 rounded-full flex items-center justify-center">
              <MdNotifications className="text-white text-[22px]" />
            </div>
            <div>
              <p className="text-[14px] font-[700] text-yellow-800">
                {featuredPending.length} demande{featuredPending.length > 1 ? "s" : ""} de mise en avant en attente
              </p>
              <p className="text-[12px] text-yellow-700">
                Des vendeurs souhaitent mettre leurs produits en avant sur l'accueil (commission 15%)
              </p>
            </div>
          </div>
          <Button
            className="!bg-yellow-400 !text-yellow-900 !capitalize !font-[600] !text-[13px]"
            onClick={() => context.setIsOpenFullScreen({ open: true, model: "Ajouter une Affiche" })}>
            Voir les demandes →
          </Button>
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-4 !mb-6">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-xl shadow-sm !p-5 flex items-center gap-4 border border-[rgba(0,0,0,0.05)]">
            <div className={`w-[50px] h-[50px] rounded-full ${bg} flex items-center justify-center`}>
              <Icon className={`text-[22px] ${color}`} />
            </div>
            <div>
              <h3 className="text-[20px] font-[700]">{value}</h3>
              <p className="text-[12px] text-gray-500">{label}</p>
            </div>
            <IoStatsChartSharp className={`text-[36px] ${color} !ml-auto opacity-20`} />
          </div>
        ))}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-2 gap-4 !mb-6">
        <div className="bg-white rounded-xl shadow-sm !p-5">
          <h3 className="text-[15px] font-[600] !mb-4">Commandes (6 derniers mois)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Commandes" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl shadow-sm !p-5">
          <h3 className="text-[15px] font-[600] !mb-4">Revenus vs Commissions</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => `${v?.toLocaleString()} Fcfa`} />
              <Legend />
              <Bar dataKey="Revenus" fill="#10b981" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Commissions" fill="#8b5cf6" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Produits récents */}
      <div className="card !my-4 shadow-sm rounded-xl bg-white !p-5">
        <div className="flex items-center justify-between !mb-4">
          <h2 className="text-[16px] font-[600]">Produits récents</h2>
          <Link to="/produits" className="text-primary text-[13px] hover:underline">Voir tout →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-600 uppercase bg-gray-50">
              <tr>
                <th className="!px-4 !py-3">Produit</th>
                <th className="!px-4 !py-3">Catégorie</th>
                <th className="!px-4 !py-3">Vendeur</th>
                <th className="!px-4 !py-3">Prix</th>
                <th className="!px-4 !py-3">Stock</th>
                <th className="!px-4 !py-3">Ventes</th>
                <th className="!px-4 !py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentProducts.map((product) => (
                <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="!px-4 !py-3">
                    <div className="flex items-center gap-3">
                      <img src={product.images?.[0]} className="w-[42px] h-[42px] object-cover rounded-lg" alt={product.name} />
                      <div>
                        <p className="font-[500] text-[12px] line-clamp-1">{product.name}</p>
                        <p className="text-[10px] text-gray-400">{product.brand}</p>
                        {product.featuredRequest?.status === "pending" && (
                          <span className="text-[10px] bg-yellow-100 text-yellow-700 !px-1 rounded flex items-center gap-1 w-fit">
                            <MdPending className="text-[10px]" /> Mise en avant en attente
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="!px-4 !py-3 text-[12px]">{product.catName}</td>
                  <td className="!px-4 !py-3 text-[12px] text-primary">{product.sellerName || "Suguba"}</td>
                  <td className="!px-4 !py-3 font-[600] text-primary text-[12px]">{product.price?.toLocaleString()} Fcfa</td>
                  <td className="!px-4 !py-3">
                    <span className={`text-[12px] font-[600] ${product.countInStock < 5 ? "text-red-500" : "text-green-600"}`}>
                      {product.countInStock}
                    </span>
                  </td>
                  <td className="!px-4 !py-3">
                    <span className="text-[12px] font-[600]">{product.sales || 0}</span>
                    <ProgressBar type="warning" value={Math.min(100, ((product.sales || 0) / 500) * 100)} />
                  </td>
                  <td className="!px-4 !py-3">
                    <Button className="!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !bg-blue-50"
                      onClick={() => context.setIsOpenFullScreen({ open: true, model: "Modifier un produit", id: product._id })}>
                      <AiOutlineEdit className="text-blue-600 text-[14px]" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Commandes récentes */}
      <div className="card !my-4 shadow-sm rounded-xl bg-white !p-5">
        <div className="flex items-center justify-between !mb-4">
          <h2 className="text-[16px] font-[600]">Commandes récentes</h2>
          <Link to="/liste-commandes" className="text-primary text-[13px] hover:underline">Voir tout →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-600 uppercase bg-gray-50">
              <tr>
                <th className="!px-4 !py-3">&nbsp;</th>
                <th className="!px-4 !py-3">Id</th>
                <th className="!px-4 !py-3">Client</th>
                <th className="!px-4 !py-3">Total</th>
                <th className="!px-4 !py-3">Commission</th>
                <th className="!px-4 !py-3">Paiement</th>
                <th className="!px-4 !py-3">Statut</th>
                <th className="!px-4 !py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, index) => (
                <>
                  <tr key={order._id} className="border-b border-gray-100">
                    <td className="!px-4 !py-3">
                      <Button className="!w-[28px] !h-[28px] !min-w-[28px] !rounded-full !bg-gray-100"
                        onClick={() => setOpenOrder(openOrder === index ? null : index)}>
                        {openOrder === index ? <FaAngleUp className="text-[11px]" /> : <FaAngleDown className="text-[11px]" />}
                      </Button>
                    </td>
                    <td className="!px-4 !py-3 text-primary font-[600] text-[12px]">{order.orderId}</td>
                    <td className="!px-4 !py-3 text-[12px]">{order.userId?.name}</td>
                    <td className="!px-4 !py-3 font-[600] text-[12px]">{order.totalAmt?.toLocaleString()} Fcfa</td>
                    <td className="!px-4 !py-3 text-purple-600 font-[600] text-[12px]">{order.totalCommission?.toLocaleString()} Fcfa</td>
                    <td className="!px-4 !py-3"><Badge status={order.paymentStatus} /></td>
                    <td className="!px-4 !py-3"><Badge status={order.status} /></td>
                    <td className="!px-4 !py-3 text-[11px] text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                  </tr>
                  {openOrder === index && (
                    <tr>
                      <td colSpan={8} className="!px-8 !py-3 bg-gray-50">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="!px-3 !py-2 text-left text-[10px]">Image</th>
                              <th className="!px-3 !py-2 text-left text-[10px]">Produit</th>
                              <th className="!px-3 !py-2 text-[10px]">Vendeur</th>
                              <th className="!px-3 !py-2 text-[10px]">Qté</th>
                              <th className="!px-3 !py-2 text-[10px]">Sous-total</th>
                              <th className="!px-3 !py-2 text-[10px]">Commission</th>
                              <th className="!px-3 !py-2 text-[10px]">Net vendeur</th>
                              <th className="!px-3 !py-2 text-[10px]">Statut article</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.items?.map((item) => (
                              <tr key={item._id} className="border-b border-gray-100">
                                <td className="!px-3 !py-2"><img src={item.productImage} className="w-[32px] h-[32px] rounded-md object-cover" /></td>
                                <td className="!px-3 !py-2 text-[11px]">{item.productName}</td>
                                <td className="!px-3 !py-2 text-[11px] text-primary">{item.sellerName}</td>
                                <td className="!px-3 !py-2 text-[11px] text-center">{item.quantity}</td>
                                <td className="!px-3 !py-2 text-[11px] font-[600]">{item.subtotal?.toLocaleString()} Fcfa</td>
                                <td className="!px-3 !py-2 text-[11px] text-purple-600">{item.commission?.toLocaleString()} Fcfa</td>
                                <td className="!px-3 !py-2 text-[11px] text-green-600">{item.sellerRevenue?.toLocaleString()} Fcfa</td>
                                <td className="!px-3 !py-2"><Badge status={item.status} /></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}




{/*import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { fetchDataFromApi } from "../../utils/api";
import Button from "@mui/material/Button";
import { FaPlus, FaStore, FaUsers, FaBoxOpen, FaMoneyBillWave } from "react-icons/fa";
import { IoBagCheckOutline } from "react-icons/io5";
import { IoStatsChartSharp } from "react-icons/io5";
import { AiTwotonePieChart } from "react-icons/ai";
import { BsBank } from "react-icons/bs";
import { RiProductHuntLine } from "react-icons/ri";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { AiOutlineEdit } from "react-icons/ai";
import { BsTrash } from "react-icons/bs";
import { FaRegEye } from "react-icons/fa6";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import Pagination from "@mui/material/Pagination";
import CircularProgress from "@mui/material/CircularProgress";
import ProgressBar from "../ProgressBar/index";
import Badge from "../Badge/index";
import { Link } from "react-router-dom";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, BarChart, Bar
} from "recharts";

const label = { slotProps: { input: { "aria-label": "Checkbox demo" } } };

export default function Dashboard() {
  const context = useContext(MyContext);

  // Stats
  const [stats, setStats] = useState({
    totalOrders: 0, totalRevenue: 0, totalCommission: 0,
    totalProducts: 0, totalUsers: 0, totalSellers: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openOrder, setOpenOrder] = useState(null);
  const [categoryFilterVal, setCategoryFilterVal] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setIsLoading(true);
    try {
      // Commandes récentes
      const ordersRes = await fetchDataFromApi("/api/orders?page=1&perPage=5");
      setRecentOrders(ordersRes?.data || []);

      // Produits récents
      const productsRes = await fetchDataFromApi("/api/product/produits?page=1&perPage=5");
      setRecentProducts(productsRes?.produits || []);

      // Utilisateurs
      const usersRes = await fetchDataFromApi("/api/user/liste-utilisateurs");

      // Vendeurs
      const sellersRes = await fetchDataFromApi("/api/seller/liste-vendeurs");

      // Calcul stats depuis les commandes
      const orders = ordersRes?.data || [];
      const totalRevenue = orders.reduce((s, o) => s + (o.totalAmt || 0), 0);
      const totalCommission = orders.reduce((s, o) => s + (o.totalCommission || 0), 0);

      setStats({
        totalOrders: ordersRes?.total || orders.length,
        totalRevenue, totalCommission,
        totalProducts: productsRes?.produits?.length || 0,
        totalUsers: usersRes?.data?.length || 0,
        totalSellers: sellersRes?.data?.length || 0,
      });

      // Données graphique (6 derniers mois simulés)
      const months = ["Nov", "Déc", "Jan", "Fév", "Mar", "Avr"];
      setChartData(months.map((m, i) => ({
        name: m,
        Commandes: Math.floor(Math.random() * 50) + 10,
        Revenus: Math.floor(Math.random() * 500000) + 50000,
        Commissions: Math.floor(Math.random() * 50000) + 5000,
      })));

    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    { label: "Commandes", value: stats.totalOrders, icon: IoBagCheckOutline, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Revenus Bruts", value: `${stats.totalRevenue?.toLocaleString()} Fcfa`, icon: AiTwotonePieChart, color: "text-green-500", bg: "bg-green-50" },
    { label: "Commissions Suguba", value: `${stats.totalCommission?.toLocaleString()} Fcfa`, icon: BsBank, color: "text-purple-500", bg: "bg-purple-50" },
    { label: "Produits", value: stats.totalProducts, icon: RiProductHuntLine, color: "text-orange-500", bg: "bg-orange-50" },
    { label: "Utilisateurs", value: stats.totalUsers, icon: FaUsers, color: "text-pink-500", bg: "bg-pink-50" },
    { label: "Vendeurs", value: stats.totalSellers, icon: FaStore, color: "text-yellow-600", bg: "bg-yellow-50" },
  ];

  return (
    <>
      
      <div className="w-full !py-4 !px-6 rounded-xl !bg-white !border !border-[rgba(0,0,0,0.08)] flex items-center gap-8 !mb-6 shadow-sm">
        <div className="info flex-1">
          <h1 className="!text-[28px] font-bold leading-9 !mb-2">
            Bonjour, {context?.userData?.name || "Admin"} 👋
          </h1>
          <p className="text-gray-500 text-[14px]">Voici ce qui se passe sur Suguba aujourd'hui.</p>
          <br />
          <Button className="btn-pink !capitalize flex gap-2"
            onClick={() => context.setIsOpenFullScreen({ open: true, model: "Ajouter un produit" })}>
            <FaPlus /> Ajouter un produit
          </Button>
        </div>
        <img src="https://imgs.search.brave.com/yidLNeAlOis93k7FwAsb5tKOR46fIEXxKLbeh8vtfq0/rs:fit:0:180:1:0/g:ce/aHR0cHM6Ly93d3cu/YWZyaWNhLW5ld3Ny/b29tLmNvbS9maWxl/cy9sYXJnZS83M2Rl/MmQ3MTcxZTAzYjYv/MjAwLzE1MA"
          className="w-[200px] h-[150px] object-contain" />
      </div>

     
      <div className="grid grid-cols-3 gap-4 !mb-6">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-xl shadow-sm !p-5 flex items-center gap-4 border border-[rgba(0,0,0,0.05)]">
            <div className={`w-[50px] h-[50px] rounded-full ${bg} flex items-center justify-center`}>
              <Icon className={`text-[24px] ${color}`} />
            </div>
            <div>
              <h3 className="text-[22px] font-[700]">{value}</h3>
              <p className="text-[13px] text-gray-500">{label}</p>
            </div>
            <IoStatsChartSharp className={`text-[40px] ${color} !ml-auto opacity-20`} />
          </div>
        ))}
      </div>

      
      <div className="grid grid-cols-2 gap-4 !mb-6">
        <div className="bg-white rounded-xl shadow-sm !p-5">
          <h3 className="text-[16px] font-[600] !mb-4">Commandes (6 derniers mois)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Commandes" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm !p-5">
          <h3 className="text-[16px] font-[600] !mb-4">Revenus vs Commissions</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => `${v?.toLocaleString()} Fcfa`} />
              <Legend />
              <Bar dataKey="Revenus" fill="#10b981" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Commissions" fill="#8b5cf6" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      
      <div className="card !my-4 shadow-sm rounded-xl bg-white !p-5">
        <div className="flex items-center justify-between !mb-4">
          <h2 className="text-[17px] font-[600]">Produits récents</h2>
          <Link to="/produits" className="text-primary text-[13px] hover:underline">Voir tout →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-600 uppercase bg-gray-50">
              <tr>
                <th className="!px-4 !py-3">Produit</th>
                <th className="!px-4 !py-3">Catégorie</th>
                <th className="!px-4 !py-3">Vendeur</th>
                <th className="!px-4 !py-3">Prix</th>
                <th className="!px-4 !py-3">Stock</th>
                <th className="!px-4 !py-3">Ventes</th>
                <th className="!px-4 !py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentProducts.map((product) => (
                <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="!px-4 !py-3">
                    <div className="flex items-center gap-3">
                      <img src={product.images?.[0]} className="w-[45px] h-[45px] object-cover rounded-lg" alt={product.name} />
                      <div>
                        <p className="font-[500] text-[13px] line-clamp-1">{product.name}</p>
                        <p className="text-[11px] text-gray-400">{product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="!px-4 !py-3 text-[13px]">{product.catName}</td>
                  <td className="!px-4 !py-3 text-[13px] text-primary">{product.sellerName || "Suguba"}</td>
                  <td className="!px-4 !py-3 font-[600] text-primary text-[13px]">{product.price?.toLocaleString()} Fcfa</td>
                  <td className="!px-4 !py-3">
                    <span className={`text-[12px] font-[600] ${product.countInStock < 5 ? "text-red-500" : "text-green-600"}`}>
                      {product.countInStock}
                    </span>
                  </td>
                  <td className="!px-4 !py-3">
                    <div>
                      <span className="text-[12px] font-[600]">{product.sales || 0}</span>
                      <ProgressBar type="warning" value={Math.min(100, ((product.sales || 0) / 500) * 100)} />
                    </div>
                  </td>
                  <td className="!px-4 !py-3">
                    <div className="flex gap-1">
                      <Button className="!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !bg-blue-50"
                        onClick={() => context.setIsOpenFullScreen({ open: true, model: "Modifier un produit", id: product._id })}>
                        <AiOutlineEdit className="text-blue-600 text-[15px]" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      
      <div className="card !my-4 shadow-sm rounded-xl bg-white !p-5">
        <div className="flex items-center justify-between !mb-4">
          <h2 className="text-[17px] font-[600]">Commandes récentes</h2>
          <Link to="/liste-commandes" className="text-primary text-[13px] hover:underline">Voir tout →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-600 uppercase bg-gray-50">
              <tr>
                <th className="!px-4 !py-3">&nbsp;</th>
                <th className="!px-4 !py-3">Id Commande</th>
                <th className="!px-4 !py-3">Client</th>
                <th className="!px-4 !py-3">Total</th>
                <th className="!px-4 !py-3">Commission</th>
                <th className="!px-4 !py-3">Paiement</th>
                <th className="!px-4 !py-3">Statut</th>
                <th className="!px-4 !py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, index) => (
                <>
                  <tr key={order._id} className="border-b border-gray-100">
                    <td className="!px-4 !py-3">
                      <Button className="!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !bg-gray-100"
                        onClick={() => setOpenOrder(openOrder === index ? null : index)}>
                        {openOrder === index ? <FaAngleUp className="text-[13px]" /> : <FaAngleDown className="text-[13px]" />}
                      </Button>
                    </td>
                    <td className="!px-4 !py-3 text-primary font-[600] text-[13px]">{order.orderId}</td>
                    <td className="!px-4 !py-3 text-[13px]">{order.userId?.name}</td>
                    <td className="!px-4 !py-3 font-[600] text-[13px]">{order.totalAmt?.toLocaleString()} Fcfa</td>
                    <td className="!px-4 !py-3 text-purple-600 font-[600] text-[13px]">{order.totalCommission?.toLocaleString()} Fcfa</td>
                    <td className="!px-4 !py-3"><Badge status={order.paymentStatus} /></td>
                    <td className="!px-4 !py-3"><Badge status={order.status} /></td>
                    <td className="!px-4 !py-3 text-[12px] text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                  </tr>
                  {openOrder === index && (
                    <tr>
                      <td colSpan={8} className="!px-8 !py-3 bg-gray-50">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="!px-3 !py-2 text-left text-[11px]">Image</th>
                              <th className="!px-3 !py-2 text-left text-[11px]">Produit</th>
                              <th className="!px-3 !py-2 text-[11px]">Vendeur</th>
                              <th className="!px-3 !py-2 text-[11px]">Qté</th>
                              <th className="!px-3 !py-2 text-[11px]">Prix</th>
                              <th className="!px-3 !py-2 text-[11px]">Commission</th>
                              <th className="!px-3 !py-2 text-[11px]">Net vendeur</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.items?.map((item) => (
                              <tr key={item._id} className="border-b border-gray-100">
                                <td className="!px-3 !py-2"><img src={item.productImage} className="w-[35px] h-[35px] rounded-md object-cover" /></td>
                                <td className="!px-3 !py-2 text-[12px]">{item.productName}</td>
                                <td className="!px-3 !py-2 text-[12px] text-primary">{item.sellerName}</td>
                                <td className="!px-3 !py-2 text-[12px] text-center">{item.quantity}</td>
                                <td className="!px-3 !py-2 text-[12px] font-[600]">{item.subtotal?.toLocaleString()} Fcfa</td>
                                <td className="!px-3 !py-2 text-[12px] text-purple-600">{item.commission?.toLocaleString()} Fcfa</td>
                                <td className="!px-3 !py-2 text-[12px] text-green-600">{item.sellerRevenue?.toLocaleString()} Fcfa</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

*/}











{/*import { useState, useEffect, useContext } from "react";
import { useContext as uc } from "react";
import Button from "@mui/material/Button";
import { FaPlus, FaUsers, FaShoppingBag, FaStore, FaChartLine } from "react-icons/fa";
import { MdAttachMoney, MdInventory } from "react-icons/md";
import { AiOutlineEdit } from "react-icons/ai";
import { BsTrash } from "react-icons/bs";
import { FaAngleUp, FaAngleDown } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import Badge from "../Badge/index";
import ProgressBar from "../ProgressBar/index";
import { MyContext } from "../../App";
import { fetchDataFromApi, deleteData } from "../../utils/api";

const label = { slotProps: { input: { "aria-label": "Checkbox demo" } } };

export default function Dashboard() {
  const context = useContext(MyContext);
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openOrder, setOpenOrder] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setIsLoading(true);
    try {
      // Commandes récentes
      const ordersRes = await fetchDataFromApi("/api/orders?page=1&perPage=5");
      setRecentOrders(ordersRes?.data || []);

      // Produits récents
      const productsRes = await fetchDataFromApi("/api/product/produits?page=1&perPage=5");
      setRecentProducts(productsRes?.produits || []);

      // Stats globales
      const usersRes = await fetchDataFromApi("/api/user/liste-utilisateurs");
      const productCountRes = await fetchDataFromApi("/api/product/produit-nombre");

      const totalOrders = ordersRes?.total || 0;
      const totalRevenue = (ordersRes?.data || []).reduce((s, o) => s + (o.totalCommission || 0), 0);
      const totalUsers = usersRes?.data?.length || 0;
      const totalProducts = productCountRes?.nombreDeProduits || 0;

      setStats({ totalOrders, totalRevenue, totalUsers, totalProducts });

      // Données graphique mensuel (simulé avec les vraies commandes)
      const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"];
      const allOrders = ordersRes?.data || [];
      const chartByMonth = months.map((name, i) => {
        const monthOrders = allOrders.filter(o => new Date(o.createdAt).getMonth() === i);
        return {
          name,
          Commandes: monthOrders.length,
          Commission: monthOrders.reduce((s, o) => s + (o.totalCommission || 0), 0),
        };
      });
      setChartData(chartByMonth);
    } catch (err) {
      console.error("Dashboard error:", err);
    }
    setIsLoading(false);
  };

  const statsCards = [
    { label: "Commandes totales", value: stats?.totalOrders || 0, icon: FaShoppingBag, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Commission Suguba", value: `${(stats?.totalRevenue || 0).toLocaleString()} Fcfa`, icon: MdAttachMoney, color: "text-green-600", bg: "bg-green-50" },
    { label: "Utilisateurs", value: stats?.totalUsers || 0, icon: FaUsers, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Produits", value: stats?.totalProducts || 0, icon: MdInventory, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  return (
    <>
      
      <div className="w-full !py-4 !px-5 rounded-xl !bg-gradient-to-r from-[rgb(132,132,31)] to-[rgb(80,80,20)] text-white flex items-center justify-between !mb-6">
        <div>
          <h1 className="text-[28px] font-[700] leading-8 !mb-2">
            Bonjour, {context?.userData?.name} 👋
          </h1>
          <p className="opacity-80 text-[14px]">Voici un aperçu de Suguba aujourd'hui</p>
          <div className="flex gap-3 !mt-3">
            <Button className="!bg-white !text-[rgb(132,132,31)] !font-[700] btn-sm"
              onClick={() => context.setIsOpenFullScreen({ open: true, model: "Ajouter un produit" })}>
              <FaPlus className="!mr-1" /> Ajouter un produit
            </Button>
          </div>
        </div>
        <img src="https://imgs.search.brave.com/yidLNeAlOis93k7FwAsb5tKOR46fIEXxKLbeh8vtfq0/rs:fit:0:180:1:0/g:ce/aHR0cHM6Ly93d3cu/YWZyaWNhLW5ld3Ny/b29tLmNvbS9maWxl/cy9sYXJnZS83M2Rl/MmQ3MTcxZTAzYjYv/MjAwLzE1MA"
          className="w-[150px] object-contain hidden lg:block" />
      </div>

      
      {isLoading ? (
        <div className="flex justify-center !py-10"><CircularProgress /></div>
      ) : (
        <div className="grid grid-cols-4 gap-4 !mb-6">
          {statsCards.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-xl shadow-sm !p-5 flex items-center gap-4">
              <div className={`w-[50px] h-[50px] rounded-full ${bg} ${color} flex items-center justify-center`}>
                <Icon className="text-[22px]" />
              </div>
              <div>
                <h3 className="text-[22px] font-[700]">{value}</h3>
                <p className="text-[12px] text-gray-400 !mb-0">{label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      
      <div className="card !my-4 shadow-md sm:rounded-lg bg-white !p-5 !mb-6">
        <h2 className="text-[16px] font-[600] !mb-4">Évolution des Commandes & Commissions</h2>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Commandes" stroke="#3872fa" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="Commission" stroke="rgb(132,132,31)" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

     
      <div className="card !my-4 shadow-md sm:rounded-lg bg-white !mb-6">
        <div className="flex items-center justify-between !px-5 !py-4">
          <h2 className="text-[16px] font-[600]">Produits récents</h2>
          <Link to="/produits" className="text-[13px] text-primary hover:underline">Voir tous →</Link>
        </div>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th className="!px-4 !py-3">Produit</th>
                <th className="!px-4 !py-3">Catégorie</th>
                <th className="!px-4 !py-3">Prix</th>
                <th className="!px-4 !py-3">Stock</th>
                <th className="!px-4 !py-3">Ventes</th>
                <th className="!px-4 !py-3">Vendeur</th>
              </tr>
            </thead>
            <tbody>
              {recentProducts.map(product => (
                <tr key={product._id} className="bg-white border-b border-gray-100 hover:bg-gray-50">
                  <td className="!px-4 !py-3">
                    <div className="flex items-center gap-3">
                      <img src={product.images?.[0]} className="w-[45px] h-[45px] object-cover rounded-md" />
                      <span className="text-[13px] font-[500] line-clamp-1 max-w-[150px]">{product.name}</span>
                    </div>
                  </td>
                  <td className="!px-4 !py-3 text-[13px]">{product.catName}</td>
                  <td className="!px-4 !py-3 text-primary font-[600] text-[13px]">{product.price?.toLocaleString()} Fcfa</td>
                  <td className="!px-4 !py-3">
                    <span className={`text-[12px] font-[600] ${product.countInStock < 5 ? "text-red-500" : "text-green-600"}`}>
                      {product.countInStock}
                    </span>
                  </td>
                  <td className="!px-4 !py-3 text-[13px]">{product.sales || 0}</td>
                  <td className="!px-4 !py-3 text-[12px] text-gray-500">{product.sellerName || "Suguba"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      
      <div className="card !my-4 shadow-md sm:rounded-lg bg-white">
        <div className="flex items-center justify-between !px-5 !py-4">
          <h2 className="text-[16px] font-[600]">Commandes récentes</h2>
          <Link to="/liste-commandes" className="text-[13px] text-primary hover:underline">Voir toutes →</Link>
        </div>
        <div className="relative overflow-x-auto !pb-4">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th className="!px-4 !py-3">&nbsp;</th>
                <th className="!px-4 !py-3">Id Commande</th>
                <th className="!px-4 !py-3">Client</th>
                <th className="!px-4 !py-3">Total</th>
                <th className="!px-4 !py-3">Commission</th>
                <th className="!px-4 !py-3">Statut</th>
                <th className="!px-4 !py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, index) => (
                <>
                  <tr key={order._id} className="bg-white border-b border-gray-100">
                    <td className="!px-4 !py-3">
                      <Button className="!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !bg-gray-100"
                        onClick={() => setOpenOrder(openOrder === index ? null : index)}>
                        {openOrder === index ? <FaAngleUp className="text-[14px]" /> : <FaAngleDown className="text-[14px]" />}
                      </Button>
                    </td>
                    <td className="!px-4 !py-3 text-primary font-[600] text-[13px]">{order.orderId}</td>
                    <td className="!px-4 !py-3 text-[13px]">{order.userId?.name || "—"}</td>
                    <td className="!px-4 !py-3 font-[600] text-[13px]">{order.totalAmt?.toLocaleString()} Fcfa</td>
                    <td className="!px-4 !py-3 text-green-600 font-[600] text-[13px]">{order.totalCommission?.toLocaleString()} Fcfa</td>
                    <td className="!px-4 !py-3"><Badge status={order.status} /></td>
                    <td className="!px-4 !py-3 text-[12px] text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                  </tr>
                  {openOrder === index && (
                    <tr>
                      <td colSpan={7} className="!px-8 !py-3 bg-gray-50">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="!px-3 !py-2 text-left">Image</th>
                              <th className="!px-3 !py-2 text-left">Produit</th>
                              <th className="!px-3 !py-2">Qté</th>
                              <th className="!px-3 !py-2">Prix</th>
                              <th className="!px-3 !py-2">Commission</th>
                              <th className="!px-3 !py-2">Vendeur</th>
                              <th className="!px-3 !py-2">Statut</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.items?.map(item => (
                              <tr key={item._id} className="border-b border-gray-100">
                                <td className="!px-3 !py-2">
                                  <img src={item.productImage} className="w-[40px] h-[40px] object-cover rounded-md" />
                                </td>
                                <td className="!px-3 !py-2 text-[13px] font-[500]">{item.productName}</td>
                                <td className="!px-3 !py-2 text-center">{item.quantity}</td>
                                <td className="!px-3 !py-2 text-primary font-[600]">{item.subtotal?.toLocaleString()} Fcfa</td>
                                <td className="!px-3 !py-2 text-green-600 font-[600]">{item.commission?.toLocaleString()} Fcfa</td>
                                <td className="!px-3 !py-2 text-[12px]">{item.sellerName || "Suguba"}</td>
                                <td className="!px-3 !py-2"><Badge status={item.status} /></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
*/}







{/*import Button from "@mui/material/Button";
import DashboardBoxes from "../DashboardBoxes";
import { FaPlus, FaRegEye } from "react-icons/fa6";
import { FaAngleUp } from "react-icons/fa6";
import { FaAngleDown } from "react-icons/fa6";
import Badge from "../Badge/index";
import { useState } from "react";
import Checkbox from '@mui/material/Checkbox';
import { Link } from "react-router-dom";
import ProgressBar from "../ProgressBar/index";
import { AiOutlineEdit } from "react-icons/ai";
import Pagination from '@mui/material/Pagination';
import {BsTrash } from "react-icons/bs";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const label = { slotProps: { input: { 'aria-label': 'Checkbox demo' } } };
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,ResponsiveContainer, Area } from 'recharts';
import { useContext } from "react";
import { MyContext } from "../../App";







export default function Dashboard(){
const [chart1Data,setChart1Data]=useState(
     [
  {
    name: 'Janvier',
    TotaleUtilisateur: 4000,
    TotaleVente: 2400,
    amt: 2400,
  },
  {
    name: 'Fevrier',
    TotaleUtilisateur: 3000,
    TotaleVente: 1398,
    amt: 2210,
  },
  {
    name: 'Mars',
    TotaleUtilisateur: 2000,
    TotaleVente: 9800,
    amt: 2290,
  },
  {
    name: 'Avril',
    TotaleUtilisateur: 2780,
    TotaleVente: 3908,
    amt: 2000,
  },
  {
    name: 'Mai',
    TotaleUtilisateur: 1890,
    TotaleVente: 4800,
    amt: 2181,
  },
  {
    name: 'Juin',
    TotaleUtilisateur: 2390,
    TotaleVente: 3800,
    amt: 2500,
  },
  {
    name: 'Juillet',
    TotaleUtilisateur: 3490,
    TotaleVente: 4300,
    amt: 2100,
  },
  {
    name: 'Août',
    TotaleUtilisateur: 3490,
    TotaleVente: 4300,
    amt: 2100,
  },
  {
    name: 'Septembre',
    TotaleUtilisateur: 3490,
    TotaleVente: 4300,
    amt: 2100,
  },
  {
    name: 'Octobre',
    TotaleUtilisateur: 3490,
    TotaleVente: 4300,
    amt: 2100,
  },
  {
    name: 'Novembre',
    TotaleUtilisateur: 3490,
    TotaleVente: 4300,
    amt: 2100,
  },
  {
    name: 'Decembre',
    TotaleUtilisateur: 3490,
    TotaleVente: 4300,
    amt: 2100,
  },
]

);
const [categoryFilterVal,setCategoryFilterVal] =useState('');

  const handleChangeCatFilter = (event) => {
    setCategoryFilterVal(event.target.value);
  };


    const [isOpenOrderProduct,setIsOpenOrderProduct]=useState(null);
                   const isShowOrderProduct=(index)=>{
                    if (isOpenOrderProduct===index) {
                        setIsOpenOrderProduct(null);
                    }
                    else{
                        setIsOpenOrderProduct(index);
                    }
                   }
    const context =useContext(MyContext);
    return(
        <>
        <div  className="w-full !py-2 !px-5 rounded-md justify-between !bg-[#fafafa]
             !border !border-[rgba(0,0,0,0.1)] flex items-center gap-8 !mb-5">
                <div className="info">
                    <h1 className="!text-[35px] font-bold leading-10 !mb-3">Bonjour,<br/>
                    Adja Sitan{" "}</h1>
                    <p>Voici ce qui se passe sur suguba aujourd'hui.Regarde les statistiques en premier</p>
                     <br/>
                    <Button className="btn-pink !capitalize"
                     onClick={()=>context.setIsOpenFullScreen({open:true,model:"Ajouter un produit"})}><FaPlus/>Ajouter un produit</Button>
                </div>
                <img src="https://imgs.search.brave.com/yidLNeAlOis93k7FwAsb5tKOR46fIEXxKLbeh8vtfq0/rs:fit:0:180:1:0/g:ce/aHR0cHM6Ly93d3cu/YWZyaWNhLW5ld3Ny/b29tLmNvbS9maWxl/cy9sYXJnZS83M2Rl/MmQ3MTcxZTAzYjYv/MjAwLzE1MA"
                className="w-[200px] h-[150px] object-contain"/>
                 
             </div>
             <DashboardBoxes/>
               <div className='card !my-4 shadow-md sm:rounded-lg bg-white'> 
                <div className="flex items center justify-between !px-5 !py-5">
                    <h2 className="text-[18px] font-[600]">Les produits sur suguba</h2>
                    </div>
                   <div className="flex items-center w-full !pl-5 justify-between !pr-5">
                    <div className=" col w-[20%]">
                        <h4 className="text-[13px] font-[600] !mb-2"> Filtrez Par Categorie</h4>
                      <Select
                      className="w-full"
                      size="small"
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={categoryFilterVal}
          onChange={handleChangeCatFilter}
          label="Categorie"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Habits</MenuItem>
          <MenuItem value={20}>Chaussures</MenuItem>
          <MenuItem value={30}>Sacs</MenuItem>
          <MenuItem value={30}>Cosmetiques</MenuItem>
        </Select>
                    </div>
                   <div className="col w-[15%] !ml-auto flex items-center">
                     <Button className="!bg-green-600 !text-white btn-sm btn">Exporter</Button>
                   </div>
                </div>
                <div className='relative overflow-x-auto !mt-5 !pb-5'> 
                      <table className="w-full text-sm text-left rtl:text-right text-body">
                          <thead className='text-xs text-gray-700 uppercase
                          bg-gray-100 ' >
                <tr>
                    <th className="!px-6 !py-3 pr-0" width="10%">
                        <div className="w-[60px]">
                          <Checkbox {...label} size="small"/>
                        </div>
                    </th>
                <th className="!px-2 !py-3">
                    Produit
                </th>
                 <th className="!px-2 !py-3 font-[600] whitespace-nowrap">
                   Categorie
                </th>
                 <th className="!px-2 !py-3 font-[600] whitespace-nowrap">
                  Sous Categorie
                </th>
                <th className="!px-2 !py-3 font-[600] whitespace-nowrap">
                    Prix
                </th>
                 <th className="!px-2 !py-3 font-[600] whitespace-nowrap">
                   Ventes
                </th>
                 <th className="!px-2 !py-3 font-[600] whitespace-nowrap ">
                    Actions
                </th>
            </tr>
                          </thead>
                          <tbody className='text-gray-700'>
                           <tr className="">
                               <td className="!px-6 !py-2 !pr-0">
                                 <div className="w-[60px]">
                                    <Checkbox {...label}  size="small"/>
                                   </div>
                                </td>
                                <td className="!px-0 !py-2">
                                    <div className="flex items-center gap-4 w-[300px]">
                                        <div className="img w-[65px] h-[65px] rounded-md overflow-hidden group">
                                             <Link to="/produit/1234">
                                            <img src="https://thumbs.dreamstime.com/b/profilez-le-portrait-d-une-fille-d-adolescent-de-style-de-patineur-43975817.jpg?w=768" 
                                             className="w-full group-hover:scale-105 transition-all"/>
                                             </Link>
                                        </div>
                                        <div className="info w-[75%]">
                                            <h3 className="font-[600] text-[12px] leading-4 hover:text-primary">
                                                <Link to="/produit/1234">
                                                Robe rose rayonnante
                                                </Link>
                                            </h3>
                                            
                                            <span className="text-[12px] "> Anna's couture</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="!px-2 !py-2" > Habits</td>
                                <td className="!px-2 !py-2" >Femme</td>
                                <td className="!px-2 !py-2">
                                    <div className="flex flex-col gap-1">
                                        <span className="oldPrice line-through leading-3 text-gray-500 text-[14px]
                                        font-[500]">
                                            45,000Fcfa
                                        </span>
                                         <span className="price text-primary text-[14px] font-[600]">
                                            35,000Fcfa
                                        </span>
                                    </div>
                                </td>
                                    <td className="!px-2 !py-2" >
                                        <p className="text-[14px] w-[100px]"><span className="font-[600]">342</span>{" "}Ventes</p>
                                        <ProgressBar type="warning" value={40}/>
                                    </td>
                                     <td className="!px-6 !py-2" >
                                        <div className="flex items-center gap-1">
                                            <Button className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] border 
                                            border-[rgba(0,0,0,0.4)] rounded-full hover:!bg-[#f1f1f1]">
                                                <AiOutlineEdit className="text-[rgba(0,0,0,0.7)] text-[18px]"/>
                                            </Button>
                                             <Button className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] border 
                                            border-[rgba(0,0,0,0.4)] rounded-full hover:!bg-[#f1f1f1]">
                                                <FaRegEye className="text-[rgba(0,0,0,0.7)] text-[18px]"/>
                                            </Button>
                                             <Button className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] border 
                                            border-[rgba(0,0,0,0.4)] rounded-full hover:!bg-[#f1f1f1]">
                                                <BsTrash className="text-[rgba(0,0,0,0.7)] text-[18px]"/>
                                            </Button>
                                        </div>
                                     </td>
                                
                           </tr>
                        
                         <tr className="">
                               <td className="!px-6 !py-2 !pr-0">
                                 <div className="w-[60px]">
                                    <Checkbox {...label}  size="small"/>
                                   </div>
                                </td>
                                <td className="!px-0 !py-2">
                                    <div className="flex items-center gap-4 w-[300px]">
                                        <div className="img w-[65px] h-[65px] rounded-md overflow-hidden group">
                                             <Link to="/produit/1234">
                                            <img src="https://thumbs.dreamstime.com/b/profilez-le-portrait-d-une-fille-d-adolescent-de-style-de-patineur-43975817.jpg?w=768" 
                                             className="w-full group-hover:scale-105 transition-all"/>
                                             </Link>
                                        </div>
                                        <div className="info w-[75%]">
                                            <h3 className="font-[600] text-[12px] leading-4 hover:text-primary">
                                                <Link to="/produit/1234">
                                                Robe rose rayonnante
                                                </Link>
                                            </h3>
                                            
                                            <span className="text-[12px] "> Anna's couture</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="!px-2 !py-2" > Habits</td>
                                <td className="!px-2 !py-2" >Femme</td>
                                <td className="!px-2 !py-2">
                                    <div className="flex flex-col gap-1">
                                        <span className="oldPrice line-through leading-3 text-gray-500 text-[14px]
                                        font-[500]">
                                            45,000Fcfa
                                        </span>
                                         <span className="price text-primary text-[14px] font-[600]">
                                            35,000Fcfa
                                        </span>
                                    </div>
                                </td>
                                    <td className="!px-2 !py-2" >
                                        <p className="text-[14px] w-[100px]"><span className="font-[600]">3422</span>{" "}Ventes</p>
                                        <ProgressBar type="success" value={70}/>
                                    </td>
                                     <td className="!px-6 !py-2" >
                                        <div className="flex items-center gap-1">
                                            <Button className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] border 
                                            border-[rgba(0,0,0,0.4)] rounded-full hover:!bg-[#f1f1f1]">
                                                <AiOutlineEdit className="text-[rgba(0,0,0,0.7)] text-[18px]"/>
                                            </Button>
                                             <Button className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] border 
                                            border-[rgba(0,0,0,0.4)] rounded-full hover:!bg-[#f1f1f1]">
                                                <FaRegEye className="text-[rgba(0,0,0,0.7)] text-[18px]"/>
                                            </Button>
                                             <Button className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] border 
                                            border-[rgba(0,0,0,0.4)] rounded-full hover:!bg-[#f1f1f1]">
                                                <BsTrash className="text-[rgba(0,0,0,0.7)] text-[18px]"/>
                                            </Button>
                                        </div>
                                     </td>
                                
                           </tr>
                                                    <tr className="">
                               <td className="!px-6 !py-2 !pr-0">
                                 <div className="w-[60px]">
                                    <Checkbox {...label}  size="small"/>
                                   </div>
                                </td>
                                <td className="!px-0 !py-2">
                                    <div className="flex items-center gap-4 w-[300px]">
                                        <div className="img w-[65px] h-[65px] rounded-md overflow-hidden group">
                                             <Link to="/produit/1234">
                                            <img src="https://thumbs.dreamstime.com/b/profilez-le-portrait-d-une-fille-d-adolescent-de-style-de-patineur-43975817.jpg?w=768" 
                                             className="w-full group-hover:scale-105 transition-all"/>
                                             </Link>
                                        </div>
                                        <div className="info w-[75%]">
                                            <h3 className="font-[600] text-[12px] leading-4 hover:text-primary">
                                                <Link to="/produit/1234">
                                                Robe rose rayonnante
                                                </Link>
                                            </h3>
                                            
                                            <span className="text-[12px] "> Anna's couture</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="!px-2 !py-2" > Habits</td>
                                <td className="!px-2 !py-2" >Femme</td>
                                <td className="!px-2 !py-2">
                                    <div className="flex flex-col gap-1">
                                        <span className="oldPrice line-through leading-3 text-gray-500 text-[14px]
                                        font-[500]">
                                            45,000Fcfa
                                        </span>
                                         <span className="price text-primary text-[14px] font-[600]">
                                            35,000Fcfa
                                        </span>
                                    </div>
                                </td>
                                    <td className="!px-2 !py-2" >
                                        <p className="text-[14px] w-[100px]"><span className="font-[600]">22</span>{" "}Ventes</p>
                                        <ProgressBar type="error" value={40}/>
                                    </td>
                                     <td className="!px-6 !py-2" >
                                        <div className="flex items-center gap-1">
                                            <Button className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] border 
                                            border-[rgba(0,0,0,0.4)] rounded-full hover:!bg-[#f1f1f1]">
                                                <AiOutlineEdit className="text-[rgba(0,0,0,0.7)] text-[18px]"/>
                                            </Button>
                                             <Button className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] border 
                                            border-[rgba(0,0,0,0.4)] rounded-full hover:!bg-[#f1f1f1]">
                                                <FaRegEye className="text-[rgba(0,0,0,0.7)] text-[18px]"/>
                                            </Button>
                                             <Button className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] border 
                                            border-[rgba(0,0,0,0.4)] rounded-full hover:!bg-[#f1f1f1]">
                                                <BsTrash className="text-[rgba(0,0,0,0.7)] text-[18px]"/>
                                            </Button>
                                        </div>
                                     </td>
                                
                           </tr>
                            </tbody>
                    </table>
              </div>
              <div className="flex items-center justify-end !pt-5 !pb-5 !px-4">
                  <Pagination count={10} color="primary" />
              </div>
          </div>
             <div className='card !my-4 shadow-md sm:rounded-lg bg-white'> 
                <div className="flex items center justify-between !px-5 !py-5">
                    <h2 className="text-[18px] font-[600]">Commandes recentes</h2>
                </div>
                <div className='relative overflow-x-auto !mt-5 !pb-5'> 
                      <table className="w-full text-sm text-left rtl:text-right text-body">
                          <thead className='text-xs text-gray-700 uppercase
                          bg-gray-100 '>
                <tr>
                <th className="!px-6 !py-3">
                    &nbsp;
                </th>
                 <th className="!px-6 !py-3 font-[600] whitespace-nowrap">
                    Id Commande
                </th>
                 <th className="!px-6 !py-3 font-[600] whitespace-nowrap">
                    Id Paiement
                </th>
                 <th className="!px-6 !py-3 font-[600] whitespace-nowrap">
                    Nom Complet
                </th>
                <th className="!px-6 !py-3 font-[600] whitespace-nowrap">
                    Numero de téléphone
                </th>
                 <th className="!px-6 !py-3 font-[600] whitespace-nowrap">
                    Addresse
                </th>
                 <th className="!px-6 !py-3 font-[600] whitespace-nowrap">
                    Email
                </th>
                
                 <th className="!px-6 !py-3 font-[600] whitespace-nowrap">
                    Code PIN
                </th>

                <th className="!px-6 !py-3 font-[600] whitespace-nowrap">
                    Somme Totale
                </th>
                 <th className="!px-6 !py-3 font-[600] whitespace-nowrap">
                    Statut Commande
                </th>
                 <th className="!px-6 !py-3 font-[600] whitespace-nowrap">
                    Date
                </th>
            </tr>
                          </thead>
                          <tbody className='text-gray-700'>
                              <tr className="bg-white border-b border-gray-300 ">
                                     <td className="!px-6 !py-4 !font-[500]">
                                        <Button className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full 
                                     !bg-[#f1f1f1]" onClick={()=>isShowOrderProduct(0)}>
                                        {
                                            isOpenOrderProduct=== 0 ?  <FaAngleUp className="text-[16px] text-[rgba(0,0,0,0.7)]"/> :
                                             <FaAngleDown className="text-[16px] text-[rgba(0,0,0,0.7)]"/>
                                        }
                                       
                                        </Button>
                                     </td>
                                     <td className="!px-6 !py-4 font-[500]">
                                        <span className="text-primary">353244</span>
                                     </td>
                                      <td className="!px-6 !py-4 font-[500]">
                                        <span className="text-primary">244</span>
                                     </td>
                                     <td className="!px-6 !py-4 font-[500]  whitespace-nowrap">Adja Sitan Diakité</td>
                                     <td className="!px-6 !py-4 font-[500]">+223 94 51 87 03</td>
                                     <td className="!px-6 !py-4 font-[500]">
                                        <span className="block w-[400px]">Mali Bamako golf</span></td>
                                      <td className="!px-6 !py-4 font-[500] ">
                                        <span className="text-primary">diakiteadjasitan@gmail.com</span>
                                     </td>
                                       <td className="!px-6 !py-4 font-[500]">22217</td>
                                     <td className="!px-6 !py-4 font-[500]">17 000Fcfa</td>
                                   
                                     <td className="!px-6 !py-4 font-[500]"><Badge status={"livré"}/> </td>
                                     <td className="!px-6 !py-4 font-[500] block w-[200px]">01-04-2026</td>
                             </tr>
                             {isOpenOrderProduct === 0 && (
                                    <tr>
                             <td className="!pl-20" colSpan="6">
                               <div className='relative overflow-x-auto !mt-5'> 
                      <table className="w-full text-sm text-left rtl:text-right text-body">
                          <thead className='text-xs text-gray-700 uppercase
                          bg-gray-100 '>
                <tr>
                 <th className="!px-6 !py-3 font-[600] whitespace-nowrap">
                    Id Produit
                </th>
                 
                 <th className="!px-6 !py-3 font-[600] whitespace-nowrap">
                    Titre Produit
                </th>
                 <th className="!px-6 !py-3 font-[600] whitespace-nowrap">
                    Image
                </th>
                 <th className="!px-6 !py-3 font-[600] whitespace-nowrap">
                    Quantité
                </th>
                 <th className="!px-6 !py-3 font-[600] whitespace-nowrap">
                    Prix
                </th>
                 <th className="!px-6 !py-3 font-[600] whitespace-nowrap">
                   Total
                </th>
            </tr>
                          </thead>
                          <tbody className='text-gray-700'>

                              <tr className="bg-white border-b border-gray-300 ">
                                    
                                     <td className="!px-6 !py-4 font-[500] ">
                                        <span className="text-gray-600">22222</span>
                                     </td>
                                     <td className="!px-6 !py-4 font-[500]">Robe beige</td>
                                     <td className="!px-6 !py-4 font-[500]">
                                       <img src="https://robe-rose-poudre.com/cdn/shop/files/Designsanstitre-2025-04-09T094817.768.png?crop=center&height=1200&v=1744184979&width=1200"
                                 className="w-[40px] h-[40px] object-cover !rounded-md"/>
                                        </td>
                                     <td className="!px-6 !py-4 font-[500] whitespace-nowrap">03</td>
                                     <td className="!px-6 !py-4 font-[500]">
                                       12 000fcfa</td>
                                         <td className="!px-6 !py-4 font-[500]"> 36 000Fcfa</td>
                             </tr>
                               <tr className="bg-white border-b border-gray-300 ">
                                    
                                     <td className="!px-6 !py-4 font-[500] ">
                                        <span className="text-gray-600">22222</span>
                                     </td>
                                     <td className="!px-6 !py-4 font-[500]">Robe beige</td>
                                     <td className="!px-6 !py-4 font-[500]">
                                       <img src="https://robe-rose-poudre.com/cdn/shop/files/Designsanstitre-2025-04-09T094817.768.png?crop=center&height=1200&v=1744184979&width=1200"
                                 className="w-[40px] h-[40px] object-cover !rounded-md"/>
                                        </td>
                                     <td className="!px-6 !py-4 font-[500] whitespace-nowrap">03</td>
                                     <td className="!px-6 !py-4 font-[500]">
                                        12 000fcfa</td>
                                          <td className="!px-6 !py-4 font-[500]"> 36 000Fcfa</td>
                             </tr>
                         </tbody>
                    </table>
                </div>
            </td>
                </tr>
                             )}
                              <tr className="bg-white border-b border-gray-300 ">
                                     <td className="!px-6 !py-4 !font-[500]">
                                        <Button className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full 
                                     !bg-[#f1f1f1]" onClick={()=>isShowOrderProduct(1)}>
                                        {
                                            isOpenOrderProduct=== 1 ?  <FaAngleUp className="text-[16px] text-[rgba(0,0,0,0.7)]"/> :
                                             <FaAngleDown className="text-[16px] text-[rgba(0,0,0,0.7)]"/>
                                        }
                                       
                                        </Button>
                                     </td>
                                     <td className="!px-6 !py-4 font-[500]">
                                        <span className="text-primary">353244</span>
                                     </td>
                                      <td className="!px-6 !py-4 font-[500]">
                                        <span className="text-primary">244</span>
                                     </td>
                                     <td className="!px-6 !py-4 font-[500]  whitespace-nowrap">Adja Sitan Diakité</td>
                                     <td className="!px-6 !py-4 font-[500]">+223 94 51 87 03</td>
                                     <td className="!px-6 !py-4 font-[500]">
                                        <span className="block w-[400px]">Mali Bamako golf</span></td>
                                      <td className="!px-6 !py-4 font-[500] ">
                                        <span className="text-primary">diakiteadjasitan@gmail.com</span>
                                     </td>
                                       <td className="!px-6 !py-4 font-[500]">22217</td>
                                     <td className="!px-6 !py-4 font-[500]">17 000Fcfa</td>
                                   
                                     <td className="!px-6 !py-4 font-[500]"><Badge status={"en-attente"}/> </td>
                                     <td className="!px-6 !py-4 font-[500] block w-[200px]">01-04-2026</td>
                             </tr>
                              {isOpenOrderProduct === 1 && (
                                    <tr>
                             <td className="!pl-20" colSpan="6">
                               <div className='relative overflow-x-auto !mt-5'> 
                      <table className="w-full text-sm text-left rtl:text-right text-body">
                          <thead className='text-xs text-gray-700 uppercase
                          bg-gray-100 '>
                <tr>
                 <th className="!px-6 !py-3 font-[600] whitespace-nowrap">
                    Id Produit
                </th>
                 
                 <th className="!px-6 !py-3 font-[600] whitespace-nowrap">
                    Titre Produit
                </th>
                 <th className="!px-6 !py-3 font-[600] whitespace-nowrap">
                    Image
                </th>
                 <th className="!px-6 !py-3 font-[600] whitespace-nowrap">
                    Quantité
                </th>
                 <th className="!px-6 !py-3 font-[600] whitespace-nowrap">
                    Prix
                </th>
                 <th className="!px-6 !py-3 font-[600] whitespace-nowrap">
                   Total
                </th>
            </tr>
                          </thead>
                          <tbody className='text-gray-700'>

                              <tr className="bg-white border-b border-gray-300 ">
                                    
                                     <td className="!px-6 !py-4 font-[500] ">
                                        <span className="text-gray-600">22222</span>
                                     </td>
                                     <td className="!px-6 !py-4 font-[500]">Robe beige</td>
                                     <td className="!px-6 !py-4 font-[500]">
                                       <img src="https://robe-rose-poudre.com/cdn/shop/files/Designsanstitre-2025-04-09T094817.768.png?crop=center&height=1200&v=1744184979&width=1200"
                                 className="w-[40px] h-[40px] object-cover !rounded-md"/>
                                        </td>
                                     <td className="!px-6 !py-4 font-[500] whitespace-nowrap">03</td>
                                     <td className="!px-6 !py-4 font-[500]">
                                       12 000fcfa</td>
                                         <td className="!px-6 !py-4 font-[500]"> 36 000Fcfa</td>
                             </tr>
                               <tr className="bg-white border-b border-gray-300 ">
                                    
                                     <td className="!px-6 !py-4 font-[500] ">
                                        <span className="text-gray-600">22222</span>
                                     </td>
                                     <td className="!px-6 !py-4 font-[500]">Robe beige</td>
                                     <td className="!px-6 !py-4 font-[500]">
                                       <img src="https://robe-rose-poudre.com/cdn/shop/files/Designsanstitre-2025-04-09T094817.768.png?crop=center&height=1200&v=1744184979&width=1200"
                                 className="w-[40px] h-[40px] object-cover !rounded-md"/>
                                        </td>
                                     <td className="!px-6 !py-4 font-[500] whitespace-nowrap">03</td>
                                     <td className="!px-6 !py-4 font-[500]">
                                        12 000fcfa</td>
                                          <td className="!px-6 !py-4 font-[500]"> 36 000Fcfa</td>
                             </tr>
                         </tbody>
                    </table>
                </div>
            </td>
                </tr>
                             )}
                            
                           
                    </tbody>
    </table>
              </div>
          </div>
          <div className='card !my-4 shadow-md sm:rounded-lg bg-white'>
            <div className="flex items-center justify-between !px-5 !py-5 !pb-0">
                <h2 className="text-[18px] font-[600]">Totales des ventes par rapport à la totale des utilisateurs </h2>
            </div>
           <div className="flex items-center gap-5 !px-5 !py-5 !pt-1">
            <span className="flex items-center gap-1 text-[15px]">
            <span className="block w-[8px] h-[8px] rounded-full bg-green-600"></span>
             Totale Utilisateur               
              </span>
               <span className="flex items-center gap-1 text-[15px]">
            <span className="block w-[8px] h-[8px] rounded-full bg-blue-600"></span>
             Totale Vente               
              </span>
           </div>



    <LineChart
      width={900}
      height={500}
      data={chart1Data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke="none"/>
      <XAxis dataKey="name" tick={{fontSize: 12 }}/>
      <YAxis tick={{fontSize: 12 }}/>
      <Tooltip/>
      <Legend />
      <Line
        type="monotone"
        dataKey="TotaleVente"
        stroke="#8884d8"
        strokeWidth={3}
        activeDot={{ r: 8}}
      />
      <Line
        type="monotone"
        dataKey="TotaleUtilisateur"
        stroke="#82ca9d"
         strokeWidth={3}
      />
    </LineChart>
     </div>
        </>
    )
}*/}