
document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* =====================================================
           USE TEMPLATE BUTTONS
        ===================================================== */

        const templateButtons =
            document.querySelectorAll(
                ".use-template-btn"
            );


        templateButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();
                        event.stopPropagation();


                        const template =
                            this.getAttribute("data-template");


                        if (!template) {
                            console.error(
                                "No data-template found on this button."
                            );
                            return;
                        }


                        window.location.href =
                            "builder.html?template=" +
                            encodeURIComponent(template);

                    }
                );

            }
        );



        /* =====================================================
           TEMPLATE CARDS
        ===================================================== */

        const templateCards =
            document.querySelectorAll(
                ".template-card"
            );


        templateCards.forEach(
            function (card) {

                card.addEventListener(
                    "click",
                    function (event) {


                        if (
                            event.target.closest(
                                ".use-template-btn"
                            )
                        ) {

                            return;

                        }


                        const template =
                            this.getAttribute(
                                "data-template"
                            );


                        if (!template) {
                            console.error(
                                "No data-template found on this template card."
                            );
                            return;
                        }


                        window.location.href =
                            "builder.html?template=" +
                            encodeURIComponent(template);

                    }
                );

            }
        );



        /* =====================================================
           FILTERS
        ===================================================== */

        const filterButtons =
            document.querySelectorAll(
                ".filter-btn"
            );


        filterButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {


                        filterButtons.forEach(
                            function (btn) {

                                btn.classList.remove(
                                    "active"
                                );

                            }
                        );


                        this.classList.add(
                            "active"
                        );


                        const filter =
                            this.getAttribute(
                                "data-filter"
                            );


                        templateCards.forEach(
                            function (card) {

                                const category =
                                    card.getAttribute(
                                        "data-category"
                                    );


                                if (
                                    filter === "all" ||
                                    category === filter
                                ) {

                                    card.classList.remove(
                                        "hidden"
                                    );

                                } else {

                                    card.classList.add(
                                        "hidden"
                                    );

                                }

                            }
                        );

                    }
                );

            }
        );

    }
);
