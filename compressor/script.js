/* =========================================================
   IMAGE COMPRESSOR PRO
   IMAGE COMPRESSOR JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", function () {


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const imageInput =
        document.getElementById("imageInput");

    const uploadCard =
        document.getElementById("uploadCard");

    const editorCard =
        document.getElementById("editorCard");

    const imagePreview =
        document.getElementById("imagePreview");

    const fileName =
        document.getElementById("fileName");

    const originalSize =
        document.getElementById("originalSize");

    const compressedSize =
        document.getElementById("compressedSize");

    const savedPercent =
        document.getElementById("savedPercent");

    const qualityRange =
        document.getElementById("qualityRange");

    const qualityValue =
        document.getElementById("qualityValue");

    const formatSelect =
        document.getElementById("formatSelect");

    const downloadButton =
        document.getElementById("downloadButton");

    const resetButton =
        document.getElementById("resetButton");

    const errorMessage =
        document.getElementById("errorMessage");

    const resultMessage =
        document.getElementById("resultMessage");

    const themeToggle =
        document.getElementById("themeToggle");

    const mobileMenuBtn =
        document.getElementById("mobileMenuBtn");

    const navLinks =
        document.getElementById("navLinks");

    const topBtn =
        document.getElementById("topBtn");


    /* =====================================================
       VARIABLES
    ===================================================== */

    let selectedFile = null;

    let compressedBlob = null;

    let originalObjectUrl = null;


    /* =====================================================
       THEME
    ===================================================== */

    const savedTheme =
        localStorage.getItem("icp-theme");


    if (savedTheme === "dark") {

        document.body.classList.add("dark");

    }


    if (themeToggle) {

        themeToggle.addEventListener(
            "click",
            function () {

                document.body.classList.toggle("dark");

                const isDark =
                    document.body.classList.contains("dark");

                localStorage.setItem(
                    "icp-theme",
                    isDark ? "dark" : "light"
                );

            }
        );

    }


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    if (mobileMenuBtn && navLinks) {

        mobileMenuBtn.addEventListener(
            "click",
            function () {

                const isOpen =
                    navLinks.classList.toggle("show");

                mobileMenuBtn.setAttribute(
                    "aria-expanded",
                    isOpen ? "true" : "false"
                );

                mobileMenuBtn.textContent =
                    isOpen ? "✕" : "☰";

            }
        );


        navLinks
            .querySelectorAll("a")
            .forEach(function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        navLinks.classList.remove("show");

                        mobileMenuBtn.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                        mobileMenuBtn.textContent =
                            "☰";

                    }
                );

            });

    }


    /* =====================================================
       FILE SIZE FORMAT
    ===================================================== */

    function formatFileSize(bytes) {

        if (!bytes || bytes <= 0) {
            return "0 KB";
        }


        const units = [
            "Bytes",
            "KB",
            "MB",
            "GB"
        ];


        const index =
            Math.floor(
                Math.log(bytes) /
                Math.log(1024)
            );


        const size =
            bytes /
            Math.pow(1024, index);


        if (index === 0) {

            return (
                Math.round(size) +
                " " +
                units[index]
            );

        }


        return (
            size.toFixed(2) +
            " " +
            units[index]
        );

    }


    /* =====================================================
       SHOW ERROR
    ===================================================== */

    function showError(message) {

        if (!errorMessage) {
            return;
        }

        errorMessage.textContent = message;

        errorMessage.classList.add("show");

    }


    /* =====================================================
       HIDE ERROR
    ===================================================== */

    function hideError() {

        if (!errorMessage) {
            return;
        }

        errorMessage.textContent = "";

        errorMessage.classList.remove("show");

    }


    /* =====================================================
       LOAD FILE
    ===================================================== */

    function loadFile(file) {

        hideError();


        if (!file) {
            return;
        }


        /* Check file type */

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];


        if (!allowedTypes.includes(file.type)) {

            showError(
                "Please choose a JPG, PNG or WEBP image."
            );

            return;

        }


        /* Check size */

        const maxSize =
            20 * 1024 * 1024;


        if (file.size > maxSize) {

            showError(
                "This file is larger than 20 MB. Please choose a smaller image."
            );

            return;

        }


        selectedFile = file;


        /* Create preview URL */

        if (originalObjectUrl) {

            URL.revokeObjectURL(
                originalObjectUrl
            );

        }


        originalObjectUrl =
            URL.createObjectURL(file);


        imagePreview.src =
            originalObjectUrl;


        fileName.textContent =
            file.name;


        originalSize.textContent =
            formatFileSize(file.size);


        /* Select initial format */

        if (file.type === "image/png") {

            formatSelect.value =
                "image/png";

        } else if (file.type === "image/webp") {

            formatSelect.value =
                "image/webp";

        } else {

            formatSelect.value =
                "image/jpeg";

        }


        /* Show editor */

        editorCard.classList.add("show");

        resultMessage.classList.remove("show");


        /* Compress */

        compressImage();

    }


    /* =====================================================
       FILE INPUT
    ===================================================== */

    if (imageInput) {

        imageInput.addEventListener(
            "change",
            function () {

                const file =
                    this.files[0];

                loadFile(file);

            }
        );

    }


    /* =====================================================
       DRAG & DROP
    ===================================================== */

    if (uploadCard) {


        uploadCard.addEventListener(
            "dragover",
            function (event) {

                event.preventDefault();

                uploadCard.classList.add(
                    "dragover"
                );

            }
        );


        uploadCard.addEventListener(
            "dragleave",
            function () {

                uploadCard.classList.remove(
                    "dragover"
                );

            }
        );


        uploadCard.addEventListener(
            "drop",
            function (event) {

                event.preventDefault();

                uploadCard.classList.remove(
                    "dragover"
                );


                const files =
                    event.dataTransfer.files;


                if (
                    files &&
                    files.length > 0
                ) {

                    loadFile(files[0]);

                }

            }
        );

    }


    /* =====================================================
       COMPRESS IMAGE
    ===================================================== */

    function compressImage() {

        if (!selectedFile) {
            return;
        }


        const quality =
            Number(
                qualityRange.value
            ) / 100;


        qualityValue.textContent =
            Math.round(
                quality * 100
            ) + "%";


        const outputType =
            formatSelect.value;


        const image =
            new Image();


        image.onload =
            function () {


                const canvas =
                    document.createElement(
                        "canvas"
                    );


                canvas.width =
                    image.naturalWidth;


                canvas.height =
                    image.naturalHeight;


                const context =
                    canvas.getContext(
                        "2d"
                    );


                /*
                 * White background is useful when
                 * converting transparent PNG images
                 * to JPG.
                 */

                if (
                    outputType ===
                    "image/jpeg"
                ) {

                    context.fillStyle =
                        "#ffffff";

                    context.fillRect(
                        0,
                        0,
                        canvas.width,
                        canvas.height
                    );

                }


                context.drawImage(
                    image,
                    0,
                    0
                );


                canvas.toBlob(
                    function (blob) {

                        if (!blob) {

                            showError(
                                "Compression failed. Please try another image."
                            );

                            return;

                        }


                        compressedBlob =
                            blob;


                        compressedSize.textContent =
                            formatFileSize(
                                blob.size
                            );


                        const originalBytes =
                            selectedFile.size;


                        const compressedBytes =
                            blob.size;


                        let saved =
                            (
                                1 -
                                (
                                    compressedBytes /
                                    originalBytes
                                )
                            ) *
                            100;


                        /*
                         * If output is larger,
                         * don't show negative savings.
                         */

                        if (saved < 0) {
                            saved = 0;
                        }


                        savedPercent.textContent =
                            Math.round(
                                saved
                            ) + "%";


                    },
                    outputType,
                    quality
                );


            };


        image.onerror =
            function () {

                showError(
                    "The image could not be processed."
                );

            };


        image.src =
            imagePreview.src;

    }


    /* =====================================================
       QUALITY CHANGE
    ===================================================== */

    if (qualityRange) {

        qualityRange.addEventListener(
            "input",
            function () {

                qualityValue.textContent =
                    this.value + "%";

            }
        );


        qualityRange.addEventListener(
            "change",
            function () {

                compressImage();

            }
        );

    }


    /* =====================================================
       FORMAT CHANGE
    ===================================================== */

    if (formatSelect) {

        formatSelect.addEventListener(
            "change",
            function () {

                compressImage();

            }
        );

    }


    /* =====================================================
       DOWNLOAD
    ===================================================== */

    if (downloadButton) {

        downloadButton.addEventListener(
            "click",
            function () {


                if (!compressedBlob) {

                    showError(
                        "Please upload and compress an image first."
                    );

                    return;

                }


                const extensionMap = {

                    "image/jpeg": "jpg",

                    "image/png": "png",

                    "image/webp": "webp"

                };


                const extension =
                    extensionMap[
                        formatSelect.value
                    ] || "jpg";


                let originalName =
                    selectedFile.name;


                const lastDot =
                    originalName.lastIndexOf(".");


                if (lastDot !== -1) {

                    originalName =
                        originalName.substring(
                            0,
                            lastDot
                        );

                }


                const downloadName =
                    originalName +
                    "-compressed." +
                    extension;


                const url =
                    URL.createObjectURL(
                        compressedBlob
                    );


                const link =
                    document.createElement(
                        "a"
                    );


                link.href = url;

                link.download =
                    downloadName;


                document.body.appendChild(
                    link
                );


                link.click();


                link.remove();


                setTimeout(
                    function () {

                        URL.revokeObjectURL(
                            url
                        );

                    },
                    1000
                );


                resultMessage.classList.add(
                    "show"
                );

            }
        );

    }


    /* =====================================================
       RESET
    ===================================================== */

    if (resetButton) {

        resetButton.addEventListener(
            "click",
            function () {

                selectedFile = null;

                compressedBlob = null;


                if (originalObjectUrl) {

                    URL.revokeObjectURL(
                        originalObjectUrl
                    );

                    originalObjectUrl = null;

                }


                imagePreview.src = "";

                imageInput.value = "";

                fileName.textContent =
                    "Image";

                originalSize.textContent =
                    "—";

                compressedSize.textContent =
                    "—";

                savedPercent.textContent =
                    "—";

                qualityRange.value =
                    80;

                qualityValue.textContent =
                    "80%";

                formatSelect.value =
                    "image/jpeg";


                editorCard.classList.remove(
                    "show"
                );


                resultMessage.classList.remove(
                    "show"
                );


                hideError();


                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );

    }


    /* =====================================================
       BACK TO TOP
    ===================================================== */

    function updateTopButton() {

        if (!topBtn) {
            return;
        }


        if (window.scrollY > 400) {

            topBtn.classList.add(
                "visible"
            );

        } else {

            topBtn.classList.remove(
                "visible"
            );

        }

    }


    window.addEventListener(
        "scroll",
        updateTopButton,
        {
            passive: true
        }
    );


    updateTopButton();


    if (topBtn) {

        topBtn.addEventListener(
            "click",
            function () {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );

    }


    /* =====================================================
       FAQ
       ONLY ONE FAQ OPEN AT A TIME
    ===================================================== */

    const faqItems =
        document.querySelectorAll(
            ".faq-item"
        );


    faqItems.forEach(
        function (item) {

            item.addEventListener(
                "toggle",
                function () {

                    if (!item.open) {
                        return;
                    }


                    faqItems.forEach(
                        function (otherItem) {

                            if (
                                otherItem !== item
                            ) {

                                otherItem.removeAttribute(
                                    "open"
                                );

                            }

                        }
                    );

                }
            );

        }
    );


    /* =====================================================
       CLOSE MOBILE MENU OUTSIDE
    ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            if (
                !navLinks ||
                !mobileMenuBtn
            ) {
                return;
            }


            const insideMenu =
                navLinks.contains(
                    event.target
                );


            const insideButton =
                mobileMenuBtn.contains(
                    event.target
                );


            if (
                !insideMenu &&
                !insideButton
            ) {

                navLinks.classList.remove(
                    "show"
                );

                mobileMenuBtn.setAttribute(
                    "aria-expanded",
                    "false"
                );

                mobileMenuBtn.textContent =
                    "☰";

            }

        }
    );

});
