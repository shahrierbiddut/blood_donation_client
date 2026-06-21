import api from "./api";

const LOCAL_LOCATION_BASE = "/location";

let cachedLocalData = null;

const extractRows = (dataset) => {
  if (!Array.isArray(dataset)) {
    return [];
  }

  const table = dataset.find((item) => item.type === "table" && Array.isArray(item.data));
  return table ? table.data : [];
};

const loadLocalLocationData = async () => {
  if (cachedLocalData) {
    return cachedLocalData;
  }

  const [divisionRes, districtRes, upazilaRes, unionRes] = await Promise.all([
    fetch(`${LOCAL_LOCATION_BASE}/division.json`),
    fetch(`${LOCAL_LOCATION_BASE}/district.json`),
    fetch(`${LOCAL_LOCATION_BASE}/upazila.json`),
    fetch(`${LOCAL_LOCATION_BASE}/unions.json`)
  ]);

  const [divisionJson, districtJson, upazilaJson, unionJson] = await Promise.all([
    divisionRes.json(),
    districtRes.json(),
    upazilaRes.json(),
    unionRes.json()
  ]);

  cachedLocalData = {
    divisions: extractRows(divisionJson),
    districts: extractRows(districtJson),
    upazilas: extractRows(upazilaJson),
    unions: extractRows(unionJson)
  };

  return cachedLocalData;
};

const locationService = {
  getDivisions: async () => {
    try {
      const response = await api.get("/location/divisions");
      return response.data?.data || [];
    } catch (error) {
      const localData = await loadLocalLocationData();
      return localData.divisions.map((item) => ({
        id: item.id,
        name: item.name,
        bn_name: item.bn_name
      }));
    }
  },

  getDistricts: async (divisionId) => {
    try {
      const response = await api.get(`/location/districts/${divisionId}`);
      return response.data?.data || [];
    } catch (error) {
      const localData = await loadLocalLocationData();
      return localData.districts
        .filter((item) => item.division_id === String(divisionId))
        .map((item) => ({
          id: item.id,
          name: item.name,
          bn_name: item.bn_name,
          division_id: item.division_id
        }));
    }
  },

  getUpazilas: async (districtId) => {
    try {
      const response = await api.get(`/location/upazilas/${districtId}`);
      return response.data?.data || [];
    } catch (error) {
      const localData = await loadLocalLocationData();
      return localData.upazilas
        .filter((item) => item.district_id === String(districtId))
        .map((item) => ({
          id: item.id,
          name: item.name,
          bn_name: item.bn_name,
          district_id: item.district_id
        }));
    }
  },

  getUnions: async (upazilaId) => {
    try {
      const response = await api.get(`/location/unions/${upazilaId}`);
      return response.data?.data || [];
    } catch (error) {
      const localData = await loadLocalLocationData();
      return localData.unions
        .filter((item) => item.upazilla_id === String(upazilaId))
        .map((item) => ({
          id: item.id,
          name: item.name,
          bn_name: item.bn_name,
          upazilla_id: item.upazilla_id
        }));
    }
  }
};

export default locationService;
