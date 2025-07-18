import axios from "axios";

export const getTags = async () => {
  const response = await axios.get("/api/tags");
  return response.data;
};
