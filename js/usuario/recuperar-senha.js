
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("recuperar-senha-form");
  const submitButton = document.getElementById("submit-button");
  const resendSection = document.getElementById("resend-section");
  const resendButton = document.getElementById("resend-button");
  const countdownEl = document.getElementById("resend-countdown");

  const TEMPO_ESPERA = 60;
  let segundosRestantes = TEMPO_ESPERA;
  let intervaloId = null;

  function iniciarContagem() {
    segundosRestantes = TEMPO_ESPERA;
    countdownEl.textContent = segundosRestantes;
    resendButton.disabled = true;

    clearInterval(intervaloId);

    intervaloId = setInterval(() => {
      segundosRestantes--;
      countdownEl.textContent = segundosRestantes;

      if (segundosRestantes <= 0) {
        clearInterval(intervaloId);
        resendButton.disabled = false;
      }
    }, 1000);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    submitButton.disabled = true;

    resendSection.hidden = false;
    iniciarContagem();
  });

  resendButton.addEventListener("click", () => {
    alert("E-mail reenviado!");
    iniciarContagem();
  });
});
