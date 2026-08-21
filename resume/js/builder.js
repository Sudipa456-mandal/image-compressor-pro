/* =========================================================
   RESUMECRAFT BUILDER
   TEMPLATE SYSTEM
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       AVAILABLE TEMPLATES
    ===================================================== */

    const TEMPLATE_NAMES = [
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
       GET RESUME TEMPLATE WRAPPER
    ===================================================== */

    const templateWrapper =
        document.getElementById("resumeTemplateWrapper");


    /* =====================================================
       APPLY TEMPLATE
    ===================================================== */

    function applyResumeTemplate(templateName) {

        if (!templateWrapper) {
            console.error(
                "Resume template wrapper not found."
            );

            return;
        }


        /* -----------------------------------------------
           CHECK TEMPLATE NAME
        ------------------------------------------------ */

        if (!TEMPLATE_NAMES.includes(templateName)) {

            templateName = "minimal";

        }


        /* -----------------------------------------------
           REMOVE ALL OLD TEMPLATE CLASSES
        ------------------------------------------------ */

        TEMPLATE_NAMES.forEach(function (template) {

            templateWrapper.classList.remove(
                "template-" + template
            );

        });


        /* -----------------------------------------------
           ADD SELECTED TEMPLATE CLASS
        ------------------------------------------------ */

        templateWrapper.classList.add(
            "template-" + templateName
        );


        /* -----------------------------------------------
           SAVE TEMPLATE
        ------------------------------------------------ */

        saveSelectedTemplate(templateName);


        /* -----------------------------------------------
           DEBUG
        ------------------------------------------------ */

        console.log(
            "Resume template selected:",
            templateName
        );

    }


    /* =====================================================
       SAVE SELECTED TEMPLATE
    ===================================================== */

    function saveSelectedTemplate(templateName) {

        try {

            let resumeData =
                JSON.parse(
                    localStorage.getItem(
                        "resumeCraftData"
                    )
                ) || {};


            if (!resumeData.settings) {

                resumeData.settings = {};

            }


            resumeData.settings.template =
                templateName;


            localStorage.setItem(
                "resumeCraftData",
                JSON.stringify(resumeData)
            );

        } catch (error) {

            console.error(
                "Could not save selected template:",
                error
            );

        }

    }


    /* =====================================================
       GET SAVED TEMPLATE
    ===================================================== */

    function getSavedTemplate() {

        try {

            const resumeData =
                JSON.parse(
                    localStorage.getItem(
                        "resumeCraftData"
                    )
                );


            if (
                resumeData &&
                resumeData.settings &&
                TEMPLATE_NAMES.includes(
                    resumeData.settings.template
                )
            ) {

                return resumeData.settings.template;

            }

        } catch (error) {

            console.error(
                "Could not read saved template:",
                error
            );

        }


        return null;

    }


    /* =====================================================
       GET TEMPLATE FROM URL
       
       Example:
       builder.html?template=classic
       builder.html?template=modern
       builder.html?template=ats
    ===================================================== */

    function getTemplateFromURL() {

        const urlParams =
            new URLSearchParams(
                window.location.search
            );


        const template =
            urlParams.get("template");


        if (
            template &&
            TEMPLATE_NAMES.includes(template)
        ) {

            return template;

        }


        return null;

    }


    /* =====================================================
       LOAD TEMPLATE
       
       Priority:
       
       1. URL template
       2. Saved template
       3. Minimal
    ===================================================== */

    function loadResumeTemplate() {

        const urlTemplate =
            getTemplateFromURL();


        const savedTemplate =
            getSavedTemplate();


        let selectedTemplate;


        /* -----------------------------------------------
           URL HAS HIGHEST PRIORITY
        ------------------------------------------------ */

        if (urlTemplate) {

            selectedTemplate =
                urlTemplate;

        }


        /* -----------------------------------------------
           OTHERWISE USE SAVED TEMPLATE
        ------------------------------------------------ */

        else if (savedTemplate) {

            selectedTemplate =
                savedTemplate;

        }


        /* -----------------------------------------------
           DEFAULT
        ------------------------------------------------ */

        else {

            selectedTemplate =
                "minimal";

        }


        applyResumeTemplate(
            selectedTemplate
        );

    }


    /* =====================================================
       LOAD SELECTED TEMPLATE
    ===================================================== */

    loadResumeTemplate();


    /* =====================================================
       MAKE FUNCTION AVAILABLE GLOBALLY
       
       This allows other JS files to call:
       
       applyResumeTemplate("classic")
       applyResumeTemplate("modern")
       etc.
    ===================================================== */

    window.applyResumeTemplate =
        applyResumeTemplate;

});
