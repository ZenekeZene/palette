import { mutations } from '../common';

const levelCurrent = mutations.getLevel();

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

function init(sizeEntry) {
	size = sizeEntry;
	swatchNodes = fillGrid(swatchesGrid);
	if (levelCurrent < 5) {
		swatchesGrid.classList.add('initial');
	} else {
		swatchesGrid.classList.remove('initial');
	}
	dropzoneNodes = fillGrid(mixesGrid);
	return {
		swatchNodes,
		dropzoneNodes
	};
}

const grid = {
	init,
	cleanGrid,
	cleanAll,
}
export default grid;
