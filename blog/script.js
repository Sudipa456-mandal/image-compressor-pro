document.addEventListener("DOMContentLoaded", function () {

    /* ==========================================
       DARK MODE
    ========================================== */

    const themeToggle = document.getElementById("themeToggle");

    if (themeToggle) {

        const savedTheme = localStorage.getItem("theme");

        if (savedTheme === "dark") {
            document.body.classList.add("dark");
        }

        themeToggle.addEventListener("click", function () {

            document.body.classList.toggle("dark");

            if (document.body.classList.contains("dark")) {
                localStorage.setItem("theme", "dark");
            } else {
                localStorage.setItem("theme", "light");
            }

        });

    }


    /* ==========================================
       MOBILE MENU
    ========================================== */

    const mobileMenuBtn =
        document.getElementById("mobileMenuBtn");

    const navLinks =
        document.querySelector(".nav-links");

    if (mobileMenuBtn && navLinks) {

        mobileMenuBtn.addEventListener("click", function () {

            navLinks.classList.toggle("mobile-open");

        });

    }


    /* ==========================================
       CLOSE MOBILE MENU AFTER CLICK
    ========================================== */

    if (navLinks) {

        const links = navLinks.querySelectorAll("a");

        links.forEach(function (link) {

            link.addEventListener("click", function () {

                navLinks.classList.remove("mobile-open");

            });

        });

    }


    /* ==========================================
       BACK TO TOP
    ========================================== */

    const topBtn =
        document.getElementById("topBtn");

    if (topBtn) {

        window.addEventListener("scroll", function () {

            if (window.scrollY > 400) {

                topBtn.classList.add("show");

            } else {

                topBtn.classList.remove("show");

            }

        });


        topBtn.addEventListener("click", function () {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

    }

});
