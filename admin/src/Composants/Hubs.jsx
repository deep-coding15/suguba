import { useState, useEffect, useContext } from "react";
import { fetchDataFromApi, postData, deleteData } from "../utils/api.js";
import { MyContext } from "../App.jsx";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { IoMdAdd } from "react-icons/io";
import { AiOutlineEdit } from "react-icons/ai";
import { BsTrash } from "react-icons/bs";
import { MdLocationOn, MdPhone, MdPerson, MdAccessTime, MdMap } from "react-icons/md";
import { FaWarehouse } from "react-icons/fa";
import axios from "axios";

const EMPTY_FORM = {
  name: "", address: "", city: "", phone: "",
  manager: "", hours: "Lun–Sam : 8h–18h",
  latitude: "", longitude: "", zone: "", isActive: true
};

export default function Hubs() {
  const context = useContext(MyContext);
  const [hubs, setHubs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editHub, setEditHub] = useState(null); // null = ajout, objet = édition
  const [formField, setFormField] = useState(EMPTY_FORM);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadHubs = () => {
    setIsLoading(true);
    fetchDataFromApi("/api/hubs/all").then((res) => {
      setHubs(res?.data || []);
      setIsLoading(false);
    });
  };

  useEffect(() => { loadHubs(); }, []);

  const openAdd = () => {
    setEditHub(null);
    setFormField(EMPTY_FORM);
    setOpenForm(true);
  };

  const openEdit = (hub) => {
    setEditHub(hub);
    setFormField({
      name: hub.name || "",
      address: hub.address || "",
      city: hub.city || "",
      phone: hub.phone || "",
      manager: hub.manager || "",
      hours: hub.hours || "Lun–Sam : 8h–18h",
      latitude: hub.latitude || "",
      longitude: hub.longitude || "",
      zone: hub.zone || "",
      isActive: hub.isActive !== false,
    });
    setOpenForm(true);
  };

  const handleSubmit = async () => {
    if (!formField.name.trim() || !formField.address.trim() || !formField.city.trim()) {
      context.alertBox("error", "Nom, adresse et ville sont requis");
      return;
    }
    setFormLoading(true);
    const payload = {
      ...formField,
      latitude: formField.latitude !== "" ? parseFloat(formField.latitude) : null,
      longitude: formField.longitude !== "" ? parseFloat(formField.longitude) : null,
    };

    let res;
    if (editHub) {
      // Mise à jour
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const { data } = await axios.put(`${apiUrl}/api/hubs/${editHub._id}`, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem("accesstoken")}` }
        });
        res = data;
      } catch (e) { res = { success: false, message: "Erreur réseau" }; }
    } else {
      res = await postData("/api/hubs", payload);
    }

    if (res?.success) {
      context.alertBox("success", editHub ? "Hub modifié avec succès" : "Hub créé avec succès");
      loadHubs();
      setOpenForm(false);
    } else {
      context.alertBox("error", res?.message || "Erreur");
    }
    setFormLoading(false);
  };

  const handleToggle = async (hubId) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await axios.patch(`${apiUrl}/api/hubs/${hubId}/toggle`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accesstoken")}` }
      });
      if (res.data?.success) {
        context.alertBox("success", res.data.message);
        loadHubs();
      }
    } catch {
      context.alertBox("error", "Erreur lors du changement de statut");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    const res = await deleteData(`/api/hubs/${deleteId}`);
    if (res?.success) {
      context.alertBox("success", "Hub supprimé");
      loadHubs();
    } else {
      context.alertBox("error", res?.message || "Erreur suppression");
    }
    setDeleteLoading(false);
    setDeleteId(null);
  };

  const field = (label, key, type = "text", required = false) => (
    <TextField
      label={label} size="small" type={type} fullWidth required={required}
      value={formField[key]}
      onChange={e => setFormField(prev => ({ ...prev, [key]: e.target.value }))}
    />
  );

  return (
    <div className="flex flex-col gap-5">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-[700] flex items-center gap-2">
            <FaWarehouse className="text-primary" /> Hubs Suguba
          </h2>
          <p className="text-[13px] text-gray-500">{hubs.length} hub(s) enregistré(s)</p>
        </div>
        <Button className="btn-pink !capitalize flex gap-2" onClick={openAdd}>
          <IoMdAdd /> Ajouter un hub
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center !py-20"><CircularProgress /></div>
      ) : hubs.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm !p-16 text-center">
          <FaWarehouse className="text-[50px] text-gray-200 !mx-auto !mb-4" />
          <p className="text-gray-400 text-[16px] !mb-4">Aucun hub enregistré</p>
          <Button className="btn-pink !capitalize" onClick={openAdd}>Créer le premier hub</Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {hubs.map((hub) => (
            <div key={hub._id}
              className={`bg-white rounded-xl shadow-sm !p-5 border-l-4 transition-all hover:shadow-md ${hub.isActive ? "border-green-400" : "border-gray-300"}`}>
              {/* Header card */}
              <div className="flex items-start justify-between !mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-[15px] font-[700] truncate">{hub.name}</h3>
                  {hub.zone && <span className="text-[11px] bg-blue-50 text-blue-600 font-[600] !px-2 !py-0.5 rounded-full">{hub.zone}</span>}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0 !ml-2">
                  <Switch checked={hub.isActive} onChange={() => handleToggle(hub._id)} size="small" color="success" />
                  <Button className="!w-[32px] !h-[32px] !min-w-[32px] !rounded-full !bg-blue-50"
                    onClick={() => openEdit(hub)}>
                    <AiOutlineEdit className="text-blue-600 text-[15px]" />
                  </Button>
                  <Button className="!w-[32px] !h-[32px] !min-w-[32px] !rounded-full !bg-red-50"
                    onClick={() => setDeleteId(hub._id)}>
                    <BsTrash className="text-red-500 text-[14px]" />
                  </Button>
                </div>
              </div>

              {/* Infos */}
              <div className="flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <MdLocationOn className="text-primary text-[16px] flex-shrink-0 !mt-0.5" />
                  <p className="text-[12px] text-gray-600">{hub.address}, <strong>{hub.city}</strong></p>
                </div>
                {hub.phone && (
                  <div className="flex items-center gap-2">
                    <MdPhone className="text-green-500 text-[14px] flex-shrink-0" />
                    <p className="text-[12px] text-gray-600">{hub.phone}</p>
                  </div>
                )}
                {hub.manager && (
                  <div className="flex items-center gap-2">
                    <MdPerson className="text-blue-500 text-[14px] flex-shrink-0" />
                    <p className="text-[12px] text-gray-600">{hub.manager}</p>
                  </div>
                )}
                {hub.hours && (
                  <div className="flex items-center gap-2">
                    <MdAccessTime className="text-orange-500 text-[14px] flex-shrink-0" />
                    <p className="text-[12px] text-gray-600">{hub.hours}</p>
                  </div>
                )}
                {hub.latitude && hub.longitude && (
                  <div className="flex items-center gap-2">
                    <MdMap className="text-purple-500 text-[14px] flex-shrink-0" />
                    <p className="text-[11px] text-gray-400">{hub.latitude}, {hub.longitude}</p>
                  </div>
                )}
              </div>

              {/* Statut */}
              <div className="!mt-3 !pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className={`text-[11px] font-[700] !px-2 !py-1 rounded-full ${hub.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {hub.isActive ? "✅ Actif" : "⏸ Inactif"}
                </span>
                <span className="text-[10px] text-gray-400">
                  Ajouté le {new Date(hub.createdAt).toLocaleDateString("fr-FR")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Dialog Ajout / Édition ────────────────────────────────────────── */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle className="!font-[700]">
          {editHub ? "✏️ Modifier le hub" : "➕ Ajouter un hub"}
        </DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-4 !pt-2">
            <div className="grid grid-cols-2 gap-3">
              {field("Nom du hub *", "name", "text", true)}
              {field("Ville *", "city", "text", true)}
            </div>
            {field("Adresse complète *", "address", "text", true)}
            <div className="grid grid-cols-2 gap-3">
              {field("Téléphone", "phone")}
              {field("Responsable", "manager")}
            </div>
            {field("Horaires", "hours")}
            {field("Zone (ex: Bamako Centre)", "zone")}
            <div className="grid grid-cols-2 gap-3">
              {field("Latitude (optionnel)", "latitude", "number")}
              {field("Longitude (optionnel)", "longitude", "number")}
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={formField.isActive}
                onChange={e => setFormField(prev => ({ ...prev, isActive: e.target.checked }))}
                color="success" />
              <span className="text-[13px] text-gray-700">Hub actif (visible publiquement)</span>
            </div>
          </div>
        </DialogContent>
        <DialogActions className="!px-5 !pb-4">
          <Button onClick={() => setOpenForm(false)} className="!capitalize !text-gray-600">Annuler</Button>
          <Button onClick={handleSubmit} disabled={formLoading}
            className="btn-pink !capitalize flex gap-2">
            {formLoading ? <CircularProgress size={18} color="inherit" /> : (editHub ? "Enregistrer" : "Créer le hub")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Dialog Suppression ───────────────────────────────────────────── */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <p className="text-[14px] text-gray-600">Voulez-vous vraiment supprimer ce hub ? Cette action est irréversible.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)} className="!capitalize">Annuler</Button>
          <Button onClick={handleDelete} color="error" variant="contained" disabled={deleteLoading} className="!capitalize">
            {deleteLoading ? <CircularProgress size={16} color="inherit" /> : "Supprimer"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
