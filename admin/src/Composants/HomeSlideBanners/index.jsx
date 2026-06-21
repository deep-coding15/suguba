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
import Switch from '@mui/material/Switch';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import { FaRegEye } from "react-icons/fa6";
import { BsTrash } from "react-icons/bs";
import { MdStars } from "react-icons/md";
import { useContext, useState, useEffect } from "react";
import { MyContext } from "../../App";
import { fetchDataFromApi, deleteData } from "../../utils/api";
import axios from "axios";

const label = { slotProps: { input: { 'aria-label': 'Checkbox' } } };

export default function HomeSliderBanners() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sliders, setSliders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const context = useContext(MyContext);

  const loadSliders = () => {
    setIsLoading(true);
    fetchDataFromApi("/api/homeslider/all").then((res) => {
      setSliders(res?.data || []);
      setIsLoading(false);
    });
  };

  useEffect(() => { loadSliders(); }, []);

  const handleToggle = async (sliderId) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await axios.patch(`${apiUrl}/api/homeslider/${sliderId}/toggle`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accesstoken")}` }
      });
      if (res.data?.success) {
        context.alertBox("success", res.data.message);
        loadSliders();
      }
    } catch (err) {
      context.alertBox("error", "Erreur lors du changement de statut");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    const res = await deleteData(`/api/homeslider/${deleteId}`);
    if (res?.success || res?.message) {
      context.alertBox("success", "Slide supprimé");
      loadSliders();
    } else {
      context.alertBox("error", "Erreur suppression");
    }
    setDeleteLoading(false);
    setDeleteId(null);
  };

  return (
    <>
      <div className="flex items-center justify-between !mb-4">
        <div>
          <h2 className="text-[18px] font-[600]">Slides de l'accueil</h2>
          <p className="text-[13px] text-gray-400">{sliders.length} slide(s) total</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="btn-pink !text-[13px] !capitalize flex gap-2"
            onClick={() => context.setIsOpenFullScreen({ open: true, model: "Ajouter une Affiche" })}>
            <IoMdAdd /> Ajouter un slide
          </Button>
        </div>
      </div>

      <div className='card shadow-md sm:rounded-xl bg-white overflow-hidden'>
        {isLoading ? (
          <div className="flex justify-center !py-16"><CircularProgress /></div>
        ) : (
          <>
            <TableContainer sx={{ maxHeight: 520 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell width={50}><Checkbox {...label} size="small" /></TableCell>
                    <TableCell style={{ fontWeight: 600, fontSize: 12 }}>Aperçu</TableCell>
                    <TableCell style={{ fontWeight: 600, fontSize: 12 }}>Titre / Lien</TableCell>
                    <TableCell style={{ fontWeight: 600, fontSize: 12 }}>Type</TableCell>
                    <TableCell style={{ fontWeight: 600, fontSize: 12 }}>Ordre</TableCell>
                    <TableCell style={{ fontWeight: 600, fontSize: 12 }}>Statut</TableCell>
                    <TableCell style={{ fontWeight: 600, fontSize: 12 }}>Date</TableCell>
                    <TableCell style={{ fontWeight: 600, fontSize: 12 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sliders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" className="text-gray-400 !py-10">
                        Aucun slide — cliquez sur "Ajouter un slide" pour commencer
                      </TableCell>
                    </TableRow>
                  ) : sliders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((slide) => (
                    <TableRow hover key={slide._id}>
                      <TableCell><Checkbox {...label} size="small" /></TableCell>
                      <TableCell>
                        <div className="w-[100px] h-[60px] rounded-lg overflow-hidden bg-gray-100">
                          <img src={slide.image} className="w-full h-full object-cover" alt="slide" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-[13px] font-[500]">{slide.title || <span className="text-gray-400 italic">Sans titre</span>}</p>
                        {slide.subtitle && <p className="text-[11px] text-gray-400">{slide.subtitle}</p>}
                        <p className="text-[11px] text-primary">{slide.link}</p>
                      </TableCell>
                      <TableCell>
                        {slide.isFeaturedProduct ? (
                          <Chip
                            icon={<MdStars className="text-yellow-500" />}
                            label="Produit mis en avant"
                            size="small"
                            className="!bg-yellow-50 !text-yellow-700 !text-[11px]"
                          />
                        ) : (
                          <Chip label="Slide manuel" size="small" className="!bg-gray-100 !text-gray-600 !text-[11px]" />
                        )}
                        {slide.isFeaturedProduct && slide.productId && (
                          <p className="text-[10px] text-gray-400 !mt-1">
                            Produit: {slide.productId.name || "—"}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-[13px] font-[600]">{slide.order}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Switch
                            checked={slide.isActive}
                            onChange={() => handleToggle(slide._id)}
                            size="small" color="primary"
                          />
                          <span className={`text-[11px] font-[600] ${slide.isActive ? "text-green-600" : "text-gray-400"}`}>
                            {slide.isActive ? "Actif" : "Inactif"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-[12px] text-gray-400">
                          {new Date(slide.createdAt).toLocaleDateString("fr-FR")}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            className="!w-[32px] !h-[32px] !min-w-[32px] bg-[#f1f1f1] border border-[rgba(0,0,0,0.2)] rounded-full hover:!bg-green-50"
                            onClick={() => window.open(slide.link, "_blank")}>
                            <FaRegEye className="text-green-600 text-[14px]" />
                          </Button>
                          <Button
                            className="!w-[32px] !h-[32px] !min-w-[32px] bg-[#f1f1f1] border border-[rgba(0,0,0,0.2)] rounded-full hover:!bg-red-50"
                            onClick={() => setDeleteId(slide._id)}>
                            <BsTrash className="text-red-500 text-[14px]" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25]}
              component="div"
              count={sliders.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(_, p) => setPage(p)}
              onRowsPerPageChange={(e) => { setRowsPerPage(+e.target.value); setPage(0); }}
              labelRowsPerPage="Par page :"
            />
          </>
        )}
      </div>

      {/* Dialog suppression */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <p className="text-[14px] text-gray-600">Voulez-vous vraiment supprimer ce slide ? L'image sera supprimée de Cloudinary.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)} className="!capitalize">Annuler</Button>
          <Button onClick={handleDelete} color="error" variant="contained" disabled={deleteLoading} className="!capitalize">
            {deleteLoading ? <CircularProgress size={16} color="inherit" /> : "Supprimer"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}




{/*import Button from "@mui/material/Button";
import { IoMdAdd } from "react-icons/io";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';

import {FaRegEye } from "react-icons/fa6";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";

import { AiOutlineEdit } from "react-icons/ai";
import {BsTrash } from "react-icons/bs";

import { MyContext } from "../../App";

const label = { slotProps: { input: { 'aria-label': 'Checkbox demo' } } };

const columns = [
  { id: 'image', label: 'IMAGE', minWidth:150 },
  ,
  {
    id: 'action',
    label: 'Actions',
    minWidth:120,
  },
];

export default function  HomeSliderBanners(){

 const [page, setPage] =useState(0);
  const [rowsPerPage, setRowsPerPage] =useState(10);
  const context=useContext(MyContext);
  
 

  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

    return(
        <>
               
                    <div className="flex items center justify-between ">
                        <h2 className="text-[18px] font-[600]">Les Bannières(Affiches) de l'acceuil</h2>
                        <div className="col w-[35%] !ml-auto flex items-center gap-3">
                          <Button className="!bg-green-600 !text-white btn-sm btn !capitalize">Exporter</Button>
                          <Button className="btn-pink !text-[14px] btn-sm !text-white "
                          onClick={()=>context.setIsOpenFullScreen({open:true,model:"Ajouter une Affiche"})}><IoMdAdd/>Ajouter une Affiche</Button>
            
                       </div>
                    </div>

                   <div className='card !my-4 !pt-5 shadow-md sm:rounded-lg bg-white'>
                    
                   <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
                <TableCell width={60}>
                 <Checkbox {...label} size="small"/>
               </TableCell>
               {columns.map((column) => (
                <TableCell
                width={column.minWidth}
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow >
                   <TableCell   width={60}>
                          <Checkbox {...label} size="small"/>
                    </TableCell> 
                     <TableCell   style={{ minWidth: columns.minWidth }}>
                           <div className="flex items-center gap-4 w-[150px]">
                                        <div className="img w-full  !rounded-md overflow-hidden group">
                                             <Link to="/produit/1234" data-discover="true">
                                            <img src="https://thumbs.dreamstime.com/b/profilez-le-portrait-d-une-fille-d-adolescent-de-style-de-patineur-43975817.jpg?w=768" 
                                             className="w-full group-hover:scale-105 transition-all"/>
                                             </Link>
                                        </div>
                                    </div>
                    </TableCell> 
                     
                     <TableCell   style={{ minWidth: columns.minWidth }}>
                          <div className="flex items-center gap-1">
                                            <Button className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] border 
                                            border-[rgba(0,0,0,0.4)] rounded-full hover:!bg-[#f1f1f1]">
                                                <AiOutlineEdit className="text-[rgba(0,0,0,0.7)] text-[18px]"/>
                                            </Button>
                                             <Button className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] border 
                                            border-[rgba(0,0,0,0.4)] rounded-full hover:!bg-[#f1f1f1]">
                                                <FaRegEye className="text-[rgba(0,0,0,0.7)] text-[18px]"/>
                                            </Button>
                                             <Button className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] border 
                                            border-[rgba(0,0,0,0.4)] rounded-full hover:!bg-[#f1f1f1]">
                                                <BsTrash className="text-[rgba(0,0,0,0.7)] text-[18px]"/>
                                            </Button>
                                        </div>
                    </TableCell>
            </TableRow>
        
            
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={10}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
 </div>
                    
            

        
        </>
    )
}
     */}  