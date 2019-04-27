function getData(key) {
	return localStorage.getItem(key);
}

function saveData(key, value) {
	localStorage.setItem(key, value);
}

module.exports = {
	saveData: saveData,
	getData: getData,
};
