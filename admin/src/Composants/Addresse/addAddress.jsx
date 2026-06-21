import { IoMdClose } from 'react-icons/io';
import Button from '@mui/material/Button';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { useContext, useEffect, useState} from "react";
import { NavLink } from "react-router-dom";
import { MyContext } from "../../App.jsx"
import { fetchDataFromApi, uploadImages } from "../../utils/api.js";
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import { editImages, postData } from "../../utils/api.js";

import { Collapse } from "react-collapse";
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { FaPlus } from "react-icons/fa6";

export default function AddAddress(){
    const [userId,setUserId]=useState("");
    const [phone, setPhone] = useState('');
    const [isLoading,setIsLoading]=useState(false);
    const [formField,setFormField]=useState({
                     addresse:"",
                     pays:"",
                     ville:"",
                     region:"",
                     quartier:"",
                     mobile:"",
                     userId:""
             });
    const [status,setStatus]=useState(false);
     const context=useContext(MyContext);
       const valideValue=Object.values(formField).every(el=>el)
    const handleChangeStatus=(event)=>{
       setStatus(event.target.value);
    } 
    useEffect(()=>{
                     const token=localStorage.getItem("accesstoken");
                     if (token===null) {
                         history("/connexion");
                     }
                 },[context?.isLogin])
    useEffect(()=>{
         setFormField((prev) => ({ ...prev, userId:context?.userData?._id }));
    },[context?.userData])
    const onChangeInput=(e)=>{
                     const{name,value}=e.target;
                     setFormField(()=>{
                         return{
                             ...formField,
                             [name]:value
                         }
                     })
                 }

     const handleSubmit=(e)=>{
                     e.preventDefault();
                     setIsLoading(true);
                     if (formField.addresse==="") {
                      context.alertBox("error","Veuillez fournir votre addresse"); 
                      setIsLoading(false);
                     return false
                    }
                     if (formField.pays==="") {
                      context.alertBox("error","Veuillez fournir votre pays"); 
                      setIsLoading(false);
                     return false
                    }
                     if (formField.ville==="") {
                      context.alertBox("error","Veuillez fournir votre ville"); 
                      setIsLoading(false);
                     return false
                    }
                     if (formField.region==="") {
                      context.alertBox("error","Veuillez fournir votre region"); 
                      setIsLoading(false);
                     return false
                    }
                    if (formField.quartier==="") {
                      context.alertBox("error","Veuillez fournir votre quartier"); 
                      setIsLoading(false);
                     return false
                    }
                    if (phone==="") {
                      context.alertBox("error","Veuillez fournir votre numero de telephone"); 
                      setIsLoading(false);
                     return false
                    }
                     
             
             
             
                    postData(`/api/address/ajout`,formField,{withCredentials:true}).then((res)=>{
                      if (res?.error!==true) {
                               setIsLoading(false);
                               context.alertBox("success",res?.message);
                                  context?.setIsOpenFullScreen({
                            open:false
                          })
                          fetchDataFromApi(`/api/address/retrait?userId=${context?.userData?._id}`).then((res)=>{
                                                     context?.setAddress(res.data)
                          }) 
                     } else {
                         context.alertBox("error",res?.message);
                          setIsLoading(false);
                     }
                    
                    })
             
                 }               
   
    return(
        
            <>
             <section className="!p-15 bg-gray-50">
               <form className="form !py-3 !p-8" onSubmit={handleSubmit}>
                <div className='scroll max-h-[72hv] overflow-y-scroll pr-4 pt-4'>
                   <div className="grid grid-cols-2 !mb-3 gap-4">
                 <div className="col ">
                    <h3 className="text-[14px] font-[500] !mb-1 text-black">Addrese,rue,n°de porte</h3>
                     <input type="text" className=" text-center bg-white w-full h-[40px] border border-[rgba(0,0,0,0.1)] 
             !p-2 !pl-8 focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm !p-3 text-sm"
                                name="addresse"
                                onChange={onChangeInput}
                                value={formField.addresse}
          />
                 </div>
                 <div className="col ">
                    <h3 className="text-[14px] font-[500] !mb-1 text-black">Pays</h3>
                     <input type="text" className="text-center bg-white w-full h-[40px] border border-[rgba(0,0,0,0.1)] 
             !p-2 !pl-8 focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm !p-3 text-sm"
               name="pays"
                                onChange={onChangeInput}
                                value={formField.pays}
          />
                 </div>
                 </div>
                 <div className="grid grid-cols-2 !mb-3  gap-4">
                  <div className="col ">
                    <h3 className="text-[14px] font-[500] !mb-1 text-black">Region</h3>
                     <input type="text" className="text-center bg-white w-full h-[40px] border border-[rgba(0,0,0,0.1)] 
             !p-2 !pl-8 focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm !p-3 text-sm"
              name="region"
                                onChange={onChangeInput}
                                value={formField.region}
          />
                 </div>
                 <div className="col ">
                    <h3 className="text-[14px] font-[500] !mb-1 text-black">Ville</h3>
                     <input type="text" className="text-center bg-white w-full h-[40px] border border-[rgba(0,0,0,0.1)] 
             !p-2 !pl-8 focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm !p-3 text-sm"
               name="ville"
                                onChange={onChangeInput}
                                value={formField.ville}
          />
                 </div>
                 </div>
                 <div className="grid grid-cols-2 !mb-3  gap-4">
                 <div className="col ">
                    <h3 className="text-[14px] font-[500] !mb-1 text-black">quartier</h3>
                     <input type="text" className="text-center bg-white w-full h-[40px] border border-[rgba(0,0,0,0.1)] 
             !p-2 !pl-8 focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm !p-3 text-sm"
              name="quartier"
                                onChange={onChangeInput}
                                value={formField.quartier}
          />
                 </div>
                 <div className="col ">
                    <h3 className="text-[14px] font-[500] !mb-1 text-black">N° de téléphone</h3>
                     <PhoneInput
                        defaultCountry="ml"
                          value={phone}
                           onChange={(phone) => {
                               setPhone(phone);
                                setFormField((prev) => ({ ...prev, mobile: phone })); // spread prev !
                                 }}
                                />
                      </div>
                </div>
                <br/>
                 </div>
                
                <br/>
                <div className="w-[350px] !mx-auto">
                <Button type="submit" className="btn-pink btn-lg w-full flex gap-2">
                   {
                isLoading===true ? <CircularProgress color="inherit" /> : <>
                <FaCloudUploadAlt className='text-[25px] text-white'/>Publier et voir </>
                                          }
                  
                </Button>
                </div>
               </form>
                </section>
            </>
        
    )
}