import { useContext } from "react";
import { MyContext } from "../../../router";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import { IoCloseSharp } from "react-icons/io5";
import { MdOutlineShoppingCart } from "react-icons/md";

export default function Comparateur() {
  const context = useContext(MyContext);
  const compareItems = context.compareItems || [];

  return (
    <section className="!py-10">
      <div className="w-[95%] !mx-auto">
        <h2 className="text-[22px] font-[600] !mb-6">Comparateur de Produits</h2>

        {compareItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center !py-20 gap-4 bg-white rounded-md shadow-md">
            <p className="text-gray-400 text-[16px]">Aucun produit dans le comparateur</p>
            <Link to="/">
              <Button className="btn-org">Continuer les achats</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white shadow-md rounded-md">
              <thead>
                <tr className="border-b border-[rgba(0,0,0,0.1)]">
                  <td className="!px-6 !py-4 font-[600] text-[14px] w-[180px] bg-[#f9f9f9]">Produit</td>
                  {compareItems.map((product) => (
                    <td key={product._id} className="!px-6 !py-4 text-center relative">
                      <IoCloseSharp
                        className="absolute top-[10px] right-[10px] cursor-pointer text-[20px] link"
                        onClick={() => context.removeFromCompare(product._id)}
                      />
                      <Link to={`/produit/${product._id}`}>
                        <img
                          src={product.images?.[0]}
                          className="w-[120px] h-[120px] object-cover rounded-md !mx-auto"
                          alt={product.name}
                        />
                        <p className="text-[14px] font-[500] !mt-2">{product.name}</p>
                      </Link>
                    </td>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Prix */}
                <tr className="border-b border-[rgba(0,0,0,0.1)]">
                  <td className="!px-6 !py-4 font-[600] text-[14px] bg-[#f9f9f9]">Prix</td>
                  {compareItems.map((product) => (
                    <td key={product._id} className="!px-6 !py-4 text-center">
                      <span className="text-primary font-bold text-[16px]">
                        {product.price?.toLocaleString()} Fcfa
                      </span>
                      {product.oldPrice > 0 && (
                        <span className="line-through text-gray-400 text-[13px] block">
                          {product.oldPrice?.toLocaleString()} Fcfa
                        </span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Note */}
                <tr className="border-b border-[rgba(0,0,0,0.1)]">
                  <td className="!px-6 !py-4 font-[600] text-[14px] bg-[#f9f9f9]">Note</td>
                  {compareItems.map((product) => (
                    <td key={product._id} className="!px-6 !py-4 text-center">
                      <Rating name="size-small" defaultValue={product.rating || 0} size="small" readOnly />
                    </td>
                  ))}
                </tr>

                {/* Marque */}
                <tr className="border-b border-[rgba(0,0,0,0.1)]">
                  <td className="!px-6 !py-4 font-[600] text-[14px] bg-[#f9f9f9]">Marque</td>
                  {compareItems.map((product) => (
                    <td key={product._id} className="!px-6 !py-4 text-center text-[14px]">
                      {product.brand || "—"}
                    </td>
                  ))}
                </tr>

                {/* Catégorie */}
                <tr className="border-b border-[rgba(0,0,0,0.1)]">
                  <td className="!px-6 !py-4 font-[600] text-[14px] bg-[#f9f9f9]">Catégorie</td>
                  {compareItems.map((product) => (
                    <td key={product._id} className="!px-6 !py-4 text-center text-[14px]">
                      {product.catName || "—"}
                    </td>
                  ))}
                </tr>

                {/* Stock */}
                <tr className="border-b border-[rgba(0,0,0,0.1)]">
                  <td className="!px-6 !py-4 font-[600] text-[14px] bg-[#f9f9f9]">Stock</td>
                  {compareItems.map((product) => (
                    <td key={product._id} className="!px-6 !py-4 text-center">
                      <span className={`text-[14px] font-bold ${product.countInStock > 0 ? "text-green-600" : "text-red-500"}`}>
                        {product.countInStock > 0 ? `${product.countInStock} unités` : "Rupture"}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Remise */}
                <tr className="border-b border-[rgba(0,0,0,0.1)]">
                  <td className="!px-6 !py-4 font-[600] text-[14px] bg-[#f9f9f9]">Remise</td>
                  {compareItems.map((product) => (
                    <td key={product._id} className="!px-6 !py-4 text-center text-[14px]">
                      {product.discount > 0 ? (
                        <span className="text-primary font-bold">-{product.discount}%</span>
                      ) : "—"}
                    </td>
                  ))}
                </tr>

                {/* Tailles */}
                <tr className="border-b border-[rgba(0,0,0,0.1)]">
                  <td className="!px-6 !py-4 font-[600] text-[14px] bg-[#f9f9f9]">Tailles</td>
                  {compareItems.map((product) => (
                    <td key={product._id} className="!px-6 !py-4 text-center text-[14px]">
                      {product.size?.join(", ") || "—"}
                    </td>
                  ))}
                </tr>

                {/* Bouton panier */}
                <tr>
                  <td className="!px-6 !py-4 font-[600] text-[14px] bg-[#f9f9f9]">Action</td>
                  {compareItems.map((product) => (
                    <td key={product._id} className="!px-6 !py-4 text-center">
                      <Button
                        className="btn-org btn-sm flex gap-2 !mx-auto"
                        onClick={() => context.addToCart(product._id)}
                        disabled={product.countInStock === 0}
                      >
                        <MdOutlineShoppingCart className="text-[18px]" />
                        Ajouter au panier
                      </Button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}