import UploadBox from "../UploadBox";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { IoMdClose } from 'react-icons/io';
import { FaCloudUploadAlt } from 'react-icons/fa';
import Button from '@mui/material/Button';
import { deleteImages, editImages, fetchDataFromApi, postData } from "../../utils/api";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import CircularProgress from '@mui/material/CircularProgress';

export default function EditCategory(){
   const [previews,setPreviews]=useState([]);
   const context=useContext(MyContext);
    const [isLoading,setIsLoading]=useState(false);

   const [formField,setFormField]=useState({
                         name:"",
                         images:[],
                  });
                  useEffect(()=>{
                    const id=context?.isOpenFullScreen?.id;
                    fetchDataFromApi(`/api/category/${id}`).then((res)=>{
                        setFormField((prev) => ({ ...prev, name: res?.categorie?.name }))
                           setPreviews(res?.categorie?.images)
                            })
                     
                      
                       
                      },[]);
                 const onChangeInput=(e)=>{
                     const{name,value}=e.target;
                     setFormField(()=>{
                         return{
                             ...formField,
                             [name]:value
                         }
                     })
                     formField.images=previews;
                 }
                 const setPreviewsFun=(previewsArr)=>{
                     setPreviews(previewsArr);
                     formField.images=previewsArr;
                 }
                 const removeImg=(image,index)=>{
                  var imageArr=[];
                  imageArr=previews;

                  deleteImages(`/api/category/suppression-image?img=${image}`).then((res)=>{
                 imageArr.splice(index,1);
                  setPreviews([]);
                  setTimeout(()=>{
                    setPreviews(imageArr);
                    formField.images=imageArr;
                  },100);
                  })
                 }
                  const handleSubmit=(e)=>{
                                      e.preventDefault();
                                      setIsLoading(true);
                                      if (formField.name==="") {
                                       context.alertBox("error","Veuillez fournir le nom de la categorie"); 
                                       setIsLoading(false);
                                      return false
                                     }
                                      if (previews?.length===0) {
                                       context.alertBox("error","Veuillez fournir l'image de la categorie"); 
                                       setIsLoading(false);
                                      return false
                                     }
                                    
                                    editImages(`/api/category/${context?.isOpenFullScreen?.id}`,formField).then((res)=>{
                                      if (res?.error!==true) {
                                        setTimeout(()=>{
                                           setIsLoading(false);
                                           context.alertBox("success",res?.message);
                                           context?.setIsOpenFullScreen({
                                             open:false
                                           },2500);
                                        })
                                           
                                           {/*fetchDataFromApi(`/api/address/retrait?userId=${context?.userData?._id}`).then((res)=>{
                                               context?.setAddress(res.data)
                                             })*/}
                                      } else {
                                          context.alertBox("error",res?.message);
                                           setIsLoading(false);
                                      }
                                     
                                     })
                              
                                  }  
    return(
        
            <>
             <section className="p-5 bg-gray-50">
               <form className="form !py-3 p-8" onSubmit={handleSubmit}>
                <div className='scroll max-h-[72hv] overflow-y-scroll pr-4 pt-4'>
                   <div className="grid grid-cols-5 !mb-3">
                 <div className="col ">
                    <h3 className="text-[14px] font-[500] !mb-1 text-black"> Nom de la Categorie</h3>
                     <input type="text" className="w-full h-[40px] border border-[rgba(0,0,0,0.1)] 
             !p-2 !pl-8 focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm !p-3 text-sm" name="name" onChange={onChangeInput}
             value={formField.name}
          />
                 </div>
                </div>
                <br/>
                 <h3 className="text-[18px] font-[500] !mb-4 text-black">Image de la categorie</h3>
                  <br/>
                     <div className="grid grid-cols-7 gap-4">
                      {previews?.length !== 0 && previews?.map((image,index)=>{
                        return(<>
                              <div className='uploadBoxWrapper relative' key={index}>
                                             <span className='absolute w-[20px] h-[20px] rounded-full overflow-hidden bg-red-700 -top-[5px] -right-[5px]
                                              flex items-center justify-center z-50 cursor-pointer' onClick={()=>removeImg(image,index)}>
                                                <IoMdClose className='text-white text-[17px]'/>
                                                 </span>
                                            <div className='uploadBox !p-0 rounded-md overflow-hidden border border-dashed  border-[rgba(0,0,0,0.3)] 
                                            h-[150px] w-[100%] bg-gray-100 cursor-pointer hover:bg-gray-200 flex items-center justify-center flex-col relative'>
                                              <img src={image} className="w-100" />
                                             {/*<LazyLoadImage
                                            
                                           alt={"image"}
                                           effect="blur"
                                             wrapperProps={{ style: {transitionDelay: "1s"},}}
                                             src={image} className="w-full h-full object-cover" />*/}
                         
                                          </div>
                              </div>
                        </>)
                      })}
                                  
                                         
                    <UploadBox  multiple={true} name="images" url="/api/category/chargement-image"
                      setPreviewsFun={setPreviewsFun}/>
                  </div>
                </div>
                
                <br/>
                <div className="w-[350px]">
                <Button type="submit" className="btn-pink btn-lg w-full flex gap-2">
                   {
                                  isLoading===true ? <CircularProgress color="inherit" /> : <>
                                  <FaCloudUploadAlt className='text-[25px] text-white'/>Publier et voir </>
                     }
                    
                </Button>
                </div>
               </form>
                </section>
            </>
        
    )
}