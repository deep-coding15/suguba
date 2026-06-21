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
import {FaRegEye } from "react-icons/fa6";
import { use, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import {BsTrash } from "react-icons/bs";
import { MyContext } from "../../App";
import { deleteData, fetchDataFromApi } from "../../utils/api";
const label = { slotProps: { input: { 'aria-label': 'Checkbox demo' } } };
const columns = [
  { id: 'image', label: 'Image', minWidth:150 },
  ,
  {
    id: 'catName',
    label: 'Categorie',
    minWidth:150,
  },
  {
    id: 'action',
    label: 'Actions',
    minWidth:100,
  },
];
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
export default function  Category(){

 const [page, setPage] =useState(0);
  const [rowsPerPage, setRowsPerPage] =useState(10);
  const context=useContext(MyContext);
  useEffect(()=>{
    fetchDataFromApi("/api/category").then((res)=>{
      context?.setCatData(res?.data)
    })
   },[context?.isOpenFullScreen]);
   const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const deleteCat=(id)=>{
    deleteData(`/api/category/${id}`).then((res)=>{
      fetchDataFromApi("/api/category").then((res)=>{
        context?.setCatData(res?.data)
         context.alertBox("success",res?.data?.message);
      })
    })
  }

    return(
        <>
               
                    <div className="flex items center justify-between ">
                        <h2 className="text-[18px] font-[600]">Liste des categories</h2>
                        <div className="col w-[35%] !ml-auto flex items-center gap-3">
                          <Button className="!bg-green-600 !text-white btn-sm btn !capitalize">Exporter</Button>
                          <Button className="btn-pink !text-[14px] btn-sm !text-white "
                          onClick={()=>context.setIsOpenFullScreen({open:true,model:"Nouvelle categorie"})}><IoMdAdd/>Nouvelle categorie</Button>
            
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
            {context?.catData?.length!==0 && context?.catData?.map((item,index)=>{
              return(
                        <TableRow key={index}>
                   <TableCell   width={60}>
                          <Checkbox {...label} size="small"/>
                    </TableCell> 
                     <TableCell  width={100}>
                           <div className="flex items-center gap-4 w-[80px] ">
                                        <div className="img w-full  rounded-full overflow-hidden group">
                                             <Link to="/produit/1234" data-discover="true">
                                               <LazyLoadImage
                        
                       alt={"image"}
                       effect="blur"
                         src={item.images[0]}
                         className="w-full  group-hover:scale-105 transition-all" />
     
                                             </Link>
                                        </div>
                                    </div>
                    </TableCell> 
                     <TableCell  width={100}>
                         {item?.name}
                    </TableCell> 
                     
                     <TableCell   width={100}>
                          <div className="flex items-center gap-1">
                                            <Button className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] border 
                                            border-[rgba(0,0,0,0.4)] rounded-full hover:!bg-[#f1f1f1]"
                                             onClick={()=>context.setIsOpenFullScreen({open:true,model:"modification categorie",
                                              id:item?._id
                                             })}>
                                                <AiOutlineEdit className="text-[rgba(0,0,0,0.7)] text-[18px]"/>
                                            </Button>
                                          
                                             <Button className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] border 
                                            border-[rgba(0,0,0,0.4)] rounded-full hover:!bg-[#f1f1f1]"
                                            onClick={()=>deleteCat(item?._id)}>
                                                <BsTrash className="text-[rgba(0,0,0,0.7)] text-[18px]"/>
                                            </Button>
                                        </div>
                    </TableCell>
            </TableRow>
        
              )
            })}
           
            
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
       