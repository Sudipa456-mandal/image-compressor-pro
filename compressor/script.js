/* =========================================================
   IMAGE COMPRESSOR PRO
   Clean + Reliable Image Compression
========================================================= */


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

const resultContent =
    document.getElementById("resultContent");

const emptyResult =
    document.getElementById("emptyResult");

const themeToggle =
    document.getElementById("themeToggle");

const mobileMenuBtn =
    document.getElementById("mobileMenuBtn");

const navLinks =
    document.getElementById("navLinks");

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
   FILE SELECTION
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

            loadSelectedImage(file);

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

        dropArea.classList.add("dragover");

    }
);


dropArea.addEventListener(
    "dragleave",
    () => {

        dropArea.classList.remove("dragover");

    }
);


dropArea.addEventListener(
    "drop",
    event => {

        event.preventDefault();

        dropArea.classList.remove("dragover");

        const file =
            event.dataTransfer.files[0];

        if (file) {

            loadSelectedImage(file);

        }

    }
);


/* =========================================================
   LOAD SELECTED IMAGE
========================================================= */

function loadSelectedImage(file) {

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];


    if (!allowedTypes.includes(file.type)) {

        alert(
            "Please select a JPG, PNG or WEBP image."
        );

        return;
    }


    if (file.size === 0) {

        alert(
            "The selected image is empty or invalid."
        );

        return;
    }


    selectedFile = file;


    clearObjectUrls();


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


    resultContent.classList.add(
        "hidden"
    );


    emptyResult.classList.remove(
        "hidden"
    );


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
   REMOVE FILE
========================================================= */

removeFileBtn.addEventListener(
    "click",
    resetTool
);


function resetTool() {

    selectedFile = null;

    compressedBlob = null;


    clearObjectUrls();


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


    resultContent.classList.add(
        "hidden"
    );


    emptyResult.classList.remove(
        "hidden"
    );


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
   FILE SIZE FORMATTER
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


    if (bytes < 1024 * 1024 * 1024) {

        return `${(
            bytes /
            1024 /
            1024
        ).toFixed(2)} MB`;

    }


    return `${(
        bytes /
        1024 /
        1024 /
        1024
    ).toFixed(2)} GB`;

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
                        "The image could not be read."
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
   CREATE CANVAS
========================================================= */

function createCanvas(
    img,
    dimensions,
    format
) {

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
     * JPG does not support transparency.
     * Use a white background.
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


    ctx.imageSmoothingEnabled =
        true;


    ctx.imageSmoothingQuality =
        "high";


    ctx.drawImage(
        img,
        0,
        0,
        canvas.width,
        canvas.height
    );


    return canvas;

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
            5,
            "Reading image..."
        );


        const img =
            await loadImageElement(
                selectedFile
            );


        setProgress(
            20,
            "Preparing image..."
        );


        const width =
            img.naturalWidth ||
            img.width;


        const height =
            img.naturalHeight ||
            img.height;


        const dimensions =
            calculateDimensions(
                width,
                height
            );


        const format =
            outputFormat.value;


        const canvas =
            createCanvas(
                img,
                dimensions,
                format
            );


        setProgress(
            35,
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
         * JPG and WEBP support quality control.
         *
         * Try multiple quality levels rather than
         * changing the user's dimensions immediately.
         */

        if (
            (
                format === "image/jpeg" ||
                format === "image/webp"
            ) &&
            blob.size > targetBytes
        ) {

            const qualitySteps = [
                0.75,
                0.70,
                0.65,
                0.60,
                0.55,
                0.50,
                0.45,
                0.40,
                0.35,
                0.30,
                0.25,
                0.20,
                0.15,
                0.10
            ];


            for (
                const nextQuality
                of qualitySteps
            ) {

                if (
                    nextQuality >=
                    currentQuality
                ) {

                    continue;

                }


                currentQuality =
                    nextQuality;


                setProgress(
                    Math.min(
                        90,
                        40 +
                        (
                            (
                                1 -
                                currentQuality
                            ) * 50
                        )
                    ),
                    `Optimizing image: ${Math.round(
                        currentQuality * 100
                    )}% quality`
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


                if (
                    blob.size <=
                    targetBytes
                ) {

                    break;

                }

            }

        }


        /*
         * PNG does not have normal lossy quality control
         * through canvas.toBlob().
         *
         * Therefore we do not pretend that the target size
         * can always be reached for PNG.
         */


        compressedBlob =
            blob;


        setProgress(
            94,
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


        originalSize.textContent =
            formatSize(
                selectedFile.size
            );


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


        if (
            percentage > 0
        ) {

            savedPercent.textContent =
                `${percentage.toFixed(1)}% smaller`;

        } else if (
            percentage < 0
        ) {

            savedPercent.textContent =
                `${Math.abs(
                    percentage
                ).toFixed(1)}% larger`;

        } else {

            savedPercent.textContent =
                "No change";

        }


        const extension =
            getDownloadExtension(
                format
            );


        const originalName =
            getBaseFileName(
                selectedFile.name
            );


        downloadBtn.href =
            compressedObjectUrl;


        downloadBtn.download =
            `${originalName}-compressed.${extension}`;


        downloadBtn.classList.add(
            "active"
        );


        emptyResult.classList.add(
            "hidden"
        );


        resultContent.classList.remove(
            "hidden"
        );


        setProgress(
            100,
            "Compression completed ✓"
        );


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

    const safeValue =
        Math.max(
            0,
            Math.min(
                100,
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
   BASE FILE NAME
========================================================= */

function getBaseFileName(
    name
) {

    return name
        .replace(
            /\.[^/.]+$/,
            ""
        )
        .replace(
            /[^a-zA-Z0-9-_]/g,
            "-"
        )
        .replace(
            /-+/g,
            "-"
        )
        .replace(
            /^-|-$/g,
            ""
        ) || "image";

}


/* =========================================================
   DARK MODE
========================================================= */

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


        themeToggle.setAttribute(
            "aria-label",
            "Switch to light mode"
        );

    } else {

        document.body.classList.remove(
            "dark"
        );


        themeToggle.textContent =
            "🌙";


        themeToggle.setAttribute(
            "aria-label",
            "Switch to dark mode"
        );

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

} else {

    /*
     * Respect the visitor's system preference
     * on the first visit.
     */

    const prefersDark =
        window.matchMedia &&
        window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;


    applyTheme(
        prefersDark
            ? "dark"
            : "light"
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
   MOBILE MENU
========================================================= */

mobileMenuBtn.addEventListener(
    "click",
    () => {

        const isOpen =
            navLinks.classList.toggle(
                "show"
            );


        mobileMenuBtn.setAttribute(
            "aria-expanded",
            String(isOpen)
        );


        document.body.classList.toggle(
            "menu-open",
            isOpen
        );

    }
);


/* =========================================================
   CLOSE MOBILE MENU WHEN LINK IS CLICKED
========================================================= */

navLinks
    .querySelectorAll("a")
    .forEach(
        link => {

            link.addEventListener(
                "click",
                () => {

                    navLinks.classList.remove(
                        "show"
                    );


                    mobileMenuBtn.setAttribute(
                        "aria-expanded",
                        "false"
                    );


                    document.body.classList.remove(
                        "menu-open"
                    );

                }
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

function clearObjectUrls() {

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
    clearObjectUrls
);


/* =========================================================
   INITIAL STATE
========================================================= */

qualityValue.textContent =
    `${quality.value}%`;

progressBar.style.width =
    "0%";

downloadBtn.classList.remove(
    "active"
);
