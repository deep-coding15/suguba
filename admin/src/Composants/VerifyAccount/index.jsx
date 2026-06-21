import Button from "@mui/material/Button";
import { FaRegUser } from "react-icons/fa6";
import { LuLogIn } from "react-icons/lu";
import { Link, NavLink } from "react-router-dom";
import background from "../../assets/hero.png";
import abcd from "../../assets/verfication.png";
import { useContext, useState } from "react";
import OtpBox from "../optBox/index";
import { postData } from '../../utils/api.js';
import { MyContext } from '../../App.jsx';
import { useNavigate } from "react-router-dom";
export default function VerifyAccount(){

        const [otp,setOtp]=useState("");
        const handleOtpChange=(value)=>{
                          setOtp(value);
                      };
                const context=useContext(MyContext);
                 const history =useNavigate();
                  const verifyOTP=(e)=>{
                                    e.preventDefault();
                                    const actionType=localStorage.getItem("actionType");
                                    if (actionType !=="forgot-password") {
                                     postData("/api/user/verification",{
                                     email:localStorage.getItem("userEmail"),
                                     otp:otp
                                  }).then((res)=>{
                                     if (res?.error===false) {
                                          context.alertBox("success",res?.message);
                                          localStorage.removeItem("userEmail")
                                         history("/connexion")
                                     }else{
                                          context.alertBox("error",res?.message);
                                     }
                                  })
                                    } else {
                                     postData("/api/user/verification-mot-de-passe-oublie",{
                                     email:localStorage.getItem("userEmail"),
                                     otp:otp
                                  }).then((res)=>{
                                     if (res?.error===false) {
                                          context.alertBox("success",res?.message);
                                         history("/changer-de-mot-de -passe")
                                     }else{
                                          context.alertBox("error",res?.message);
                                     }
                                  })
                                    }
                                 }

    return(
        <>
        <section className="!bg-white w-full h-[100vh]">
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
                      <div className="!text-center flex items-center justify-center">
                     <img src={ abcd} className="w-[100px]"/>
                    </div>
                    <h1 className="text-center text-[25px] font-[800] !mt-4">
                        Authentifiez votre email,<br/>
                    </h1>
                    <p className="text-center text-[15px]"> en saisissant le code envoyé sur{" "}
                        <span className="text-primary font-bold ">
                        {localStorage.getItem("userEmail")}</span>
                    </p>
                    <br/>
                    <form onSubmit={verifyOTP}>
                    <div className="flex items-center justify-center text-center flex-col">
                        <OtpBox length={6} onChange={handleOtpChange}/>
                    </div>
                    
                    <div className="flex items-center justify-center w-[300px] !m-auto !mt-4">
                        <Button type="submit" className="btn-pink btn-lg w-full">S'authentifier</Button>
                    </div>
                    </form>
                </div>

        </section>
        </>
    )
}