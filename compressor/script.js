/* =========================================================
   IMAGE COMPRESSOR PRO
   HOMEPAGE JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       MOBILE NAVIGATION
    ===================================================== */

    const menuButton =
        document.getElementById("menuButton");

    const mainNavigation =
        document.getElementById("mainNavigation");


    if (menuButton && mainNavigation) {

        menuButton.addEventListener("click", () => {

            const isOpen =
                mainNavigation.classList.toggle("show");

            menuButton.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );

            menuButton.setAttribute(
                "aria-label",
                isOpen
                    ? "Close navigation"
                    : "Open navigation"
            );

        });


        /* Close menu after clicking a link */

        const navigationLinks =
            mainNavigation.querySelectorAll("a");


        navigationLinks.forEach(link => {

            link.addEventListener("click", () => {

                mainNavigation.classList.remove("show");

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuButton.setAttribute(
                    "aria-label",
                    "Open navigation"
                );

            });

        });


        /* Close mobile menu when resizing */

        window.addEventListener("resize", () => {

            if (window.innerWidth > 800) {

                mainNavigation.classList.remove("show");

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuButton.setAttribute(
                    "aria-label",
                    "Open navigation"
                );

            }

        });

    }


    /* =====================================================
       BACK TO TOP
    ===================================================== */

    const backToTop =
        document.getElementById("backToTop");


    if (backToTop) {

        const updateBackToTop =
            () => {

                if (window.scrollY > 500) {

                    backToTop.style.display =
                        "flex";

                } else {

                    backToTop.style.display =
                        "none";

                }

            };


        window.addEventListener(
            "scroll",
            updateBackToTop,
            { passive: true }
        );


        backToTop.addEventListener(
            "click",
            () => {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );


        updateBackToTop();

    }


    /* =====================================================
       CLOSE MOBILE MENU WITH ESCAPE
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                mainNavigation &&
                mainNavigation.classList.contains("show")
            ) {

                mainNavigation.classList.remove("show");

                if (menuButton) {

                    menuButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                    menuButton.setAttribute(
                        "aria-label",
                        "Open navigation"
                    );

                    menuButton.focus();

                }

            }

        }
    );


    /* =====================================================
       SMOOTH INTERNAL LINKS
    ===================================================== */

    const internalLinks =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    internalLinks.forEach(link => {

        link.addEventListener(
            "click",
            event => {

                const targetId =
                    link.getAttribute("href");


                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }


                const target =
                    document.querySelector(
                        targetId
                    );


                if (!target) {
                    return;
                }


                event.preventDefault();


                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }
        );

    });

});
