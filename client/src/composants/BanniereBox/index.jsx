import { Link } from "react-router-dom";



export default function BanniereBox(props){

    return(
    <div className="items w-full  relative rounded-md overflow-hidden group">
        <img src={props.image} link={props.link}
         className=" w-full transition-all duration-150  group-hover:scale-105 "/>
        <div className={`info absolute p-5 top-0 ${props.info==="left"?"left-0":" "} w-[70%] 
            h-[100%] z-50 flex items-center justify-center flex-col gap-2 ${props.info==="left"?"":"pl-12"}`}>
             <h2 className="text-[18px] fontt-[600] ">Produits Artisanaux</h2>
             <span className=" text-[20px] text-[rgb(231, 116, 146)] fontt-[600] w-full">4000Fcfa</span>
            <div className="w-full">
                <Link to="/" className="text-[16px] fontt-[600] link a">Acheter maintenant</Link>
            </div>
            </div>
    </div>
    )
}