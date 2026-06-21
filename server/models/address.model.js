import mongoose from "mongoose";

const addressSchema=mongoose.Schema({
    addresse:{
        type:String,
        default:""
    },
      pays:{
        type:String,
        default:""
    },
    ville:{
        type:String,
        default:""
    },
      region:{
        type:String
    },
    quartier:{
        type:String
    },
    mobile:{
        type:Number,
        default:null
    },
    userId: {
            type:mongoose.Schema.ObjectId,
             default:null
        }
    },
  {timestamps:true}
);


const AddressModel=mongoose.model("address",addressSchema);

export default AddressModel