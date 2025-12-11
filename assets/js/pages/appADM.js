// Dados do sistema
let pacientes = [];
let fila = [];
let atendimentos = [];
let proximoNumero = 1;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    setupTabs();
    atualizarInterface();
});

// Sistema de Tabs
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active de todos
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Adiciona active no selecionado
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            
            // Atualiza interface
            atualizarInterface();
        });
    });
}

// Cadastrar Paciente
function cadastrarPaciente() {
    const nome = document.getElementById('nome').value.trim();
    const cpf = document.getElementById('cpf').value.trim();
    const prioridade = document.getElementById('prioridade').value;
    const especialidade = document.getElementById('especialidade').value;
    
    if (!nome || !cpf) {
        alert('Por favor, preencha todos os campos obrigatórios!');
        return;
    }
    
    const novoPaciente = {
        id: Date.now(),
        nome,
        cpf,
        prioridade,
        especialidade,
        dataCadastro: new Date().toLocaleString('pt-BR')
    };
    
    pacientes.push(novoPaciente);
    
    // Limpar formulário
    document.getElementById('nome').value = '';
    document.getElementById('cpf').value = '';
    document.getElementById('prioridade').value = 'normal';
    document.getElementById('especialidade').value = 'clinica';
    
    alert('Paciente cadastrado com sucesso!');
    atualizarInterface();
}

// Adicionar à Fila
function adicionarFila(paciente) {
    const novaSenha = {
        ...paciente,
        senha: `${paciente.prioridade === 'prioritario' ? 'P' : 'N'}${String(proximoNumero).padStart(3, '0')}`,
        status: 'aguardando',
        horaEntrada: new Date(),
        tempoEspera: 0
    };
    
    fila.push(novaSenha);
    proximoNumero++;
    atualizarInterface();
}

// Chamar Próximo
function chamarProximo() {
    const filaAguardando = fila
        .filter(p => p.status === 'aguardando')
        .sort((a, b) => {
            if (a.prioridade === 'prioritario' && b.prioridade !== 'prioritario') return -1;
            if (a.prioridade !== 'prioritario' && b.prioridade === 'prioritario') return 1;
            return a.horaEntrada - b.horaEntrada;
        });
    
    if (filaAguardando.length === 0) {
        alert('Não há pacientes na fila!');
        return;
    }
    
    const proximo = filaAguardando[0];
    const tempoEspera = Math.round((new Date() - proximo.horaEntrada) / 60000);
    
    // Atualizar status
    fila = fila.map(p => 
        p.id === proximo.id 
            ? { ...p, status: 'atendimento', tempoEspera, horaAtendimento: new Date() }
            : p
    );
    
    atendimentos.push({ ...proximo, tempoEspera, horaChamada: new Date() });
    atualizarInterface();
}

// Concluir Atendimento
function concluirAtendimento(id) {
    const paciente = fila.find(p => p.id === id);
    if (paciente && paciente.horaAtendimento) {
        const tempoAtendimento = Math.round((new Date() - paciente.horaAtendimento) / 60000);
        fila = fila.map(p => 
            p.id === id 
                ? { ...p, status: 'concluido', tempoAtendimento }
                : p
        );
        atualizarInterface();
    }
}

// Calcular Tempo Estimado
function calcularTempoEstimado(posicao) {
    const stats = calcularEstatisticas();
    if (stats.tempoMedioAtendimento === 0) return 'Calculando...';
    const tempo = posicao * stats.tempoMedioAtendimento;
    return `${tempo} min`;
}

// Calcular Estatísticas
function calcularEstatisticas() {
    const emEspera = fila.filter(p => p.status === 'aguardando').length;
    const emAtendimento = fila.filter(p => p.status === 'atendimento').length;
    const atendidos = fila.filter(p => p.status === 'concluido').length;
    
    const temposEspera = fila
        .filter(p => p.status !== 'aguardando')
        .map(p => p.tempoEspera || 0);
    const tempoMedioEspera = temposEspera.length > 0
        ? Math.round(temposEspera.reduce((a, b) => a + b, 0) / temposEspera.length)
        : 0;
    
    const temposAtendimento = fila
        .filter(p => p.status === 'concluido')
        .map(p => p.tempoAtendimento || 0);
    const tempoMedioAtendimento = temposAtendimento.length > 0
        ? Math.round(temposAtendimento.reduce((a, b) => a + b, 0) / temposAtendimento.length)
        : 0;
    
    return {
        totalPacientes: pacientes.length,
        emEspera,
        emAtendimento,
        atendidos,
        tempoMedioEspera,
        tempoMedioAtendimento
    };
}

// Atualizar Interface Completa
function atualizarInterface() {
    atualizarListaPacientes();
    atualizarFila();
    atualizarPainelDigital();
    atualizarDashboard();
}

// Atualizar Lista de Pacientes
function atualizarListaPacientes() {
    const lista = document.getElementById('lista-pacientes');
    document.getElementById('total-pacientes').textContent = pacientes.length;
    
    if (pacientes.length === 0) {
        lista.innerHTML = '<p style="text-align: center; color: #9ca3af; padding: 20px;">Nenhum paciente cadastrado</p>';
        return;
    }
    
    lista.innerHTML = pacientes.map(p => `
        <div class="paciente-item">
            <div class="paciente-info">
                <h4>${p.nome}</h4>
                <p>CPF: ${p.cpf}</p>
                <small>${p.especialidade} - ${p.prioridade === 'prioritario' ? '⭐ Prioritário' : 'Normal'}</small>
            </div>
            <button class="btn-secondary" onclick="adicionarFila(${JSON.stringify(p).replace(/"/g, '&quot;')})" 
                ${fila.some(f => f.id === p.id) ? 'disabled' : ''}>
                ${fila.some(f => f.id === p.id) ? 'Na Fila' : 'Adicionar à Fila'}
            </button>
        </div>
    `).join('');
}

// Atualizar Fila
function atualizarFila() {
    const aguardando = fila.filter(p => p.status === 'aguardando');
    const atendimento = fila.filter(p => p.status === 'atendimento');
    const concluido = fila.filter(p => p.status === 'concluido');
    
    document.getElementById('count-aguardando').textContent = aguardando.length;
    document.getElementById('count-atendimento').textContent = atendimento.length;
    document.getElementById('count-concluido').textContent = concluido.length;
    
    // Aguardando
    const listaAguardando = document.getElementById('fila-aguardando');
    listaAguardando.innerHTML = aguardando.length === 0 
        ? '<p style="text-align: center; color: #9ca3af; padding: 20px;">Nenhum paciente aguardando</p>'
        : aguardando.map((p, idx) => `
            <div class="fila-item aguardando">
                <div class="fila-header">
                    <span class="senha yellow">${p.senha}</span>
                    ${p.prioridade === 'prioritario' ? '<span class="badge-prioritario">PRIORITÁRIO</span>' : ''}
                </div>
                <h4>${p.nome}</h4>
                <p>${p.especialidade}</p>
                <small>Posição: ${idx + 1} | Estimado: ${calcularTempoEstimado(idx + 1)}</small>
            </div>
        `).join('');
    
    // Em Atendimento
    const listaAtendimento = document.getElementById('fila-atendimento');
    listaAtendimento.innerHTML = atendimento.length === 0
        ? '<p style="text-align: center; color: #9ca3af; padding: 20px;">Nenhum atendimento em andamento</p>'
        : atendimento.map(p => `
            <div class="fila-item atendimento">
                <span class="senha blue">${p.senha}</span>
                <h4>${p.nome}</h4>
                <p>${p.especialidade}</p>
                <small>Esperou: ${p.tempoEspera} min</small>
                <button class="btn-success" onclick="concluirAtendimento(${p.id})">Concluir</button>
            </div>
        `).join('');
    
    // Concluídos
    const listaConcluido = document.getElementById('fila-concluido');
    listaConcluido.innerHTML = concluido.length === 0
        ? '<p style="text-align: center; color: #9ca3af; padding: 20px;">Nenhum atendimento concluído</p>'
        : concluido.map(p => `
            <div class="fila-item concluido">
                <span class="senha green">${p.senha}</span>
                <h4>${p.nome}</h4>
                <p>${p.especialidade}</p>
                <small>Espera: ${p.tempoEspera} min | Atendimento: ${p.tempoAtendimento} min</small>
            </div>
        `).join('');
}

// Atualizar Painel Digital
function atualizarPainelDigital() {
    const stats = calcularEstatisticas();
    
    // Último chamado
    const ultimoChamado = document.getElementById('ultimo-chamado');
    if (atendimentos.length > 0) {
        const ultimo = atendimentos[atendimentos.length - 1];
        ultimoChamado.style.display = 'block';
        document.getElementById('senha-chamada').textContent = ultimo.senha;
        document.getElementById('nome-chamada').textContent = ultimo.nome;
        document.getElementById('especialidade-chamada').textContent = ultimo.especialidade;
    } else {
        ultimoChamado.style.display = 'none';
    }
    
    // Lista de aguardando
    const aguardando = fila.filter(p => p.status === 'aguardando').slice(0, 5);
    const painelAguardando = document.getElementById('painel-aguardando');
    painelAguardando.innerHTML = aguardando.length === 0
        ? '<p style="text-align: center; padding: 20px;">Nenhum paciente aguardando</p>'
        : aguardando.map((p, idx) => `
            <div class="painel-aguardando-item">
                <span class="painel-senha">${p.senha}</span>
                <span class="painel-posicao">Posição ${idx + 1}</span>
                <span class="painel-tempo">${calcularTempoEstimado(idx + 1)}</span>
            </div>
        `).join('');
    
    // Estatísticas
    document.getElementById('stat-espera').textContent = stats.emEspera;
    document.getElementById('stat-atendimento').textContent = stats.emAtendimento;
    document.getElementById('stat-tempo-espera').textContent = `${stats.tempoMedioEspera} min`;
    document.getElementById('stat-atendidos').textContent = stats.atendidos;
}

// Atualizar Dashboard
function atualizarDashboard() {
    const stats = calcularEstatisticas();
    
    // Cards superiores
    document.getElementById('dash-total').textContent = stats.totalPacientes;
    document.getElementById('dash-espera').textContent = stats.emEspera;
    document.getElementById('dash-atendimento').textContent = stats.emAtendimento;
    document.getElementById('dash-atendidos').textContent = stats.atendidos;
    
    // Gráficos de tempo
    const alturaEspera = Math.min((stats.tempoMedioEspera / 60) * 100, 100);
    const alturaAtendimento = Math.min((stats.tempoMedioAtendimento / 30) * 100, 100);
    
    document.getElementById('bar-espera').style.height = `${alturaEspera}%`;
    document.getElementById('valor-espera').textContent = stats.tempoMedioEspera;
    
    document.getElementById('bar-atendimento').style.height = `${alturaAtendimento}%`;
    document.getElementById('valor-atendimento').textContent = stats.tempoMedioAtendimento;
    
    // Distribuição por especialidade
    const especialidades = ['clinica', 'pediatria', 'ginecologia', 'ortopedia'];
    especialidades.forEach(esp => {
        const count = fila.filter(p => p.especialidade === esp).length;
        document.getElementById(`esp-${esp}`).textContent = count;
    });
}