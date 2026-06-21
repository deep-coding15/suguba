import { FaPlus } from "react-icons/fa6";
import AccountSidebar from "../AccountSidebar/index";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../../router";
import Radio  from "@mui/material/Radio";
import Dialog from '@mui/material/Dialog';
import  DialogTitle  from "@mui/material/DialogTitle";
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { Button } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import { deleteData1, fetchDataFromApi, postData } from "../../../utils/api";
import { FaRegTrashAlt } from "react-icons/fa";
const label = { slotProps: { input: { 'aria-label': 'Radio demo' } } };
export default function Address(){

     const [phone,setPhone] = useState('');
      const [formField,setFormField]=useState({
                         addresse:"",
                         pays:"",
                         ville:"",
                         region:"",
                         quartier:"",
                         mobile:"",
                         userId:""
                 });
      const [address,setAddress]=useState([]);
      const [isLoading,setIsLoading]=useState(false);
      const [selectedValue,setSelectedValue]=useState("Addresse 1");
      const handleChange=(event)=>{
                 setSelectedValue(event.target.value);
      }
    const context=useContext(MyContext);
    const [isOpenModel,setIsOpenModel]=useState(false);
    useEffect(()=>{
        if (context?.userData?._id !== undefined) {
         setFormField((prev) => ({ ...prev, userId:context?.userData?._id }));   
        }
    },[context?.userData])
     useEffect(()=>{
        if (context?.userData?._id !== "" && context?.userData?._id !== undefined) {
        fetchDataFromApi(`/api/address/retrait?userId=${context?.userData?._id}`).then((res)=>{
            setAddress(res.data)  })
                     } },[context?.userData])
    const handleClose=()=>{
        setIsOpenModel(false);
    }
    const removeAddress=(id)=>{
        deleteData1(`/api/address/${id}`).then((res)=>{
             fetchDataFromApi(`/api/address/retrait?userId=${context?.userData?._id}`).then((res)=>{
            setAddress(res.data)  })
        })
    }
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
                                setIsOpenModel(false);
                              fetchDataFromApi(`/api/address/retrait?userId=${context?.userData?._id}`).then((res)=>{
                                  setAddress(res.data)
                                })
                         } else {
                             context.alertBox("error",res?.message);
                              setIsLoading(false);
                         }
                        
                        })
                 
                     } 
    return(
        <>
         <section className="!py-10 w-full">
        <div className="w-[95%] !mx-auto flex gap-5">
            <div className="col1 w-[20%]">
                <AccountSidebar/>
            </div>
            <div className="col2 w-[50%] ">
                <div className="card bg-white shadow-md rounded-md !p-5 !mb-5">
                    <div className="flex items-center pb-3">
                        <h2 className="pb-0">Addresses</h2>
                    </div>
                   <div className="flex items-center justify-center !p-5 rounded-md border border-dashed border-[rgba(0,0,0,0.2)]
         bg-[#f1faff] hover:bg-[#e7f3f9] cursor-pointer !mt-5"
         onClick={()=>setIsOpenModel(true)}
          >
            <span className=" flex items-center gap-3 text-[14px] font-[500]"><FaPlus className="text-[14px] font-[600]"/>  Ajouter une addresse</span>
                    </div>
                   <div  className="flex flex-col !mt-4 gap-2">
                    {            
                        address?.length > 0 && address?.map((address,index)=>{
                            return(
                                <>
                                <div className=" group relative border border-dashed border-[rgba(0,0,0,0.2)] addressBox w-full flex
                                items-center justify-center !p-3 rounded-md bg-[#f1f1f1] cursor-pointer">
                                    <label className="!mr-auto">
                                   <Radio {...label} name="address" checked={
                                    selectedValue===(address?._id )} value={address?._id}
                                    onChange={handleChange}/>
                                    </label>
                                    <span className="text-[12px]">
                                        {
                                                address?.addresse +" "+
                                                   address?.pays +" "+
                                                   address?.ville+" "+
                                               address?.region+" "+
                                                address?.quartier
                                        }
                                    </span>
                                    <span  onClick={()=>removeAddress(address?._id)}  className="hidden group-hover:flex items-center
                                     justify-center w-[30px] h-[30px] 
                                     rounded-full bg-gray-500 text-white !ml-auto z-50">
                                        <FaRegTrashAlt/>
                                     </span>
                                </div>
                                </>
                            )
                        })
                    }
                   </div>
                    </div>
                    
                </div>
                
        </div>
        

    </section>
    <Dialog open={isOpenModel}>
        <DialogTitle> Ajout d'addresse</DialogTitle>
          <form className="!p-5 py-3" onSubmit={handleSubmit}>
                <div className=' flex items-center gap-5 pb-5'>
                
                 <div className="col w-[100%]">
                    <h3 className="text-[14px] font-[500] !mb-1 text-black">Addrese,rue,n°de porte</h3>
                     <input type="text" className=" text-center bg-white w-full h-[40px] border border-[rgba(0,0,0,0.1)] 
             !p-2 !pl-8 focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm !p-3 text-sm"
                                name="addresse"
                                onChange={onChangeInput}
                                value={formField.addresse}
          />
            </div>
                 </div>
                 <div className=' flex items-center gap-5 pb-5'>
                 <div className="col w-[50%]">
                    <h3 className="text-[14px] font-[500] !mb-1 text-black">Pays</h3>
                     <input type="text" className="text-center bg-white w-full h-[40px] border border-[rgba(0,0,0,0.1)] 
             !p-2 !pl-8 focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm !p-3 text-sm"
               name="pays"
                                onChange={onChangeInput}
                                value={formField.pays}
          />
                 </div>
                  <div className="col w-[50%]">
                    <h3 className="text-[14px] font-[500] !mb-1 text-black">Region</h3>
                     <input type="text" className="text-center bg-white w-full h-[40px] border border-[rgba(0,0,0,0.1)] 
             !p-2 !pl-8 focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm !p-3 text-sm"
              name="region"
                                onChange={onChangeInput}
                                value={formField.region}
          />
                 </div>
                 </div>
                 <div className=' flex items-center gap-5 pb-5'>
                 
                 <div className="col w-[50%]">
                    <h3 className="text-[14px] font-[500] !mb-1 text-black">Ville</h3>
                     <input type="text" className="text-center bg-white w-full h-[40px] border border-[rgba(0,0,0,0.1)] 
             !p-2 !pl-8 focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm !p-3 text-sm"
               name="ville"
                                onChange={onChangeInput}
                                value={formField.ville}
          />
                 </div>
                 <div className="col w-[50%]">
                    <h3 className="text-[14px] font-[500] !mb-1 text-black">quartier</h3>
                     <input type="text" className="text-center bg-white w-full h-[40px] border border-[rgba(0,0,0,0.1)] 
             !p-2 !pl-8 focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm !p-3 text-sm"
              name="quartier"
                                onChange={onChangeInput}
                                value={formField.quartier}
          />
                 </div>
                 </div>
                  <div className=' flex items-center gap-5 pb-5'>
                 
                 <div className="col w-[50%]">
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
                <div className="flex items-center gap-5 !mt-2">
                <Button type="submit" className="btn-org btn-lg w-full flex gap-2 items-center">
                   {
                isLoading===true ? <CircularProgress color="inherit" /> : <>
                   "Ajouter" </>
                }
                  
                </Button>
                <Button className="btn-org btn-lg  btn-border w-full flex gap-2 items-center"
                onClick={handleClose}>Annuler</Button>
               </div>
         </form>
    </Dialog>
        </>
    )
}