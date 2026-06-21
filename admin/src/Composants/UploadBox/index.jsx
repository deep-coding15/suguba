 import React, { useContext, useState } from "react";
import { FaRegImages } from "react-icons/fa6";
import CircularProgress from '@mui/material/CircularProgress';
import { uploadImageCatProd } from "../../utils/api";
import { MyContext } from "../../App";

export default function UploadBox(props) {
    const [uploading, setUploading] = useState(false);
    const context = useContext(MyContext);

    const onChangeFile = async (e, apiEndPoint) => {
        try {
            const files = e.target.files;
            if (!files || files.length === 0) return;

            setUploading(true);
            const formdata = new FormData();  // ✅ déclaré DANS la fonction

            for (var i = 0; i < files.length; i++) {
                if (
                    files[i] && (
                        files[i].type === "image/jpeg" ||
                        files[i].type === "image/jpg" ||
                        files[i].type === "image/png" ||
                        files[i].type === "image/webp" ||
                        files[i].type === "image/avif"
                    )
                ) {
                    formdata.append(props?.name, files[i]); // ✅ toutes les images ajoutées
                } else {
                    context.alertBox("error", "Selectionnez un fichier jpeg, jpg, png, avif ou webp");
                    setUploading(false);
                    return false;
                }
            }

            uploadImageCatProd(apiEndPoint, formdata).then((res) => {
                setUploading(false);
                // ✅ corrigé : res.data.images (axios wrappe dans data)
                if (res?.data?.images) {
                    props.setPreviewsFun(res.data.images);
                } else {
                    context.alertBox("error", "Erreur lors de l'upload");
                }
            });

        } catch (error) {
            console.log(error);
            setUploading(false);
        }
    };

    return (
        <>
            <div className="uploadBox p-3 rounded-md overflow-hidden flex-col items-center justify-center
             border border-dashed border-[rgba(0,0,0,0.3)] h-[150px] w-[100%]
             bg-gray-100 cursor-pointer hover:bg-gray-200 flex relative">
                {uploading === true ? <CircularProgress /> : <>
                    <FaRegImages className="text-[40px] opacity-35 pointer-events-none" />
                    <h4 className="text-[14px] pointer-events-none"> + Images</h4>
                    <input
                        type="file"
                        accept="image/*"
                        multiple={props.multiple !== undefined ? props.multiple : false}
                        className="absolute top-0 left-0 w-full h-full z-50 opacity-0"
                        onChange={(e) => onChangeFile(e, props?.url)}
                        name="images"
                    />
                </>}
            </div>
        </>
    );
}
 
 
 
 
 {/* 
import React, { useContext, useState } from "react";
import {FaRegImages} from "react-icons/fa6";
import CircularProgress from '@mui/material/CircularProgress';
import { uploadImages,uploadImageCatProd } from "../../utils/api";
import { MyContext } from "../../App";

export default function UploadBox(props){
     const [previews,setPreviews]=useState([]);
      const [uploading,setUploading]=useState(false);
      const [isLoading,setIsLoading]=useState(false);
      const context=useContext(MyContext);
        const selectedImages=[];
             const formdata=new FormData();
             const onChangeFile=async(e,apiEndPoint)=>{
                  try {
                       setPreviews([]);
                       const files=e.target.files;
                       setUploading(true);
                       
                       for (var i = 0; i < files.length; i++) {
                            if (files[i] && (files[i].type==="image/jpeg" || files[i].type==="image/jpg" || 
                                 files[i].type==="image/png" || 
                                 files[i].type==="image/webp" ||  files[i].type==="image/avif") ) 
                                 {
        
                                 const file=files[i];
                                 selectedImages.push(file),
                                   formdata.append(props?.name,file);
                            } else {
                               context.alertBox("error","Selectionnez un fichier jpeg,jpg,png ,avif ou webp");
                               setUploading(false);
                               return false;
                            }
                            
                       }
                       
                  uploadImageCatProd(apiEndPoint,formdata).then((res)=>{
                       setUploading(false);
                       props.setPreviewsFun(res?.data?.images)
                        })
                  } catch (error) {
                       console.log(error);
                  }
             }
    return(
        <>
        <div className="uploadBox p-3 rounded-md overflow-hidden flex-col items-center justify-center
         border border-dashed border-[rgba(0,0,0,0.3)] h-[150px] w-[100%]
         bg-gray-100  cursor-pointer hover:bg-gray-200 flex relative">
          {uploading===true ? <CircularProgress/> : <>
          <FaRegImages className="text-[40px] opacity-35 pointer-events-none"/>
            <h4 className="text-[14px] pointer-events-none"> + Images</h4>
            <input type="file" accept="image/*" multiple={props.multiple!==undefined ? props.multiple : false}
            className="absolute top-0 left-0 w-full h-full z-50 opacity-0"
            onChange={(e)=>onChangeFile(e,props?.url)} name="images"/>
          </>}
         </div>
        </>
    )
}*/}