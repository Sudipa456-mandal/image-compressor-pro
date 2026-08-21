/* =========================================================
   ResumeCraft Builder
   Main Builder Logic
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    "use strict";


    /* =====================================================
       STORAGE
    ===================================================== */

    const STORAGE_KEY = "resumeCraftData";


    /* =====================================================
       DEFAULT DATA
    ===================================================== */

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
                company: "",
                location: "",
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

        template: "minimal"
    };


    let resumeData = loadData();


    /* =====================================================
       HELPERS
    ===================================================== */

    function $(selector) {
        return document.querySelector(selector);
    }


    function $$(selector) {
        return document.querySelectorAll(selector);
    }


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


    function loadData() {

        try {

            const saved = localStorage.getItem(STORAGE_KEY);

            if (!saved) {
                return structuredClone(defaultData);
            }

            const parsed = JSON.parse(saved);

            return {
                ...structuredClone(defaultData),
                ...parsed,
                personal: {
                    ...defaultData.personal,
                    ...(parsed.personal || {})
                },
                experience:
                    Array.isArray(parsed.experience) && parsed.experience.length
                        ? parsed.experience
                        : structuredClone(defaultData.experience),

                education:
                    Array.isArray(parsed.education) && parsed.education.length
                        ? parsed.education
                        : structuredClone(defaultData.education),

                skills:
                    Array.isArray(parsed.skills)
                        ? parsed.skills
                        : [],

                summary: parsed.summary || ""
            };

        } catch (error) {

            console.error("Unable to load saved resume:", error);

            return structuredClone(defaultData);
        }
    }


    function saveData() {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(resumeData)
            );

        } catch (error) {

            console.error("Unable to save resume:", error);
        }
    }


    function showToast(message) {

        const toast = $("#toast");

        if (!toast) {
            return;
        }

        toast.textContent = message;

        toast.classList.add("show");

        clearTimeout(showToast.timer);

        showToast.timer = setTimeout(function () {

            toast.classList.remove("show");

        }, 2200);
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


    let currentSection = "heading";


    function showSection(sectionName) {

        if (!sectionOrder.includes(sectionName)) {
            return;
        }

        currentSection = sectionName;


        $$(".builder-section").forEach(function (section) {

            section.classList.toggle(
                "active",
                section.dataset.section === sectionName
            );

        });


        $$(".builder-step").forEach(function (step) {

            const stepSection = step.dataset.section;

            const currentIndex =
                sectionOrder.indexOf(sectionName);

            const stepIndex =
                sectionOrder.indexOf(stepSection);

            step.classList.toggle(
                "active",
                stepSection === sectionName
            );

            step.classList.toggle(
                "completed",
                stepIndex < currentIndex
            );

        });


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }


    /* =====================================================
       STEP BUTTONS
    ===================================================== */

    $$(".builder-step").forEach(function (button) {

        button.addEventListener("click", function () {

            const section = button.dataset.section;

            const targetIndex =
                sectionOrder.indexOf(section);

            const currentIndex =
                sectionOrder.indexOf(currentSection);


            /*
             * Allow previous sections freely.
             * Next sections are validated before opening.
             */

            if (targetIndex <= currentIndex) {

                showSection(section);

                return;
            }


            if (targetIndex === currentIndex + 1) {

                if (validateCurrentSection()) {

                    showSection(section);
                }

                return;
            }


            showToast(
                "Complete the current step first."
            );
        });
    });


    /* =====================================================
       CONTINUE BUTTONS
    ===================================================== */

    $$(".continue-section-btn").forEach(function (button) {

        button.addEventListener("click", function () {

            const nextSection = button.dataset.next;

            if (!nextSection) {
                return;
            }

            if (!validateCurrentSection()) {
                return;
            }

            showSection(nextSection);
        });
    });


    /* =====================================================
       BACK BUTTONS
    ===================================================== */

    $$(".back-section-btn").forEach(function (button) {

        button.addEventListener("click", function () {

            const previousSection =
                button.dataset.back;

            if (previousSection) {
                showSection(previousSection);
            }
        });
    });


    /* =====================================================
       BACK TO TEMPLATES
    ===================================================== */

    const backToTemplates = $("#backToTemplates");

    if (backToTemplates) {

        backToTemplates.addEventListener(
            "click",
            function () {

                const templatesPath =
                    "templates.html";

                window.location.href = templatesPath;
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


    personalFields.forEach(function (fieldId) {

        const input = $("#" + fieldId);

        if (!input) {
            return;
        }

        input.addEventListener("input", function () {

            resumeData.personal[fieldId] =
                input.value.trim();

            saveData();

            updatePreview();
            updateCompletion();
        });
    });


    /* =====================================================
       OPTIONAL LINKS
    ===================================================== */

    $$(".optional-info-button").forEach(function (button) {

        button.addEventListener("click", function () {

            const field = button.dataset.field;

            if (!field) {
                return;
            }

            createOptionalField(field);

            button.style.display = "none";
        });
    });


    function createOptionalField(field) {

        const container =
            $("#optionalFields");

        if (!container) {
            return;
        }

        if (
            container.querySelector(
                `[data-optional-field="${field}"]`
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

        wrapper.className = "form-group";

        wrapper.dataset.optionalField = field;


        wrapper.innerHTML = `
            <label for="optional-${field}">
                ${label}
            </label>

            <input
                type="url"
                id="optional-${field}"
                placeholder="${placeholder}"
                value="${escapeHTML(
                    resumeData.personal[field] || ""
                )}"
            >

            <small class="field-error"></small>
        `;


        container.appendChild(wrapper);


        const input =
            wrapper.querySelector("input");


        input.addEventListener("input", function () {

            resumeData.personal[field] =
                input.value.trim();

            saveData();

            updatePreview();
        });
    }


    /* =====================================================
       PHOTO UPLOAD
    ===================================================== */

    const photoInput = $("#photoInput");

    if (photoInput) {

        photoInput.addEventListener(
            "change",
            function (event) {

                const file =
                    event.target.files[0];

                if (!file) {
                    return;
                }


                if (![
                    "image/jpeg",
                    "image/png"
                ].includes(file.type)) {

                    showToast(
                        "Please upload a JPG or PNG image."
                    );

                    photoInput.value = "";

                    return;
                }


                if (file.size > 2 * 1024 * 1024) {

                    showToast(
                        "Photo must be smaller than 2MB."
                    );

                    photoInput.value = "";

                    return;
                }


                const reader =
                    new FileReader();


                reader.onload = function (e) {

                    resumeData.personal.photo =
                        e.target.result;

                    saveData();

                    updatePhotoPreview();
                    updatePreview();
                };


                reader.readAsDataURL(file);
            }
        );
    }


    function updatePhotoPreview() {

        const photo =
            resumeData.personal.photo;


        const previewImage =
            $("#previewPhoto");

        const previewIcon =
            $("#previewPhotoIcon");

        const resumeImage =
            $("#resumePhoto");

        const resumeIcon =
            $("#resumePhotoIcon");


        if (photo) {

            if (previewImage) {

                previewImage.src = photo;
                previewImage.style.display =
                    "block";
            }

            if (previewIcon) {
                previewIcon.style.display =
                    "none";
            }

            if (resumeImage) {

                resumeImage.src = photo;
                resumeImage.style.display =
                    "block";
            }

            if (resumeIcon) {
                resumeIcon.style.display =
                    "none";
            }

        } else {

            if (previewImage) {
                previewImage.style.display =
                    "none";
            }

            if (previewIcon) {
                previewIcon.style.display =
                    "inline";
            }

            if (resumeImage) {
                resumeImage.style.display =
                    "none";
            }

            if (resumeIcon) {
                resumeIcon.style.display =
                    "inline";
            }
        }
    }


    /* =====================================================
       EXPERIENCE
    ===================================================== */

    const experienceList =
        $("#experienceList");


    function renderExperience() {

        if (!experienceList) {
            return;
        }


        experienceList.innerHTML = "";


        resumeData.experience.forEach(
            function (experience, index) {

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
                            data-index="${index}"
                            style="${
                                resumeData.experience.length === 1
                                    ? "display:none;"
                                    : ""
                            }"
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
                            data-index="${index}"
                            value="${escapeHTML(
                                experience.jobTitle
                            )}"
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
                                data-index="${index}"
                                value="${escapeHTML(
                                    experience.company
                                )}"
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
                                data-index="${index}"
                                value="${escapeHTML(
                                    experience.location
                                )}"
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
                                data-index="${index}"
                                value="${escapeHTML(
                                    experience.startDate
                                )}"
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
                                data-index="${index}"
                                value="${escapeHTML(
                                    experience.endDate
                                )}"
                                ${
                                    experience.currentlyWorking
                                        ? "disabled"
                                        : ""
                                }
                            >

                            <small class="field-error"></small>

                        </div>

                    </div>


                    <div class="form-group checkbox-group">

                        <label>

                            <input
                                type="checkbox"
                                class="currently-working"
                                data-index="${index}"
                                ${
                                    experience.currentlyWorking
                                        ? "checked"
                                        : ""
                                }
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
                            data-index="${index}"
                            rows="5"
                            placeholder="Describe your responsibilities and achievements..."
                        >${escapeHTML(
                            experience.description
                        )}</textarea>

                    </div>
                `;


                experienceList.appendChild(card);
            }
        );


        attachExperienceEvents();

        updatePreview();
    }


    function attachExperienceEvents() {

        $$(".experience-item input, .experience-item textarea")
            .forEach(function (input) {

                input.addEventListener(
                    "input",
                    handleExperienceInput
                );
            });


        $$(".currently-working")
            .forEach(function (checkbox) {

                checkbox.addEventListener(
                    "change",
                    handleCurrentlyWorking
                );
            });


        $$(".remove-entry-btn")
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const index =
                            Number(button.dataset.index);

                        resumeData.experience.splice(
                            index,
                            1
                        );

                        saveData();

                        renderExperience();

                        updateCompletion();
                    }
                );
            });
    }


    function handleExperienceInput(event) {

        const input = event.target;

        const index =
            Number(input.dataset.index);

        if (!resumeData.experience[index]) {
            return;
        }


        if (input.classList.contains(
            "experience-job-title"
        )) {

            resumeData.experience[index].jobTitle =
                input.value.trim();
        }


        if (input.classList.contains(
            "experience-company"
        )) {

            resumeData.experience[index].company =
                input.value.trim();
        }


        if (input.classList.contains(
            "experience-location"
        )) {

            resumeData.experience[index].location =
                input.value.trim();
        }


        if (input.classList.contains(
            "experience-start"
        )) {

            resumeData.experience[index].startDate =
                input.value;
        }


        if (input.classList.contains(
            "experience-end"
        )) {

            resumeData.experience[index].endDate =
                input.value;
        }


        if (input.classList.contains(
            "experience-description"
        )) {

            resumeData.experience[index].description =
                input.value.trim();
        }


        saveData();

        updatePreview();
        updateCompletion();
    }


    function handleCurrentlyWorking(event) {

        const checkbox =
            event.target;

        const index =
            Number(checkbox.dataset.index);


        resumeData.experience[index].currentlyWorking =
            checkbox.checked;


        const endDate =
            document.querySelector(
                `.experience-end[data-index="${index}"]`
            );


        if (endDate) {

            endDate.disabled =
                checkbox.checked;

            if (checkbox.checked) {

                endDate.value = "";

                resumeData.experience[index].endDate =
                    "";
            }
        }


        saveData();

        updatePreview();
    }


    const addExperienceButton =
        $("#addExperienceButton");


    if (addExperienceButton) {

        addExperienceButton.addEventListener(
            "click",
            function () {

                resumeData.experience.push({

                    jobTitle: "",
                    company: "",
                    location: "",
                    startDate: "",
                    endDate: "",
                    currentlyWorking: false,
                    description: ""
                });


                saveData();

                renderExperience();

                showToast(
                    "New experience added."
                );
            }
        );
    }


    /* =====================================================
       EDUCATION
    ===================================================== */

    const educationEntries =
        $("#educationEntries");


    function renderEducation() {

        if (!educationEntries) {
            return;
        }


        educationEntries.innerHTML = "";


        resumeData.education.forEach(
            function (education, index) {

                const card =
                    document.createElement("div");

                card.className =
                    "section-card education-card";


                card.innerHTML = `

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
                            resumeData.education.length > 1
                            ? `
                                <button
                                    type="button"
                                    class="remove-entry-btn remove-education"
                                    data-index="${index}"
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

                        <select
                            class="education-level"
                            data-index="${index}"
                        >

                            ${educationOptions(
                                education.level
                            )}

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
                            data-index="${index}"
                            value="${escapeHTML(
                                education.school
                            )}"
                            placeholder="ABC School / XYZ University"
                        >

                        <small class="field-error"></small>

                    </div>


                    <div class="form-group">

                        <label>
                            Degree / Qualification *
                        </label>

                        <select
                            class="degree"
                            data-index="${index}"
                        >

                            ${degreeOptions(
                                education.degree
                            )}

                        </select>

                        <small class="field-error"></small>

                    </div>


                    <div class="form-group">

                        <label>
                            Field of Study
                        </label>

                        <select
                            class="education-field"
                            data-index="${index}"
                        >

                            ${fieldOptions(
                                education.field
                            )}

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
                                data-index="${index}"
                                value="${escapeHTML(
                                    education.startDate
                                )}"
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
                                data-index="${index}"
                                value="${escapeHTML(
                                    education.endDate
                                )}"
                                ${
                                    education.currentlyStudying
                                        ? "disabled"
                                        : ""
                                }
                            >

                        </div>

                    </div>


                    <div class="form-group checkbox-group">

                        <label>

                            <input
                                type="checkbox"
                                class="currently-studying"
                                data-index="${index}"
                                ${
                                    education.currentlyStudying
                                        ? "checked"
                                        : ""
                                }
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
                                    data-index="${index}"
                                    value="percentage"
                                    ${
                                        education.marksType ===
                                        "percentage"
                                            ? "checked"
                                            : ""
                                    }
                                >

                                Percentage

                            </label>


                            <label>

                                <input
                                    type="radio"
                                    class="marks-type"
                                    name="marksType-${index}"
                                    data-index="${index}"
                                    value="cgpa"
                                    ${
                                        education.marksType ===
                                        "cgpa"
                                            ? "checked"
                                            : ""
                                    }
                                >

                                CGPA

                            </label>

                        </div>

                    </div>


                    <div
                        class="form-group percentage-field"
                        style="${
                            education.marksType === "percentage"
                                ? ""
                                : "display:none;"
                        }"
                    >

                        <label>
                            Percentage
                        </label>

                        <input
                            type="number"
                            class="percentage-input"
                            data-index="${index}"
                            min="0"
                            max="100"
                            step="0.01"
                            value="${escapeHTML(
                                education.percentage
                            )}"
                            placeholder="85.50"
                        >

                        <small class="field-error"></small>

                    </div>


                    <div
                        class="form-group cgpa-field"
                        style="${
                            education.marksType === "cgpa"
                                ? ""
                                : "display:none;"
                        }"
                    >

                        <label>
                            CGPA
                        </label>

                        <input
                            type="number"
                            class="cgpa-input"
                            data-index="${index}"
                            min="0"
                            max="10"
                            step="0.01"
                            value="${escapeHTML(
                                education.cgpa
                            )}"
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
                            data-index="${index}"
                            rows="4"
                            placeholder="Achievements, coursework, activities, awards..."
                        >${escapeHTML(
                            education.description
                        )}</textarea>

                    </div>
                `;


                educationEntries.appendChild(card);
            }
        );


        attachEducationEvents();

        updatePreview();
    }


    function educationOptions(selected) {

        const options = [

            ["", "Select education level"],
            ["10th", "10th / Secondary"],
            ["12th", "12th / Higher Secondary"],
            ["diploma", "Diploma"],
            ["certificate", "Certificate Course"],
            ["bachelor", "Bachelor's Degree"],
            ["master", "Master's Degree"],
            ["phd", "PhD / Doctorate"],
            ["other", "Other"]
        ];


        return options.map(function (item) {

            return `
                <option
                    value="${item[0]}"
                    ${
                        selected === item[0]
                            ? "selected"
                            : ""
                    }
                >
                    ${item[1]}
                </option>
            `;

        }).join("");
    }


    function degreeOptions(selected) {

        const options = [

            "",
            "Secondary School Certificate",
            "Higher Secondary Certificate",
            "Diploma",
            "B.A.",
            "B.Sc.",
            "B.Com.",
            "B.Tech",
            "B.E.",
            "BBA",
            "BCA",
            "M.A.",
            "M.Sc.",
            "M.Com.",
            "M.Tech",
            "MBA",
            "MCA",
            "PhD",
            "Other"
        ];


        return options.map(function (value) {

            return `
                <option
                    value="${escapeHTML(value)}"
                    ${
                        selected === value
                            ? "selected"
                            : ""
                    }
                >
                    ${
                        value ||
                        "Select qualification"
                    }
                </option>
            `;

        }).join("");
    }


    function fieldOptions(selected) {

        const options = [

            "",
            "Science",
            "Commerce",
            "Arts",
            "Computer Science",
            "Information Technology",
            "Engineering",
            "Business Administration",
            "Accounting",
            "Economics",
            "Mathematics",
            "Physics",
            "Chemistry",
            "Biology",
            "English",
            "Other"
        ];


        return options.map(function (value) {

            return `
                <option
                    value="${escapeHTML(value)}"
                    ${
                        selected === value
                            ? "selected"
                            : ""
                    }
                >
                    ${
                        value ||
                        "Select field of study"
                    }
                </option>
            `;

        }).join("");
    }


    function attachEducationEvents() {

        $$(".education-card input, .education-card select, .education-card textarea")
            .forEach(function (input) {

                input.addEventListener(
                    "input",
                    handleEducationInput
                );

                input.addEventListener(
                    "change",
                    handleEducationInput
                );
            });


        $$(".currently-studying")
            .forEach(function (checkbox) {

                checkbox.addEventListener(
                    "change",
                    handleCurrentlyStudying
                );
            });


        $$(".marks-type")
            .forEach(function (radio) {

                radio.addEventListener(
                    "change",
                    handleMarksType
                );
            });


        $$(".remove-education")
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const index =
                            Number(button.dataset.index);

                        resumeData.education.splice(
                            index,
                            1
                        );

                        saveData();

                        renderEducation();

                        updateCompletion();
                    }
                );
            });
    }


    function handleEducationInput(event) {

        const input =
            event.target;

        const index =
            Number(input.dataset.index);

        if (!resumeData.education[index]) {
            return;
        }


        if (input.classList.contains(
            "education-level"
        )) {

            resumeData.education[index].level =
                input.value;
        }


        if (input.classList.contains(
            "school-name"
        )) {

            resumeData.education[index].school =
                input.value.trim();
        }


        if (input.classList.contains(
            "degree"
        )) {

            resumeData.education[index].degree =
                input.value;
        }


        if (input.classList.contains(
            "education-field"
        )) {

            resumeData.education[index].field =
                input.value;
        }


        if (input.classList.contains(
            "education-start"
        )) {

            resumeData.education[index].startDate =
                input.value;
        }


        if (input.classList.contains(
            "education-end"
        )) {

            resumeData.education[index].endDate =
                input.value;
        }


        if (input.classList.contains(
            "percentage-input"
        )) {

            resumeData.education[index].percentage =
                input.value;
        }


        if (input.classList.contains(
            "cgpa-input"
        )) {

            resumeData.education[index].cgpa =
                input.value;
        }


        if (input.classList.contains(
            "education-description"
        )) {

            resumeData.education[index].description =
                input.value.trim();
        }


        saveData();

        updatePreview();
        updateCompletion();
    }


    function handleCurrentlyStudying(event) {

        const checkbox =
            event.target;

        const index =
            Number(checkbox.dataset.index);


        resumeData.education[index].currentlyStudying =
            checkbox.checked;


        const endDate =
            document.querySelector(
                `.education-end[data-index="${index}"]`
            );


        if (endDate) {

            endDate.disabled =
                checkbox.checked;

            if (checkbox.checked) {

                endDate.value = "";

                resumeData.education[index].endDate =
                    "";
            }
        }


        saveData();

        updatePreview();
    }


    function handleMarksType(event) {

        const radio =
            event.target;

        const index =
            Number(radio.dataset.index);


        resumeData.education[index].marksType =
            radio.value;


        saveData();

        renderEducation();

        updatePreview();
    }


    const addEducationButton =
        $("#addEducationButton");


    if (addEducationButton) {

        addEducationButton.addEventListener(
            "click",
            function () {

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


                saveData();

                renderEducation();

                showToast(
                    "New education added."
                );
            }
        );
    }


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
            function (skill, index) {

                const tag =
                    document.createElement("div");

                tag.className =
                    "skill-tag";


                tag.innerHTML = `

                    <span>
                        ${escapeHTML(skill)}
                    </span>

                    <button
                        type="button"
                        class="skill-remove"
                        data-index="${index}"
                        aria-label="Remove skill"
                    >
                        ×
                    </button>
                `;


                skillsList.appendChild(tag);
            }
        );


        $$(".skill-remove")
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const index =
                            Number(button.dataset.index);

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
            });
    }


    function addSkill() {

        if (!skillInput) {
            return;
        }


        const value =
            skillInput.value.trim();


        if (!value) {

            showToast(
                "Enter a skill first."
            );

            skillInput.focus();

            return;
        }


        if (
            resumeData.skills
                .some(function (skill) {

                    return skill.toLowerCase() ===
                        value.toLowerCase();

                })
        ) {

            showToast(
                "This skill is already added."
            );

            return;
        }


        resumeData.skills.push(value);

        skillInput.value = "";

        saveData();

        renderSkills();

        updatePreview();
        updateCompletion();

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
            function (event) {

                if (event.key === "Enter") {

                    event.preventDefault();

                    addSkill();
                }
            }
        );
    }


    /* =====================================================
       SUMMARY
    ===================================================== */

    const professionalSummary =
        $("#professionalSummary");


    if (professionalSummary) {

        professionalSummary.addEventListener(
            "input",
            function () {

                let value =
                    professionalSummary.value;


                if (value.length > 500) {

                    value =
                        value.substring(0, 500);

                    professionalSummary.value =
                        value;
                }


                resumeData.summary =
                    value;


                updateSummaryCount();

                saveData();

                updatePreview();

                updateCompletion();
            }
        );
    }


    function updateSummaryCount() {

        const counter =
            $("#summaryCount");

        if (!counter) {
            return;
        }


        counter.textContent =
            resumeData.summary.length;
    }


    /* =====================================================
       VALIDATION
    ===================================================== */

    function clearErrors() {

        $$(".field-error")
            .forEach(function (error) {

                error.textContent = "";

            });


        $$(".form-group.invalid")
            .forEach(function (group) {

                group.classList.remove(
                    "invalid"
                );

            });
    }


    function setError(input, message) {

        if (!input) {
            return false;
        }


        const group =
            input.closest(".form-group");

        if (group) {

            group.classList.add(
                "invalid"
            );


            const error =
                group.querySelector(
                    ".field-error"
                );


            if (error) {
                error.textContent =
                    message;
            }
        }


        return false;
    }


    function validateCurrentSection() {

        clearErrors();


        if (currentSection === "heading") {

            return validateHeading();
        }


        if (currentSection === "experience") {

            return validateExperience();
        }


        if (currentSection === "education") {

            return validateEducation();
        }


        return true;
    }


    function validateHeading() {

        let valid = true;


        const requiredFields = [

            [
                "firstName",
                "First name is required."
            ],

            [
                "lastName",
                "Surname is required."
            ],

            [
                "professionalTitle",
                "Professional title is required."
            ],

            [
                "city",
                "City is required."
            ],

            [
                "country",
                "Country is required."
            ],

            [
                "pinCode",
                "Pin code is required."
            ],

            [
                "phone",
                "Phone number is required."
            ],

            [
                "email",
                "Email address is required."
            ]
        ];


        requiredFields.forEach(function (item) {

            const input =
                $("#" + item[0]);


            if (!input || !input.value.trim()) {

                setError(
                    input,
                    item[1]
                );

                valid = false;
            }
        });


        const email =
            $("#email");


        if (
            email &&
            email.value.trim() &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
                .test(email.value.trim())
        ) {

            setError(
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

            setError(
                pin,
                "Enter a valid 6-digit pin code."
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


    function validateExperience() {

        let valid = true;


        resumeData.experience.forEach(
            function (experience, index) {

                const card =
                    document.querySelectorAll(
                        ".experience-item"
                    )[index];


                if (!experience.jobTitle) {

                    const input =
                        card?.querySelector(
                            ".experience-job-title"
                        );

                    setError(
                        input,
                        "Job title is required."
                    );

                    valid = false;
                }


                if (!experience.company) {

                    const input =
                        card?.querySelector(
                            ".experience-company"
                        );

                    setError(
                        input,
                        "Company name is required."
                    );

                    valid = false;
                }


                if (!experience.startDate) {

                    const input =
                        card?.querySelector(
                            ".experience-start"
                        );

                    setError(
                        input,
                        "Start date is required."
                    );

                    valid = false;
                }


                if (
                    !experience.currentlyWorking &&
                    experience.endDate &&
                    experience.startDate &&
                    experience.endDate <
                    experience.startDate
                ) {

                    const input =
                        card?.querySelector(
                            ".experience-end"
                        );

                    setError(
                        input,
                        "End date cannot be before start date."
                    );

                    valid = false;
                }
            }
        );


        if (!valid) {

            showToast(
                "Please complete your experience details."
            );
        }


        return valid;
    }


    function validateEducation() {

        let valid = true;


        resumeData.education.forEach(
            function (education, index) {

                const card =
                    document.querySelectorAll(
                        ".education-card"
                    )[index];


                if (!education.level) {

                    const input =
                        card?.querySelector(
                            ".education-level"
                        );

                    setError(
                        input,
                        "Select an education level."
                    );

                    valid = false;
                }


                if (!education.school) {

                    const input =
                        card?.querySelector(
                            ".school-name"
                        );

                    setError(
                        input,
                        "School or institution is required."
                    );

                    valid = false;
                }


                if (!education.degree) {

                    const input =
                        card?.querySelector(
                            ".degree"
                        );

                    setError(
                        input,
                        "Select a qualification."
                    );

                    valid = false;
                }


                if (!education.startDate) {

                    const input =
                        card?.querySelector(
                            ".education-start"
                        );

                    setError(
                        input,
                        "Start date is required."
                    );

                    valid = false;
                }


                if (
                    !education.currentlyStudying &&
                    education.endDate &&
                    education.startDate &&
                    education.endDate <
                    education.startDate
                ) {

                    const input =
                        card?.querySelector(
                            ".education-end"
                        );

                    setError(
                        input,
                        "End date cannot be before start date."
                    );

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


    /* =====================================================
       COMPLETENESS
    ===================================================== */

    function updateCompletion() {

        let completed = 0;
        let total = 8;


        const personal =
            resumeData.personal;


        const personalChecks = [

            personal.firstName,
            personal.lastName,
            personal.professionalTitle,
            personal.city,
            personal.country,
            personal.pinCode,
            personal.phone,
            personal.email
        ];


        completed += personalChecks.filter(
            Boolean
        ).length;


        const experienceComplete =
            resumeData.experience.some(
                function (item) {

                    return (
                        item.jobTitle &&
                        item.company &&
                        item.startDate
                    );
                }
            );


        if (experienceComplete) {
            completed += 1;
        }


        total += 1;


        const educationComplete =
            resumeData.education.some(
                function (item) {

                    return (
                        item.school &&
                        item.degree &&
                        item.startDate
                    );
                }
            );


        if (educationComplete) {
            completed += 1;
        }


        total += 1;


        if (resumeData.skills.length > 0) {
            completed += 1;
        }


        total += 1;


        if (
            resumeData.summary &&
            resumeData.summary.length >= 20
        ) {
            completed += 1;
        }


        total += 1;


        const percentage =
            Math.round(
                (completed / total) * 100
            );


        const percentElement =
            $("#completionPercent");

        const progressBar =
            $("#progressBar");


        if (percentElement) {

            percentElement.textContent =
                percentage + "%";
        }


        if (progressBar) {

            progressBar.style.width =
                percentage + "%";
        }
    }


    /* =====================================================
       PREVIEW
    ===================================================== */

    function updatePreview() {

        updatePersonalPreview();

        updateExperiencePreview();

        updateEducationPreview();

        updateSkillsPreview();

        updateSummaryPreview();

        updatePhotoPreview();
    }


    function updatePersonalPreview() {

        const personal =
            resumeData.personal;


        const name =
            [
                personal.firstName,
                personal.lastName
            ]
                .filter(Boolean)
                .join(" ");


        setText(
            "#previewName",
            name || "Your Name"
        );


        setText(
            "#previewTitle",
            personal.professionalTitle ||
            "Professional Title"
        );


        setText(
            "#previewEmail",
            personal.email ||
            "email@example.com"
        );


        setText(
            "#previewPhone",
            personal.phone ||
            "Phone"
        );


        const location =
            [
                personal.city,
                personal.country,
                personal.pinCode
            ]
                .filter(Boolean)
                .join(", ");


        setText(
            "#previewLocation",
            location || "Location"
        );


        updatePreviewLinks();
    }


    function setText(selector, value) {

        const element =
            $(selector);

        if (element) {
            element.textContent = value;
        }
    }


    function updatePreviewLinks() {

        const container =
            $("#previewLinks");


        if (!container) {
            return;
        }


        container.innerHTML = "";


        if (resumeData.personal.linkedin) {

            const link =
                document.createElement("a");

            link.href =
                normalizeURL(
                    resumeData.personal.linkedin
                );

            link.target = "_blank";
            link.rel = "noopener noreferrer";

            link.textContent =
                "LinkedIn";

            container.appendChild(link);
        }


        if (resumeData.personal.website) {

            const link =
                document.createElement("a");

            link.href =
                normalizeURL(
                    resumeData.personal.website
                );

            link.target = "_blank";
            link.rel = "noopener noreferrer";

            link.textContent =
                "Website";

            container.appendChild(link);
        }
    }


    function normalizeURL(value) {

        if (!value) {
            return "#";
        }


        if (
            value.startsWith("http://") ||
            value.startsWith("https://")
        ) {
            return value;
        }


        return "https://" + value;
    }


    /* =====================================================
       EXPERIENCE PREVIEW
    ===================================================== */

    function updateExperiencePreview() {

        const container =
            $("#previewExperience");


        if (!container) {
            return;
        }


        const entries =
            resumeData.experience.filter(
                function (item) {

                    return (
                        item.jobTitle ||
                        item.company ||
                        item.description
                    );
                }
            );


        if (!entries.length) {

            container.innerHTML = `
                <p>
                    Your professional experience
                    will appear here.
                </p>
            `;

            return;
        }


        container.innerHTML =
            entries.map(
                function (item) {

                    const dates =
                        formatMonth(item.startDate) +
                        (
                            item.currentlyWorking
                                ? " – Present"
                                : item.endDate
                                    ? " – " +
                                      formatMonth(
                                          item.endDate
                                      )
                                    : ""
                        );


                    return `
                        <div class="preview-experience-item">

                            <h4>
                                ${escapeHTML(
                                    item.jobTitle ||
                                    "Job Title"
                                )}
                            </h4>

                            <div class="preview-experience-meta">

                                ${escapeHTML(
                                    item.company || ""
                                )}

                                ${
                                    item.location
                                        ? " · " +
                                          escapeHTML(
                                              item.location
                                          )
                                        : ""
                                }

                                ${
                                    dates
                                        ? " · " +
                                          escapeHTML(
                                              dates
                                          )
                                        : ""
                                }

                            </div>

                            ${
                                item.description
                                    ? `
                                        <div class="preview-experience-description">
                                            ${escapeHTML(
                                                item.description
                                            )}
                                        </div>
                                    `
                                    : ""
                            }

                        </div>
                    `;
                }
            )
            .join("");
    }


    /* =====================================================
       EDUCATION PREVIEW
    ===================================================== */

    function updateEducationPreview() {

        const container =
            $("#previewEducation");


        if (!container) {
            return;
        }


        const entries =
            resumeData.education.filter(
                function (item) {

                    return (
                        item.school ||
                        item.degree
                    );
                }
            );


        if (!entries.length) {

            container.innerHTML = `
                <p>
                    Your education details
                    will appear here.
                </p>
            `;

            return;
        }


        container.innerHTML =
            entries.map(
                function (item) {

                    const dates =
                        formatMonth(item.startDate) +
                        (
                            item.currentlyStudying
                                ? " – Present"
                                : item.endDate
                                    ? " – " +
                                      formatMonth(
                                          item.endDate
                                      )
                                    : ""
                        );


                    let result = "";


                    if (
                        item.marksType ===
                        "percentage" &&
                        item.percentage
                    ) {

                        result =
                            item.percentage +
                            "%";
                    }


                    if (
                        item.marksType ===
                        "cgpa" &&
                        item.cgpa
                    ) {

                        result =
                            "CGPA " +
                            item.cgpa;
                    }


                    return `
                        <div class="preview-education-item">

                            <h4>

                                ${escapeHTML(
                                    item.degree ||
                                    item.level ||
                                    "Education"
                                )}

                            </h4>


                            <div class="preview-education-meta">

                                ${escapeHTML(
                                    item.school || ""
                                )}

                                ${
                                    item.field
                                        ? " · " +
                                          escapeHTML(
                                              item.field
                                          )
                                        : ""
                                }

                                ${
                                    dates
                                        ? " · " +
                                          escapeHTML(
                                              dates
                                          )
                                        : ""
                                }

                                ${
                                    result
                                        ? " · " +
                                          escapeHTML(
                                              result
                                          )
                                        : ""
                                }

                            </div>


                            ${
                                item.description
                                    ? `
                                        <div class="preview-education-description">
                                            ${escapeHTML(
                                                item.description
                                            )}
                                        </div>
                                    `
                                    : ""
                            }

                        </div>
                    `;
                }
            )
            .join("");
    }


    /* =====================================================
       SKILLS PREVIEW
    ===================================================== */

    function updateSkillsPreview() {

        const container =
            $("#previewSkills");


        if (!container) {
            return;
        }


        if (!resumeData.skills.length) {

            container.innerHTML = `
                <span>
                    Add your key skills
                </span>
            `;

            return;
        }


        container.innerHTML =
            resumeData.skills.map(
                function (skill) {

                    return `
                        <span>
                            ${escapeHTML(skill)}
                        </span>
                    `;

                }
            ).join("");
    }


    /* =====================================================
       SUMMARY PREVIEW
    ===================================================== */

    function updateSummaryPreview() {

        const element =
            $("#previewSummary");


        if (!element) {
            return;
        }


        element.textContent =
            resumeData.summary ||
            "Your professional summary will appear here.";
    }


    /* =====================================================
       MONTH FORMAT
    ===================================================== */

    function formatMonth(value) {

        if (!value) {
            return "";
        }


        const parts =
            value.split("-");


        if (parts.length !== 2) {
            return value;
        }


        const year =
            Number(parts[0]);

        const month =
            Number(parts[1]);


        if (!year || !month) {
            return value;
        }


        const date =
            new Date(
                year,
                month - 1
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
       LOAD SAVED DATA INTO FORM
    ===================================================== */

    function populatePersonalFields() {

        personalFields.forEach(
            function (fieldId) {

                const input =
                    $("#" + fieldId);

                if (!input) {
                    return;
                }


                input.value =
                    resumeData.personal[fieldId] || "";
            }
        );


        if (resumeData.personal.linkedin) {
            createOptionalField("linkedin");

            const button =
                document.querySelector(
                    '[data-field="linkedin"]'
                );

            if (button) {
                button.style.display = "none";
            }
        }


        if (resumeData.personal.website) {
            createOptionalField("website");

            const button =
                document.querySelector(
                    '[data-field="website"]'
                );

            if (button) {
                button.style.display = "none";
            }
        }
    }


    /* =====================================================
       DOWNLOAD / PRINT
    ===================================================== */

    const downloadButton =
        $("#downloadResumeButton");


    if (downloadButton) {

        downloadButton.addEventListener(
            "click",
            function () {

                if (!validateAllRequiredFields()) {
                    return;
                }


                saveData();

                showToast(
                    "Preparing your resume..."
                );


                setTimeout(function () {

                    window.print();

                }, 400);
            }
        );
    }


    function validateAllRequiredFields() {

        const originalSection =
            currentSection;


        const checks = [
            "heading",
            "experience",
            "education"
        ];


        for (const section of checks) {

            currentSection =
                section;


            if (!validateCurrentSection()) {

                showSection(section);

                return false;
            }
        }


        currentSection =
            originalSection;


        return true;
    }


    /* =====================================================
       INITIALIZE
    ===================================================== */

    populatePersonalFields();

    renderExperience();

    renderEducation();

    renderSkills();

    updateSummaryCount();

    updatePreview();

    updateCompletion();

    updatePhotoPreview();

    showSection("heading");

});
