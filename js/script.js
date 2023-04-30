const menuBtn = document.getElementById('menu-btn');
const menu = document.getElementById('menu');

const linkForm = document.getElementById('link-form');
const input = document.getElementById('link-input');
const errMsg = document.getElementById('err-msg');
const linkSubmitBtn = document.getElementById('link-submit');
const copyBtn = document.getElementById('copy-btn');

menuBtn.addEventListener('click', navToggle);
linkForm.addEventListener('submit', formSubmit);

// Mobile nav toggle
function navToggle() {
  menuBtn.classList.toggle('open');
  menu.classList.toggle('hidden');
}

// Form validation
function validURL(str) {
  let pattern = new RegExp(
    '^(https?:\\/\\/)?' +
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
      '((\\d{1,3}\\.){3}\\d{1,3}))' +
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
      '(\\?[;&amp;a-z\\d%_.~+=-]*)?' +
      '(\\#[-a-z\\d_]*)?$',
    'i'
  );

  return !!pattern.test(str);
}

// Form submit handler
function formSubmit(e) {
  e.preventDefault();

  const link = input.value;
  const url = `https://api.shrtco.de/v2/shorten?url=${link}`;

  if (link === '') {
    errMsg.innerHTML = 'Please enter something';

    input.classList.add('error');
  } else if (!validURL(link)) {
    errMsg.innerHTML = 'Please enter a valid URL';

    input.classList.add('error');
  } else {
    errMsg.innerHTML = '';
    input.classList.remove('error');

    fetch(url)
      .then((resp) => resp.json())
      .then(function (data) {
        const result = document.getElementById('result');
        const shortLink = data.result.short_link;
        const originalLink = data.result.original_link;

        const linkItem = `
        <div
        class="link-item"
      >
        <p class="original-link-text">
          ${originalLink}
        </p>
  
        <div
          class="link-result"
        >
          <p class="short-link-text" id="link-text">${shortLink}</p>
          <button id="copy-btn"
            class="copy-btn"
          >
            Copy
          </button>
        </div>
      </div>
        `;

        result.insertAdjacentHTML('beforeend', linkItem);
      });

    input.value = '';
  }
}

// Copy to clipboard
document.addEventListener('click', (e) => {
  if (e.target && e.target.id == 'copy-btn') {
    const copyBtn = document.getElementById('copy-btn');
    copyBtn.innerHTML = 'Copied!';
    copyBtn.style.backgroundColor = 'hsl(257, 27%, 26%)';
    const copyText = e.target.previousElementSibling.innerText;
    navigator.clipboard.writeText(copyText);

    // Reset button text and color
    setTimeout(() => {
      copyBtn.innerHTML = 'Copy';
      copyBtn.style.backgroundColor = 'hsl(180, 66%, 49%)';
    }, 2000);
  }
});
