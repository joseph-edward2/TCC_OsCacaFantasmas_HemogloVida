/* ===================================================
   NOVA-SENHA.JS
   Comportamentos que só existem nesta página: validação
   ao vivo dos requisitos de senha e o envio do formulário.
   O botão de mostrar/ocultar senha vem de
   js/password-toggle.js (compartilhado com Login/Cadastro).
=================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const senha = document.getElementById("nova-senha");
  const confirmar = document.getElementById("confirmar-nova-senha");

  // Cada requisito tem um <li data-requirement="..."> correspondente no HTML
  const requirements = {
    length: document.querySelector('[data-requirement="length"]'),
    uppercase: document.querySelector('[data-requirement="uppercase"]'),
    lowercase: document.querySelector('[data-requirement="lowercase"]'),
    number: document.querySelector('[data-requirement="number"]'),
    special: document.querySelector('[data-requirement="special"]'),
    match: document.querySelector('[data-requirement="match"]'),
  };

  /** Troca a cor de um item da lista (verde se válido, vermelho se não). */
  function updateRequirement(item, isValid) {
    item.classList.toggle("requirement-item--valid", isValid);
    item.classList.toggle("requirement-item--invalid", !isValid);
  }

  /** Roda todas as verificações e atualiza a lista inteira. */
  function checkRequirements() {
    const value = senha.value;

    updateRequirement(requirements.length, value.length >= 8);
    updateRequirement(requirements.uppercase, /[A-Z]/.test(value));
    updateRequirement(requirements.lowercase, /[a-z]/.test(value));
    updateRequirement(requirements.number, /[0-9]/.test(value));
    updateRequirement(requirements.special, /[!@#$%^&*(),.?":{}|<>_\-+=[\]/\\;'`~]/.test(value));
    updateRequirement(requirements.match, value.length > 0 && value === confirmar.value);
  }

  // Reavalia a lista toda vez que qualquer um dos dois campos muda
  senha.addEventListener("input", checkRequirements);
  confirmar.addEventListener("input", checkRequirements);

  const form = document.getElementById("nova-senha-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const todosValidos = Object.values(requirements).every((item) =>
      item.classList.contains("requirement-item--valid")
    );

    if (!todosValidos) {
      alert("Verifique se a sua senha atende a todos os requisitos antes de continuar.");
      return;
    }

    alert("Senha redefinida com sucesso!");
  });
});
