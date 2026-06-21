import { useState, useContext, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { MyContext } from "../../../router";
import { editImages, postData, uploadImageCatProd } from "../../../utils/api";
import { FaCloudUploadAlt } from "react-icons/fa";

export default function SellerSettings({ seller, setSeller }) {
  const context = useContext(MyContext);
  const [isLoading, setIsLoading] = useState(false);
  const [formField, setFormField] = useState({
    shopLogo:seller?.shopLogo || "",
    shopName: seller?.shopName || "",
    shopDescription: seller?.shopDescription || "",
    phone: seller?.phone || "",
    address: seller?.address || "",
    bankName: seller?.bankInfo?.bankName || "",
    accountNumber: seller?.bankInfo?.accountNumber || "",
    accountName: seller?.bankInfo?.accountName || "",
  });
 
  const [logo, setLogo] = useState(seller?.shopLogo || "");
  const [uploadingLogo, setUploadingLogo] = useState(false);
   useEffect(() => {
  if (seller?.shopLogo) {
    setLogo(seller.shopLogo);
  }
}, [seller]);
  const onChangeInput = (e) => setFormField({ ...formField, [e.target.name]: e.target.value });

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingLogo(true);
    const fd = new FormData();
    fd.append("images", file);
    const res = await uploadImageCatProd("/api/seller/upload-image", fd);
    if (res?.data?.images?.[0]) setLogo(res.data.images[0]);
    setUploadingLogo(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    editImages("/api/seller/profil", {
      ...formField,
      shopLogo: logo,
      bankInfo: {
        bankName: formField.bankName,
        accountNumber: formField.accountNumber,
        accountName: formField.accountName,
      }
    }).then((res) => {
      if (res?.data?.success) {
        context.alertBox("success", "Profil mis à jour !");
        setSeller(res.data);
      } else {
        context.alertBox("error", res?.message);
      }
      setIsLoading(false);
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-[18px] font-[600]">Paramètres de la boutique</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Logo */}
        <div className="bg-white rounded-xl shadow-sm !p-5">
          <h3 className="text-[15px] font-[600] !mb-4">Logo de la boutique</h3>
          <div className="flex items-center gap-4">
            <div className="w-[80px] h-[80px] rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
              {logo ? <img src={logo} className="w-full h-full object-cover" /> : <FaCloudUploadAlt className="text-[30px] text-gray-400" />}
            </div>
            <label className="btn-org cursor-pointer flex items-center gap-2 !px-4 !py-2 rounded-md text-white text-[13px]">
              {uploadingLogo ? <CircularProgress size={16} color="inherit" /> : <><FaCloudUploadAlt /> Changer le logo</>}
              <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
            </label>
          </div>
        </div>

        {/* Infos boutique */}
        <div className="bg-white rounded-xl shadow-sm !p-5 flex flex-col gap-4">
          <h3 className="text-[15px] font-[600]">Informations de la boutique</h3>
          <TextField label="Nom de la boutique" name="shopName" value={formField.shopName} onChange={onChangeInput} size="small" fullWidth />
          <TextField label="Description" name="shopDescription" value={formField.shopDescription} onChange={onChangeInput} size="small" fullWidth multiline rows={3} />
          <div className="grid grid-cols-2 gap-4">
            <TextField label="Téléphone" name="phone" value={formField.phone} onChange={onChangeInput} size="small" fullWidth />
            <TextField label="Adresse" name="address" value={formField.address} onChange={onChangeInput} size="small" fullWidth />
          </div>
        </div>

        {/* Infos bancaires */}
        <div className="bg-white rounded-xl shadow-sm !p-5 flex flex-col gap-4">
          <h3 className="text-[15px] font-[600]">Informations bancaires</h3>
          <p className="text-[12px] text-gray-400">Ces informations servent à vous reverser vos revenus</p>
          <div className="grid grid-cols-3 gap-4">
            <TextField label="Nom de la banque" name="bankName" value={formField.bankName} onChange={onChangeInput} size="small" fullWidth />
            <TextField label="N° de compte" name="accountNumber" value={formField.accountNumber} onChange={onChangeInput} size="small" fullWidth />
            <TextField label="Titulaire du compte" name="accountName" value={formField.accountName} onChange={onChangeInput} size="small" fullWidth />
          </div>
        </div>

        <Button type="submit" className="btn-org btn-lg w-full" disabled={isLoading}>
          {isLoading ? <CircularProgress size={22} color="inherit" /> : "Enregistrer les modifications"}
        </Button>
      </form>
    </div>
  );
}