function getData(key) {
  return localStorage.getItem(key);
}

function saveData(key, value) {
  localStorage.setItem(key, value);
}

const API = {
  saveData: saveData,
  getData: getData
};

module.exports = API;
