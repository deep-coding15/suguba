export default function Badge({ status }) {
  const styles = {
    // Statuts commande globale
    "en-attente": "bg-orange-100 text-orange-700",
    "confirmé": "bg-blue-100 text-blue-700",
    "en-livraison": "bg-indigo-100 text-indigo-700",
    "livré": "bg-green-100 text-green-700",
    "annulé": "bg-red-100 text-red-700",
    // Statuts item (vendeur → Suguba)
    "emballé": "bg-cyan-100 text-cyan-700",
    "déposé-hub": "bg-purple-100 text-purple-700",
    "remboursé": "bg-gray-100 text-gray-700",
    // Paiement
    "payé": "bg-green-100 text-green-700",
    "échoué": "bg-red-100 text-red-700",
    // Utilisateurs
    "Active": "bg-green-100 text-green-700",
    "Suspended": "bg-red-100 text-red-700",
    "Inactive": "bg-gray-100 text-gray-600",
    // Vendeurs
    "active": "bg-green-100 text-green-700",
    "suspended": "bg-red-100 text-red-700",
    "pending": "bg-yellow-100 text-yellow-700",
  };

  const labels = {
    "en-attente": "En attente",
    "confirmé": "Confirmé",
    "en-livraison": "En livraison 🛵",
    "livré": "Livré ✅",
    "annulé": "Annulé",
    "emballé": "Emballé 📦",
    "déposé-hub": "Au hub 🏭",
    "remboursé": "Remboursé",
    "payé": "Payé",
    "échoué": "Échoué",
    "Active": "Actif",
    "Suspended": "Suspendu",
    "Inactive": "Inactif",
    "active": "Actif",
    "suspended": "Suspendu",
    "pending": "En attente",
  };

  return (
    <span className={`inline-block !py-1 !px-3 rounded-full text-[11px] font-[600] whitespace-nowrap ${styles[status] || "bg-gray-100 text-gray-600"}`}>
      {labels[status] || status}
    </span>
  );
}



{/*export default function Badge({ status }) {
  const styles = {
    "en-attente": "bg-orange-100 text-orange-700",
    "confirmé": "bg-blue-100 text-blue-700",
    "expédié": "bg-purple-100 text-purple-700",
    "livré": "bg-green-100 text-green-700",
    "annulé": "bg-red-100 text-red-700",
    "remboursé": "bg-gray-100 text-gray-700",
    "payé": "bg-green-100 text-green-700",
    "échoué": "bg-red-100 text-red-700",
    "Active": "bg-green-100 text-green-700",
    "Suspended": "bg-red-100 text-red-700",
    "Inactive": "bg-gray-100 text-gray-600",
    "active": "bg-green-100 text-green-700",
    "suspended": "bg-red-100 text-red-700",
    "pending": "bg-yellow-100 text-yellow-700",
  };
  return (
    <span className={`inline-block !py-1 !px-3 rounded-full text-[11px] font-[600] capitalize ${styles[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}




{/*export default function Badge(props){
               
        
    return(
    <>
    <span className={`inline-block !py-1 !px-4 rounded-full text-[11px]
     capitalize ${props.status==="en-attente" && "bg-orange-500 text-white"}
                ${props.status==="confirmé" && "bg-green-500 text-white"}
                ${props.status==="livré" && "bg-green-700 text-white"}`}>
                    {props.status}
  </span>
    </>
    )
}*/}