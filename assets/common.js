function getDeviceType() {
  const ua = navigator.userAgent;

  if (/mobile/i.test(ua)) {
    return "Mobile";
  } else if (/tablet/i.test(ua)) {
    return "Tablet";
  } else {
    return "Desktop";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (getDeviceType() !== "Desktop") {
    const disableWarning = document.body.getAttribute("data-disable-warning");
    if (disableWarning === "true") return;
    
    if (location.pathname !== "/") {
      location.href = "/";
    }
    const warning = document.getElementById("warning");
    if (warning) {
      warning.checked = true;
    }
  }
});

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
