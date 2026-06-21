import { useState, useEffect, useContext } from "react";
import { editImages, fetchDataFromApi, postData } from "../utils/api.js";
import { MyContext } from "../App.jsx";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TablePagination from "@mui/material/TablePagination";
import { MdSwapHoriz, MdMoneyOff, MdMessage, MdCheckCircle, MdCancel, MdPending, MdRefresh } from "react-icons/md";
import { FaUser, FaEnvelope, FaPhone, FaBoxOpen } from "react-icons/fa";

const TYPE_LABELS = {
  return: { label: "Retour & Remboursement", icon: MdMoneyOff, color: "text-red-500", bg: "bg-red-50" },
  exchange: { label: "Échange", icon: MdSwapHoriz, color: "text-blue-500", bg: "bg-blue-50" },
  contact: { label: "Message Contact", icon: MdMessage, color: "text-purple-500", bg: "bg-purple-50" },
};

const STATUS_LABELS = {
  nouveau: { label: "Nouveau", color: "bg-orange-100 text-orange-700" },
  "en-cours": { label: "En cours", color: "bg-blue-100 text-blue-700" },
  résolu: { label: "Résolu ✅", color: "bg-green-100 text-green-700" },
  rejeté: { label: "Rejeté", color: "bg-red-100 text-red-600" },
};

function StatusBadge({ status }) {
  const s = STATUS_LABELS[status] || STATUS_LABELS.nouveau;
  return <span className={`text-[11px] font-[600] !px-2 !py-1 rounded-full ${s.color}`}>{s.label}</span>;
}

export default function SupportRequests() {
  const context = useContext(MyContext);
  const [tab, setTab] = useState(0); // 0=tous 1=retour 2=échange 3=contact
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  // Dialog détail
  const [detailDialog, setDetailDialog] = useState({ open: false, request: null });
  const [adminNote, setAdminNote] = useState("");
  const [updateStatus, setUpdateStatus] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

  const TYPE_TABS = ["all", "return", "exchange", "contact"];

  const loadRequests = () => {
    setIsLoading(true);
    const typeParam = TYPE_TABS[tab] !== "all" ? `&type=${TYPE_TABS[tab]}` : "";
    fetchDataFromApi(`/api/support?page=${page + 1}&perPage=${rowsPerPage}${typeParam}`).then((res) => {
      setRequests(res?.data || []);
      setTotal(res?.total || 0);
      setIsLoading(false);
    });
  };

  useEffect(() => { loadRequests(); }, [tab, page, rowsPerPage]);

  const openDetail = (req) => {
    setDetailDialog({ open: true, request: req });
    setUpdateStatus(req.status);
    setAdminNote(req.adminNote || "");
  };

  const handleUpdate = () => {
    if (!detailDialog.request) return;
    setUpdateLoading(true);
    editImages(`/api/support/${detailDialog.request._id}`, {
      status: updateStatus,
      adminNote
    }).then((res) => {
      if (res?.success) {
        
        context.alertBox("success", "Demande mise à jour");
        setUpdateLoading(false);
        loadRequests();
        setDetailDialog({ open: false, request: null });
      } else {
        setUpdateLoading(false);
        context.alertBox("error", res?.message || "Erreur");
      }
      
    });
  };

  const req = detailDialog.request;

  return (
    <div className="flex flex-col gap-4">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-[700]">Demandes Support Clients</h2>
          <p className="text-[13px] text-gray-500">{total} demande(s) au total</p>
        </div>
        <Button className="!capitalize flex gap-2 !text-gray-600" onClick={loadRequests}>
          <MdRefresh className="text-[18px]" /> Actualiser
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Onglets */}
        <Tabs value={tab} onChange={(_, v) => { setTab(v); setPage(0); }} className="border-b border-gray-100 !px-4">
          <Tab label="Toutes" className="!capitalize !text-[13px]" />
          <Tab label={<span className="flex items-center gap-1"><MdMoneyOff className="text-red-500" /> Retours</span>} className="!capitalize !text-[13px]" />
          <Tab label={<span className="flex items-center gap-1"><MdSwapHoriz className="text-blue-500" /> Échanges</span>} className="!capitalize !text-[13px]" />
          <Tab label={<span className="flex items-center gap-1"><MdMessage className="text-purple-500" /> Messages</span>} className="!capitalize !text-[13px]" />
        </Tabs>

        {/* Tableau */}
        {isLoading ? (
          <div className="flex justify-center !py-16"><CircularProgress /></div>
        ) : requests.length === 0 ? (
          <div className="text-center !py-16 text-gray-400">
            <FaBoxOpen className="text-[48px] !mx-auto !mb-3 opacity-20" />
            <p>Aucune demande pour le moment</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-600 uppercase bg-gray-50">
                  <tr>
                    <th className="!px-4 !py-3">Type</th>
                    <th className="!px-4 !py-3">Client</th>
                    <th className="!px-4 !py-3">Commande</th>
                    <th className="!px-4 !py-3">Raison / Sujet</th>
                    <th className="!px-4 !py-3">Statut</th>
                    <th className="!px-4 !py-3">Date</th>
                    <th className="!px-4 !py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => {
                    const typeInfo = TYPE_LABELS[req.type] || TYPE_LABELS.contact;
                    const Icon = typeInfo.icon;
                    return (
                      <tr key={req._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="!px-4 !py-3">
                          <div className={`flex items-center gap-2 ${typeInfo.bg} !px-2 !py-1 rounded-full w-fit`}>
                            <Icon className={`text-[13px] ${typeInfo.color}`} />
                            <span className={`text-[11px] font-[600] ${typeInfo.color}`}>{typeInfo.label}</span>
                          </div>
                        </td>
                        <td className="!px-4 !py-3">
                          <p className="text-[13px] font-[600]">{req.clientName}</p>
                          <p className="text-[11px] text-gray-400">{req.clientEmail}</p>
                        </td>
                        <td className="!px-4 !py-3">
                          {req.orderId ? (
                            <span className="text-[12px] font-[600] text-primary">{req.orderId}</span>
                          ) : <span className="text-gray-300">—</span>}
                        </td>
                        <td className="!px-4 !py-3 max-w-[200px]">
                          <p className="text-[12px] line-clamp-2">{req.reason || req.subject || "—"}</p>
                        </td>
                        <td className="!px-4 !py-3"><StatusBadge status={req.status} /></td>
                        <td className="!px-4 !py-3 text-[11px] text-gray-400 whitespace-nowrap">
                          {new Date(req.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </td>
                        <td className="!px-4 !py-3">
                          <Button size="small" className="!capitalize !text-[12px] !bg-blue-50 !text-blue-600"
                            onClick={() => openDetail(req)}>
                            Voir & Traiter
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <TablePagination
              component="div" count={total}
              rowsPerPage={rowsPerPage} page={page}
              onPageChange={(_, p) => setPage(p)}
              onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0); }}
              rowsPerPageOptions={[10, 20, 50]}
              labelRowsPerPage="Par page :"
            />
          </>
        )}
      </div>

      {/* ── Dialog Détail ─────────────────────────────────────────────────── */}
      <Dialog open={detailDialog.open} onClose={() => setDetailDialog({ open: false, request: null })} maxWidth="sm" fullWidth>
        <DialogTitle className="!font-[700]">
          {req && (() => { const t = TYPE_LABELS[req.type]; const I = t?.icon; return <span className="flex items-center gap-2"><I className={t?.color} /> {t?.label}</span>; })()}
        </DialogTitle>
        <DialogContent>
          {req && (
            <div className="flex flex-col gap-4 !pt-1">
              {/* Infos client */}
              <div className="bg-gray-50 rounded-xl !p-4 flex flex-col gap-2">
                <p className="text-[12px] font-[700] text-gray-500 uppercase">Client</p>
                <div className="flex items-center gap-2"><FaUser className="text-gray-400 text-[12px]" /><p className="text-[13px]">{req.clientName}</p></div>
                {req.clientEmail && <div className="flex items-center gap-2"><FaEnvelope className="text-gray-400 text-[12px]" /><p className="text-[13px]">{req.clientEmail}</p></div>}
                {req.clientPhone && <div className="flex items-center gap-2"><FaPhone className="text-gray-400 text-[12px]" /><p className="text-[13px]">{req.clientPhone}</p></div>}
              </div>

              {/* Infos commande/produit */}
              {req.orderId && (
                <div className="bg-blue-50 rounded-xl !p-4">
                  <p className="text-[12px] font-[700] text-blue-700 uppercase !mb-2">Commande & Produit</p>
                  <p className="text-[13px]">N° : <strong className="text-primary">{req.orderId}</strong></p>
                  {req.productName && (
                    <div className="flex items-center gap-3 !mt-2">
                      {req.productImage && <img src={req.productImage} className="w-[45px] h-[45px] object-cover rounded-lg" alt="" />}
                      <p className="text-[13px] font-[500]">{req.productName}</p>
                    </div>
                  )}
                  {req.productId && <p className="text-[11px] text-gray-500 !mt-1">ID : {req.productId}</p>}
                </div>
              )}

              {/* Raison / Message */}
              <div>
                <p className="text-[12px] font-[700] text-gray-500 uppercase !mb-1">{req.type === "contact" ? "Sujet & Message" : "Raison & Détails"}</p>
                <div className="bg-white border border-gray-200 rounded-xl !p-3">
                  <p className="text-[13px] font-[600] !mb-1">{req.reason || req.subject}</p>
                  <p className="text-[12px] text-gray-600 leading-relaxed">{req.details || req.message}</p>
                  {req.newSize && <p className="text-[12px] text-blue-600 !mt-1">Nouvelle taille/couleur : <strong>{req.newSize}</strong></p>}
                </div>
              </div>

              {/* Actions admin */}
              <div className="border-t border-gray-100 !pt-4">
                <p className="text-[12px] font-[700] text-gray-500 uppercase !mb-3">Traitement admin</p>
                <Select size="small" fullWidth value={updateStatus}
                  onChange={e => setUpdateStatus(e.target.value)} className="!mb-3">
                  <MenuItem value="nouveau">🟠 Nouveau</MenuItem>
                  <MenuItem value="en-cours">🔵 En cours de traitement</MenuItem>
                  <MenuItem value="résolu">✅ Résolu</MenuItem>
                  <MenuItem value="rejeté">❌ Rejeté</MenuItem>
                </Select>
                <TextField label="Note admin (visible en interne)" multiline rows={2} fullWidth size="small"
                  value={adminNote} onChange={e => setAdminNote(e.target.value)}
                  placeholder="Ex: Remboursement effectué le 15/04..." />
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions className="!px-5 !pb-4">
          <Button onClick={() => setDetailDialog({ open: false, request: null })} className="!capitalize">Fermer</Button>
          <Button onClick={handleUpdate} disabled={updateLoading} variant="contained" color="primary" className="!capitalize flex gap-2">
            {updateLoading ? <CircularProgress size={16} color="inherit" /> : <><MdCheckCircle /> Enregistrer</>}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}