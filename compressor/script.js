// ===============================
// Image Compressor Pro
// Part 1 - Upload, Drag & Drop, Preview
// ===============================

// Upload
const imageInput = document.getElementById("imageInput");
const chooseBtn = document.getElementById("chooseBtn");
const dropArea = document.getElementById("dropArea");

// Controls
const quality = document.getElementById("quality");
const qualityValue = document.getElementById("qualityValue");

const maxWidth = document.getElementById("maxWidth");
const maxHeight = document.getElementById("maxHeight");
const maxFileSize = document.getElementById("maxFileSize");

const compressBtn = document.getElementById("compressBtn");

// Preview
const originalPreview = document.getElementById("originalPreview");
const compressedPreview = document.getElementById("compressedPreview");

// Statistics
const originalSize = document.getElementById("originalSize");
const compressedSize = document.getElementById("compressedSize");
const savedPercent = document.getElementById("savedPercent");

// Progress
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

// Download
const downloadBtn = document.getElementById("downloadBtn");

// Global Variables
let selectedFile = null;

// ===============================
// Choose Button
// ===============================

chooseBtn.addEventListener("click", () => {

    imageInput.click();

});

// ===============================
// File Input
// ===============================

imageInput.addEventListener("change", (e) => {

    if (e.target.files.length > 0) {

        loadImage(e.target.files[0]);

    }

});

// ===============================
// Drag & Drop
// ===============================

dropArea.addEventListener("dragover", (e) => {

    e.preventDefault();

    dropArea.classList.add("dragover");

});

dropArea.addEventListener("dragleave", () => {

    dropArea.classList.remove("dragover");

});

dropArea.addEventListener("drop", (e) => {

    e.preventDefault();

    dropArea.classList.remove("dragover");

    if (e.dataTransfer.files.length > 0) {

        loadImage(e.dataTransfer.files[0]);

    }

});

// ===============================
// Load Image
// ===============================

function loadImage(file){

    if(!file.type.startsWith("image/")){

        alert("Please choose an image.");

        return;

    }

    selectedFile = file;

    originalSize.textContent = formatSize(file.size);

    compressedSize.textContent = "--";

    savedPercent.textContent = "--";

    downloadBtn.classList.remove("active");

    progressBar.style.width = "0%";

    progressText.textContent = "Ready";

    const reader = new FileReader();

    reader.onload = function(e){

        originalPreview.src = e.target.result;

        compressedPreview.src = "";

    }

    reader.readAsDataURL(file);

}

// ===============================
// Quality Slider
// ===============================

quality.addEventListener("input", () => {

    qualityValue.textContent = quality.value + "%";

});

// ===============================
// Format Size
// ===============================

function formatSize(bytes){

    if(bytes < 1024){

        return bytes + " B";

    }

    if(bytes < 1024 * 1024){

        return (bytes / 1024).toFixed(2) + " KB";

    }

    return (bytes / 1024 / 1024).toFixed(2) + " MB";

}



// ===============================
// Part 2 - Compression Engine
// ===============================

compressBtn.addEventListener("click", () => {

    if (!selectedFile) {
        alert("Please choose an image first.");
        return;
    }

    progressBar.style.width = "10%";
    progressText.textContent = "Compressing...";

    const img = new Image();

    img.onload = function () {

        let width = img.width;
        let height = img.height;

        // Max Width & Height
        const maxW = parseInt(maxWidth.value);
        const maxH = parseInt(maxHeight.value);

        const ratio = Math.min(
            maxW / width,
            maxH / height,
            1
        );

        width = Math.round(width * ratio);
        height = Math.round(height * ratio);

        // Canvas
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Max File Size
        const targetSize = parseInt(maxFileSize.value) * 1024;

        let currentQuality =
            quality.value / 100;

        compressImage();

        function compressImage() {

            canvas.toBlob(function (blob) {

                if (!blob) {
                    alert("Compression failed.");
                    return;
                }

 
               progressBar.style.width = "70%";

               if(blob.size > targetSize && currentQuality > 0.05){

    currentQuality -= 0.05;

    compressImage();

    return;
}
                const url =
                    URL.createObjectURL(blob);

                compressedPreview.src = url;

                compressedSize.textContent =
                    formatSize(blob.size);

                const saved =
                    ((selectedFile.size - blob.size) /
                    selectedFile.size) * 100;

                savedPercent.textContent =
                    saved.toFixed(1) + "%";

                downloadBtn.href = url;
               downloadBtn.classList.add("active");
progressBar.style.width = "100%";
progressText.textContent = "Completed ✅";

                          },
            "image/jpeg",
            currentQuality);

        } compressImage();


    };

    img.src = URL.createObjectURL(selectedFile);

});

// ===============================
// Back To Top Button
// ===============================

const topBtn = document.getElementById("topBtn");

// Show button when scrolling
window.addEventListener("scroll", () => {

    if (window.scrollY > 300) {

        topBtn.style.display = "block";

    } else {

        topBtn.style.display = "none";

    }

});

// Scroll to top smoothly
topBtn.addEventListener("click", () => {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

});
// ===============================
// Dark Mode
// ===============================

const themeToggle = document.getElementById("themeToggle");

// Load saved theme
if(localStorage.getItem("theme") === "dark"){

    document.body.classList.add("dark");

    themeToggle.textContent = "☀️";

}

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        themeToggle.textContent = "☀️";

        localStorage.setItem("theme","dark");

    }else{

        themeToggle.textContent = "🌙";

        localStorage.setItem("theme","light");

    }

});

