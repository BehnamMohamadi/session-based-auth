const getIranProvinces = async () => {
  try {
    const response = await fetch("https://iran-locations-api.ir/api/v1/en/states");
    const provincesData = await response.json();

    if (!response.ok) {
      throw await response.json();
    }

    const provinces = provincesData.map((item) => item.name.toLowerCase());

    return provinces;
  } catch (err) {
    throw err;
  }
};

module.exports = { getIranProvinces };
