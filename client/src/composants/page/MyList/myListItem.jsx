import { Link } from "react-router-dom";
import { IoCloseSharp } from "react-icons/io5";
import Rating from "@mui/material/Rating";
import { Button } from "@mui/material";
import { useContext } from "react";
import { MyContext } from "../../../router";

export default function MyListItems({ item }) {
  const context = useContext(MyContext);

  if (!item) return null;

  return (
    <div className="shadow-md bg-white">
      <div className="cartItem w-full !p-3 flex items-center gap-4 !pb-5 border-b border-[rgba(0,0,0,0.1)]">
        <div className="img w-[15%] overflow-hidden rounded-md">
          <Link to={`/produit/${item.productId}`} className="block group">
            <img
              src={item.images}
              className="w-full group-hover:scale-105 transition-all"
              alt={item.productTitle}
            />
          </Link>
        </div>

        <div className="info w-[85%] relative">
          <IoCloseSharp
            className="absolute top-[10px] right-[10px] cursor-pointer text-[22px] link transition-all"
            onClick={() => context.removeFromMyList(item._id)}
          />
          <span className="text-[13px]">{item.brand}</span>
          <h3 className="text-[15px] font-[500]">
            <Link to={`/produit/${item.productId}`} className="link transition-all">
              {item.productTitle}
            </Link>
          </h3>
          <Rating name="size-small" defaultValue={item.rating || 0} size="small" readOnly />

          <div className="flex items-center gap-4 !mt-2 !mb-2">
            <span className="nouveauPrix text-gray-700 text-[14px] font-[600]">
              {item.price?.toLocaleString()} Fcfa
            </span>
            {item.oldPrice > 0 && (
              <span className="ancienPrix line-through text-gray-500 text-[14px] font-[500]">
                {item.oldPrice?.toLocaleString()} Fcfa
              </span>
            )}
            {item.discount > 0 && (
              <span className="text-primary text-[14px] font-[600]">-{item.discount}%</span>
            )}
          </div>
          <Button
            className="btn-sm btn-org"
            onClick={() => context.addToCart(item.productId)}
          >
            Ajouter au panier
          </Button>
        </div>
      </div>
    </div>
  );
}


{/*import { Link } from "react-router-dom";
import { IoCloseSharp } from "react-icons/io5";
import  Rating from "@mui/material/Rating";
import { Button } from "@mui/material";
export default function MyListItems(){
               
                  
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
                    
                   <div className="flex items-center gap-4 !mt-2 !mb-2">
                     <span className="nouveauPrix text-gray-700 text-[14px] font-[600]">15 000Fcfa</span>
                     <span className="ancienPrix line-through text-gray-500 text-[14px] font-[500]">25 000Fcfa</span>
                   <span className="ancienPrix text-primary text-[14px] font-[600]">-10%</span>
                   
                 </div>
                 <Button className="btn-sm btn-org">Ajouter au panier</Button>
               </div>
               
        </div>
        </div>
    );
}*/}