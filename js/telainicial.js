// O JavaScript busca o arquivo HTML do header e insere dentro da div


fetch('../assets/header/header.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('header-container').innerHTML = data;
    })
    .catch(error => console.error('Erro ao carregar o header:', error));
    
fetch('../assets/footer/footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer-container').innerHTML = data;
    })
    .catch(error => console.error('Erro ao carregar o footer:', error));
    