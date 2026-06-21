import React, { useState, useEffect, useContext } from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Sidebar from "../Sidebar/index";
import ProduitItems from "../../page/ProduitItems/index";
import ProduitItemsListView from "../../page/ProduitItemsListView/index";
import { MdMenu } from "react-icons/md";
import { IoGrid } from "react-icons/io5";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";
import { useSearchParams } from "react-router-dom";
import { fetchDataFromApi } from "../../../utils/api";
import { MyContext } from "../../../router";
import CircularProgress from "@mui/material/CircularProgress";

export default function ProduitListing() {
  const context = useContext(MyContext);
  const [searchParams] = useSearchParams();
  const [itemView, setItemView] = useState("grid");
  const [anchorEl, setAnchorEl] = useState(null);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const [priceRange, setPriceRange] = useState([0, 1000000]);

  const open = Boolean(anchorEl);
  const categoryId = searchParams.get("category");
  const categoryName = searchParams.get("name") || "Produits";
  const perPage = 12;

  // Charge les produits selon les filtres actifs
  useEffect(() => {
    loadProducts();
  }, [categoryId, page, sortBy]);
const loadProducts = () => {
  setIsLoading(true);

  // Détecter le niveau de catégorie cliqué
  const clickedCat = context.catData?.find(c => c._id === categoryId);
  
  let url = "";
  if (categoryId) {
    // Vérifier si c'est une catégorie parente, sous-cat ou sous-sous-cat
    const isParent = context.catData?.some(c => c._id === categoryId && !c.parentId);
    const isSubCat = context.catData?.some(c => c._id === categoryId && c.parentId);
    
    if (isParent) {
      url = `/api/product/produits-filtres?category=${categoryId}&page=${page}&perPage=${perPage}`;
    } else {
      // Chercher si c'est une sous-sous-cat
      const parentCats = context.catData?.filter(c => !c.parentId);
      let isThirdCat = false;
      for (const parent of parentCats || []) {
        for (const sub of parent.children || []) {
          if (sub.children?.some(t => t._id === categoryId)) {
            isThirdCat = true;
            break;
          }
        }
      }
      
      if (isThirdCat) {
        url = `/api/product/produits-filtres?thirdCat=${categoryId}&page=${page}&perPage=${perPage}`;
      } else {
        url = `/api/product/produits-filtres?subCat=${categoryId}&page=${page}&perPage=${perPage}`;
      }
    }
  } else {
    url = `/api/product/produits?page=${page}&perPage=${perPage}`;
  }

  fetchDataFromApi(url).then((res) => {
    let data = res?.produits || [];
    if (sortBy === "price-asc") data = [...data].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") data = [...data].sort((a, b) => b.price - a.price);
    if (sortBy === "name-asc") data = [...data].sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "name-desc") data = [...data].sort((a, b) => b.name.localeCompare(a.name));
    if (sortBy === "sales") data = [...data].sort((a, b) => (b.sales || 0) - (a.sales || 0));
    setProducts(data);
    setTotalPages(res?.totalPages || 1);
    setIsLoading(false);
  });
};
 

  // Filtre par prix appelé depuis Sidebar
  const filterByPrice = (min, max) => {
    setPriceRange([min, max]);
    setIsLoading(true);

    const catParam = categoryId ? `&category=${categoryId}` : "";
    fetchDataFromApi(
      `/api/product/produits-filtres?minPrice=${min}&maxPrice=${max}${catParam}&page=1&perPage=${perPage}`
    ).then((res) => {
      setProducts(res?.produits || []);
      setTotalPages(res?.totalPages || 1);
      setIsLoading(false);
    });
  };

  // Filtre par note appelé depuis Sidebar
  const filterByRating = (rating) => {
    setIsLoading(true);
    const catParam = categoryId ? `&catId=${categoryId}` : "";
    fetchDataFromApi(
      `/api/product/produit-parAvis?rating=${rating}${catParam}`
    ).then((res) => {
      setProducts(res?.produits || []);
      setIsLoading(false);
    });
  };

  const handleSort = (value) => {
    setSortBy(value);
    setAnchorEl(null);
  };

  const sortLabels = {
    default: "Ventes, par ordre décroissant",
    "price-asc": "Prix, par ordre croissant",
    "price-desc": "Prix, par ordre décroissant",
    "name-asc": "Nom, A - Z",
    "name-desc": "Nom, Z - A",
    sales: "Pertinence",
  };

  return (
    <section className="!py-5 !pb-0 relative z-0">
      <div className="w-[95%] !mx-auto !py-1">
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/" className="link transition !text-[14px]">
            Acceuil
          </Link>
          <Link underline="hover" color="inherit" href="/listeProduits" className="link transition !text-[14px]">
            {categoryName}
          </Link>
        </Breadcrumbs>
      </div>

      <div className="mt-4 bg-white p-2">
        <div className="container flex gap-3">
          {/* Sidebar */}
          <div className="sidebarWrapper w-[20%] h-full bg-white">
            <Sidebar
              filterByPrice={filterByPrice}
              filterByRating={filterByRating}
              categoryId={categoryId}
            />
          </div>

          {/* Contenu droit */}
          <div className="contenuDroit w-[80%] !py-3">
            <div className="bg-[#f1f1f1] p-2 w-full !mb-4 rounded-md flex items-center justify-between">
              {/* Vue grid/list */}
              <div className="col1 flex items-center !gap-3 itemViewActions">
                <Button
                  className={`!w-[40px] !h-[40px] !min-w-[40px] rounded-full !text-[#000] ${itemView === "grid" && "active"}`}
                  onClick={() => setItemView("grid")}
                >
                  <IoGrid className="text-[rgba(0,0,0,0.7)]" />
                </Button>
                <Button
                  className={`!w-[40px] !h-[40px] !min-w-[40px] rounded-full !text-[#000] ${itemView === "list" && "active"}`}
                  onClick={() => setItemView("list")}
                >
                  <MdMenu className="text-[rgba(0,0,0,0.7)]" />
                </Button>
                <span className="text-[14px] font-[500] !pl-3 text-[rgba(0,0,0,0.7)]">
                  Il y'a {products.length} produit(s).
                </span>
              </div>

              {/* Tri */}
              <div className="col2 !ml-auto !flex !items-center justify-end !gap-3 !pr-4">
                <span className="text-[14px] font-[500] !pl-3 text-[rgba(0,0,0,0.7)]">Trier Par</span>
                <Button
                  id="basic-button"
                  aria-controls={open ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  className="!bg-white w-full !text-[12px] !text-[#000] !capitalize border-2 !border-[#000]"
                >
                  {sortLabels[sortBy]}
                </Button>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={() => setAnchorEl(null)}
                >
                  <MenuItem onClick={() => handleSort("sales")} className="!text-[13px] !text-[#000] !capitalize">Pertinence</MenuItem>
                  <MenuItem onClick={() => handleSort("name-asc")} className="!text-[13px] !text-[#000] !capitalize">Nom, A - Z</MenuItem>
                  <MenuItem onClick={() => handleSort("name-desc")} className="!text-[13px] !text-[#000] !capitalize">Nom, Z - A</MenuItem>
                  <MenuItem onClick={() => handleSort("price-asc")} className="!text-[13px] !text-[#000] !capitalize">Prix, par ordre croissant</MenuItem>
                  <MenuItem onClick={() => handleSort("price-desc")} className="!text-[13px] !text-[#000] !capitalize">Prix, par ordre décroissant</MenuItem>
                </Menu>
              </div>
            </div>

            {/* Produits */}
            {isLoading ? (
              <div className="flex items-center justify-center h-[300px]">
                <CircularProgress />
              </div>
            ) : products.length === 0 ? (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-gray-400 text-[16px]">Aucun produit trouvé</p>
              </div>
            ) : (
              <div className={`grid ${itemView === "grid" ? "grid-cols-4 md:grid-cols-4" : "grid-cols-1 md:grid-cols-1"} gap-4`}>
                {itemView === "grid"
                  ? products.map((product) => <ProduitItems key={product._id} item={product} />)
                  : products.map((product) => <ProduitItemsListView key={product._id} item={product} />)
                }
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center !mt-10">
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(e, value) => setPage(value)}
                  showFirstButton
                  showLastButton
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}




{/*import React, { useState } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Sidebar from '../Sidebar/index';
import ProduitItems from "../../page/ProduitItems/index";
import ProduitItemsListView from "../../page/ProduitItemsListView/index";
import { MdMenu } from "react-icons/md";
import { IoGrid } from "react-icons/io5";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';

export default function ProduitListing(){

         const[itemView,setItemView]=useState("grid")
         const [anchorEl, setAnchorEl] =useState(null);
         const open = Boolean(anchorEl);
         const handleClick = (event) => {
               setAnchorEl(event.currentTarget);
  };
         const handleClose = () => {
         setAnchorEl(null);
  };


    return(
        <section className="!py-5 !pb-0" >
            <div className="w-[95%] !mx-auto !py-1">
                <Breadcrumbs aria-label="breadcrumb">
              <Link underline="hover" color="inherit" href="/" className='link transition !text-[14px]'>
                    Acceuil
             </Link>
             <Link
              underline="hover"
               color="inherit"
                href="/"
                className='link transition
                !text-[14px]'
             >
               Habits
            </Link>
            </Breadcrumbs>
            </div>
            <div className='mt-4 bg-white p-2'> 
           <div className="container flex gap-3 " >
             <div className='sidebarWrapper w-[20%] h-full bg-white'>
                    <Sidebar/>
             </div>
              <div className='contenuDroit w-[80%] !py-3'>

               <div className='bg-[#f1f1f1] p-2 w-full !mb-4 rounded-md flex items-center justify-between'>
                 <div className='col1 flex items-center !gap-3 itemViewActions'>
                  
                   <Button className={`!w-[40px] !h-[40px] !min-w-[40px] rounded-full !text-[#000]
                   ${itemView==="grid"&&"active"}`}
                    onClick={()=>setItemView("grid")}>
                    <IoGrid  className='text-[rgba(0,0,0,0.7)]'/>
                   </Button>
                   <Button className={`!w-[40px] !h-[40px] !min-w-[40px] rounded-full !text-[#000]
                   ${itemView==="list"&&"active"}`}
                   onClick={()=>setItemView("list")}>
                    <MdMenu   className='text-[rgba(0,0,0,0.7)]'/>
                   </Button>

                   <span className='text-[14px] font-[500] !pl-3 text-[rgba(0,0,0,0.7)]'>Il y'a 28 produits.</span>
                 </div>
                 <div  className='col2  !ml-auto !flex !items-center justify-end !gap-3 !pr-4'>
                  <span className='text-[14px] font-[500] !pl-3 text-[rgba(0,0,0,0.7)]'>Trier Par</span>
                   <Button
                        id="basic-button"
                           aria-controls={open ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                           aria-expanded={open ? 'true' : undefined}
                          onClick={handleClick}
                          className='!bg-white w-full !text-[12px] !text-[#000] !capitalize border-2 !border-[#000]'
                               >
                           Ventes,par ordre décroissant
                          </Button>
                  <Menu
                    id="basic-menu"
                  anchorEl={anchorEl}
                 open={open}
                 onClose={handleClose}
                slotProps={{
                   list: {
                   'aria-labelledby': 'basic-button',
                     },
                      }}
                    >
                  <MenuItem onClick={handleClose} className='!text-[13px] !text-[#000]  !capitalize'>Ventes,par ordre décroissant</MenuItem>
                  <MenuItem onClick={handleClose}  className='!text-[13px] !text-[#000]  !capitalize'>Pertinence</MenuItem>
                  <MenuItem onClick={handleClose}  className='!text-[13px] !text-[#000]  !capitalize'>Nom, A -Z</MenuItem>
                  <MenuItem onClick={handleClose}  className='!text-[13px] !text-[#000]  !capitalize'>Nom, Z - A</MenuItem>
                  <MenuItem onClick={handleClose}  className='!text-[13px] !text-[#000] !capitalize'>Prix,par ordre croissant</MenuItem>
                  <MenuItem onClick={handleClose}  className='!text-[13px] !text-[#000]  !capitalize'>Prix,par ordre décroissant</MenuItem>
                 </Menu>
                 </div>
               </div>

                <div className={`grid ${itemView==="grid" ? "grid-cols-4 md:grid-cols-4" :"grid-cols-1 md:grid-cols-1"} gap-4`}>
                  { itemView==="grid" ?(
                   <>
                   <ProduitItems/>
                    <ProduitItems/>
                    <ProduitItems/>
                    <ProduitItems/>
                    <ProduitItems/>
                    <ProduitItems/>
                    <ProduitItems/>
                    <ProduitItems/>
                    </>
                    )
                    :
                     ( <>
                   <ProduitItemsListView/>
                   <ProduitItemsListView/>
                   <ProduitItemsListView/>
                   <ProduitItemsListView/>
                
                   
                    </>
                    )}
                   
                </div>
                <div className='flex items-center justify-center !mt-10'>
                    <Pagination count={10} showFirstButton showLastButton />
                </div>
                 
              </div>
            </div>
            </div>
        </section>
    ) const loadProducts = () => {
    setIsLoading(true);
    const clickedCat = context.catData?.find(c => c._id === categoryId);
    let url = "";

    if (categoryId) {
      url = `/api/product/produits-filtres?category=${categoryId}&page=${page}&perPage=${perPage}`;
    } else {
      url = `/api/product/produits?page=${page}&perPage=${perPage}`;
    }

    fetchDataFromApi(url).then((res) => {
      let data = res?.produits || [];

      // Tri côté client
      if (sortBy === "price-asc") data = [...data].sort((a, b) => a.price - b.price);
      if (sortBy === "price-desc") data = [...data].sort((a, b) => b.price - a.price);
      if (sortBy === "name-asc") data = [...data].sort((a, b) => a.name.localeCompare(b.name));
      if (sortBy === "name-desc") data = [...data].sort((a, b) => b.name.localeCompare(a.name));
      if (sortBy === "sales") data = [...data].sort((a, b) => (b.sales || 0) - (a.sales || 0));

      setProducts(data);
      setTotalPages(res?.totalPages || 1);
      setIsLoading(false);
    });
  };
}*/}