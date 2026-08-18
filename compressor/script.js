/* =========================================================
   IMAGE COMPRESSOR PRO
   COMPRESSOR PAGE JAVASCRIPT
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

    const previewImage =
        document.getElementById("previewImage");

    const fileName =
        document.getElementById("fileName");

    const originalSize =
        document.getElementById("originalSize");

    const qualityRange =
        document.getElementById("qualityRange");

    const qualityValue =
        document.getElementById("qualityValue");

    const formatSelect =
        document.getElementById("formatSelect");

    const compressButton =
        document.getElementById("compressButton");

    const resultBox =
        document.getElementById("resultBox");

    const compressedSize =
        document.getElementById("compressedSize");

    const savedPercentage =
        document.getElementById("savedPercentage");

    const downloadButtons =
        document.getElementById("downloadButtons");

    const downloadImageButton =
        document.getElementById("downloadImageButton");

    const downloadAgainButton =
        document.getElementById("downloadAgainButton");

    const removeImage =
        document.getElementById("removeImage");

    const ctaUploadButton =
        document.getElementById("ctaUploadButton");

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

    let compressedFileName = "compressed-image.jpg";

    let previewURL = null;


    /* =====================================================
       DARK MODE
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
       FORMAT FILE SIZE
    ===================================================== */

    function formatFileSize(bytes) {

        if (!bytes || bytes <= 0) {
            return "0 KB";
        }


        if (bytes < 1024) {

            return bytes + " B";

        }


        if (bytes < 1024 * 1024) {

            return (
                (bytes / 1024).toFixed(1)
                + " KB"
            );

        }


        return (
            (bytes / (1024 * 1024)).toFixed(2)
            + " MB"
        );

    }


    /* =====================================================
       GET OUTPUT MIME TYPE
    ===================================================== */

    function getOutputType() {

        const selected =
            formatSelect.value;


        if (selected !== "original") {

            return selected;

        }


        if (
            selectedFile &&
            selectedFile.type
        ) {

            return selectedFile.type;

        }


        return "image/jpeg";

    }


    /* =====================================================
       GET EXTENSION
    ===================================================== */

    function getExtension(mimeType) {

        if (mimeType === "image/png") {
            return "png";
        }

        if (mimeType === "image/webp") {
            return "webp";
        }

        return "jpg";

    }


    /* =====================================================
       HANDLE FILE
    ===================================================== */

    function handleFile(file) {

        if (!file) {
            return;
        }


        if (!file.type.startsWith("image/")) {

            alert(
                "Please select a valid image file."
            );

            return;

        }


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


        /* CLEAN OLD PREVIEW URL */

        if (previewURL) {

            URL.revokeObjectURL(previewURL);

        }


        previewURL =
            URL.createObjectURL(file);


        previewImage.src =
            previewURL;


        fileName.textContent =
            file.name;


        originalSize.textContent =
            formatFileSize(file.size);


        workspace.classList.add("show");

        uploadCard.style.display =
            "none";


        resultBox.classList.remove("show");

        downloadButtons.classList.remove("show");

        compressedBlob = null;

    }


    /* =====================================================
       FILE INPUT
    ===================================================== */

    if (fileInput) {

        fileInput.addEventListener(
            "change",
            function () {

                const file =
                    fileInput.files[0];

                handleFile(file);

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


                const file =
                    event.dataTransfer.files[0];


                handleFile(file);

            }
        );

    }


    /* =====================================================
       QUALITY SLIDER
    ===================================================== */

    if (qualityRange) {

        qualityRange.addEventListener(
            "input",
            function () {

                qualityValue.textContent =
                    qualityRange.value + "%";

            }
        );

    }


    /* =====================================================
       COMPRESS IMAGE
    ===================================================== */

    if (compressButton) {

        compressButton.addEventListener(
            "click",
            function () {

                if (!selectedFile) {

                    alert(
                        "Please select an image first."
                    );

                    return;

                }


                compressImage();

            }
        );

    }


    function compressImage() {

        compressButton.disabled =
            true;

        compressButton.innerHTML =
            "Compressing... <span>...</span>";


        const reader =
            new FileReader();


        reader.onload = function (event) {

            const image =
                new Image();


            image.onload = function () {

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


                context.drawImage(
                    image,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );


                const quality =
                    Number(
                        qualityRange.value
                    ) / 100;


                const outputType =
                    getOutputType();


                canvas.toBlob(
                    function (blob) {

                        if (!blob) {

                            alert(
                                "Compression failed. Please try another image."
                            );

                            resetCompressButton();

                            return;

                        }


                        compressedBlob =
                            blob;


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


                        compressedFileName =
                            originalName
                            + "-compressed."
                            + extension;


                        compressedSize.textContent =
                            formatFileSize(
                                blob.size
                            );


                        let saved = 0;


                        if (selectedFile.size > 0) {

                            saved =
                                Math.round(
                                    (
                                        1 -
                                        (
                                            blob.size /
                                            selectedFile.size
                                        )
                                    ) * 100
                                );

                        }


                        if (saved < 0) {
                            saved = 0;
                        }


                        savedPercentage.textContent =
                            saved + "% smaller";


                        resultBox.classList.add(
                            "show"
                        );


                        downloadButtons.classList.add(
                            "show"
                        );


                        resetCompressButton();

                    },
                    outputType,
                    quality
                );

            };


            image.onerror = function () {

                alert(
                    "Could not read this image."
                );

                resetCompressButton();

            };


            image.src =
                event.target.result;

        };


        reader.onerror = function () {

            alert(
                "Could not read the selected file."
            );

            resetCompressButton();

        };


        reader.readAsDataURL(
            selectedFile
        );

    }


    /* =====================================================
       RESET COMPRESS BUTTON
    ===================================================== */

    function resetCompressButton() {

        compressButton.disabled =
            false;

        compressButton.innerHTML =
            'Compress Image <span>→</span>';

    }


    /* =====================================================
       DOWNLOAD
    ===================================================== */

    function downloadCompressedImage() {

        if (!compressedBlob) {

            alert(
                "Please compress the image first."
            );

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
            compressedFileName;


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


    if (downloadImageButton) {

        downloadImageButton.addEventListener(
            "click",
            downloadCompressedImage
        );

    }


    if (downloadAgainButton) {

        downloadAgainButton.addEventListener(
            "click",
            downloadCompressedImage
        );

    }


    /* =====================================================
       REMOVE IMAGE
    ===================================================== */

    if (removeImage) {

        removeImage.addEventListener(
            "click",
            function () {

                resetCompressor();

            }
        );

    }


    function resetCompressor() {

        selectedFile = null;

        compressedBlob = null;

        if (previewURL) {

            URL.revokeObjectURL(
                previewURL
            );

            previewURL = null;

        }


        previewImage.src = "";

        fileName.textContent = "—";

        originalSize.textContent = "—";

        compressedSize.textContent = "—";

        savedPercentage.textContent = "—";


        resultBox.classList.remove(
            "show"
        );


        downloadButtons.classList.remove(
            "show"
        );


        workspace.classList.remove(
            "show"
        );


        uploadCard.style.display =
            "";


        fileInput.value = "";

    }


    /* =====================================================
       CTA UPLOAD BUTTON
    ===================================================== */

    if (ctaUploadButton) {

        ctaUploadButton.addEventListener(
            "click",
            function () {

                window.scrollTo({
                    top: document
                        .querySelector(
                            ".compressor-section"
                        )
                        .offsetTop - 80,

                    behavior: "smooth"

                });


                setTimeout(
                    function () {

                        fileInput.click();

                    },
                    500
                );

            }
        );

    }


    /* =====================================================
       FAQ
    ===================================================== */

    const faqItems =
        document.querySelectorAll(
            ".faq-item"
        );


    faqItems.forEach(function (item) {

        item.addEventListener(
            "toggle",
            function () {

                if (!item.open) {
                    return;
                }


                faqItems.forEach(
                    function (other) {

                        if (other !== item) {

                            other.removeAttribute(
                                "open"
                            );

                        }

                    }
                );

            }
        );

    });


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


            if (
                !navLinks.contains(
                    event.target
                ) &&
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

});
