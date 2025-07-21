import axios from "./axiosInstance";

export const fetchTags = () => axios.get("/tags").then((res) => res.data || []);
