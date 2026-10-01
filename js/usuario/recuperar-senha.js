/* ===================================================
   RECUPERAR-SENHA.JS
   Comportamentos desta página:
   1) Ao enviar o formulário, o botão principal fica
      cinza (desabilitado) e aparece um timer de 60s.
   2) Quando o timer chega a zero, o botão "Reenviar
      e-mail" é liberado.
=================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("recuperar-senha-form");
  const submitButton = document.getElementById("submit-button");
  const resendSection = document.getElementById("resend-section");
  const resendButton = document.getElementById("resend-button");
  const countdownEl = document.getElementById("resend-countdown");

  const TEMPO_ESPERA = 60; // segundos
  let segundosRestantes = TEMPO_ESPERA;
  let intervaloId = null;

  /** Conta de 60 até 0, atualizando o número na tela a cada segundo. */
  function iniciarContagem() {
    segundosRestantes = TEMPO_ESPERA;
    countdownEl.textContent = segundosRestantes;
    resendButton.disabled = true;

    // Evita ter dois contadores rodando ao mesmo tempo, caso o
    // usuário clique em "Reenviar" mais de uma vez rapidamente
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

    // Deixa o botão principal cinza (o estilo vem do CSS, via :disabled)
    submitButton.disabled = true;

    // Mostra o bloco do timer + botão de reenvio e começa a contagem
    resendSection.hidden = false;
    iniciarContagem();
  });

  resendButton.addEventListener("click", () => {
    alert("E-mail reenviado!");
    iniciarContagem();
  });
});
