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
    
});