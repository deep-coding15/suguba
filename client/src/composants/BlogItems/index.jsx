import { IoMdTime } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";
export default function BlogItem(){
    return(
        <div className="blogItem group ">
           <div className="divBlog w-full overflow-hidden rounded-md
            cursor-pointer relative">
                <img src="https://tse2.mm.bing.net/th/id/OIP.muzyz_e-G1mP-YCWercF2wHaFH?rs=1&pid=ImgDetMain&o=7&rm=3" 
                className="w-full transition-all
                 group-hover:scale-105 group-hover:rotation-1" alt="blog image"/>

                 <span className="flex items-center justify-center text-white absolute bottom-[15px]
                  right-[15px] z-50 bg-pink-400 rounded-md p-1 text-[11px] font-[500] gap-1">
                    <IoMdTime className="text-[16px]"/>  7 Mars 2026
                 </span>
            </div>

            <div className="info !py-2">
                <h2 className="text-[15px] font-[600] text-black">
                    <Link to="/" className="link"> Beau casque...</Link>
                </h2>
                <p className="text-[13px] font-[400] text-black">
                    Ideale pour vos jeux de réalité virtuelle...
                </p>
                <Link className="link font-[500] py-3 text-[14px] flex items-center gap-1"> En savoir plus
                <IoIosArrowForward /></Link>
            </div>
        </div>
    )


    
}