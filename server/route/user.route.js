import {Router} from "express";
import {
    forgotPasswordController, getAllUsers, loginUserController, 
    logoutUserController, refreshPassword, refreshPassword2, 
    refreshToken, registerUserController, removeImageFromCloudinary,
    updateUserDetails, userAvatarController, userDetails,
    verifyEmailController, verifyforgotPasswordController,
    googleAuthCallback
} from "../controllers/user.controller.js";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";
import passport from "../config/passport.js";

const userRouter = Router();

userRouter.post("/inscription", registerUserController);
userRouter.post("/verification", verifyEmailController);
userRouter.post("/connexion", loginUserController);
userRouter.get("/deconnexion", auth, logoutUserController);
userRouter.put("/chargement-image", auth, upload.array("avatar"), userAvatarController);
userRouter.delete("/suppression-image", auth, removeImageFromCloudinary);
userRouter.put("/:id", auth, updateUserDetails);
userRouter.post("/mot-de-passe-oublie", forgotPasswordController);
userRouter.post("/verification-mot-de-passe-oublie", verifyforgotPasswordController);
userRouter.post("/modidification-de-mot-de-passe", refreshPassword);
userRouter.post("/modidification-de-mot-de-passe2", refreshPassword2);
userRouter.post("/generation-de-token", refreshToken);
userRouter.get("/liste-utilisateurs", auth, getAllUsers);
userRouter.get("/details-utilisateur", auth, userDetails);

// Routes Google
userRouter.get("/auth/google",
  passport.authenticate("google", { 
    scope: ["profile", "email"], 
    session: false,
    prompt: "select_account"
  })
);
userRouter.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/connexion", session: false }),
  googleAuthCallback
);

export default userRouter;



{/*
  userRouter.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);
  import {Router} from "express";
import {forgotPasswordController, getAllUsers, loginUserController, logoutUserController, refreshPassword, refreshPassword2, refreshToken, registerUserController,
    removeImageFromCloudinary,updateUserDetails,userAvatarController,
    userDetails,
    verifyEmailController,
    verifyforgotPasswordController} from "../controllers/user.controller.js";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";

const userRouter=Router()
userRouter.post("/inscription",registerUserController) //fait
userRouter.post("/verification",verifyEmailController) //fait
userRouter.post("/connexion",loginUserController)  //fait
userRouter.get("/deconnexion",auth,logoutUserController); //fait
userRouter.put("/chargement-image",auth,upload.array("avatar"),userAvatarController); //fait
userRouter.delete("/suppression-image",auth,removeImageFromCloudinary);
userRouter.put("/:id",auth,updateUserDetails); //fait
userRouter.post("/mot-de-passe-oublie",forgotPasswordController); //fait
userRouter.post("/verification-mot-de-passe-oublie",verifyforgotPasswordController); //fait
userRouter.post("/modidification-de-mot-de-passe",refreshPassword); //fait
userRouter.post("/modidification-de-mot-de-passe2",refreshPassword2); //fait
userRouter.post("/generation-de-token",refreshToken);
userRouter.get("/liste-utilisateurs", auth, getAllUsers);
userRouter.get("/details-utilisateur",auth,userDetails); //fait
export default userRouter;*/}