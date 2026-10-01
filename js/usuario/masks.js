
function maskCPF(value) {
  return value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function maskPhone(value) {
  return value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
}

function bindCpfMask(input) {
  if (!input) return;
  input.addEventListener("input", () => {
    input.value = maskCPF(input.value);
  });
}

function bindPhoneMask(input) {
  if (!input) return;
  input.addEventListener("input", () => {
    input.value = maskPhone(input.value);
  });
}
