const scope = document.getElementById("scope");
const content = document.querySelector('.content');
let x, y, offsetX, offsetY, isDragging = false;
const padding = 100; // Padding in px

function updateClipPath() {
  const rect = scope.getBoundingClientRect();
  const insetTop = rect.top;
  const insetRight = window.innerWidth - rect.right - padding;
  const insetBottom = window.innerHeight - rect.bottom - padding;
  const insetLeft = rect.left;
  content.style.clipPath = `inset(${Math.max(0, insetTop)}px ${Math.max(0, insetRight)}px ${Math.max(0, insetBottom)}px ${Math.max(0, insetLeft)}px)`;
}

function centerScope() {
  const scopeWidth = scope.offsetWidth;
  const scopeHeight = scope.offsetHeight;
  const centerX = (window.innerWidth - scopeWidth) / 2;
  const centerY = (window.innerHeight - scopeHeight) / 2;
  scope.style.left = `${centerX}px`;
  scope.style.top = `${centerY}px`;
  updateClipPath();
}

document.addEventListener("mousemove", (e) => {
  x = e.clientX;
  y = e.clientY;
  if (isDragging) {
    const newX = x - offsetX;
    const newY = y - offsetY;

    const maxX = window.innerWidth - scope.offsetWidth;
    const maxY = window.innerHeight - scope.offsetHeight;

    const finalX = Math.min(Math.max(0, newX), maxX);
    const finalY = Math.min(Math.max(0, newY), maxY);

    scope.style.left = `${finalX}px`;
    scope.style.top = `${finalY}px`;

    updateClipPath();
  }
});

document.onmouseup = () => {
  isDragging = false;
  scope.style.cursor = "grab";
};

scope.onmousedown = (e) => {
  e.preventDefault();
  isDragging = true;
  offsetX = e.clientX - scope.getBoundingClientRect().left;
  offsetY = e.clientY - scope.getBoundingClientRect().top;
  scope.style.cursor = "grabbing";
};

window.onload = centerScope;
window.onresize = centerScope;
