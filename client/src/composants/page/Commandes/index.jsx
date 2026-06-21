import { useState, useEffect, useContext } from "react";
import AccountSidebar from "../AccountSidebar/index";
import { MyContext } from "../../../router";
import { fetchDataFromApi, postData } from "../../../utils/api";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import { FaAngleUp, FaAngleDown } from "react-icons/fa6";
import { MdCancel, MdWarehouse, MdLocationOn, MdPhone, MdAccessTime, MdContentCopy } from "react-icons/md";
import { FaBoxOpen, FaTruck, FaCheckCircle, FaClock, FaBan } from "react-icons/fa";
import Badge from "../Badge/index";

// ── Statut sous forme de timeline ──────────────────────────────────────────
const STATUS_STEPS = [
  { key: "en-attente", icon: FaClock, label: "Commande reçue", color: "text-orange-500" },
  { key: "confirmé", icon: FaBoxOpen, label: "Confirmée", color: "text-blue-500" },
  { key: "en-livraison", icon: FaTruck, label: "En livraison", color: "text-purple-500" },
  { key: "livré", icon: FaCheckCircle, label: "Livrée", color: "text-green-500" },
];

function OrderTimeline({ status }) {
  if (status === "annulé") {
    return (
      <div className="flex items-center gap-2 !py-2">
        <FaBan className="text-red-500 text-[16px]" />
        <span className="text-[13px] text-red-500 font-[600]">Commande annulée</span>
      </div>
    );
  }
  const currentIdx = STATUS_STEPS.findIndex(s => s.key === status);
  return (
    <div className="flex items-center gap-1 !py-3">
      {STATUS_STEPS.map((step, i) => {
        const Icon = step.icon;
        const done = i <= currentIdx;
        return (
          <div key={step.key} className="flex items-center gap-1">
            <div className={`flex flex-col items-center gap-1`}>
              <div className={`w-[28px] h-[28px] rounded-full flex items-center justify-center ${done ? "bg-primary" : "bg-gray-200"}`}>
                <Icon className={`text-[13px] ${done ? "text-white" : "text-gray-400"}`} />
              </div>
              <span className={`text-[9px] font-[600] text-center w-[60px] ${done ? "text-primary" : "text-gray-400"}`}>{step.label}</span>
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div className={`h-[2px] w-[30px] !mb-4 ${i < currentIdx ? "bg-primary" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Composant pour copier l'ID ─────────────────────────────────────────────
function CopyId({ id, label }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={copy} className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-primary transition-all">
      <MdContentCopy className="text-[12px]" />
      <span className="font-mono">{label}: {id?.slice(0, 16)}...</span>
      {copied && <span className="text-green-500 font-[600]">✓ Copié</span>}
    </button>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
export default function Orders() {
  const context = useContext(MyContext);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openOrder, setOpenOrder] = useState(null);

  // Dialog annulation
  const [cancelDialog, setCancelDialog] = useState({ open: false, orderId: null });
  const [cancelReason, setCancelReason] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);

  const loadOrders = () => {
    setIsLoading(true);
    fetchDataFromApi("/api/orders/mes-commandes").then((res) => {
      setOrders(res?.data || []);
      setIsLoading(false);
    });
  };

  useEffect(() => { loadOrders(); }, []);

  // ✅ Peut annuler : commande "en-attente" ou "confirmé" dans les 2h
  const canCancel = (order) => {
    if (["livré", "annulé"].includes(order.status)) return false;
    if (order.status === "en-attente") return true;
    if (order.canCancelUntil && new Date() < new Date(order.canCancelUntil)) return true;
    return false;
  };

  // ✅ Temps restant pour annuler
  const timeLeftToCancel = (order) => {
    if (!order.canCancelUntil) return null;
    const diff = new Date(order.canCancelUntil) - new Date();
    if (diff <= 0) return null;
    const min = Math.floor(diff / 60000);
    const sec = Math.floor((diff % 60000) / 1000);
    return `${min}m${sec}s`;
  };

  const handleCancelConfirm = async () => {
    if (!cancelDialog.orderId) return;
    setCancelLoading(true);
    const res = await postData(`/api/orders/${cancelDialog.orderId}/annuler`, {
      cancelReason: cancelReason || "Annulation client"
    });
    if (res?.success) {
      context.alertBox("success", "Commande annulée avec succès");
      loadOrders();
    } else {
      context.alertBox("error", res?.message || "Erreur lors de l'annulation");
    }
    setCancelLoading(false);
    setCancelDialog({ open: false, orderId: null });
    setCancelReason("");
  };

  return (
    <section className="!py-10 w-full">
      <div className="w-[95%] !mx-auto flex gap-5">
        <div className="col1 w-[20%]"><AccountSidebar /></div>

        <div className="col2 w-[80%]">
          <div className="shadow-md rounded-md bg-white">
            <div className="!py-5 !px-5 border-b border-gray-100">
              <h2 className="text-[18px] font-[700]">Mes Commandes</h2>
              <p className="text-[13px] text-gray-500">
                Vous avez passé <span className="text-primary font-bold">{orders.length}</span> commande(s)
              </p>
            </div>

            {isLoading ? (
              <div className="flex justify-center !py-16"><CircularProgress /></div>
            ) : orders.length === 0 ? (
              <div className="flex flex-col items-center !py-16 gap-3">
                <FaBoxOpen className="text-[48px] text-gray-200" />
                <p className="text-gray-400">Vous n'avez pas encore passé de commande</p>
              </div>
            ) : (
              <div className="flex flex-col gap-0">
                {orders.map((order, index) => {
                  const cancelable = canCancel(order);
                  const timeLeft = timeLeftToCancel(order);

                  return (
                    <div key={order._id} className="border-b border-gray-100 last:border-0">
                      {/* ── Ligne principale ──────────────────────────── */}
                      <div className="!px-5 !py-4 flex items-start gap-4">
                        {/* Bouton expand */}
                        <Button
                          className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-gray-100 flex-shrink-0"
                          onClick={() => setOpenOrder(openOrder === index ? null : index)}>
                          {openOrder === index ? <FaAngleUp className="text-[12px]" /> : <FaAngleDown className="text-[12px]" />}
                        </Button>

                        {/* Infos commande */}
                        <div className="flex-1 min-w-0">
                          {/* ID + date */}
                          <div className="flex items-center gap-3 flex-wrap !mb-1">
                            <span className="text-primary font-[700] text-[14px]">{order.orderId}</span>
                            <span className="text-[12px] text-gray-400">
                              {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                                day: "2-digit", month: "long", year: "numeric",
                                hour: "2-digit", minute: "2-digit"
                              })}
                            </span>
                          </div>

                          {/* Timeline statut */}
                          <OrderTimeline status={order.status} />

                          {/* Type livraison */}
                          <div className="flex items-center gap-2 !mt-1">
                            {order.deliveryType === "retrait-hub" ? (
                              <span className="flex items-center gap-1 text-[11px] bg-blue-50 text-blue-600 font-[600] !px-2 !py-1 rounded-full">
                                <MdWarehouse className="text-[12px]" /> Retrait en hub
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-[11px] bg-orange-50 text-orange-600 font-[600] !px-2 !py-1 rounded-full">
                                <FaTruck className="text-[11px]" /> Livraison à domicile
                              </span>
                            )}
                            <Badge status={order.paymentStatus} />
                          </div>
                        </div>

                        {/* Prix + actions */}
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <p className="text-[16px] font-[700] text-primary">{order.totalAmt?.toLocaleString()} Fcfa</p>
                          {cancelable && (
                            <Button
                              size="small" variant="outlined" color="error"
                              className="!capitalize !text-[12px] flex gap-1"
                              onClick={() => setCancelDialog({ open: true, orderId: order._id })}>
                              <MdCancel className="text-[14px]" /> Annuler
                            </Button>
                          )}
                          {cancelable && timeLeft && (
                            <span className="text-[10px] text-orange-500 font-[600]">⏱ {timeLeft} restant</span>
                          )}
                        </div>
                      </div>

                      {/* ── Détail dépliable ──────────────────────────── */}
                      {openOrder === index && (
                        <div className="!px-5 !pb-5 bg-gray-50">
                          {/* Hub info si retrait */}
                          {order.deliveryType === "retrait-hub" && order.pickupHub && (
                            <div className="bg-blue-50 border border-blue-200 rounded-xl !p-4 !mb-4">
                              <p className="text-[13px] font-[700] text-blue-800 !mb-2 flex items-center gap-2">
                                <MdWarehouse /> Hub de retrait : {order.pickupHub.name}
                              </p>
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                  <MdLocationOn className="text-primary text-[13px]" />
                                  <p className="text-[12px] text-gray-700">{order.pickupHub.address}, {order.pickupHub.city}</p>
                                </div>
                                {order.pickupHub.phone && (
                                  <div className="flex items-center gap-2">
                                    <MdPhone className="text-green-500 text-[12px]" />
                                    <p className="text-[12px] text-gray-700">{order.pickupHub.phone}</p>
                                  </div>
                                )}
                                <div className="flex items-center gap-2">
                                  <MdAccessTime className="text-orange-500 text-[12px]" />
                                  <p className="text-[12px] text-gray-700">{order.pickupHub.hours || "Lun–Sam : 8h–18h"}</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* ✅ ID de commande copiable pour le support */}
                          <div className="bg-white border border-gray-200 rounded-xl !p-3 !mb-4 flex flex-wrap gap-3">
                            <div>
                              <p className="text-[10px] text-gray-400 font-[600] uppercase !mb-1">Référence commande</p>
                              <span className="text-[13px] font-[700] text-primary">{order.orderId}</span>
                            </div>
                            <div>
                              <p className="text-[10px] text-gray-400 font-[600] uppercase !mb-1">ID interne (pour le support)</p>
                              <CopyId id={order._id} label="ID" />
                            </div>
                          </div>

                          {/* Articles */}
                          <p className="text-[13px] font-[700] text-gray-700 !mb-3">Articles commandés :</p>
                          <div className="flex flex-col gap-3">
                            {order.items.map((item) => (
                              <div key={item._id} className="bg-white rounded-xl !p-3 flex items-center gap-4 border border-gray-100">
                                <img src={item.productImage} className="w-[55px] h-[55px] object-cover rounded-lg flex-shrink-0" alt={item.productName} />
                                <div className="flex-1 min-w-0">
                                  <p className="text-[13px] font-[600] line-clamp-1">{item.productName}</p>
                                  <div className="flex items-center gap-2 !mt-1">
                                    <span className="text-[11px] text-gray-500">Qté : {item.quantity}</span>
                                    {item.size && <span className="text-[11px] text-gray-500">• Taille : {item.size}</span>}
                                  </div>
                                  {/* ✅ ID produit copiable — utile pour le formulaire retour/échange */}
                                  <div className="!mt-1">
                                    <CopyId id={item.productId?.toString()} label="ID Produit" />
                                  </div>
                                </div>
                                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                  <p className="text-[14px] font-[700] text-primary">{item.subtotal?.toLocaleString()} Fcfa</p>
                                  <Badge status={item.status} />
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Récapitulatif financier */}
                          <div className="!mt-4 !pt-3 border-t border-gray-200 flex justify-between text-[13px]">
                            <div className="flex flex-col gap-1">
                              {order.cancelledAt && (
                                <p className="text-red-500 text-[12px]">
                                  Annulée le {new Date(order.cancelledAt).toLocaleDateString("fr-FR")}
                                  {order.cancelReason && ` — ${order.cancelReason}`}
                                </p>
                              )}
                              <span className="text-gray-500">
                                Livraison : {order.deliveryFee === 0 ? <span className="text-green-600 font-[600]">Gratuite</span> : `${order.deliveryFee?.toLocaleString()} Fcfa`}
                              </span>
                              <span className="text-gray-500">Paiement : {order.paymentMethod}</span>
                            </div>
                            <span className="font-[700] text-primary text-[15px]">Total : {order.totalAmt?.toLocaleString()} Fcfa</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Dialog annulation ────────────────────────────────────────────── */}
      <Dialog open={cancelDialog.open} onClose={() => setCancelDialog({ open: false, orderId: null })} maxWidth="sm" fullWidth>
        <DialogTitle className="!font-[700]">❌ Annuler la commande</DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-3 !pt-1">
            <div className="bg-orange-50 border border-orange-200 rounded-xl !p-3">
              <p className="text-[13px] text-orange-800">
                ⚠️ L'annulation est possible dans les <strong>2h suivant la commande</strong> et uniquement si elle n'est pas encore expédiée.
              </p>
            </div>
            <TextField
              label="Raison de l'annulation (optionnel)" multiline rows={2} fullWidth size="small"
              value={cancelReason}
              onChange={e => setCancelReason(e.target.value)}
              placeholder="Ex: Commande passée par erreur..."
            />
          </div>
        </DialogContent>
        <DialogActions className="!px-5 !pb-4">
          <Button onClick={() => setCancelDialog({ open: false, orderId: null })} className="!capitalize">Retour</Button>
          <Button onClick={handleCancelConfirm} color="error" variant="contained"
            disabled={cancelLoading} className="!capitalize flex gap-2">
            {cancelLoading ? <CircularProgress size={16} color="inherit" /> : "Confirmer l'annulation"}
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
}



{/*import { useState, useEffect, useContext } from "react";
import AccountSidebar from "../AccountSidebar/index";
import { MyContext } from "../../../router";
import { fetchDataFromApi } from "../../../utils/api";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import { FaAngleUp, FaAngleDown } from "react-icons/fa6";
import Badge from "../Badge/index";

export default function Orders() {
  const context = useContext(MyContext);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openOrder, setOpenOrder] = useState(null);

  useEffect(() => {
    fetchDataFromApi("/api/orders/mes-commandes").then((res) => {
      setOrders(res?.data || []);
      setIsLoading(false);
    });
  }, []);

  return (
    <section className="!py-10 w-full">
      <div className="w-[95%] !mx-auto flex gap-5">
        <div className="col1 w-[20%]"><AccountSidebar /></div>
        <div className="col2 w-[80%]">
          <div className="shadow-md rounded-md bg-white">
            <div className="!py-5 !px-3 border-b border-[rgba(0,0,0,0.1)]">
              <h2>Mes Commandes</h2>
              <p className="!mt-0 !mb-0">
                Vous avez passé <span className="text-primary font-bold">{orders.length}</span> commande(s)
              </p>
            </div>

            {isLoading ? (
              <div className="flex justify-center !py-16"><CircularProgress /></div>
            ) : orders.length === 0 ? (
              <div className="flex justify-center !py-16">
                <p className="text-gray-400">Vous n'avez pas encore passé de commande</p>
              </div>
            ) : (
              <div className="relative overflow-x-auto !mt-2">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                    <tr>
                      <th className="!px-6 !py-3">&nbsp;</th>
                      <th className="!px-6 !py-3 font-[600] whitespace-nowrap">Id Commande</th>
                      <th className="!px-6 !py-3 font-[600] whitespace-nowrap">Date</th>
                      <th className="!px-6 !py-3 font-[600] whitespace-nowrap">Total</th>
                      <th className="!px-6 !py-3 font-[600] whitespace-nowrap">Paiement</th>
                      <th className="!px-6 !py-3 font-[600] whitespace-nowrap">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, index) => (
                      <>
                        <tr key={order._id} className="bg-white border-b border-gray-200">
                          <td className="!px-6 !py-4">
                            <Button className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-[#f1f1f1]"
                              onClick={() => setOpenOrder(openOrder === index ? null : index)}>
                              {openOrder === index ? <FaAngleUp /> : <FaAngleDown />}
                            </Button>
                          </td>
                          <td className="!px-6 !py-4 font-[500] text-primary">{order.orderId}</td>
                          <td className="!px-6 !py-4">{new Date(order.createdAt).toLocaleDateString("fr-FR")}</td>
                          <td className="!px-6 !py-4 font-[600]">{order.totalAmt?.toLocaleString()} Fcfa</td>
                          <td className="!px-6 !py-4"><Badge status={order.paymentStatus} /></td>
                          <td className="!px-6 !py-4"><Badge status={order.status} /></td>
                        </tr>
                        {openOrder === index && (
                          <tr>
                            <td colSpan={6} className="!px-8 !py-4 bg-gray-50">
                              <table className="w-full text-sm">
                                <thead className="bg-gray-100">
                                  <tr>
                                    <th className="!px-4 !py-2 text-left">Image</th>
                                    <th className="!px-4 !py-2 text-left">Produit</th>
                                    <th className="!px-4 !py-2">Qté</th>
                                    <th className="!px-4 !py-2">Taille</th>
                                    <th className="!px-4 !py-2">Prix</th>
                                    <th className="!px-4 !py-2">Statut</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {order.items.map((item) => (
                                    <tr key={item._id} className="border-b border-gray-100">
                                      <td className="!px-4 !py-3">
                                        <img src={item.productImage} className="w-[45px] h-[45px] object-cover rounded-md" />
                                      </td>
                                      <td className="!px-4 !py-3 font-[500]">{item.productName}</td>
                                      <td className="!px-4 !py-3 text-center">{item.quantity}</td>
                                      <td className="!px-4 !py-3 text-center">{item.size || "—"}</td>
                                      <td className="!px-4 !py-3 font-[600] text-primary">{item.subtotal?.toLocaleString()} Fcfa</td>
                                      <td className="!px-4 !py-3"><Badge status={item.status} /></td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                              <div className="flex justify-between !mt-3 !pt-3 border-t border-gray-200">
                                <span className="text-[13px] text-gray-500">Livraison: {order.deliveryFee === 0 ? "Gratuite" : `${order.deliveryFee?.toLocaleString()} Fcfa`}</span>
                                <span className="font-[700] text-primary">Total: {order.totalAmt?.toLocaleString()} Fcfa</span>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
*/}


{/*import { Button } from "@mui/material";
import AccountSidebar from "../AccountSidebar";
import { FaAngleUp } from "react-icons/fa6";
import { FaAngleDown } from "react-icons/fa6";
import Badge from "../Badge/index";
import { useState } from "react";



export default function Orders(){
               const [isOpenOrderProduct,setIsOpenOrderProduct]=useState(null);
               const isShowOrderProduct=(index)=>{
                if (isOpenOrderProduct===index) {
                    setIsOpenOrderProduct(null);
                }
                else{
                    setIsOpenOrderProduct(index);
                }
               }
        
    return(
    <>
     <section className="!py-10 w-full">
        <div className="w-[95%] !mx-auto flex gap-5">
            <div className="col1 w-[20%]">
                    <AccountSidebar/>
            </div>
                 <div className="col2 w-[80%]">
                    <div className='shadow-md  rounded-md bg-white'>
                            <div className="!py-5 !px-3 border-b border-[rgba(0,0,0,0.1)]">
                                  <h2>Mes Commandes</h2>
                                  <p className="!mt-0 !mb-0">
                                    Vous avez passé <span className="text-primary font-bold">5</span>{" "} commandes sur suguba
                                   </p>
                                    <div className='relative overflow-x-auto !mt-5'> 
                      <table class="w-full text-sm text-left rtl:text-right text-body">
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
                                   
                                     <td className="!px-6 !py-4 font-[500]"><Badge status={"en-attente"}/> </td>
                                     <td className="!px-6 !py-4 font-[500] block w-[200px]">01-04-2026</td>
                             </tr>
                             {isOpenOrderProduct === 0 && (
                                    <tr>
                             <td className="!pl-20" colSpan="6">
                               <div className='relative overflow-x-auto !mt-5'> 
                      <table class="w-full text-sm text-left rtl:text-right text-body">
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
                    </div>
               </div>
        </div>
     </section>
    </>
    )
}*/}