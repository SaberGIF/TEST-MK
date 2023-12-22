const DEFAULT_ELEMENT_DATA = {
  element: null,
  isActive: false,
  positionX: 0,
  positionY: 0,
}

let currentTarget = { ...DEFAULT_ELEMENT_DATA };

function mousemoveHandler(event) {
  currentTarget.element.style.left = event.clientX;
  currentTarget.element.style.top = event.clientY;
}

function swapElements(currentElement, nextElement) {
  const nextElementPositionX = nextElement.getBoundingClientRect().left;
  const nextElementPositionY = nextElement.getBoundingClientRect().top;

  currentElement.style.left = nextElementPositionX;
  currentElement.style.top = nextElementPositionY;
  nextElement.style.left = currentTarget.positionX;
  nextElement.style.top = currentTarget.positionY;
}

function isOverlapping(elem1, elem2) {
  const rect1 = elem1.getBoundingClientRect();
  const rect2 = elem2.getBoundingClientRect();

  return !(
    rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom
  );
}

function findOverlappedElement(currentElement) {
  let selectedElement = null;

  document.querySelectorAll('.draggable')
    .forEach((element) => {
      if (element !== currentElement && isOverlapping(currentElement, element)) {
        selectedElement = element;
        selectedElement.style.position = 'absolute';
      }
    });
  
  return selectedElement;
}

function makeDraggable({ target }) {
  if(currentTarget.isActive) {
    document.removeEventListener('mousemove', mousemoveHandler);

    const overlappedElement = findOverlappedElement(currentTarget.element);

    if (overlappedElement) {
      swapElements(currentTarget.element, overlappedElement);
    }

    currentTarget = { ...DEFAULT_ELEMENT_DATA };

    return;
  }
  
  target.style.position = 'absolute';
  currentTarget.positionX = target.offsetLeft;
  currentTarget.positionY = target.offsetTop;
  currentTarget.element = target;
  currentTarget.isActive = true;
  
  document.addEventListener('mousemove', mousemoveHandler);
}

document.addEventListener('DOMContentLoaded', () => {
  document
    .getElementById('submitButton')
    .addEventListener('click', () => {
      const text = document.getElementById('inputText').value;
      const displayArea = document.getElementById('displayText');

      document.getElementById('inputText').value = '';
      displayArea.innerHTML = '';

      text.split('').forEach((char) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.classList.add('draggable');
        span.style.position = 'relative';
        displayArea.appendChild(span);
        span.addEventListener('click', makeDraggable)
      });
    });
});
