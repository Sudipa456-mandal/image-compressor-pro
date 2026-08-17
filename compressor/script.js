/* =========================================================
   IMAGE COMPRESSOR PRO
   MAIN JAVASCRIPT
========================================================= */

"use strict";


/* =========================================================
   ELEMENTS
========================================================= */

const imageInput =
    document.getElementById("imageInput");

const chooseBtn =
    document.getElementById("chooseBtn");

const dropArea =
    document.getElementById("dropArea");

const fileInfo =
    document.getElementById("fileInfo");

const fileName =
    document.getElementById("fileName");

const fileOriginalInfo =
    document.getElementById("fileOriginalInfo");

const removeFileBtn =
    document.getElementById("removeFileBtn");

const quality =
    document.getElementById("quality");

const qualityValue =
    document.getElementById("qualityValue");

const maxWidth =
    document.getElementById("maxWidth");

const maxHeight =
    document.getElementById("maxHeight");

const maxFileSize =
    document.getElementById("maxFileSize");

const outputFormat =
    document.getElementById("outputFormat");

const compressBtn =
    document.getElementById("compressBtn");

const originalPreview =
    document.getElementById("originalPreview");

const compressedPreview =
    document.getElementById("compressedPreview");

const originalSize =
    document.getElementById("originalSize");

const compressedSize =
    document.getElementById("compressedSize");

const savedPercent =
    document.getElementById("savedPercent");

const progressBar =
    document.getElementById("progressBar");

const progressText =
    document.getElementById("progressText");

const downloadBtn =
    document.getElementById("downloadBtn");

const mobileMenuBtn =
    document.getElementById("mobileMenuBtn");

const navLinks =
    document.getElementById("navLinks");

const themeToggle =
    document.getElementById("themeToggle");

const topBtn =
    document.getElementById("topBtn");


/* =========================================================
   STATE
========================================================= */

let selectedFile = null;

let compressedBlob = null;

let originalObjectUrl = null;

let compressedObjectUrl = null;


/* =========================================================
   FILE PICKER
========================================================= */

chooseBtn.addEventListener(
    "click",
    () => {

        imageInput.click();

    }
);


imageInput.addEventListener(
    "change",
    event => {

        const file =
            event.target.files[0];

        if (file) {

            loadImage(file);

        }

    }
);


/* =========================================================
   DRAG & DROP
========================================================= */

dropArea.addEventListener(
    "dragover",
    event => {

        event.preventDefault();

        dropArea.classList.add(
            "dragover"
        );

    }
);


dropArea.addEventListener(
    "dragleave",
    () => {

        dropArea.classList.remove(
            "dragover"
        );

    }
);


dropArea.addEventListener(
    "drop",
    event => {

        event.preventDefault();

        dropArea.classList.remove(
            "dragover"
        );

        const file =
            event.dataTransfer.files[0];

        if (file) {

            loadImage(file);

        }

    }
);


/* =========================================================
   LOAD IMAGE
========================================================= */

function loadImage(file) {

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];


    if (!allowedTypes.includes(file.type)) {

        alert(
            "Please choose a JPG, PNG or WEBP image."
        );

        return;
    }


    selectedFile = file;


    revokeUrls();


    originalObjectUrl =
        URL.createObjectURL(file);


    originalPreview.src =
        originalObjectUrl;


    compressedPreview.removeAttribute(
        "src"
    );


    fileName.textContent =
        file.name;


    fileOriginalInfo.textContent =
        `${formatSize(file.size)} • ${getExtension(file.type)}`;


    fileInfo.classList.remove(
        "hidden"
    );


    originalSize.textContent =
        formatSize(file.size);


    compressedSize.textContent =
        "--";


    savedPercent.textContent =
        "--";


    compressedBlob = null;


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
   REMOVE IMAGE
========================================================= */

removeFileBtn.addEventListener(
    "click",
    resetTool
);


function resetTool() {

    selectedFile = null;

    compressedBlob = null;

    revokeUrls();


    imageInput.value =
        "";


    originalPreview.removeAttribute(
        "src"
    );


    compressedPreview.removeAttribute(
        "src"
    );


    fileInfo.classList.add(
        "hidden"
    );


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

quality.addEventListener(
    "input",
    () => {

        qualityValue.textContent =
            `${quality.value}%`;

    }
);


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

                URL.revokeObjectURL(
                    url
                );

                resolve(img);

            };


            img.onerror = () => {

                URL.revokeObjectURL(
                    url
                );

                reject(
                    new Error(
                        "The image could not be loaded."
                    )
                );

            };


            img.src =
                url;

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

    return new Promise(
        resolve => {

            canvas.toBlob(
                blob => resolve(blob),
                type,
                qualityValue
            );

        }
    );
}


/* =========================================================
   DIMENSIONS
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

        maxW =
            width;
    }


    if (
        !Number.isFinite(maxH) ||
        maxH <= 0
    ) {

        maxH =
            height;
    }


    const ratio =
        Math.min(
            maxW / width,
            maxH / height,
            1
        );


    return {

        width:
            Math.max(
                1,
                Math.round(
                    width * ratio
                )
            ),

        height:
            Math.max(
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

compressBtn.addEventListener(
    "click",
    compressImage
);


async function compressImage() {

    if (!selectedFile) {

        alert(
            "Please choose an image first."
        );

        return;
    }


    try {

        compressBtn.disabled =
            true;


        compressBtn.textContent =
            "Compressing...";


        setProgress(
            10,
            "Reading image..."
        );


        const img =
            await loadImageElement(
                selectedFile
            );


        setProgress(
            25,
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
                "2d"
            );


        if (!ctx) {

            throw new Error(
                "Canvas is not supported by this browser."
            );

        }


        const format =
            outputFormat.value;


        /* JPG background */

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


        /* Draw image */

        ctx.drawImage(
            img,
            0,
            0,
            canvas.width,
            canvas.height
        );


        setProgress(
            45,
            "Compressing image..."
        );


        let currentQuality =
            Number(
                quality.value
            ) / 100;


        const targetKB =
            Number(
                maxFileSize.value
            );


        const targetBytes =
            targetKB * 1024;


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
         * Reduce quality gradually
         * for JPG and WEBP.
         */

        if (
            format === "image/jpeg" ||
            format === "image/webp"
        ) {

            let attempts = 0;


            while (
                blob.size > targetBytes &&
                currentQuality > 0.10 &&
                attempts < 18
            ) {

                currentQuality -=
                    0.05;

                attempts++;


                const percent =
                    Math.min(
                        90,
                        45 +
                        (
                            (1 - currentQuality)
                            * 45
                        )
                    );


                setProgress(
                    percent,
                    `Optimizing quality: ${Math.round(
                        currentQuality * 100
                    )}%`
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


                blob =
                    newBlob;
            }
        }


        compressedBlob =
            blob;


        setProgress(
            95,
            "Preparing preview..."
        );


        if (compressedObjectUrl) {

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
            formatSize(
                blob.size
            );


        const difference =
            selectedFile.size -
            blob.size;


        const percentage =
            (
                difference /
                selectedFile.size
            ) * 100;


        if (percentage >= 0) {

            savedPercent.textContent =
                `${percentage.toFixed(1)}% smaller`;

        } else {

            savedPercent.textContent =
                `${Math.abs(
                    percentage
                ).toFixed(1)}% larger`;
        }


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


    } catch (error) {

        console.error(
            error
        );


        alert(
            error.message ||
            "Compression failed."
        );


        setProgress(
            0,
            "Compression failed"
        );


    } finally {

        compressBtn.disabled =
            false;


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

    progressBar.style.width =
        `${value}%`;


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
   MOBILE MENU
========================================================= */

mobileMenuBtn.addEventListener(
    "click",
    () => {

        navLinks.classList.toggle(
            "show"
        );

    }
);


/* =========================================================
   DARK MODE
========================================================= */

function applyTheme(theme) {

    /*
     * The new design is intentionally
     * light-first. We keep the theme
     * button functional by changing
     * the page class.
     */

    if (theme === "dark") {

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


topBtn.addEventListener(
    "click",
    () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);


/* =========================================================
   CLEAN OBJECT URLS
========================================================= */

function revokeUrls() {

    if (originalObjectUrl) {

        URL.revokeObjectURL(
            originalObjectUrl
        );

        originalObjectUrl =
            null;
    }


    if (compressedObjectUrl) {

        URL.revokeObjectURL(
            compressedObjectUrl
        );

        compressedObjectUrl =
            null;
    }
}


window.addEventListener(
    "beforeunload",
    revokeUrls
);
