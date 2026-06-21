import MyListModel from "../models/myList.model.js";

export const addToMyListController = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      productId, productTitle, images, rating,
      price, oldPrice, brand, discount
    } = req.body;

    // Vérifications minimales
    if (!productId || !productTitle || !images || rating === undefined || price === undefined) {
      return res.status(400).json({
        message: "Données manquantes (productId, productTitle, images, rating, price requis)",
        success: false, error: true
      });
    }

    const item = await MyListModel.findOne({ userId, productId });
    if (item) {
      return res.status(400).json({
        message: "Produit déjà dans vos favoris",
        success: false, error: true
      });
    }

    const myList = new MyListModel({
      productId,
      productTitle,
      images,
      rating: rating || 0,
      price,
      oldPrice: oldPrice || 0,   // ✅ défaut 0 si absent
      brand: brand || "",         // ✅ défaut "" si absent
      discount: discount || 0,   // ✅ défaut 0 si absent
      userId
    });

    await myList.save();
    return res.status(200).json({
      message: "Produit ajouté avec succès à vos favoris",
      success: true, error: false
    });
  } catch (error) {
    console.error("addToMyList error:", error);
    return res.status(500).json({
      message: error.message || "ERREUR SURVENU",
      success: false, error: true
    });
  }
};

export const deleteMyListController = async (req, res) => {
  try {
    const myListItem = await MyListModel.findById(req.params.id);
    if (!myListItem) {
      return res.status(404).json({
        message: "Élément introuvable",
        success: false, error: true
      });
    }
    await MyListModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      message: "Élément supprimé avec succès",
      success: true, error: false
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "ERREUR SURVENU",
      success: false, error: true
    });
  }
};

export const getMyListController = async (req, res) => {
  try {
    const userId = req.userId;
    const MyListItem = await MyListModel.find({ userId });
    return res.status(200).json({ data: MyListItem, success: true, error: false });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "ERREUR SURVENU",
      success: false, error: true
    });
  }
};



{/*import MyListModel  from "../models/myList.model.js";

export const addToMyListController= async(req,res)=>{
    try {
        const userId=req.userId;
        const { productId, productTitle,images, rating,price, oldPrice, brand,discount}=req.body;
        const item=await MyListModel.findOne({
            userId:userId,
            productId:productId
        });
         if (item) {
            return res.status(404).json({ message: "produit deja dans vos favoris", success: false, error: true });   
        }
        const myList= new MyListModel({
            productId, productTitle,images, rating,price, oldPrice, brand,discount,userId
        })
        const save=await myList.save();
         return res.status(200).json({ message: "Produit ajouter avec succès", success:true, error:false });  
    } catch (error) {
      return res.status(500).json({ message: "ERREUR SURVENU", success: false, error: true });   
    }
}
export const deleteMyListController= async(req,res)=>{
    try {
         const myListItem=await MyListModel.findById(req.params.id);

        if (!myListItem) {
            return res.status(404).json({ message: "veuillez fournir un bon id ", success: false, error: true });   
        }
        const deleteItem= await  MyListModel.findByIdAndDelete(req.params.id);
         if (!deleteItem) {
            return res.status(404).json({ message: "produit non supprimer", success: false, error: true });   
        }
     return res.status(200).json({ message: "element supprimer avec succès", success:true, error:false });  
    }
     catch (error) {
      return res.status(500).json({ message: "ERREUR SURVENU", success: false, error: true });   
    }
}
export const getMyListController= async(req,res)=>{
    try {
        const userId=req.userId;
         const MyListItem=await MyListModel.find({
            userId:userId
        });
           return res.status(200).json({ data:MyListItem, success:true, error:false });  
    } catch (error) {
      return res.status(500).json({ message: "ERREUR SURVENU", success: false, error: true });   
    }
}*/}