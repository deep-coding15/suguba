import { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Header from './Composants/Header';
import Sidebar from './Composants/Sidebar';
import "./App.css";
import Dashboard from './Composants/Dashboard';
import { createContext } from 'react';
import Login from './Composants/Login';
import Inscription from './Composants/Inscription';
import Produit from './Composants/Produits/listeProduit.jsx';
import AddProduct from './Composants/Produits/addProduct';
import React from 'react';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Slide from '@mui/material/Slide';
import { IoMdClose } from 'react-icons/io';
import HomeSliderBanners from './Composants/HomeSlideBanners';
import AddHomeSlide from './Composants/AddHomeSlide/index';
import Category from './Composants/Category';
import AddCategory from './Composants/Category/addCategory';
import SubCategory from './Composants/Category/subCatList';
import AddSubCategory from './Composants/Category/addSubCategory';
import Users from './Composants/Users';
import Orders from './Composants/Orsers';
import ForgotPassword from './Composants/ForgotPassword';
import VerifyAccount from './Composants/VerifyAccount';
import ChangePassword from './Composants/ChangePassword';
import { fetchDataFromApi } from './utils/api.js';
import toast, { Toaster } from 'react-hot-toast';
import Profil from './Composants/profile/index.jsx';
import AddAddress from './Composants/Addresse/addAddress.jsx';
import EditCategory from './Composants/Category/editCategory.jsx';
import EditProduct from './Composants/Produits/Editproduct.jsx';
import GoogleSuccess from './Composants/GoogleSuccess';
import Sellers from './Composants/Sellers';
import OrdersAdmin from './Composants/Orsers';
import Hubs from './Composants/Hubs.jsx'; // ✅ NOUVEAU
import SupportRequests from './Composants/SupportRequests.jsx';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const MyContext = createContext();

function App() {
  const [address, setAddress] = useState([]);
  const [catData, setCatData] = useState([]);
  const [isLogin, setIsLogin] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accesstoken");
    if (token !== undefined && token !== null && token !== "") {
      setIsLogin(true);
      fetchDataFromApi(`/api/user/details-utilisateur`).then((res) => {
        setUserData(res.data);
      });
    } else {
      setIsLogin(false);
    }
  }, [isLogin]);

  const alertBox = (type, msg) => {
    if (type === "success") toast.success(msg);
    if (type === "error") toast.error(msg);
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isOpenFullScreen, setIsOpenFullScreen] = useState({ open: false, model: " ", id: "" });

  // Layout commun avec Header + Sidebar
  const withLayout = (Component) => (
    <section className='main'>
      <Header />
      <div className='contentMain flex'>
        <div className={`overflow-hidden sidebarwrapper ${isSidebarOpen ? "!w-[18%]" : "!w-[0%] opacity-0 pointer-events-none"} transition-all`}>
          <Sidebar />
        </div>
        <div className={`contentRight !py-4 !px-5 ${isSidebarOpen ? "!w-[82%] transition-all !pl-11" : "!w-[100%]"}`}>
          <Component />
        </div>
      </div>
    </section>
  );

  const router = createBrowserRouter([
    { path: "/", exact: true, element: <Login /> },
    { path: "/connexion", exact: true, element: <Login /> },
    { path: "/inscription", exact: true, element: <Inscription /> },
    { path: "/mot-de-passe-oublie", exact: true, element: <ForgotPassword /> },
    { path: "/verification-de-compte", exact: true, element: <VerifyAccount /> },
    { path: "/changer-de-mot-de-passe", exact: true, element: <ChangePassword /> },
    { path: "/auth/google/success", exact: true, element: <GoogleSuccess /> },

    { path: "/dashbord", exact: true, element: withLayout(Dashboard) },
    { path: "/produits", exact: true, element: withLayout(Produit) },
    { path: "/ajout-produit", exact: true, element: withLayout(AddProduct) },
    { path: "/bannieres", exact: true, element: withLayout(HomeSliderBanners) },
    { path: "/ajout-banniere", exact: true, element: withLayout(AddHomeSlide) },
    { path: "/list-categorie", exact: true, element: withLayout(Category) },
    { path: "/list-sous-categorie", exact: true, element: withLayout(SubCategory) },
    { path: "/liste-utilisateurs", exact: true, element: withLayout(Users) },
    { path: "/vendeurs", exact: true, element: withLayout(Sellers) },
    { path: "/liste-commandes", exact: true, element: withLayout(OrdersAdmin) },
    { path: "/profil", exact: true, element: withLayout(Profil) },
    { path: "/hubs", exact: true, element: withLayout(Hubs) },
    { path: "/support", exact: true, element: withLayout(SupportRequests) }, // ✅ NOUVEAU
  ]);

  useEffect(() => { getCat(); }, []);
  const getCat = () => {
    fetchDataFromApi("/api/category").then((res) => {
      setCatData(res?.data);
    });
  };

  const values = {
    isSidebarOpen, setIsSidebarOpen,
    isOpenFullScreen, setIsOpenFullScreen,
    setIsLogin, isLogin,
    alertBox, setUserData, userData,
    address, setAddress,
    catData, setCatData, getCat
  };

  return (
    <>
      <MyContext.Provider value={values}>
        <RouterProvider router={router} />

        <Dialog
          fullScreen
          open={isOpenFullScreen.open}
          onClose={() => setIsOpenFullScreen({ open: false })}
          slots={{ transition: Transition }}
        >
          <AppBar sx={{ position: 'relative' }}>
            <Toolbar>
              <IconButton edge="start" color="inherit"
                onClick={() => setIsOpenFullScreen({ open: false })} aria-label="close">
                <IoMdClose className='text-gray-800' />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                <span className='text-gray-800'>{isOpenFullScreen?.model}</span>
              </Typography>
            </Toolbar>
          </AppBar>
          {isOpenFullScreen?.model === "Ajouter un produit" && <AddProduct />}
          {isOpenFullScreen?.model === "Ajouter une Affiche" && <AddHomeSlide />}
          {isOpenFullScreen?.model === "Nouvelle categorie" && <AddCategory />}
          {isOpenFullScreen?.model === "Nouvelle sous categorie" && <AddSubCategory />}
          {isOpenFullScreen?.model === "Ajout d'addresse" && <AddAddress />}
          {isOpenFullScreen?.model === "modification categorie" && <EditCategory />}
          {isOpenFullScreen?.model === "Modifier un produit" && <EditProduct />}
        </Dialog>
      </MyContext.Provider>
      <Toaster />
    </>
  );
}

export { MyContext };
export default App;



{/*import { useState,useEffect } from 'react'
import {createBrowserRouter,RouterProvider} from "react-router-dom";
import Header from './Composants/Header';
import Sidebar from './Composants/Sidebar';
import "./App.css";
import Dashboard from './Composants/Dashboard';
import { createContext } from 'react';
import Login from './Composants/Login';
import Inscription from './Composants/Inscription';
import Produit from './Composants/Produits/listeProduit.jsx';
import AddProduct from './Composants/Produits/addProduct';
import React from 'react';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Slide from '@mui/material/Slide';
import { IoMdClose } from 'react-icons/io';
import HomeSliderBanners from './Composants/HomeSlideBanners';
import AddHomeSlide from './Composants/AddHomeSlide/index';
import Category from './Composants/Category';
import AddCategory from './Composants/Category/addCategory';
import SubCategory from './Composants/Category/subCatList';
import AddSubCategory from './Composants/Category/addSubCategory';
import Users from './Composants/Users';
import Orders from './Composants/Orsers';
import ForgotPassword from './Composants/ForgotPassword';
import VerifyAccount from './Composants/VerifyAccount';
import ChangePassword from './Composants/ChangePassword';
import { fetchDataFromApi } from './utils/api.js';
import toast, { Toaster } from 'react-hot-toast';
import Profil from './Composants/profile/index.jsx';
import AddAddress from './Composants/Addresse/addAddress.jsx';
import EditCategory from './Composants/Category/editCategory.jsx';
import EditProduct from './Composants/Produits/Editproduct.jsx';
import GoogleSuccess from './Composants/GoogleSuccess';
 import Sellers from './Composants/Sellers';
import OrdersAdmin from './Composants/Orsers';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

 const MyContext=createContext();


function App() {
    const [address,setAddress]=useState([]);
     const [catData,setCatData]=useState([]);
     const [isLogin, setIsLogin] =useState(false);
      const [userData, setUserData] =useState(null);
       useEffect(()=>{
        const token=localStorage.getItem("accesstoken");
        if (token!== undefined && token!==null && token!=="") {
          setIsLogin(true);
          fetchDataFromApi(`/api/user/details-utilisateur`).then((res)=>{
              setUserData(res.data);
          })
        } else {
          setIsLogin(false);
        }
       },[isLogin])
         const alertBox = (type,msg) =>{
      if (type==="success") {
        toast.success(msg);
      }
      if (type==="error") {
       toast.error(msg);
      }
     
    } 
    const [isSidebarOpen,setIsSidebarOpen]= useState(true);
    const [isOpenFullScreen,setIsOpenFullScreen]=useState({
        open:false,model:" ",id:""});

   const router=createBrowserRouter([
   

// Ajouter dans le router :
{
  path: "/vendeurs",
  exact: true,
  element: (
    <section className='main'>
      <Header />
      <div className='contentMain flex'>
        <div className={`overflow-hidden sidebarwrapper ${isSidebarOpen ? "!w-[18%]" : "!w-[0%] opacity-0 pointer-events-none"} transition-all`}>
          <Sidebar />
        </div>
        <div className={`contentRight !py-4 !px-5 ${isSidebarOpen ? "!w-[82%] transition-all !pl-11" : "!w-[100%]"}`}>
          <Sellers />
        </div>
      </div>
    </section>
  )
},
{
  path: "/liste-commandes",
  exact: true,
  element: (
    <section className='main'>
      <Header />
      <div className='contentMain flex'>
        <div className={`overflow-hidden sidebarwrapper ${isSidebarOpen ? "!w-[18%]" : "!w-[0%] opacity-0 pointer-events-none"} transition-all`}>
          <Sidebar />
        </div>
        <div className={`contentRight !py-4 !px-5 ${isSidebarOpen ? "!w-[82%] transition-all !pl-11" : "!w-[100%]"}`}>
          <OrdersAdmin />
        </div>
      </div>
    </section>
  )
},
     {
        path: "/",
        exact: true,
        element: (
            <>
                <Login/>
  
            </>
        )
    },
    {
        path: "/dashbord",
        exact: true,
        element: (
            <>
           <section className='main'>
                <Header/>
                 <div className='contentMain flex'>
                    <div className={`overflow-hidden sidebarwrapper ${isSidebarOpen===true ?"!w-[18%]" :"!w-[0%] opacity-0 pointer-events-none"} transition-all`}>
                        <Sidebar/>
                    </div>
                    <div className={`contentRight !py-4 !px-5 ${isSidebarOpen===true ?"!w-[82%] transition-all !pl-11" :"!w-[100%]"}`}>
                        <Dashboard />
                    </div>
                </div>
                
                
            </section> 
            </>
        )
    },
    {
        path: "/connexion",
        exact: true,
        element: (
            <>
                <Login/>
  
            </>
        )
    },
     {
        path: "/inscription",
        exact:true,
        element: (
            <>
                <Inscription/>
  
            </>
        )
    },
     {
        path: "/produits",
        exact: true,
        element: (
            <>
           <section className='main'>
                <Header/>
                 <div className='contentMain flex'>
                    <div className={`overflow-hidden sidebarwrapper ${isSidebarOpen===true ?"!w-[18%]" :"!w-[0%] opacity-0 pointer-events-none"} transition-all`}>
                        <Sidebar/>
                    </div>
                    <div className={`contentRight !py-4 !px-5 ${isSidebarOpen===true ?"!w-[82%] transition-all !pl-11" :"!w-[100%]"}`}>
                        <Produit/>
                    </div>
                </div>
                
                
            </section> 
            </>
        )
    },
      {
        path: "/ajout-produit",
        exact: true,
        element: (
            <>
           <section className='main'>
                <Header/>
                 <div className='contentMain flex'>
                    <div className={`overflow-hidden sidebarwrapper ${isSidebarOpen===true ?"!w-[18%]" :"!w-[0%] opacity-0 pointer-events-none"} transition-all`}>
                        <Sidebar/>
                    </div>
                    <div className={`contentRight !py-4 !px-5 ${isSidebarOpen===true ?"!w-[82%] transition-all !pl-11" :"!w-[100%]"}`}>
                        <AddProduct/>
                    </div>
                </div>
                
                
            </section> 
            </>
        )
    },
     {
        path: "/bannieres",
        exact: true,
        element: (
            <>
           <section className='main'>
                <Header/>
                 <div className='contentMain flex'>
                    <div className={`overflow-hidden sidebarwrapper ${isSidebarOpen===true ?"!w-[18%]" :"!w-[0%] opacity-0 pointer-events-none"} transition-all`}>
                        <Sidebar/>
                    </div>
                    <div className={`contentRight !py-4 !px-5 ${isSidebarOpen===true ?"!w-[82%] transition-all !pl-11" :"!w-[100%]"}`}>
                        <HomeSliderBanners/>
                    </div>
                </div>
                
                
            </section> 
            </>
        )
    },
     {
        path: "/ajout-banniere",
        exact: true,
        element: (
            <>
           <section className='main'>
                <Header/>
                 <div className='contentMain flex'>
                    <div className={`overflow-hidden sidebarwrapper ${isSidebarOpen===true ?"!w-[18%]" :"!w-[0%] opacity-0 pointer-events-none"} transition-all`}>
                        <Sidebar/>
                    </div>
                    <div className={`contentRight !py-4 !px-5 ${isSidebarOpen===true ?"!w-[82%] transition-all !pl-11" :"!w-[100%]"}`}>
                        <AddHomeSlide/>
                    </div>
                </div>
                
                
            </section> 
            </>
        )
    },
    {
        path: "/list-categorie",
        exact: true,
        element: (
            <>
           <section className='main'>
                <Header/>
                 <div className='contentMain flex'>
                    <div className={`overflow-hidden sidebarwrapper ${isSidebarOpen===true ?"!w-[18%]" :"!w-[0%] opacity-0 pointer-events-none"} transition-all`}>
                        <Sidebar/>
                    </div>
                    <div className={`contentRight !py-4 !px-5 ${isSidebarOpen===true ?"!w-[82%] transition-all !pl-11" :"!w-[100%]"}`}>
                        <Category/>
                    </div>
                </div>
                
                
            </section> 
            </>
        )
    },
      {
        path: "/list-sous-categorie",
        exact: true,
        element: (
            <>
           <section className='main'>
                <Header/>
                 <div className='contentMain flex'>
                    <div className={`overflow-hidden sidebarwrapper ${isSidebarOpen===true ?"!w-[18%]" :"!w-[0%] opacity-0 pointer-events-none"} transition-all`}>
                        <Sidebar/>
                    </div>
                    <div className={`contentRight !py-4 !px-5 ${isSidebarOpen===true ?"!w-[82%] transition-all !pl-11" :"!w-[100%]"}`}>
                        <SubCategory/>
                    </div>
                </div>
                
                
            </section> 
            </>
        )
    },
    {
        path: "/liste-utilisateurs",
        exact: true,
        element: (
            <>
           <section className='main'>
                <Header/>
                 <div className='contentMain flex'>
                    <div className={`overflow-hidden sidebarwrapper ${isSidebarOpen===true ?"!w-[18%]" :"!w-[0%] opacity-0 pointer-events-none"} transition-all`}>
                        <Sidebar/>
                    </div>
                    <div className={`contentRight !py-4 !px-5 ${isSidebarOpen===true ?"!w-[82%] transition-all !pl-11" :"!w-[100%]"}`}>
                        <Users/>
                    </div>
                </div>
                
                
            </section> 
            </>
        )
    },
    {
        path: "/mot-de-passe-oublie",
        exact: true,
        element: (
            <>
            <ForgotPassword/>
  
            </>
        )
    },
     {
        path: "/verification-de-compte",
        exact: true,
        element: (
            <>
            <VerifyAccount/>
  
            </>
        )
    },
    {
        path: "/changer-de-mot-de -passe",
        exact: true,
        element: (
            <>
            <ChangePassword/>
  
            </>
        )
    },
    {
  path: "/auth/google/success",
  exact: true,
  element: <GoogleSuccess />
},
      {
        path: "/profil",
        exact: true,
        element: (
            <>
           <section className='main'>
                <Header/>
                 <div className='contentMain flex'>
                    <div className={`overflow-hidden sidebarwrapper ${isSidebarOpen===true ?"!w-[18%]" :"!w-[0%] opacity-0 pointer-events-none"} transition-all`}>
                        <Sidebar/>
                    </div>
                    <div className={`contentRight !py-4 !px-5 ${isSidebarOpen===true ?"!w-[82%] transition-all !pl-11" :"!w-[100%]"}`}>
                        <Profil/>
                    </div>
                </div>
                
                
            </section> 
            </>
        )
    },
   ]);
   useEffect(()=>{
  getCat();
 },[]);
 const getCat=()=>{
    fetchDataFromApi("/api/category").then((res)=>{
    setCatData(res?.data)
    })
 }
    const values={isSidebarOpen
       ,setIsSidebarOpen,isOpenFullScreen,setIsOpenFullScreen,
       setIsLogin,isLogin,alertBox,setUserData,userData,address,setAddress,catData,setCatData,getCat
    };
   return(
    <>
    <MyContext.Provider value={values}>
     <RouterProvider router={router}/>


     <Dialog
        fullScreen
        open={isOpenFullScreen.open}
        onClose={()=>setIsOpenFullScreen({open:false})}
        slots={{
          transition: Transition,
        }}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={()=>setIsOpenFullScreen({open:false})}
              aria-label="close"
            >
              <IoMdClose className='text-gray-800'/>
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
             <span  className='text-gray-800'> {isOpenFullScreen?.model}</span>
            </Typography>
           
          </Toolbar>
        </AppBar>
        {isOpenFullScreen?.model==="Ajouter un produit" && <AddProduct/>}
         {isOpenFullScreen?.model==="Ajouter une Affiche" && <AddHomeSlide/>}
          {isOpenFullScreen?.model==="Nouvelle categorie" && <AddCategory/>}
           {isOpenFullScreen?.model==="Nouvelle sous categorie" && <AddSubCategory/>}
           {isOpenFullScreen?.model==="Ajout d'addresse" && <AddAddress/>}
            {isOpenFullScreen?.model==="modification categorie" && <EditCategory/>}
            {isOpenFullScreen?.model === "Modifier un produit" && <EditProduct />}
      </Dialog>
    
    </MyContext.Provider>
    <Toaster />
    </>
   )
}
export {MyContext};
export default App;*/}
{/*  {
        path: "liste-commandes",
        exact: true,
        element: (
            <>
           <section className='main'>
                <Header/>
                 <div className='contentMain flex'>
                    <div className={`overflow-hidden sidebarwrapper ${isSidebarOpen===true ?"!w-[18%]" :"!w-[0%] opacity-0 pointer-events-none"} transition-all`}>
                        <Sidebar/>
                    </div>
                    <div className={`contentRight !py-4 !px-5 ${isSidebarOpen===true ?"!w-[82%] transition-all !pl-11" :"!w-[100%]"}`}>
                        <Orders/>
                    </div>
                </div>
                
                
            </section> 
            </>
        )
    }, */}