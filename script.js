/* =========================================================
   IMAGE COMPRESSOR PRO
   MAIN HOME PAGE JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", function () {


    /* =====================================================
       DARK / LIGHT MODE
    ===================================================== */

    const themeToggle =
        document.getElementById("themeToggle");


    const savedTheme =
        localStorage.getItem("icp-theme");


    if (savedTheme === "dark") {

        document.body.classList.add("dark");

    }


    if (themeToggle) {

        themeToggle.addEventListener("click", function () {

            document.body.classList.toggle("dark");


            const darkMode =
                document.body.classList.contains("dark");


            localStorage.setItem(
                "icp-theme",
                darkMode ? "dark" : "light"
            );

        });

    }



    /* =====================================================
       MOBILE MENU
    ===================================================== */

    const mobileMenuBtn =
        document.getElementById("mobileMenuBtn");


    const navLinks =
        document.getElementById("navLinks");


    function closeMobileMenu() {

        if (!navLinks || !mobileMenuBtn) {
            return;
        }


        navLinks.classList.remove("show");


        mobileMenuBtn.setAttribute(
            "aria-expanded",
            "false"
        );


        mobileMenuBtn.textContent = "☰";

    }


    if (mobileMenuBtn && navLinks) {

        mobileMenuBtn.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();


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

                        closeMobileMenu();

                    }
                );

            });

    }



    /* =====================================================
       CLOSE MENU WHEN CLICKING OUTSIDE
    ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            if (!navLinks || !mobileMenuBtn) {
                return;
            }


            const clickedInsideNav =
                navLinks.contains(event.target);


            const clickedMenuButton =
                mobileMenuBtn.contains(event.target);


            if (
                !clickedInsideNav &&
                !clickedMenuButton
            ) {

                closeMobileMenu();

            }

        }
    );



    /* =====================================================
       CLOSE MENU WHEN WINDOW GETS LARGER
    ===================================================== */

    window.addEventListener(
        "resize",
        function () {

            if (window.innerWidth > 780) {

                closeMobileMenu();

            }

        }
    );



    /* =====================================================
       BACK TO TOP
    ===================================================== */

    const topBtn =
        document.getElementById("topBtn");


    function updateTopButton() {

        if (!topBtn) {
            return;
        }


        if (window.scrollY > 400) {

            topBtn.classList.add("visible");

        } else {

            topBtn.classList.remove("visible");

        }

    }


    window.addEventListener(
        "scroll",
        updateTopButton,
        { passive: true }
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
       SCROLL ANIMATION
    ===================================================== */

    const animatedElements =
        document.querySelectorAll(
            ".tool-card, .step, .benefit-card, .faq-item, .information-box"
        );


    if ("IntersectionObserver" in window) {

        const observer =
            new IntersectionObserver(
                function (entries) {

                    entries.forEach(function (entry) {

                        if (entry.isIntersecting) {

                            entry.target.classList.add(
                                "is-visible"
                            );


                            observer.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.12
                }
            );


        animatedElements.forEach(function (element) {

            observer.observe(element);

        });

    } else {

        animatedElements.forEach(function (element) {

            element.classList.add("is-visible");

        });

    }



    /* =====================================================
       FAQ
       Only one FAQ opens at a time
    ===================================================== */

    const faqItems =
        document.querySelectorAll(".faq-item");


    faqItems.forEach(function (item) {

        item.addEventListener(
            "toggle",
            function () {

                if (!item.open) {
                    return;
                }


                faqItems.forEach(function (otherItem) {

                    if (otherItem !== item) {

                        otherItem.removeAttribute(
                            "open"
                        );

                    }

                });

            }
        );

    });



});
