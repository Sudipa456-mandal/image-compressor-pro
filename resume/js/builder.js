/* =========================================================
   RESUMECRAFT - BUILDER TEMPLATE SYSTEM
   =========================================================
   
   Supported templates:
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
   2. Saved template
   3. Minimal
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
       2. GET RESUME WRAPPER
    ===================================================== */

    function getResumeWrapper() {

        return document.getElementById(
            "resumeTemplateWrapper"
        );

    }


    /* =====================================================
       3. CHECK TEMPLATE
    ===================================================== */

    function validTemplate(template) {

        return TEMPLATES.indexOf(template) !== -1;

    }


    /* =====================================================
       4. REMOVE ALL TEMPLATE CLASSES
    ===================================================== */

    function removeTemplateClasses(wrapper) {

        TEMPLATES.forEach(function (template) {

            wrapper.classList.remove(
                "template-" + template
            );

        });

    }


    /* =====================================================
       5. SAVE TEMPLATE
    ===================================================== */

    function saveTemplate(template) {

        localStorage.setItem(
            "resumeCraftTemplate",
            template
        );


        /* Also save inside resumeCraftData */

        try {

            let data =
                JSON.parse(
                    localStorage.getItem(
                        "resumeCraftData"
                    )
                ) || {};


            if (!data.settings) {

                data.settings = {};

            }


            data.settings.template = template;


            localStorage.setItem(
                "resumeCraftData",
                JSON.stringify(data)
            );

        } catch (error) {

            console.error(
                "Template save error:",
                error
            );

        }

    }


    /* =====================================================
       6. APPLY TEMPLATE
    ===================================================== */

    function applyResumeTemplate(template) {

        const wrapper =
            getResumeWrapper();


        if (!wrapper) {

            console.error(
                "ERROR: resumeTemplateWrapper not found."
            );

            return;

        }


        /* Invalid template = minimal */

        if (!validTemplate(template)) {

            template = "minimal";

        }


        /* Remove old template */

        removeTemplateClasses(
            wrapper
        );


        /* Add selected template */

        wrapper.classList.add(
            "template-" + template
        );


        /* Save selected template */

        saveTemplate(
            template
        );


        console.log(
            "Selected template:",
            template
        );

    }


    /* =====================================================
       7. GET TEMPLATE FROM URL
    ===================================================== */

    function getURLTemplate() {

        const params =
            new URLSearchParams(
                window.location.search
            );


        const template =
            params.get("template");


        if (
            template &&
            validTemplate(template)
        ) {

            return template;

        }


        return null;

    }


    /* =====================================================
       8. GET SAVED TEMPLATE
    ===================================================== */

    function getSavedTemplate() {

        /* Check direct saved template */

        const saved =
            localStorage.getItem(
                "resumeCraftTemplate"
            );


        if (
            saved &&
            validTemplate(saved)
        ) {

            return saved;

        }


        /* Check resumeCraftData */

        try {

            const data =
                JSON.parse(
                    localStorage.getItem(
                        "resumeCraftData"
                    )
                );


            if (
                data &&
                data.settings &&
                validTemplate(
                    data.settings.template
                )
            ) {

                return data.settings.template;

            }

        } catch (error) {

            console.error(
                "Template read error:",
                error
            );

        }


        return null;

    }


    /* =====================================================
       9. LOAD TEMPLATE
    ===================================================== */

    function loadResumeTemplate() {

        const urlTemplate =
            getURLTemplate();


        /* URL has highest priority */

        if (urlTemplate) {

            applyResumeTemplate(
                urlTemplate
            );

            return;

        }


        /* Otherwise saved template */

        const savedTemplate =
            getSavedTemplate();


        if (savedTemplate) {

            applyResumeTemplate(
                savedTemplate
            );

            return;

        }


        /* Default */

        applyResumeTemplate(
            "minimal"
        );

    }


    /* =====================================================
       10. START
    ===================================================== */

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            loadResumeTemplate();

        }
    );


    /* =====================================================
       11. MAKE FUNCTION AVAILABLE
    ===================================================== */

    window.applyResumeTemplate =
        applyResumeTemplate;


})();
