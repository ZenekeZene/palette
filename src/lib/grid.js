let swatchesGrid = document.getElementById('swatchesGrid');
let mixesGrid = document.getElementById('mixesGrid');

let size = 0;
let swatchNodes, dropzoneNodes;

function fillGrid(wrapperGrid) {
	cleanGrid(wrapperGrid);
	let items = [];
	for (let i = 0; i < size; i++) {
		const itemNode = document.createElement('div');
		items.push(itemNode);
		itemNode.classList.add('swatch', `swatches__swatch${i + 1}`);
		wrapperGrid.append(itemNode);
	}
	return items;
}

function cleanAll() {
	cleanGrid(swatchesGrid);
	cleanGrid(mixesGrid);
}

function cleanGrid(wrapperGrid) {
	while (wrapperGrid.firstChild) {
		wrapperGrid.removeChild(wrapperGrid.firstChild);
	}
}

function init(numberOfItems) {
	size = numberOfItems;
	swatchNodes = fillGrid(swatchesGrid);
	dropzoneNodes = fillGrid(mixesGrid);
	return {
		swatchNodes,
		dropzoneNodes
	};
}

module.exports = {
	init,
	cleanGrid,
	cleanAll,
};
