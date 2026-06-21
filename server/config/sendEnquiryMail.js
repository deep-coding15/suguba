const {Resend}=require("resend");

const CustomerEnquiryEmail=(name,productName,productSpecification)=>{
    return `
    <!DOCTYPE html>
    <html lang="fr" dir="ltr">
    <head>
    <meta charset="UTF-8"/>
    <title> Enquiry Confirmation </title>
    <link href="" rel="stylesheet="/>
    <style>
    body{font-family: "Roboto,verdana,sans-serif;}
    .container{
    max-width:600px;
    margin:0 auto;
    padding:20px;
    }
    .heading{font-size:24px;
    margin-bottom:20px
    }
    .text{
    font-size:16px;
    line-height:1.5;
    }
    .details{margin:20px 0;}
     </style>
      </head>
      <body>
      <div class="container">
      <h2 class="heading">Bonjour ${name}, </h2>
      <p class="text">Merci pour votre interêt concernat les produits suivants:
      </p>
       <div class="details">
      <p><strong> Nom du Produit:</strong> ${productName} </p>
       <p><strong> Detail du Produit:</strong> ${productSpecification} </p>
      </div>
       <p class="text">Notre equique va consulter votre requête et vous faire un retour dans les plus brefs delais.
       si vous avez d'autres questions,n'hesitez pas à nous les faire part.
      </p>
       <p class="text"> Merci pour votre interêt.
      </p>
      </div>
       </body>
       </html>
    `;
};

const AdminEnquiryEmail=(name,email,phone,productName,productSpecification)=>{
    return `
    <!DOCTYPE html>
    <html lang="fr" dir="ltr">
    <head>
    <meta charset="UTF-8"/>
    <title>Reception de nouvelles requêtes </title>
    <link href="" rel="stylesheet="/>
    <style>
    body{
    font-family: "Roboto,verdana,sans-serif;}
    .container{
    max-width:600px;
    margin:0 auto;
    padding:20px;
    }
    .heading{
    font-size:24px;
    margin-bottom:20px
    }
    .text{
    font-size:16px;
    line-height:1.5;
    }
    .details{
    margin:20px 0;
    }
     </style>
      </head>
      <body>
      <div class="container">
      <h2 class="heading">Reception d'une nouvelle requete, </h2>
      <p class="text">Une nouvelle requête a été soumis avec les details suivants:
      </p>
       <div class="details">
      <p><strong> Nom :</strong> ${name} </p>
       <p><strong>Email:</strong>${email} </p>
        <p><strong>Numero:</strong> ${phone}</p>
         <p><strong>Nom du produit:</strong>${productName} </p>
          <p><strong>Details sur le produit:</strong>${productSpecification} </p>
      </div>
       <p class="text"> Veuillez consulter cette requete et repondre au client le plus tôt possible.
      </p>
       <p class="text"> À très vite
      </p>
      </div>
       </body>
       </html>
    `;
};

const resend = new Resend(process.env.RESEND_API_KEY);

exports.enquiryMailToAdmin=async(data)=>{
    try {
        await resend.emails.send({
            from:"onboarding@resend.dev",
            to:"abcd@gmailcom",
            subject:"Ecommerce|| New enquiry received",
            html:AdminEnquiryEmail(data.name,data.email,data.phone,data.productName,data.productSpecification),
        });
        return{
            success:true,message:"Email envoyer avec succes"
        }
    } catch (error) {
        console.log("Erreur survenu",error);
         return{
            success:false,message:"Email non envoyer"
        }
    }
};

exports.enquiryMailToCustomer=async(data)=>{
    try {
        await resend.emails.send({
            from:"onboarding@resend.dev",
            to:data.email,
            subject:"Ecommerce|| enquiry confirmed",
            html:CustomerEnquiryEmail(data.name,data.productName,data.productSpecification),
        });
        return{
            success:true,message:"Email envoyer avec succes"
        }
    } catch (error) {
        console.log("Erreur survenu",error);
         return{
            success:false,message:"Email non envoyer"
        }
    }
};
