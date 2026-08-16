
document.addEventListener(
    "DOMContentLoaded",
    function () {

        const menuBtn =
            document.getElementById("menuBtn");

        const navLinks =
            document.querySelector(".nav-links");


        if (
            menuBtn &&
            navLinks
        ) {

            menuBtn.addEventListener(
                "click",
                function () {

                    navLinks.classList.toggle(
                        "mobile-open"
                    );

                }
            );

        }

    }
);
