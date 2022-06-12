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

if (prefersDark.trim() === 'true') {
  themeInputs[1].checked = true;
} else {
  themeInputs[0].checked = true;
}

const initialState = '0';
const themes = ['light-theme', 'dark-theme', 'cool-theme'];
const themeValues = {
  'light-theme': 'light',
  'dark-theme': 'dark',
  'cool-theme': 'cool',
};

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
    result.classList.remove('result-calculated');
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
  result.innerHTML = initialState;
}

function handleDelete() {
  if (isAtInitialState()) {
    return;
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
    result.innerHTML = initialState; // Handle cases like zero division
    return;
  }
  const resultStr = String(eval(calculationStr));
  result.innerHTML = '';
  result.classList.add('result-calculated');
  for (let i = 0; i < resultStr.length; i++) {
    const numberTextEl = document.createElement('span');
    numberTextEl.classList.add('number-text');
    numberTextEl.innerText = resultStr[i];
    result.appendChild(numberTextEl);
  }
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
  document.documentElement.dataset.theme = themeValues[newTheme];
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
