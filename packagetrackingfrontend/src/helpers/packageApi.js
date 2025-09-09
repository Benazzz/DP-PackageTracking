import api from "./api";

export const fetchPackages = async (params = {}) => {
  const response = await api.get("/Packages", { params });
  return response.data;
};

export const fetchPackageById = async (id) => {
  const response = await api.get(`/Packages/${id}`);
  return response.data;
};

export const changePackageStatus = async (id, newStatus) => {
  const response = await api.post(`/Packages/${id}/status`, newStatus);
  return response.data;
};

export const createPackage = async (packageData) => {
  const response = await api.post("/Packages", packageData);
  return response.data;
};
