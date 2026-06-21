import UserModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken"
import sendEmailFun from "../config/sendEmail.js";
import VerificationEmail from "../utils/verifyEmailTemplate.js"
import generatedAccessToken from "../utils/generatedAccessToken.js";
import generatedRefreshToken from "../utils/generatedRefreshToken.js";
import{v2 as cloudinary} from "cloudinary";
import fs from "fs";
cloudinary.config({
    cloud_name:process.env.cloudinary_Config_Cloud_Name,
    api_key:process.env.cloudinary_Config_api_key,
    api_secret:process.env.cloudinary_Config_api_secret,
    secure:true,
});



export async function registerUserController(req,res) {
        try {
            const {name, email, password}=req.body;
            if (!name || !email || !password) {
                return res.status(400).json({
                    message:"verifiez vos donées",
                    error:true,
                    success:false
                });
            }

       const userExist= await UserModel.findOne({email:email});
            if (userExist) {
                return res.json({
                      message:"Un utilisateur est déja inscrit avec cet email.",
                    error:true,
                    success:false
                });
            }
            const verifyCode=Math.floor(100000 + Math.random() * 900000).toString();
            const salt =await bcryptjs.genSalt(10);
            const hashPassword= await bcryptjs.hash(password, salt);
          const newUser=new UserModel({
                email: email,
                password:hashPassword,
                name: name,
                otp:verifyCode,
                otpExpires: Date.now()+600000
            });
            await newUser.save();
            await sendEmailFun(
            email,
                "AUthentifiez votre email pour finaliser votre inscription",
                "",
            VerificationEmail({username:name,otp:verifyCode})
            );
            return res.status(200).json({
                success:true,
                error:false,
                message:"Vous êtes inscrit avec succès,veuillez consulter mail afin d'authentifier votre email",
            });

        } catch (error) {
            return res.status(500).json({
                message:error.message || error,
                success:false,
                error:true
            })
        }   
}
export async function verifyEmailController(req,res) {
    try {
        const {email,otp}=req.body;
        const user=await UserModel.findOne({email:email});
        if (!user) {
            return res.status(400).json({error:true,success:false,message:"Utilisateur non trouvé"});
           }
           const isCodeValid=user.otp===otp;
           const isNotExpired=user.otpExpires > Date.now();
           if(isCodeValid && isNotExpired){
            user.verify_email=true;
            user.otp=null;
            user.otpExpires=null;
            await user.save();
            return res.status(200).json({error:false,success:true,message:"Email verifié avec succès"});
       }else if (!isCodeValid) {
               return res.status(400).json({error:true,success:false,message:"Code invalide"});
       } else {
        return res.status(400).json({error:true,success:false,message:"Code Expiré"});
       }
    } catch (error) {
         return res.status(500).json({
                message:error.message || error,
                success:false,
                error:true
            })
    }
}
export async function loginUserController(req,res) {
try {
     const {email,password}=req.body;
     const user = await UserModel.findOne({email:email});
     if (!user) {
        return res.status(400).json({
            error:true,success:false,message:"Utilisateur non inscrit"
           })  
     }
     if (user.status !== "Active") {
      return res.status(400).json({
            error:true,success:false,message:"Contactez l'administrateur"
           })  
     }
     if (!user.verify_email) {
        return res.status(401).json({
            error:true,success:false,message:"veuillez Verifiez votre email avant de vous connecter"
           });  
     }
     const checkPassword= await bcryptjs.compare(password,user.password);
      if (!checkPassword) {
         return  res.status(400).json({
            error:true,success:false,message:"Verifiez votre mot de passe"
           });  
     }
     const accesstoken = await generatedAccessToken(user._id);
     const refreshtoken = await generatedRefreshToken(user._id);
     await UserModel.findByIdAndUpdate(user._id, {
    last_login_date: new Date(),
    refresh_token: refreshtoken  // ✅ on persiste le refresh token
});
     const cookiesOptions={
        httpOnly:true,
        secure:true,
        sameSite:"None"
     };
     res.cookie("accesstoken",accesstoken,cookiesOptions)
     res.cookie("refreshtoken",refreshtoken,cookiesOptions)
     return res.json({
         error:false,success:true,message:"Connecter avec succès",
         data:{accesstoken,refreshtoken}
     })
   

}catch (error) {
         return res.status(500).json({
                message:error.message || error,
                success:false,
                error:true
            })
    }}
export async function logoutUserController(req,res) {
    try {
        const userid=req.userId
         const cookiesOptions={
        httpOnly:true,
        secure:true,
        sameSite:"None"
     }
     res.clearCookie("accesstoken",cookiesOptions)
     res.clearCookie("refreshtoken",cookiesOptions)
     const removeRefreshToken = await UserModel.findByIdAndUpdate(userid,{
        refresh_token:""
     })
      return res.json({
         error:false,success:true,message:"deConnecter avec succès"
     })
    } catch (error) {
          return res.status(500).json({
                message:error.message || error,
                success:false,
                error:true
            })
    }
}

export async function userAvatarController(req,res) {
    try {
        const userId=req.userId;
        const image=req.files;
        var imagesArr=[];
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
                 await UserModel.findByIdAndUpdate(userId,{ avatar:imagesArr[0]});
       
            }
       
        return res.status(200).json({
            _id:userId,
            avatar:imagesArr[0] || ""
        });
    } catch (error) {
        return res.status(500).json({
                message:error.message || error,
                success:false,
                error:true
            })
    }
}
export async function updateUserDetails(req,res) {
try {
    const userId=req.userId;
      const {name, email,mobile, password}=req.body;
      const userExist= await UserModel.findById(userId);
      if (!userExist) {
        return res.status(400).json({message:"L'utilisateur ne peux pas être modifié"});}
        let verifyCode="";
        if (email!==userExist.email) {
            verifyCode=Math.floor(100000 + Math.random()*900000).toString();
        }
        let hashPassword="";
        if(password){
             const salt =await bcryptjs.genSalt(10);
             hashPassword= await bcryptjs.hash(password, salt);
        }else{
            hashPassword=userExist.password;
        }
        // ✅ FIX dans updateUserDetails
const updateUser = await UserModel.findByIdAndUpdate(userId, {
    name: name || userExist.name,
    mobile: mobile || userExist.mobile,
    email: email || userExist.email, // fallback sur l'email existant
    verify_email: (email && email !== userExist.email) ? false : userExist.verify_email,
    password: hashPassword,
    otp: verifyCode !== "" ? verifyCode : null,
    otpExpires: verifyCode !== "" ? Date.now() + 600000 : ""
}, { returnDocument: "after" });
        if(email!==userExist.email) {
     await sendEmailFun(
            email,
                "AUthentifiez votre email pour finaliser vos modifications",
                "",
            VerificationEmail({username:name,otp:verifyCode})
            );
        }
         return res.status(200).json({
                success:true,
                error:false,
                message:"Vos informations ont été modifiées avec succès",
                user:{
                    name:updateUser?.name,
                    _id:updateUser?._id,
                    email:updateUser?.email,
                    mobile:updateUser?.mobile,
                    avatar:updateUser?.avatar,
                    
                }
            });
      
} catch (error) {
    return res.status(500).json({
                message:error.message || error,
                success:false,
                error:true
            })
}
}
export async function forgotPasswordController(req,res) {
    try {
         const { email}=req.body;
         const user= await UserModel.findOne({email:email});
             if (!user) {

        return res.status(400).json({message:"L'email non inscrit sur suguba",error:true,success:false});
    }else{
        let verifyCode=Math.floor(100000 + Math.random()*900000).toString();
        user.otp=verifyCode;
        user.otpExpires=Date.now()+600000;
       await user.save();
       await sendEmailFun(
            email,
                "AUthentifiez votre email pour finaliser vos modifications",
                "",
            VerificationEmail({username:user.name,otp:verifyCode})
            );
        return res.status(200).json({
                success:true,
                error:false,
                message:"Veuillez consulter votre mail"

            });}
    } catch (error) {
         return res.status(500).json({
                message:error.message || error,
                success:false,
                error:true
            })
    }
}
export async function verifyforgotPasswordController(req,res) {
    try {
        const {email,otp}=req.body;
        const user=await UserModel.findOne({email:email});
        if (!user) {
            return res.status(400).json({error:true,success:false,message:"votre email n'est pas inscrit sur suguba"});
           }
           if (!email || !otp) {
             return res.status(400).json({error:true,success:false,message:"Veuillez fournir l'email et le code"});
           }
           const isCodeValid=user.otp===otp;
           const isNotExpired=user.otpExpires > Date.now();
           if(isCodeValid && isNotExpired){
            user.verify_email=true;
            user.otp="";
            user.otpExpires="";
            await user.save();
            return res.status(200).json({error:false,success:true,message:"Email verifié avec succès"});
       }else if (!isCodeValid) {
               return res.status(400).json({error:true,success:false,message:"Code invalide"});
       } else {
        return res.status(400).json({error:true,success:false,message:"Code Expiré"});
       }
    } catch (error) {
         return res.status(500).json({
                message:error.message || error,
                success:false,
                error:true
            })
    }
}
export async function refreshPassword(req,res) {
    try {
        const {email,oldPassword,newPassword,confirmPassword}=req.body;
        if ( !email || !newPassword || !confirmPassword) {
             return res.status(400).json({error:true,success:false,message:"Veuillez remplir tous les champs"});
        }
        const user=await UserModel.findOne({email:email});
         if (!user) {
            return res.status(400).json({error:true,success:false,message:"votre email n'est pas inscrit sur suguba"});
           }
           const checkPassword=await bcryptjs.compare(oldPassword,user.password);
           if (!checkPassword) {
             return res.status(400).json({error:true,success:false,message:"votre ancien mot de passe n'est pas correcte"});
           }
            if (newPassword !== confirmPassword) {
            return res.status(400).json({error:true,success:false,message:"les mots de passe doivent être les mêmes"});
           }
            const salt =await bcryptjs.genSalt(10);
             const hashPassword= await bcryptjs.hash(confirmPassword, salt);
              
               user.password=hashPassword;
               await user.save();
              
               return res.status(200).json({
                success:true,
                error:false,
                message:"Votre mot de passe a été modifiées avec succès"
            });
    } catch (error) {
      return res.status(500).json({
                message:error.message || error,
                success:false,
                error:true
            })   
    }
}
export async function userDetails(req,res) {
try {
    const userId=req.userId;

      const user= await UserModel.findById(userId).select('-password -refresh_token');
     
         return res.status(200).json({
                success:true,
                error:false,
                message:"Details Utilisateur",
                data:user
            });
      
} catch (error) {
    return res.status(500).json({
                message:"ERREUR SURVENU",
                success:false,
                error:true
            })
}
}
// ✅ APRÈS
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
// ✅ APRÈS
export async function refreshToken(req, res) {
    try {
        const refreshtoken = req.cookies.refreshtoken || req?.headers?.authorization?.split(" ")[1];

        if (!refreshtoken) {
            return res.status(400).json({ error: true, success: false, message: "token manquant" });
        }

        let verifyToken;
        try {
            verifyToken = jwt.verify(refreshtoken, process.env.SECRET_KEY_REFRESH_TOKEN); // ✅ synchrone, dans son propre try/catch
        } catch (err) {
            return res.status(401).json({ error: true, success: false, message: "token expiré ou invalide" });
        }

        const userId = verifyToken?._id;

        if (!userId) {
            return res.status(401).json({ error: true, success: false, message: "token invalide" });
        }

        const newAccessToken = await generatedAccessToken(userId);
        const cookiesOptions = { httpOnly: true, secure: true, sameSite: "None" };
        res.cookie("accesstoken", newAccessToken, cookiesOptions);

        return res.status(200).json({
            success: true,
            error: false,
            message: "nouveau token generé",
            data: { accesstoken: newAccessToken }
        });

    } catch (error) {
        return res.status(500).json({ message: "ERREUR SURVENU", success: false, error: true });
    }
}
export async function refreshPassword2(req,res) {
    try {
        const {email,newPassword,confirmPassword}=req.body;
        if ( !email || !newPassword || !confirmPassword) {
             return res.status(400).json({error:true,success:false,message:"Veuillez remplir tous les champs"});
        }
        const user=await UserModel.findOne({email:email});
         if (!user) {
            return res.status(400).json({error:true,success:false,message:"votre email n'est pas inscrit sur suguba"});
           }
            if (newPassword !== confirmPassword) {
            return res.status(400).json({error:true,success:false,message:"les mots de passe doivent être les mêmes"});
           }
            const salt =await bcryptjs.genSalt(10);
             const hashPassword= await bcryptjs.hash(confirmPassword, salt);
              
               user.password=hashPassword;
               await user.save();
              
               return res.status(200).json({
                success:true,
                error:false,
                message:"Votre mot de passe a été modifiées avec succès"
            });
    } catch (error) {
      return res.status(500).json({
                message:error.message || error,
                success:false,
                error:true
            })   
    }
}
export async function getAllUsers(req, res) {
    try {
        const users = await UserModel.find()
            .select('-password -refresh_token -otp -otpExpires -access_token')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            error: false,
            message: "Liste des utilisateurs",
            data: users
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        });
    }
}
export async function googleAuthCallback(req, res) {
  try {
    const user = req.user;
    if (!user) {
      return res.redirect(`${process.env.CLIENT_URL}/connexion?error=google_failed`);
    }

    const accesstoken = await generatedAccessToken(user._id);
    const refreshtoken = await generatedRefreshToken(user._id);

    await UserModel.findByIdAndUpdate(user._id, {
      last_login_date: new Date(),
      refresh_token: refreshtoken,
    });

    const cookiesOptions = { httpOnly: true, secure: true, sameSite: "None" };
    res.cookie("accesstoken", accesstoken, cookiesOptions);
    res.cookie("refreshtoken", refreshtoken, cookiesOptions);

    return res.redirect(
      `${process.env.CLIENT_URL}/auth/google/success?accesstoken=${accesstoken}&refreshtoken=${refreshtoken}`
    );
  } catch (error) {
    return res.redirect(`${process.env.CLIENT_URL}/connexion?error=server_error`);
  }
}