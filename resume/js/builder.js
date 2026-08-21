/* =========================================================
   RESUMECRAFT BUILDER
   Complete Builder JavaScript
   ========================================================= */

let resumeTemplateWrapper = null;

/* =========================================================
   TEMPLATE SYSTEM
   ========================================================= */

const templateNames = [
    "modern",
    "classic",
    "minimal",
    "executive",
    "professional",
    "elegant",
    "creative",
    "corporate",
    "compact",
    "ats"
];

function applyResumeTemplate(templateName) {

    if (!resumeTemplateWrapper) return;

    if (!templateNames.includes(templateName)) {
        templateName = "minimal";
    }

    templateNames.forEach(name => {
        resumeTemplateWrapper.classList.remove(
            `template-${name}`
        );
    });

    resumeTemplateWrapper.classList.add(
        `template-${templateName}`
    );

    localStorage.setItem(
        "selectedResumeTemplate",
        templateName
    );

    /*
     * Optional:
     * Update selected template buttons if they exist.
     */
    document
        .querySelectorAll("[data-template]")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.template === templateName
            );

        });
}


function initializeResumeTemplate() {

    resumeTemplateWrapper =
        document.getElementById(
            "resumeTemplateWrapper"
        );

    if (!resumeTemplateWrapper) return;

    const params =
        new URLSearchParams(
            window.location.search
        );

    const urlTemplate =
        params.get("template");

    const savedTemplate =
        localStorage.getItem(
            "selectedResumeTemplate"
        );

    const selectedTemplate =
        urlTemplate ||
        savedTemplate ||
        "minimal";

    applyResumeTemplate(
        selectedTemplate
    );
}


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeResumeTemplate();


        /* =================================================
           HELPERS
           ================================================= */

        const $ = (
            selector,
            parent = document
        ) => parent.querySelector(selector);


        const $$ = (
            selector,
            parent = document
        ) => [
            ...parent.querySelectorAll(selector)
        ];


        function escapeHTML(value = "") {

            return String(value)
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }


        function formatMonth(value) {

            if (!value) return "";

            const parts =
                value.split("-");

            if (parts.length !== 2) {
                return "";
            }

            const year =
                Number(parts[0]);

            const month =
                Number(parts[1]);

            const date =
                new Date(
                    year,
                    month - 1,
                    1
                );

            return date.toLocaleDateString(
                "en-US",
                {
                    month: "short",
                    year: "numeric"
                }
            );
        }


        function showToast(message) {

            const toast =
                $("#toast");

            if (!toast) return;

            toast.textContent =
                message;

            toast.classList.add("show");

            clearTimeout(
                window.resumeToastTimer
            );

            window.resumeToastTimer =
                setTimeout(
                    () => {

                        toast.classList.remove(
                            "show"
                        );

                    },
                    2500
                );
        }


        function setError(
            input,
            message = ""
        ) {

            if (!input) return;

            const group =
                input.closest(
                    ".form-group"
                );

            if (!group) return;

            const error =
                $(".field-error", group);

            if (message) {

                input.classList.add(
                    "input-error"
                );

                if (error) {
                    error.textContent =
                        message;
                }

            } else {

                input.classList.remove(
                    "input-error"
                );

                if (error) {
                    error.textContent =
                        "";
                }
            }
        }


        function clearErrors(section) {

            if (!section) return;

            $$(".input-error", section)
                .forEach(input => {

                    input.classList.remove(
                        "input-error"
                    );

                });


            $$(".field-error", section)
                .forEach(error => {

                    error.textContent =
                        "";

                });
        }


        /* =================================================
           RESUME DATA
           ================================================= */

        const resumeData = {

            photo: "",

            linkedin: "",

            website: "",

            skills: []

        };


        /* =================================================
           TEMPLATE BUTTONS
           ================================================= */

        $$("[data-template]")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const template =
                            button.dataset.template;

                        applyResumeTemplate(
                            template
                        );

                        showToast(
                            `${template.charAt(0).toUpperCase() + template.slice(1)} template selected.`
                        );

                    }
                );

            });


        /* =================================================
           SECTION NAVIGATION
           ================================================= */

        const sections =
            $$(".builder-section");

        const stepButtons =
            $$(".builder-step");


        const sectionOrder = [
            "heading",
            "experience",
            "education",
            "skills",
            "summary",
            "finalize"
        ];


        function openSection(sectionName) {

            const target =
                sections.find(
                    section =>
                        section.dataset.section ===
                        sectionName
                );

            if (!target) return;


            sections.forEach(section => {

                section.classList.toggle(
                    "active",
                    section === target
                );

            });


            stepButtons.forEach(button => {

                button.classList.toggle(
                    "active",
                    button.dataset.section ===
                    sectionName
                );

            });


            const editor =
                $(".builder-editor");

            if (editor) {

                editor.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        }


        function unlockStep(sectionName) {

            const button =
                $(
                    `.builder-step[data-section="${sectionName}"]`
                );

            if (!button) return;

            button.classList.remove(
                "locked"
            );

            button.classList.add(
                "completed"
            );
        }


        function unlockThrough(sectionName) {

            const index =
                sectionOrder.indexOf(
                    sectionName
                );

            if (index < 0) return;

            for (
                let i = 0;
                i <= index;
                i++
            ) {

                unlockStep(
                    sectionOrder[i]
                );

            }
        }


        /* =================================================
           HEADER ELEMENTS
           ================================================= */

        const firstName =
            $("#firstName");

        const lastName =
            $("#lastName");

        const professionalTitle =
            $("#professionalTitle");

        const city =
            $("#city");

        const country =
            $("#country");

        const pinCode =
            $("#pinCode");

        const phone =
            $("#phone");

        const email =
            $("#email");


        /* =================================================
           HEADER PREVIEW
           ================================================= */

        function updateHeaderPreview() {

            const fullName = [
                firstName?.value,
                lastName?.value
            ]
                .filter(Boolean)
                .join(" ")
                .trim();


            const previewName =
                $("#previewName");

            if (previewName) {

                previewName.textContent =
                    fullName ||
                    "Your Name";

            }


            const previewTitle =
                $("#previewTitle");

            if (previewTitle) {

                previewTitle.textContent =
                    professionalTitle?.value ||
                    "Professional Title";

            }


            const previewEmail =
                $("#previewEmail");

            if (previewEmail) {

                previewEmail.textContent =
                    email?.value ||
                    "email@example.com";

            }


            const previewPhone =
                $("#previewPhone");

            if (previewPhone) {

                previewPhone.textContent =
                    phone?.value ||
                    "Phone";

            }


            const locationParts = [

                city?.value,

                country?.value,

                pinCode?.value

            ]
                .filter(Boolean);


            const previewLocation =
                $("#previewLocation");

            if (previewLocation) {

                previewLocation.textContent =
                    locationParts.length
                        ? locationParts.join(", ")
                        : "Location";

            }


            updateProgress();
        }


        [
            firstName,
            lastName,
            professionalTitle,
            city,
            country,
            pinCode,
            phone,
            email
        ]
            .filter(Boolean)
            .forEach(input => {

                input.addEventListener(
                    "input",
                    updateHeaderPreview
                );

                input.addEventListener(
                    "change",
                    updateHeaderPreview
                );

            });


        /* =================================================
           HEADER VALIDATION
           ================================================= */

        function validateHeader() {

            const section =
                $("#section-heading");

            if (!section) return false;

            clearErrors(section);

            let valid = true;


            const requiredFields = [

                {
                    input: firstName,
                    message:
                        "First name is required."
                },

                {
                    input: lastName,
                    message:
                        "Surname is required."
                },

                {
                    input: professionalTitle,
                    message:
                        "Professional title is required."
                },

                {
                    input: city,
                    message:
                        "City is required."
                },

                {
                    input: country,
                    message:
                        "Country is required."
                },

                {
                    input: pinCode,
                    message:
                        "Pin code is required."
                },

                {
                    input: phone,
                    message:
                        "Phone number is required."
                },

                {
                    input: email,
                    message:
                        "Email is required."
                }

            ];


            requiredFields.forEach(item => {

                if (
                    !item.input ||
                    !item.input.value.trim()
                ) {

                    setError(
                        item.input,
                        item.message
                    );

                    valid = false;
                }

            });


            if (
                email?.value &&
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
                    .test(
                        email.value.trim()
                    )
            ) {

                setError(
                    email,
                    "Enter a valid email address."
                );

                valid = false;
            }


            if (
                pinCode?.value &&
                !/^\d{6}$/.test(
                    pinCode.value.trim()
                )
            ) {

                setError(
                    pinCode,
                    "Pin code must contain 6 digits."
                );

                valid = false;
            }


            if (!valid) {

                showToast(
                    "Please complete the required fields."
                );

            }


            return valid;
        }


        /* =================================================
           PROFILE PHOTO
           ================================================= */

        const photoInput =
            $("#photoInput");


        photoInput?.addEventListener(
            "change",
            event => {

                const file =
                    event.target.files[0];

                if (!file) return;


                if (
                    ![
                        "image/jpeg",
                        "image/png"
                    ].includes(file.type)
                ) {

                    showToast(
                        "Please upload JPG or PNG."
                    );

                    photoInput.value =
                        "";

                    return;
                }


                if (
                    file.size >
                    2 * 1024 * 1024
                ) {

                    showToast(
                        "Photo must be smaller than 2MB."
                    );

                    photoInput.value =
                        "";

                    return;
                }


                const reader =
                    new FileReader();


                reader.onload =
                    event => {

                        resumeData.photo =
                            event.target.result;


                        const previewPhoto =
                            $("#previewPhoto");

                        const resumePhoto =
                            $("#resumePhoto");


                        if (previewPhoto) {

                            previewPhoto.src =
                                resumeData.photo;

                            previewPhoto.style.display =
                                "block";
                        }


                        if (resumePhoto) {

                            resumePhoto.src =
                                resumeData.photo;

                            resumePhoto.style.display =
                                "block";
                        }


                        $("#previewPhotoIcon")
                            ?.style &&
                            ($("#previewPhotoIcon")
                                .style.display =
                                "none");


                        $("#resumePhotoIcon")
                            ?.style &&
                            ($("#resumePhotoIcon")
                                .style.display =
                                "none");


                        showToast(
                            "Profile photo added."
                        );

                    };


                reader.readAsDataURL(file);

            }
        );


        /* =================================================
           OPTIONAL LINKS
           ================================================= */

        const optionalFields =
            $("#optionalFields");


        $$(".optional-info-button")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        if (!optionalFields) {
                            return;
                        }


                        const field =
                            button.dataset.field;


                        if (
                            optionalFields.querySelector(
                                `[data-optional="${field}"]`
                            )
                        ) {

                            showToast(
                                "This field has already been added."
                            );

                            return;
                        }


                        const wrapper =
                            document.createElement(
                                "div"
                            );


                        wrapper.className =
                            "form-group optional-added-field";


                        wrapper.dataset.optional =
                            field;


                        const label =
                            field === "linkedin"
                                ? "LinkedIn URL"
                                : "Website / Portfolio URL";


                        const placeholder =
                            field === "linkedin"
                                ? "https://linkedin.com/in/yourname"
                                : "https://yourwebsite.com";


                        wrapper.innerHTML = `

                            <label>
                                ${label}
                            </label>

                            <div class="optional-input-row">

                                <input
                                    type="url"
                                    class="optional-link-input"
                                    data-field="${field}"
                                    placeholder="${placeholder}"
                                >

                                <button
                                    type="button"
                                    class="remove-optional"
                                    aria-label="Remove field"
                                >
                                    ×
                                </button>

                            </div>

                        `;


                        optionalFields.appendChild(
                            wrapper
                        );


                        const input =
                            $(".optional-link-input", wrapper);


                        input?.addEventListener(
                            "input",
                            () => {

                                resumeData[field] =
                                    input.value.trim();

                                updateOptionalPreview();

                                updateProgress();

                            }
                        );


                        $(".remove-optional", wrapper)
                            ?.addEventListener(
                                "click",
                                () => {

                                    resumeData[field] =
                                        "";

                                    wrapper.remove();

                                    updateOptionalPreview();

                                    updateProgress();

                                }
                            );


                        input?.focus();

                    }
                );

            });


        function normalizeExternalUrl(value) {

            const raw =
                String(value || "").trim();

            if (!raw) return "";

            const candidate =
                /^https?:\/\//i.test(raw)
                    ? raw
                    : `https://${raw}`;

            try {

                const url =
                    new URL(candidate);

                return [
                    "http:",
                    "https:"
                ].includes(
                    url.protocol
                )
                    ? url.href
                    : "";

            } catch {

                return "";

            }
        }


        function updateOptionalPreview() {

            const links =
                $("#previewLinks");

            if (!links) return;


            const items = [];


            const linkedin =
                normalizeExternalUrl(
                    resumeData.linkedin
                );


            const website =
                normalizeExternalUrl(
                    resumeData.website
                );


            if (linkedin) {

                items.push(`
                    <a
                        href="${escapeHTML(linkedin)}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        LinkedIn
                    </a>
                `);

            }


            if (website) {

                items.push(`
                    <a
                        href="${escapeHTML(website)}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Portfolio
                    </a>
                `);

            }


            links.innerHTML =
                items.join("");

        }


        /* =================================================
           EXPERIENCE
           ================================================= */

        const experienceList =
            $("#experienceList");


        function createExperience() {

            if (!experienceList) return;


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "section-card experience-item";


            card.innerHTML = `

                <div class="card-heading-row">

                    <h2>
                        Work Experience
                    </h2>

                    <button
                        type="button"
                        class="remove-entry-btn"
                    >
                        Remove
                    </button>

                </div>

                <div class="form-group">

                    <label>
                        Job Title *
                    </label>

                    <input
                        type="text"
                        class="experience-job-title"
                        placeholder="Software Developer"
                    >

                    <small class="field-error"></small>

                </div>

                <div class="form-row two-column">

                    <div class="form-group">

                        <label>
                            Company *
                        </label>

                        <input
                            type="text"
                            class="experience-company"
                            placeholder="ABC Technologies"
                        >

                        <small class="field-error"></small>

                    </div>

                    <div class="form-group">

                        <label>
                            Location
                        </label>

                        <input
                            type="text"
                            class="experience-location"
                            placeholder="Kolkata"
                        >

                    </div>

                </div>

                <div class="form-row two-column">

                    <div class="form-group">

                        <label>
                            Start Date *
                        </label>

                        <input
                            type="month"
                            class="experience-start"
                        >

                        <small class="field-error"></small>

                    </div>

                    <div class="form-group">

                        <label>
                            End Date
                        </label>

                        <input
                            type="month"
                            class="experience-end"
                        >

                        <small class="field-error"></small>

                    </div>

                </div>

                <div class="form-group checkbox-group">

                    <label>

                        <input
                            type="checkbox"
                            class="currently-working"
                        >

                        Currently working here

                    </label>

                </div>

                <div class="form-group">

                    <label>
                        Description
                    </label>

                    <textarea
                        class="experience-description"
                        rows="5"
                        placeholder="Describe your responsibilities and achievements..."
                    ></textarea>

                </div>

            `;


            experienceList.appendChild(
                card
            );


            setupExperienceCard(card);

            updateExperienceRemoveButtons();

            updateExperiencePreview();

            updateProgress();


            showToast(
                "New experience added."
            );


            card.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }


        function setupExperienceCard(card) {

            const checkbox =
                $(".currently-working", card);

            const endDate =
                $(".experience-end", card);


            checkbox?.addEventListener(
                "change",
                () => {

                    if (checkbox.checked) {

                        endDate.value =
                            "";

                        endDate.disabled =
                            true;

                    } else {

                        endDate.disabled =
                            false;
                    }


                    updateExperiencePreview();

                    updateProgress();

                }
            );


            $$(
                "input, textarea",
                card
            )
                .forEach(input => {

                    input.addEventListener(
                        "input",
                        () => {

                            updateExperiencePreview();

                            updateProgress();

                        }
                    );


                    input.addEventListener(
                        "change",
                        () => {

                            updateExperiencePreview();

                            updateProgress();

                        }
                    );

                });


            $(".remove-entry-btn", card)
                ?.addEventListener(
                    "click",
                    () => {

                        card.remove();

                        updateExperienceRemoveButtons();

                        updateExperiencePreview();

                        updateProgress();

                    }
                );

        }


        function updateExperienceRemoveButtons() {

            const cards =
                $$(".experience-item");


            cards.forEach(card => {

                const button =
                    $(".remove-entry-btn", card);

                if (!button) return;


                button.style.display =
                    cards.length > 1
                        ? "inline-flex"
                        : "none";

            });
        }


        $("#addExperienceButton")
            ?.addEventListener(
                "click",
                createExperience
            );


        $$(".experience-item")
            .forEach(
                setupExperienceCard
            );


        updateExperienceRemoveButtons();


        function validateExperience() {

            const cards =
                $$(".experience-item");


            let valid = true;


            cards.forEach(card => {

                clearErrors(card);


                const jobTitle =
                    $(".experience-job-title", card);

                const company =
                    $(".experience-company", card);

                const start =
                    $(".experience-start", card);

                const end =
                    $(".experience-end", card);

                const working =
                    $(".currently-working", card);


                if (!jobTitle?.value.trim()) {

                    setError(
                        jobTitle,
                        "Job title is required."
                    );

                    valid = false;
                }


                if (!company?.value.trim()) {

                    setError(
                        company,
                        "Company is required."
                    );

                    valid = false;
                }


                if (!start?.value) {

                    setError(
                        start,
                        "Start date is required."
                    );

                    valid = false;
                }


                if (
                    !working?.checked &&
                    end?.value &&
                    start?.value &&
                    end.value < start.value
                ) {

                    setError(
                        end,
                        "End date cannot be before start date."
                    );

                    valid = false;
                }

            });


            if (!valid) {

                showToast(
                    "Please complete your experience details."
                );

            }


            return valid;
        }


        function updateExperiencePreview() {

            const preview =
                $("#previewExperience");

            if (!preview) return;


            const cards =
                $$(".experience-item");


            const validCards =
                cards.filter(card => {

                    return (
                        $(".experience-job-title", card)
                            ?.value.trim() ||

                        $(".experience-company", card)
                            ?.value.trim()
                    );

                });


            if (!validCards.length) {

                preview.innerHTML = `
                    <p>
                        Your professional experience
                        will appear here.
                    </p>
                `;

                return;
            }


            preview.innerHTML =
                validCards
                    .map(card => {

                        const title =
                            $(".experience-job-title", card)
                                ?.value.trim();

                        const company =
                            $(".experience-company", card)
                                ?.value.trim();

                        const location =
                            $(".experience-location", card)
                                ?.value.trim();

                        const start =
                            $(".experience-start", card)
                                ?.value;

                        const end =
                            $(".experience-end", card)
                                ?.value;

                        const working =
                            $(".currently-working", card)
                                ?.checked;

                        const description =
                            $(".experience-description", card)
                                ?.value.trim();


                        let dates = "";


                        if (start) {

                            dates =
                                formatMonth(start);


                            if (working) {

                                dates +=
                                    " – Present";

                            } else if (end) {

                                dates +=
                                    ` – ${formatMonth(end)}`;

                            }

                        }


                        return `

                            <div class="preview-experience-item">

                                <h4>
                                    ${escapeHTML(
                                        title ||
                                        "Job Title"
                                    )}
                                </h4>

                                <strong>
                                    ${escapeHTML(
                                        company ||
                                        "Company"
                                    )}
                                </strong>

                                ${
                                    location
                                        ? `
                                            <span>
                                                ${escapeHTML(location)}
                                            </span>
                                          `
                                        : ""
                                }

                                ${
                                    dates
                                        ? `
                                            <small>
                                                ${escapeHTML(dates)}
                                            </small>
                                          `
                                        : ""
                                }

                                ${
                                    description
                                        ? `
                                            <p>
                                                ${escapeHTML(
                                                    description
                                                ).replace(
                                                    /\n/g,
                                                    "<br>"
                                                )}
                                            </p>
                                          `
                                        : ""
                                }

                            </div>

                        `;

                    })
                    .join("");

        }


        /* =================================================
           EDUCATION
           ================================================= */

        const educationEntries =
            $("#educationEntries");


        function educationHTML(number) {

            return `

                <div class="entry-header">

                    <div>

                        <h2>
                            Education ${number}
                        </h2>

                        <p class="entry-subtitle">
                            Add your school, college or university details.
                        </p>

                    </div>

                    <button
                        type="button"
                        class="remove-entry-btn education-remove"
                    >
                        Remove
                    </button>

                </div>

                <div class="form-group">

                    <label>
                        Education Level *
                    </label>

                    <select class="education-level">

                        <option value="">
                            Select education level
                        </option>

                        <option value="10th">
                            10th / Secondary
                        </option>

                        <option value="12th">
                            12th / Higher Secondary
                        </option>

                        <option value="diploma">
                            Diploma
                        </option>

                        <option value="certificate">
                            Certificate Course
                        </option>

                        <option value="bachelor">
                            Bachelor's Degree
                        </option>

                        <option value="master">
                            Master's Degree
                        </option>

                        <option value="phd">
                            PhD / Doctorate
                        </option>

                        <option value="other">
                            Other
                        </option>

                    </select>

                    <small class="field-error"></small>

                </div>

                <div class="form-group">

                    <label>
                        School / College / University *
                    </label>

                    <input
                        type="text"
                        class="school-name"
                        placeholder="ABC School / XYZ University"
                    >

                    <small class="field-error"></small>

                </div>

                <div class="form-group">

                    <label>
                        Degree / Qualification *
                    </label>

                    <select class="degree">

                        <option value="">
                            Select qualification
                        </option>

                        <option>B.A.</option>
                        <option>B.Sc.</option>
                        <option>B.Com.</option>
                        <option>B.Tech</option>
                        <option>B.E.</option>
                        <option>BBA</option>
                        <option>BCA</option>
                        <option>M.A.</option>
                        <option>M.Sc.</option>
                        <option>M.Com.</option>
                        <option>M.Tech</option>
                        <option>MBA</option>
                        <option>MCA</option>
                        <option>Diploma</option>
                        <option>Secondary School Certificate</option>
                        <option>Higher Secondary Certificate</option>
                        <option>PhD</option>
                        <option>Other</option>

                    </select>

                    <small class="field-error"></small>

                </div>

                <div class="form-group">

                    <label>
                        Field of Study
                    </label>

                    <select class="education-field">

                        <option value="">
                            Select field of study
                        </option>

                        <option>Science</option>
                        <option>Commerce</option>
                        <option>Arts</option>
                        <option>Computer Science</option>
                        <option>Information Technology</option>
                        <option>Engineering</option>
                        <option>Business Administration</option>
                        <option>Accounting</option>
                        <option>Economics</option>
                        <option>Mathematics</option>
                        <option>Physics</option>
                        <option>Chemistry</option>
                        <option>Biology</option>
                        <option>English</option>
                        <option>Other</option>

                    </select>

                </div>

                <div class="form-row two-column">

                    <div class="form-group">

                        <label>
                            Start Date *
                        </label>

                        <input
                            type="month"
                            class="education-start"
                        >

                        <small class="field-error"></small>

                    </div>

                    <div class="form-group">

                        <label>
                            End Date
                        </label>

                        <input
                            type="month"
                            class="education-end"
                        >

                        <small class="field-error"></small>

                    </div>

                </div>

                <div class="form-group checkbox-group">

                    <label>

                        <input
                            type="checkbox"
                            class="currently-studying"
                        >

                        Currently studying here

                    </label>

                </div>

                <div class="form-group">

                    <label>
                        Academic Result
                    </label>

                    <div class="marks-options">

                        <label>

                            <input
                                type="radio"
                                class="marks-type"
                                name="marksType-${number}"
                                value="percentage"
                            >

                            Percentage

                        </label>

                        <label>

                            <input
                                type="radio"
                                class="marks-type"
                                name="marksType-${number}"
                                value="cgpa"
                            >

                            CGPA

                        </label>

                    </div>

                </div>

                <div
                    class="form-group percentage-field"
                    style="display:none;"
                >

                    <label>
                        Percentage
                    </label>

                    <input
                        type="number"
                        class="percentage-input"
                        min="0"
                        max="100"
                        step="0.01"
                        placeholder="85.50"
                    >

                    <small class="field-error"></small>

                </div>

                <div
                    class="form-group cgpa-field"
                    style="display:none;"
                >

                    <label>
                        CGPA
                    </label>

                    <input
                        type="number"
                        class="cgpa-input"
                        min="0"
                        max="10"
                        step="0.01"
                        placeholder="8.50"
                    >

                    <small class="field-error"></small>

                </div>

                <div class="form-group">

                    <label>
                        Description
                    </label>

                    <textarea
                        class="education-description"
                        rows="4"
                        placeholder="Achievements, coursework, activities, awards..."
                    ></textarea>

                </div>

            `;
        }


        function createEducation() {

            if (!educationEntries) return;


            const number =
                $$(".education-card").length + 1;


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "section-card education-card";


            card.innerHTML =
                educationHTML(number);


            educationEntries.appendChild(
                card
            );


            setupEducationCard(card);

            updateEducationNumbers();

            updateEducationRemoveButtons();

            updateEducationPreview();

            updateProgress();


            showToast(
                "New education added."
            );


            card.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }


        function setupEducationCard(card) {

            const checkbox =
                $(".currently-studying", card);

            const endDate =
                $(".education-end", card);


            checkbox?.addEventListener(
                "change",
                () => {

                    if (checkbox.checked) {

                        endDate.value =
                            "";

                        endDate.disabled =
                            true;

                    } else {

                        endDate.disabled =
                            false;

                    }


                    updateEducationPreview();

                    updateProgress();

                }
            );


            $$(".marks-type", card)
                .forEach(radio => {

                    radio.addEventListener(
                        "change",
                        () => {

                            const percentage =
                                $(".percentage-field", card);

                            const cgpa =
                                $(".cgpa-field", card);


                            if (percentage) {

                                percentage.style.display =
                                    radio.value ===
                                    "percentage"
                                        ? "block"
                                        : "none";

                            }


                            if (cgpa) {

                                cgpa.style.display =
                                    radio.value ===
                                    "cgpa"
                                        ? "block"
                                        : "none";

                            }


                            updateEducationPreview();

                            updateProgress();

                        }
                    );

                });


            $$(
                "input, select, textarea",
                card
            )
                .forEach(input => {

                    input.addEventListener(
                        "input",
                        () => {

                            updateEducationPreview();

                            updateProgress();

                        }
                    );


                    input.addEventListener(
                        "change",
                        () => {

                            updateEducationPreview();

                            updateProgress();

                        }
                    );

                });


            $(".education-remove", card)
                ?.addEventListener(
                    "click",
                    () => {

                        card.remove();

                        updateEducationNumbers();

                        updateEducationRemoveButtons();

                        updateEducationPreview();

                        updateProgress();

                    }
                );

        }


        function updateEducationNumbers() {

            $$(".education-card")
                .forEach(
                    (card, index) => {

                        const heading =
                            $("h2", card);

                        if (heading) {

                            heading.textContent =
                                `Education ${index + 1}`;

                        }

                    }
                );
        }


        function updateEducationRemoveButtons() {

            const cards =
                $$(".education-card");


            cards.forEach(card => {

                const button =
                    $(".education-remove", card);

                if (!button) return;


                button.style.display =
                    cards.length > 1
                        ? "inline-flex"
                        : "none";

            });
        }


        $("#addEducationButton")
            ?.addEventListener(
                "click",
                createEducation
            );


        $$(".education-card")
            .forEach(
                setupEducationCard
            );


        updateEducationNumbers();

        updateEducationRemoveButtons();


        function validateEducation() {

            const cards =
                $$(".education-card");


            let valid = true;


            cards.forEach(card => {

                clearErrors(card);


                const level =
                    $(".education-level", card);

                const school =
                    $(".school-name", card);

                const degree =
                    $(".degree", card);

                const start =
                    $(".education-start", card);

                const end =
                    $(".education-end", card);

                const studying =
                    $(".currently-studying", card);


                if (!level?.value) {

                    setError(
                        level,
                        "Select education level."
                    );

                    valid = false;
                }


                if (!school?.value.trim()) {

                    setError(
                        school,
                        "School/college name is required."
                    );

                    valid = false;
                }


                if (!degree?.value) {

                    setError(
                        degree,
                        "Select qualification."
                    );

                    valid = false;
                }


                if (!start?.value) {

                    setError(
                        start,
                        "Start date is required."
                    );

                    valid = false;
                }


                if (
                    !studying?.checked &&
                    end?.value &&
                    start?.value &&
                    end.value < start.value
                ) {

                    setError(
                        end,
                        "End date cannot be before start date."
                    );

                    valid = false;
                }

            });


            if (!valid) {

                showToast(
                    "Please complete your education details."
                );

            }


            return valid;
        }


        function updateEducationPreview() {

            const preview =
                $("#previewEducation");

            if (!preview) return;


            const cards =
                $$(".education-card");


            const validCards =
                cards.filter(card => {

                    return (
                        $(".school-name", card)
                            ?.value.trim() ||

                        $(".degree", card)
                            ?.value
                    );

                });


            if (!validCards.length) {

                preview.innerHTML = `
                    <p>
                        Your education details
                        will appear here.
                    </p>
                `;

                return;
            }


            preview.innerHTML =
                validCards
                    .map(card => {

                        const level =
                            $(".education-level", card)
                                ?.value;

                        const school =
                            $(".school-name", card)
                                ?.value.trim();

                        const degree =
                            $(".degree", card)
                                ?.value;

                        const field =
                            $(".education-field", card)
                                ?.value;

                        const start =
                            $(".education-start", card)
                                ?.value;

                        const end =
                            $(".education-end", card)
                                ?.value;

                        const studying =
                            $(".currently-studying", card)
                                ?.checked;

                        const description =
                            $(".education-description", card)
                                ?.value.trim();


                        const percentageRadio =
                            $(
                                '.marks-type[value="percentage"]',
                                card
                            );


                        const cgpaRadio =
                            $(
                                '.marks-type[value="cgpa"]',
                                card
                            );


                        let result = "";


                        if (
                            percentageRadio?.checked
                        ) {

                            const value =
                                $(".percentage-input", card)
                                    ?.value;

                            if (value) {

                                result =
                                    `${value}%`;

                            }

                        }


                        if (
                            cgpaRadio?.checked
                        ) {

                            const value =
                                $(".cgpa-input", card)
                                    ?.value;

                            if (value) {

                                result =
                                    `CGPA ${value}`;

                            }

                        }


                        let dates = "";


                        if (start) {

                            dates =
                                formatMonth(start);


                            if (studying) {

                                dates +=
                                    " – Present";

                            } else if (end) {

                                dates +=
                                    ` – ${formatMonth(end)}`;

                            }

                        }


                        return `

                            <div class="preview-education-item">

                                <h4>
                                    ${escapeHTML(
                                        degree ||
                                        level ||
                                        "Education"
                                    )}
                                </h4>

                                <strong>
                                    ${escapeHTML(
                                        school || ""
                                    )}
                                </strong>

                                ${
                                    field
                                        ? `
                                            <span>
                                                ${escapeHTML(field)}
                                            </span>
                                          `
                                        : ""
                                }

                                ${
                                    dates
                                        ? `
                                            <small>
                                                ${escapeHTML(dates)}
                                            </small>
                                          `
                                        : ""
                                }

                                ${
                                    result
                                        ? `
                                            <small>
                                                ${escapeHTML(result)}
                                            </small>
                                          `
                                        : ""
                                }

                                ${
                                    description
                                        ? `
                                            <p>
                                                ${escapeHTML(
                                                    description
                                                ).replace(
                                                    /\n/g,
                                                    "<br>"
                                                )}
                                            </p>
                                          `
                                        : ""
                                }

                            </div>

                        `;

                    })
                    .join("");

        }


        /* =================================================
           SKILLS
           ================================================= */

        const skillInput =
            $("#skillInput");

        const addSkillButton =
            $("#addSkillButton");

        const skillsList =
            $("#skillsList");


        function renderSkills() {

            if (!skillsList) return;


            skillsList.innerHTML =
                "";


            resumeData.skills.forEach(
                (skill, index) => {

                    const tag =
                        document.createElement(
                            "div"
                        );


                    tag.className =
                        "skill-tag";


                    tag.innerHTML = `

                        <span>
                            ${escapeHTML(skill)}
                        </span>

                        <button
                            type="button"
                            aria-label="Remove skill"
                        >
                            ×
                        </button>

                    `;


                    $("button", tag)
                        ?.addEventListener(
                            "click",
                            () => {

                                resumeData.skills
                                    .splice(
                                        index,
                                        1
                                    );

                                renderSkills();

                                updateSkillsPreview();

                                updateProgress();

                            }
                        );


                    skillsList.appendChild(
                        tag
                    );

                }
            );


            updateSkillsPreview();
        }


        function addSkill() {

            if (!skillInput) return;


            const skill =
                skillInput.value.trim();


            if (!skill) {

                showToast(
                    "Please enter a skill."
                );

                skillInput.focus();

                return;
            }


            const exists =
                resumeData.skills.some(
                    item =>
                        item.toLowerCase() ===
                        skill.toLowerCase()
                );


            if (exists) {

                showToast(
                    "This skill is already added."
                );

                return;
            }


            resumeData.skills.push(
                skill
            );


            skillInput.value =
                "";


            renderSkills();

            updateProgress();

            skillInput.focus();
        }


        addSkillButton
            ?.addEventListener(
                "click",
                addSkill
            );


        skillInput
            ?.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key ===
                        "Enter"
                    ) {

                        event.preventDefault();

                        addSkill();

                    }

                }
            );


        function updateSkillsPreview() {

            const preview =
                $("#previewSkills");

            if (!preview) return;


            if (!resumeData.skills.length) {

                preview.innerHTML =
                    "<span>Add your skills</span>";

                return;
            }


            preview.innerHTML =
                resumeData.skills
                    .map(
                        skill =>
                            `<span>${escapeHTML(skill)}</span>`
                    )
                    .join("");

        }


        /* =================================================
           SUMMARY
           ================================================= */

        const summary =
            $("#professionalSummary");

        const summaryCount =
            $("#summaryCount");

        const previewSummary =
            $("#previewSummary");


        if (summary) {

            summary.maxLength =
                500;


            summary.addEventListener(
                "input",
                () => {

                    if (summaryCount) {

                        summaryCount.textContent =
                            summary.value.length;

                    }


                    if (previewSummary) {

                        previewSummary.textContent =
                            summary.value.trim() ||
                            "Your professional summary will appear here.";

                    }


                    updateProgress();

                }
            );

        }


        function validateSkills() {

            if (
                !resumeData.skills.length
            ) {

                showToast(
                    "Please add at least one skill."
                );

                skillInput?.focus();

                return false;
            }

            return true;
        }


        function validateSummary() {

            if (
                !summary ||
                !summary.value.trim()
            ) {

                showToast(
                    "Please write your professional summary."
                );

                summary?.focus();

                return false;
            }

            return true;
        }


        /* =================================================
           SECTION VALIDATION
           ================================================= */

        function validateSection(
            sectionName
        ) {

            switch (sectionName) {

                case "heading":
                    return validateHeader();

                case "experience":
                    return validateExperience();

                case "education":
                    return validateEducation();

                case "skills":
                    return validateSkills();

                case "summary":
                    return validateSummary();

                default:
                    return true;

            }

        }


        /* =================================================
           CONTINUE BUTTONS
           ================================================= */

        $$(".continue-section-btn")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const section =
                            button.closest(
                                ".builder-section"
                            );

                        if (!section) return;


                        const current =
                            section.dataset.section;

                        const next =
                            button.dataset.next;


                        if (!next) return;


                        if (
                            !validateSection(
                                current
                            )
                        ) {

                            return;
                        }


                        unlockThrough(next);

                        openSection(next);

                        updateProgress();


                        if (
                            next === "finalize"
                        ) {

                            showToast(
                                "Your resume is ready."
                            );

                        }

                    }
                );

            });


        /* =================================================
           BACK BUTTONS
           ================================================= */

        $$(".back-section-btn")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const target =
                            button.dataset.back;

                        if (!target) return;

                        openSection(target);

                    }
                );

            });


        /* =================================================
           SIDEBAR STEP BUTTONS
           ================================================= */

        stepButtons.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const section =
                        button.dataset.section;


                    if (
                        button.classList.contains(
                            "locked"
                        )
                    ) {

                        showToast(
                            "Complete the previous section first."
                        );

                        return;

                    }


                    openSection(section);

                }
            );

        });


        /* =================================================
           BACK TO TEMPLATES
           ================================================= */

        $("#backToTemplates")
            ?.addEventListener(
                "click",
                () => {

                    window.location.href =
                        "templates.html";

                }
            );


        /* =================================================
           PROGRESS
           ================================================= */

        function updateProgress() {

            let total = 0;

            let completed = 0;


            /* HEADER */

            const headerFields = [

                firstName,
                lastName,
                professionalTitle,
                city,
                country,
                pinCode,
                phone,
                email

            ].filter(Boolean);


            total +=
                headerFields.length;


            completed +=
                headerFields.filter(
                    input =>
                        input.value.trim()
                ).length;


            /* EXPERIENCE */

            const experiences =
                $$(".experience-item");


            if (experiences.length) {

                total +=
                    experiences.length;


                completed +=
                    experiences.filter(card => {

                        return (

                            $(".experience-job-title", card)
                                ?.value.trim() &&

                            $(".experience-company", card)
                                ?.value.trim() &&

                            $(".experience-start", card)
                                ?.value

                        );

                    }).length;

            }


            /* EDUCATION */

            const educations =
                $$(".education-card");


            if (educations.length) {

                total +=
                    educations.length;


                completed +=
                    educations.filter(card => {

                        return (

                            $(".education-level", card)
                                ?.value &&

                            $(".school-name", card)
                                ?.value.trim() &&

                            $(".degree", card)
                                ?.value &&

                            $(".education-start", card)
                                ?.value

                        );

                    }).length;

            }


            /* SKILLS */

            total += 1;

            if (
                resumeData.skills.length
            ) {

                completed++;

            }


            /* SUMMARY */

            total += 1;

            if (
                summary?.value.trim()
            ) {

                completed++;

            }


            const percentage =
                total
                    ? Math.round(
                        (
                            completed /
                            total
                        ) * 100
                    )
                    : 0;


            const percentElement =
                $("#completionPercent");

            const progressBar =
                $("#progressBar");


            if (percentElement) {

                percentElement.textContent =
                    `${percentage}%`;

            }


            if (progressBar) {

                progressBar.style.width =
                    `${percentage}%`;

            }

        }


        /* =================================================
           PDF / PRINT EXPORT
           ================================================= */

        $("#downloadResumeButton")
            ?.addEventListener(
                "click",
                () => {

                    const resume =
                        $("#resumePage");

                    const templateWrapper =
                        $("#resumeTemplateWrapper");


                    if (
                        !resume ||
                        !templateWrapper
                    ) {

                        console.error(
                            "Resume export elements not found."
                        );

                        showToast(
                            "Resume preview not found."
                        );

                        return;
                    }


                    /* Update live preview */

                    updateHeaderPreview();

                    updateExperiencePreview();

                    updateEducationPreview();

                    updateSkillsPreview();

                    updateOptionalPreview();


                    const printWindow =
                        window.open(
                            "",
                            "_blank",
                            "width=900,height=1200"
                        );


                    if (!printWindow) {

                        showToast(
                            "Please allow pop-ups to print your resume."
                        );

                        return;
                    }


                    /*
                     * Clone the complete template wrapper.
                     * This keeps template classes.
                     */

                    const exportWrapper =
                        templateWrapper.cloneNode(
                            true
                        );


                    exportWrapper.removeAttribute(
                        "id"
                    );


                    const exportResume =
                        exportWrapper.querySelector(
                            "#resumePage"
                        );


                    if (exportResume) {

                        exportResume.removeAttribute(
                            "id"
                        );

                    }


                    const baseURL =
                        window.location.href.substring(
                            0,
                            window.location.href.lastIndexOf("/") + 1
                        );


                    const resumeHTML =
                        exportWrapper.outerHTML;


                    printWindow.document.open();


                    printWindow.document.write(`

<!DOCTYPE html>

<html>

<head>

    <meta charset="UTF-8">

    <base href="${baseURL}">

    <link
        rel="stylesheet"
        href="css/builder.css"
    >

    <link
        rel="stylesheet"
        href="css/resume-templates.css"
    >

    <style>

        @page {
            size: A4 portrait;
            margin: 0;
        }

        html,
        body {

            width: 210mm;

            margin: 0;

            padding: 0;

            background: #ffffff;

        }

        body {

            overflow: visible !important;

        }

        .resume-template-wrapper {

            width: 210mm !important;

            min-width: 210mm !important;

            max-width: 210mm !important;

            margin: 0 !important;

            padding: 0 !important;

            position: relative !important;

            overflow: visible !important;

            box-sizing: border-box !important;

        }

        .resume-template-wrapper .resume-page {

            width: 210mm !important;

            min-width: 210mm !important;

            max-width: 210mm !important;

            min-height: 297mm !important;

            height: auto !important;

            margin: 0 !important;

            box-sizing: border-box !important;

            position: relative !important;

            left: auto !important;

            top: auto !important;

            transform: none !important;

            box-shadow: none !important;

            overflow: visible !important;

            break-inside: auto !important;

            page-break-inside: auto !important;

        }

        .resume-section,
        .resume-header,
        .preview-experience-item,
        .preview-education-item {

            -webkit-print-color-adjust: exact !important;

            print-color-adjust: exact !important;

        }

        * {

            -webkit-print-color-adjust: exact !important;

            print-color-adjust: exact !important;

        }

    </style>

</head>

<body>

    ${resumeHTML}

</body>

</html>

                    `);


                    printWindow.document.close();


                    const startPrint =
                        () => {

                            setTimeout(
                                () => {

                                    printWindow.focus();

                                    printWindow.print();

                                },
                                500
                            );

                        };


                    if (
                        printWindow.document.readyState ===
                        "complete"
                    ) {

                        startPrint();

                    } else {

                        printWindow.addEventListener(
                            "load",
                            startPrint,
                            {
                                once: true
                            }
                        );

                    }


                    printWindow.addEventListener(
                        "afterprint",
                        () => {

                            setTimeout(
                                () => {

                                    printWindow.close();

                                },
                                300
                            );

                        },
                        {
                            once: true
                        }
                    );

                }
            );


        /* =================================================
           INITIALIZE
           ================================================= */

        updateHeaderPreview();

        updateExperiencePreview();

        updateEducationPreview();

        updateSkillsPreview();

        updateOptionalPreview();

        updateProgress();

    }
);
