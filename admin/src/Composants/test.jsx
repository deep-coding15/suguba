import Button from "@mui/material/Button";
import { IoMdAdd } from "react-icons/io";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import SearchBox from "../SearchBox/index";
import { FaRegEye } from "react-icons/fa6";
import { useContext, useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProgressBar from "../ProgressBar/index";
import { AiOutlineEdit } from "react-icons/ai";
import { BsTrash } from "react-icons/bs";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import { MyContext } from "../../App";
import { fetchDataFromApi, deleteData } from "../../utils/api";

const label = { slotProps: { input: { 'aria-label': 'Checkbox demo' } } };

const columns = [
  { id: 'product', label: 'Produit', minWidth: 150 },
  { id: 'category', label: 'Categorie', minWidth: 100 },
  { id: 'subcategory', label: 'Sous Categorie', minWidth: 150 },
  { id: 'price', label: 'Prix', minWidth: 130 },
  { id: 'sales', label: 'Ventes', minWidth: 100 },
  { id: 'actions', label: 'Actions', minWidth: 120 },
];

export default function Produit() {
  // ─── États filtres & recherche ───────────────────────────────────────────
  const [categoryFilterVal, setCategoryFilterVal] = useState('');
  const [subCatFilterVal, setSubCatFilterVal] = useState('');
  const [subSubFilterVal, setSubSubFilterVal] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // ─── États données ────────────────────────────────────────────────────────
  const [products, setProducts] = useState([]);          // tous les produits chargés
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  // ─── Listes dynamiques pour les selects ──────────────────────────────────
  const [catList, setCatList] = useState([]);
  const [subCatList, setSubCatList] = useState([]);
  const [subSubCatList, setSubSubCatList] = useState([]);

  // ─── Pagination ───────────────────────────────────────────────────────────
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // ─── Sélection multiple ───────────────────────────────────────────────────
  const [selected, setSelected] = useState([]);

  // ─── Modal suppression ────────────────────────────────────────────────────
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const context = useContext(MyContext);
  const navigate = useNavigate();

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. CHARGEMENT INITIAL DES PRODUITS
  // ═══════════════════════════════════════════════════════════════════════════
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchDataFromApi(`/api/produits?page=1&perPage=10000`);
      if (data?.produits) {
        setProducts(data.produits);
        setFilteredProducts(data.produits);
        setTotalPages(data.totalPages || 1);

        // ── Peuplement dynamique des listes de filtres ──────────────────
        const cats = [...new Map(
          data.produits.map(p => [p.catId, { id: p.catId, name: p.catName }])
        ).values()].filter(c => c.id && c.id.trim() !== "");

        const subCats = [...new Map(
          data.produits.map(p => [p.subCatId, { id: p.subCatId, name: p.subCat }])
        ).values()].filter(c => c.id && c.id.trim() !== "");

        const subSubCats = [...new Map(
          data.produits.map(p => [p.thirdsubCatId, { id: p.thirdsubCatId, name: p.thirdsubCat }])
        ).values()].filter(c => c.id && c.id.trim() !== "");

        setCatList(cats);
        setSubCatList(subCats);
        setSubSubCatList(subSubCats);
      }
    } catch (err) {
      console.error("Erreur chargement produits:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. FILTRAGE RÉACTIF (search + catégories)
  // ═══════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    let result = [...products];

    // Filtrage par catégorie
    if (categoryFilterVal) {
      result = result.filter(p => p.catId === categoryFilterVal);
    }
    // Filtrage par sous-catégorie
    if (subCatFilterVal) {
      result = result.filter(p => p.subCatId === subCatFilterVal);
    }
    // Filtrage par sous-sous-catégorie
    if (subSubFilterVal) {
      result = result.filter(p => p.thirdsubCatId === subSubFilterVal);
    }
    // Recherche textuelle (nom ou marque)
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        p =>
          p.name?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q)
      );
    }

    setFilteredProducts(result);
    setPage(0); // reset pagination après filtre
  }, [categoryFilterVal, subCatFilterVal, subSubFilterVal, searchQuery, products]);

  // Mise à jour dynamique des sous-catégories selon la catégorie sélectionnée
  useEffect(() => {
    if (categoryFilterVal) {
      const filtered = [...new Map(
        products
          .filter(p => p.catId === categoryFilterVal)
          .map(p => [p.subCatId, { id: p.subCatId, name: p.subCat }])
      ).values()].filter(c => c.id && c.id.trim() !== "");
      setSubCatList(filtered);
      setSubCatFilterVal('');
      setSubSubFilterVal('');
    }
  }, [categoryFilterVal, products]);

  // Mise à jour dynamique des sous-sous-catégories
  useEffect(() => {
    if (subCatFilterVal) {
      const filtered = [...new Map(
        products
          .filter(p => p.subCatId === subCatFilterVal)
          .map(p => [p.thirdsubCatId, { id: p.thirdsubCatId, name: p.thirdsubCat }])
      ).values()].filter(c => c.id && c.id.trim() !== "");
      setSubSubCatList(filtered);
      setSubSubFilterVal('');
    }
  }, [subCatFilterVal, products]);

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. SUPPRESSION
  // ═══════════════════════════════════════════════════════════════════════════
  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    try {
      const res = await deleteData(`/api/suppression-produit/${productToDelete._id}`);
      if (res?.success) {
        context.setAlertBox?.({ open: true, error: false, msg: "Produit supprimé avec succès" });
        setProducts(prev => prev.filter(p => p._id !== productToDelete._id));
      } else {
        context.setAlertBox?.({ open: true, error: true, msg: res?.message || "Erreur lors de la suppression" });
      }
    } catch (err) {
      context.setAlertBox?.({ open: true, error: true, msg: "Erreur réseau" });
    } finally {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. SÉLECTION MULTIPLE
  // ═══════════════════════════════════════════════════════════════════════════
  const isSelected = (id) => selected.includes(id);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(paginatedProducts.map(p => p._id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. EXPORT CSV
  // ═══════════════════════════════════════════════════════════════════════════
  const handleExport = () => {
    const toExport = selected.length > 0
      ? filteredProducts.filter(p => selected.includes(p._id))
      : filteredProducts;

    const headers = ["Nom", "Marque", "Categorie", "Sous-Categorie", "Sous-Sous-Categorie", "Prix", "Ancien Prix", "Stock", "Note", "Ventes", "Remise"];
    const rows = toExport.map(p => [
      `"${p.name}"`,
      `"${p.brand}"`,
      `"${p.catName}"`,
      `"${p.subCat}"`,
      `"${p.thirdsubCat}"`,
      p.price,
      p.oldPrice,
      p.countInStock,
      p.rating,
      p.sales || 0,
      `${p.discount}%`
    ]);

    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `produits_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. PAGINATION
  // ═══════════════════════════════════════════════════════════════════════════
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const paginatedProducts = filteredProducts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // 7. RESET FILTRES
  // ═══════════════════════════════════════════════════════════════════════════
  const handleResetFilters = () => {
    setCategoryFilterVal('');
    setSubCatFilterVal('');
    setSubSubFilterVal('');
    setSearchQuery('');
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <>
      {/* ── En-tête ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[18px] font-[600]">
          Les produits sur suguba
          <span className="ml-2 text-[14px] text-gray-500 font-[400]">
            ({filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''})
          </span>
        </h2>
        <div className="col w-[35%] !ml-auto flex items-center gap-3">
          <Button
            className="!bg-green-600 !text-white btn-sm btn !capitalize"
            onClick={handleExport}
            title={selected.length > 0 ? `Exporter ${selected.length} sélectionné(s)` : "Exporter tout"}
          >
            {selected.length > 0 ? `Exporter (${selected.length})` : "Exporter"}
          </Button>
          <Button
            className="btn-pink !text-[14px] btn-sm !text-white"
            onClick={() => context.setIsOpenFullScreen({ open: true, model: "Ajouter un produit" })}
          >
            <IoMdAdd /> Ajouter un produit
          </Button>
        </div>
      </div>

      {/* ── Carte principale ─────────────────────────────────────────────── */}
      <div className='card !my-4 !pt-5 shadow-md sm:rounded-lg bg-white'>

        {/* ── Filtres ───────────────────────────────────────────────────── */}
        <div className="flex items-end w-full !pl-5 gap-5 flex-wrap !pr-4">

          {/* Filtre Catégorie */}
          <div className="col w-[18%] min-w-[140px]">
            <h4 className="text-[13px] font-[600] !mb-2">Filtrez Par Categorie</h4>
            <Select
              className="w-full"
              size="small"
              value={categoryFilterVal}
              onChange={(e) => setCategoryFilterVal(e.target.value)}
            >
              <MenuItem value=""><em>Toutes</em></MenuItem>
              {catList.map(cat => (
                <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
              ))}
            </Select>
          </div>

          {/* Filtre Sous-Catégorie */}
          <div className="col w-[18%] min-w-[140px]">
            <h4 className="text-[13px] font-[600] !mb-2">Filtrez Par sous Categorie</h4>
            <Select
              className="w-full"
              size="small"
              value={subCatFilterVal}
              onChange={(e) => setSubCatFilterVal(e.target.value)}
              disabled={!categoryFilterVal}
            >
              <MenuItem value=""><em>Toutes</em></MenuItem>
              {subCatList.map(sub => (
                <MenuItem key={sub.id} value={sub.id}>{sub.name}</MenuItem>
              ))}
            </Select>
          </div>

          {/* Filtre Sous-Sous-Catégorie */}
          <div className="col w-[18%] min-w-[140px]">
            <h4 className="text-[13px] font-[600] !mb-2">Filtrez Par sous sous Categorie</h4>
            <Select
              className="w-full"
              size="small"
              value={subSubFilterVal}
              onChange={(e) => setSubSubFilterVal(e.target.value)}
              disabled={!subCatFilterVal}
            >
              <MenuItem value=""><em>Toutes</em></MenuItem>
              {subSubCatList.map(sub => (
                <MenuItem key={sub.id} value={sub.id}>{sub.name}</MenuItem>
              ))}
            </Select>
          </div>

          {/* Bouton reset */}
          {(categoryFilterVal || subCatFilterVal || subSubFilterVal || searchQuery) && (
            <div className="col flex items-end pb-[2px]">
              <Button
                size="small"
                variant="outlined"
                className="!capitalize !text-[12px] !h-[40px]"
                onClick={handleResetFilters}
              >
                Réinitialiser
              </Button>
            </div>
          )}

          {/* SearchBox */}
          <div className="col w-[20%] min-w-[160px] !ml-auto">
            <SearchBox
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <br />

        {/* ── Table ─────────────────────────────────────────────────────── */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <CircularProgress />
          </div>
        ) : (
          <>
            <TableContainer sx={{ maxHeight: 520 }}>
              <Table stickyHeader aria-label="table produits">
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        {...label}
                        size="small"
                        checked={paginatedProducts.length > 0 && paginatedProducts.every(p => isSelected(p._id))}
                        indeterminate={
                          paginatedProducts.some(p => isSelected(p._id)) &&
                          !paginatedProducts.every(p => isSelected(p._id))
                        }
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        style={{ minWidth: column.minWidth, fontWeight: 600 }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {paginatedProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={columns.length + 1} align="center" className="!py-10 !text-gray-400">
                        Aucun produit trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedProducts.map((product) => (
                      <TableRow
                        key={product._id}
                        hover
                        selected={isSelected(product._id)}
                        sx={{ '&:last-child td': { border: 0 } }}
                      >
                        {/* ── Checkbox ──────────────────────────────────── */}
                        <TableCell padding="checkbox">
                          <Checkbox
                            {...label}
                            size="small"
                            checked={isSelected(product._id)}
                            onChange={() => handleSelectOne(product._id)}
                          />
                        </TableCell>

                        {/* ── Produit (image + nom + marque) ────────────── */}
                        <TableCell>
                          <div className="flex items-center gap-4 w-[280px]">
                            <div className="img w-[65px] h-[65px] rounded-md overflow-hidden group flex-shrink-0">
                              <Link to={`/produit/${product._id}`}>
                                <img
                                  src={product.images?.[0] || '/placeholder.png'}
                                  alt={product.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-all"
                                />
                              </Link>
                            </div>
                            <div className="info w-[75%]">
                              <h3 className="font-[600] text-[12px] leading-4 hover:text-primary line-clamp-2">
                                <Link to={`/produit/${product._id}`}>
                                  {product.name}
                                </Link>
                              </h3>
                              <span className="text-[11px] text-gray-500">{product.brand}</span>
                              {product.isFeatures && (
                                <span className="ml-1 text-[10px] bg-yellow-100 text-yellow-700 px-1 rounded">
                                  ⭐ Feat.
                                </span>
                              )}
                            </div>
                          </div>
                        </TableCell>

                        {/* ── Catégorie ──────────────────────────────────── */}
                        <TableCell>
                          <span className="text-[13px]">{product.catName || '—'}</span>
                        </TableCell>

                        {/* ── Sous-Catégorie ─────────────────────────────── */}
                        <TableCell>
                          <div className="flex flex-col gap-[2px]">
                            {product.subCat && (
                              <span className="text-[12px] text-gray-700">{product.subCat}</span>
                            )}
                            {product.thirdsubCat && (
                              <span className="text-[11px] text-gray-400">↳ {product.thirdsubCat}</span>
                            )}
                          </div>
                        </TableCell>

                        {/* ── Prix ───────────────────────────────────────── */}
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {product.oldPrice > 0 && (
                              <span className="oldPrice line-through leading-3 text-gray-400 text-[12px] font-[500]">
                                {product.oldPrice?.toLocaleString('fr-FR')} Fcfa
                              </span>
                            )}
                            <span className="price text-primary text-[14px] font-[600]">
                              {product.price?.toLocaleString('fr-FR')} Fcfa
                            </span>
                            {product.discount > 0 && (
                              <span className="text-[11px] text-green-600 font-[500]">
                                -{product.discount}%
                              </span>
                            )}
                          </div>
                        </TableCell>

                        {/* ── Ventes ─────────────────────────────────────── */}
                        <TableCell>
                          <p className="text-[13px] w-[100px]">
                            <span className="font-[600]">{product.sales || 0}</span>{" "}Ventes
                          </p>
                          <ProgressBar
                            type="warning"
                            value={Math.min(100, ((product.sales || 0) / 500) * 100)}
                          />
                          <p className="text-[11px] text-gray-400 mt-1">
                            Stock: <span className={`font-[600] ${product.countInStock < 5 ? 'text-red-500' : 'text-gray-700'}`}>
                              {product.countInStock}
                            </span>
                          </p>
                        </TableCell>

                        {/* ── Actions ────────────────────────────────────── */}
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {/* Modifier */}
                            <Button
                              title="Modifier"
                              className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] border border-[rgba(0,0,0,0.4)] rounded-full hover:!bg-blue-50"
                              onClick={() => navigate(`/modification-produit/${product._id}`)}
                            >
                              <AiOutlineEdit className="text-blue-600 text-[18px]" />
                            </Button>

                            {/* Visualiser */}
                            <Button
                              title="Visualiser"
                              className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] border border-[rgba(0,0,0,0.4)] rounded-full hover:!bg-green-50"
                              onClick={() => navigate(`/produit/${product._id}`)}
                            >
                              <FaRegEye className="text-green-600 text-[18px]" />
                            </Button>

                            {/* Supprimer */}
                            <Button
                              title="Supprimer"
                              className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] border border-[rgba(0,0,0,0.4)] rounded-full hover:!bg-red-50"
                              onClick={() => handleDeleteClick(product)}
                            >
                              <BsTrash className="text-red-500 text-[18px]" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[10, 25, 50, 100]}
              component="div"
              count={filteredProducts.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Lignes par page :"
              labelDisplayedRows={({ from, to, count }) => `${from}–${to} sur ${count}`}
            />
          </>
        )}
      </div>

      {/* ── Dialog Confirmation Suppression ─────────────────────────────── */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Voulez-vous vraiment supprimer le produit{" "}
            <strong>"{productToDelete?.name}"</strong> ?
            Cette action est irréversible et supprimera aussi les images sur Cloudinary.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} className="!capitalize">
            Annuler
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            className="!capitalize !text-red-600"
            color="error"
            variant="contained"
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}