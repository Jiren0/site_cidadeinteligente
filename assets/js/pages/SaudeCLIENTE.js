// app.js - versão robusta para o protótipo de fila/painel
// Carrega após o DOM estar pronto para evitar problemas de "elemento não encontrado"
document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'sus_proto_fila_v1';

  // Estado inicial
  let state = {
    ultimaSenhaSeq: 0,
    fila: []
  };

  // DOM
  const form = document.getElementById('formCadastro');
  const proxSenhaEl = document.getElementById('proxSenha');
  const filaPublica = document.getElementById('filaPublica');
  const painelProxima = document.getElementById('painel_proxima');
  const tempoEstimadoEl = document.getElementById('tempoEstimado');

  // Funções de storage
  function carregarEstado() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      // validações simples
      if (parsed && typeof parsed === 'object') {
        state = {
          ultimaSenhaSeq: Number(parsed.ultimaSenhaSeq) || 0,
          fila: Array.isArray(parsed.fila) ? parsed.fila : []
        };
      }
    } catch (err) {
      console.warn('Erro ao parsear localStorage:', err);
    }
  }

  function salvarEstado() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.warn('Erro ao salvar localStorage:', err);
    }
  }

  // Formatação de senha
  function formatarSenha(seq) {
    return 'A-' + String(seq).padStart(3, '0');
  }

  function atualizarProxSenha() {
    if (proxSenhaEl) proxSenhaEl.textContent = formatarSenha(state.ultimaSenhaSeq + 1);
  }

  // Função para exibir modal com informações do paciente
  function exibirDetalhes(paciente) {
    // Remove modal anterior se existir
    const modalExistente = document.getElementById('modalDetalhes');
    if (modalExistente) modalExistente.remove();

    // Cria o modal
    const modal = document.createElement('div');
    modal.id = 'modalDetalhes';
    modal.className = 'modal-overlay';

    const conteudo = document.createElement('div');
    conteudo.className = 'modal-content';

    const servicos = {
      consulta: 'Consulta geral',
      enfermagem: 'Enfermagem',
      odontologia: 'Odontologia',
      vacina: 'Vacinação'
    };

    const dataHora = paciente.timestamp ? new Date(paciente.timestamp).toLocaleString('pt-BR') : 'Não registrado';
    const posicao = state.fila.findIndex(p => p.senha === paciente.senha) + 1;

    conteudo.innerHTML = `
      <div class="modal-header">
        <h2>Detalhes do Paciente</h2>
        <button id="fecharModal" class="modal-close-btn">×</button>
      </div>
      
      <div class="modal-senha-box">
        <div class="modal-senha-label">Senha</div>
        <div class="modal-senha-value">${paciente.senha}</div>
      </div>

      <div class="modal-body">
        <div class="modal-field">
          <span class="modal-field-label">Nome completo</span>
          <div class="modal-field-value">${paciente.nome || '—'}</div>
        </div>

        <div class="modal-field-grid">
          <div class="modal-field">
            <span class="modal-field-label">Idade</span>
            <div class="modal-field-value">${paciente.idade ? paciente.idade + ' anos' : '—'}</div>
          </div>
          <div class="modal-field">
            <span class="modal-field-label">Posição na fila</span>
            <div class="modal-field-value">${posicao}º</div>
          </div>
        </div>

        <div class="modal-field">
          <span class="modal-field-label">CPF</span>
          <div class="modal-field-value">${paciente.cpf || 'Não informado'}</div>
        </div>

        <div class="modal-field">
          <span class="modal-field-label">Serviço</span>
          <div class="modal-field-value">${servicos[paciente.servico] || paciente.servico}</div>
        </div>

        ${paciente.observacao ? `
        <div class="modal-field">
          <span class="modal-field-label">Observação</span>
          <div class="modal-observacao">${paciente.observacao}</div>
        </div>
        ` : ''}

        <div class="modal-footer">
          <div class="modal-timestamp">Cadastrado em: ${dataHora}</div>
        </div>
      </div>
    `;

    modal.appendChild(conteudo);
    document.body.appendChild(modal);

    // Fechar modal
    function fecharModal() {
      modal.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => modal.remove(), 300);
    }

    document.getElementById('fecharModal').addEventListener('click', fecharModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) fecharModal();
    });

    // Fechar com ESC
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        fecharModal();
        document.removeEventListener('keydown', handleEsc);
      }
    };
    document.addEventListener('keydown', handleEsc);
  }

  // Render fila pública
  function renderFila() {
    if (!filaPublica) return;
    filaPublica.innerHTML = '';
    if (!state.fila.length) {
      filaPublica.innerHTML = '<div class="small">Nenhum paciente na fila</div>';
      return;
    }

    state.fila.forEach((p, idx) => {
      const div = document.createElement('div');
      div.className = 'queue-item';
      const nome = p.nome || '—';
      const servico = p.servico || '';
      const idade = p.idade !== undefined ? `${p.idade} anos` : '';
      
      div.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div>
            <div style="font-weight:700">${p.senha} — ${nome}</div>
            <div class="small">${servico} • ${idade}</div>
          </div>
          <div>
            <div class="small">Posição: ${idx + 1}</div>
            <div style="font-size: 12px; color: #2563eb; margin-top: 4px; font-weight: 600;">👁️ Ver detalhes</div>
          </div>
        </div>
      `;

      // Adiciona evento de clique
      div.addEventListener('click', () => exibirDetalhes(p));

      filaPublica.appendChild(div);
    });
  }

  // Estimativa simples por serviço
  const tempoMedioPorServico = { consulta: 12, enfermagem: 8, odontologia: 18, vacina: 6 };
  function calcularTempoEstimado() {
    if (state.fila.length === 0) return '0 min';
    let total = 0;
    state.fila.forEach(p => {
      total += (tempoMedioPorServico[p.servico] || 10);
    });
    const avg = Math.round(total / state.fila.length);
    return `${avg} min (média)`;
  }

  function atualizarPainel() {
    if (painelProxima) painelProxima.textContent = state.fila.length ? state.fila[0].senha : '—';
    if (tempoEstimadoEl) tempoEstimadoEl.textContent = calcularTempoEstimado();
  }

  function atualizarUI() {
    atualizarProxSenha();
    renderFila();
    atualizarPainel();
    salvarEstado();
  }

  // Evento de submit (cadastro)
  if (form) {
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();

      const nome = (document.getElementById('nome')?.value || '').trim();
      const idade = document.getElementById('idade')?.value || '';
      const cpf = (document.getElementById('cpf')?.value || '').trim();
      const servico = document.getElementById('servico')?.value || 'consulta';
      const observacao = document.getElementById('observacao')?.value || '';

      if (!nome) {
        alert('Por favor, preencha o nome do paciente.');
        return;
      }

      state.ultimaSenhaSeq = Number(state.ultimaSenhaSeq || 0) + 1;
      const senha = formatarSenha(state.ultimaSenhaSeq);

      const paciente = {
        senha,
        nome,
        idade,
        cpf,
        servico,
        observacao,
        timestamp: Date.now()
      };

      state.fila.push(paciente);
      // limpa campos do formulário
      form.reset();
      atualizarUI();

      // feedback
      try {
        // usar alert apenas no protótipo, em produção substitua por uma notificação visual
        alert('Senha emitida: ' + senha + '\nPosição atual na fila: ' + state.fila.length);
      } catch (e) {
        console.log('Senha emitida:', senha);
      }
    });
  } else {
    console.warn('Formulário (id=formCadastro) não encontrado no DOM.');
  }

  // Inicialização
  carregarEstado();
  atualizarUI();

  // Atualiza painel periodicamente (caso queira ver mudanças em tempo real)
  setInterval(() => { atualizarPainel(); }, 6000);
});