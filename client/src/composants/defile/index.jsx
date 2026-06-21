import { useState, useEffect, useContext } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import { Link, useNavigate } from "react-router-dom";
import { fetchDataFromApi } from "../../utils/api";
import { MyContext } from "../../router";
import { translations } from "../../utils/i18n";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CircularProgress from "@mui/material/CircularProgress";
import { IoMdClose } from "react-icons/io";
import { FaShoppingCart } from "react-icons/fa";
import { MdAdd, MdRemove } from "react-icons/md";

export default function DefileImg() {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const t = translations[context?.lang] || translations.fr;

  const [sliders, setSliders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dialog ajouter au panier
  const [cartDialog, setCartDialog] = useState({ open: false, slide: null });
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchDataFromApi("/api/homeslider").then((res) => {
      setSliders(res?.sliders || res?.data?.filter(s => s.placement === "slider") || []);
      setIsLoading(false);
    });
  }, []);

  const openCartDialog = (e, slide) => {
    e.preventDefault();
    e.stopPropagation();
    if (!context?.isLogin) {
      context.alertBox("error", "Veuillez vous connecter pour ajouter au panier");
      return;
    }
    setSelectedSize("");
    setQuantity(1);
    setCartDialog({ slide:slide, open: true});
  };

  const closeCartDialog = () => {
    setCartDialog({ open: false, slide: null });
    setSelectedSize("");
    setQuantity(1);
  };

  const handleAddToCart = async () => {
    const { slide } = cartDialog;
    if (!slide?.productId) return;
    const productId = slide.productId._id || slide.productId;
    const sizes = slide.productId?.size || [];

    if (sizes.length > 0 && !selectedSize) {
      context.alertBox("error", "Veuillez choisir une taille");
      return;
    }
    setAddingToCart(true);
    context.addToCart(productId, quantity, selectedSize);
    setTimeout(() => {
      setAddingToCart(false);
      closeCartDialog();
    }, 800);
  };

  if (isLoading) {
    return (
      <div className="w-full h-[420px] bg-gray-100 flex items-center justify-center rounded-2xl !mx-auto" style={{ width: "95%", margin: "16px auto" }}>
        <CircularProgress />
      </div>
    );
  }

  if (sliders.length === 0) {
    return (
      <div className="ImgDefile !py-4">
        <div className="w-[95%] !mx-auto">
          <div className="w-full h-[380px] bg-gradient-to-r from-pink-500 to-pink-700 rounded-2xl flex items-center justify-center">
            <div className="text-white text-center">
              <h2 className="text-[28px] font-[700] !mb-2">Bienvenue sur Suguba</h2>
              <p className="text-[16px] opacity-80">Le grand marché numérique de Bamako</p>
              <Link to="/listeProduits">
                <button className="!mt-5 bg-white text-primary font-[600] !px-6 !py-2 rounded-full text-[14px] hover:bg-gray-100 transition-all">
                  Découvrir les produits →
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentSlide = cartDialog.slide;
  const productSizes = currentSlide?.productId?.size || [];

  return (
    <>
      <div className="ImgDefile !py-4">
        <div className="w-[95%] !mx-auto">
          <Swiper
            spaceBetween={0}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            navigation={false}
            pagination={{ clickable: true }}
            loop={sliders.length > 1}
            modules={[Navigation, Autoplay, Pagination]}
            className="DefileImg !rounded-2xl overflow-hidden">

            {sliders.map((slide) => (
              <SwiperSlide key={slide._id}>
                <Link to={slide.link || "/"} className="block w-full">
                  {/* Conteneur image avec hauteur fixe — pas de zoom */}
                  
                  <div className="w-full relative overflow-hidden flex items-center justify-center" style={{ height: "300px" }}>
                     <img
                    src={slide.image}
                    alt={slide.title || "slide"}
                    className="max-h-full max-w-full object-contain"
                  />
                    {/* Overlay gradient léger uniquement sur la gauche pour le texte */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/15 to-transparent pointer-events-none" />
                  </div>

                  {/* Contenu superposé */}
                  <div className="absolute left-0 top-0 h-full flex flex-col justify-center !px-12 !py-8 z-10 max-w-[50%]">
                    {slide.title && (
                      <h2 className="text-white text-[30px] font-[800] leading-tight !mb-2 drop-shadow-lg">
                        {slide.title}
                      </h2>
                    )}
                    {slide.subtitle && (
                      <p className="text-white text-[15px] font-[400] opacity-90 !mb-4 drop-shadow">
                        {slide.subtitle}
                      </p>
                    )}

                    {/* Produit mis en avant → bouton Ajouter au panier */}
                    {slide.isFeaturedProduct && slide.productId && (
                      <div className="flex items-center gap-3">
                        <Button
                          onClick={(e) => openCartDialog(e, slide)}
                          className="!bg-white !text-primary !font-[700] !capitalize !rounded-full !px-6 !py-2 !text-[14px] hover:!bg-gray-50 !shadow-lg flex gap-2">
                          <FaShoppingCart className="text-[16px]" />
                          {t.addToCart}
                        </Button>
                      </div>
                    )}

                    {/* Slide normal → bouton Découvrir */}
                    {!slide.isFeaturedProduct && slide.link && slide.link !== "/" && (
                      <button
                        onClick={(e) => { e.preventDefault(); navigate(slide.link); }}
                        className="bg-white text-primary font-[700] !px-6 !py-2 rounded-full text-[14px] hover:bg-gray-100 transition-all shadow-lg w-fit">
                        Découvrir →
                      </button>
                    )}
                  </div>

                  {/* Badge Produit vedette */}
                  {slide.isFeaturedProduct && (
                    <div className="absolute top-4 right-4 z-10 pointer-events-none">
                      <span className="bg-yellow-400 text-yellow-900 text-[11px] font-[700] !px-3 !py-1 rounded-full shadow-md">
                        ⭐ Produit vedette
                      </span>
                    </div>
                  )}
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* ── Dialog : Choisir taille & quantité ──────────────────────────── */}
      <Dialog
        open={cartDialog.open}
        onClose={closeCartDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{ style: { borderRadius: 20 } }}>
        <DialogTitle className="flex items-center justify-between !pb-2">
          <span className="font-[700] text-[16px]">Ajouter au panier</span>
          <Button className="!min-w-[32px] !w-[32px] !h-[32px] !rounded-full !bg-gray-100" onClick={closeCartDialog}>
            <IoMdClose />
          </Button>
        </DialogTitle>

        <DialogContent>
          {currentSlide?.productId && (
            <div className="flex flex-col gap-4">
              {/* Aperçu produit */}
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl !p-3">
                <img
                  src={currentSlide.productId?.images?.[0] || currentSlide.image}
                  className="w-[60px] h-[60px] object-cover rounded-xl flex-shrink-0"
                  alt="product"
                />
                <div>
                  <p className="font-[600] text-[14px] line-clamp-2">{currentSlide.title || currentSlide.productId?.name}</p>
                  <p className="text-primary font-[700] text-[15px]">
                    {currentSlide.productPrice?.toLocaleString() || currentSlide.productId?.price?.toLocaleString()} Fcfa
                  </p>
                </div>
              </div>

              {/* Choix de taille si disponibles */}
              {productSizes.length > 0 && (
                <div>
                  <p className="text-[13px] font-[600] !mb-2 text-gray-700">{t.chooseTaille}</p>
                  <div className="flex flex-wrap gap-2">
                    {productSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`!px-4 !py-2 rounded-xl border-2 text-[13px] font-[600] transition-all
                          ${selectedSize === size
                            ? "border-primary bg-primary text-white"
                            : "border-gray-200 text-gray-700 hover:border-primary"}`}>
                        {size}
                      </button>
                    ))}
                  </div>
                  {productSizes.length > 0 && !selectedSize && (
                    <p className="text-[11px] text-red-400 !mt-1">* Veuillez choisir une taille</p>
                  )}
                </div>
              )}

              {/* Quantité */}
              <div>
                <p className="text-[13px] font-[600] !mb-2 text-gray-700">{t.chooseQty}</p>
                <div className="flex items-center gap-3">
                  <Button
                    className="!min-w-[36px] !w-[36px] !h-[36px] !rounded-full !bg-gray-100 hover:!bg-gray-200"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                    <MdRemove />
                  </Button>
                  <span className="text-[18px] font-[700] min-w-[24px] text-center">{quantity}</span>
                  <Button
                    className="!min-w-[36px] !w-[36px] !h-[36px] !rounded-full !bg-gray-100 hover:!bg-gray-200"
                    onClick={() => setQuantity(q => q + 1)}>
                    <MdAdd />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>

        <DialogActions className="!px-5 !pb-5">
          <Button
            onClick={handleAddToCart}
            disabled={addingToCart}
            fullWidth
            className="!bg-primary !text-white !capitalize !font-[700] !rounded-xl !py-3 !text-[14px] flex gap-2">
            {addingToCart ? <CircularProgress size={18} color="inherit" /> : (
              <><FaShoppingCart /> {t.addToCart} — {(quantity * (currentSlide?.productPrice || currentSlide?.productId?.price || 0)).toLocaleString()} Fcfa</>
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}









{/*import { useState, useEffect, useContext } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import { Link, useNavigate } from "react-router-dom";
import { fetchDataFromApi } from "../../utils/api";
import { MyContext } from "../../router";
import { translations, formatPrice } from "../../utils/i18n";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

export default function DefileImg() {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const t = translations[context?.lang] || translations.fr;
  const [sliders, setSliders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDataFromApi("/api/homeslider").then((res) => {
      setSliders(res?.data || []);
      setIsLoading(false);
    });
  }, []);

  const handleAddToCart = (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    context.addToCart(productId, 1);
  };

  const handleBuyNow = (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    context.addToCart(productId, 1);
    navigate("/panier");
  };

  if (isLoading) {
    return (
      <div className="w-full h-[420px] bg-gray-100 flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  // Si pas de slides en base, afficher des slides de fallback
  if (sliders.length === 0) {
    return (
      <div className="ImgDefile !py-4">
        <div className="w-[95%] !mx-auto">
          <div className="w-full h-[380px] bg-gradient-to-r from-pink-500 to-pink-700 rounded-2xl flex items-center justify-center">
            <div className="text-white text-center">
              <h2 className="text-[28px] font-[700] !mb-2">Bienvenue sur Suguba</h2>
              <p className="text-[16px] opacity-80">Le grand marché numérique de Bamako</p>
              <Link to="/listeProduits">
                <button className="!mt-5 bg-white text-primary font-[600] !px-6 !py-2 rounded-full text-[14px] hover:bg-gray-100 transition-all">
                  Découvrir les produits →
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ImgDefile !py-4">
      <div className="w-[95%] !mx-auto">
        <Swiper
          spaceBetween={0}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          navigation={true}
          pagination={{ clickable: true }}
          loop={sliders.length > 1}
          modules={[Navigation, Autoplay, Pagination]}
          className="DefileImg !rounded-2xl overflow-hidden">

          {sliders.map((slide) => (
            <SwiperSlide key={slide._id}>
              <Link to={slide.link || "/"} className="block w-full relative group">
                
                <div className="w-full h-[380px] relative overflow-hidden">
                  <img
                    src={slide.image}
                    alt={slide.title || "slide"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                  />
                 
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
                </div>

               
                <div className="absolute left-0 top-0 h-full flex flex-col justify-center !px-12 !py-8 z-10 max-w-[55%]">
                  {slide.title && (
                    <h2 className="text-white text-[32px] font-[800] leading-tight !mb-2 drop-shadow-lg">
                      {slide.title}
                    </h2>
                  )}
                  {slide.subtitle && (
                    <p className="text-white text-[18px] font-[500] opacity-90 !mb-5 drop-shadow">
                      {slide.subtitle}
                    </p>
                  )}

                  
                  {slide.isFeaturedProduct && slide.productId && (
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={(e) => handleAddToCart(e, slide.productId._id || slide.productId)}
                        className="!bg-white !text-primary !font-[700] !capitalize !rounded-full !px-5 !py-2 !text-[13px] hover:!bg-gray-100 !shadow-lg">
                        {t.addToCart}
                      </Button>
                      <Button
                        onClick={(e) => handleBuyNow(e, slide.productId._id || slide.productId)}
                        className="!bg-primary !text-white !font-[700] !capitalize !rounded-full !px-5 !py-2 !text-[13px] hover:!bg-pink-600 !shadow-lg">
                        {t.buyNow}
                      </Button>
                    </div>
                  )}

                  
                  {!slide.isFeaturedProduct && slide.link && slide.link !== "/" && (
                    <div>
                      <button className="bg-white text-primary font-[700] !px-6 !py-2 rounded-full text-[14px] hover:bg-gray-100 transition-all shadow-lg">
                        Découvrir →
                      </button>
                    </div>
                  )}
                </div>

                
                {slide.isFeaturedProduct && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="bg-yellow-400 text-yellow-900 text-[11px] font-[700] !px-3 !py-1 rounded-full shadow-md">
                      ⭐ Produit vedette
                    </span>
                  </div>
                )}
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
/*}


{/*import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation,Autoplay } from 'swiper/modules';
export default function DefileImg(){
    return(
<>
    <div className="ImgDefile !py-5">
      <div className="w-[95%] !mx-auto">
         <Swiper 
         spaceBetween={10} 
         autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }} 
        navigation={true} 
        modules={[Navigation,Autoplay]} 
        className="DefileImg">
            <SwiperSlide className="!w-full !rounded-lg">
                <div className=" flex items-center justify-center !rounded-lg">
                    <img src={"https://robe-rose-poudre.com/cdn/shop/files/robe_rose_poudre.jpg?crop=center&v=1727874823&width=1920"}
                         className="!rounded-lg" />
                </div>
            </SwiperSlide>  
             <SwiperSlide className="!w-full !rounded-lg">
                <div className=" flex items-center justify-center !rounded-lg">
                    <img src={"https://robe-rose-poudre.com/cdn/shop/files/robe_rose_poudre.jpg?crop=center&v=1727874823&width=1920"}
                         className="!rounded-lg" />
                </div>
            </SwiperSlide>
              <SwiperSlide className="!w-full !rounded-lg">
                <div className=" flex items-center justify-center !rounded-lg">
                    <img src={"https://robe-rose-poudre.com/cdn/shop/files/robe_rose_poudre.jpg?crop=center&v=1727874823&width=1920"}
                         className="!rounded-lg" />
                </div>
            </SwiperSlide>
              <SwiperSlide className="!w-full !rounded-lg">
                <div className=" flex items-center justify-center !rounded-lg">
                    <img src={"https://robe-rose-poudre.com/cdn/shop/files/robe_rose_poudre.jpg?crop=center&v=1727874823&width=1920"}
                         className="!rounded-lg" />
                </div>
            </SwiperSlide>
        </Swiper>
     </div>
    </div>
    </>
    )
}*/}