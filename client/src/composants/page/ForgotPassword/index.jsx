import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import {  useNavigate } from 'react-router-dom';
import { MyContext } from '../../../router';
import { useContext } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { postData } from '../../../utils/api';
export default function ForgotPassword(){
     const [isLoading,setIsLoading]=useState(false);
    const [isShowPassword,setIsShowPassword]=useState(false);
     const [isShowPassword2,setIsShowPassword2]=useState(false);
const context =useContext(MyContext);
const history=useNavigate();
 const [formField,setFormField]=useState({
        email:localStorage.getItem("userEmail"),
        newPassword:"",
        confirmPassword:""
});
 const onChangeInput=(e)=>{
        const{name,value}=e.target;
        setFormField(()=>{
            return{
                ...formField,
                [name]:value
            }
        })
    }
const valideValue=Object.values(formField).every(el=>el)
const handleSubmit=(e)=>{
        e.preventDefault();
        setIsLoading(true);
        if (formField.newPassword==="") {
         context.alertBox("error","Veuillez fournir votre nouveau mot de passe"); 
          setIsLoading(false);
        return false
       }
        if (formField.confirmPassword==="") {
         context.alertBox("error","Veuillez confirmer votre mot de passe"); 
          setIsLoading(false);
        return false
       }
         if (formField.confirmPassword !==formField.newPassword) {
         context.alertBox("error","Veuillez entrer le même mot de passe"); 
          setIsLoading(false);
        return false
       }


       postData("/api/user/modidification-de-mot-de-passe2",formField).then((res)=>{
        console.log(res)
        if (res?.error!==true) {
            localStorage.removeItem("userEmail")
            localStorage.removeItem("actionType")
            context.alertBox("success",res?.message);
             setIsLoading(false);
              history("/connexion")
        } else {
            context.alertBox("error",res?.message);
             setIsLoading(false);
        }
       
       })

    }

    return(
        <section className='section !py-10'>
            <div className='w-[95%] !mx-auto'>
             <div className='card shadow-md w-[400px] !m-auto rounded-md bg-white !p-5 !px-10'>
                <h3 className='text-center text-[18px] text-black'>
                   Reinitialisation du mot de passe
                </h3>
                     <form className='w-full !mt-5'  onSubmit={handleSubmit}>
                    
                      <div className='form-group w-full !mb-5 relative'>
                        <TextField 
                        type={isShowPassword===false ? "password" : "text"}
                        id="password"
                         label="Nouveau mot de passe *" 
                        variant="outlined" 
                        className='w-full'
                         name="newPassword"
                        onChange={onChangeInput}
                        value={formField.newPassword}/>
                        <Button className='!absolute top-[10px] right-[10px] z-50 !w-[35px]
                        !h-[35px] !min-w-[35px] !rounded-full !text-black' 
                        onClick={()=>{setIsShowPassword(!isShowPassword)}}>
                            {isShowPassword===true ? <IoMdEye className='text-[20px] opacity-75'/> : 
                            <IoMdEyeOff className='text-[20px] opacity-75'/>}
                            
                        </Button>
                    </div>
                    <div className='form-group w-full !mb-5 relative'>
                        <TextField 
                        type={isShowPassword2===false ? "password" : "text"}
                        id="confirm-password" 
                        label="Confirmez le mot de passe *" 
                        variant="outlined" 
                        className='w-full'
                         name="confirmPassword"
                        onChange={onChangeInput}
                        value={formField.confirmPassword}/>
                        <Button className='!absolute top-[10px] right-[10px] z-50 !w-[35px]
                        !h-[35px] !min-w-[35px] !rounded-full !text-black' 
                        onClick={()=>{setIsShowPassword2(!isShowPassword2)}}>
                            {isShowPassword2===true ? <IoMdEye className='text-[20px] opacity-75'/> : 
                            <IoMdEyeOff className='text-[20px] opacity-75'/>}
                            
                        </Button>
                    </div>
                   <div className='flex items-center w-full !mt-3 !mb-3'>
                     <Button type='submit'  disabled={!valideValue} className='btn-org btn-lg w-full flex gap-3'> 
                             {
                                 isLoading===true ? <CircularProgress color="inherit" /> : " Changer de mot de passe"
                            }
                        </Button>
                
                    </div>
                </form>
             </div>
            </div>
        </section>
    )
}