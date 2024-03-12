const input = document.querySelector("input[type=file]");
const img_in = document.querySelector(".img_in");
const opt_text = document.querySelector(".opt_text");

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
    img_in.src = imageBase64;

    if (img.width) {
      break;
    }
  }

  canvas.width = img.width;
  canvas.height = img.height;

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const text = imageToASCII();
  opt_text.innerText = text;
}

function imageToASCII() {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  const arr = [];
  let text = "";

  for (let i = 0; i < canvas.height; i++) {
    arr[i] = [];

    for (let j = 0; j < canvas.width; j++) {
      const pixelIndex = i * canvas.width * 4 + j * 4;

      const red = pixels[pixelIndex];
      const green = pixels[pixelIndex + 1];
      const blue = pixels[pixelIndex + 2];

      const avargeColor = (red + green + blue) / 3;

      let color = 0;
      const offset = 20;

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

  imageData.data = pixels;

  console.log(arr);

  for (const element of arr) {
    for (let j = 0; j < element.length; j++) {
      if (element[j]) {
        text += "   ";
      } else text += " ■ ";
    }

    text += "\n";
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.putImageData(imageData, 0, 0);

  return text;
}

input.addEventListener("change", inputFileHandle);
