import { provincesData } from "../lib/provincesData";

// Function to sort an array of strings in Thai order
export const sortByThaiOrder = (arr) =>
  arr.slice().sort((a, b) => a.localeCompare(b, "th"));

// Function to get districts based on selected province
export const getDistrictsByProvince = (province) => {
  const provinceData = provincesData.find((p) => p.name === province);
  return provinceData
    ? sortByThaiOrder(provinceData.districts.map((d) => d.name))
    : [];
};

// Function to get subdistricts (แขวง) based on selected province and district
export const getSubdistrictsByDistrict = (province, district) => {
  const districtData = provincesData
    .find((p) => p.name === province)
    ?.districts.find((d) => d.name === district);
  return districtData ? sortByThaiOrder(districtData.subdistricts) : [];
};

// Optional: Function to get all subdistricts (แขวง) for a province
export const getAllSubdistrictsByProvince = (province) => {
  const provinceData = provincesData.find((p) => p.name === province);
  if (provinceData) {
    return provinceData.districts.flatMap((d) => d.subdistricts);
  }
  return [];
};
