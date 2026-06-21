import Button from "@mui/material/Button";
import { FaRegEye, FaRegEyeSlash, FaRegUser } from "react-icons/fa6";
import { LuLogIn } from "react-icons/lu";
import { Link, NavLink } from "react-router-dom";
import background from "../../assets/hero.png";
import { useState } from "react";
import TextField from '@mui/material/TextField';
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import {  useNavigate } from 'react-router-dom';
import { MyContext } from '../../App.jsx';
import { useContext } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { postData } from '../../utils/api.js';



export default function ChangePassword(){
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
        <>
        <section className="!bg-white w-full">
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
                        Bonjour!<br/>
                        Vous pouvez changer votre mot de passe ici
                    </h1>
                    <br/>
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
                     <Button type='submit'  disabled={!valideValue} className='btn-pink !text-black btn-lg w-full flex gap-3'> 
                             {
                                 isLoading===true ? <CircularProgress color="inherit" /> : " Changer de mot de passe"
                            }
                        </Button>
                
                    </div>
                </form>
                  {/*  <form className="w-full !px-8 !mt-3">
                       <div className="form-group !mb-4 w-full ">
                        <h4 className="text-[14px] font-[500] !mb-1">Votre nouveau mot de Passe</h4>
                        <div className="relative w-full">
                        <input type={passwordShow=== true ? "text" : "password"} className="w-full h-[50px] border-2 border-[rgba(0,0,0,0.1)] rounded-md focus:border-[rgba(0,0,0,0.7)]
                        focus:outline-none !px-3" />
                        <Button className="!absolute top-[7px] right-[10px] z-50 !rounded-full !w-[35px] !h-[35px] 
                        !min-w-[35px] !text-gray-600" onClick={()=>setPasswordShow(!passwordShow)}>
                          {passwordShow===false ? (<FaRegEye className="text-[18px]"/> ): (<FaRegEyeSlash className="text-[18px]"/>)}
                        </Button>
                        </div>
                      </div>
                       <div className="form-group !mb-4 w-full ">
                        <h4 className="text-[14px] font-[500] !mb-1"> Confirmez votre mot de Passe</h4>
                        <div className="relative w-full">
                        <input type={passwordShow2=== true ? "text" : "password"} className="w-full h-[50px] border-2 border-[rgba(0,0,0,0.1)] rounded-md focus:border-[rgba(0,0,0,0.7)]
                        focus:outline-none !px-3" />
                        <Button className="!absolute top-[7px] right-[10px] z-50 !rounded-full !w-[35px] !h-[35px] 
                        !min-w-[35px] !text-gray-600" onClick={()=>setPasswordShow2(!passwordShow2)}>
                          {passwordShow2===false ? (<FaRegEye className="text-[18px]"/> ): (<FaRegEyeSlash className="text-[18px]"/>)}
                        </Button>
                        </div>
                      </div>
                     
                      <Button className="btn-lg w-full btn-pink !text-black">Changer</Button>
                    </form>
                    */} 
                </div>

        </section>
        </>
    )
}