import { NavLink } from "react-router-dom";
import { FaCloudUploadAlt } from "react-icons/fa";
import Radio  from "@mui/material/Radio";
import { FaPlus } from "react-icons/fa6";
import { useContext, useEffect, useState} from "react";
import { MyContext } from "../../App.jsx"
import { deleteData, fetchDataFromApi, uploadImages } from "../../utils/api.js";
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { Button } from "@mui/material";
import TextField from '@mui/material/TextField';
import { editImages, postData } from "../../utils/api.js";
import Checkbox from '@mui/material/Checkbox';
import { Collapse } from "react-collapse";
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

const label = { slotProps: { input: { 'aria-label': 'Radio demo' } } };
import { FaRegTrashAlt } from "react-icons/fa";
export default function Profil(){
    const context=useContext(MyContext);
    const [previews,setPreviews]=useState([]);
         const [uploading,setUploading]=useState(false);
        const [phone, setPhone] = useState('');
         const [selectedValue,setSelectedValue]=useState("Addresse 1");
              const handleChange=(event)=>{
                         setSelectedValue(event.target.value);
              }
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
          const [isLoading,setIsLoading]=useState(false);
              const [isLoading2,setIsLoading2]=useState(false);
              const [userId,setUserId]=useState("");
              const [isChangePassword,setIsChangePassword]=useState(false);
              const [formField,setFormField]=useState({
                 name:"",
                 email:"",
                 mobile:""
         });
          const [changePassword,setChangePassword]=useState({
                     email:"",
                 oldPassword:"",
                 newPassword:"",
                 confirmPassword:""
         });
             const history=useNavigate();
             useEffect(()=>{
                 const token=localStorage.getItem("accesstoken");
                 if (token===null) {
                     history("/connexion");
                 }
             },[context?.isLogin])
             useEffect(()=>{
                 if (context?.userData?._id !== "" && context?.userData?._id !== undefined) {
                    fetchDataFromApi(`/api/address/retrait?userId=${context?.userData?._id}`).then((res)=>{
                             
                             context?.setAddress(res.data)
                            })
                     setUserId(context?.userData?._id);
                     setFormField({
                 name:context?.userData?.name,
                 email:context?.userData?.email,
                 mobile:context?.userData?.mobile
                     })
                     const ph=`${context?.userData?.mobile}`
                     setPhone(ph)   
                     setChangePassword({
                  email:context?.userData?.email,
                     })
                 }
             },[context?.userData])
              const onChangeInput=(e)=>{
                 const{name,value}=e.target;
                 setFormField(()=>{
                     return{
                         ...formField,
                         [name]:value
                     }
                 })
                 setChangePassword(()=>{
                     return{
                         ...formField,
                         [name]:value
                     }
                 })
             }
         const valideValue=Object.values(formField).every(el=>el)
         const valideValue2=Object.values(changePassword).every(el=>el)
         const handleSubmit=(e)=>{
                 e.preventDefault();
                 setIsLoading(true);
                 if (formField.name==="") {
                  context.alertBox("error","Veuillez fournir votre nom complet"); 
                  setIsLoading(false);
                 return false
                }
                 if (formField.email==="") {
                  context.alertBox("error","Veuillez fournir votre email"); 
                  setIsLoading(false);
                 return false
                }
                 if (phone==="") {
                  context.alertBox("error","Veuillez fournir votre numero de téléphone"); 
                  setIsLoading(false);
                 return false
                }
         
         
                editImages(`/api/user/${userId}`,formField,{withCredentials:true}).then((res)=>{
                 if (res?.error!==true) {
                      setIsLoading(false);
                       context.alertBox("success",res?.data?.message);
                      
                 } else {
                     context.alertBox("error",res?.data?.message);
                      setIsLoading(false);
                 }
                
                })
         
             }
             const handleSubmitPassword=(e)=>{
                 e.preventDefault();
                 setIsLoading2(true);
                 if (changePassword.oldPassword==="") {
                  context.alertBox("error","Veuillez fournir votre ancien mot de passe"); 
                  setIsLoading2(false);
                 return false
                }
                 if (changePassword.newPassword==="") {
                  context.alertBox("error","Veuillez fournir votre nouveau mot de passe"); 
                  setIsLoading2(false);
                 return false
                }
                 if (changePassword.confirmPassword==="") {
                  context.alertBox("error","Veuillez confirmer votre nouveau mot de passe"); 
                  setIsLoading2(false);
                 return false
                }
                 if (changePassword.confirmPassword!==changePassword.newPassword) {
                  context.alertBox("error","Veuillez saisir le même mot de passe"); 
                  setIsLoading2(false);
                 return false
                }
         
         
                postData("/api/user/modidification-de-mot-de-passe",changePassword,{withCredentials:true}).then((res)=>{
                 if (res?.error!==true) {
                      setIsLoading2(false);
                       context.alertBox("success",res?.message);
                      
                 } else {
                     context.alertBox("error",res?.message);
                      setIsLoading2(false);
                 }
                
                })
         
             }
              useEffect(()=>{
                     if (context?.userData?._id !== "" && context?.userData?._id !== undefined) {
                     fetchDataFromApi(`/api/address/retrait?userId=${context?.userData?._id}`).then((res)=>{
                          context?.setAddress(res.data)  })
                                  } },[context?.userData])
             const removeAddress=(id)=>{
                                          deleteData(`/api/address/${id}`).then((res)=>{
                                               fetchDataFromApi(`/api/address/retrait?userId=${context?.userData?._id}`).then((res)=>{
                                               context?.setAddress(res.data)  })
                                          })
                                      }
    return (
        <>
          <div className="card my-4 pt-5 w-[65%] bg-white shadow-md sm:rounded-lg px-5 pb-5">
            <div className="flex items-center justify-between">
              <h2 className=" text-[18px] font-[600]"> Profil

            </h2>
             <Button onClick={()=>setIsChangePassword(!isChangePassword)} className="!ml-auto ">
                         Changer de mot de passe
            </Button>
            </div>
              <br/>    
         
       
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
        <form className='!mt-8' onSubmit={handleSubmit}>
                              <div className='flex items-center gap-5 !pb-5'>
        
                                    <div className='col1 w-[50%]'>
                                        <TextField 
                                        type="text"
                                         label="Nom Complet *" 
                                        variant="outlined" 
                                        className='w-full'
                                        size='small'
                                        name="name"
                                onChange={onChangeInput}
                                value={formField.name}/>
                                    </div>
                                  <div className='col1 w-[50%]'>
                                        <TextField 
                                       type="email"
                                        label="Email *" 
                                    variant="outlined" 
                                    className='w-full'
                                 size='small'
                                 name="email"
                                 disabled={true}
                                onChange={onChangeInput}
                                value={formField.email}/>
                              </div>
                            
                            </div>
                             <div className='flex items-center gap-5 !pb-5'>
                                    <div className='col1 w-[50%]'>
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
                     
                        <div className="flex items-center gap-4 !mt-4" >
                     
                      <Button  type='submit'  disabled={!valideValue}  className="btn-pink btn-sm w-[150px]">
                         {
                            isLoading===true ? <CircularProgress color="inherit" /> : "Enregistrer"
                        }
                        </Button>
                  
                    </div>
        </form>
       <div className="flex items-center justify-center !p-5 rounded-md border border-dashed border-[rgba(0,0,0,0.2)]
                bg-[#f1faff] hover:bg-[#e7f3f9] cursor-pointer !mt-5"
                onClick={()=>context.setIsOpenFullScreen({open:true,model:"Ajout d'addresse"})}
                
                 >
                   <span className=" flex items-center gap-3 text-[14px] font-[500]"><FaPlus className="text-[14px] font-[600]"/>  Ajouter une addresse</span>
                           </div>
                          <div  className="flex flex-col !mt-4 gap-2">
                           {            
                                context?.address?.length > 0 &&  context?.address?.map((address,index)=>{
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
     <Collapse isOpened={isChangePassword}>
               
                 <div className="card bg-white w-[65%] shadow-md rounded-md !p-5">
                    <div className="flex items-center pb-3">
                    <h2 className=" text-[18px] font-[600] pb-0">Changement de mot de passe</h2>
                    </div>
                    <hr/>
                     <form className='!mt-5' onSubmit={handleSubmitPassword}>
                      <div className='flex items-center gap-5 !pb-5'>

                            <div className='col1 w-[50%]'>
                                <TextField 
                                type="text"
                                 label="Ancien mot de passe *" 
                                variant="outlined" 
                                className='w-full'
                                size='small'
                                name="oldPassword"
                        onChange={onChangeInput}
                        value={changePassword.oldPassword}/>
                            </div>
                          <div className='col1 w-[50%]'>
                                <TextField 
                               type="text"
                                label="Nouveau mot de passe" 
                            variant="outlined" 
                            className='w-full'
                         size='small'
                         name="newPassword"
                        onChange={onChangeInput}
                        value={changePassword.newPassword}/>
                      </div>
                    
                    </div>
                     <div className='flex items-center gap-5 !pb-5'>
                            <div className='col1 w-[50%]'>
                                <TextField 
                                type="text"
                                 label="Confirmation du nouveau mot de passe *" 
                                variant="outlined" 
                                className='w-full'
                                size='small'
                                name="confirmPassword"
                        onChange={onChangeInput}
                         value={changePassword.confirmPassword}/>
                    </div>
                </div>
             
                <div className="flex items-center gap-4 !mt-4" >
             
              <Button  type='submit'  className="btn-pink btn-sm w-[200px]">
                 {
                    isLoading2===true ? <CircularProgress color="inherit" /> : "Enregistrer"
                }
                </Button>
          
            </div>
                    </form>
               </div>
     </Collapse>
        </>
    )
}