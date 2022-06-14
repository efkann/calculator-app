const initialState = '0';

const result = document.querySelector('.result-text');
const numberKeys = document.querySelectorAll('.key-number');
const operatorKeys = document.querySelectorAll('.key-operator');
const decPointKey = document.querySelector('.key-decimal');
const deleteKey = document.querySelector('.key-del');
const resetKey = document.querySelector('.key-reset');
const equalsKey = document.querySelector('.key-equal');
const themeInputs = document.querySelectorAll('.theme-input');

const prefersDark = getComputedStyle(document.documentElement).getPropertyValue(
  '--prefers-dark'
);
const prefersTheme = localStorage.getItem('userTheme');
const themes = ['light', 'dark', 'cool'];

if (prefersTheme !== null) {
  document.documentElement.dataset.theme = prefersTheme;
  themeInputs[themes.indexOf(prefersTheme)].checked = true;
} else if (prefersDark.trim() === 'true') {
  themeInputs[1].checked = true;
} else {
  themeInputs[0].checked = true;
}

function resetResultText() {
  result.classList.remove('result-calculated');
  result.removeAttribute('tabindex');
  result.removeAttribute('aria-label');
}

function writeToScreen(data) {
  result.innerHTML = data;
}

function isAtInitialState() {
  return result.innerHTML === initialState;
}

function appendToScreen(data) {
  if (result.innerHTML === initialState) {
    writeToScreen(data);
    return;
  }
  if (result.classList.contains('result-calculated')) {
    resetResultText();
    if (!data.includes('operator-text')) {
      writeToScreen(data);
    } else {
      result.innerHTML += data;
    }
  } else {
    result.innerHTML += data;
  }
}
function handleReset() {
  if (isAtInitialState()) {
    return;
  }
  if (result.classList.contains('result-calculated')) {
    resetResultText();
  }
  result.innerHTML = initialState;
}

function handleDelete() {
  if (isAtInitialState()) {
    return;
  }
  if (result.classList.contains('result-calculated')) {
    resetResultText();
  }
  if (result.innerText.length === 1) {
    result.innerHTML = initialState;
    return;
  }
  if (result.lastElementChild !== null) {
    result.lastElementChild.remove();
  }
}

function handleOperatorCases(operator, operatorTextEl) {
  const lastOperator = result?.lastElementChild?.innerText;
  if (isAtInitialState() && operator !== '-') {
    return;
  }
  if (lastOperator === '+' && operator === '-') {
    result.lastElementChild.innerText = '-';
    return;
  } else if (lastOperator === '-' && operator === '+') {
    result.lastElementChild.innerText = '+';
    return;
  } else if (['x', '/'].includes(lastOperator) && operator === '-') {
    appendToScreen(operatorTextEl.outerHTML);
    return;
  } else if (['-', '+', 'x', '/'].includes(lastOperator) && operator) {
    return;
  }
  appendToScreen(operatorTextEl.outerHTML);
}

function handleEquals() {
  if (
    result.innerText.length === 1 ||
    !result.innerHTML.includes('operator-text')
  ) {
    return;
  }
  const calculationStr = result.innerText.replace(/x/g, '*');
  if (isNaN(eval(calculationStr)) || !isFinite(eval(calculationStr))) {
    result.innerHTML = initialState; // Avoid zero division and infinity
    return;
  }
  const resultStr = String(eval(calculationStr)); // I'm lazy so, eval works.
  result.innerHTML = '';
  result.classList.add('result-calculated');
  result.setAttribute('tabindex', 0);
  result.setAttribute('aria-label', 'Calculated result is ' + resultStr);
  for (let i = 0; i < resultStr.length; i++) {
    const numberTextEl = document.createElement('span');
    numberTextEl.classList.add('number-text');
    numberTextEl.innerText = resultStr[i];
    result.appendChild(numberTextEl);
  }
  result.focus();
}

function handleDecimalPoint() {
  const numberTextEl = document.createElement('span');
  numberTextEl.classList.add('number-text');
  numberTextEl.innerText = decPointKey.innerText;
  if (result?.lastElementChild?.innerText === '.') {
    return; // There cant be two decimal points side to side.
  }
  appendToScreen(numberTextEl.outerHTML);
}

function switchTheme(newTheme) {
  document.documentElement.dataset.theme = newTheme;
  localStorage.setItem('userTheme', newTheme);
}

resetKey.addEventListener('click', handleReset);
deleteKey.addEventListener('click', handleDelete);
equalsKey.addEventListener('click', handleEquals);
decPointKey.addEventListener('click', handleDecimalPoint);

for (const numberKey of numberKeys) {
  const numberTextEl = document.createElement('span');
  numberTextEl.classList.add('number-text');
  numberTextEl.innerText = numberKey.innerText;
  numberKey.addEventListener('click', () =>
    appendToScreen(numberTextEl.outerHTML)
  );
}
for (const operatorKey of operatorKeys) {
  const operator = operatorKey.innerText;
  const operatorTextEl = document.createElement('span');
  operatorTextEl.classList.add('operator-text');
  operatorTextEl.innerText = operatorKey.innerText;
  operatorKey.addEventListener('click', () =>
    handleOperatorCases(operator, operatorTextEl)
  );
}
for (const themeInput of themeInputs) {
  themeInput.addEventListener('change', (e) => {
    switchTheme(e.target.value);
  });
}
