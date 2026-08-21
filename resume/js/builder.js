/* =========================================================
   ResumeCraft Builder
   Compatible with current builder.html
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";

    /* =====================================================
       STORAGE
    ===================================================== */

    const STORAGE_KEY = "resumeCraftData";

    const defaultData = {
        personal: {
            firstName: "",
            lastName: "",
            professionalTitle: "",
            city: "",
            country: "",
            pinCode: "",
            phone: "",
            email: "",
            linkedin: "",
            website: "",
            photo: ""
        },

        experience: [
            {
                jobTitle: "",
                companyName: "",
                workLocation: "",
                startDate: "",
                endDate: "",
                currentlyWorking: false,
                description: ""
            }
        ],

        education: [
            {
                level: "",
                school: "",
                degree: "",
                field: "",
                startDate: "",
                endDate: "",
                currentlyStudying: false,
                marksType: "",
                percentage: "",
                cgpa: "",
                description: ""
            }
        ],

        skills: [],

        summary: "",

        settings: {
            template: "classic"
        },

        currentSection: "heading"
    };


    /* =====================================================
       GLOBAL DATA
    ===================================================== */

    let resumeData = loadData();


    /* =====================================================
       DOM HELPERS
    ===================================================== */

    const $ = (selector, parent = document) =>
        parent.querySelector(selector);

    const $$ = (selector, parent = document) =>
        Array.from(parent.querySelectorAll(selector));


    /* =====================================================
       UTILITY
    ===================================================== */

    function escapeHTML(value) {

        if (value === null || value === undefined) {
            return "";
        }

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function saveData() {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(resumeData)
            );

        } catch (error) {

            console.error(
                "Could not save resume data:",
                error
            );
        }
    }


    function loadData() {

        try {

            const saved =
                localStorage.getItem(STORAGE_KEY);

            if (!saved) {
                return structuredClone(defaultData);
            }

            const parsed = JSON.parse(saved);

            return mergeData(
                structuredClone(defaultData),
                parsed
            );

        } catch (error) {

            console.error(
                "Could not load saved data:",
                error
            );

            return structuredClone(defaultData);
        }
    }


    function mergeData(defaults, saved) {

        if (
            typeof defaults !== "object" ||
            defaults === null
        ) {
            return saved;
        }

        if (
            typeof saved !== "object" ||
            saved === null
        ) {
            return defaults;
        }

        Object.keys(saved).forEach(key => {

            if (
                Array.isArray(saved[key])
            ) {

                defaults[key] = saved[key];

            } else if (
                typeof saved[key] === "object" &&
                saved[key] !== null &&
                typeof defaults[key] === "object" &&
                defaults[key] !== null
            ) {

                defaults[key] =
                    mergeData(
                        defaults[key],
                        saved[key]
                    );

            } else {

                defaults[key] = saved[key];

            }

        });

        return defaults;
    }


    /* =====================================================
       TOAST
    ===================================================== */

    function showToast(message) {

        const toast = $("#toast");

        if (!toast) {
            return;
        }

        toast.textContent = message;
        toast.classList.add("show");

        clearTimeout(
            showToast.timeout
        );

        showToast.timeout =
            setTimeout(() => {

                toast.classList.remove("show");

            }, 2500);
    }


    /* =====================================================
       SECTION NAVIGATION
    ===================================================== */

    const sectionOrder = [
        "heading",
        "experience",
        "education",
        "skills",
        "summary",
        "finalize"
    ];


    function showSection(sectionName) {

        if (
            !sectionOrder.includes(sectionName)
        ) {
            return;
        }

        $$(".builder-section").forEach(section => {

            section.classList.toggle(
                "active",
                section.dataset.section === sectionName
            );

        });


        $$(".builder-step").forEach(step => {

            step.classList.toggle(
                "active",
                step.dataset.section === sectionName
            );

        });


        resumeData.currentSection =
            sectionName;

        saveData();

        updateStepState();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }


    function updateStepState() {

        const currentIndex =
            sectionOrder.indexOf(
                resumeData.currentSection
            );

        $$(".builder-step").forEach(step => {

            const section =
                step.dataset.section;

            const index =
                sectionOrder.indexOf(section);

            step.classList.remove("locked");
            step.classList.remove("completed");

            if (index > currentIndex) {

                step.classList.add("locked");

            } else if (index < currentIndex) {

                step.classList.add("completed");

            }

        });
    }


    function canOpenSection(sectionName) {

        const targetIndex =
            sectionOrder.indexOf(sectionName);

        const currentIndex =
            sectionOrder.indexOf(
                resumeData.currentSection
            );

        if (targetIndex <= currentIndex) {
            return true;
        }

        return true;
    }


    /* =====================================================
       SIDEBAR STEP BUTTONS
    ===================================================== */

    $$(".builder-step").forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const section =
                    button.dataset.section;

                if (!canOpenSection(section)) {

                    showToast(
                        "Complete the previous section first."
                    );

                    return;
                }

                showSection(section);
            }
        );
    });


    /* =====================================================
       CONTINUE BUTTONS
    ===================================================== */

    $$(".continue-section-btn").forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const currentSection =
                    button.closest(
                        ".builder-section"
                    );

                if (!currentSection) {
                    return;
                }

                const section =
                    currentSection.dataset.section;

                if (!validateSection(section)) {
                    return;
                }

                const next =
                    button.dataset.next;

                if (next) {
                    showSection(next);
                }
            }
        );
    });


    /* =====================================================
       BACK BUTTONS
    ===================================================== */

    $$(".back-section-btn").forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const back =
                    button.dataset.back;

                if (back) {
                    showSection(back);
                }
            }
        );
    });


    /* =====================================================
       BACK TO TEMPLATES
    ===================================================== */

    const backToTemplates =
        $("#backToTemplates");

    if (backToTemplates) {

        backToTemplates.addEventListener(
            "click",
            () => {

                window.location.href =
                    "templates.html";
            }
        );
    }


    /* =====================================================
       PERSONAL INFORMATION
    ===================================================== */

    const personalFields = [
        "firstName",
        "lastName",
        "professionalTitle",
        "city",
        "country",
        "pinCode",
        "phone",
        "email"
    ];


    personalFields.forEach(fieldId => {

        const input =
            document.getElementById(fieldId);

        if (!input) {
            return;
        }

        input.value =
            resumeData.personal[fieldId] || "";

        input.addEventListener(
            "input",
            () => {

                resumeData.personal[fieldId] =
                    input.value.trim();

                clearFieldError(input);

                saveAndUpdate();
            }
        );
    });


    /* =====================================================
       OPTIONAL INFORMATION
    ===================================================== */

    function renderOptionalFields() {

        const container =
            $("#optionalFields");

        if (!container) {
            return;
        }

        container.innerHTML = "";

        const fields = [];

        if (resumeData.personal.linkedin) {

            fields.push({
                id: "linkedin",
                label: "LinkedIn",
                placeholder:
                    "https://linkedin.com/in/yourname",
                value:
                    resumeData.personal.linkedin
            });

        }

        if (resumeData.personal.website) {

            fields.push({
                id: "website",
                label: "Website",
                placeholder:
                    "https://yourwebsite.com",
                value:
                    resumeData.personal.website
            });

        }

        fields.forEach(field => {

            const wrapper =
                document.createElement("div");

            wrapper.className =
                "form-group optional-field";

            wrapper.innerHTML = `
                <label for="${field.id}">
                    ${field.label}
                </label>

                <div class="optional-input-row">

                    <input
                        type="url"
                        id="${field.id}"
                        value="${escapeHTML(field.value)}"
                        placeholder="${field.placeholder}"
                    >

                    <button
                        type="button"
                        class="remove-optional"
                        data-field="${field.id}"
                    >
                        Remove
                    </button>

                </div>
            `;

            container.appendChild(wrapper);

            const input =
                document.getElementById(field.id);

            input.addEventListener(
                "input",
                () => {

                    resumeData.personal[field.id] =
                        input.value.trim();

                    saveAndUpdate();
                }
            );
        });


        $$(".remove-optional").forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const field =
                        button.dataset.field;

                    resumeData.personal[field] = "";

                    renderOptionalFields();

                    saveAndUpdate();
                }
            );
        });
    }


    $$(".optional-info-button").forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const field =
                    button.dataset.field;

                if (!field) {
                    return;
                }

                if (!resumeData.personal[field]) {

                    resumeData.personal[field] = "";
                }

                renderOptionalFields();

                const input =
                    document.getElementById(field);

                if (input) {
                    input.focus();
                }

                saveData();
            }
        );
    });


    renderOptionalFields();


    /* =====================================================
       PROFILE PHOTO
    ===================================================== */

    const photoInput =
        $("#photoInput");

    const previewPhoto =
        $("#previewPhoto");

    const previewPhotoIcon =
        $("#previewPhotoIcon");


    function renderPhoto() {

        if (!previewPhoto) {
            return;
        }

        if (resumeData.personal.photo) {

            previewPhoto.src =
                resumeData.personal.photo;

            previewPhoto.style.display =
                "block";

            if (previewPhotoIcon) {
                previewPhotoIcon.style.display =
                    "none";
            }

        } else {

            previewPhoto.removeAttribute(
                "src"
            );

            previewPhoto.style.display =
                "none";

            if (previewPhotoIcon) {
                previewPhotoIcon.style.display =
                    "inline";
            }
        }
    }


    if (photoInput) {

        photoInput.addEventListener(
            "change",
            event => {

                const file =
                    event.target.files[0];

                if (!file) {
                    return;
                }

                if (
                    ![
                        "image/jpeg",
                        "image/png"
                    ].includes(file.type)
                ) {

                    showToast(
                        "Please upload a JPG or PNG image."
                    );

                    photoInput.value = "";

                    return;
                }

                if (
                    file.size >
                    2 * 1024 * 1024
                ) {

                    showToast(
                        "Photo must be smaller than 2MB."
                    );

                    photoInput.value = "";

                    return;
                }

                const reader =
                    new FileReader();

                reader.onload = () => {

                    resumeData.personal.photo =
                        reader.result;

                    renderPhoto();

                    saveAndUpdate();

                    showToast(
                        "Profile photo updated."
                    );
                };

                reader.readAsDataURL(file);
            }
        );
    }


    renderPhoto();


    /* =====================================================
       EXPERIENCE
    ===================================================== */

    function getExperienceFromDOM() {

        return $$(".experience-item")
            .map(item => {

                return {
                    jobTitle:
                        $(".experience-job-title", item)?.value.trim() || "",

                    companyName:
                        $(".experience-company", item)?.value.trim() || "",

                    workLocation:
                        $(".experience-location", item)?.value.trim() || "",

                    startDate:
                        $(".experience-start", item)?.value || "",

                    endDate:
                        $(".experience-end", item)?.value || "",

                    currentlyWorking:
                        $(".currently-working", item)?.checked || false,

                    description:
                        $(".experience-description", item)?.value.trim() || ""
                };
            });
    }


    function renderExperience() {

        const list =
            $("#experienceList");

        if (!list) {
            return;
        }

        list.innerHTML = "";

        resumeData.experience.forEach(
            (experience, index) => {

                const card =
                    document.createElement("div");

                card.className =
                    "section-card experience-item";

                card.innerHTML = `

                    <div class="card-heading-row">

                        <h2>
                            Work Experience ${index + 1}
                        </h2>

                        <button
                            type="button"
                            class="remove-entry-btn"
                            ${resumeData.experience.length === 1 ? "style=\"display:none;\"" : ""}
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
                            value="${escapeHTML(experience.jobTitle)}"
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
                                value="${escapeHTML(experience.companyName)}"
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
                                value="${escapeHTML(experience.workLocation)}"
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
                                value="${experience.startDate || ""}"
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
                                value="${experience.endDate || ""}"
                                ${experience.currentlyWorking ? "disabled" : ""}
                            >

                            <small class="field-error"></small>

                        </div>

                    </div>


                    <div class="form-group checkbox-group">

                        <label>

                            <input
                                type="checkbox"
                                class="currently-working"
                                ${experience.currentlyWorking ? "checked" : ""}
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
                        >${escapeHTML(experience.description)}</textarea>

                    </div>
                `;

                list.appendChild(card);
            }
        );

        attachExperienceEvents();
    }


    function attachExperienceEvents() {

        $$(".experience-item").forEach(
            (item, index) => {

                $$(
                    "input, textarea",
                    item
                ).forEach(input => {

                    input.addEventListener(
                        "input",
                        () => {

                            updateExperienceFromDOM();

                            saveAndUpdate();
                        }
                    );

                    input.addEventListener(
                        "change",
                        () => {

                            updateExperienceFromDOM();

                            saveAndUpdate();
                        }
                    );
                });


                const checkbox =
                    $(".currently-working", item);

                const endDate =
                    $(".experience-end", item);

                if (checkbox && endDate) {

                    checkbox.addEventListener(
                        "change",
                        () => {

                            endDate.disabled =
                                checkbox.checked;

                            if (checkbox.checked) {
                                endDate.value = "";
                            }

                            updateExperienceFromDOM();

                            saveAndUpdate();
                        }
                    );
                }


                const removeButton =
                    $(".remove-entry-btn", item);

                if (removeButton) {

                    removeButton.addEventListener(
                        "click",
                        () => {

                            resumeData.experience.splice(
                                index,
                                1
                            );

                            if (
                                resumeData.experience.length === 0
                            ) {

                                resumeData.experience.push({
                                    jobTitle: "",
                                    companyName: "",
                                    workLocation: "",
                                    startDate: "",
                                    endDate: "",
                                    currentlyWorking: false,
                                    description: ""
                                });
                            }

                            renderExperience();

                            saveAndUpdate();

                            showToast(
                                "Experience removed."
                            );
                        }
                    );
                }
            }
        );
    }


    function updateExperienceFromDOM() {

        resumeData.experience =
            getExperienceFromDOM();
    }


    const addExperienceButton =
        $("#addExperienceButton");

    if (addExperienceButton) {

        addExperienceButton.addEventListener(
            "click",
            () => {

                updateExperienceFromDOM();

                resumeData.experience.push({
                    jobTitle: "",
                    companyName: "",
                    workLocation: "",
                    startDate: "",
                    endDate: "",
                    currentlyWorking: false,
                    description: ""
                });

                renderExperience();

                saveAndUpdate();

                showToast(
                    "New experience added."
                );
            }
        );
    }


    renderExperience();


    /* =====================================================
       EDUCATION
    ===================================================== */

    function getEducationFromDOM() {

        return $$(".education-card")
            .map(card => {

                const marksType =
                    $(".marks-type:checked", card)?.value || "";

                return {

                    level:
                        $(".education-level", card)?.value || "",

                    school:
                        $(".school-name", card)?.value.trim() || "",

                    degree:
                        $(".degree", card)?.value || "",

                    field:
                        $(".education-field", card)?.value || "",

                    startDate:
                        $(".education-start", card)?.value || "",

                    endDate:
                        $(".education-end", card)?.value || "",

                    currentlyStudying:
                        $(".currently-studying", card)?.checked || false,

                    marksType,

                    percentage:
                        $(".percentage-input", card)?.value || "",

                    cgpa:
                        $(".cgpa-input", card)?.value || "",

                    description:
                        $(".education-description", card)?.value.trim() || ""
                };
            });
    }


    function createEducationHTML(
        education,
        index
    ) {

        return `

            <div class="section-card education-card">

                <div class="entry-header">

                    <div>

                        <h2>
                            Education ${index + 1}
                        </h2>

                        <p class="entry-subtitle">
                            Add your school, college or university details.
                        </p>

                    </div>

                    ${
                        index > 0
                        ? `
                        <button
                            type="button"
                            class="remove-education-btn"
                        >
                            Remove
                        </button>
                        `
                        : ""
                    }

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
                        value="${escapeHTML(education.school)}"
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

                        <option value="Secondary School Certificate">
                            Secondary School Certificate
                        </option>

                        <option value="Higher Secondary Certificate">
                            Higher Secondary Certificate
                        </option>

                        <option value="Diploma">
                            Diploma
                        </option>

                        <option value="B.A.">
                            B.A.
                        </option>

                        <option value="B.Sc.">
                            B.Sc.
                        </option>

                        <option value="B.Com.">
                            B.Com.
                        </option>

                        <option value="B.Tech">
                            B.Tech
                        </option>

                        <option value="B.E.">
                            B.E.
                        </option>

                        <option value="BBA">
                            BBA
                        </option>

                        <option value="BCA">
                            BCA
                        </option>

                        <option value="M.A.">
                            M.A.
                        </option>

                        <option value="M.Sc.">
                            M.Sc.
                        </option>

                        <option value="M.Com.">
                            M.Com.
                        </option>

                        <option value="M.Tech">
                            M.Tech
                        </option>

                        <option value="MBA">
                            MBA
                        </option>

                        <option value="MCA">
                            MCA
                        </option>

                        <option value="PhD">
                            PhD
                        </option>

                        <option value="Other">
                            Other
                        </option>

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

                        <option value="Science">
                            Science
                        </option>

                        <option value="Commerce">
                            Commerce
                        </option>

                        <option value="Arts">
                            Arts
                        </option>

                        <option value="Computer Science">
                            Computer Science
                        </option>

                        <option value="Information Technology">
                            Information Technology
                        </option>

                        <option value="Engineering">
                            Engineering
                        </option>

                        <option value="Business Administration">
                            Business Administration
                        </option>

                        <option value="Accounting">
                            Accounting
                        </option>

                        <option value="Economics">
                            Economics
                        </option>

                        <option value="Mathematics">
                            Mathematics
                        </option>

                        <option value="Physics">
                            Physics
                        </option>

                        <option value="Chemistry">
                            Chemistry
                        </option>

                        <option value="Biology">
                            Biology
                        </option>

                        <option value="English">
                            English
                        </option>

                        <option value="Other">
                            Other
                        </option>

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
                            value="${education.startDate || ""}"
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
                            value="${education.endDate || ""}"
                            ${education.currentlyStudying ? "disabled" : ""}
                        >

                        <small class="field-error"></small>

                    </div>

                </div>


                <div class="form-group checkbox-group">

                    <label>

                        <input
                            type="checkbox"
                            class="currently-studying"
                            ${education.currentlyStudying ? "checked" : ""}
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
                                name="marksType-${index + 1}"
                                value="percentage"
                                ${education.marksType === "percentage" ? "checked" : ""}
                            >

                            Percentage

                        </label>


                        <label>

                            <input
                                type="radio"
                                class="marks-type"
                                name="marksType-${index + 1}"
                                value="cgpa"
                                ${education.marksType === "cgpa" ? "checked" : ""}
                            >

                            CGPA

                        </label>

                    </div>

                </div>


                <div
                    class="form-group percentage-field"
                    style="display:${education.marksType === "percentage" ? "block" : "none"};"
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
                        value="${education.percentage || ""}"
                    >

                    <small class="field-error"></small>

                </div>


                <div
                    class="form-group cgpa-field"
                    style="display:${education.marksType === "cgpa" ? "block" : "none"};"
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
                        value="${education.cgpa || ""}"
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
                    >${escapeHTML(education.description)}</textarea>

                </div>

            </div>
        `;
    }


    function renderEducation() {

        const container =
            $("#educationEntries");

        if (!container) {
            return;
        }

        container.innerHTML =
            resumeData.education
                .map(createEducationHTML)
                .join("");

        attachEducationEvents();
    }


    function attachEducationEvents() {

        $$(".education-card").forEach(
            (card, index) => {

                const level =
                    $(".education-level", card);

                const school =
                    $(".school-name", card);

                const degree =
                    $(".degree", card);

                const field =
                    $(".education-field", card);

                if (resumeData.education[index]) {

                    level.value =
                        resumeData.education[index].level || "";

                    degree.value =
                        resumeData.education[index].degree || "";

                    field.value =
                        resumeData.education[index].field || "";
                }


                $$(
                    "input, textarea, select",
                    card
                ).forEach(input => {

                    input.addEventListener(
                        "input",
                        () => {

                            updateEducationFromDOM();

                            saveAndUpdate();
                        }
                    );

                    input.addEventListener(
                        "change",
                        () => {

                            updateEducationFromDOM();

                            handleEducationUI(card);

                            saveAndUpdate();
                        }
                    );
                });


                const removeButton =
                    $(".remove-education-btn", card);

                if (removeButton) {

                    removeButton.addEventListener(
                        "click",
                        () => {

                            updateEducationFromDOM();

                            resumeData.education.splice(
                                index,
                                1
                            );

                            if (
                                resumeData.education.length === 0
                            ) {

                                resumeData.education.push({
                                    level: "",
                                    school: "",
                                    degree: "",
                                    field: "",
                                    startDate: "",
                                    endDate: "",
                                    currentlyStudying: false,
                                    marksType: "",
                                    percentage: "",
                                    cgpa: "",
                                    description: ""
                                });
                            }

                            renderEducation();

                            saveAndUpdate();

                            showToast(
                                "Education removed."
                            );
                        }
                    );
                }

                handleEducationUI(card);
            }
        );
    }


    function handleEducationUI(card) {

        const studying =
            $(".currently-studying", card);

        const endDate =
            $(".education-end", card);

        if (studying && endDate) {

            endDate.disabled =
                studying.checked;

            if (studying.checked) {
                endDate.value = "";
            }
        }


        const marksType =
            $(".marks-type:checked", card)?.value || "";

        const percentage =
            $(".percentage-field", card);

        const cgpa =
            $(".cgpa-field", card);

        if (percentage) {

            percentage.style.display =
                marksType === "percentage"
                    ? "block"
                    : "none";
        }

        if (cgpa) {

            cgpa.style.display =
                marksType === "cgpa"
                    ? "block"
                    : "none";
        }
    }


    function updateEducationFromDOM() {

        resumeData.education =
            getEducationFromDOM();
    }


    const addEducationButton =
        $("#addEducationButton");

    if (addEducationButton) {

        addEducationButton.addEventListener(
            "click",
            () => {

                updateEducationFromDOM();

                resumeData.education.push({
                    level: "",
                    school: "",
                    degree: "",
                    field: "",
                    startDate: "",
                    endDate: "",
                    currentlyStudying: false,
                    marksType: "",
                    percentage: "",
                    cgpa: "",
                    description: ""
                });

                renderEducation();

                saveAndUpdate();

                showToast(
                    "New education added."
                );
            }
        );
    }


    renderEducation();


    /* =====================================================
       SKILLS
    ===================================================== */

    const skillInput =
        $("#skillInput");

    const addSkillButton =
        $("#addSkillButton");

    const skillsList =
        $("#skillsList");


    function renderSkills() {

        if (!skillsList) {
            return;
        }

        skillsList.innerHTML = "";

        resumeData.skills.forEach(
            (skill, index) => {

                const item =
                    document.createElement("div");

                item.className =
                    "skill-tag";

                item.innerHTML = `
                    <span>
                        ${escapeHTML(skill)}
                    </span>

                    <button
                        type="button"
                        class="remove-skill"
                        data-index="${index}"
                        aria-label="Remove skill"
                    >
                        ×
                    </button>
                `;

                skillsList.appendChild(item);
            }
        );


        $$(".remove-skill").forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const index =
                        Number(
                            button.dataset.index
                        );

                    resumeData.skills.splice(
                        index,
                        1
                    );

                    renderSkills();

                    saveAndUpdate();
                }
            );
        });
    }


    function addSkill() {

        if (!skillInput) {
            return;
        }

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
                existing =>
                    existing.toLowerCase() ===
                    skill.toLowerCase()
            );

        if (exists) {

            showToast(
                "This skill has already been added."
            );

            return;
        }

        resumeData.skills.push(skill);

        skillInput.value = "";

        renderSkills();

        saveAndUpdate();

        showToast(
            "Skill added."
        );

        skillInput.focus();
    }


    if (addSkillButton) {

        addSkillButton.addEventListener(
            "click",
            addSkill
        );
    }


    if (skillInput) {

        skillInput.addEventListener(
            "keydown",
            event => {

                if (event.key === "Enter") {

                    event.preventDefault();

                    addSkill();
                }
            }
        );
    }


    renderSkills();


    /* =====================================================
       SUMMARY
    ===================================================== */

    const summaryInput =
        $("#professionalSummary");

    const summaryCount =
        $("#summaryCount");


    function updateSummary() {

        if (!summaryInput) {
            return;
        }

        let value =
            summaryInput.value;

        if (value.length > 500) {

            value =
                value.substring(
                    0,
                    500
                );

            summaryInput.value =
                value;
        }

        resumeData.summary =
            value;

        if (summaryCount) {

            summaryCount.textContent =
                value.length;
        }

        saveAndUpdate();
    }


    if (summaryInput) {

        summaryInput.value =
            resumeData.summary || "";

        updateSummary();

        summaryInput.addEventListener(
            "input",
            updateSummary
        );
    }


    /* =====================================================
       VALIDATION
    ===================================================== */

    function setFieldError(
        input,
        message
    ) {

        if (!input) {
            return;
        }

        input.classList.add(
            "input-error"
        );

        const error =
            input.parentElement?.querySelector(
                ".field-error"
            );

        if (error) {
            error.textContent =
                message;
        }
    }


    function clearFieldError(input) {

        if (!input) {
            return;
        }

        input.classList.remove(
            "input-error"
        );

        const error =
            input.parentElement?.querySelector(
                ".field-error"
            );

        if (error) {
            error.textContent = "";
        }
    }


    function validateHeading() {

        let valid = true;

        const required = [
            ["firstName", "First name is required."],
            ["lastName", "Surname is required."],
            [
                "professionalTitle",
                "Professional title is required."
            ],
            ["city", "City is required."],
            ["country", "Country is required."],
            ["pinCode", "Pin code is required."],
            ["phone", "Phone number is required."],
            ["email", "Email address is required."]
        ];


        required.forEach(
            ([id, message]) => {

                const input =
                    document.getElementById(id);

                if (!input) {
                    return;
                }

                if (!input.value.trim()) {

                    setFieldError(
                        input,
                        message
                    );

                    valid = false;

                } else {

                    clearFieldError(input);
                }
            }
        );


        const email =
            $("#email");

        if (
            email &&
            email.value.trim()
        ) {

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (
                !emailPattern.test(
                    email.value.trim()
                )
            ) {

                setFieldError(
                    email,
                    "Please enter a valid email address."
                );

                valid = false;
            }
        }


        const pin =
            $("#pinCode");

        if (
            pin &&
            pin.value.trim()
        ) {

            if (
                !/^\d{6}$/.test(
                    pin.value.trim()
                )
            ) {

                setFieldError(
                    pin,
                    "Enter a valid 6-digit PIN code."
                );

                valid = false;
            }
        }


        return valid;
    }


    function validateExperience() {

        updateExperienceFromDOM();

        let valid = true;

        resumeData.experience.forEach(
            (experience, index) => {

                const card =
                    $$(".experience-item")[index];

                if (!card) {
                    return;
                }

                const jobTitle =
                    $(".experience-job-title", card);

                const company =
                    $(".experience-company", card);

                const start =
                    $(".experience-start", card);


                if (!experience.jobTitle) {

                    setFieldError(
                        jobTitle,
                        "Job title is required."
                    );

                    valid = false;
                } else {
                    clearFieldError(jobTitle);
                }


                if (!experience.companyName) {

                    setFieldError(
                        company,
                        "Company name is required."
                    );

                    valid = false;
                } else {
                    clearFieldError(company);
                }


                if (!experience.startDate) {

                    setFieldError(
                        start,
                        "Start date is required."
                    );

                    valid = false;
                } else {
                    clearFieldError(start);
                }


                if (
                    experience.startDate &&
                    experience.endDate &&
                    experience.endDate <
                    experience.startDate
                ) {

                    setFieldError(
                        $(".experience-end", card),
                        "End date cannot be before start date."
                    );

                    valid = false;
                }
            }
        );


        return valid;
    }


    function validateEducation() {

        updateEducationFromDOM();

        let valid = true;

        resumeData.education.forEach(
            (education, index) => {

                const card =
                    $$(".education-card")[index];

                if (!card) {
                    return;
                }

                const level =
                    $(".education-level", card);

                const school =
                    $(".school-name", card);

                const degree =
                    $(".degree", card);

                const start =
                    $(".education-start", card);


                if (!education.level) {

                    setFieldError(
                        level,
                        "Please select education level."
                    );

                    valid = false;

                } else {
                    clearFieldError(level);
                }


                if (!education.school) {

                    setFieldError(
                        school,
                        "School or college name is required."
                    );

                    valid = false;

                } else {
                    clearFieldError(school);
                }


                if (!education.degree) {

                    setFieldError(
                        degree,
                        "Please select qualification."
                    );

                    valid = false;

                } else {
                    clearFieldError(degree);
                }


                if (!education.startDate) {

                    setFieldError(
                        start,
                        "Start date is required."
                    );

                    valid = false;

                } else {
                    clearFieldError(start);
                }


                if (
                    education.startDate &&
                    education.endDate &&
                    education.endDate <
                    education.startDate
                ) {

                    setFieldError(
                        $(".education-end", card),
                        "End date cannot be before start date."
                    );

                    valid = false;
                }


                if (
                    education.marksType ===
                    "percentage"
                ) {

                    const percentage =
                        Number(
                            education.percentage
                        );

                    if (
                        education.percentage !== "" &&
                        (
                            percentage < 0 ||
                            percentage > 100
                        )
                    ) {

                        setFieldError(
                            $(".percentage-input", card),
                            "Percentage must be between 0 and 100."
                        );

                        valid = false;
                    }
                }


                if (
                    education.marksType ===
                    "cgpa"
                ) {

                    const cgpa =
                        Number(
                            education.cgpa
                        );

                    if (
                        education.cgpa !== "" &&
                        (
                            cgpa < 0 ||
                            cgpa > 10
                        )
                    ) {

                        setFieldError(
                            $(".cgpa-input", card),
                            "CGPA must be between 0 and 10."
                        );

                        valid = false;
                    }
                }
            }
        );


        return valid;
    }


    function validateSkills() {

        if (
            resumeData.skills.length === 0
        ) {

            showToast(
                "Add at least one skill."
            );

            if (skillInput) {
                skillInput.focus();
            }

            return false;
        }

        return true;
    }


    function validateSummary() {

        if (
            !resumeData.summary.trim()
        ) {

            showToast(
                "Please add a professional summary."
            );

            if (summaryInput) {
                summaryInput.focus();
            }

            return false;
        }

        return true;
    }


    function validateSection(section) {

        switch (section) {

            case "heading":
                return validateHeading();

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


    /* =====================================================
       COMPLETION
    ===================================================== */

    function calculateCompletion() {

        let total = 0;
        let completed = 0;


        const personalFields = [
            "firstName",
            "lastName",
            "professionalTitle",
            "city",
            "country",
            "pinCode",
            "phone",
            "email"
        ];

        personalFields.forEach(field => {

            total++;

            if (
                resumeData.personal[field]
            ) {
                completed++;
            }
        });


        total++;

        if (
            resumeData.experience.some(
                exp =>
                    exp.jobTitle &&
                    exp.companyName &&
                    exp.startDate
            )
        ) {
            completed++;
        }


        total++;

        if (
            resumeData.education.some(
                edu =>
                    edu.level &&
                    edu.school &&
                    edu.degree &&
                    edu.startDate
            )
        ) {
            completed++;
        }


        total++;

        if (
            resumeData.skills.length > 0
        ) {
            completed++;
        }


        total++;

        if (
            resumeData.summary.trim()
        ) {
            completed++;
        }


        return Math.round(
            (completed / total) * 100
        );
    }


    function updateCompletion() {

        const percentage =
            calculateCompletion();

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


    /* =====================================================
       DATE FORMAT
    ===================================================== */

    function formatDate(value) {

        if (!value) {
            return "";
        }

        const [year, month] =
            value.split("-");

        if (!year || !month) {
            return value;
        }

        const date =
            new Date(
                Number(year),
                Number(month) - 1
            );

        return date.toLocaleDateString(
            "en-US",
            {
                month: "short",
                year: "numeric"
            }
        );
    }


    /* =====================================================
       RESUME PREVIEW
    ===================================================== */

    function renderPreview() {

        const preview =
            $("#resumePreview");

        if (!preview) {
            return;
        }

        const personal =
            resumeData.personal;


        const fullName =
            `${personal.firstName || ""} ${personal.lastName || ""}`
                .trim();


        const experiences =
            resumeData.experience.filter(
                exp =>
                    exp.jobTitle ||
                    exp.companyName ||
                    exp.description
            );


        const education =
            resumeData.education.filter(
                edu =>
                    edu.school ||
                    edu.degree ||
                    edu.description
            );


        const locationParts = [
            personal.city,
            personal.country
        ].filter(Boolean);


        const contact = [
            personal.email,
            personal.phone,
            locationParts.join(", "),
            personal.linkedin,
            personal.website
        ].filter(Boolean);


        let html = `
            <div class="resume-preview-document template-${escapeHTML(
                resumeData.settings.template
            )}">

                <header class="resume-preview-header">

                    ${
                        personal.photo
                        ? `
                        <div class="resume-preview-photo">
                            <img
                                src="${personal.photo}"
                                alt="Profile photo"
                            >
                        </div>
                        `
                        : ""
                    }

                    <div class="resume-preview-heading">

                        <h1>
                            ${escapeHTML(
                                fullName || "Your Name"
                            )}
                        </h1>

                        ${
                            personal.professionalTitle
                            ? `
                            <h2>
                                ${escapeHTML(
                                    personal.professionalTitle
                                )}
                            </h2>
                            `
                            : ""
                        }

                        ${
                            contact.length
                            ? `
                            <div class="resume-preview-contact">
                                ${contact
                                    .map(
                                        item =>
                                            `<span>${escapeHTML(item)}</span>`
                                    )
                                    .join(" • ")}
                            </div>
                            `
                            : ""
                        }

                    </div>

                </header>
        `;


        if (
            resumeData.summary.trim()
        ) {

            html += `
                <section class="resume-preview-section">

                    <h3>
                        Professional Summary
                    </h3>

                    <p>
                        ${escapeHTML(
                            resumeData.summary
                        )}
                    </p>

                </section>
            `;
        }


        if (experiences.length) {

            html += `
                <section class="resume-preview-section">

                    <h3>
                        Experience
                    </h3>
            `;

            experiences.forEach(exp => {

                const dates = [];

                if (exp.startDate) {
                    dates.push(
                        formatDate(
                            exp.startDate
                        )
                    );
                }

                if (exp.currentlyWorking) {

                    dates.push(
                        "Present"
                    );

                } else if (exp.endDate) {

                    dates.push(
                        formatDate(
                            exp.endDate
                        )
                    );
                }


                html += `
                    <article class="resume-preview-entry">

                        <div class="resume-entry-top">

                            <div>

                                ${
                                    exp.jobTitle
                                    ? `
                                    <h4>
                                        ${escapeHTML(
                                            exp.jobTitle
                                        )}
                                    </h4>
                                    `
                                    : ""
                                }

                                ${
                                    exp.companyName
                                    ? `
                                    <strong>
                                        ${escapeHTML(
                                            exp.companyName
                                        )}
                                    </strong>
                                    `
                                    : ""
                                }

                                ${
                                    exp.workLocation
                                    ? `
                                    <span>
                                        · ${escapeHTML(
                                            exp.workLocation
                                        )}
                                    </span>
                                    `
                                    : ""
                                }

                            </div>

                            ${
                                dates.length
                                ? `
                                <span class="resume-entry-date">
                                    ${dates.join(" – ")}
                                </span>
                                `
                                : ""
                            }

                        </div>

                        ${
                            exp.description
                            ? `
                            <p>
                                ${escapeHTML(
                                    exp.description
                                )}
                            </p>
                            `
                            : ""
                        }

                    </article>
                `;
            });

            html += `
                </section>
            `;
        }


        if (education.length) {

            html += `
                <section class="resume-preview-section">

                    <h3>
                        Education
                    </h3>
            `;

            education.forEach(edu => {

                const dates = [];

                if (edu.startDate) {

                    dates.push(
                        formatDate(
                            edu.startDate
                        )
                    );
                }

                if (edu.currentlyStudying) {

                    dates.push(
                        "Present"
                    );

                } else if (edu.endDate) {

                    dates.push(
                        formatDate(
                            edu.endDate
                        )
                    );
                }


                let result = "";

                if (
                    edu.marksType ===
                    "percentage" &&
                    edu.percentage
                ) {

                    result =
                        `${edu.percentage}%`;

                } else if (
                    edu.marksType ===
                    "cgpa" &&
                    edu.cgpa
                ) {

                    result =
                        `CGPA ${edu.cgpa}`;
                }


                html += `
                    <article class="resume-preview-entry">

                        <div class="resume-entry-top">

                            <div>

                                ${
                                    edu.degree
                                    ? `
                                    <h4>
                                        ${escapeHTML(
                                            edu.degree
                                        )}
                                    </h4>
                                    `
                                    : ""
                                }

                                ${
                                    edu.school
                                    ? `
                                    <strong>
                                        ${escapeHTML(
                                            edu.school
                                        )}
                                    </strong>
                                    `
                                    : ""
                                }

                            </div>

                            ${
                                dates.length
                                ? `
                                <span class="resume-entry-date">
                                    ${dates.join(" – ")}
                                </span>
                                `
                                : ""
                            }

                        </div>

                        ${
                            edu.field
                            ? `
                            <div>
                                ${escapeHTML(
                                    edu.field
                                )}
                            </div>
                            `
                            : ""
                        }

                        ${
                            result
                            ? `
                            <div>
                                ${escapeHTML(result)}
                            </div>
                            `
                            : ""
                        }

                        ${
                            edu.description
                            ? `
                            <p>
                                ${escapeHTML(
                                    edu.description
                                )}
                            </p>
                            `
                            : ""
                        }

                    </article>
                `;
            });

            html += `
                </section>
            `;
        }


        if (
            resumeData.skills.length
        ) {

            html += `
                <section class="resume-preview-section">

                    <h3>
                        Skills
                    </h3>

                    <div class="resume-preview-skills">

                        ${resumeData.skills
                            .map(
                                skill =>
                                    `<span>${escapeHTML(skill)}</span>`
                            )
                            .join("")}

                    </div>

                </section>
            `;
        }


        html += `
            </div>
        `;


        preview.innerHTML =
            html;
    }


    /* =====================================================
       TEMPLATE SWITCHING
    ===================================================== */

    function updateTemplateButtons() {

        $$(".template-option").forEach(
            button => {

                button.classList.toggle(
                    "active",
                    button.dataset.template ===
                    resumeData.settings.template
                );
            }
        );
    }


    $$(".template-option").forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const template =
                        button.dataset.template;

                    if (!template) {
                        return;
                    }

                    resumeData.settings.template =
                        template;

                    updateTemplateButtons();

                    renderPreview();

                    saveData();

                    showToast(
                        `${template.charAt(0).toUpperCase() + template.slice(1)} template selected.`
                    );
                }
            );
        }
    );


    updateTemplateButtons();


    /* =====================================================
       DOWNLOAD RESUME
    ===================================================== */

    const downloadButton =
        $("#downloadResumeButton");


    if (downloadButton) {

        downloadButton.addEventListener(
            "click",
            () => {

                const allValid =
                    validateHeading() &&
                    validateExperience() &&
                    validateEducation() &&
                    validateSkills() &&
                    validateSummary();

                if (!allValid) {

                    showToast(
                        "Please complete all required sections first."
                    );

                    return;
                }


                renderPreview();

                /*
                 * If html2pdf.js is available,
                 * generate the PDF.
                 */

                if (
                    typeof window.html2pdf ===
                    "function"
                ) {

                    const element =
                        $("#resumePreview");

                    const options = {

                        margin: 0,

                        filename:
                            `${(
                                resumeData.personal.firstName ||
                                "resume"
                            )}-${(
                                resumeData.personal.lastName ||
                                ""
                            )}.pdf`,

                        image: {
                            type: "jpeg",
                            quality: 0.98
                        },

                        html2canvas: {
                            scale: 2,
                            useCORS: true
                        },

                        jsPDF: {
                            unit: "mm",
                            format: "a4",
                            orientation: "portrait"
                        }
                    };


                    window.html2pdf()
                        .set(options)
                        .from(element)
                        .save();

                } else {

                    showToast(
                        "PDF library is not loaded. Please add html2pdf.js."
                    );
                }
            }
        );
    }


    /* =====================================================
       SAVE + UPDATE
    ===================================================== */

    function saveAndUpdate() {

        saveData();

        updateCompletion();

        renderPreview();
    }


    /* =====================================================
       INITIALIZE
    ===================================================== */

    updateCompletion();

    renderPreview();

    updateStepState();


    showSection(
        resumeData.currentSection ||
        "heading"
    );


    /* =====================================================
       AUTO SAVE
    ===================================================== */

    setInterval(
        () => {

            saveData();

        },
        5000
    );


    /* =====================================================
       BEFORE LEAVING PAGE
    ===================================================== */

    window.addEventListener(
        "beforeunload",
        () => {

            /*
             * Make sure current form values
             * are stored before leaving.
             */

            try {

                updateExperienceFromDOM();

                updateEducationFromDOM();

                saveData();

            } catch (error) {

                console.error(
                    "Final save failed:",
                    error
                );
            }
        }
    );


    /* =====================================================
       READY
    ===================================================== */

    console.log(
        "ResumeCraft Builder initialized successfully."
    );

});
