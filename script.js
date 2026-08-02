// REPLACE THIS WITH YOUR WEB3FORMS ACCESS KEY
const accessKey = '8a5c2728-ac46-4858-b794-b37d9c98520e';

// Profile Photo Logic
const profileImage = document.getElementById('profileImage');
const imageUpload = document.getElementById('imageUpload');

// Handle image upload
if (imageUpload) {
    imageUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Validation: Check if it's an image
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file.');
                return;
            }

            const reader = new FileReader();
            reader.onload = function(event) {
                profileImage.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
}

const form = document.forms['google-form'];
const submitBtn = document.getElementById('submitBtn');
const formMessage = document.getElementById('formMessage');

form.addEventListener('submit', e => {
    e.preventDefault();



    // Set loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    formMessage.style.display = 'none';
    formMessage.className = 'form-message';

    // Collect Data
    const formData = new FormData(form);

    // Add the Web3Forms access key to the form data
    formData.append("access_key", accessKey);

    // Send to Web3Forms
    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
    })
        .then(async (response) => {
            let json = await response.json();
            if (response.status == 200) {
                showMessage('Success! Your message has been sent.', 'success');
                form.reset();
            } else {
                console.log(response);
                showMessage(json.message ? json.message : 'Error! Something went wrong.', 'error');
            }
            resetButton();
        })
        .catch(error => {
            console.error('Error!', error);
            showMessage('Error! Could not connect to server.', 'error');
            resetButton();
        });
});

function showMessage(text, type) {
    formMessage.textContent = text;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
}

function resetButton() {
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
}
