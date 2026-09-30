document.addEventListener("DOMContentLoaded", () => {
  const inputs = Array.from(document.querySelectorAll(".code-input"));

  if (inputs[0]) inputs[0].focus();

  inputs.forEach((input, index) => {

    
    input.addEventListener("input", () => {
      input.value = input.value.replace(/\D/g, "").slice(0, 1);

      if (input.value && index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
    });

  
    input.addEventListener("keydown", (event) => {
      if (event.key === "Backspace" && !input.value && index > 0) {
        inputs[index - 1].focus();
      }
    });

  
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

      
      const nextEmpty = inputs.findIndex((el) => !el.value);
      inputs[nextEmpty === -1 ? inputs.length - 1 : nextEmpty].focus();
    });
  });

  
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

  
  const resendButton = document.getElementById("resend-code");
  resendButton.addEventListener("click", () => {
    alert("Código reenviado!");
  });

  
  const backLink = document.getElementById("voltar-link");
  backLink.addEventListener("click", (event) => {
    event.preventDefault();
    history.back();
  });
});
