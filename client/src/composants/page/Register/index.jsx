import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useContext, useState } from 'react';
import { FcGoogle } from "react-icons/fc";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import { postData } from '../../../utils/api';
import { MyContext } from '../../../router';
import CircularProgress from '@mui/material/CircularProgress';

export default function Register(){
    const [isLoading,setIsLoading]=useState(false);
    const [isShowPassword,setIsShowPassword]=useState(false);
    const [loadingGoogle,setLoadingGoogle]=useState(false);
     function handleClickGoogle(){
      setLoadingGoogle(true);
      window.location.href = `${import.meta.env.VITE_API_URL}/api/user/auth/google`;
    }
    const [formField,setFormField]=useState({
        name:"",
        email:"",
        password:""
    })
    const context=useContext(MyContext);
    const history =useNavigate();

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
       if (formField.name==="") {
         context.alertBox("error","Veuillez fournir votre nom complet"); 
        return false
       }
        if (formField.email==="") {
         context.alertBox("error","Veuillez fournir votre email"); 
        return false
       }
        if (formField.password==="") {
         context.alertBox("error","Veuillez fournir un mot de passe"); 
        return false
       }


       postData("/api/user/inscription",formField).then((res)=>{
        console.log(res)
        if (res?.error!==true) {
             setIsLoading(false);
              context.alertBox("success",res?.message);
              localStorage.setItem("userEmail",formField.email)
             setFormField({
         name:"",
        email:"",
        password:""
       })
       history("/verification");
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
                    Inscription sur Suguba
                </h3>
                <form className='w-full !mt-5' onSubmit={handleSubmit}>
                    <div className='form-group w-full !mb-5'>
                        <TextField 
                        type='text'
                        id="name"
                         label="Nom Complet*" 
                        name='name'
                        value={formField.name}
                        disabled={isLoading===true ? true : false}
                        variant="outlined" 
                        className='w-full'
                        onChange={onChangeInput}/>
                    </div>
                    <div className='form-group w-full !mb-5'>
                        <TextField 
                        type='email'
                        name='email'
                        value={formField.email}
                         disabled={isLoading===true ? true : false}
                        id="email" 
                        label="Email *" 
                        variant="outlined" 
                        className='w-full'
                         onChange={onChangeInput}/>
                    </div>
                      <div className='form-group w-full !mb-5 relative z-0'>
                        <TextField 
                        type={isShowPassword===false ? "password" : "text"}
                        id="password" 
                        name='password'
                        value={formField.password}
                         disabled={isLoading===true ? true : false}
                        label="Mot de passe *" 
                        variant="outlined" 
                        className='w-full'
                         onChange={onChangeInput}/>
                        <Button className='!absolute z-10 top-[10px] right-[10px] z-50 !w-[35px]
                        !h-[35px] !min-w-[35px] !rounded-full !text-black' 
                        onClick={()=>{setIsShowPassword(!isShowPassword)}}>
                            {isShowPassword===true ? <IoMdEye className='text-[20px] opacity-75'/> : 
                            <IoMdEyeOff className='text-[20px] opacity-75'/>}
                            
                        </Button>
                    </div>
                     <div className='flex items-center w-full !mt-3 !mb-3'>
                        <Button  type='submit'  disabled={!valideValue} className='btn-org btn-lg w-full flex gap-3'>
                            {
                                isLoading===true ? <CircularProgress color="inherit" /> : "  S'inscrire"
                            }
                            </Button>
                    </div>
                   
                    <p className='text-center'>Vous avez déja un compte ?<Link className='link text-[14px] font-[600] text-primary' to="/connexion">
                    {" "} connexion</Link></p>
                    <p className='text-center !font-[500]'>Ou continuer avec un compte social</p>
                   
                    <Button className='flex items-center gap-3 w-full !bg-[#f1f1f1] btn-lg !text-black'
                     onClick={handleClickGoogle}
                      loading={loadingGoogle}
                       loadingPosition="end"
                      variant="contained">
                        <FcGoogle className='text-[20px]'/>  S'inscrire avec Google</Button>
                </form>
             </div>
            </div>
        </section>
    )
}