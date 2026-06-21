import React from "react";
import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { FaStore } from "react-icons/fa";
import {
   FaCheckCircle, FaShippingFast, FaMoneyBillWave,
  FaChartLine, FaBoxOpen, FaHandshake, FaArrowRight,
  FaMotorcycle, FaWarehouse, FaPercent, FaHeadset
} from "react-icons/fa";
import { MdSecurity, MdSpeed, MdSupportAgent } from "react-icons/md";
import { BsBoxSeam, BsGraphUpArrow } from "react-icons/bs";
import { MyContext } from "../../../router";
import { postData } from "../../../utils/api";
import AccountSidebar from "../AccountSidebar/index";
import { translations } from "../../../utils/i18n";

export default function BecomeSellerPage() {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const t = translations[context?.lang] || translations.fr;

  const [step, setStep] = useState(1); // 1: landing, 2: form
  const [isLoading, setIsLoading] = useState(false);
  const [formField, setFormField] = useState({
    shopName: "", shopDescription: "", phone: "", address: ""
  });

  // Si déjà vendeur → rediriger vers espace vendeur
  useEffect(() => {
    if (context?.userData?.isSeller) {
      navigate("/espace-vendeur");
    }
  }, [context?.userData]);

  // Si pas connecté → rediriger vers connexion
  const handleStartSelling = () => {
    if (!context?.isLogin) {
      navigate("/connexion?redirect=/devenir-vendeur");
      return;
    }
    setStep(2);
  };

  const onChangeInput = (e) => setFormField({ ...formField, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!context?.isLogin) {
      navigate("/connexion?redirect=/devenir-vendeur");
      return;
    }
    if (!formField.shopName.trim()) {
      context.alertBox("error", "Veuillez entrer le nom de votre boutique");
      return;
    }
    setIsLoading(true);
    postData("/api/seller/devenir-vendeur", formField).then((res) => {
      if (res?.success) {
        context.alertBox("success", res?.message);
        context.setUserData({ ...context.userData, isSeller: true, role: "Seller" });
        navigate("/espace-vendeur");
      } else {
        context.alertBox("error", res?.message || "Erreur lors de la création");
      }
      setIsLoading(false);
    });
  };

  const youDoItems = Array.isArray(t.youDoItems) ? t.youDoItems : translations.fr.youDoItems;
  const weDoItems = Array.isArray(t.weDoItems) ? t.weDoItems : translations.fr.weDoItems;

  const youDoIcons = [FaStore, FaBoxOpen, BsBoxSeam, FaWarehouse];
  const weDoIcons = [FaMotorcycle, FaMoneyBillWave, BsGraphUpArrow, FaHeadset];

  const stats = [
    { value: "10%", label: "Commission seulement" },
    { value: "48h", label: "Livraison rapide" },
    { value: "100%", label: "Paiement sécurisé" },
    { value: "24/7", label: "Support vendeur" },
  ];

  const advantages = [
    { icon: MdSpeed, title: "Activation immédiate", desc: "Votre boutique est active dès la création. Publiez vos premiers produits en moins de 5 minutes.", color: "text-blue-500", bg: "bg-blue-50" },
    { icon: FaPercent, title: "Commission réduite", desc: "Seulement 10% sur chaque vente. Vous gardez 90% de vos revenus. Versement en fin de mois.", color: "text-green-500", bg: "bg-green-50" },
    { icon: FaShippingFast, title: "Logistique Suguba", desc: "Déposez au hub, on s'occupe du reste. Livraison à Bamako et dans les grandes villes.", color: "text-orange-500", bg: "bg-orange-50" },
    { icon: FaChartLine, title: "Dashboard complet", desc: "Suivez vos ventes, revenus et commandes en temps réel depuis votre espace vendeur.", color: "text-purple-500", bg: "bg-purple-50" },
    { icon: MdSecurity, title: "Paiement sécurisé", desc: "Orange Money, Moov Money et visa acceptés. Vos revenus sont protégés et garantis.", color: "text-pink-500", bg: "bg-pink-50" },
    { icon: MdSupportAgent, title: "Support dédié", desc: "Une équipe dédiée aux vendeurs, disponible 7j/7 pour vous accompagner.", color: "text-yellow-600", bg: "bg-yellow-50" },
  ];

  return (
    <section className="min-h-screen bg-[#f8f9fa]">
      {step === 2 && context?.isLogin ? (
        /* ─── Étape 2 : Formulaire de création ─────────────────────────── */
        <div className="w-[95%] !mx-auto !py-10 flex gap-6">
          <div className="w-[22%]">
            <AccountSidebar />
          </div>
          <div className="w-[78%]">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-[13px] text-gray-500 !mb-5">
              <span className="cursor-pointer hover:text-primary" onClick={() => setStep(1)}>Devenir vendeur</span>
              <FaArrowRight className="text-[10px]" />
              <span className="text-primary font-[500]">Créer ma boutique</span>
            </div>

            {/* Header */}
            <div className="bg-gradient-to-r from-pink-500 to-pink-700 rounded-2xl !p-8 !mb-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-white opacity-5 rounded-full -translate-y-[50px] translate-x-[50px]"></div>
              <div className="flex items-center gap-5">
                <div className="w-[70px] h-[70px] bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaStore className="text-[32px] text-pink-500" />
                </div>
                <div>
                  <h1 className="text-[26px] font-[700]">Créez votre boutique</h1>
                  <p className="text-[15px] opacity-85">Remplissez les informations ci-dessous pour démarrer</p>
                </div>
              </div>
              {/* Commission info 
              <div className="flex items-center gap-6 !mt-5">
                {stats.map(({ value, label }) => (
                  <div key={label} className="text-center bg-white bg-opacity-15 rounded-xl !px-4 !py-2">
                    <p className="text-[20px] font-[800]">{value}</p>
                    <p className="text-[11px] opacity-80">{label}</p>
                  </div>
                ))}
              </div>
              */}
            </div>

            {/* Commission info */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl !p-4 !mb-6 flex items-start gap-3">
              <span className="text-[20px]">ℹ️</span>
              <p className="text-[13px] text-yellow-800">
                <strong>Commission Suguba :</strong> Sur chaque vente, Suguba prélève <strong>10%</strong> du montant de la vente.
                Les <strong>90%</strong> restants vous sont reversés en fin de mois.
                Si vous optez pour la <strong>mise en avant</strong> de vos produits, la commission passe à <strong>15%</strong> pour ces produits spécifiques.
              </p>
            </div>

            {/* Formulaire */}
            <div className="bg-white shadow-sm rounded-2xl !p-8">
              <h2 className="text-[18px] font-[700] !mb-6">Informations de votre boutique</h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="text-[13px] font-[600] text-gray-700 block !mb-1">Nom de la boutique *</label>
                  <TextField
                    name="shopName" value={formField.shopName} onChange={onChangeInput}
                    placeholder="Ex: Boutique Mode Bamako" variant="outlined" fullWidth size="small"
                  />
                </div>
                <div>
                  <label className="text-[13px] font-[600] text-gray-700 block !mb-1">Description</label>
                  <TextField
                    name="shopDescription" value={formField.shopDescription} onChange={onChangeInput}
                    placeholder="Décrivez vos produits et votre boutique..." variant="outlined" fullWidth
                    multiline rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[13px] font-[600] text-gray-700 block !mb-1">Téléphone</label>
                    <TextField name="phone" value={formField.phone} onChange={onChangeInput}
                      placeholder="+223 XX XX XX XX" variant="outlined" fullWidth size="small" />
                  </div>
                  <div>
                    <label className="text-[13px] font-[600] text-gray-700 block !mb-1">Adresse / Quartier</label>
                    <TextField name="address" value={formField.address} onChange={onChangeInput}
                      placeholder="Ex: Badalabougou, Bamako" variant="outlined" fullWidth size="small" />
                  </div>
                </div>

                <Button type="submit" disabled={isLoading}
                  className="!bg-gradient-to-r from-pink-500 to-pink-600 !text-white !capitalize !text-[15px] !font-[600] !py-3 !rounded-xl flex gap-2 hover:from-pink-600 hover:to-pink-700 !transition-all">
                  {isLoading ? <CircularProgress size={22} color="inherit" /> : (
                    <><FaStore className="text-[18px]" /> Créer ma boutique gratuitement</>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        /* ─── Étape 1 : Landing page ────────────────────────────────────── */
        <>
          {/* Hero */}
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white !py-20">
            <div className="w-[90%] !mx-auto flex items-center gap-16">
              <div className="flex-1">
                <span className="bg-pink-500 !px-4 !py-1 rounded-full text-[12px] font-[700] uppercase tracking-wide !mb-5 inline-block">
                  🚀 Marketplace #1 à Bamako
                </span>
                <h1 className="text-[46px] font-[800] leading-[1.15] !mb-5">
                  Vendez vos produits<br />
                  <span className="text-pink-400">sur Suguba</span>
                </h1>
                <p className="text-[18px] text-gray-300 !mb-8 leading-relaxed">
                  Rejoignez des milliers de vendeurs et touchez des clients partout au Mali.
                  Vous gérez les produits, <strong className="text-white">nous gérons la livraison.</strong>
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleStartSelling}
                    className="bg-gradient-to-r from-pink-500 to-pink-600 text-white !px-8 !py-4 rounded-full text-[16px] font-[700] hover:from-pink-600 hover:to-pink-700 transition-all flex items-center gap-2 shadow-lg shadow-pink-900">
                    {t.createShop} <FaArrowRight />
                  </button>
                  {!context?.isLogin && (
                    <p className="text-[13px] text-gray-400">
                      Déjà vendeur ? <Link to="/connexion" className="text-pink-400 hover:underline">Connectez-vous</Link>
                    </p>
                  )}
                </div>
                {/* Stats */}
                <div className="flex items-center gap-8 !mt-10">
                  {stats.map(({ value, label }) => (
                    <div key={label}>
                      <p className="text-[28px] font-[800] text-pink-400">{value}</p>
                      <p className="text-[12px] text-gray-400">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-[380px] flex-shrink-0 hidden lg:block">
                <div className="relative">
                  <div className="bg-white rounded-3xl shadow-2xl !p-6 rotate-3">
                    <div className="bg-gray-50 rounded-2xl !p-4 !mb-4 flex items-center gap-3">
                      <div className="w-[45px] h-[45px] bg-pink-100 rounded-full flex items-center justify-center">
                        <FaStore className="text-pink-500 text-[20px]" />
                      </div>
                      <div>
                        <p className="font-[700] text-gray-800 text-[14px]">Boutique Mode Mali</p>
                        <p className="text-[11px] text-green-600 font-[500]">✅ Vendeur actif</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Ventes", value: "1,240" },
                        { label: "Revenu net", value: "892,000 Fcfa" },
                        { label: "Produits", value: "48" },
                        { label: "Note", value: "4.8/5 ⭐" },
                      ].map(({ label, value }) => (
                        <div key={label} className="bg-gray-50 rounded-xl !p-3">
                          <p className="text-[11px] text-gray-500">{label}</p>
                          <p className="text-[14px] font-[700] text-gray-800">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ce que vous faites / Ce que nous faisons */}
          <div className="w-[90%] !mx-auto !py-16">
            <h2 className="text-[32px] font-[800] text-center !mb-3">Comment ça marche ?</h2>
            <p className="text-gray-500 text-center !mb-12 text-[16px]">Un partenariat simple et transparent</p>

            <div className="grid grid-cols-2 gap-8">
              {/* Ce que vous faites */}
              <div className="bg-white rounded-3xl !p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 !mb-6">
                  <div className="w-[48px] h-[48px] bg-pink-100 rounded-2xl flex items-center justify-center">
                    <FaHandshake className="text-pink-500 text-[22px]" />
                  </div>
                  <h3 className="text-[20px] font-[700] text-gray-800">{t.whatYouDo}</h3>
                </div>
                <div className="flex flex-col gap-4">
                  {youDoItems.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-[28px] h-[28px] bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0 text-white text-[13px] font-[700] mt-[2px]">
                        {i + 1}
                      </div>
                      <div className="flex items-start gap-2 flex-1">
                        {React.createElement(youDoIcons[i], { className: "text-pink-400 text-[18px] mt-[2px] flex-shrink-0" })}
                        <p className="text-[14px] text-gray-700 leading-relaxed">{item}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ce que nous faisons */}
              <div className="bg-gradient-to-br from-pink-500 to-pink-700 rounded-3xl !p-8 shadow-sm text-white">
                <div className="flex items-center gap-3 !mb-6">
                  <div className="w-[48px] h-[48px] bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
                    <FaCheckCircle className="text-pink-500 text-[22px]" />
                  </div>
                  <h3 className="text-[20px] font-[700]">{t.whatWeDo}</h3>
                </div>
                <div className="flex flex-col gap-4">
                  {weDoItems.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-[28px] h-[28px] bg-pink-500 text-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 text-[13px] font-[700] mt-[2px]">
                        {i + 1}
                      </div>
                      <div className="flex items-start gap-2 flex-1">
                        {React.createElement(weDoIcons[i], { className: "text-white opacity-80 text-[18px] mt-[2px] flex-shrink-0" })}
                        <p className="text-[14px] opacity-90 leading-relaxed">{item}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Avantages */}
          <div className="bg-white !py-16">
            <div className="w-[90%] !mx-auto">
              <h2 className="text-[30px] font-[800] text-center !mb-3">Pourquoi vendre sur Suguba ?</h2>
              <p className="text-gray-500 text-center !mb-10 text-[15px]">Tous les outils pour développer votre activité</p>
              <div className="grid grid-cols-3 gap-6">
                {advantages.map(({ icon: Icon, title, desc, color, bg }) => (
                  <div key={title} className="rounded-2xl !p-6 border border-gray-100 hover:shadow-md transition-all group">
                    <div className={`w-[52px] h-[52px] ${bg} rounded-2xl flex items-center justify-center !mb-4 group-hover:scale-110 transition-all`}>
                      <Icon className={`text-[24px] ${color}`} />
                    </div>
                    <h3 className="text-[16px] font-[700] !mb-2">{title}</h3>
                    <p className="text-[13px] text-gray-500 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Commission détail */}
          <div className="w-[90%] !mx-auto !py-16">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl !p-10 text-white">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-[28px] font-[800] !mb-3">Comprendre la commission</h2>
                  <p className="text-gray-300 text-[15px] !mb-6">Simple, transparent, avantageux</p>
                  <div className="flex items-center gap-8">
                    <div className="bg-white bg-opacity-10 rounded-2xl !p-5 text-center">
                      <p className="text-[40px] font-[800] text-pink-400">10%</p>
                      <p className="text-[13px] text-gray-300">Commission standard</p>
                    </div>
                    <div className="text-[24px] text-gray-400">→</div>
                    <div className="bg-white bg-opacity-10 rounded-2xl !p-5 text-center">
                      <p className="text-[40px] font-[800] text-green-400">90%</p>
                      <p className="text-[13px] text-gray-300">Vos revenus nets</p>
                    </div>
                    <div className="text-[24px] text-gray-400">+</div>
                    <div className="bg-pink-500 bg-opacity-30 rounded-2xl !p-5 text-center border border-pink-400">
                      <p className="text-[40px] font-[800] text-pink-300">15%</p>
                      <p className="text-[13px] text-gray-300">Mise en avant accueil</p>
                    </div>
                  </div>
                  <p className="text-[13px] text-gray-400 !mt-4">
                    * Exemple : vente à 10 000 Fcfa → vous recevez <strong className="text-white">9 000 Fcfa</strong>. Versement mensuel sécurisé.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA final */}
          <div className="bg-gradient-to-r from-pink-500 to-pink-700 !py-16 text-white text-center">
            <h2 className="text-[32px] font-[800] !mb-3">Prêt à commencer ?</h2>
            <p className="text-[16px] opacity-90 !mb-8">Créez votre boutique maintenant. C'est gratuit et sans engagement.</p>
            <button
              onClick={handleStartSelling}
              className="bg-white text-pink-600 !px-10 !py-4 rounded-full text-[16px] font-[700] hover:bg-gray-50 transition-all flex items-center gap-2 !mx-auto shadow-xl">
              <FaStore /> {t.createShop}
            </button>
            {!context?.isLogin && (
              <p className="text-[13px] opacity-75 !mt-4">
                Vous devez être connecté — <Link to="/connexion?redirect=/devenir-vendeur" className="underline font-[600]">Se connecter</Link>
              </p>
            )}
          </div>
        </>
      )}
    </section>
  );
}



{/*import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { FaStore, FaCheckCircle, FaShippingFast, FaMoneyBillWave, FaChartLine } from "react-icons/fa";
import { MyContext } from "../../../router";
import { postData } from "../../../utils/api";
import AccountSidebar from "../AccountSidebar/index";

export default function BecomeSellerPage() {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formField, setFormField] = useState({
    shopName: "", shopDescription: "", phone: "", address: ""
  });

  const onChangeInput = (e) => {
    setFormField({ ...formField, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formField.shopName) {
      context.alertBox("error", "Veuillez entrer le nom de votre boutique");
      return;
    }
    setIsLoading(true);
    postData("/api/seller/devenir-vendeur", formField).then((res) => {
      if (res?.success) {
        context.alertBox("success", res?.message);
        // Mettre à jour userData
        context.setUserData({ ...context.userData, isSeller: true, role: "Seller" });
        navigate("/espace-vendeur");
      } else {
        context.alertBox("error", res?.message);
      }
      setIsLoading(false);
    });
  };

  return (
    <section className="!py-10 w-full">
      <div className="w-[95%] !mx-auto flex gap-5">
        <div className="col1 w-[20%]">
          <AccountSidebar />
        </div>
        <div className="col2 w-[80%]">
          
          <div className="bg-gradient-to-r from-pink-500 to-pink-700 rounded-xl !p-8 !mb-8 text-white">
            <div className="flex items-center gap-4 !mb-4">
              <FaStore className="text-[50px]" />
              <div>
                <h1 className="text-[28px] font-[700]">Vendez sur Suguba</h1>
                <p className="text-[16px] opacity-90">Rejoignez des milliers de vendeurs et développez votre activité</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 !mt-6">
              {[
                { icon: FaCheckCircle, title: "Activation immédiate", desc: "Votre boutique est active dès l'inscription" },
                { icon: FaMoneyBillWave, title: "Commission 10%", desc: "Seulement 10% sur chaque vente réalisée" },
                { icon: FaChartLine, title: "Dashboard complet", desc: "Suivez vos ventes et revenus en temps réel" },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-white bg-opacity-20 rounded-lg !p-4">
                  <Icon className="text-[24px] !mb-2" />
                  <h3 className="font-[600] text-[14px]">{title}</h3>
                  <p className="text-[12px] opacity-80">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          
          <div className="bg-white shadow-md rounded-xl !p-8">
            <h2 className="text-[20px] font-[600] !mb-6">Créer votre boutique</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <TextField label="Nom de votre boutique *" name="shopName" value={formField.shopName}
                onChange={onChangeInput} variant="outlined" fullWidth />
              <TextField label="Description de votre boutique" name="shopDescription"
                value={formField.shopDescription} onChange={onChangeInput}
                variant="outlined" fullWidth multiline rows={3} />
              <div className="grid grid-cols-2 gap-4">
                <TextField label="Numéro de téléphone" name="phone" value={formField.phone}
                  onChange={onChangeInput} variant="outlined" fullWidth />
                <TextField label="Adresse de la boutique" name="address" value={formField.address}
                  onChange={onChangeInput} variant="outlined" fullWidth />
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg !p-4">
                <p className="text-[13px] text-yellow-800">
                  <strong>ℹ️ Commission Suguba :</strong> Sur chaque vente, Suguba prélève <strong>10%</strong> du montant.
                  Le reste (90%) vous est reversé. Vous pouvez suivre vos revenus dans votre espace vendeur.
                </p>
              </div>
              <Button type="submit" className="btn-org btn-lg w-full flex gap-2" disabled={isLoading}>
                {isLoading ? <CircularProgress size={22} color="inherit" /> : (
                  <><FaStore className="text-[18px]" /> Créer ma boutique gratuitement</>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}*/}