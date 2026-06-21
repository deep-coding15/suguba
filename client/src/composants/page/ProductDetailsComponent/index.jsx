import QtyBox from "../../QtyBox/index";
import { MdOutlineShoppingCart } from "react-icons/md";
import { IoIosGitCompare } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import { useContext, useState } from "react";
import { MyContext } from "../../../router";

export default function ProductDetailsComponent({ product }) {
  const [selectedSize, setSelectedSize] = useState(null);
  const [qty, setQty] = useState(1);
  const context = useContext(MyContext);

  if (!product) return null;

  const hasSize = product.size?.length > 0;

  const handleAddToCart = () => {
    if (hasSize && !selectedSize) {
      context.alertBox("error", "Veuillez choisir une taille avant d'ajouter au panier");
      return;
    }
    context.addToCart(product._id, qty, selectedSize || "");
  };

  return (
    <>
      <h1 className="text-[24px] font-[600] mb-2 pt-2">{product.name}</h1>

      <div className="flex items-center gap-3">
        <span className="text-gray-400 text-[13px]">
          Marque : <span className="font-[500] text-black opacity-75">{product.brand || "—"}</span>
        </span>
        <Rating name="size-small" defaultValue={product.rating || 0} size="small" readOnly />
        <span className="text-[13px]">Catégorie : {product.catName}</span>
      </div>

      <div className="flex items-center gap-4 !mt-4">
        {product.oldPrice > 0 && (
          <span className="ancienPrix line-through text-gray-500 text-[15px] font-[500]">
            {product.oldPrice?.toLocaleString()} Fcfa
          </span>
        )}
        <span className="nouveauPrix text-primary text-[15px] font-[600]">
          {product.price?.toLocaleString()} Fcfa
        </span>
        <span className="text-[14px]">
          Stock :{" "}
          <span className={`font-bold ${product.countInStock > 0 ? "text-green-600" : "text-red-500"}`}>
            {product.countInStock > 0 ? `${product.countInStock} unités` : "Rupture de stock"}
          </span>
        </span>
      </div>

      {product.discount > 0 && (
        <span className="inline-block !mt-2 !bg-pink-400 text-white rounded-lg p-1 text-[13px] font-[500]">
          -{product.discount}% de remise
        </span>
      )}

      <p className="!mt-3 !pr-10 !mb-5 text-[14px] text-gray-600">
        {product.description?.slice(0, 200)}...
      </p>

      {/* Tailles */}
      {hasSize && (
        <div className="flex items-center !gap-3 !mb-4">
          <span className="text-[15px] font-[500]">Taille <span className="text-red-500">*</span> :</span>
          <div className="flex items-center gap-2 flex-wrap">
            {product.size.map((s, index) => (
              <Button key={index}
                className={`!min-w-[45px] !h-[38px] !rounded-md border !text-[13px] ${selectedSize === s ? "!bg-primary !text-white" : "!bg-white !text-black border-gray-300"}`}
                onClick={() => setSelectedSize(s)}>
                {s}
              </Button>
            ))}
          </div>
        </div>
      )}

      {!hasSize && (
        <p className="text-[13px] text-gray-400 !mb-3">Taille unique</p>
      )}

      <p className="text-[14px] !mb-2 text-[#000]">Livraison Gratuite (En 2-3 jrs)</p>

      <div className="flex items-center !py-4 gap-4">
        <span className="text-[15px] font-[500]">Quantité :</span>
        <div className="qtyBoxWrapper w-[100px]">
          <QtyBox qty={qty} setQty={setQty} min={1} max={product.countInStock || 99} />
        </div>
        <Button
          className="btn-org flex items-center gap-2 !capitalize"
          disabled={product.countInStock === 0}
          onClick={handleAddToCart}>
          <MdOutlineShoppingCart className="text-[22px]" />
          J'achète
        </Button>
      </div>

      {/* Total affiché dynamiquement */}
      <p className="text-[14px] text-gray-500 !mb-4">
        Total : <span className="text-primary font-[700] text-[16px]">
          {(product.price * qty).toLocaleString()} Fcfa
        </span>
      </p>

      <div className="flex items-center mt-4 gap-4">
        <span className="flex items-center gap-2 text-[14px] link cursor-pointer font-[500]"
          onClick={() => context.addToMyList(product)}>
          <FaRegHeart className="text-[18px]" /> Ajouter aux favoris
        </span>
        <span className="flex items-center gap-2 text-[14px] link cursor-pointer font-[500]"
          onClick={() => context.addToCompare(product)}>
          <IoIosGitCompare className="text-[18px]" /> Ajouter au comparateur
        </span>
      </div>
    </>
  );
}



{/*
import QtyBox from "../../QtyBox/index";
import { MdOutlineShoppingCart } from "react-icons/md";
import { IoIosGitCompare } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import { useContext, useState } from "react";
import { MyContext } from "../../../router";

export default function ProductDetailsComponent({ product }) {
  const [selectedSize, setSelectedSize] = useState(null);
  const [qty, setQty] = useState(1);
  const context=useContext(MyContext);
  if (!product) return null;

  return (
    <>
      <h1 className="text-[24px] font-[600] mb-2 pt-2">{product.name}</h1>

      <div className="flex items-center gap-3">
        <span className="text-gray-400 text-[13px]">
          Marque : <span className="font-[500] text-black opacity-75">{product.brand || "—"}</span>
        </span>
        <Rating name="size-small" defaultValue={product.rating || 0} size="small" readOnly />
        <span className="text-[13px] cursor-pointer">
          Catégorie : {product.catName}
        </span>
      </div>

      <div className="flex items-center gap-4 !mt-4">
        {product.oldPrice > 0 && (
          <span className="ancienPrix line-through text-gray-500 text-[15px] font-[500]">
            {product.oldPrice?.toLocaleString()} Fcfa
          </span>
        )}
        <span className="nouveauPrix text-primary text-[15px] font-[600]">
          {product.price?.toLocaleString()} Fcfa
        </span>
        <span className="text-[14px]">
          Disponible en stock :{" "}
          <span className={`font-bold ${product.countInStock > 0 ? "text-green-600" : "text-red-500"}`}>
            {product.countInStock > 0 ? `${product.countInStock} unités` : "Rupture de stock"}
          </span>
        </span>
      </div>

      {product.discount > 0 && (
        <span className="inline-block !mt-2 !bg-pink-400 text-white rounded-lg p-1 text-[13px] font-[500]">
          -{product.discount}% de remise
        </span>
      )}

      <p className="!mt-3 !pr-10 !mb-5 text-[14px] text-gray-600">
        {product.description?.slice(0, 200)}...
      </p>

      
      {product.size?.length > 0 && (
        <div className="flex items-center !gap-3">
          <span className="text-[16px]">Taille :</span>
          <div className="flex items-center gap-1 actions">
            {product.size.map((s, index) => (
              <Button
                key={index}
                className={`${selectedSize === s ? "!bg-primary !text-white" : ""}`}
                onClick={() => setSelectedSize(s)}
              >
                {s}
              </Button>
            ))}
          </div>
        </div>
      )}

      <p className="text-[14px] !mt-5 !mb-2 text-[#000]">
        Livraison Gratuite (En 2-3 jrs)
      </p>

      <div className="flex items-center !py-4 !gap-14">
        <span className="text-[16px]">Quantité :</span>
        <div className="qtyBoxWrapper w-[60px]">
          <QtyBox qty={qty} setQty={setQty} />
        </div>
        <Button
          className="btn-org flex items-center gap-2 !capitalize"
          disabled={product.countInStock === 0}
        onClick={() => context.addToCart(product?._id)}>
          <MdOutlineShoppingCart className="text-[22px]" />
           J'achète
        </Button>
      </div>

      <div className="flex items-center mt-4 gap-4">
        <span className="flex items-center gap-2 text-[14px] link cursor-pointer font-[500]"  onClick={() => context.addToMyList(product)}>
          <FaRegHeart className="text-[18px]" /> Ajouter aux favoris
        </span>
        <span className="flex items-center gap-2 text-[14px] link cursor-pointer font-[500]"  onClick={() => context.addToCompare(product)}>
          <IoIosGitCompare className="text-[18px]" /> Ajouter au comparateur
        </span>
      </div>
    </>
  );
}



import QtyBox from '../../QtyBox/index';
import { MdOutlineShoppingCart } from "react-icons/md";
import { IoIosGitCompare } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa";
import  Rating from "@mui/material/Rating";
import Button from '@mui/material/Button';
import { useState } from 'react';
export default function ProductDetailsComponent(){

     const[productActionsIndex,setProductActionsIndex]=useState(null);

    return(
         <>
               <h1 className='text-[24px] font-[600] mb-2 pt-2'> Robe beige éblouissante</h1>
                   <div className='flex items-center gap-3'>
                        <span className='text-gray-400 text-[13px]'>
                           Marque :{""}<span className="font-[500] text-black opacity-75"> Anna's Couture</span>
                        </span>
                         <Rating name="size-small" defaultValue={4} size="small" readOnly/>
                        <span className=' text-[13px] cursor-pointer'>Commentaire {" "}(5)</span>
                   </div> 
                    <div className="flex items-center gap-4 !mt-4" >
                      <span className="ancienPrix line-through text-gray-500 text-[15px] font-[500]">255 DH</span>
                      <span className="nouveauPrix text-primary text-[15px]  font-[600]">155 DH</span>
                      <span className='text-[14px]'>Disponible en stock :<span className='text-green-600
                       text-[14px]  font-bold'> 144 unités</span></span>
                     </div>
                     <p className='!mt-3 !pr-10 !mb-5'>Lorem Ipsuext ever sturies,
                         vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
                     </p>
                     <div className="flex items-center !gap-3">
                        <span className='text-[16px]'>Taille:</span>
                        <div className="flex items-center gap-1 actions">
                           <Button className={`${productActionsIndex===0 ?"!bg-primary !text-white":""}`} onClick={()=>setProductActionsIndex(0)}>S</Button>
                           <Button className={`${productActionsIndex===1 ?"!bg-primary !text-white":""}`} onClick={()=>setProductActionsIndex(1)}>M</Button>
                           <Button className= {`${productActionsIndex===2 ?"!bg-primary !text-white":""}`} onClick={()=>setProductActionsIndex(2)}>L</Button>
                           <Button className={`${productActionsIndex===3 ?"!bg-primary !text-white":""}`} onClick={()=>setProductActionsIndex(3)}>XL</Button>
                           <Button className={`${productActionsIndex===4 ?"!bg-primary !text-white":""}`} onClick={()=>setProductActionsIndex(4)}>2XL</Button>
                           <Button className={`${productActionsIndex===5 ?"!bg-primary !text-white":""}`} onClick={()=>setProductActionsIndex(5)}>3XL</Button>
                        </div>
                     </div>
                     <p className='text-[14px] !mt-5 !mb-2 text-[#000]'>Livraison Gratuite {""} (En 2-3 jrs)</p>
                     <div className="flex items-center !py-4 gap-4">
                        <span className='text-[16px]'>Quantité:</span>
                        <div className='qtyBoxWrapper w-[60px]'>
                           <QtyBox/>
                        </div>
                        <Button className='btn-org flex items-center gap-2 !capitalize'>
                           <MdOutlineShoppingCart className='text-[22px]'/> Ajouter au panier
                        </Button>
                     </div>
                     <div className="flex items-center mt-4 gap-4">
                        <span className="flex items-center  gap-2 text-[14px] 
                        link cursor-pointer font-[500]">
                           <FaRegHeart className='text-[18px]'/> Ajouter aux favoris
                        </span>
                        <span className="flex items-center  gap-2 text-[14px] 
                        link cursor-pointer font-[500]">
                           <IoIosGitCompare className='text-[18px]'/> Ajouter au comparateur
                        </span>

                     </div>
                    </>
                     )}*/}