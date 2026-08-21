/* =========================================================
   RESUMECRAFT - BUILDER TEMPLATE SYSTEM
   =========================================================

   Templates:
   classic
   modern
   minimal
   executive
   professional
   elegant
   creative
   corporate
   compact
   ats

   Priority:
   1. URL template
   2. resumeCraftData.settings.template
   3. resumeCraftTemplate
   4. minimal
========================================================= */

(function () {

    "use strict";


    /* =====================================================
       1. AVAILABLE TEMPLATES
    ===================================================== */

    const TEMPLATES = [
        "classic",
        "modern",
        "minimal",
        "executive",
        "professional",
        "elegant",
        "creative",
        "corporate",
        "compact",
        "ats"
    ];


    /* =====================================================
       2. GET WRAPPER
    ===================================================== */

    function getResumeWrapper() {

        return document.getElementById(
            "resumeTemplateWrapper"
        );

    }


    /* =====================================================
       3. CHECK VALID TEMPLATE
    ===================================================== */

    function isValidTemplate(template) {

        return (
            typeof template === "string" &&
            TEMPLATES.includes(
                template.toLowerCase()
            )
        );

    }


    /* =====================================================
       4. NORMALIZE TEMPLATE NAME
    ===================================================== */

    function normalizeTemplate(template) {

        if (
            typeof template !== "string"
        ) {

            return null;

        }

        const normalized =
            template
                .trim()
                .toLowerCase();

        if (
            TEMPLATES.includes(
                normalized
            )
        ) {

            return normalized;

        }

        return null;

    }


    /* =====================================================
       5. REMOVE ALL TEMPLATE CLASSES
    ===================================================== */

    function removeAllTemplateClasses(wrapper) {

        TEMPLATES.forEach(
            function (template) {

                wrapper.classList.remove(
                    "template-" + template
                );

            }
        );

    }


    /* =====================================================
       6. SAVE TEMPLATE
    ===================================================== */

    function saveTemplate(template) {

        /* ---------------------------------------------
           Save simple template
        --------------------------------------------- */

        localStorage.setItem(
            "resumeCraftTemplate",
            template
        );


        /* ---------------------------------------------
           Save inside resumeCraftData
        --------------------------------------------- */

        try {

            let resumeData =
                JSON.parse(
                    localStorage.getItem(
                        "resumeCraftData"
                    )
                ) || {};


            if (
                !resumeData.settings
            ) {

                resumeData.settings = {};

            }


            resumeData.settings.template =
                template;


            localStorage.setItem(
                "resumeCraftData",
                JSON.stringify(
                    resumeData
                )
            );

        } catch (error) {

            console.error(
                "ResumeCraft template save error:",
                error
            );

        }

    }


    /* =====================================================
       7. APPLY TEMPLATE
    ===================================================== */

    function applyResumeTemplate(template) {

        const wrapper =
            getResumeWrapper();


        /* ---------------------------------------------
           Wrapper check
        --------------------------------------------- */

        if (!wrapper) {

            console.error(
                "ResumeCraft ERROR: " +
                "#resumeTemplateWrapper not found."
            );

            return false;

        }


        /* ---------------------------------------------
           Normalize template
        --------------------------------------------- */

        let selectedTemplate =
            normalizeTemplate(
                template
            );


        /* ---------------------------------------------
           Invalid template
           → minimal
        --------------------------------------------- */

        if (!selectedTemplate) {

            selectedTemplate =
                "minimal";

        }


        /* ---------------------------------------------
           Remove previous template
        --------------------------------------------- */

        removeAllTemplateClasses(
            wrapper
        );


        /* ---------------------------------------------
           Add selected template
        --------------------------------------------- */

        wrapper.classList.add(
            "template-" +
            selectedTemplate
        );


        /* ---------------------------------------------
           Save selected template
        --------------------------------------------- */

        saveTemplate(
            selectedTemplate
        );


        /* ---------------------------------------------
           Debug
        --------------------------------------------- */

        console.log(
            "ResumeCraft ACTIVE TEMPLATE:",
            selectedTemplate
        );

        console.log(
            "Wrapper classes:",
            wrapper.className
        );


        return true;

    }


    /* =====================================================
       8. GET TEMPLATE FROM URL
       
       Example:
       builder.html?template=classic
       builder.html?template=modern
       builder.html?template=ats
    ===================================================== */

    function getTemplateFromURL() {

        const params =
            new URLSearchParams(
                window.location.search
            );


        const template =
            params.get(
                "template"
            );


        return normalizeTemplate(
            template
        );

    }


    /* =====================================================
       9. GET TEMPLATE FROM resumeCraftData
    ===================================================== */

    function getTemplateFromResumeData() {

        try {

            const resumeData =
                JSON.parse(
                    localStorage.getItem(
                        "resumeCraftData"
                    )
                );


            if (
                resumeData &&
                resumeData.settings
            ) {

                return normalizeTemplate(
                    resumeData.settings.template
                );

            }

        } catch (error) {

            console.error(
                "ResumeCraft data read error:",
                error
            );

        }


        return null;

    }


    /* =====================================================
       10. GET TEMPLATE FROM SIMPLE STORAGE
    ===================================================== */

    function getTemplateFromStorage() {

        const savedTemplate =
            localStorage.getItem(
                "resumeCraftTemplate"
            );


        return normalizeTemplate(
            savedTemplate
        );

    }


    /* =====================================================
       11. FIND SELECTED TEMPLATE
    ===================================================== */

    function getSelectedTemplate() {

        /* ---------------------------------------------
           1. URL
        --------------------------------------------- */

        const urlTemplate =
            getTemplateFromURL();


        if (urlTemplate) {

            return urlTemplate;

        }


        /* ---------------------------------------------
           2. resumeCraftData
        --------------------------------------------- */

        const dataTemplate =
            getTemplateFromResumeData();


        if (dataTemplate) {

            return dataTemplate;

        }


        /* ---------------------------------------------
           3. simple localStorage
        --------------------------------------------- */

        const storageTemplate =
            getTemplateFromStorage();


        if (storageTemplate) {

            return storageTemplate;

        }


        /* ---------------------------------------------
           4. default
        --------------------------------------------- */

        return "minimal";

    }


    /* =====================================================
       12. LOAD TEMPLATE
    ===================================================== */

    function loadResumeTemplate() {

        const selectedTemplate =
            getSelectedTemplate();


        console.log(
            "ResumeCraft loading template:",
            selectedTemplate
        );


        applyResumeTemplate(
            selectedTemplate
        );

    }


    /* =====================================================
       13. WAIT UNTIL DOM IS READY
    ===================================================== */

    function startTemplateSystem() {

        loadResumeTemplate();

    }


    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            startTemplateSystem
        );

    } else {

        startTemplateSystem();

    }


    /* =====================================================
       14. MAKE FUNCTION GLOBAL
       
       Other JS files can use:

       applyResumeTemplate("classic")
       applyResumeTemplate("modern")
       applyResumeTemplate("minimal")
       applyResumeTemplate("executive")
       applyResumeTemplate("professional")
       applyResumeTemplate("elegant")
       applyResumeTemplate("creative")
       applyResumeTemplate("corporate")
       applyResumeTemplate("compact")
       applyResumeTemplate("ats")
    ===================================================== */

    window.applyResumeTemplate =
        applyResumeTemplate;


    /* =====================================================
       15. MAKE LOAD FUNCTION GLOBAL
    ===================================================== */

    window.loadResumeTemplate =
        loadResumeTemplate;


})();
