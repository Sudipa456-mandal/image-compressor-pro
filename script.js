/* =========================================================
   IMAGE COMPRESSOR PRO
   HOME PAGE JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       DARK MODE
    ===================================================== */

    const themeToggle =
        document.getElementById("themeToggle");


    const savedTheme =
        localStorage.getItem("theme");


    if (savedTheme === "dark") {

        document.body.classList.add("dark");

    }


    if (themeToggle) {

        themeToggle.addEventListener(
            "click",
            () => {

                document.body.classList.toggle(
                    "dark"
                );


                if (
                    document.body.classList.contains(
                        "dark"
                    )
                ) {

                    localStorage.setItem(
                        "theme",
                        "dark"
                    );

                } else {

                    localStorage.setItem(
                        "theme",
                        "light"
                    );

                }

            }
        );

    }



    /* =====================================================
       MOBILE MENU
    ===================================================== */

    const mobileMenuBtn =
        document.getElementById(
            "mobileMenuBtn"
        );


    const navLinks =
        document.querySelector(
            ".nav-links"
        );


    if (
        mobileMenuBtn &&
        navLinks
    ) {

        mobileMenuBtn.addEventListener(
            "click",
            () => {

                navLinks.classList.toggle(
                    "show"
                );

            }
        );


        navLinks
            .querySelectorAll("a")
            .forEach(link => {

                link.addEventListener(
                    "click",
                    () => {

                        navLinks.classList.remove(
                            "show"
                        );

                    }
                );

            });

    }



    /* =====================================================
       BACK TO TOP
    ===================================================== */

    const topBtn =
        document.getElementById(
            "topBtn"
        );


    window.addEventListener(
        "scroll",
        () => {

            if (!topBtn) return;


            if (window.scrollY > 350) {

                topBtn.style.display =
                    "flex";

                topBtn.style.alignItems =
                    "center";

                topBtn.style.justifyContent =
                    "center";

            } else {

                topBtn.style.display =
                    "none";

            }

        }
    );


    if (topBtn) {

        topBtn.addEventListener(
            "click",
            () => {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );

    }



    /* =====================================================
       TOOL CARD ANIMATION
    ===================================================== */

    const toolCards =
        document.querySelectorAll(
            ".tool-card"
        );


    if ("IntersectionObserver" in window) {

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "visible"
                                );

                            }

                        }
                    );

                },
                {
                    threshold: 0.15
                }
            );


        toolCards.forEach(
            card => observer.observe(card)
        );

    }



    /* =====================================================
       SMOOTH INTERNAL LINKS
    ===================================================== */

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(link => {

            link.addEventListener(
                "click",
                event => {

                    const targetId =
                        link.getAttribute(
                            "href"
                        );


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


                    if (!target) return;


                    event.preventDefault();


                    target.scrollIntoView({
                        behavior: "smooth"
                    });

                }
            );

        });

});
