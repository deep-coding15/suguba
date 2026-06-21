import { useState, useEffect } from "react";
import { fetchDataFromApi } from "../../../utils/api";
import CircularProgress from "@mui/material/CircularProgress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

export default function SellerRevenue() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDataFromApi("/api/seller/dashboard").then((res) => {
      if (res?.success) setStats(res.data.stats);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <div className="flex justify-center !py-20"><CircularProgress /></div>;

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-[18px] font-[600]">Mes Revenus</h2>

      {/* Résumé */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm !p-6 text-center">
          <p className="text-[13px] text-gray-500 !mb-2">Revenu Brut Total</p>
          <h3 className="text-[24px] font-[700] text-gray-800">{stats?.totalRevenue?.toLocaleString()}</h3>
          <span className="text-[12px] text-gray-400">Fcfa</span>
        </div>
        <div className="bg-red-50 rounded-xl shadow-sm !p-6 text-center">
          <p className="text-[13px] text-red-500 !mb-2">Commission Suguba (10%)</p>
          <h3 className="text-[24px] font-[700] text-red-600">-{stats?.totalCommission?.toLocaleString()}</h3>
          <span className="text-[12px] text-red-400">Fcfa prélevé</span>
        </div>
        <div className="bg-green-50 rounded-xl shadow-sm !p-6 text-center border-2 border-green-200">
          <p className="text-[13px] text-green-600 !mb-2">✅ Revenu Net (Votre part)</p>
          <h3 className="text-[28px] font-[700] text-green-700">{stats?.totalNet?.toLocaleString()}</h3>
          <span className="text-[12px] text-green-500">Fcfa</span>
        </div>
      </div>

      {/* Formule */}
      <div className="bg-blue-50 rounded-xl !p-4 border border-blue-100">
        <p className="text-[13px] text-blue-800">
          <strong>💡 Comment ça marche :</strong> Sur chaque vente, Suguba prélève <strong>10%</strong> de commission.
          Vous recevez <strong>90%</strong> du montant de chaque vente. Exemple : vente à 10 000 Fcfa → vous recevez <strong>9 000 Fcfa</strong>.
        </p>
      </div>

      {/* Graphique revenus mensuels */}
      <div className="bg-white rounded-xl shadow-sm !p-6">
        <h3 className="text-[16px] font-[600] !mb-4">Évolution des revenus (6 derniers mois)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={stats?.revenueByMonth || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(val) => `${val?.toLocaleString()} Fcfa`} />
            <Bar dataKey="revenue" fill="#e77492" radius={[4, 4, 0, 0]} name="Revenu net" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}