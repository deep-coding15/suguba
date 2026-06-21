import NewsletterModel from "../models/newsletter.model.js";
import sendEmailFun from "../config/sendEmail.js";

export async function subscribeNewsletter(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: true, success: false, message: "Email requis" });

    const existing = await NewsletterModel.findOne({ email });
    if (existing) return res.status(400).json({ error: true, success: false, message: "Vous êtes déjà inscrit !" });

    await new NewsletterModel({ email }).save();

    await sendEmailFun(email, "Bienvenue sur Suguba Newsletter", "",
      `<div style="font-family:Arial;padding:20px">
        <h2 style="color:#e77492">Bienvenue sur Suguba ! 🎉</h2>
        <p>Merci de vous être inscrit à notre newsletter.</p>
        <p>Vous recevrez les meilleures offres et nouveautés en avant-première.</p>
        <p style="color:#e77492;font-weight:bold">L'équipe Suguba</p>
      </div>`
    );

    return res.status(200).json({ success: true, error: false, message: "Inscription réussie ! Vérifiez votre email." });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

export async function getAllSubscribers(req, res) {
  try {
    const subscribers = await NewsletterModel.find({ isActive: true }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, error: false, data: subscribers });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}