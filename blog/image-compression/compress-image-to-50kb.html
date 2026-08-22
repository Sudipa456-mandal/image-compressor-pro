/* =========================================================
   Image Compressor Pro - Blog JavaScript
   File: blog/script.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       MOBILE MENU
    ===================================================== */

    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const navLinks = document.querySelector(".nav-links");

    if (mobileMenuBtn && navLinks) {

        mobileMenuBtn.addEventListener("click", function () {

            navLinks.classList.toggle("mobile-open");

            const isOpen = navLinks.classList.contains("mobile-open");

            mobileMenuBtn.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );

            mobileMenuBtn.setAttribute(
                "aria-label",
                isOpen ? "Close menu" : "Open menu"
            );

        });

        /* Close mobile menu after clicking a link */

        const menuItems = navLinks.querySelectorAll("a");

        menuItems.forEach(function (link) {

            link.addEventListener("click", function () {
                navLinks.classList.remove("mobile-open");

                mobileMenuBtn.setAttribute(
                    "aria-expanded",
                    "false"
                );

                mobileMenuBtn.setAttribute(
                    "aria-label",
                    "Open menu"
                );
            });

        });

    }


    /* =====================================================
       DARK MODE
    ===================================================== */

    const themeToggle = document.getElementById("themeToggle");

    const savedTheme = localStorage.getItem("blogTheme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }

    if (themeToggle) {

        themeToggle.addEventListener("click", function () {

            document.body.classList.toggle("dark-mode");

            const darkMode =
                document.body.classList.contains("dark-mode");

            localStorage.setItem(
                "blogTheme",
                darkMode ? "dark" : "light"
            );

        });

    }


    /* =====================================================
       BACK TO TOP BUTTON
    ===================================================== */

    const topBtn = document.getElementById("topBtn");

    if (topBtn) {

        function updateTopButton() {

            if (window.scrollY > 400) {
                topBtn.classList.add("show");
            } else {
                topBtn.classList.remove("show");
            }

        }

        window.addEventListener(
            "scroll",
            updateTopButton,
            { passive: true }
        );

        updateTopButton();


        topBtn.addEventListener("click", function () {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

    }


    /* =====================================================
       SMOOTH INTERNAL LINKS
    ===================================================== */

    const internalLinks =
        document.querySelectorAll('a[href^="#"]');

    internalLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetId =
                link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target =
                document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });


    /* =====================================================
       FAQ ACCORDION
       
       Works only when FAQ elements exist.
       It does not affect pages without FAQ.
    ===================================================== */

    const faqQuestions =
        document.querySelectorAll(".faq-question");

    faqQuestions.forEach(function (question) {

        question.addEventListener("click", function () {

            const faqItem =
                question.closest(".faq-item");

            if (!faqItem) {
                return;
            }

            faqItem.classList.toggle("active");

        });

    });


    /* =====================================================
       CURRENT YEAR
       
       Automatically updates elements using:
       data-current-year
    ===================================================== */

    const yearElements =
        document.querySelectorAll("[data-current-year]");

    yearElements.forEach(function (element) {

        element.textContent =
            new Date().getFullYear();

    });


    /* =====================================================
       EXTERNAL LINKS
       
       Adds safe attributes to external links.
       ===================================================== */

    const currentHost =
        window.location.hostname;

    const allLinks =
        document.querySelectorAll("a[href]");

    allLinks.forEach(function (link) {

        try {

            const url =
                new URL(link.href, window.location.href);

            if (
                url.hostname &&
                url.hostname !== currentHost &&
                url.protocol === "https:"
            ) {

                link.setAttribute(
                    "target",
                    "_blank"
                );

                link.setAttribute(
                    "rel",
                    "noopener noreferrer"
                );

            }

        } catch (error) {

            /* Ignore invalid or non-standard links */

        }

    });


    /* =====================================================
       PREVENT DOUBLE SUBMISSION
       
       Only applies to forms that explicitly use:
       data-prevent-double-submit
    ===================================================== */

    const protectedForms =
        document.querySelectorAll(
            "form[data-prevent-double-submit]"
        );

    protectedForms.forEach(function (form) {

        form.addEventListener("submit", function () {

            const submitButton =
                form.querySelector(
                    'button[type="submit"], input[type="submit"]'
                );

            if (!submitButton) {
                return;
            }

            submitButton.disabled = true;

            setTimeout(function () {

                submitButton.disabled = false;

            }, 5000);

        });

    });


    /* =====================================================
       IMAGE LAZY LOADING
       
       Applies lazy loading to normal content images.
       Does not modify logos or critical images.
    ===================================================== */

    const contentImages =
        document.querySelectorAll(
            ".blog-content img, .article-content img"
        );

    contentImages.forEach(function (image) {

        if (!image.hasAttribute("loading")) {
            image.setAttribute("loading", "lazy");
        }

        if (!image.hasAttribute("decoding")) {
            image.setAttribute("decoding", "async");
        }

    });


    /* =====================================================
       EXTERNAL IMAGE ERROR HANDLING
       
       Prevents broken images from creating large empty areas.
    ===================================================== */

    contentImages.forEach(function (image) {

        image.addEventListener("error", function () {

            image.classList.add("image-error");

        });

    });


    /* =====================================================
       COPY CURRENT PAGE URL
       
       Optional buttons can use:
       class="copy-page-url"
    ===================================================== */

    const copyButtons =
        document.querySelectorAll(".copy-page-url");

    copyButtons.forEach(function (button) {

        button.addEventListener("click", async function () {

            try {

                await navigator.clipboard.writeText(
                    window.location.href
                );

                const originalText =
                    button.textContent;

                button.textContent =
                    "Copied!";

                setTimeout(function () {

                    button.textContent =
                        originalText;

                }, 1500);

            } catch (error) {

                console.error(
                    "Unable to copy page URL.",
                    error
                );

            }

        });

    });


    /* =====================================================
       CONSOLE MESSAGE
       
       Simple development message.
    ===================================================== */

    console.log(
        "Image Compressor Pro Blog loaded successfully."
    );

});
