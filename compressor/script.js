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

    const browseButton =
        document.getElementById("browseButton");

    const uploadBox =
        document.getElementById("uploadBox");

    const controlsPanel =
        document.getElementById("controlsPanel");

    const qualityRange =
        document.getElementById("qualityRange");

    const qualityValue =
        document.getElementById("qualityValue");

    const formatSelect =
        document.getElementById("formatSelect");

    const compressButton =
        document.getElementById("compressButton");

    const resultsSection =
        document.getElementById("resultsSection");

    const resultsList =
        document.getElementById("resultsList");

    const clearButton =
        document.getElementById("clearButton");

    const downloadAllButton =
        document.getElementById("downloadAllButton");

    const ctaUploadButton =
        document.getElementById("ctaUploadButton");

    const themeToggle =
        document.getElementById("themeToggle");

    const mobileMenuBtn =
        document.getElementById("mobileMenuBtn");

    const navLinks =
        document.querySelector(".nav-links");

    const topButton =
        document.getElementById("topButton");


    /* =====================================================
       VARIABLES
    ===================================================== */

    let selectedFiles = [];

    let compressedResults = [];

    const MAX_FILES = 20;



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

    browseButton.addEventListener(
        "click",
        function () {

            fileInput.click();

        }
    );


    if (ctaUploadButton) {

        ctaUploadButton.addEventListener(
            "click",
            function () {

                fileInput.click();

            }
        );

    }


    fileInput.addEventListener(
        "change",
        function () {

            handleFiles(
                Array.from(fileInput.files)
            );

        }
    );



    /* =====================================================
       DRAG & DROP
    ===================================================== */

    uploadBox.addEventListener(
        "dragover",
        function (event) {

            event.preventDefault();

            uploadBox.classList.add("dragover");

        }
    );


    uploadBox.addEventListener(
        "dragleave",
        function () {

            uploadBox.classList.remove(
                "dragover"
            );

        }
    );


    uploadBox.addEventListener(
        "drop",
        function (event) {

            event.preventDefault();

            uploadBox.classList.remove(
                "dragover"
            );

            const files =
                Array.from(event.dataTransfer.files);

            handleFiles(files);

        }
    );



    /* =====================================================
       QUALITY
    ===================================================== */

    qualityRange.addEventListener(
        "input",
        function () {

            qualityValue.textContent =
                qualityRange.value + "%";

        }
    );



    /* =====================================================
       HANDLE FILES
    ===================================================== */

    function handleFiles(files) {

        const imageFiles =
            files.filter(function (file) {

                return file.type.startsWith("image/");

            });


        if (imageFiles.length === 0) {

            alert(
                "Please select JPG, PNG or WEBP images."
            );

            return;

        }


        const allowedFiles =
            imageFiles.slice(0, MAX_FILES);


        selectedFiles =
            allowedFiles;


        compressedResults = [];


        renderSelectedFiles();


        controlsPanel.classList.add("show");

        resultsSection.classList.remove("show");

    }



    /* =====================================================
       RENDER SELECTED FILES
    ===================================================== */

    function renderSelectedFiles() {

        resultsList.innerHTML = "";


        selectedFiles.forEach(
            function (file, index) {

                const card =
                    document.createElement("div");

                card.className =
                    "result-card";


                const preview =
                    document.createElement("div");

                preview.className =
                    "result-preview";


                const image =
                    document.createElement("img");

                image.alt =
                    "Selected image";


                const objectURL =
                    URL.createObjectURL(file);

                image.src =
                    objectURL;


                image.onload =
                    function () {

                        URL.revokeObjectURL(
                            objectURL
                        );

                    };


                preview.appendChild(image);


                const info =
                    document.createElement("div");

                info.className =
                    "result-info";


                const name =
                    document.createElement("div");

                name.className =
                    "result-name";

                name.textContent =
                    file.name;


                const details =
                    document.createElement("div");

                details.className =
                    "result-details";

                details.innerHTML =
                    formatBytes(file.size) +
                    " <span>•</span> Ready to compress";


                info.appendChild(name);

                info.appendChild(details);


                const action =
                    document.createElement("div");

                action.className =
                    "result-action";


                const removeButton =
                    document.createElement("button");

                removeButton.type =
                    "button";

                removeButton.className =
                    "remove-button";

                removeButton.textContent =
                    "×";

                removeButton.title =
                    "Remove image";


                removeButton.addEventListener(
                    "click",
                    function () {

                        removeSelectedFile(index);

                    }
                );


                action.appendChild(
                    removeButton
                );


                card.appendChild(preview);

                card.appendChild(info);

                card.appendChild(action);


                resultsList.appendChild(card);

            }
        );

    }



    /* =====================================================
       REMOVE FILE
    ===================================================== */

    function removeSelectedFile(index) {

        selectedFiles.splice(
            index,
            1
        );


        compressedResults = [];


        if (selectedFiles.length === 0) {

            controlsPanel.classList.remove(
                "show"
            );

            resultsSection.classList.remove(
                "show"
            );

            resultsList.innerHTML = "";

            fileInput.value = "";

            return;

        }


        renderSelectedFiles();

    }



    /* =====================================================
       COMPRESS BUTTON
    ===================================================== */

    compressButton.addEventListener(
        "click",
        async function () {

            if (selectedFiles.length === 0) {

                alert(
                    "Please upload at least one image."
                );

                return;

            }


            compressButton.disabled = true;

            compressButton.innerHTML =
                "Compressing...";


            compressedResults = [];


            try {

                for (
                    let i = 0;
                    i < selectedFiles.length;
                    i++
                ) {

                    const file =
                        selectedFiles[i];


                    const result =
                        await compressImage(file);


                    compressedResults.push(
                        result
                    );

                }


                renderCompressedResults();

                resultsSection.classList.add(
                    "show"
                );


                resultsSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });


            } catch (error) {

                console.error(error);

                alert(
                    "Something went wrong while compressing the images."
                );

            }


            compressButton.disabled = false;

            compressButton.innerHTML =
                "Compress Images <span>→</span>";

        }
    );



    /* =====================================================
       COMPRESS IMAGE
    ===================================================== */

    function compressImage(file) {

        return new Promise(
            function (resolve, reject) {

                const reader =
                    new FileReader();


                reader.onload =
                    function (event) {

                        const image =
                            new Image();


                        image.onload =
                            function () {

                                try {

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


                                    let outputType =
                                        formatSelect.value;


                                    if (
                                        outputType ===
                                        "original"
                                    ) {

                                        outputType =
                                            getOutputType(
                                                file.type
                                            );

                                    }


                                    /*
                                     PNG compression through
                                     canvas does not use the
                                     quality parameter in most
                                     browsers. For PNG we keep
                                     the selected format.
                                    */

                                    canvas.toBlob(
                                        function (blob) {

                                            if (!blob) {

                                                reject(
                                                    new Error(
                                                        "Compression failed."
                                                    )
                                                );

                                                return;

                                            }


                                            const outputName =
                                                createOutputName(
                                                    file.name,
                                                    outputType
                                                );


                                            resolve({

                                                originalFile:
                                                    file,

                                                blob:
                                                    blob,

                                                originalSize:
                                                    file.size,

                                                compressedSize:
                                                    blob.size,

                                                name:
                                                    outputName,

                                                type:
                                                    outputType

                                            });

                                        },
                                        outputType,
                                        quality
                                    );


                                } catch (error) {

                                    reject(error);

                                }

                            };


                        image.onerror =
                            function () {

                                reject(
                                    new Error(
                                        "Could not read image."
                                    )
                                );

                            };


                        image.src =
                            event.target.result;

                    };


                reader.onerror =
                    function () {

                        reject(
                            new Error(
                                "Could not read file."
                            )
                        );

                    };


                reader.readAsDataURL(file);

            }
        );

    }



    /* =====================================================
       OUTPUT TYPE
    ===================================================== */

    function getOutputType(type) {

        if (
            type === "image/jpeg" ||
            type === "image/png" ||
            type === "image/webp"
        ) {

            return type;

        }


        return "image/jpeg";

    }



    /* =====================================================
       OUTPUT FILE NAME
    ===================================================== */

    function createOutputName(
        originalName,
        outputType
    ) {

        const lastDot =
            originalName.lastIndexOf(".");


        let baseName =
            lastDot > -1
                ? originalName.substring(
                    0,
                    lastDot
                )
                : originalName;


        let extension =
            ".jpg";


        if (
            outputType ===
            "image/png"
        ) {

            extension =
                ".png";

        }


        if (
            outputType ===
            "image/webp"
        ) {

            extension =
                ".webp";

        }


        return (
            baseName +
            "-compressed" +
            extension
        );

    }



    /* =====================================================
       RENDER COMPRESSED RESULTS
    ===================================================== */

    function renderCompressedResults() {

        resultsList.innerHTML = "";


        compressedResults.forEach(
            function (result, index) {

                const card =
                    document.createElement("div");

                card.className =
                    "result-card";


                /* PREVIEW */

                const preview =
                    document.createElement("div");

                preview.className =
                    "result-preview";


                const image =
                    document.createElement("img");


                const previewURL =
                    URL.createObjectURL(
                        result.blob
                    );


                image.src =
                    previewURL;

                image.alt =
                    "Compressed image";


                image.onload =
                    function () {

                        URL.revokeObjectURL(
                            previewURL
                        );

                    };


                preview.appendChild(
                    image
                );


                /* INFORMATION */

                const info =
                    document.createElement("div");

                info.className =
                    "result-info";


                const name =
                    document.createElement("div");

                name.className =
                    "result-name";

                name.textContent =
                    result.name;


                const details =
                    document.createElement("div");

                details.className =
                    "result-details";


                const saved =
                    calculateSavedPercentage(
                        result.originalSize,
                        result.compressedSize
                    );


                details.innerHTML =
                    formatBytes(
                        result.originalSize
                    ) +
                    " <span>→</span> " +
                    formatBytes(
                        result.compressedSize
                    ) +
                    ' <span class="saved">' +
                    saved +
                    "% smaller</span>";


                info.appendChild(name);

                info.appendChild(details);


                /* ACTIONS */

                const action =
                    document.createElement("div");

                action.className =
                    "result-action";


                const downloadButton =
                    document.createElement("button");

                downloadButton.type =
                    "button";

                downloadButton.className =
                    "download-button";

                downloadButton.textContent =
                    "↓ Download";


                downloadButton.addEventListener(
                    "click",
                    function () {

                        downloadBlob(
                            result.blob,
                            result.name
                        );

                    }
                );


                const removeButton =
                    document.createElement("button");

                removeButton.type =
                    "button";

                removeButton.className =
                    "remove-button";

                removeButton.textContent =
                    "×";

                removeButton.title =
                    "Remove result";


                removeButton.addEventListener(
                    "click",
                    function () {

                        removeCompressedResult(
                            index
                        );

                    }
                );


                action.appendChild(
                    downloadButton
                );

                action.appendChild(
                    removeButton
                );


                card.appendChild(preview);

                card.appendChild(info);

                card.appendChild(action);


                resultsList.appendChild(card);

            }
        );

    }



    /* =====================================================
       REMOVE COMPRESSED RESULT
    ===================================================== */

    function removeCompressedResult(index) {

        compressedResults.splice(
            index,
            1
        );


        if (
            compressedResults.length === 0
        ) {

            resultsSection.classList.remove(
                "show"
            );

            return;

        }


        renderCompressedResults();

    }



    /* =====================================================
       DOWNLOAD SINGLE
    ===================================================== */

    function downloadBlob(
        blob,
        filename
    ) {

        const url =
            URL.createObjectURL(blob);


        const link =
            document.createElement("a");


        link.href =
            url;

        link.download =
            filename;


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
       DOWNLOAD ALL
    ===================================================== */

    downloadAllButton.addEventListener(
        "click",
        async function () {

            if (
                compressedResults.length === 0
            ) {

                alert(
                    "Please compress your images first."
                );

                return;

            }


            downloadAllButton.disabled =
                true;


            downloadAllButton.textContent =
                "Preparing Downloads...";


            /*
             * Download each compressed image.
             *
             * A small delay is used between downloads
             * to reduce browser download blocking.
             */

            for (
                let i = 0;
                i < compressedResults.length;
                i++
            ) {

                const result =
                    compressedResults[i];


                downloadBlob(
                    result.blob,
                    result.name
                );


                await wait(350);

            }


            downloadAllButton.disabled =
                false;


            downloadAllButton.textContent =
                "↓ Download All";

        }
    );



    /* =====================================================
       CLEAR ALL
    ===================================================== */

    clearButton.addEventListener(
        "click",
        function () {

            selectedFiles = [];

            compressedResults = [];

            fileInput.value = "";

            resultsList.innerHTML = "";

            controlsPanel.classList.remove(
                "show"
            );

            resultsSection.classList.remove(
                "show"
            );

        }
    );



    /* =====================================================
       FORMAT BYTES
    ===================================================== */

    function formatBytes(bytes) {

        if (bytes === 0) {

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
                index === 0 ? 0 : 1
            ) +
            " " +
            units[index]
        );

    }



    /* =====================================================
       SAVED PERCENTAGE
    ===================================================== */

    function calculateSavedPercentage(
        original,
        compressed
    ) {

        if (
            original <= 0
        ) {

            return 0;

        }


        const percentage =
            (
                (original - compressed) /
                original
            ) *
            100;


        return Math.max(
            0,
            Math.round(
                percentage
            )
        );

    }



    /* =====================================================
       WAIT
    ===================================================== */

    function wait(milliseconds) {

        return new Promise(
            function (resolve) {

                setTimeout(
                    resolve,
                    milliseconds
                );

            }
        );

    }



    /* =====================================================
       BACK TO TOP
    ===================================================== */

    function updateTopButton() {

        if (!topButton) {
            return;
        }


        if (
            window.scrollY > 400
        ) {

            topButton.classList.add(
                "visible"
            );

        } else {

            topButton.classList.remove(
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


    if (topButton) {

        topButton.addEventListener(
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
                navLinks.contains(
                    event.target
                ) ||
                mobileMenuBtn.contains(
                    event.target
                )
            ) {

                return;

            }


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
