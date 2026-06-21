import Button from "@mui/material/Button";
import { IoMdAdd } from "react-icons/io";
import { useContext, useState } from "react";
import { MyContext } from "../../App";
import { FaAngleDown } from "react-icons/fa6";
import { FaAngleUp } from "react-icons/fa";
import EditBox from "./EditBox";

export default function SubCategory() {
    const [isOpen, setIsOpen] = useState(null);
    const context = useContext(MyContext);

    const expend = (id) => {  // ✅ id au lieu d'index
        setIsOpen(isOpen === id ? null : id);
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <h2 className="text-[18px] font-[600]">Liste des sous categories</h2>
                <div className="col w-[35%] !ml-auto flex items-center gap-3">
                    <Button className="btn-pink !text-[14px] btn-sm !text-white !capitalize"
                        onClick={() => context.setIsOpenFullScreen({ open: true, model: "Nouvelle sous categorie" })}>
                        <IoMdAdd /> Nouvelle sous categorie
                    </Button>
                </div>
            </div>

            <div className='card !my-4 !pt-5 pb-5 px-5 shadow-md sm:rounded-lg bg-white'>
                {context?.catData?.length !== 0 &&
                    <ul className="w-full">
                        {context?.catData?.map((premiersous, index) => {
                            return (
                                <li className="w-full mb-1" key={premiersous?._id}>  {/* ✅ key stable */}
                                    <div className="flex items-center w-full !p-2 bg-[#f1f1f1] rounded-sm !px-4">
                                        <span className="font-[500] flex items-center gap-4 text-[14px]">
                                            {premiersous?.name}
                                        </span>
                                        <Button
                                            className="!min-w-[35px] !w-[35px] !h-[35px] !rounded-full !text-black !ml-auto"
                                            onClick={() => expend(premiersous?._id)}>  {/* ✅ _id */}
                                            {isOpen === premiersous?._id ? <FaAngleUp /> : <FaAngleDown />}  {/* ✅ _id */}
                                        </Button>
                                    </div>

                                    {isOpen === premiersous?._id &&  /* ✅ _id */
                                        <>
                                            {premiersous?.children?.length !== 0 &&
                                                <ul className="w-full">
                                                    {premiersous?.children?.map((deuxiemesous) => {
                                                        return (
                                                            <li className="w-full py-1" key={deuxiemesous?._id}>  {/* ✅ key stable */}
                                                                <EditBox
                                                                    name={deuxiemesous?.name}
                                                                    id={deuxiemesous?._id}
                                                                    catData={context?.catData}
                                                                    selectedCat={deuxiemesous?.parentId}
                                                                    selectedCatName={deuxiemesous?.parentCatName}
                                                                />
                                                                {deuxiemesous?.children?.length !== 0 &&
                                                                    <ul className="pl-4">
                                                                        {deuxiemesous?.children?.map((troisiemesous) => {
                                                                            return (
                                                                                <li className="w-full hover:bg-[#f1f1f1]" key={troisiemesous?._id}>  {/* ✅ key stable */}
                                                                                    <EditBox
                                                                                        name={troisiemesous?.name}
                                                                                        id={troisiemesous?._id}
                                                                                        catData={premiersous?.children}  /* ✅ corrigé */
                                                                                        selectedCat={troisiemesous?.parentId}
                                                                                        selectedCatName={troisiemesous?.parentCatName}
                                                                                    />
                                                                                </li>
                                                                            )
                                                                        })}
                                                                    </ul>
                                                                }
                                                            </li>
                                                        )
                                                    })}
                                                </ul>
                                            }
                                        </>
                                    }
                                </li>
                            )
                        })}
                    </ul>
                }
            </div>
        </>
    )
}





{/*import Button from "@mui/material/Button";
import { IoMdAdd } from "react-icons/io";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";


import { MyContext } from "../../App";
import { FaAngleDown } from "react-icons/fa6";
import { FaAngleUp } from "react-icons/fa";
import  EditBox from "./EditBox"

export default function  SubCategory(){
     const [isOpen,setIsOpen]=useState(null);
     const context=useContext(MyContext);
     const expend = (index) => {
    if (isOpen === index) {
        setIsOpen(null); // ← null = rien d'ouvert
    } else {
        setIsOpen(index);
    }
}
  
    return(
        <>
               
                    <div className="flex items center justify-between ">
                        <h2 className="text-[18px] font-[600]">Liste des sous categories</h2>
                        <div className="col w-[35%] !ml-auto flex items-center gap-3">
                          <Button className="btn-pink !text-[14px] btn-sm !text-white !capitalize"
                          onClick={()=>context.setIsOpenFullScreen({open:true,model:"Nouvelle sous categorie"})}><IoMdAdd/>Nouvelle sous categorie</Button>
            
                       </div>
                    </div>

                   <div className='card !my-4 !pt-5 pb-5 px-5 shadow-md sm:rounded-lg bg-white'>
                     {context?.catData?.length!==0 && 
                     <ul className="w-full">
                      {context?.catData?.map((premiersous,index)=>{
                            return( 
                              <li className="w-full mb-1" key={index}>
                                <div className="flex items-center w-full !p-2 bg-[#f1f1f1] rounded-sm !px-4">
                                  <span className="font-[500] flex items-center gap-4 text-[14px]">
                                       {premiersous?.name}
                                  </span>
                                  <Button className="!min-w-[35px] !w-[35px] !h-[35px] !rounded-full !text-black !ml-auto"
                                  onClick={()=>expend(index)}>
                                    {
                                      isOpen===index ? <FaAngleUp/> :<FaAngleDown/>
                                    }
                                  </Button>
                                </div>
                                {
                                isOpen===index && 
                                <>
                                {premiersous?.children?.length !==0 &&
                                
                                <ul className="w-full">
                                  {premiersous?.children?.map((deuxiemesous,index_)=>{
                            return( 
                                  <li className="w-full py-1" key={index_}>
                                    <EditBox name={deuxiemesous?.name}
                                    id={deuxiemesous?._id}
                                    catData={context?.catData}
                                    index={index_}
                                    selectedCat={deuxiemesous?.parentId}
                                    selectedCatName={deuxiemesous?.parentCatName}
                                    />
                                {  deuxiemesous?.children?.length !==0 &&
                                
                                <ul className="pl-4">
                              {   deuxiemesous?.children?.map((trosiemesous,index_)=>{
                                return( 
                                  <li className="w-full bg-[#f1f1f1]" key={index_}>
                                    <EditBox name={trosiemesous?.name}
                                    id={trosiemesous?._id}
                                    catData={premiersous?.children}
                                    index={index_}
                                    selectedCat={trosiemesous?.parentId}
                                    selectedCatName={trosiemesous?.parentCatName}
                                    />
                                  </li>
                                )})
                              }
                                </ul>
                                  }
                                  </li>
                                  )})}
                                 </ul>
                                 }
                                </>}
                              </li>
                            )})
                         }
                     </ul>
                     }
                    </div>
                    
            

        
        </>
    )
}
   */}    