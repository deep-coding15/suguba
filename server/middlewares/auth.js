import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
   try {
      const authHeader=req?.headers?.authorization;
     const token=req.cookies.accesstoken || (authHeader && authHeader.startsWith("Bearer") ? authHeader.split(" ")[1]: null);

     // if (!token) {token=req.query.token;}
      if (!token) {
         return res.status(401).json({
            message: "session expirée,veuillez vous reconnecter",
            success: false,
            error: true
         });
      }

      const decode = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);

      if (!decode) {
         return res.status(401).json({
            message: "Accès non autorisé",
            success: false,
            error: true
         });
      }

      req.userId =decode.id;

      next();

   } catch (error) {
      return res.status(401).json({
         message: "Accès refusé",
         success: false,
         error: true
      });
   }
};

export default auth;
/*import jwt from "jsonwebtoken"
const auth=async (req,res,next) => {
    try {
        const token=req.cookies.accesstoken || req?.headers?.authorization?.split(" ")[1];
         if (!token) {
       return res.status(401).json({
          message:"provide token"
           })  }
           const decode= await jwt.verify(token,process.env.JSON_WEB_TOKEN_SECRET_KEY)
            if (!decode) {
        return res.status(401).json({
          message:"acces non autoriser", success:false,
                error:true
           })  }
           req.userId=decode.id
           next()
} catch (error) {
        return res.status(500).json({
                message:"vous n'êtes pas connecter",
                success:false,
                error:true
            })
    }
}
export default auth*/