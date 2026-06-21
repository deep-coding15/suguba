import axios from "axios";
const apiUrl=import.meta.env.VITE_API_URL;

 export const postData=async (url,formData) => {
    try {
        const response=await fetch(apiUrl+url,{
            method:"POST",
            headers:{
                "Authorization":`Bearer ${localStorage.getItem("accesstoken")}`,
                "Content-Type":"application/json",
            },
            body:JSON.stringify(formData)
        });
        if (response.ok) {
            const data =await response.json();
            return data;
        }else{
          const errorData= await response.json();
          return errorData;
        }
    } catch (error) {
        console.log("Erreur:",error);
    }
 }

 export const fetchDataFromApi = async (url) => {
  try {
    const params = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.get(apiUrl + url, params);
    return data;

  } catch (error) {
    console.log("Erreur API:", error.response?.data || error.message);

    return {
      success: false,
      error: true,
      message: error.response?.data?.message || "Erreur API"
    };
  }
};
 export const uploadImages=async (url,updateData) => {
    try {
        const params={
           headers:{
            "Authorization":`Bearer ${localStorage.getItem("accesstoken")}`,
            "Content-Type":"multipart/form-data",
           }}
           var response;
        await axios.put(apiUrl + url,updateData,params).then((res)=>{
                              //console.log(res);
                               response=res;
                           })
        return response;
    } catch (error) {
        console.log("Erreur:",error);
        return error;
    }
 }
 export const editImages=async (url,updateData) => {
    try {
        const params={
           headers:{
            "Authorization":`Bearer ${localStorage.getItem("accesstoken")}`,
            "Content-Type":"application/json",
           }}
           var response;
        await axios.put(apiUrl + url,updateData,params).then((res)=>{
                              //console.log(res);
                               response=res;
                           })
        return response;
    } catch (error) {
        console.log("Erreur:",error);
        return error;
    }
 }
  export const deleteData1=async (url,updateData) => {
    try {
        const params={
           headers:{
            "Authorization":`Bearer ${localStorage.getItem("accesstoken")}`,
            "Content-Type":"application/json",
           }}
         
   
const { data } = await axios.delete(apiUrl + url, params);
return data;          
       
    } catch (error) {
        console.log("Erreur:",error);
        return error;
    }
 }
 export const deleteData = async (url, body = {}) => {
  try {
    const response = await fetch(import.meta.env.VITE_API_URL + url, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("accesstoken")}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Erreur:", error);
    return error;
  }
};
export const uploadImageCatProd = async (url, formData) => {
    try {
        const response = await axios.post(apiUrl + url, formData, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("accesstoken")}`,
                "Content-Type":"multipart/form-data",
                // avec le bon boundary pour multipart/form-data
            }
        });
        return response;
    } catch (error) {
        console.log("Erreur:", error);
        return error;
    }
}
{/* export const fetchDataFromApi=async (url) => {
    try {
        const params={
           headers:{
            "Authorization":`Bearer ${localStorage.getItem("accesstoken")}`,
            "Content-Type":"application/json",
           }}
        const {data} =await axios.get(apiUrl + url,params);
        return data;
    } catch (error) {
        console.log("Erreur:",error);
        return error;
    }
 } */}