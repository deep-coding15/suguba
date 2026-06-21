import { useContext, useState } from "react";
import OtpBox from"../optBox/index";
import Button from "@mui/material/Button";
import opt from "../../../assets/verify1.png";
import { postData } from "../../../utils/api";
import { MyContext } from "../../../router";
import { useNavigate } from 'react-router-dom';

export default function Verify(){
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
                        history("/reinitialisation-mot-de-passe")
                    }else{
                         context.alertBox("error",res?.message);
                    }
                 })
                   }
                }
    return(
    <>
    <section className='section !py-10'>
                <div className='w-[95%] !mx-auto cont'>
                 <div className='card shadow-md w-[400px] !m-auto rounded-md bg-white !p-5 !px-10'>
                    <div className="text-center flex items-center justify-center">
                        <img src={opt} width="80"/>
                    </div>
                    <h3 className='text-center text-[18px] text-black !mt-4 !mb-1'>
                        Verification
                    </h3>
                    <p className="text-center mt-0 mb-4">le code envoyé sur{" "}<span
                     className="text-primary font-bold">{localStorage.getItem("userEmail")}</span></p>
                     <form onSubmit={verifyOTP}>
                    <OtpBox length={6} onChange={handleOtpChange}/>
                    <div className="flex items-center justify-center !mt-5 !px-3">
                        <Button type="submit" className="btn-org btn-lg w-full">S'authentifier</Button>
                    </div>
                    </form>
                 </div>
                </div>
            </section>
    </>
    )
}