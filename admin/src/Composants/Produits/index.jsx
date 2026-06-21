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
import {FaRegEye } from "react-icons/fa6";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import ProgressBar from "../ProgressBar/index";
import { AiOutlineEdit } from "react-icons/ai";
import {BsTrash } from "react-icons/bs";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { MyContext } from "../../App";

const label = { slotProps: { input: { 'aria-label': 'Checkbox demo' } } };

const columns = [
  { id: 'product', label: 'Produit', minWidth: 150 },
  { id: 'category', label: 'Categorie', minWidth: 100 },
  {
    id: 'subcategory',
    label: 'Sous Categorie',
    minWidth: 150,
  },
  {
    id: 'price',
    label: 'Prix',
    minWidth: 130,
   
  },
  {
    id: 'sales',
    label: 'Ventes',
    minWidth: 100,
   
  },
  {
    id: 'actions',
    label: 'Actions',
    minWidth: 120,
  },
];

export default function Pppproduit(){
const [categoryFilterVal,setCategoryFilterVal] =useState('');
const [subCatFilterVal,setSubCatFilterVal] =useState('');
const [subSubFilterVal,setSubSubFilterVal] =useState('');
 const [page, setPage] =useState(0);
  const [rowsPerPage, setRowsPerPage] =useState(10);
  const context=useContext(MyContext);
  const handleChangeCatFilter = (event) => {
    setCategoryFilterVal(event.target.value);
  };
  const handleChangeSubCatFilter = (event) => {
    setSubCatFilterVal(event.target.value);
  };
  const handleChangeSubSubCatFilter = (event) => {
    setSubSubFilterVal(event.target.value);
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
               
                    <div className="flex items center justify-between ">
                        <h2 className="text-[18px] font-[600]">Les produits sur suguba</h2>
                        <div className="col w-[35%] !ml-auto flex items-center gap-3">
                          <Button className="!bg-green-600 !text-white btn-sm btn !capitalize">Exporter</Button>
                          <Button className="btn-pink !text-[14px] btn-sm !text-white "
                          onClick={()=>context.setIsOpenFullScreen({open:true,model:"Ajouter un produit"})}><IoMdAdd/>Ajouter un produit</Button>
            
                       </div>
                    </div>

                   <div className='card !my-4 !pt-5 shadow-md sm:rounded-lg bg-white'>
                     <div className="flex items-center w-full !pl-5  gap-5 justify-between ">
                    <div className=" col w-[20%]">
                        <h4 className="text-[13px] font-[600] !mb-2"> Filtrez Par Categorie</h4>
                      <Select
                      className="w-full"
                      size="small"
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={categoryFilterVal}
          onChange={handleChangeCatFilter}
          label="Categorie"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Habits</MenuItem>
          <MenuItem value={20}>Chaussures</MenuItem>
          <MenuItem value={30}>Sacs</MenuItem>
          <MenuItem value={30}>Cosmetiques</MenuItem>
                     </Select>
                    </div>
                     <div className=" col w-[20%]">
                        <h4 className="text-[13px] font-[600] !mb-2"> Filtrez Par sous Categorie</h4>
                      <Select
                      className="w-full"
                      size="small"
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={subCatFilterVal}
          onChange={handleChangeSubCatFilter}
          label="Categorie"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Habits</MenuItem>
          <MenuItem value={20}>Chaussures</MenuItem>
          <MenuItem value={30}>Sacs</MenuItem>
          <MenuItem value={30}>Cosmetiques</MenuItem>
                     </Select>
                    </div>
                     <div className=" col w-[20%]">
                        <h4 className="text-[13px] font-[600] !mb-2"> Filtrez Par sous sous Categorie</h4>
                      <Select
                      className="w-full"
                      size="small"
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={subSubFilterVal}
          onChange={handleChangeSubSubCatFilter}
          label="Categorie"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Habits</MenuItem>
          <MenuItem value={20}>Chaussures</MenuItem>
          <MenuItem value={30}>Sacs</MenuItem>
          <MenuItem value={30}>Cosmetiques</MenuItem>
                     </Select>
                    </div>
                    <div  className=" col w-[20%] !ml-auto !pr-4"> <SearchBox/> </div>
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
                           <div className="flex items-center gap-4 w-[300px]">
                                        <div className="img w-[65px] h-[65px] rounded-md overflow-hidden group">
                                             <Link to="/produit/1234" data-discover="true">
                                            <img src="https://thumbs.dreamstime.com/b/profilez-le-portrait-d-une-fille-d-adolescent-de-style-de-patineur-43975817.jpg?w=768" 
                                             className="w-full group-hover:scale-105 transition-all"/>
                                             </Link>
                                        </div>
                                        <div className="info w-[75%]">
                                            <h3 className="font-[600] text-[12px] leading-4 hover:text-primary">
                                                <Link to="/produit/1234">
                                                Robe rose rayonnante
                                                </Link>
                                            </h3>
                                            
                                            <span className="text-[12px] "> Anna's couture</span>
                                        </div>
                                    </div>
                    </TableCell> 
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                          Habits
                    </TableCell>
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                          Femme
                    </TableCell>
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                          <div className="flex flex-col gap-1">
                                        <span className="oldPrice line-through leading-3 text-gray-500 text-[14px]
                                        font-[500]">
                                            45,000Fcfa
                                        </span>
                                         <span className="price text-primary text-[14px] font-[600]">
                                            35,000Fcfa
                                        </span>
                                    </div>
                    </TableCell>
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                           <p className="text-[14px] w-[100px]"><span className="font-[600]">342</span>{" "}Ventes</p>
                         <ProgressBar type="warning" value={40}/>
                    </TableCell>
                     <TableCell  style={{ minWidth: columns.minWidth }}>
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
             <TableRow >
                   <TableCell  style={{ minWidth: columns.minWidth }}>
                          <Checkbox {...label} size="small"/>
                    </TableCell> 
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                           <div className="flex items-center gap-4 w-[300px]">
                                        <div className="img w-[65px] h-[65px] rounded-md overflow-hidden group">
                                             <Link to="/produit/1234" data-discover="true">
                                            <img src="https://thumbs.dreamstime.com/b/profilez-le-portrait-d-une-fille-d-adolescent-de-style-de-patineur-43975817.jpg?w=768" 
                                             className="w-full group-hover:scale-105 transition-all"/>
                                             </Link>
                                        </div>
                                        <div className="info w-[75%]">
                                            <h3 className="font-[600] text-[12px] leading-4 hover:text-primary">
                                                <Link to="/produit/1234">
                                                Robe rose rayonnante
                                                </Link>
                                            </h3>
                                            
                                            <span className="text-[12px] "> Anna's couture</span>
                                        </div>
                                    </div>
                    </TableCell> 
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                          Habits
                    </TableCell>
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                          Femme
                    </TableCell>
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                          <div className="flex flex-col gap-1">
                                        <span className="oldPrice line-through leading-3 text-gray-500 text-[14px]
                                        font-[500]">
                                            45,000Fcfa
                                        </span>
                                         <span className="price text-primary text-[14px] font-[600]">
                                            35,000Fcfa
                                        </span>
                                    </div>
                    </TableCell>
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                           <p className="text-[14px] w-[100px]"><span className="font-[600]">342</span>{" "}Ventes</p>
                         <ProgressBar type="warning" value={40}/>
                    </TableCell>
                     <TableCell  style={{ minWidth: columns.minWidth }}>
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
             <TableRow >
                   <TableCell  style={{ minWidth: columns.minWidth }}>
                          <Checkbox {...label} size="small"/>
                    </TableCell> 
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                           <div className="flex items-center gap-4 w-[300px]">
                                        <div className="img w-[65px] h-[65px] rounded-md overflow-hidden group">
                                             <Link to="/produit/1234" data-discover="true">
                                            <img src="https://thumbs.dreamstime.com/b/profilez-le-portrait-d-une-fille-d-adolescent-de-style-de-patineur-43975817.jpg?w=768" 
                                             className="w-full group-hover:scale-105 transition-all"/>
                                             </Link>
                                        </div>
                                        <div className="info w-[75%]">
                                            <h3 className="font-[600] text-[12px] leading-4 hover:text-primary">
                                                <Link to="/produit/1234">
                                                Robe rose rayonnante
                                                </Link>
                                            </h3>
                                            
                                            <span className="text-[12px] "> Anna's couture</span>
                                        </div>
                                    </div>
                    </TableCell> 
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                          Habits
                    </TableCell>
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                          Femme
                    </TableCell>
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                          <div className="flex flex-col gap-1">
                                        <span className="oldPrice line-through leading-3 text-gray-500 text-[14px]
                                        font-[500]">
                                            45,000Fcfa
                                        </span>
                                         <span className="price text-primary text-[14px] font-[600]">
                                            35,000Fcfa
                                        </span>
                                    </div>
                    </TableCell>
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                           <p className="text-[14px] w-[100px]"><span className="font-[600]">342</span>{" "}Ventes</p>
                         <ProgressBar type="warning" value={40}/>
                    </TableCell>
                     <TableCell  style={{ minWidth: columns.minWidth }}>
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
             <TableRow >
                   <TableCell  style={{ minWidth: columns.minWidth }}>
                          <Checkbox {...label} size="small"/>
                    </TableCell> 
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                           <div className="flex items-center gap-4 w-[300px]">
                                        <div className="img w-[65px] h-[65px] rounded-md overflow-hidden group">
                                             <Link to="/produit/1234" data-discover="true">
                                            <img src="https://thumbs.dreamstime.com/b/profilez-le-portrait-d-une-fille-d-adolescent-de-style-de-patineur-43975817.jpg?w=768" 
                                             className="w-full group-hover:scale-105 transition-all"/>
                                             </Link>
                                        </div>
                                        <div className="info w-[75%]">
                                            <h3 className="font-[600] text-[12px] leading-4 hover:text-primary">
                                                <Link to="/produit/1234">
                                                Robe rose rayonnante
                                                </Link>
                                            </h3>
                                            
                                            <span className="text-[12px] "> Anna's couture</span>
                                        </div>
                                    </div>
                    </TableCell> 
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                          Habits
                    </TableCell>
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                          Femme
                    </TableCell>
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                          <div className="flex flex-col gap-1">
                                        <span className="oldPrice line-through leading-3 text-gray-500 text-[14px]
                                        font-[500]">
                                            45,000Fcfa
                                        </span>
                                         <span className="price text-primary text-[14px] font-[600]">
                                            35,000Fcfa
                                        </span>
                                    </div>
                    </TableCell>
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                           <p className="text-[14px] w-[100px]"><span className="font-[600]">342</span>{" "}Ventes</p>
                         <ProgressBar type="warning" value={40}/>
                    </TableCell>
                     <TableCell  style={{ minWidth: columns.minWidth }}>
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
             <TableRow >
                   <TableCell  style={{ minWidth: columns.minWidth }}>
                          <Checkbox {...label} size="small"/>
                    </TableCell> 
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                           <div className="flex items-center gap-4 w-[300px]">
                                        <div className="img w-[65px] h-[65px] rounded-md overflow-hidden group">
                                             <Link to="/produit/1234" data-discover="true">
                                            <img src="https://thumbs.dreamstime.com/b/profilez-le-portrait-d-une-fille-d-adolescent-de-style-de-patineur-43975817.jpg?w=768" 
                                             className="w-full group-hover:scale-105 transition-all"/>
                                             </Link>
                                        </div>
                                        <div className="info w-[75%]">
                                            <h3 className="font-[600] text-[12px] leading-4 hover:text-primary">
                                                <Link to="/produit/1234">
                                                Robe rose rayonnante
                                                </Link>
                                            </h3>
                                            
                                            <span className="text-[12px] "> Anna's couture</span>
                                        </div>
                                    </div>
                    </TableCell> 
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                          Habits
                    </TableCell>
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                          Femme
                    </TableCell>
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                          <div className="flex flex-col gap-1">
                                        <span className="oldPrice line-through leading-3 text-gray-500 text-[14px]
                                        font-[500]">
                                            45,000Fcfa
                                        </span>
                                         <span className="price text-primary text-[14px] font-[600]">
                                            35,000Fcfa
                                        </span>
                                    </div>
                    </TableCell>
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                           <p className="text-[14px] w-[100px]"><span className="font-[600]">342</span>{" "}Ventes</p>
                         <ProgressBar type="warning" value={40}/>
                    </TableCell>
                     <TableCell  style={{ minWidth: columns.minWidth }}>
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
             <TableRow >
                   <TableCell  style={{ minWidth: columns.minWidth }}>
                          <Checkbox {...label} size="small"/>
                    </TableCell> 
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                           <div className="flex items-center gap-4 w-[300px]">
                                        <div className="img w-[65px] h-[65px] rounded-md overflow-hidden group">
                                             <Link to="/produit/1234" data-discover="true">
                                            <img src="https://thumbs.dreamstime.com/b/profilez-le-portrait-d-une-fille-d-adolescent-de-style-de-patineur-43975817.jpg?w=768" 
                                             className="w-full group-hover:scale-105 transition-all"/>
                                             </Link>
                                        </div>
                                        <div className="info w-[75%]">
                                            <h3 className="font-[600] text-[12px] leading-4 hover:text-primary">
                                                <Link to="/produit/1234">
                                                Robe rose rayonnante
                                                </Link>
                                            </h3>
                                            
                                            <span className="text-[12px] "> Anna's couture</span>
                                        </div>
                                    </div>
                    </TableCell> 
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                          Habits
                    </TableCell>
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                          Femme
                    </TableCell>
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                          <div className="flex flex-col gap-1">
                                        <span className="oldPrice line-through leading-3 text-gray-500 text-[14px]
                                        font-[500]">
                                            45,000Fcfa
                                        </span>
                                         <span className="price text-primary text-[14px] font-[600]">
                                            35,000Fcfa
                                        </span>
                                    </div>
                    </TableCell>
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                           <p className="text-[14px] w-[100px]"><span className="font-[600]">342</span>{" "}Ventes</p>
                         <ProgressBar type="warning" value={40}/>
                    </TableCell>
                     <TableCell  style={{ minWidth: columns.minWidth }}>
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
             <TableRow >
                   <TableCell  style={{ minWidth: columns.minWidth }}>
                          <Checkbox {...label} size="small"/>
                    </TableCell> 
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                           <div className="flex items-center gap-4 w-[300px]">
                                        <div className="img w-[65px] h-[65px] rounded-md overflow-hidden group">
                                             <Link to="/produit/1234" data-discover="true">
                                            <img src="https://thumbs.dreamstime.com/b/profilez-le-portrait-d-une-fille-d-adolescent-de-style-de-patineur-43975817.jpg?w=768" 
                                             className="w-full group-hover:scale-105 transition-all"/>
                                             </Link>
                                        </div>
                                        <div className="info w-[75%]">
                                            <h3 className="font-[600] text-[12px] leading-4 hover:text-primary">
                                                <Link to="/produit/1234">
                                                Robe rose rayonnante
                                                </Link>
                                            </h3>
                                            
                                            <span className="text-[12px] "> Anna's couture</span>
                                        </div>
                                    </div>
                    </TableCell> 
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                          Habits
                    </TableCell>
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                          Femme
                    </TableCell>
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                          <div className="flex flex-col gap-1">
                                        <span className="oldPrice line-through leading-3 text-gray-500 text-[14px]
                                        font-[500]">
                                            45,000Fcfa
                                        </span>
                                         <span className="price text-primary text-[14px] font-[600]">
                                            35,000Fcfa
                                        </span>
                                    </div>
                    </TableCell>
                     <TableCell  style={{ minWidth: columns.minWidth }}>
                           <p className="text-[14px] w-[100px]"><span className="font-[600]">342</span>{" "}Ventes</p>
                         <ProgressBar type="warning" value={40}/>
                    </TableCell>
                     <TableCell  style={{ minWidth: columns.minWidth }}>
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