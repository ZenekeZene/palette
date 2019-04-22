let swatchesGrid = document.getElementById("swatchesGrid");
let mixesGrid = document.getElementById("mixesGrid");

let numberRows,
  numberCols,
  size = 0;
let cellNodes, mixNodes, swatchNodes, dropzoneNodes;

const changeCSSGrid = () => {
  document.documentElement.style.setProperty("--rowNum", numberRows);
  document.documentElement.style.setProperty("--colNum", numberCols);
};

function drawGrid(wrapperGrid) {
  while (wrapperGrid.firstChild) {
    wrapperGrid.removeChild(wrapperGrid.firstChild);
  }
  changeCSSGrid();
  let cellNodes = [];
  for (let i = 0; i < size; i++) {
    const cellNode = document.createElement("div");
    cellNode.classList.add("cell");
    cellNodes.push(cellNode);
    wrapperGrid.append(cellNode);
  }
  return cellNodes;
}

function fillGrid(wrapperGrid) {
  while (wrapperGrid.firstChild) {
    wrapperGrid.removeChild(wrapperGrid.firstChild);
  }
  let items = [];
  for (let i = 0; i < size; i++) {
    const itemNode = document.createElement("div");
    items.push(itemNode);
    itemNode.classList.add("swatch", `plswatches__swatch${i + 1}`);
    wrapperGrid.append(itemNode);
  }
  return items;
}

function init(numberOfItems) {
  size = numberOfItems;
  //cellNodes = drawGrid(swatchesGrid);
  //mixNodes = drawGrid(mixesGrid);
  swatchNodes = fillGrid(swatchesGrid);
  dropzoneNodes = fillGrid(mixesGrid);
  return {
    swatchNodes: swatchNodes,
    dropzoneNodes: dropzoneNodes
  };
}

const API = {
  init: init,
  changeCSSGrid: changeCSSGrid
};
module.exports = API;
