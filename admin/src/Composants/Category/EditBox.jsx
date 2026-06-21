import { useContext, useState ,useEffect} from "react"
import { MyContext } from "../../App";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { AiOutlineEdit } from "react-icons/ai";
import {BsTrash } from "react-icons/bs";

import CircularProgress from '@mui/material/CircularProgress';
import { Button } from "@mui/material";
import { deleteData, editImages } from "../../utils/api";

export default function EditBox(props){
    const [selectVal,setSelectVal]=useState("");
     const [isLoading,setIsLoading]=useState(false);
      const [editMode,setEditMode]=useState(false);
      const context=useContext(MyContext);
       const [formField,setFormField]=useState({
                         name:"",
                         parentCatName:null,parentId:null,
                  });
   useEffect(() => {
    setFormField({
        name: props?.name || "",
        parentCatName: props?.selectedCatName || null,
        parentId: props?.selectedCat || null,
    });
    setSelectVal(props?.selectedCat || "");
}, []);
     const onChangeInput=(e)=>{
        const{name,value}=e.target;
        const catId=selectVal;
        setSelectVal(catId);
            setFormField(()=>{
                         return{
                             ...formField,
                             [name]:value
                         }
                     })
                 }
    const handleChange= (event) => {
    const val = event.target.value;
    setSelectVal(val);
    setFormField((prev) => ({ ...prev, parentId: val }));
}
 const handleSubmit=(e)=>{
     e.preventDefault();
      setIsLoading(true);
        if (formField.name==="") {
           context.alertBox("error","Veuillez fournir le nom de la sous categorie"); 
              setIsLoading(false);
                 return false
                  }
                   editImages(`/api/category/${props?.id}`,formField).then((res)=>{
                                      if (res?.error!==true) {
                                        setTimeout(()=>{
                                          
                                           context.alertBox("success",res?.message);
                                           context?.getCat();
                                            setIsLoading(false);
                                        },1000);
                                           } else {
                                          context.alertBox("error",res?.message);
                                           setIsLoading(false);
   }});}
                                               
     
      const deleteCat=(id)=>{
         deleteData(`/api/category/${id}`).then((res)=>{
           context?.getCat();
         })
       }
     
    return(
        <>
             <form className="w-[100%] flex items-center gap-3 p-0 px-4" onSubmit={handleSubmit}>
                {editMode===true && <>
                 <div className="flex items-center justify-between py-2 gap-4">
                    <div className="w-[150px]">
                         <Select
          labelId="demo-simple-select-label"
          id="productCatDrop"
          size='small'
          className='w-full'
          value={selectVal}
          label="Category"
          onChange={handleChange}
        >
           {props?.catData?.length!==0 && props?.catData?.map((item,index)=>{
              return(<MenuItem key={index} value={item?._id}
                onClick={() =>{ formField.parentCatName=item?.name}}
              >{item?.name}</MenuItem>)
            })}
          
                   </Select>
                    </div>
                    <input type="text" className="w-full h-[30px] border border-[rgba(0,0,0,0.2)]  focus:outline-none 
                    focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                     name="name" onChange={onChangeInput} value={formField?.name}/>
                      <div className="flex items-center gap-2 ">
                          <Button size="small" className="btn-sm" type="submit" variant="contained">
                            {isLoading===true ?<CircularProgress color="inherit"/> :
                            <>
                             Modifier
                            </>
                            }
                          </Button>
                          <Button size="small"  variant="outlined" onClick={()=>setEditMode(false)}>
                            Annuler
                          </Button>
                      </div>
                 </div>
                </>}
                {editMode===false && <>
                <span className="font-[500] text-[14px]">{props?.name}</span>
                  <div className="flex items-center gap-2 ml-auto">
                <Button className="!min-w-[35px] !w-[35px] !h-[35px] !rounded-full !text-black "
                onClick={()=>{setEditMode(true);
                       setSelectVal(props.selectedCat)}}> 
                    < AiOutlineEdit/></Button>
                    <Button className="!min-w-[35px] !w-[35px] !h-[35px] !rounded-full !text-black"
                 onClick={() => deleteCat(props?.id)}> 
                    < BsTrash/></Button>
                    </div>
                    </>}
             </form>
        </>
    )
}