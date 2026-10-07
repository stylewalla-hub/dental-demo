
/* =========================================================
   PREMIUM PATIENT REVIEWS
========================================================= */

const reviewsSection =
    document.querySelector(".reviews-section");


if (reviewsSection) {

    const reviewData =
        [...document.querySelectorAll(".reviews-data article")];

    const featured =
        reviewsSection.querySelector(".reviews-featured");

    const featuredText =
        reviewsSection.querySelector(".reviews-featured-text");

    const featuredAvatar =
        reviewsSection.querySelector(".reviews-featured-avatar img");

    const featuredName =
        reviewsSection.querySelector(".reviews-featured-person strong");

    const featuredCategory =
        reviewsSection.querySelector(".reviews-featured-person span");

    const featuredCurrent =
        reviewsSection.querySelector(".reviews-current");

    const featuredTotal =
        reviewsSection.querySelector(".reviews-total");

    const progressActive =
        reviewsSection.querySelector(".reviews-progress-active");

    const progressText =
        reviewsSection.querySelector(".reviews-progress-text");

    const previews =
        [...reviewsSection.querySelectorAll(".reviews-preview")];

    const nextButton =
        reviewsSection.querySelector(".reviews-arrow-next");

    const prevButton =
        reviewsSection.querySelector(".reviews-arrow-prev");


    if (
        reviewData.length &&
        featured &&
        featuredText
    ) {

        let currentIndex = 0;

        let autoTimer = null;

        let isAnimating = false;

        const AUTO_DELAY = 5500;

        const ANIMATION_TIME = 720;


        /* =====================================================
           FORMAT NUMBER
        ===================================================== */

        function formatNumber(number) {

            return String(number).padStart(2, "0");

        }


        /* =====================================================
           GET REVIEW DATA
        ===================================================== */

        function getReview(index) {

            const item = reviewData[index];

            return {

                name:
                    item.dataset.name || "",

                category:
                    item.dataset.category || "",

                image:
                    item.dataset.image || "",

                date:
                    item.dataset.date || "",

                text:
                    item.textContent.trim()

            };

        }


        /* =====================================================
           UPDATE FEATURED REVIEW
        ===================================================== */

        function updateFeatured(index, direction = 1) {

            if (isAnimating) return;

            const review =
                getReview(index);


            isAnimating = true;


            /* OUT */

            featured.classList.remove(
                "is-entering"
            );

            featured.classList.add(
                "is-changing"
            );


            setTimeout(() => {

                featuredText.textContent =
                    review.text;


                featuredName.textContent =
                    review.name;


                featuredCategory.textContent =
                    review.category;


                featuredAvatar.src =
                    review.image;


                featuredAvatar.alt =
                    review.name;


                featuredCurrent.textContent =
                    formatNumber(index + 1);


                featuredTotal.textContent =
                    formatNumber(reviewData.length);


                progressText.textContent =
                    `${formatNumber(index + 1)} / ${formatNumber(reviewData.length)}`;


                const percentage =
                    ((index + 1) / reviewData.length) * 100;


                progressActive.style.width =
                    `${percentage}%`;


                /* REMOVE OLD STATE */

                featured.classList.remove(
                    "is-changing"
                );


                /*
                    Force browser reflow.
                    This allows the entrance animation
                    to restart every time.
                */

                void featured.offsetWidth;


                featured.classList.add(
                    "is-entering"
                );


                currentIndex =
                    index;


                updatePreviewCards();


            }, 320);


            setTimeout(() => {

                featured.classList.remove(
                    "is-entering"
                );

                isAnimating = false;

            }, ANIMATION_TIME);

        }


        /* =====================================================
           UPDATE THREE PREVIEW REVIEWS
        ===================================================== */

        function updatePreviewCards() {

            if (!previews.length) return;


            previews.forEach((preview, slot) => {

                const previewIndex =
                    (currentIndex + slot + 1)
                    % reviewData.length;


                const review =
                    getReview(previewIndex);


                preview.dataset.review =
                    previewIndex;


                const text =
                    preview.querySelector("p");


                const name =
                    preview.querySelector(
                        ".reviews-preview-person strong"
                    );


                const category =
                    preview.querySelector(
                        ".reviews-preview-person span"
                    );


                const image =
                    preview.querySelector(
                        ".reviews-preview-person img"
                    );


                if (text)
                    text.textContent =
                        review.text;


                if (name)
                    name.textContent =
                        review.name;


                if (category)
                    category.textContent =
                        review.category;


                if (image) {

                    image.src =
                        review.image;

                    image.alt =
                        review.name;

                }

            });


            updatePreviewActiveState();

        }


        /* =====================================================
           ACTIVE PREVIEW
        ===================================================== */

        function updatePreviewActiveState() {

            previews.forEach(preview => {

                preview.classList.remove(
                    "is-active"
                );

            });

        }


        /* =====================================================
           NEXT
        ===================================================== */

        function nextReview() {

            if (isAnimating) return;


            const nextIndex =
                (currentIndex + 1)
                % reviewData.length;


            updateFeatured(
                nextIndex,
                1
            );

        }


        /* =====================================================
           PREVIOUS
        ===================================================== */

        function previousReview() {

            if (isAnimating) return;


            const previousIndex =
                (currentIndex - 1 + reviewData.length)
                % reviewData.length;


            updateFeatured(
                previousIndex,
                -1
            );

        }


        /* =====================================================
           AUTOPLAY
        ===================================================== */

        function stopAutoPlay() {

            if (autoTimer) {

                clearInterval(
                    autoTimer
                );

                autoTimer = null;

            }

        }


        function startAutoPlay() {

            stopAutoPlay();


            if (reviewData.length <= 1)
                return;


            autoTimer =
                setInterval(
                    nextReview,
                    AUTO_DELAY
                );

        }


        function restartAutoPlay() {

            startAutoPlay();

        }


        /* =====================================================
           ARROWS
        ===================================================== */

        if (nextButton) {

            nextButton.addEventListener(
                "click",
                () => {

                    nextReview();

                    restartAutoPlay();

                }
            );

        }


        if (prevButton) {

            prevButton.addEventListener(
                "click",
                () => {

                    previousReview();

                    restartAutoPlay();

                }
            );

        }


        /* =====================================================
           PREVIEW CLICK
        ===================================================== */

        previews.forEach(preview => {

            preview.addEventListener(
                "click",
                () => {

                    const index =
                        Number(
                            preview.dataset.review
                        );


                    if (
                        Number.isNaN(index) ||
                        index === currentIndex
                    ) {

                        return;

                    }


                    updateFeatured(
                        index,
                        index > currentIndex
                            ? 1
                            : -1
                    );


                    restartAutoPlay();

                }
            );

        });


        /* =====================================================
           KEYBOARD
        ===================================================== */

        document.addEventListener(
            "keydown",
            event => {

                if (
                    !reviewsSection.matches(":hover")
                ) {

                    return;

                }


                if (
                    event.key === "ArrowRight"
                ) {

                    nextReview();

                    restartAutoPlay();

                }


                if (
                    event.key === "ArrowLeft"
                ) {

                    previousReview();

                    restartAutoPlay();

                }

            }
        );


        /* =====================================================
           MOUSE PAUSE
        ===================================================== */

        reviewsSection.addEventListener(
            "mouseenter",
            stopAutoPlay
        );


        reviewsSection.addEventListener(
            "mouseleave",
            startAutoPlay
        );


        /* =====================================================
           TOUCH SWIPE
        ===================================================== */

        let touchStartX = 0;

        let touchStartY = 0;


        featured.addEventListener(
            "touchstart",
            event => {

                const touch =
                    event.changedTouches[0];


                touchStartX =
                    touch.clientX;


                touchStartY =
                    touch.clientY;


                stopAutoPlay();

            },
            {
                passive: true
            }
        );


        featured.addEventListener(
            "touchend",
            event => {

                const touch =
                    event.changedTouches[0];


                const deltaX =
                    touch.clientX -
                    touchStartX;


                const deltaY =
                    touch.clientY -
                    touchStartY;


                /*
                    Ignore mostly vertical swipes.
                */

                if (
                    Math.abs(deltaX) >
                    Math.abs(deltaY)
                ) {

                    if (
                        Math.abs(deltaX) > 45
                    ) {

                        if (deltaX < 0) {

                            nextReview();

                        } else {

                            previousReview();

                        }

                    }

                }


                startAutoPlay();

            },
            {
                passive: true
            }
        );


        /* =====================================================
           INITIALIZE
        ===================================================== */

        featuredTotal.textContent =
            formatNumber(
                reviewData.length
            );


        updateFeatured(
            0
        );


        /*
            updateFeatured() is intentionally called
            before autoplay begins.
        */

        startAutoPlay();

    }

}





/* =========================================================
   APPOINTMENT MODAL
========================================================= */

const appointmentModal =
    document.querySelector("#appointmentModal");

const appointmentDialog =
    document.querySelector(".appointment-dialog");

const appointmentBackdrop =
    document.querySelector(".appointment-backdrop");

const appointmentClose = document.querySelector(".appointment-close");

if (appointmentClose) {

    // Desktop
    appointmentClose.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        closeAppointmentModal();
    });

    // Mobile touch
    appointmentClose.addEventListener("touchend", function (event) {
        event.preventDefault();
        event.stopPropagation();
        closeAppointmentModal();
    }, { passive: false });

}
const appointmentService =
    document.querySelector("#appointmentService");

const appointmentDate =
    document.querySelector("#appointmentDate");

const appointmentNext =
    document.querySelector(".appointment-next");

const appointmentBack =
    document.querySelector(".appointment-back");

const appointmentSubmit =
    document.querySelector(".appointment-submit");

const appointmentDone =
    document.querySelector(".appointment-done");

const appointmentStepOne =
    document.querySelector(".appointment-step-one");

const appointmentStepTwo =
    document.querySelector(".appointment-step-two");

const appointmentSuccess =
    document.querySelector(".appointment-success");

const appointmentExtra =
    document.querySelector("#appointmentExtra");

const appointmentExtraLabel =
    appointmentExtra
        ? appointmentExtra.querySelector("label")
        : null;

const appointmentConcern =
    document.querySelector("#appointmentConcern");

const appointmentEmergency =
    document.querySelector("#appointmentEmergency");

const patientName =
    document.querySelector("#patientName");

const patientPhone =
    document.querySelector("#patientPhone");

const successName =
    document.querySelector(".success-name");

const successService =
    document.querySelector(".success-service-name");


/* =========================================================
   TODAY AS MINIMUM DATE
========================================================= */

if (appointmentDate) {

    const today =
        new Date().toISOString().split("T")[0];

    appointmentDate.min = today;

}


/* =========================================================
   OPEN MODAL
========================================================= */

function openAppointmentModal(service = "") {

    if (!appointmentModal) return;

    /*
        Reset the popup to Step 1
    */

    appointmentStepOne.classList.add("is-active");
    appointmentStepTwo.classList.remove("is-active");
    appointmentSuccess.classList.remove("is-active");


    /*
        Reset validation / fields
    */

    appointmentModal
        .querySelectorAll("input[type='radio']")
        .forEach(input => {
            input.checked = false;
        });


    appointmentModal
        .querySelectorAll("input[type='checkbox']")
        .forEach(input => {
            input.checked = false;
        });


    if (appointmentService) {
        appointmentService.value = service;
    }


    if (appointmentDate) {
        appointmentDate.value = "";
    }


    if (appointmentConcern) {
        appointmentConcern.value = "";
    }


    if (patientName) {
        patientName.value = "";
    }


    if (patientPhone) {
        patientPhone.value = "";
    }


    const email =
        document.querySelector("#patientEmail");

    const message =
        document.querySelector("#patientMessage");

    if (email) email.value = "";
    if (message) message.value = "";


    updateAppointmentFields();


    /*
        Open
    */

    appointmentModal.classList.add("is-open");

    appointmentModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "appointment-modal-open"
    );


    /*
        Focus
    */

    setTimeout(() => {

        if (appointmentService) {
            appointmentService.focus();
        }

    }, 350);

}


/* =========================================================
   CLOSE MODAL
========================================================= */

function closeAppointmentModal() {

    if (!appointmentModal) return;

    appointmentModal.classList.remove("is-open");

    appointmentModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "appointment-modal-open"
    );

}


/* =========================================================
   SERVICE-BASED FIELDS
========================================================= */

function updateAppointmentFields() {

    if (!appointmentService) return;

    const service =
        appointmentService.value;


    /*
        Emergency
    */

    const isEmergency =
        service === "Emergency Dental Care";


    if (appointmentEmergency) {

        appointmentEmergency.classList.toggle(
            "is-visible",
            isEmergency
        );

    }


    /*
        Extra question
    */

    const needsExtraQuestion =
        service === "Fillings & Repairs" ||
        service === "Veneers & Cosmetic Dentistry" ||
        service === "Crowns & Implants";


    if (appointmentExtra) {

        appointmentExtra.classList.toggle(
            "is-visible",
            needsExtraQuestion
        );

    }


    if (appointmentExtraLabel) {

        if (
            service ===
            "Veneers & Cosmetic Dentistry"
        ) {

            appointmentExtraLabel.textContent =
                "WHAT WOULD YOU LIKE TO IMPROVE?";

        } else if (
            service ===
            "Crowns & Implants"
        ) {

            appointmentExtraLabel.textContent =
                "TELL US A LITTLE MORE";

        } else {

            appointmentExtraLabel.textContent =
                "TELL US A LITTLE MORE";

        }

    }


    if (appointmentConcern) {

        if (
            service ===
            "Veneers & Cosmetic Dentistry"
        ) {

            appointmentConcern.placeholder =
                "Tell us what you'd like to improve about your smile.";

        } else if (
            service ===
            "Crowns & Implants"
        ) {

            appointmentConcern.placeholder =
                "Tell us what you'd like to discuss.";

        } else {

            appointmentConcern.placeholder =
                "Briefly tell us what you'd like help with.";

        }

    }

}


/* =========================================================
   SERVICE SELECT CHANGE
========================================================= */

if (appointmentService) {

    appointmentService.addEventListener(
        "change",
        updateAppointmentFields
    );

}


/* =========================================================
   SERVICE CARDS
========================================================= */

const serviceOptions =
    document.querySelectorAll(
        ".service-option[data-service]"
    );


serviceOptions.forEach(option => {

    option.addEventListener(
        "click",
        event => {

            event.preventDefault();

            const selectedService =
                option.dataset.service || "";

            openAppointmentModal(
                selectedService
            );

        }
    );

});



/* =========================================================
   NOT SURE WHAT I NEED — CONTACT CLINIC
========================================================= */

const serviceHelpButton =
    document.querySelector(".service-help-button");

const contactModal =
    document.querySelector("#contactModal");

const contactBackdrop =
    document.querySelector(".contact-backdrop");

const contactClose =
    document.querySelector(".contact-close");

const contactSubmit =
    document.querySelector(".contact-submit");

const contactDone =
    document.querySelector(".contact-done");

const contactForm =
    document.querySelector(".contact-form");

const contactSuccess =
    document.querySelector(".contact-success");


function openContactModal() {

    if (!contactModal) return;

    contactForm.style.display = "block";
    contactSuccess.classList.remove("is-active");

    contactModal.classList.add("is-open");

    contactModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow = "hidden";

}


function closeContactModal() {

    if (!contactModal) return;

    contactModal.classList.remove("is-open");

    contactModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow = "";

}


if (serviceHelpButton) {

    serviceHelpButton.addEventListener(
        "click",
        event => {

            event.preventDefault();

            openContactModal();

        }
    );

}


if (contactClose) {

    contactClose.addEventListener(
        "click",
        event => {

            event.preventDefault();
            event.stopPropagation();

            closeContactModal();

        }
    );

}


if (contactBackdrop) {

    contactBackdrop.addEventListener(
        "click",
        closeContactModal
    );

}


if (contactSubmit) {

    contactSubmit.addEventListener(
        "click",
        () => {

            const name =
                document
                    .querySelector("#contactName")
                    ?.value
                    .trim();

            const email =
                document
                    .querySelector("#contactEmail")
                    ?.value
                    .trim();

            const message =
                document
                    .querySelector("#contactMessage")
                    ?.value
                    .trim();


            if (!name) {

                document
                    .querySelector("#contactName")
                    .focus();

                return;

            }


            if (!email) {

                document
                    .querySelector("#contactEmail")
                    .focus();

                return;

            }


            if (!message) {

                document
                    .querySelector("#contactMessage")
                    .focus();

                return;

            }


            console.log(
                "Contact request:",
                {
                    name,
                    email,
                    phone:
                        document
                            .querySelector("#contactPhone")
                            ?.value
                            .trim() || "",
                    message
                }
            );


            contactForm.style.display = "none";

            contactSuccess.classList.add(
                "is-active"
            );

        }
    );

}


if (contactDone) {

    contactDone.addEventListener(
        "click",
        closeContactModal
    );

}


/* =========================================================
   HEADER / HERO / MOBILE BOOKING BUTTONS
========================================================= */

const bookingTriggers = document.querySelectorAll(
    ".header-cta, .hero-button, .mobile-booking, .final-cta-button, .footer-booking"
);


bookingTriggers.forEach(button => {

    button.addEventListener(
        "click",
        event => {

            event.preventDefault();

            /*
                No service selected.
                Patient can choose one inside popup.
            */

            openAppointmentModal("");

        }
    );

});


/* =========================================================
   CONTINUE → STEP 2
========================================================= */

if (appointmentNext) {

    appointmentNext.addEventListener(
        "click",
        () => {

            const service =
                appointmentService.value;

            const patientType =
                document.querySelector(
                    "input[name='patientType']:checked"
                );

            const preferredTime =
                document.querySelector(
                    "input[name='appointmentTime']:checked"
                );


            /*
                Basic validation
            */

            if (!service) {

                appointmentService.focus();

                appointmentService.style.borderColor =
                    "#a85d50";

                return;

            }


            appointmentService.style.borderColor = "";


            if (!patientType) {

                showAppointmentError(
                    "Please select whether you're a new or existing patient."
                );

                return;

            }


            if (!appointmentDate.value) {

                appointmentDate.focus();

                appointmentDate.style.borderColor =
                    "#a85d50";

                return;

            }


            appointmentDate.style.borderColor = "";


            if (!preferredTime) {

                showAppointmentError(
                    "Please choose a preferred time."
                );

                return;

            }


            /*
                Emergency validation
            */

            if (
                service ===
                "Emergency Dental Care"
            ) {

                const emergencyChecked =
                    appointmentEmergency
                        .querySelectorAll(
                            "input[type='checkbox']:checked"
                        );

                if (!emergencyChecked.length) {

                    showAppointmentError(
                        "Please select what you're experiencing."
                    );

                    return;

                }

            }


            /*
                Move to Step 2
            */

            appointmentStepOne.classList.remove(
                "is-active"
            );

            appointmentStepTwo.classList.add(
                "is-active"
            );


            setTimeout(() => {

                if (patientName) {
                    patientName.focus();
                }

            }, 300);

        }
    );

}


/* =========================================================
   BACK
========================================================= */

if (appointmentBack) {

    appointmentBack.addEventListener(
        "click",
        () => {

            appointmentStepTwo.classList.remove(
                "is-active"
            );

            appointmentStepOne.classList.add(
                "is-active"
            );

        }
    );

}


/* =========================================================
   SUBMIT
========================================================= */

if (appointmentSubmit) {

    appointmentSubmit.addEventListener(
        "click",
        () => {

            const name =
                patientName.value.trim();

            const phone =
                patientPhone.value.trim();


            if (!name) {

                patientName.focus();

                patientName.style.borderColor =
                    "#a85d50";

                return;

            }

            patientName.style.borderColor = "";


            if (!phone) {

                patientPhone.focus();

                patientPhone.style.borderColor =
                    "#a85d50";

                return;

            }

            patientPhone.style.borderColor = "";


            /*
                Get selected service
            */

            const service =
                appointmentService.value;


            /*
                Update success screen
            */

            if (successName) {

                const firstName =
                    name.split(" ")[0];

                successName.textContent =
                    `${firstName}.`;

            }


            if (successService) {

                successService.textContent =
                    service || "Appointment";

            }


            /*
                Hide Step 2
            */

            appointmentStepTwo.classList.remove(
                "is-active"
            );


            /*
                Show success
            */

            appointmentSuccess.classList.add(
                "is-active"
            );


            /*
                IMPORTANT:
                This is currently a FRONT-END DEMO.

                Later we will connect this data
                to Formspree / email / Google Sheets /
                backend / dental scheduling software.
            */

            console.log(
                "Appointment request:",
                {
                    service,
                    patientType:
                        document.querySelector(
                            "input[name='patientType']:checked"
                        )?.value || "",

                    date:
                        appointmentDate.value,

                    preferredTime:
                        document.querySelector(
                            "input[name='appointmentTime']:checked"
                        )?.value || "",

                    name,

                    phone,

                    email:
                        document.querySelector(
                            "#patientEmail"
                        )?.value || "",

                    message:
                        document.querySelector(
                            "#patientMessage"
                        )?.value || "",

                    contactPreference:
                        document.querySelector(
                            "input[name='contactPreference']:checked"
                        )?.value || ""

                }
            );

        }
    );

}


/* =========================================================
   DONE
========================================================= */

if (appointmentDone) {

    appointmentDone.addEventListener(
        "click",
        closeAppointmentModal
    );

}


/* =========================================================
   CLOSE EVENTS
========================================================= */

if (appointmentClose) {

    appointmentClose.addEventListener(
        "click",
        closeAppointmentModal
    );

}


if (appointmentBackdrop) {

    appointmentBackdrop.addEventListener(
        "click",
        closeAppointmentModal
    );

}


/* =========================================================
   ESC
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            appointmentModal &&
            appointmentModal.classList.contains("is-open")
        ) {

            closeAppointmentModal();

        }

    }
);


/* =========================================================
   SIMPLE ERROR MESSAGE
========================================================= */

function showAppointmentError(message) {

    /*
        Small temporary message.
        We intentionally avoid browser alert().
    */

    let error =
        document.querySelector(
            ".appointment-error"
        );


    if (!error) {

        error =
            document.createElement("div");

        error.className =
            "appointment-error";

        appointmentNext.before(error);

    }


    error.textContent = message;

    error.classList.add("is-visible");


    clearTimeout(
        error._timer
    );


    error._timer =
        setTimeout(() => {

            error.classList.remove(
                "is-visible"
            );

        }, 3500);

}






/* =========================================================
   SMART HEADER
   HIDE ON DOWN SCROLL / SHOW ON UP SCROLL
========================================================= */

const siteHeader = document.querySelector(".site-header");

let lastScrollY = window.scrollY;
let headerScrollTicking = false;

const headerTopDistance = 90;
const headerScrollThreshold = 4;


function updateSmartHeader() {

    if (!siteHeader) return;

    const currentScrollY = window.scrollY;


    /* =====================================================
       ALWAYS SHOW AT TOP
    ===================================================== */

    if (currentScrollY <= headerTopDistance) {

        siteHeader.classList.remove("header-hidden");
        siteHeader.classList.remove("header-scrolled");

        lastScrollY = currentScrollY;

        headerScrollTicking = false;

        return;
    }


    /* =====================================================
       SCROLLED STATE
    ===================================================== */

    siteHeader.classList.add("header-scrolled");


    /* =====================================================
       MOBILE MENU OPEN
       NEVER HIDE HEADER
    ===================================================== */

    if (
        mobileMenu &&
        mobileMenu.classList.contains("is-open")
    ) {

        siteHeader.classList.remove("header-hidden");

        lastScrollY = currentScrollY;

        headerScrollTicking = false;

        return;
    }


    /* =====================================================
       DETECT DIRECTION
    ===================================================== */

    const difference =
        currentScrollY - lastScrollY;


    /* =====================================================
       SCROLLING DOWN
    ===================================================== */

    if (difference > headerScrollThreshold) {

        siteHeader.classList.add("header-hidden");

    }


    /* =====================================================
       SCROLLING UP
    ===================================================== */

    else if (difference < -headerScrollThreshold) {

        siteHeader.classList.remove("header-hidden");

    }


    lastScrollY = currentScrollY;

    headerScrollTicking = false;
}


/* =========================================================
   SCROLL LISTENER
========================================================= */

window.addEventListener(
    "scroll",
    () => {

        if (!headerScrollTicking) {

            window.requestAnimationFrame(
                updateSmartHeader
            );

            headerScrollTicking = true;
        }

    },
    {
        passive: true
    }
);


/* =========================================================
   INITIAL STATE
========================================================= */

updateSmartHeader();



/* =========================================================
   PREMIUM MOBILE MENU
========================================================= */

const menuToggle =
    document.querySelector(".menu-toggle");

const mobileMenu =
    document.querySelector(".mobile-menu");

const mobileBackdrop =
    document.querySelector(".mobile-menu-backdrop");

const mobileClose =
    document.querySelector(".mobile-menu-close");

const mobileLinks =
    document.querySelectorAll(".mobile-navigation a");

const mobileBooking =
    document.querySelector(".mobile-booking");


/* =========================================================
   OPEN MENU
========================================================= */

function openMobileMenu() {

    if (!mobileMenu) return;

    mobileMenu.classList.add("is-open");

    document.body.classList.add(
        "mobile-menu-open"
    );

    if (siteHeader) {

        siteHeader.classList.add(
            "menu-is-open"
        );

        siteHeader.classList.remove(
            "header-hidden"
        );
    }


    mobileMenu.setAttribute(
        "aria-hidden",
        "false"
    );


    if (menuToggle) {

        menuToggle.classList.add("open");

        menuToggle.setAttribute(
            "aria-label",
            "Close menu"
        );

        menuToggle.setAttribute(
            "aria-expanded",
            "true"
        );
    }
}


/* =========================================================
   CLOSE MENU
========================================================= */

function closeMobileMenu() {

    if (!mobileMenu) return;

    mobileMenu.classList.remove(
        "is-open"
    );

    document.body.classList.remove(
        "mobile-menu-open"
    );


    if (siteHeader) {

        siteHeader.classList.remove(
            "menu-is-open"
        );
    }


    mobileMenu.setAttribute(
        "aria-hidden",
        "true"
    );


    if (menuToggle) {

        menuToggle.classList.remove(
            "open"
        );

        menuToggle.setAttribute(
            "aria-label",
            "Open menu"
        );

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );
    }
}


/* =========================================================
   TOGGLE
========================================================= */

if (menuToggle) {

    menuToggle.addEventListener(
        "click",
        () => {

            if (
                mobileMenu &&
                mobileMenu.classList.contains(
                    "is-open"
                )
            ) {

                closeMobileMenu();

            } else {

                openMobileMenu();

            }

        }
    );
}


/* =========================================================
   CLOSE — BACKDROP
========================================================= */

if (mobileBackdrop) {

    mobileBackdrop.addEventListener(
        "click",
        closeMobileMenu
    );
}


/* =========================================================
   CLOSE — X BUTTON
========================================================= */

if (mobileClose) {

    mobileClose.addEventListener(
        "click",
        closeMobileMenu
    );
}


/* =========================================================
   CLOSE — NAVIGATION LINKS
========================================================= */

mobileLinks.forEach(link => {

    link.addEventListener(
        "click",
        () => {

            closeMobileMenu();

        }
    );

});


/* =========================================================
   CLOSE — BOOKING
========================================================= */

if (mobileBooking) {

    mobileBooking.addEventListener(
        "click",
        closeMobileMenu
    );
}


/* =========================================================
   ESC KEY
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            mobileMenu &&
            mobileMenu.classList.contains(
                "is-open"
            )
        ) {

            closeMobileMenu();

        }

    }
);


/* =========================================================
   RESET IF SCREEN BECOMES DESKTOP
========================================================= */

window.addEventListener(
    "resize",
    () => {

        if (
            window.innerWidth > 800 &&
            mobileMenu &&
            mobileMenu.classList.contains(
                "is-open"
            )
        ) {

            closeMobileMenu();

        }

    }
);
