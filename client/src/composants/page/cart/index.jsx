import { Button } from "@mui/material";
import CartItem2 from "../cart/cartItem.jsx";
import { BsBagCheckFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useContext } from "react";
import  {MyContext}  from "../../../router";
export default function CartPage() {
  const context =useContext(MyContext)
  const cartItems = context.cartItems || [];

  const total = cartItems.reduce((sum, item) => {
    return sum + (item.productId?.price || 0) * item.quantity;
  }, 0);

  const livraison = total > 20000 ? 0 : 1000;

  return (
    <section className="section !py-10 !pb-10">
      <div className="w-[95%] !mx-auto !max-w-[80%] flex gap-5">
        <div className="partieG w-[70%]">
          <div className="shadow-md rounded-md bg-white">
            <div className="!py-2 !px-3 border-b border-[rgba(0,0,0,0.1)]">
              <h2>Votre panier</h2>
              <p className="mt-0">
                Il y'a <span className="text-primary font-bold">{cartItems.length}</span> produit(s) dans votre panier
              </p>
            </div>

            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center !py-20 gap-4">
                <p className="text-gray-400 text-[16px]">Votre panier est vide</p>
                <Link to="/">
                  <Button className="btn-org">Continuer les achats</Button>
                </Link>
              </div>
            ) : (
              cartItems.map((item) => <CartItem2 key={item._id} item={item} />)
            )}
          </div>
        </div>

        <div className="partieD w-[30%]">
          <div className="shadow-md rounded-md bg-white !p-5">
            <h3 className="!pb-3">Total de votre panier</h3>
            <hr />
            <p className="flex items-center justify-between">
              <span className="text-[14px] font-[500]">Total HT</span>
              <span className="text-primary font-bold">{total.toLocaleString()} Fcfa</span>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-[14px] font-[500]">Livraison</span>
              <span className="font-bold">
                {livraison === 0 ? "Gratuite" : `${livraison.toLocaleString()} Fcfa`}
              </span>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-[14px] font-[500]">Estimation pour</span>
              <span className="font-bold">Bamako</span>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-[14px] font-[500]">Total</span>
              <span className="text-primary font-bold">{(total + livraison).toLocaleString()} Fcfa</span>
            </p>
            <br />
            <Link to="/detail-facturation" className="block">
              <Button className="btn-org btn-lg w-full flex gap-2">
                <BsBagCheckFill className="text-[20px]" /> Facturation
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}



{/*import { Button } from "@mui/material";
import CartItem2 from "./cartItem.jsx";
import { BsBagCheckFill } from "react-icons/bs";
import { Link } from "react-router-dom";
export default function CartPage(){
    return(
        <>
        <section className="section !py-10 !pb-10">
            <div className="w-[95%] !mx-auto !max-w-[80%] flex gap-5">
                <div className="partieG w-[70%]">
                    <div className='shadow-md  rounded-md bg-white'>
                        <div className="!py-2 !px-3 border-b border-[rgba(0,0,0,0.1)]">
                              <h2>Votre panier</h2>
                              <p className="mt-0">
                                 Il y'a <span className="text-primary font-bold">2</span>{" "} produits dans votre panier
                               </p>
                         </div>

                            <CartItem2 size="S" qty={1}/>
                            <CartItem2 size="M" qty={1}/>
                            <CartItem2 size="S" qty={5}/>
                            <CartItem2 size="L" qty={1}/>
                            <CartItem2 size="S" qty={3}/>
                        </div>
                    </div>
                    <div className="partieD w-[30%]">
                      <div className='shadow-md rounded-md bg-white !p-5'>
                        <h3 className="!pb-3"> Total de votre panier</h3>
                        <hr/>
                        <p className="flex items-center justify-between">
                            <span className="text-[14px] font-[500]">Total HT</span>
                            <span className="text-primary font-bold">30 000Fcfa</span>
                         </p>
                         <p className="flex items-center justify-between">
                            <span className="text-[14px] font-[500]">Livraison</span>
                            <span className=" font-bold">Gratuite</span>
                         </p>
                         <p className="flex items-center justify-between">
                            <span className="text-[14px] font-[500]">Estimation pour</span>
                            <span className=" font-bold">Bamako</span>
                         </p>
                         <p className="flex items-center justify-between">
                            <span className="text-[14px] font-[500]">Total</span>
                            <span className="text-primary font-bold">30 000Fcfa</span>
                         </p>
                         <br/>
                         <Link to="/detail-facturation" className="block">
                            <Button className="btn-org btn-lg w-full flex gap-2"><BsBagCheckFill className="text-[20px]"/>facuration</Button>
                        </Link>
                    
                      </div>
                    </div>
                </div>
             
        </section>
        </>
    )
}*/}