import { Link } from "react-router-dom";
import { IoCloseSharp } from "react-icons/io5";
import Rating from "@mui/material/Rating";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { RxTriangleDown } from "react-icons/rx";
import { useState, useContext } from "react";
import { MyContext } from "../../../router.jsx";
import { postData } from "../../../utils/api";

export default function CartItem2({ item }) {
  const context = useContext(MyContext);
  const product = item?.productId;

  const [sizeAnchorEl, setSizeAnchorEl] = useState(null);
  const [selectedSize, setSelectedSize] = useState(product?.size?.[0] || "");
  const [qtyAnchorEl, setQtyAnchorEl] = useState(null);
  const [selectedQty, setSelectedQty] = useState(item?.quantity || 1);

  const openSize = Boolean(sizeAnchorEl);
  const openQty = Boolean(qtyAnchorEl);

  if (!item || !product) return null;

  const sizeHandleClose = (value) => {
    setSizeAnchorEl(null);
    if (value !== null) setSelectedSize(value);
  };

  const qtyHandleClose = (value) => {
    setQtyAnchorEl(null);
    if (value !== null) {
      setSelectedQty(value);
      // Mettre à jour la quantité en base
      postData("/api/cart/modification-panier", { id: item._id, qty: value }).then(() => {
        context.getCartItems();
      });
    }
  };

  return (
    <div className="shadow-md bg-white">
      <div className="cartItem w-full !p-3 flex items-center gap-4 !pb-5 border-b border-[rgba(0,0,0,0.1)]">
        <div className="img w-[15%] overflow-hidden rounded-md">
          <Link to={`/produit/${product._id}`} className="block group">
            <img
              src={product.images?.[0]}
              className="w-full group-hover:scale-105 transition-all"
              alt={product.name}
            />
          </Link>
        </div>

        <div className="info w-[85%] relative">
          <IoCloseSharp
            className="absolute top-[10px] right-[10px] cursor-pointer text-[22px] link transition-all"
            onClick={() => context.removeFromCart(item._id, product._id)}
          />
          <span className="text-[13px]">{product.brand}</span>
          <h3 className="text-[15px] font-[500]">
            <Link to={`/produit/${product._id}`} className="link transition-all">
              {product.name}
            </Link>
          </h3>
          <Rating name="size-small" defaultValue={product.rating || 0} size="small" readOnly />

          <div className="flex items-center gap-4 !mt-2">
            {/* Taille */}
            {product.size?.length > 0 && (
              <div className="relative">
                <span
                  className="flex items-center justify-center bg-[#f1f1f1] text-[11px] font-[600] !py-1 !px-2 rounded-md cursor-pointer"
                  onClick={(e) => setSizeAnchorEl(e.currentTarget)}
                >
                  Size: {selectedSize} <RxTriangleDown />
                </span>
                <Menu anchorEl={sizeAnchorEl} open={openSize} onClose={() => sizeHandleClose(null)}>
                  {product.size.map((s) => (
                    <MenuItem key={s} onClick={() => sizeHandleClose(s)}>{s}</MenuItem>
                  ))}
                </Menu>
              </div>
            )}

            {/* Quantité */}
            <div className="relative">
              <span
                className="flex items-center justify-center bg-[#f1f1f1] text-[11px] font-[600] !py-1 !px-2 rounded-md cursor-pointer"
                onClick={(e) => setQtyAnchorEl(e.currentTarget)}
              >
                Qty: {selectedQty} <RxTriangleDown />
              </span>
              <Menu anchorEl={qtyAnchorEl} open={openQty} onClose={() => qtyHandleClose(null)}>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <MenuItem key={n} onClick={() => qtyHandleClose(n)}>{n}</MenuItem>
                ))}
              </Menu>
            </div>
          </div>

          <div className="flex items-center gap-4 !mt-2">
            <span className="nouveauPrix text-gray-700 text-[14px] font-[600]">
              {(product.price * selectedQty).toLocaleString()} Fcfa
            </span>
            {product.oldPrice > 0 && (
              <span className="ancienPrix line-through text-gray-500 text-[14px] font-[500]">
                {(product.oldPrice * selectedQty).toLocaleString()} Fcfa
              </span>
            )}
            {product.discount > 0 && (
              <span className="text-primary text-[14px] font-[500]">-{product.discount}%</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



{/*import { Link } from "react-router-dom";
import { IoCloseSharp } from "react-icons/io5";
import  Rating from "@mui/material/Rating";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { RxTriangleDown } from "react-icons/rx";
import { useState } from "react";
export default function CartItem2(props){
               
                   const [sizeAnchorEl, setSizeAnchorEl] =useState(null);
                   const [selectedSize, setSelectedSize] =useState(props.size);
                      const [qtyAnchorEl, setQtyAnchorEl] =useState(null);
                      const [selectedQty, setSelectedQty] =useState(props.qty);
                     const openSize = Boolean(sizeAnchorEl);
                     const openQty = Boolean(qtyAnchorEl);

                      const sizeHandleClick = (event) => {
                    setSizeAnchorEl(event.currentTarget);
                    };
                 const sizeHandleClose = (value) => {
                    setSizeAnchorEl(null);
                    if(value!==null){
                        setSelectedSize(value);
                    }
                    };
                     const qtyHandleClick = (event) => {
                    setQtyAnchorEl(event.currentTarget);
                    };
                 const qtyHandleClose = (value) => {
                    setQtyAnchorEl(null);
                    if(value!==null){
                        setSelectedQty(value);
                    }};
    return(
        <div className='shadow-md  bg-white'>
            <div className="cartItem w-full !p-3 flex items-center gap-4 !pb-5  border-b border-[rgba(0,0,0,0.1)]">
                <div className='img w-[15%] overflow-hidden rounded-md'>
                     <Link to="/produit/1234" className="block group">
                  <img src="https://robe-rose-poudre.com/cdn/shop/files/Designsanstitre-2025-04-09T094817.768.png?crop=center&height=1200&v=1744184979&width=1200"
                 className=" w-full group-hover:scale-105 transition-all"/>
                 </Link>
                </div>
                <div className='info w-[85%] relative'>
                    <IoCloseSharp className="absolute top-[10px] right-[10px] 
                     cursor-pointer text-[22px] link transition-all"/>
                    <span className="text-[13px]">Anna's couture</span>
                     <h3 className="text-[15px] font-[500]">
                   <Link to="/produit/1234" className="link transition-all">
                    Robe area rose
                       </Link>
                    </h3>
                    <Rating name="size-small" defaultValue={4} size="small" readOnly/>
                    <div className="flex items-center gap-4 !mt-2">
                        <div className="relative">
                        <span className="flex items-center justify-center bg-[#f1f1f1] text-[11px]
                              font-[600] !py-1 !px-2 rounded-md cursor-pointer" onClick={sizeHandleClick}>
                                Size:{selectedSize} <RxTriangleDown />
                              </span>
                               <Menu
                                 id="size-menu"
                            anchorEl={sizeAnchorEl}
                           open={openSize}
                           onClose={()=>sizeHandleClose(null)}
                           
                           slotProps={{
                              list: {
                                'aria-labelledby': 'size-menu',
                                     },
                                       }}
                                     >
                                      <MenuItem onClick={() => sizeHandleClose("S")}>S</MenuItem>
<MenuItem onClick={() => sizeHandleClose("M")}>M</MenuItem>
<MenuItem onClick={() => sizeHandleClose("L")}>L</MenuItem>
<MenuItem onClick={() => sizeHandleClose("XL")}>XL</MenuItem>
<MenuItem onClick={() => sizeHandleClose("2XL")}>2XL</MenuItem>
<MenuItem onClick={() => sizeHandleClose("3XL")}>3XL</MenuItem>
                           
                         </Menu>
                        </div>
                         <div className="relative">
                        <span className="flex items-center justify-center bg-[#f1f1f1] text-[11px]
                              font-[600] !py-1 !px-2 rounded-md cursor-pointer"
                              onClick={qtyHandleClick}>
                                Qty:{selectedQty} <RxTriangleDown />
                              </span>
                              <Menu
                                 id="qty-menu"
                            anchorEl={qtyAnchorEl}
                           open={openQty}
                           onClose={()=>qtyHandleClose(null)}
                           slotProps={{
                              list: {
                                'aria-labelledby': 'qty-menu',
                                     },
                                       }}
                                     >
                                      <MenuItem onClick={() => qtyHandleClose(1)}>1</MenuItem>
                                     <MenuItem onClick={() => qtyHandleClose(2)}>2</MenuItem>
                                      <MenuItem onClick={() => qtyHandleClose(3)}>3</MenuItem>
                                     <MenuItem onClick={() => qtyHandleClose(4)}>4</MenuItem>
                                     <MenuItem onClick={() => qtyHandleClose(5)}>5</MenuItem>
                                      <MenuItem onClick={() => qtyHandleClose(6)}>6</MenuItem>
                         </Menu>
                        </div>
                    </div>
                   <div className="flex items-center gap-4 !mt-2" >
                     <span className="nouveauPrix text-gray-700 text-[14px] font-[600]">15 000Fcfa</span>
                     <span className="ancienPrix line-through text-gray-500 text-[14px] font-[500]">25 000Fcfa</span>
                   <span className="ancienPrix text-primary text-[14px] font-[500]">-10%</span>
                   
                 </div>
         </div>
            </div>
        </div>
    )
}*/}