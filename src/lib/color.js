function ColorObject(cmyk, nodeElement) {
  this.cmyk = cmyk;
  this.nodeElement = nodeElement;
  this.setCMYK(cmyk);
  this.isEnabled = true;
}

ColorObject.prototype.getCMYK = function() {
  if (this.nodeElement) {
    return JSON.parse("[" + this.nodeElement.getAttribute("data-cmyk") + "]");
  }
  return null;
};

ColorObject.prototype.setCMYK = function(cmyk) {
  this.cmyk = cmyk;
  this.nodeElement.setAttribute("data-cmyk", cmyk);
  while (this.nodeElement.firstChild) {
    this.nodeElement.firstChild.remove();
  }
  const cmykNode = document.createElement("span");
  cmykNode.classList.add("swatch__cmyk");
  cmykNode.innerHTML = cmyk;
  this.nodeElement.append(cmykNode);
  this.nodeElement.style.backgroundColor = getRGBColor(convertCMYKtoRGB(cmyk));
};

ColorObject.prototype.isMyNode = function(nodeElement) {
  return this.nodeElement === nodeElement;
};

function getRandomInterval(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRGBColor(RGBArray) {
  return `rgb(${RGBArray[0]}, ${RGBArray[1]}, ${RGBArray[2]})`;
}

function convertCMYKtoRGB(cmyk) {
  var color = [];
  color.push(255 * (1 - cmyk[0] / 100) * (1 - cmyk[3] / 100));
  color.push(255 * (1 - cmyk[1] / 100) * (1 - cmyk[3] / 100));
  color.push(255 * (1 - cmyk[2] / 100) * (1 - cmyk[3] / 100));
  return color;
  //return convert.cmyk.rgb(`${cmyk[0]}%`, `${cmyk[1]}%`, `${cmyk[2]}%`, `${cmyk[3]}%`);
}

function getColorCMYKRandom() {
  const cmyk = [];
  cmyk.push(getRandomInterval(0, 100));
  cmyk.push(getRandomInterval(0, 100));
  cmyk.push(getRandomInterval(0, 100));
  cmyk.push(0);
  if (cmyk[0] === 100 && cmyk[1] === 100 && cmyk[2] === 100) {
    getColorCMYKRandom();
  }
  return cmyk;
}

function getColorRelationed(cmyk) {
  let colorRelationed = [];
  for (let i = 0; i < cmyk.length; i++) {
    const percentage = Math.random(0, 1).toFixed(2);
    const result = parseInt(cmyk[i] * percentage, 10);
    colorRelationed.push(result);
  }
  return colorRelationed;
}

function addColors(color1, color2) {
  if (color1.length === color2.length) {
    let color = [];
    for (let i = 0; i < color1.length; i++) {
      const add = parseInt(color1[i], 10) + parseInt(color2[i], 10);
      color.push(add < 100 ? add : 100);
    }
    return color;
  }
  return null;
}

function subtractColors(color1, color2) {
  if (color1.length === color2.length) {
    let color = [];
    for (let i = 0; i < color1.length; i++) {
      const sub = parseInt(color1[i], 10) - parseInt(color2[i], 10);
      color.push(sub > 0 ? sub : 0);
    }
    return color;
  }
  return null;
}

const API = {
  ColorObject: ColorObject,
  getRGBColor: getRGBColor,
  convertCMYKtoRGB: convertCMYKtoRGB,
  getColorCMYKRandom: getColorCMYKRandom,
  getColorRelationed: getColorRelationed,
  addColors: addColors,
  subtractColors: subtractColors,
  getRandomInterval: getRandomInterval
};

module.exports = API;
