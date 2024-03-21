document.addEventListener("DOMContentLoaded", function() {
    const progressBar = document.getElementById("progressBar");
    const screens = document.querySelectorAll(".container");
    let currentScreenIndex = 0;

    // Update progress bar and slide to next screen if all inputs on the current screen are filled
    const updateProgressBarAndSlide = () => {
        const totalInputs = countTotalInputs();
        const filledInputs = countFilledInputs();
        const progress = (filledInputs / totalInputs) * 100;
        progressBar.style.width = `${progress}%`;

        if (progress === 100 && currentScreenIndex < screens.length - 1) {
            slideToNextScreen();
        } else if (progress === 100 && currentScreenIndex === screens.length - 1) {
            currentScreenIndex = 0;
            showSuccessMessage();
        }
    };

    // Count total number of inputs
    const countTotalInputs = () => {
        let totalInputs = 0;
        const activeScreenInputs = screens[currentScreenIndex].querySelectorAll("input[type='text'], select, input[type='radio']");
        const radioGroups = {};
        activeScreenInputs.forEach(input => {
            if (input.type === 'radio') {
                if (!radioGroups[input.name]) {
                    radioGroups[input.name] = true;
                    totalInputs++;
                }
            } else {
                totalInputs++;
            }
        });
        return totalInputs;
    };

    // Count filled inputs
    const countFilledInputs = () => {
        let filledInputs = 0;
        screens[currentScreenIndex].querySelectorAll("input[type='text']").forEach(input => {
            if (input.value.length >= 3) filledInputs++;
        });
        screens[currentScreenIndex].querySelectorAll("select").forEach(select => {
            if (select.value !== '') filledInputs++;
        });
        screens[currentScreenIndex].querySelectorAll("input[type='radio']").forEach(radio => {
            if (radio.checked) filledInputs++;
        });
        return filledInputs;
    };

    // Slide to the next screen
    const slideToNextScreen = () => {
        progressBar.style.width = '0%';
        screens[currentScreenIndex].classList.remove("active");
        currentScreenIndex++;
        if (currentScreenIndex >= screens.length) {
            currentScreenIndex = 0; // Loop back to the first screen
        }
        screens[currentScreenIndex].classList.add("active");
        screens[currentScreenIndex].scrollIntoView({ behavior: 'smooth' });
        updateEventListeners();
        resetInputFields(); // Reset input fields when screen changes
    };

    // Show success message
    const showSuccessMessage = () => {
        const successPopup = document.getElementById("successPopup");
        const closePopup = document.querySelector(".close");

        // Add 'active' class to the success popup and blur the background
        successPopup.classList.add("active");
        document.body.classList.add("blur");

        // Close popup when clicked outside of it
        successPopup.addEventListener("click", function(event) {
            if (event.target === successPopup) {
                // Remove 'active' class from success popup and remove blur from background
                successPopup.classList.remove("active");
                document.body.classList.remove("blur");

                // Reset to the first screen
                currentScreenIndex = 0;
                screens.forEach((screen, index) => {
                    if (index === 0) {
                        screen.classList.add("active");
                    } else {
                        screen.classList.remove("active");
                    }
                });

                // Reset progress bar and input fields
                progressBar.style.width = '0%';
                resetInputFields();
            }
        });

        // Close popup when the close button is clicked
        closePopup.addEventListener("click", function(event) {
            if (event.target === closePopup) {
                // Hide success popup
                successPopup.style.display = 'none';

                // Reset to the first screen
                currentScreenIndex = 0;
                screens.forEach((screen, index) => {
                    if (index === 0) {
                        screen.classList.add("active");
                    } else {
                        screen.classList.remove("active");
                    }
                });

                // Reset progress bar and input fields
                progressBar.style.width = '0%';
                resetInputFields();
            }
        });
    };

    const resetInputFields = () => {
        screens[currentScreenIndex].querySelectorAll("input[type='text']").forEach(input => {
            input.value = ''; // Set value to empty string
        });
        screens[currentScreenIndex].querySelectorAll("select").forEach(select => {
            select.value = ''; // Set value to empty string
        });
        screens[currentScreenIndex].querySelectorAll("input[type='radio']").forEach(radio => {
            radio.checked = false; // Uncheck radio buttons
        });
    };

    // Add event listeners to inputs
    const updateEventListeners = () => {
        screens[currentScreenIndex].querySelectorAll("input[type='text']").forEach(input => {
            input.addEventListener('input', updateProgressBarAndSlide);
        });
        screens[currentScreenIndex].querySelectorAll(".container select").forEach(select => {
            select.addEventListener('change', updateProgressBarAndSlide);
        });
        screens[currentScreenIndex].querySelectorAll(".container input[type='radio']").forEach(radio => {
            radio.addEventListener('change', updateProgressBarAndSlide);
        });
    };

    updateEventListeners();
});
