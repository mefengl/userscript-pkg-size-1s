// ==UserScript==
// @name         I do care about pkg-size
// @namespace    https://github.com/mefengl
// @version      0.0.1
// @description  Adds button to NPM package pages direct to pkg-size.dev for npm package size check.
// @author       mefengl
// @match        https://www.npmjs.com/package/*
// @grant        none
// @license      MIT
// ==/UserScript==

(() => {
  'use strict';
  const packageName = window.location.pathname.split('/')[2];
  let parent = document.querySelector(".w-third-l");
  if (parent) {
    let newElement = parent.lastElementChild?.cloneNode(true);
    let anchor = newElement?.querySelector("a");
    if (anchor) {
      Object.assign(anchor.style, { backgroundColor: '#FFF5DE', color: '#FF7251', borderColor: '#FF7251' });
      anchor.href = `https://pkg-size.dev/${packageName}`;
      anchor.innerHTML = `<svg viewBox="0 0 24 24" width="1.5em" height="1.5em" class="inline"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14M16.5 9.4L7.55 4.24"></path><path d="M3.29 7L12 12l8.71-5M12 22V12"></path><circle cx="18.5" cy="15.5" r="2.5"></circle><path d="M20.27 17.27L22 19"></path></g></svg> Check Package Size`;
      parent.appendChild(newElement);
    }
  }
})();
