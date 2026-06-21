import { useState, useEffect, useContext } from "react";
import Badge from "../Badge/index";
import { FaAngleUp, FaAngleDown } from "react-icons/fa6";
import Button from "@mui/material/Button";
import SearchBox from "../SearchBox";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import TablePagination from "@mui/material/TablePagination";
import { fetchDataFromApi, postData } from "../../utils/api";
import { MyContext } from "../../App";

// Statuts adaptés au modèle Suguba (côté admin)
const ADMIN_STATUSES = [
  { value: "en-attente", label: "En attente" },
  { value: "confirmé", label: "Confirmé" },
  { value: "en-livraison", label: "En livraison" },
  { value: "livré", label: "Livré" },
  { value: "annulé", label: "Annulé" },
];

// Statuts d'item (côté admin — vision complète)
const ITEM_STATUSES_LABELS = {
  "en-attente": { label: "En attente", bg: "bg-orange-100 text-orange-700" },
  "emballé": { label: "Emballé 📦", bg: "bg-blue-100 text-blue-700" },
  "déposé-hub": { label: "Déposé hub 🏭", bg: "bg-purple-100 text-purple-700" },
  "en-livraison": { label: "En livraison 🛵", bg: "bg-indigo-100 text-indigo-700" },
  "livré": { label: "Livré ✅", bg: "bg-green-100 text-green-700" },
  "annulé": { label: "Annulé ❌", bg: "bg-red-100 text-red-700" },
  "remboursé": { label: "Remboursé 💰", bg: "bg-gray-100 text-gray-700" },
};

function ItemStatusBadge({ status }) {
  const s = ITEM_STATUSES_LABELS[status] || { label: status, bg: "bg-gray-100 text-gray-600" };
  return <span className={`text-[10px] font-[600] !px-2 !py-1 rounded-full ${s.bg} whitespace-nowrap`}>{s.label}</span>;
}

export default function Orders() {
  const context = useContext(MyContext);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openOrder, setOpenOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = () => {
    setIsLoading(true);
    fetchDataFromApi("/api/orders?page=1&perPage=1000").then((res) => {
      setOrders(res?.data || []);
      setFilteredOrders(res?.data || []);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    let result = [...orders];
    if (filterStatus !== "all") result = result.filter(o => o.status === filterStatus);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(o =>
        o.orderId?.toLowerCase().includes(q) ||
        o.userId?.name?.toLowerCase().includes(q) ||
        o.userId?.email?.toLowerCase().includes(q)
      );
    }
    setFilteredOrders(result);
    setPage(0);
  }, [filterStatus, searchQuery, orders]);

  const updateOrderStatus = (orderId, status) => {
    postData(`/api/orders/${orderId}/statut`, { status }).then((res) => {
      if (res?.success) {
        context.alertBox("success", "Statut de la commande mis à jour");
        loadOrders();
      }
    });
  };

  // Admin peut aussi mettre à jour le statut d'un item (ex: marquer "en-livraison")
  const updateItemStatus = (orderId, itemId, status) => {
    postData("/api/seller/commande/statut", { orderId, itemId, status }).then((res) => {
      if (res?.success) {
        context.alertBox("success", "Statut de l'article mis à jour");
        loadOrders();
      }
    });
  };

  const paginatedOrders = filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className="card shadow-sm rounded-xl bg-white">
      {/* En-tête */}
      <div className="flex items-center justify-between !px-5 !py-4 border-b border-gray-100">
        <div>
          <h2 className="text-[18px] font-[600]">Commandes</h2>
          <p className="text-[13px] text-gray-400">{filteredOrders.length} commande(s)</p>
        </div>
        <div className="flex items-center gap-3">
          <Select size="small" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-[170px]">
            <MenuItem value="all">Toutes</MenuItem>
            {ADMIN_STATUSES.map(s => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
          </Select>
          <div className="w-[220px]">
            <SearchBox onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center !py-16"><CircularProgress /></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-600 uppercase bg-gray-50">
              <tr>
                <th className="!px-4 !py-3">&nbsp;</th>
                <th className="!px-4 !py-3">Id Commande</th>
                <th className="!px-4 !py-3">Client</th>
                <th className="!px-4 !py-3">Adresse</th>
                <th className="!px-4 !py-3">Total</th>
                <th className="!px-4 !py-3">Commission</th>
                <th className="!px-4 !py-3">Paiement</th>
                <th className="!px-4 !py-3">Statut global</th>
                <th className="!px-4 !py-3">Date</th>
                <th className="!px-4 !py-3">Action admin</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.length === 0 ? (
                <tr><td colSpan={10} className="text-center !py-10 text-gray-400">Aucune commande</td></tr>
              ) : paginatedOrders.map((order, index) => (
                <>
                  <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="!px-4 !py-3">
                      <Button className="!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !bg-gray-100"
                        onClick={() => setOpenOrder(openOrder === index ? null : index)}>
                        {openOrder === index ? <FaAngleUp className="text-[12px]" /> : <FaAngleDown className="text-[12px]" />}
                      </Button>
                    </td>
                    <td className="!px-4 !py-3 text-primary font-[600] text-[12px] whitespace-nowrap">{order.orderId}</td>
                    <td className="!px-4 !py-3">
                      <p className="text-[13px] font-[500]">{order.userId?.name}</p>
                      <p className="text-[11px] text-gray-400">{order.userId?.email}</p>
                    </td>
                    <td className="!px-4 !py-3 text-[12px] text-gray-600 max-w-[130px]">
                      <span className="line-clamp-2">{order.delivery_address?.ville}, {order.delivery_address?.pays}</span>
                    </td>
                    <td className="!px-4 !py-3 font-[700] text-[13px]">{order.totalAmt?.toLocaleString()} Fcfa</td>
                    <td className="!px-4 !py-3 text-purple-600 font-[600] text-[13px]">{order.totalCommission?.toLocaleString()} Fcfa</td>
                    <td className="!px-4 !py-3"><Badge status={order.paymentStatus} /></td>
                    <td className="!px-4 !py-3"><Badge status={order.status} /></td>
                    <td className="!px-4 !py-3 text-[11px] text-gray-400 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="!px-4 !py-3">
                      <Select size="small" value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className="w-[140px] text-[12px]">
                        {ADMIN_STATUSES.map(s => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
                      </Select>
                    </td>
                  </tr>

                  {openOrder === index && (
                    <tr>
                      <td colSpan={10} className="!px-8 !py-4 bg-[#fafafa]">
                        <p className="text-[13px] font-[600] !mb-3 text-gray-700">Détails des articles :</p>
                        <table className="w-full text-sm">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="!px-3 !py-2 text-left text-[11px]">Image</th>
                              <th className="!px-3 !py-2 text-left text-[11px]">Produit</th>
                              <th className="!px-3 !py-2 text-[11px]">Vendeur</th>
                              <th className="!px-3 !py-2 text-[11px]">Qté</th>
                              <th className="!px-3 !py-2 text-[11px]">Taille</th>
                              <th className="!px-3 !py-2 text-[11px]">Sous-total</th>
                              <th className="!px-3 !py-2 text-[11px]">Commission</th>
                              <th className="!px-3 !py-2 text-[11px]">Net vendeur</th>
                              <th className="!px-3 !py-2 text-[11px]">Statut article</th>
                              <th className="!px-3 !py-2 text-[11px]">Modifier</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.items?.map((item) => (
                              <tr key={item._id} className="border-b border-gray-100">
                                <td className="!px-3 !py-2">
                                  <img src={item.productImage} className="w-[38px] h-[38px] rounded-md object-cover" />
                                </td>
                                <td className="!px-3 !py-2 text-[12px] font-[500]">{item.productName}</td>
                                <td className="!px-3 !py-2 text-[12px] text-primary">{item.sellerName}</td>
                                <td className="!px-3 !py-2 text-[12px] text-center">{item.quantity}</td>
                                <td className="!px-3 !py-2 text-[12px] text-center">{item.size || "—"}</td>
                                <td className="!px-3 !py-2 text-[12px] font-[600]">{item.subtotal?.toLocaleString()} Fcfa</td>
                                <td className="!px-3 !py-2 text-[12px] text-purple-600 font-[600]">
                                  {item.commission?.toLocaleString()} Fcfa
                                  {item.commissionRate && item.commissionRate !== 10 && (
                                    <span className="text-[10px] text-orange-500 block">({item.commissionRate}%)</span>
                                  )}
                                </td>
                                <td className="!px-3 !py-2 text-[12px] text-green-600 font-[600]">{item.sellerRevenue?.toLocaleString()} Fcfa</td>
                                <td className="!px-3 !py-2"><ItemStatusBadge status={item.status} /></td>
                                <td className="!px-3 !py-2">
                                  <Select size="small" value={item.status}
                                    onChange={(e) => updateItemStatus(order._id, item._id, e.target.value)}
                                    className="text-[11px]" sx={{ minWidth: 140 }}>
                                    {Object.entries(ITEM_STATUSES_LABELS).map(([val, { label }]) => (
                                      <MenuItem key={val} value={val} className="text-[12px]">{label}</MenuItem>
                                    ))}
                                  </Select>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="flex justify-between !mt-3 !pt-3 border-t border-gray-200">
                          <div className="text-[12px] text-gray-500">
                            Paiement: <strong>{order.paymentMethod}</strong>
                            {order.note && <> · Note: <em>{order.note}</em></>}
                          </div>
                          <div className="flex gap-6 text-[13px]">
                            <span>Livraison: <strong>{order.deliveryFee === 0 ? "Gratuite" : `${order.deliveryFee?.toLocaleString()} Fcfa`}</strong></span>
                            <span className="text-primary font-[700]">Total: {order.totalAmt?.toLocaleString()} Fcfa</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>

          <TablePagination
            component="div" count={filteredOrders.length}
            rowsPerPage={rowsPerPage} page={page}
            onPageChange={(_, p) => setPage(p)}
            onRowsPerPageChange={(e) => { setRowsPerPage(+e.target.value); setPage(0); }}
            rowsPerPageOptions={[10, 25, 50]}
            labelRowsPerPage="Par page :"
          />
        </div>
      )}
    </div>
  );
}




{/*import { useState, useEffect, useContext } from "react";
import Badge from "../Badge/index";
import { FaAngleUp, FaAngleDown } from "react-icons/fa6";
import Button from "@mui/material/Button";
import SearchBox from "../SearchBox";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import TablePagination from "@mui/material/TablePagination";
import { fetchDataFromApi, postData } from "../../utils/api";
import { MyContext } from "../../App";

export default function Orders() {
  const context = useContext(MyContext);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openOrder, setOpenOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = () => {
    setIsLoading(true);
    fetchDataFromApi("/api/orders?page=1&perPage=1000").then((res) => {
      setOrders(res?.data || []);
      setFilteredOrders(res?.data || []);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    let result = [...orders];
    if (filterStatus !== "all") result = result.filter(o => o.status === filterStatus);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(o =>
        o.orderId?.toLowerCase().includes(q) ||
        o.userId?.name?.toLowerCase().includes(q) ||
        o.userId?.email?.toLowerCase().includes(q)
      );
    }
    setFilteredOrders(result);
    setPage(0);
  }, [filterStatus, searchQuery, orders]);

  const updateStatus = (orderId, status) => {
    postData(`/api/orders/${orderId}/statut`, { status }).then((res) => {
      if (res?.success) {
        context.alertBox("success", "Statut mis à jour");
        loadOrders();
      }
    });
  };

  const paginatedOrders = filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const statusColors = {
    "en-attente": "bg-orange-100 text-orange-700",
    "confirmé": "bg-blue-100 text-blue-700",
    "expédié": "bg-purple-100 text-purple-700",
    "livré": "bg-green-100 text-green-700",
    "annulé": "bg-red-100 text-red-700",
  };

  return (
    <div className="card !my-4 shadow-sm rounded-xl bg-white">
      <div className="flex items-center justify-between !px-5 !py-4 border-b border-gray-100">
        <div>
          <h2 className="text-[18px] font-[600]">Commandes</h2>
          <p className="text-[13px] text-gray-400">{filteredOrders.length} commande(s)</p>
        </div>
        <div className="flex items-center gap-3">
          <Select size="small" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-[160px]">
            <MenuItem value="all">Toutes</MenuItem>
            <MenuItem value="en-attente">En attente</MenuItem>
            <MenuItem value="confirmé">Confirmées</MenuItem>
            <MenuItem value="expédié">Expédiées</MenuItem>
            <MenuItem value="livré">Livrées</MenuItem>
            <MenuItem value="annulé">Annulées</MenuItem>
          </Select>
          <div className="w-[220px]">
            <SearchBox onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center !py-16"><CircularProgress /></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-600 uppercase bg-gray-50">
              <tr>
                <th className="!px-5 !py-3">&nbsp;</th>
                <th className="!px-5 !py-3">Id Commande</th>
                <th className="!px-5 !py-3">Client</th>
                <th className="!px-5 !py-3">Adresse</th>
                <th className="!px-5 !py-3">Total</th>
                <th className="!px-5 !py-3">Commission</th>
                <th className="!px-5 !py-3">Paiement</th>
                <th className="!px-5 !py-3">Statut</th>
                <th className="!px-5 !py-3">Date</th>
                <th className="!px-5 !py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.length === 0 ? (
                <tr><td colSpan={10} className="text-center !py-10 text-gray-400">Aucune commande trouvée</td></tr>
              ) : paginatedOrders.map((order, index) => (
                <>
                  <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="!px-5 !py-3">
                      <Button className="!w-[32px] !h-[32px] !min-w-[32px] !rounded-full !bg-gray-100"
                        onClick={() => setOpenOrder(openOrder === index ? null : index)}>
                        {openOrder === index ? <FaAngleUp className="text-[13px]" /> : <FaAngleDown className="text-[13px]" />}
                      </Button>
                    </td>
                    <td className="!px-5 !py-3 text-primary font-[600] text-[13px] whitespace-nowrap">{order.orderId}</td>
                    <td className="!px-5 !py-3">
                      <p className="text-[13px] font-[500]">{order.userId?.name}</p>
                      <p className="text-[11px] text-gray-400">{order.userId?.email}</p>
                    </td>
                    <td className="!px-5 !py-3 text-[12px] max-w-[150px]">
                      <span className="line-clamp-2 text-gray-600">
                        {order.delivery_address?.ville}, {order.delivery_address?.pays}
                      </span>
                    </td>
                    <td className="!px-5 !py-3 font-[700] text-[13px]">{order.totalAmt?.toLocaleString()} Fcfa</td>
                    <td className="!px-5 !py-3 text-purple-600 font-[600] text-[13px]">{order.totalCommission?.toLocaleString()} Fcfa</td>
                    <td className="!px-5 !py-3"><Badge status={order.paymentStatus} /></td>
                    <td className="!px-5 !py-3"><Badge status={order.status} /></td>
                    <td className="!px-5 !py-3 text-[12px] text-gray-400 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="!px-5 !py-3">
                      <Select size="small" value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className="w-[130px] text-[12px]">
                        <MenuItem value="en-attente">En attente</MenuItem>
                        <MenuItem value="confirmé">Confirmé</MenuItem>
                        <MenuItem value="expédié">Expédié</MenuItem>
                        <MenuItem value="livré">Livré</MenuItem>
                        <MenuItem value="annulé">Annulé</MenuItem>
                      </Select>
                    </td>
                  </tr>
                  {openOrder === index && (
                    <tr>
                      <td colSpan={10} className="!px-10 !py-4 bg-[#fafafa]">
                        <p className="text-[13px] font-[600] !mb-3">Détails des produits commandés :</p>
                        <table className="w-full text-sm">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="!px-3 !py-2 text-left text-[11px]">Image</th>
                              <th className="!px-3 !py-2 text-left text-[11px]">Produit</th>
                              <th className="!px-3 !py-2 text-[11px]">Vendeur</th>
                              <th className="!px-3 !py-2 text-[11px]">Qté</th>
                              <th className="!px-3 !py-2 text-[11px]">Taille</th>
                              <th className="!px-3 !py-2 text-[11px]">Sous-total</th>
                              <th className="!px-3 !py-2 text-[11px]">Commission (10%)</th>
                              <th className="!px-3 !py-2 text-[11px]">Net vendeur</th>
                              <th className="!px-3 !py-2 text-[11px]">Statut</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.items?.map((item) => (
                              <tr key={item._id} className="border-b border-gray-100">
                                <td className="!px-3 !py-2">
                                  <img src={item.productImage} className="w-[40px] h-[40px] rounded-md object-cover" />
                                </td>
                                <td className="!px-3 !py-2 text-[12px] font-[500]">{item.productName}</td>
                                <td className="!px-3 !py-2 text-[12px] text-primary">{item.sellerName}</td>
                                <td className="!px-3 !py-2 text-[12px] text-center">{item.quantity}</td>
                                <td className="!px-3 !py-2 text-[12px] text-center">{item.size || "—"}</td>
                                <td className="!px-3 !py-2 text-[12px] font-[600]">{item.subtotal?.toLocaleString()} Fcfa</td>
                                <td className="!px-3 !py-2 text-[12px] text-purple-600 font-[600]">{item.commission?.toLocaleString()} Fcfa</td>
                                <td className="!px-3 !py-2 text-[12px] text-green-600 font-[600]">{item.sellerRevenue?.toLocaleString()} Fcfa</td>
                                <td className="!px-3 !py-2"><Badge status={item.status} /></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="flex justify-between !mt-3 !pt-3 border-t border-gray-200">
                          <div className="text-[12px] text-gray-500">
                            Mode de paiement : <strong>{order.paymentMethod}</strong>
                            {order.note && <> | Note : <em>{order.note}</em></>}
                          </div>
                          <div className="flex gap-6 text-[13px]">
                            <span>Livraison : <strong>{order.deliveryFee === 0 ? "Gratuite" : `${order.deliveryFee?.toLocaleString()} Fcfa`}</strong></span>
                            <span className="text-primary font-[700]">Total : {order.totalAmt?.toLocaleString()} Fcfa</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
          <TablePagination
            component="div"
            count={filteredOrders.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            onRowsPerPageChange={(e) => { setRowsPerPage(+e.target.value); setPage(0); }}
            rowsPerPageOptions={[10, 25, 50]}
            labelRowsPerPage="Par page :"
          />
        </div>
      )}
    </div>
  );
}
*/}



{/*import { useState, useEffect, useContext } from "react";
import { fetchDataFromApi, editImages } from "../../utils/api";
import { MyContext } from "../../App";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import Pagination from "@mui/material/Pagination";
import SearchBox from "../SearchBox";
import Badge from "../Badge/index";
import { FaAngleUp, FaAngleDown } from "react-icons/fa6";
import toast from "react-hot-toast";

export default function Orders() {
  const context = useContext(MyContext);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openOrder, setOpenOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 15;

  useEffect(() => { loadOrders(); }, [page, statusFilter]);

  const loadOrders = () => {
    setIsLoading(true);
    const statusParam = statusFilter !== "all" ? `&status=${statusFilter}` : "";
    fetchDataFromApi(`/api/orders?page=${page}&perPage=${perPage}${statusParam}`).then(res => {
      setOrders(res?.data || []);
      setFilteredOrders(res?.data || []);
      setTotalPages(res?.totalPages || 1);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    if (!searchQuery.trim()) { setFilteredOrders(orders); return; }
    const q = searchQuery.toLowerCase();
    setFilteredOrders(orders.filter(o =>
      o.orderId?.toLowerCase().includes(q) ||
      o.userId?.name?.toLowerCase().includes(q) ||
      o.userId?.email?.toLowerCase().includes(q)
    ));
  }, [searchQuery, orders]);

  const updateOrderStatus = (orderId, status) => {
    editImages(`/api/orders/${orderId}/statut`, { status }).then(res => {
      if (res?.success) {
        toast.success("Statut mis à jour");
        loadOrders();
      }
    });
  };

  const statusOptions = ["en-attente", "confirmé", "expédié", "livré", "annulé"];

  return (
    <>
      <div className="flex items-center justify-between !mb-4">
        <h2 className="text-[18px] font-[600]">
          Toutes les commandes
          <span className="text-[13px] text-gray-400 font-[400] !ml-2">({filteredOrders.length})</span>
        </h2>
        <div className="flex items-center gap-3">
          <Select size="small" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="w-[160px]">
            <MenuItem value="all">Tous les statuts</MenuItem>
            {statusOptions.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </Select>
          <div className="w-[200px]">
            <SearchBox onChange={e => setSearchQuery(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="card shadow-md sm:rounded-lg bg-white">
        {isLoading ? (
          <div className="flex justify-center !py-16"><CircularProgress /></div>
        ) : (
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th className="!px-4 !py-3">&nbsp;</th>
                  <th className="!px-4 !py-3">Id Commande</th>
                  <th className="!px-4 !py-3">Client</th>
                  <th className="!px-4 !py-3">Adresse</th>
                  <th className="!px-4 !py-3">Total</th>
                  <th className="!px-4 !py-3">Commission</th>
                  <th className="!px-4 !py-3">Paiement</th>
                  <th className="!px-4 !py-3">Statut</th>
                  <th className="!px-4 !py-3">Date</th>
                  <th className="!px-4 !py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr><td colSpan={10} className="text-center !py-10 text-gray-400">Aucune commande trouvée</td></tr>
                ) : filteredOrders.map((order, index) => (
                  <>
                    <tr key={order._id} className="bg-white border-b border-gray-100 hover:bg-gray-50">
                      <td className="!px-4 !py-3">
                        <Button className="!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !bg-gray-100"
                          onClick={() => setOpenOrder(openOrder === index ? null : index)}>
                          {openOrder === index ? <FaAngleUp /> : <FaAngleDown />}
                        </Button>
                      </td>
                      <td className="!px-4 !py-3 text-primary font-[700] text-[13px] whitespace-nowrap">{order.orderId}</td>
                      <td className="!px-4 !py-3">
                        <div>
                          <p className="font-[500] text-[13px] !mb-0">{order.userId?.name}</p>
                          <p className="text-[11px] text-gray-400 !mb-0">{order.userId?.email}</p>
                        </div>
                      </td>
                      <td className="!px-4 !py-3 text-[12px] max-w-[150px]">
                        <span className="line-clamp-2">
                          {order.delivery_address?.quartier}, {order.delivery_address?.ville}
                        </span>
                      </td>
                      <td className="!px-4 !py-3 font-[700] text-[13px]">{order.totalAmt?.toLocaleString()} Fcfa</td>
                      <td className="!px-4 !py-3 text-green-600 font-[700] text-[13px]">{order.totalCommission?.toLocaleString()} Fcfa</td>
                      <td className="!px-4 !py-3"><Badge status={order.paymentStatus} /></td>
                      <td className="!px-4 !py-3"><Badge status={order.status} /></td>
                      <td className="!px-4 !py-3 text-[12px] text-gray-400 whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="!px-4 !py-3">
                        <Select size="small" value={order.status}
                          onChange={e => updateOrderStatus(order._id, e.target.value)}
                          className="text-[12px]" sx={{ fontSize: "12px", minWidth: "130px" }}>
                          {statusOptions.map(s => <MenuItem key={s} value={s} sx={{ fontSize: "12px" }}>{s}</MenuItem>)}
                        </Select>
                      </td>
                    </tr>
                    {openOrder === index && (
                      <tr>
                        <td colSpan={10} className="!px-8 !py-4 bg-gray-50">
                          <table className="w-full text-sm">
                            <thead className="bg-white">
                              <tr>
                                <th className="!px-3 !py-2 text-left text-[11px]">Image</th>
                                <th className="!px-3 !py-2 text-left text-[11px]">Produit</th>
                                <th className="!px-3 !py-2 text-[11px]">Qté</th>
                                <th className="!px-3 !py-2 text-[11px]">Taille</th>
                                <th className="!px-3 !py-2 text-[11px]">Prix unitaire</th>
                                <th className="!px-3 !py-2 text-[11px]">Total</th>
                                <th className="!px-3 !py-2 text-[11px]">Commission</th>
                                <th className="!px-3 !py-2 text-[11px]">Vendeur</th>
                                <th className="!px-3 !py-2 text-[11px]">Statut</th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.items?.map(item => (
                                <tr key={item._id} className="border-b border-gray-100">
                                  <td className="!px-3 !py-2">
                                    <img src={item.productImage} className="w-[40px] h-[40px] object-cover rounded-md" />
                                  </td>
                                  <td className="!px-3 !py-2 text-[13px] font-[500] max-w-[150px] line-clamp-2">{item.productName}</td>
                                  <td className="!px-3 !py-2 text-center">{item.quantity}</td>
                                  <td className="!px-3 !py-2 text-center">{item.size || "—"}</td>
                                  <td className="!px-3 !py-2 text-[13px]">{item.price?.toLocaleString()} Fcfa</td>
                                  <td className="!px-3 !py-2 text-primary font-[600]">{item.subtotal?.toLocaleString()} Fcfa</td>
                                  <td className="!px-3 !py-2 text-green-600 font-[600]">{item.commission?.toLocaleString()} Fcfa</td>
                                  <td className="!px-3 !py-2 text-[12px] text-gray-500">{item.sellerName || "Suguba"}</td>
                                  <td className="!px-3 !py-2"><Badge status={item.status} /></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          {order.note && (
                            <p className="text-[13px] text-gray-500 !mt-2">📝 Note client: {order.note}</p>
                          )}
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center !py-4">
            <Pagination count={totalPages} page={page} onChange={(e, v) => setPage(v)} />
          </div>
        )}
      </div>
    </>
  );
}




{/*import Badge from "../Badge/index";
import { useState } from "react";
import { FaAngleUp } from "react-icons/fa6";
import { FaAngleDown } from "react-icons/fa6";
import Button from "@mui/material/Button";
import SearchBox from "../SearchBox";


export default function Orders(){
    const [isOpenOrderProduct,setIsOpenOrderProduct]=useState(null);
                       const isShowOrderProduct=(index)=>{
                        if (isOpenOrderProduct===index) {
                            setIsOpenOrderProduct(null);
                        }
                        else{
                            setIsOpenOrderProduct(index);
                        }
                       }
                       return(
    <div className='card !my-4 shadow-md sm:rounded-lg bg-white'> 
                <div className="flex items center justify-between !px-5 !py-5">
                    <h2 className="text-[18px] font-[600]">Commandes recentes</h2>
                     <div className="w-[40%]"><SearchBox/> </div>
                </div>
               
                <div className='relative overflow-x-auto !mt-5 !pb-5'> 
                      <table className="w-full text-sm text-left rtl:text-right text-body">
                          <thead className='text-xs text-gray-700 uppercase
                          bg-gray-100 '>
                <tr>
                <th className="!px-6 !py-3">
                    &nbsp;
                </th>
                 <th className="!px-6 !py-3 font-[600] whitespace-nowrap">
                    Id Commande
                </th>
                 <th className="!px-6 !py-3 font-[600] whitespace-nowrap">
                    Id Paiement
                </th>
                 <th className="!px-6 !py-3 font-[600] whitespace-nowrap">
                    Nom Complet
                </th>
                <th className="!px-6 !py-3 font-[600] whitespace-nowrap">
                    Numero de téléphone
                </th>
                 <th className="!px-6 !py-3 font-[600] whitespace-nowrap">
                    Addresse
                </th>
                 <th className="!px-6 !py-3 font-[600] whitespace-nowrap">
                    Email
                </th>
                
                 <th className="!px-6 !py-3 font-[600] whitespace-nowrap">
                    Code PIN
                </th>

                <th className="!px-6 !py-3 font-[600] whitespace-nowrap">
                    Somme Totale
                </th>
                 <th className="!px-6 !py-3 font-[600] whitespace-nowrap">
                    Statut Commande
                </th>
                 <th className="!px-6 !py-3 font-[600] whitespace-nowrap">
                    Date
                </th>
            </tr>
                          </thead>
                          <tbody className='text-gray-700'>
                              <tr className="bg-white border-b border-gray-300 ">
                                     <td className="!px-6 !py-4 !font-[500]">
                                        <Button className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full 
                                     !bg-[#f1f1f1]" onClick={()=>isShowOrderProduct(0)}>
                                        {
                                            isOpenOrderProduct=== 0 ?  <FaAngleUp className="text-[16px] text-[rgba(0,0,0,0.7)]"/> :
                                             <FaAngleDown className="text-[16px] text-[rgba(0,0,0,0.7)]"/>
                                        }
                                       
                                        </Button>
                                     </td>
                                     <td className="!px-6 !py-4 font-[500]">
                                        <span className="text-primary">353244</span>
                                     </td>
                                      <td className="!px-6 !py-4 font-[500]">
                                        <span className="text-primary">244</span>
                                     </td>
                                     <td className="!px-6 !py-4 font-[500]  whitespace-nowrap">Adja Sitan Diakité</td>
                                     <td className="!px-6 !py-4 font-[500]">+223 94 51 87 03</td>
                                     <td className="!px-6 !py-4 font-[500]">
                                        <span className="block w-[400px]">Mali Bamako golf</span></td>
                                      <td className="!px-6 !py-4 font-[500] ">
                                        <span className="text-primary">diakiteadjasitan@gmail.com</span>
                                     </td>
                                       <td className="!px-6 !py-4 font-[500]">22217</td>
                                     <td className="!px-6 !py-4 font-[500]">17 000Fcfa</td>
                                   
                                     <td className="!px-6 !py-4 font-[500]"><Badge status={"livré"}/> </td>
                                     <td className="!px-6 !py-4 font-[500] block w-[200px]">01-04-2026</td>
                             </tr>
                             {isOpenOrderProduct === 0 && (
                                    <tr>
                             <td className="!pl-20" colSpan="6">
                               <div className='relative overflow-x-auto !mt-5'> 
                      <table className="w-full text-sm text-left rtl:text-right text-body">
                          <thead className='text-xs text-gray-700 uppercase
                          bg-gray-100 '>
                <tr>
                 <th className="!px-6 !py-3 font-[600] whitespace-nowrap">
                    Id Produit
                </th>
                 
                 <th className="!px-6 !py-3 font-[600] whitespace-nowrap">
                    Titre Produit
                </th>
                 <th className="!px-6 !py-3 font-[600] whitespace-nowrap">
                    Image
                </th>
                 <th className="!px-6 !py-3 font-[600] whitespace-nowrap">
                    Quantité
                </th>
                 <th className="!px-6 !py-3 font-[600] whitespace-nowrap">
                    Prix
                </th>
                 <th className="!px-6 !py-3 font-[600] whitespace-nowrap">
                   Total
                </th>
            </tr>
                          </thead>
                          <tbody className='text-gray-700'>

                              <tr className="bg-white border-b border-gray-300 ">
                                    
                                     <td className="!px-6 !py-4 font-[500] ">
                                        <span className="text-gray-600">22222</span>
                                     </td>
                                     <td className="!px-6 !py-4 font-[500]">Robe beige</td>
                                     <td className="!px-6 !py-4 font-[500]">
                                       <img src="https://robe-rose-poudre.com/cdn/shop/files/Designsanstitre-2025-04-09T094817.768.png?crop=center&height=1200&v=1744184979&width=1200"
                                 className="w-[40px] h-[40px] object-cover !rounded-md"/>
                                        </td>
                                     <td className="!px-6 !py-4 font-[500] whitespace-nowrap">03</td>
                                     <td className="!px-6 !py-4 font-[500]">
                                       12 000fcfa</td>
                                         <td className="!px-6 !py-4 font-[500]"> 36 000Fcfa</td>
                             </tr>
                               <tr className="bg-white border-b border-gray-300 ">
                                    
                                     <td className="!px-6 !py-4 font-[500] ">
                                        <span className="text-gray-600">22222</span>
                                     </td>
                                     <td className="!px-6 !py-4 font-[500]">Robe beige</td>
                                     <td className="!px-6 !py-4 font-[500]">
                                       <img src="https://robe-rose-poudre.com/cdn/shop/files/Designsanstitre-2025-04-09T094817.768.png?crop=center&height=1200&v=1744184979&width=1200"
                                 className="w-[40px] h-[40px] object-cover !rounded-md"/>
                                        </td>
                                     <td className="!px-6 !py-4 font-[500] whitespace-nowrap">03</td>
                                     <td className="!px-6 !py-4 font-[500]">
                                        12 000fcfa</td>
                                          <td className="!px-6 !py-4 font-[500]"> 36 000Fcfa</td>
                             </tr>
                         </tbody>
                    </table>
                </div>
            </td>
                </tr>
                             )}
                              <tr className="bg-white border-b border-gray-300 ">
                                     <td className="!px-6 !py-4 !font-[500]">
                                        <Button className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full 
                                     !bg-[#f1f1f1]" onClick={()=>isShowOrderProduct(1)}>
                                        {
                                            isOpenOrderProduct=== 1 ?  <FaAngleUp className="text-[16px] text-[rgba(0,0,0,0.7)]"/> :
                                             <FaAngleDown className="text-[16px] text-[rgba(0,0,0,0.7)]"/>
                                        }
                                       
                                        </Button>
                                     </td>
                                     <td className="!px-6 !py-4 font-[500]">
                                        <span className="text-primary">353244</span>
                                     </td>
                                      <td className="!px-6 !py-4 font-[500]">
                                        <span className="text-primary">244</span>
                                     </td>
                                     <td className="!px-6 !py-4 font-[500]  whitespace-nowrap">Adja Sitan Diakité</td>
                                     <td className="!px-6 !py-4 font-[500]">+223 94 51 87 03</td>
                                     <td className="!px-6 !py-4 font-[500]">
                                        <span className="block w-[400px]">Mali Bamako golf</span></td>
                                      <td className="!px-6 !py-4 font-[500] ">
                                        <span className="text-primary">diakiteadjasitan@gmail.com</span>
                                     </td>
                                       <td className="!px-6 !py-4 font-[500]">22217</td>
                                     <td className="!px-6 !py-4 font-[500]">17 000Fcfa</td>
                                   
                                     <td className="!px-6 !py-4 font-[500]"><Badge status={"en-attente"}/> </td>
                                     <td className="!px-6 !py-4 font-[500] block w-[200px]">01-04-2026</td>
                             </tr>
                              {isOpenOrderProduct === 1 && (
                                    <tr>
                             <td className="!pl-20" colSpan="6">
                               <div className='relative overflow-x-auto !mt-5'> 
                      <table className="w-full text-sm text-left rtl:text-right text-body">
                          <thead className='text-xs text-gray-700 uppercase
                          bg-gray-100 '>
                <tr>
                 <th className="!px-6 !py-3 font-[600] whitespace-nowrap">
                    Id Produit
                </th>
                 
                 <th className="!px-6 !py-3 font-[600] whitespace-nowrap">
                    Titre Produit
                </th>
                 <th className="!px-6 !py-3 font-[600] whitespace-nowrap">
                    Image
                </th>
                 <th className="!px-6 !py-3 font-[600] whitespace-nowrap">
                    Quantité
                </th>
                 <th className="!px-6 !py-3 font-[600] whitespace-nowrap">
                    Prix
                </th>
                 <th className="!px-6 !py-3 font-[600] whitespace-nowrap">
                   Total
                </th>
            </tr>
                          </thead>
                          <tbody className='text-gray-700'>

                              <tr className="bg-white border-b border-gray-300 ">
                                    
                                     <td className="!px-6 !py-4 font-[500] ">
                                        <span className="text-gray-600">22222</span>
                                     </td>
                                     <td className="!px-6 !py-4 font-[500]">Robe beige</td>
                                     <td className="!px-6 !py-4 font-[500]">
                                       <img src="https://robe-rose-poudre.com/cdn/shop/files/Designsanstitre-2025-04-09T094817.768.png?crop=center&height=1200&v=1744184979&width=1200"
                                 className="w-[40px] h-[40px] object-cover !rounded-md"/>
                                        </td>
                                     <td className="!px-6 !py-4 font-[500] whitespace-nowrap">03</td>
                                     <td className="!px-6 !py-4 font-[500]">
                                       12 000fcfa</td>
                                         <td className="!px-6 !py-4 font-[500]"> 36 000Fcfa</td>
                             </tr>
                               <tr className="bg-white border-b border-gray-300 ">
                                    
                                     <td className="!px-6 !py-4 font-[500] ">
                                        <span className="text-gray-600">22222</span>
                                     </td>
                                     <td className="!px-6 !py-4 font-[500]">Robe beige</td>
                                     <td className="!px-6 !py-4 font-[500]">
                                       <img src="https://robe-rose-poudre.com/cdn/shop/files/Designsanstitre-2025-04-09T094817.768.png?crop=center&height=1200&v=1744184979&width=1200"
                                 className="w-[40px] h-[40px] object-cover !rounded-md"/>
                                        </td>
                                     <td className="!px-6 !py-4 font-[500] whitespace-nowrap">03</td>
                                     <td className="!px-6 !py-4 font-[500]">
                                        12 000fcfa</td>
                                          <td className="!px-6 !py-4 font-[500]"> 36 000Fcfa</td>
                             </tr>
                         </tbody>
                    </table>
                </div>
            </td>
                </tr>
                             )}
                            
                           
                    </tbody>
    </table>
              </div>
          </div>
                       )
}*/}