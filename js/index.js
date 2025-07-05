// Get all input elements
var signupName = document.getElementById('signupName');
var signupEmail = document.getElementById('signupEmail');
var signupPassword = document.getElementById('signupPassword');
var signinEmail = document.getElementById('signinEmail');
var signinPassword = document.getElementById('signinPassword');

// Get base URL (for redirecting to home.html)
var pathparts = location.pathname.split('/');
var baseURL = '';
for (var i = 0; i < pathparts.length - 1; i++) {
    baseURL += '/' + pathparts[i];
}
console.log(baseURL);

// Display welcome message on home page
var username = localStorage.getItem('sessionUsername');
if (username && document.getElementById('username')) {
    document.getElementById('username').innerHTML = "Welcome " + username;
}

// Retrieve registered users from localStorage
var signUpArray = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : [];

// Check if signup inputs are empty
function isEmpty() {
    return signupName.value.trim() !== "" &&
           signupEmail.value.trim() !== "" &&
           signupPassword.value.trim() !== "";
}

// Check if email already exists in saved users
function isEmailExist() {
    for (var i = 0; i < signUpArray.length; i++) {
        if (signUpArray[i].email.toLowerCase() === signupEmail.value.trim().toLowerCase()) {
            return true; // Email exists
        }
    }
    return false; // Email does not exist
}

// Signup function
function signUp() {
    if (!isEmpty()) {
        document.getElementById('exist').innerHTML = '<span class="text-danger m-3">All inputs are required</span>';
        return false;
    }

    if (isEmailExist()) {
        document.getElementById('exist').innerHTML = '<span class="text-danger m-3">Email already exists</span>';
        return false;
    }

    // Create user object
    var signUp = {
        name: signupName.value.trim(),
        email: signupEmail.value.trim(),
        password: signupPassword.value.trim(),
    };

    // Save to array and localStorage
    signUpArray.push(signUp);
    localStorage.setItem('users', JSON.stringify(signUpArray));
    document.getElementById('exist').innerHTML = '<span class="text-success m-3">Success</span>';
    return true;
}

// Check if login inputs are empty
function isLoginEmpty() {
    return signinEmail.value.trim() !== "" && signinPassword.value.trim() !== "";
}

// Login function with corrected validation
function login() {
    if (!isLoginEmpty()) {
        document.getElementById('incorrect').innerHTML =
            '<span class="text-danger m-3">All inputs are required</span>';
        return false;
    }

    var email = signinEmail.value.trim().toLowerCase();
    var password = signinPassword.value.trim();
    var isFound = false;

    // Check if credentials match any registered user
    for (var i = 0; i < signUpArray.length; i++) {
        if (
            signUpArray[i].email.toLowerCase() === email &&
            signUpArray[i].password === password
        ) {
            // Save session and redirect to home
            localStorage.setItem('sessionUsername', signUpArray[i].name);
            isFound = true;

            if (baseURL === '/') {
                location.replace('https://' + location.hostname + '/home.html');
            } else {
                location.replace(baseURL + '/home.html');
            }
            break;
        }
    }

    // If no user matched, show error message
    if (!isFound) {
        document.getElementById('incorrect').innerHTML =
            '<span class="p-2 text-danger">Incorrect email or password</span>';
    }
}

// Logout function to remove session
function logout() {
    localStorage.removeItem('sessionUsername');
}
