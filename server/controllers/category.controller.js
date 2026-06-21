import CategoryModel from "../models/category.model.js";
import{v2 as cloudinary} from "cloudinary";
import fs from "fs";
import mongoose from "mongoose";
cloudinary.config({
    cloud_name:process.env.cloudinary_Config_Cloud_Name,
    api_key:process.env.cloudinary_Config_api_key,
    api_secret:process.env.cloudinary_Config_api_secret,
    secure:true,
});
 var imagesArr=[];
export async function uploadImages(req,res) {
    try {
        const userId=req.userId;
        const image=req.files;
        imagesArr=[];
        if (!image || image.length===0) {
            return res.status(400).json({
         error:true,success:false,message:"Aucun fichier envoyer"
     })
        }
         const options={
                use_filename:true,
                unique_filename:false,
                overwrite:false
            };
            for(const img of image){
                try {
                    const result=await cloudinary.uploader.upload(img.path,options);
                    imagesArr.push(result.secure_url);
                } catch (error) {
                    console.error("Erreur:",error)
                }finally{
                 if (fs.existsSync(img.path)) {
                     fs.unlinkSync(img.path);
                 }
            }}
            if (imagesArr.length>0) {
                 await CategoryModel.findByIdAndUpdate(userId,{images:imagesArr});
       
            }
       
        return res.status(200).json({
            _id:userId,
            images:imagesArr|| ""
        });
    } catch (error) {
        return res.status(500).json({
                message:error.message || error,
                success:false,
                error:true
            })
    }
}
{/* 
export async function createCategory(req,res) {
    try {
        let category=new CategoryModel({
            name:req.body.name,
            images:imagesArr,
            parentId:req.body.parentId,
            parentCatName:req.body.parentCatName
        });
        if (!category) {
             return res.status(400).json({
         error:true,success:false,message:"Categorie non crée"
     })
        }
        category= await category.save();
        imagesArr=[];
         return res.status(200).json({
         error:false,success:true,message:"Categorie crée avec succès",
         category:category
     })
    } catch (error) {
        return res.status(500).json({
                message:error.message || error,
                success:false,
                error:true
            })
    }
}*/}
// ✅ category.controller.js — convertir parentId en ObjectId


export async function createCategory(req, res) {
    try {
        let category = new CategoryModel({
            name: req.body.name,
            images: imagesArr,
            parentId: req.body.parentId ? new mongoose.Types.ObjectId(req.body.parentId) : null,
            parentCatName: req.body.parentCatName || null
        });
        category = await category.save();
        imagesArr = [];
        return res.status(200).json({
            error: false, success: true,
            message: "Categorie crée avec succès",
            category: category
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            success: false, error: true
        });
    }
}
export async function getCategories(req,res) {
    try {
        const categories=await CategoryModel.find();
        
        const categoryMap={};
        // ✅ FIX — convertir les ids en string
categories.forEach(cat => {
    categoryMap[cat._id.toString()] = { ...cat.toObject(), children: [] };
});

const rootCategories = [];
categories.forEach(cat => {
    if (cat.parentId) {
        categoryMap[cat.parentId.toString()].children.push(categoryMap[cat._id.toString()]);
    } else {
        rootCategories.push(categoryMap[cat._id.toString()]);
    }
});
      {/*  categories.forEach(cat=>{
            categoryMap[cat._id] = { ...cat.toObject(), children: [] };
        });
        const rootCategories=[];
        categories.forEach(cat=>{
            if (cat.parentId) {
                categoryMap[cat.parentId].children.push(categoryMap[cat._id]);
            }else{
                rootCategories.push(categoryMap[cat._id]);
            }
        });*/} 
        return res.status(200).json({
            error:false,success:true,data:rootCategories
        })
    } catch (error) {
        return res.status(500).json({
                message:error.message || error,
                success:false,
                error:true
            })
    }
}
export async function getCategoriesCount(req,res) {
    try {
        const categoryCount=await CategoryModel.countDocuments({parentId:undefined});
        if (!categoryCount) {
           return res.status(500).json({success:false,error:true});
        } else {
           return  res.send({
                nombreDeCategorie:categoryCount
            });
        }
    } catch (error) {
        return res.status(500).json({
                message:error.message || error,
                success:false,
                error:true
            })
    }
}
export async function getSubCategoriesCount(req,res) {
    try {
        const categories=await CategoryModel.find();
        if (!categories) {
          return   res.status(500).json({success:false,error:true});
        } else {
            const subCatList=[];
            for (let cat of categories) {
                if (cat.parentId !== undefined && cat.parentId !== null) {
                  subCatList.push(cat);   
                }}
          return res.send({
                nombreDeSousCategorie:subCatList.length
            });
        }
    } catch (error) {
        return res.status(500).json({
                message:error.message || error,
                success:false,
                error:true
            })
    }
}
export async function getCategory(req,res) {
try {
    const category =await CategoryModel.findById(req.params.id);
    if (!category) {
      return res.status(500).json({
                message:"Aucune categorie ne possede cet id",
                success:false,
                error:true
            });
    }
     return res.status(200).json({
                categorie:category,
                success:true,
                error:false
            });
} catch (error) {
    return res.status(500).json({
                message:error.message || error,
                success:false,
                error:true
            })
}
}
export async function removeImageFromCloudinary(req, res) {
    try {
        const imgUrl = req.query.img;

        if (!imgUrl) {
            return res.status(400).json({ error: true, success: false, message: "URL de l'image manquante" });
        }

        const urlArr = imgUrl.split("/");
        const image = urlArr[urlArr.length - 1];
        const imageName = image.split(".")[0];

        if (!imageName) {
            return res.status(400).json({ error: true, success: false, message: "Nom de l'image invalide" });
        }

        const result = await cloudinary.uploader.destroy(imageName);
        return res.status(200).json({ error: false, success: true, data: result });

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        });
    }
}
export async function deleteCategory(req,res) {
    try {
        const category =await CategoryModel.findById(req.params.id);
        const images=category.images;
        for(let img of images){
            const imgUrl = img;
             const urlArr = imgUrl.split("/");
        const image = urlArr[urlArr.length - 1];
        const imageName = image.split(".")[0];
         if (imageName) {
            cloudinary.uploader.destroy(imageName);
        }
        }
        const subCat= await CategoryModel.find({
            parentId:req.params.id
        });
        for (let i = 0; i < subCat.length; i++) {
            const thirdsubCat= await CategoryModel.find({parentId:subCat[i]._id});
            for (let i = 0; i < thirdsubCat.length; i++){
                const deleteThirdsubCat=await CategoryModel.findByIdAndDelete(thirdsubCat[i]._id);
            }
             const deleteSubCat=await CategoryModel.findByIdAndDelete(subCat[i]._id);
        }
        const deleteCat=await CategoryModel.findByIdAndDelete(req.params.id);
        if (!deleteCat) {
          return res.status(404).json({
            message: "categorie non trouvé",
            success: false,
            error: true
        });
        }
    return res.status(200).json({
            message:"categorie supprimée",
            success: true,
            error:false
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        });
    }
}
export async function updateCategory(req,res) {
    try {
        const category=await CategoryModel.findByIdAndUpdate(req.params.id,{
           name:req.body.name, 
           images:imagesArr.length>0 ? imagesArr[0] : req.body.images,
           parentId:req.body.parentId,
           parentCatName:req.body.parentCatName
        },{returnDocument:"after"});
     if (!category) {
        return res.status(500).json({
            message: "categorie non modifiable",
            success: false,
            error: true
        });
     }
     imagesArr=[];
     return res.status(200).json({
            success:true,
            error: false,
            category:category,
            message:"categorie modifier avec succès"
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        });
    }
}