import { useState, useEffect, useContext } from "react";
import { fetchDataFromApi, postData } from "../../../utils/api";
import { MyContext } from "../../../router";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import { FaBoxOpen, FaWarehouse, FaTruck } from "react-icons/fa";
import { MdInfoOutline } from "react-icons/md";

// Statuts que le VENDEUR peut changer (dans son espace)
// Le vendeur : en-attente → emballé → déposé-hub
// Suguba gère le reste : en-livraison, livré
const SELLER_STATUSES = [
  { value: "en-attente", label: "En attente", color: "warning", desc: "Commande reçue, non traitée" },
  { value: "emballé", label: "Emballé", color: "info", desc: "Produit emballé, prêt pour le hub" },
  { value: "déposé-hub", label: "Déposé au hub", color: "secondary", desc: "Déposé au hub Suguba" },
];

const ALL_STATUSES_LABELS = {
  "en-attente": { label: "En attente", bg: "bg-orange-100 text-orange-700" },
  "emballé": { label: "Emballé 📦", bg: "bg-blue-100 text-blue-700" },
  "déposé-hub": { label: "Déposé hub 🏭", bg: "bg-purple-100 text-purple-700" },
  "en-livraison": { label: "En livraison 🛵", bg: "bg-indigo-100 text-indigo-700" },
  "livré": { label: "Livré ✅", bg: "bg-green-100 text-green-700" },
  "annulé": { label: "Annulé ❌", bg: "bg-red-100 text-red-700" },
  "remboursé": { label: "Remboursé 💰", bg: "bg-gray-100 text-gray-700" },
};

function StatusBadge({ status }) {
  const s = ALL_STATUSES_LABELS[status] || { label: status, bg: "bg-gray-100 text-gray-600" };
  return <span className={`text-[11px] font-[600] !px-3 !py-1 rounded-full ${s.bg}`}>{s.label}</span>;
}

function ProgressSteps({ status }) {
  const steps = ["en-attente", "emballé", "déposé-hub", "en-livraison", "livré"];
  const icons = [FaBoxOpen, FaBoxOpen, FaWarehouse, FaTruck, FaTruck];
  const current = steps.indexOf(status);
  if (status === "annulé" || status === "remboursé") return null;
  return (
    <div className="flex items-center gap-1 !mt-2">
      {steps.map((s, i) => {
        const Icon = icons[i];
        const done = i <= current;
        return (
          <div key={s} className="flex items-center gap-1">
            <div className={`w-[28px] h-[28px] rounded-full flex items-center justify-center text-[11px]
              ${done ? "bg-primary text-white" : "bg-gray-200 text-gray-400"}`}>
              <Icon className="text-[12px]" />
            </div>
            {i < steps.length - 1 && <div className={`w-[20px] h-[2px] ${i < current ? "bg-primary" : "bg-gray-200"}`} />}
          </div>
        );
      })}
      <span className="text-[11px] text-gray-500 !ml-2">{ALL_STATUSES_LABELS[status]?.label}</span>
    </div>
  );
}

export default function SellerOrders() {
  const context = useContext(MyContext);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openOrder, setOpenOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const loadOrders = () => {
    setIsLoading(true);
    const url = filterStatus === "all" ? "/api/seller/commandes" : `/api/seller/commandes?status=${filterStatus}`;
    fetchDataFromApi(url).then((res) => {
      setOrders(res?.data || []);
      setIsLoading(false);
    });
  };

  useEffect(() => { loadOrders(); }, [filterStatus]);

  const updateStatus = (orderId, itemId, status) => {
    postData("/api/seller/commande/statut", { orderId, itemId, status }).then((res) => {
      if (res?.success) {
        context.alertBox("success", "Statut mis à jour");
        loadOrders();
      } else {
        context.alertBox("error", res?.message || "Erreur");
      }
    });
  };

  // Vérifie si le vendeur peut encore changer le statut
  const canChangeStatus = (status) => ["en-attente", "emballé"].includes(status);

  if (isLoading) return <div className="flex justify-center !py-20"><CircularProgress /></div>;

  return (
    <div className="flex flex-col gap-5">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[18px] font-[700]">Commandes reçues</h2>
          <p className="text-[13px] text-gray-500">{orders.length} commande(s)</p>
        </div>
        <Select size="small" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-[190px]">
          <MenuItem value="all">Toutes les commandes</MenuItem>
          <MenuItem value="en-attente">En attente</MenuItem>
          <MenuItem value="emballé">Emballé</MenuItem>
          <MenuItem value="déposé-hub">Déposé au hub</MenuItem>
          <MenuItem value="en-livraison">En livraison</MenuItem>
          <MenuItem value="livré">Livré</MenuItem>
          <MenuItem value="annulé">Annulé</MenuItem>
        </Select>
      </div>

      {/* Guide processus Suguba */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl !p-4 flex items-start gap-3">
        <MdInfoOutline className="text-blue-500 text-[20px] flex-shrink-0 mt-[1px]" />
        <div>
          <p className="text-[13px] font-[600] text-blue-800 !mb-1">Comment fonctionne la livraison Suguba ?</p>
          <p className="text-[12px] text-blue-700">
            <strong>Vous :</strong> Recevez la commande → Emballez le produit → Déposez au hub Suguba ·
            <strong className="!ml-1">Suguba :</strong> Prend en charge la livraison → Collecte l'argent → Vous reverser 90% en fin de mois
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm !p-16 text-center">
          <FaBoxOpen className="text-[50px] text-gray-300 !mx-auto !mb-4" />
          <p className="text-gray-400 text-[16px]">Aucune commande reçue pour l'instant</p>
          <p className="text-gray-300 text-[13px] !mt-1">Les commandes apparaîtront ici dès qu'un client achète vos produits</p>
        </div>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Header commande */}
            <div className="!px-5 !py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[13px] font-[700] text-primary">#{order.orderId}</span>
                <span className="text-[11px] text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-gray-500">Client: <strong>{order.userId?.name}</strong></span>
              </div>
            </div>

            {/* Items */}
            <div className="!px-5 !py-4 flex flex-col gap-4">
              {order.items.map((item) => (
                <div key={item._id} className="flex items-start gap-4">
                  <img src={item.productImage} className="w-[60px] h-[60px] object-cover rounded-xl flex-shrink-0" alt={item.productName} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-[600] truncate">{item.productName}</p>
                    <p className="text-[12px] text-gray-400 !mb-1">
                      Qté: {item.quantity} {item.size && `· Taille: ${item.size}`}
                    </p>
                    <ProgressSteps status={item.status} />
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[15px] font-[700] text-primary">{item.sellerRevenue?.toLocaleString()} Fcfa</p>
                    <p className="text-[11px] text-gray-400">net (après 10%)</p>
                    <div className="!mt-2">
                      {canChangeStatus(item.status) ? (
                        <Select
                          size="small"
                          value={item.status}
                          onChange={(e) => updateStatus(order._id, item._id, e.target.value)}
                          className="w-[160px] text-[12px]">
                          {SELLER_STATUSES.map(s => (
                            <MenuItem key={s.value} value={s.value}>
                              <Tooltip title={s.desc} placement="left">
                                <span>{s.label}</span>
                              </Tooltip>
                            </MenuItem>
                          ))}
                        </Select>
                      ) : (
                        <div>
                          <StatusBadge status={item.status} />
                          {(item.status === "en-livraison" || item.status === "livré") && (
                            <p className="text-[10px] text-gray-400 !mt-1">Géré par Suguba</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer commande */}
            <div className="!px-5 !py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[12px] text-gray-500">
                Paiement: <strong>{order.paymentMethod}</strong>
                {order.note && <> · Note: <em className="text-gray-600">{order.note}</em></>}
              </span>
              <span className="text-[14px] font-[700] text-primary">
                Total net: {order.items.reduce((s, i) => s + (i.sellerRevenue || 0), 0).toLocaleString()} Fcfa
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}



{/*import { useState, useEffect, useContext } from "react";
import { fetchDataFromApi, postData } from "../../../utils/api";
import { MyContext } from "../../../router";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Badge from "../Badge/index";

export default function SellerOrders() {
  const context = useContext(MyContext);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openOrder, setOpenOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const loadOrders = () => {
    const url = filterStatus === "all" ? "/api/seller/commandes" : `/api/seller/commandes?status=${filterStatus}`;
    fetchDataFromApi(url).then((res) => {
      setOrders(res?.data || []);
      setIsLoading(false);
    });
  };

  useEffect(() => { loadOrders(); }, [filterStatus]);

  const updateStatus = (orderId, itemId, status) => {
    postData("/api/seller/commande/statut", { orderId, itemId, status }).then((res) => {
      if (res?.success) {
        context.alertBox("success", "Statut mis à jour");
        loadOrders();
      }
    });
  };

  if (isLoading) return <div className="flex justify-center !py-20"><CircularProgress /></div>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-[600]">Commandes reçues ({orders.length})</h2>
        <Select size="small" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-[180px]">
          <MenuItem value="all">Toutes</MenuItem>
          <MenuItem value="en-attente">En attente</MenuItem>
          <MenuItem value="confirmé">Confirmées</MenuItem>
          <MenuItem value="expédié">Expédiées</MenuItem>
          <MenuItem value="livré">Livrées</MenuItem>
          <MenuItem value="annulé">Annulées</MenuItem>
        </Select>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm !p-16 text-center">
          <p className="text-gray-400">Aucune commande reçue</p>
        </div>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="bg-white rounded-xl shadow-sm !p-5">
            <div className="flex items-center justify-between !mb-3">
              <div>
                <span className="text-[13px] font-[700] text-primary">#{order.orderId}</span>
                <span className="text-[12px] text-gray-400 !ml-3">
                  {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                </span>
              </div>
              <Badge status={order.status} />
            </div>

            <div className="flex flex-col gap-3">
              {order.items.map((item) => (
                <div key={item._id} className="flex items-center gap-4 border-t border-gray-50 !pt-3">
                  <img src={item.productImage} className="w-[55px] h-[55px] object-cover rounded-lg" />
                  <div className="flex-1">
                    <p className="text-[14px] font-[500]">{item.productName}</p>
                    <p className="text-[12px] text-gray-400">
                      Qté: {item.quantity} {item.size && `• Taille: ${item.size}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[14px] font-[700] text-primary">{item.sellerRevenue?.toLocaleString()} Fcfa</p>
                    <p className="text-[11px] text-gray-400">net après commission</p>
                  </div>
                  <Select size="small" value={item.status}
                    onChange={(e) => updateStatus(order._id, item._id, e.target.value)}
                    className="w-[140px]">
                    <MenuItem value="en-attente">En attente</MenuItem>
                    <MenuItem value="confirmé">Confirmé</MenuItem>
                    <MenuItem value="expédié">Expédié</MenuItem>
                    <MenuItem value="livré">Livré</MenuItem>
                    <MenuItem value="annulé">Annulé</MenuItem>
                  </Select>
                </div>
              ))}
            </div>

            <div className="flex justify-between !mt-3 !pt-3 border-t border-gray-100">
              <span className="text-[13px] text-gray-500">Client: {order.userId?.name}</span>
              <span className="text-[14px] font-[600] text-primary">
                Total net: {order.items.reduce((s, i) => s + (i.sellerRevenue || 0), 0).toLocaleString()} Fcfa
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}*/}