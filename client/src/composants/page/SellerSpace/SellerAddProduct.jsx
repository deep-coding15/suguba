import { useState, useContext } from "react";
import MenuItem from "@mui/material/MenuItem";
import Rating from "@mui/material/Rating";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { IoMdClose } from "react-icons/io";
import { FaCloudUploadAlt } from "react-icons/fa";
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';
import { MyContext } from "../../../router";
import { postData, editImages, uploadImageCatProd } from "../../../utils/api";

export default function SellerAddProduct({ product = null, onSuccess }) {
  const context = useContext(MyContext);
  const isEdit = !!product;

  const [formField, setFormField] = useState({
    name: product?.name || "",
    description: product?.description || "",
    brand: product?.brand || "",
    price: product?.price || "",
    oldPrice: product?.oldPrice || "",
    catName: product?.catName || "",
    catId: product?.catId || "",
    subCat: product?.subCat || "",
    subCatId: product?.subCatId || "",
    thirdsubCat: product?.thirdsubCat || "",
    thirdsubCatId: product?.thirdsubCatId || "",
    countInStock: product?.countInStock || "",
    discount: product?.discount || 0,
    isFeatures: product?.isFeatures || false,
    rating: product?.rating || 0,
    size: product?.size || [],
  });

  const [previews, setPreviews] = useState(product?.images || []);
  const [productSize, setProductSize] = useState(product?.size || []);
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const onChangeInput = (e) => setFormField({ ...formField, [e.target.name]: e.target.value });

  const handleChangeCat = (e) => {
    const cat = context.catData?.find(c => c._id === e.target.value);
    setFormField({ ...formField, catId: e.target.value, catName: cat?.name || "", subCat: "", subCatId: "", thirdsubCat: "", thirdsubCatId: "" });
  };

  const handleChangeSubCat = (e) => {
    const parent = context.catData?.find(c => c._id === formField.catId);
    const sub = parent?.children?.find(s => s._id === e.target.value);
    setFormField({ ...formField, subCatId: e.target.value, subCat: sub?.name || "", thirdsubCat: "", thirdsubCatId: "" });
  };

  const handleChangeSize = (e) => {
    const v = e.target.value;
    setProductSize(typeof v === "string" ? v.split(",") : v);
    setFormField({ ...formField, size: v });
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    const formdata = new FormData();
    for (const f of files) formdata.append("images", f);
    const res = await uploadImageCatProd("/api/product/chargement-image", formdata);
    if (res?.data?.images) {
      setPreviews(prev => [...prev, ...res.data.images]);
    }
    setUploading(false);
  };

  const selectedCat = context.catData?.find(c => c._id === formField.catId);
  const selectedSubCat = selectedCat?.children?.find(s => s._id === formField.subCatId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formField.name) { context.alertBox("error", "Nom du produit requis"); return; }
    if (!formField.price) { context.alertBox("error", "Prix requis"); return; }
    if (!formField.catId) { context.alertBox("error", "Catégorie requise"); return; }
    if (previews.length === 0) { context.alertBox("error", "Au moins une image requise"); return; }

    setIsLoading(true);
    const payload = {
      ...formField,
      images: previews,
      sellerId: context.userData?._id,
      sellerName: context.userData?.name,
    };

    let res;
    if (isEdit) {
      res = await editImages(`/api/product/modification-produit/${product._id}`, payload);
      res = res?.data || res;
    } else {
      res = await postData("/api/product/creation-produit", payload);
    }

    if (res?.success) {
      context.alertBox("success", isEdit ? "Produit modifié !" : "Produit publié !");
      onSuccess?.();
    } else {
      context.alertBox("error", res?.message || "Erreur");
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 !py-2">
      <input type="text" name="name" value={formField.name} onChange={onChangeInput}
        placeholder="Nom du produit *" className="w-full h-[42px] border border-gray-200 rounded-md !px-3 text-[14px] focus:outline-none focus:border-primary" />

      <textarea name="description" value={formField.description} onChange={onChangeInput}
        placeholder="Description *" rows={3}
        className="w-full border border-gray-200 rounded-md !px-3 !py-2 text-[14px] focus:outline-none focus:border-primary" />

      <div className="grid grid-cols-2 gap-3">
        <Select size="small" value={formField.catId} onChange={handleChangeCat} displayEmpty>
          <MenuItem value=""><em>Catégorie *</em></MenuItem>
          {context.catData?.map(c => <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>)}
        </Select>
        <Select size="small" value={formField.subCatId} onChange={handleChangeSubCat} disabled={!formField.catId} displayEmpty>
          <MenuItem value=""><em>Sous-catégorie</em></MenuItem>
          {selectedCat?.children?.map(s => <MenuItem key={s._id} value={s._id}>{s.name}</MenuItem>)}
        </Select>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <input type="number" name="price" value={formField.price} onChange={onChangeInput}
          placeholder="Prix *" className="h-[42px] border border-gray-200 rounded-md !px-3 text-[14px] focus:outline-none" />
        <input type="number" name="oldPrice" value={formField.oldPrice} onChange={onChangeInput}
          placeholder="Ancien prix" className="h-[42px] border border-gray-200 rounded-md !px-3 text-[14px] focus:outline-none" />
        <input type="number" name="countInStock" value={formField.countInStock} onChange={onChangeInput}
          placeholder="Stock" className="h-[42px] border border-gray-200 rounded-md !px-3 text-[14px] focus:outline-none" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <input type="text" name="brand" value={formField.brand} onChange={onChangeInput}
          placeholder="Marque" className="h-[42px] border border-gray-200 rounded-md !px-3 text-[14px] focus:outline-none" />
        <input type="number" name="discount" value={formField.discount} onChange={onChangeInput}
          placeholder="Remise %" className="h-[42px] border border-gray-200 rounded-md !px-3 text-[14px] focus:outline-none" />
        <Select multiple size="small" value={productSize} onChange={handleChangeSize} displayEmpty>
          <MenuItem value="" disabled><em>Tailles</em></MenuItem>
          {["S", "M", "L", "XL", "2XL", "3XL"].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
        </Select>
      </div>

      <div>
        <p className="text-[13px] font-[500] !mb-2">Note</p>
        <Rating name="rating" value={formField.rating} precision={0.5}
          onChange={(e, v) => setFormField({ ...formField, rating: v })} />
      </div>
      

      {/* Images */}
      <div>
        <p className="text-[13px] font-[500] !mb-2">Images du produit</p>
        <div className="flex flex-wrap gap-2">
          {previews.map((img, i) => (
            <div key={i} className="relative w-[80px] h-[80px]">
              <span className="absolute -top-1 -right-1 w-[18px] h-[18px] bg-red-600 rounded-full flex items-center justify-center cursor-pointer z-10"
                onClick={() => setPreviews(prev => prev.filter((_, idx) => idx !== i))}>
                <IoMdClose className="text-white text-[12px]" />
              </span>
              <LazyLoadImage src={img} effect="blur" className="w-full h-full object-cover rounded-md" />
            </div>
          ))}
          <label className="w-[80px] h-[80px] border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:border-primary">
            {uploading ? <CircularProgress size={20} /> : <FaCloudUploadAlt className="text-[24px] text-gray-400" />}
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
          </label>
        </div>
      </div>

      <Button type="submit" className="btn-org btn-lg w-full flex gap-2" disabled={isLoading}>
        {isLoading ? <CircularProgress size={20} color="inherit" /> : (
          <><FaCloudUploadAlt className="text-[18px]" /> {isEdit ? "Modifier le produit" : "Publier le produit"}</>
        )}
      </Button>
    </form>
  );
}