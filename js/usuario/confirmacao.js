/* ===================================================
   CONFIRMACAO.JS
   Comportamentos que só existem na tela de Confirmação
   de código: navegação automática entre os 6 campos de
   dígito, colar o código inteiro de uma vez, e o envio
   do formulário.
=================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const inputs = Array.from(document.querySelectorAll(".code-input"));

  // Já deixa o cursor pronto no primeiro campo
  if (inputs[0]) inputs[0].focus();

  inputs.forEach((input, index) => {

    // Aceita só números e no máximo 1 dígito por campo
    input.addEventListener("input", () => {
      input.value = input.value.replace(/\D/g, "").slice(0, 1);

      // Se digitou algo, pula pro próximo campo automaticamente
      if (input.value && index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
    });

    // Backspace num campo vazio volta o foco pro campo anterior
    input.addEventListener("keydown", (event) => {
      if (event.key === "Backspace" && !input.value && index > 0) {
        inputs[index - 1].focus();
      }
    });

    // Permite colar o código de 6 dígitos inteiro em qualquer campo
    input.addEventListener("paste", (event) => {
      const pasted = (event.clipboardData || window.clipboardData)
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, inputs.length);

      if (!pasted) return;
      event.preventDefault();

      pasted.split("").forEach((digit, i) => {
        if (inputs[i]) inputs[i].value = digit;
      });

      // Foca o próximo campo vazio (ou o último, se todos foram preenchidos)
      const nextEmpty = inputs.findIndex((el) => !el.value);
      inputs[nextEmpty === -1 ? inputs.length - 1 : nextEmpty].focus();
    });
  });

  // Botão "Confirmar"
  const form = document.getElementById("confirmacao-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const codigo = inputs.map((el) => el.value).join("");
    if (codigo.length < inputs.length) {
      alert("Preencha todos os 6 dígitos do código.");
      return;
    }

    alert(`Código confirmado!`);
    window.location.href = "dashboard.html";

  });

  // Botão "Reenviar código"
  const resendButton = document.getElementById("resend-code");
  resendButton.addEventListener("click", () => {
    alert("Código reenviado!");
  });

  // Link "Voltar" — volta pra página anterior do navegador
  const backLink = document.getElementById("voltar-link");
  backLink.addEventListener("click", (event) => {
    event.preventDefault();
    history.back();
  });
});
