/* =========================================================
   RESUMECRAFT BLOG
   Fresh JavaScript
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       MOBILE MENU
       ===================================================== */

    const menuButton =
        document.getElementById("mobileMenuButton");

    const mobileNavigation =
        document.getElementById("mobileNavigation");


    if (menuButton && mobileNavigation) {

        menuButton.addEventListener("click", function () {

            mobileNavigation.classList.toggle("active");

            const isOpen =
                mobileNavigation.classList.contains("active");

            menuButton.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );

        });

    }



    /* =====================================================
       CLOSE MOBILE MENU AFTER CLICKING A LINK
       ===================================================== */

    const mobileLinks =
        mobileNavigation
            ? mobileNavigation.querySelectorAll("a")
            : [];


    mobileLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            mobileNavigation.classList.remove("active");

            if (menuButton) {

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        });

    });



    /* =====================================================
       CLOSE MENU WHEN CLICKING OUTSIDE
       ===================================================== */

    document.addEventListener("click", function (event) {

        if (!mobileNavigation || !menuButton) {
            return;
        }


        const clickedInsideMenu =
            mobileNavigation.contains(event.target);

        const clickedButton =
            menuButton.contains(event.target);


        if (
            !clickedInsideMenu &&
            !clickedButton
        ) {

            mobileNavigation.classList.remove("active");

            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    });



    /* =====================================================
       ESCAPE KEY CLOSES MOBILE MENU
       ===================================================== */

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {

            if (mobileNavigation) {

                mobileNavigation.classList.remove(
                    "active"
                );

            }

            if (menuButton) {

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }

    });

});
