const tabs = document.querySelectorAll(".tab");
const signup = document.getElementById("signup");
const login = document.getElementById("login");
const reset = document.getElementById("reset");
const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");
const toreset = document.getElementById("toResetPage");
const backToLogin = document.getElementById("back-login");
const logout = document.getElementById("logout");
const mainNav = document.getElementById("mainNav");
const dashNav = document.getElementById("dashNav");
const forms = document.getElementById("container");
const dashboard = document.getElementById("dashboard");
const addTaskBtn = document.getElementById("addTaskBtn");
const resetpass = document.getElementById("resetpass");
const sendOtp = document.getElementById("sendOtp");


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



async function loadTask() {

    const Email = localStorage.getItem("Email");
    const Password = localStorage.getItem("Password");

    try {

        const response = await fetch("http://localhost:1111/alltasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ Email, Password })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        renderTasks(data.TASKS);

    } catch (error) {
        console.log(error);
        alert("Failed to load tasks");
    }
}



async function renderTasks(tasks) {

    const taskContainer = document.getElementById("taskContainer");

    taskContainer.innerHTML = "";

    if (tasks.length === 0) {
        taskContainer.innerHTML = `
                    <div class="text-gray-300 text-center py-5">
                        No Tasks Available
                    </div>
                    `;
        return;
    }

    taskContainer.innerHTML = tasks.map((task, i) => {

        return `
        <div
    class="task group relative bg-white/10 backdrop-blur-md  border border-white/20 rounded-2xl px-5 py-4  flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/15 hover:border-violet-400/30 
    hover:shadow-violet-500/10 transition-all duration-300 ease-out shadow-lg shadow-black/10 hover:-translate-y-1 overflow-hidden snap-start">

    <div class="flex flex-col gap-1">

        <div class="flex flex-wrap items-center gap-2">
            <span
                class="task-id bg-violet-500/20 text-violet-300 text-xs px-2 py-1 rounded-lg font-semibold">
                ${task.id}
                </span>

            <h2 class="task-name text-base sm:text-lg font-semibold tracking-wide break-words">
                ${task.Task}
            </h2>
        </div>

        <div class="text-sm text-gray-300 flex flex-wrap gap-3">
            <span class="task-date">
            ${task.AddedDate}
            </span>

            <span class="task-time">
                ${task.AddedTime}
                </span>
                </div>
                
    </div>

    <button  data-id="${task.id}"
        class="RemoveTaskBtn w-full sm:w-auto
        bg-red-500/20 hover:bg-red-500
text-red-300 hover:text-white
px-4 py-2 rounded-xl
transition-all duration-300
font-medium active:scale-95
hover:shadow-lg hover:shadow-red-500/30">
        Remove
    </button>

</div>
                `;

    }).join("");

}


signupBtn.addEventListener("click", async (e) => {

    e.preventDefault();

    const Name = document.getElementById("name").value.trim();
    const Email = document.getElementById("signup-mail").value.trim();
    const Password = document.getElementById("signup-pass").value.trim();
    const Phone = document.getElementById("phone").value.trim();


    if (!Name || !Email || !Password || !Phone) {
        alert("Give all required data");
        return;
    }

    try {

        const response = await fetch("http://localhost:1111/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ Name, Email, Password, Phone })
        });

        const data = await response.json();

        alert(data.Message);

        document.getElementById("name").value = ""
        document.getElementById("signup-mail").value = ""
        document.getElementById("signup-pass").value = ""
        document.getElementById("phone").value = ""

    } catch (error) {
        console.log(error);
        alert("Server Error");
    }
});


loginBtn.addEventListener("click", async (e) => {

    e.preventDefault();

    const Email = document.getElementById("login-mail").value.trim();
    const Password = document.getElementById("login-pass").value.trim();

    document.getElementById("UserMail").setAttribute("data-email", Email)

    if (!Email || !Password) {
        alert("Give all required data");
        return;
    }

    try {

        const response = await fetch("http://localhost:1111/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ Email, Password })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.Message);
            return;
        }

        alert(data.Message);



        localStorage.setItem("Email", Email);
        localStorage.setItem("Password", Password);


        forms.classList.add("hidden");
        forms.classList.remove("flex");

        mainNav.classList.add("hidden");
        mainNav.classList.remove("flex");

        dashboard.classList.remove("hidden");
        dashboard.classList.add("flex");

        dashNav.classList.remove("hidden");
        dashNav.classList.add("flex");

        loadTask();

    } catch (error) {
        console.log(error);
        alert("Server Error");
    }

});


toreset.addEventListener("click", () => {
    login.classList.add("hidden")
    reset.classList.remove("hidden")
    reset.classList.add("flex")
})

sendOtp.addEventListener("click", async (e) => {
    e.preventDefault()
    const mail = document.getElementById("reset-mail").value


    if (!mail) {
        alert("EnterMail");
        return;
    }

    try {

        // const response = await fetch("http://localhost:1111/forget_password", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify({ mail })
        // });

        // const data = await response.json();

        // if (!response.ok) {
        //     alert("error");
        //     return;
        // }

        alert("Otp sent on Email");


        sendOtp.classList.add("hidden")
        resetpass.classList.remove("hidden")
        document.getElementById("reset-mail").disabled = true;
        document.getElementById("reset-mail").classList.add("cursor-not-allowed");


    } catch (error) {
        console.log(error)
        alert("server error")
    }
})


resetpass.addEventListener("click", async (e) => {
    e.preventDefault()

    const mail = document.getElementById("reset-mail").value
    const OTP = document.getElementById("reset-otp").value
    const New_Password = document.getElementById("new-password").value


    if (!mail || !OTP || !New_Password) {
        alert("fill all fields");
        return;
    }

    try {

        // const response = await fetch("http://localhost:1111/reset_password", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify({ mail, OTP, New_Password })
        // });

        // const data = await response.json();

        // if (!response.ok) {
        //     alert("error");
        //     return;
        // }

        alert("Password Changed");

        login.classList.remove("hidden");
        login.classList.add("flex");

        reset.classList.add("hidden");
        reset.classList.remove("flex");

         document.getElementById("reset-mail").value = ""
         document.getElementById("reset-otp").value = ""
         document.getElementById("new-password").value = ""


          sendOtp.classList.remove("hidden")
        resetpass.classList.add("hidden")
          document.getElementById("reset-mail").disabled = false;
        document.getElementById("reset-mail").classList.remove("cursor-not-allowed");




    } catch (error) {
        console.log(error)
        alert("server error")
    }
})

backToLogin.addEventListener("click", () => {
    login.classList.remove("hidden");
    login.classList.add("flex");

    reset.classList.add("hidden");
    reset.classList.remove("flex");
})


logout.addEventListener("click", () => {


    if (!confirm("Do You want to LogOut?")) {
        return
    }


    localStorage.removeItem("Email");
    localStorage.removeItem("Password");


    document.getElementById("login-mail").value = ""
    document.getElementById("login-pass").value = ""


    dashboard.classList.remove("flex")
    dashboard.classList.add("hidden")

    forms.classList.remove("hidden")
    forms.classList.add("flex")

    dashNav.classList.remove("flex")
    dashNav.classList.add("hidden")

    mainNav.classList.remove("hidden")
    mainNav.classList.add("flex")
})


addTaskBtn.addEventListener("click", async (e) => {
    e.preventDefault()


    const Email = localStorage.getItem("Email");
    const Password = localStorage.getItem("Password");

    const Task = document.getElementById("addTask").value.trim();

    if (!Task) {
        alert("Enter Task")
        return
    }

    try {

        const response = await fetch("http://localhost:1111/addtask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ Email, Password, Task })
        })

        const data = await response.json()

        if (!response.ok) {
            alert(data.Message);
            return;
        }

        alert("Task Added")

        document.getElementById("addTask").value = "";

        loadTask();

    }
    catch (error) {
        console.log(error)
        alert("server Error")
    }
})


document.addEventListener("click", async (e) => {

    if (!e.target.classList.contains("RemoveTaskBtn")) {
        return
    }

    e.preventDefault();

    const btn = e.target;

    const id = btn.dataset.id;

    const Email = localStorage.getItem("Email");
    const Password = localStorage.getItem("Password");

    try {

        const response = await fetch("http://localhost:1111/removetask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                Email,
                Password,
                id
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.Message || "Failed");
            return;
        }

        alert("Task Removed");

        btn.closest(".task").remove();

        loadTask();

    } catch (error) {

        console.log(error);

        alert("Server Error");

    }

});



window.addEventListener("DOMContentLoaded", () => {

    const savedEmail = localStorage.getItem("Email");
    const savedPassword = localStorage.getItem("Password");

    if (savedEmail && savedPassword) {


        document.getElementById("login-mail").value = savedEmail;
        document.getElementById("login-pass").value = savedPassword;


        forms.classList.add("hidden");
        forms.classList.remove("flex");

        mainNav.classList.add("hidden");
        mainNav.classList.remove("flex");

        dashboard.classList.remove("hidden");
        dashboard.classList.add("flex");

        dashNav.classList.remove("hidden");
        dashNav.classList.add("flex");

        loadTask();
    }
});

