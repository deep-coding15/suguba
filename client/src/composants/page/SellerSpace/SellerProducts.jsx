import { useState, useEffect, useContext } from "react";
import { fetchDataFromApi, postData, deleteData } from "../../../utils/api";
import { MyContext } from "../../../router";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Rating from "@mui/material/Rating";
import { AiOutlineEdit } from "react-icons/ai";
import { BsTrash } from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";
import { MdStars, MdPending, MdCheckCircle, MdCancel, MdLocalOffer } from "react-icons/md";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Tooltip from "@mui/material/Tooltip";
import SellerAddProduct from "./SellerAddProduct";

// Badge pour le statut de mise en avant / offre spéciale
function StatusBadge({ status, type = "featured" }) {
  const colorMap = {
    none: null,
    pending: { label: "En attente de validation", color: "bg-yellow-100 text-yellow-700", icon: MdPending },
    approved: {
      label: type === "featured" ? "Mis en avant ✨" : "Offre Spéciale 🔥",
      color: type === "featured" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700",
      icon: MdCheckCircle
    },
    rejected: { label: "Refusé", color: "bg-red-100 text-red-600", icon: MdCancel },
  };
  const s = colorMap[status];
  if (!s) return null;
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-[600] !px-2 !py-1 rounded-full ${s.color}`}>
      <Icon className="text-[12px]" /> {s.label}
    </span>
  );
}

export default function SellerProducts() {
  const context = useContext(MyContext);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openAdd, setOpenAdd] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // Dialog mise en avant (Vedette)
  const [featuredDialog, setFeaturedDialog] = useState({ open: false, product: null });
  const [featuredLoading, setFeaturedLoading] = useState(false);

  // ✅ Dialog Offre Spéciale
  const [specialOfferDialog, setSpecialOfferDialog] = useState({ open: false, product: null });
  const [specialOfferLoading, setSpecialOfferLoading] = useState(false);

  const loadProducts = () => {
    setIsLoading(true);
    fetchDataFromApi("/api/seller/produits?page=1&perPage=100").then((res) => {
      setProducts(res?.produits || []);
      setIsLoading(false);
    });
  };

  useEffect(() => { loadProducts(); }, []);

  const handleDelete = () => {
    deleteData(`/api/product/suppression-produit/${deleteId}`).then((res) => {
      if (res?.success) {
        context.alertBox("success", "Produit supprimé");
        loadProducts();
      } else {
        context.alertBox("error", res?.message || "Erreur");
      }
      setDeleteId(null);
    });
  };

  // ── Vedette ───────────────────────────────────────────────────────────────
  const handleRequestFeatured = () => {
    if (!featuredDialog.product) return;
    setFeaturedLoading(true);
    postData("/api/product/demande-mise-en-avant", { productId: featuredDialog.product._id }).then((res) => {
      if (res?.success) {
        context.alertBox("success", "Demande Vedette envoyée ! L'admin va valider.");
        loadProducts();
      } else {
        context.alertBox("error", res?.message || "Erreur");
      }
      setFeaturedLoading(false);
      setFeaturedDialog({ open: false, product: null });
    });
  };

  // ✅ Offre Spéciale ────────────────────────────────────────────────────────
  const handleRequestSpecialOffer = () => {
    if (!specialOfferDialog.product) return;
    setSpecialOfferLoading(true);
    postData("/api/product/demande-offre-speciale", { productId: specialOfferDialog.product._id }).then((res) => {
      if (res?.success) {
        context.alertBox("success", "Demande Offre Spéciale envoyée ! L'admin va valider.");
        loadProducts();
      } else {
        context.alertBox("error", res?.message || "Erreur");
      }
      setSpecialOfferLoading(false);
      setSpecialOfferDialog({ open: false, product: null });
    });
  };

  if (isLoading) return <div className="flex justify-center !py-20"><CircularProgress /></div>;

  return (
    <div className="flex flex-col gap-5">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[18px] font-[700]">Mes Produits</h2>
          <p className="text-[13px] text-gray-500">{products.length} produit(s)</p>
        </div>
        <Button className="btn-org flex gap-2 !capitalize" onClick={() => setOpenAdd(true)}>
          <IoMdAdd /> Ajouter un produit
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm !p-16 text-center">
          <p className="text-gray-400 text-[16px] !mb-4">Vous n'avez pas encore de produits</p>
          <Button className="btn-org !capitalize" onClick={() => setOpenAdd(true)}>
            Ajouter mon premier produit
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {products.map((product) => {
            const featStatus = product.featuredRequest?.status || "none";
            const soStatus = product.specialOfferRequest?.status || "none";
            const canRequestFeatured = featStatus === "none" || featStatus === "rejected";
            const canRequestSpecialOffer = soStatus === "none" || soStatus === "rejected";

            return (
              <div key={product._id} className="bg-white rounded-xl shadow-sm !p-4 flex items-center gap-4 hover:shadow-md transition-all">
                {/* Image */}
                <div className="relative flex-shrink-0">
                  <img src={product.images?.[0]} className="w-[75px] h-[75px] object-cover rounded-xl" alt={product.name} />
                  {featStatus === "approved" && (
                    <div className="absolute -top-1 -right-1 w-[22px] h-[22px] bg-yellow-400 rounded-full flex items-center justify-center">
                      <MdStars className="text-white text-[14px]" />
                    </div>
                  )}
                  {soStatus === "approved" && (
                    <div className="absolute -bottom-1 -right-1 w-[22px] h-[22px] bg-orange-500 rounded-full flex items-center justify-center">
                      <MdLocalOffer className="text-white text-[12px]" />
                    </div>
                  )}
                </div>

                {/* Infos */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-[14px] font-[600] truncate">{product.name}</h3>
                  <p className="text-[12px] text-gray-500 !mb-1">{product.catName}</p>
                  <Rating name="r" defaultValue={product.rating} size="small" readOnly precision={0.5} />
                  <div className="!mt-1 flex flex-wrap gap-1">
                    <StatusBadge status={featStatus} type="featured" />
                    <StatusBadge status={soStatus} type="special" />
                  </div>
                </div>

                {/* Stats */}
                <div className="text-right flex-shrink-0">
                  <p className="text-primary font-[700] text-[16px]">{product.price?.toLocaleString()} Fcfa</p>
                  <p className="text-[12px] text-gray-400">Stock: <span className={product.countInStock < 5 ? "text-red-500 font-[600]" : ""}>{product.countInStock}</span></p>
                  <p className="text-[12px] text-gray-400">{product.sales || 0} ventes</p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  {/* ⭐ Mettre en avant (Vedette) */}
                  {canRequestFeatured && (
                    <Tooltip title="Mettre en avant — Vedette sur l'accueil (commission 15%)" placement="left">
                      <Button
                        className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-yellow-50 hover:!bg-yellow-100"
                        onClick={() => setFeaturedDialog({ open: true, product })}>
                        <MdStars className="text-yellow-500 text-[18px]" />
                      </Button>
                    </Tooltip>
                  )}

                  {/* 🔥 Offre Spéciale */}
                  {canRequestSpecialOffer && (
                    <Tooltip title="Offre Spéciale sur l'accueil (commission 15%)" placement="left">
                      <Button
                        className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-orange-50 hover:!bg-orange-100"
                        onClick={() => setSpecialOfferDialog({ open: true, product })}>
                        <MdLocalOffer className="text-orange-500 text-[18px]" />
                      </Button>
                    </Tooltip>
                  )}

                  <Button className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-blue-50"
                    onClick={() => setEditProduct(product)}>
                    <AiOutlineEdit className="text-blue-600 text-[16px]" />
                  </Button>
                  <Button className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-red-50"
                    onClick={() => setDeleteId(product._id)}>
                    <BsTrash className="text-red-500 text-[16px]" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          Dialog : Vedette (Mis en avant)
      ══════════════════════════════════════════════════════════════════════ */}
      <Dialog open={featuredDialog.open} onClose={() => setFeaturedDialog({ open: false, product: null })} maxWidth="sm" fullWidth>
        <DialogTitle className="!font-[700]">⭐ Mettre en avant — Vedette</DialogTitle>
        <DialogContent>
          {featuredDialog.product && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl !p-3">
                <img src={featuredDialog.product.images?.[0]} className="w-[50px] h-[50px] object-cover rounded-lg" />
                <div>
                  <p className="font-[600] text-[14px]">{featuredDialog.product.name}</p>
                  <p className="text-[13px] text-primary">{featuredDialog.product.price?.toLocaleString()} Fcfa</p>
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl !p-4">
                <div className="flex items-start gap-2">
                  <span className="text-[18px]">⚠️</span>
                  <div>
                    <p className="text-[14px] font-[700] text-yellow-800 !mb-1">Commission spéciale : 15%</p>
                    <p className="text-[13px] text-yellow-700">
                      Les produits Vedette apparaissent dans le <strong>carrousel "Produits Vedettes ⭐"</strong> de l'accueil.
                      La commission passe de <strong>10%</strong> à <strong>15%</strong> — vous recevez <strong>85%</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions className="!px-5 !pb-4">
          <Button onClick={() => setFeaturedDialog({ open: false, product: null })} className="!capitalize !text-gray-600">Annuler</Button>
          <Button onClick={handleRequestFeatured} disabled={featuredLoading}
            className="!bg-yellow-400 !text-yellow-900 !capitalize !font-[600] hover:!bg-yellow-500 flex gap-2">
            {featuredLoading ? <CircularProgress size={18} color="inherit" /> : <><MdStars /> Envoyer la demande</>}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ══════════════════════════════════════════════════════════════════════
          ✅ Dialog : Offre Spéciale
      ══════════════════════════════════════════════════════════════════════ */}
      <Dialog open={specialOfferDialog.open} onClose={() => setSpecialOfferDialog({ open: false, product: null })} maxWidth="sm" fullWidth>
        <DialogTitle className="!font-[700]">🔥 Offre Spéciale sur l'accueil</DialogTitle>
        <DialogContent>
          {specialOfferDialog.product && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl !p-3">
                <img src={specialOfferDialog.product.images?.[0]} className="w-[50px] h-[50px] object-cover rounded-lg" />
                <div>
                  <p className="font-[600] text-[14px]">{specialOfferDialog.product.name}</p>
                  <p className="text-[13px] text-primary">{specialOfferDialog.product.price?.toLocaleString()} Fcfa</p>
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-xl !p-4">
                <div className="flex items-start gap-2">
                  <span className="text-[18px]">⚠️</span>
                  <div>
                    <p className="text-[14px] font-[700] text-orange-800 !mb-1">Commission spéciale : 15%</p>
                    <p className="text-[13px] text-orange-700">
                      Les produits en Offre Spéciale apparaissent dans la <strong>section bannière promo</strong> de l'accueil (grande mise en avant visuelle).
                      La commission passe de <strong>10%</strong> à <strong>15%</strong> — vous recevez <strong>85%</strong>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl !p-4">
                <p className="text-[13px] font-[600] text-blue-800 !mb-2">Où apparaît votre produit ?</p>
                <ul className="flex flex-col gap-1">
                  {[
                    "Si moins de 3 offres spéciales : grande section bannière promo (col-span-1 ou flex-1)",
                    "Si 3 offres ou plus : section carrousel d'images promos en dessous",
                    "Badge 🔥 Offre Spéciale affiché sur votre produit",
                    "Commission de 15% appliquée sur toutes les ventes via ce placement",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-[12px] text-blue-700">
                      <span className="font-[700] flex-shrink-0">{i + 1}.</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions className="!px-5 !pb-4">
          <Button onClick={() => setSpecialOfferDialog({ open: false, product: null })} className="!capitalize !text-gray-600">Annuler</Button>
          <Button onClick={handleRequestSpecialOffer} disabled={specialOfferLoading}
            className="!bg-orange-500 !text-white !capitalize !font-[600] hover:!bg-orange-600 flex gap-2">
            {specialOfferLoading ? <CircularProgress size={18} color="inherit" /> : <><MdLocalOffer /> J'accepte, envoyer la demande</>}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog ajout produit */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)} maxWidth="md" fullWidth>
        <DialogTitle className="!font-[700]">Ajouter un produit</DialogTitle>
        <DialogContent>
          <SellerAddProduct onSuccess={() => { setOpenAdd(false); loadProducts(); }} />
        </DialogContent>
      </Dialog>

      {/* Dialog edit produit */}
      <Dialog open={!!editProduct} onClose={() => setEditProduct(null)} maxWidth="md" fullWidth>
        <DialogTitle className="!font-[700]">Modifier le produit</DialogTitle>
        <DialogContent>
          <SellerAddProduct product={editProduct} onSuccess={() => { setEditProduct(null); loadProducts(); }} />
        </DialogContent>
      </Dialog>

      {/* Dialog suppression */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <p className="text-[14px] text-gray-600">Voulez-vous vraiment supprimer ce produit ? Cette action est irréversible.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)} className="!capitalize">Annuler</Button>
          <Button onClick={handleDelete} color="error" variant="contained" className="!capitalize">Supprimer</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}








{/*import { useState, useEffect, useContext } from "react";
import { fetchDataFromApi, postData, deleteData } from "../../../utils/api";
import { MyContext } from "../../../router";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Rating from "@mui/material/Rating";
import { AiOutlineEdit } from "react-icons/ai";
import { BsTrash } from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";
import { MdStars, MdPending, MdCheckCircle, MdCancel } from "react-icons/md";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Tooltip from "@mui/material/Tooltip";
import SellerAddProduct from "./SellerAddProduct";

// Badge pour le statut de mise en avant
function FeaturedBadge({ status }) {
  const map = {
    none: null,
    pending: { label: "En attente de validation", color: "bg-yellow-100 text-yellow-700", icon: MdPending },
    approved: { label: "Mis en avant ✨", color: "bg-green-100 text-green-700", icon: MdCheckCircle },
    rejected: { label: "Refusé", color: "bg-red-100 text-red-600", icon: MdCancel },
  };
  const s = map[status];
  if (!s) return null;
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-[600] !px-2 !py-1 rounded-full ${s.color}`}>
      <Icon className="text-[12px]" /> {s.label}
    </span>
  );
}

export default function SellerProducts() {
  const context = useContext(MyContext);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openAdd, setOpenAdd] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // Dialog mise en avant
  const [featuredDialog, setFeaturedDialog] = useState({ open: false, product: null });
  const [featuredLoading, setFeaturedLoading] = useState(false);

  const loadProducts = () => {
    setIsLoading(true);
    fetchDataFromApi("/api/seller/produits?page=1&perPage=100").then((res) => {
      setProducts(res?.produits || []);
      setIsLoading(false);
    });
  };

  useEffect(() => { loadProducts(); }, []);

  const handleDelete = () => {
    deleteData(`/api/product/suppression-produit/${deleteId}`).then((res) => {
      if (res?.success) {
        context.alertBox("success", "Produit supprimé");
        loadProducts();
      } else {
        context.alertBox("error", res?.message || "Erreur");
      }
      setDeleteId(null);
    });
  };

  const handleRequestFeatured = () => {
    if (!featuredDialog.product) return;
    setFeaturedLoading(true);
    postData("/api/product/demande-mise-en-avant", { productId: featuredDialog.product._id }).then((res) => {
      if (res?.success) {
        context.alertBox("success", "Demande envoyée ! L'admin va valider votre demande.");
        loadProducts();
      } else {
        context.alertBox("error", res?.message || "Erreur");
      }
      setFeaturedLoading(false);
      setFeaturedDialog({ open: false, product: null });
    });
  };

  if (isLoading) return <div className="flex justify-center !py-20"><CircularProgress /></div>;

  return (
    <div className="flex flex-col gap-5">
      
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[18px] font-[700]">Mes Produits</h2>
          <p className="text-[13px] text-gray-500">{products.length} produit(s)</p>
        </div>
        <Button className="btn-org flex gap-2 !capitalize" onClick={() => setOpenAdd(true)}>
          <IoMdAdd /> Ajouter un produit
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm !p-16 text-center">
          <p className="text-gray-400 text-[16px] !mb-4">Vous n'avez pas encore de produits</p>
          <Button className="btn-org !capitalize" onClick={() => setOpenAdd(true)}>
            Ajouter mon premier produit
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {products.map((product) => {
            const featStatus = product.featuredRequest?.status || "none";
            const canRequestFeatured = featStatus === "none" || featStatus === "rejected";

            return (
              <div key={product._id} className="bg-white rounded-xl shadow-sm !p-4 flex items-center gap-4 hover:shadow-md transition-all">
                
                <div className="relative flex-shrink-0">
                  <img src={product.images?.[0]} className="w-[75px] h-[75px] object-cover rounded-xl" alt={product.name} />
                  {featStatus === "approved" && (
                    <div className="absolute -top-1 -right-1 w-[22px] h-[22px] bg-yellow-400 rounded-full flex items-center justify-center">
                      <MdStars className="text-white text-[14px]" />
                    </div>
                  )}
                </div>

                
                <div className="flex-1 min-w-0">
                  <h3 className="text-[14px] font-[600] truncate">{product.name}</h3>
                  <p className="text-[12px] text-gray-500 !mb-1">{product.catName}</p>
                  <Rating name="r" defaultValue={product.rating} size="small" readOnly precision={0.5} />
                  <div className="!mt-1">
                    <FeaturedBadge status={featStatus} />
                  </div>
                </div>

                
                <div className="text-right flex-shrink-0">
                  <p className="text-primary font-[700] text-[16px]">{product.price?.toLocaleString()} Fcfa</p>
                  <p className="text-[12px] text-gray-400">Stock: <span className={product.countInStock < 5 ? "text-red-500 font-[600]" : ""}>{product.countInStock}</span></p>
                  <p className="text-[12px] text-gray-400">{product.sales || 0} ventes</p>
                </div>

                
                <div className="flex flex-col gap-2 flex-shrink-0">
                 
                  {canRequestFeatured && (
                    <Tooltip title="Mettre en avant sur l'accueil (commission 15%)" placement="left">
                      <Button
                        className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-yellow-50 hover:!bg-yellow-100"
                        onClick={() => setFeaturedDialog({ open: true, product })}>
                        <MdStars className="text-yellow-500 text-[18px]" />
                      </Button>
                    </Tooltip>
                  )}
                  <Button className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-blue-50"
                    onClick={() => setEditProduct(product)}>
                    <AiOutlineEdit className="text-blue-600 text-[16px]" />
                  </Button>
                  <Button className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-red-50"
                    onClick={() => setDeleteId(product._id)}>
                    <BsTrash className="text-red-500 text-[16px]" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      
      <Dialog open={featuredDialog.open} onClose={() => setFeaturedDialog({ open: false, product: null })} maxWidth="sm" fullWidth>
        <DialogTitle className="!font-[700]">⭐ Mettre en avant sur l'accueil</DialogTitle>
        <DialogContent>
          {featuredDialog.product && (
            <div className="flex flex-col gap-4">
              
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl !p-3">
                <img src={featuredDialog.product.images?.[0]} className="w-[50px] h-[50px] object-cover rounded-lg" />
                <div>
                  <p className="font-[600] text-[14px]">{featuredDialog.product.name}</p>
                  <p className="text-[13px] text-primary">{featuredDialog.product.price?.toLocaleString()} Fcfa</p>
                </div>
              </div>

              
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl !p-4">
                <div className="flex items-start gap-2">
                  <span className="text-[18px]">⚠️</span>
                  <div>
                    <p className="text-[14px] font-[700] text-yellow-800 !mb-1">Commission spéciale : 15%</p>
                    <p className="text-[13px] text-yellow-700">
                      Pour les produits mis en avant sur l'accueil Suguba, la commission passe de <strong>10%</strong> à <strong>15%</strong>.
                      Vous recevez donc <strong>85%</strong> du montant de chaque vente pour ce produit.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl !p-4">
                <p className="text-[13px] font-[600] text-blue-800 !mb-2">Ce qui se passe après votre demande :</p>
                <ul className="flex flex-col gap-1">
                  {[
                    "Votre demande est envoyée à l'équipe Suguba",
                    "L'admin valide et publie votre produit sur l'accueil",
                    "Votre produit apparaît dans le carrousel de l'accueil avec bouton 'Ajouter au panier'",
                    "La commission de 15% s'applique sur les ventes de ce produit",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-[12px] text-blue-700">
                      <span className="font-[700] flex-shrink-0">{i + 1}.</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions className="!px-5 !pb-4">
          <Button onClick={() => setFeaturedDialog({ open: false, product: null })} className="!capitalize !text-gray-600">
            Annuler
          </Button>
          <Button
            onClick={handleRequestFeatured}
            disabled={featuredLoading}
            className="!bg-yellow-400 !text-yellow-900 !capitalize !font-[600] hover:!bg-yellow-500 flex gap-2">
            {featuredLoading ? <CircularProgress size={18} color="inherit" /> : (
              <><MdStars /> J'accepte, envoyer la demande</>
            )}
          </Button>
        </DialogActions>
      </Dialog>

      
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)} maxWidth="md" fullWidth>
        <DialogTitle className="!font-[700]">Ajouter un produit</DialogTitle>
        <DialogContent>
          <SellerAddProduct onSuccess={() => { setOpenAdd(false); loadProducts(); }} />
        </DialogContent>
      </Dialog>

      
      <Dialog open={!!editProduct} onClose={() => setEditProduct(null)} maxWidth="md" fullWidth>
        <DialogTitle className="!font-[700]">Modifier le produit</DialogTitle>
        <DialogContent>
          <SellerAddProduct product={editProduct} onSuccess={() => { setEditProduct(null); loadProducts(); }} />
        </DialogContent>
      </Dialog>

     
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <p className="text-[14px] text-gray-600">Voulez-vous vraiment supprimer ce produit ? Cette action est irréversible.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)} className="!capitalize">Annuler</Button>
          <Button onClick={handleDelete} color="error" variant="contained" className="!capitalize">Supprimer</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
*/}

{/*import { useState, useEffect, useContext } from "react";
import { fetchDataFromApi, postData, deleteData } from "../../../utils/api";
import { MyContext } from "../../../router";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Rating from "@mui/material/Rating";
import { AiOutlineEdit } from "react-icons/ai";
import { BsTrash } from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import SellerAddProduct from "./SellerAddProduct";

export default function SellerProducts() {
  const context = useContext(MyContext);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openAdd, setOpenAdd] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const loadProducts = () => {
    setIsLoading(true);
    fetchDataFromApi("/api/seller/produits?page=1&perPage=100").then((res) => {
      setProducts(res?.produits || []);
      setIsLoading(false);
    });
  };

  useEffect(() => { loadProducts(); }, []);

  const handleDelete = () => {
    deleteData(`/api/product/suppression-produit/${deleteId}`).then((res) => {
      if (res?.success) {
        context.alertBox("success", "Produit supprimé");
        loadProducts();
      }
      setDeleteId(null);
    });
  };

  if (isLoading) return <div className="flex justify-center !py-20"><CircularProgress /></div>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-[600]">Mes Produits ({products.length})</h2>
        <Button className="btn-org flex gap-2" onClick={() => setOpenAdd(true)}>
          <IoMdAdd /> Ajouter un produit
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm !p-16 text-center">
          <p className="text-gray-400 !mb-4">Vous n'avez pas encore de produits</p>
          <Button className="btn-org" onClick={() => setOpenAdd(true)}>
            Ajouter mon premier produit
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-xl shadow-sm !p-4 flex items-center gap-4">
              <img src={product.images?.[0]} className="w-[70px] h-[70px] object-cover rounded-lg" alt={product.name} />
              <div className="flex-1">
                <h3 className="text-[15px] font-[600]">{product.name}</h3>
                <p className="text-[13px] text-gray-500">{product.catName}</p>
                <Rating name="r" defaultValue={product.rating} size="small" readOnly />
              </div>
              <div className="text-right">
                <p className="text-primary font-[700] text-[16px]">{product.price?.toLocaleString()} Fcfa</p>
                <p className="text-[12px] text-gray-400">Stock: {product.countInStock}</p>
                <p className="text-[12px] text-gray-400">{product.sales || 0} ventes</p>
              </div>
              <div className="flex gap-2">
                <Button className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-blue-50"
                  onClick={() => setEditProduct(product)}>
                  <AiOutlineEdit className="text-blue-600 text-[18px]" />
                </Button>
                <Button className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-red-50"
                  onClick={() => setDeleteId(product._id)}>
                  <BsTrash className="text-red-500 text-[18px]" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)} maxWidth="md" fullWidth>
        <DialogTitle className="!font-[600]">Ajouter un produit</DialogTitle>
        <DialogContent>
          <SellerAddProduct onSuccess={() => { setOpenAdd(false); loadProducts(); }} />
        </DialogContent>
      </Dialog>

      
      <Dialog open={!!editProduct} onClose={() => setEditProduct(null)} maxWidth="md" fullWidth>
        <DialogTitle className="!font-[600]">Modifier le produit</DialogTitle>
        <DialogContent>
          <SellerAddProduct product={editProduct} onSuccess={() => { setEditProduct(null); loadProducts(); }} />
        </DialogContent>
      </Dialog>

      
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent><p>Voulez-vous vraiment supprimer ce produit ?</p></DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Annuler</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Supprimer</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}*/}