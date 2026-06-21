import { LuLayoutDashboard, LuUsersRound } from "react-icons/lu";
import { RiProductHuntLine } from "react-icons/ri";
import { FaAngleDown, FaRegImage, FaStore, FaWarehouse } from "react-icons/fa";
import { BiCategory } from "react-icons/bi";
import { IoBagCheckOutline } from "react-icons/io5";
import Button from "@mui/material/Button";
import { IoMdLogOut } from "react-icons/io";
import { Collapse } from "react-collapse";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { MyContext } from "../../App";
import { fetchDataFromApi } from "../../utils/api";

export default function Sidebar() {
  const [submenuIndex, setSubmenuIndex] = useState(null);
  const context = useContext(MyContext);

  const isOpenSubMenu = (index) => {
    setSubmenuIndex(submenuIndex === index ? null : index);
  };

  const logout = () => {
    fetchDataFromApi(`/api/user/deconnexion`).then((res) => {
      if (res?.error !== true) {
        context.setIsLogin(false);
        localStorage.removeItem("accesstoken");
        localStorage.removeItem("refreshtoken");
      }
    });
  };

  const navBtn = "w-full !capitalize !justify-start flex gap-3 !text-[14px] !text-[rgba(0,0,0,0.8)] !font-[600] items-center !py-2 hover:!bg-[#f1f1f1]";
  const subBtn = "!w-full !capitalize !justify-start !text-[rgba(0,0,0,0.8)] hover:!bg-[#f1f1f1] !text-[13px] !font-[500] !pl-9 flex gap-3";
  const dot = <span className="block !w-[5px] !h-[5px] !rounded-full !bg-[rgba(0,0,0,0.2)]" />;

  return (
    <aside className="sidebar">
      <div className="sidebar fixed top-0 left-0 bg-[#fff] !h-full !border-r !border-[rgba(0,0,0,0.1)] !py-2 !px-4">
        <div className="!py-2 w-full">
          <img
            src="https://imgs.search.brave.com/yidLNeAlOis93k7FwAsb5tKOR46fIEXxKLbeh8vtfq0/rs:fit:0:180:1:0/g:ce/aHR0cHM6Ly93d3cu/YWZyaWNhLW5ld3Ny/b29tLmNvbS9maWxl/cy9sYXJnZS83M2Rl/MmQ3MTcxZTAzYjYv/MjAwLzE1MA"
            className="w-[120px] object-cover" alt="logo"
          />
        </div>

        <ul className="!mt-4">
          {/* Tableau de bord */}
          <li>
            <Link to="/dashbord">
              <Button className={navBtn}>
                <LuLayoutDashboard className="!text-[18px]" /><span>Tableau de bord</span>
              </Button>
            </Link>
          </li>

          {/* Affiches Accueil */}
          <li>
            <Button className={navBtn} onClick={() => isOpenSubMenu(1)}>
              <FaRegImage className="!text-[18px]" /><span>Affiches Accueil</span>
              <span className="!ml-auto !w-[30px] !h-[30px] flex items-center justify-center">
                <FaAngleDown className={`transition-all ${submenuIndex === 1 ? "rotate-180" : ""}`} />
              </span>
            </Button>
            <Collapse isOpened={submenuIndex === 1}>
              <ul className="w-full">
                <li className="w-full">
                  <Link to="/bannieres">
                    <Button className={subBtn}>{dot} Liste des affiches</Button>
                  </Link>
                </li>
                <li className="w-full">
                  <Button className={subBtn}
                    onClick={() => context.setIsOpenFullScreen({ open: true, model: "Ajouter une Affiche" })}>
                    {dot} Ajouter une affiche
                  </Button>
                </li>
              </ul>
            </Collapse>
          </li>

          {/* Utilisateurs */}
          <li>
            <Link to="/liste-utilisateurs">
              <Button className={navBtn}>
                <LuUsersRound className="!text-[18px]" /><span>Utilisateurs</span>
              </Button>
            </Link>
          </li>

          {/* Vendeurs */}
          <li>
            <Link to="/vendeurs">
              <Button className={navBtn}>
                <FaStore className="!text-[18px]" /><span>Vendeurs</span>
              </Button>
            </Link>
          </li>

          {/* Produits */}
          <li>
            <Button className={navBtn} onClick={() => isOpenSubMenu(2)}>
              <RiProductHuntLine className="!text-[18px]" /><span>Produits</span>
              <span className="!ml-auto !w-[30px] !h-[30px] flex items-center justify-center">
                <FaAngleDown className={`transition-all ${submenuIndex === 2 ? "rotate-180" : ""}`} />
              </span>
            </Button>
            <Collapse isOpened={submenuIndex === 2}>
              <ul className="w-full">
                <li className="w-full">
                  <Link to="/produits">
                    <Button className={subBtn}>{dot} Liste des produits</Button>
                  </Link>
                </li>
                <li className="w-full">
                  <Button className={subBtn}
                    onClick={() => context.setIsOpenFullScreen({ open: true, model: "Ajouter un produit" })}>
                    {dot} Ajouter un produit
                  </Button>
                </li>
              </ul>
            </Collapse>
          </li>

          {/* Catégories */}
          <li>
            <Button className={navBtn} onClick={() => isOpenSubMenu(3)}>
              <BiCategory className="!text-[18px]" /><span>Categories</span>
              <span className="!ml-auto !w-[30px] !h-[30px] flex items-center justify-center">
                <FaAngleDown className={`transition-all ${submenuIndex === 3 ? "rotate-180" : ""}`} />
              </span>
            </Button>
            <Collapse isOpened={submenuIndex === 3}>
              <ul className="w-full">
                <li className="w-full">
                  <Link to="/list-categorie">
                    <Button className={subBtn}>{dot} Liste des catégories</Button>
                  </Link>
                </li>
                <li className="w-full">
                  <Button className={subBtn}
                    onClick={() => context.setIsOpenFullScreen({ open: true, model: "Nouvelle categorie" })}>
                    {dot} Ajouter une catégorie
                  </Button>
                </li>
                <li className="w-full">
                  <Link to="/list-sous-categorie">
                    <Button className={subBtn}>{dot} Liste des sous catégories</Button>
                  </Link>
                </li>
                <li className="w-full">
                  <Button className={subBtn}
                    onClick={() => context.setIsOpenFullScreen({ open: true, model: "Nouvelle sous categorie" })}>
                    {dot} Ajouter une sous catégorie
                  </Button>
                </li>
              </ul>
            </Collapse>
          </li>

          {/* Commandes */}
          <li>
            <Link to="/liste-commandes">
              <Button className={navBtn}>
                <IoBagCheckOutline className="!text-[18px]" /><span>Commandes</span>
              </Button>
            </Link>
          </li>

          {/* ✅ Hubs Suguba */}
          <li>
            <Link to="/hubs">
              <Button className={navBtn}>
                <FaWarehouse className="!text-[18px]" /><span>Hubs Suguba</span>
              </Button>
            </Link>
          </li>
          <li>
            <Link to="/support">
              <Button className={navBtn}>
                <FaWarehouse className="!text-[18px]" /><span>Retours client</span>
              </Button>
            </Link>
          </li>

          {/* Déconnexion */}
          <li>
            <Button className={navBtn} onClick={logout}>
              <IoMdLogOut className="!text-[18px]" /><span>Déconnexion</span>
            </Button>
          </li>
        </ul>
      </div>
    </aside>
  );
}






{/*import { LuLayoutDashboard } from "react-icons/lu";
import { LuUsersRound } from "react-icons/lu";
import { RiProductHuntLine } from "react-icons/ri";
import { FaAngleDown, FaRegImage } from "react-icons/fa";
import { BiCategory } from "react-icons/bi";
import { IoBagCheckOutline } from "react-icons/io5";
import Button from "@mui/material/Button";
import { IoMdLogOut } from "react-icons/io";
import {Collapse} from "react-collapse";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { MyContext } from "../../App";
import { fetchDataFromApi } from "../../utils/api";
import { FaStore } from "react-icons/fa";

export default function Sidebar(){
    const [submenuIndex, setSubmenuIndex]=useState(null);
const context=useContext(MyContext);
    const isOpenSubMenu=(index)=>{
        if (submenuIndex===index) {
            setSubmenuIndex(null);
        } else {
            setSubmenuIndex(index);
        }

    }
    const logout = () => {
    
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
     <aside className="sidebar">
       <div className={`sidebar fixed top-0 left-0 bg-[#fff] !h-full !border-r 
   !border-[rgba(0,0,0,0.1)] !py-2 !px-4`}>
        <div className="!py-2 w-full">
            <img src="https://imgs.search.brave.com/yidLNeAlOis93k7FwAsb5tKOR46fIEXxKLbeh8vtfq0/rs:fit:0:180:1:0/g:ce/aHR0cHM6Ly93d3cu/YWZyaWNhLW5ld3Ny/b29tLmNvbS9maWxl/cy9sYXJnZS83M2Rl/MmQ3MTcxZTAzYjYv/MjAwLzE1MA"
        
              className="w-[120px]  object-cover"/>
        </div>
        <ul className="!mt-4">
         <li>
            <Link to="/dashbord">
            <Button className="w-full !capitalize !justify-start flex gap-3 !text-[14px] !text-[rgba(0,0,0,0.8)]
            !font-[600] items-center !py-2 hover:!bg-[#f1f1f1]">
                 <LuLayoutDashboard  className="!text-[18px]"/><span>Tableau de bord</span>
             </Button>
             </Link>
         </li>
         <li>
            <Button className="w-full !capitalize !justify-start flex gap-3 !text-[14px] !text-[rgba(0,0,0,0.8)]
             !font-[600] items-center !py-2 hover:!bg-[#f1f1f1]"
               onClick={()=>isOpenSubMenu(1)}>
                 <FaRegImage  className="!text-[18px]"/><span>Affiches Acceuil</span>
                 <span className="!ml-auto !w-[30px] !h-[30px] flex items-center justify-center "
                 >
                    <FaAngleDown className={`transition-all ${submenuIndex===1 ? "rotate-180":""}`}/>
                 </span>
             </Button>
             <Collapse isOpened={submenuIndex===1 ? true : false}>
             <ul className="w-full">
                <li className="w-full">
                    <Link to="/bannieres">
                    <Button className="!w-full !capitalize !justify-start !text-[rgba(0,0,0,0.8)]
               hover:!bg-[#f1f1f1] !text-[13px] !font-[500] !pl-9 flex gap-3"> 
               <span className="block !w-[5px] !h-[5px] !rounded-full 
               !bg-[rgba(0,0,0,0.2)]"></span>{" "}Liste des affiches</Button>
               </Link>
                </li>
                <li className="w-full">
                    <Button className="!w-full !capitalize !justify-start !text-[rgba(0,0,0,0.8)]
               hover:!bg-[#f1f1f1] !text-[13px] !font-[500] !pl-9 flex gap-3"
                 onClick={()=>context.setIsOpenFullScreen({open:true,model:"Ajouter une Affiche"})}> 
               <span className="block !w-[5px] !h-[5px] !rounded-full 
               !bg-[rgba(0,0,0,0.2)]"></span>{" "}Ajouter une affiche</Button>
                </li>
             </ul>
             </Collapse>
         </li>
          <li>
            <Link to="/liste-utilisateurs">
            <Button className="w-full !capitalize !justify-start flex gap-3 !text-[14px] !text-[rgba(0,0,0,0.8)]
             !font-[600] items-center !py-2 hover:!bg-[#f1f1f1]">
                 <LuUsersRound  className="!text-[18px]"/><span>Utilisateurs</span>
             </Button>
             </Link>
         </li>
         <li>
  <Link to="/vendeurs">
    <Button className="w-full !capitalize !justify-start flex gap-3 !text-[14px] !text-[rgba(0,0,0,0.8)] !font-[600] items-center !py-2 hover:!bg-[#f1f1f1]">
      <FaStore className="!text-[18px]" /><span>Vendeurs</span>
    </Button>
  </Link>
</li>
            <li>
                 <Button className="w-full !capitalize !justify-start flex gap-3 !text-[14px] !text-[rgba(0,0,0,0.8)]
             !font-[600] items-center !py-2 hover:!bg-[#f1f1f1]"
               onClick={()=>isOpenSubMenu(2)}>
                 <RiProductHuntLine  className="!text-[18px]"/><span>Produits</span>
                 <span className="!ml-auto !w-[30px] !h-[30px] flex items-center justify-center "
                 >
                    <FaAngleDown className={`transition-all ${submenuIndex===2 ? "rotate-180":""}`}/>
                 </span>
             </Button>
             <Collapse isOpened={submenuIndex===2 ? true : false}>
             <ul className="w-full">
                <li className="w-full">
                    <Link to="/produits">
                    <Button className="!w-full !capitalize !justify-start !text-[rgba(0,0,0,0.8)]
               hover:!bg-[#f1f1f1] !text-[13px] !font-[500] !pl-9 flex gap-3"> 
               <span className="block !w-[5px] !h-[5px] !rounded-full 
               !bg-[rgba(0,0,0,0.2)]"></span>{" "}Liste des produits</Button>
               </Link>
                </li>
                <li className="w-full">
                    <Button className="!w-full !capitalize !justify-start !text-[rgba(0,0,0,0.8)]
               hover:!bg-[#f1f1f1] !text-[13px] !font-[500] !pl-9 flex gap-3" 
                onClick={()=>context.setIsOpenFullScreen({open:true,model:"Ajouter un produit"})}> 
               <span className="block !w-[5px] !h-[5px] !rounded-full 
               !bg-[rgba(0,0,0,0.2)]"></span>{" "}Ajouter un produit</Button>
                </li>
             </ul>
             </Collapse>
        </li>
         <li>
            <Button className="w-full !capitalize !justify-start flex gap-3 !text-[14px] !text-[rgba(0,0,0,0.8)]
             !font-[600] items-center !py-2 hover:!bg-[#f1f1f1]"
               onClick={()=>isOpenSubMenu(3)}>
                 <BiCategory  className="!text-[18px]"/><span>Categories</span>
                 <span className="!ml-auto !w-[30px]! h-[30px] flex items-center justify-center "
                 >
                    <FaAngleDown className={`transition-all ${submenuIndex===3 ? "rotate-180":""}`}/>
                 </span>
             </Button>
             <Collapse isOpened={submenuIndex===3 ? true : false}>
             <ul className="w-full">
                <li className="w-full">
                    <Link to="/list-categorie">
                    <Button className="!w-full !capitalize !justify-start !text-[rgba(0,0,0,0.8)]
               hover:!bg-[#f1f1f1] !text-[13px] !font-[500] !pl-9 flex gap-3"> 
               <span className="block !w-[5px] !h-[5px] !rounded-full 
               !bg-[rgba(0,0,0,0.2)]"></span>{" "}Liste des categories</Button>
               </Link>
                </li>
                <li className="w-full">
                    
                    <Button className="!w-full !capitalize !justify-start !text-[rgba(0,0,0,0.8)]
               hover:!bg-[#f1f1f1] !text-[13px] !font-[500] !pl-9 flex gap-3"
                onClick={()=>context.setIsOpenFullScreen({open:true,model:"Nouvelle categorie"})}> 
               <span className="block !w-[5px] !h-[5px] !rounded-full 
               !bg-[rgba(0,0,0,0.2)]"></span>{" "}Ajouter une categorie</Button>
                </li>
                <li className="w-full">
                    <Link to="/list-sous-categorie">
                    <Button className="!w-full !capitalize !justify-start !text-[rgba(0,0,0,0.8)]
               hover:!bg-[#f1f1f1] !text-[13px] !font-[500] !pl-9 flex gap-3"> 
               <span className="block !w-[5px] !h-[5px] !rounded-full 
              !bg-[rgba(0,0,0,0.2)]"></span>{" "}Liste des sous categories</Button>
              </Link>
                </li>
                 <li className="w-full">
                    <Button className="!w-full !capitalize !justify-start !text-[rgba(0,0,0,0.8)]
               hover:!bg-[#f1f1f1] !text-[13px] !font-[500] !pl-9 flex gap-3"
                onClick={()=>context.setIsOpenFullScreen({open:true,model:"Nouvelle sous categorie"})}> 
               <span className="block !w-[5px] !h-[5px] !rounded-full 
               !bg-[rgba(0,0,0,0.2)]"></span>{" "}Ajouter une sous categorie</Button>
                </li>
             </ul>
             </Collapse>
         </li>
         <li>
            <Link to="/liste-commandes">
            <Button className="w-full !capitalize !justify-start flex gap-3 !text-[14px] !text-[rgba(0,0,0,0.8)]
             !font-[600] items-center !py-2 hover:!bg-[#f1f1f1]">
                 <IoBagCheckOutline  className="!text-[18px]"/><span>Commandes</span>
             </Button>
             </Link>
         </li>
          <li>
            <Button className="w-full !capitalize !justify-start flex gap-3 !text-[14px] !text-[rgba(0,0,0,0.8)]
             !font-[600] items-center !py-2 hover:!bg-[#f1f1f1]"  onClick={logout} >
                 <IoMdLogOut  className="!text-[18px]"/><span>Deconnexion</span>
             </Button>
         </li>
         
        </ul>
    </div>
    
    </aside>
    </>)
}*/}