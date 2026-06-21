import { Link, useNavigate } from "react-router-dom";
import { Badge, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import { MdOutlineShoppingCart, MdNotifications } from "react-icons/md";
import { FaRegUser, FaRegBell } from "react-icons/fa";
import { IoIosGitCompare } from "react-icons/io";
import { FaRegHeart, FaTruck, FaCheckCircle, FaBoxOpen, FaBan } from "react-icons/fa";
import Recherche from "../recherch/index";
import Categorie from "../categorie/index";
import { useContext, useEffect, useState, useRef } from "react";
import { MyContext } from "../../router";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Divider from "@mui/material/Divider";
import { IoIosLogOut } from "react-icons/io";
import { IoBagCheckOutline } from "react-icons/io5";
import { fetchDataFromApi } from "../../utils/api";
import { translations, currencies } from "../../utils/i18n";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3, top: 13,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: "0 4px",
  },
}));

// ── Icône selon statut commande ─────────────────────────────────────────────
function statusIcon(status) {
  switch (status) {
    case "confirmé": return <FaBoxOpen className="text-blue-500 text-[14px]" />;
    case "en-livraison": return <FaTruck className="text-purple-500 text-[14px]" />;
    case "livré": return <FaCheckCircle className="text-green-500 text-[14px]" />;
    case "annulé": return <FaBan className="text-red-500 text-[14px]" />;
    default: return <FaRegBell className="text-orange-500 text-[14px]" />;
  }
}

function statusLabel(status) {
  const map = {
    "en-attente": "Commande reçue",
    "confirmé": "Commande confirmée",
    "en-livraison": "En cours de livraison",
    "livré": "Livrée ✅",
    "annulé": "Annulée ❌"
  };
  return map[status] || status;
}

// ══════════════════════════════════════════════════════════════════════════════
export default function Entete() {
  const history = useNavigate();
  const context = useContext(MyContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const open = Boolean(anchorEl);
  const t = translations[context.lang] || translations.fr;

  // ✅ Notifications commandes
  const [anchorNotif, setAnchorNotif] = useState(null);
  const openNotif = Boolean(anchorNotif);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const prevOrdersRef = useRef([]);

  // Charger les commandes pour simuler des notifications de changement de statut
  const loadOrderNotifications = () => {
    if (!context.isLogin) return;
    fetchDataFromApi("/api/orders/mes-commandes").then((res) => {
      const orders = res?.data || [];
      const prevOrders = prevOrdersRef.current;

      // Générer des notifs pour chaque commande avec son statut
      const notifs = orders.slice(0, 10).map(order => ({
        id: order._id,
        orderId: order.orderId,
        status: order.status,
        totalAmt: order.totalAmt,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        deliveryType: order.deliveryType,
        hubName: order.pickupHub?.name,
        // "nouveau" si le statut a changé depuis la dernière vérification
        isNew: prevOrders.find(p => p._id === order._id && p.status !== order.status) !== undefined
      }));

      // Compter les statuts "actifs" (pas en attente ni livré ni annulé)
      const activeCount = orders.filter(o =>
        ["confirmé", "en-livraison"].includes(o.status)
      ).length;

      setNotifications(notifs);
      setUnreadCount(activeCount);
      prevOrdersRef.current = orders;
    });
  };

  // Recherche produits
  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchTerm.trim()) {
        fetchDataFromApi(`/api/product/search?q=${searchTerm}`).then((res) => {
          if (res?.success) setSearchResults(res.data);
        });
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  // Polling notifications toutes les 60s
  useEffect(() => {
    loadOrderNotifications();
    const interval = setInterval(loadOrderNotifications, 60000);
    return () => clearInterval(interval);
  }, [context.isLogin]);

  const handleClose = () => setAnchorEl(null);

  const logout = () => {
    setAnchorEl(null);
    fetchDataFromApi(`/api/user/deconnexion`, { withCredentials: true }).then((res) => {
      if (res?.error !== true) {
        context.setIsLogin(false);
        localStorage.removeItem("accesstoken");
        localStorage.removeItem("refreshtoken");
        history("/");
      }
    });
  };

  return (
    <header className="!py-0 sticky top-0 z-50 bg-white shadow-sm">
      {/* Top bar */}
      <div className="bg-gray-900 text-white !py-2">
        <div className="w-[95%] !mx-auto flex items-center justify-between">
          <p className="text-[12px] font-[400]">🎉 Livraison gratuite dès 20 000 Fcfa</p>
          <div className="flex items-center gap-4">
            <Link to="/centre-aide" className="text-[12px] text-gray-300 hover:text-white">
              {t.helpCenter}
            </Link>
            {/* Langue */}
            <Select size="small" value={context.lang} onChange={(e) => context.changeLang(e.target.value)}
              sx={{ color: "white", fontSize: 12, "& .MuiOutlinedInput-notchedOutline": { border: "none" }, "& .MuiSvgIcon-root": { color: "white" } }}>
              <MenuItem value="fr">🇫🇷 Français</MenuItem>
              <MenuItem value="en">🇬🇧 English</MenuItem>
              <MenuItem value="bm">🇲🇱 Bambara</MenuItem>
              <MenuItem value="ar">🇸🇦 العربية</MenuItem>
            </Select>
            {/* Devise */}
            <Select size="small" value={context.currency} onChange={(e) => context.changeCurrency(e.target.value)}
              sx={{ color: "white", fontSize: 12, "& .MuiOutlinedInput-notchedOutline": { border: "none" }, "& .MuiSvgIcon-root": { color: "white" } }}>
              {Object.entries(currencies).map(([key, val]) => (
                <MenuItem key={key} value={key}>{val.label}</MenuItem>
              ))}
            </Select>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="header w-full flex justify-between !py-3 items-center border-b border-gray-100 gap-3 !px-5">
        <Link to="/" className="w-[25%]">
          <h1 className="!text-[28px] !font-[800] !text-primary uppercase tracking-wider">Suguba</h1>
        </Link>

        {/* Recherche — dropdown scrollable */}
        <div className="col2 w-[40%] relative">
          <Recherche value={searchTerm} onChange={setSearchTerm} />
          {searchResults.length > 0 && (
            <div className="absolute bg-white w-full shadow-xl z-50 !mt-1 rounded-lg border border-gray-100"
              style={{ maxHeight: "320px", overflowY: "auto" }}>
              {searchResults.map((item) => (
                <div key={item._id}
                  className="!p-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 border-b border-gray-50"
                  onClick={() => { history(`/produit/${item._id}`); setSearchResults([]); setSearchTerm(""); }}>
                  <img src={item.images?.[0]} className="w-[35px] h-[35px] object-cover rounded-md flex-shrink-0" alt="" />
                  <div className="min-w-0">
                    <p className="text-[13px] font-[500] truncate">{item.name}</p>
                    <p className="text-[11px] text-primary">{item.price?.toLocaleString()} Fcfa</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="col3 flex items-center gap-3 w-[35%]">
          {context.isLogin === false ? (
            <div className="flex items-center gap-2">
              <Link to="/connexion">
                <Button variant="outlined" size="small" className="!capitalize !text-[13px] !rounded-full">{t.login}</Button>
              </Link>
              <Link to="/inscription">
                <Button variant="contained" size="small" className="btn-org !capitalize !text-[13px] !rounded-full">{t.register}</Button>
              </Link>
            </div>
          ) : (
            <>
              <Button className="!text-[#000] flex items-center !gap-2 cursor-pointer !w-[60%]"
                onClick={(e) => setAnchorEl(e.currentTarget)}>
                <div className="!w-[36px] !h-[36px] !rounded-full overflow-hidden !bg-gray-100 flex items-center justify-center">
                  {context?.userData?.avatar
                    ? <img src={context.userData.avatar} className="w-full h-full object-cover" alt="" />
                    : <FaRegUser className="text-[15px] text-gray-600" />
                  }
                </div>
                <span className="text-[13px] font-[500] max-w-[200px] truncate !capitalize !mr-auto">{context?.userData?.name}</span>
              </Button>
              <Menu anchorEl={anchorEl} id="account-menu" open={open} onClose={handleClose} onClick={handleClose}
                slotProps={{ paper: { elevation: 3, sx: { mt: 1.5, minWidth: 180 } } }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
                <Link to="/mon-compte" className="w-full block">
                  <MenuItem className="flex gap-2 !py-2 text-[14px]"><FaRegUser /> {t.myAccount}</MenuItem>
                </Link>
                <Link to="/mes-commandes" className="w-full block">
                  <MenuItem className="flex gap-2 !py-2 text-[14px]"><IoBagCheckOutline /> {t.myOrders}</MenuItem>
                </Link>
                <Link to="/mes-favoris" className="w-full block">
                  <MenuItem className="flex gap-2 !py-2 text-[14px]"><FaRegHeart /> {t.myFavorites}</MenuItem>
                </Link>
                {context?.userData?.isSeller && (
                  <Link to="/espace-vendeur" className="w-full block">
                    <MenuItem className="flex gap-2 !py-2 text-[14px] text-primary font-[600]">🏪 {t.mySellerSpace}</MenuItem>
                  </Link>
                )}
                <MenuItem onClick={logout} className="flex gap-2 !py-2 text-[14px]"><IoIosLogOut /> {t.logout}</MenuItem>
              </Menu>
            </>
          )}

          <Link to="/comparateur">
            <IconButton size="small">
              <StyledBadge badgeContent={context.compareItems?.length || 0} color="secondary">
                <IoIosGitCompare className="text-[20px]" />
              </StyledBadge>
            </IconButton>
          </Link>

          <Link to="/mes-favoris">
            <IconButton size="small">
              <StyledBadge badgeContent={context.myListItems?.length || 0} color="secondary">
                <FaRegHeart className="text-[18px]" />
              </StyledBadge>
            </IconButton>
          </Link>

          {/* ✅ Cloche notifications commandes */}
          {context.isLogin && (
            <IconButton size="small" onClick={(e) => { setAnchorNotif(e.currentTarget); loadOrderNotifications(); }}>
              <StyledBadge badgeContent={unreadCount} color="error">
                <FaRegBell className="text-[18px]" />
              </StyledBadge>
            </IconButton>
          )}

          <IconButton size="small" onClick={() => context.setOpenCartPanel(true)}>
            <StyledBadge badgeContent={context.cartItems?.length || 0} color="secondary">
              <MdOutlineShoppingCart className="text-[20px]" />
            </StyledBadge>
          </IconButton>
        </div>
      </div>

      {/* ✅ Menu notifications commandes */}
      <Menu
        anchorEl={anchorNotif}
        open={openNotif}
        onClose={() => setAnchorNotif(null)}
        slotProps={{
          paper: {
            elevation: 3,
            sx: { mt: 1.5, minWidth: 320, maxHeight: 440, overflow: "auto" }
          }
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
        <div className="!px-4 !py-2 border-b border-gray-100">
          <p className="text-[14px] font-[700]">Suivi de vos commandes</p>
          <p className="text-[11px] text-gray-400">{notifications.length} commande(s) récente(s)</p>
        </div>

        {notifications.length === 0 ? (
          <MenuItem disabled>
            <p className="text-[13px] text-gray-400">Aucune commande en cours</p>
          </MenuItem>
        ) : (
          notifications.map((notif) => (
            <MenuItem key={notif.id}
              onClick={() => { setAnchorNotif(null); history("/mes-commandes"); }}
              className="flex items-start gap-3 !py-3 !px-4">
              <div className="w-[32px] h-[32px] rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 !mt-0.5">
                {statusIcon(notif.status)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-[600] text-gray-800">{notif.orderId}</p>
                <p className="text-[12px] text-gray-600">{statusLabel(notif.status)}</p>
                {notif.deliveryType === "retrait-hub" && notif.hubName && (
                  <p className="text-[11px] text-blue-600">📍 Hub : {notif.hubName}</p>
                )}
                <p className="text-[11px] text-gray-400">
                  {new Date(notif.updatedAt || notif.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              <span className="text-[12px] text-primary font-[600] flex-shrink-0">{notif.totalAmt?.toLocaleString()} Fcfa</span>
            </MenuItem>
          ))
        )}

        <Divider />
        <MenuItem onClick={() => { setAnchorNotif(null); history("/mes-commandes"); }}
          className="!justify-center !py-2">
          <p className="text-[12px] text-primary font-[600]">Voir toutes mes commandes →</p>
        </MenuItem>
      </Menu>

      {/* Catégories */}
      <div className="w-[95%] !mx-auto">
        <Categorie />
      </div>
    </header>
  );
}





{/*import { Link, useNavigate } from "react-router-dom";
import { Badge, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaRegUser, FaGlobe } from "react-icons/fa";
import { IoIosGitCompare } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa";
import Recherche from "../recherch/index";
import Categorie from "../categorie/index";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../router";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { IoIosLogOut } from "react-icons/io";
import { IoBagCheckOutline } from "react-icons/io5";
import { fetchDataFromApi, postData } from "../../utils/api";
import { translations, currencies } from "../../utils/i18n";
const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3, top: 13,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: "0 4px",
  },
}));

export default function Entete() {
  const history = useNavigate();
  const context = useContext(MyContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const open = Boolean(anchorEl);

  const t = translations[context.lang] || translations.fr;

  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchTerm.trim()) {
        fetchDataFromApi(`/api/product/search?q=${searchTerm}`).then((res) => {
          if (res?.success) setSearchResults(res.data);
        });
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [searchTerm]);
 const handleClose = () => {
    setAnchorEl(null);
  };
 
const logout=()=>{
      setAnchorEl(null);
    fetchDataFromApi(`/api/user/deconnexion?token=${localStorage.getItem("accesstoken")}`,{withCredentials:true}).then((res)=>{
         if (res?.error!==true) {
          context.setIsLogin(false);
        localStorage.removeItem("accesstoken");
        localStorage.removeItem("refreshtoken");
        history("/");
      }
   })}
  return (
    <header className="!py-0 sticky top-0 z-50 bg-white shadow-sm">
      
      <div className="bg-gray-900 text-white !py-2">
        <div className="w-[95%] !mx-auto flex items-center justify-between">
          <p className="text-[12px] font-[400]">🎉 Livraison gratuite dès 20 000 Fcfa</p>
          <div className="flex items-center gap-4">
            <Link to="/centre-aide" className="text-[12px] text-gray-300 hover:text-white">
                             {t.helpCenter}
            </Link>
            
            <Select
              size="small"
              value={context.lang}
              onChange={(e) => context.changeLang(e.target.value)}
              sx={{ color: "white", fontSize: 12, "& .MuiOutlinedInput-notchedOutline": { border: "none" }, "& .MuiSvgIcon-root": { color: "white" } }}
            >
              <MenuItem value="fr">🇫🇷 Français</MenuItem>
              <MenuItem value="en">🇬🇧 English</MenuItem>
              <MenuItem value="bm">🇲🇱 Bambara</MenuItem>
              <MenuItem value="ar">🇸🇦 العربية</MenuItem>
            </Select>

           
            <Select
              size="small"
              value={context.currency}
              onChange={(e) => context.changeCurrency(e.target.value)}
              sx={{ color: "white", fontSize: 12, "& .MuiOutlinedInput-notchedOutline": { border: "none" }, "& .MuiSvgIcon-root": { color: "white" } }}
            >
              {Object.entries(currencies).map(([key, val]) => (
                <MenuItem key={key} value={key}>{val.label}</MenuItem>
              ))}
            </Select>
          </div>
        </div>
      </div>

      
      <div className="header w-full flex justify-between !py-3 items-center border-b border-gray-100 gap-3 !px-5">
        <Link to="/" className="w-[25%]">
          <h1 className="!text-[28px] !font-[800] !text-primary uppercase tracking-wider">Suguba</h1>
        </Link>

       
        <div className="col2 w-[40%] relative">
          <Recherche value={searchTerm} onChange={setSearchTerm} />
          {searchResults.length > 0 && (
            <div className="absolute bg-white w-full shadow-xl z-50 !mt-1 rounded-lg border border-gray-100 overflow-hidden"
              style={{ maxHeight: "320px", overflowY: "auto" }}>
              {searchResults.map((item) => (
                <div key={item._id}
                  className="!p-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 border-b border-gray-50"
                  onClick={() => { history(`/produit/${item._id}`); setSearchResults([]); setSearchTerm(""); }}>
                  <img src={item.images?.[0]} className="w-[35px] h-[35px] object-cover rounded-md flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[13px] font-[500] truncate">{item.name}</p>
                    <p className="text-[11px] text-primary">{item.price?.toLocaleString()} Fcfa</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
       

       
        <div className="col3 flex items-center gap-3 w-[35%]">
          
          {context.isLogin === false ? (
            <div className="flex items-center gap-2">
              <Link to="/connexion">
                <Button variant="outlined" size="small" className="!capitalize !text-[13px] !rounded-full">
                  {t.login}
                </Button>
              </Link>
              <Link to="/inscription">
                <Button variant="contained" size="small" className="btn-org !capitalize !text-[13px] !rounded-full">
                  {t.register}
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <Button className="!text-[#000] flex items-center !gap-2 cursor-pointer !w-[60%]" onClick={(e) => setAnchorEl(e.currentTarget)}>
                <div className="!w-[36px] !h-[36px] !rounded-full overflow-hidden !bg-gray-100 flex items-center">
                  {context?.userData?.avatar
                    ? <img src={context.userData.avatar} className="w-full h-full object-cover" />
                    : <FaRegUser className="text-[15px] text-gray-600" />
                  }
                </div>
                <span className="text-[13px] font-[500] max-w-[200px] truncate !capitalize !mr-auto">{context?.userData?.name}</span>
              </Button>
              <Menu
               anchorEl={anchorEl}
                 id="account-menu"
                  open={open}
                  onClose={handleClose}
                  onClick={handleClose}
                slotProps={{ paper: { elevation: 3, sx: { mt: 1.5, minWidth: 180 } } }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
                <Link to="/mon-compte" className="w-full block">
                  <MenuItem className="flex gap-2 !py-2 text-[14px]" onClick={handleClose}>
                    <FaRegUser /> {t.myAccount}
                  </MenuItem>
                </Link>
                <Link to="/mes-commandes" className="w-full block">
                  <MenuItem className="flex gap-2 !py-2 text-[14px]" onClick={handleClose}>
                    <IoBagCheckOutline /> {t.myOrders}
                  </MenuItem>
                </Link>
                <Link to="/mes-favoris" className="w-full block">
                  <MenuItem className="flex gap-2 !py-2 text-[14px]" onClick={handleClose}>
                    <FaRegHeart /> {t.myFavorites}
                  </MenuItem>
                </Link>
                {context?.userData?.isSeller && (
                  <Link to="/espace-vendeur" className="w-full block">
                    <MenuItem className="flex gap-2 !py-2 text-[14px] text-primary font-[600]">
                      🏪 {t.mySellerSpace}
                    </MenuItem>
                  </Link>
                )}
                <MenuItem onClick={logout} className="flex gap-2 !py-2 text-[14px]">
                  <IoIosLogOut /> {t.logout}
                </MenuItem>
              </Menu>
            </>
          )}
          
          <Link to="/comparateur">
            <IconButton size="small">
              <StyledBadge badgeContent={context.compareItems?.length || 0} color="secondary">
                <IoIosGitCompare className="text-[20px]" />
              </StyledBadge>
            </IconButton>
          </Link>

          <Link to="/mes-favoris">
            <IconButton size="small">
              <StyledBadge badgeContent={context.myListItems?.length || 0} color="secondary">
                <FaRegHeart className="text-[18px]" />
              </StyledBadge>
            </IconButton>
          </Link>

          <IconButton size="small" onClick={() => context.setOpenCartPanel(true)}>
            <StyledBadge badgeContent={context.cartItems?.length || 0} color="secondary">
              <MdOutlineShoppingCart className="text-[20px]" />
            </StyledBadge>
          </IconButton>
          </div>
        </div>
      

      
      <div className="w-[95%] !mx-auto">
        <Categorie />
      </div>
    </header>
  );
}*/}



{/*import { Link, useNavigate } from "react-router-dom";
import { Badge, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { IoIosGitCompare } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa";
import Recherche from "../recherch/index";
import Categorie from "../categorie/index";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../router";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { IoIosLogOut } from "react-icons/io";
import { IoBagCheckOutline } from "react-icons/io5";
import { fetchDataFromApi, postData } from "../../utils/api";
import { useTranslation } from "react-i18next";
import Select from "@mui/material/Select";

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: '0 4px',
  },
}));

export default function Entete() {
  const history = useNavigate();
  const context = useContext(MyContext);
  const { i18n } = useTranslation();
const [currency, setCurrency] = useState("FCFA");

const currencies = { FCFA: 1, EUR: 0.00152, USD: 0.00165, MAD: 0.016 };
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
const [searchTerm, setSearchTerm] = useState("");
const [searchResults, setSearchResults] = useState([]);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const logout = () => {
    setAnchorEl(null);
    postData(`/api/user/deconnexion`, {}).then(() => {
      context.setIsLogin(false);
      localStorage.removeItem("accesstoken");
      localStorage.removeItem("refreshtoken");
      history("/");
    });
  };
useEffect(() => {
  const delay = setTimeout(() => {
    if (searchTerm.trim() !== "") {
      fetchDataFromApi(`/api/product/search?q=${searchTerm}`)
        .then((res) => {
          if (res?.success) {
            setSearchResults(res.data);
          }
        });
    } else {
      setSearchResults([]);
    }
  }, 300); // ⏱️ debounce

  return () => clearTimeout(delay);
}, [searchTerm]);
  return (
    <>
      <header className="!py-2">
        <div className="">
          <div className="!py-5 flex items-center border-t h-5 border-gray-200">
            <div className="w-[95%] !mx-auto flex items-center gap-3">
              <div className="col1 w-[60%]">
                <p className="text-[13px] font-[450]">Obtenez une reduction de 10% dès votre premier commande</p>
              </div>
              <div className="flex items-center gap-2 w-[20%] ">
  <Select size="small" value={i18n.language} onChange={e => i18n.changeLanguage(e.target.value)}
    className="!text-[12px]" sx={{ fontSize: "11px", height: "30px" }}>
    <MenuItem value="fr" sx={{ fontSize: "12px" }}>🇫🇷 FR</MenuItem>
    <MenuItem value="en" sx={{ fontSize: "12px" }}>🇬🇧 EN</MenuItem>
    <MenuItem value="bm" sx={{ fontSize: "12px" }}>🇲🇱 BM</MenuItem>
    <MenuItem value="ar" sx={{ fontSize: "12px" }}>🇸🇦 AR</MenuItem>
  </Select>
  <Select size="small" value={currency} onChange={e => setCurrency(e.target.value)}
    sx={{ fontSize: "11px", height: "30px" }}>
    <MenuItem value="FCFA" sx={{ fontSize: "12px" }}>FCFA</MenuItem>
    <MenuItem value="EUR" sx={{ fontSize: "12px" }}>€ EUR</MenuItem>
    <MenuItem value="USD" sx={{ fontSize: "12px" }}>$ USD</MenuItem>
    <MenuItem value="MAD" sx={{ fontSize: "12px" }}>DH MAD</MenuItem>
  </Select>
</div>
              <div className="col2 w-[20%] !text-right">
                <ul>
                  <li className="!gap-5 flex items-center">
                    <div><Link to="/" className="text-[13px] font-[500] link">Centre D'aide</Link></div>
                    <div><Link to="/" className="text-[13px] font-[500] link">Suivi de Commande</Link></div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="header w-full flex justify-between !py-2 items-center border-b border-t border-gray-200 gap-3">
            <div className="justify-center text-center items-center w-[25%]">
              <h1 className="!w-full !text-[30px] !font-[600] items-center !text-pink-900 uppercase">suguba</h1>
            </div>
            <div className="col2 w-[40%] relative gap-2"><Recherche value={searchTerm} onChange={setSearchTerm} />
              {searchResults.length > 0 && (
  <div className="absolute bg-white w-full shadow-md z-50 !mt-3">
    {searchResults.map((item) => (
      <div 
        key={item._id}
        className="p-2 hover:bg-gray-100 cursor-pointer text-center"
        onClick={() => history(`/produit/${item._id}`)}
      >
        {item.name}
      </div>
    ))}
  </div>
)}

            </div>
          
            <div className="col3 w-[35%] flex items-center">
              <ul className="flex items-center gap-4 w-full">
                {context.isLogin === false ? (
                  <li>
                    <Link to="/connexion" className="text-[15px] font-[500] link">Se connecter</Link>
                    {" "}|&nbsp;
                    <Link to="/inscription" className="text-[15px] font-[500] link">S'inscrire</Link>
                  </li>
                ) : (
                  <>
                    <Button className="!text-[#000] myAccountWrap flex items-center gap-3 cursor-pointer" onClick={handleClick}>
                      <Button className="!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !bg-[#f1f1f1]">
                        {context?.userData?.avatar ? (
                          <img src={context.userData.avatar} className="w-full h-full rounded-full object-cover" alt="avatar" />
                        ) : (
                          <FaRegUser className="text-[16px] text-[rgba(0,0,0,0.7)]" />
                        )}
                      </Button>
                      <div className="flex info flex-col">
                        <h4 className="leading-3 text-[14px] text-[rgba(0,0,0,0.6)] font-[500] !mb-0 capitalize text-left">
                          {context?.userData?.name}
                        </h4>
                        <span className="text-[12px] text-[rgba(0,0,0,0.6)] font-[400] !mb-0 text-left">
                          {context?.userData?.email}
                        </span>
                      </div>
                    </Button>
                    <Menu
                      anchorEl={anchorEl}
                      id="account-menu"
                      open={open}
                      onClose={handleClose}
                      onClick={handleClose}
                      slotProps={{
                        paper: {
                          elevation: 0,
                          sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '&::before': {
                              content: '""', display: 'block', position: 'absolute',
                              top: 0, right: 14, width: 10, height: 10,
                              bgcolor: 'background.paper',
                              transform: 'translateY(-50%) rotate(45deg)', zIndex: 0,
                            },
                          },
                        },
                      }}
                      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                      <Link to="/mon-compte" className="w-full block">
                        <MenuItem className="flex gap-2 !py-2">
                          <FaRegUser className="text-[18px]" /> <span className="text-[14px]">Mon compte</span>
                        </MenuItem>
                      </Link>
                      <Link to="/mes-commandes" className="w-full block">
                        <MenuItem className="flex gap-2 !py-2">
                          <IoBagCheckOutline className="text-[18px]" /> <span className="text-[14px]">Mes commandes</span>
                        </MenuItem>
                      </Link>
                      <Link to="/mes-favoris" className="w-full block">
                        <MenuItem className="flex gap-2 !py-2">
                          <FaRegHeart className="text-[18px]" /> <span className="text-[14px]">Mes favoris</span>
                        </MenuItem>
                      </Link>
                      <MenuItem onClick={logout} className="flex gap-2 !py-2">
                        <IoIosLogOut className="text-[18px]" /> <span className="text-[14px]">Deconnexion</span>
                      </MenuItem>
                    </Menu>
                  </>
                )}

                <li>
                  <Link to="/comparateur">
                    <IconButton aria-label="compare">
                      <StyledBadge badgeContent={context.compareItems?.length || 0} color="secondary">
                        <IoIosGitCompare />
                      </StyledBadge>
                    </IconButton>
                  </Link>
                </li>

                <li>
                  <Link to="/mes-favoris">
                    <IconButton aria-label="favorites">
                      <StyledBadge badgeContent={context.myListItems?.length || 0} color="secondary">
                        <FaRegHeart />
                      </StyledBadge>
                    </IconButton>
                  </Link>
                </li>

                
                <li>
                  <IconButton aria-label="cart" onClick={() => context.setOpenCartPanel(true)}>
                    <StyledBadge badgeContent={context.cartItems?.length || 0} color="secondary">
                      <MdOutlineShoppingCart />
                    </StyledBadge>
                  </IconButton>
                </li>
              </ul>
            </div>
          </div>

          <div className="w-[95%] !mx-auto flex items-center">
            <Categorie />
          </div>
        </div>
      </header>
    </>
  );
}


{/*import { Link, useNavigate } from "react-router-dom";
import  {Badge, Button} from '@mui/material';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { IoIosGitCompare } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa";
import Recherche from "../recherch/index";
import Categorie from "../categorie/index";
import { useContext,useState } from "react";
import { MyContext } from "../../router";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { IoIosLogOut } from "react-icons/io";
import { IoBagCheckOutline } from "react-icons/io5";
import { fetchDataFromApi } from "../../utils/api";
const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: '0 4px',
  },
}));
export default function Entete(){
  const history=useNavigate();
    const context =useContext(MyContext);
      const [anchorEl, setAnchorEl] =useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
   const logout=()=>{
      setAnchorEl(null);
    fetchDataFromApi(`/api/user/deconnexion?token=${localStorage.getItem("accesstoken")}`,{withCredentials:true}).then((res)=>{
         if (res?.error!==true) {
          context.setIsLogin(false);
        localStorage.removeItem("accesstoken");
        localStorage.removeItem("refreshtoken");
        history("/");
      }
   })}
    return(
        <>
        <header className="!py-2">
            <div className="">
                <div className=" !py-5 flex items-center border-t  h-5  border-gray-200 ">
                    <div className="w-[95%] !mx-auto flex items-center gap-3">
                    <div className="col1 w-[80%] ">
                        <p className="text-[13px] font-[450]">Obtenez une reduction de 10% dès votre premier commande</p>
                    </div> 
                     <div className="col2  w-[20%] !text-right">
                        <ul >
                            <li className="!gap-5 flex items-center ">
                                <div>
                                  <Link to="/" className="text-[13px] font-[500] link">Centre D'aide </Link>
                                </div>
                                <div> <Link to="/" className="text-[13px] font-[500] link" >Suivi de Commande</Link></div>
                            </li>
                        </ul>
                    </div>
                    </div>
                 </div>
                <div className=" header w-full flex justify-between !py-2 items-center border-b border-t border-gray-200 gap-3 ">
                   <div className=" justify-center text-center items-center  w-[25%] "> 
                   <h1 className="!w-full !text-[30px] !font-[600] items-center !text-pink-900 uppercase"> suguba</h1>
                   </div>
                   <div className="col2  w-[40%] "><Recherche/> 
                   </div>
                   <div className="col3 w-[35%] flex items-center">
                   <ul className="flex items-center gap-4 w-full">
                    {context.isLogin === false ? 
                          ( <li>
                                <Link to="/connexion"  className="text-[15px] font-[500] link "> Se connecter</Link>
                                {" "}|&nbsp;
                                <Link to="/inscription" className=" text-[15px] font-[500] link ">S'inscrire</Link>
                            </li>) :
                             (
                             <>
                                <Button className="!text-[#000] myAccountWrap flex items-center gap-3 cursor-pointer"
                                onClick={handleClick}>
                                     <Button className="!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !bg-[#f1f1f1]">
                                        <FaRegUser className="text-[16px] text-[rgba(0,0,0,0.7)]"/>
                                     </Button>
                                     <div className="flex info flex-col">
                                        <h4 className="leading-3 text-[14px] text-[rgba(0,0,0,0.6)]
                                        font-[500] !mb-0 capitalize text-left justify-start">{
                                          context?.userData?.name}</h4>
                                        <span className="text-[12px] text-[rgba(0,0,0,0.6)]
                                        font-[400] !mb-0 capitalize text-left justify-start">
                                           {
                                          context?.userData?.email
                                        }
                                        </span>
                                     </div>
                                </Button>
                                 <Menu
                             anchorEl={anchorEl}
                              id="account-menu"
                               open={open}
                              onClose={handleClose}
                              onClick={handleClose}
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
                       <Link to="/mon-compte" className="w-full block">
                       <MenuItem onClick={handleClose} className="flex gap-2 !py-2">
                        <FaRegUser className="text-[18px]"/>{" "}<span className="text-[14px]">Mon compte</span>
                     </MenuItem>
                     </Link>
                     <Link to="/mes-commandes" className="w-full block">
                     <MenuItem onClick={handleClose} className="flex gap-2 !py-2">
                       <IoBagCheckOutline className="text-[18px]"/>{" "}<span className="text-[14px]"> Mes commandes</span>
                     </MenuItem>
                     </Link>
                     <Link to="/mes-favoris" className="w-full block">
                     <MenuItem onClick={handleClose} className="flex gap-2 !py-2">
                       <FaRegHeart className="text-[18px]"/> {" "}<span className="text-[14px]">Mes favoris</span>
                     </MenuItem>
                     </Link>
                    
                     <MenuItem onClick={logout} className="flex gap-2 !py-2 w-full block">
                       <IoIosLogOut className="text-[18px]"/>{" "}<span className="text-[14px]">Deconnexion</span>
                     </MenuItem>
                  
                       </Menu>
                           </> )}
                            
                        <li>
                            <IconButton aria-label="cart">
                              <StyledBadge badgeContent={4} color="secondary">
                                  <IoIosGitCompare />
                              </StyledBadge>
                           </IconButton>
                        </li>
                        <li>
                            <IconButton aria-label="cart">
                              <StyledBadge badgeContent={4} color="secondary">
                                <FaRegHeart />
                              </StyledBadge>
                           </IconButton>
                        </li>
                        <li>
                            <IconButton aria-label="cart" onClick={()=>context.setOpenCartPanel(true)}>
                              <StyledBadge badgeContent={4} color="secondary">
                                <MdOutlineShoppingCart />  
                              </StyledBadge>
                           </IconButton>
                        </li>
                   </ul>
                   </div>
                    
                </div>
                <div className="w-[95%] !mx-auto flex items-center">
                        <Categorie/>
                </div>
            </div>
        </header>
       
        </>
    )
}   */}       