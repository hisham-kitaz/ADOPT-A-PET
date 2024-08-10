//Hicham Kitaz
//40188246
document.getElementById('findForm').addEventListener('submit', function(event) {
    event.preventDefault();

    let isValid = true;

    const petType = document.getElementById('petType');
    const breed = document.getElementById('breed');
    const age = document.getElementById('age');
    const gender = document.getElementById('gender');

    const petTypeError = document.getElementById('petTypeError');
    const ageError = document.getElementById('ageError');
    const genderError = document.getElementById('genderError');

    // Clear previous error messages
    petTypeError.textContent = '';
    ageError.textContent = '';
    genderError.textContent = '';

    // Validate fields
    if (petType.value === '') {
        petTypeError.textContent = 'Please select Cat or Dog.';
        isValid = false;
    }

    if (age.value === '') {
        ageError.textContent = 'Please enter the age of the animal.';
        isValid = false;
    }

    if (gender.value === '') {
        genderError.textContent = 'Please select the gender of the animal.';
        isValid = false;
    }

    if (isValid) {
        // Submit the form if all fields are valid
        this.submit();
    }
});
