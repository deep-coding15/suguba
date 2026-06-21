import Button from "@mui/material/Button";
import { FaRegEye, FaRegEyeSlash, FaRegUser } from "react-icons/fa6";
import { LuLogIn } from "react-icons/lu";
import { Link, useNavigate,useParams } from 'react-router-dom';
import background from "../../assets/hero.png";
import { useState } from "react";
import {FcGoogle} from "react-icons/fc";
import {BsFacebook} from "react-icons/bs";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from '@mui/material/CircularProgress';
import { postData } from '../../utils/api.js';
import { MyContext } from '../../App.jsx';
import { useContext } from 'react';
import {NavLink } from "react-router-dom";
import TextField from '@mui/material/TextField';
export default function Login(){
        const [isLoading,setIsLoading]=useState(false);
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
       history("/dashbord")
        } else {
          
            context.alertBox("error",res?.message);
            setIsLoading(false);
        }
       
       })

    }
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
               history("/verification-de-compte");
        } else {
            context.alertBox("error",res?.message);
        }
       
       })
     }
        
       
    
}
        const [loadingGoogle,setLoadingGoogle]=useState(false);
          function handleClickGoogle(){
  setLoadingGoogle(true);
  window.location.href = `${import.meta.env.VITE_API_URL}/api/user/auth/google`;
}
           const [loadingFacebook,setLoadingFacebook]=useState(false);
          function handleClickFacebook(){
            setLoadingFacebook(true);
          }
          //const [passwordShow,setPasswordShow]=useState(false);
         const [isShowPassword,setIsShowPassword]=useState(false);

    return(
        <>
        <section className="!bg-white w-full ">
         <header className="w-full fixed top-0 left-0 !px-4 !py-3 flex items-center justify-between z-50">
            <Link to="/">
            <img src="https://imgs.search.brave.com/yidLNeAlOis93k7FwAsb5tKOR46fIEXxKLbeh8vtfq0/rs:fit:0:180:1:0/g:ce/aHR0cHM6Ly93d3cu/YWZyaWNhLW5ld3Ny/b29tLmNvbS9maWxl/cy9sYXJnZS83M2Rl/MmQ3MTcxZTAzYjYv/MjAwLzE1MA"
             className="w-[200px]"/>
            </Link>

             <div className="flex items-center  gap-0">
                <NavLink to="/connexion" exact={true} activeClassName="isActive">
            <Button className="!rounded-full !text-[rgba(0,0,0,0.8)] !px-5 flex gap-1">
                <LuLogIn className="text-[15px]"/>Se connecter
            </Button>
            </NavLink>
              <NavLink to="/inscription" exact={true} activeClassName="isActive">
            <Button className="!rounded-full !text-[rgba(0,0,0,0.8)] !px-5 flex gap-1">
                <FaRegUser className="text-[15px]"/>S'inscrire
            </Button>
            </NavLink>
            </div>
      </header>
      <img src={background}
                className="w-full fixed top-0 left-0 opacity-5"/>

                <div className="loginBox card w-[600px] h-[auto] !pb-20 !mx-auto !pt-20 relative z-50">
                
                    <h1 className="text-center text-[25px] font-[800] !mt-4 !pt-11">
                        Bon Retour!<br/>
                        Connectez-vous avec vos données.
                    </h1>
                    <div className=" flex items-center justify-center w-[450px] !mt-5 gap-4 mr-auto ml-auto">
                   
                         <Button
          size="small"
          onClick={handleClickGoogle}
          endIcon={<FcGoogle />}
          loading={loadingGoogle}
          loadingPosition="end"
          variant="contained"
          className="!bg-white !py-2 !text-[15px] !capitalize !px-5 !text-[rgba(0,0,0,0.7)] w-full"
        >
          Se connecter avec Google
        </Button>
        
                    </div>
                    <br/>
                    <div className="w-full flex items-center justify-center gap-3">
                      <span className="flex items-center w-[100px] h-[1px] bg-[rgba(0,0,0,0.2)]">
                      </span>
                      <span className="text-[14px] font-[500]"> Ou, Connectez-vous avec votre email</span>
                       <span className="flex items-center w-[100px] h-[1px] bg-[rgba(0,0,0,0.2)]">
                      </span>
                    </div>
                    <br/>
                    <form className="w-full !px-8 !mt-3" onSubmit={handleSubmit}>
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
                    
                      <div className='form-group w-full !mb-5 relative'>
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
                        <Button className='!absolute top-[10px] right-[10px] z-50 !w-[35px]
                        !h-[35px] !min-w-[35px] !rounded-full !text-black' 
                        onClick={()=>{setIsShowPassword(!isShowPassword)}}>
                            {isShowPassword===true ? <FaRegEye className='text-[20px] opacity-75'/> : 
                            <FaRegEyeSlash className='text-[20px] opacity-75'/>}
                            
                        </Button>
                    </div>
                    <div className="form-group !mb-4 w-full flex items-center justify-between">
                        <FormControlLabel control={<Checkbox defaultChecked/>}
                        label="Souviens-toi de moi"/>
                        <a className='text-yellow-400 cursor-pointer text-[14px] font-[600] hover:underline hover:text-black' onClick={forgotPassword}> Mot de passe oublié ?</a>
                      </div>
                      <Button type="submit"  disabled={!valideValue} className=' btn-lg w-full btn-sm !text-black btn-pink flex gap-3'> 
                             {
                                 isLoading===true ? <CircularProgress color="inherit" /> : "  Se connecter"
                            }
                        </Button>
                      {/* <div className="form-group !mb-4 w-full ">
                        <h4 className="text-[14px] font-[500] !mb-1">Mot de Passe</h4>
                        <div className="relative w-full">
                        <input 
                         name="password"
                         onChange={onChangeInput}
                         value={formField.password}
                         id="password" 
                        type={passwordShow=== true ? "text" : "password"} 
                        className="w-full h-[50px] border-2 border-[rgba(0,0,0,0.1)] rounded-md focus:border-[rgba(0,0,0,0.7)]
                        focus:outline-none !px-3" />
                        <Button className="!absolute top-[7px] right-[10px] z-50 !rounded-full !w-[35px] !h-[35px] 
                        !min-w-[35px] !text-gray-600" onClick={()=>setPasswordShow(!passwordShow)}>
                          {passwordShow===false ? (<FaRegEye className="text-[18px]"/> ): (<FaRegEyeSlash className="text-[18px]"/>)}
                        </Button>
                        </div>
                      </div>
                      <div className="form-group !mb-4 w-full flex items-center justify-between">
                        <FormControlLabel control={<Checkbox defaultChecked/>}
                        label="Souviens-toi de moi"/>
                        <a className='text-yellow-400 cursor-pointer text-[14px] font-[600] hover:underline hover:text-black' onClick={forgotPassword}> Mot de passe oublié ?</a>
                      </div>*/} 
                       
                  
                    </form>
                </div>

        </section>
        </>
    )
}