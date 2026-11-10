/* =====================================================
   WALKWITHME JAVASCRIPT
===================================================== */


/* =========================
   SOS
========================= */

function showSOS() {

    const message = document.getElementById("sos-message");

    message.innerHTML = `
        <strong>Emergency options:</strong><br><br>
        <a href="tel:112">Call 112</a><br>
        Check your emergency contacts below.
    `;
}


/* =========================
   FAKE CALL
========================= */

function showFakeCall() {

    const message = document.getElementById("fake-call-message");

    message.innerHTML =
        "Fake incoming call screen activated.";

}


function acceptFakeCall() {

    document.getElementById("fake-call-message").innerHTML =
        "Fake call accepted.";

}


function declineFakeCall() {

    document.getElementById("fake-call-message").innerHTML =
        "Fake call declined.";

}


/* =========================
   SHAKE ALERT
========================= */

let shakeEnabled = false;
let lastShake = 0;


async function enableShakeAlert() {

    const message = document.getElementById("shake-message");

    try {

        if (
            typeof DeviceMotionEvent !== "undefined" &&
            typeof DeviceMotionEvent.requestPermission === "function"
        ) {

            const permission =
                await DeviceMotionEvent.requestPermission();

            if (permission !== "granted") {

                message.innerText =
                    "Motion permission was not granted.";

                return;
            }
        }

        window.addEventListener(
            "devicemotion",
            detectShake
        );

        shakeEnabled = true;

        message.innerText =
            "Shake Alert enabled. Shake your phone strongly to test it.";

    } catch (error) {

        message.innerText =
            "Shake Alert is not supported by this browser.";

    }
}


function detectShake(event) {

    if (!shakeEnabled) return;

    const acceleration = event.accelerationIncludingGravity;

    if (!acceleration) return;

    const x = acceleration.x || 0;
    const y = acceleration.y || 0;
    const z = acceleration.z || 0;

    const strength =
        Math.sqrt(x * x + y * y + z * z);

    const now = Date.now();

    if (strength > 25 && now - lastShake > 1500) {

        lastShake = now;

        showSOS();

        alert(
            "Shake detected. Emergency options are available."
        );
    }
}


/* =========================
   EMERGENCY CONTACTS
========================= */

function showContacts() {

    const savedContact =
        localStorage.getItem("emergencyContact");

    const message =
        document.getElementById("contacts-message");

    if (savedContact) {

        message.innerHTML =
            `Trusted Contact:<br>${savedContact}`;

    } else {

        message.innerHTML =
            "No emergency contact has been added yet. Add one in your profile.";

    }
}


/* =========================
   LOCATION
========================= */

function getLocation() {

    const message =
        document.getElementById("location-message");

    if (!navigator.geolocation) {

        message.innerText =
            "Location is not supported by this browser.";

        return;
    }

    message.innerText =
        "Requesting your location...";

    navigator.geolocation.getCurrentPosition(

        function(position) {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;

            const mapsURL =
                `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

            message.innerHTML = `
                Location detected.
                <br><br>
                <a href="${mapsURL}" target="_blank">
                    Open my location in Google Maps →
                </a>
            `;

        },

        function() {

            message.innerText =
                "Location permission was not granted.";

        }
    );
}


/* =========================
   SITUATION
========================= */

function showSituationAnswer() {

    document.getElementById("situation-answer").innerHTML = `
        Consider contacting someone you trust, sharing your
        trip/location when appropriate, asking the driver to
        stop in a public place, and using emergency services
        if you believe you are in immediate danger.
    `;

}


/* =====================================================
   QUIZ
===================================================== */

const quizQuestions = [

    {
        question:
            "You feel that someone is following you while walking home. What is a safer first response?",

        options: [
            "Confront them immediately",
            "Move towards a populated or safer place",
            "Continue into a quieter street",
            "Hide somewhere alone"
        ],

        answer: 1
    },

    {
        question:
            "You are travelling alone at night. Which preparation is most useful?",

        options: [
            "Keep your phone switched off",
            "Tell nobody where you are going",
            "Keep your phone charged and important contacts accessible",
            "Avoid carrying identification"
        ],

        answer: 2
    },

    {
        question:
            "A cab driver takes an unexpected route. What should you consider doing?",

        options: [
            "Ignore it completely",
            "Share your concern/location with someone you trust",
            "Turn off your phone",
            "Move to the front and argue"
        ],

        answer: 1
    },

    {
        question:
            "Which number is India's pan-India emergency number?",

        options: [
            "100",
            "101",
            "112",
            "108"
        ],

        answer: 2
    },

    {
        question:
            "What should you do if an unfamiliar person asks for sensitive personal information online?",

        options: [
            "Share everything",
            "Verify the person first",
            "Send your passwords",
            "Send your live location immediately"
        ],

        answer: 1
    },

    {
        question:
            "What is one useful reason to keep an emergency contact ready?",

        options: [
            "To receive advertisements",
            "To have someone you trust to contact when needed",
            "To share passwords",
            "To replace emergency services"
        ],

        answer: 1
    },

    {
        question:
            "If you feel unsafe in a public place, which option is generally preferable?",

        options: [
            "Move towards people or staff",
            "Go somewhere isolated",
            "Switch off your phone",
            "Wait silently in an empty area"
        ],

        answer: 0
    },

    {
        question:
            "What is the purpose of a safety checklist?",

        options: [
            "To guarantee nothing bad can happen",
            "To help you prepare for a journey",
            "To replace emergency services",
            "To track another person's location"
        ],

        answer: 1
    },

    {
        question:
            "Why is learning about legal rights useful?",

        options: [
            "It guarantees a legal result",
            "It can improve basic awareness of protections and resources",
            "It replaces a lawyer",
            "It means you never need official sources"
        ],

        answer: 1
    },

    {
        question:
            "If you believe you are in immediate danger, what should you prioritise?",

        options: [
            "Winning an argument",
            "Posting about it online",
            "Getting to safety and seeking appropriate emergency help",
            "Ignoring the situation"
        ],

        answer: 2
    }

];


let currentQuestion = 0;
let quizScore = 0;
let selectedAnswer = null;


function loadQuestion() {

    const question =
        quizQuestions[currentQuestion];

    document.getElementById("question-number")
        .innerText = currentQuestion + 1;

    document.getElementById("quiz-question")
        .innerText = question.question;

    const optionsContainer =
        document.getElementById("quiz-options");

    optionsContainer.innerHTML = "";

    selectedAnswer = null;

    document.getElementById("next-question")
        .disabled = true;

    question.options.forEach(
        function(option, index) {

            const button =
                document.createElement("button");

            button.className =
                "quiz-option";

            button.innerText = option;

            button.onclick = function() {

                selectAnswer(index, button);

            };

            optionsContainer.appendChild(button);
        }
    );
}


function selectAnswer(index, button) {

    selectedAnswer = index;

    document.querySelectorAll(".quiz-option")
        .forEach(function(option) {

            option.classList.remove("selected");

        });

    button.classList.add("selected");

    document.getElementById("next-question")
        .disabled = false;
}


function nextQuestion() {

    if (selectedAnswer === null) return;

    const correctAnswer =
        quizQuestions[currentQuestion].answer;

    if (selectedAnswer === correctAnswer) {

        quizScore++;

    }

    currentQuestion++;

    if (currentQuestion < quizQuestions.length) {

        loadQuestion();

    } else {

        showQuizResult();

    }
}


function showQuizResult() {

    document.querySelector(".quiz-card").innerHTML = `

        <div class="quiz-result">

            <p class="eyebrow">QUIZ COMPLETE</p>

            <h2>
                You scored ${quizScore}/10
            </h2>

            <p>
                ${
                    quizScore >= 8
                    ? "Great job. You have a strong awareness of basic safety situations."
                    : quizScore >= 5
                    ? "Good start. A little more awareness and preparation can help."
                    : "Use the awareness sections above to learn more and try again."
                }
            </p>

            <br>

            <button
                onclick="restartQuiz()"
                class="primary-btn">

                Try Again

            </button>

        </div>

    `;
}


function restartQuiz() {

    currentQuestion = 0;
    quizScore = 0;

    location.reload();

}


/* Start quiz */

loadQuestion();


/* =========================
   SAFETY TIMER / ALARM
========================= */

function openAlarm() {

    const message =
        document.getElementById("timer-message");

    message.innerHTML = `
        For a real alarm, use your device's Clock/Alarm app.
        <br><br>
        <button
            onclick="tryOpenClock()"
            class="outline-btn">

            Try Opening Alarm

        </button>
    `;
}


function tryOpenClock() {

    /*
       Browsers do not have one universal command
       that opens the native Clock app on every device.
    */

    alert(
        "Please open your phone's Clock/Alarm app and set a check-in reminder."
    );
}


/* =========================
   MEDICAL CARD
========================= */

function showMedicalCard() {

    const name =
        localStorage.getItem("profileName") || "Not added";

    const blood =
        localStorage.getItem("profileBlood") || "Not added";

    const allergies =
        localStorage.getItem("profileAllergies") || "Not added";

    const contact =
        localStorage.getItem("emergencyContact") || "Not added";

    document.getElementById("medical-message").innerHTML = `

        <strong>Emergency Card</strong><br><br>

        Name: ${name}<br>
        Blood Group: ${blood}<br>
        Allergies: ${allergies}<br>
        Emergency Contact: ${contact}

    `;
}


/* =========================
   QUICK EXIT
========================= */

function quickExit() {

    window.location.replace(
        "https://www.google.com"
    );

}


/* =========================
   PROFILE
========================= */

function saveProfile(event) {

    event.preventDefault();

    const name =
        document.getElementById("profile-name").value;

    const email =
        document.getElementById("profile-email").value;

    const phone =
        document.getElementById("profile-phone").value;

    const contact =
        document.getElementById("profile-contact").value;

    const blood =
        document.getElementById("profile-blood").value;

    const allergies =
        document.getElementById("profile-allergies").value;


    /*
       Demo storage only.
       Nothing is sent to a server.
    */

    localStorage.setItem("profileName", name);
    localStorage.setItem("profileEmail", email);
    localStorage.setItem("profilePhone", phone);
    localStorage.setItem("emergencyContact", contact);
    localStorage.setItem("profileBlood", blood);
    localStorage.setItem("profileAllergies", allergies);


    document.getElementById("profile-result").innerHTML = `
        Profile saved on this browser for demonstration.
        No information was sent to a server.
    `;
}


/* =========================
   LOGIN
========================= */

function openLogin() {

    document
        .getElementById("login-modal")
        .classList.add("open");

}


function closeLogin() {

    document
        .getElementById("login-modal")
        .classList.remove("open");

}


function demoLogin() {

    const email =
        document.getElementById("login-email").value;

    if (!email) {

        document.getElementById("login-result").innerText =
            "Please enter your email.";

        return;
    }

    document.getElementById("login-result").innerHTML = `
        Demo login successful.
        <br>
        Your information has not been sent anywhere.
    `;
}


/* =========================
   FEEDBACK
========================= */

function giveFeedback(value) {

    const messages = {

        1: "Thanks for being honest. We'll use this feedback.",
        2: "Thanks. We'll keep improving it.",
        3: "Glad it was useful.",
        4: "Thank you! We're glad WalkWithMe helped."

    };

    document.getElementById("feedback-message")
        .innerText = messages[value];

}


/* =====================================================
   WALKWITHME ASSISTANT
===================================================== */

function toggleAssistant() {

    document
        .getElementById("assistant-panel")
        .classList.toggle("open");

}


function addAssistantMessage(message) {

    const container =
        document.getElementById("assistant-messages");

    const div =
        document.createElement("div");

    div.className =
        "assistant-message";

    div.innerText =
        message;

    container.appendChild(div);

    container.scrollTop =
        container.scrollHeight;
}


function assistantAnswer(topic) {

    const answers = {

        emergency:
            "The Emergency section gives you access to 112, your emergency contacts and the Shake Alert option. Remember that the website itself does not contact emergency services automatically.",

        quiz:
            "Scroll to the Awareness section and start the Safety Quiz. Select an answer and use Next Question. Your score is shown after all 10 questions.",

        fakecall:
            "The Fake Call tool displays a simulated incoming-call interface. It is designed as an exit-support feature, not as a real phone call.",

        location:
            "The Places section provides quick searches for police stations, hospitals, pharmacies and other useful locations. You can also allow browser location access to open your position in Google Maps.",

        profile:
            "The Profile section lets you enter emergency information for this demonstration. The information is stored only in your browser using localStorage and is not sent to a server."

    };

    addAssistantMessage(
        answers[topic]
    );
}


function sendAssistantMessage() {

    const input =
        document.getElementById("assistant-input");

    const question =
        input.value.trim().toLowerCase();

    if (!question) return;

    addAssistantMessage(
        "You: " + input.value
    );

    let answer =
        "I can currently explain the Emergency, Quiz, Fake Call, Places and Profile sections of WalkWithMe.";

    if (
        question.includes("sos") ||
        question.includes("emergency") ||
        question.includes("112")
    ) {

        answer =
            "The Emergency section provides access to 112, emergency contacts and Shake Alert.";

    } else if (
        question.includes("quiz")
    ) {

        answer =
            "The Safety Quiz contains 10 questions. Select an answer and continue through the questions to see your final score.";

    } else if (
        question.includes("fake") ||
        question.includes("call")
    ) {

        answer =
            "Fake Call creates a simulated incoming-call screen. It does not make a real call.";

    } else if (
        question.includes("place") ||
        question.includes("location") ||
        question.includes("map")
    ) {

        answer =
            "The Places section lets you search for police stations, hospitals, pharmacies and other useful locations.";

    } else if (
        question.includes("profile") ||
        question.includes("login")
    ) {

        answer =
            "Login and Profile are demonstration features. Your profile information is stored locally in the browser and is not sent to a server.";

    } else if (
        question.includes("timer") ||
        question.includes("alarm")
    ) {

        answer =
            "Safety Timer reminds you to use your device's Clock/Alarm app for a check-in reminder.";

    }

    setTimeout(function() {

        addAssistantMessage(answer);

    }, 250);

    input.value = "";
}


/* =====================================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
===================================================== */

document
    .getElementById("login-modal")
    .addEventListener("click", function(event) {

        if (event.target === this) {

            closeLogin();

        }

    });