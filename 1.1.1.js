"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const $ = selector => document.querySelector(selector);

    // Navigation bar scroll activation
    const navbar = $("nav");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 10) {
            navbar.classList.add("nav-show");
        }
        else {
            navbar.classList.remove("nav-show");
        }
    });

    // Click logo to return to landing page
    const logos = document.querySelectorAll('img[src="images/embellishments/logo_transparent.png"]');

    logos.forEach(logo => {
        logo.addEventListener("click", () => {
            window.location.href = "index.html"
        });
    });

    // Set Up Subpage Navigation
    const subpages = [$("#subpage-1"), $("#subpage-2"), $("#subpage-3"), $("#subpage-4"), $("#subpage-5")];
    subpages.forEach(subpage => {
        subpage.classList.add("hidden");
    });

    subpages[0].classList.remove("hidden");
    let currentIndex = 0;
    console.log(`current subpage = ${currentIndex + 1}`)

    const back = $("#back-button");
    const next = $("#next-button");
    let gameFinished = false;
    let nextDisabled = false;
    let warningShown = false;

    back.addEventListener("click", () => {
        if (currentIndex === 0) {
            window.location.href = "lessons.html";
        }
        else if (currentIndex >= 3) {
            if (warningShown === false) {
                window.alert("Are you sure? Going back will reset your game process!");
                warningShown = true;
            }
            else {
                resetGame();
                subpages[currentIndex].classList.add("hidden");
                currentIndex--;
                subpages[currentIndex].classList.remove("hidden");
                console.log(`current subpage = ${currentIndex + 1}`)
                nextDisabled = false;
            }
        }
        else if (currentIndex === 4 && gameFinished) {
            /* if game is finished and user selects "back", this code
            returns them not to the game subpage, but the subpage before it */ 
            subpages[currentIndex].classList.add("hidden");
            currentIndex = 2;
            subpages[currentIndex].classList.remove("hidden");
            console.log(`current subpage = ${currentIndex + 1}`)
            nextDisabled = false;
        }
        else {
            subpages[currentIndex].classList.add("hidden");
            currentIndex--;
            subpages[currentIndex].classList.remove("hidden");
            console.log(`current subpage = ${currentIndex + 1}`)
            nextDisabled = false;
        }
    });
    
    next.addEventListener("click", () => {
        if (!nextDisabled) {
            if (currentIndex === 4) {
                window.location.href = "lessons.html";
            }
            else if (currentIndex === 3 && !gameFinished) {
                nextDisabled = true;
            }
            else if (currentIndex === 2 && gameFinished) {
                /* if the game is finished and the user goes back,
                this code allows them to skip forward without having to redo the game */
                subpages[currentIndex].classList.add("hidden");
                currentIndex = 4;
                subpages[currentIndex].classList.remove("hidden");
                console.log(`current subpage = ${currentIndex + 1}`)
            }
            else {
                subpages[currentIndex].classList.add("hidden");
                currentIndex++;
                subpages[currentIndex].classList.remove("hidden");
                console.log(`current subpage = ${currentIndex + 1}`);
                createQuestion();
            }
        }
    });

    // Set Up Responsive Voice
    const voices = ["Deutsch Male", "Deutsch Female"];

    // Pre-Load Voices
    responsiveVoice.speak("", "Deutsch Male", {volume:0});
    responsiveVoice.speak("", "Deutsch Female", {volume:0});

    function soundOff(audio) {
        const randomIndex = Math.floor(Math.random() * voices.length);
        const selectedVoice = voices[randomIndex];

        responsiveVoice.speak(audio, selectedVoice);
    };

    // Interactive SVG
    const derPics = document.getElementById("der-pic");

    derPics.addEventListener("load", () => {
        const svgDoc = derPics.contentDocument;
        const clickableParts = svgDoc.querySelectorAll("[data-clickable='true']");
        const voicedText = $("#voiced-words")

        const clickData = {
            grandfather: {german: "der Großvater", text: " = the grandfather"},
            student: {german: "der Student", text: " = the student"},
            german: {german: "der Deutsche", text: " = the German"},
            musician: {german: "der Musiker", text: " = the musician"},
            player: {german: "der Fußballspieler", text: " = the soccer player"},
        };

        Object.keys(clickData).forEach(id => {
            const data = svgDoc.getElementById(id);
                if (data) {
                    data.addEventListener("click", () => {
                        soundOff(clickData[id].german);
                        voicedText.textContent = clickData[id].german + clickData[id].text;
                    })
                };
        });
    });

    // Clickable Vocab Cards
    const vocabCardsData = Array.from(
        document.querySelectorAll(".speak"),
        td => td.textContent.trim()
    );
    const vocabCards = document.querySelectorAll("tr img");

    vocabCards.forEach((subpage, index) => {
        subpage.addEventListener("click", () => {
            soundOff(vocabCardsData[index]);
        });
    });

    // Set Up Correct Answer Animation
    function shoot() {
        confetti({
            spread: 360,
            ticks: 50,
            gravity: 0,
            decay: 0.94,
            startVelocity: 30,
            colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8'],
            particleCount: 40,
            scalar: 1.2,
            shapes: ['star']
        });
    };

    // Vocab Practice
    const correctSound = new Audio('sound_effects/match.mp3');
    correctSound.load();

    const vocabPic = $("#vocab-pic");
    const questionText = $("#question");
    const translationText = $("#translation");
    const answerBoxes = [$("#answer-1"), $("#answer-2"), $("#answer-3"), $("#answer-4")];
    let chosenWord;
    let chosenImg;
    let firstTry = true;

    const questionPool = [
        {id: "man", img: ["business.png", "success.png", "swede.png", "books.png"], correct: "der Mann", question: "Er ist...", answer: "Er ist der Mann.", translation: "He is the man."},
        {id: "teacher", img: ["correction.png", "blackboard.png", "e-learn.png", "florian.png"], correct: "der Lehrer", question: "Er ist...", answer: "Er ist der Lehrer.", translation: "He is the teacher."},
        {id: "boy", img: ["blocks.png", "toy.png", "monkeybars.png", "sled.png"], correct: "der Junge", question: "Er ist...", answer: "Er ist der Junge.", translation: "He is the boy."},
        {id: "dog", img: ["roomba.png", "scooby.png", "oldenglish.png", "jackrussel.png"], correct: "der Hund", question: "Das ist...", answer: "Das ist der Hund.", translation: "That is the dog."}
    ];
        
    const usedImages = [];
    const usedWords = [];

    function createQuestion() {
        if (currentIndex === 3) {
            const randomWordIndex = Math.floor(Math.random() * questionPool.length);
            chosenWord = questionPool[randomWordIndex];
            const randomImgIndex = Math.floor(Math.random() * questionPool[randomWordIndex].img.length);
            chosenImg = chosenWord.img[randomImgIndex];

            if (usedImages.includes(chosenImg)) {
                createQuestion();
                return;
            }
            else {
                if (usedWords.length === questionPool.length) {
                    usedWords.length = 0;
                }

                if (usedWords.includes(chosenWord)) {
                    createQuestion();
                    return;
                }
                else {
                    usedImages.push(chosenImg);
                    usedWords.push(chosenWord);

                    vocabPic.src = "images/vocab/" + chosenImg;
                    questionText.textContent = chosenWord.question;
                    translationText.textContent = "";
                    firstTry = true;
                }
            }
        }
    };

    const scoreBox = $("#score");
    let score = 0;
    let correctRevealed = false;

    answerBoxes.forEach(box => {
        box.addEventListener("click", () => { 
            if (!correctRevealed) {
                if (box.textContent !== chosenWord.correct) {
                    firstTry = false;
                    box.classList.add("incorrect");
                }
                else {
                    soundOff(chosenWord.answer);
                    box.classList.add("correct");
                    questionText.textContent = chosenWord.answer;
                    translationText.textContent = chosenWord.translation;
                    correctRevealed = true;
                    if (firstTry) {
                        shoot();
                        correctSound.play();
                        score++;
                        scoreBox.textContent = `Score: ${score}`;
                    }
                }
            }
        });
    });

    const nextQuestionButton = $("#next-q");
    const scoreTitle = $(".score-title");
    const scoreAvatar = $(".score-avatar")
    const avatar = localStorage.getItem("myAvatar")
    const scoreReport = $("#score-report");
    const messageText = $("#message");

    const messageOptions = ["Wow! You make this look easy.", "Look at you! Learning all these new words.", "Keep at it! Practice makes perfect.",
        "Don't worry. Language learning takes practice. Keep at it, and you'll get good in no time!"]
    
    const avatarChoices = {"dog": "images/avatars/dog_soccer.png", "bear": "images/avatars/bear_soccer.png", "rabbit": "images/avatars/rabbit_soccer.png"}

    const scoreTitleOptions = ["images/embellishments/ganz-toll.png", "images/embellishments/gut-gemacht.png", "images/embellishments/weiter-so.png"]

    nextQuestionButton.addEventListener("click", () => {
        if (correctRevealed) {
            if (currentIndex === 3) {
                if (usedImages.length === questionPool.length * 2) {
                    subpages[currentIndex].classList.add("hidden");
                    currentIndex++;
                    subpages[currentIndex].classList.remove("hidden");
                    scoreReport.textContent = `${score} of 8`;
                    
                    gameFinished = true;
                    nextDisabled = false;

                    scoreAvatar.src = avatarChoices[avatar];

                    if (score === 8) {
                        messageText.textContent = messageOptions[0];
                        scoreTitle.src = scoreTitleOptions[0];
                    }
                    else if (score >= 5) {
                        messageText.textContent = messageOptions[1];
                        scoreTitle.src = scoreTitleOptions[1];
                    }
                    else if (score >= 3) {
                        messageText.textContent = messageOptions[2];
                        scoreTitle.src = scoreTitleOptions[2];
                    }
                    else {
                        messageText.textContent = messageOptions[3];
                        scoreTitle.src = scoreTitleOptions[2];
                    }

                    let completedLessons = JSON.parse(localStorage.getItem("completedLessons"));

                    if (!completedLessons.includes("lesson1_1")) {
                        completedLessons.push("lesson1_1");
                    }

                    localStorage.setItem("completedLessons", JSON.stringify(completedLessons));
                }
                else {
                    correctRevealed = false;
                    answerBoxes.forEach(box => {
                        box.classList.remove("incorrect");
                        box.classList.remove("correct");
                    });
                    createQuestion();
                }
            }
        }
    });

    const tryAgain = $("#try-again");
    const continueButton = $("#continue");

    function resetGame() {
        gameFinished = false;
        nextDisabled = true;
        usedImages.length = 0;
        usedWords.length = 0;
        score = 0;
        scoreBox.textContent = `Score: ${score}`;
        correctRevealed = false;
        firstTry = true;
        answerBoxes.forEach(box => {
                    box.classList.remove("incorrect");
                    box.classList.remove("correct");
                });
    };

    tryAgain.addEventListener("click", () => {
        resetGame();
        createQuestion();
        subpages[currentIndex].classList.add("hidden")
        currentIndex = 3;
        subpages[currentIndex].classList.remove("hidden");
    });

});