const VerificationEmail=({username,otp})=>{
    return`
     <!DOCTYPE html>
    <html lang="fr" dir="ltr">
    <head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title> Verification D'Email </title>
    <style>
    body{
    font-family: Arial,sans-serif;
    margin: 0 ;
    padding: 0;
    background-color:#f4f4f4;
    color:#333
    }
    .container{
    max-width:600px;
    margin:20px auto;
    background:#fff;
    padding:20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,01);
    }
    .header{
    border-bottom: 1px solid #eee;
    padding-bottom:10px;
    text-align:center;
    margin-bottom:24px;
    }
    .header h1{color: #4CAF50;}
    .content{ text-align:center;}
    .content p{
    font-size:16px;
     line-height:1.5;
    }
    .otp{
    font-size:20px;
    font-weight: bold;
    color: #4CAF50;
     margin: 20px 0 ;
    }
    .footer {
      text-align:center;
     font-size:14px;
      color: #777;
    margin-top:20px;}
     </style>
      </head>
       <body>
      <div class="container">
      <div class="header">
        <h1>Code de verification</h1>
       </div>
       <div class="content">
        <p>Bonjour ${username}, Merci pour votre inscription sur suguba.
        Veuillez s'il vous plaît utiliser le code ci dessous pour authentifier votre email </p>
        <div class="otp">${otp}</div>
         <p> Si vous n'ête pas à l'origine de cet inscription, veuillez tout simplement ignorer ce message.</p>
         </div>
     
      <div class="footer">
        <p>&copy; Suguba - projet de fin d'etudes </p>
     </div>
      </div>
       </body>
       </html>
    `;
};
export default  VerificationEmail;