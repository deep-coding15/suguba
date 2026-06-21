import { useState } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";

export default function QtyBox({ qty, setQty, min = 1, max = 100 }) {
  const increment = () => {
    if (qty < max) setQty(qty + 1);
  };

  const decrement = () => {
    if (qty > min) setQty(qty - 1);
  };

  return (
    <div className="flex items-center border border-[rgba(0,0,0,0.2)] rounded-md overflow-hidden w-[100px]">
      <button
        className="w-[30px] h-[35px] flex items-center justify-center bg-[#f1f1f1] hover:bg-gray-200 transition-all"
        onClick={decrement}
      >
        <FiMinus className="text-[14px]" />
      </button>
      <span className="flex-1 text-center text-[14px] font-[500]">{qty}</span>
      <button
        className="w-[30px] h-[35px] flex items-center justify-center bg-[#f1f1f1] hover:bg-gray-200 transition-all"
        onClick={increment}
      >
        <FiPlus className="text-[14px]" />
      </button>
    </div>
  );
}


{/*import Button from "@mui/material/Button";
import { useState } from "react";
import { FaAngleDown } from "react-icons/fa6";
import { FaAngleUp } from "react-icons/fa6";



export default function QtyBox(){
    const[qtyVal,setQtyVal]=useState(1);
    const plusQty=()=>{
        setQtyVal(qtyVal+1)
    }
                
    const minusQty = () => {
    if (qtyVal > 1) {
        setQtyVal(qtyVal - 1);
    }
}

    return(
        <div className="qtyBox flex items-center relative">
            <input type="number" 
            className="w-full text-center h-[40px] pl-5 p-2 text-[15px] focus:outline-none
            border border-[rgba(0,0,0,0.2)] rounded-md"
             value={qtyVal}/>
             <div className="flex items-center flex-col justify-between h-[40px] absolute top-0 right-0 z-50">
                <Button className="!min-w-[25px] !w-[25px] !h-[20px] !text-[#000] !rounded-none
                hover:!bg-[#f1f1f1]"
                onClick={plusQty}> 
                    <FaAngleUp className="text-[12px] opacity-55"/>
                 </Button>
                <Button className="!min-w-[25px] !w-[25px] !h-[20px] !text-[#000] !rounded-none
                 hover:!bg-[#f1f1f1]"
                onClick={minusQty}>
                     <FaAngleDown className="text-[12px] opacity-55"/>
                 </Button>
             </div>
        </div>
    )
}*/}