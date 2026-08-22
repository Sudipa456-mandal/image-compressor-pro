/* =========================================================
   IMAGE COMPRESSOR PRO - BLOG JAVASCRIPT
   File: blog/script.js
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       MOBILE NAVIGATION
    ===================================================== */

    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const navLinks = document.querySelector(".nav-links");

    if (mobileMenuBtn && navLinks) {

        mobileMenuBtn.addEventListener("click", function () {

            navLinks.classList.toggle("mobile-open");

            const isOpen =
                navLinks.classList.contains("mobile-open");

            mobileMenuBtn.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );

            mobileMenuBtn.setAttribute(
                "aria-label",
                isOpen ? "Close menu" : "Open menu"
            );

        });

        /* Close menu after clicking a navigation link */

        const navigationLinks =
            navLinks.querySelectorAll("a");

        navigationLinks.forEach(function (link) {

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

    const themeToggle =
        document.getElementById("themeToggle");

    const savedTheme =
        localStorage.getItem("blogTheme");

    if (savedTheme === "dark") {

        document.body.classList.add("dark-mode");

    }


    if (themeToggle) {

        themeToggle.addEventListener("click", function () {

            document.body.classList.toggle("dark-mode");

            const isDark =
                document.body.classList.contains("dark-mode");

            localStorage.setItem(
                "blogTheme",
                isDark ? "dark" : "light"
            );

        });

    }


    /* =====================================================
       BACK TO TOP BUTTON
    ===================================================== */

    const topBtn =
        document.getElementById("topBtn");

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


        topBtn.addEventListener("click", function () {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });


        updateTopButton();

    }


    /* =====================================================
       SMOOTH INTERNAL LINKS
    ===================================================== */

    const internalLinks =
        document.querySelectorAll('a[href^="#"]');

    internalLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetId =
                this.getAttribute("href");

            if (
                !targetId ||
                targetId === "#"
            ) {
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
       CURRENT YEAR
       Automatically updates footer year if an element
       with id="currentYear" exists.
    ===================================================== */

    const currentYear =
        document.getElementById("currentYear");

    if (currentYear) {

        currentYear.textContent =
            new Date().getFullYear();

    }


    /* =====================================================
       EXTERNAL LINKS
       Open external links safely in a new tab.
    ===================================================== */

    const allLinks =
        document.querySelectorAll("a[href]");

    allLinks.forEach(function (link) {

        const href =
            link.getAttribute("href");

        if (!href) {
            return;
        }

        if (
            href.startsWith("http://") ||
            href.startsWith("https://")
        ) {

            try {

                const linkUrl =
                    new URL(href, window.location.href);

                if (
                    linkUrl.origin !==
                    window.location.origin
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

                /* Ignore invalid URLs */

            }

        }

    });


    /* =====================================================
       FAQ ACCORDION
       
       Works automatically if your HTML uses:

       <button class="faq-question">
       <div class="faq-answer">

       It is optional and will not affect pages that
       do not contain FAQ elements.
    ===================================================== */

    const faqQuestions =
        document.querySelectorAll(".faq-question");

    faqQuestions.forEach(function (question) {

        question.addEventListener("click", function () {

            const item =
                this.closest(".faq-item");

            if (!item) {
                return;
            }

            const answer =
                item.querySelector(".faq-answer");

            if (!answer) {
                return;
            }

            const isOpen =
                item.classList.contains("open");


            /* Close other FAQ items */

            document
                .querySelectorAll(".faq-item.open")
                .forEach(function (openItem) {

                    if (openItem !== item) {

                        openItem.classList.remove("open");

                    }

                });


            /* Toggle selected item */

            item.classList.toggle(
                "open",
                !isOpen
            );

        });

    });


    /* =====================================================
       IMAGE LAZY LOADING
       
       Adds lazy loading to normal article images that
       do not already have a loading attribute.
    ===================================================== */

    const articleImages =
        document.querySelectorAll(
            ".blog-content img, .article-content img"
        );

    articleImages.forEach(function (image) {

        if (!image.hasAttribute("loading")) {

            image.setAttribute(
                "loading",
                "lazy"
            );

        }

        if (!image.hasAttribute("decoding")) {

            image.setAttribute(
                "decoding",
                "async"
            );

        }

    });


    /* =====================================================
       PREVENT EMPTY HASH JUMP
    ===================================================== */

    document
        .querySelectorAll('a[href="#"]')
        .forEach(function (link) {

            link.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                }
            );

        });


    /* =====================================================
       KEYBOARD ACCESSIBILITY
       
       Escape closes the mobile navigation.
    ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key !== "Escape") {
                return;
            }

            if (
                navLinks &&
                navLinks.classList.contains("mobile-open")
            ) {

                navLinks.classList.remove(
                    "mobile-open"
                );

                if (mobileMenuBtn) {

                    mobileMenuBtn.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                    mobileMenuBtn.setAttribute(
                        "aria-label",
                        "Open menu"
                    );

                }

            }

        }
    );

});
