import { useState, useEffect, useContext } from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { IoMdClose } from 'react-icons/io';
import { FaCloudUploadAlt, FaStarOfLife, FaFire } from 'react-icons/fa';
import { MdCheckCircle, MdCancel, MdPending, MdStars, MdLocalOffer } from 'react-icons/md';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { MyContext } from '../../App';
import { uploadImageCatProd, postData, fetchDataFromApi } from '../../utils/api';

export default function AddHomeSlide() {
  const context = useContext(MyContext);
  // 0: créer slide | 1: demandes Vedette | 2: demandes Offre Spéciale
  const [tab, setTab] = useState(0);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formField, setFormField] = useState({ title: "", subtitle: "", link: "/", order: 0, isActive: true });

  // Demandes Vedette (mise en avant)
  const [featuredRequests, setFeaturedRequests] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(false);

  // ✅ Demandes Offre Spéciale
  const [specialOfferRequests, setSpecialOfferRequests] = useState([]);
  const [loadingSpecial, setLoadingSpecial] = useState(false);

  // Dialog action
  const [actionDialog, setActionDialog] = useState({ open: false, product: null, action: "", type: "" });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (tab === 1) loadFeaturedRequests();
    if (tab === 2) loadSpecialOfferRequests();
  }, [tab]);

  const loadFeaturedRequests = () => {
    setLoadingFeatured(true);
    fetchDataFromApi("/api/product/demandes-mise-en-avant").then((res) => {
      setFeaturedRequests(res?.data || []);
      setLoadingFeatured(false);
    });
  };

  const loadSpecialOfferRequests = () => {
    setLoadingSpecial(true);
    fetchDataFromApi("/api/product/demandes-offre-speciale").then((res) => {
      setSpecialOfferRequests(res?.data || []);
      setLoadingSpecial(false);
    });
  };

  // Upload images slide
  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    const formdata = new FormData();
    for (const f of files) formdata.append("images", f);
    const res = await uploadImageCatProd("/api/homeslider/upload", formdata);
    if (res?.data?.images) {
      setPreviews(prev => [...prev, ...res.data.images]);
    } else {
      context.alertBox("error", "Erreur lors de l'upload");
    }
    setUploading(false);
  };

  const removePreview = (index) => setPreviews(prev => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (previews.length === 0) { context.alertBox("error", "Veuillez uploader au moins une image"); return; }
    setIsLoading(true);
    for (const img of previews) {
      await postData("/api/homeslider", { ...formField, image: img });
    }
    context.alertBox("success", `${previews.length} slide(s) créé(s) avec succès`);
    setPreviews([]);
    setFormField({ title: "", subtitle: "", link: "/", order: 0, isActive: true });
    setIsLoading(false);
  };

  // Action (approuver/rejeter) — Vedette ou Offre Spéciale
  const handleAction = () => {
    if (!actionDialog.product) return;
    setActionLoading(true);

    const url = actionDialog.type === "featured"
      ? "/api/product/gestion-mise-en-avant"
      : "/api/product/gestion-offre-speciale";

    postData(url, {
      productId: actionDialog.product._id,
      action: actionDialog.action
    }).then((res) => {
      if (res?.success) {
        context.alertBox("success", res.message);
        if (actionDialog.type === "featured") loadFeaturedRequests();
        else loadSpecialOfferRequests();
      } else {
        context.alertBox("error", res?.message || "Erreur");
      }
      setActionLoading(false);
      setActionDialog({ open: false, product: null, action: "", type: "" });
    });
  };

  // Composant liste demandes (réutilisé pour Vedette et Offre Spéciale)
  const RequestsList = ({ items, loading, type }) => {
    if (loading) return <div className="flex justify-center !py-10"><CircularProgress /></div>;
    if (items.length === 0) return (
      <div className="text-center !py-16 text-gray-400">
        <MdPending className="text-[50px] !mx-auto !mb-3 opacity-30" />
        <p>Aucune demande en attente</p>
      </div>
    );
    return (
      <div className="flex flex-col gap-4">
        {items.map((product) => (
          <div key={product._id} className="border border-gray-200 rounded-xl !p-4 flex items-center gap-4 hover:shadow-sm transition-all">
            <img src={product.images?.[0]} className="w-[70px] h-[70px] object-cover rounded-xl flex-shrink-0" alt={product.name} />
            <div className="flex-1 min-w-0">
              <h3 className="text-[14px] font-[700] truncate">{product.name}</h3>
              <p className="text-[12px] text-gray-500 !mb-1">{product.catName} · {product.price?.toLocaleString()} Fcfa</p>
              <div className="flex items-center gap-2">
                <span className="text-[11px] bg-gray-100 text-gray-600 !px-2 !py-1 rounded-full">Stock: {product.countInStock}</span>
                <span className={`text-[11px] !px-2 !py-1 rounded-full flex items-center gap-1 ${type === "featured" ? "bg-yellow-100 text-yellow-700" : "bg-orange-100 text-orange-700"}`}>
                  {type === "featured" ? <FaStarOfLife className="text-[9px]" /> : <FaFire className="text-[9px]" />}
                  Commission 15% si approuvé
                </span>
              </div>
            </div>
            <div className="text-center flex-shrink-0">
              <div className="w-[40px] h-[40px] rounded-full overflow-hidden bg-gray-100 !mx-auto !mb-1 flex items-center justify-center">
                {product.sellerId?.avatar
                  ? <img src={product.sellerId.avatar} className="w-full h-full object-cover" alt="" />
                  : <span className="text-[14px] font-[700] text-gray-500">{product.sellerId?.name?.[0]}</span>
                }
              </div>
              <p className="text-[11px] font-[600] text-gray-700">{product.sellerId?.name}</p>
              <p className="text-[10px] text-gray-400">{product.sellerId?.email}</p>
              <p className="text-[10px] text-gray-400">
                Demandé le {new Date(
                  type === "featured" ? product.featuredRequest?.requestedAt : product.specialOfferRequest?.requestedAt
                ).toLocaleDateString("fr-FR")}
              </p>
            </div>
            <div className="flex flex-col gap-2 flex-shrink-0">
              <Button size="small" variant="contained" color="success"
                className="!capitalize !text-[12px] flex gap-1"
                onClick={() => setActionDialog({ open: true, product, action: "approve", type })}>
                <MdCheckCircle /> Approuver
              </Button>
              <Button size="small" variant="outlined" color="error"
                className="!capitalize !text-[12px] flex gap-1"
                onClick={() => setActionDialog({ open: true, product, action: "reject", type })}>
                <MdCancel /> Rejeter
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <section className="!p-5 bg-gray-50 min-h-full">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <Tabs value={tab} onChange={(_, v) => setTab(v)} className="border-b border-gray-100 !px-4">
          <Tab label="Créer un slide" className="!capitalize !text-[14px]" />
          <Tab
            label={
              <div className="flex items-center gap-2">
                <MdStars className="text-yellow-500" /> Vedette
                {featuredRequests.length > 0 && (
                  <span className="w-[20px] h-[20px] bg-yellow-500 text-white text-[11px] font-[700] rounded-full flex items-center justify-center">
                    {featuredRequests.length}
                  </span>
                )}
              </div>
            }
            className="!capitalize !text-[14px]"
          />
          <Tab
            label={
              <div className="flex items-center gap-2">
                <MdLocalOffer className="text-orange-500" /> Offre Spéciale
                {specialOfferRequests.length > 0 && (
                  <span className="w-[20px] h-[20px] bg-orange-500 text-white text-[11px] font-[700] rounded-full flex items-center justify-center">
                    {specialOfferRequests.length}
                  </span>
                )}
              </div>
            }
            className="!capitalize !text-[14px]"
          />
        </Tabs>

        {/* ── Onglet 0 : Créer un slide ─────────────────────────────────── */}
        {tab === 0 && (
          <form onSubmit={handleSubmit} className="!p-6 flex flex-col gap-5">
            <h2 className="text-[16px] font-[700]">Ajouter des slides à l'accueil</h2>
            <div>
              <p className="text-[13px] font-[600] text-gray-700 !mb-3">Images du slide *</p>
              <div className="grid grid-cols-6 gap-3">
                {previews.map((img, i) => (
                  <div key={i} className="relative rounded-xl overflow-hidden border border-gray-200 h-[120px] group">
                    <span className="absolute w-[22px] h-[22px] rounded-full bg-red-600 -top-1 -right-1 flex items-center justify-center z-50 cursor-pointer shadow-md"
                      onClick={() => removePreview(i)}>
                      <IoMdClose className="text-white text-[14px]" />
                    </span>
                    <LazyLoadImage src={img} alt="slide" effect="blur" className="w-full h-full object-cover group-hover:scale-105 transition-all" />
                  </div>
                ))}
                <label className="h-[120px] rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-pink-50 transition-all">
                  {uploading ? <CircularProgress size={24} /> : (
                    <><FaCloudUploadAlt className="text-[28px] text-gray-400 !mb-1" /><span className="text-[11px] text-gray-400">+ Image</span></>
                  )}
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <TextField label="Titre (optionnel)" size="small" value={formField.title} onChange={e => setFormField({ ...formField, title: e.target.value })} fullWidth />
              <TextField label="Sous-titre (optionnel)" size="small" value={formField.subtitle} onChange={e => setFormField({ ...formField, subtitle: e.target.value })} fullWidth />
              <TextField label="Lien (ex: /listeProduits)" size="small" value={formField.link} onChange={e => setFormField({ ...formField, link: e.target.value })} fullWidth />
              <TextField label="Ordre d'affichage" size="small" type="number" value={formField.order} onChange={e => setFormField({ ...formField, order: Number(e.target.value) })} fullWidth />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={formField.isActive} onChange={e => setFormField({ ...formField, isActive: e.target.checked })} color="primary" />
              <span className="text-[13px] text-gray-700">Slide actif (visible sur l'accueil)</span>
            </div>
            <Button type="submit" disabled={isLoading || previews.length === 0}
              className="btn-pink w-full flex gap-2 !capitalize !text-[14px] !font-[600]">
              {isLoading ? <CircularProgress size={20} color="inherit" /> : (
                <><FaCloudUploadAlt className="text-[18px]" /> Publier {previews.length > 1 ? `${previews.length} slides` : "le slide"}</>
              )}
            </Button>
          </form>
        )}

        {/* ── Onglet 1 : Demandes Vedette ───────────────────────────────── */}
        {tab === 1 && (
          <div className="!p-6">
            <div className="flex items-center justify-between !mb-5">
              <div>
                <h2 className="text-[16px] font-[700]">⭐ Demandes Vedette</h2>
                <p className="text-[13px] text-gray-500">Produits à mettre en avant dans le carrousel Vedettes (commission 15%)</p>
              </div>
              <Button size="small" onClick={loadFeaturedRequests} className="!capitalize !text-[12px]">Actualiser</Button>
            </div>
            <RequestsList items={featuredRequests} loading={loadingFeatured} type="featured" />
          </div>
        )}

        {/* ── Onglet 2 : Demandes Offre Spéciale ────────────────────────── */}
        {tab === 2 && (
          <div className="!p-6">
            <div className="flex items-center justify-between !mb-5">
              <div>
                <h2 className="text-[16px] font-[700]">🔥 Demandes Offre Spéciale</h2>
                <p className="text-[13px] text-gray-500">Produits à afficher dans la section bannière promo de l'accueil (commission 15%)</p>
              </div>
              <Button size="small" onClick={loadSpecialOfferRequests} className="!capitalize !text-[12px]">Actualiser</Button>
            </div>
            <RequestsList items={specialOfferRequests} loading={loadingSpecial} type="special" />
          </div>
        )}
      </div>

      {/* Dialog confirmation action */}
      <Dialog open={actionDialog.open} onClose={() => setActionDialog({ open: false, product: null, action: "", type: "" })}>
        <DialogTitle className="!font-[700]">
          {actionDialog.action === "approve"
            ? (actionDialog.type === "featured" ? "✅ Approuver la Vedette" : "✅ Approuver l'Offre Spéciale")
            : "❌ Rejeter la demande"}
        </DialogTitle>
        <DialogContent>
          {actionDialog.product && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl !p-3">
                <img src={actionDialog.product.images?.[0]} className="w-[45px] h-[45px] object-cover rounded-lg" alt="" />
                <div>
                  <p className="font-[600] text-[13px]">{actionDialog.product.name}</p>
                  <p className="text-[12px] text-gray-500">Vendeur: {actionDialog.product.sellerId?.name}</p>
                </div>
              </div>
              {actionDialog.action === "approve" ? (
                <p className="text-[13px] text-gray-700">
                  {actionDialog.type === "featured"
                    ? <>En approuvant, ce produit sera ajouté au <strong>carrousel Vedettes ⭐</strong> de l'accueil. Commission : <strong className="text-orange-600">15%</strong>.</>
                    : <>En approuvant, ce produit sera affiché dans la <strong>section bannière Offre Spéciale 🔥</strong> de l'accueil. Commission : <strong className="text-orange-600">15%</strong>.</>
                  }
                </p>
              ) : (
                <p className="text-[13px] text-gray-700">La demande sera rejetée. Le vendeur pourra soumettre une nouvelle demande.</p>
              )}
            </div>
          )}
        </DialogContent>
        <DialogActions className="!px-5 !pb-4">
          <Button onClick={() => setActionDialog({ open: false, product: null, action: "", type: "" })} className="!capitalize">Annuler</Button>
          <Button onClick={handleAction} disabled={actionLoading}
            color={actionDialog.action === "approve" ? "success" : "error"}
            variant="contained" className="!capitalize flex gap-1">
            {actionLoading ? <CircularProgress size={16} color="inherit" /> : (
              actionDialog.action === "approve" ? <><MdCheckCircle /> Approuver et publier</> : <><MdCancel /> Rejeter</>
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
}





{/*import { useState, useEffect, useContext } from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { IoMdClose } from 'react-icons/io';
import { FaCloudUploadAlt, FaStarOfLife } from 'react-icons/fa';
import { MdCheckCircle, MdCancel, MdPending } from 'react-icons/md';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { MyContext } from '../../App';
import { uploadImageCatProd, postData, fetchDataFromApi } from '../../utils/api';

export default function AddHomeSlide() {
  const context = useContext(MyContext);
  const [tab, setTab] = useState(0); // 0: créer slide, 1: demandes mise en avant
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formField, setFormField] = useState({ title: "", subtitle: "", link: "/", order: 0, isActive: true });

  // Demandes mise en avant
  const [featuredRequests, setFeaturedRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [actionDialog, setActionDialog] = useState({ open: false, product: null, action: "" });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (tab === 1) loadFeaturedRequests();
  }, [tab]);

  const loadFeaturedRequests = () => {
    setLoadingRequests(true);
    fetchDataFromApi("/api/product/demandes-mise-en-avant").then((res) => {
      setFeaturedRequests(res?.data || []);
      setLoadingRequests(false);
    });
  };

  // Upload images
  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    const formdata = new FormData();
    for (const f of files) formdata.append("images", f);
    const res = await uploadImageCatProd("/api/homeslider/upload", formdata);
    if (res?.data?.images) {
      setPreviews(prev => [...prev, ...res.data.images]);
    } else {
      context.alertBox("error", "Erreur lors de l'upload");
    }
    setUploading(false);
  };

  const removePreview = (index) => setPreviews(prev => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (previews.length === 0) { context.alertBox("error", "Veuillez uploader au moins une image"); return; }
    setIsLoading(true);
    // Créer un slide pour chaque image uploadée
    for (const img of previews) {
      await postData("/api/homeslider", { ...formField, image: img });
    }
    context.alertBox("success", `${previews.length} slide(s) créé(s) avec succès`);
    setPreviews([]);
    setFormField({ title: "", subtitle: "", link: "/", order: 0, isActive: true });
    setIsLoading(false);
  };

  // Approuver ou rejeter une demande de mise en avant
  const handleFeaturedAction = () => {
    if (!actionDialog.product) return;
    setActionLoading(true);
    postData("/api/product/gestion-mise-en-avant", {
      productId: actionDialog.product._id,
      action: actionDialog.action
    }).then((res) => {
      if (res?.success) {
        context.alertBox("success", res.message);
        loadFeaturedRequests();
      } else {
        context.alertBox("error", res?.message || "Erreur");
      }
      setActionLoading(false);
      setActionDialog({ open: false, product: null, action: "" });
    });
  };

  return (
    <section className="!p-5 bg-gray-50 min-h-full">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <Tabs value={tab} onChange={(_, v) => setTab(v)} className="border-b border-gray-100 !px-4">
          <Tab label="Créer un slide" className="!capitalize !text-[14px]" />
          <Tab
            label={
              <div className="flex items-center gap-2">
                Demandes mise en avant
                {featuredRequests.length > 0 && (
                  <span className="w-[20px] h-[20px] bg-red-500 text-white text-[11px] font-[700] rounded-full flex items-center justify-center">
                    {featuredRequests.length}
                  </span>
                )}
              </div>
            }
            className="!capitalize !text-[14px]"
          />
        </Tabs>

        
        {tab === 0 && (
          <form onSubmit={handleSubmit} className="!p-6 flex flex-col gap-5">
            <h2 className="text-[16px] font-[700]">Ajouter des slides à l'accueil</h2>

           
            <div>
              <p className="text-[13px] font-[600] text-gray-700 !mb-3">Images du slide *</p>
              <div className="grid grid-cols-6 gap-3">
                {previews.map((img, i) => (
                  <div key={i} className="relative rounded-xl overflow-hidden border border-gray-200 h-[120px] group">
                    <span
                      className="absolute w-[22px] h-[22px] rounded-full bg-red-600 -top-1 -right-1 flex items-center justify-center z-50 cursor-pointer shadow-md"
                      onClick={() => removePreview(i)}>
                      <IoMdClose className="text-white text-[14px]" />
                    </span>
                    <LazyLoadImage
                      src={img} alt="slide" effect="blur"
                      className="w-full h-full object-cover group-hover:scale-105 transition-all" />
                  </div>
                ))}
                <label className="h-[120px] rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-pink-50 transition-all">
                  {uploading ? <CircularProgress size={24} /> : (
                    <>
                      <FaCloudUploadAlt className="text-[28px] text-gray-400 !mb-1" />
                      <span className="text-[11px] text-gray-400">+ Image</span>
                    </>
                  )}
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
            </div>

            
            <div className="grid grid-cols-2 gap-4">
              <TextField label="Titre (optionnel)" size="small" value={formField.title}
                onChange={e => setFormField({ ...formField, title: e.target.value })} fullWidth />
              <TextField label="Sous-titre (optionnel)" size="small" value={formField.subtitle}
                onChange={e => setFormField({ ...formField, subtitle: e.target.value })} fullWidth />
              <TextField label="Lien (ex: /listeProduits)" size="small" value={formField.link}
                onChange={e => setFormField({ ...formField, link: e.target.value })} fullWidth />
              <TextField label="Ordre d'affichage" size="small" type="number" value={formField.order}
                onChange={e => setFormField({ ...formField, order: Number(e.target.value) })} fullWidth />
            </div>

            <div className="flex items-center gap-2">
              <Switch checked={formField.isActive}
                onChange={e => setFormField({ ...formField, isActive: e.target.checked })} color="primary" />
              <span className="text-[13px] text-gray-700">Slide actif (visible sur l'accueil)</span>
            </div>

            <Button type="submit" disabled={isLoading || previews.length === 0}
              className="btn-pink w-full flex gap-2 !capitalize !text-[14px] !font-[600]">
              {isLoading ? <CircularProgress size={20} color="inherit" /> : (
                <><FaCloudUploadAlt className="text-[18px]" /> Publier {previews.length > 1 ? `${previews.length} slides` : "le slide"}</>
              )}
            </Button>
          </form>
        )}

        
        {tab === 1 && (
          <div className="!p-6">
            <div className="flex items-center justify-between !mb-5">
              <div>
                <h2 className="text-[16px] font-[700]">Demandes de mise en avant</h2>
                <p className="text-[13px] text-gray-500">
                  Vendeurs souhaitant mettre un produit en avant sur l'accueil (commission 15%)
                </p>
              </div>
              <Button size="small" onClick={loadFeaturedRequests} className="!capitalize !text-[12px]">
                Actualiser
              </Button>
            </div>

            {loadingRequests ? (
              <div className="flex justify-center !py-10"><CircularProgress /></div>
            ) : featuredRequests.length === 0 ? (
              <div className="text-center !py-16 text-gray-400">
                <MdPending className="text-[50px] !mx-auto !mb-3 opacity-30" />
                <p>Aucune demande en attente</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {featuredRequests.map((product) => (
                  <div key={product._id} className="border border-gray-200 rounded-xl !p-4 flex items-center gap-4 hover:shadow-sm transition-all">
                   
                    <img src={product.images?.[0]} className="w-[70px] h-[70px] object-cover rounded-xl flex-shrink-0" alt={product.name} />

                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[14px] font-[700] truncate">{product.name}</h3>
                      <p className="text-[12px] text-gray-500 !mb-1">{product.catName} · {product.price?.toLocaleString()} Fcfa</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] bg-gray-100 text-gray-600 !px-2 !py-1 rounded-full">
                          Stock: {product.countInStock}
                        </span>
                        <span className="text-[11px] bg-yellow-100 text-yellow-700 !px-2 !py-1 rounded-full flex items-center gap-1">
                          <FaStarOfLife className="text-[9px]" /> Commission 15% si approuvé
                        </span>
                      </div>
                    </div>

                   
                    <div className="text-center flex-shrink-0">
                      <div className="w-[40px] h-[40px] rounded-full overflow-hidden bg-gray-100 !mx-auto !mb-1 flex items-center justify-center">
                        {product.sellerId?.avatar
                          ? <img src={product.sellerId.avatar} className="w-full h-full object-cover" />
                          : <span className="text-[14px] font-[700] text-gray-500">{product.sellerId?.name?.[0]}</span>
                        }
                      </div>
                      <p className="text-[11px] font-[600] text-gray-700">{product.sellerId?.name}</p>
                      <p className="text-[10px] text-gray-400">{product.sellerId?.email}</p>
                      <p className="text-[10px] text-gray-400">
                        Demandé le {new Date(product.featuredRequest?.requestedAt).toLocaleDateString("fr-FR")}
                      </p>
                    </div>

                    
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <Button
                        size="small" variant="contained" color="success"
                        className="!capitalize !text-[12px] flex gap-1"
                        onClick={() => setActionDialog({ open: true, product, action: "approve" })}>
                        <MdCheckCircle /> Approuver
                      </Button>
                      <Button
                        size="small" variant="outlined" color="error"
                        className="!capitalize !text-[12px] flex gap-1"
                        onClick={() => setActionDialog({ open: true, product, action: "reject" })}>
                        <MdCancel /> Rejeter
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

     
      <Dialog open={actionDialog.open} onClose={() => setActionDialog({ open: false, product: null, action: "" })}>
        <DialogTitle className="!font-[700]">
          {actionDialog.action === "approve" ? "✅ Approuver la mise en avant" : "❌ Rejeter la demande"}
        </DialogTitle>
        <DialogContent>
          {actionDialog.product && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl !p-3">
                <img src={actionDialog.product.images?.[0]} className="w-[45px] h-[45px] object-cover rounded-lg" />
                <div>
                  <p className="font-[600] text-[13px]">{actionDialog.product.name}</p>
                  <p className="text-[12px] text-gray-500">Vendeur: {actionDialog.product.sellerId?.name}</p>
                </div>
              </div>
              {actionDialog.action === "approve" ? (
                <p className="text-[13px] text-gray-700">
                  En approuvant, ce produit sera automatiquement ajouté au <strong>carrousel de l'accueil</strong> avec un bouton "Ajouter au panier".
                  La commission passera à <strong className="text-orange-600">15%</strong> pour ce produit.
                </p>
              ) : (
                <p className="text-[13px] text-gray-700">
                  La demande sera rejetée. Le vendeur sera informé et pourra soumettre une nouvelle demande.
                </p>
              )}
            </div>
          )}
        </DialogContent>
        <DialogActions className="!px-5 !pb-4">
          <Button onClick={() => setActionDialog({ open: false, product: null, action: "" })} className="!capitalize">Annuler</Button>
          <Button
            onClick={handleFeaturedAction} disabled={actionLoading}
            color={actionDialog.action === "approve" ? "success" : "error"}
            variant="contained" className="!capitalize flex gap-1">
            {actionLoading ? <CircularProgress size={16} color="inherit" /> : (
              actionDialog.action === "approve" ? <><MdCheckCircle /> Approuver et publier</> : <><MdCancel /> Rejeter</>
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
}
*/}



{/*import UploadBox from "../UploadBox";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { IoMdClose } from 'react-icons/io';
import { FaCloudUploadAlt } from 'react-icons/fa';
import Button from '@mui/material/Button';

export default function AddHomeSlide(){
    return(
        
            <>
             <section className="p-5 bg-gray-50">
               <form className="form !py-3 p-8">
                <div className='scroll max-h-[72hv] overflow-y-scroll pr-4 pt-4'>
                     <div className="grid grid-cols-7 gap-4">
                                            <div className='uploadBoxWrapper relative'>
                                             <span className='absolute w-[20px] h-[20px] rounded-full overflow-hidden bg-red-700 -top-[5px] -right-[5px]
                                              flex items-center justify-center z-50 cursor-pointer'><IoMdClose className='text-white text-[17px]'/> </span>
                                            <div className='uploadBox !p-0 rounded-md overflow-hidden border border-dashed  border-[rgba(0,0,0,0.3)] 
                                            h-[150px] w-[100%] bg-gray-100 cursor-pointer hover:bg-gray-200 flex items-center justify-center flex-col relative'>
                                             <LazyLoadImage
                                            
                                           alt={"image"}
                                           effect="blur"
                                             wrapperProps={{ style: {transitionDelay: "1s"},}}
                                             src={"https://printfresh.com/cdn/shop/files/PF_SP26_Spa_Day_Pink_Polish_Long_Robe_003.jpg?v=1774644012&width=600"}
                                             className="w-full h-full object-cover" />
                         
                                          </div>
                                            </div>
                                            <div className='uploadBoxWrapper relative'>
                                             <span className='absolute w-[20px] h-[20px] rounded-full overflow-hidden bg-red-700 -top-[5px] -right-[5px]
                                              flex items-center justify-center z-50 cursor-pointer'><IoMdClose className='text-white text-[17px]'/> </span>
                                            <div className='uploadBox !p-0 rounded-md overflow-hidden border border-dashed  border-[rgba(0,0,0,0.3)] 
                                            h-[150px] w-[100%] bg-gray-100 cursor-pointer hover:bg-gray-200 flex items-center justify-center flex-col relative'>
                                             <LazyLoadImage
                                            
                                           alt={"image"}
                                           effect="blur"
                                             wrapperProps={{ style: {transitionDelay: "1s"},}}
                                             src={"https://printfresh.com/cdn/shop/files/PF_SP26_Spa_Day_Pink_Polish_Long_Robe_003.jpg?v=1774644012&width=600"}
                                             className="w-full h-full object-cover" />
                         
                                          </div>
                                            </div>
                                             <div className='uploadBoxWrapper relative'>
                                             <span className='absolute w-[20px] h-[20px] rounded-full overflow-hidden bg-red-700 -top-[5px] -right-[5px]
                                              flex items-center justify-center z-50 cursor-pointer'><IoMdClose className='text-white text-[17px]'/> </span>
                                            <div className='uploadBox !p-0 rounded-md overflow-hidden border border-dashed  border-[rgba(0,0,0,0.3)] 
                                            h-[150px] w-[100%] bg-gray-100 cursor-pointer hover:bg-gray-200 flex items-center justify-center flex-col relative'>
                                             <LazyLoadImage
                                            
                                           alt={"image"}
                                           effect="blur"
                                             wrapperProps={{ style: {transitionDelay: "1s"},}}
                                             src={"https://printfresh.com/cdn/shop/files/PF_SP26_Spa_Day_Pink_Polish_Long_Robe_003.jpg?v=1774644012&width=600"}
                                             className="w-full h-full object-cover" />
                         
                                          </div>
                                            </div>
                                             <div className='uploadBoxWrapper relative'>
                                             <span className='absolute w-[20px] h-[20px] rounded-full overflow-hidden bg-red-700 -top-[5px] -right-[5px]
                                              flex items-center justify-center z-50 cursor-pointer'><IoMdClose className='text-white text-[17px]'/> </span>
                                            <div className='uploadBox !p-0 rounded-md overflow-hidden border border-dashed  border-[rgba(0,0,0,0.3)] 
                                            h-[150px] w-[100%] bg-gray-100 cursor-pointer hover:bg-gray-200 flex items-center justify-center flex-col relative'>
                                             <LazyLoadImage
                                            
                                           alt={"image"}
                                           effect="blur"
                                             wrapperProps={{ style: {transitionDelay: "1s"},}}
                                             src={"https://printfresh.com/cdn/shop/files/PF_SP26_Spa_Day_Pink_Polish_Long_Robe_003.jpg?v=1774644012&width=600"}
                                             className="w-full h-full object-cover" />
                         
                                          </div>
                                            </div>
                                             <div className='uploadBoxWrapper relative'>
                                             <span className='absolute w-[20px] h-[20px] rounded-full overflow-hidden bg-red-700 -top-[5px] -right-[5px]
                                              flex items-center justify-center z-50 cursor-pointer'><IoMdClose className='text-white text-[17px]'/> </span>
                                            <div className='uploadBox !p-0 rounded-md overflow-hidden border border-dashed  border-[rgba(0,0,0,0.3)] 
                                            h-[150px] w-[100%] bg-gray-100 cursor-pointer hover:bg-gray-200 flex items-center justify-center flex-col relative'>
                                             <LazyLoadImage
                                            
                                           alt={"image"}
                                           effect="blur"
                                             wrapperProps={{ style: {transitionDelay: "1s"},}}
                                             src={"https://printfresh.com/cdn/shop/files/PF_SP26_Spa_Day_Pink_Polish_Long_Robe_003.jpg?v=1774644012&width=600"}
                                             className="w-full h-full object-cover" />
                         
                                          </div>
                                            </div>
                                             <div className='uploadBoxWrapper relative'>
                                             <span className='absolute w-[20px] h-[20px] rounded-full overflow-hidden bg-red-700 -top-[5px] -right-[5px]
                                              flex items-center justify-center z-50 cursor-pointer'><IoMdClose className='text-white text-[17px]'/> </span>
                                            <div className='uploadBox !p-0 rounded-md overflow-hidden border border-dashed  border-[rgba(0,0,0,0.3)] 
                                            h-[150px] w-[100%] bg-gray-100 cursor-pointer hover:bg-gray-200 flex items-center justify-center flex-col relative'>
                                             <LazyLoadImage
                                            
                                           alt={"image"}
                                           effect="blur"
                                             wrapperProps={{ style: {transitionDelay: "1s"},}}
                                             src={"https://printfresh.com/cdn/shop/files/PF_SP26_Spa_Day_Pink_Polish_Long_Robe_003.jpg?v=1774644012&width=600"}
                                             className="w-full h-full object-cover" />
                         
                                          </div>
                                            </div>
                                            <UploadBox multiple={true}/>
                         </div>
                </div>
                
                <br/>
                <div className="w-[350px]">
                <Button type="button" className="btn-pink btn-lg w-full flex gap-2">
                    <FaCloudUploadAlt className='text-[25px] text-white'/>Publier et voir
                </Button>
                </div>
               </form>
                </section>
            </>
        
    )
}*/}