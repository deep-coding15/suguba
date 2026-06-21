import { Button } from "@mui/material";
import { MdOutlineDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { MyContext } from "../../router.jsx";

export default function CartItem({ item }) {
  const context = useContext(MyContext);

  if (!item) return null;

  const product = item.productId;

  return (
    <div className="cartItem w-full flex items-center gap-4 border-b border-[rgba(0,0,0,0.1)] !py-2 relative">
      <div className="img w-[25%] overflow-hidden h-[80px] !rounded-md">
        <Link to={`/produit/${product?._id}`} className="block group">
          <img
            src={product?.images?.[0]}
            className="w-full h-[80px] object-cover group-hover:scale-105 transition-all"
            alt={product?.name}
          />
        </Link>
      </div>
      <div className="info w-[75%] !pr-5">
        <h4 className="text-[14px] font-[500]">
          <Link to={`/produit/${product?._id}`} className="link transition-all">
            {product?.name}
          </Link>
        </h4>
        <p className="flex items-center gap-3 mt-2">
          <span>Qte: <span>{item.quantity}</span></span>
          <span className="text-primary font-bold">
            Prix: {(product?.price * item.quantity)?.toLocaleString()} Fcfa
          </span>
        </p>
        <MdOutlineDelete
          className="absolute top-[10px] right-[10px] cursor-pointer text-[20px] link transition-all"
          onClick={() => context.removeFromCart(item._id, product?._id)}
        />
      </div>
    </div>
  );
}




{/*import { Button } from "@mui/material";
import { MdOutlineDelete } from "react-icons/md";
import { Link } from "react-router-dom";

export default function CartItem(){
    return(
        <>
       <div className="cartItem w-full flex items-center gap-4 border-b border-[rgba(0,0,0,0.1)] !py-2 relative">
           <div className='img w-[25%] overflow-hidden h-[80px] !rounded-md' >
            <Link to="/produit/1234" className="block group">
            <img src="https://robe-rose-poudre.com/cdn/shop/files/Designsanstitre-2025-04-09T094817.768.png?crop=center&height=1200&v=1744184979&width=1200"
                 className=" w-full group-hover:scale-105"/>
                 </Link>
           </div>
           <div className='info w-[75%] !pr-5'>
            <h4 className="text-[14px] font-[500]">
              <Link to="/produit/1234" className="link transition-all">
            Robe area rose
            </Link>
            </h4>
            <p className="flex items-center gap-3 mt-2">
              <span>Qte: <span>4</span></span>
              <span className="text-primary font-bold">Prix : 10 000 Fcfa</span>
            </p>
            <MdOutlineDelete className="absolute top-[10px] right-[10px] 
            cursor-pointer text-[20px] link transition-all"/>
         </div>
           </div>
        </>
    );
}*/}