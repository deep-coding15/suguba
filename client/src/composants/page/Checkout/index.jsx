import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../../router";
import { fetchDataFromApi, postData } from "../../../utils/api";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import CircularProgress from "@mui/material/CircularProgress";
import { BsBagCheckFill } from "react-icons/bs";
import { MdLocationOn, MdWarehouse, MdPhone, MdAccessTime } from "react-icons/md";
import { FaShippingFast, FaStore } from "react-icons/fa";

export default function Checkout() {
  const context = useContext(MyContext);
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [hubs, setHubs] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedHub, setSelectedHub] = useState("");
  const [deliveryType, setDeliveryType] = useState("livraison"); // "livraison" | "retrait-hub"
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isLoading, setIsLoading] = useState(false);
  const [note, setNote] = useState("");

  const cartItems = context.cartItems || [];
  const total = cartItems.reduce((s, i) => s + (i.productId?.price || 0) * i.quantity, 0);
  const deliveryFee = (total > 20000 || deliveryType === "retrait-hub") ? 0 : 1000;
  const totalAmt = total + deliveryFee;

  useEffect(() => {
    if (!context.isLogin) { navigate("/connexion"); return; }
    // Charger adresses
    fetchDataFromApi(`/api/address/retrait?userId=${context.userData?._id}`).then((res) => {
      setAddresses(res?.data || []);
      if (res?.data?.length > 0) setSelectedAddress(res.data[0]._id);
    });
    // Charger hubs actifs
    fetchDataFromApi("/api/hubs").then((res) => {
      setHubs(res?.data || []);
    });
  }, [context.userData]);

  const handleOrder = () => {
    if (deliveryType === "livraison" && !selectedAddress) {
      context.alertBox("error", "Veuillez sélectionner une adresse de livraison");
      return;
    }
    if (deliveryType === "retrait-hub" && !selectedHub) {
      context.alertBox("error", "Veuillez sélectionner un hub de retrait");
      return;
    }
    if (cartItems.length === 0) {
      context.alertBox("error", "Votre panier est vide");
      return;
    }

    setIsLoading(true);
    postData("/api/orders/creation-commande", {
      delivery_address: deliveryType === "livraison" ? selectedAddress : null,
      pickupHub: deliveryType === "retrait-hub" ? selectedHub : null,
      deliveryType,
      paymentMethod,
      note
    }).then((res) => {
      if (res?.success) {
        context.alertBox("success", "Commande passée avec succès !");
        context.getCartItems();
        navigate("/mes-commandes");
      } else {
        context.alertBox("error", res?.message || "Erreur lors de la commande");
      }
      setIsLoading(false);
    });
  };

  return (
    <section className="!py-10">
      <div className="w-[95%] !mx-auto !max-w-[1000px]">
        <h2 className="text-[22px] font-[700] !mb-6">Finaliser la commande</h2>

        <div className="flex gap-6">
          {/* ── Colonne gauche ─────────────────────────────────────────── */}
          <div className="flex-1 flex flex-col gap-5">

            {/* ✅ Choix du mode de livraison */}
            <div className="bg-white rounded-xl shadow-sm !p-5">
              <h3 className="text-[16px] font-[600] !mb-4">Mode de réception</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setDeliveryType("livraison")}
                  className={`!p-4 rounded-xl border-2 text-left transition-all ${deliveryType === "livraison"
                    ? "border-primary bg-pink-50" : "border-gray-200 hover:bg-gray-50"}`}>
                  <FaShippingFast className={`text-[22px] !mb-2 ${deliveryType === "livraison" ? "text-primary" : "text-gray-400"}`} />
                  <p className="text-[13px] font-[700]">Livraison à domicile</p>
                  <p className="text-[11px] text-gray-500">Livré à votre adresse sous 24–72h</p>
                </button>
                <button
                  onClick={() => setDeliveryType("retrait-hub")}
                  className={`!p-4 rounded-xl border-2 text-left transition-all ${deliveryType === "retrait-hub"
                    ? "border-primary bg-pink-50" : "border-gray-200 hover:bg-gray-50"}`}>
                  <MdWarehouse className={`text-[24px] !mb-2 ${deliveryType === "retrait-hub" ? "text-primary" : "text-gray-400"}`} />
                  <p className="text-[13px] font-[700]">Retrait en hub</p>
                  <p className="text-[11px] text-gray-500">Gratuit • Récupérez dans un hub près de chez vous</p>
                </button>
              </div>
            </div>

            {/* ✅ Adresse OU Hub selon le choix */}
            {deliveryType === "livraison" ? (
              <div className="bg-white rounded-xl shadow-sm !p-5">
                <h3 className="text-[16px] font-[600] !mb-4">Adresse de livraison</h3>
                {addresses.length === 0 ? (
                  <div className="text-center !py-4">
                    <p className="text-gray-400 !mb-3">Aucune adresse enregistrée</p>
                    <Button className="btn-org" onClick={() => navigate("/mes-addresses")}>
                      Ajouter une adresse
                    </Button>
                  </div>
                ) : (
                  addresses.map((addr) => (
                    <div key={addr._id}
                      className={`flex items-start gap-3 !p-3 rounded-lg border !mb-2 cursor-pointer ${selectedAddress === addr._id ? "border-primary bg-pink-50" : "border-gray-200"}`}
                      onClick={() => setSelectedAddress(addr._id)}>
                      <Radio checked={selectedAddress === addr._id} size="small" readOnly />
                      <div>
                        <p className="text-[14px] font-[500]">{addr.addresse}</p>
                        <p className="text-[13px] text-gray-500">{addr.quartier}, {addr.ville}, {addr.pays}</p>
                        <p className="text-[12px] text-gray-400">{addr.mobile}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm !p-5">
                <h3 className="text-[16px] font-[600] !mb-4">Choisir un hub de retrait</h3>
                {hubs.length === 0 ? (
                  <p className="text-gray-400 text-center !py-4">Aucun hub disponible</p>
                ) : (
                  <div className="flex flex-col gap-3 max-h-[320px] overflow-y-auto">
                    {hubs.map((hub) => (
                      <div key={hub._id}
                        className={`flex items-start gap-3 !p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedHub === hub._id ? "border-primary bg-pink-50" : "border-gray-200 hover:bg-gray-50"}`}
                        onClick={() => setSelectedHub(hub._id)}>
                        <Radio checked={selectedHub === hub._id} size="small" readOnly />
                        <div className="flex-1">
                          <p className="text-[14px] font-[700]">{hub.name}</p>
                          {hub.zone && <span className="text-[10px] bg-blue-50 text-blue-600 !px-2 !py-0.5 rounded-full font-[600]">{hub.zone}</span>}
                          <div className="flex flex-col gap-1 !mt-1">
                            <div className="flex items-center gap-1">
                              <MdLocationOn className="text-primary text-[13px]" />
                              <p className="text-[12px] text-gray-600">{hub.address}, {hub.city}</p>
                            </div>
                            {hub.phone && (
                              <div className="flex items-center gap-1">
                                <MdPhone className="text-green-500 text-[12px]" />
                                <p className="text-[12px] text-gray-600">{hub.phone}</p>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <MdAccessTime className="text-orange-500 text-[12px]" />
                              <p className="text-[12px] text-gray-600">{hub.hours || "Lun–Sam : 8h–18h"}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="!mt-3 bg-blue-50 border border-blue-200 rounded-xl !p-3">
                  <p className="text-[12px] text-blue-800">
                    🏭 Votre colis sera disponible au hub choisi sous 24–48h. Vous recevrez une notification quand il est prêt.
                  </p>
                </div>
              </div>
            )}

            {/* Paiement */}
            <div className="bg-white rounded-xl shadow-sm !p-5">
              <h3 className="text-[16px] font-[600] !mb-4">Mode de paiement</h3>
              {[
                { value: "cash", label: "Paiement à la livraison / au retrait" },
                { value: "orange_money", label: "Orange Money" },
                { value: "moov_money", label: "Moov Money" },
              ].map(({ value, label }) => (
                <div key={value}
                  className={`flex items-center gap-3 !p-3 rounded-lg border !mb-2 cursor-pointer ${paymentMethod === value ? "border-primary bg-pink-50" : "border-gray-200"}`}
                  onClick={() => setPaymentMethod(value)}>
                  <Radio checked={paymentMethod === value} size="small" readOnly />
                  <span className="text-[14px]">{label}</span>
                </div>
              ))}
            </div>

            {/* Note */}
            <div className="bg-white rounded-xl shadow-sm !p-5">
              <h3 className="text-[16px] font-[600] !mb-3">Note (optionnel)</h3>
              <textarea value={note} onChange={(e) => setNote(e.target.value)}
                placeholder="Instructions spéciales..."
                rows={3} className="w-full border border-gray-200 rounded-md !px-3 !py-2 text-[14px] focus:outline-none focus:border-primary resize-none" />
            </div>
          </div>

          {/* ── Récapitulatif ───────────────────────────────────────────── */}
          <div className="w-[340px]">
            <div className="bg-white rounded-xl shadow-sm !p-5 sticky top-[10px]">
              <h3 className="text-[16px] font-[600] !mb-4">Récapitulatif</h3>
              <div className="flex flex-col gap-2 max-h-[280px] overflow-y-auto !mb-4">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center gap-3">
                    <img src={item.productId?.images?.[0]} className="w-[45px] h-[45px] object-cover rounded-md flex-shrink-0" alt="" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-[500] line-clamp-1">{item.productId?.name}</p>
                      <p className="text-[12px] text-gray-400">x{item.quantity}{item.size ? ` • ${item.size}` : ""}</p>
                    </div>
                    <span className="text-[13px] font-[600] text-primary flex-shrink-0">
                      {(item.productId?.price * item.quantity).toLocaleString()} Fcfa
                    </span>
                  </div>
                ))}
              </div>
              <hr />
              <div className="flex flex-col gap-2 !mt-3">
                <div className="flex justify-between text-[13px]">
                  <span>Sous-total</span>
                  <span className="font-[500]">{total.toLocaleString()} Fcfa</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span>Livraison</span>
                  <span className={`font-[500] ${deliveryFee === 0 ? "text-green-600" : ""}`}>
                    {deliveryFee === 0 ? "Gratuite 🎉" : `${deliveryFee.toLocaleString()} Fcfa`}
                  </span>
                </div>
                {deliveryType === "retrait-hub" && (
                  <p className="text-[11px] text-green-600 bg-green-50 !px-2 !py-1 rounded-lg">✅ Retrait hub = livraison gratuite</p>
                )}
                <div className="flex justify-between text-[15px] font-[700] !mt-2 !pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary">{totalAmt.toLocaleString()} Fcfa</span>
                </div>
              </div>
              <Button className="btn-org btn-lg w-full flex gap-2 !mt-5"
                onClick={handleOrder}
                disabled={isLoading || cartItems.length === 0}>
                {isLoading ? <CircularProgress size={20} color="inherit" /> : (
                  <><BsBagCheckFill className="text-[18px]" /> Confirmer la commande</>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}




{/*import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../../router";
import { fetchDataFromApi, postData } from "../../../utils/api";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import CircularProgress from "@mui/material/CircularProgress";
import { BsBagCheckFill } from "react-icons/bs";

export default function Checkout() {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isLoading, setIsLoading] = useState(false);
  const [note, setNote] = useState("");

  const cartItems = context.cartItems || [];
  const total = cartItems.reduce((s, i) => s + (i.productId?.price || 0) * i.quantity, 0);
  const deliveryFee = total > 20000 ? 0 : 1000;
  const totalAmt = total + deliveryFee;

  useEffect(() => {
    if (!context.isLogin) { navigate("/connexion"); return; }
    fetchDataFromApi(`/api/address/retrait?userId=${context.userData?._id}`).then((res) => {
      setAddresses(res?.data || []);
      if (res?.data?.length > 0) setSelectedAddress(res.data[0]._id);
    });
  }, [context.userData]);

  const handleOrder = () => {
    if (!selectedAddress) { context.alertBox("error", "Veuillez sélectionner une adresse"); return; }
    if (cartItems.length === 0) { context.alertBox("error", "Votre panier est vide"); return; }

    setIsLoading(true);
    postData("/api/orders/creation-commande", {
      delivery_address: selectedAddress,
      paymentMethod, note
    }).then((res) => {
      if (res?.success) {
        context.alertBox("success", "Commande passée avec succès !");
        context.getCartItems();
        navigate("/mes-commandes");
      } else {
        context.alertBox("error", res?.message || "Erreur lors de la commande");
      }
      setIsLoading(false);
    });
  };

  return (
    <section className="!py-10">
      <div className="w-[95%] !mx-auto !max-w-[1000px]">
        <h2 className="text-[22px] font-[700] !mb-6">Finaliser la commande</h2>

        <div className="flex gap-6">
          
          <div className="flex-1 flex flex-col gap-5">
            
            <div className="bg-white rounded-xl shadow-sm !p-5">
              <h3 className="text-[16px] font-[600] !mb-4">Adresse de livraison</h3>
              {addresses.length === 0 ? (
                <div className="text-center !py-4">
                  <p className="text-gray-400 !mb-3">Aucune adresse enregistrée</p>
                  <Button className="btn-org" onClick={() => navigate("/mes-addresses")}>
                    Ajouter une adresse
                  </Button>
                </div>
              ) : (
                addresses.map((addr) => (
                  <div key={addr._id} className={`flex items-start gap-3 !p-3 rounded-lg border !mb-2 cursor-pointer ${selectedAddress === addr._id ? "border-primary bg-pink-50" : "border-gray-200"}`}
                    onClick={() => setSelectedAddress(addr._id)}>
                    <Radio checked={selectedAddress === addr._id} onChange={() => setSelectedAddress(addr._id)} size="small" />
                    <div>
                      <p className="text-[14px] font-[500]">{addr.addresse}</p>
                      <p className="text-[13px] text-gray-500">{addr.quartier}, {addr.ville}, {addr.pays}</p>
                      <p className="text-[12px] text-gray-400">{addr.mobile}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

           
            <div className="bg-white rounded-xl shadow-sm !p-5">
              <h3 className="text-[16px] font-[600] !mb-4">Mode de paiement</h3>
              {[
                { value: "cash", label: "Paiement à la livraison" },
                { value: "orange_money", label: "Orange Money" },
                { value: "moov_money", label: "Moov Money" },
              ].map(({ value, label }) => (
                <div key={value} className={`flex items-center gap-3 !p-3 rounded-lg border !mb-2 cursor-pointer ${paymentMethod === value ? "border-primary bg-pink-50" : "border-gray-200"}`}
                  onClick={() => setPaymentMethod(value)}>
                  <Radio checked={paymentMethod === value} onChange={() => setPaymentMethod(value)} size="small" />
                  <span className="text-[14px]">{label}</span>
                </div>
              ))}
            </div>

           
            <div className="bg-white rounded-xl shadow-sm !p-5">
              <h3 className="text-[16px] font-[600] !mb-3">Note (optionnel)</h3>
              <textarea value={note} onChange={(e) => setNote(e.target.value)}
                placeholder="Instructions spéciales pour la livraison..."
                rows={3} className="w-full border border-gray-200 rounded-md !px-3 !py-2 text-[14px] focus:outline-none focus:border-primary" />
            </div>
          </div>

         
          <div className="w-[340px]">
            <div className="bg-white rounded-xl shadow-sm !p-5 sticky top-[10px]">
              <h3 className="text-[16px] font-[600] !mb-4">Récapitulatif</h3>
              <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto !mb-4">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center gap-3">
                    <img src={item.productId?.images?.[0]} className="w-[45px] h-[45px] object-cover rounded-md" />
                    <div className="flex-1">
                      <p className="text-[13px] font-[500] line-clamp-1">{item.productId?.name}</p>
                      <p className="text-[12px] text-gray-400">x{item.quantity} {item.size && `• ${item.size}`}</p>
                    </div>
                    <span className="text-[13px] font-[600] text-primary">
                      {(item.productId?.price * item.quantity).toLocaleString()} Fcfa
                    </span>
                  </div>
                ))}
              </div>
              <hr />
              <div className="flex flex-col gap-2 !mt-3">
                <div className="flex justify-between text-[13px]">
                  <span>Sous-total</span><span className="font-[500]">{total.toLocaleString()} Fcfa</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span>Livraison</span>
                  <span className="font-[500]">{deliveryFee === 0 ? "Gratuite" : `${deliveryFee.toLocaleString()} Fcfa`}</span>
                </div>
                <div className="flex justify-between text-[15px] font-[700] !mt-2 !pt-2 border-t">
                  <span>Total</span><span className="text-primary">{totalAmt.toLocaleString()} Fcfa</span>
                </div>
              </div>
              <Button className="btn-org btn-lg w-full flex gap-2 !mt-5"
                onClick={handleOrder} disabled={isLoading || cartItems.length === 0}>
                {isLoading ? <CircularProgress size={20} color="inherit" /> : (
                  <><BsBagCheckFill className="text-[18px]" /> Confirmer la commande</>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
*/}


{/*import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { BsBagCheckFill } from "react-icons/bs";
export default function Checkout(){
               
        
    return(
    <>
         <section className="!py-10">
            <div className="w-[95%] !mx-auto flex gap-5">
                <div className="colG w-[70%]">
                    <div className='card shadow-md rounded-md bg-white !p-5 w-full'>
                         <h1>Details de la facturation</h1>
                      
                                         <form className='w-full !mt-5'>
                                          <div className='flex items-center gap-5 !pb-5'>
                                            <div className='col1 w-[50%]'>
                                                <TextField 
                                                type="text"
                                                 label="Nom Complet *" 
                                                variant="outlined" 
                                                className='w-full'
                                                  size='small'/>
                                                </div>
                                                <div className='col1 w-[50%]'>
                                                <TextField 
                                                type="email"
                                                 label="Email *" 
                                                variant="outlined" 
                                                className='w-full'
                                                  size='small'/>
                                                </div>
                                            </div>
                                            <h6 className='text-[14px] font-[500] !mb-3'> Addresse de rues *</h6>
                                                 <div className='flex items-center gap-5 !pb-5'>
                                            <div className='col1 w-[100%]'>
                                                <TextField 
                                                type="text"
                                                 label="Quartier et numero de rue *" 
                                                variant="outlined" 
                                                className='w-full'
                                                  size='small'/>
                                                </div>
                                                </div>
                                                <div className='flex items-center gap-5 !pb-5'>
                                               <div className='col1 w-[100%]'>
                                                <TextField 
                                                type="text"
                                                 label="Numero de porte (optionnel) *" 
                                                variant="outlined" 
                                                className='w-full'
                                                  size='small'/>
                                                </div>
                                                </div>
                                                  <div className='flex items-center gap-5 !pb-5'>
                                                   <div className='col1 w-[50%]'>
                                                <TextField 
                                                type="text"
                                                 label="Ville/region *" 
                                                variant="outlined" 
                                                className='w-full'
                                                  size='small'/>
                                                </div>
                                                <div className='col1 w-[50%]'>
                                                <TextField 
                                                type="email"
                                                 label="Pays *" 
                                                variant="outlined" 
                                                className='w-full'
                                                  size='small'/>
                                                </div>
                                                </div>
                                                <h6 className='text-[14px] font-[500] !mb-3'>Postcode/Zip *</h6>
                                                <div className='flex items-center gap-5 !pb-5'>
                                               <div className='col1 w-[100%]'>
                                                <TextField 
                                                type="text"
                                                 label="Code Zip (optionnel) *" 
                                                variant="outlined" 
                                                className='w-full'
                                                  size='small'/>
                                                </div>
                                                </div>
                                                 <div className='flex items-center gap-5 !pb-5'>
                                                <div className='col1 w-[50%]'>
                                                <TextField 
                                                type="tel"
                                                 label="Numero de telephone *" 
                                                variant="outlined" 
                                                className='w-full'
                                                  size='small'/>
                                                </div>
                                                <div className='col1 w-[50%]'>
                                                <TextField 
                                                type="tel"
                                                 label="Numero de telephone 2 *" 
                                                variant="outlined" 
                                                className='w-full'
                                                  size='small'/>
                                                </div>
                                            </div>
                                            </form>
                     </div>
                </div>
                <div className="colD w-[30%]">
                   <div className='card shadow-md rounded-md bg-white !p-5 w-full'>
                         <h2 className='!mb-4'>Votre Commande</h2>
                         <div className="flex items-center justify-between !py-3 border-t border-b border-[rgba(0,0,0,0.1)]">
                           <span className="text-[14px] font-[600]">Produits</span>
                            <span className="text-[14px] font-[600]">Total HT</span>
                         </div>
                          <div className="scroll w-full max-h-[250px] overflow-x-hidden overflow-y-scroll !pr-2 ">
                         <div className="flex items-center justify-between !py-2">
                          <div className='part1 flex items-center gap-3'>
                            <div className='img w-[50px] h-[50px] object-cover overflow-hidden rounded-md group cursor-pointer'>
                                 <img src="https://robe-rose-poudre.com/cdn/shop/files/Designsanstitre-2025-04-09T094817.768.png?crop=center&height=1200&v=1744184979&width=1200"
                                        className=" w-full group-hover:scale-105 transition-all"/>
                            </div>
                            <div className='info'>
                                         <h4 className="text-[14px]">Robe area rose</h4>     
                                          <span className="text-[13px]">Qte : 2</span>
                               </div>         
                          </div>
                          <span className="text-[14px] font-[500]">45 000Fca</span>
                         </div>
                          <div className="flex items-center justify-between !py-2">
                          <div className='part1 flex items-center gap-3'>
                            <div className='img w-[50px] h-[50px] object-cover overflow-hidden rounded-md group cursor-pointer'>
                                 <img src="https://robe-rose-poudre.com/cdn/shop/files/Designsanstitre-2025-04-09T094817.768.png?crop=center&height=1200&v=1744184979&width=1200"
                                        className=" w-full group-hover:scale-105 transition-all"/>
                            </div>
                            <div className='info'>
                                         <h4 className="text-[14px]">Robe area rose</h4>     
                                          <span className="text-[13px]">Qte : 2</span>
                               </div>         
                          </div>
                          <span className="text-[14px] font-[500]">45 000Fca</span>
                         </div>
                          <div className="flex items-center justify-between !py-2">
                          <div className='part1 flex items-center gap-3'>
                            <div className='img w-[50px] h-[50px] object-cover overflow-hidden rounded-md group cursor-pointer'>
                                 <img src="https://robe-rose-poudre.com/cdn/shop/files/Designsanstitre-2025-04-09T094817.768.png?crop=center&height=1200&v=1744184979&width=1200"
                                        className=" w-full group-hover:scale-105 transition-all"/>
                            </div>
                            <div className='info'>
                                         <h4 className="text-[14px]">Robe area rose</h4>     
                                          <span className="text-[13px]">Qte : 2</span>
                               </div>         
                          </div>
                          <span className="text-[14px] font-[500]">45 000Fca</span>
                         </div>
                          <div className="flex items-center justify-between !py-2">
                          <div className='part1 flex items-center gap-3'>
                            <div className='img w-[50px] h-[50px] object-cover overflow-hidden rounded-md group cursor-pointer'>
                                 <img src="https://robe-rose-poudre.com/cdn/shop/files/Designsanstitre-2025-04-09T094817.768.png?crop=center&height=1200&v=1744184979&width=1200"
                                        className=" w-full group-hover:scale-105 transition-all"/>
                            </div>
                            <div className='info'>
                                         <h4 className="text-[14px]">Robe area rose</h4>     
                                          <span className="text-[13px]">Qte : 2</span>
                               </div>         
                          </div>
                          <span className="text-[14px] font-[500]">45 000Fca</span>
                         </div>
                         </div>
                         <Button className="btn-org btn-lg w-full flex gap-2 items-center !mt-5"><BsBagCheckFill className="text-[20px]"/>Commander</Button>
                        
                    </div>
                </div>
            </div>
        </section>
    </>
    )
}*/}