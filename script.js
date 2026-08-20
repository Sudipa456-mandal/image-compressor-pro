/* =========================================================
   IMAGE COMPRESSOR PRO
   MAIN HOMEPAGE JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", function () {


    /* =====================================================
       DARK / LIGHT MODE
    ===================================================== */

    const themeToggle =
        document.getElementById("themeToggle");

    const themeIcon =
        document.querySelector(".theme-icon");

    const savedTheme =
        localStorage.getItem("icp-theme");


    function updateThemeIcon() {

        if (!themeIcon) {
            return;
        }

        const isDark =
            document.body.classList.contains("dark");

        themeIcon.textContent =
            isDark ? "☾" : "☼";

    }


    if (savedTheme === "dark") {

        document.body.classList.add("dark");

    }


    updateThemeIcon();


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


                updateThemeIcon();

            }
        );

    }



    /* =====================================================
       MOBILE MENU
    ===================================================== */

    const mobileMenuBtn =
        document.getElementById("mobileMenuBtn");

    const mainNav =
        document.getElementById("mainNav");


    function closeMobileMenu() {

        if (!mainNav || !mobileMenuBtn) {
            return;
        }


        mainNav.classList.remove("show");


        mobileMenuBtn.setAttribute(
            "aria-expanded",
            "false"
        );


        mobileMenuBtn.setAttribute(
            "aria-label",
            "Open menu"
        );

    }


    function openMobileMenu() {

        if (!mainNav || !mobileMenuBtn) {
            return;
        }


        mainNav.classList.add("show");


        mobileMenuBtn.setAttribute(
            "aria-expanded",
            "true"
        );


        mobileMenuBtn.setAttribute(
            "aria-label",
            "Close menu"
        );

    }


    if (mobileMenuBtn && mainNav) {

        mobileMenuBtn.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();


                const isOpen =
                    mainNav.classList.contains("show");


                if (isOpen) {

                    closeMobileMenu();

                } else {

                    openMobileMenu();

                }

            }
        );


        const navLinks =
            mainNav.querySelectorAll("a");


        navLinks.forEach(function (link) {

            link.addEventListener(
                "click",
                function () {

                    closeMobileMenu();

                }
            );

        });

    }



    /* =====================================================
       CLOSE MOBILE MENU WHEN CLICKING OUTSIDE
    ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            if (!mainNav || !mobileMenuBtn) {
                return;
            }


            const clickedInsideNav =
                mainNav.contains(event.target);


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
       CLOSE MOBILE MENU ON RESIZE
    ===================================================== */

    window.addEventListener(
        "resize",
        function () {

            if (window.innerWidth > 760) {

                closeMobileMenu();

            }

        }
    );



    /* =====================================================
       BACK TO TOP
    ===================================================== */

    const topButton =
        document.getElementById("topBtn");


    function updateTopButton() {

        if (!topButton) {
            return;
        }


        if (window.scrollY > 450) {

            topButton.classList.add("visible");

        } else {

            topButton.classList.remove("visible");

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
       ESC KEY
       Close mobile menu
    ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                closeMobileMenu();

            }

        }
    );


});
