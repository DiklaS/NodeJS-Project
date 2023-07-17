const normalizeUser = (userData) => {
  if (!userData.name) {
    userData.name = {};
  }
  userData.name = {
    ...userData.name,
    middleName: userData.name.middleName || "",
  };
  if (!userData.image) {
    userData.image = {};
  }
  userData.image = {
    url:
      userData.image.url ||
      "https://cdn.pixabay.com/photo/2020/04/07/17/01/chicks-5014152_960_720.jpg",
    alt: userData.image.alt || "yellow fluffy chickens",
  };
  if (!userData.address) {
    userData.address = {};
  }
  userData.address = {
    ...userData.address,
    state: userData.address.state || "not defined",
  }
  return {
    ...userData,
    /* address: {
      ...userData.address,
      state: userData.address.state || "not defined",
    }, */
  };
};

module.exports = normalizeUser;
