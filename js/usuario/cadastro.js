
document.addEventListener("DOMContentLoaded", () => {

  bindCpfMask(document.getElementById("cpf"));
  bindPhoneMask(document.getElementById("telefone"));


  const genderOptions = document.querySelectorAll(".segmented__option");
  genderOptions.forEach((option) => {
    option.addEventListener("click", () => {
      genderOptions.forEach((opt) => opt.classList.remove("is-active"));
      option.classList.add("is-active");
    });
  });

  const form = document.getElementById("cadastro-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const terms = document.getElementById("terms");
    if (!terms.checked) {
      alert("Você precisa aceitar os termos de uso para continuar.");
      return;
    }

    alert("Cadastro enviado!");
    window.location.href = "login.html";
  });
});
