import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import { useContext, useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { MyContext } from '../../App';
import { postData } from '../../utils/api.js';
export default function AddSubCategory(){
    const [categoryFilter,setCategoryFilter] =useState('');
     const [categoryFilter2,setCategoryFilter2] =useState('');
  const context=useContext(MyContext);
  const [isLoading,setIsLoading]=useState(false);
   const [isLoading2,setIsLoading2]=useState(false);
   const [formField,setFormField]=useState({
                         name:"",
                         parentCatName:null,parentId:null,
                  });
 const [formField2,setFormField2]=useState({
                         name:"",
                         parentCatName:null,parentId:null,
                  });
  const handleChangeProductCat = (event) => {
    const val = event.target.value;
    setCategoryFilter(val);
    setFormField((prev) => ({ ...prev, parentId: val }));
}
  const handleChangeProductCat2 = (event) => {
    const val = event.target.value;
    setCategoryFilter2(val);
    setFormField2((prev) => ({ ...prev, parentId: val }));
}
  

const selectedCatFun = (name) => {
    setFormField((prev) => ({ ...prev, parentCatName: name }));
}

const selectedCatFun2 = (name) => {
    setFormField2((prev) => ({ ...prev, parentCatName: name }));
}
                  
                    
                     
            
   const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormField((prev) => ({ ...prev, [name]: value }));
}
const onChangeInput2 = (e) => {
    const { name, value } = e.target;
    setFormField2((prev) => ({ ...prev, [name]: value }));
}
                
                  const handleSubmit=(e)=>{
                                                       e.preventDefault();
                                                       setIsLoading(true);
                                                       if (formField.name==="") {
                                                        context.alertBox("error","Veuillez fournir le nom de la sous categorie"); 
                                                        setIsLoading(false);
                                                       return false
                                                      }
                                                       if (categoryFilter==="") {
                                                        context.alertBox("error","Veuillez fournir l'image de la categorie"); 
                                                        setIsLoading(false);
                                                       return false
                                                      }
                                                     
                                                     postData(`/api/category/creation-categorie`,formField).then((res)=>{
                                                       if (res?.error!==true) {
                                                         setTimeout(()=>{
                                                            setIsLoading(false);
                                                            context.alertBox("success",res?.message);
                                                            context?.setIsOpenFullScreen({
                                                              open:false
                                                            })
                                                            context?.getCat();
                                                         },2500);
                                                            
                                                            {/*fetchDataFromApi(`/api/address/retrait?userId=${context?.userData?._id}`).then((res)=>{
                                                                context?.setAddress(res.data)
                                                              })*/}
                                                       } else {
                                                           context.alertBox("error",res?.message);
                                                            setIsLoading(false);
                                                       }
                                                      
                                                      })
                                               
                    } 
                     const handleSubmit2=(e)=>{
                                                       e.preventDefault();
                                                       setIsLoading2(true);
                                                       if (formField2.name==="") {
                                                        context.alertBox("error","Veuillez fournir le nom de la sous sous categorie"); 
                                                        setIsLoading2(false);
                                                       return false
                                                      }
                                                       if (categoryFilter2==="") {
                                                        context.alertBox("error","Veuillez fournir l'image de la sous categorie"); 
                                                        setIsLoading2(false);
                                                       return false
                                                      }
                                                     
                                                     postData(`/api/category/creation-categorie`,formField2).then((res)=>{
                                                       if (res?.error!==true) {
                                                         setTimeout(()=>{
                                                            setIsLoading2(false);
                                                            context.alertBox("success",res?.message);
                                                            context?.setIsOpenFullScreen({
                                                              open:false
                                                            })
                                                            context?.getCat();
                                                         },2500);
                                                            
                                                            {/*fetchDataFromApi(`/api/address/retrait?userId=${context?.userData?._id}`).then((res)=>{
                                                                context?.setAddress(res.data)
                                                              })*/}
                                                       } else {
                                                           context.alertBox("error",res?.message);
                                                            setIsLoading2(false);
                                                       }
                                                      
                                                      })
                                               
                    } 
    return(
        
            <>
             <section className="p-5 bg-gray-50 grid grid-cols-2 gap-10">
               <form className="form !py-3 p-8" onSubmit={handleSubmit}>
                <h4 className='font-[600]'>Ajout de sous categorie</h4>
                <div className='scroll max-h-[72hv] overflow-y-scroll pr-4 pt-4'>
                   <div className="grid grid-cols-2 !mb-3 gap-4">
                   <div className="col">
                    <h3 className="text-[14px] font-[500] !mb-1 text-black">Categorie de la categorie</h3>
                     <Select
          labelId="demo-simple-select-label"
          id="productCatDrop"
          size='small'
          className='w-full'
          value={categoryFilter}
          label="Category"
          onChange={handleChangeProductCat}
        >
           {context?.catData?.length!==0 && context?.catData?.map((item,index)=>{
              return(<MenuItem key={index} value={item?._id}
                onClick={() => selectedCatFun(item?.name)}
              >{item?.name}</MenuItem>)
            })}
          
                   </Select>
                 </div>
                  <div className="col ">
                    <h3 className="text-[14px] font-[500] !mb-1 text-black"> Nom de la sous  Categorie</h3>
                     <input type="text" className="w-full h-[40px] border border-[rgba(0,0,0,0.1)] 
             !p-2 !pl-8 focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm !p-3 text-sm"
             name="name" onChange={onChangeInput}
             value={formField.name}
          />
                 </div>
                </div>
                <br/>
                
                     
                </div>
                <div className="w-[350px]">
                <Button type="submit" className="btn-pink btn-lg w-full flex gap-2">
                  {
                        isLoading===true ? <CircularProgress color="inherit" /> : <>
                      <FaCloudUploadAlt className='text-[25px] text-white'/>Publier et voir </>
                  }
                </Button>
                </div>
               </form>
               <form className="form !py-3 p-8" onSubmit={handleSubmit2}>
                <h4 className='font-[600]'>Ajout de sous sous categorie</h4>
                <div className='scroll max-h-[72hv] overflow-y-scroll pr-4 pt-4'>
                   <div className="grid grid-cols-2 !mb-3 gap-4">
                   <div className="col">
                    <h3 className="text-[14px] font-[500] !mb-1 text-black">Categorie de sous la categorie</h3>
                     <Select
          labelId="demo-simple-select-label"
          id="productCatDrop"
          size='small'
          className='w-full'
          value={categoryFilter2}
          label="Category"
          onChange={handleChangeProductCat2}
        >
           {
           context?.catData?.length!==0 && context?.catData?.map((item,index)=>{
              return(
                
                   item?.children?.length!==0 && item.children?.map((item2,index)=>{
              return(

              <MenuItem key={index} value={item2?._id}
              onClick={() => selectedCatFun2(item2?.name)}
              
              >{item2?.name}</MenuItem>
            )
          }))
        })
}
            
          
        </Select>
                 </div>
                  <div className="col ">
                    <h3 className="text-[14px] font-[500] !mb-1 text-black"> Nom de la sous sous Categorie</h3>
                     <input type="text" className="w-full h-[40px] border border-[rgba(0,0,0,0.1)] 
             !p-2 !pl-8 focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm !p-3 text-sm"
             name="name" onChange={onChangeInput2}
             value={formField2.name}
          />
                 </div>
                </div>
                <br/>
                
                     
                </div>
                <div className="w-[350px]">
                <Button type="submit" className="btn-pink btn-lg w-full flex gap-2">
                  {
                        isLoading2===true ? <CircularProgress color="inherit" /> : <>
                      <FaCloudUploadAlt className='text-[25px] text-white'/>Publier et voir </>
                  }
                </Button>
                </div>
               </form>
                </section>
            </>
        
    )
}