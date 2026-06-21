import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Link, useParams } from "react-router-dom";
import ProductZoom from "../../productZoom/index";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import ProduitDefile from "../ProduitDefile";
import ProductDetailsComponent from "../ProductDetailsComponent";
import { fetchDataFromApi } from "../../../utils/api";
import CircularProgress from "@mui/material/CircularProgress";

export default function ProductDetails() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    window.scrollTo(0, 0);
    fetchDataFromApi(`/api/product/produit/${id}`).then((res) => {
      setProduct(res?.produits);
      setIsLoading(false);
    });
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <CircularProgress />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <p className="text-gray-400 text-[16px]">Produit introuvable</p>
      </div>
    );
  }

  return (
    <>
      <div className="!py-5">
        <div className="w-[95%] !mx-auto !py-1">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/" className="link transition !text-[14px]">Acceuil</Link>
            <Link
              to={`/listeProduits?category=${product.catId}&name=${product.catName}`}
              className="link transition !text-[14px]"
            >
              {product.catName}
            </Link>
            <span className="!text-[14px] text-gray-500">{product.name}</span>
          </Breadcrumbs>
        </div>
      </div>

      <section className="bg-white !py-5">
        <div className="w-[95%] !mx-auto flex gap-8">
          <div className="productZoomContainer w-[40%]">
            <ProductZoom images={product.images} />
          </div>
          <div className="productContent w-[60%] !pr-10 !pl-10">
            <ProductDetailsComponent product={product} />
          </div>
        </div>

        {/* Tabs description / details / commentaires */}
        <div className="w-[95%] !mx-auto !pt-10">
          <div className="flex gap-8 items-center !mb-5">
            <span
              className={`text-[17px] link cursor-pointer font-[500] ${activeTab === 0 && "text-primary"}`}
              onClick={() => setActiveTab(0)}
            >
              Description
            </span>
            <span
              className={`text-[17px] link cursor-pointer font-[500] ${activeTab === 1 && "text-primary"}`}
              onClick={() => setActiveTab(1)}
            >
              Détails du Produit
            </span>
            <span
              className={`text-[17px] link cursor-pointer font-[500] ${activeTab === 2 && "text-primary"}`}
              onClick={() => setActiveTab(2)}
            >
              Commentaires
            </span>
          </div>

          {activeTab === 0 && (
            <div className="shadow-md w-full !px-8 !py-5 rounded-md">
              <p>{product.description}</p>
              <h4>Livraison gratuite & Retour</h4>
              <p>Nous offrons la livraison gratuite pour les commandes de plus de 50k Fcfa ainsi que pour l'ensemble des envois dans les districts de Bamako.</p>
              <h4>Remboursement garanti</h4>
              <p>Nous garantissons nos produits et vous pouvez obtenir le remboursement intégral de votre commande à tout moment pendant 30 jours.</p>
              <h4>Support Client 24h/24</h4>
              <p>Vous disposez d'un délai de 30 jours pour effectuer un échange.</p>
            </div>
          )}

          {activeTab === 1 && (
            <div className="shadow-md w-full px-8 py-5 rounded-md">
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-700">
                  <tbody>
                    <tr className="bg-white border-b border-gray-300">
                      <td className="!px-6 !py-4 font-[600]">Nom</td>
                      <td className="!px-6 !py-4">{product.name}</td>
                    </tr>
                    <tr className="bg-white border-b border-gray-300">
                      <td className="!px-6 !py-4 font-[600]">Marque</td>
                      <td className="!px-6 !py-4">{product.brand || "—"}</td>
                    </tr>
                    <tr className="bg-white border-b border-gray-300">
                      <td className="!px-6 !py-4 font-[600]">Catégorie</td>
                      <td className="!px-6 !py-4">{product.catName}</td>
                    </tr>
                    <tr className="bg-white border-b border-gray-300">
                      <td className="!px-6 !py-4 font-[600]">Sous-catégorie</td>
                      <td className="!px-6 !py-4">{product.subCat || "—"}</td>
                    </tr>
                    <tr className="bg-white border-b border-gray-300">
                      <td className="!px-6 !py-4 font-[600]">Stock</td>
                      <td className="!px-6 !py-4">{product.countInStock} unités</td>
                    </tr>
                    <tr className="bg-white border-b border-gray-300">
                      <td className="!px-6 !py-4 font-[600]">Tailles disponibles</td>
                      <td className="!px-6 !py-4">{product.size?.join(", ") || "—"}</td>
                    </tr>
                    <tr className="bg-white border-b border-gray-300">
                      <td className="!px-6 !py-4 font-[600]">Remise</td>
                      <td className="!px-6 !py-4">{product.discount}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 2 && (
            <div className="shadow-md w-[80%] !px-8 !py-5 rounded-md">
              <ReviewsSection productId={id} />
            </div>
          )}
        </div>

        {/* Produits liés */}
        <div className="w-[95%] !mx-auto !pt-8">
          <h2 className="text-[20px] font-[600]">Les Produits Liés</h2>
          <ProduitDefile items={6} categoryId={product.catId} />
        </div>
      </section>
    </>
  );
}

// ─── Section commentaires ────────────────────────────────────────────────────
import TextField from "@mui/material/TextField";
import { useContext } from "react";
import { MyContext } from "../../../router";
import { postData } from "../../../utils/api";

function ReviewsSection({ productId }) {
  const context = useContext(MyContext);
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(4);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchDataFromApi(`/api/reviews/${productId}`).then((res) => {
      setReviews(res?.reviews || []);
    });
  }, [productId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!context.isLogin) {
      context.alertBox("error", "Veuillez vous connecter pour commenter");
      return;
    }
    if (!comment.trim()) {
      context.alertBox("error", "Veuillez écrire un commentaire");
      return;
    }
    setIsSubmitting(true);
    postData("/api/reviews/creation-avis", {
      productId,
      comment,
      rating,
      userId: context.userData?._id,
      userName: context.userData?.name,
      userAvatar: context.userData?.avatar,
    }).then((res) => {
      if (res?.success) {
        context.alertBox("success", "Commentaire ajouté !");
        setComment("");
        setRating(4);
        // Recharger les avis
        fetchDataFromApi(`/api/reviews/${productId}`).then((r) => {
          setReviews(r?.reviews || []);
        });
      } else {
        context.alertBox("error", res?.message || "Erreur");
      }
      setIsSubmitting(false);
    });
  };

  return (
    <div className="w-full productReviewsContainer">
      <h2 className="text-[18px]">Avis des Clients sur ce produit</h2>

      {/* Liste des avis */}
      <div className="reviewScroll w-full max-h-[300px] overflow-y-scroll overflow-x-hidden !mt-5 !pr-5">
        {reviews.length === 0 ? (
          <p className="text-gray-400 text-[14px]">Aucun avis pour l'instant. Soyez le premier !</p>
        ) : (
          reviews.map((review) => (
            <div
              key={review._id}
              className="review !pb-5 !pt-5 border-b border-[rgba(0,0,0,0.1)] w-full flex items-center justify-between"
            >
              <div className="info w-[60%] flex items-center gap-3">
                <div className="img w-[80px] h-[80px] overflow-hidden rounded-full">
                  <img
                    src={review.userAvatar || "https://via.placeholder.com/80"}
                    className="w-full h-full object-cover"
                    alt={review.userName}
                  />
                </div>
                <div className="w-[80%]">
                  <h4 className="text-[16px]">{review.userName}</h4>
                  <h5 className="text-[13px] !mb-0">
                    {new Date(review.createdAt).toLocaleDateString("fr-FR")}
                  </h5>
                  <p className="!mt-0 !mb-0">{review.comment}</p>
                </div>
              </div>
              <Rating name="size-small" defaultValue={review.rating} size="small" readOnly />
            </div>
          ))
        )}
      </div>

      {/* Formulaire d'ajout */}
      <br />
      <div className="reviewForm bg-[#fafafa] !p-4 rounded-md">
        <h2 className="text-[18px]">Ajouter un commentaire</h2>
        <form className="w-full !mt-5" onSubmit={handleSubmit}>
          <TextField
            label="Votre avis..."
            className="w-full"
            multiline
            rows={5}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <br /><br />
          <Rating
            name="user-rating"
            value={rating}
            size="small"
            onChange={(e, val) => setRating(val)}
          />
          <div className="flex items-center !mt-5">
            <Button type="submit" className="btn-org" disabled={isSubmitting}>
              {isSubmitting ? <CircularProgress size={20} color="inherit" /> : "Commenter"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}



{/*import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link } from 'react-router-dom';
import ProductZoom from "../../productZoom/index"
import  Rating from "@mui/material/Rating";
import Button from '@mui/material/Button';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import ProduitDefile from '../ProduitDefile';
import ProductDetailsComponent from '../ProductDetailsComponent';
export default function ProductDetails(){

     const[activeTab,setActiveTab]=useState(0);
    return(
    <>
           <div className='!py-5'>
             <div className="w-[95%] !mx-auto !py-1">
                <Breadcrumbs aria-label="breadcrumb">
                   <Link 
                        underline="hover"
                         color="inherit" 
                         href="/" 
                        className='link transition !text-[14px]'>
                          Acceuil
                         </Link>
                         <Link
                          underline="hover"
                          color="inherit"
                          href="/"
                          className='link transition !text-[14px]'
                            >
                            Habits
                          </Link>
                          <Link
                          underline="hover"
                          color="inherit"
                          href="/"
                          className='link transition !text-[14px]'
                            >
                           Robe beige éblouissante
                          </Link>
                </Breadcrumbs>
             </div>
            </div>

            <section  className="bg-white !py-5">
            <div className="w-[95%] !mx-auto flex gap-8">
                <div className='productZoomContainer w-[40%]'>
                   <ProductZoom/>
                </div>
                <div className='productContent w-[60%] !pr-10 !pl-10'>
                  <ProductDetailsComponent/>
                </div>
            </div>
            <div className="w-[95%] !mx-auto !pt-10 ">
              <div className="flex gap-8 items-center !mb-5">
                 <span className={`text-[17px] link cursor-pointer font-[500]
                        ${activeTab===0 && "text-primary"}`}
                        onClick={()=>setActiveTab(0)}>
                  Description
                 </span>
                  <span className={`text-[17px] link cursor-pointer font-[500]
                        ${activeTab===1 && "text-primary"}`}
                         onClick={()=>setActiveTab(1)}>
                   Details du Produit
                 </span>
                  <span className={`text-[17px] link cursor-pointer font-[500]
                        ${activeTab===2 && "text-primary"}`}
                         onClick={()=>setActiveTab(2)}>
                  Commentaires (5)
                 </span>
              </div>
              {activeTab === 0 && (
                    <div className='shadow-md w-full !px-8 !py-5 rounded-md'>
                    <p>  Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                         Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,
                         but also the leap into electronic typesetting, remaining essentially unchanged.
                     </p>
                     <h4>LightWeight Desigh</h4>
                     <p>
                     Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                     Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                     </p>
                     <h4>Livraison gratuite & Retour</h4>
                      <p>
                        Nous offrons la livraison gratuite pour les commandes de plus de 50k Fcfa 
                        ainsi que pour l'ensemble des envois dans le districts de Bamako.
                      </p>
                      <h4> Remboursement guarantie</h4>
                      <p>Nous garantissons nos produits et vous pouvez obtenir le remboursement 
                        intégral de votre commande à tout moment pendant 30 jours.
                     </p>
                     <h4>Support Client 24h/24</h4>
                     <p>Vous disposez d'un delai de 30 jours pour effectuer un echange</p>
              </div>
              )}

              {
                 activeTab === 1 &&(
                  <div className='shadow-md w-full px-8 py-5 rounded-md'>
                     <div className='relative overflow-x-auto'>
                      <table class="w-full text-sm text-left rtl:text-right text-body">
                          <thead className='text-xs text-gray-700 uppercase
                          bg-gray-100 '>
                <tr>
                <th className="!px-6 !py-3 font-[600]">
                    Product name
                </th>
                 <th className="!px-6 !py-3 font-[600]">
                    Product name
                </th>
                 <th className="!px-6 !py-3 font-[600]">
                    Product name
                </th>
                 <th className="!px-6 !py-3 font-[600]">
                    Product name
                </th>
                 <th className="!px-6 !py-3 font-[600]">
                    Product name
                </th>
            </tr>
                          </thead>
                          <tbody className='text-gray-700'>
                              <tr className="bg-white border-b border-gray-300 ">
                                     <td className="!px-6 !py-4 font-[500]">Apple MacBook Pro 17"</td>
                                     <td className="!px-6 !py-4 font-[500]">Apple MacBook Pro 17"</td>
                                     <td className="!px-6 !py-4 font-[500]">Apple MacBook Pro 17"</td>
                                     <td className="!px-6 !py-4 font-[500]">Apple MacBook Pro 17"</td>
                                     <td className="!px-6 !py-4 font-[500]">Apple MacBook Pro 17"</td>
                             </tr>
                             <tr className="bg-white border-b border-gray-300 ">
                                     <td className="!px-6 !py-4 font-[500]">Apple MacBook Pro 17"</td>
                                     <td className="!px-6 !py-4 font-[500]">Apple MacBook Pro 17"</td>
                                     <td className="!px-6 !py-4 font-[500]">Apple MacBook Pro 17"</td>
                                     <td className="!px-6 !py-4 font-[500]">Apple MacBook Pro 17"</td>
                                     <td className="!px-6 !py-4 font-[500]">Apple MacBook Pro 17"</td>
                             </tr>
                             <tr className="bg-white border-b  border-gray-300">
                                     <td className="!px-6 !py-4 font-[500]">Apple MacBook Pro 17"</td>
                                     <td className="!px-6 !py-4 font-[500]">Apple MacBook Pro 17"</td>
                                     <td className="!px-6 !py-4 font-[500]">Apple MacBook Pro 17"</td>
                                     <td className="!px-6 !py-4 font-[500]">Apple MacBook Pro 17"</td>
                                     <td className="!px-6 !py-4 font-[500]">Apple MacBook Pro 17"</td>
                             </tr>
                             <tr className="bg-white border-b  border-gray-300">
                                     <td className="!px-6 !py-4 font-[500]">Apple MacBook Pro 17"</td>
                                     <td className="!px-6 !py-4 font-[500]">Apple MacBook Pro 17"</td>
                                     <td className="!px-6 !py-4 font-[500]">Apple MacBook Pro 17"</td>
                                     <td className="!px-6 !py-4 font-[500]">Apple MacBook Pro 17"</td>
                                     <td className="!px-6 !py-4 font-[500]">Apple MacBook Pro 17"</td>
                             </tr>
                             <tr className="bg-white border-b  border-gray-300">
                                     <td className="!px-6 !py-4 font-[500]">Apple MacBook Pro 17"</td>
                                     <td className="!px-6 !py-4 font-[500]">Apple MacBook Pro 17"</td>
                                     <td className="!px-6 !py-4 font-[500]">Apple MacBook Pro 17"</td>
                                     <td className="!px-6 !py-4 font-[500]">Apple MacBook Pro 17"</td>
                                     <td className="!px-6 !py-4 font-[500]">Apple MacBook Pro 17"</td>
                             </tr>
                             <tr className="bg-white border-b  border-gray-300">
                                     <td className="!px-6 !py-4 font-[500]">Apple MacBook Pro 17"</td>
                                     <td className="!px-6 !py-4 font-[500]">Apple MacBook Pro 17"</td>
                                     <td className="!px-6 !py-4 font-[500]">Apple MacBook Pro 17"</td>
                                     <td className="!px-6 !py-4 font-[500]">Apple MacBook Pro 17"</td>
                                     <td className="!px-6 !py-4 font-[500]">Apple MacBook Pro 17"</td>
                             </tr>
                         </tbody>
                    </table>
                    </div>
                  </div>
                 )}
                {
                 activeTab === 2 &&(
                   <div className='shadow-md w-[80%] !px-8 !py-5 rounded-md'>
                       <div className='w-full productReviewsContainer'>
                        <h2 className='text-[18px]'>Avis des Clients sur ce produit </h2>
                        <div className='reviewScroll w-full max-h-[300px] overflow-y-scroll 
                        overflow-x-hidden !mt-5 !pr-5'>
                           <div className='review !pb-5 !pt-5 border-b border-[rgba(0,0,0,0.1)] w-full flex items-center justify-between'>
                              <div className='info w-[60%] flex items-center gap-3 '>
                                    <div className='img w-[80px] h-[80px] overflow-hidden rounded-full'>
                                       <img src="https://img.kwcdn.com/product/open/4e378487ab7c44bf9f944a1e9534852f-goods.jpeg?imageView2/2/w/800/q/70/format/avif" className='w-full'/>
                                    </div>
                                    <div className='w-[80%]'>
                                     <h4 className='text-[16px]'>Adja Sitan Diakité</h4>
                                     <h5 className='text-[13px] !mb-0'> 30-03-2026</h5>
                                     <p   className='!mt-0 !mb-0'> Très beau produit, je suis très satisfaite</p>
                                    </div>

                              </div>
                              <Rating name="size-small" defaultValue={4} size="small" readOnly/>
                           </div>
                           <div className='review !pb-5 !pt-5 border-b border-[rgba(0,0,0,0.1)] w-full flex items-center justify-between'>
                              <div className='info w-[60%] flex items-center gap-3 '>
                                    <div className='img w-[80px] h-[80px] overflow-hidden rounded-full'>
                                       <img src="https://img.kwcdn.com/product/open/4e378487ab7c44bf9f944a1e9534852f-goods.jpeg?imageView2/2/w/800/q/70/format/avif" className='w-full'/>
                                    </div>
                                    <div className='w-[80%]'>
                                     <h4 className='text-[16px]'>Adja Sitan Diakité</h4>
                                     <h5 className='text-[13px] !mb-0'> 30-03-2026</h5>
                                     <p   className='!mt-0 !mb-0'> Très beau produit, je suis très satisfaite</p>
                                    </div>

                              </div>
                              <Rating name="size-small" defaultValue={4} size="small" readOnly/>
                           </div>
                           <div className='review !pb-5 !pt-5 border-b border-[rgba(0,0,0,0.1)] w-full flex items-center justify-between'>
                              <div className='info w-[60%] flex items-center gap-3 '>
                                    <div className='img w-[80px] h-[80px] overflow-hidden rounded-full'>
                                       <img src="https://img.kwcdn.com/product/open/4e378487ab7c44bf9f944a1e9534852f-goods.jpeg?imageView2/2/w/800/q/70/format/avif" className='w-full'/>
                                    </div>
                                    <div className='w-[80%]'>
                                     <h4 className='text-[16px]'>Adja Sitan Diakité</h4>
                                     <h5 className='text-[13px] !mb-0'> 30-03-2026</h5>
                                     <p   className='!mt-0 !mb-0'> Très beau produit, je suis très satisfaite</p>
                                    </div>

                              </div>
                              <Rating name="size-small" defaultValue={4} size="small" readOnly/>
                           </div>
                           <div className='review !pb-5 !pt-5 border-b border-[rgba(0,0,0,0.1)] w-full flex items-center justify-between'>
                              <div className='info w-[60%] flex items-center gap-3 '>
                                    <div className='img w-[80px] h-[80px] overflow-hidden rounded-full'>
                                       <img src="https://img.kwcdn.com/product/open/4e378487ab7c44bf9f944a1e9534852f-goods.jpeg?imageView2/2/w/800/q/70/format/avif" className='w-full'/>
                                    </div>
                                    <div className='w-[80%]'>
                                     <h4 className='text-[16px]'>Adja Sitan Diakité</h4>
                                     <h5 className='text-[13px] !mb-0'> 30-03-2026</h5>
                                     <p   className='!mt-0 !mb-0'> Très beau produit, je suis très satisfaite</p>
                                    </div>

                              </div>
                              <Rating name="size-small" defaultValue={4} size="small" readOnly/>
                           </div>
                           <div className='review !pb-5 !pt-5 border-b border-[rgba(0,0,0,0.1)] w-full flex items-center justify-between'>
                              <div className='info w-[60%] flex items-center gap-3 '>
                                    <div className='img w-[80px] h-[80px] overflow-hidden rounded-full'>
                                       <img src="https://img.kwcdn.com/product/open/4e378487ab7c44bf9f944a1e9534852f-goods.jpeg?imageView2/2/w/800/q/70/format/avif" className='w-full'/>
                                    </div>
                                    <div className='w-[80%]'>
                                     <h4 className='text-[16px]'>Adja Sitan Diakité</h4>
                                     <h5 className='text-[13px] !mb-0'> 30-03-2026</h5>
                                     <p   className='!mt-0 !mb-0'> Très beau produit, je suis très satisfaite</p>
                                    </div>

                              </div>
                              <Rating name="size-small" defaultValue={4} size="small" readOnly/>
                           </div>
                      </div>
                      <br/>
                      <div className='reviewForm bg-[#fafafa] !p-4 rounded-md'>
                        <h2 className='text-[18px]'> Ajouter un commentaire</h2>
                        <form className='w-full !mt-5'>
                           <TextField
                               id="outlined-multiline-flexible"
                               label="votre avis..."
                               className='w-full'
                               multiline
                               rows={5}/>
                                <br/> <br/>
                                <Rating name="size-small" defaultValue={4} size="small"/>
                                <div className='flex items-center !mt-5 '>
                                 <Button className='btn-org'>Commenter</Button>
                                </div>
                               </form>
                      </div>
                       </div>
                   </div>
                 )}
            </div>
            <div className='w-[95%] !mx-auto !pt-8'>
               <h2 className="text-[20px] font-[600]"> Les Produits Liés</h2>
                <ProduitDefile items={6}/>
            </div>
            </section>
        
    </>
    )
}*/}