import { Button } from "@mui/material";
import TextField from '@mui/material/TextField';
import AccountSidebar from "../AccountSidebar/index";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../../router";
import { useNavigate } from "react-router-dom";
import { editImages, postData } from "../../../utils/api";
import CircularProgress from '@mui/material/CircularProgress';
import { Collapse } from "react-collapse";
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

export default function MyAccount(){
     const [isLoading,setIsLoading]=useState(false);
     const [isLoading2,setIsLoading2]=useState(false);
     const [userId,setUserId]=useState("");
     const [isChangePassword,setIsChangePassword]=useState(false);
     const [phone, setPhone] = useState('');
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
    const context=useContext(MyContext);
    const history=useNavigate();
    useEffect(()=>{
        const token=localStorage.getItem("accesstoken");
        if (token===null) {
            history("/");
        }
    },[context?.isLogin])
    useEffect(()=>{
        if (context?.userData?._id !== "" && context?.userData?._id !== undefined) {
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
                    <h2 className="pb-0">Mon profil</h2>
                    <Button onClick={()=>setIsChangePassword(!isChangePassword)} className="!ml-auto !text-black">
                         Changer de mot de passe</Button>
                    </div>
                    <hr/>
                    <form className='!mt-5' onSubmit={handleSubmit}>
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
             
              <Button  type='submit'  disabled={!valideValue}  className="btn-org btn-sm w-[150px]">
                 {
                    isLoading===true ? <CircularProgress color="inherit" /> : "Enregistrer"
                }
                </Button>
          
            </div>
                    </form>
                </div>
                <Collapse isOpened={isChangePassword}>
               
                 <div className="card bg-white shadow-md rounded-md !p-5">
                    <div className="flex items-center pb-3">
                    <h2 className="pb-0">Changement de mot de passe</h2>
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
             
              <Button  type='submit'  className="btn-org btn-sm w-[200px]">
                 {
                    isLoading2===true ? <CircularProgress color="inherit" /> : "Enregistrer"
                }
                </Button>
          
            </div>
                    </form>
               </div>
               </Collapse>
        </div>
        </div>

    </section>
    </>
    )
}