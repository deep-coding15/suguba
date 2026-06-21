import Button from "@mui/material/Button";
import { FaRegUser } from "react-icons/fa6";
import { LuLogIn } from "react-icons/lu";
import { Link, NavLink } from "react-router-dom";
import background from "../../assets/hero.png";




export default function ForgotPassword(){
      


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
                        Vous avez des problemes de connexion ?<br/>
                        Modifiez votre code d'accès en quelques cliques
                    </h1>
                   
                    <br/>
                    <form className="w-full !px-8 !mt-3">
                      <div className="form-group !mb-4 w-full ">
                        <h4 className="text-[14px] font-[500] !mb-1">Email</h4>
                        <input type="email" className="w-full h-[50px] border-2 border-[rgba(0,0,0,0.1)] rounded-md focus:border-[rgba(0,0,0,0.7)]
                        focus:outline-none !px-3" />
                      </div>
                       <Button className="btn-lg w-full btn-pink"> changer de mot de passe</Button>
                      <br/><br/>
                     <div className="text-center flex items-center justify-center gap-2">
                      <span>Pas envie de modifier ?</span>
                    
                      
                      <Link to="/connexion" className="!text-[rgb(132, 132, 31)] font-[700] text-[15px] hover:underline hover:text-black">
                      connectez-vous
                      </Link>
                       </div>
                    </form>
                </div>

        </section>
        </>
    )
}