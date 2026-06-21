import { RiMenuFold4Fill, RiMenuFoldFill } from "react-icons/ri";
import { FaRegBell, FaRegUser } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { MdStars, MdLocalOffer } from "react-icons/md";
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { useContext, useState, useEffect } from "react";
import { MyContext } from "../../App";
import { Link, NavLink } from "react-router-dom";
import { fetchDataFromApi } from "../../utils/api.js";

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: '0 4px',
  },
}));

export default function Header() {
  const context = useContext(MyContext);

  // Menu compte
  const [anchorMyAcc, setAnchorMyAcc] = useState(null);
  const openMyAcc = Boolean(anchorMyAcc);

  // ✅ Menu notifications
  const [anchorNotif, setAnchorNotif] = useState(null);
  const openNotif = Boolean(anchorNotif);

  // ✅ Compteur demandes en attente
  const [pendingCount, setPendingCount] = useState({ total: 0, featured: 0, specialOffer: 0 });

  // Charger le compteur au montage et toutes les 60 secondes
  useEffect(() => {
    loadPendingCount();
    const interval = setInterval(loadPendingCount, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadPendingCount = () => {
    fetchDataFromApi("/api/product/demandes-en-attente-count").then((res) => {
      if (res?.success) {
        setPendingCount({
          total: res.total || 0,
          featured: res.featured || 0,
          specialOffer: res.specialOffer || 0,
        });
      }
    });
  };

  const handleClickMyAcc = (e) => setAnchorMyAcc(e.currentTarget);
  const handleCloseMyAcc = () => setAnchorMyAcc(null);

  const handleClickNotif = (e) => {
    setAnchorNotif(e.currentTarget);
    loadPendingCount(); // refresh au clic
  };
  const handleCloseNotif = () => setAnchorNotif(null);

  const logout = () => {
    handleCloseMyAcc();
    fetchDataFromApi(`/api/user/deconnexion`).then((res) => {
      if (res?.error !== true) {
        context.setIsLogin(false);
        localStorage.removeItem("accesstoken");
        localStorage.removeItem("refreshtoken");
      }
    });
  };

  // Ouvrir la gestion des slides/demandes
  const openFeaturedRequests = () => {
    handleCloseNotif();
    context.setIsOpenFullScreen({ open: true, model: "Ajouter une Affiche" });
  };

  return (
    <header className={`w-full h-[auto] shadow-md !py-2 ${context.isSidebarOpen === true ? "pl-64" : "pl-5"} pr-7 bg-[#fff] flex items-center transition-all justify-between`}>

      <div className="partie1">
        <Button className="!cursor-pointer !w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[rgba(0,0,0,0.8)]"
          onClick={() => context.setIsSidebarOpen(!context.isSidebarOpen)}>
          {context.isSidebarOpen === true
            ? <RiMenuFoldFill className="!text-[18px] !text-[rgba(0,0,0,0.8)]" />
            : <RiMenuFold4Fill className="!text-[18px] !text-[rgba(0,0,0,0.8)]" />
          }
        </Button>
      </div>

      <div className="partie2 w-[40%] flex items-center justify-end gap-5">

        {/* ✅ Icône notification avec compteur */}
        <IconButton aria-label="notifications" onClick={handleClickNotif}>
          <StyledBadge badgeContent={pendingCount.total} color="error">
            <FaRegBell />
          </StyledBadge>
        </IconButton>

        {/* ✅ Menu déroulant notifications */}
        <Menu
          anchorEl={anchorNotif}
          open={openNotif}
          onClose={handleCloseNotif}
          slotProps={{
            paper: {
              elevation: 3,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                mt: 1.5,
                minWidth: 280,
                '&::before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <div className="!px-4 !py-2">
            <p className="text-[14px] font-[700] text-gray-800">Demandes vendeurs</p>
          </div>
          <Divider />

          {pendingCount.total === 0 ? (
            <MenuItem disabled>
              <p className="text-[13px] text-gray-400">Aucune demande en attente</p>
            </MenuItem>
          ) : (
            <>
              {/* Demandes Vedette */}
              {pendingCount.featured > 0 && (
                <MenuItem onClick={openFeaturedRequests} className="flex items-center gap-3 !py-3">
                  <div className="w-[36px] h-[36px] bg-yellow-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <MdStars className="text-yellow-500 text-[20px]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-[600] text-gray-800">Demandes Vedette ⭐</p>
                    <p className="text-[11px] text-gray-500">{pendingCount.featured} demande{pendingCount.featured > 1 ? "s" : ""} en attente</p>
                  </div>
                  <span className="w-[22px] h-[22px] bg-yellow-400 text-white text-[11px] font-[700] rounded-full flex items-center justify-center">
                    {pendingCount.featured}
                  </span>
                </MenuItem>
              )}

              {/* Demandes Offre Spéciale */}
              {pendingCount.specialOffer > 0 && (
                <MenuItem onClick={openFeaturedRequests} className="flex items-center gap-3 !py-3">
                  <div className="w-[36px] h-[36px] bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <MdLocalOffer className="text-orange-500 text-[20px]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-[600] text-gray-800">Offres Spéciales 🔥</p>
                    <p className="text-[11px] text-gray-500">{pendingCount.specialOffer} demande{pendingCount.specialOffer > 1 ? "s" : ""} en attente</p>
                  </div>
                  <span className="w-[22px] h-[22px] bg-orange-500 text-white text-[11px] font-[700] rounded-full flex items-center justify-center">
                    {pendingCount.specialOffer}
                  </span>
                </MenuItem>
              )}

              <Divider />
              <MenuItem onClick={openFeaturedRequests} className="!py-2">
                <p className="text-[12px] text-primary font-[600] w-full text-center">Gérer toutes les demandes →</p>
              </MenuItem>
            </>
          )}
        </Menu>

        {/* Avatar / menu compte */}
        {context.isLogin === true ? (
          <div className="relative">
            <div className="!w-[35px] !h-[35px] !rounded-full overflow-hidden cursor-pointer" onClick={handleClickMyAcc}>
              <img
                src={context?.userData?.avatar || "https://imgs.search.brave.com/yidLNeAlOis93k7FwAsb5tKOR46fIEXxKLbeh8vtfq0/rs:fit:0:180:1:0/g:ce/aHR0cHM6Ly93d3cu/YWZyaWNhLW5ld3Ny/b29tLmNvbS9maWxl/cy9sYXJnZS83M2Rl/MmQ3MTcxZTAzYjYv/MjAwLzE1MA"}
                className="w-full h-full object-cover"
                alt="avatar"
              />
            </div>
            <Menu
              anchorEl={anchorMyAcc}
              id="account-menu"
              open={openMyAcc}
              onClose={handleCloseMyAcc}
              onClick={handleCloseMyAcc}
              slotProps={{
                paper: {
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '& .MuiAvatar-root': { width: 32, height: 32, ml: -0.5, mr: 1 },
                    '&::before': {
                      content: '""', display: 'block', position: 'absolute',
                      top: 0, right: 14, width: 10, height: 10,
                      bgcolor: 'background.paper', transform: 'translateY(-50%) rotate(45deg)', zIndex: 0,
                    },
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleCloseMyAcc} className="!bg-white">
                <div className="flex items-center gap-3">
                  <div className="rounded-full !w-[35px] !h-[35px] overflow-hidden cursor-pointer">
                    <img
                      src={context?.userData?.avatar || "https://imgs.search.brave.com/yidLNeAlOis93k7FwAsb5tKOR46fIEXxKLbeh8vtfq0/rs:fit:0:180:1:0/g:ce/aHR0cHM6Ly93d3cu/YWZyaWNhLW5ld3Ny/b29tLmNvbS9maWxl/cy9sYXJnZS83M2Rl/MmQ3MTcxZTAzYjYv/MjAwLzE1MA"}
                      className="w-full h-full object-cover" alt="avatar"
                    />
                  </div>
                  <div className="info">
                    <h3 className="!text-[15px] font-[500] leading-5">{context?.userData?.name}</h3>
                    <p className="!text-[12px] font-[400] opacity-70">{context?.userData?.email}</p>
                  </div>
                </div>
              </MenuItem>
              <Link to="/profil">
                <MenuItem onClick={handleCloseMyAcc} className="flex items-center gap-3">
                  <FaRegUser className="text-[18px]" /><span className="text-[14px]">Profil</span>
                </MenuItem>
              </Link>
              <MenuItem onClick={logout} className="flex gap-2 !py-2 w-full block">
                <IoMdLogOut className="text-[18px]" />{" "}<span className="text-[14px]">Deconnexion</span>
              </MenuItem>
            </Menu>
          </div>
        ) : (
          <NavLink to="/connexion" exact="true" activeClassName="isActive">
            <Button className="btn-pink btn-sm !rounded-full">Connexion</Button>
          </NavLink>
        )}
      </div>
    </header>
  );
}
{/*import { RiMenuFold4Fill } from "react-icons/ri";
import { RiMenuFoldFill } from "react-icons/ri";
import { FaRegBell, FaRegUser } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useContext, useState } from "react";
import { MyContext } from "../../App";
import { Link } from "react-router-dom";
import {NavLink } from "react-router-dom";
import { fetchDataFromApi } from "../../utils/api.js";
const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: '0 4px',
  },
}));

export default function Header(){
  const context=useContext(MyContext);
     const [anchorMyAcc, setAnchorMyAcc] = useState(null);
  const openMyAcc = Boolean(anchorMyAcc);
  const handleClickMyAcc = (event) => {
    setAnchorMyAcc(event.currentTarget);
  };
  const handleCloseMyAcc = () => {
    setAnchorMyAcc(null);
  };
  const logout = () => {
    setAnchorMyAcc(null);
    fetchDataFromApi(`/api/user/deconnexion`).then((res) => { // ✅ URL propre
        if (res?.error !== true) {
            context.setIsLogin(false);
            localStorage.removeItem("accesstoken");
            localStorage.removeItem("refreshtoken");
        }
    });
};
  
    return(
    <>
   <header className={`w-full h-[auto] shadow-md  !py-2  ${context.isSidebarOpen=== true ?"pl-64" : "pl-5"} 
     pr-7 bg-[#fff] flex items-center  transition-all justify-between`}>
      
        <div className="partie1">
          <Button className="!cursor-pointer !w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[rgba(0,0,0,0.8)]
            " onClick={()=>context.setIsSidebarOpen(!context.isSidebarOpen)}>
               {
                context.isSidebarOpen===true ?
                
               <RiMenuFoldFill className="!text-[18px] !text-[rgba(0,0,0,0.8)]"/>:
                
                  
              <RiMenuFold4Fill  className="!text-[18px] !text-[rgba(0,0,0,0.8)]"/>
                
                
              }
              </Button>
        </div>
        <div className="partie2 w-[40%] flex items-center justify-end gap-5">
             <IconButton aria-label="cart">
                     <StyledBadge badgeContent={4} color="secondary">
                           <FaRegBell />
                     </StyledBadge>
              </IconButton>
              {
                context.isLogin === true ? (
              <div className="relative">
                   <div className="!w-[35px] !h-[35px] !rounded-full overflow-hidden  cursor-pointer"
                onClick={handleClickMyAcc}>
                   <img src="https://imgs.search.brave.com/yidLNeAlOis93k7FwAsb5tKOR46fIEXxKLbeh8vtfq0/rs:fit:0:180:1:0/g:ce/aHR0cHM6Ly93d3cu/YWZyaWNhLW5ld3Ny/b29tLmNvbS9maWxl/cy9sYXJnZS83M2Rl/MmQ3MTcxZTAzYjYv/MjAwLzE1MA"
                             className="w-full h-full  object-cover"/>
                      
                             </div>
              
                 <Menu
        anchorEl={anchorMyAcc}
        id="account-menu"
        open={openMyAcc}
        onClose={handleCloseMyAcc }
        onClick={handleCloseMyAcc }
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleCloseMyAcc} className="!bg-white">
           <div className=" flex items-center gap-3">
               <div className="rounded-full  !w-[35px] !h-[35px] overflow-hidden cursor-pointer"
              >
                <img src="https://imgs.search.brave.com/yidLNeAlOis93k7FwAsb5tKOR46fIEXxKLbeh8vtfq0/rs:fit:0:180:1:0/g:ce/aHR0cHM6Ly93d3cu/YWZyaWNhLW5ld3Ny/b29tLmNvbS9maWxl/cy9sYXJnZS83M2Rl/MmQ3MTcxZTAzYjYv/MjAwLzE1MA"
                className="w-full h-full object-cover"/>
              </div>
              <div className="info">
                <h3 className="!text-[15px] font-[500] leading-5">{
                                          context?.userData?.name}</h3>
                <p className="!text-[12px] font-[400] opacity-70">{
                                          context?.userData?.email
                                        }</p>
              </div>
           </div>
        </MenuItem>
        <Link to="/profil">
         <MenuItem onClick={handleCloseMyAcc} className="flex items-center gap-3">
          <FaRegUser className="text-[18px]"/><span className="text-[14px]">Profil</span>
        </MenuItem>
        </Link>
         <MenuItem onClick={logout} className="flex gap-2 !py-2 w-full block">
                       <IoMdLogOut className="text-[18px]"/>{" "}<span className="text-[14px]">Deconnexion</span>
            </MenuItem>
        </Menu>
      </div>
      ):(
        <NavLink to="/connexion" exact={true} activeClassName="isActive">
       <Button className="btn-pink btn-sm !rounded-full">Connexion</Button>
       </NavLink>
      )}
        </div>
    
    </header>
    
   
   
    </>)
}*/}