import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
import "./index.css";
import Button from "@mui/material/Button";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { IoIosGitCompare } from "react-icons/io";
import { MdZoomOutMap, MdOutlineShoppingCart } from "react-icons/md";
import { useContext, useState } from "react";
import { MyContext } from "../../../router";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { fetchDataFromApi } from "../../../utils/api";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

export default function ProduitItems({ item }) {
  const context = useContext(MyContext);
  const [openCartDialog, setOpenCartDialog] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedQty, setSelectedQty] = useState(1);

  if (!item) return null;

  const isInMyList = context.myListItems?.some((i) => i.productId === item._id);
  const isInCompare = context.compareItems?.some((i) => i._id === item._id);
  const hasSize = item.size?.length > 0;

  const handleAddToCart = () => {
    if (hasSize && !selectedSize) {
      context.alertBox("error", "Veuillez choisir une taille");
      return;
    }
    context.addToCart(item._id, selectedQty, selectedSize);
    setOpenCartDialog(false);
    setSelectedSize("");
    setSelectedQty(1);
  };

  return (
    <>
      <div className="ProduitItems relative z-0 shadow-lg rounded-md overflow-hidden border border-[rgba(0,0,0,0.1)]">
        <div className="group Pitems w-[100%] h-[220px] rounded-md overflow-hidden relative z-0">
          <Link to={`/produit/${item._id}`}>
            <div className="img h-[220px] overflow-hidden">
              <img src={item.images?.[0]} className="w-full h-full object-cover" alt={item.name} />
              {item.images?.[1] && (
                <img src={item.images[1]}
                  className="w-full h-full object-cover transition-all duration-700 absolute top-0 left-0 opacity-0 group-hover:opacity-100 group-hover:scale-105"
                  alt={item.name} />
              )}
            </div>
          </Link>

          {item.discount > 0 && (
            <span className="promo flex items-center absolute top-[10%] left-[10%] z-10  !bg-pink-400 text-white rounded-lg p-1 text-[13px] font-[500]">
              -{item.discount}%
            </span>
          )}

          <div className="actions absolute top-[-200px] right-[5px] z-10  flex items-center gap-2 flex-col w-[50px] transition-all duration-300 group-hover:top-[15px] opacity-0 group-hover:opacity-100">
            <Button className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-white hover:!bg-pink-400 group"
              onClick={() => {
                fetchDataFromApi(`/api/product/produit/${item._id}`).then((res) => {
                  context.setSelectedProduct(res?.produits);
                  context.setOpenProductDetailsModal(true);
                });
              }}>
              <MdZoomOutMap className="text-[18px] !text-black group-hover:text-white" />
            </Button>
            <Button
              className={`!w-[35px] !h-[35px] !min-w-[35px] !rounded-full hover:!bg-pink-400 group ${isInCompare ? "!bg-pink-400" : "!bg-white"}`}
              onClick={() => context.addToCompare(item)}>
              <IoIosGitCompare className={`text-[18px] group-hover:text-white ${isInCompare ? "!text-white" : "!text-black"}`} />
            </Button>
            <Button
              className={`!w-[35px] !h-[35px] !min-w-[35px] !rounded-full hover:!bg-pink-400 group ${isInMyList ? "!bg-pink-400" : "!bg-white"}`}
              onClick={() => context.addToMyList(item)}>
              {isInMyList ? <FaHeart className="text-[18px] !text-white" /> : <FaRegHeart className="text-[18px] !text-black group-hover:text-white" />}
            </Button>
          </div>
        </div>

        <div className="Pinfos !p-3 py-5">
          <h6 className="text-[13px] !font-[400]">
            <Link to={`/produit/${item._id}`} className="link transition-all">{item.catName}</Link>
          </h6>
          <h3 className="text-[14px] descrip mt-3 font-[500] mb-3 text-[#000]">
            <Link to={`/produit/${item._id}`} className="link transition-all">{item.name}</Link>
          </h3>
          <Rating name="size-small" defaultValue={item.rating || 0} size="small" readOnly />
          <div className="flex items-center gap-4">
            {item.oldPrice > 0 && (
              <span className="ancienPrix line-through text-gray-500 text-[15px] font-[500]">
                {item.oldPrice?.toLocaleString()} Fcfa
              </span>
            )}
            <span className="nouveauPrix text-primary text-[15px] font-[600]">
              {item.price?.toLocaleString()} Fcfa
            </span>
          </div>
          <Button className="btn-org btn-sm w-full !mt-3 gap-2"
            onClick={() => setOpenCartDialog(true)}>
            <MdOutlineShoppingCart className="text-[20px]" /> J'achète
          </Button>
        </div>
      </div>

      {/* Dialog choix taille + quantité */}
      <Dialog open={openCartDialog} onClose={() => setOpenCartDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle className="!font-[600]">
          <div className="flex items-center gap-3">
            <img src={item.images?.[0]} className="w-[50px] h-[50px] object-cover rounded-md" />
            <span className="text-[15px]">{item.name}</span>
          </div>
        </DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-4 !pt-2">
            {hasSize && (
              <div>
                <p className="text-[13px] font-[600] !mb-2">Taille <span className="text-red-500">*</span></p>
                <div className="flex flex-wrap gap-2">
                  {item.size.map((s) => (
                    <Button key={s}
                      className={`!min-w-[45px] !h-[38px] !rounded-md border ${selectedSize === s ? "!bg-primary !text-white !border-primary" : "!bg-white !text-black !border-gray-300"}`}
                      onClick={() => setSelectedSize(s)}>
                      {s}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            <div>
              <p className="text-[13px] font-[600] !mb-2">Quantité</p>
              <Select size="small" value={selectedQty}
                onChange={(e) => setSelectedQty(e.target.value)} className="w-[120px]">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <MenuItem key={n} value={n}>{n}</MenuItem>
                ))}
              </Select>
            </div>
            <div className="flex items-center justify-between !pt-2 border-t border-gray-100">
              <span className="text-[13px] text-gray-500">Total</span>
              <span className="text-primary font-[700] text-[16px]">
                {(item.price * selectedQty).toLocaleString()} Fcfa
              </span>
            </div>
          </div>
        </DialogContent>
        <DialogActions className="!px-6 !pb-4">
          <Button onClick={() => setOpenCartDialog(false)} className="!capitalize !text-gray-500">
            Annuler
          </Button>
          <Button onClick={handleAddToCart} className="btn-org !capitalize flex gap-2">
            <MdOutlineShoppingCart /> Ajouter au panier
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}



{/*
import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
import "./index.css";
import Button from "@mui/material/Button";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { IoIosGitCompare } from "react-icons/io";
import { MdZoomOutMap } from "react-icons/md";
import { useContext } from "react";
import { MyContext } from "../../../router";
import { MdOutlineShoppingCart } from "react-icons/md";
import { fetchDataFromApi } from "../../../utils/api";
export default function ProduitItems({ item }) {
  const context = useContext(MyContext);

  if (!item) return null;

  const isInMyList = context.myListItems?.some((i) => i.productId === item._id);
  const isInCompare = context.compareItems?.some((i) => i._id === item._id);

  return (
    <div className="ProduitItems shadow-lg rounded-md overflow-hidden border border-[rgba(0,0,0,0.1)]">
      <div className="group Pitems w-[100%] h-[220px] rounded-md overflow-hidden relative">
        <Link to={`/produit/${item._id}`}>
          <div className="img h-[220px] overflow-hidden">
            <img src={item.images?.[0]} className="w-full h-full object-cover" alt={item.name} />
            {item.images?.[1] && (
              <img
                src={item.images[1]}
                className="w-full h-full object-cover transition-all duration-700 absolute top-0 left-0 opacity-0 group-hover:opacity-100 group-hover:scale-105"
                alt={item.name}
              />
            )}
          </div>
        </Link>

        {item.discount > 0 && (
          <span className="promo flex items-center absolute top-[10%] left-[10%] z-50 !bg-pink-400 text-white rounded-lg p-1 text-[13px] font-[500]">
            -{item.discount}%
          </span>
        )}

        <div className="actions absolute top-[-200px] right-[5px] z-50 flex items-center gap-2 flex-col w-[50px] transition-all duration-300 group-hover:top-[15px] opacity-0 group-hover:opacity-100">
          <Button
            className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-white hover:!bg-pink-400 group"
            onClick={() => {
    fetchDataFromApi(`/api/product/produit/${item._id}`).then((res) => {
      context.setSelectedProduct(res?.produits); // produit complet
      context.setOpenProductDetailsModal(true);
    });
  }}
          >
            <MdZoomOutMap className="text-[18px] !text-black group-hover:text-white" />
          </Button>
          <Button
            className={`!w-[35px] !h-[35px] !min-w-[35px] !rounded-full hover:!bg-pink-400 group ${isInCompare ? "!bg-pink-400" : "!bg-white"}`}
            onClick={() => context.addToCompare(item)}
          >
            <IoIosGitCompare className={`text-[18px] group-hover:text-white ${isInCompare ? "!text-white" : "!text-black"}`} />
          </Button>
          <Button
            className={`!w-[35px] !h-[35px] !min-w-[35px] !rounded-full hover:!bg-pink-400 group ${isInMyList ? "!bg-pink-400" : "!bg-white"}`}
            onClick={() => context.addToMyList(item)}
          >
            {isInMyList
              ? <FaHeart className="text-[18px] !text-white" />
              : <FaRegHeart className="text-[18px] !text-black group-hover:text-white" />
            }
          </Button>
        </div>
      </div>

      <div className="Pinfos !p-3 py-5">
        <h6 className="text-[13px] !font-[400]">
          <Link to={`/produit/${item._id}`} className="link transition-all">{item.catName}</Link>
        </h6>
        <h3 className="text-[14px] descrip mt-3 font-[500] mb-3 text-[#000]">
          <Link to={`/produit/${item._id}`} className="link transition-all">{item.name}</Link>
        </h3>
        <Rating name="size-small" defaultValue={item.rating || 0} size="small" readOnly />
        <div className="flex items-center gap-4">
          {item.oldPrice > 0 && (
            <span className="ancienPrix line-through text-gray-500 text-[15px] font-[500]">
              {item.oldPrice?.toLocaleString()} Fcfa
            </span>
          )}
          <span className="nouveauPrix text-primary text-[15px] font-[600]">
            {item.price?.toLocaleString()} Fcfa
          </span>
        </div>
        <Button
          className="btn-org btn-sm w-full !mt-3 gap-2"
          onClick={() => context.addToCart(item._id)}
        >
           <MdOutlineShoppingCart className="text-[22px]" />
                     J'achète
        </Button>
      </div>
    </div>
  );
}



import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
import "./index.css";
import Button from "@mui/material/Button";
import { FaRegHeart } from "react-icons/fa";
import { IoIosGitCompare } from "react-icons/io";
import { MdZoomOutMap } from "react-icons/md";
import { useContext } from "react";
import { MyContext } from "../../../router";

export default function ProduitItems({ item }) {
  const context = useContext(MyContext);

  if (!item) return null;

  const discount = item.discount || 0;

  return (
    <div className="ProduitItems shadow-lg rounded-md overflow-hidden border border-[rgba(0,0,0,0.1)]">
      <div className="group Pitems w-[100%] h-[220px] rounded-md overflow-hidden relative">
        <Link to={`/produit/${item._id}`}>
          <div className="img h-[220px] overflow-hidden">
            <img
              src={item.images?.[0]}
              className="w-full h-full object-cover"
              alt={item.name}
            />
            {item.images?.[1] && (
              <img
                src={item.images[1]}
                className="w-full h-full object-cover transition-all duration-700 absolute top-0 left-0 opacity-0 group-hover:opacity-100 group-hover:scale-105"
                alt={item.name}
              />
            )}
          </div>
        </Link>

        {discount > 0 && (
          <span className="promo flex items-center absolute top-[10%] left-[10%] z-50 !bg-pink-400 text-white rounded-lg p-1 text-[13px] font-[500]">
            -{discount}%
          </span>
        )}

        <div className="actions absolute top-[-200px] right-[5px] z-50 flex items-center gap-2 flex-col w-[50px] transition-all duration-300 group-hover:top-[15px] opacity-0 group-hover:opacity-100">
          <Button
            className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-white text-black hover:!bg-pink-400 hover:text-white group"
            onClick={() => context.setOpenProductDetailsModal(true)}
          >
            <MdZoomOutMap className="text-[18px] !text-black group-hover:text-white hover:!text-white" />
          </Button>
          <Button className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-white text-black hover:!bg-pink-400 hover:text-white group">
            <IoIosGitCompare className="text-[18px] !text-black group-hover:text-white hover:!text-white" />
          </Button>
          <Button className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-white text-black hover:!bg-pink-400 hover:text-white group">
            <FaRegHeart className="text-[18px] !text-black group-hover:text-white hover:!text-white" />
          </Button>
        </div>
      </div>

      <div className="Pinfos !p-3 py-5">
        <h6 className="text-[13px] !font-[400]">
          <Link to={`/produit/${item._id}`} className="link transition-all">
            {item.catName}
          </Link>
        </h6>
        <h3 className="text-[14px] descrip mt-3 font-[500] mb-3 text-[#000]">
          <Link to={`/produit/${item._id}`} className="link transition-all">
            {item.name}
          </Link>
        </h3>
        <Rating name="size-small" defaultValue={item.rating || 0} size="small" readOnly />
        <div className="flex items-center gap-4">
          {item.oldPrice > 0 && (
            <span className="ancienPrix line-through text-gray-500 text-[15px] font-[500]">
              {item.oldPrice?.toLocaleString()} Fcfa
            </span>
          )}
          <span className="nouveauPrix text-primary text-[15px] font-[600]">
            {item.price?.toLocaleString()} Fcfa
          </span>
        </div>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import  Rating from "@mui/material/Rating";
import "./index.css"
import Button from "@mui/material/Button";
import { FaRegHeart } from "react-icons/fa";
import { IoIosGitCompare } from "react-icons/io";
import { MdZoomOutMap } from "react-icons/md";
import { useContext } from "react";
import { MyContext } from "../../../router";

export default function ProduitItems(){
    const context =useContext(MyContext);

return(
    <div className="ProduitItems shadow-lg rounded-md overflow-hidden border border-[rgba(0,0,0,0.1)]">
        
          <div className=" group Pitems w-[100%] h-[220px] rounded-md overflow-hidden relative">
            <Link to="/">
              <div className="img h-[220px] overflow-hidden">
                <img src="https://imgs.search.brave.com/cUe901OCa3DPEa0_UlfgHA_zUrpWlG0-6wBfUPz2DEs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NTEyTWNvWE5YcEwu/anBn"
                 className="w-full "/>
                 
                 <img src="https://robe-avenue.com/cdn/shop/files/robe-de-soiree-sexy-fendue-longue-noir-xs-robe-de-soiree-sexy-fendue-longue-60325350310231.webp?v=1733768818&width=750"
                 className="w-full transition-all duration-700 absolute top-0 left-0 opacity-0  group-hover:opacity-100
                  group-hover:scale-105"/>
                
              </div>
             </Link>
                 
                 <span className="promo flex items-center absolute top-[10%] left-[10%] z-50 !bg-pink-400 text-white rounded-lg p-1
                 text-[15px] font-[500] ">-10%</span>
                 <div className="actions absolute top-[-200px] right-[5px] z-50 flex items-center
                 gap-2 flex-col w-[50px] transition-all duration-300 group-hover:top-[15px] opacity-0
                 group-hover:opacity-100">
                    <Button className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-white text-black
                    hover:!bg-pink-400 hover:text-white group"
                       onClick={()=>context.setOpenProductDetailsModal(true)}>
                        < MdZoomOutMap className="text-[18px] !text-black group-hover:text-white hover:!text-white"/>
                    </Button>
                    <Button className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-white text-black
                    hover:!bg-pink-400 hover:text-white group">
                        <IoIosGitCompare className="text-[18px] !text-black group-hover:text-white hover:!text-white"/>
                    </Button>
                     <Button className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-white text-black
                    hover:!bg-pink-400 hover:text-white group">
                        <FaRegHeart className="text-[18px] !text-black group-hover:text-white hover:!text-white"/>
                    </Button>
                    
                 </div>
          </div>
          <div className="Pinfos !p-3 py-5">
            <h6 className="text-[13px] !font-[400]"> 
                <Link to="/" className="link transtion-all">Robe chic</Link>
            </h6>
            <h3 className="text-[14px] descrip mt-3  font-[500] mb-3 text-[#000]"> 
                <Link to="/" className="link transtion-all">
                Robe très élégante à porter pour de grandes ou simple occasion.
                </Link>
            </h3>
            <Rating name="size-small" defaultValue={4} size="small" readOnly/>
            <div className="flex items-center gap-4" >
                <span className="ancienPrix line-through text-gray-500 text-[15px] font-[500]">25 000Fcfa</span>
                <span className="nouveauPrix text-primary text-[15px] font-[600]">15 000Fcfa</span>
            </div>
</div>
</div>
)}*/}