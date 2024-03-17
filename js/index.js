// ⠀	⠁	⠂	⠃	⠄	⠅	⠆	⠇	⠈	⠉	⠊	⠋	⠌	⠍	⠎	⠏⠐
//    ⠑	⠒	⠓	⠔	⠕	⠖	⠗	⠘	⠙	⠚	⠛	⠜	⠝	⠞	⠟⠠
//  	⠡	⠢	⠣	⠤	⠥	⠦	⠧	⠨	⠩	⠪	⠫	⠬	⠭	⠮	⠯⠰
//    ⠱	⠲	⠳	⠴	⠵	⠶	⠷	⠸	⠹	⠺	⠻	⠼	⠽	⠾	⠿ ⣿

const input = document.querySelector("input[type=file]");
const img_in = document.querySelector(".img_in");
const opt_text = document.querySelector(".opt_text");
const copy_button = document.querySelector(".copy-button");

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const mid = 255 / 2;

function convertToBase64(image) {
  return new Promise((res, rej) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(image);

    fileReader.onload = () => res(fileReader.result);
    fileReader.onerror = (error) => res(fileReader.error);
  });
}

async function inputFileHandle() {
  const image = this.files[0];
  let imageBase64, img;

  while (true) {
    imageBase64 = await convertToBase64(image);

    img = new Image();
    img.src = imageBase64;

    if (img.width) {
      break;
    }
  }

  img_in.src = imageBase64;
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  opt_text.innerText = imageToASCII(canvas);
}

function imageToASCII(canvas) {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  const arr = convertPixelsToBlackAndWhite(pixels);

  imageData.data = pixels;

  cutTopBottom(arr);
  cutLeft(arr);
  cutRight(arr);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.putImageData(imageData, 0, 0);

  return createTextForACII(arr);
}

function cutTopBottom(arr) {
  for (let i = 0; i < arr.length; i++) {
    let j = 0;

    while (j < arr[i].length && arr[i][j] === 255) {
      j++;
    }

    if (j === arr[i].length) {
      arr.splice(i, 1);
      i--;
    }
  }
}

function cutLeft(arr) {
  for (let x = 0; x < arr[0].length; x++) {
    let y = 0;

    while (y < arr.length && arr[y][x] === 255) {
      y++;
    }

    if (y === arr.length) {
      for (let j = 0; j < arr.length; j++) {
        arr[j].splice(x, 1);
      }
      x--;
    } else break;
  }
}

function cutRight(arr) {
  for (let i = 0; i < arr.length; i++) {
    let j = arr[i].length - 1;
    while (j >= 0 && arr[i][j] === 255) {
      arr[i].splice(j, 1);
      j--;
    }
  }
}

function createTextForACII(arr) {
  let text = "";
  for (let i = 0; i < arr.length; i += 1) {
    for (let j = 0; j < arr[i].length; j += 1) {
      if (arr[i][j] === 255) {
        text += "⠀";
      } else if (arr[i][j] === 0) text += "0";
    }

    text += "\n";
  }

  return text;
}

function convertPixelsToBlackAndWhite(pixels) {
  const arr = [];

  for (let i = 0; i < canvas.height; i++) {
    arr[i] = [];

    for (let j = 0; j < canvas.width; j++) {
      const pixelIndex = i * canvas.width * 4 + j * 4;

      const red = pixels[pixelIndex];
      const green = pixels[pixelIndex + 1];
      const blue = pixels[pixelIndex + 2];

      const avargeColor = (red + green + blue) / 3;

      let color = 0;
      const offset = 0;

      if (avargeColor >= mid + offset) {
        color = 255;
      }

      pixels[pixelIndex] = color;
      pixels[pixelIndex + 1] = color;
      pixels[pixelIndex + 2] = color;
      pixels[pixelIndex + 3] = 255;

      arr[i].push(color);
    }
  }

  return arr;
}

input.addEventListener("change", inputFileHandle);
copy_button.addEventListener("click", () => {
  navigator.clipboard.writeText(opt_text.innerText);
});
