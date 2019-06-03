function getData(key) {
	return localStorage.getItem(key);
}

function saveData(key, value) {
	localStorage.setItem(key, value);
}

function removeData(key) {
	localStorage.removeItem(key);
}

module.exports = {
	saveData,
	getData,
	removeData,
};
