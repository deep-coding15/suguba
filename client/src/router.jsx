import { BrowserRouter, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import Acceuil from './composants/page/acceuil';
import Entete from "./composants/entête/index";
import Footer from "./composants/Footer/index";
import ProduitListing from "./composants/page/ProduitListing/index";
import ProductDetails from "./composants/page/ProductDetails/index";
import { createContext, useEffect, useState } from 'react';
import { IoCloseSharp } from "react-icons/io5";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import ProductZoom from './composants/productZoom';
import ProductDetailsComponent from './composants/page/ProductDetailsComponent';
import Login from './composants/page/Login/index';
import Register from './composants/page/Register/index';
import CartPage from './composants/page/cart/index';
import Verify from './composants/page/verify';
import toast, { Toaster } from 'react-hot-toast';
import ForgotPassword from './composants/page/ForgotPassword/index';
import Checkout from './composants/page/Checkout';
import MyAccount from './composants/page/MyAccount';
import MyList from './composants/page/MyList';
import Orders from './composants/page/Commandes';
import { fetchDataFromApi, postData, deleteData } from './utils/api';
import Address from './composants/page/MyAccount/address';
import GoogleSuccess from './composants/GoogleSuccess';
import Comparateur from './composants/page/Comparateur/index';
import BecomeSellerPage from './composants/page/BecomeSellerPage/index';
import SellerSpace from './composants/page/SellerSpace/index';
import CentreAide from './composants/CentreAide.jsx';
const MyContext = createContext();

// Composant guard pour la route devenir-vendeur
function BecomeSellerGuard() {
  const context_val = useContext_import();
  // Ce composant est rendu dans le contexte du Provider, on passe par BecomeSellerPage
  return <BecomeSellerPage />;
}

// Import useContext inline pour éviter les imports circulaires
import { useContext as useContext_import } from 'react';

export default function AppRouter() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [address, setAddress] = useState([]);
  const [catData, setCatData] = useState([]);
  const [openProductDetailsModal, setOpenProductDetailsModal] = useState(false);
  const [fullWidth] = useState(true);
  const [maxWidth] = useState("xl");
  const [isLogin, setIsLogin] = useState(false);
  const [openCartPanel, setOpenCartPanel] = useState(false);
  const [userData, setUserData] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [myListItems, setMyListItems] = useState([]);
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "fr");
  const [currency, setCurrency] = useState(() => localStorage.getItem("currency") || "fcfa");

  const changeLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem("lang", newLang);
    document.dir = newLang === "ar" ? "rtl" : "ltr";
  };

  const changeCurrency = (newCurrency) => {
    setCurrency(newCurrency);
    localStorage.setItem("currency", newCurrency);
  };

  const [compareItems, setCompareItems] = useState(() => {
    try {
      const saved = localStorage.getItem("compareItems");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const handleCloseProductDetailsModal = () => setOpenProductDetailsModal(false);

  const getCat = () => {
    fetchDataFromApi("/api/category").then((res) => setCatData(res?.data));
  };

  useEffect(() => { getCat(); }, []);

  // Auth
  useEffect(() => {
    const token = localStorage.getItem("accesstoken");
    if (token && token !== "null" && token !== "") {
      setIsLogin(true);
      fetchDataFromApi(`/api/user/details-utilisateur`).then((res) => {
        setUserData(res?.data);
      });
    } else {
      setIsLogin(false);
      setUserData(null);
    }
  }, [isLogin]);

  // Panier & favoris
  useEffect(() => {
    if (isLogin) {
      getCartItems();
      getMyListItems();
    } else {
      setCartItems([]);
      setMyListItems([]);
    }
  }, [isLogin]);

  const getCartItems = () => {
    fetchDataFromApi("/api/cart/contenu-panier").then((res) => {
      if (res?.success) setCartItems(res.data);
      else setCartItems([]);
    });
  };

  const addToCart = (productId, qty = 1, size = "") => {
    if (!isLogin) {
      alertBox("error", "Veuillez vous connecter pour ajouter au panier");
      return;
    }
    postData("/api/cart/ajout-panier", { productId, quantity: qty, size }).then((res) => {
      if (res?.success) {
        alertBox("success", res?.message);
        getCartItems();
      } else {
        alertBox("error", res?.message);
      }
    });
  };

  const removeFromCart = (cartItemId, productId) => {
    deleteData("/api/cart/suppressionion-panier", { id: cartItemId, productId }).then((res) => {
      if (res?.success) {
        alertBox("success", "Produit retiré du panier");
        getCartItems();
      }
    });
  };

  const getMyListItems = () => {
    fetchDataFromApi("/api/myList").then((res) => {
      setMyListItems(res?.data || []);
    });
  };

  const addToMyList = (product) => {
    if (!isLogin) { alertBox("error", "Veuillez vous connecter"); return; }
    postData("/api/myList/ajout-favoris", {
      productId: product._id,
      productTitle: product.name,
      images: product.images?.[0],
      rating: product.rating,
      price: product.price,
      oldPrice: product.oldPrice,
      brand: product.brand,
      discount: product.discount,
    }).then((res) => {
      if (res?.success) { alertBox("success", res?.message); getMyListItems(); }
      else alertBox("error", res?.message);
    });
  };

  const removeFromMyList = (id) => {
    deleteData(`/api/myList/suppression-favoris/${id}`).then((res) => {
      if (res?.success) { alertBox("success", "Retiré des favoris"); getMyListItems(); }
      else alertBox("error", res?.message || "Erreur suppression");
    });
  };

  const addToCompare = (product) => {
    if (compareItems.find((p) => p._id === product._id)) {
      alertBox("error", "Produit déjà dans le comparateur"); return;
    }
    if (compareItems.length >= 4) {
      alertBox("error", "Maximum 4 produits à comparer"); return;
    }
    const newItems = [...compareItems, product];
    setCompareItems(newItems);
    localStorage.setItem("compareItems", JSON.stringify(newItems));
    alertBox("success", "Produit ajouté au comparateur");
  };

  const removeFromCompare = (productId) => {
    const newItems = compareItems.filter((p) => p._id !== productId);
    setCompareItems(newItems);
    localStorage.setItem("compareItems", JSON.stringify(newItems));
  };

  const toggleCartPanel = (newOpen) => setOpenCartPanel(newOpen);

  const alertBox = (type, msg) => {
    if (type === "success") toast.success(msg);
    if (type === "error") toast.error(msg);
  };

  const values = {
    isLogin, openCartPanel, setOpenProductDetailsModal,
    setOpenCartPanel, toggleCartPanel, setIsLogin,
    alertBox, setUserData, userData, address, setAddress,
    catData, setCatData, getCat,
    cartItems, getCartItems, addToCart, removeFromCart,
    myListItems, getMyListItems, addToMyList, removeFromMyList,
    compareItems, addToCompare, removeFromCompare,
    selectedProduct, setSelectedProduct,
    lang, changeLang, currency, changeCurrency
  };

  return (
    <>
      <BrowserRouter>
        <MyContext.Provider value={values}>
          <Entete />
          <Routes>
            <Route path="/" element={<Acceuil />} />
            <Route path="/listeProduits" element={<ProduitListing />} />
            <Route path="/produit/:id" element={<ProductDetails />} />
            <Route path="/connexion" element={<Login />} />
            <Route path="/inscription" element={<Register />} />
            <Route path="/panier" element={<CartPage />} />
            <Route path="/verification" element={<Verify />} />
            <Route path="/reinitialisation-mot-de-passe" element={<ForgotPassword />} />
            <Route path="/auth/google/success" element={<GoogleSuccess />} />
            <Route path="/detail-facturation" element={<Checkout />} />
            <Route path="/mon-compte" element={<MyAccount />} />
            <Route path="/mes-favoris" element={<MyList />} />
            <Route path="/mes-commandes" element={<Orders />} />
            <Route path="/mes-addresses" element={<Address />} />
            <Route path="/comparateur" element={<Comparateur />} />
            {/* Devenir vendeur — BecomeSellerPage gère elle-même la redirection si pas connecté */}
            <Route path="/devenir-vendeur" element={<BecomeSellerPage />} />
            {/* Espace vendeur — protégé par SellerSpace */}
            <Route path="/espace-vendeur/*" element={<SellerSpace />} />
            <Route path="/centre-aide" element={<CentreAide />} />
          </Routes>
          <Footer />

          {/* Modal détail produit */}
          <Dialog
            open={openProductDetailsModal}
            fullWidth={fullWidth}
            maxWidth={false}
            onClose={handleCloseProductDetailsModal}
            className='ProductDetailsModal'>
            <DialogContent className="!h-[90vh] !w-[90vw]">
              <div className='flex w-full h-full ProductDetailsModalContainer relative'>
                <Button
                  className='!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[#000] !absolute top-[15px] right-[15px] !bg-[#f1f1f1]'
                  onClick={handleCloseProductDetailsModal}>
                  <IoCloseSharp className='text-[20px]' />
                </Button>
                <div className="productZoomContainer !w-[50%] !px-3 !py-3">
                  <ProductZoom images={selectedProduct?.images || []} />
                </div>
                <div className="productContent !w-[50%] !py-5 !px-8">
                  <ProductDetailsComponent product={selectedProduct} />
                </div>
              </div>
            </DialogContent>
          </Dialog>

        </MyContext.Provider>
      </BrowserRouter>
      <Toaster />
    </>
  );
}

export { MyContext };






{/*import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Acceuil from './composants/page/acceuil'
import Entete from "./composants/entête/index"
import Footer from "./composants/Footer/index";
import ProduitListing from "./composants/page/ProduitListing/index"
import ProductDetails from "./composants/page/ProductDetails/index"
import { createContext, useEffect, useState } from 'react';
import { IoCloseSharp } from "react-icons/io5";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import ProductZoom from './composants/productZoom';
import ProductDetailsComponent from './composants/page/ProductDetailsComponent';
import Login from './composants/page/Login/index';
import Register from './composants/page/Register/index';
import CartPage from './composants/page/cart/index';
import Verify from './composants/page/verify';
import toast, { Toaster } from 'react-hot-toast';
import ForgotPassword from './composants/page/ForgotPassword/index';
import Checkout from './composants/page/Checkout';
import MyAccount from './composants/page/MyAccount';
import MyList from './composants/page/MyList';
import Orders from './composants/page/Commandes';
import { fetchDataFromApi, postData, deleteData } from './utils/api';
import Address from './composants/page/MyAccount/address';
import GoogleSuccess from './composants/GoogleSuccess';
import Comparateur from './composants/page/Comparateur/index';
import BecomeSellerPage from './composants/page/BecomeSellerPage/index';
import SellerSpace from './composants/page/SellerSpace/index';
const MyContext = createContext();


export default function AppRouter() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [address, setAddress] = useState([]);
  const [catData, setCatData] = useState([]);
  const [openProductDetailsModal, setOpenProductDetailsModal] = useState(false);
  const [fullWidth] = useState(true);
  const [maxWidth] = useState("xl");
  const [isLogin, setIsLogin] = useState(false);
  const [openCartPanel, setOpenCartPanel] = useState(false);
  const [userData, setUserData] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [myListItems, setMyListItems] = useState([]);
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "fr");
const [currency, setCurrency] = useState(() => localStorage.getItem("currency") || "fcfa");

const changeLang = (newLang) => {
  setLang(newLang);
  localStorage.setItem("lang", newLang);
  // RTL pour arabe
  document.dir = newLang === "ar" ? "rtl" : "ltr";
};

const changeCurrency = (newCurrency) => {
  setCurrency(newCurrency);
  localStorage.setItem("currency", newCurrency);
};
  const [compareItems, setCompareItems] = useState(() => {
  try {
    const saved = localStorage.getItem("compareItems");
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
});
  const handleCloseProductDetailsModal = () => setOpenProductDetailsModal(false);

  // Catégories
  const getCat = () => {
    fetchDataFromApi("/api/category").then((res) => setCatData(res?.data));
  };

  useEffect(() => { getCat(); }, []);

  // Auth
  useEffect(() => {
    const token = localStorage.getItem("accesstoken");
    if (token && token !== "null" && token !== "") {
      setIsLogin(true);
      fetchDataFromApi(`/api/user/details-utilisateur`).then((res) => {
        setUserData(res.data);
      });
    } else {
      setIsLogin(false);
    }
  }, [isLogin]);

  // Panier — charger au login
  useEffect(() => {
    if (isLogin) {
      getCartItems();
      getMyListItems();
    } else {
      setCartItems([]);
      setMyListItems([]);
    }
  }, [isLogin]);
  const getCartItems = () => {
  fetchDataFromApi("/api/cart/contenu-panier").then((res) => {
    console.log("PANIER API:", res); // 🔥 DEBUG
   console.log("TOKEN:", localStorage.getItem("accesstoken"));
    if (res && res.success) {
      setCartItems(res.data);
    } else {
      console.log("Erreur récupération panier");
      setCartItems([]);
    }
  });
};
  {/*const getCartItems = () => {
    fetchDataFromApi("/api/cart/contenu-panier").then((res) => {
      setCartItems(res?.data || []);
    });
  };

  // Ajouter au panier
  
const addToCart = (productId, qty = 1, size = "") => {
  if (!isLogin) {
    alertBox("error", "Veuillez vous connecter pour ajouter au panier");
    return;
  }
  postData("/api/cart/ajout-panier", { productId, quantity: qty, size }).then((res) => {
    if (res?.success) {
      alertBox("success", res?.message);
      getCartItems();
    } else {
      alertBox("error", res?.message);
    }
  });
};
  // Supprimer du panier
  const removeFromCart = (cartItemId, productId) => {
    deleteData("/api/cart/suppressionion-panier", { id: cartItemId, productId }).then((res) => {
      if (res?.success) {
        alertBox("success", "Produit retiré du panier");
        getCartItems();
      }
    });
  };

  // Favoris
  const getMyListItems = () => {
    fetchDataFromApi("/api/myList").then((res) => {
      setMyListItems(res?.data || []);
    });
  };

  const addToMyList = (product) => {
    if (!isLogin) {
      alertBox("error", "Veuillez vous connecter");
      return;
    }
    postData("/api/myList/ajout-favoris", {
      productId: product._id,
      productTitle: product.name,
      images: product.images?.[0],
      rating: product.rating,
      price: product.price,
      oldPrice: product.oldPrice,
      brand: product.brand,
      discount: product.discount,
    }).then((res) => {
      if (res?.success) {
        alertBox("success", res?.message);
        getMyListItems();
      } else {
        alertBox("error", res?.message);
      }
    });
  };
const removeFromMyList = (id) => {
  deleteData(`/api/myList/suppression-favoris/${id}`).then((res) => {
    if (res?.success) {
      alertBox("success", "Retiré des favoris");
      getMyListItems();
    } else {
      alertBox("error", res?.message || "Erreur suppression");
    }
  });
};

  // Comparateur (local)
const addToCompare = (product) => {
  if (compareItems.find((p) => p._id === product._id)) {
    alertBox("error", "Produit déjà dans le comparateur");
    return;
  }
  if (compareItems.length >= 4) {
    alertBox("error", "Maximum 4 produits à comparer");
    return;
  }
  const newItems = [...compareItems, product];
  setCompareItems(newItems);
  localStorage.setItem("compareItems", JSON.stringify(newItems));
  alertBox("success", "Produit ajouté au comparateur");
};

const removeFromCompare = (productId) => {
  const newItems = compareItems.filter((p) => p._id !== productId);
  setCompareItems(newItems);
  localStorage.setItem("compareItems", JSON.stringify(newItems));
};
  const toggleCartPanel = (newOpen) => setOpenCartPanel(newOpen);

  const alertBox = (type, msg) => {
    if (type === "success") toast.success(msg);
    if (type === "error") toast.error(msg);
  };

  const values = {
    isLogin, openCartPanel, setOpenProductDetailsModal,
    setOpenCartPanel, toggleCartPanel, setIsLogin,
    alertBox, setUserData, userData, address, setAddress,
    catData, setCatData, getCat,
    cartItems, getCartItems, addToCart, removeFromCart,
    myListItems, getMyListItems, addToMyList, removeFromMyList,
    compareItems, addToCompare, removeFromCompare,selectedProduct, setSelectedProduct,
    lang, changeLang, currency, changeCurrency
  };

  return (
    <>
      <BrowserRouter>
        <MyContext.Provider value={values}>
          <Entete />
          <Routes>
            <Route path={"/"} exact={true} element={<Acceuil />} />
            <Route path={"/listeProduits"} exact={true} element={<ProduitListing />} />
            <Route path={"/produit/:id"} exact={true} element={<ProductDetails />} />
            <Route path={"/connexion"} exact={true} element={<Login />} />
            <Route path={"/inscription"} exact={true} element={<Register />} />
            <Route path={"/panier"} exact={true} element={<CartPage />} />
            <Route path={"/verification"} exact={true} element={<Verify />} />
            <Route path={"/reinitialisation-mot-de-passe"} exact={true} element={<ForgotPassword />} />
            <Route path={"/auth/google/success"} exact={true} element={<GoogleSuccess />} />
            <Route path={"/detail-facturation"} exact={true} element={<Checkout />} />
            <Route path={"/mon-compte"} exact={true} element={<MyAccount />} />
            <Route path={"/mes-favoris"} exact={true} element={<MyList />} />
            <Route path={"/mes-commandes"} exact={true} element={<Orders />} />
            <Route path={"/mes-addresses"} exact={true} element={<Address />} />
            <Route path={"/comparateur"} exact={true} element={<Comparateur />} />
            <Route path="/devenir-vendeur" element={<BecomeSellerPage />} />
<Route path="/espace-vendeur/*" element={<SellerSpace />} />
          </Routes>
          <Footer />
          <Dialog
  open={openProductDetailsModal}
  fullWidth={fullWidth}
  maxWidth={false}
  onClose={handleCloseProductDetailsModal}
  className='ProductDetailsModal'
>
  <DialogContent className="!h-[90vh] !w-[90vw]">
    <div className='flex w-full h-full ProductDetailsModalContainer relative'>
      <Button
        className='!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[#000] !absolute top-[15px] right-[15px] !bg-[#f1f1f1]'
        onClick={handleCloseProductDetailsModal}
      >
        <IoCloseSharp className='text-[20px]' />
      </Button>

      
      <div className="productZoomContainer !w-[50%] !px-3 !py-3 ">
        
        <ProductZoom images={selectedProduct?.images || []} />
      </div>

      
      <div className="productContent !w-[50%]  !py-5 !px-8">
        <ProductDetailsComponent product={selectedProduct} />
      </div>
    </div>
  </DialogContent>
        </Dialog>

        </MyContext.Provider>
      </BrowserRouter>

     
      <Toaster />
    </>
  );
}
export { MyContext };*/}

{/*
   <Dialog
        open={openProductDetailsModal}
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        onClose={handleCloseProductDetailsModal}
        className='ProductDetailsModal'
      >
        <DialogContent>
          <div className='flex w-full ProductDetailsModalContainer relative'>
            <Button
              className='!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[#000] !absolute top-[15px] right-[15px] !bg-[#f1f1f1]'
              onClick={handleCloseProductDetailsModal}
            >
              <IoCloseSharp className='text-[20px]' />
            </Button>
           <div className='col1 w-[40%] !px-3 !py-3'>
          <ProductZoom images={selectedProduct?.images || []} />
         </div>
      <div className='col2 w-[60%] !py-2 !px-8 pr-16 productContent'>
         <ProductDetailsComponent product={selectedProduct} />
        </div>           
            const addToCompare = (product) => {
    if (compareItems.find((p) => p._id === product._id)) {
      alertBox("error", "Produit déjà dans le comparateur");
      return;
    }
    if (compareItems.length >= 4) {
      alertBox("error", "Maximum 4 produits à comparer");
      return;
    }
    setCompareItems([...compareItems, product]);
    alertBox("success", "Produit ajouté au comparateur");
  };

  const removeFromCompare = (productId) => {
    setCompareItems(compareItems.filter((p) => p._id !== productId));
  };
          </div>
        </DialogContent>
      </Dialog>const addToCart = (productId) => {
    if (!isLogin) {
      alertBox("error", "Veuillez vous connecter pour ajouter au panier");
      return;
    }
    postData("/api/cart/ajout-panier", { productId }).then((res) => {
      if (res?.success) {
        alertBox("success", res?.message);
        getCartItems();
      } else {
        alertBox("error", res?.message);
      }
    });
  };
  */}
