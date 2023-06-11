import axios from "axios";


const hellomoonClient = axios.create({
  baseURL: "https://rest-api.hellomoon.io",
  headers: {
    "Content-Type": "application/json", 
    "authorization": `Bearer ${process.env.NEXT_PUBLIC_HELLOMOON_API_KEY}`
  },
});

export default hellomoonClient;
