/* =========================================================
   IMAGE COMPRESSOR PRO
   REAL IMAGE COMPRESSION
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

    const controlsCard =
        document.getElementById("controlsCard");

    const resultCard =
        document.getElementById("resultCard");

    const compressedPlaceholder =
        document.getElementById(
            "compressedPlaceholder"
        );

    const originalPreview =
        document.getElementById(
            "originalPreview"
        );

    const compressedPreview =
        document.getElementById(
            "compressedPreview"
        );

    const originalSize =
        document.getElementById(
            "originalSize"
        );

    const compressedSize =
        document.getElementById(
            "compressedSize"
        );

    const originalDimensions =
        document.getElementById(
            "originalDimensions"
        );

    const compressedDimensions =
        document.getElementById(
            "compressedDimensions"
        );

    const originalFormat =
        document.getElementById(
            "originalFormat"
        );

    const compressedFormat =
        document.getElementById(
            "compressedFormat"
        );

    const qualityRange =
        document.getElementById(
            "qualityRange"
        );

    const qualityValue =
        document.getElementById(
            "qualityValue"
        );

    const formatSelect =
        document.getElementById(
            "formatSelect"
        );

    const compressButton =
        document.getElementById(
            "compressButton"
        );

    const downloadButton =
        document.getElementById(
            "downloadButton"
        );

    const resetButton =
        document.getElementById(
            "resetButton"
        );

    const newImageButton =
        document.getElementById(
            "newImageButton"
        );

    const loading =
        document.getElementById(
            "loading"
        );

    const errorMessage =
        document.getElementById(
            "errorMessage"
        );

    const savedText =
        document.getElementById(
            "savedText"
        );

    const themeToggle =
        document.getElementById(
            "themeToggle"
        );

    const mobileMenuBtn =
        document.getElementById(
            "mobileMenuBtn"
        );

    const navLinks =
        document.getElementById(
            "navLinks"
        );

    const topBtn =
        document.getElementById(
            "topBtn"
        );


    /* =====================================================
       VARIABLES
    ===================================================== */

    let selectedFile = null;

    let originalImage = null;

    let compressedBlob = null;

    let compressedUrl = null;

    let originalUrl = null;


    const MAX_FILE_SIZE =
        20 * 1024 * 1024;


    /* =====================================================
       FORMAT HELPERS
    ===================================================== */

    function getFormatName(type) {

        if (type === "image/jpeg") {
            return "JPG";
        }

        if (type === "image/png") {
            return "PNG";
        }

        if (type === "image/webp") {
            return "WEBP";
        }

        return "IMAGE";

    }


    function getExtension(type) {

        if (type === "image/jpeg") {
            return "jpg";
        }

        if (type === "image/png") {
            return "png";
        }

        if (type === "image/webp") {
            return "webp";
        }

        return "jpg";

    }


    /* =====================================================
       FILE SIZE FORMAT
    ===================================================== */

    function formatBytes(bytes) {

        if (!bytes || bytes === 0) {
            return "0 Bytes";
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


        return (
            value.toFixed(
                index === 0 ? 0 : 2
            )
            +
            " "
            +
            units[index]
        );

    }


    /* =====================================================
       SHOW ERROR
    ===================================================== */

    function showError(message) {

        errorMessage.textContent =
            message;

        errorMessage.classList.add(
            "show"
        );

    }


    function hideError() {

        errorMessage.textContent = "";

        errorMessage.classList.remove(
            "show"
        );

    }


    /* =====================================================
       VALIDATE FILE
    ===================================================== */

    function validateFile(file) {

        if (!file) {
            return false;
        }


        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];


        if (
            !allowedTypes.includes(
                file.type
            )
        ) {

            showError(
                "Please select a JPG, PNG or WEBP image."
            );

            return false;

        }


        if (
            file.size >
            MAX_FILE_SIZE
        ) {

            showError(
                "The selected image is larger than 20 MB. Please choose a smaller image."
            );

            return false;

        }


        hideError();

        return true;

    }


    /* =====================================================
       HANDLE FILE
    ===================================================== */

    function handleFile(file) {

        if (!validateFile(file)) {
            return;
        }


        selectedFile = file;


        /*
         * Clear previous compression
         */

        compressedBlob = null;


        if (compressedUrl) {

            URL.revokeObjectURL(
                compressedUrl
            );

            compressedUrl = null;

        }


        if (originalUrl) {

            URL.revokeObjectURL(
                originalUrl
            );

        }


        originalUrl =
            URL.createObjectURL(
                file
            );


        originalPreview.src =
            originalUrl;


        originalPreview.alt =
            file.name;


        originalSize.textContent =
            formatBytes(
                file.size
            );


        originalFormat.textContent =
            getFormatName(
                file.type
            );


        /*
         * Load image
         */

        const image =
            new Image();


        image.onload =
            function () {

                originalImage =
                    image;


                originalDimensions.textContent =
                    image.naturalWidth
                    +
                    " × "
                    +
                    image.naturalHeight
                    +
                    " px";


                compressedDimensions.textContent =
                    image.naturalWidth
                    +
                    " × "
                    +
                    image.naturalHeight
                    +
                    " px";


                /*
                 * Show compressor
                 */

                uploadCard.style.display =
                    "none";


                workspace.classList.add(
                    "show"
                );


                controlsCard.classList.add(
                    "show"
                );


                resultCard.classList.remove(
                    "show"
                );


                newImageButton.classList.remove(
                    "show"
                );


                compressedPreview.removeAttribute(
                    "src"
                );


                compressedPreview.style.display =
                    "none";


                compressedPlaceholder.style.display =
                    "block";


                compressedSize.textContent =
                    "—";


                compressedFormat.textContent =
                    "—";


                /*
                 * Scroll to workspace
                 */

                workspace.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            };


        image.onerror =
            function () {

                showError(
                    "The image could not be loaded. Please try another image."
                );

            };


        image.src =
            originalUrl;

    }


    /* =====================================================
       FILE INPUT
    ===================================================== */

    fileInput.addEventListener(
        "change",
        function () {

            const file =
                fileInput.files[0];


            handleFile(file);

        }
    );


    /* =====================================================
       DRAG & DROP
    ===================================================== */

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
                    "dragover"
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
                    "dragover"
                );

            }
        );

    });


    uploadCard.addEventListener(
        "drop",
        function (event) {

            const files =
                event.dataTransfer.files;


            if (
                files &&
                files.length > 0
            ) {

                handleFile(
                    files[0]
                );

            }

        }
    );


    /*
     * Allow clicking upload card
     */

    uploadCard.addEventListener(
        "click",
        function (event) {

            /*
             * Don't trigger twice when
             * clicking the label.
             */

            if (
                event.target.closest(
                    ".choose-button"
                )
            ) {
                return;
            }


            fileInput.click();

        }
    );


    /* =====================================================
       QUALITY SLIDER
    ===================================================== */

    qualityRange.addEventListener(
        "input",
        function () {

            qualityValue.textContent =
                qualityRange.value
                +
                "%";

        }
    );


    /* =====================================================
       GET OUTPUT TYPE
    ===================================================== */

    function getOutputType() {

        const selectedFormat =
            formatSelect.value;


        if (
            selectedFormat ===
            "original"
        ) {

            return selectedFile.type;

        }


        return selectedFormat;

    }


    /* =====================================================
       CANVAS COMPRESSION
    ===================================================== */

    function compressImage() {

        if (
            !selectedFile ||
            !originalImage
        ) {

            showError(
                "Please select an image first."
            );

            return;

        }


        hideError();


        /*
         * Start loading
         */

        loading.classList.add(
            "show"
        );


        compressButton.disabled =
            true;


        resultCard.classList.remove(
            "show"
        );


        /*
         * Small timeout lets the
         * browser update loading UI.
         */

        setTimeout(function () {

            try {

                const canvas =
                    document.createElement(
                        "canvas"
                    );


                const ctx =
                    canvas.getContext(
                        "2d"
                    );


                const width =
                    originalImage.naturalWidth;


                const height =
                    originalImage.naturalHeight;


                canvas.width =
                    width;


                canvas.height =
                    height;


                /*
                 * Improve image rendering
                 */

                ctx.imageSmoothingEnabled =
                    true;

                ctx.imageSmoothingQuality =
                    "high";


                /*
                 * White background is needed
                 * when converting transparent
                 * PNG to JPG.
                 */

                const outputType =
                    getOutputType();


                if (
                    outputType ===
                    "image/jpeg"
                ) {

                    ctx.fillStyle =
                        "#ffffff";

                    ctx.fillRect(
                        0,
                        0,
                        width,
                        height
                    );

                }


                ctx.drawImage(
                    originalImage,
                    0,
                    0,
                    width,
                    height
                );


                const quality =
                    Number(
                        qualityRange.value
                    ) / 100;


                /*
                 * Convert canvas to Blob
                 */

                canvas.toBlob(
                    function (blob) {

                        if (!blob) {

                            showError(
                                "Compression failed. Please try another image."
                            );

                            loading.classList.remove(
                                "show"
                            );

                            compressButton.disabled =
                                false;

                            return;

                        }


                        /*
                         * Remove old URL
                         */

                        if (
                            compressedUrl
                        ) {

                            URL.revokeObjectURL(
                                compressedUrl
                            );

                        }


                        compressedBlob =
                            blob;


                        compressedUrl =
                            URL.createObjectURL(
                                blob
                            );


                        /*
                         * Display compressed image
                         */

                        compressedPreview.src =
                            compressedUrl;


                        compressedPreview.style.display =
                            "block";


                        compressedPlaceholder.style.display =
                            "none";


                        /*
                         * Information
                         */

                        compressedSize.textContent =
                            formatBytes(
                                blob.size
                            );


                        compressedDimensions.textContent =
                            width
                            +
                            " × "
                            +
                            height
                            +
                            " px";


                        compressedFormat.textContent =
                            getFormatName(
                                outputType
                            );


                        /*
                         * Calculate saving
                         */

                        const originalBytes =
                            selectedFile.size;


                        const compressedBytes =
                            blob.size;


                        let savedPercent =
                            0;


                        if (
                            originalBytes >
                            0
                        ) {

                            savedPercent =
                                (
                                    (
                                        originalBytes
                                        -
                                        compressedBytes
                                    )
                                    /
                                    originalBytes
                                )
                                *
                                100;

                        }


                        /*
                         * If the result is
                         * larger than original,
                         * tell user honestly.
                         */

                        if (
                            savedPercent > 0
                        ) {

                            savedText.textContent =
                                "Your image is "
                                +
                                savedPercent.toFixed(1)
                                +
                                "% smaller. "
                                +
                                formatBytes(
                                    originalBytes
                                )
                                +
                                " → "
                                +
                                formatBytes(
                                    compressedBytes
                                );

                        } else {

                            savedText.textContent =
                                "The compressed file is "
                                +
                                Math.abs(
                                    savedPercent
                                ).toFixed(1)
                                +
                                "% larger than the original. "
                                +
                                "Try lowering the quality or changing the format.";

                        }


                        /*
                         * Finish loading
                         */

                        loading.classList.remove(
                            "show"
                        );


                        compressButton.disabled =
                            false;


                        /*
                         * Show result
                         */

                        resultCard.classList.add(
                            "show"
                        );


                        newImageButton.classList.add(
                            "show"
                        );


                        resultCard.scrollIntoView({
                            behavior: "smooth",
                            block: "center"
                        });


                    },
                    outputType,
                    quality
                );


            } catch (error) {

                console.error(
                    error
                );


                showError(
                    "Something went wrong while compressing the image."
                );


                loading.classList.remove(
                    "show"
                );


                compressButton.disabled =
                    false;

            }

        }, 80);

    }


    /* =====================================================
       COMPRESS BUTTON
    ===================================================== */

    compressButton.addEventListener(
        "click",
        compressImage
    );


    /* =====================================================
       DOWNLOAD
    ===================================================== */

    downloadButton.addEventListener(
        "click",
        function () {

            if (!compressedBlob) {

                showError(
                    "Please compress the image first."
                );

                return;

            }


            const outputType =
                getOutputType();


            const extension =
                getExtension(
                    outputType
                );


            const originalName =
                selectedFile.name
                .replace(
                    /\.[^/.]+$/,
                    ""
                );


            const fileName =
                originalName
                +
                "-compressed."
                +
                extension;


            const link =
                document.createElement(
                    "a"
                );


            link.href =
                compressedUrl;


            link.download =
                fileName;


            document.body.appendChild(
                link
            );


            link.click();


            link.remove();

        }
    );


    /* =====================================================
       RESET
    ===================================================== */

    function resetCompressor() {

        selectedFile = null;

        originalImage = null;

        compressedBlob = null;


        if (originalUrl) {

            URL.revokeObjectURL(
                originalUrl
            );

            originalUrl = null;

        }


        if (compressedUrl) {

            URL.revokeObjectURL(
                compressedUrl
            );

            compressedUrl = null;

        }


        fileInput.value = "";


        originalPreview.removeAttribute(
            "src"
        );


        compressedPreview.removeAttribute(
            "src"
        );


        compressedPreview.style.display =
            "none";


        compressedPlaceholder.style.display =
            "block";


        originalSize.textContent =
            "—";


        compressedSize.textContent =
            "—";


        originalDimensions.textContent =
            "—";


        compressedDimensions.textContent =
            "—";


        originalFormat.textContent =
            "—";


        compressedFormat.textContent =
            "—";


        qualityRange.value =
            80;


        qualityValue.textContent =
            "80%";


        formatSelect.value =
            "original";


        workspace.classList.remove(
            "show"
        );


        controlsCard.classList.remove(
            "show"
        );


        resultCard.classList.remove(
            "show"
        );


        newImageButton.classList.remove(
            "show"
        );


        uploadCard.style.display =
            "";


        loading.classList.remove(
            "show"
        );


        compressButton.disabled =
            false;


        hideError();


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    resetButton.addEventListener(
        "click",
        resetCompressor
    );


    newImageButton.addEventListener(
        "click",
        resetCompressor
    );


    /* =====================================================
       DARK MODE
    ===================================================== */

    const savedTheme =
        localStorage.getItem(
            "icp-theme"
        );


    if (
        savedTheme ===
        "dark"
    ) {

        document.body.classList.add(
            "dark"
        );

    }


    themeToggle.addEventListener(
        "click",
        function () {

            document.body.classList.toggle(
                "dark"
            );


            const isDark =
                document.body.classList.contains(
                    "dark"
                );


            localStorage.setItem(
                "icp-theme",
                isDark
                    ? "dark"
                    : "light"
            );

        }
    );


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    mobileMenuBtn.addEventListener(
        "click",
        function () {

            const isOpen =
                navLinks.classList.toggle(
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


    navLinks
        .querySelectorAll("a")
        .forEach(function (link) {

            link.addEventListener(
                "click",
                function () {

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
            );

        });


    /* =====================================================
       CLOSE MENU OUTSIDE
    ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            if (
                !navLinks.contains(
                    event.target
                )
                &&
                !mobileMenuBtn.contains(
                    event.target
                )
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


    /* =====================================================
       BACK TO TOP
    ===================================================== */

    function updateTopButton() {

        if (
            window.scrollY >
            400
        ) {

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


    topBtn.addEventListener(
        "click",
        function () {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );


    updateTopButton();


});
