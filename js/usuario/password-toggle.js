
function initPasswordToggles() {
  document.querySelectorAll(".form-toggle-visibility").forEach((button) => {
    button.addEventListener("click", () => {
      const input = document.getElementById(button.dataset.target);
      const icon = button.querySelector("i");
      if (!input) return;

      const isHidden = input.type === "password";
      input.type = isHidden ? "text" : "password";

      if (icon) {
        icon.classList.toggle("ph-eye", !isHidden);
        icon.classList.toggle("ph-eye-slash", isHidden);
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", initPasswordToggles);
