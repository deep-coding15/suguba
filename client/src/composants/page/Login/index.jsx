import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { FcGoogle } from "react-icons/fc";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { Link, useNavigate,useParams } from 'react-router-dom';
import { MyContext } from '../../../router';
import { useContext } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { postData } from '../../../utils/api';

export default function Login(){
    const [isLoading,setIsLoading]=useState(false);
    const [isShowPassword,setIsShowPassword]=useState(false);
     const [loadingGoogle,setLoadingGoogle]=useState(false);
     function handleClickGoogle(){
      setLoadingGoogle(true);
      window.location.href = `${import.meta.env.VITE_API_URL}/api/user/auth/google`;
    }
    const [formField,setFormField]=useState({
        email:"",
        password:""
});
const context =useContext(MyContext);
const history=useNavigate();
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
const forgotPassword=()=>{
      if (formField.email==="") {
         context.alertBox("error","Veuillez fournir votre email"); 
        return false
       } else {
        context.alertBox("success",`le code de verication a été envoyer sur ${formField.email}`);
        localStorage.setItem("actionType","forgot-password");
        localStorage.setItem("userEmail",formField.email);
         postData("/api/user/mot-de-passe-oublie",{email:formField.email}).then((res)=>{
        if (res?.error!==true) {
              context.alertBox("success",res?.message);
               history("/verification");
        } else {
            context.alertBox("error",res?.message);
        }
       
       })
     }
        
       
    
}
const handleSubmit=(e)=>{
        e.preventDefault();
        setIsLoading(true);
        if (formField.email==="") {
         context.alertBox("error","Veuillez fournir votre email"); 
        return false
       }
        if (formField.password==="") {
         context.alertBox("error","Veuillez fournir un mot de passe"); 
        return false
       }


       postData("/api/user/connexion",formField).then((res)=>{
        console.log(res)
        if (res?.error!==true) {
             setIsLoading(false);
              context.alertBox("success",res?.message);
             setFormField({
        email:"",
        password:""
       })
       localStorage.setItem("accesstoken",res?.data?.accesstoken);
        localStorage.setItem("refreshtoken",res?.data?.refreshtoken);
        context.setIsLogin(true);
       history("/")
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
                    Connectez-vous à votre compte
                </h3>
                <form className='w-full !mt-5' onSubmit={handleSubmit}>
                    <div className='form-group w-full !mb-5'>
                        <TextField 
                        type='email'
                        id="email" label="Email *" 
                        variant="outlined" 
                        className='w-full'
                        name="email"
                        onChange={onChangeInput}
                        value={formField.email}
                       />
                    </div>
                    
                      <div className='form-group w-full !mb-5 relative z-0'>
                        <TextField 
                        type={isShowPassword===false ? "password" : "text"}
                        id="password" 
                        label="Mot de passe *" 
                        variant="outlined" 
                        className='w-full'
                         name="password"
                         onChange={onChangeInput}
                         value={formField.password}
                        />
                        <Button className='!absolute z-10 top-[10px] right-[10px] z-50 !w-[35px]
                        !h-[35px] !min-w-[35px] !rounded-full !text-black' 
                        onClick={()=>{setIsShowPassword(!isShowPassword)}}>
                            {isShowPassword===true ? <IoMdEye className='text-[20px] opacity-75'/> : 
                            <IoMdEyeOff className='text-[20px] opacity-75'/>}
                            
                        </Button>
                    </div>
                    <a className='link cursor-pointer text-[14px] font-[600]' onClick={forgotPassword}> Mot de passe oublié ?</a>
                    <div className='flex items-center w-full !mt-3 !mb-3'>
                        <Button type='submit'  disabled={!valideValue} className='btn-org btn-lg w-full flex gap-3'> 
                             {
                                 isLoading===true ? <CircularProgress color="inherit" /> : "  Se connecter"
                            }
                        </Button>
                    </div>
                    <p className='text-center'>Pas encore de compte ?<Link className='link text-[14px] font-[600] text-primary' to="/inscription">
                    {" "}créer un compte</Link></p>
                    <p className='text-center !font-[500]'>Ou continuer avec un compte social</p>
                   
                    <Button className='flex items-center gap-3 w-full !bg-[#f1f1f1] btn-lg !text-black'
                     onClick={handleClickGoogle}
                      loading={loadingGoogle}
                       loadingPosition="end"
                       variant="contained">
                        <FcGoogle className='text-[20px]'/>Se connecter avec Google</Button>
                </form>
             </div>
            </div>
        </section>
    )
}