/* ===================================================
   MASKS.JS
   Funções simples de máscara pra campos de formulário.
   Reaproveitável em qualquer página que tenha input de
   CPF ou telefone (Cadastro, Login, etc).
=================================================== */

/** Aplica a máscara 000.000.000-00 enquanto o usuário digita. */
function maskCPF(value) {
  return value
    .replace(/\D/g, "") // remove tudo que não é número
    .slice(0, 11) // limita a 11 dígitos
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

/** Aplica a máscara (00) 00000-0000 enquanto o usuário digita. */
function maskPhone(value) {
  return value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
}

/** Liga a máscara de CPF a um <input>. */
function bindCpfMask(input) {
  if (!input) return;
  input.addEventListener("input", () => {
    input.value = maskCPF(input.value);
  });
}

/** Liga a máscara de telefone a um <input>. */
function bindPhoneMask(input) {
  if (!input) return;
  input.addEventListener("input", () => {
    input.value = maskPhone(input.value);
  });
}
