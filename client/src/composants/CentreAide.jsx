import { useState, useEffect, useContext } from "react";
import { MyContext } from "../router.jsx";
import { fetchDataFromApi, postData } from "../utils/api.js";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import {
  MdSwapHoriz, MdMoneyOff, MdQuestionAnswer,
  MdLocationOn, MdPhone, MdEmail, MdAccessTime, MdChevronRight,
  MdExpandMore, MdCheckCircle, MdWarehouse, MdSupportAgent,
  MdOutlineInventory2, MdSend
} from "react-icons/md";
import {
  FaShippingFast, FaLock, FaBoxOpen, FaStore,
  FaWhatsapp, FaFacebook, FaInstagram
} from "react-icons/fa";

const FAQ_DATA = [
  {
    cat: "Commandes", icon: MdOutlineInventory2, color: "text-blue-500", bg: "bg-blue-50",
    items: [
      { q: "Comment passer une commande sur Suguba ?", a: "Ajoutez vos produits au panier, connectez-vous, puis cliquez sur « Commander ». Renseignez votre adresse ou choisissez un hub de retrait, sélectionnez votre mode de paiement et confirmez." },
      { q: "Puis-je annuler ma commande ?", a: "Vous pouvez annuler dans les 2 heures suivant la validation depuis « Mes Commandes » en cliquant sur le bouton « Annuler ». Au-delà, contactez notre support." },
      { q: "Comment suivre ma commande ?", a: "Depuis « Mes Commandes », suivez chaque étape : reçue → confirmée → en livraison → livrée. La cloche 🔔 en haut vous notifie de chaque changement de statut." },
      { q: "Puis-je récupérer ma commande en hub ?", a: "Oui ! Lors de la commande, choisissez « Retrait en hub » et sélectionnez le hub le plus proche. La livraison est alors gratuite." },
      { q: "Quels sont les délais de livraison ?", a: "Bamako : 24–72h. Villes de l'intérieur : 3–7 jours. Livraison gratuite dès 20 000 Fcfa ou pour tout retrait en hub." },
    ]
  },
  {
    cat: "Paiement", icon: FaLock, color: "text-green-500", bg: "bg-green-50",
    items: [
      { q: "Quels modes de paiement sont acceptés ?", a: "Orange Money Mali, Moov Money Mali, et paiement à la livraison / au retrait (espèces)." },
      { q: "Mon paiement est-il sécurisé ?", a: "Oui. Tous les paiements mobile money transitent par des passerelles sécurisées. Vos données ne sont jamais stockées." },
      { q: "J'ai été débité mais ma commande n'est pas validée. Que faire ?", a: "Contactez immédiatement notre support avec votre numéro de transaction. Nous traitons ce type de réclamation sous 24h." },
    ]
  },
  {
    cat: "Livraison & Hubs", icon: FaShippingFast, color: "text-orange-500", bg: "bg-orange-50",
    items: [
      { q: "Comment fonctionne la livraison via les hubs ?", a: "Les vendeurs déposent vos colis dans un hub Suguba. Notre équipe les récupère et vous les livre, ou vous pouvez les retirer directement au hub." },
      { q: "Que faire si je n'étais pas disponible à la livraison ?", a: "Notre livreur tente un second passage le lendemain. Après deux tentatives, votre colis est conservé au hub de votre zone pendant 5 jours." },
    ]
  },
  {
    cat: "Vendeurs", icon: FaStore, color: "text-purple-500", bg: "bg-purple-50",
    items: [
      { q: "Comment devenir vendeur sur Suguba ?", a: "Créez un compte, allez dans « Devenir Vendeur » et remplissez les infos de votre boutique. Activation immédiate et gratuite. Commission : 10%." },
      { q: "Quand est-ce que je reçois mes paiements ?", a: "Reversement en fin de mois, après déduction de la commission Suguba (10% standard, 15% pour les produits mis en avant)." },
    ]
  },
];

const CONTACT_INFO = [
  { icon: MdPhone, label: "Téléphone / WhatsApp", value: "+223 70 00 00 00", color: "text-green-500", bg: "bg-green-50" },
  { icon: MdEmail, label: "Email Support", value: "support@suguba.ml", color: "text-blue-500", bg: "bg-blue-50" },
  { icon: MdAccessTime, label: "Horaires support", value: "Lun – Sam : 8h00 – 20h00", color: "text-orange-500", bg: "bg-orange-50" },
  { icon: MdLocationOn, label: "Siège Suguba", value: "Bamako, Hamdallaye ACI 2000", color: "text-primary", bg: "bg-pink-50" },
];

function FaqSection({ category }) {
  const [openIndex, setOpenIndex] = useState(null);
  const Icon = category.icon;
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 !px-5 !py-4 border-b border-gray-100">
        <div className={`w-[38px] h-[38px] ${category.bg} rounded-full flex items-center justify-center`}>
          <Icon className={`text-[18px] ${category.color}`} />
        </div>
        <h3 className="text-[15px] font-[700]">{category.cat}</h3>
      </div>
      {category.items.map((item, i) => (
        <div key={i} className="border-b border-gray-50 last:border-0">
          <button className="w-full flex items-center justify-between !px-5 !py-4 text-left hover:bg-gray-50 transition-all"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}>
            <span className="text-[13px] font-[600] text-gray-800 pr-3">{item.q}</span>
            {openIndex === i
              ? <MdExpandMore className="text-primary text-[20px] flex-shrink-0" />
              : <MdChevronRight className="text-gray-400 text-[20px] flex-shrink-0" />}
          </button>
          {openIndex === i && (
            <div className="!px-5 !pb-4 text-[13px] text-gray-600 leading-relaxed bg-gray-50">{item.a}</div>
          )}
        </div>
      ))}
    </div>
  );
}

function HubsSection() {
  const [hubs, setHubs] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchDataFromApi("/api/hubs").then(res => { setHubs(res?.data || []); setLoading(false); });
  }, []);
  if (loading) return <div className="flex justify-center !py-10"><CircularProgress size={28} /></div>;
  return (
    <div className="grid grid-cols-2 gap-4">
      {hubs.length === 0 ? (
        <div className="col-span-2 text-center !py-10 text-gray-400">
          <MdWarehouse className="text-[48px] !mx-auto !mb-3 opacity-30" />
          <p>Aucun hub disponible pour le moment</p>
        </div>
      ) : hubs.map(hub => (
        <div key={hub._id} className="bg-white rounded-xl border border-gray-100 shadow-sm !p-5 hover:shadow-md transition-all">
          <div className="flex items-start justify-between !mb-3">
            <div>
              <h4 className="text-[14px] font-[700] text-gray-800">{hub.name}</h4>
              {hub.zone && <span className="text-[10px] bg-primary/10 text-primary font-[600] !px-2 !py-0.5 rounded-full">{hub.zone}</span>}
            </div>
            <span className="text-[10px] bg-green-100 text-green-700 font-[600] !px-2 !py-1 rounded-full">✅ Ouvert</span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <MdLocationOn className="text-primary text-[15px] flex-shrink-0 !mt-0.5" />
              <p className="text-[12px] text-gray-600">{hub.address}, <strong>{hub.city}</strong></p>
            </div>
            {hub.phone && <div className="flex items-center gap-2"><MdPhone className="text-green-500 text-[13px]" /><p className="text-[12px] text-gray-600">{hub.phone}</p></div>}
            {hub.manager && <p className="text-[11px] text-gray-400">Responsable : {hub.manager}</p>}
            <div className="flex items-center gap-2"><MdAccessTime className="text-orange-500 text-[13px]" /><p className="text-[12px] text-gray-600">{hub.hours || "Lun–Sam : 8h–18h"}</p></div>
          </div>
          {hub.latitude && hub.longitude && (
            <a href={`https://maps.google.com/?q=${hub.latitude},${hub.longitude}`} target="_blank" rel="noopener noreferrer"
              className="!mt-3 !pt-3 border-t border-gray-100 flex items-center gap-1 text-[12px] text-primary font-[600] hover:underline">
              <MdLocationOn /> Voir sur Google Maps →
            </a>
          )}
        </div>
      ))}
    </div>
  );
}

// ✅ Formulaire Retour/Échange — connecté au vrai backend
function RequestForm() {
  const context = useContext(MyContext);
  const [type, setType] = useState("return");
  const [formData, setFormData] = useState({ orderId: "", productId: "", reason: "", details: "", newSize: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [refCode, setRefCode] = useState("");

  const REASONS_RETURN = ["Produit défectueux / endommagé", "Produit non conforme à la description", "Produit reçu en mauvais état", "Erreur de livraison (mauvais produit)", "Produit de mauvaise qualité", "Autre raison"];
  const REASONS_EXCHANGE = ["Problème de taille (trop grand)", "Problème de taille (trop petit)", "Mauvaise couleur reçue", "Souhait de changer de modèle", "Autre raison"];
  const reasons = type === "return" ? REASONS_RETURN : REASONS_EXCHANGE;

  const handleSubmit = async () => {
    if (!context.isLogin) { context.alertBox("error", "Vous devez être connecté pour soumettre une demande"); return; }
    if (!formData.orderId.trim() || !formData.reason || !formData.details.trim()) { context.alertBox("error", "Veuillez remplir tous les champs obligatoires"); return; }
    setLoading(true);
    const res = await postData("/api/support/demande", { type, orderId: formData.orderId.trim(), productId: formData.productId.trim(), reason: formData.reason, details: formData.details, newSize: formData.newSize });
    setLoading(false);
    if (res?.success) { setRefCode(res.data?.ref || "—"); setSubmitted(true); }
    else context.alertBox("error", res?.message || "Une erreur est survenue. Réessayez.");
  };

  if (submitted) return (
    <div className="flex flex-col items-center !py-12 gap-4">
      <div className="w-[70px] h-[70px] bg-green-100 rounded-full flex items-center justify-center"><MdCheckCircle className="text-green-500 text-[40px]" /></div>
      <h3 className="text-[18px] font-[700] text-gray-800">Demande envoyée !</h3>
      <p className="text-[14px] text-gray-500 text-center max-w-[400px]">Notre équipe examinera votre demande et vous contactera sous <strong>24–48h ouvrables</strong>.</p>
      <div className="bg-gray-100 !px-4 !py-2 rounded-xl"><p className="text-[12px] text-gray-600">Référence : <strong className="text-primary">#{refCode}</strong></p></div>
      <Button className="btn-org !capitalize !mt-2" onClick={() => { setSubmitted(false); setFormData({ orderId: "", productId: "", reason: "", details: "", newSize: "" }); }}>Nouvelle demande</Button>
    </div>
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3">
        {[
          { key: "return", icon: MdMoneyOff, label: "Retour & Remboursement", desc: "Produit défectueux ou non conforme", colorActive: "border-red-400 bg-red-50", iconColor: "text-red-500" },
          { key: "exchange", icon: MdSwapHoriz, label: "Échange", desc: "Problème de taille, couleur, modèle", colorActive: "border-blue-400 bg-blue-50", iconColor: "text-blue-500" },
        ].map(({ key, icon: Icon, label, desc, colorActive, iconColor }) => (
          <button key={key} onClick={() => { setType(key); setFormData(p => ({ ...p, reason: "" })); }}
            className={`!p-4 rounded-xl border-2 text-left transition-all ${type === key ? colorActive : "border-gray-200 bg-white hover:bg-gray-50"}`}>
            <Icon className={`text-[22px] !mb-1 ${type === key ? iconColor : "text-gray-400"}`} />
            <p className="text-[13px] font-[700]">{label}</p>
            <p className="text-[11px] text-gray-500">{desc}</p>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <TextField label="N° de commande *" size="small" fullWidth placeholder="Ex: SUG-AB12CD34" value={formData.orderId} onChange={e => setFormData(p => ({ ...p, orderId: e.target.value }))} />
        <TextField label="ID Produit (optionnel)" size="small" fullWidth placeholder="Copiez-le depuis Mes Commandes" value={formData.productId} onChange={e => setFormData(p => ({ ...p, productId: e.target.value }))} />
      </div>
      <div>
        <p className="text-[13px] font-[600] text-gray-700 !mb-1">Raison *</p>
        <Select size="small" fullWidth value={formData.reason} onChange={e => setFormData(p => ({ ...p, reason: e.target.value }))} displayEmpty>
          <MenuItem value="" disabled><em>Sélectionnez une raison</em></MenuItem>
          {reasons.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
        </Select>
      </div>
      {type === "exchange" && <TextField label="Nouvelle taille / couleur souhaitée" size="small" fullWidth value={formData.newSize} onChange={e => setFormData(p => ({ ...p, newSize: e.target.value }))} />}
      <TextField label="Décrivez votre problème *" multiline rows={3} fullWidth size="small" placeholder="Décrivez en détail ce qui s'est passé..." value={formData.details} onChange={e => setFormData(p => ({ ...p, details: e.target.value }))} />
      <div className="bg-amber-50 border border-amber-200 rounded-xl !p-3">
        <p className="text-[12px] text-amber-800">⚠️ Les demandes de retour sont acceptées dans les <strong>30 jours</strong> suivant la livraison, pour les produits en état d'origine.</p>
      </div>
      <Button onClick={handleSubmit} disabled={loading} className="btn-org !capitalize !py-2 flex gap-2 !font-[600]">
        {loading ? <CircularProgress size={20} color="inherit" /> : <><MdSend /> Envoyer ma demande</>}
      </Button>
    </div>
  );
}

// ✅ Formulaire Contact — connecté au vrai backend
function ContactForm() {
  const context = useContext(MyContext);
  const [form, setForm] = useState({ clientName: "", clientEmail: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [refCode, setRefCode] = useState("");

  useEffect(() => {
    if (context?.userData) {
      setForm(p => ({ ...p, clientName: context.userData.name || "", clientEmail: context.userData.email || "" }));
    }
  }, [context?.userData]);

  const handleSubmit = async () => {
    if (!form.clientName.trim() || !form.subject.trim() || !form.message.trim()) { context.alertBox("error", "Veuillez remplir le nom, l'objet et le message"); return; }
    setLoading(true);
    // Route publique — pas besoin d'être connecté
    const res = await postData("/api/support/contact", { clientName: form.clientName, clientEmail: form.clientEmail, subject: form.subject, message: form.message });
    setLoading(false);
    if (res?.success) { setRefCode(res.data?.ref || "—"); setSubmitted(true); }
    else context.alertBox("error", res?.message || "Une erreur est survenue. Réessayez.");
  };

  if (submitted) return (
    <div className="flex flex-col items-center !py-10 gap-4">
      <div className="w-[64px] h-[64px] bg-green-100 rounded-full flex items-center justify-center"><MdCheckCircle className="text-green-500 text-[36px]" /></div>
      <h3 className="text-[17px] font-[700] text-gray-800">Message envoyé !</h3>
      <p className="text-[13px] text-gray-500 text-center">Notre équipe vous répondra sous 24h.</p>
      <div className="bg-gray-100 !px-4 !py-2 rounded-xl"><p className="text-[12px] text-gray-600">Référence : <strong className="text-primary">#{refCode}</strong></p></div>
      <Button className="btn-org !capitalize !mt-2" onClick={() => { setSubmitted(false); setForm(p => ({ ...p, subject: "", message: "" })); }}>Envoyer un autre message</Button>
    </div>
  );

  return (
    <div className="flex flex-col gap-3 max-w-[560px]">
      <div className="grid grid-cols-2 gap-3">
        <TextField label="Votre nom *" size="small" fullWidth value={form.clientName} onChange={e => setForm(p => ({ ...p, clientName: e.target.value }))} />
        <TextField label="Email ou téléphone" size="small" fullWidth value={form.clientEmail} onChange={e => setForm(p => ({ ...p, clientEmail: e.target.value }))} />
      </div>
      <TextField label="Objet *" size="small" fullWidth value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} />
      <TextField label="Votre message *" multiline rows={4} fullWidth size="small" placeholder="Décrivez votre problème ou question..." value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} />
      <Button onClick={handleSubmit} disabled={loading} className="btn-org !capitalize !py-2 w-fit !px-8 !font-[600] flex gap-2">
        {loading ? <CircularProgress size={18} color="inherit" /> : <><MdSend /> Envoyer le message</>}
      </Button>
    </div>
  );
}

export default function CentreAide() {
  const [activeSection, setActiveSection] = useState("faq");
  const sections = [
    { key: "faq", icon: MdQuestionAnswer, label: "FAQ", desc: "Questions fréquentes" },
    { key: "request", icon: FaBoxOpen, label: "Retour / Échange", desc: "Faire une demande" },
    { key: "hubs", icon: MdWarehouse, label: "Nos Hubs", desc: "Points de dépôt & retrait" },
    { key: "contact", icon: MdSupportAgent, label: "Nous contacter", desc: "Support & équipe" },
  ];

  return (
    <div className="w-[95%] !mx-auto !py-8">
      <div className="bg-gradient-to-r from-primary to-pink-600 rounded-2xl !p-10 !mb-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white opacity-5 rounded-full translate-x-[80px] -translate-y-[80px]" />
        <div className="relative z-10">
          <h1 className="text-[32px] font-[800] !mb-2">Centre d'aide Suguba 🛟</h1>
          <p className="text-[16px] opacity-90 !mb-6">Comment pouvons-nous vous aider aujourd'hui ?</p>
          <div className="grid grid-cols-4 gap-3">
            {sections.map(({ key, icon: Icon, label, desc }) => (
              <button key={key} onClick={() => setActiveSection(key)}
                className={`!p-4 rounded-xl text-left transition-all border ${activeSection === key ? "bg-white text-primary border-white shadow-lg" : "bg-white/10 text-white border-white/20 hover:bg-white/20"}`}>
                <Icon className="text-[22px] !mb-2" />
                <p className="text-[13px] font-[700]">{label}</p>
                <p className={`text-[11px] ${activeSection === key ? "text-gray-500" : "opacity-70"}`}>{desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeSection === "faq" && (
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2 !mb-2"><MdQuestionAnswer className="text-primary text-[22px]" /><h2 className="text-[20px] font-[800]">Questions fréquentes</h2></div>
          {FAQ_DATA.map(cat => <FaqSection key={cat.cat} category={cat} />)}
        </div>
      )}

      {activeSection === "request" && (
        <div className="bg-white rounded-2xl shadow-sm !p-8 max-w-[680px]">
          <div className="flex items-center gap-3 !mb-6">
            <div className="w-[44px] h-[44px] bg-orange-50 rounded-full flex items-center justify-center"><FaBoxOpen className="text-orange-500 text-[20px]" /></div>
            <div><h2 className="text-[18px] font-[800]">Demande de retour ou d'échange</h2><p className="text-[13px] text-gray-500">Notre équipe vous répond sous 24–48h</p></div>
          </div>
          <RequestForm />
        </div>
      )}

      {activeSection === "hubs" && (
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3 !mb-2">
            <MdWarehouse className="text-primary text-[24px]" />
            <div><h2 className="text-[20px] font-[800]">Nos Hubs Suguba</h2><p className="text-[13px] text-gray-500">Points de dépôt vendeurs et de retrait client</p></div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl !p-4 !mb-2">
            <p className="text-[13px] text-blue-800">💡 <strong>Comment ça marche ?</strong> Les vendeurs déposent vos commandes dans le hub de leur zone. Vous pouvez les récupérer directement ou choisir la livraison à domicile.</p>
          </div>
          <HubsSection />
        </div>
      )}

      {activeSection === "contact" && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2 !mb-2"><MdSupportAgent className="text-primary text-[24px]" /><h2 className="text-[20px] font-[800]">Contactez l'équipe Suguba</h2></div>
          <div className="grid grid-cols-2 gap-4">
            {CONTACT_INFO.map(({ icon: Icon, label, value, color, bg }) => (
              <div key={label} className="bg-white rounded-xl shadow-sm !p-5 flex items-center gap-4 hover:shadow-md transition-all">
                <div className={`w-[46px] h-[46px] ${bg} rounded-full flex items-center justify-center flex-shrink-0`}><Icon className={`text-[22px] ${color}`} /></div>
                <div><p className="text-[11px] text-gray-400 font-[500] uppercase tracking-wide">{label}</p><p className="text-[14px] font-[700] text-gray-800">{value}</p></div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl shadow-sm !p-6">
            <h3 className="text-[15px] font-[700] !mb-4">Suivez-nous sur les réseaux sociaux</h3>
            <div className="flex gap-4">
              {[{ icon: FaWhatsapp, label: "WhatsApp", href: "https://wa.me/22370000000", color: "bg-green-500" }, { icon: FaFacebook, label: "Facebook", href: "https://facebook.com/suguba", color: "bg-blue-600" }, { icon: FaInstagram, label: "Instagram", href: "https://instagram.com/suguba", color: "bg-gradient-to-br from-pink-500 to-orange-400" }].map(({ icon: Icon, label, href, color }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 !px-5 !py-3 rounded-xl text-white font-[600] text-[13px] transition-all hover:opacity-90 ${color}`}><Icon className="text-[18px]" /> {label}</a>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm !p-6">
            <h3 className="text-[15px] font-[700] !mb-4">Envoyer un message directement</h3>
            <ContactForm />
          </div>
        </div>
      )}
    </div>
  );
}



{/*import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MyContext } from "../router.jsx";
import { fetchDataFromApi, postData } from "../utils/api.js";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import {
  MdLocalOffer, MdSwapHoriz, MdMoneyOff, MdQuestionAnswer,
  MdLocationOn, MdPhone, MdEmail, MdAccessTime, MdChevronRight,
   MdExpandMore, MdCheckCircle, MdWarehouse, MdSupportAgent,
  MdOutlineInventory2
} from "react-icons/md";
import {
  FaShippingFast, FaLock, FaBoxOpen, FaStore,
  FaWhatsapp, FaFacebook, FaInstagram
} from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

// ── Données statiques ───────────────────────────────────────────────────────
const FAQ_DATA = [
  {
    cat: "Commandes",
    icon: MdOutlineInventory2,
    color: "text-blue-500",
    bg: "bg-blue-50",
    items: [
      { q: "Comment passer une commande sur Suguba ?", a: "Ajoutez vos produits au panier, connectez-vous à votre compte, puis allez dans le panier et cliquez sur « Commander ». Renseignez votre adresse de livraison et choisissez votre mode de paiement (Orange Money, Moov Money ou paiement à la livraison)." },
      { q: "Puis-je modifier ou annuler ma commande ?", a: "Vous pouvez annuler une commande dans les 2 heures suivant sa validation, depuis la page « Mes Commandes ». Au-delà de ce délai, contactez notre support via WhatsApp ou email pour une demande d'annulation." },
      { q: "Comment suivre ma commande ?", a: "Depuis votre espace « Mes Commandes », vous pouvez suivre l'évolution de chaque commande : en attente → confirmée → en livraison → livrée. Vous recevrez aussi une notification à chaque changement de statut." },
      { q: "Quels sont les délais de livraison ?", a: "Pour Bamako : 24 à 72h selon votre quartier. Pour les villes de l'intérieur : 3 à 7 jours. La livraison est gratuite pour toute commande dépassant 20 000 Fcfa, sinon des frais de 1 000 Fcfa s'appliquent." },
    ]
  },
  {
    cat: "Paiement",
    icon: FaLock,
    color: "text-green-500",
    bg: "bg-green-50",
    items: [
      { q: "Quels modes de paiement sont acceptés ?", a: "Suguba accepte : Orange Money Mali, Moov Money Mali, et le paiement à la livraison (en espèces). Les paiements par carte bancaire seront disponibles prochainement." },
      { q: "Mon paiement est-il sécurisé ?", a: "Oui. Tous les paiements mobile money transitent par des passerelles sécurisées et certifiées. Vos données bancaires ne sont jamais stockées sur nos serveurs." },
      { q: "J'ai été débité mais ma commande n'est pas validée. Que faire ?", a: "Ce cas est rare mais peut arriver. Contactez immédiatement notre support avec votre numéro de transaction et votre email. Nous traitons ce type de réclamation en priorité sous 24h." },
    ]
  },
  {
    cat: "Livraison & Hubs",
    icon: FaShippingFast,
    color: "text-orange-500",
    bg: "bg-orange-50",
    items: [
      { q: "Comment fonctionne la livraison via les hubs ?", a: "Les hubs Suguba sont des points relais où les vendeurs déposent vos colis. Notre équipe les récupère et les livre à votre adresse. Vous pouvez aussi choisir de récupérer votre colis directement dans le hub de votre quartier." },
      { q: "Puis-je récupérer ma commande dans un hub ?", a: "Oui ! Lors de votre commande, sélectionnez « Retrait en hub » et choisissez le hub le plus proche de chez vous. Vous recevrez une notification quand votre colis est prêt." },
      { q: "Que faire si je n'étais pas disponible à la livraison ?", a: "Notre livreur tentera un second passage le lendemain. Après deux tentatives infructueuses, votre colis sera conservé au hub de votre zone pendant 5 jours. Passé ce délai, il sera retourné au vendeur." },
    ]
  },
  {
    cat: "Vendeurs",
    icon: FaStore,
    color: "text-purple-500",
    bg: "bg-purple-50",
    items: [
      { q: "Comment devenir vendeur sur Suguba ?", a: "Créez un compte, puis allez dans « Devenir Vendeur » et remplissez les informations de votre boutique. L'activation est immédiate et gratuite. Une commission de 10% est prélevée sur chaque vente." },
      { q: "Quand est-ce que je reçois mes paiements ?", a: "Les paiements sont reversés aux vendeurs en fin de mois, après déduction de la commission Suguba (10% standard, 15% pour les produits mis en avant ou en Offre Spéciale). Vous recevez un récapitulatif détaillé." },
    ]
  },
];

const CONTACT_INFO = [
  { icon: MdPhone, label: "Téléphone / WhatsApp", value: "+223 70 00 00 00", color: "text-green-500", bg: "bg-green-50" },
  { icon: MdEmail, label: "Email Support", value: "support@suguba.ml", color: "text-blue-500", bg: "bg-blue-50" },
  { icon: MdAccessTime, label: "Horaires support", value: "Lun – Sam : 8h00 – 20h00", color: "text-orange-500", bg: "bg-orange-50" },
  { icon: MdLocationOn, label: "Siège Suguba", value: "Bamako, Hamdallaye ACI 2000", color: "text-primary", bg: "bg-pink-50" },
];

// ── Composant FAQ accordéon ─────────────────────────────────────────────────
function FaqSection({ category }) {
  const [openIndex, setOpenIndex] = useState(null);
  const Icon = category.icon;
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className={`flex items-center gap-3 !px-5 !py-4 border-b border-gray-100`}>
        <div className={`w-[38px] h-[38px] ${category.bg} rounded-full flex items-center justify-center`}>
          <Icon className={`text-[18px] ${category.color}`} />
        </div>
        <h3 className="text-[15px] font-[700]">{category.cat}</h3>
      </div>
      {category.items.map((item, i) => (
        <div key={i} className="border-b border-gray-50 last:border-0">
          <button
            className="w-full flex items-center justify-between !px-5 !py-4 text-left hover:bg-gray-50 transition-all"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}>
            <span className="text-[13px] font-[600] text-gray-800 pr-3">{item.q}</span>
            {openIndex === i
              ? <MdExpandMore className="text-primary text-[20px] flex-shrink-0" />
              : <MdChevronRight className="text-gray-400 text-[20px] flex-shrink-0" />
            }
          </button>
          {openIndex === i && (
            <div className="!px-5 !pb-4 text-[13px] text-gray-600 leading-relaxed bg-gray-50">
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Composant Hubs ──────────────────────────────────────────────────────────
function HubsSection() {
  const [hubs, setHubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDataFromApi("/api/hubs").then((res) => {
      setHubs(res?.data || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex justify-center !py-10"><CircularProgress size={28} /></div>;

  return (
    <div className="grid grid-cols-2 gap-4">
      {hubs.length === 0 ? (
        <div className="col-span-2 text-center !py-10 text-gray-400">
          <MdWarehouse className="text-[48px] !mx-auto !mb-3 opacity-30" />
          <p>Aucun hub disponible pour le moment</p>
        </div>
      ) : hubs.map((hub) => (
        <div key={hub._id}
          className="bg-white rounded-xl border border-gray-100 shadow-sm !p-5 hover:shadow-md transition-all">
          <div className="flex items-start justify-between !mb-3">
            <div>
              <h4 className="text-[14px] font-[700] text-gray-800">{hub.name}</h4>
              {hub.zone && (
                <span className="text-[10px] bg-primary/10 text-primary font-[600] !px-2 !py-0.5 rounded-full">{hub.zone}</span>
              )}
            </div>
            <span className="text-[10px] bg-green-100 text-green-700 font-[600] !px-2 !py-1 rounded-full">✅ Ouvert</span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <MdLocationOn className="text-primary text-[15px] flex-shrink-0 !mt-0.5" />
              <p className="text-[12px] text-gray-600">{hub.address}, <strong>{hub.city}</strong></p>
            </div>
            {hub.phone && (
              <div className="flex items-center gap-2">
                <MdPhone className="text-green-500 text-[13px] flex-shrink-0" />
                <p className="text-[12px] text-gray-600">{hub.phone}</p>
              </div>
            )}
            {hub.manager && (
              <p className="text-[11px] text-gray-400">Responsable : {hub.manager}</p>
            )}
            <div className="flex items-center gap-2">
              <MdAccessTime className="text-orange-500 text-[13px] flex-shrink-0" />
              <p className="text-[12px] text-gray-600">{hub.hours || "Lun–Sam : 8h–18h"}</p>
            </div>
          </div>
          {hub.latitude && hub.longitude && (
            <a
              href={`https://maps.google.com/?q=${hub.latitude},${hub.longitude}`}
              target="_blank" rel="noopener noreferrer"
              className="!mt-3 !pt-3 border-t border-gray-100 flex items-center gap-1 text-[12px] text-primary font-[600] hover:underline">
              <MdLocationOn /> Voir sur Google Maps →
            </a>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Formulaire retour / échange ─────────────────────────────────────────────
function RequestForm() {
  const context = useContext(MyContext);
  const [type, setType] = useState("return"); // "return" | "exchange"
  const [formData, setFormData] = useState({
    orderId: "", productId: "", reason: "", details: "", newSize: ""
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const REASONS_RETURN = [
    "Produit défectueux / endommagé",
    "Produit non conforme à la description",
    "Produit reçu en mauvais état",
    "Erreur de livraison (mauvais produit)",
    "Produit de mauvaise qualité",
    "Autre raison",
  ];
  const REASONS_EXCHANGE = [
    "Problème de taille (trop grand)",
    "Problème de taille (trop petit)",
    "Mauvaise couleur reçue",
    "Souhait de changer de modèle",
    "Autre raison",
  ];
  const reasons = type === "return" ? REASONS_RETURN : REASONS_EXCHANGE;

  const handleSubmit = async () => {
    if (!context.isLogin) {
      context.alertBox("error", "Vous devez être connecté pour soumettre une demande");
      return;
    }
    if (!formData.orderId.trim() || !formData.reason || !formData.details.trim()) {
      context.alertBox("error", "Veuillez remplir tous les champs obligatoires");
      return;
    }
    setLoading(true);
    // Simuler l'envoi (à connecter à votre API support)
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
    // En production : postData("/api/support/demande", { type, ...formData })
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center !py-12 gap-4">
        <div className="w-[70px] h-[70px] bg-green-100 rounded-full flex items-center justify-center">
          <MdCheckCircle className="text-green-500 text-[40px]" />
        </div>
        <h3 className="text-[18px] font-[700] text-gray-800">Demande envoyée !</h3>
        <p className="text-[14px] text-gray-500 text-center max-w-[400px]">
          Notre équipe va examiner votre demande et vous contactera sous <strong>24–48h ouvrables</strong> via email ou WhatsApp.
        </p>
        <p className="text-[12px] text-gray-400">Référence : #{Math.random().toString(36).slice(2, 10).toUpperCase()}</p>
        <Button className="btn-org !capitalize !mt-2" onClick={() => { setSubmitted(false); setFormData({ orderId: "", productId: "", reason: "", details: "", newSize: "" }); }}>
          Nouvelle demande
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      
      <div className="grid grid-cols-2 gap-3">
        {[
          { key: "return", icon: MdMoneyOff, label: "Retour & Remboursement", desc: "Produit défectueux ou non conforme", color: "border-red-300 bg-red-50" },
          { key: "exchange", icon: MdSwapHoriz, label: "Échange", desc: "Problème de taille, couleur, modèle", color: "border-blue-300 bg-blue-50" },
        ].map(({ key, icon: Icon, label, desc, color }) => (
          <button key={key}
            onClick={() => { setType(key); setFormData(p => ({ ...p, reason: "" })); }}
            className={`!p-4 rounded-xl border-2 text-left transition-all ${type === key ? color + " border-opacity-100" : "border-gray-200 bg-white hover:bg-gray-50"}`}>
            <Icon className={`text-[22px] !mb-1 ${type === key ? (key === "return" ? "text-red-500" : "text-blue-500") : "text-gray-400"}`} />
            <p className="text-[13px] font-[700]">{label}</p>
            <p className="text-[11px] text-gray-500">{desc}</p>
          </button>
        ))}
      </div>

     
      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="N° de commande *" size="small" fullWidth
          placeholder="Ex: SUG-AB12CD34"
          value={formData.orderId}
          onChange={e => setFormData(p => ({ ...p, orderId: e.target.value }))}
        />
        <TextField
          label="ID Produit (optionnel)" size="small" fullWidth
          placeholder="Visible dans vos commandes"
          value={formData.productId}
          onChange={e => setFormData(p => ({ ...p, productId: e.target.value }))}
        />
      </div>

      <div>
        <p className="text-[13px] font-[600] text-gray-700 !mb-1">Raison *</p>
        <Select size="small" fullWidth value={formData.reason}
          onChange={e => setFormData(p => ({ ...p, reason: e.target.value }))}
          displayEmpty>
          <MenuItem value="" disabled><em>Sélectionnez une raison</em></MenuItem>
          {reasons.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
        </Select>
      </div>

      {type === "exchange" && (
        <TextField
          label="Nouvelle taille / couleur souhaitée" size="small" fullWidth
          value={formData.newSize}
          onChange={e => setFormData(p => ({ ...p, newSize: e.target.value }))}
        />
      )}

      <TextField
        label="Décrivez votre problème *" multiline rows={3} fullWidth size="small"
        placeholder="Décrivez en détail ce qui s'est passé..."
        value={formData.details}
        onChange={e => setFormData(p => ({ ...p, details: e.target.value }))}
      />

      <div className="bg-amber-50 border border-amber-200 rounded-xl !p-3">
        <p className="text-[12px] text-amber-800">
          ⚠️ Les demandes de retour sont acceptées dans les <strong>30 jours</strong> suivant la livraison, pour les produits en état d'origine avec leur emballage.
        </p>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="btn-org !capitalize !py-2 flex gap-2 !font-[600]">
        {loading ? <CircularProgress size={20} color="inherit" /> : "Envoyer ma demande →"}
      </Button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL — Centre d'Aide
// ══════════════════════════════════════════════════════════════════════════════
export default function CentreAide() {
  const [activeSection, setActiveSection] = useState("faq");

  const sections = [
    { key: "faq", icon: MdQuestionAnswer, label: "FAQ", desc: "Questions fréquentes" },
    { key: "request", icon: FaBoxOpen, label: "Retour / Échange", desc: "Faire une demande" },
    { key: "hubs", icon: MdWarehouse, label: "Nos Hubs", desc: "Points de dépôt & retrait" },
    { key: "contact", icon: MdSupportAgent, label: "Nous contacter", desc: "Support & équipe" },
  ];

  return (
    <div className="w-[95%] !mx-auto !py-8">
      
      <div className="bg-gradient-to-r from-primary to-pink-600 rounded-2xl !p-10 !mb-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white opacity-5 rounded-full translate-x-[80px] -translate-y-[80px]" />
        <div className="relative z-10">
          <h1 className="text-[32px] font-[800] !mb-2">Centre d'aide Suguba 🛟</h1>
          <p className="text-[16px] opacity-90 !mb-6">Comment pouvons-nous vous aider aujourd'hui ?</p>
          <div className="grid grid-cols-4 gap-3">
            {sections.map(({ key, icon: Icon, label, desc }) => (
              <button key={key}
                onClick={() => setActiveSection(key)}
                className={`!p-4 rounded-xl text-left transition-all border ${activeSection === key
                  ? "bg-white text-primary border-white shadow-lg"
                  : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                }`}>
                <Icon className="text-[22px] !mb-2" />
                <p className="text-[13px] font-[700]">{label}</p>
                <p className={`text-[11px] ${activeSection === key ? "text-gray-500" : "opacity-70"}`}>{desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      
      {activeSection === "faq" && (
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2 !mb-2">
            <MdQuestionAnswer className="text-primary text-[22px]" />
            <h2 className="text-[20px] font-[800]">Questions fréquentes</h2>
          </div>
          {FAQ_DATA.map((cat) => <FaqSection key={cat.cat} category={cat} />)}
        </div>
      )}

      
      {activeSection === "request" && (
        <div className="bg-white rounded-2xl shadow-sm !p-8 max-w-[680px]">
          <div className="flex items-center gap-3 !mb-6">
            <div className="w-[44px] h-[44px] bg-orange-50 rounded-full flex items-center justify-center">
              <FaBoxOpen className="text-orange-500 text-[20px]" />
            </div>
            <div>
              <h2 className="text-[18px] font-[800]">Demande de retour ou d'échange</h2>
              <p className="text-[13px] text-gray-500">Remplissez ce formulaire, notre équipe vous répond sous 24–48h</p>
            </div>
          </div>
          <RequestForm />
        </div>
      )}

      
      {activeSection === "hubs" && (
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3 !mb-2">
            <MdWarehouse className="text-primary text-[24px]" />
            <div>
              <h2 className="text-[20px] font-[800]">Nos Hubs Suguba</h2>
              <p className="text-[13px] text-gray-500">Points de dépôt vendeurs et de retrait client</p>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl !p-4 !mb-2">
            <p className="text-[13px] text-blue-800">
              💡 <strong>Comment ça marche ?</strong> Les vendeurs déposent vos commandes dans le hub de leur zone. Notre équipe les récupère et vous les livre, ou vous pouvez les retirer directement dans le hub de votre quartier.
            </p>
          </div>
          <HubsSection />
        </div>
      )}

      {activeSection === "contact" && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2 !mb-2">
            <MdSupportAgent className="text-primary text-[24px]" />
            <h2 className="text-[20px] font-[800]">Contactez l'équipe Suguba</h2>
          </div>

        
          <div className="grid grid-cols-2 gap-4">
            {CONTACT_INFO.map(({ icon: Icon, label, value, color, bg }) => (
              <div key={label} className="bg-white rounded-xl shadow-sm !p-5 flex items-center gap-4 hover:shadow-md transition-all">
                <div className={`w-[46px] h-[46px] ${bg} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`text-[22px] ${color}`} />
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 font-[500] uppercase tracking-wide">{label}</p>
                  <p className="text-[14px] font-[700] text-gray-800">{value}</p>
                </div>
              </div>
            ))}
          </div>

         
          <div className="bg-white rounded-2xl shadow-sm !p-6">
            <h3 className="text-[15px] font-[700] !mb-4">Suivez-nous sur les réseaux sociaux</h3>
            <div className="flex gap-4">
              {[
                { icon: FaWhatsapp, label: "WhatsApp", href: "https://wa.me/22370000000", color: "bg-green-500" },
                { icon: FaFacebook, label: "Facebook", href: "https://facebook.com/suguba", color: "bg-blue-600" },
                { icon: FaInstagram, label: "Instagram", href: "https://instagram.com/suguba", color: "bg-gradient-to-br from-pink-500 to-orange-400" },
              ].map(({ icon: Icon, label, href, color }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className={`flex items-center gap-3 !px-5 !py-3 rounded-xl text-white font-[600] text-[13px] transition-all hover:opacity-90 ${color}`}>
                  <Icon className="text-[18px]" /> {label}
                </a>
              ))}
            </div>
          </div>

          
          <div className="bg-white rounded-2xl shadow-sm !p-6">
            <h3 className="text-[15px] font-[700] !mb-4">Envoyer un message directement</h3>
            <div className="flex flex-col gap-3 max-w-[560px]">
              <div className="grid grid-cols-2 gap-3">
                <TextField label="Votre nom" size="small" fullWidth />
                <TextField label="Email ou téléphone" size="small" fullWidth />
              </div>
              <TextField label="Objet" size="small" fullWidth />
              <TextField label="Votre message" multiline rows={4} fullWidth size="small"
                placeholder="Décrivez votre problème ou question..." />
              <Button  type="submit" className="btn-org !capitalize !py-2 w-fit !px-8 !font-[600]">
                Envoyer le message →
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
*/}