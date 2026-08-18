/* =========================================================
   IMAGE COMPRESSOR PRO
   IMAGE COMPRESSOR PAGE JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", function () {


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const fileInput =
        document.getElementById("fileInput");

    const uploadCard =
        document.getElementById("uploadCard");

    const workspace =
        document.getElementById("workspace");

    const imagePreview =
        document.getElementById("imagePreview");

    const previewPlaceholder =
        document.getElementById("previewPlaceholder");

    const fileName =
        document.getElementById("fileName");

    const originalSize =
        document.getElementById("originalSize");

    const imageDimensions =
        document.getElementById("imageDimensions");

    const formatBadge =
        document.getElementById("formatBadge");

    const qualitySlider =
        document.getElementById("qualitySlider");

    const qualityValue =
        document.getElementById("qualityValue");

    const compressButton =
        document.getElementById("compressButton");

    const downloadButton =
        document.getElementById("downloadButton");

    const resetButton =
        document.getElementById("resetButton");

    const successCard =
        document.getElementById("successCard");

    const successText =
        document.getElementById("successText");

    const successDownload =
        document.getElementById("successDownload");

    const errorMessage =
        document.getElementById("errorMessage");

    const resultOriginal =
        document.getElementById("resultOriginal");

    const resultCompressed =
        document.getElementById("resultCompressed");

    const savingPercent =
        document.getElementById("savingPercent");

    const progressArea =
        document.getElementById("progressArea");

    const progressFill =
        document.getElementById("progressFill");

    const progressPercent =
        document.getElementById("progressPercent");

    const topBtn =
        document.getElementById("topBtn");

    const themeToggle =
        document.getElementById("themeToggle");

    const mobileMenuBtn =
        document.getElementById("mobileMenuBtn");

    const navLinks =
        document.getElementById("navLinks");


    /* =====================================================
       VARIABLES
    ===================================================== */

    let selectedFile = null;

    let selectedFormat = "original";

    let compressedBlob = null;

    let compressedFileName = "";

    let previewURL = null;

    let compressedURL = null;



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

                        mobileMenuBtn.textContent = "☰";

                    }
                );

            });

    }



    /* =====================================================
       FILE INPUT
    ===================================================== */

    if (fileInput) {

        fileInput.addEventListener(
            "change",
            function (event) {

                const files =
                    event.target.files;

                if (!files || !files.length) {
                    return;
                }

                handleFile(files[0]);

            }
        );

    }



    /* =====================================================
       DRAG & DROP
    ===================================================== */

    if (uploadCard) {

        [
            "dragenter",
            "dragover"
        ].forEach(function (eventName) {

            uploadCard.addEventListener(
                eventName,
                function (event) {

                    event.preventDefault();

                    event.stopPropagation();

                    uploadCard.classList.add(
                        "drag-over"
                    );

                }
            );

        });


        [
            "dragleave",
            "drop"
        ].forEach(function (eventName) {

            uploadCard.addEventListener(
                eventName,
                function (event) {

                    event.preventDefault();

                    event.stopPropagation();

                    uploadCard.classList.remove(
                        "drag-over"
                    );

                }
            );

        });


        uploadCard.addEventListener(
            "drop",
            function (event) {

                const files =
                    event.dataTransfer.files;

                if (!files || !files.length) {
                    return;
                }

                handleFile(files[0]);

            }
        );

    }



    /* =====================================================
       HANDLE FILE
    ===================================================== */

    function handleFile(file) {

        clearError();

        resetCompressionResult();

        if (!file.type.startsWith("image/")) {

            showError(
                "Please select a JPG, PNG or WEBP image."
            );

            return;

        }


        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];


        if (!allowedTypes.includes(file.type)) {

            showError(
                "This image format is not supported. Please use JPG, PNG or WEBP."
            );

            return;

        }


        const maxSize =
            20 * 1024 * 1024;


        if (file.size > maxSize) {

            showError(
                "The image is larger than 20 MB. Please choose a smaller image."
            );

            return;

        }


        selectedFile = file;


        fileName.textContent =
            file.name;


        originalSize.textContent =
            formatBytes(file.size);


        resultOriginal.textContent =
            formatBytes(file.size);


        formatBadge.textContent =
            getFormatName(file.type);


        previewImage(file);

        readImageDimensions(file);


        workspace.classList.add("show");

        successCard.classList.remove("show");


        workspace.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }



    /* =====================================================
       PREVIEW IMAGE
    ===================================================== */

    function previewImage(file) {

        if (previewURL) {

            URL.revokeObjectURL(previewURL);

        }


        previewURL =
            URL.createObjectURL(file);


        imagePreview.src =
            previewURL;


        imagePreview.style.display =
            "block";


        previewPlaceholder.style.display =
            "none";

    }



    /* =====================================================
       IMAGE DIMENSIONS
    ===================================================== */

    function readImageDimensions(file) {

        const img =
            new Image();


        const url =
            URL.createObjectURL(file);


        img.onload =
            function () {

                imageDimensions.textContent =
                    img.naturalWidth +
                    " × " +
                    img.naturalHeight +
                    " px";

                URL.revokeObjectURL(url);

            };


        img.onerror =
            function () {

                imageDimensions.textContent =
                    "—";

                URL.revokeObjectURL(url);

            };


        img.src = url;

    }



    /* =====================================================
       FORMAT BUTTONS
    ===================================================== */

    const formatButtons =
        document.querySelectorAll(
            ".format-option"
        );


    formatButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                formatButtons.forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add("active");


                selectedFormat =
                    button.dataset.format;


                if (selectedFile) {

                    if (
                        selectedFormat ===
                        "original"
                    ) {

                        formatBadge.textContent =
                            getFormatName(
                                selectedFile.type
                            );

                    } else {

                        formatBadge.textContent =
                            getFormatName(
                                selectedFormat
                            );

                    }

                }


                resetCompressionResult();

            }
        );

    });



    /* =====================================================
       QUALITY SLIDER
    ===================================================== */

    if (qualitySlider) {

        qualitySlider.addEventListener(
            "input",
            function () {

                qualityValue.textContent =
                    qualitySlider.value + "%";


                resetCompressionResult();

            }
        );

    }



    /* =====================================================
       COMPRESS
    ===================================================== */

    if (compressButton) {

        compressButton.addEventListener(
            "click",
            function () {

                if (!selectedFile) {

                    showError(
                        "Please upload an image first."
                    );

                    return;

                }


                compressImage();

            }
        );

    }



    /* =====================================================
       COMPRESS IMAGE
    ===================================================== */

    function compressImage() {

        clearError();


        compressButton.disabled =
            true;


        downloadButton.disabled =
            true;


        successCard.classList.remove(
            "show"
        );


        progressArea.classList.add(
            "show"
        );


        setProgress(0);


        const reader =
            new FileReader();


        reader.onload =
            function (event) {

                const img =
                    new Image();


                img.onload =
                    function () {

                        setProgress(30);


                        const canvas =
                            document.createElement(
                                "canvas"
                            );


                        canvas.width =
                            img.naturalWidth;


                        canvas.height =
                            img.naturalHeight;


                        const ctx =
                            canvas.getContext(
                                "2d",
                                {
                                    alpha: true
                                }
                            );


                        ctx.drawImage(
                            img,
                            0,
                            0
                        );


                        setProgress(55);


                        const outputType =
                            getOutputType();


                        const quality =
                            Number(
                                qualitySlider.value
                            ) / 100;


                        canvas.toBlob(
                            function (blob) {

                                if (!blob) {

                                    finishWithError(
                                        "The image could not be compressed. Please try another image."
                                    );

                                    return;

                                }


                                setProgress(85);


                                compressedBlob =
                                    blob;


                                compressedFileName =
                                    createFileName(
                                        selectedFile.name,
                                        outputType
                                    );


                                resultCompressed.textContent =
                                    formatBytes(
                                        blob.size
                                    );


                                const savings =
                                    calculateSavings(
                                        selectedFile.size,
                                        blob.size
                                    );


                                savingPercent.textContent =
                                    savings;


                                if (compressedURL) {

                                    URL.revokeObjectURL(
                                        compressedURL
                                    );

                                }


                                compressedURL =
                                    URL.createObjectURL(
                                        blob
                                    );


                                setProgress(100);


                                setTimeout(
                                    function () {

                                        progressArea.classList.remove(
                                            "show"
                                        );

                                        compressButton.disabled =
                                            false;

                                        downloadButton.disabled =
                                            false;

                                        successCard.classList.add(
                                            "show"
                                        );


                                        successText.textContent =
                                            "Your image was reduced by " +
                                            savings +
                                            ".";

                                    },
                                    350
                                );

                            },
                            outputType,
                            quality
                        );

                    };


                img.onerror =
                    function () {

                        finishWithError(
                            "The image could not be processed."
                        );

                    };


                img.src =
                    event.target.result;

            };


        reader.onerror =
            function () {

                finishWithError(
                    "The file could not be read."
                );

            };


        reader.readAsDataURL(
            selectedFile
        );

    }



    /* =====================================================
       OUTPUT FORMAT
    ===================================================== */

    function getOutputType() {

        if (
            selectedFormat ===
            "image/jpeg"
        ) {

            return "image/jpeg";

        }


        if (
            selectedFormat ===
            "image/png"
        ) {

            return "image/png";

        }


        if (
            selectedFormat ===
            "image/webp"
        ) {

            return "image/webp";

        }


        /*
         * Original format
         */

        return selectedFile.type;

    }



    /* =====================================================
       CREATE FILE NAME
    ===================================================== */

    function createFileName(
        originalName,
        outputType
    ) {

        const lastDot =
            originalName.lastIndexOf(".");


        let baseName =
            lastDot > 0
                ? originalName.substring(
                    0,
                    lastDot
                )
                : originalName;


        let extension =
            "jpg";


        if (
            outputType ===
            "image/png"
        ) {

            extension = "png";

        } else if (
            outputType ===
            "image/webp"
        ) {

            extension = "webp";

        }


        return (
            baseName +
            "-compressed." +
            extension
        );

    }



    /* =====================================================
       DOWNLOAD
    ===================================================== */

    if (downloadButton) {

        downloadButton.addEventListener(
            "click",
            downloadCompressedImage
        );

    }


    if (successDownload) {

        successDownload.addEventListener(
            "click",
            downloadCompressedImage
        );

    }


    function downloadCompressedImage() {

        if (!compressedBlob) {

            return;

        }


        const url =
            URL.createObjectURL(
                compressedBlob
            );


        const link =
            document.createElement("a");


        link.href = url;

        link.download =
            compressedFileName ||
            "compressed-image";


        document.body.appendChild(link);

        link.click();

        link.remove();


        setTimeout(
            function () {

                URL.revokeObjectURL(url);

            },
            1000
        );

    }



    /* =====================================================
       RESET
    ===================================================== */

    if (resetButton) {

        resetButton.addEventListener(
            "click",
            resetCompressor
        );

    }


    function resetCompressor() {

        selectedFile = null;

        compressedBlob = null;

        compressedFileName = "";


        if (previewURL) {

            URL.revokeObjectURL(
                previewURL
            );

            previewURL = null;

        }


        if (compressedURL) {

            URL.revokeObjectURL(
                compressedURL
            );

            compressedURL = null;

        }


        if (fileInput) {

            fileInput.value = "";

        }


        imagePreview.src = "";

        imagePreview.style.display =
            "none";


        previewPlaceholder.style.display =
            "flex";


        fileName.textContent =
            "—";


        originalSize.textContent =
            "—";


        imageDimensions.textContent =
            "—";


        resultOriginal.textContent =
            "—";


        resultCompressed.textContent =
            "—";


        savingPercent.textContent =
            "—";


        formatBadge.textContent =
            "JPG";


        selectedFormat =
            "original";


        formatButtons.forEach(
            function (button) {

                button.classList.remove(
                    "active"
                );

            }
        );


        const originalButton =
            document.querySelector(
                '[data-format="original"]'
            );


        if (originalButton) {

            originalButton.classList.add(
                "active"
            );

        }


        qualitySlider.value =
            80;


        qualityValue.textContent =
            "80%";


        workspace.classList.remove(
            "show"
        );


        successCard.classList.remove(
            "show"
        );


        progressArea.classList.remove(
            "show"
        );


        downloadButton.disabled =
            true;


        compressButton.disabled =
            false;


        clearError();


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }



    /* =====================================================
       RESET ONLY COMPRESSION RESULT
    ===================================================== */

    function resetCompressionResult() {

        compressedBlob = null;

        compressedFileName = "";


        if (compressedURL) {

            URL.revokeObjectURL(
                compressedURL
            );

            compressedURL = null;

        }


        resultCompressed.textContent =
            "—";


        savingPercent.textContent =
            "—";


        successCard.classList.remove(
            "show"
        );


        downloadButton.disabled =
            true;


        progressArea.classList.remove(
            "show"
        );

    }



    /* =====================================================
       ERROR
    ===================================================== */

    function showError(message) {

        errorMessage.textContent =
            message;

        errorMessage.classList.add(
            "show"
        );

    }


    function clearError() {

        errorMessage.textContent =
            "";

        errorMessage.classList.remove(
            "show"
        );

    }


    function finishWithError(message) {

        progressArea.classList.remove(
            "show"
        );

        compressButton.disabled =
            false;

        downloadButton.disabled =
            true;

        showError(message);

    }



    /* =====================================================
       PROGRESS
    ===================================================== */

    function setProgress(value) {

        const safeValue =
            Math.max(
                0,
                Math.min(
                    100,
                    value
                )
            );


        progressFill.style.width =
            safeValue + "%";


        progressPercent.textContent =
            Math.round(
                safeValue
            ) + "%";

    }



    /* =====================================================
       FORMAT NAME
    ===================================================== */

    function getFormatName(type) {

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



    /* =====================================================
       FILE SIZE
    ===================================================== */

    function formatBytes(bytes) {

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


        const value =
            bytes /
            Math.pow(
                1024,
                index
            );


        if (index === 0) {

            return (
                Math.round(value) +
                " " +
                units[index]
            );

        }


        return (
            value.toFixed(
                value >= 10 ? 1 : 2
            ) +
            " " +
            units[index]
        );

    }



    /* =====================================================
       SAVINGS
    ===================================================== */

    function calculateSavings(
        original,
        compressed
    ) {

        if (
            original <= 0
        ) {

            return "0%";

        }


        const percentage =
            (
                (original - compressed) /
                original
            ) * 100;


        if (percentage <= 0) {

            return "0%";

        }


        return (
            Math.round(
                percentage
            ) +
            "%"
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
       CLEANUP
    ===================================================== */

    window.addEventListener(
        "beforeunload",
        function () {

            if (previewURL) {

                URL.revokeObjectURL(
                    previewURL
                );

            }


            if (compressedURL) {

                URL.revokeObjectURL(
                    compressedURL
                );

            }

        }
    );

});
