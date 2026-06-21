import { Link } from 'react-router-dom';
import './index.css';
import { Button } from "@mui/material";
import { RiMenu2Line } from "react-icons/ri";
import { FaAngleDown, FaAngleRight } from "react-icons/fa6";
import { MdOutlineRocketLaunch } from "react-icons/md";
import Panel from './panel';
import { useState, useContext } from 'react';
import { MyContext } from '../../router';

export default function Categorie() {
  const [isOpen, setIsOpen] = useState(false);
  const context = useContext(MyContext);

  const parentCats = context.catData || [];

  return (
    <>
      <nav className='w-full'>
        <div className="flex items-center gap-4">

          {/* LEFT */}
          <div className="w-[20%]">
            <Button
              className='!font-[600] text-[12px] flex items-center gap-1 !capitalize'
              onClick={() => setIsOpen(true)}
            >
              <RiMenu2Line className='!text-[14px]' />
              Tous les categories
              <FaAngleDown className='!text-[12px]' />
            </Button>
          </div>

          {/* CENTER */}
          <div className="w-[65%]">
            <ul className="nav flex items-center gap-2">
                <li>
                        <Link to="/" className='hover:text-primary transition-all'>
                        <Button className=" !text-[12px] !font-[600] !text-[rgba(36, 21, 21, 0.8)] ">Acceuil</Button>
                        </Link>
                   </li>
              {parentCats.slice(0, 7).map((cat) => {
                const subCats = cat.children || [];

                return (
                  <li key={cat._id} className="relative">

                    <Link
                      to={`/listeProduits?category=${cat._id}&name=${cat.name}`}
                      className="link"
                    >
                      <Button className="!font-[600] hover:!text-primary !text-[13px] !text-[rgba(0,0,0,0.85)] !capitalize !px-3 !py-2">
                        {cat.name}
                      </Button>
                    </Link>

                    {/* SUB MENU */}
                    {subCats.length > 0 && (
                      <div className="submenu rounded-md">

                        <ul className="py-2">

                          {subCats.map((subCat) => {
                            const subSubCats = subCat.children || [];

                            return (
                              <li key={subCat._id} className="relative">

                                <Link
                                  to={`/listeProduits?category=${subCat._id}&name=${subCat.name}`}
                                >
                                  <Button className="!font-[500] !text-[13px] w-full !justify-start !px-4 !py-2 !capitalize !text-[rgba(0,0,0,0.85)]">
                                    {subCat.name}
                                    {subSubCats.length > 0 && (
                                      <FaAngleRight className="ml-auto text-[12px]" />
                                    )}
                                  </Button>
                                </Link>

                                {/* SUB SUB MENU */}
                                {subSubCats.length > 0 && (
                                  <div className="submenu rounded-md">

                                    <ul className="py-2">

                                      {subSubCats.map((subSubCat) => (
                                        <li key={subSubCat._id}>
                                          <Link
                                            to={`/listeProduits?category=${subSubCat._id}&name=${subSubCat.name}`}
                                          >
                                            <Button className="!font-[500] !text-[13px] w-full !justify-start !px-4 !py-2 !capitalize !text-[rgba(0,0,0,0.85)]">
                                              {subSubCat.name}
                                            </Button>
                                          </Link>
                                        </li>
                                      ))}

                                    </ul>
                                  </div>
                                )}

                              </li>
                            );
                          })}

                        </ul>

                      </div>
                    )}

                  </li>
                );
              })}

            </ul>
          </div>

          {/* RIGHT */}
          <div className="w-[15%] flex items-center gap-2 py-1 !px-2 !font-[600] text-[13px]">
            <MdOutlineRocketLaunch className='text-[18px]' />
            Livraison Rapide
          </div>

        </div>
      </nav>

      <Panel setIsOpen={setIsOpen} isOpen={isOpen} />
    </>
  );
}



{/*import { Link } from 'react-router-dom';
import './index.css';
import { Button } from "@mui/material";
import { RiMenu2Line } from "react-icons/ri";
import { FaAngleDown, FaAngleRight } from "react-icons/fa6";
import { MdOutlineRocketLaunch } from "react-icons/md";
import Panel from './panel';
import { useState, useContext } from 'react';
import { MyContext } from '../../router';

export default function Categorie() {
  const [isOpen, setIsOpen] = useState(false);
  const context = useContext(MyContext);

  
  const parentCats = context.catData || [];

  return (
    <>
      <nav className='w-full'>
        <div className="flex items-center gap-4">

         
          <div className="w-[20%]">
            <Button
              className='!font-[600] !text-[12px] flex items-center gap-1'
              onClick={() => setIsOpen(true)}
            >
              <RiMenu2Line className='!text-[12px]' />
              Tous les categories
              <FaAngleDown className='!text-[12px]' />
            </Button>
          </div>

          
          <div className="w-[65%]">
            <ul className="nav flex items-center">

              {parentCats.slice(0, 7).map((cat) => {
                const subCats = cat.children || [];

                return (
                  <li key={cat._id}>

                    <Link to={`/listeProduits?category=${cat._id}&name=${cat.name}`} className="link">
                      <Button>
                        {cat.name}
                      </Button>
                    </Link>

                   
                    {subCats.length > 0 && (
                      <div className="submenu">
                        <ul>

                          {subCats.map((subCat) => {
                            const subSubCats = subCat.children || [];

                            return (
                              <li key={subCat._id}>

                                <Link to={`/listeProduits?category=${subCat._id}&name=${subCat.name}`}>
                                  <Button className="w-full !justify-start !px-3">
                                    {subCat.name}
                                    {subSubCats.length > 0 && <FaAngleRight className="ml-auto" />}
                                  </Button>
                                </Link>

                                
                                {subSubCats.length > 0 && (
                                  <div className="submenu">
                                    <ul>
                                      {subSubCats.map((subSubCat) => (
                                        <li key={subSubCat._id}>
                                          <Link to={`/listeProduits?category=${subSubCat._id}&name=${subSubCat.name}`}>
                                            <Button className="w-full !justify-start !px-3">
                                              {subSubCat.name}
                                            </Button>
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                              </li>
                            );
                          })}

                        </ul>
                      </div>
                    )}

                  </li>
                );
              })}

            </ul>
          </div>

         
          <div className="w-[15%] flex items-center gap-2 py-1 !px-2 !font-[600]">
            <MdOutlineRocketLaunch className='text-[20px]' />
            Livraison Rapide
          </div>

        </div>
      </nav>

      <Panel setIsOpen={setIsOpen} isOpen={isOpen} />
    </>
  );
}*/}




{/*import { Link, useNavigate } from 'react-router-dom'
import './index.css'
import { Button } from "@mui/material"
import { RiMenu2Line } from "react-icons/ri";
import { FaAngleDown, FaAngleRight } from "react-icons/fa6";
import { MdOutlineRocketLaunch } from "react-icons/md";
import Panel from './panel'
import { useState, useContext } from 'react';
import { MyContext } from '../../router';

export default function Categorie() {
  const [isOpen, setIsOpen] = useState(false);
  const context = useContext(MyContext);

  const parentCats = context.catData?.filter(cat => !cat.parentId) || [];

  const getSubCats = (parentId) => {
    return context.catData?.filter(cat =>
      cat.parentId?.toString() === parentId.toString()
    ) || [];
  };

  const getSubSubCats = (parentId) => {
    return context.catData?.filter(cat =>
      cat.parentId?.toString() === parentId.toString()
    ) || [];
  };

  return (
    <>
      <nav className='w-full'>
        <div className="flex items-center gap-4">
          <div className="w-[20%]">
            <Button className='!font-[600] !text-[12px] flex items-center gap-1'
              onClick={() => setIsOpen(true)}>
              <RiMenu2Line className='!text-[12px]'/>
              Tous les categories
              <FaAngleDown className='!text-[12px]'/>
            </Button>
          </div>
          <div className="w-[65%]">
            <ul className="nav flex items-center">
              {parentCats.slice(0, 7).map((cat) => {
                const subCats = getSubCats(cat._id);
                return (
                  <li key={cat._id} className="relative">
                    <Link to={`/listeProduits?category=${cat._id}&name=${cat.name}`} className="link transition-all">
                      <Button className="!font-[600] !text-[12px] !text-[rgba(0,0,0,0.8)] !capitalize">
                        {cat.name}
                      </Button>
                    </Link>

                    {subCats.length > 0 && (
                      <div className="submenu absolute top-[120%] left-[0%] min-w-[150px] bg-white shadow-md opacity-0 transition-all z-50">
                        <ul>
                          {subCats.map((subCat) => {
                            const subSubCats = getSubSubCats(subCat._id);
                            return (
                              <li key={subCat._id} className="w-full relative">
                                <Link to={`/listeProduits?category=${subCat._id}&name=${subCat.name}`}>
                                  <Button className="link !font-[600] !text-[rgba(0,0,0,0.8)] !py-4 w-full !justify-start !px-3 !capitalize">
                                    {subCat.name}
                                    {subSubCats.length > 0 && <FaAngleRight className="ml-auto"/>}
                                  </Button>
                                </Link>

                                {subSubCats.length > 0 && (
                                  <div className="submenu absolute left-[100%] top-0 min-w-[150px] bg-white shadow-md">
                                    <ul>
                                      {subSubCats.map((subSubCat) => (
                                        <li key={subSubCat._id}>
                                          <Link to={`/listeProduits?category=${subSubCat._id}&name=${subSubCat.name}`}>
                                            <Button className="w-full !justify-start !px-3 !capitalize">
                                              {subSubCat.name}
                                            </Button>
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="w-[15%] flex items-center gap-2 py-1 !px-2 !font-[600]">
            <MdOutlineRocketLaunch className='text-[20px]'/> Livraison Rapide
          </div>
        </div>
      </nav>
      <Panel setIsOpen={setIsOpen} isOpen={isOpen}/>
    </>
  );
}


import { Link } from 'react-router-dom'
import './index.css'
import {Button, Drawer } from "@mui/material"
import { RiMenu2Line } from "react-icons/ri";
import { FaAngleDown } from "react-icons/fa6";
import { MdOutlineRocketLaunch } from "react-icons/md";
import Panel from './panel'
import { useState } from 'react';
export default function Categorie()
{
   const [isOpen,setIsOpen]=useState(false);
    const open=()=>{
        setIsOpen(true)
    }
   

    return(
        <>
    <nav  className='w-full'>
        <div className=" flex  items-center gap-4">
            <div className="w-[20%]">
                <Button className='!font-[600] !text-[12px] flex items-center gap-1' onClick={open}><RiMenu2Line className='!text-[12px]'/>Tous les categories<FaAngleDown className='!text-[12px]' /></Button>
            </div>
            <div className=" w-[65%]">
                <ul className="nav flex items-center">
                    <li>
                        <Link to="/" className='link transition-all'>
                        <Button className=" !text-[12px] !font-[600] !text-[rgba(0,0,0,0.8)] ">Acceuil</Button>
                        </Link>
                   </li>    
                    <li className=" relative">
                        <Link to="/" className="link transition-all">
                        <Button className="!font-[600] !text-[12px] !text-[rgba(0,0,0,0.8)]">Habits</Button>
                        </Link>
                       <div className="submenu absolute top-[120%] left-[0%] min-w-[150px]  bg-white shadow-md opacity-0 transition-all">
                          <ul>
                             <li className="w-full relative" >
                                <Link to="/" className=" text-[14px] ">
                                  <Button className="link !font-[600] !text-[rgba(0,0,0,0.8)]
                                  !py-4">Chaussures</Button>
                                 <div className=" submenu absolute min-w-[150px] bg-white">
                                   <ul>
                                       <li><Button className="w-full ">Robe</Button></li>
                                       <li><Button className="w-full ">Jupe</Button></li>
                                       <li><Button className="w-full ">Jean</Button></li>
                                       <li><Button className="w-full ">Chaussure</Button></li>
                                   </ul>
                                 </div>
                                </Link>
                             </li>
                             <li><Button className="w-full ">Femme</Button></li>
                              <li><Button className="w-full ">Adolescent</Button></li>
                              <li><Button className="w-full ">Enfant</Button></li>
                           </ul>
                       </div>
                    
                    </li>
                    <li>
                        <Link to="/" className="link ">
                        <Button className="!font-[600] !text-[12px] !text-[rgba(0,0,0,0.8)]
                         ">Chaussures</Button>
                        </Link>
                    </li>
                    <li>
                         <Link to="/" className="link">
                        <Button className="!font-[600]  !text-[12px] !text-[rgba(0,0,0,0.8)]
                          ">Sacs</Button>
                        </Link>
                    </li>
                    <li>
                         <Link to="/" className="link">
                        <Button className="!font-[600]  !text-[12px] !text-[rgba(0,0,0,0.8)]
                         ">Cosmetiques</Button>
                        </Link>
                    </li>
                    <li>
                         <Link to="/" className="link">
                        <Button className="!font-[600]  !text-[12px] !text-[rgba(0,0,0,0.8)]
                          ">Accessoires</Button>
                        </Link>
                    </li>
                    <li>
                         <Link to="/" className="link">
                        <Button className="!font-[600]  !text-[12px] !text-[rgba(0,0,0,0.8)]
                         ">Electroniques</Button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/" className="link">
                        <Button className="!font-[600]  !text-[12px] !text-[rgba(0,0,0,0.8)]
                         ">Aliments</Button>
                        </Link>
                    </li>
                        
                    <li>
                        <Link to="/" className="link ">
                        <Button className=" !font-[600] !text-[12px] !text-[rgba(0,0,0,0.8)]
                        ">Textiles</Button>
                        </Link>
                    </li>
                </ul>
            </div>
             <div className="w-[15%] flex items-center gap-2 py-1 !px-2 !font-[600]"><MdOutlineRocketLaunch className='text-[20px]'/> Livraison Rapide</div>
        </div>
       
        </nav>
        <Panel setIsOpen={setIsOpen} isOpen={isOpen}/>
        </>
    )
}*/}