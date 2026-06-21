import { Link } from "react-router-dom"
import "./index.css";


export default function BanniereV3(props){
    return(
        <>
        <div className="BanniereV3 !w-full overflow-hidden rounded-md group relative">
            <img src={props.image} className="!w-full transition-all duration-150 
            group-hover:scale-105"/>
            <div className={`info absolute !p-5 top-0 ${props.info==="left"?"!mr-auto":"!ml-auto"} w-[70%] 
            h-[100%] z-50 flex items-center justify-center flex-col gap-2 ${props.info==="left"?"":"pl-12"}`}>
                 <div className="w-full flex-col">
             <h2 className="text-[18px] fontt-[600] ">Produits Artisanaux</h2>
             <span className=" text-[20px] text-[rgb(231, 116, 146)] fontt-[600] w-full">4000Fcfa</span>
             </div>
            <div className="w-full">
                <Link to="/" className="text-[16px] fontt-[600] link a">Acheter maintenant</Link>
            </div>
             
            </div>
        </div>
        </>
    )
}