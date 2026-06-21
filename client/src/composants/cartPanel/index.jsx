import CartItem from "../cartItem";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { useContext } from "react";
import { MyContext } from "../../router.jsx";

export default function CartPanel() {
  const context = useContext(MyContext);
  const cartItems = context.cartItems || [];

  const total = cartItems.reduce((sum, item) => {
    return sum + (item.productId?.price || 0) * item.quantity;
  }, 0);

  const livraison = total > 20000 ? 0 : 1000;

  return (
    <div className="relative !w-[350px] !h-[600px]">
      {cartItems.length === 0 ? (
        <div className="flex items-center justify-center h-[200px]">
          <p className="text-gray-400 text-[14px]">Votre panier est vide</p>
        </div>
      ) : (
        <div className="scroll w-full max-h-[380px] overflow-x-hidden overflow-y-scroll !px-4 py-2">
          {cartItems.map((item) => (
            <CartItem key={item._id} item={item} />
          ))}
        </div>
      )}

      <div className="bottomSection absolute bottom-[10px] left-[10px] w-full overflow-hidden !pr-5">
        <div className="bottomInfo !py-3 !px-4 w-full flex items-center border-t border-[rgba(0,0,0,0.1)] justify-between flex-col">
          <div className="flex items-center justify-between w-full">
            <span className="text-[14px] font-[600]">{cartItems.length} article(s)</span>
            <span className="text-primary font-bold">{total.toLocaleString()} Fcfa</span>
          </div>
          <div className="flex items-center justify-between w-full border-b border-[rgba(0,0,0,0.1)] !mb-2">
            <span className="text-[14px] font-[600]">Livraison</span>
            <span className="text-primary font-bold">
              {livraison === 0 ? "Gratuite" : `${livraison.toLocaleString()} Fcfa`}
            </span>
          </div>
          <div className="flex items-center justify-between w-full">
            <span className="text-[14px] font-[600]">Total</span>
            <span className="text-primary font-bold">{(total + livraison).toLocaleString()} Fcfa</span>
          </div>

          <div className="flex items-center justify-between w-full gap-5 !mt-4">
            <Link to="/panier" className="w-[55%] block">
              <Button className="btn-org btn-lg w-full">Voir Panier</Button>
            </Link>
            <Link to="/detail-facturation" className="w-[45%] block">
              <Button className="btn-org btn-lg btn-border w-full">Commander</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}



{/*import CartItem from "../cartItem";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";

export default function CartPanel(){
    return(
        <>
        <div className="relative !w-[350px] !h-[600px]">
            <div className="scroll w-full max-h-[300px] overflow-x-hidden overflow-y-scroll !px-4 py-2 ">
                    <CartItem/>
                    <CartItem/>
                    <CartItem/>
                    <CartItem/>
                    <CartItem/>
                    <CartItem/>
             </div>
             <div className="bottomSection absolute bottom-[10px] left-[10px] w-full overflow-hidden !pr-5">
                    <div className="bottomInfo !py-3 !px-4  w-full flex items-center 
                    border-t border-[rgba(0,0,0,0.1)] justify-between flex-col">
                  <div className="flex items-center justify-between w-full">
                <span className="text-[14px] font-[600]"> 1 unité</span>
                <span className="text-primary font-bold">10 000 Fcfa</span>
              </div>
               <div className="flex items-center justify-between w-full border-b border-[rgba(0,0,0,0.1)] !mb-2">
                <span className="text-[14px] font-[600]">Livraison</span>
                <span className="text-primary font-bold">1000 Fcfa</span>
              </div>
              <div className="flex items-center justify-between w-full">
                <span className="text-[14px] font-[600]">Total</span>
                <span className="text-primary font-bold">11 000 Fcfa</span>
              </div>
      
            <div className="flex items-center justify-between w-full gap-5 !mt-4" >
              <Link to="/panier" className="w-[55%] block">
              <Button className="btn-org btn-lg w-full">Voir Panier</Button>
              </Link>
              <Link to="/detail-facturation" className="w-[45%] block">
              <Button className="btn-org btn-lg btn-border w-full">Commander</Button>
              </Link>
            </div>
            </div>
            </div>
            </div>
        </>
    )
}*/}