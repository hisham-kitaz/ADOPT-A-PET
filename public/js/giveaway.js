// Hicham Kitaz
// 40188246
document.getElementById('giveawayForm').addEventListener('submit', function (event) {
    event.preventDefault();

    let isValid = true;

    const petType = document.getElementById('petType');
    const breed = document.getElementById('breed');
    const age = document.getElementById('age');
    const gender = document.getElementById('gender');
    const comment = document.getElementById('comment');
    const ownerName = document.getElementById('ownerName');
    const ownerEmail = document.getElementById('ownerEmail');

    const petTypeError = document.getElementById('petTypeError');
    const breedError = document.getElementById('breedError');
    const ageError = document.getElementById('ageError');
    const genderError = document.getElementById('genderError');
    const commentError = document.getElementById('commentError');
    const ownerNameError = document.getElementById('ownerNameError');
    const ownerEmailError = document.getElementById('ownerEmailError');

    // Clear previous error messages
    petTypeError.textContent = '';
    breedError.textContent = '';
    ageError.textContent = '';
    genderError.textContent = '';
    commentError.textContent = '';
    ownerNameError.textContent = '';
    ownerEmailError.textContent = '';

    // Validate fields
    if (petType.value === '') {
        petTypeError.textContent = 'Please select Cat or Dog.';
        isValid = false;
    }

    if (breed.value === '') {
        breedError.textContent = 'Please enter the breed of the pet.';
        isValid = false;
    }

    if (age.value === '') {
        ageError.textContent = 'Please select the age of the pet.';
        isValid = false;
    }

    if (gender.value === '') {
        genderError.textContent = 'Please select the gender of the pet.';
        isValid = false;
    }

    if (comment.value === '') {
        commentError.textContent = 'Please enter a comment about the pet.';
        isValid = false;
    }

    if (ownerName.value === '') {
        ownerNameError.textContent = 'Please enter your name.';
        isValid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(ownerEmail.value)) {
        ownerEmailError.textContent = 'Please enter a valid email address.';
        isValid = false;
    }

    if (isValid) {
        // Submit the form if all fields are valid
        this.submit();
    }
});
