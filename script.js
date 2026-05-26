const tabs = document.querySelectorAll("ul li");
const signup = document.getElementById("signup");
const login = document.getElementById("login");
const reset = document.getElementById("reset");

tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {

        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        if (index === 0) {
            signup.classList.remove("hidden");
            signup.classList.add("flex");

            login.classList.add("hidden");
            login.classList.remove("flex");

            reset.classList.add("hidden");
            reset.classList.remove("flex");

        } else {
            login.classList.remove("hidden");
            login.classList.add("flex");

            signup.classList.add("hidden");
            signup.classList.remove("flex");

            reset.classList.add("hidden");
            reset.classList.remove("flex");
        }
    });
});

const overlay = document.getElementById("overlay");
const signupmsg = document.getElementById("signup-confirmed");
const back = document.getElementById("back-btn");
const gotoLogin = document.getElementById("goto-login");

// Hide Overlay
overlay.addEventListener("click", () => {
    signupmsg.classList.add("hidden");
    signupmsg.classList.remove("flex");

    overlay.classList.add("hidden");
});

//Back to signup
back.addEventListener("click", () => {
    signupmsg.classList.add("hidden");
    signupmsg.classList.remove("flex");

    overlay.classList.add("hidden");
});

//TO login
gotoLogin.addEventListener("click", () => {

    signupmsg.classList.add("hidden");
    signupmsg.classList.remove("flex");

    overlay.classList.add("hidden");

    tabs.forEach(t => t.classList.remove("active"));
    tabs[1].classList.add("active");

    login.classList.remove("hidden");
    login.classList.add("flex");

    signup.classList.add("hidden");
    signup.classList.remove("flex");

});


//Signup function
const signupBtn = document.getElementById("signupBtn");
signupBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const Name = document.getElementById("name").value.trim();
    const Email = document.getElementById("signup-mail").value.trim();
    const Password = document.getElementById("signup-pass").value.trim();
    const Phone = document.getElementById("phone").value.trim();

    // if (!Name || !Email || !Password || !Phone) {
    //     alert("Give all required data");
    //     return;
    // }

    overlay.classList.remove("hidden");
    signupmsg.classList.remove("hidden");
    signupmsg.classList.add("flex");

});

//ResetPassword

const resetBtn = document.getElementById("resetBtn")

resetBtn.addEventListener("click", () => {
    login.classList.add("hidden")
    reset.classList.remove("hidden")
    reset.classList.add("flex")
})

const backToLogin = document.getElementById("back-login")

backToLogin.addEventListener("click",()=>{
    login.classList.remove("hidden");
    login.classList.add("flex");

    reset.classList.add("hidden");
    reset.classList.remove("flex");
})
