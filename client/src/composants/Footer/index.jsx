import React, { useState, useContext } from "react";
import { LiaShippingFastSolid } from "react-icons/lia";
import { PiKeyReturn } from "react-icons/pi";
import { BsWallet2 } from "react-icons/bs";
import { BiSupport } from "react-icons/bi";
import { Link } from "react-router-dom";
import { IoChatbubblesOutline } from "react-icons/io5";
import Button from "@mui/material/Button";
import { FaFacebookF, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import orange from "../../assets/orange-money.png";
import moov from "../../assets/moov.jpg";
import visa from "../../assets/visa.png";
import Drawer from "@mui/material/Drawer";
import { useContext as useCtx } from "react";
import { MyContext } from "../../router";
import { IoCloseSharp } from "react-icons/io5";
import CartPanel from "../cartPanel";
import { postData } from "../../utils/api";
import CircularProgress from "@mui/material/CircularProgress";
import { translations } from "../../utils/i18n";

export default function Footer() {
  const context = useCtx(MyContext);
  const t = translations[context.lang] || translations.fr;
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = async (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      context.alertBox("error", "Veuillez entrer une adresse email valide");
      return;
    }
    const res =await postData("/api/newsletter/inscription", { email:email });
    if (res?.success) {
      
         setSubscribed(true);
       context.alertBox("success",res?.message)
       setEmail("");
      } else{ 
         context.alertBox("error",res?.message)
      }
  };

  const features = [
    { icon: LiaShippingFastSolid, title: "Livraison Gratuite", desc: "> 20k Fcfa" },
    { icon: PiKeyReturn, title: "Retour 30 Jours", desc: "Remboursement" },
    { icon: BsWallet2, title: "Paiement Sécurisé", desc: "100% sécurisé" },
    { icon: BiSupport, title: "Support 24/7", desc: "Disponible" },
  ];

  return (
    <>
      <footer className="bg-gray-900 text-white !pt-12 !pb-6">
        <div className="w-[95%] !mx-auto">

          {/* Features */}
          <div className="grid grid-cols-4 gap-6 !pb-10 border-b border-gray-700">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-4 group">
                <Icon className="text-[40px] text-primary transition-all group-hover:-translate-y-1" />
                <div>
                  <h3 className="text-[15px] font-[600]">{title}</h3>
                  <p className="text-[12px] text-gray-400 !mb-0">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Main footer */}
          <div className="grid grid-cols-4 gap-8 !py-10">

            {/* Brand */}
            <div>
              <h2 className="text-[24px] font-[800] text-primary !mb-3">Suguba</h2>
              <p className="text-[13px] text-gray-400 !mb-4">
                Le grand marché numérique de Bamako. Achetez et vendez en toute confiance.
              </p>
              <div className="flex items-center gap-2 !mb-3">
                <IoChatbubblesOutline className="text-[22px] text-primary" />
                <div>
                  <p className="text-[12px] text-gray-400 !mb-0">Discussion en ligne</p>
                  <p className="text-[13px] font-[500] !mb-0">suguba@bamako.com</p>
                </div>
              </div>
              <p className="text-primary font-[600] text-[16px]">(+223) 94-51-87-03</p>
            </div>

            {/* Liens rapides */}
            <div>
              <h3 className="text-[15px] font-[700] !mb-4 text-white">Liens rapides</h3>
              <ul className="flex flex-col gap-2">
                {[
                  { to: "/", label: "Accueil" },
                  { to: "/listeProduits", label: "Produits" },
                  { to: "/devenir-vendeur", label: "Vendre sur Suguba" },
                  { to: "/mes-commandes", label: "Mes commandes" },
                  { to: "/mon-compte", label: "Mon compte" },
                ].map(({ to, label }) => (
                  <li key={label}>
                    <Link to={to} className="text-[13px] text-gray-400 hover:text-primary transition-all">
                      → {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Informations */}
            <div>
              <h3 className="text-[15px] font-[700] !mb-4 text-white">Informations</h3>
              <ul className="flex flex-col gap-2">
                {[
                  "Livraison",
                  "Mentions légales",
                  "Politique de confidentialité",
                  "À propos de nous",
                  "Sécurité des paiements",
                ].map((item) => (
                  <li key={item}>
                    <Link to="/" className="text-[13px] text-gray-400 hover:text-primary transition-all">
                      → {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-[15px] font-[700] !mb-4 text-white">{t.newsletter}</h3>
              <h2 className="text-[12px] font-[700] !mb-2 text-white">Restez informé(e)</h2>
              <p className="text-[13px] text-gray-400 !mb-4">
                Inscrivez-vous et recevez nos meilleures offres et nouveautés en avant-première
                
              </p>
              {subscribed ? (
                <div className="bg-green-900 rounded-lg !p-3 text-[13px] text-green-300">
                  ✅ Vous êtes inscrit(e) ! Merci.
                </div>
              ) : (
                <form onSubmit={handleNewsletter} className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 bg-gray-800 rounded-lg !px-3 !py-2">
                    <MdOutlineEmail className="text-gray-400 text-[18px]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t.newsletterPlaceholder}
                      className="bg-transparent flex-1 outline-none text-[13px] text-white placeholder-gray-500"
                    />
                  </div>
                  <Button type="submit" className="btn-org !w-full !capitalize"
                    disabled={isLoading}>
                    {isLoading ? <CircularProgress size={18} color="inherit" /> : t.newsletterBtn}
                  </Button>
                </form>
              )}

              {/* Réseaux sociaux */}
              <div className="flex items-center gap-3 !mt-5">
                {[
                  { Icon: FaFacebookF, color: "hover:bg-blue-600" },
                  { Icon: FaInstagram, color: "hover:bg-pink-500" },
                  { Icon: FaYoutube, color: "hover:bg-red-600" },
                  { Icon: FaTiktok, color: "hover:bg-black" },
                ].map(({ Icon, color }, i) => (
                  <Link key={i} to="/" target="_blank"
                    className={`w-[36px] h-[36px] rounded-full bg-gray-700 flex items-center justify-center ${color} transition-all`}>
                    <Icon className="text-[15px] text-white" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-gray-700 !pt-6 flex items-center justify-between">
            <p className="text-[13px] text-gray-400">
              © 2026 Suguba — Projet de Fin d'Études — Bamako, Mali
            </p>
            <div className="flex items-center gap-3">
              <img src={orange} className="w-[38px] rounded-md" alt="Orange Money" />
              <img src={moov} className="w-[38px] rounded-md" alt="Moov Money" />
              <img src={visa} className="w-[38px] rounded-md" alt="Visa" />
            </div>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <Drawer open={context.openCartPanel} onClose={() => context.toggleCartPanel(false)}
        anchor="right" className="cartPanel">
        <div className="flex items-center justify-between !py-3 !px-4 gap-3 border-b border-gray-100">
          <h4 className="font-[600]">Votre panier ({context.cartItems?.length || 0})</h4>
          <IoCloseSharp className="text-[22px] cursor-pointer link" onClick={() => context.toggleCartPanel(false)} />
        </div>
        <CartPanel />
      </Drawer>
    </>
  );
}





{/*import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaStore, FaShippingFast } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { IoBagCheckOutline } from "react-icons/io5";
import Drawer from "@mui/material/Drawer";
import { useContext, useState } from "react";
import { MyContext } from "../../router";
import { IoCloseSharp } from "react-icons/io5";
import CartPanel from "../cartPanel";
import { postData } from "../../utils/api";
import toast from "react-hot-toast";
import orange from "../../assets/orange-money.png";
import moov from "../../assets/moov.jpg";
import visa from "../../assets/visa.png";

export default function Footer() {
  const context = useContext(MyContext);
  const [newsEmail, setNewsEmail] = useState("");

  const handleNewsletter = async (e) => {
    e.preventDefault();
    if (!newsEmail) return;
    const res = await postData("/api/newsletter/inscription", { email: newsEmail });
    if (res?.success) { toast.success(res.message); setNewsEmail(""); }
    else toast.error(res?.message || "Erreur");
  };

  const cartCount = context.cartItems?.length || 0;

  return (
    <>
      <footer className="bg-gray-900 text-gray-300 !pt-12 !pb-6">
        <div className="w-[95%] !mx-auto">
          <div className="grid grid-cols-4 gap-8 !pb-8 border-b border-gray-700">

            <div>
              <h1 className="text-[28px] font-[800] text-white uppercase !mb-3">Suguba</h1>
              <p className="text-[13px] leading-6 !mb-4">
                La marketplace malienne de référence. Achetez et vendez facilement en toute confiance.
              </p>
              <div className="flex gap-3">
                {[FaFacebookF, FaInstagram, FaTwitter, FaYoutube].map((Icon, i) => (
                  <Link key={i} to="/" className="w-[35px] h-[35px] rounded-full bg-gray-700 flex items-center justify-center hover:bg-primary transition-all">
                    <Icon className="text-[14px] text-white" />
                  </Link>
                ))}
              </div>
            </div>

            
            <div>
              <h3 className="text-white font-[700] !mb-4">Navigation</h3>
              <ul className="flex flex-col gap-2">
                {[
                  { label: "Accueil", to: "/" },
                  { label: "Tous les produits", to: "/listeProduits" },
                  { label: "Mes commandes", to: "/mes-commandes" },
                  { label: "Mes favoris", to: "/mes-favoris" },
                  { label: "Devenir vendeur", to: "/devenir-vendeur" },
                  { label: "Mon compte", to: "/mon-compte" },
                ].map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} className="text-[13px] hover:text-primary transition-all">
                      → {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            
            <div>
              <h3 className="text-white font-[700] !mb-4">Service Client</h3>
              <ul className="flex flex-col gap-2">
                {[
                  "Centre d'aide",
                  "Politique de retour",
                  "Livraison",
                  "Paiement sécurisé",
                  "À propos de nous",
                  "Mentions légales",
                ].map(label => (
                  <li key={label}>
                    <Link to="/" className="text-[13px] hover:text-primary transition-all">
                      → {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            
            <div>
              <h3 className="text-white font-[700] !mb-4">Contact</h3>
              <div className="flex flex-col gap-3 !mb-5">
                <span className="flex items-center gap-2 text-[13px]">
                  <MdLocationOn className="text-primary" /> Grand Marché, Bamako, Mali
                </span>
                <span className="flex items-center gap-2 text-[13px]">
                  <MdPhone className="text-primary" /> (+223) 94-51-87-03
                </span>
                <span className="flex items-center gap-2 text-[13px]">
                  <MdEmail className="text-primary" /> suguba@bamako.com
                </span>
              </div>
              <h4 className="text-white font-[600] !mb-2 text-[14px]">Newsletter</h4>
              <form onSubmit={handleNewsletter} className="flex gap-2">
                <input
                  type="email"
                  value={newsEmail}
                  onChange={e => setNewsEmail(e.target.value)}
                  placeholder="Votre email..."
                  className="flex-1 h-[38px] rounded-md !px-3 bg-gray-700 text-white text-[12px] border border-gray-600 focus:outline-none focus:border-primary"
                />
                <button type="submit"
                  className="h-[38px] !px-3 bg-primary text-white rounded-md text-[12px] font-[600] hover:bg-pink-600 transition-all">
                  OK
                </button>
              </form>
            </div>
          </div>

          <div className="flex items-center justify-between !pt-5">
            <p className="text-[12px] !mb-0">© 2026 Suguba — Projet de Fin d'Étude</p>
            <div className="flex items-center gap-3">
              <img src={orange} className="w-[35px] h-[25px] object-contain rounded" />
              <img src={moov} className="w-[35px] h-[25px] object-contain rounded" />
              <img src={visa} className="w-[35px] h-[25px] object-contain rounded" />
            </div>
          </div>
        </div>
      </footer>

      
      <Drawer open={context.openCartPanel} onClose={() => context.toggleCartPanel(false)} anchor="right">
        <div className="flex items-center justify-between !py-3 !px-4 border-b border-gray-100">
          <h4 className="font-[600]">Mon panier ({cartCount})</h4>
          <IoCloseSharp className="text-[22px] cursor-pointer hover:text-primary" onClick={() => context.toggleCartPanel(false)} />
        </div>
        <CartPanel />
      </Drawer>
    </>
  );
}




{/*import React from "react"
import {LiaShippingFastSolid } from "react-icons/lia";
import { PiKeyReturn } from "react-icons/pi";
import { BsWallet2 } from "react-icons/bs";
import { FiGift } from "react-icons/fi";
import { BiSupport } from "react-icons/bi";
import { Link } from "react-router-dom";
import { IoChatbubblesOutline } from "react-icons/io5";
import Button from "@mui/material/Button";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { FaFacebookF } from "react-icons/fa";
import { CiYoutube } from "react-icons/ci";
import { FaPinterestP } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import orange from "../../assets/orange-money.png"
import moov from "../../assets/moov.jpg"
import visa from "../../assets/visa.png"
import Drawer from '@mui/material/Drawer';
import { useContext } from "react";
import { MyContext } from "../../router";
import { IoCloseSharp } from "react-icons/io5";
import CartPanel from "../cartPanel";
export default function Footer(){
   const context =useContext(MyContext);
     return(
       <>
            <footer className= "!py-8 bg-[#fafafa]">
               <div className="w-[95%] !mx-auto">
                 <div className="flex items-center justify-center gap-8">
                     <div className="col flex items-center justify-center flex-col group w-[15%]">
                      <LiaShippingFastSolid className="text-[40px] transition-al1 duration-300
                              group-hover:text-pink-300 group-hover:-translate-y-1"/>
                     <h3 className="text-[16px] font-[600] mt-3"> Livraison Gratuite</h3>
                     <p className="text-[12px] font-[500]">les commandes {">"}à 25k Fcfa</p>
                    </div>
                     <div className="col flex items-center justify-center flex-col group w-[15%]">
                      <PiKeyReturn  className="text-[40px] transition-al1 duration-300
                              group-hover:text-pink-300 group-hover:-translate-y-1"/>
                     <h3 className="text-[16px] font-[600] mt-3">Retour -30 Jours</h3>
                     <p className="text-[12px] font-[500]">changement-de-produit </p>
                    </div>
                     <div className="col flex items-center justify-center flex-col group w-[15%]">
                      <BsWallet2 className="text-[40px] transition-al1 duration-300
                              group-hover:text-pink-300 group-hover:-translate-y-1"/>
                     <h3 className="text-[16px] font-[600] mt-3"> Paiement Securisée</h3>
                     <p className="text-[12px] font-[500]">Confince numerique</p>
                    </div>
                     <div className="col flex items-center justify-center flex-col group w-[15%]">
                      <FiGift className="text-[40px] transition-al1 duration-300
                              group-hover:text-pink-300 group-hover:-translate-y-1"/>
                     <h3 className="text-[16px] font-[600] mt-3"> Cadeaux Speciales</h3>
                     <p className="text-[12px] font-[500]">À votre 1ere commande</p>
                    </div>
                    <div className="col flex items-center justify-center flex-col group w-[15%]">
                      <BiSupport  className="text-[40px] transition-al1 duration-300
                              group-hover:text-pink-300 group-hover:-translate-y-1"/>
                     <h3 className="text-[16px] font-[600] mt-3"> Support 24/7</h3>
                     <p className="text-[12px] font-[500]">Disponible pour vous</p>
                    </div>
                </div>
                <br/>
                <hr />
                <br/>
                <div className="footer flex items-center py-8">
                    <div className="part1 w-[25%] border-r border-black">
                        <h2 className="text-[18px] font-[600] !mb-4">Contactez-nous</h2>
                        <p className="text-[13px] font-[400] !pb-4">Suguba-Grand marché de bamako<br/>
                           Bamako-Mali
                        </p>
                        <Link className="link text-[13px]" to="mailto:diakiteadjasitan@gmail.com">suguba@bamako.com</Link>
                        <span className="text-[18px] !font-[600] block w-full !mt-3 !mb-5 !text-pink-500
                        "> (+223) 94-51-87-03</span>
                        <div className=" flex items-center gap-2">
                           <IoChatbubblesOutline className="text-[40px] !text-pink-500"/>
                           <span className="text-[17px] font-[600]  "> Discussion en ligne<br/>
                           Recevez l'aide des experts</span>
                        </div>
                    </div>
                    <div className="part2 w-[40%] flex !pl-8">
                        <div className="part2-col1  w-[50%]">
                           <h2 className="text-[18px] font-[600] !mb-4"> Les Produits</h2>
                           <ul className="list">
                                <li className="list-none text-[14px] w-full !mb-2 ">
                                   <Link to="/" className="link">Les moins chers</Link>
                                </li>
                                <li className="list-none text-[14px] w-full !mb-2 ">
                                   <Link to="/" className="link">Les nouveaux produits</Link>
                                </li>
                                <li className="list-none text-[14px] w-full !mb-2">
                                   <Link to="/" className="link">Les plus vendus</Link>
                                </li>
                                  <li className="list-none text-[14px] w-full !mb-2">
                                   <Link to="/" className="link">Contactez-nous</Link>
                                </li>
                                 <li className="list-none text-[14px] w-full !mb-2">
                                   <Link to="/" className="link">Notre Sitemap</Link>
                                </li>
                                 <li className="list-none text-[14px] w-full !mb-2">
                                   <Link to="/" className="link">Nos boutiques</Link>
                                </li>
                           </ul>
                         </div>
                          <div className="part2-col2  w-[50%]">
                           <h2 className="text-[18px] font-[600] !mb-4">Notre Entreprise</h2>
                           <ul className="list">
                                <li className="list-none text-[14px] w-full !mb-2 ">
                                   <Link to="/" className="link">Livraison</Link>
                                </li>
                                <li className="list-none text-[14px] w-full !mb-2 ">
                                   <Link to="/" className="link">Mentions Legales</Link>
                                </li>
                                <li className="list-none text-[14px] w-full !mb-2">
                                   <Link to="/" className="link">Termes et conditions d'utilisation</Link>
                                </li>
                                  <li className="list-none text-[14px] w-full !mb-2">
                                   <Link to="/" className="link">À propos de nous</Link>
                                </li>
                                 <li className="list-none text-[14px] w-full !mb-2">
                                   <Link to="/" className="link">Securité des paiements</Link>
                                </li>
                                 <li className="list-none text-[14px] w-full !mb-2">
                                   <Link to="/" className="link">Connexion</Link>
                                </li>
                           </ul>
                         </div>
                    </div>
                    <div className="part3 w-[35%] flex-col pl-8 pr-8">
                        <h2 className="text-[18px] font-[600] !mb-4">S'inscrire au newsletter</h2>
                        <p className="text-[13px] ">Incrivez-vous à notre newsletter pour recevoir des nouvelles sur nos offres speciales</p>
                        <form className="!mt-5">
                           <input type="text" className="w-full h-[45px] border outline-none !pl-4 !pr-4 rounded-sm !mb-4 focus:border-[rgba(0,0,0,0.3)]"
                           placeholder="Entrez votre addresse mail"/>
                           <Button className="btn-org" >S'inscrire</Button>
                           <FormControlLabel control={<Checkbox />} label="J'accepte les termes,conditions et politiques privées" />
                        </form>
                    </div>
                </div>
               </div>
           </footer>
           <div className=" bg-white">
           <div className="bottomStrip w-[95%] !mx-auto flex borter-t border-[rgba(0,0,0,0.9)] py-3 " >
              <div className=" w-full flex items-center justify-between">
                  <ul className="flex items-center justify-between gap-2">
                  <li className="list-none">
                     <Link to="/" target="_blank" className="w-[35px] h-[35px] rounded-full border
                     border-[rgba(0,0,0,0.1)] flex items-center justify-center group hover:bg-pink-300
                     transition-all">
                        <FaFacebookF className="text-[15px]" />
                     </Link>
                  </li>
                  <li className="list-none">
                     <Link to="/" target="_blank" className="w-[35px] h-[35px] rounded-full border
                     border-[rgba(0,0,0,0.1)] flex items-center justify-center group hover:bg-pink-300
                     transition-all">
                        <CiYoutube  className="text-[15px]" />
                     </Link>
                  </li>
                  <li className="list-none">
                     <Link to="/" target="_blank" className="w-[35px] h-[35px] rounded-full border
                     border-[rgba(0,0,0,0.1)] flex items-center justify-center group hover:bg-pink-300
                     transition-all">
                        <FaPinterestP className="text-[15px]" />
                     </Link>
                  </li>
                  <li className="list-none">
                     <Link to="/" target="_blank" className="w-[35px] h-[35px] rounded-full border
                     border-[rgba(0,0,0,0.1)] flex items-center justify-center group hover:bg-pink-300
                     transition-all">
                        <FaInstagram className="text-[15px]" />
                     </Link>
                  </li>
                  </ul>
                  <p className="text-[13px] text-center mb-0">
                   Suguba - Projet de Fin D'étude 2026
                  </p>
                  <div className="flex items-center gap-5">
                     <img src={orange} className="w-[45px]"/>
                      <img src={moov} className="w-[45px]"/>
                      <img src={visa}  className="w-[45px]"/>
                  </div>
              </div>
           </div>
           </div>
            <Drawer open={context.openCartPanel} onClose={()=>context.toggleCartPanel(false)} 
                      anchor={'right'}
                       className='cartPanel'>
                    <div className='flex items-center justify-between !py-2 !px-4 gap-3 !border-b 
                    border-[rgba(0,0,0,0.1)] overflow-hidden'>
                     <h4>Votre panier (4)</h4>
                     <IoCloseSharp className='text-[20px] cursor-pointer link' onClick={()=>context.toggleCartPanel(false)}/>
                    </div>
                    <CartPanel/>
                 </Drawer>
          </>

     )
 
}*/}