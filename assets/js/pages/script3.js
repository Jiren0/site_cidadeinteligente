// Seleciona os campos do formulário
const nameInput = document.getElementById("nameInput");
const jobInput = document.getElementById("jobInput");
const locationInput = document.getElementById("locationInput");
const addBtn = document.getElementById("addBtn");
const userList = document.getElementById("userList");

// Quando clicar no botão adicionar
addBtn.addEventListener("click", () => {

    // Pega os valores digitados
    const name = nameInput.value.trim();
    const job = jobInput.value.trim();
    const location = locationInput.value.trim();

    // Impede cadastro vazio
    if (name === "" || job === "" || location === "") {
        alert("Preencha todos os campos!");
        return;
    }

    // Cria o item da lista
    const li = document.createElement("li");

    // Cria o texto com as informações do usuário
    const userInfo = document.createElement("div");
    userInfo.classList.add("user-info");
    userInfo.innerHTML = `
        <strong>Nome:</strong> ${name}<br>
        <strong>Profissão:</strong> ${job}<br>
        <strong>Localização:</strong> ${location}
    `;

    // Botão de remover
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remover";
    removeBtn.classList.add("remove-btn");

    // Evento para remover usuário
    removeBtn.addEventListener("click", () => {
        li.remove();
    });

    // Monta o item
    li.appendChild(userInfo);
    li.appendChild(removeBtn);
    userList.appendChild(li);

    // Limpa os campos
    nameInput.value = "";
    jobInput.value = "";
    locationInput.value = "";
});
