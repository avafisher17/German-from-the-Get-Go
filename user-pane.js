"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const $ = selector => document.querySelector(selector);

    /* --- Navigation bar scroll activation --- */ 
    const navbar = $("nav");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 10) {
            navbar.classList.add("nav-show");
        }
        else {
            navbar.classList.remove("nav-show");
        }
    });

    /* --- Click logo to return to landing page --- */
    const logos = document.querySelectorAll('img[src="images/embellishments/logo_transparent.png"]');

    logos.forEach(logo => {
        logo.addEventListener("click", () => {
            window.location.href = "index.html"
        });
    });

    /* --- Select avatar with radio buttons --- */
    const radios = document.querySelectorAll('input[name="avatar"]');
    const avatar = $(".avatar");
    const checkedRadio = $('input[name="avatar"]:checked');
    const myAvatar = localStorage.getItem("myAvatar");
    
    if (myAvatar) {
        avatar.src = `images/avatars/${myAvatar}_avatar.png`;
        radios.forEach(radio => {
            radio.checked = (radio.value === myAvatar);
        });
    }
    else if (checkedRadio) {
        avatar.src = `images/avatars/${checkedRadio.value}_avatar.png`;
        localStorage.setItem("myAvatar", checkedRadio.value);
    }

    radios.forEach(radio => {
        radio.addEventListener('change', () => {
            avatar.src = `images/avatars/${radio.value}_avatar.png`;
            localStorage.setItem("myAvatar", radio.value);
        });
    });

    /* --- Generate random username --- */
    const germanUsernames = ["WurstKäseNario", "BratwurstBoss", "Sauerkrazy", "CurrywurstCrusader", "KartoffelKaiser", "PretzelPirate",
        "Oktober_Obsessed", "SauerkrautSlayer", "DönerDaddy", "WurstWizard", "BrandenBurger", "Ich_bin_Berliner", "Got95Theses_", "stream_more_mozart",
        "LederhosenLegend", "not_from_Bielefeld"
    ];

    const username = $("#username");

    function getOrSetUsername() {
        if (localStorage.getItem("myUsername") === null) {
            const randomIndex = Math.floor(Math.random() * germanUsernames.length);
            const randomNumber = Math.floor(Math.random() * 90) + 10;
            const randomUsername = germanUsernames[randomIndex] + randomNumber;
            username.textContent = randomUsername;
            localStorage.setItem("myUsername", randomUsername);
        }
        else {
            username.textContent = localStorage.getItem("myUsername");
        }
    }

    getOrSetUsername();
        
});