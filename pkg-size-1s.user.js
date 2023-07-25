// ==UserScript==
// @name         pkg-size-1s
// @namespace    https://github.com/mefengl
// @version      0.2.2
// @description  Adds button to NPM package pages direct to pkg-size.dev for npm package size check. It now also works on Github repositories.
// @author       mefengl
// @match        https://www.npmjs.com/package/*
// @match        https://github.com/*/*
// @grant        none
// @license      MIT
// ==/UserScript==

(() => {
  'use strict';

  const svgIcon = `<svg viewBox="0 0 24 24" width="1em" height="1em" class="inline"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14M16.5 9.4L7.55 4.24"></path><path d="M3.29 7L12 12l8.71-5M12 22V12"></path><circle cx="18.5" cy="15.5" r="2.5"></circle><path d="M20.27 17.27L22 19"></path></g></svg>`;

  const debounce = (func, delay) => {
    let debounceTimer;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    }
  }

  const createButton = (parent, href, className, styles, innerHTML) => {
    const anchor = document.createElement('a');
    Object.assign(anchor.style, styles);
    anchor.href = href;
    anchor.className = className;
    anchor.innerHTML = innerHTML;
    parent.appendChild(anchor);
  }

  const createButtonNPM = packageName => {
    const parent = document.querySelector(".w-third-l");
    const newElement = parent?.lastElementChild.cloneNode(true);
    const anchor = newElement?.querySelector("a");

    if (anchor) {
      Object.assign(anchor.style, { backgroundColor: '#FFF5DE', color: '#FF7251', borderColor: '#FF7251' });
      anchor.href = `https://pkg-size.dev/${packageName}`;
      anchor.innerHTML = `${svgIcon} <strong>Check</strong> Package Size`;
      parent?.appendChild(newElement);
    }
  }

  const handleGithub = pathname => {
    document.querySelector('.package-size-section')?.remove();

    const readmeFile = document.querySelector("#readme .markdown-body");
    const installCommands = [...readmeFile?.querySelectorAll('pre, code')].map(element => element.innerText.match(/(npm i|npm install|yarn add|pnpm add)(( -[^ ]+)* ([a-z0-9\-]+))+/gi)).filter(Boolean) || [];
    const packages = installCommands.flat().flatMap(command => command.split(' ').filter(word => !word.startsWith('-') && !['npm', 'i', 'install', 'yarn', 'add', 'pnpm'].includes(word)));

    const packageSection = [...document.querySelectorAll(".BorderGrid-row")].find(row => row.querySelector('h2')?.innerText.includes('Packages'));
    if (packageSection && packages.length) {
      const newSection = packageSection.cloneNode(true);
      newSection.classList.add('package-size-section');
      newSection.querySelector('h2').innerHTML = 'Package Size';

      const content = newSection.querySelector('.BorderGrid-cell');
      while (content.childElementCount > 1) content.removeChild(content.lastChild);

      const lastChild = content.appendChild(document.createElement('div'));
      lastChild.className = 'text-small color-fg-muted';
      lastChild.innerHTML = 'Check packages size mentioned in README';

      const buttonContainer = content.appendChild(document.createElement('div'));
      buttonContainer.className = 'f6 mt-3';
      packages.forEach(packageName => createButton(buttonContainer, `https://pkg-size.dev/${packageName}`, "topic-tag topic-tag-link", { backgroundColor: '#FFF5DE', color: '#FF7251' }, packageName));

      packageSection.parentNode.insertBefore(newSection, packageSection.nextSibling);
    }
  }

  const onUrlChange = debounce(() => {
    const { host, pathname } = window.location;
    const packageName = pathname.split('/')[2];

    if (host === 'www.npmjs.com') createButtonNPM(packageName);
    if (host === 'github.com') handleGithub(pathname);
  }, 200);

  ['pushState', 'replaceState'].forEach(eventType => {
    history[eventType] = ((original) => function () {
      const result = original.apply(this, arguments);
      window.dispatchEvent(new Event(eventType));
      window.dispatchEvent(new Event('locationchange'));
      return result;
    })(history[eventType]);
  });

  window.addEventListener('locationchange', onUrlChange);
  onUrlChange();
})();
