
document.addEventListener("DOMContentLoaded", () => {

  const cpfOuTelefone = document.getElementById("cpf-telefone");
  if (cpfOuTelefone) {
    cpfOuTelefone.addEventListener("input", () => {
      cpfOuTelefone.value = maskCPF(cpfOuTelefone.value);
    });
  }

  const form = document.getElementById("login-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    alert("Login realizado com sucesso!");
    window.location.href = "confirmacao.html";
  });
});
