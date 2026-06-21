import mongoose from "mongoose";

const hubSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  phone: { type: String, default: "" },
  manager: { type: String, default: "" },
  hours: { type: String, default: "Lun–Sam : 8h–18h" },
  latitude: { type: Number, default: null },
  longitude: { type: Number, default: null },
  isActive: { type: Boolean, default: true },
  zone: { type: String, default: "" }, // ex: "Bamako Centre", "Bamako Rive Droite"
}, { timestamps: true });

const HubModel = mongoose.model("Hub", hubSchema);
export default HubModel;