document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const templateButtons = document.querySelectorAll(".use-template-btn");
    const templateCards = document.querySelectorAll(".template-card");
    const filterButtons = document.querySelectorAll(".filter-btn");

    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const navLinks = document.querySelector(".nav-links");


    /* =====================================================
       MOBILE NAVIGATION
    ===================================================== */

    if (mobileMenuBtn && navLinks) {

        mobileMenuBtn.addEventListener("click", function () {

            const isOpen = navLinks.classList.toggle("show");

            mobileMenuBtn.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );

            mobileMenuBtn.setAttribute(
                "aria-label",
                isOpen ? "Close navigation" : "Open navigation"
            );

            mobileMenuBtn.textContent = isOpen ? "✕" : "☰";

        });


        navLinks.querySelectorAll("a").forEach(function (link) {

            link.addEventListener("click", function () {

                navLinks.classList.remove("show");

                mobileMenuBtn.setAttribute(
                    "aria-expanded",
                    "false"
                );

                mobileMenuBtn.setAttribute(
                    "aria-label",
                    "Open navigation"
                );

                mobileMenuBtn.textContent = "☰";

            });

        });

    }


    /* =====================================================
       USE TEMPLATE
    ===================================================== */

    function openTemplate(template) {

        if (!template) {
            console.error("Template name is missing.");
            return;
        }

        const allowedTemplates = [
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

        if (!allowedTemplates.includes(template)) {
            console.error("Invalid template:", template);
            return;
        }

        window.location.href =
            "builder.html?template=" +
            encodeURIComponent(template);

    }


    /* =====================================================
       TEMPLATE BUTTONS
    ===================================================== */

    templateButtons.forEach(function (button) {

        button.addEventListener("click", function (event) {

            event.preventDefault();
            event.stopPropagation();

            const template =
                this.dataset.template;

            openTemplate(template);

        });

    });


    /* =====================================================
       TEMPLATE CARD CLICK
    ===================================================== */

    templateCards.forEach(function (card) {

        card.addEventListener("click", function (event) {

            if (
                event.target.closest(".use-template-btn")
            ) {
                return;
            }

            const template =
                this.dataset.template;

            openTemplate(template);

        });


        /* Keyboard accessibility */

        card.setAttribute("tabindex", "0");
        card.setAttribute("role", "button");

        card.addEventListener("keydown", function (event) {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                const template =
                    this.dataset.template;

                openTemplate(template);

            }

        });

    });


    /* =====================================================
       TEMPLATE FILTER
    ===================================================== */

    filterButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const filter =
                this.dataset.filter;

            filterButtons.forEach(function (btn) {

                btn.classList.remove("active");

                btn.setAttribute(
                    "aria-pressed",
                    "false"
                );

            });


            this.classList.add("active");

            this.setAttribute(
                "aria-pressed",
                "true"
            );


            templateCards.forEach(function (card) {

                const category =
                    card.dataset.category;

                const shouldShow =
                    filter === "all" ||
                    category === filter;

                card.classList.toggle(
                    "hidden",
                    !shouldShow
                );

            });

        });

    });


    /* =====================================================
       INITIAL ACCESSIBILITY STATE
    ===================================================== */

    filterButtons.forEach(function (button) {

        button.setAttribute(
            "aria-pressed",
            button.classList.contains("active")
                ? "true"
                : "false"
        );

    });

});
