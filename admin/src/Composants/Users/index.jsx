import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import SearchBox from "../SearchBox/index";
import { useContext, useEffect, useState } from "react";
import { MdOutlineEmail } from "react-icons/md";
import { MyContext } from "../../App";
import { BiSolidCalendar } from "react-icons/bi";
import { fetchDataFromApi, editImages } from "../../utils/api.js";
import CircularProgress from "@mui/material/CircularProgress";
import { FaRegUser, FaStore } from "react-icons/fa";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import toast from "react-hot-toast";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

const label = { slotProps: { input: { "aria-label": "Checkbox demo" } } };

const columns = [
  { id: "userImg", label: "Profil", minWidth: 80 },
  { id: "userName", label: "Nom complet", minWidth: 150 },
  { id: "userEmail", label: "Email", minWidth: 200 },
  { id: "role", label: "Rôle", minWidth: 100 },
  { id: "status", label: "Statut", minWidth: 100 },
  { id: "createDate", label: "Date", minWidth: 130 },
  { id: "actions", label: "Actions", minWidth: 150 },
];

export default function Users() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [userList, setUserList] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [confirmDialog, setConfirmDialog] = useState({ open: false, user: null, action: "" });
  const context = useContext(MyContext);

  useEffect(() => {
    setIsLoading(true);
    fetchDataFromApi("/api/user/liste-utilisateurs").then(res => {
      if (res?.success) { setUserList(res.data); setFilteredUsers(res.data); }
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    let result = [...userList];
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(u => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q));
    }
    if (roleFilter !== "all") result = result.filter(u => u.role === roleFilter);
    if (statusFilter !== "all") result = result.filter(u => u.status === statusFilter);
    setFilteredUsers(result);
    setPage(0);
  }, [searchTerm, roleFilter, statusFilter, userList]);

  const handleUserAction = async (userId, action) => {
    let statusMap = { suspend: "Suspended", activate: "Active", deactivate: "Inactive" };
    const newStatus = statusMap[action];
    const res = await editImages(`/api/user/${userId}`, { status: newStatus });
    if (res?.success || res?.message) {
      toast.success(`Utilisateur ${action === "suspend" ? "suspendu" : "activé"}`);
      setUserList(prev => prev.map(u => u._id === userId ? { ...u, status: newStatus } : u));
    }
    setConfirmDialog({ open: false, user: null, action: "" });
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString("fr-FR") : "—";

  const statusBadge = (status) => {
    const map = { Active: "bg-green-100 text-green-700", Inactive: "bg-gray-100 text-gray-600", Suspended: "bg-red-100 text-red-600" };
    return <span className={`text-[11px] !px-2 !py-1 rounded-full font-[600] ${map[status] || "bg-gray-100"}`}>{status}</span>;
  };

  const roleBadge = (role) => {
    const map = { Admin: "bg-purple-100 text-purple-700", Seller: "bg-blue-100 text-blue-700", User: "bg-gray-100 text-gray-600" };
    return <span className={`text-[11px] !px-2 !py-1 rounded-full font-[600] ${map[role] || "bg-gray-100"}`}>{role}</span>;
  };

  return (
    <>
      <div className="flex items-center justify-between !mb-4">
        <h2 className="text-[18px] font-[600]">
          Utilisateurs
          <span className="text-[13px] text-gray-400 font-[400] !ml-2">({filteredUsers.length})</span>
        </h2>
        <div className="flex items-center gap-3">
          <Select size="small" value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="w-[120px]">
            <MenuItem value="all">Tous rôles</MenuItem>
            <MenuItem value="User">User</MenuItem>
            <MenuItem value="Seller">Seller</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
          </Select>
          <Select size="small" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-[130px]">
            <MenuItem value="all">Tous statuts</MenuItem>
            <MenuItem value="Active">Actif</MenuItem>
            <MenuItem value="Suspended">Suspendu</MenuItem>
            <MenuItem value="Inactive">Inactif</MenuItem>
          </Select>
          <div className="w-[200px]">
            <SearchBox onChange={e => setSearchTerm(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="card !my-4 !pt-3 shadow-md sm:rounded-lg bg-white">
        {isLoading ? (
          <div className="flex justify-center !py-10"><CircularProgress /></div>
        ) : (
          <>
            <TableContainer sx={{ maxHeight: 520 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell><Checkbox {...label} size="small" /></TableCell>
                    {columns.map(col => (
                      <TableCell key={col.id} style={{ minWidth: col.minWidth, fontWeight: 600, fontSize: "12px" }}>
                        {col.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow><TableCell colSpan={8} align="center" className="text-gray-400 !py-8">Aucun utilisateur</TableCell></TableRow>
                  ) : filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(user => (
                    <TableRow hover key={user._id}>
                      <TableCell><Checkbox {...label} size="small" /></TableCell>
                      <TableCell>
                        <div className="w-[42px] h-[42px] rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                          {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <FaRegUser className="text-gray-400 text-[18px]" />}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="font-[500] text-[13px]">{user.name}</span>
                          {user.isSeller && <FaStore className="text-blue-500 text-[12px]" />}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 text-[12px]">
                          <MdOutlineEmail className="text-gray-400" /> {user.email}
                        </span>
                      </TableCell>
                      <TableCell>{roleBadge(user.role)}</TableCell>
                      <TableCell>{statusBadge(user.status)}</TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 text-[12px]">
                          <BiSolidCalendar className="text-gray-400" /> {formatDate(user.createdAt)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {user.status === "Active" ? (
                            <Button size="small" variant="outlined" color="error"
                              className="!text-[11px] !capitalize"
                              onClick={() => setConfirmDialog({ open: true, user, action: "suspend" })}>
                              Suspendre
                            </Button>
                          ) : (
                            <Button size="small" variant="outlined" color="success"
                              className="!text-[11px] !capitalize"
                              onClick={() => setConfirmDialog({ open: true, user, action: "activate" })}>
                              Activer
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={filteredUsers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(_, p) => setPage(p)}
              onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0); }}
              labelRowsPerPage="Lignes par page"
            />
          </>
        )}
      </div>

     
      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, user: null, action: "" })}>
        <DialogTitle>
          {confirmDialog.action === "suspend" ? "Suspendre l'utilisateur" : "Activer l'utilisateur"}
        </DialogTitle>
        <DialogContent>
          <p>Voulez-vous vraiment {confirmDialog.action === "suspend" ? "suspendre" : "activer"} <strong>{confirmDialog.user?.name}</strong> ?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false })} className="!capitalize">Annuler</Button>
          <Button onClick={() => handleUserAction(confirmDialog.user?._id, confirmDialog.action)}
            color={confirmDialog.action === "suspend" ? "error" : "success"} variant="contained" className="!capitalize">
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}





{/*import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import SearchBox from "../SearchBox/index";
import { useContext, useEffect, useState } from "react";
import { MdOutlineEmail } from "react-icons/md";
import { MyContext } from "../../App";
import { BiSolidCalendar } from 'react-icons/bi';
import { fetchDataFromApi } from '../../utils/api.js';
import CircularProgress from '@mui/material/CircularProgress';
import { FaRegUser } from 'react-icons/fa';

const label = { slotProps: { input: { 'aria-label': 'Checkbox demo' } } };

const columns = [
    { id: 'userImg',    label: 'Profil',           minWidth: 80  },
    { id: 'userName',   label: 'Nom complet',       minWidth: 150 },
    { id: 'userEmail',  label: 'Email',             minWidth: 200 },
    { id: 'createDate', label: 'Date de création',  minWidth: 150 },
];

export default function Users() {
    const [page, setPage]               = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [userList, setUserList]       = useState([]);
    const [searchTerm, setSearchTerm]   = useState('');
    const [isLoading, setIsLoading]     = useState(false);
    const context = useContext(MyContext);

    // ✅ Chargement des utilisateurs au montage
    useEffect(() => {
        setIsLoading(true);
        fetchDataFromApi('/api/user/liste-utilisateurs').then((res) => {
            if (res?.success) {
                setUserList(res.data);
            } else {
                context.alertBox("error", res?.message || "Erreur de chargement");
            }
            setIsLoading(false);
        });
    }, []);

    // ✅ Filtrage par recherche
    const filteredUsers = userList.filter((user) =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    // ✅ Formater la date
    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        return d.toLocaleDateString('fr-FR', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        });
    };

    return (
        <>
            <div className='card !my-4 !pt-5 shadow-md sm:rounded-lg bg-white'>
                <div className="flex items-center w-full !px-5 justify-between">
                    <div className="col w-[40%]">
                        <h2 className="text-[18px] font-[600]">
                            Liste des Utilisateurs
                            {!isLoading && (
                                <span className="text-[14px] font-[400] text-gray-400 ml-2">
                                    ({filteredUsers.length})
                                </span>
                            )}
                        </h2>
                    </div>
                    <div className="col w-[40%] !ml-auto">
                        
                        <SearchBox onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(0);
                        }} />
                    </div>
                </div>
                <br />

               
                {isLoading ? (
                    <div className="flex justify-center items-center py-10">
                        <CircularProgress />
                    </div>
                ) : (
                    <>
                        <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <Checkbox {...label} size="small" />
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
                                    {filteredUsers.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center" className="text-gray-400 py-8">
                                                Aucun utilisateur trouvé
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredUsers
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((user) => (
                                                <TableRow hover key={user._id}>
                                                    
                                                    <TableCell>
                                                        <Checkbox {...label} size="small" />
                                                    </TableCell>

                                                    {/* ✅ Photo de profil 
                                                    <TableCell>
                                                        <div className="w-[45px] h-[45px] rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                                                            {user.avatar ? (
                                                                <img
                                                                    src={user.avatar}
                                                                    alt={user.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <FaRegUser className="text-gray-400 text-[20px]" />
                                                            )}
                                                        </div>
                                                    </TableCell>

                                                   
                                                    <TableCell>
                                                        <span className="font-[500] text-[14px]">
                                                            {user.name}
                                                        </span>
                                                    </TableCell>

                                                  
                                                    <TableCell>
                                                        <span className="flex items-center gap-2 text-[13px]">
                                                            <MdOutlineEmail className="text-gray-500" />
                                                            {user.email}
                                                        </span>
                                                    </TableCell>

                                                    
                                                    <TableCell>
                                                        <span className="flex items-center gap-2 text-[13px]">
                                                            <BiSolidCalendar className="text-gray-500" />
                                                            {formatDate(user.createdAt)}
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* ✅ Pagination branchée sur filteredUsers.length *
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 100]}
                            component="div"
                            count={filteredUsers.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            labelRowsPerPage="Lignes par page"
                        />
                    </>
                )}
            </div>
        </>
    );
}



{/*import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import SearchBox from "../SearchBox/index";

import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlinePhone } from "react-icons/md";
import { MdOutlineEmail } from "react-icons/md";
import { MyContext } from "../../App";
import { BiSolidCalendar } from 'react-icons/bi';

const label = { slotProps: { input: { 'aria-label': 'Checkbox demo' } } };

const columns = [
  { id: 'userImg', label: 'Profil', minWidth: 80 },
  { id: 'userName', label: 'Nom', minWidth: 100 },
  {
    id: 'userEmail',
    label: 'Email',
    minWidth:150,
  },
  {
    id: 'UserPh',
    label: 'Numero',
    minWidth: 130,
   
  },
    {
    id: 'createDte',
    label: 'Date de création',
    minWidth: 130,
   
  }
];

export default function Users(){
const [categoryFilterVal,setCategoryFilterVal] =useState('');
 const [page, setPage] =useState(0);
  const [rowsPerPage, setRowsPerPage] =useState(10);
  const context=useContext(MyContext);
  const handleChangeCatFilter = (event) => {
    setCategoryFilterVal(event.target.value);
  };

  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

    return(
        <>
                <div className='card !my-4 !pt-5 shadow-md sm:rounded-lg bg-white'>
                    <div className="flex items center w-full !px-5 justify-between ">
                        <div className="col w-[40%]">
                        <h2 className="text-[18px] font-[600]">Liste des Utilisateurs</h2>
                        </div>
                        <div className="col w-[40%] !ml-auto"> <SearchBox/>
                         </div>
                       
                    </div>
                   <br/>
                   <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
                <TableCell>
                 <Checkbox {...label} size="small"/>
               </TableCell>
               {columns.map((column) => (
                <TableCell
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
                   <TableCell  style={{ minWidth: columns.minWidth }}>
                          <Checkbox {...label} size="small"/>
                    </TableCell> 
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                           <div className="flex items-center gap-4 w-[70px]">
                                        <div className="img w-[45px] h-[45px] rounded-md overflow-hidden group">
                                             <Link to="/produit/1234" data-discover="true">
                                            <img src="https://thumbs.dreamstime.com/b/profilez-le-portrait-d-une-fille-d-adolescent-de-style-de-patineur-43975817.jpg?w=768" 
                                             className="w-full group-hover:scale-105 transition-all"/>
                                             </Link>
                                        </div>
                                        
                                    </div>
                    </TableCell> 
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                          Awa Coulibaly
                    </TableCell>
                    
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                        <span className='flex items-center gap-2'>
                      <MdOutlineEmail />    awacoulibaly1@gmailcom
                      </span>
                    </TableCell>
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                         <span className='flex items-center gap-2'>
                          <MdOutlinePhone />+223 54 23 32 44
                          </span>
                    </TableCell>
                        <TableCell  style={{ minWidth: columns.minWidth }}>
                         <span className='flex items-center gap-2'>
                          <BiSolidCalendar />08-04-2026
                          </span>
                    </TableCell>
            </TableRow>
              <TableRow >
                   <TableCell  style={{ minWidth: columns.minWidth }}>
                          <Checkbox {...label} size="small"/>
                    </TableCell> 
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                           <div className="flex items-center gap-4 w-[70px]">
                                        <div className="img w-[45px] h-[45px] rounded-md overflow-hidden group">
                                             <Link to="/produit/1234" data-discover="true">
                                            <img src="https://thumbs.dreamstime.com/b/profilez-le-portrait-d-une-fille-d-adolescent-de-style-de-patineur-43975817.jpg?w=768" 
                                             className="w-full group-hover:scale-105 transition-all"/>
                                             </Link>
                                        </div>
                                        
                                    </div>
                    </TableCell> 
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                          Awa Coulibaly
                    </TableCell>
                    
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                        <span className='flex items-center gap-2'>
                      <MdOutlineEmail />    awacoulibaly1@gmailcom
                      </span>
                    </TableCell>
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                         <span className='flex items-center gap-2'>
                          <MdOutlinePhone />+223 54 23 32 44
                          </span>
                    </TableCell>
                        <TableCell  style={{ minWidth: columns.minWidth }}>
                         <span className='flex items-center gap-2'>
                          <BiSolidCalendar />08-04-2026
                          </span>
                    </TableCell>
            </TableRow>
              <TableRow >
                   <TableCell  style={{ minWidth: columns.minWidth }}>
                          <Checkbox {...label} size="small"/>
                    </TableCell> 
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                           <div className="flex items-center gap-4 w-[70px]">
                                        <div className="img w-[45px] h-[45px] rounded-md overflow-hidden group">
                                             <Link to="/produit/1234" data-discover="true">
                                            <img src="https://thumbs.dreamstime.com/b/profilez-le-portrait-d-une-fille-d-adolescent-de-style-de-patineur-43975817.jpg?w=768" 
                                             className="w-full group-hover:scale-105 transition-all"/>
                                             </Link>
                                        </div>
                                        
                                    </div>
                    </TableCell> 
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                          Awa Coulibaly
                    </TableCell>
                    
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                        <span className='flex items-center gap-2'>
                      <MdOutlineEmail />    awacoulibaly1@gmailcom
                      </span>
                    </TableCell>
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                         <span className='flex items-center gap-2'>
                          <MdOutlinePhone />+223 54 23 32 44
                          </span>
                    </TableCell>
                        <TableCell  style={{ minWidth: columns.minWidth }}>
                         <span className='flex items-center gap-2'>
                          <BiSolidCalendar />08-04-2026
                          </span>
                    </TableCell>
            </TableRow>
              <TableRow >
                   <TableCell  style={{ minWidth: columns.minWidth }}>
                          <Checkbox {...label} size="small"/>
                    </TableCell> 
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                           <div className="flex items-center gap-4 w-[70px]">
                                        <div className="img w-[45px] h-[45px] rounded-md overflow-hidden group">
                                             <Link to="/produit/1234" data-discover="true">
                                            <img src="https://thumbs.dreamstime.com/b/profilez-le-portrait-d-une-fille-d-adolescent-de-style-de-patineur-43975817.jpg?w=768" 
                                             className="w-full group-hover:scale-105 transition-all"/>
                                             </Link>
                                        </div>
                                        
                                    </div>
                    </TableCell> 
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                          Awa Coulibaly
                    </TableCell>
                    
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                        <span className='flex items-center gap-2'>
                      <MdOutlineEmail />    awacoulibaly1@gmailcom
                      </span>
                    </TableCell>
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                         <span className='flex items-center gap-2'>
                          <MdOutlinePhone />+223 54 23 32 44
                          </span>
                    </TableCell>
                        <TableCell  style={{ minWidth: columns.minWidth }}>
                         <span className='flex items-center gap-2'>
                          <BiSolidCalendar />08-04-2026
                          </span>
                    </TableCell>
            </TableRow>
              <TableRow >
                   <TableCell  style={{ minWidth: columns.minWidth }}>
                          <Checkbox {...label} size="small"/>
                    </TableCell> 
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                           <div className="flex items-center gap-4 w-[70px]">
                                        <div className="img w-[45px] h-[45px] rounded-md overflow-hidden group">
                                             <Link to="/produit/1234" data-discover="true">
                                            <img src="https://thumbs.dreamstime.com/b/profilez-le-portrait-d-une-fille-d-adolescent-de-style-de-patineur-43975817.jpg?w=768" 
                                             className="w-full group-hover:scale-105 transition-all"/>
                                             </Link>
                                        </div>
                                        
                                    </div>
                    </TableCell> 
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                          Awa Coulibaly
                    </TableCell>
                    
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                        <span className='flex items-center gap-2'>
                      <MdOutlineEmail />    awacoulibaly1@gmailcom
                      </span>
                    </TableCell>
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                         <span className='flex items-center gap-2'>
                          <MdOutlinePhone />+223 54 23 32 44
                          </span>
                    </TableCell>
                        <TableCell  style={{ minWidth: columns.minWidth }}>
                         <span className='flex items-center gap-2'>
                          <BiSolidCalendar />08-04-2026
                          </span>
                    </TableCell>
            </TableRow>
              <TableRow >
                   <TableCell  style={{ minWidth: columns.minWidth }}>
                          <Checkbox {...label} size="small"/>
                    </TableCell> 
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                           <div className="flex items-center gap-4 w-[70px]">
                                        <div className="img w-[45px] h-[45px] rounded-md overflow-hidden group">
                                             <Link to="/produit/1234" data-discover="true">
                                            <img src="https://thumbs.dreamstime.com/b/profilez-le-portrait-d-une-fille-d-adolescent-de-style-de-patineur-43975817.jpg?w=768" 
                                             className="w-full group-hover:scale-105 transition-all"/>
                                             </Link>
                                        </div>
                                        
                                    </div>
                    </TableCell> 
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                          Awa Coulibaly
                    </TableCell>
                    
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                        <span className='flex items-center gap-2'>
                      <MdOutlineEmail />    awacoulibaly1@gmailcom
                      </span>
                    </TableCell>
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                         <span className='flex items-center gap-2'>
                          <MdOutlinePhone />+223 54 23 32 44
                          </span>
                    </TableCell>
                        <TableCell  style={{ minWidth: columns.minWidth }}>
                         <span className='flex items-center gap-2'>
                          <BiSolidCalendar />08-04-2026
                          </span>
                    </TableCell>
            </TableRow>
              <TableRow >
                   <TableCell  style={{ minWidth: columns.minWidth }}>
                          <Checkbox {...label} size="small"/>
                    </TableCell> 
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                           <div className="flex items-center gap-4 w-[70px]">
                                        <div className="img w-[45px] h-[45px] rounded-md overflow-hidden group">
                                             <Link to="/produit/1234" data-discover="true">
                                            <img src="https://thumbs.dreamstime.com/b/profilez-le-portrait-d-une-fille-d-adolescent-de-style-de-patineur-43975817.jpg?w=768" 
                                             className="w-full group-hover:scale-105 transition-all"/>
                                             </Link>
                                        </div>
                                        
                                    </div>
                    </TableCell> 
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                          Awa Coulibaly
                    </TableCell>
                    
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                        <span className='flex items-center gap-2'>
                      <MdOutlineEmail />    awacoulibaly1@gmailcom
                      </span>
                    </TableCell>
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                         <span className='flex items-center gap-2'>
                          <MdOutlinePhone />+223 54 23 32 44
                          </span>
                    </TableCell>
                        <TableCell  style={{ minWidth: columns.minWidth }}>
                         <span className='flex items-center gap-2'>
                          <BiSolidCalendar />08-04-2026
                          </span>
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
}*/}