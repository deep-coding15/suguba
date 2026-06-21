import MenuItem from '@mui/material/MenuItem';
import Rating from '@mui/material/Rating';
import Select from '@mui/material/Select';
import { useContext, useState, useEffect } from 'react';
import UploadBox from '../UploadBox';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { IoMdClose } from 'react-icons/io';
import { FaCloudUploadAlt } from 'react-icons/fa';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { MyContext } from '../../App';
import { fetchDataFromApi, editImages } from '../../utils/api';

export default function EditProduct() {
    const context = useContext(MyContext);

    // ✅ Récupération de l'id depuis le context (pas besoin de prop)
    const productId = context?.isOpenFullScreen?.id;

    const [productSize, setProductSize] = useState([]);
    const [previews,    setPreviews]    = useState([]);
    const [isLoading,   setIsLoading]   = useState(false);
    const [isFetching,  setIsFetching]  = useState(true);

    const [formField, setFormField] = useState({
        name:           "",
        description:    "",
        brand:          "",
        price:          "",
        oldPrice:       "",
        catName:        "",
        catId:          "",
        subCat:         "",
        subCatId:       "",
        thirdsubCat:    "",
        thirdsubCatId:  "",
        countInStock:   "",
        discount:       "",
        isFeatures:     false,
        rating:         0,
        size:           [],
    });

    // ═══════════════════════════════════════════════════════════════════════
    // 1. CHARGEMENT DU PRODUIT EXISTANT
    //    ✅ Route : GET /api/product/produit/:id
    // ═══════════════════════════════════════════════════════════════════════
    useEffect(() => {
        if (!productId) return;
        setIsFetching(true);
        fetchDataFromApi(`/api/product/produit/${productId}`)
            .then((res) => {
                if (res?.produits) {
                    const p = res.produits;
                    setFormField({
                        name:          p.name          || "",
                        description:   p.description   || "",
                        brand:         p.brand         || "",
                        price:         p.price         || "",
                        oldPrice:      p.oldPrice      || "",
                        catName:       p.catName       || "",
                        catId:         p.catId         || "",
                        subCat:        p.subCat        || "",
                        subCatId:      p.subCatId      || "",
                        thirdsubCat:   p.thirdsubCat   || "",
                        thirdsubCatId: p.thirdsubCatId || "",
                        countInStock:  p.countInStock  || "",
                        discount:      p.discount      || "",
                        isFeatures:    p.isFeatures    || false,
                        rating:        p.rating        || 0,
                        size:          p.size          || [],
                    });
                    setPreviews(p.images || []);
                    setProductSize(p.size || []);
                }
            })
            .finally(() => setIsFetching(false));
    }, [productId]);

    // ═══════════════════════════════════════════════════════════════════════
    // HANDLERS (identiques à AddProduct)
    // ═══════════════════════════════════════════════════════════════════════
    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setFormField(prev => ({ ...prev, [name]: value }));
    };

    const handleChangeCat = (e) => {
        const selectedId  = e.target.value;
        const selectedCat = context?.catData?.find(c => c._id === selectedId);
        setFormField(prev => ({
            ...prev,
            catId:         selectedId,
            catName:       selectedCat?.name || "",
            subCat:        "", subCatId:        "",
            thirdsubCat:   "", thirdsubCatId:   ""
        }));
    };

    const handleChangeSubCat = (e) => {
        const selectedId  = e.target.value;
        const parentCat   = context?.catData?.find(c => c._id === formField.catId);
        const selectedSub = parentCat?.children?.find(s => s._id === selectedId);
        setFormField(prev => ({
            ...prev,
            subCatId:      selectedId,
            subCat:        selectedSub?.name || "",
            thirdsubCat:   "", thirdsubCatId: ""
        }));
    };

    const handleChangeThirdCat = (e) => {
        const selectedId    = e.target.value;
        const parentCat     = context?.catData?.find(c => c._id === formField.catId);
        const parentSub     = parentCat?.children?.find(s => s._id === formField.subCatId);
        const selectedThird = parentSub?.children?.find(t => t._id === selectedId);
        setFormField(prev => ({
            ...prev,
            thirdsubCatId: selectedId,
            thirdsubCat:   selectedThird?.name || ""
        }));
    };

    const handleChangeSize = (e) => {
        const { target: { value } } = e;
        setProductSize(typeof value === "string" ? value.split(",") : value);
        setFormField(prev => ({ ...prev, size: value }));
    };

    const handleChangeFeatured = (e) => {
        setFormField(prev => ({ ...prev, isFeatures: e.target.value === "true" }));
    };

    const handleChangeRating = (e, newVal) => {
        setFormField(prev => ({ ...prev, rating: newVal }));
    };

    const setPreviewsFun = (images) => {
        setPreviews(prev => [...prev, ...images]);
    };

    const removeImage = (index) => {
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    // ═══════════════════════════════════════════════════════════════════════
    // 2. SOUMISSION — UPDATE
    //    ✅ Route : PUT /api/product/modification-produit/:id
    //    ✅ Fonction : editImages de api.js
    // ═══════════════════════════════════════════════════════════════════════
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formField.name)        return context.alertBox("error", "Veuillez fournir le nom du produit");
        if (!formField.description) return context.alertBox("error", "Veuillez fournir la description");
        if (!formField.catId)       return context.alertBox("error", "Veuillez sélectionner une catégorie");
        if (!formField.price)       return context.alertBox("error", "Veuillez fournir le prix");
        if (previews.length === 0)  return context.alertBox("error", "Veuillez ajouter au moins une image");

        setIsLoading(true);

        editImages(`/api/product/modification-produit/${productId}`, {
            ...formField,
            images: previews
        }).then((res) => {
            if (res?.success) {
                context.alertBox("success", res?.message || "Produit modifié avec succès");
                context.setIsOpenFullScreen({ open: false });
            } else {
                context.alertBox("error", res?.message || "Erreur lors de la modification");
            }
            setIsLoading(false);
        });
    };

    // Catégories pour les selects cascades
    const selectedCat    = context?.catData?.find(c => c._id === formField.catId);
    const selectedSubCat = selectedCat?.children?.find(s => s._id === formField.subCatId);

    // ═══════════════════════════════════════════════════════════════════════
    // RENDER
    // ═══════════════════════════════════════════════════════════════════════
    if (isFetching) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <CircularProgress />
            </div>
        );
    }

    return (
        <>
            <section className="!p-5 bg-gray-50">
                <form className="form !py-3 !p-18" onSubmit={handleSubmit}>
                    <div className='scroll max-h-[72vh] overflow-y-scroll !pr-4'>

                        {/* Nom */}
                        <div className="grid grid-cols-2 !mb-3">
                            <div className="col">
                                <h3 className="text-[14px] font-[500] !mb-1 text-black">Nom du Produit</h3>
                                <input type="text" name="name" value={formField.name}
                                    onChange={onChangeInput}
                                    className="w-full h-[40px] border border-[rgba(0,0,0,0.1)] 
                                    !p-2 !pl-3 focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm text-sm" />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="grid grid-cols-2 !mb-3">
                            <div className="col">
                                <h3 className="text-[14px] font-[500] !mb-1 text-black">Description du Produit</h3>
                                <textarea name="description" value={formField.description}
                                    onChange={onChangeInput}
                                    className="w-full h-[140px] border border-[rgba(0,0,0,0.1)] 
                                    !p-2 !pl-3 focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm text-sm" />
                            </div>
                        </div>

                        {/* Catégorie / Sous-cat / Prix / Ancien prix */}
                        <div className="grid grid-cols-4 !mb-3 gap-4">
                            <div className="col">
                                <h3 className="text-[14px] font-[500] !mb-1 text-black">Catégorie</h3>
                                <Select size='small' className='w-full' value={formField.catId}
                                    onChange={handleChangeCat}>
                                    <MenuItem value="">-- Choisir --</MenuItem>
                                    {context?.catData?.map((cat) => (
                                        <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                                    ))}
                                </Select>
                            </div>

                            <div className="col">
                                <h3 className="text-[14px] font-[500] !mb-1 text-black">Sous Catégorie</h3>
                                <Select size='small' className='w-full' value={formField.subCatId}
                                    onChange={handleChangeSubCat}
                                    disabled={!formField.catId}>
                                    <MenuItem value="">-- Aucun --</MenuItem>
                                    {selectedCat?.children?.map((sub) => (
                                        <MenuItem key={sub._id} value={sub._id}>{sub.name}</MenuItem>
                                    ))}
                                </Select>
                            </div>

                            <div className="col">
                                <h3 className="text-[14px] font-[500] !mb-1 text-black">Prix</h3>
                                <input type="number" name="price" value={formField.price}
                                    onChange={onChangeInput}
                                    className="w-full h-[40px] border border-[rgba(0,0,0,0.1)] 
                                    !p-2 !pl-3 focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm text-sm" />
                            </div>

                            <div className="col">
                                <h3 className="text-[14px] font-[500] !mb-1 text-black">Ancien Prix</h3>
                                <input type="number" name="oldPrice" value={formField.oldPrice}
                                    onChange={onChangeInput}
                                    className="w-full h-[40px] border border-[rgba(0,0,0,0.1)] 
                                    !p-2 !pl-3 focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm text-sm" />
                            </div>
                        </div>

                        {/* Sous-sous-catégorie */}
                        {selectedSubCat?.children?.length > 0 && (
                            <div className="grid grid-cols-4 !mb-3 gap-4">
                                <div className="col">
                                    <h3 className="text-[14px] font-[500] !mb-1 text-black">Sous-sous Catégorie</h3>
                                    <Select size='small' className='w-full' value={formField.thirdsubCatId}
                                        onChange={handleChangeThirdCat}>
                                        <MenuItem value="">-- Aucun --</MenuItem>
                                        {selectedSubCat.children.map((third) => (
                                            <MenuItem key={third._id} value={third._id}>{third.name}</MenuItem>
                                        ))}
                                    </Select>
                                </div>
                            </div>
                        )}

                        {/* Vedette / Stock / Marque / Remise */}
                        <div className="grid grid-cols-4 !mb-3 gap-4">
                            <div className="col">
                                <h3 className="text-[14px] font-[500] !mb-1 text-black">Sera en vedette ?</h3>
                                <Select size='small' className='w-full'
                                    value={formField.isFeatures ? "true" : "false"}
                                    onChange={handleChangeFeatured}>
                                    <MenuItem value="true">Oui</MenuItem>
                                    <MenuItem value="false">Non</MenuItem>
                                </Select>
                            </div>
                            <div className="col">
                                <h3 className="text-[14px] font-[500] !mb-1 text-black">Quantité en Stock</h3>
                                <input type="number" name="countInStock" value={formField.countInStock}
                                    onChange={onChangeInput}
                                    className="w-full h-[40px] border border-[rgba(0,0,0,0.1)] 
                                    !p-2 !pl-3 focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm text-sm" />
                            </div>
                            <div className="col">
                                <h3 className="text-[14px] font-[500] !mb-1 text-black">Marque</h3>
                                <input type="text" name="brand" value={formField.brand}
                                    onChange={onChangeInput}
                                    className="w-full h-[40px] border border-[rgba(0,0,0,0.1)] 
                                    !p-2 !pl-3 focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm text-sm" />
                            </div>
                            <div className="col">
                                <h3 className="text-[14px] font-[500] !mb-1 text-black">Remise (%)</h3>
                                <input type="number" name="discount" value={formField.discount}
                                    onChange={onChangeInput}
                                    className="w-full h-[40px] border border-[rgba(0,0,0,0.1)] 
                                    !p-2 !pl-3 focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm text-sm" />
                            </div>
                        </div>

                        {/* Taille / Note */}
                        <div className="grid grid-cols-4 !mb-3 gap-4">
                            <div className="col">
                                <h3 className="text-[14px] font-[500] !mb-1 text-black">Taille</h3>
                                <Select multiple size='small' className='w-full'
                                    value={productSize} onChange={handleChangeSize}>
                                    {["S", "M", "L", "XL", "2XL", "3XL"].map((s) => (
                                        <MenuItem key={s} value={s}>{s}</MenuItem>
                                    ))}
                                </Select>
                            </div>
                            <div className="col">
                                <h3 className="text-[14px] font-[500] !mb-1 text-black">Note</h3>
                                <Rating name="rating" value={formField.rating}
                                    precision={0.5} onChange={handleChangeRating} />
                            </div>
                        </div>

                        {/* Images */}
                        <div className='col !px-0 !p-5 w-full'>
                            <h3 className="text-[18px] font-[700] !mb-3 text-black">Images du Produit</h3>
                            <div className="grid grid-cols-7 gap-4">
                                {previews.map((img, index) => (
                                    <div key={index} className='uploadBoxWrapper relative'>
                                        <span
                                            className='absolute w-[20px] h-[20px] rounded-full overflow-hidden bg-red-700
                                            -top-[5px] -right-[5px] flex items-center justify-center z-50 cursor-pointer'
                                            onClick={() => removeImage(index)}>
                                            <IoMdClose className='text-white text-[17px]' />
                                        </span>
                                        <div className='uploadBox !p-0 rounded-md overflow-hidden border border-dashed
                                        border-[rgba(0,0,0,0.3)] h-[150px] w-[100%] bg-gray-100'>
                                            <LazyLoadImage
                                                alt={"image"}
                                                effect="blur"
                                                src={img}
                                                className="w-full h-full object-cover" />
                                        </div>
                                    </div>
                                ))}
                                <UploadBox
                                    multiple={true}
                                    name="images"
                                    url="/api/product/chargement-image"
                                    setPreviewsFun={setPreviewsFun}
                                />
                            </div>
                        </div>
                    </div>

                    <hr />
                    <br />

                    <Button type="submit" className="btn-pink btn-lg w-full flex gap-2">
                        {isLoading ? (
                            <CircularProgress color="inherit" size={22} />
                        ) : (
                            <>
                                <FaCloudUploadAlt className='text-[25px] text-white' />
                                Modifier le produit
                            </>
                        )}
                    </Button>
                </form>
            </section>
        </>
    );
}