import { useState, useEffect } from "react";
import { fetchDataFromApi } from "../../../utils/api";
import CircularProgress from "@mui/material/CircularProgress";
import { FaBoxOpen, FaShoppingBag, FaMoneyBillWave, FaChartLine } from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function SellerDashboard() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDataFromApi("/api/seller/dashboard").then((res) => {
      if (res?.success) setStats(res.data.stats);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <div className="flex justify-center !py-20"><CircularProgress /></div>;

  const cards = [
    { label: "Total Produits", value: stats?.totalProducts, icon: FaBoxOpen, color: "bg-blue-50 text-blue-600" },
    { label: "Total Commandes", value: stats?.totalOrders, icon: FaShoppingBag, color: "bg-orange-50 text-orange-600" },
    { label: "Revenu Net", value: `${stats?.totalNet?.toLocaleString()} Fcfa`, icon: FaMoneyBillWave, color: "bg-green-50 text-green-600" },
    { label: "Total Ventes", value: stats?.totalSales, icon: FaChartLine, color: "bg-purple-50 text-purple-600" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Cartes stats */}
      <div className="grid grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl shadow-sm !p-5">
            <div className={`w-[45px] h-[45px] rounded-full ${color} flex items-center justify-center !mb-3`}>
              <Icon className="text-[20px]" />
            </div>
            <h3 className="text-[22px] font-[700]">{value}</h3>
            <p className="text-[13px] text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Revenus détaillés */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm !p-5">
          <p className="text-[13px] text-gray-500">Revenu Brut</p>
          <h3 className="text-[20px] font-[700] text-gray-800">{stats?.totalRevenue?.toLocaleString()} Fcfa</h3>
        </div>
        <div className="bg-red-50 rounded-xl shadow-sm !p-5">
          <p className="text-[13px] text-red-500">Commission Suguba (10%)</p>
          <h3 className="text-[20px] font-[700] text-red-600">-{stats?.totalCommission?.toLocaleString()} Fcfa</h3>
        </div>
        <div className="bg-green-50 rounded-xl shadow-sm !p-5">
          <p className="text-[13px] text-green-600">Revenu Net (vous)</p>
          <h3 className="text-[20px] font-[700] text-green-700">{stats?.totalNet?.toLocaleString()} Fcfa</h3>
        </div>
      </div>

      {/* Graphique */}
      <div className="bg-white rounded-xl shadow-sm !p-5">
        <h3 className="text-[16px] font-[600] !mb-4">Revenus des 6 derniers mois</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={stats?.revenueByMonth || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(val) => `${val.toLocaleString()} Fcfa`} />
            <Line type="monotone" dataKey="revenue" stroke="#e77492" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Alertes */}
      {stats?.outOfStock > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl !p-4 flex items-center gap-3">
          <span className="text-red-500 font-[600]">⚠️</span>
          <p className="text-[14px] text-red-700">
            <strong>{stats.outOfStock} produit(s)</strong> sont en rupture de stock. 
            <a href="/espace-vendeur/produits" className="underline !ml-1">Gérer mes produits →</a>
          </p>
        </div>
      )}
    </div>
  );
}