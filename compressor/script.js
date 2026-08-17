/* =========================================================
   IMAGE COMPRESSOR PRO
   Main JavaScript
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const imageInput = document.getElementById("imageInput");
const chooseBtn = document.getElementById("chooseBtn");
const dropArea = document.getElementById("dropArea");

const fileInfo = document.getElementById("fileInfo");
const fileName = document.getElementById("fileName");
const fileOriginalInfo = document.getElementById("fileOriginalInfo");
const removeFileBtn = document.getElementById("removeFileBtn");

const quality = document.getElementById("quality");
const qualityValue = document.getElementById("qualityValue");

const maxWidth = document.getElementById("maxWidth");
const maxHeight = document.getElementById("maxHeight");
const maxFileSize = document.getElementById("maxFileSize");
const outputFormat = document.getElementById("outputFormat");

const compressBtn = document.getElementById("compressBtn");

const originalPreview = document.getElementById("originalPreview");
const compressedPreview = document.getElementById("compressedPreview");

const originalSize = document.getElementById("originalSize");
const compressedSize = document.getElementById("compressedSize");
const savedPercent = document.getElementById("savedPercent");

const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

const downloadBtn = document.getElementById("downloadBtn");

const themeToggle = document.getElementById("themeToggle");

const mobileMenuBtn =
    document.getElementById("mobileMenuBtn");

const navRight =
    document.querySelector(".nav-right");

const topBtn =
    document.getElementById("topBtn");


/* =========================================================
   VARIABLES
========================================================= */

let selectedFile = null;

let compressedBlob = null;

let originalObjectUrl = null;

let compressedObjectUrl = null;


/* =========================================================
   FILE TYPES
========================================================= */

const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp"
];


/* =========================================================
   CHOOSE IMAGE
========================================================= */

if (chooseBtn && imageInput) {

    chooseBtn.addEventListener("click", () => {

        imageInput.click();

    });

}


/* =========================================================
   FILE INPUT
========================================================= */

if (imageInput) {

    imageInput.addEventListener("change", event => {

        const file = event.target.files[0];

        if (file) {

            loadImage(file);

        }

    });

}


/* =========================================================
   DRAG OVER
========================================================= */

if (dropArea) {

    dropArea.addEventListener("dragover", event => {

        event.preventDefault();

        dropArea.classList.add("dragover");

    });


    dropArea.addEventListener("dragleave", () => {

        dropArea.classList.remove("dragover");

    });


    dropArea.addEventListener("drop", event => {

        event.preventDefault();

        dropArea.classList.remove("dragover");

        const file =
            event.dataTransfer.files[0];

        if (file) {

            loadImage(file);

        }

    });

}


/* =========================================================
   LOAD IMAGE
========================================================= */

function loadImage(file) {

    if (!allowedTypes.includes(file.type)) {

        alert(
            "Please select a JPG, PNG or WEBP image."
        );

        return;
    }


    if (file.size === 0) {

        alert(
            "The selected file appears to be empty."
        );

        return;
    }


    selectedFile = file;


    revokeObjectUrls();


    originalObjectUrl =
        URL.createObjectURL(file);


    originalPreview.src =
        originalObjectUrl;


    compressedPreview.removeAttribute("src");


    fileName.textContent =
        file.name;


    fileOriginalInfo.textContent =
        `${formatSize(file.size)} • ${getExtension(file.type)}`;


    fileInfo.classList.remove("hidden");


    originalSize.textContent =
        formatSize(file.size);


    compressedSize.textContent =
        "--";


    savedPercent.textContent =
        "--";


    compressedBlob = null;


    downloadBtn.classList.remove("active");

    downloadBtn.removeAttribute("href");


    progressBar.style.width =
        "0%";


    progressText.textContent =
        "Ready to compress";


    /*
     * Scroll gently toward the settings
     * after selecting a file.
     */

    setTimeout(() => {

        const settings =
            document.querySelector(".settings-wrapper");

        if (settings) {

            settings.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    }, 100);

}


/* =========================================================
   REMOVE FILE
========================================================= */

if (removeFileBtn) {

    removeFileBtn.addEventListener(
        "click",
        resetTool
    );

}


function resetTool() {

    selectedFile = null;

    compressedBlob = null;


    revokeObjectUrls();


    if (imageInput) {

        imageInput.value = "";

    }


    originalPreview.removeAttribute("src");

    compressedPreview.removeAttribute("src");


    fileInfo.classList.add("hidden");


    originalSize.textContent =
        "--";


    compressedSize.textContent =
        "--";


    savedPercent.textContent =
        "--";


    downloadBtn.classList.remove(
        "active"
    );


    downloadBtn.removeAttribute(
        "href"
    );


    progressBar.style.width =
        "0%";


    progressText.textContent =
        "Ready to compress";

}


/* =========================================================
   QUALITY SLIDER
========================================================= */

if (quality) {

    quality.addEventListener(
        "input",
        updateQualityValue
    );

}


function updateQualityValue() {

    if (!qualityValue) {
        return;
    }

    qualityValue.textContent =
        `${quality.value}%`;

}


/* =========================================================
   FORMAT SIZE
========================================================= */

function formatSize(bytes) {

    if (!Number.isFinite(bytes)) {

        return "--";

    }


    if (bytes < 1024) {

        return `${bytes} B`;

    }


    if (bytes < 1024 * 1024) {

        return `${(
            bytes / 1024
        ).toFixed(2)} KB`;

    }


    return `${(
        bytes /
        1024 /
        1024
    ).toFixed(2)} MB`;

}


/* =========================================================
   EXTENSION
========================================================= */

function getExtension(type) {

    switch (type) {

        case "image/jpeg":
            return "JPG";

        case "image/png":
            return "PNG";

        case "image/webp":
            return "WEBP";

        default:
            return "IMAGE";

    }

}


/* =========================================================
   LOAD IMAGE ELEMENT
========================================================= */

function loadImageElement(file) {

    return new Promise(
        (resolve, reject) => {

            const url =
                URL.createObjectURL(file);

            const img =
                new Image();


            img.onload = () => {

                URL.revokeObjectURL(url);

                resolve(img);

            };


            img.onerror = () => {

                URL.revokeObjectURL(url);

                reject(
                    new Error(
                        "The image could not be read by your browser."
                    )
                );

            };


            img.src = url;

        }
    );

}


/* =========================================================
   CANVAS TO BLOB
========================================================= */

function canvasToBlob(
    canvas,
    type,
    qualityValue
) {

    return new Promise(resolve => {

        canvas.toBlob(
            blob => resolve(blob),
            type,
            qualityValue
        );

    });

}


/* =========================================================
   CALCULATE DIMENSIONS
========================================================= */

function calculateDimensions(
    width,
    height
) {

    let maxW =
        parseInt(
            maxWidth.value,
            10
        );


    let maxH =
        parseInt(
            maxHeight.value,
            10
        );


    if (
        !Number.isFinite(maxW) ||
        maxW <= 0
    ) {

        maxW = width;

    }


    if (
        !Number.isFinite(maxH) ||
        maxH <= 0
    ) {

        maxH = height;

    }


    const ratio =
        Math.min(
            maxW / width,
            maxH / height,
            1
        );


    return {

        width: Math.max(
            1,
            Math.round(
                width * ratio
            )
        ),

        height: Math.max(
            1,
            Math.round(
                height * ratio
            )
        )

    };

}


/* =========================================================
   COMPRESS IMAGE
========================================================= */

if (compressBtn) {

    compressBtn.addEventListener(
        "click",
        compressImage
    );

}


async function compressImage() {

    if (!selectedFile) {

        alert(
            "Please choose an image first."
        );

        return;
    }


    try {

        compressBtn.disabled = true;

        compressBtn.textContent =
            "Compressing...";


        setProgress(
            8,
            "Reading image..."
        );


        const img =
            await loadImageElement(
                selectedFile
            );


        setProgress(
            22,
            "Preparing image..."
        );


        const dimensions =
            calculateDimensions(
                img.naturalWidth ||
                img.width,

                img.naturalHeight ||
                img.height
            );


        const canvas =
            document.createElement(
                "canvas"
            );


        canvas.width =
            dimensions.width;


        canvas.height =
            dimensions.height;


        const ctx =
            canvas.getContext(
                "2d",
                {
                    alpha: true
                }
            );


        if (!ctx) {

            throw new Error(
                "Canvas is not supported by this browser."
            );

        }


        const format =
            outputFormat.value;


        /*
         * JPG does not support transparency.
         */

        if (
            format === "image/jpeg"
        ) {

            ctx.fillStyle =
                "#ffffff";

            ctx.fillRect(
                0,
                0,
                canvas.width,
                canvas.height
            );

        }


        /*
         * Draw the image.
         */

        ctx.drawImage(
            img,
            0,
            0,
            canvas.width,
            canvas.height
        );


        setProgress(
            40,
            "Compressing image..."
        );


        let currentQuality =
            Number(
                quality.value
            ) / 100;


        if (
            !Number.isFinite(
                currentQuality
            )
        ) {

            currentQuality =
                0.8;

        }


        /*
         * Keep quality within a safe range.
         */

        currentQuality =
            Math.min(
                1,
                Math.max(
                    0.1,
                    currentQuality
                )
            );


        const targetKB =
            Number(
                maxFileSize.value
            );


        const targetBytes =
            Number.isFinite(targetKB) &&
            targetKB > 0

                ? targetKB * 1024

                : null;


        let blob =
            await canvasToBlob(
                canvas,
                format,
                currentQuality
            );


        if (!blob) {

            throw new Error(
                "Unable to create the compressed image."
            );

        }


        /*
         * Try to approach the requested
         * file size for JPG and WEBP.
         */

        if (
            targetBytes &&
            (
                format === "image/jpeg" ||
                format === "image/webp"
            )
        ) {

            let attempts = 0;


            while (
                blob.size > targetBytes &&
                currentQuality > 0.1 &&
                attempts < 18
            ) {

                attempts++;


                currentQuality =
                    Math.max(
                        0.1,
                        currentQuality - 0.05
                    );


                setProgress(
                    Math.min(
                        90,
                        45 +
                        attempts * 2
                    ),

                    `Optimizing image at ${
                        Math.round(
                            currentQuality * 100
                        )
                    }% quality...`
                );


                const newBlob =
                    await canvasToBlob(
                        canvas,
                        format,
                        currentQuality
                    );


                if (!newBlob) {

                    break;

                }


                /*
                 * Stop if the browser produces
                 * an invalid result.
                 */

                if (
                    newBlob.size <= 0
                ) {

                    break;

                }


                blob = newBlob;

            }

        }


        compressedBlob =
            blob;


        setProgress(
            94,
            "Preparing preview..."
        );


        if (
            compressedObjectUrl
        ) {

            URL.revokeObjectURL(
                compressedObjectUrl
            );

        }


        compressedObjectUrl =
            URL.createObjectURL(
                blob
            );


        compressedPreview.src =
            compressedObjectUrl;


        compressedSize.textContent =
            formatSize(blob.size);


        /*
         * Calculate percentage difference.
         */

        const difference =
            selectedFile.size -
            blob.size;


        const percentage =
            selectedFile.size > 0

                ? (
                    difference /
                    selectedFile.size
                ) * 100

                : 0;


        if (
            percentage >= 0
        ) {

            savedPercent.textContent =
                `${percentage.toFixed(1)}% smaller`;

        } else {

            savedPercent.textContent =
                `${Math.abs(
                    percentage
                ).toFixed(1)}% larger`;

        }


        /*
         * Prepare download.
         */

        const extension =
            getDownloadExtension(
                format
            );


        downloadBtn.href =
            compressedObjectUrl;


        downloadBtn.download =
            `compressed-image.${extension}`;


        downloadBtn.classList.add(
            "active"
        );


        setProgress(
            100,
            "Compression completed ✓"
        );


        /*
         * Scroll to result.
         */

        setTimeout(() => {

            const result =
                document.querySelector(
                    ".result-heading"
                );

            if (result) {

                result.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        }, 200);


    } catch (error) {

        console.error(
            "Compression error:",
            error
        );


        alert(
            error.message ||
            "Compression failed. Please try another image."
        );


        setProgress(
            0,
            "Compression failed"
        );


    } finally {

        compressBtn.disabled = false;

        compressBtn.textContent =
            "Compress Image";

    }

}


/* =========================================================
   PROGRESS
========================================================= */

function setProgress(
    value,
    text
) {

    const safeValue =
        Math.min(
            100,
            Math.max(
                0,
                value
            )
        );


    progressBar.style.width =
        `${safeValue}%`;


    progressText.textContent =
        text;

}


/* =========================================================
   DOWNLOAD EXTENSION
========================================================= */

function getDownloadExtension(
    format
) {

    switch (format) {

        case "image/png":
            return "png";

        case "image/webp":
            return "webp";

        default:
            return "jpg";

    }

}


/* =========================================================
   BACK TO TOP
========================================================= */

window.addEventListener(
    "scroll",
    () => {

        if (
            window.scrollY > 500
        ) {

            topBtn.style.display =
                "flex";

        } else {

            topBtn.style.display =
                "none";

        }

    }
);


if (topBtn) {

    topBtn.addEventListener(
        "click",
        () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );

}


/* =========================================================
   MOBILE MENU
========================================================= */

if (
    mobileMenuBtn &&
    navRight
) {

    mobileMenuBtn.addEventListener(
        "click",
        () => {

            const isOpen =
                navRight.classList.toggle(
                    "show"
                );


            mobileMenuBtn.setAttribute(
                "aria-expanded",
                isOpen
                    ? "true"
                    : "false"
            );


            mobileMenuBtn.textContent =
                isOpen
                    ? "✕"
                    : "☰";

        }
    );

}


/* =========================================================
   DARK MODE
========================================================= */

function applyTheme(theme) {

    if (
        theme === "dark"
    ) {

        document.body.classList.add(
            "dark"
        );


        themeToggle.textContent =
            "☀️";

    } else {

        document.body.classList.remove(
            "dark"
        );


        themeToggle.textContent =
            "🌙";

    }

}


const savedTheme =
    localStorage.getItem(
        "theme"
    );


if (savedTheme) {

    applyTheme(
        savedTheme
    );

}


if (themeToggle) {

    themeToggle.addEventListener(
        "click",
        () => {

            const isDark =
                document.body.classList.contains(
                    "dark"
                );


            const newTheme =
                isDark
                    ? "light"
                    : "dark";


            localStorage.setItem(
                "theme",
                newTheme
            );


            applyTheme(
                newTheme
            );

        }
    );

}


/* =========================================================
   CLEAN OBJECT URLS
========================================================= */

function revokeObjectUrls() {

    if (
        originalObjectUrl
    ) {

        URL.revokeObjectURL(
            originalObjectUrl
        );

        originalObjectUrl =
            null;

    }


    if (
        compressedObjectUrl
    ) {

        URL.revokeObjectURL(
            compressedObjectUrl
        );

        compressedObjectUrl =
            null;

    }

}


window.addEventListener(
    "beforeunload",
    revokeObjectUrls
);


/* =========================================================
   INITIALIZE
========================================================= */

updateQualityValue();

setProgress(
    0,
    "Ready to compress"
);
