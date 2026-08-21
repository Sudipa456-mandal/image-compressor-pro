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
/* =========================================================
   RESUMECRAFT - TEMPLATE SWITCHER
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
========================================================= */

const RESUME_TEMPLATES = [
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


/* =========================================================
   APPLY SELECTED TEMPLATE
========================================================= */

function applyResumeTemplate(templateName) {

    const wrapper = document.getElementById(
        "resumeTemplateWrapper"
    );

    if (!wrapper) {
        console.error(
            "Resume template wrapper not found."
        );
        return;
    }


    /* -----------------------------------------
       CLEAN ALL OLD TEMPLATE CLASSES
    ----------------------------------------- */

    RESUME_TEMPLATES.forEach(function(template) {

        wrapper.classList.remove(
            "template-" + template
        );

    });


    /* -----------------------------------------
       CHECK TEMPLATE
    ----------------------------------------- */

    if (
        !RESUME_TEMPLATES.includes(templateName)
    ) {

        templateName = "minimal";

    }


    /* -----------------------------------------
       APPLY NEW TEMPLATE
    ----------------------------------------- */

    wrapper.classList.add(
        "template-" + templateName
    );


    /* -----------------------------------------
       SAVE TEMPLATE
    ----------------------------------------- */

    localStorage.setItem(
        "resumeCraftTemplate",
        templateName
    );


    console.log(
        "Resume template changed to:",
        templateName
    );
}


/* =========================================================
   LOAD SAVED TEMPLATE
========================================================= */

function loadResumeTemplate() {

    const wrapper = document.getElementById(
        "resumeTemplateWrapper"
    );

    if (!wrapper) return;


    let savedTemplate =
        localStorage.getItem(
            "resumeCraftTemplate"
        );


    /* -----------------------------------------
       DEFAULT TEMPLATE
    ----------------------------------------- */

    if (
        !savedTemplate ||
        !RESUME_TEMPLATES.includes(savedTemplate)
    ) {

        savedTemplate = "minimal";

    }


    applyResumeTemplate(
        savedTemplate
    );
}


/* =========================================================
   TEMPLATE FROM URL
   Example:
   builder.html?template=classic
========================================================= */

function loadTemplateFromURL() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const urlTemplate =
        params.get("template");


    if (
        urlTemplate &&
        RESUME_TEMPLATES.includes(urlTemplate)
    ) {

        applyResumeTemplate(
            urlTemplate
        );

        return true;

    }


    return false;
}


/* =========================================================
   START TEMPLATE SYSTEM
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        /*
         * First check URL.
         * If URL has ?template=classic,
         * Classic will be shown.
         */

        const templateFromURL =
            loadTemplateFromURL();


        /*
         * If there is no URL template,
         * load the previously selected template.
         */

        if (!templateFromURL) {

            loadResumeTemplate();

        }

    }
);


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
