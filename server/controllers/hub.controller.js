import HubModel from "../models/hub.model.js";

// GET /api/hubs — public
export async function getHubs(req, res) {
  try {
    const hubs = await HubModel.find({ isActive: true }).sort({ city: 1, name: 1 });
    return res.status(200).json({ success: true, error: false, data: hubs });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

// GET /api/hubs/all — admin
export async function getAllHubs(req, res) {
  try {
    const hubs = await HubModel.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, error: false, data: hubs });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

// POST /api/hubs — admin
export async function createHub(req, res) {
  try {
    const { name, address, city, phone, manager, hours, latitude, longitude, zone } = req.body;
    if (!name || !address || !city) {
      return res.status(400).json({ error: true, success: false, message: "Nom, adresse et ville requis" });
    }
    const hub = new HubModel({ name, address, city, phone, manager, hours, latitude, longitude, zone });
    await hub.save();
    return res.status(200).json({ success: true, error: false, message: "Hub créé avec succès", data: hub });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

// PUT /api/hubs/:id — admin
export async function updateHub(req, res) {
  try {
    const hub = await HubModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!hub) return res.status(404).json({ error: true, success: false, message: "Hub introuvable" });
    return res.status(200).json({ success: true, error: false, message: "Hub mis à jour", data: hub });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

// DELETE /api/hubs/:id — admin
export async function deleteHub(req, res) {
  try {
    const hub = await HubModel.findByIdAndDelete(req.params.id);
    if (!hub) return res.status(404).json({ error: true, success: false, message: "Hub introuvable" });
    return res.status(200).json({ success: true, error: false, message: "Hub supprimé" });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

// PATCH /api/hubs/:id/toggle — admin : activer/désactiver
export async function toggleHub(req, res) {
  try {
    const hub = await HubModel.findById(req.params.id);
    if (!hub) return res.status(404).json({ error: true, success: false, message: "Hub introuvable" });
    hub.isActive = !hub.isActive;
    await hub.save();
    return res.status(200).json({
      success: true, error: false,
      message: `Hub ${hub.isActive ? "activé" : "désactivé"}`,
      data: hub
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}