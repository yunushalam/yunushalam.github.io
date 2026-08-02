// Portfolio Profile Photo Logic
const profileImage = document.getElementById('profileImage');
const imageUpload = document.getElementById('imageUpload');

// Handle image upload (Optional: still allows local preview, but we won't save it to localStorage)
if (imageUpload) {
    imageUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
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

// Mobile Menu Logic
const menuToggle = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('is-active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('is-active');
            navLinks.classList.remove('active');
        });
    });
}

// Smooth Scrolling for nav links
document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Form Submission Logic
const accessKey = '8a5c2728-ac46-4858-b794-b37d9c98520e';
const form = document.getElementById('google-form');
const submitBtn = document.getElementById('submitBtn');
const formMessage = document.getElementById('formMessage');

if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify({
            ...object,
            access_key: accessKey
        });

        // Set loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        formMessage.style.display = 'none';

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
        .then(async (response) => {
            let res = await response.json();
            if (response.status == 200) {
                formMessage.textContent = "Success! Your message has been sent.";
                formMessage.className = "form-message success";
                form.reset();
            } else {
                formMessage.textContent = res.message || "Something went wrong!";
                formMessage.className = "form-message error";
            }
        })
        .catch(error => {
            formMessage.textContent = "Error! Could not connect to the server.";
            formMessage.className = "form-message error";
        })
        .finally(() => {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            formMessage.style.display = 'block';
            
            // Auto-hide message after 5 seconds
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        });
    });
}

// Resume Opening Logic (Base64)
function openResume() {
    try {
        const blob = base64ToBlob(resumeBase64, 'application/pdf');
        const url = URL.createObjectURL(blob);
        const win = window.open(url, '_blank');
        if (!win) {
            alert('Please allow popups to view the resume.');
        }
    } catch (e) {
        console.error('Error opening resume:', e);
        alert('Could not open resume. Please try again.');
    }
}

function base64ToBlob(base64, type) {
    const bin = atob(base64);
    const len = bin.length;
    const arr = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        arr[i] = bin.charCodeAt(i);
    }
    return new Blob([arr], { type: type });
}
