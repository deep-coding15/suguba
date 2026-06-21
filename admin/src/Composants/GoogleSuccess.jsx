import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useContext } from "react";
import { MyContext } from "../App.jsx";

export default function GoogleSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const context = useContext(MyContext);

  useEffect(() => {
    const accesstoken = searchParams.get("accesstoken");
    const refreshtoken = searchParams.get("refreshtoken");

    if (accesstoken && refreshtoken) {
      localStorage.setItem("accesstoken", accesstoken);
      localStorage.setItem("refreshtoken", refreshtoken);
      context.setIsLogin(true);
      context.alertBox("success", "Connecté avec Google !");
      navigate("/dashbord");
    } else {
      context.alertBox("error", "Échec de la connexion Google");
      navigate("/connexion");
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Connexion en cours...</p>
    </div>
  );
}