import { IoIosLogOut } from "react-icons/io";
import { IoBagCheckOutline } from "react-icons/io5";
import { NavLink, useNavigate } from "react-router-dom";
import { FaCloudUploadAlt, FaRegUser, FaRegHeart, FaStore } from "react-icons/fa";
import { Button } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../../router.jsx";
import { fetchDataFromApi, uploadImages } from "../../../utils/api.js";
import CircularProgress from "@mui/material/CircularProgress";
import { MdPlace } from "react-icons/md";
import { translations } from "../../../utils/i18n.js";

export default function AccountSidebar() {
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const context = useContext(MyContext);
  const history = useNavigate();
  const t = translations[context?.lang] || translations.fr;

  useEffect(() => {
    if (context?.userData?.avatar) {
      setPreviews([context.userData.avatar]);
    }
  }, [context?.userData]);

  const onChangeFile = async (e) => {
    try {
      setPreviews([]);
      const files = e.target.files;
      setUploading(true);
      const formdata = new FormData();
      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        if (["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(f.type)) {
          formdata.append("avatar", f);
        } else {
          context.alertBox("error", "Format invalide");
          setUploading(false);
          return;
        }
      }
      uploadImages("/api/user/chargement-image", formdata).then((res) => {
        setUploading(false);
        if (res?.data?.avatar) setPreviews([res.data.avatar]);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    fetchDataFromApi("/api/user/deconnexion").then((res) => {
      if (res?.error !== true) {
        context.setIsLogin(false);
        history("/");
        localStorage.removeItem("accesstoken");
        localStorage.removeItem("refreshtoken");
      }
    });
  };

  const isSeller = context?.userData?.isSeller;

  return (
    <div className="card bg-white shadow-md rounded-xl sticky top-[10px] overflow-hidden">
      {/* Avatar + infos */}
      <div className="!p-5 flex items-center justify-center flex-col border-b border-gray-100">
        <div className="w-[100px] h-[100px] rounded-full overflow-hidden !mb-3 relative group flex items-center justify-center bg-gray-200 cursor-pointer">
          {uploading ? (
            <CircularProgress color="inherit" size={30} />
          ) : (
            <>
              {previews.length > 0
                ? previews.map((img, i) => <img key={i} src={img} className="w-full h-full object-cover" alt="avatar" />)
                : <img src="/user.webp" className="w-full h-full object-cover" alt="avatar" />
              }
              <div className="overlay w-full h-full absolute top-0 left-0 z-50 bg-[rgba(0,0,0,0.6)] flex items-center justify-center cursor-pointer opacity-0 transition-all group-hover:opacity-100 rounded-full">
                <FaCloudUploadAlt className="text-white text-[22px]" />
                <input type="file" className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" onChange={onChangeFile} name="avatar" />
              </div>
            </>
          )}
        </div>
        <h3 className="font-[600] text-[15px] text-center">{context?.userData?.name}</h3>
        <p className="text-[12px] text-gray-500 text-center">{context?.userData?.email}</p>

        {/* Badge vendeur */}
        {isSeller && (
          <span className="!mt-2 !px-3 !py-1 bg-green-100 text-green-700 rounded-full text-[11px] font-[600] flex items-center gap-1">
            <FaStore className="text-[12px]" /> {t.sellerActive}
          </span>
        )}
      </div>

      {/* Navigation */}
      <ul className="list-none !py-2">
        <li className="w-full">
          <NavLink to="/mon-compte">
            {({ isActive }) => (
              <Button className={`w-full !text-left !py-2 !px-5 !justify-start !capitalize !rounded-none flex items-center gap-3 text-[13px] font-[500]
                ${isActive ? "!bg-pink-50 !text-primary border-r-2 border-primary" : "!text-[rgba(0,0,0,0.8)] hover:!bg-gray-50"}`}>
                <FaRegUser className="text-[15px]" /> Mon profil
              </Button>
            )}
          </NavLink>
        </li>

        <li className="w-full">
          <NavLink to="/mes-addresses">
            {({ isActive }) => (
              <Button className={`w-full !text-left !py-2 !px-5 !justify-start !capitalize !rounded-none flex items-center gap-3 text-[13px] font-[500]
                ${isActive ? "!bg-pink-50 !text-primary border-r-2 border-primary" : "!text-[rgba(0,0,0,0.8)] hover:!bg-gray-50"}`}>
                <MdPlace className="text-[16px]" /> Mes Adresses
              </Button>
            )}
          </NavLink>
        </li>

        <li className="w-full">
          <NavLink to="/mes-favoris">
            {({ isActive }) => (
              <Button className={`w-full !text-left !py-2 !px-5 !justify-start !capitalize !rounded-none flex items-center gap-3 text-[13px] font-[500]
                ${isActive ? "!bg-pink-50 !text-primary border-r-2 border-primary" : "!text-[rgba(0,0,0,0.8)] hover:!bg-gray-50"}`}>
                <FaRegHeart className="text-[16px]" /> Mes favoris
              </Button>
            )}
          </NavLink>
        </li>

        <li className="w-full">
          <NavLink to="/mes-commandes">
            {({ isActive }) => (
              <Button className={`w-full !text-left !py-2 !px-5 !justify-start !capitalize !rounded-none flex items-center gap-3 text-[13px] font-[500]
                ${isActive ? "!bg-pink-50 !text-primary border-r-2 border-primary" : "!text-[rgba(0,0,0,0.8)] hover:!bg-gray-50"}`}>
                <IoBagCheckOutline className="text-[16px]" /> Mes commandes
              </Button>
            )}
          </NavLink>
        </li>

        {/* ── Espace vendeur OU Devenir vendeur — jamais les deux ── */}
        {isSeller ? (
          <li className="w-full">
            <NavLink to="/espace-vendeur">
              {({ isActive }) => (
                <Button className={`w-full !text-left !py-2 !px-5 !justify-start !capitalize !rounded-none flex items-center gap-3 text-[13px] font-[600]
                  ${isActive ? "!bg-primary !text-white" : "!bg-pink-50 !text-primary hover:!bg-pink-100"}`}>
                  <FaStore className="text-[16px]" /> {t.mySellerSpace}
                </Button>
              )}
            </NavLink>
          </li>
        ) : (
          /* Les non-vendeurs voient "Devenir vendeur" */
          <li className="w-full border-t border-dashed border-gray-200">
            <NavLink to="/devenir-vendeur">
              {({ isActive }) => (
                <Button className={`w-full !text-left !py-2 !px-5 !justify-start !capitalize !rounded-none flex items-center gap-3 text-[13px] font-[500]
                  ${isActive ? "!bg-pink-50 !text-primary border-r-2 border-primary" : "!text-[rgba(0,0,0,0.8)] hover:!bg-gray-50"}`}>
                  <FaStore className="text-[16px] text-primary" /> {t.becomeSeller}
                </Button>
              )}
            </NavLink>
          </li>
        )}

        <li className="w-full border-t border-gray-100">
          <Button
            onClick={logout}
            className="w-full !text-left !py-2 !px-5 !justify-start !capitalize !text-red-500 !rounded-none flex items-center gap-3 text-[13px] font-[500] hover:!bg-red-50">
            <IoIosLogOut className="text-[18px]" /> Déconnexion
          </Button>
        </li>
      </ul>
    </div>
  );
}




{/*import { IoIosLogOut } from "react-icons/io";
import { IoBagCheckOutline } from "react-icons/io5";
import { NavLink, useNavigate } from "react-router-dom";
import { FaCloudUploadAlt, FaRegUser, FaRegHeart, FaStore } from "react-icons/fa";
import { Button } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../../router.jsx";
import { fetchDataFromApi, uploadImages } from "../../../utils/api.js";
import CircularProgress from "@mui/material/CircularProgress";
import { MdPlace } from "react-icons/md";

export default function AccountSidebar() {
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const context = useContext(MyContext);
  const history = useNavigate();

  useEffect(() => {
    if (context?.userData?.avatar) {
      setPreviews([context.userData.avatar]);
    }
  }, [context?.userData]);

  const formdata = new FormData();
  const onChangeFile = async (e) => {
    try {
      setPreviews([]);
      const files = e.target.files;
      setUploading(true);
      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        if (["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(f.type)) {
          formdata.append("avatar", f);
        } else {
          context.alertBox("error", "Format invalide");
          setUploading(false);
          return;
        }
      }
      uploadImages("/api/user/chargement-image", formdata).then((res) => {
        setUploading(false);
        if (res?.data?.avatar) setPreviews([res.data.avatar]);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    fetchDataFromApi("/api/user/deconnexion").then((res) => {
      if (res?.error !== true) {
        context.setIsLogin(false);
        history("/");
        localStorage.removeItem("accesstoken");
        localStorage.removeItem("refreshtoken");
      }
    });
  };

  return (
    <div className="card bg-white shadow-md rounded-md sticky top-[10px] p-5">
      <div className="w-full !p-3 flex items-center justify-center flex-col">
        <div className="w-[110px] h-[110px] rounded-full overflow-hidden !mb-4 relative group flex items-center justify-center bg-gray-200">
          {uploading ? <CircularProgress color="inherit" /> : (
            <>
              {previews.length > 0
                ? previews.map((img, i) => <img key={i} src={img} className="w-full h-full object-cover" />)
                : <img src="/user.webp" className="w-full h-full object-cover" />
              }
              <div className="overlay w-full h-full absolute top-0 left-0 z-50 !bg-[rgba(0,0,0,0.7)] flex items-center justify-center cursor-pointer opacity-0 transition-all group-hover:opacity-100">
                <FaCloudUploadAlt className="text-white text-[25px]" />
                <input type="file" className="absolute top-0 left-0 w-full h-full opacity-0" accept="image/*" onChange={onChangeFile} name="avatar" />
              </div>
            </>
          )}
        </div>
        <h3>{context?.userData?.name}</h3>
        <h6 className="text-[13px] font-[500]">{context?.userData?.email}</h6>

        
        {context?.userData?.isSeller && (
          <span className="!mt-2 !px-3 !py-1 bg-green-100 text-green-700 rounded-full text-[11px] font-[600] flex items-center gap-1">
            <FaStore className="text-[12px]" /> Vendeur actif
          </span>
        )}
      </div>

      <ul className="list-none !pb-5 bg-[#f1f1f1] myAccountTabs">
        <li className="w-full">
          <NavLink to="/mon-compte" activeClassName="isActive">
            <Button className="w-full !text-left !py-2 !px-5 !justify-start !capitalize !text-[rgba(0,0,0,0.8)] !rounded-none flex items-center gap-2">
              <FaRegUser className="text-[16px]" /> Mon profil
            </Button>
          </NavLink>
        </li>
        <li className="w-full">
          <NavLink to="/mes-addresses" activeClassName="isActive">
            <Button className="w-full !text-left !py-2 !px-5 !justify-start !capitalize !text-[rgba(0,0,0,0.8)] !rounded-none flex items-center gap-2">
              <MdPlace className="text-[17px]" /> Mes Adresses
            </Button>
          </NavLink>
        </li>
        <li className="w-full">
          <NavLink to="/mes-favoris" activeClassName="isActive">
            <Button className="w-full !text-left !py-2 !px-5 !justify-start !capitalize !text-[rgba(0,0,0,0.8)] !rounded-none flex items-center gap-2">
              <FaRegHeart className="text-[17px]" /> Mes favoris
            </Button>
          </NavLink>
        </li>
        <li className="w-full">
          <NavLink to="/mes-commandes" activeClassName="isActive">
            <Button className="w-full !text-left !py-2 !px-5 !justify-start !capitalize !text-[rgba(0,0,0,0.8)] !rounded-none flex items-center gap-2">
              <IoBagCheckOutline className="text-[17px]" /> Mes commandes
            </Button>
          </NavLink>
        </li>

        
        {context?.userData?.isSeller ? (
          <li className="w-full">
            <NavLink to="/espace-vendeur" activeClassName="isActive">
              <Button className="w-full !text-left !py-2 !px-5 !justify-start !capitalize !text-white !bg-primary !rounded-none flex items-center gap-2">
                <FaStore className="text-[16px]" /> Mon espace vendeur
              </Button>
            </NavLink>
          </li>
        ) : (
          <li className="w-full">
            <NavLink to="/devenir-vendeur" activeClassName="isActive">
              <Button className="w-full !text-left !py-2 !px-5 !justify-start !capitalize !text-[rgba(0,0,0,0.8)] !rounded-none flex items-center gap-2 border-t border-dashed border-gray-300">
                <FaStore className="text-[16px] text-primary" /> Devenir vendeur
              </Button>
            </NavLink>
          </li>
        )}

        <li className="w-full">
          <Button onClick={logout} className="w-full !text-left !py-2 !px-5 !justify-start !capitalize !text-[rgba(0,0,0,0.8)] !rounded-none flex items-center gap-2">
            <IoIosLogOut className="text-[18px]" /> Deconnexion
          </Button>
        </li>
      </ul>
    </div>
  );
}*/}
{/*import { IoIosLogOut } from "react-icons/io";
import { IoBagCheckOutline } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import { FaCloudUploadAlt } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { Button } from "@mui/material";
import { useContext, useEffect, useState} from "react";
import { MyContext } from "../../../router.jsx"
import { fetchDataFromApi, uploadImages } from "../../../utils/api.js";
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { MdPlace } from "react-icons/md";



export default function AccountSidebar(){
     const [previews,setPreviews]=useState([]);
     const [uploading,setUploading]=useState(false);
      const context =useContext(MyContext);
     const history=useNavigate();
     useEffect(()=>{
          const userAavatar=[];
          if (context?.userData?.avatar !=="" && context?.userData?.avatar !==undefined) {
               userAavatar.push(context?.userData?.avatar);
          setPreviews(userAavatar);
          }
     },[context?.userData])
     const selectedImages=[];
     const formdata=new FormData();
     const onChangeFile=async(e,apiEndPoint)=>{
          try {
               setPreviews([]);
               const files=e.target.files;
               setUploading(true);
               
               for (var i = 0; i < files.length; i++) {
                    if (files[i] && (files[i].type==="image/jpeg" || files[i].type==="image/jpg" || 
                         files[i].type==="image/png" || 
                         files[i].type==="image/webp") ) 
                         {

                         const file=files[i];
                         selectedImages.push(file),
                           formdata.append(`avatar`,file);
                    } else {
                       context.alertBox("error","Selectionnez un fichier jpeg,jpg,png ou webp");
                       setUploading(false);
                       return false;
                    }
                    
               }
               
          uploadImages("/api/user/chargement-image",formdata).then((res)=>{
               setUploading(false);
               let avatar=[];
               avatar.push(res?.data?.avatar);
               setPreviews(avatar);
               

                })
          } catch (error) {
               console.log(error);
          }
     }
     const logout=()=>{
                   fetchDataFromApi('/api/user/deconnexion?').then((res)=>{
                        if (res?.error!==true) {
                         context.setIsLogin(false);
                          history("/")
                       localStorage.removeItem("accesstoken");
                       localStorage.removeItem("refreshtoken");
                     }
                  })}


        
    return(
    <>
            <div className="card bg-white shadow-md rounded-md sticky top-[10px] p-5">
                    <div className=" w-full !p-3 flex items-center justify-center flex-col">
                        <div className="w-[110px] h-[110px] rounded-full overflow-hidden !mb-4 relative group
                        flex items-center justify-center bg-gray-200">
                         {uploading===true ?<CircularProgress color="inherit" /> :
                         <>
                         {
                              previews?.length !== 0 ?
                               previews?.map((img,index)=>{
                                   return(
                                         <img src={img}
                              key={index}
                             className="w-full h-full object-cover"/> 
                                   )
                              }) :
                               <img src={"/user.webp"} className="w-full h-full object-cover"/>
                          
                             }
                             </>}
                            
                              
                             <div className="overlay w-[100%] h-[100%] absolute top-0 left-0 z-50 !bg-[rgba(0,0,0,0.7)]
                             flex items-center justify-center cursor pointer opacity-0 transition-all
                             group-hover:opacity-100">
                                    <FaCloudUploadAlt className="text-[#fff] text-[25px]"/>
                                    <input
                                     type="file"
                                      className="absolute top-0 left-0 w-full h-full  opacity-0"
                                      accept="image/*"
                                      onChange={(e)=>onChangeFile(e,"/api/user/chargement-image")}
                                      name="avatar"
                                      />
                             </div>
                            
                        </div>
                         <h3>{context?.userData?.name}</h3>
                         <h6 className="text-[13px] font-[500]">{context?.userData?.email}</h6>
                    </div>
                    <ul className="list-none !pb-5 bg-[#f1f1f1] myAccountTabs">
                        <li className="w-full">
                            <NavLink
                                 to="/mon-compte" exact={true} activeClassName="isActive">
                            <Button className="w-full !text-left !py-2 !px-5 !justify-start 
                            !capitalize !text-[rgba(0,0,0,0.8)] !rounded-none
                            flex items-center gap-2">
                            <FaRegUser className="text-[16px]"/>Mon profil
                            </Button>
                            </NavLink>
                         </li>
                         <li className="w-full">
                            <NavLink
                                 to="/mes-addresses" exact={true} activeClassName="isActive">
                            <Button className="w-full !text-left !py-2 !px-5 !justify-start 
                            !capitalize !text-[rgba(0,0,0,0.8)] !rounded-none
                            flex items-center gap-2">
                            <MdPlace className="text-[17px]"/>Mes Adresses
                            </Button>
                            </NavLink>
                         </li>
                         <li className="w-full">
                             <NavLink
                                 to="/mes-favoris" exact={true} activeClassName="isActive">
                            <Button className="w-full !text-left !py-2 !px-5 !justify-start 
                            !capitalize !text-[rgba(0,0,0,0.8)] !rounded-none
                            flex items-center gap-2">
                            <FaRegHeart className="text-[17px]"/>Mes favoris
                            </Button>
                            </NavLink>
                         </li>
                         <li className="w-full">
                            <NavLink
                                 to="/mes-commandes" exact={true} activeClassName="isActive">
                            <Button className="w-full !text-left !py-2 !px-5 !justify-start 
                            !capitalize !text-[rgba(0,0,0,0.8)] !rounded-none
                            flex items-center gap-2">
                            <IoBagCheckOutline className="text-[17px]"/>Mes commandes
                            </Button>
                            </NavLink>
                         </li>
                         <li className="w-full">
                            
                            <Button onClick={logout} className="w-full !text-left !py-2 !px-5 !justify-start 
                            !capitalize !text-[rgba(0,0,0,0.8)] !rounded-none
                            flex items-center gap-2">
                            <IoIosLogOut className="text-[18px]"/>Deconnexion
                            </Button>
                         </li>

                    </ul>
                </div>
                </>
    )
} */}