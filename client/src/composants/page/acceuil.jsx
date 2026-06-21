import React, { useContext, useState, useEffect } from "react";
import DefileImg from "../defile/index";
import DefileCat from "../defileCategorie/index";
import {
  FaShippingFast, FaShieldAlt, FaHeadset, FaGift,
  FaStore, FaArrowRight, FaFire, FaStar, FaPercent
} from "react-icons/fa";
import { MdLocalOffer, MdTrendingUp } from "react-icons/md";
import ProduitDefile from "./ProduitDefile/index";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import { MyContext } from "../../router.jsx";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Link } from "react-router-dom";
import { translations } from "../../utils/i18n.js";
import { fetchDataFromApi } from "../../utils/api.js";

export default function Acceuil() {
  const context = useContext(MyContext);
  const t = translations[context?.lang] || translations.fr;
  const [value, setValue] = useState(0);
  const [selectedCat, setSelectedCat] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  // ✅ Produits Offre Spéciale
  const [specialOfferProducts, setSpecialOfferProducts] = useState([]);

  const categories = context.catData?.filter(c => !c.parentId) || [];

  useEffect(() => {
    // Produits Vedette
    fetchDataFromApi("/api/product/produit-fare").then((res) => {
      setFeaturedProducts(res?.produits || []);
    });
    // ✅ Produits Offre Spéciale
    fetchDataFromApi("/api/product/offres-speciales").then((res) => {
      setSpecialOfferProducts(res?.produits || []);
    });
  }, []);

  const handleChange = (_, newValue) => {
    setValue(newValue);
    setSelectedCat(categories[newValue]?._id || null);
  };

  const features = [
    { icon: FaShippingFast, title: t.freeShipping, desc: "> 20 000 Fcfa", color: "text-blue-500", bg: "bg-blue-50" },
    { icon: FaShieldAlt, title: "Paiement Sécurisé", desc: "Orange & Moov Money", color: "text-green-500", bg: "bg-green-50" },
    { icon: FaHeadset, title: "Support 24/7", desc: "Disponible pour vous", color: "text-purple-500", bg: "bg-purple-50" },
    { icon: FaGift, title: "Retour 30 jours", desc: "Remboursement garanti", color: "text-orange-500", bg: "bg-orange-50" },
  ];

  // ── LOGIQUE OFFRE SPÉCIALE ─────────────────────────────────────────────────
  // Les 3 premiers vont dans la section bannière.
  // Le reste va dans le swiper carrousel.
  const specialOfferBanner = specialOfferProducts.slice(0, 3);   // max 3 dans la bannière
  const specialOfferCarousel = specialOfferProducts.slice(3);     // le reste dans le swiper

  // Fallback si aucune offre spéciale : images statiques pour le swiper
  const staticPromoImages = [
    "https://robe-rose-poudre.com/cdn/shop/files/Sc905954246e74a7a8c759fe184d1353el.webp?crop=center&height=1200&v=1740644205&width=1200",
    "https://robe-rose-poudre.com/cdn/shop/files/S5919f4af018f47aab44b3ff1979ba0a8i.webp?crop=center&height=1200&v=1740644190&width=1200",
    "https://robe-rose-poudre.com/cdn/shop/files/S6f8e980fba724e5d9f738d0093ae3927S.webp?crop=center&height=1200&v=1740730832&width=1200",
    "https://robe-rose-poudre.com/cdn/shop/files/Se9841dcf07f642db8ffb9c991fcc85db0.webp?crop=center&height=1200&v=1741334972&width=1200",
    "https://robe-rose-poudre.com/cdn/shop/files/S4d014d61045c4479aa0101140d05f59fZ.webp?crop=center&height=1200&v=1740730833&width=1200",
  ];

  // Pour le swiper : produits offre spéciale (en surplus) + images statiques si besoin
  const swiperItems = specialOfferCarousel.length > 0
    ? specialOfferCarousel.map(p => ({ img: p.images?.[0], link: `/produit/${p._id}`, isProduct: true }))
    : staticPromoImages.map(img => ({ img, link: "/listeProduits", isProduct: false }));

  // ── RENDU SECTION BANNIÈRE OFFRE SPÉCIALE ──────────────────────────────────
  // Selon le nombre de produits en offre spéciale (0, 1, 2, ou 3)
  const renderSpecialOfferBanner = () => {
    // Pas de produits en offre spéciale → bannière statique originale
    if (specialOfferBanner.length === 0) {
      return (
        <>
          {/* Colonne gauche — image statique */}
          <div className="col-span-1 rounded-2xl overflow-hidden relative group h-[360px] cursor-pointer">
            <img
              src="https://robe-rose-poudre.com/cdn/shop/files/Designsanstitre-2025-04-09T094817.768.png?crop=center&height=1200&v=1744184979&width=1200"
              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
              alt="promo"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center !px-8">
              <span className="bg-pink-500 text-white text-[11px] font-[700] !px-3 !py-1 rounded-full w-fit !mb-3">
                🔥 Offre spéciale
              </span>
              <h2 className="text-white text-[26px] font-[800] !mb-1">Artisanat Malien</h2>
              <p className="text-white opacity-80 text-[14px] !mb-4">Dès 5 000 Fcfa</p>
              <Link to="/listeProduits">
                <button className="bg-white text-primary font-[600] !px-5 !py-2 rounded-full text-[13px] hover:bg-gray-100 transition-all w-fit">
                  Acheter maintenant →
                </button>
              </Link>
            </div>
          </div>

          {/* Colonne droite — 2 images statiques */}
          <div className="flex col-span-2 gap-4 h-[360px]">
            {[
              { img: "https://robe-rose-poudre.com/cdn/shop/files/Designsanstitre-2025-04-09T094720.443.png?crop=center&height=1200&v=1744184979&width=1200", label: "Mode Femme", badge: "-30%", color: "from-pink-500" },
              { img: "https://robe-rose-poudre.com/cdn/shop/files/Sdb423c850fab4ebd83ec195239ad31b8N.webp?crop=center&height=1200&v=1740644171&width=1200", label: "Électronique", badge: "Nouveau", color: "from-blue-600" },
            ].map(({ img, label, badge, color }) => (
              <Link to="/listeProduits" key={label} className="relative rounded-2xl overflow-hidden group flex-1 block">
                <img src={img} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" alt={label} />
                <div className={`absolute inset-0 bg-gradient-to-r ${color}/60 to-transparent flex items-end !p-4`}>
                  <div>
                    <span className="bg-white text-[10px] font-[700] !px-2 !py-1 rounded-full text-gray-800 !mb-1 block w-fit">{badge}</span>
                    <p className="text-white font-[700] text-[14px]">{label}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      );
    }

    // 1 produit → col-span-1 + 2 statiques
    if (specialOfferBanner.length === 1) {
      const p = specialOfferBanner[0];
      return (
        <>
          <div className="col-span-1 rounded-2xl overflow-hidden relative group h-[360px] cursor-pointer">
            <img src={p.images?.[0]} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" alt={p.name} />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center !px-8">
              <span className="bg-orange-500 text-white text-[11px] font-[700] !px-3 !py-1 rounded-full w-fit !mb-3">🔥 Offre spéciale</span>
              <h2 className="text-white text-[22px] font-[800] !mb-1 line-clamp-2">{p.name}</h2>
              <p className="text-white opacity-80 text-[14px] !mb-4">{p.price?.toLocaleString()} Fcfa</p>
              <Link to={`/produit/${p._id}`}>
                <button className="bg-white text-primary font-[600] !px-5 !py-2 rounded-full text-[13px] hover:bg-gray-100 transition-all w-fit">Acheter maintenant →</button>
              </Link>
            </div>
          </div>
          <div className="flex col-span-2 gap-4 h-[360px]">
            {[
              { img: "https://robe-rose-poudre.com/cdn/shop/files/Designsanstitre-2025-04-09T094720.443.png?crop=center&height=1200&v=1744184979&width=1200", label: "Mode Femme", badge: "-30%", color: "from-pink-500" },
              { img: "https://robe-rose-poudre.com/cdn/shop/files/Sdb423c850fab4ebd83ec195239ad31b8N.webp?crop=center&height=1200&v=1740644171&width=1200", label: "Électronique", badge: "Nouveau", color: "from-blue-600" },
            ].map(({ img, label, badge, color }) => (
              <Link to="/listeProduits" key={label} className="relative rounded-2xl overflow-hidden group flex-1 block">
                <img src={img} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" alt={label} />
                <div className={`absolute inset-0 bg-gradient-to-r ${color}/60 to-transparent flex items-end !p-4`}>
                  <div>
                    <span className="bg-white text-[10px] font-[700] !px-2 !py-1 rounded-full text-gray-800 !mb-1 block w-fit">{badge}</span>
                    <p className="text-white font-[700] text-[14px]">{label}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      );
    }

    // 2 produits → 1 col-span-1 + col-span-2 avec 1 produit + 1 statique
    if (specialOfferBanner.length === 2) {
      const [p1, p2] = specialOfferBanner;
      return (
        <>
          <div className="col-span-1 rounded-2xl overflow-hidden relative group h-[360px] cursor-pointer">
            <img src={p1.images?.[0]} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" alt={p1.name} />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center !px-8">
              <span className="bg-orange-500 text-white text-[11px] font-[700] !px-3 !py-1 rounded-full w-fit !mb-3">🔥 Offre spéciale</span>
              <h2 className="text-white text-[22px] font-[800] !mb-1 line-clamp-2">{p1.name}</h2>
              <p className="text-white opacity-80 text-[14px] !mb-4">{p1.price?.toLocaleString()} Fcfa</p>
              <Link to={`/produit/${p1._id}`}>
                <button className="bg-white text-primary font-[600] !px-5 !py-2 rounded-full text-[13px] hover:bg-gray-100 transition-all w-fit">Acheter maintenant →</button>
              </Link>
            </div>
          </div>
          <div className="flex col-span-2 gap-4 h-[360px]">
            {/* Produit 2 */}
            <Link to={`/produit/${p2._id}`} className="relative rounded-2xl overflow-hidden group flex-1 block">
              <img src={p2.images?.[0]} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" alt={p2.name} />
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/60 to-transparent flex items-end !p-4">
                <div>
                  <span className="bg-orange-500 text-white text-[10px] font-[700] !px-2 !py-1 rounded-full !mb-1 block w-fit">🔥 Offre Spéciale</span>
                  <p className="text-white font-[700] text-[14px] line-clamp-1">{p2.name}</p>
                  <p className="text-white opacity-80 text-[12px]">{p2.price?.toLocaleString()} Fcfa</p>
                </div>
              </div>
            </Link>
            {/* Image statique */}
            <Link to="/listeProduits" className="relative rounded-2xl overflow-hidden group flex-1 block">
              <img src="https://robe-rose-poudre.com/cdn/shop/files/Sdb423c850fab4ebd83ec195239ad31b8N.webp?crop=center&height=1200&v=1740644171&width=1200"
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" alt="Électronique" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/60 to-transparent flex items-end !p-4">
                <div>
                  <span className="bg-white text-[10px] font-[700] !px-2 !py-1 rounded-full text-gray-800 !mb-1 block w-fit">Nouveau</span>
                  <p className="text-white font-[700] text-[14px]">Électronique</p>
                </div>
              </div>
            </Link>
          </div>
        </>
      );
    }

    // 3 produits → section 100% dynamique (col-span-1 + col-span-2 avec 2 produits)
    const [p1, p2, p3] = specialOfferBanner;
    return (
      <>
        <div className="col-span-1 rounded-2xl overflow-hidden relative group h-[360px] cursor-pointer">
          <img src={p1.images?.[0]} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" alt={p1.name} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center !px-8">
            <span className="bg-orange-500 text-white text-[11px] font-[700] !px-3 !py-1 rounded-full w-fit !mb-3">🔥 Offre spéciale</span>
            <h2 className="text-white text-[22px] font-[800] !mb-1 line-clamp-2">{p1.name}</h2>
            <p className="text-white opacity-80 text-[14px] !mb-4">{p1.price?.toLocaleString()} Fcfa</p>
            <Link to={`/produit/${p1._id}`}>
              <button className="bg-white text-primary font-[600] !px-5 !py-2 rounded-full text-[13px] hover:bg-gray-100 transition-all w-fit">Acheter maintenant →</button>
            </Link>
          </div>
        </div>
        <div className="flex col-span-2 gap-4 h-[360px]">
          {[p2, p3].map((p) => (
            <Link to={`/produit/${p._id}`} key={p._id} className="relative rounded-2xl overflow-hidden group flex-1 block">
              <img src={p.images?.[0]} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" alt={p.name} />
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/60 to-transparent flex items-end !p-4">
                <div>
                  <span className="bg-orange-500 text-white text-[10px] font-[700] !px-2 !py-1 rounded-full !mb-1 block w-fit">🔥 Offre Spéciale</span>
                  <p className="text-white font-[700] text-[14px] line-clamp-1">{p.name}</p>
                  <p className="text-white opacity-80 text-[12px]">{p.price?.toLocaleString()} Fcfa</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </>
    );
  };

  return (
    <>
      <DefileImg />

      {/* Features */}
      <div className="bg-white border-b border-gray-100 !py-4 shadow-sm">
        <div className="w-[95%] !mx-auto">
          <div className="grid grid-cols-4 gap-4">
            {features.map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className="flex items-center gap-3 !px-3 !py-2 rounded-xl hover:bg-gray-50 transition-all cursor-default">
                <div className={`w-[42px] h-[42px] ${bg} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`text-[20px] ${color}`} />
                </div>
                <div>
                  <h4 className="text-[13px] font-[700]">{title}</h4>
                  <p className="text-[11px] text-gray-400 !mb-0">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          ✅ SECTION OFFRE SPÉCIALE — dynamique
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="w-[95%] !mx-auto !py-6">
        {/* Titre section si produits dynamiques */}
        {specialOfferBanner.length > 0 && (
          <div className="flex items-center gap-2 !mb-4">
            <MdLocalOffer className="text-orange-500 text-[22px]" />
            <h2 className="text-[18px] font-[800]">Offres Spéciales 🔥</h2>
            <span className="text-[12px] text-gray-400 font-[400]">Sélectionnées par nos vendeurs partenaires</span>
          </div>
        )}
        <div className="grid grid-cols-3 gap-4">
          {renderSpecialOfferBanner()}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          Swiper carrousel : offres spéciales en surplus OU images statiques
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-white !py-8">
        <div className="w-[95%] !mx-auto">
          {swiperItems.length > 0 && (
            <Swiper slidesPerView={4} spaceBetween={12} navigation={true} autoplay={{ delay: 3000 }}
              modules={[Navigation, Autoplay]} className="smlBtn">
              {swiperItems.map((item, i) => (
                <SwiperSlide key={i}>
                  <Link to={item.link}>
                    <div className="rounded-2xl overflow-hidden group cursor-pointer h-[190px] relative">
                      <img src={item.img} className="w-full h-full object-cover transition-all group-hover:scale-105 duration-500" alt="" />
                      {item.isProduct && (
                        <div className="absolute top-2 left-2">
                          <span className="bg-orange-500 text-white text-[10px] font-[700] !px-2 !py-1 rounded-full">🔥 Offre Spéciale</span>
                        </div>
                      )}
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </section>

      {/* Catégories */}
      <section className="w-[95%] !mx-auto !pb-5">
        <h2 className="text-[20px] font-[700] !mb-4">Acheter par catégorie</h2>
        <Swiper slidesPerView={6} spaceBetween={12} navigation modules={[Navigation]} className="mySwiper">
          {categories.map(cat => (
            <SwiperSlide key={cat._id}>
              <Link to={`/listeProduits?category=${cat._id}&name=${cat.name}`}>
                <div className="flex flex-col items-center gap-2 bg-white rounded-xl !p-3 hover:shadow-md transition-all cursor-pointer border border-gray-100 hover:border-primary">
                  <img src={cat.images?.[0] || "/placeholder.png"} className="w-[65px] h-[65px] object-cover rounded-full" alt={cat.name} />
                  <span className="text-[13px] font-[600] text-center">{cat.name}</span>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Produits Vedette */}
      {featuredProducts.length > 0 && (
        <section className="!py-10 bg-gradient-to-b from-yellow-50 to-white">
          <div className="w-[95%] !mx-auto">
            <div className="flex items-center justify-between !mb-6">
              <div className="flex items-center gap-3">
                <div className="w-[42px] h-[42px] bg-yellow-400 rounded-full flex items-center justify-center">
                  <FaStar className="text-white text-[20px]" />
                </div>
                <div>
                  <h2 className="text-[22px] font-[800]">Produits Vedettes ⭐</h2>
                  <p className="text-[13px] text-gray-400">Sélectionnés et mis en avant par nos vendeurs</p>
                </div>
              </div>
              <Link to="/listeProduits" className="text-primary text-[14px] font-[500] hover:underline flex items-center gap-1">
                {t.viewAll} <FaArrowRight className="text-[11px]" />
              </Link>
            </div>
            <div className="grid grid-cols-4 gap-5">
              {featuredProducts.slice(0, 4).map((product) => (
                <Link to={`/produit/${product._id}`} key={product._id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-yellow-100 group">
                  <div className="relative h-[280px] overflow-hidden">
                    <img src={product.images?.[0]} className="w-full h-full object-cover group-hover:scale-105 transition-all" alt={product.name} />
                    <div className="absolute top-2 left-2">
                      <span className="bg-yellow-400 text-yellow-900 text-[10px] font-[700] !px-2 !py-1 rounded-full">⭐ Vedette</span>
                    </div>
                    {product.discount > 0 && (
                      <div className="absolute top-2 right-2">
                        <span className="bg-red-500 text-white text-[10px] font-[700] !px-2 !py-1 rounded-full">-{product.discount}%</span>
                      </div>
                    )}
                  </div>
                  <div className="!px-3">
                    <p className="text-[13px] font-[600] line-clamp-2">{product.name}</p>
                    <p className="text-primary font-[700] text-[15px]">{product.price?.toLocaleString()} Fcfa</p>
                    <Link to={`/produit/${product._id}`}>
                    <button
                      className="w-full bg-primary text-white text-[12px] font-[600] !py-2 rounded-xl hover:bg-pink-600 transition-all !mb-1">
                      J'achète
                    </button>
                    </Link>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Produits Populaires */}
      <section className="bg-white !py-10">
        <div className="w-[95%] !mx-auto">
          <div className="flex items-center justify-between !mb-4">
            <div className="flex items-center gap-3">
              <div className="w-[42px] h-[42px] bg-red-50 rounded-full flex items-center justify-center">
                <FaFire className="text-red-500 text-[20px]" />
              </div>
              <div>
                <h2 className="text-[22px] font-[800]">{t.popularProducts}</h2>
                <p className="text-[13px] text-gray-400">Les produits les plus appréciés</p>
              </div>
            </div>
            <div className="flex-1 !mx-6 overflow-hidden">
              <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto"
                sx={{ '& .MuiTab-root': { fontSize: '12px', minHeight: '36px', padding: '6px 12px' } }}>
                {categories.map((cat) => <Tab key={cat._id} label={cat.name} />)}
              </Tabs>
            </div>
            <Link to="/listeProduits" className="text-primary text-[13px] font-[500] hover:underline whitespace-nowrap flex items-center gap-1">
              {t.viewAll} <FaArrowRight className="text-[11px]" />
            </Link>
          </div>
          <ProduitDefile items={5} categoryId={selectedCat} />
        </div>
      </section>

      {/* Bannière livraison gratuite */}
      <section className="!py-6">
        <div className="w-[95%] !mx-auto">
          <div className="bg-gradient-to-r from-primary to-pink-700 rounded-2xl !p-8 flex items-center justify-between text-white relative overflow-hidden">
            <div className="absolute top-0 right-[30%] w-[200px] h-[200px] bg-white opacity-5 rounded-full -translate-y-[60px]"></div>
            <div className="flex items-center gap-6 z-10">
              <FaShippingFast className="text-[60px] opacity-90" />
              <div>
                <h2 className="text-[24px] font-[800]">{t.freeShipping} 🎁</h2>
                <p className="text-[15px] opacity-90">Sur votre 1ère commande et toute commande de plus de 20 000 Fcfa</p>
              </div>
            </div>
            <div className="text-right z-10">
              <p className="text-[36px] font-[900]">20 000 Fcfa</p>
              <p className="text-[14px] opacity-80">minimum d'achat</p>
              <Link to="/listeProduits">
                <button className="bg-white text-primary font-[700] !px-5 !py-2 rounded-full text-[13px] !mt-3 hover:bg-gray-100 transition-all">En profiter →</button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Nouveaux produits */}
      <section className="bg-gray-50 !py-10">
        <div className="w-[95%] !mx-auto">
          <div className="flex items-center justify-between !mb-6">
            <div className="flex items-center gap-3">
              <div className="w-[42px] h-[42px] bg-blue-50 rounded-full flex items-center justify-center">
                <MdTrendingUp className="text-blue-500 text-[22px]" />
              </div>
              <div>
                <h2 className="text-[22px] font-[800]">{t.newProducts}</h2>
                <p className="text-[13px] text-gray-400">Les dernières tendances</p>
              </div>
            </div>
            <Link to="/listeProduits" className="text-primary text-[13px] font-[500] hover:underline flex items-center gap-1">
              {t.viewAll} <FaArrowRight className="text-[11px]" />
            </Link>
          </div>
          <ProduitDefile items={5} />
        </div>
      </section>

      {/* Espace vendeur */}
      <section className="!py-12 bg-gray-50">
        <div className="w-[95%] !mx-auto">
          <div className="bg-white rounded-3xl shadow-sm !p-10 flex items-center gap-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-pink-50 rounded-full translate-x-[100px] -translate-y-[100px]"></div>
            <div className="flex-1 z-10">
              <span className="bg-pink-100 text-primary text-[12px] font-[700] !px-3 !py-1 rounded-full !mb-4 inline-block">🏪 Espace Vendeur</span>
              <h2 className="text-[28px] font-[800] !mb-3">{t.sellOnSuguba}</h2>
              <p className="text-[15px] text-gray-600 !mb-6 leading-relaxed">{t.sellOnSugubaDesc}</p>
              <div className="grid grid-cols-3 gap-4 !mb-6">
                {[
                  { icon: FaPercent, title: "10% commission", desc: "Gardez 90% de vos ventes", color: "text-green-500", bg: "bg-green-50" },
                  { icon: FaShippingFast, title: "Livraison Suguba", desc: "On gère la livraison", color: "text-blue-500", bg: "bg-blue-50" },
                  { icon: MdTrendingUp, title: "Dashboard complet", desc: "Suivi en temps réel", color: "text-purple-500", bg: "bg-purple-50" },
                ].map(({ icon: Icon, title, desc, color, bg }) => (
                  <div key={title} className={`${bg} rounded-2xl !p-4`}>
                    <Icon className={`text-[22px] ${color} !mb-2`} />
                    <h4 className="text-[13px] font-[700] !mb-1">{title}</h4>
                    <p className="text-[11px] text-gray-500">{desc}</p>
                  </div>
                ))}
              </div>
              <Link to={context?.isLogin ? "/devenir-vendeur" : "/connexion?redirect=/devenir-vendeur"}>
                <button className="bg-gradient-to-r from-primary to-pink-600 text-white !px-8 !py-3 rounded-full text-[15px] font-[700] hover:from-pink-600 hover:to-pink-700 transition-all flex items-center gap-2">
                  {t.startSelling} <FaArrowRight />
                </button>
              </Link>
            </div>
            <div className="w-[380px] flex-shrink-0 z-10">
              <img
                src="https://st.depositphotos.com/37498150/56914/i/600/depositphotos_569147374-stock-photo-woman-smiling-holding-brazilian-money.jpg"
                className="w-full rounded-2xl shadow-md" alt="vendeur"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}





{/*import React, { useContext, useState, useEffect } from "react";
import DefileImg from "../defile/index";
import DefileCat from "../defileCategorie/index";
import {
  FaShippingFast, FaShieldAlt, FaHeadset, FaGift,
  FaStore, FaArrowRight, FaFire, FaStar, FaPercent
} from "react-icons/fa";
import { MdLocalOffer, MdTrendingUp } from "react-icons/md";
import ProduitDefile from "./ProduitDefile/index";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import { MyContext } from "../../router.jsx";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Link } from "react-router-dom";
import { translations } from "../../utils/i18n.js";
import { fetchDataFromApi } from "../../utils/api.js";

export default function Acceuil() {
  const context = useContext(MyContext);
  const t = translations[context?.lang] || translations.fr;
  const [value, setValue] = useState(0);
  const [selectedCat, setSelectedCat] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const categories = context.catData?.filter(c => !c.parentId) || [];

  useEffect(() => {
    // Charger les produits mis en avant (isFeatures: true)
    fetchDataFromApi("/api/product/produit-fare").then((res) => {
      setFeaturedProducts(res?.produits || []);
    });
  }, []);

  const handleChange = (_, newValue) => {
    setValue(newValue);
    setSelectedCat(categories[newValue]?._id || null);
  };

  const features = [
    { icon: FaShippingFast, title: t.freeShipping, desc: "> 20 000 Fcfa", color: "text-blue-500", bg: "bg-blue-50" },
    { icon: FaShieldAlt, title: "Paiement Sécurisé", desc: "Orange & Moov Money", color: "text-green-500", bg: "bg-green-50" },
    { icon: FaHeadset, title: "Support 24/7", desc: "Disponible pour vous", color: "text-purple-500", bg: "bg-purple-50" },
    { icon: FaGift, title: "Retour 30 jours", desc: "Remboursement garanti", color: "text-orange-500", bg: "bg-orange-50" },
  ];

  const promoImages = [
    "https://robe-rose-poudre.com/cdn/shop/files/Sc905954246e74a7a8c759fe184d1353el.webp?crop=center&height=1200&v=1740644205&width=1200",
    "https://robe-rose-poudre.com/cdn/shop/files/S5919f4af018f47aab44b3ff1979ba0a8i.webp?crop=center&height=1200&v=1740644190&width=1200",
    "https://robe-rose-poudre.com/cdn/shop/files/S6f8e980fba724e5d9f738d0093ae3927S.webp?crop=center&height=1200&v=1740730832&width=1200",
    "https://robe-rose-poudre.com/cdn/shop/files/Se9841dcf07f642db8ffb9c991fcc85db0.webp?crop=center&height=1200&v=1741334972&width=1200",
    "https://robe-rose-poudre.com/cdn/shop/files/S4d014d61045c4479aa0101140d05f59fZ.webp?crop=center&height=1200&v=1740730833&width=1200",
  ];

  return (
    <>
     
      <DefileImg />

      
      <div className="bg-white border-b border-gray-100 !py-4 shadow-sm">
        <div className="w-[95%] !mx-auto">
          <div className="grid grid-cols-4 gap-4">
            {features.map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className="flex items-center gap-3 !px-3 !py-2 rounded-xl hover:bg-gray-50 transition-all cursor-default">
                <div className={`w-[42px] h-[42px] ${bg} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`text-[20px] ${color}`} />
                </div>
                <div>
                  <h4 className="text-[13px] font-[700]">{title}</h4>
                  <p className="text-[11px] text-gray-400 !mb-0">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      
      <section className="w-[95%] !mx-auto !py-6">
        <div className="grid grid-cols-3 gap-4">
         
          <div className="col-span-1 rounded-2xl overflow-hidden relative group h-[360px] cursor-pointer">
            <img
              src="https://robe-rose-poudre.com/cdn/shop/files/Designsanstitre-2025-04-09T094817.768.png?crop=center&height=1200&v=1744184979&width=1200"
              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
              alt="promo"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center !px-8">
              <span className="bg-pink-500 text-white text-[11px] font-[700] !px-3 !py-1 rounded-full w-fit !mb-3">
                🔥 Offre spéciale
              </span>
              <h2 className="text-white text-[26px] font-[800] !mb-1">Artisanat Malien</h2>
              <p className="text-white opacity-80 text-[14px] !mb-4">Dès 5 000 Fcfa</p>
              <Link to="/listeProduits">
                <button className="bg-white text-primary font-[600] !px-5 !py-2 rounded-full text-[13px] hover:bg-gray-100 transition-all w-fit">
                  Acheter maintenant →
                </button>
              </Link>
            </div>
          </div>

          
          <div className="flex col-span-2 gap-4 h-[360px]">
            {[
              {
                img: "https://robe-rose-poudre.com/cdn/shop/files/Designsanstitre-2025-04-09T094720.443.png?crop=center&height=1200&v=1744184979&width=1200",
                label: "Mode Femme", badge: "-30%", color: "from-pink-500"
              },
              {
                img: "https://robe-rose-poudre.com/cdn/shop/files/Sdb423c850fab4ebd83ec195239ad31b8N.webp?crop=center&height=1200&v=1740644171&width=1200",
                label: "Électronique", badge: "Nouveau", color: "from-blue-600"
              },
            ].map(({ img, label, badge, color }) => (
              <Link to="/listeProduits" key={label} className="relative rounded-2xl overflow-hidden group flex-1 block">
                <img src={img} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" alt={label} />
                <div className={`absolute inset-0 bg-gradient-to-r ${color}/60 to-transparent flex items-end !p-4`}>
                  <div>
                    <span className="bg-white text-[10px] font-[700] !px-2 !py-1 rounded-full text-gray-800 !mb-1 block w-fit">{badge}</span>
                    <p className="text-white font-[700] text-[14px]">{label}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    <section className="bg-white !py-8">
        <div className="w-[95%] !mx-auto">
          <Swiper slidesPerView={4} spaceBetween={12} navigation={true} autoplay={{ delay: 3000 }}
            modules={[Navigation, Autoplay]} className="smlBtn">
            {promoImages.map((img, i) => (
              <SwiperSlide key={i}>
                <Link to="/listeProduits">
                  <div className="rounded-2xl overflow-hidden group cursor-pointer h-[190px]">
                    <img src={img} className="w-full h-full object-cover transition-all group-hover:scale-105 duration-500" />
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
      
      
       <section className="w-[95%] !mx-auto !pb-5">
        <h2 className="text-[20px] font-[700] !mb-4">Acheter par catégorie</h2>
        <Swiper slidesPerView={6} spaceBetween={12} navigation modules={[Navigation]} className="mySwiper">
          {categories.map(cat => (
            <SwiperSlide key={cat._id}>
              <Link to={`/listeProduits?category=${cat._id}&name=${cat.name}`}>
                <div className="flex flex-col items-center gap-2 bg-white rounded-xl !p-3 hover:shadow-md transition-all cursor-pointer border border-gray-100 hover:border-primary">
                  <img src={cat.images?.[0] || "/placeholder.png"}
                    className="w-[65px] h-[65px] object-cover rounded-full" alt={cat.name} />
                  <span className="text-[13px] font-[600] text-center">{cat.name}</span>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
      
      {featuredProducts.length > 0 && (
        <section className="!py-10 bg-gradient-to-b from-yellow-50 to-white">
          <div className="w-[95%] !mx-auto">
            <div className="flex items-center justify-between !mb-6">
              <div className="flex items-center gap-3">
                <div className="w-[42px] h-[42px] bg-yellow-400 rounded-full flex items-center justify-center">
                  <FaStar className="text-white text-[20px]" />
                </div>
                <div>
                  <h2 className="text-[22px] font-[800]">Produits Vedettes ⭐</h2>
                  <p className="text-[13px] text-gray-400">Sélectionnés et mis en avant par nos vendeurs</p>
                </div>
              </div>
              <Link to="/listeProduits" className="text-primary text-[14px] font-[500] hover:underline flex items-center gap-1">
                {t.viewAll} <FaArrowRight className="text-[11px]" />
              </Link>
            </div>
            <div className="grid grid-cols-4 gap-5">
              {featuredProducts.slice(0, 4).map((product) => (
                <Link to={`/produit/${product._id}`} key={product._id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-yellow-100 group">
                  <div className="relative h-[280px] overflow-hidden">
                    <img src={product.images?.[0]} className="w-full h-full object-cover group-hover:scale-105 transition-all" />
                    <div className="absolute top-2 left-2">
                      <span className="bg-yellow-400 text-yellow-900 text-[10px] font-[700] !px-2 !py-1 rounded-full">⭐ Vedette</span>
                    </div>
                    {product.discount > 0 && (
                      <div className="absolute top-2 right-2">
                        <span className="bg-red-500 text-white text-[10px] font-[700] !px-2 !py-1 rounded-full">-{product.discount}%</span>
                      </div>
                    )}
                  </div>
                  <div className="!px-3">
                    <p className="text-[13px] font-[600] line-clamp-2">{product.name}</p>
                    <p className="text-[11px] text-gray-400 !mb-2">{}</p>
                    <p className="text-primary font-[700] text-[15px]">{product.price?.toLocaleString()} Fcfa</p>
                    <button
                      onClick={(e) => { e.preventDefault(); context.addToCart(product._id, 1); }}
                      className="w-full bg-primary text-white text-[12px] font-[600] !py-2 rounded-xl hover:bg-pink-600 transition-all !mb-1">
                      {t.addToCart}
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      
      <section className="bg-white !py-10">
        <div className="w-[95%] !mx-auto">
          <div className="flex items-center justify-between !mb-4">
            <div className="flex items-center gap-3">
              <div className="w-[42px] h-[42px] bg-red-50 rounded-full flex items-center justify-center">
                <FaFire className="text-red-500 text-[20px]" />
              </div>
              <div>
                <h2 className="text-[22px] font-[800]">{t.popularProducts}</h2>
                <p className="text-[13px] text-gray-400">Les produits les plus appréciés</p>
              </div>
            </div>
            <div className="flex-1 !mx-6 overflow-hidden">
              <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto"
                sx={{ '& .MuiTab-root': { fontSize: '12px', minHeight: '36px', padding: '6px 12px' } }}>
                {categories.map((cat) => <Tab key={cat._id} label={cat.name} />)}
              </Tabs>
            </div>
            <Link to="/listeProduits" className="text-primary text-[13px] font-[500] hover:underline whitespace-nowrap flex items-center gap-1">
              {t.viewAll} <FaArrowRight className="text-[11px]" />
            </Link>
          </div>
          <ProduitDefile items={5} categoryId={selectedCat} />
        </div>
      </section>

     
      <section className="!py-6">
        <div className="w-[95%] !mx-auto">
          <div className="bg-gradient-to-r from-primary to-pink-700 rounded-2xl !p-8 flex items-center justify-between text-white relative overflow-hidden">
            <div className="absolute top-0 right-[30%] w-[200px] h-[200px] bg-white opacity-5 rounded-full -translate-y-[60px]"></div>
            <div className="flex items-center gap-6 z-10">
              <FaShippingFast className="text-[60px] opacity-90" />
              <div>
                <h2 className="text-[24px] font-[800]">{t.freeShipping} 🎁</h2>
                <p className="text-[15px] opacity-90">Sur votre 1ère commande et toute commande de plus de 20 000 Fcfa</p>
              </div>
            </div>
            <div className="text-right z-10">
              <p className="text-[36px] font-[900]">20 000 Fcfa</p>
              <p className="text-[14px] opacity-80">minimum d'achat</p>
              <Link to="/listeProduits">
                <button className="bg-white text-primary font-[700] !px-5 !py-2 rounded-full text-[13px] !mt-3 hover:bg-gray-100 transition-all">
                  En profiter →
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

     
      <section className="bg-gray-50 !py-10">
        <div className="w-[95%] !mx-auto">
          <div className="flex items-center justify-between !mb-6">
            <div className="flex items-center gap-3">
              <div className="w-[42px] h-[42px] bg-blue-50 rounded-full flex items-center justify-center">
                <MdTrendingUp className="text-blue-500 text-[22px]" />
              </div>
              <div>
                <h2 className="text-[22px] font-[800]">{t.newProducts}</h2>
                <p className="text-[13px] text-gray-400">Les dernières tendances</p>
              </div>
            </div>
            <Link to="/listeProduits" className="text-primary text-[13px] font-[500] hover:underline flex items-center gap-1">
              {t.viewAll} <FaArrowRight className="text-[11px]" />
            </Link>
          </div>
          <ProduitDefile items={5} />
        </div>
      </section>

      <section className="!py-12 bg-gray-50">
        <div className="w-[95%] !mx-auto">
          <div className="bg-white rounded-3xl shadow-sm !p-10 flex items-center gap-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-pink-50 rounded-full translate-x-[100px] -translate-y-[100px]"></div>
            <div className="flex-1 z-10">
              <span className="bg-pink-100 text-primary text-[12px] font-[700] !px-3 !py-1 rounded-full !mb-4 inline-block">
                🏪 Espace Vendeur
              </span>
              <h2 className="text-[28px] font-[800] !mb-3">{t.sellOnSuguba}</h2>
              <p className="text-[15px] text-gray-600 !mb-6 leading-relaxed">
                {t.sellOnSugubaDesc}
              </p>
              <div className="grid grid-cols-3 gap-4 !mb-6">
                {[
                  { icon: FaPercent, title: "10% commission", desc: "Gardez 90% de vos ventes", color: "text-green-500", bg: "bg-green-50" },
                  { icon: FaShippingFast, title: "Livraison Suguba", desc: "On gère la livraison", color: "text-blue-500", bg: "bg-blue-50" },
                  { icon: MdTrendingUp, title: "Dashboard complet", desc: "Suivi en temps réel", color: "text-purple-500", bg: "bg-purple-50" },
                ].map(({ icon: Icon, title, desc, color, bg }) => (
                  <div key={title} className={`${bg} rounded-2xl !p-4`}>
                    <Icon className={`text-[22px] ${color} !mb-2`} />
                    <h4 className="text-[13px] font-[700] !mb-1">{title}</h4>
                    <p className="text-[11px] text-gray-500">{desc}</p>
                  </div>
                ))}
              </div>
              <Link to={context?.isLogin ? "/devenir-vendeur" : "/connexion?redirect=/devenir-vendeur"}>
                <button className="bg-gradient-to-r from-primary to-pink-600 text-white !px-8 !py-3 rounded-full text-[15px] font-[700] hover:from-pink-600 hover:to-pink-700 transition-all flex items-center gap-2">
                  {t.startSelling} <FaArrowRight />
                </button>
              </Link>
            </div>
            <div className="w-[380px] flex-shrink-0 z-10">
              <img
                src="https://st.depositphotos.com/37498150/56914/i/600/depositphotos_569147374-stock-photo-woman-smiling-holding-brazilian-money.jpg"
                className="w-full rounded-2xl shadow-md"
                alt="vendeur"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}


*/}

{/*import React, { useContext, useState, useEffect } from "react";
import DefileImg from "../defile/index";
import DefileCat from "../defileCategorie/index";
import { FaShippingFast, FaShieldAlt, FaHeadset, FaGift } from "react-icons/fa";
import ProduitDefile from "./ProduitDefile/index";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import BanniereV2 from "../BanniereV2/index";
import BanniereV3 from "../BanniereV3/index";
import { MyContext } from "../../router.jsx";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Link } from "react-router-dom";
import { translations } from "../../utils/i18n.js";

export default function Acceuil() {
  const context = useContext(MyContext);
  const t = translations[context.lang] || translations.fr;
  const [value, setValue] = useState(0);
  const [selectedCat, setSelectedCat] = useState(null);
  const categories = context.catData?.filter(c => !c.parentId) || [];

  const handleChange = (_, newValue) => {
    setValue(newValue);
    setSelectedCat(categories[newValue]?._id || null);
  };

  const features = [
    { icon: FaShippingFast, title: "Livraison Gratuite", desc: "Commandes > 20 000 Fcfa", color: "text-blue-500" },
    { icon: FaShieldAlt, title: "Paiement Sécurisé", desc: "Orange Money & Moov", color: "text-green-500" },
    { icon: FaHeadset, title: "Support 24/7", desc: "Disponible pour vous", color: "text-purple-500" },
    { icon: FaGift, title: "Retour 30 jours", desc: "Remboursement garanti", color: "text-orange-500" },
  ];

  return (
    <>
     
      <DefileImg />

     
      <div className="bg-white border-b border-gray-100 !py-4">
        <div className="w-[95%] !mx-auto">
          <div className="grid grid-cols-4 gap-4">
            {features.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="flex items-center gap-3 !px-4 !py-2">
                <Icon className={`text-[28px] ${color}`} />
                <div>
                  <h4 className="text-[13px] font-[600]">{title}</h4>
                  <p className="text-[11px] text-gray-400 !mb-0">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

     
      <section className="w-[95%] !mx-auto !py-6">
        <div className="flex !gap-4">
          <div className="partie1 !w-[55%]">
            <BanniereV2 />
          </div>
          <div className="partie2 w-[45%] flex !gap-3 flex-col">
            <BanniereV3 info={"left"}
              image={"https://robe-rose-poudre.com/cdn/shop/files/ad7b1fa9-1a32-4c56-8ad3-744283381a4f.webp?crop=center&height=1200&v=1740644171&width=1200"} />
            <BanniereV3 info={"right"}
              image={"https://robe-rose-poudre.com/cdn/shop/files/Sd8559c7b26a64f60bef1aa26dfb0a519Z.webp?crop=center&height=1200&v=1740644171&width=1200"} />
          </div>
        </div>
      </section>

     
      <DefileCat />

      
      <section className="bg-white !py-10">
        <div className="w-[95%] !mx-auto">
          <div className="flex items-center justify-between !mb-6">
            <div>
              <h2 className="text-[22px] font-[700]">{t.popularProducts}</h2>
              <p className="text-[13px] text-gray-400">Ne manquez pas nos meilleures offres</p>
            </div>
            <div className="w-[55%]">
              <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto">
                {categories.map((cat) => <Tab key={cat._id} label={cat.name} />)}
              </Tabs>
            </div>
          </div>
          <ProduitDefile items={6} categoryId={selectedCat} />
        </div>
      </section>

     
      <section className="!py-6">
        <div className="w-[95%] !mx-auto">
          <div className="bg-gradient-to-r from-pink-500 to-pink-700 rounded-2xl !p-8 flex items-center justify-between text-white">
            <div className="flex items-center gap-5">
              <FaShippingFast className="text-[60px] opacity-90" />
              <div>
                <h2 className="text-[24px] font-[700]">Livraison Gratuite</h2>
                <p className="text-[15px] opacity-90">Sur votre 1ère commande et toute commande de plus de 20 000 Fcfa</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[32px] font-[800]">20 000 Fcfa</p>
              <p className="text-[14px] opacity-80">minimum d'achat</p>
            </div>
          </div>
        </div>
      </section>

      
      <section className="bg-white !py-10">
        <div className="w-[95%] !mx-auto">
          <div className="flex items-center justify-between !mb-6">
            <div>
              <h2 className="text-[22px] font-[700]">{t.newProducts}</h2>
              <p className="text-[13px] text-gray-400">Les dernières tendances</p>
            </div>
            <Link to="/listeProduits" className="text-primary text-[14px] font-[500] hover:underline">
              Voir tout →
            </Link>
          </div>
          <ProduitDefile items={6} />
        </div>
      </section>

      
      <section className="!py-6">
        <div className="w-[95%] !mx-auto">
          <Swiper slidesPerView={4} spaceBetween={12} navigation={true} modules={[Navigation]} className="smlBtn">
            {[
              "https://robe-rose-poudre.com/cdn/shop/files/Sc905954246e74a7a8c759fe184d1353el.webp",
              "https://robe-rose-poudre.com/cdn/shop/files/S5919f4af018f47aab44b3ff1979ba0a8i.webp",
              "https://robe-rose-poudre.com/cdn/shop/files/S6f8e980fba724e5d9f738d0093ae3927S.webp",
              "https://robe-rose-poudre.com/cdn/shop/files/Se9841dcf07f642db8ffb9c991fcc85db0.webp",
              "https://robe-rose-poudre.com/cdn/shop/files/S4d014d61045c4479aa0101140d05f59fZ.webp",
            ].map((img, i) => (
              <SwiperSlide key={i}>
                <Link to="/listeProduits">
                  <div className="rounded-xl overflow-hidden group cursor-pointer h-[200px]">
                    <img src={img} className="w-full h-full object-cover transition-all group-hover:scale-105" />
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

    
      <section className="!py-10 bg-gray-50">
        <div className="w-[95%] !mx-auto">
          <div className="bg-white rounded-2xl shadow-sm !p-10 flex items-center gap-10">
            <div className="flex-1">
              <h2 className="text-[26px] font-[700] !mb-3">Vendez sur Suguba 🏪</h2>
              <p className="text-[15px] text-gray-600 !mb-6">
                Rejoignez notre marketplace et vendez vos produits à des milliers de clients.
                Seulement 10% de commission sur vos ventes. Activation immédiate !
              </p>
              <div className="grid grid-cols-3 gap-4 !mb-6">
                {[
                  { title: "Commission 10%", desc: "Gardez 90% de vos ventes" },
                  { title: "Activation immédiate", desc: "Votre boutique en quelques minutes" },
                  { title: "Dashboard complet", desc: "Suivez vos ventes en temps réel" },
                ].map(({ title, desc }) => (
                  <div key={title} className="bg-gray-50 rounded-xl !p-4">
                    <h4 className="text-[14px] font-[600] !mb-1">{title}</h4>
                    <p className="text-[12px] text-gray-500 !mb-0">{desc}</p>
                  </div>
                ))}
              </div>
              <Link to={context.isLogin ? "/devenir-vendeur" : "/connexion"}>
                <button className="btn-org !px-8 !py-3 !rounded-full text-[15px] font-[600]">
                  Commencer à vendre →
                </button>
              </Link>
            </div>
            <div className="w-[300px] flex-shrink-0">
              <img src="https://robe-rose-poudre.com/cdn/shop/files/Designsanstitre-2025-04-09T094817.768.png"
                className="w-full rounded-xl" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}*/}


{/*import React, { useContext, useState, useEffect } from "react";
import DefileImg from "../defile/index";
import { FaShippingFast, FaStore, FaFire, FaStar } from "react-icons/fa";
import { MdNewReleases, MdLocalOffer } from "react-icons/md";
import ProduitDefile from "./ProduitDefile/index";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { Navigation, Autoplay } from "swiper/modules";
import { MyContext } from "../../router.jsx";
import { Link, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { postData, fetchDataFromApi } from "../../utils/api.js";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export default function Acceuil() {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [tabValue, setTabValue] = useState(0);
  const [selectedCat, setSelectedCat] = useState(null);
  const [newsEmail, setNewsEmail] = useState("");
  const [newsLoading, setNewsLoading] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);

  const categories = context.catData?.filter(c => !c.parentId) || [];

  useEffect(() => {
    fetchDataFromApi("/api/product/produit-fare").then(res => {
      setFeaturedProducts(res?.produits || []);
    });
    fetchDataFromApi("/api/product/produits?page=1&perPage=8").then(res => {
      setNewProducts(res?.produits || []);
    });
  }, []);

  const handleTabChange = (e, val) => {
    setTabValue(val);
    setSelectedCat(categories[val]?._id || null);
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsEmail) { toast.error("Veuillez entrer votre email"); return; }
    setNewsLoading(true);
    const res = await postData("/api/newsletter/inscription", { email: newsEmail });
    if (res?.success) {
      toast.success(res.message);
      setNewsEmail("");
    } else {
      toast.error(res?.message || "Erreur");
    }
    setNewsLoading(false);
  };

  return (
    <>
      
      <DefileImg />

     
      <section className="w-[95%] !mx-auto !py-5">
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: FaShippingFast, title: "Livraison gratuite", desc: "Sur commandes > 20k Fcfa", color: "bg-blue-50 text-blue-600" },
            { icon: MdLocalOffer, title: "Offres exclusives", desc: "Jusqu'à -70% sur des milliers d'articles", color: "bg-pink-50 text-pink-600" },
            { icon: FaStore, title: "Devenez vendeur", desc: "Vendez vos produits sur Suguba", color: "bg-green-50 text-green-600", link: "/devenir-vendeur" },
          ].map(({ icon: Icon, title, desc, color, link }) => (
            <div key={title}
              className={`flex items-center gap-4 !p-4 rounded-xl ${color} cursor-pointer hover:shadow-md transition-all`}
              onClick={() => link && navigate(link)}>
              <Icon className="text-[35px]" />
              <div>
                <h3 className="text-[15px] font-[700]">{title}</h3>
                <p className="text-[12px] !mb-0">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      
      <section className="w-[95%] !mx-auto !pb-5">
        <h2 className="text-[20px] font-[700] !mb-4">Acheter par catégorie</h2>
        <Swiper slidesPerView={6} spaceBetween={12} navigation modules={[Navigation]} className="mySwiper">
          {categories.map(cat => (
            <SwiperSlide key={cat._id}>
              <Link to={`/listeProduits?category=${cat._id}&name=${cat.name}`}>
                <div className="flex flex-col items-center gap-2 bg-white rounded-xl !p-3 hover:shadow-md transition-all cursor-pointer border border-gray-100 hover:border-primary">
                  <img src={cat.images?.[0] || "/placeholder.png"}
                    className="w-[65px] h-[65px] object-cover rounded-full" alt={cat.name} />
                  <span className="text-[13px] font-[600] text-center">{cat.name}</span>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      
      <section className="bg-white !py-8">
        <div className="w-[95%] !mx-auto">
          <div className="flex items-center justify-between !mb-5">
            <div className="flex items-center gap-2">
              <FaFire className="text-[24px] text-orange-500" />
              <div>
                <h2 className="text-[20px] font-[700]">Produits Populaires</h2>
                <p className="text-[13px] text-gray-400 !mb-0">Les plus achetés en ce moment</p>
              </div>
            </div>
            <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto"
              sx={{ "& .MuiTab-root": { fontSize: "12px", minWidth: "80px" } }}>
              {categories.map(cat => <Tab key={cat._id} label={cat.name} />)}
            </Tabs>
          </div>
          <ProduitDefile items={5} categoryId={selectedCat} />
          <div className="text-center !mt-5">
            <Button className="btn-org !px-8"
              onClick={() => navigate(selectedCat ? `/listeProduits?category=${selectedCat}` : "/listeProduits")}>
              Voir tous les produits →
            </Button>
          </div>
        </div>
      </section>

     
      <section className="w-[95%] !mx-auto !py-5">
        <div className="bg-gradient-to-r from-pink-500 to-pink-700 rounded-2xl !p-8 flex items-center justify-between text-white">
          <div>
            <h2 className="text-[28px] font-[700] !mb-2">🎁 Livraison Gratuite</h2>
            <p className="text-[16px] !mb-4">Sur toutes vos commandes supérieures à 20 000 Fcfa</p>
            <Button className="!bg-white !text-primary !font-[700] !px-6"
              onClick={() => navigate("/listeProduits")}>
              Profiter maintenant
            </Button>
          </div>
          <FaShippingFast className="text-[100px] opacity-30" />
        </div>
      </section>

      
      <section className="bg-white !py-8">
        <div className="w-[95%] !mx-auto">
          <div className="flex items-center gap-2 !mb-5">
            <MdNewReleases className="text-[28px] text-primary" />
            <div>
              <h2 className="text-[20px] font-[700]">Nouveaux Produits</h2>
              <p className="text-[13px] text-gray-400 !mb-0">Découvrez les dernières nouveautés</p>
            </div>
          </div>
          <ProduitDefile items={5} />
        </div>
      </section>

      
      {featuredProducts.length > 0 && (
        <section className="bg-[#fafafa] !py-8">
          <div className="w-[95%] !mx-auto">
            <div className="flex items-center gap-2 !mb-5">
              <FaStar className="text-[24px] text-yellow-500" />
              <div>
                <h2 className="text-[20px] font-[700]">Produits en Vedette</h2>
                <p className="text-[13px] text-gray-400 !mb-0">Sélectionnés pour vous</p>
              </div>
            </div>
            <ProduitDefile items={5} />
          </div>
        </section>
      )}

      
      <section className="w-[95%] !mx-auto !py-5">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl !p-8 flex items-center justify-between text-white">
          <div>
            <h2 className="text-[24px] font-[700] !mb-2">Vendez sur Suguba</h2>
            <p className="text-[15px] !mb-4 opacity-80">Rejoignez des milliers de vendeurs. Commission uniquement 10%.</p>
            <Button className="btn-org" onClick={() => navigate("/devenir-vendeur")}>
              Créer ma boutique gratuitement →
            </Button>
          </div>
          <FaStore className="text-[100px] opacity-20" />
        </div>
      </section>

     
      <section className="bg-primary !py-12">
        <div className="w-[95%] !mx-auto text-center text-white">
          <h2 className="text-[28px] font-[700] !mb-2">📧 Restez informé(e)</h2>
          <p className="text-[16px] opacity-90 !mb-6">
            Inscrivez-vous et recevez les meilleures offres en avant-première
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex items-center gap-3 justify-center max-w-[500px] !mx-auto">
            <input
              type="email"
              value={newsEmail}
              onChange={e => setNewsEmail(e.target.value)}
              placeholder="Votre adresse email..."
              className="flex-1 h-[48px] rounded-lg !px-4 text-gray-800 focus:outline-none text-[14px]"
            />
            <Button type="submit" disabled={newsLoading}
              className="!bg-gray-900 !text-white !h-[48px] !px-6 !rounded-lg !font-[600]">
              {newsLoading ? "..." : "S'inscrire"}
            </Button>
          </form>
        </div>
      </section>
    </>
  );
}










{/*
import React, { useContext } from "react";
import DefileImg from "../defile/index";
import DefileCat from "../defileCategorie/index";
import { FaShippingFast } from "react-icons/fa";
import AjoutBanniere from "../AjoutBanniere/index";
import AjoutBanniereV2 from "../AjoutBanniereV2/index";
import BlogItem from "../BlogItems/index";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ProduitDefile from "./ProduitDefile/index";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import BanniereV2 from "../BanniereV2/index";
import BanniereV3 from "../BanniereV3/index";
import { MyContext } from "../../router.jsx";

export default function Acceuil() {
  const context = useContext(MyContext);

  const [value, setValue] = React.useState(0);
  const [selectedCat, setSelectedCat] = React.useState(null);

  const categories = context.catData || [];

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setSelectedCat(categories[newValue]?._id || null);
  };

  return (
    <>
      <DefileImg />

      <section className=" w-[95%] !mx-auto !py-6">
        <div className=" flex !gap-3">
          <div className="partie1 !w-[50%]">
            <BanniereV2 />
          </div>
          <div className="partie2 w-[50%] flex !gap-2 flex-col justify-between items-center ">
            <BanniereV3
              info={"left"}
              image={
                "https://robe-rose-poudre.com/cdn/shop/files/ad7b1fa9-1a32-4c56-8ad3-744283381a4f.webp?crop=center&height=1200&v=1740644171&width=1200"
              }
            />
            <BanniereV3
              info={"right"}
              image={
                "https://robe-rose-poudre.com/cdn/shop/files/Sd8559c7b26a64f60bef1aa26dfb0a519Z.webp?crop=center&height=1200&v=1740644171&width=1200"
              }
            />
          </div>
        </div>
      </section>

      <DefileCat />

      
      <section className="bg-white py-8">
        <div className="w-[95%] !mx-auto">
          <div className="flex items-center justify-between ">
            <div className=" sectgauche items-center flex-col !py-2">
              <h2 className="text-[20px] font-[600]">
                Les produits populaires
              </h2>
              <p className="text-[14px] font-[400]">
                Ne manquez pas les offres actuelles jusqu'a fin mars.
              </p>
            </div>

            <div className="sectdroite w-[60%]">
              <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
              >
                {categories.map((cat) => (
                  <Tab key={cat._id} label={cat.name} />
                ))}
              </Tabs>
            </div>
          </div>

          
          <ProduitDefile items={6} categoryId={selectedCat} />
        </div>
      </section>

      <section className="!py-4 pt-2 bg-white">
        <div className="w-[95%] !mx-auto">
          <div className="gratuiLivraison !w-[80%] !m-auto py-4 p-4 border-2 !border-[#E77492] flex items-center justify-between rounded-md mb-7">
            <div className="col1 flex items-center gap-4">
              <FaShippingFast className="text-[50px]" />
              <span className="text-[20px] font-[600] uppercase">
                Livraison gratuite
              </span>
            </div>
            <div className="col2 ">
              <p className="mb-0 font-[500]">
                Livraison gratuite maintenant sur votre première commande et
                plus de 20k fcfa
              </p>
            </div>
            <p className="font-bold text-[25px]">
              -Seulement 20k fcfa
            </p>
          </div>

          <AjoutBanniereV2 items={4} />
        </div>
      </section>

      <section className="py-5 pt-0 bg-white">
        <div className="w-[95%] !mx-auto">
          <h2 className="text-[20px] font-[600]">
            Les nouveaux Produits
          </h2>
          <ProduitDefile items={6} />
          <AjoutBanniere items={3} />
        </div>
      </section>

      <section className="!py-5 pt-0 bg-white">
        <div className="w-[95%] !mx-auto">
          <h2 className="text-[20px] font-[600]">
            Les futurs Produits
          </h2>
          <ProduitDefile items={6} />
          <AjoutBanniere items={2} />
        </div>
      </section>

      <section className="py-5 pb-8 pt-0 bg-white sectionBlog">
        <div className="w-[95%] !mx-auto">
          <h2 className="text-[20px] font-[600] !mb-4">
            Du Blog
          </h2>

          <Swiper
            slidesPerView={4}
            spaceBetween={10}
            navigation={true}
            modules={[Navigation]}
            className="sectionBlog"
          >
            <SwiperSlide><BlogItem /></SwiperSlide>
            <SwiperSlide><BlogItem /></SwiperSlide>
            <SwiperSlide><BlogItem /></SwiperSlide>
            <SwiperSlide><BlogItem /></SwiperSlide>
            <SwiperSlide><BlogItem /></SwiperSlide>
            <SwiperSlide><BlogItem /></SwiperSlide>
            <SwiperSlide><BlogItem /></SwiperSlide>
          </Swiper>
        </div>
      </section>
    </>
  );
}
 */}

{/*import React from "react";
import DefileImg from "../defile/index"
import DefileCat from "../defileCategorie/index"
import { FaShippingFast } from "react-icons/fa";
import AjoutBanniere from "../AjoutBanniere/index";
import AjoutBanniereV2 from "../AjoutBanniereV2/index";
import BlogItem from "../BlogItems/index";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ProduitDefile from "./ProduitDefile/index";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation} from 'swiper/modules';
import BanniereV2 from "../BanniereV2/index";
import BanniereV3 from "../BanniereV3/index";

export default function Acceuil(){

     const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

    return(
        <>
        <DefileImg/>
        <section className=" w-[95%] !mx-auto !py-6">
            <div className=" flex !gap-3">
                <div  className="partie1 !w-[50%]">
                      <BanniereV2/>
                </div>
                <div className="partie2 w-[50%] flex !gap-2 flex-col justify-between items-center ">
                   <BanniereV3 info={"left"} image={"https://robe-rose-poudre.com/cdn/shop/files/ad7b1fa9-1a32-4c56-8ad3-744283381a4f.webp?crop=center&height=1200&v=1740644171&width=1200"}/>
                   <BanniereV3 info={"right"} image={"https://robe-rose-poudre.com/cdn/shop/files/Sd8559c7b26a64f60bef1aa26dfb0a519Z.webp?crop=center&height=1200&v=1740644171&width=1200"}/>
                </div>
            </div>
        </section>
        <DefileCat/>
       <section className="bg-white py-8">
            <div className="w-[95%] !mx-auto">
                <div className="flex items-center justify-between ">
                    <div className=" sectgauche items-center flex-col !py-2">
                        <h2 className="text-[20px] font-[600]"> Les produits populaires</h2>
                        <p className="text-[14px] font-[400]"> Ne manquez pas les offres actuelles jusqu'a fin mars.</p>
                    </div>
                    <div className="sectdroite  w-[60%]">
                        <Tabs
                                value={value}
                                 onChange={handleChange}
                                 variant="scrollable"
                                 scrollButtons="auto"
                                 aria-label="scrollable auto tabs example" >
                                        <Tab label="Habits" />
                                        <Tab label="Electroniques" />
                                        <Tab label="Sacs" />
                                        <Tab label="Chaussures"/>
                                        <Tab label="Aliments" />
                                        <Tab label="Cosmetiques" />
                                        <Tab label="Bijoux" />
                                        <Tab label="Artisanaux" />
                        </Tabs>
                    </div>
                </div>
                <ProduitDefile items={6}/>
            </div>
       </section>



        <section className="!py-4  pt-2 bg-white">
                              <div className="w-[95%] !mx-auto">
                                 <div className="gratuiLivraison !w-[80%] !m-auto py-4 p-4  border-2 !border-[#E77492] flex  
                                     items-center justify-between rounded-md mb-7">
                                       <div className="col1 flex items-center gap-4">
                                           <FaShippingFast className="text-[50px]"/>
                                                <span className="text-[20px] font-[600] uppercase"> Livraison graduite</span>
                                        </div>
                                        <div className="col2 ">
                                            <p className="mb-0 font-[500]"> Livraison gratuite maintenant sur votre première commande et plus de 20k fcfa</p>
                                        </div>
                                        <p className="font-bold text-[25px]"> -Seulement 20k fcfa</p>
                                    </div>
                                     <AjoutBanniereV2 items={4}/>
                                </div>
        </section>

        <section className="py-5 pt-0 bg-white">
           <div className="w-[95%] !mx-auto">
            <h2 className="text-[20px] font-[600]"> Les nouveaux Produits</h2>
                <ProduitDefile items={6}/>
                <AjoutBanniere items={3}/>
           </div>
       </section>

       <section className="!py-5 pt-0 bg-white">
           <div className="w-[95%] !mx-auto">
            <h2 className="text-[20px] font-[600]"> Les futurs Produits</h2>
                <ProduitDefile items={6}/>
                <AjoutBanniere items={2}/>
           </div>
       </section>
        <section className="py-5 pb-8 pt-0 bg-white sectionBlog">
           <div className="w-[95%] !mx-auto">
            <h2 className="text-[20px] font-[600] !mb-4"> Du Blog</h2>
                <Swiper
                     slidesPerView={4}
                     spaceBetween={10}
                     navigation={true}
                     modules={[Navigation]}
                     className="sectionBlog"
                    >
                    <SwiperSlide>
                        <BlogItem/>
                     </SwiperSlide> 
                     <SwiperSlide>
                        <BlogItem/>
                     </SwiperSlide>
                     <SwiperSlide>
                        <BlogItem/>
                     </SwiperSlide>
                     <SwiperSlide>
                        <BlogItem/>
                     </SwiperSlide>
                     <SwiperSlide>
                        <BlogItem/>
                     </SwiperSlide>
                     <SwiperSlide>
                        <BlogItem/>
                     </SwiperSlide>
                     <SwiperSlide>
                        <BlogItem/>
                     </SwiperSlide>
                </Swiper>
           </div>
       </section>

    </>
    )
    
}*/}