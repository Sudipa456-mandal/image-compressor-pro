/* =========================================================
   RESUMECRAFT - RESUME BUILDER
   Professional, lightweight, privacy-friendly builder
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    "use strict";

    /* =====================================================
       CONFIG
    ===================================================== */

    const STORAGE_KEY = "resumeCraftData";

    const steps = [
        "heading",
        "experience",
        "education",
        "skills",
        "summary",
        "finalize"
    ];

    let currentSection = "heading";

    let resumeData = {
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

        experience: [],

        education: [],

        skills: [],

        summary: ""
    };


    /* =====================================================
       DOM HELPERS
    ===================================================== */

    const $ = (selector, parent = document) =>
        parent.querySelector(selector);

    const $$ = (selector, parent = document) =>
        Array.from(parent.querySelectorAll(selector));


    /* =====================================================
       LOAD DATA
    ===================================================== */

    function loadData() {

        try {

            const saved =
                localStorage.getItem(STORAGE_KEY);

            if (!saved) return;

            const parsed = JSON.parse(saved);

            resumeData = {
                ...resumeData,
                ...parsed,

                personal: {
                    ...resumeData.personal,
                    ...(parsed.personal || {})
                },

                experience:
                    Array.isArray(parsed.experience)
                        ? parsed.experience
                        : [],

                education:
                    Array.isArray(parsed.education)
                        ? parsed.education
                        : [],

                skills:
                    Array.isArray(parsed.skills)
                        ? parsed.skills
                        : [],

                summary:
                    parsed.summary || ""
            };

        } catch (error) {

            console.warn(
                "ResumeCraft data could not be loaded.",
                error
            );

        }

    }


    /* =====================================================
       SAVE DATA
    ===================================================== */

    function saveData() {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(resumeData)
            );

        } catch (error) {

            console.warn(
                "ResumeCraft data could not be saved.",
                error
            );

        }

    }


    /* =====================================================
       SAFE TEXT
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


    /* =====================================================
       INITIALIZE PERSONAL FORM
    ===================================================== */

    function initializePersonalForm() {

        const fields = [
            "firstName",
            "lastName",
            "professionalTitle",
            "city",
            "country",
            "pinCode",
            "phone",
            "email"
        ];

        fields.forEach(function (field) {

            const element = $("#" + field);

            if (!element) return;

            element.value =
                resumeData.personal[field] || "";

        });

    }


    /* =====================================================
       PERSONAL FORM EVENTS
    ===================================================== */

    function setupPersonalForm() {

        const fields = [
            "firstName",
            "lastName",
            "professionalTitle",
            "city",
            "country",
            "pinCode",
            "phone",
            "email"
        ];

        fields.forEach(function (field) {

            const element = $("#" + field);

            if (!element) return;

            element.addEventListener(
                "input",
                function () {

                    resumeData.personal[field] =
                        element.value.trim();

                    saveData();
                    updatePreview();
                    updateCompletion();

                }
            );

        });

    }


    /* =====================================================
       OPTIONAL LINKS
    ===================================================== */

    function setupOptionalLinks() {

        const buttons =
            $$(".optional-info-button");

        const container =
            $("#optionalFields");

        if (!container) return;

        buttons.forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const field =
                        button.dataset.field;

                    if (!field) return;

                    if (
                        container.querySelector(
                            `[data-optional="${field}"]`
                        )
                    ) {

                        return;

                    }

                    const label =
                        field === "linkedin"
                            ? "LinkedIn profile"
                            : "Personal website";

                    const placeholder =
                        field === "linkedin"
                            ? "https://linkedin.com/in/yourname"
                            : "https://yourwebsite.com";

                    const wrapper =
                        document.createElement("div");

                    wrapper.className =
                        "optional-field-row";

                    wrapper.dataset.optional =
                        field;

                    wrapper.innerHTML = `
                        <div class="form-group full-width">

                            <label for="${field}">
                                ${label}
                            </label>

                            <div class="optional-input-wrap">

                                <input
                                    type="url"
                                    id="${field}"
                                    placeholder="${placeholder}"
                                    value="${escapeHTML(
                                        resumeData.personal[field] || ""
                                    )}"
                                >

                                <button
                                    type="button"
                                    class="remove-optional"
                                    aria-label="Remove ${label}"
                                >
                                    Remove
                                </button>

                            </div>

                        </div>
                    `;

                    container.appendChild(wrapper);

                    const input =
                        $("#" + field, wrapper);

                    input.addEventListener(
                        "input",
                        function () {

                            resumeData.personal[field] =
                                input.value.trim();

                            saveData();
                            updatePreview();

                        }
                    );

                    const removeButton =
                        $(".remove-optional", wrapper);

                    removeButton.addEventListener(
                        "click",
                        function () {

                            resumeData.personal[field] = "";

                            wrapper.remove();

                            saveData();
                            updatePreview();

                        }
                    );

                    input.focus();

                }
            );

        });


        /* Restore saved optional fields */

        ["linkedin", "website"].forEach(
            function (field) {

                if (
                    resumeData.personal[field]
                ) {

                    const button =
                        $(
                            `.optional-info-button[data-field="${field}"]`
                        );

                    if (button) {
                        button.click();
                    }

                }

            }
        );

    }


    /* =====================================================
       PROFILE PHOTO
    ===================================================== */

    function setupPhotoUpload() {

        const input =
            $("#photoInput");

        if (!input) return;

        input.addEventListener(
            "change",
            function () {

                const file =
                    input.files && input.files[0];

                if (!file) return;

                if (
                    ![
                        "image/jpeg",
                        "image/png"
                    ].includes(file.type)
                ) {

                    showToast(
                        "Please select a JPG or PNG image."
                    );

                    input.value = "";
                    return;

                }

                if (
                    file.size >
                    2 * 1024 * 1024
                ) {

                    showToast(
                        "Photo must be smaller than 2MB."
                    );

                    input.value = "";
                    return;

                }

                const reader =
                    new FileReader();

                reader.onload = function (event) {

                    resumeData.personal.photo =
                        event.target.result;

                    saveData();
                    updatePhotoPreview();
                    updatePreview();

                };

                reader.readAsDataURL(file);

            }
        );

        updatePhotoPreview();

    }


    function updatePhotoPreview() {

        const photo =
            resumeData.personal.photo;

        const previewPhoto =
            $("#previewPhoto");

        const previewIcon =
            $("#previewPhotoIcon");

        const resumePhoto =
            $("#resumePhoto");

        const resumePhotoIcon =
            $("#resumePhotoIcon");

        if (photo) {

            if (previewPhoto) {

                previewPhoto.src = photo;
                previewPhoto.style.display = "block";

            }

            if (previewIcon) {

                previewIcon.style.display = "none";

            }

            if (resumePhoto) {

                resumePhoto.src = photo;
                resumePhoto.style.display = "block";

            }

            if (resumePhotoIcon) {

                resumePhotoIcon.style.display = "none";

            }

        } else {

            if (previewPhoto) {

                previewPhoto.removeAttribute("src");
                previewPhoto.style.display = "none";

            }

            if (previewIcon) {

                previewIcon.style.display = "inline";

            }

            if (resumePhoto) {

                resumePhoto.removeAttribute("src");
                resumePhoto.style.display = "none";

            }

            if (resumePhotoIcon) {

                resumePhotoIcon.style.display = "inline";

            }

        }

    }


    /* =====================================================
       EXPERIENCE
    ===================================================== */

    function createExperience() {

        return {
            jobTitle: "",
            company: "",
            location: "",
            startDate: "",
            endDate: "",
            currentlyWorking: false,
            description: ""
        };

    }


    function ensureExperience() {

        if (
            !Array.isArray(resumeData.experience)
        ) {

            resumeData.experience = [];

        }

        if (
            resumeData.experience.length === 0
        ) {

            resumeData.experience.push(
                createExperience()
            );

        }

    }


    function renderExperience() {

        const container =
            $("#experienceList");

        if (!container) return;

        ensureExperience();

        container.innerHTML = "";

        resumeData.experience.forEach(
            function (item, index) {

                const card =
                    document.createElement("div");

                card.className =
                    "section-card experience-item";

                card.dataset.index = index;

                card.innerHTML = `

                    <div class="card-heading-row">

                        <div>

                            <span class="entry-number">
                                Experience ${index + 1}
                            </span>

                            <h2>Work Experience</h2>

                        </div>

                        <button
                            type="button"
                            class="remove-entry-btn"
                            ${resumeData.experience.length === 1
                                ? 'style="display:none;"'
                                : ""}
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
                            value="${escapeHTML(item.jobTitle)}"
                        >

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
                                value="${escapeHTML(item.company)}"
                            >

                        </div>

                        <div class="form-group">

                            <label>
                                Location
                            </label>

                            <input
                                type="text"
                                class="experience-location"
                                placeholder="Kolkata"
                                value="${escapeHTML(item.location)}"
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
                                value="${escapeHTML(item.startDate)}"
                            >

                        </div>

                        <div class="form-group">

                            <label>
                                End Date
                            </label>

                            <input
                                type="month"
                                class="experience-end"
                                value="${escapeHTML(item.endDate)}"
                                ${item.currentlyWorking
                                    ? "disabled"
                                    : ""}
                            >

                        </div>

                    </div>


                    <div class="form-group checkbox-group">

                        <label>

                            <input
                                type="checkbox"
                                class="currently-working"
                                ${item.currentlyWorking
                                    ? "checked"
                                    : ""}
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
                        >${escapeHTML(item.description)}</textarea>

                    </div>

                `;

                container.appendChild(card);

                setupExperienceCard(
                    card,
                    index
                );

            }
        );

        updatePreview();

    }


    function setupExperienceCard(
        card,
        index
    ) {

        const fields = {

            jobTitle:
                $(".experience-job-title", card),

            company:
                $(".experience-company", card),

            location:
                $(".experience-location", card),

            startDate:
                $(".experience-start", card),

            endDate:
                $(".experience-end", card),

            description:
                $(".experience-description", card)

        };


        Object.keys(fields).forEach(
            function (key) {

                const input =
                    fields[key];

                if (!input) return;

                input.addEventListener(
                    "input",
                    function () {

                        resumeData.experience[index][key] =
                            input.value;

                        saveData();
                        updatePreview();
                        updateCompletion();

                    }
                );

            }
        );


        const working =
            $(".currently-working", card);

        if (working) {

            working.addEventListener(
                "change",
                function () {

                    resumeData.experience[index]
                        .currentlyWorking =
                        working.checked;

                    const endDate =
                        $(".experience-end", card);

                    if (endDate) {

                        endDate.disabled =
                            working.checked;

                        if (working.checked) {

                            endDate.value = "";

                            resumeData
                                .experience[index]
                                .endDate = "";

                        }

                    }

                    saveData();
                    updatePreview();

                }
            );

        }


        const remove =
            $(".remove-entry-btn", card);

        if (remove) {

            remove.addEventListener(
                "click",
                function () {

                    resumeData.experience.splice(
                        index,
                        1
                    );

                    saveData();

                    renderExperience();
                    updateCompletion();

                }
            );

        }

    }


    function setupExperience() {

        const button =
            $("#addExperienceButton");

        if (!button) return;

        button.addEventListener(
            "click",
            function () {

                resumeData.experience.push(
                    createExperience()
                );

                saveData();

                renderExperience();

                showToast(
                    "Experience added."
                );

            }
        );

        renderExperience();

    }


    /* =====================================================
       EDUCATION
    ===================================================== */

    function createEducation() {

        return {

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

        };

    }


    function ensureEducation() {

        if (
            !Array.isArray(resumeData.education)
        ) {

            resumeData.education = [];

        }

        if (
            resumeData.education.length === 0
        ) {

            resumeData.education.push(
                createEducation()
            );

        }

    }


    function renderEducation() {

        const container =
            $("#educationEntries");

        if (!container) return;

        ensureEducation();

        container.innerHTML = "";

        resumeData.education.forEach(
            function (item, index) {

                const card =
                    document.createElement("div");

                card.className =
                    "section-card education-card";

                card.dataset.index = index;

                card.innerHTML = `

                    <div class="entry-header">

                        <div>

                            <span class="entry-number">
                                Education ${index + 1}
                            </span>

                            <h2>
                                Education ${index + 1}
                            </h2>

                            <p class="entry-subtitle">
                                Add your school, college or university details.
                            </p>

                        </div>

                        ${
                            resumeData.education.length > 1
                                ? `
                                    <button
                                        type="button"
                                        class="remove-entry-btn education-remove"
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

                    </div>


                    <div class="form-group">

                        <label>
                            School / College / University *
                        </label>

                        <input
                            type="text"
                            class="school-name"
                            placeholder="ABC School / XYZ University"
                            value="${escapeHTML(item.school)}"
                        >

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
                            <option>PhD</option>
                            <option>Other</option>

                        </select>

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
                                value="${escapeHTML(item.startDate)}"
                            >

                        </div>

                        <div class="form-group">

                            <label>
                                End Date
                            </label>

                            <input
                                type="month"
                                class="education-end"
                                value="${escapeHTML(item.endDate)}"
                                ${item.currentlyStudying
                                    ? "disabled"
                                    : ""}
                            >

                        </div>

                    </div>


                    <div class="form-group checkbox-group">

                        <label>

                            <input
                                type="checkbox"
                                class="currently-studying"
                                ${item.currentlyStudying
                                    ? "checked"
                                    : ""}
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
                                    name="marksType-${index}"
                                    value="percentage"
                                    ${item.marksType === "percentage"
                                        ? "checked"
                                        : ""}
                                >
                                Percentage
                            </label>

                            <label>
                                <input
                                    type="radio"
                                    class="marks-type"
                                    name="marksType-${index}"
                                    value="cgpa"
                                    ${item.marksType === "cgpa"
                                        ? "checked"
                                        : ""}
                                >
                                CGPA
                            </label>

                        </div>

                    </div>


                    <div
                        class="form-group percentage-field"
                        ${item.marksType === "percentage"
                            ? ""
                            : 'style="display:none;"'}
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
                            value="${escapeHTML(item.percentage)}"
                        >

                    </div>


                    <div
                        class="form-group cgpa-field"
                        ${item.marksType === "cgpa"
                            ? ""
                            : 'style="display:none;"'}
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
                            value="${escapeHTML(item.cgpa)}"
                        >

                    </div>


                    <div class="form-group">

                        <label>
                            Description
                        </label>

                        <textarea
                            class="education-description"
                            rows="4"
                            placeholder="Achievements, coursework, activities, awards..."
                        >${escapeHTML(item.description)}</textarea>

                    </div>

                `;

                container.appendChild(card);

                setEducationValues(
                    card,
                    item
                );

                setupEducationCard(
                    card,
                    index
                );

            }
        );

        updatePreview();

    }


    function setEducationValues(
        card,
        item
    ) {

        const level =
            $(".education-level", card);

        const degree =
            $(".degree", card);

        const field =
            $(".education-field", card);

        if (level) {
            level.value =
                item.level || "";
        }

        if (degree) {
            degree.value =
                item.degree || "";
        }

        if (field) {
            field.value =
                item.field || "";
        }

    }


    function setupEducationCard(
        card,
        index
    ) {

        const map = {

            level:
                $(".education-level", card),

            school:
                $(".school-name", card),

            degree:
                $(".degree", card),

            field:
                $(".education-field", card),

            startDate:
                $(".education-start", card),

            endDate:
                $(".education-end", card),

            percentage:
                $(".percentage-input", card),

            cgpa:
                $(".cgpa-input", card),

            description:
                $(".education-description", card)

        };


        Object.keys(map).forEach(
            function (key) {

                const element =
                    map[key];

                if (!element) return;

                element.addEventListener(
                    "input",
                    function () {

                        resumeData.education[index][key] =
                            element.value;

                        saveData();
                        updatePreview();
                        updateCompletion();

                    }
                );

                element.addEventListener(
                    "change",
                    function () {

                        resumeData.education[index][key] =
                            element.value;

                        saveData();
                        updatePreview();
                        updateCompletion();

                    }
                );

            }
        );


        const studying =
            $(".currently-studying", card);

        if (studying) {

            studying.addEventListener(
                "change",
                function () {

                    resumeData.education[index]
                        .currentlyStudying =
                        studying.checked;

                    const end =
                        $(".education-end", card);

                    if (end) {

                        end.disabled =
                            studying.checked;

                        if (studying.checked) {

                            end.value = "";

                            resumeData.education[index]
                                .endDate = "";

                        }

                    }

                    saveData();
                    updatePreview();

                }
            );

        }


        const radios =
            $$(".marks-type", card);

        radios.forEach(
            function (radio) {

                radio.addEventListener(
                    "change",
                    function () {

                        if (!radio.checked) return;

                        resumeData.education[index]
                            .marksType =
                            radio.value;

                        const percentage =
                            $(".percentage-field", card);

                        const cgpa =
                            $(".cgpa-field", card);

                        if (percentage) {

                            percentage.style.display =
                                radio.value === "percentage"
                                    ? ""
                                    : "none";

                        }

                        if (cgpa) {

                            cgpa.style.display =
                                radio.value === "cgpa"
                                    ? ""
                                    : "none";

                        }

                        saveData();
                        updatePreview();

                    }
                );

            }
        );


        const remove =
            $(".education-remove", card);

        if (remove) {

            remove.addEventListener(
                "click",
                function () {

                    resumeData.education.splice(
                        index,
                        1
                    );

                    saveData();

                    renderEducation();
                    updateCompletion();

                }
            );

        }

    }


    function setupEducation() {

        const button =
            $("#addEducationButton");

        if (!button) return;

        button.addEventListener(
            "click",
            function () {

                resumeData.education.push(
                    createEducation()
                );

                saveData();

                renderEducation();

                showToast(
                    "Education added."
                );

            }
        );

        renderEducation();

    }


    /* =====================================================
       SKILLS
    ===================================================== */

    function setupSkills() {

        const input =
            $("#skillInput");

        const button =
            $("#addSkillButton");

        const list =
            $("#skillsList");

        if (!input || !button || !list) {
            return;
        }


        function renderSkills() {

            list.innerHTML = "";

            resumeData.skills.forEach(
                function (skill, index) {

                    const tag =
                        document.createElement("span");

                    tag.className =
                        "skill-tag";

                    tag.innerHTML = `
                        <span>
                            ${escapeHTML(skill)}
                        </span>

                        <button
                            type="button"
                            class="remove-skill"
                            aria-label="Remove ${escapeHTML(skill)}"
                        >
                            ×
                        </button>
                    `;

                    const remove =
                        $(".remove-skill", tag);

                    remove.addEventListener(
                        "click",
                        function () {

                            resumeData.skills.splice(
                                index,
                                1
                            );

                            saveData();

                            renderSkills();
                            updatePreview();
                            updateCompletion();

                        }
                    );

                    list.appendChild(tag);

                }
            );

            updatePreview();

        }


        function addSkill() {

            const value =
                input.value.trim();

            if (!value) {

                input.focus();

                showToast(
                    "Enter a skill first."
                );

                return;

            }

            const exists =
                resumeData.skills.some(
                    skill =>
                        skill.toLowerCase() ===
                        value.toLowerCase()
                );

            if (exists) {

                showToast(
                    "This skill is already added."
                );

                input.select();

                return;

            }

            resumeData.skills.push(
                value
            );

            input.value = "";

            saveData();

            renderSkills();
            updateCompletion();

            input.focus();

        }


        button.addEventListener(
            "click",
            addSkill
        );


        input.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter"
                ) {

                    event.preventDefault();

                    addSkill();

                }

            }
        );


        renderSkills();

    }


    /* =====================================================
       SUMMARY
    ===================================================== */

    function setupSummary() {

        const textarea =
            $("#professionalSummary");

        const counter =
            $("#summaryCount");

        if (!textarea) return;

        textarea.value =
            resumeData.summary || "";

        function updateCount() {

            const value =
                textarea.value.substring(
                    0,
                    500
                );

            if (
                textarea.value.length > 500
            ) {

                textarea.value =
                    value;

            }

            if (counter) {

                counter.textContent =
                    textarea.value.length;

            }

        }

        textarea.addEventListener(
            "input",
            function () {

                resumeData.summary =
                    textarea.value
                        .trim();

                saveData();

                updateCount();
                updatePreview();
                updateCompletion();

            }
        );

        updateCount();

    }


    /* =====================================================
       NAVIGATION
    ===================================================== */

    function showSection(
        sectionName
    ) {

        if (
            !steps.includes(sectionName)
        ) {

            return;

        }

        currentSection =
            sectionName;


        $$(".builder-section")
            .forEach(
                function (section) {

                    section.classList.toggle(
                        "active",
                        section.dataset.section ===
                        sectionName
                    );

                }
            );


        $$(".builder-step")
            .forEach(
                function (step) {

                    const name =
                        step.dataset.section;

                    step.classList.toggle(
                        "active",
                        name === sectionName
                    );

                    const currentIndex =
                        steps.indexOf(
                            sectionName
                        );

                    const stepIndex =
                        steps.indexOf(name);

                    step.classList.toggle(
                        "completed",
                        stepIndex <
                        currentIndex
                    );

                    step.classList.toggle(
                        "locked",
                        stepIndex >
                        currentIndex
                    );

                }
            );


        const editor =
            $(".builder-editor");

        if (editor) {

            editor.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }

    }


    function setupNavigation() {

        $$(".continue-section-btn")
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            const next =
                                button.dataset.next;

                            if (!next) return;

                            const currentIndex =
                                steps.indexOf(
                                    currentSection
                                );

                            const nextIndex =
                                steps.indexOf(next);

                            if (
                                nextIndex >
                                currentIndex
                            ) {

                                if (
                                    !validateSection(
                                        currentSection
                                    )
                                ) {

                                    showToast(
                                        "Please complete the required fields."
                                    );

                                    return;

                                }

                            }

                            showSection(next);

                        }
                    );

                }
            );


        $$(".back-section-btn")
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            const back =
                                button.dataset.back;

                            if (back) {

                                showSection(back);

                            }

                        }
                    );

                }
            );


        $$(".builder-step")
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            const section =
                                button.dataset.section;

                            const targetIndex =
                                steps.indexOf(section);

                            const currentIndex =
                                steps.indexOf(
                                    currentSection
                                );

                            if (
                                targetIndex >
                                currentIndex
                            ) {

                                if (
                                    !validateSection(
                                        currentSection
                                    )
                                ) {

                                    showToast(
                                        "Complete this step before continuing."
                                    );

                                    return;

                                }

                            }

                            showSection(section);

                        }
                    );

                }
            );


        const backTemplates =
            $("#backToTemplates");

        if (backTemplates) {

            backTemplates.addEventListener(
                "click",
                function () {

                    window.location.href =
                        "templates.html";

                }
            );

        }

    }


    /* =====================================================
       VALIDATION
    ===================================================== */

    function clearErrors() {

        $$(".field-error")
            .forEach(
                function (error) {

                    error.textContent = "";

                }
            );

        $$(".input-error")
            .forEach(
                function (input) {

                    input.classList.remove(
                        "input-error"
                    );

                }
            );

    }


    function showFieldError(
        input,
        message
    ) {

        if (!input) return;

        input.classList.add(
            "input-error"
        );

        const group =
            input.closest(".form-group");

        if (!group) return;

        const error =
            $(".field-error", group);

        if (error) {

            error.textContent =
                message;

        }

    }


    function validateSection(
        sectionName
    ) {

        clearErrors();


        if (
            sectionName === "heading"
        ) {

            const required = [
                "firstName",
                "lastName",
                "professionalTitle",
                "city",
                "country",
                "pinCode",
                "phone",
                "email"
            ];

            let valid = true;

            required.forEach(
                function (field) {

                    const input =
                        $("#" + field);

                    if (
                        !input ||
                        !input.value.trim()
                    ) {

                        showFieldError(
                            input,
                            "This field is required."
                        );

                        valid = false;

                    }

                }
            );


            const email =
                $("#email");

            if (
                email &&
                email.value.trim() &&
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
                    .test(email.value.trim())
            ) {

                showFieldError(
                    email,
                    "Enter a valid email address."
                );

                valid = false;

            }


            const pin =
                $("#pinCode");

            if (
                pin &&
                pin.value.trim() &&
                !/^\d{6}$/.test(
                    pin.value.trim()
                )
            ) {

                showFieldError(
                    pin,
                    "Enter a valid 6-digit PIN code."
                );

                valid = false;

            }

            return valid;

        }


        if (
            sectionName === "experience"
        ) {

            let valid = true;

            resumeData.experience.forEach(
                function (item, index) {

                    if (!item.jobTitle.trim()) {
                        valid = false;
                    }

                    if (!item.company.trim()) {
                        valid = false;
                    }

                    if (!item.startDate) {
                        valid = false;
                    }

                }
            );

            if (!valid) {

                showToast(
                    "Please complete your work experience."
                );

            }

            return valid;

        }


        if (
            sectionName === "education"
        ) {

            let valid = true;

            resumeData.education.forEach(
                function (item) {

                    if (!item.level) {
                        valid = false;
                    }

                    if (!item.school.trim()) {
                        valid = false;
                    }

                    if (!item.degree) {
                        valid = false;
                    }

                    if (!item.startDate) {
                        valid = false;
                    }

                }
            );

            if (!valid) {

                showToast(
                    "Please complete your education details."
                );

            }

            return valid;

        }


        if (
            sectionName === "skills"
        ) {

            if (
                resumeData.skills.length === 0
            ) {

                showToast(
                    "Add at least one skill."
                );

                return false;

            }

        }


        if (
            sectionName === "summary"
        ) {

            if (
                !resumeData.summary.trim()
            ) {

                showToast(
                    "Please add your professional summary."
                );

                return false;

            }

        }


        return true;

    }


    /* =====================================================
       PREVIEW
    ===================================================== */

    function updatePreview() {

        const personal =
            resumeData.personal;


        const name =
            [personal.firstName, personal.lastName]
                .filter(Boolean)
                .join(" ");

        const previewName =
            $("#previewName");

        const previewTitle =
            $("#previewTitle");

        const previewEmail =
            $("#previewEmail");

        const previewPhone =
            $("#previewPhone");

        const previewLocation =
            $("#previewLocation");

        const previewSummary =
            $("#previewSummary");


        if (previewName) {

            previewName.textContent =
                name || "Your Name";

        }

        if (previewTitle) {

            previewTitle.textContent =
                personal.professionalTitle ||
                "Professional Title";

        }

        if (previewEmail) {

            previewEmail.textContent =
                personal.email ||
                "email@example.com";

        }

        if (previewPhone) {

            previewPhone.textContent =
                personal.phone ||
                "Phone";

        }


        if (previewLocation) {

            const location =
                [
                    personal.city,
                    personal.country,
                    personal.pinCode
                ]
                    .filter(Boolean)
                    .join(", ");

            previewLocation.textContent =
                location || "Location";

        }


        if (previewSummary) {

            previewSummary.textContent =
                resumeData.summary ||
                "Your professional summary will appear here.";

        }


        updatePreviewLinks();
        updateExperiencePreview();
        updateEducationPreview();
        updateSkillsPreview();
        updatePhotoPreview();

    }


    function updatePreviewLinks() {

        const container =
            $("#previewLinks");

        if (!container) return;

        container.innerHTML = "";

        const links = [
            {
                value:
                    resumeData.personal.linkedin,
                label:
                    "LinkedIn"
            },
            {
                value:
                    resumeData.personal.website,
                label:
                    "Website"
            }
        ];


        links.forEach(
            function (link) {

                if (!link.value) return;

                const span =
                    document.createElement("span");

                span.textContent =
                    link.label;

                container.appendChild(
                    span
                );

            }
        );

    }


    function formatMonth(value) {

        if (!value) return "";

        const date =
            new Date(
                value + "-01T00:00:00"
            );

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return value;

        }

        return date.toLocaleDateString(
            "en-US",
            {
                month: "short",
                year: "numeric"
            }
        );

    }


    function updateExperiencePreview() {

        const container =
            $("#previewExperience");

        if (!container) return;

        if (
            resumeData.experience.length === 0
        ) {

            container.innerHTML = `
                <p class="preview-placeholder">
                    Your professional experience will appear here.
                </p>
            `;

            return;

        }


        container.innerHTML =
            resumeData.experience
                .map(
                    function (item) {

                        const start =
                            formatMonth(
                                item.startDate
                            );

                        const end =
                            item.currentlyWorking
                                ? "Present"
                                : formatMonth(
                                    item.endDate
                                );

                        const dates =
                            [start, end]
                                .filter(Boolean)
                                .join(" – ");


                        return `
                            <article class="preview-entry">

                                <div class="preview-entry-heading">

                                    <div>

                                        <h4>
                                            ${escapeHTML(
                                                item.jobTitle ||
                                                "Job Title"
                                            )}
                                        </h4>

                                        <strong>
                                            ${escapeHTML(
                                                item.company ||
                                                "Company"
                                            )}
                                        </strong>

                                    </div>

                                    <span>
                                        ${escapeHTML(
                                            dates
                                        )}
                                    </span>

                                </div>

                                ${
                                    item.location
                                        ? `
                                            <div class="preview-location">
                                                ${escapeHTML(
                                                    item.location
                                                )}
                                            </div>
                                          `
                                        : ""
                                }

                                ${
                                    item.description
                                        ? `
                                            <p>
                                                ${escapeHTML(
                                                    item.description
                                                ).replace(
                                                    /\n/g,
                                                    "<br>"
                                                )}
                                            </p>
                                          `
                                        : ""
                                }

                            </article>
                        `;

                    }
                )
                .join("");

    }


    function updateEducationPreview() {

        const container =
            $("#previewEducation");

        if (!container) return;

        if (
            resumeData.education.length === 0
        ) {

            container.innerHTML = `
                <p class="preview-placeholder">
                    Your education details will appear here.
                </p>
            `;

            return;

        }


        container.innerHTML =
            resumeData.education
                .map(
                    function (item) {

                        const start =
                            formatMonth(
                                item.startDate
                            );

                        const end =
                            item.currentlyStudying
                                ? "Present"
                                : formatMonth(
                                    item.endDate
                                );

                        const dates =
                            [start, end]
                                .filter(Boolean)
                                .join(" – ");


                        let result = "";

                        if (
                            item.marksType ===
                            "percentage" &&
                            item.percentage
                        ) {

                            result =
                                `${item.percentage}%`;

                        }

                        if (
                            item.marksType ===
                            "cgpa" &&
                            item.cgpa
                        ) {

                            result =
                                `CGPA ${item.cgpa}`;

                        }


                        return `
                            <article class="preview-entry">

                                <div class="preview-entry-heading">

                                    <div>

                                        <h4>
                                            ${escapeHTML(
                                                item.degree ||
                                                "Qualification"
                                            )}
                                        </h4>

                                        <strong>
                                            ${escapeHTML(
                                                item.school ||
                                                "Institution"
                                            )}
                                        </strong>

                                    </div>

                                    <span>
                                        ${escapeHTML(
                                            dates
                                        )}
                                    </span>

                                </div>

                                ${
                                    item.field
                                        ? `
                                            <div class="preview-location">
                                                ${escapeHTML(
                                                    item.field
                                                )}
                                            </div>
                                          `
                                        : ""
                                }

                                ${
                                    result
                                        ? `
                                            <div class="preview-result">
                                                ${escapeHTML(
                                                    result
                                                )}
                                            </div>
                                          `
                                        : ""
                                }

                                ${
                                    item.description
                                        ? `
                                            <p>
                                                ${escapeHTML(
                                                    item.description
                                                ).replace(
                                                    /\n/g,
                                                    "<br>"
                                                )}
                                            </p>
                                          `
                                        : ""
                                }

                            </article>
                        `;

                    }
                )
                .join("");

    }


    function updateSkillsPreview() {

        const container =
            $("#previewSkills");

        if (!container) return;

        if (
            resumeData.skills.length === 0
        ) {

            container.innerHTML = `
                <span class="preview-placeholder">
                    Add your skills
                </span>
            `;

            return;

        }


        container.innerHTML =
            resumeData.skills
                .map(
                    function (skill) {

                        return `
                            <span>
                                ${escapeHTML(skill)}
                            </span>
                        `;

                    }
                )
                .join("");

    }


    /* =====================================================
       COMPLETION
    ===================================================== */

    function updateCompletion() {

        let completed = 0;

        const total = 10;


        if (
            resumeData.personal.firstName
        ) completed++;

        if (
            resumeData.personal.lastName
        ) completed++;

        if (
            resumeData.personal.professionalTitle
        ) completed++;

        if (
            resumeData.personal.email
        ) completed++;

        if (
            resumeData.personal.phone
        ) completed++;

        if (
            resumeData.personal.city
        ) completed++;

        if (
            resumeData.experience.length > 0 &&
            resumeData.experience.some(
                item =>
                    item.jobTitle &&
                    item.company &&
                    item.startDate
            )
        ) completed++;

        if (
            resumeData.education.length > 0 &&
            resumeData.education.some(
                item =>
                    item.school &&
                    item.degree &&
                    item.startDate
            )
        ) completed++;

        if (
            resumeData.skills.length > 0
        ) completed++;

        if (
            resumeData.summary
        ) completed++;


        const percentage =
            Math.round(
                completed / total * 100
            );


        const text =
            $("#completionPercent");

        const bar =
            $("#progressBar");


        if (text) {

            text.textContent =
                percentage + "%";

        }

        if (bar) {

            bar.style.width =
                percentage + "%";

        }

    }


    /* =====================================================
       DOWNLOAD / PRINT
    ===================================================== */

    function setupDownload() {

        const button =
            $("#downloadResumeButton");

        if (!button) return;

        button.addEventListener(
            "click",
            function () {

                if (
                    !validateSection("heading")
                ) {

                    showSection("heading");

                    showToast(
                        "Complete your contact details first."
                    );

                    return;

                }

                window.print();

            }
        );

    }


    /* =====================================================
       TOAST
    ===================================================== */

    let toastTimer = null;

    function showToast(message) {

        const toast =
            $("#toast");

        if (!toast) return;

        toast.textContent =
            message;

        toast.classList.add(
            "show"
        );

        clearTimeout(
            toastTimer
        );

        toastTimer =
            setTimeout(
                function () {

                    toast.classList.remove(
                        "show"
                    );

                },
                2600
            );

    }


    /* =====================================================
       INPUT CLEANUP
    ===================================================== */

    function setupInputHelpers() {

        const pin =
            $("#pinCode");

        if (pin) {

            pin.addEventListener(
                "input",
                function () {

                    pin.value =
                        pin.value
                            .replace(
                                /\D/g,
                                ""
                            )
                            .slice(
                                0,
                                6
                            );

                }
            );

        }


        const phone =
            $("#phone");

        if (phone) {

            phone.addEventListener(
                "input",
                function () {

                    phone.value =
                        phone.value
                            .replace(
                                /[^0-9+\-() ]/g,
                                ""
                            )
                            .slice(
                                0,
                                20
                            );

                }
            );

        }

    }


    /* =====================================================
       BEFORE UNLOAD
    ===================================================== */

    window.addEventListener(
        "beforeunload",
        saveData
    );


    /* =====================================================
       START APPLICATION
    ===================================================== */

    loadData();

    initializePersonalForm();

    setupPersonalForm();

    setupOptionalLinks();

    setupPhotoUpload();

    setupExperience();

    setupEducation();

    setupSkills();

    setupSummary();

    setupNavigation();

    setupDownload();

    setupInputHelpers();

    updatePreview();

    updateCompletion();

    showSection("heading");

});
