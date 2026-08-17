```javascript
/* =========================================
   IMAGE COMPRESSOR PRO
   Browser-Based Image Compression
========================================= */


/* =========================================
   ELEMENTS
========================================= */

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

const topBtn =
    document.getElementById("topBtn");

const themeToggle =
    document.getElementById("themeToggle");

const mobileMenuBtn =
    document.getElementById("mobileMenuBtn");

const navLinks =
    document.getElementById("navLinks");


/* =========================================
   GLOBAL STATE
========================================= */

let selectedFile = null;

let compressedBlob = null;

let compressedObjectUrl = null;

let originalObjectUrl = null;


/* =========================================
   FILE SELECTION
========================================= */

chooseBtn.addEventListener(
    "click",
    () => {

        imageInput.click();

    }
);


/* =========================================
   FILE INPUT
========================================= */

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


/* =========================================
   DRAG & DROP
========================================= */

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


/* =========================================
   LOAD IMAGE
========================================= */

function loadImage(file) {

    if (
        ![
            "image/jpeg",
            "image/png",
            "image/webp"
        ].includes(file.type)
    ) {

        alert(
            "Please select a JPG, PNG or WEBP image."
        );

        return;

    }


    selectedFile = file;


    /* Clean previous URLs */

    if (originalObjectUrl) {

        URL.revokeObjectURL(
            originalObjectUrl
        );

    }

    if (compressedObjectUrl) {

        URL.revokeObjectURL(
            compressedObjectUrl
        );

        compressedObjectUrl = null;

    }


    /* Create original preview */

    originalObjectUrl =
        URL.createObjectURL(file);

    originalPreview.src =
        originalObjectUrl;


    compressedPreview.removeAttribute(
        "src"
    );


    /* File information */

    fileName.textContent =
        file.name;

    fileOriginalInfo.textContent =
        `${formatSize(file.size)} • ${file.type.split("/")[1].toUpperCase()}`;


    fileInfo.classList.remove(
        "hidden"
    );


    /* Statistics */

    originalSize.textContent =
        formatSize(file.size);

    compressedSize.textContent =
        "--";

    savedPercent.textContent =
        "--";


    /* Download */

    downloadBtn.classList.remove(
        "active"
    );

    downloadBtn.removeAttribute(
        "href"
    );


    /* Progress */

    progressBar.style.width =
        "0%";

    progressText.textContent =
        "Ready to compress";


    compressedBlob = null;

}


/* =========================================
   REMOVE IMAGE
========================================= */

removeFileBtn.addEventListener(
    "click",
    () => {

        resetTool();

    }
);


function resetTool() {

    selectedFile = null;

    compressedBlob = null;


    if (originalObjectUrl) {

        URL.revokeObjectURL(
            originalObjectUrl
        );

        originalObjectUrl = null;

    }


    if (compressedObjectUrl) {

        URL.revokeObjectURL(
            compressedObjectUrl
        );

        compressedObjectUrl = null;

    }


    imageInput.value = "";


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
        "Ready";

}


/* =========================================
   QUALITY SLIDER
========================================= */

quality.addEventListener(
    "input",
    () => {

        qualityValue.textContent =
            `${quality.value}%`;

    }
);


/* =========================================
   FORMAT SIZE
========================================= */

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


/* =========================================
   LOAD IMAGE ELEMENT
========================================= */

function loadImageElement(
    file
) {

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
                        "Unable to read image."
                    )
                );

            };


            img.src = url;

        }
    );

}


/* =========================================
   CANVAS BLOB
========================================= */

function canvasToBlob(
    canvas,
    type,
    qualityValue
) {

    return new Promise(
        resolve => {

            canvas.toBlob(
                blob => {

                    resolve(blob);

                },
                type,
                qualityValue
            );

        }
    );

}


/* =========================================
   CALCULATE DIMENSIONS
========================================= */

function calculateDimensions(
    imageWidth,
    imageHeight
) {

    let width =
        parseInt(
            maxWidth.value,
            10
        );

    let height =
        parseInt(
            maxHeight.value,
            10
        );


    if (
        !Number.isFinite(width) ||
        width <= 0
    ) {

        width = imageWidth;

    }


    if (
        !Number.isFinite(height) ||
        height <= 0
    ) {

        height = imageHeight;

    }


    const ratio =
        Math.min(
            width / imageWidth,
            height / imageHeight,
            1
        );


    return {

        width:
            Math.max(
                1,
                Math.round(
                    imageWidth * ratio
                )
            ),

        height:
            Math.max(
                1,
                Math.round(
                    imageHeight * ratio
                )
            )

    };

}


/* =========================================
   COMPRESS BUTTON
========================================= */

compressBtn.addEventListener(
    "click",
    async () => {

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


            progressBar.style.width =
                "10%";

            progressText.textContent =
                "Reading image...";


            const img =
                await loadImageElement(
                    selectedFile
                );


            progressBar.style.width =
                "25%";

            progressText.textContent =
                "Preparing image...";


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


            /*
             * White background for JPG.
             * JPG does not support transparency.
             */

            const selectedFormat =
                outputFormat.value;


            if (
                selectedFormat ===
                "image/jpeg"
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


            ctx.drawImage(
                img,
                0,
                0,
                canvas.width,
                canvas.height
            );


            progressBar.style.width =
                "45%";

            progressText.textContent =
                "Compressing image...";


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
                    selectedFormat,
                    currentQuality
                );


            if (!blob) {

                throw new Error(
                    "The browser could not create the compressed image."
                );

            }


            /*
             * For JPG and WEBP, try progressively
             * lower quality until the target is
             * reached or the minimum quality is met.
             */

            if (
                selectedFormat ===
                    "image/jpeg" ||
                selectedFormat ===
                    "image/webp"
            ) {

                while (
                    blob.size >
                        targetBytes &&
                    currentQuality >
                        0.10
                ) {

                    currentQuality -=
                        0.05;


                    progressBar.style.width =
                        `${Math.min(
                            90,
                            45 +
                            (
                                (1 -
                                    currentQuality) *
                                45
                            )
                        )}%`;


                    progressText.textContent =
                        `Optimizing quality: ${Math.round(
                            currentQuality * 100
                        )}%`;


                    const newBlob =
                        await canvasToBlob(
                            canvas,
                            selectedFormat,
                            currentQuality
                        );


                    if (!newBlob) {

                        break;

                    }


                    blob = newBlob;

                }

            }


            compressedBlob =
                blob;


            progressBar.style.width =
                "95%";

            progressText.textContent =
                "Preparing preview...";


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
                formatSize(blob.size);


            /*
             * Calculate percentage change.
             */

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


            /*
             * Download extension
             */

            let extension =
                "jpg";


            if (
                selectedFormat ===
                "image/webp"
            ) {

                extension =
                    "webp";

            }


            if (
                selectedFormat ===
                "image/png"
            ) {

                extension =
                    "png";

            }


            downloadBtn.href =
                compressedObjectUrl;


            downloadBtn.download =
                `compressed-image.${extension}`;


            downloadBtn.classList.add(
                "active"
            );


            progressBar.style.width =
                "100%";

            progressText.textContent =
                "Compression completed ✓";


        } catch (error) {

            console.error(error);

            alert(
                error.message ||
                "Compression failed. Please try another image."
            );


            progressBar.style.width =
                "0%";

            progressText.textContent =
                "Compression failed";

        } finally {

            compressBtn.disabled =
                false;

            compressBtn.textContent =
                "Compress Image";

        }

    }
);


/* =========================================
   BACK TO TOP
========================================= */

window.addEventListener(
    "scroll",
    () => {

        if (
            window.scrollY >
            500
        ) {

            topBtn.style.display =
                "block";

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


/* =========================================
   DARK MODE
========================================= */

function applyTheme(
    theme
) {

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


/* =========================================
   MOBILE NAVIGATION
========================================= */

mobileMenuBtn.addEventListener(
    "click",
    () => {

        navLinks.classList.toggle(
            "show"
        );

    }
);


/* =========================================
   CLEAN OBJECT URLS
========================================= */

window.addEventListener(
    "beforeunload",
    () => {

        if (originalObjectUrl) {

            URL.revokeObjectURL(
                originalObjectUrl
            );

        }


        if (compressedObjectUrl) {

            URL.revokeObjectURL(
                compressedObjectUrl
            );

        }

    }
);
```
