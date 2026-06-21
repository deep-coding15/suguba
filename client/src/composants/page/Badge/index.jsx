


export default function Badge(props){
               
        
    return(
    <>
    <span className={`inline-block !py-1 !px-4 rounded-full text-[11px]
     capitalize ${props.status==="en-attente" && "bg-primary text-white"}
                ${props.status==="confirmé" && "bg-green-500 text-white"}
                ${props.status==="livré" && "bg-green-700 text-white"}`}>
                    {props.status}
  </span>
    </>
    )
}