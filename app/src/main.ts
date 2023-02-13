//@ts-nocheck
import "./style.css";
import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";
import mergeImages from "merge-images";

let CROPPED_IMAGE_B64;
let IMG_PREVIEW_EL;
let IMG_CONTAINER_EL = document.querySelector(".img-container");
let ALREADY_DOWNSCALED = false;
let DOWNLOAD_EL;
// prod on github
let BASE_URL = "/";
// let BASE_URL = "";
console.log(window.location.pathname);

// document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
//   <div>
//     <a href="https://vitejs.dev" target="_blank">
//       <img src="/vite.svg" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://www.typescriptlang.org/" target="_blank">
//       <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
//     </a>
//     <h1>Vite + TypeScript</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite and TypeScript logos to learn more
//     </p>
//   </div>
// `

// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)

// Global variables:
// think about "destroyoing" cropper after usage
let cropper: Cropper;

const imgSettings = {
  rotation: 0,
};

// END global variables

function resetSettings() {
  imgSettings.rotation = 0;
}

function rotateRight() {
  if (!cropper) return;
  imgSettings.rotation += 90;
  cropper.rotate(imgSettings.rotation);
}

function rotateLeft() {
  if (!cropper) return;
  imgSettings.rotation -= 90;
  cropper.rotate(imgSettings.rotation);
}

function done() {
  if (!cropper) return;

  document.getElementById("toolbar").classList.add("hidden");
  console.log(cropper.getImageData());
  const croppedImgCanvas = cropper.getCroppedCanvas();
  CROPPED_IMAGE_B64 = croppedImgCanvas.toDataURL();
  const cont = document.querySelector(".final");
  // cont?.appendChild(croppedImgCanvas);
  let img = new Image();

  img.addEventListener("load", () => {
    if (ALREADY_DOWNSCALED) return;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 1080;
    canvas.height = 1080;

    ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
    //IMAGE_AS_B64 = canvas.toDataURL();
    img.src = canvas.toDataURL();
    CROPPED_IMAGE_B64 = canvas.toDataURL();
    IMG_PREVIEW_EL.src = CROPPED_IMAGE_B64;
    ALREADY_DOWNSCALED = true;
    // imageContainer?.appendChild(img);
  });
  img.src = CROPPED_IMAGE_B64;

  cropper.destroy();
  cropper = undefined;
  const imageContainer = document.querySelector(".img-container");

  const filterContainer = document.querySelector(".filter-selection");

  let filters = [
    `${BASE_URL}filter_1_queer_split.png`,
    `${BASE_URL}filter_1_hard_split.png`,
    `${BASE_URL}filter_1_smooth_split.png`,
    `${BASE_URL}filter_2_queer_split.png`,
    `${BASE_URL}filter_2_hard_split.png`,
    `${BASE_URL}filter_2_smooth_split.png`,
    `${BASE_URL}filter_3_hard_split.png`,
    `${BASE_URL}filter_3_smooth_split.png`,
    `${BASE_URL}filter_3_queer_split.png`,
    `${BASE_URL}filter_4_hard_split.png`,
    `${BASE_URL}filter_4_smooth_split.png`,
    `${BASE_URL}filter_4_queer_split.png`,
    // `${BASE_URL}filter_1.png`,
    // `${BASE_URL}filter_2.png`,
    // `${BASE_URL}filter_3.png`,
    // `${BASE_URL}filter_4.png`,
  ];

  for (let i = 0; i < filters.length; i++) {
    let img = new Image();
    img.className = "item";
    img.src = filters[i];
    img.id = filters[i];
    filterContainer?.appendChild(img);
  }
  document.getElementById("ansage").innerHTML = "Filter auswählen";
}

function reset() {
  window.location.reload();
}

async function applyFilter(e) {
  const prom = await mergeImages([
    { src: CROPPED_IMAGE_B64 },
    { src: e.target.id },
  ]);
  IMG_PREVIEW_EL.src = prom;
  let download = document.getElementById("download");
  download.classList.remove("hidden");
  document.getElementById("reset2").classList.remove("hidden");
  document.getElementById("ansage").innerHTML = `Bild speichern.`;
  document.getElementById(
    "ansage_klein"
  ).innerHTML = `Am Handy einfach lange auf das Bild tippen und "in Galerie speichern" auswählen`;

  let a = document.createElement("a");
  a.href = prom;
  a.download = "#wiederlegen2503#mz2503";
  a.classList.add("hidden");
  DOWNLOAD_EL = a;
}

function download() {
  if (!DOWNLOAD_EL) return;
  document.body.appendChild(DOWNLOAD_EL);
  DOWNLOAD_EL.click();
  document.body.removeChild(DOWNLOAD_EL);
}

function onUpload(e) {
  if (cropper) return;
  // create and "paint" canvas, attach to DOM, fire
  // custom event, attach "setupCropper" to custom event
  let fr = new FileReader();

  fr.onload = (e) => {
    const imageContainer = document.querySelector(".img-container");

    let IMG = new Image();
    IMG.id = "img";
    IMG.class = "preview";
    IMG.src = e.target?.result;
    IMG_CONTAINER_EL?.appendChild(IMG);
    IMG_PREVIEW_EL = IMG;

    const evt = new Event("cstm-imageupload");

    // pass image element here
    //@ts-ignore
    evt.imgdata = {
      elementID: "test",
      img: IMG,
    };
    console.log(evt);
    window.dispatchEvent(evt);
    let fileuploadContainer = document.querySelector(".button-wrap");
    fileuploadContainer.removeChild(document.getElementById("upload"));
  };
  fr.readAsDataURL(this.files[0]);
  document.getElementById("ansage").innerHTML = "Bild zuschneiden";
}

function setupCropper(e) {
  console.log("worked");

  cropper = new Cropper(e.imgdata.img, {
    dragMode: "move",
    aspectRatio: 1 / 1,
    autoCropArea: 1,
    restore: true,
    guides: false,
    center: true,
    highlight: false,
    cropBoxMovable: false,
    cropBoxResizable: false,
    toggleDragModeOnDblclick: false,
    viewMode: 1,
  });
  console.log(cropper);
  document.getElementById("toolbar")?.classList.remove("hidden");
}
// upload image, fires uploaded image event
const uploadButton = document.getElementById("upload");
uploadButton?.addEventListener("change", onUpload);

// rotate image
const rotateLeftButton = document.getElementById("rotate-left");
rotateLeftButton?.addEventListener("click", rotateLeft);

const rotateRightButton = document.getElementById("rotate-right");
rotateRightButton?.addEventListener("click", rotateRight);

const doneButton = document.getElementById("done");
doneButton?.addEventListener("click", done);

document.getElementById("reset")?.addEventListener("click", reset);
document.getElementById("download")?.addEventListener("click", download);

// setup cropper/image editing
window.addEventListener("cstm-imageupload", setupCropper);
// dev
//window.addEventListener("DOMContentLoaded", setupCropper);
document.body.addEventListener("click", (event) => {
  if (event.target.id.toString().includes("/filter_")) {
    applyFilter(event);
  } else if (event.target.id.toString().includes("reset")) {
    reset();
  }
});
