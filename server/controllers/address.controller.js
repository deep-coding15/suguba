import AddressModel from "../models/address.model.js";
import UserModel from "../models/user.model.js";

export const addAddressController=async (req,res) => {
    try {
        const {addresse,pays,ville,region,quartier,mobile,userId}=req.body;
        const address=new AddressModel({addresse,pays,ville,region,quartier,mobile,userId})
        const saveAddress=await address.save();
       
     await UserModel.updateOne({_id: userId}, {
               $push: { address_details: saveAddress?._id }
                })
        
         return res.status(200).json({
                data:saveAddress,
                success:true,
                error:false,
                message:"Addresse ajouter avec succès",
                
            });
    } catch (error) {
        return res.status(500).json({
                message:error.message || error,
                success:false,
                error:true
            })
    }
}
export const getAddressController=async (req,res) => {
    try {
        const address=await AddressModel.find({userId:req?.query?.userId});
        if (!address) {
             return res.status(400).json({
                success:false,
                error:true,
                message:"Addresse non trouver",
                
            });
        }else{
            const update=await UserModel.updateOne({_id:req?.query?.userId},{
                $push:{
                address:address?._id
            }
            })
        }
         return res.status(200).json({
                data:address,
                success:true,
                error:false,
                
            });
    } catch (error) {
        return res.status(500).json({
                message:error.message || error,
                success:false,
                error:true
            })
    }
}
// ✅ deleteAddressController corrigé
export const deleteAddressController = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;

        if (!id) {
            return res.status(404).json({ message: "veuillez fournir id", success: false, error: true });
        }

        const deleteItem = await AddressModel.deleteOne({ _id: id, userId: userId });

        if (!deleteItem) {
            return res.status(404).json({ message: "Addresse introuvable", success: false, error: true });
        }

        // ✅ Retirer l'id de address_details dans UserModel
        await UserModel.updateOne(
            { _id: userId },
            { $pull: { address_details: id } }
        );

        return res.status(200).json({ message: "Addresse supprimée avec succès", data: deleteItem, success: true, error: false });

    } catch (error) {
        return res.status(500).json({ message: "ERREUR SURVENU", success: false, error: true });
    }
}