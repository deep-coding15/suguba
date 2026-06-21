import mongoose from "mongoose";

const newsletterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, trim: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const NewsletterModel = mongoose.model("Newsletter", newsletterSchema);
export default NewsletterModel;