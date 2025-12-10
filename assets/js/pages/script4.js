// Array onde vamos armazenar todas as denúncias enviadas
let denuncias = [];

// Pegando o formulário
const form = document.getElementById("denunciaForm");

// Quando o usuário clica em enviar
form.addEventListener("submit", function(e) {
    e.preventDefault(); // Evita que a página recarregue

    // Coleta dos dados do formulário
    let localizacao = document.getElementById("localizacao").value;
    let tipo = document.getElementById("tipo").value;
    let suspeito = document.getElementById("suspeito").value;

    // Cria um objeto com os dados da denúncia
    let novaDenuncia = {
        localizacao: localizacao,
        tipo: tipo,
        suspeito: suspeito,
        data: new Date().toLocaleString()
    };

    // Adiciona a denúncia ao array
    denuncias.push(novaDenuncia);

    // Mostra uma mensagem ao usuário
    alert("Sua denúncia foi enviada com sucesso!");

    // Limpa o formulário
    form.reset();

    // Atualiza o dashboard
    atualizarDashboard();
});

// Função para atualizar os dados do dashboard
function atualizarDashboard() {

    // Atualiza total de denúncias
    document.getElementById("totalDenuncias").innerText = denuncias.length;

    // Descobre qual crime é o mais comum
    let contagem = {};
    let crimeMaisComum = "Nenhum";

    denuncias.forEach(d => {
        contagem[d.tipo] = (contagem[d.tipo] || 0) + 1;
    });

    // Verifica qual tem o maior número
    let maior = 0;
    for (let crime in contagem) {
        if (contagem[crime] > maior) {
            maior = contagem[crime];
            crimeMaisComum = crime;
        }
    }

    document.getElementById("crimeMaisComum").innerText = crimeMaisComum;

    // Exibe a última ocorrência registrada
    let ultima = denuncias[denuncias.length - 1];
    document.getElementById("ultimaOcorrencia").innerText =
        `${ultima.tipo} em ${ultima.localizacao} - ${ultima.data}`;
}
