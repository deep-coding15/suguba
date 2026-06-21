import { useState, useEffect, useContext } from "react";
import { fetchDataFromApi, editImages } from "../../utils/api";
import { MyContext } from "../../App";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import SearchBox from "../SearchBox";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { FaStore, FaRegUser } from "react-icons/fa";
import { BiSolidCalendar } from "react-icons/bi";
import toast from "react-hot-toast";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";

export default function Sellers() {
  const context = useContext(MyContext);
  const [sellers, setSellers] = useState([]);
  const [filteredSellers, setFilteredSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDialog, setConfirmDialog] = useState({ open: false, seller: null, action: "" });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchDataFromApi("/api/seller/liste-vendeurs").then(res => {
      setSellers(res?.data || []);
      setFilteredSellers(res?.data || []);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!searchTerm) { setFilteredSellers(sellers); return; }
    const q = searchTerm.toLowerCase();
    setFilteredSellers(sellers.filter(s =>
      s.shopName?.toLowerCase().includes(q) ||
      s.userId?.name?.toLowerCase().includes(q) ||
      s.userId?.email?.toLowerCase().includes(q)
    ));
  }, [searchTerm, sellers]);

  const handleAction = async () => {
    const { seller, action } = confirmDialog;
    const status = action === "suspend" ? "suspended" : "active";
    const res = await editImages("/api/seller/statut-vendeur", { sellerId: seller._id, status });
    if (res?.success) {
      toast.success(`Vendeur ${action === "suspend" ? "suspendu" : "activé"}`);
      setSellers(prev => prev.map(s => s._id === seller._id ? { ...s, status } : s));
    }
    setConfirmDialog({ open: false, seller: null, action: "" });
  };

  const statusBadge = (status) => {
    const map = { active: "bg-green-100 text-green-700", suspended: "bg-red-100 text-red-600", pending: "bg-yellow-100 text-yellow-700" };
    return <span className={`text-[11px] !px-2 !py-1 rounded-full font-[600] ${map[status] || "bg-gray-100"}`}>{status}</span>;
  };

  return (
    <>
      <div className="flex items-center justify-between !mb-4">
        <h2 className="text-[18px] font-[600]">
          Vendeurs
          <span className="text-[13px] text-gray-400 font-[400] !ml-2">({filteredSellers.length})</span>
        </h2>
        <div className="w-[250px]">
          <SearchBox onChange={e => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <div className="card shadow-md sm:rounded-lg bg-white">
        {isLoading ? (
          <div className="flex justify-center !py-10"><CircularProgress /></div>
        ) : (
          <>
            <TableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {["Boutique", "Propriétaire", "Email", "Revenus", "Commissions", "Commandes", "Statut", "Inscrit le", "Actions"].map(h => (
                      <TableCell key={h} style={{ fontWeight: 600, fontSize: "12px" }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredSellers.length === 0 ? (
                    <TableRow><TableCell colSpan={9} align="center" className="text-gray-400 !py-8">Aucun vendeur</TableCell></TableRow>
                  ) : filteredSellers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(seller => (
                    <TableRow hover key={seller._id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-[38px] h-[38px] rounded-full overflow-hidden bg-pink-50 flex items-center justify-center">
                            {seller.shopLogo ? <img src={seller.shopLogo} className="w-full h-full object-cover" /> : <FaStore className="text-primary text-[16px]" />}
                          </div>
                          <span className="text-[13px] font-[600]">{seller.shopName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <div className="w-[28px] h-[28px] rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                            {seller.userId?.avatar ? <img src={seller.userId.avatar} className="w-full h-full object-cover" /> : <FaRegUser className="text-[12px]" />}
                          </div>
                          <span className="text-[13px]">{seller.userId?.name}</span>
                        </div>
                      </TableCell>
                      <TableCell><span className="text-[12px]">{seller.userId?.email}</span></TableCell>
                      <TableCell><span className="text-green-600 font-[600] text-[13px]">{seller.totalRevenue?.toLocaleString()} Fcfa</span></TableCell>
                      <TableCell><span className="text-primary font-[600] text-[13px]">{seller.totalCommission?.toLocaleString()} Fcfa</span></TableCell>
                      <TableCell><span className="text-[13px]">{seller.totalOrders}</span></TableCell>
                      <TableCell>{statusBadge(seller.status)}</TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 text-[12px]">
                          <BiSolidCalendar className="text-gray-400" />
                          {new Date(seller.createdAt).toLocaleDateString("fr-FR")}
                        </span>
                      </TableCell>
                      <TableCell>
                        {seller.status === "active" ? (
                          <Button size="small" color="error" variant="outlined" className="!text-[11px] !capitalize"
                            onClick={() => setConfirmDialog({ open: true, seller, action: "suspend" })}>
                            Suspendre
                          </Button>
                        ) : (
                          <Button size="small" color="success" variant="outlined" className="!text-[11px] !capitalize"
                            onClick={() => setConfirmDialog({ open: true, seller, action: "activate" })}>
                            Activer
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25]}
              component="div"
              count={filteredSellers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(_, p) => setPage(p)}
              onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0); }}
              labelRowsPerPage="Par page"
            />
          </>
        )}
      </div>

      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false })}>
        <DialogTitle>{confirmDialog.action === "suspend" ? "Suspendre le vendeur" : "Activer le vendeur"}</DialogTitle>
        <DialogContent>
          <p>Confirmer {confirmDialog.action === "suspend" ? "la suspension" : "l'activation"} de la boutique <strong>{confirmDialog.seller?.shopName}</strong> ?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false })} className="!capitalize">Annuler</Button>
          <Button onClick={handleAction} color={confirmDialog.action === "suspend" ? "error" : "success"} variant="contained" className="!capitalize">Confirmer</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}