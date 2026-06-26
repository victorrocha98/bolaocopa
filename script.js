// =====================
// VARIÁVEIS GLOBAIS
// =====================
let usuarioAtual = null;
let diaAtivoIndex = 0;
let palpitesBloqueados = false;
let resultadosOficiais = {};

// =====================
// GRUPOS E TIMES - COM BANDEIRAS CORRETAS PARA EXIBIÇÃO
// =====================
const gruposTimes = {
    "A": [
        { nome: "México", bandeira: "fi fi-mx" },
        { nome: "África do Sul", bandeira: "fi fi-za" },
        { nome: "Coreia do Sul", bandeira: "fi fi-kr" },
        { nome: "República Tcheca", bandeira: "fi fi-cz" }
    ],
    "B": [
        { nome: "Canadá", bandeira: "fi fi-ca" },
        { nome: "Bósnia e Herzegovina", bandeira: "fi fi-ba" },
        { nome: "Catar", bandeira: "fi fi-qa" },
        { nome: "Suíça", bandeira: "fi fi-ch" }
    ],
    "C": [
        { nome: "Brasil", bandeira: "fi fi-br" },
        { nome: "Marrocos", bandeira: "fi fi-ma" },
        { nome: "Haiti", bandeira: "fi fi-ht" },
        { nome: "Escócia", bandeira: "fi fi-gb-sct" }
    ],
    "D": [
        { nome: "Estados Unidos", bandeira: "fi fi-us" },
        { nome: "Paraguai", bandeira: "fi fi-py" },
        { nome: "Austrália", bandeira: "fi fi-au" },
        { nome: "Turquia", bandeira: "fi fi-tr" }
    ],
    "E": [
        { nome: "Alemanha", bandeira: "fi fi-de" },
        { nome: "Curaçau", bandeira: "fi fi-cw" },
        { nome: "Costa do Marfim", bandeira: "fi fi-ci" },
        { nome: "Equador", bandeira: "fi fi-ec" }
    ],
    "F": [
        { nome: "Holanda", bandeira: "fi fi-nl" },
        { nome: "Japão", bandeira: "fi fi-jp" },
        { nome: "Suécia", bandeira: "fi fi-se" },
        { nome: "Tunísia", bandeira: "fi fi-tn" }
    ],
    "G": [
        { nome: "Bélgica", bandeira: "fi fi-be" },
        { nome: "Egito", bandeira: "fi fi-eg" },
        { nome: "Irã", bandeira: "fi fi-ir" },
        { nome: "Nova Zelândia", bandeira: "fi fi-nz" }
    ],
    "H": [
        { nome: "Espanha", bandeira: "fi fi-es" },
        { nome: "Cabo Verde", bandeira: "fi fi-cv" },
        { nome: "Arábia Saudita", bandeira: "fi fi-sa" },
        { nome: "Uruguai", bandeira: "fi fi-uy" }
    ],
    "I": [
        { nome: "França", bandeira: "fi fi-fr" },
        { nome: "Senegal", bandeira: "fi fi-sn" },
        { nome: "Iraque", bandeira: "fi fi-iq" },
        { nome: "Noruega", bandeira: "fi fi-no" }
    ],
    "J": [
        { nome: "Argentina", bandeira: "fi fi-ar" },
        { nome: "Argélia", bandeira: "fi fi-dz" },
        { nome: "Áustria", bandeira: "fi fi-at" },
        { nome: "Jordânia", bandeira: "fi fi-jo" }
    ],
    "K": [
        { nome: "Portugal", bandeira: "fi fi-pt" },
        { nome: "RD Congo", bandeira: "fi fi-cd" },
        { nome: "Uzbequistão", bandeira: "fi fi-uz" },
        { nome: "Colômbia", bandeira: "fi fi-co" }
    ],
    "L": [
        { nome: "Inglaterra", bandeira: "fi fi-gb-eng" },
        { nome: "Croácia", bandeira: "fi fi-hr" },
        { nome: "Gana", bandeira: "fi fi-gh" },
        { nome: "Panamá", bandeira: "fi fi-pa" }
    ]
};

// =====================
// FUNÇÕES AUXILIARES
// =====================
function getNomeLimpo(time) {
    if (typeof time === 'string') {
        return time;
    }
    return time.nome;
}

function limparNomeTime(nome) {
    if (!nome) return '';
    
    if (typeof nome === 'object' && nome.nome) {
        nome = nome.nome;
    }
    
    if (typeof nome === 'object') {
        nome = JSON.stringify(nome);
    }
    
    if (typeof nome !== 'string') {
        nome = String(nome);
    }
    
    let nomeLimpo = nome.replace(/<[^>]*>/g, '').trim();
    nomeLimpo = nomeLimpo.replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '').trim();
    nomeLimpo = nomeLimpo.replace(/[\u{1F3F4}\u{E0067}\u{E0062}\u{E0077}\u{E006C}\u{E0073}\u{E007F}]/gu, '').trim();
    nomeLimpo = nomeLimpo.replace(/[\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}]/gu, '').trim();
    nomeLimpo = nomeLimpo.replace(/[^a-zA-ZÀ-ÿ\s]/g, '').trim();
    
    return nomeLimpo;
}

// =====================
// LOGIN
// =====================
function fazerLogin() {
    const nome = document.getElementById("nomeParticipante").value;
    const senha = document.getElementById("senha").value;
    
    if (!nome) {
        alert("Selecione seu nome!");
        return;
    }
    
    database.ref(`usuarios/${nome}`).once('value', snapshot => {
        if (snapshot.exists()) {
            const userData = snapshot.val();
            if (userData.senha === senha) {
                usuarioAtual = nome;
                localStorage.setItem("usuarioLogado", nome);
                window.location.href = "palpites.html";
            } else {
                alert("Senha incorreta!");
            }
        } else {
            alert("Usuário não encontrado!");
        }
    });
}

function logout() {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "index.html";
}

function verificarLogin() {
    const usuario = localStorage.getItem("usuarioLogado");
    if (!usuario && !window.location.pathname.includes("index.html")) {
        window.location.href = "index.html";
    }
    return usuario;
}

// =====================
// GERENCIAR USUÁRIOS (ADMIN)
// =====================
function carregarUsuarios() {
    const usuariosList = document.getElementById("usuariosList");
    if (!usuariosList) return;
    
    database.ref("usuarios").once('value', snapshot => {
        const usuarios = snapshot.val() || {};
        const usuariosArray = Object.keys(usuarios);
        
        if (usuariosArray.length === 0) {
            usuariosList.innerHTML = "<p>Nenhum usuário cadastrado.</p>";
            return;
        }
        
        let html = '<div style="display: flex; flex-direction: column; gap: 10px;">';
        
        usuariosArray.forEach(nome => {
            const userData = usuarios[nome];
            html += `
            <div style="display: flex; justify-content: space-between; align-items: center; background: #f5f5f5; padding: 10px; border-radius: 8px; flex-wrap: wrap; gap: 8px;">
                <span><strong>${nome}</strong> (senha: ${userData.senha})</span>
                <div style="display: flex; gap: 8px;">
                    <button onclick="editarUsuario('${nome}')" style="background: #ff9800; padding: 5px 10px;">✏️ Editar</button>
                    <button onclick="excluirUsuario('${nome}')" style="background: #c62828; padding: 5px 10px;">🗑️ Excluir</button>
                </div>
            </div>
            `;
        });
        
        html += '</div>';
        usuariosList.innerHTML = html;
    });
}

function adicionarUsuario() {
    const nome = document.getElementById("novoUsuario").value.trim();
    const senha = document.getElementById("novaSenha").value;
    
    if (!nome) {
        alert("Digite o nome do usuário!");
        return;
    }
    
    database.ref(`usuarios/${nome}`).once('value', snapshot => {
        if (snapshot.exists()) {
            alert("Usuário já existe!");
            return;
        }
        
        database.ref(`usuarios/${nome}`).set({ 
            senha: senha, 
            podeAlterar: true,
            criadoEm: new Date().toISOString()
        }).then(() => {
            alert(`✅ Usuário ${nome} adicionado!`);
            document.getElementById("novoUsuario").value = "";
            carregarUsuarios();
            carregarUsuariosSelect();
            carregarResetUsuarios();
        }).catch(err => alert("Erro: " + err));
    });
}

function excluirUsuario(nome) {
    if (confirm(`Excluir "${nome}"? Todos os palpites serão apagados.`)) {
        database.ref(`palpites/${nome}`).remove();
        database.ref(`usuarios/${nome}`).remove()
            .then(() => {
                alert(`✅ Usuário ${nome} excluído!`);
                carregarUsuarios();
                carregarUsuariosSelect();
                carregarResetUsuarios();
            })
            .catch(err => alert("Erro: " + err));
    }
}

function editarUsuario(nomeAntigo) {
    database.ref(`usuarios/${nomeAntigo}`).once('value', snapshot => {
        const userData = snapshot.val();
        if (!userData) return;
        
        const novoNome = prompt("Digite o NOVO nome do usuário:", nomeAntigo);
        if (!novoNome || novoNome === nomeAntigo) return;
        
        const novaSenha = prompt("Digite a NOVA senha (ou deixe igual):", userData.senha);
        if (!novaSenha) return;
        
        database.ref(`usuarios/${novoNome}`).once('value', snapshot => {
            if (snapshot.exists()) {
                alert("❌ Já existe um usuário com este nome!");
                return;
            }
            
            database.ref(`palpites/${nomeAntigo}`).once('value', snapshotPalpites => {
                const palpites = snapshotPalpites.val() || {};
                
                const novosDados = {
                    senha: novaSenha,
                    podeAlterar: true,
                    criadoEm: new Date().toISOString(),
                    nomeAnterior: nomeAntigo
                };
                
                database.ref(`usuarios/${novoNome}`).set(novosDados)
                    .then(() => {
                        if (Object.keys(palpites).length > 0) {
                            database.ref(`palpites/${novoNome}`).set(palpites)
                                .then(() => {
                                    database.ref(`usuarios/${nomeAntigo}`).remove();
                                    database.ref(`palpites/${nomeAntigo}`).remove();
                                    alert(`✅ Usuário "${nomeAntigo}" renomeado para "${novoNome}"!`);
                                    carregarUsuarios();
                                    carregarUsuariosSelect();
                                    carregarResetUsuarios();
                                })
                                .catch(err => alert("Erro: " + err));
                        } else {
                            database.ref(`usuarios/${nomeAntigo}`).remove();
                            alert(`✅ Usuário "${nomeAntigo}" renomeado para "${novoNome}"!`);
                            carregarUsuarios();
                            carregarUsuariosSelect();
                            carregarResetUsuarios();
                        }
                    })
                    .catch(err => alert("Erro: " + err));
            });
        });
    });
}

// =====================
// STATUS DA TRAVA
// =====================
function carregarStatusTrava() {
    database.ref("config/palpitesBloqueados").on('value', snapshot => {
        palpitesBloqueados = snapshot.val() || false;
        const statusDiv = document.getElementById("statusJogo");
        if (statusDiv) {
            if (palpitesBloqueados) {
                statusDiv.innerHTML = "🔒 PALPITES BLOQUEADOS PELO ADMIN";
                statusDiv.style.background = "#ffebee";
                statusDiv.style.color = "#c62828";
            } else {
                statusDiv.innerHTML = "🔓 PALPITES ABERTOS - VOCÊ NÃO PODE ALTERAR OS SEUS PALPITES!";
                statusDiv.style.background = "#e8f5e9";
                statusDiv.style.color = "#2e7d32";
            }
        }
    });
}

// =====================
// CARREGAR RESULTADOS OFICIAIS
// =====================
function carregarResultadosOficiais() {
    database.ref("resultados").on('value', snapshot => {
        resultadosOficiais = snapshot.val() || {};
        if (document.getElementById("areaJogos")) {
            carregarJogos();
        }
        if (document.getElementById("adminJogos")) {
            montarAdmin();
        }
        if (document.getElementById("ranking")) {
            mostrarRanking();
        }
        if (document.getElementById("classificacaoGrupos")) {
            carregarClassificacaoGrupos(window.grupoSelecionado || 'A');
        }
    });
}

// =====================
// INTERFACE DE ABAS (FASES)
// =====================
function inicializarInterfaceDias() {
    const filtro = document.getElementById("filtroDias");
    if (!filtro) return;
    
    const todasFases = window.rodadas || [];
    
    if (todasFases.length === 0) {
        filtro.innerHTML = "<p style='color:white'>Nenhuma fase disponível</p>";
        return;
    }
    
    filtro.style.display = "flex";
    filtro.innerHTML = "";
    
    todasFases.forEach((bloco, index) => {
        const btn = document.createElement("button");
        btn.innerText = bloco.nome;
        btn.className = `btn-aba ${index === diaAtivoIndex ? 'ativo' : ''}`;
        btn.onclick = () => mudarDia(index);
        filtro.appendChild(btn);
    });
    
    carregarJogos();
}

function mudarDia(index) {
    diaAtivoIndex = index;
    const botoes = document.querySelectorAll(".btn-aba");
    botoes.forEach((btn, i) => {
        if (i === index) btn.classList.add("ativo");
        else btn.classList.remove("ativo");
    });
    carregarJogos();
}

// =====================
// CARREGAR JOGOS (PALPITES)
// =====================
function carregarJogos() {
    const area = document.getElementById("areaJogos");
    if (!area) return;
    
    const usuario = localStorage.getItem("usuarioLogado");
    if (!usuario) return;
    
    const todasFases = window.rodadas || [];
    const blocoRodada = todasFases[diaAtivoIndex];
    
    if (!blocoRodada || !blocoRodada.jogos || blocoRodada.jogos.length === 0) {
        area.innerHTML = "<div style='text-align:center; padding:40px; background:white; border-radius:15px;'>📭 Nenhum jogo nesta fase ainda.</div>";
        return;
    }
    
    area.innerHTML = "<div class='loading'>🔄 Carregando...</div>";
    
    Promise.all([
        database.ref(`palpites/${usuario}`).once('value'),
        database.ref("resultados").once('value')
    ]).then(([palpitesSnap, resultadosSnap]) => {
        const palpites = palpitesSnap.val() || {};
        const resultados = resultadosSnap.val() || {};
        
        let html = `<div class="rodada"><h2>${blocoRodada.nome}</h2>`;
        
        const isMataMata = diaAtivoIndex >= 17;
        
        if (isMataMata) {
            html += `<p style="color:#666; margin-bottom:15px; text-align:center; font-size:13px;">📅 Confrontos do mata-mata</p>`;
        } else {
            html += `<p style="color:#666; margin-bottom:15px;">Faça seus palpites para os jogos abaixo:</p>`;
        }
        
        blocoRodada.jogos.forEach(jogo => {
            const palpite = palpites[jogo.id] || { casa: "", fora: "", classificado: "" };
            const resultado = resultados[jogo.id];
            const temResultado = resultado && resultado.casa !== "" && resultado.casa !== undefined;
            
            const palpiteJaSalvo = palpites[jogo.id] && (palpites[jogo.id].casa !== "" && palpites[jogo.id].casa !== undefined && palpites[jogo.id].casa !== null);
            
            let statusCor = "";
            let mensagemStatus = "";
            let estiloInput = "";
            
            if (temResultado && palpite.casa !== "" && palpite.casa !== undefined) {
                const palpiteCasa = parseInt(palpite.casa);
                const palpiteFora = parseInt(palpite.fora);
                const resultCasa = parseInt(resultado.casa);
                const resultFora = parseInt(resultado.fora);
                
                if (palpiteCasa === resultCasa && palpiteFora === resultFora) {
                    statusCor = "palpite-correto";
                    mensagemStatus = "✅ PLACAR EXATO! +3 pontos 🎯";
                } else {
                    let palpiteTendencia, resultadoTendencia;
                    
                    if (palpiteCasa > palpiteFora) palpiteTendencia = "C";
                    else if (palpiteCasa < palpiteFora) palpiteTendencia = "F";
                    else palpiteTendencia = "E";
                    
                    if (resultCasa > resultFora) resultadoTendencia = "C";
                    else if (resultCasa < resultFora) resultadoTendencia = "F";
                    else resultadoTendencia = "E";
                    
                    if (palpiteTendencia === resultadoTendencia) {
                        statusCor = "palpite-tendencia";
                        mensagemStatus = `🎯 Acertou o vencedor! +1 ponto (Resultado: ${resultado.casa}-${resultado.fora})`;
                    } else {
                        statusCor = "palpite-errado";
                        mensagemStatus = `❌ Errou! Resultado: ${resultado.casa}-${resultado.fora}`;
                    }
                }
            }
            
            let desabilitado = palpitesBloqueados || temResultado || palpiteJaSalvo;
            let disabledAttr = desabilitado ? 'disabled' : '';
            
            if (palpiteJaSalvo && !temResultado) {
                estiloInput = "style='background:#fff3e0; border-color:#ff9800;'";
            }
            
            let infoExtra = "";
            if (jogo.data) {
                infoExtra = `<div style="font-size:11px; color:#666; margin-top:3px;">📅 ${jogo.data} | 📍 ${jogo.local}</div>`;
            }
            
            // SÓ PARA MATA-MATA: SEMPRE CRIAR O SELETOR, MAS OCULTO INICIALMENTE
            let classificacaoHtml = "";
            if (isMataMata) {
                // Verificar se o jogo já tem resultado oficial
                const resultCasa = temResultado ? parseInt(resultado.casa) : null;
                const resultFora = temResultado ? parseInt(resultado.fora) : null;
                const isEmpateOficial = temResultado && resultCasa === resultFora;
                
                // Se tem resultado oficial e NÃO é empate, mostra apenas o classificado
                if (temResultado && !isEmpateOficial) {
                    const classificadoReal = resultado.classificado || (resultCasa > resultFora ? 'casa' : 'fora');
                    const nomeClassificado = classificadoReal === 'casa' ? jogo.casa : jogo.fora;
                    const acertouClassificado = palpite.classificado === classificadoReal;
                    
                    classificacaoHtml = `
                    <div style="margin-top:8px; padding:5px 10px; background:#e8f5e9; border-radius:6px; width:100%;">
                        <span style="font-size:12px; color:#2e7d32; font-weight:bold;">🏆 Classificado: ${nomeClassificado}</span>
                        ${palpite.classificado ? `<span style="font-size:11px; color:${acertouClassificado ? '#2e7d32' : '#c62828'}; margin-left:10px;">${acertouClassificado ? '✅ Acertou!' : '❌ Errou!'}</span>` : ''}
                    </div>
                    `;
                } else {
                    // Para os demais casos (sem resultado ou resultado empatado), criar o seletor
                    // Mas escondido se não for empate e não tiver resultado
                    const classificadoSalvo = palpite.classificado || "";
                    const isDisabled = desabilitado;
                    const selectDisabled = isDisabled ? 'disabled' : '';
                    
                    // Determinar se deve mostrar inicialmente
                    const casaVal = palpite.casa || "";
                    const foraVal = palpite.fora || "";
                    const isEmpatePalpite = casaVal !== "" && foraVal !== "" && parseInt(casaVal) === parseInt(foraVal);
                    const mostrarInicial = (temResultado && isEmpateOficial) || isEmpatePalpite;
                    
                    // Estilo do container: se não mostrar, fica oculto
                    const displayStyle = mostrarInicial ? 'block' : 'none';
                    
                    // Mensagem de status
                    let statusMsg = "";
                    if (temResultado && isEmpateOficial) {
                        statusMsg = '⚖️ Jogo empatado - selecione o classificado';
                    } else if (isEmpatePalpite) {
                        statusMsg = '⚖️ Empate - selecione o classificado';
                    } else {
                        statusMsg = '💡 Preencha o placar (empate para selecionar)';
                    }
                    
                    classificacaoHtml = `
                    <div style="margin-top:8px; padding:5px 10px; background:#f0f4f8; border-radius:6px; width:100%; display: ${displayStyle};" id="container_classificado_${jogo.id}">
                        <label style="font-size:12px; font-weight:bold; color:#0d47a1;">
                            🏆 Quem se classifica?
                            <select id="classificado_${jogo.id}" style="margin-left:8px; padding:4px 8px; border-radius:5px; border:1px solid #ccc; font-size:12px;" ${selectDisabled}>
                                <option value="">Selecione</option>
                                <option value="casa" ${classificadoSalvo === 'casa' ? 'selected' : ''}>${jogo.casa}</option>
                                <option value="fora" ${classificadoSalvo === 'fora' ? 'selected' : ''}>${jogo.fora}</option>
                            </select>
                            <span class="status-msg" style="font-size:11px; margin-left:10px; color:#ff9800;">${statusMsg}</span>
                        </label>
                        ${temResultado && palpite.classificado ? `<span style="font-size:11px; color:#1565c0; margin-left:10px;">✅ Classificação salva</span>` : ''}
                    </div>
                    `;
                }
            }
            
            html += `
            <div class="jogo ${statusCor}" id="jogo_${jogo.id}">
                <div style="flex:1;">
                    <strong>${jogo.casa}</strong> 
                    <span style="font-size:20px;">⚽</span> 
                    <strong>${jogo.fora}</strong>
                    ${infoExtra}
                    ${temResultado ? `<div style="font-size:11px; color:#2e7d32; margin-top:5px;">📊 PLACAR OFICIAL: ${resultado.casa} - ${resultado.fora}</div>` : ''}
                    ${mensagemStatus ? `<div style="font-size:12px; margin-top:3px; font-weight:bold;">${mensagemStatus}</div>` : ''}
                    ${palpiteJaSalvo && !temResultado ? `<div style="font-size:11px; color:#ff9800; margin-top:3px;">🔒 Palpite já salvo - não pode mais alterar</div>` : ''}
                    ${classificacaoHtml}
                </div>
                <div class="placar">
                    <input type="number" id="casa_${jogo.id}" value="${palpite.casa}" min="0" placeholder="?" ${disabledAttr} ${estiloInput} onchange="verificarEmpatePalpite(${jogo.id})">
                    <span>x</span>
                    <input type="number" id="fora_${jogo.id}" value="${palpite.fora}" min="0" placeholder="?" ${disabledAttr} ${estiloInput} onchange="verificarEmpatePalpite(${jogo.id})">
                </div>
            </div>
            `;
        });
        
        html += `</div>`;
        area.innerHTML = html;
        
        const btnSalvar = document.getElementById("btnSalvarPalpites");
        if (btnSalvar) {
            let todosSalvos = true;
            blocoRodada.jogos.forEach(jogo => {
                if (!palpites[jogo.id] || palpites[jogo.id].casa === "" || palpites[jogo.id].casa === undefined) {
                    todosSalvos = false;
                }
            });
            btnSalvar.style.display = (palpitesBloqueados || todosSalvos) ? "none" : "block";
        }
    }).catch(err => {
        console.error("Erro:", err);
        area.innerHTML = "<div style='text-align:center;color:red;padding:20px;background:white;border-radius:15px;'>❌ Erro ao carregar jogos</div>";
    });
}

// Função para verificar empate e mostrar/ocultar seletor nos palpites
function verificarEmpatePalpite(jogoId) {
    const casaInput = document.getElementById(`casa_${jogoId}`);
    const foraInput = document.getElementById(`fora_${jogoId}`);
    const container = document.getElementById(`container_classificado_${jogoId}`);
    const classificadoSelect = document.getElementById(`classificado_${jogoId}`);
    
    if (!casaInput || !foraInput || !container) return;
    
    const casaVal = casaInput.value.trim();
    const foraVal = foraInput.value.trim();
    
    // Se ambos os campos estão preenchidos
    if (casaVal !== "" && foraVal !== "") {
        const casaNum = parseInt(casaVal);
        const foraNum = parseInt(foraVal);
        
        if (!isNaN(casaNum) && !isNaN(foraNum)) {
            const isEmpate = casaNum === foraNum;
            
            if (isEmpate) {
                // Mostrar o container
                container.style.display = 'block';
                if (classificadoSelect) {
                    classificadoSelect.style.display = 'inline-block';
                    classificadoSelect.disabled = false;
                }
                // Atualizar mensagem
                const msgSpan = container.querySelector('.status-msg');
                if (msgSpan) {
                    msgSpan.textContent = '⚖️ Empate - selecione o classificado';
                    msgSpan.style.color = '#ff9800';
                }
                return;
            } else {
                // Esconder o container
                container.style.display = 'none';
                if (classificadoSelect) {
                    classificadoSelect.value = '';
                }
                return;
            }
        }
    }
    
    // Se campos vazios, esconder o container
    container.style.display = 'none';
    if (classificadoSelect) {
        classificadoSelect.value = '';
    }
}

function salvarPalpites() {
    const usuario = localStorage.getItem("usuarioLogado");
    if (!usuario) return;
    
    if (palpitesBloqueados) {
        alert("⚠️ Os palpites estão bloqueados pelo admin!");
        return;
    }
    
    const todasFases = window.rodadas || [];
    const blocoRodada = todasFases[diaAtivoIndex];
    
    if (!blocoRodada || !blocoRodada.jogos || blocoRodada.jogos.length === 0) {
        alert("⚠️ Nenhum jogo nesta fase!");
        return;
    }
    
    const isFaseGrupos = diaAtivoIndex < 17;
    
    const palpitesAtualizados = {};
    let palpitesPreenchidos = 0;
    let palpitesVazios = 0;
    
    blocoRodada.jogos.forEach(jogo => {
        const casaInput = document.getElementById(`casa_${jogo.id}`);
        const foraInput = document.getElementById(`fora_${jogo.id}`);
        
        if (casaInput && foraInput && !casaInput.disabled) {
            const casaVal = casaInput.value.trim();
            const foraVal = foraInput.value.trim();
            
            if (casaVal !== "" && foraVal !== "") {
                let classificado = "";
                if (!isFaseGrupos) {
                    const container = document.getElementById(`container_classificado_${jogo.id}`);
                    // Só salva a classificação se o container estiver visível (empate)
                    if (container && container.style.display !== 'none') {
                        const classificadoSelect = document.getElementById(`classificado_${jogo.id}`);
                        if (classificadoSelect) {
                            classificado = classificadoSelect.value;
                        }
                    }
                }
                
                palpitesAtualizados[jogo.id] = {
                    casa: casaVal,
                    fora: foraVal,
                    classificado: classificado
                };
                palpitesPreenchidos++;
            } else {
                palpitesVazios++;
            }
        }
    });
    
    if (palpitesPreenchidos === 0) {
        alert("⚠️ Preencha pelo menos 1 palpite antes de salvar!");
        return;
    }
    
    if (isFaseGrupos && palpitesVazios > 0) {
        alert(`⚠️ Na fase de grupos você deve preencher TODOS os ${blocoRodada.jogos.length} jogos do dia! Faltam ${palpitesVazios} jogo(s).`);
        return;
    }
    
    // Validação para mata-mata: verifica se os jogos que estão empatados têm classificação selecionada
    if (!isFaseGrupos) {
        let classificacaoFaltando = false;
        let jogosFaltando = [];
        
        Object.keys(palpitesAtualizados).forEach(jogoId => {
            const container = document.getElementById(`container_classificado_${jogoId}`);
            // Se o container existe e está visível (display block), então é empate
            if (container && container.style.display !== 'none') {
                if (!palpitesAtualizados[jogoId].classificado) {
                    classificacaoFaltando = true;
                    jogosFaltando.push(jogoId);
                }
            }
        });
        
        if (classificacaoFaltando) {
            alert(`⚠️ Para jogos empatados do mata-mata, você deve selecionar quem se classifica! Jogos: ${jogosFaltando.length}`);
            return;
        }
    }
    
    if (isFaseGrupos) {
        database.ref(`palpites/${usuario}`).once('value', snapshot => {
            const palpitesExistentes = snapshot.val() || {};
            let jaTemPalpite = false;
            
            blocoRodada.jogos.forEach(jogo => {
                if (palpitesExistentes[jogo.id] && palpitesExistentes[jogo.id].casa !== "" && palpitesExistentes[jogo.id].casa !== undefined) {
                    jaTemPalpite = true;
                }
            });
            
            if (jaTemPalpite) {
                alert("⚠️ Você já salvou seus palpites para este dia! Não é possível alterar após salvar.");
                carregarJogos();
                return;
            }
            
            database.ref(`palpites/${usuario}`).update(palpitesAtualizados)
                .then(() => {
                    alert(`✅ ${palpitesPreenchidos} palpite(s) do dia salvos com sucesso!`);
                    carregarJogos();
                })
                .catch(err => alert("Erro: " + err));
        });
    } else {
        // MATA-MATA: Salvar apenas os palpites preenchidos (jogo por jogo)
        database.ref(`palpites/${usuario}`).once('value', function(snapshot) {
            const palpitesExistentes = snapshot.val() || {};
            
            let jogosJaSalvos = [];
            let jogosNovos = [];
            
            Object.keys(palpitesAtualizados).forEach(function(jogoId) {
                if (palpitesExistentes[jogoId] && palpitesExistentes[jogoId].casa !== "" && palpitesExistentes[jogoId].casa !== undefined) {
                    jogosJaSalvos.push(jogoId);
                } else {
                    jogosNovos.push(jogoId);
                }
            });
            
            if (jogosJaSalvos.length > 0) {
                const confirmar = confirm(
                    `⚠️ Você já tem palpites salvos para ${jogosJaSalvos.length} jogo(s) desta fase.\n\n` +
                    `Deseja SOBRESCREVER os palpites antigos pelos novos?\n` +
                    `(Clique em OK para substituir, Cancelar para manter os antigos)`
                );
                
                if (!confirmar) {
                    jogosJaSalvos.forEach(function(jogoId) {
                        delete palpitesAtualizados[jogoId];
                    });
                    
                    if (Object.keys(palpitesAtualizados).length === 0) {
                        alert("ℹ️ Nenhum palpite novo para salvar. Seus palpites antigos foram mantidos.");
                        carregarJogos();
                        return;
                    }
                }
            }
            
            if (Object.keys(palpitesAtualizados).length > 0) {
                database.ref(`palpites/${usuario}`).update(palpitesAtualizados)
                    .then(function() {
                        const totalSalvos = Object.keys(palpitesAtualizados).length;
                        alert(`✅ ${totalSalvos} palpite(s) do mata-mata salvos com sucesso!`);
                        carregarJogos();
                    })
                    .catch(function(err) {
                        alert("❌ Erro ao salvar: " + err);
                    });
            } else {
                alert("ℹ️ Nenhum palpite novo para salvar.");
                carregarJogos();
            }
        });
    }
}

// =====================
// ADMIN - MOSTRAR JOGOS
// =====================
function montarAdmin() {
    const area = document.getElementById("adminJogos");
    if (!area) return;
    
    database.ref("config/palpitesBloqueados").on('value', snapshot => {
        const status = document.getElementById("statusTrava");
        if (status) {
            const bloqueado = snapshot.val();
            status.innerHTML = bloqueado ? "🔒 PALPITES BLOQUEADOS" : "🔓 PALPITES LIBERADOS";
            status.style.color = bloqueado ? "#c62828" : "#2e7d32";
        }
    });
    
    database.ref("resultados").once('value', snapshot => {
        const resultados = snapshot.val() || {};
        const todasFases = window.rodadas || [];
        
        if (todasFases.length === 0) {
            area.innerHTML = "<div style='text-align:center;padding:40px;background:white;border-radius:15px;'>⚠️ Nenhuma fase de jogos encontrada.</div>";
            return;
        }
        
        area.innerHTML = "";
        
        todasFases.forEach((bloco, index) => {
            if (!bloco.jogos || bloco.jogos.length === 0) return;
            
            const isMataMata = index >= 17;
            
            let html = `<div class="rodada"><h2>${bloco.nome}</h2>`;
            
            bloco.jogos.forEach(jogo => {
                const resultado = resultados[jogo.id] || { casa: "", fora: "", classificado: "" };
                const temResultado = resultado.casa !== "" && resultado.casa !== undefined;
                
                let infoExtra = "";
                if (jogo.data) {
                    infoExtra = `<div style="font-size:11px; color:#666; margin-top:3px;">📅 ${jogo.data} | 📍 ${jogo.local}</div>`;
                }
                
                // Só mostrar seletor de classificação no admin se for mata-mata
                let classificacaoAdmin = "";
                if (isMataMata) {
                    // Verificar se o placar é empate (para mostrar o seletor)
                    const casaVal = resultado.casa !== "" ? parseInt(resultado.casa) : null;
                    const foraVal = resultado.fora !== "" ? parseInt(resultado.fora) : null;
                    const isEmpate = casaVal !== null && foraVal !== null && casaVal === foraVal;
                    
                    // Se tiver resultado e não for empate, mostra só o classificado
                    if (temResultado && !isEmpate) {
                        const classificadoReal = resultado.classificado || (casaVal > foraVal ? 'casa' : 'fora');
                        const nomeClassificado = classificadoReal === 'casa' ? jogo.casa : jogo.fora;
                        classificacaoAdmin = `
                        <div style="margin-top:5px;">
                            <span style="font-size:12px; color:#2e7d32; font-weight:bold;">🏆 Classificado: ${nomeClassificado}</span>
                            <input type="hidden" id="rclassificado_${jogo.id}" value="${classificadoReal}">
                        </div>
                        `;
                    } else {
                        // Mostrar seletor (se não tem resultado ou se é empate)
                        const classificadoSalvo = resultado.classificado || "";
                        const selectDisabled = temResultado ? 'disabled' : '';
                        const statusMsg = temResultado && isEmpate ? '⚖️ Jogo empatado - selecione o classificado' : '💡 Selecione o classificado (apenas se empatar)';
                        
                        classificacaoAdmin = `
                        <div style="margin-top:5px;">
                            <label style="font-size:12px; font-weight:bold; color:#0d47a1;">
                                🏆 Classificado:
                                <select id="rclassificado_${jogo.id}" style="margin-left:5px; padding:4px; border-radius:5px; border:1px solid #ccc;" ${selectDisabled}>
                                    <option value="">Selecione</option>
                                    <option value="casa" ${classificadoSalvo === 'casa' ? 'selected' : ''}>${jogo.casa}</option>
                                    <option value="fora" ${classificadoSalvo === 'fora' ? 'selected' : ''}>${jogo.fora}</option>
                                </select>
                            </label>
                            <span style="font-size:10px; color:#999; margin-left:5px;">${statusMsg}</span>
                        </div>
                        `;
                    }
                }
                
                html += `
                <div class="jogo" id="admin_jogo_${jogo.id}" style="${temResultado ? 'background:#e8f5e9;' : ''}">
                    <div style="flex:1;">
                        <strong>${jogo.casa}</strong> x <strong>${jogo.fora}</strong>
                        ${infoExtra}
                        ${temResultado ? '<span style="color:#2e7d32; font-size:11px; margin-left:10px;">✅ Resultado salvo</span>' : '<span style="color:#ff9800; font-size:11px; margin-left:10px;">⏳ Pendente</span>'}
                        ${classificacaoAdmin}
                    </div>
                    <div class="placar">
                        <input type="number" id="rcasa_${jogo.id}" value="${temResultado ? resultado.casa : ''}" min="0" placeholder="?" style="width:70px;" onchange="verificarEmpateAdmin(${jogo.id})">
                        <span>x</span>
                        <input type="number" id="rfora_${jogo.id}" value="${temResultado ? resultado.fora : ''}" min="0" placeholder="?" style="width:70px;" onchange="verificarEmpateAdmin(${jogo.id})">
                    </div>
                    <button onclick="resetarJogo(${jogo.id})" style="background:#ff6f00; padding:5px 10px; margin-left:10px;">🔄 Reset</button>
                </div>
                `;
            });
            
            html += `</div>`;
            area.innerHTML += html;
        });
    });
}

function resetarJogo(jogoId) {
    if (confirm(`Resetar este jogo? O resultado será apagado.`)) {
        database.ref(`resultados/${jogoId}`).remove()
            .then(() => {
                alert(`✅ Jogo resetado!`);
                montarAdmin();
                if (document.getElementById("areaJogos")) carregarJogos();
            })
            .catch(err => alert("Erro: " + err));
    }
}

function resetarTodosResultados() {
    if (confirm("⚠️ ATENÇÃO! Apagar TODOS os resultados?")) {
        database.ref("resultados").remove()
            .then(() => {
                alert("✅ Todos os resultados foram resetados!");
                montarAdmin();
                if (document.getElementById("areaJogos")) carregarJogos();
            })
            .catch(err => alert("Erro: " + err));
    }
}

function salvarResultados() {
    let resultados = {};
    let jogosSalvos = [];
    const todasFases = window.rodadas || [];
    
    todasFases.forEach((bloco, index) => {
        if (!bloco.jogos) return;
        
        const isMataMata = index >= 17;
        
        bloco.jogos.forEach(jogo => {
            const casaInput = document.getElementById(`rcasa_${jogo.id}`);
            const foraInput = document.getElementById(`rfora_${jogo.id}`);
            
            if (casaInput && foraInput) {
                let casa = casaInput.value;
                let fora = foraInput.value;
                
                if (casa !== "" && fora !== "") {
                    const casaNum = parseInt(casa);
                    const foraNum = parseInt(fora);
                    
                    if (!isNaN(casaNum) && !isNaN(foraNum)) {
                        // Verificar se é empate
                        const isEmpate = casaNum === foraNum;
                        
                        // Salvar resultado
                        resultados[jogo.id] = { casa: casaNum, fora: foraNum };
                        
                        // Se for mata-mata, salvar o classificado
                        if (isMataMata) {
                            const classificadoSelect = document.getElementById(`rclassificado_${jogo.id}`);
                            if (classificadoSelect) {
                                // Se o jogo não empatou, o classificado é o vencedor
                                if (!isEmpate) {
                                    resultados[jogo.id].classificado = casaNum > foraNum ? 'casa' : 'fora';
                                } else {
                                    // Se empatou, usa o valor selecionado
                                    resultados[jogo.id].classificado = classificadoSelect.value;
                                }
                                console.log(`🏆 Jogo ${jogo.id} - Classificado salvo: ${resultados[jogo.id].classificado}`);
                            } else {
                                // Se não tem seletor (caso de jogo que não empatou), salva o vencedor
                                resultados[jogo.id].classificado = casaNum > foraNum ? 'casa' : 'fora';
                                console.log(`🏆 Jogo ${jogo.id} - Classificado automático: ${resultados[jogo.id].classificado}`);
                            }
                        }
                        
                        jogosSalvos.push(`${jogo.casa} x ${jogo.fora} = ${casaNum}-${foraNum}`);
                    }
                }
            }
        });
    });
    
    if (Object.keys(resultados).length === 0) {
        alert("⚠️ Nenhum resultado para salvar! Preencha os placares.");
        return;
    }
    
    console.log("📊 Resultados a salvar:", resultados);
    
    database.ref("resultados").update(resultados)
        .then(() => {
            alert(`✅ ${jogosSalvos.length} resultado(s) salvo(s)!`);
            montarAdmin();
        })
        .catch(err => alert("Erro: " + err));
}

function travarPalpites() {
    database.ref("config/palpitesBloqueados").set(true)
        .then(() => alert("🔒 Palpites bloqueados!"))
        .catch(err => alert("Erro: " + err));
}

function destravarPalpites() {
    database.ref("config/palpitesBloqueados").set(false)
        .then(() => alert("🔓 Palpites liberados!"))
        .catch(err => alert("Erro: " + err));
}

// Função para verificar empate e mostrar/ocultar seletor no admin
function verificarEmpateAdmin(jogoId) {
    const casaInput = document.getElementById(`rcasa_${jogoId}`);
    const foraInput = document.getElementById(`rfora_${jogoId}`);
    const classificadoSelect = document.getElementById(`rclassificado_${jogoId}`);
    
    if (!casaInput || !foraInput || !classificadoSelect) return;
    
    const casaVal = casaInput.value.trim();
    const foraVal = foraInput.value.trim();
    
    if (casaVal !== "" && foraVal !== "") {
        const casaNum = parseInt(casaVal);
        const foraNum = parseInt(foraVal);
        
        if (!isNaN(casaNum) && !isNaN(foraNum)) {
            const isEmpate = casaNum === foraNum;
            
            // Mostrar/ocultar o seletor baseado no empate
            const container = classificadoSelect.closest('div');
            if (container) {
                // Encontrar a mensagem de status
                const statusSpan = container.querySelector('span:last-child');
                
                if (isEmpate) {
                    classificadoSelect.style.display = 'inline-block';
                    if (statusSpan) {
                        statusSpan.textContent = '⚖️ Jogo empatado - selecione o classificado';
                        statusSpan.style.color = '#ff9800';
                    }
                } else {
                    classificadoSelect.style.display = 'inline-block'; // Mantém visível para o admin
                    if (statusSpan) {
                        const classificadoVal = classificadoSelect.value;
                        if (classificadoVal) {
                            const nomeClassificado = classificadoVal === 'casa' ? 'Casa' : 'Visitante';
                            statusSpan.textContent = `✅ Jogo não empatou - Classificado: ${nomeClassificado}`;
                            statusSpan.style.color = '#2e7d32';
                        } else {
                            statusSpan.textContent = '⚠️ Jogo não empatou - selecione o classificado (vencedor)';
                            statusSpan.style.color = '#ff9800';
                        }
                    }
                }
            }
        }
    }
}

// =====================
// GERENCIAR 3º COLOCADOS (ADMIN)
// =====================

function carregarTerceirosColocados() {
    const container = document.getElementById("terceirosColocados");
    if (!container) {
        console.log("❌ Elemento terceirosColocados não encontrado");
        return;
    }
    
    console.log("🔄 Carregando 3º colocados...");
    
    database.ref("terceirosColocados").once('value', function(snapshot) {
        const salvos = snapshot.val() || {};
        console.log("📋 3º colocados salvos:", salvos);
        
        container.innerHTML = "";
        
        const gruposOrdenados = Object.keys(gruposTimes).sort();
        
        gruposOrdenados.forEach(function(grupo) {
            const times = gruposTimes[grupo];
            const salvosGrupo = salvos[grupo] || {};
            
            const div = document.createElement("div");
            div.style.cssText = "background: white; padding: 10px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);";
            
            let html = `<strong style="display: block; color: #0d47a1; margin-bottom: 8px; text-align: center;">Grupo ${grupo}</strong>`;
            
            times.forEach(function(time) {
                const nomeTime = time.nome;
                const bandeira = time.bandeira;
                const status = salvosGrupo[nomeTime] || '';
                
                let checkedTerceiro = status === 'terceiro' ? 'checked' : '';
                let checkedEliminado = status === 'eliminado' ? 'checked' : '';
                let bgColor = '';
                
                if (status === 'terceiro') {
                    bgColor = 'background: #e3f2fd;';
                } else if (status === 'eliminado') {
                    bgColor = 'background: #ffebee;';
                }
                
                const nomeEscapado = nomeTime.replace(/'/g, "\\'");
                
                html += `
                <div style="display: flex; align-items: center; padding: 4px 0; border-bottom: 1px solid #eee; font-size: 12px; ${bgColor}">
                    <span style="flex: 1; font-weight: normal;">
                        <span class="${bandeira}"></span> ${nomeTime}
                    </span>
                    <div style="display: flex; gap: 8px; align-items: center;">
                        <label style="display: flex; align-items: center; gap: 3px; font-size: 11px; cursor: pointer;">
                            <input type="checkbox" id="terceiro_${grupo}_${nomeTime}" value="terceiro" ${checkedTerceiro} 
                                   onchange="marcarTerceiro('${grupo}', '${nomeEscapado}', this.checked)">
                            🔵 3º
                        </label>
                        <label style="display: flex; align-items: center; gap: 3px; font-size: 11px; cursor: pointer;">
                            <input type="checkbox" id="eliminado_${grupo}_${nomeTime}" value="eliminado" ${checkedEliminado}
                                   onchange="marcarEliminado('${grupo}', '${nomeEscapado}', this.checked)">
                            🔴 Elim
                        </label>
                    </div>
                </div>
                `;
            });
            
            const terceiros = Object.keys(salvosGrupo).filter(key => salvosGrupo[key] === 'terceiro');
            const eliminados = Object.keys(salvosGrupo).filter(key => salvosGrupo[key] === 'eliminado');
            
            let statusGrupo = '';
            let statusCor = '#666';
            if (terceiros.length === 1 && eliminados.length > 0) {
                statusGrupo = `✅ 3º: ${terceiros.join(', ')} | Eliminados: ${eliminados.join(', ')}`;
                statusCor = '#2e7d32';
            } else if (terceiros.length === 1) {
                statusGrupo = `✅ 3º: ${terceiros.join(', ')} | ⚪ Sem eliminados`;
                statusCor = '#1565c0';
            } else if (eliminados.length > 0) {
                statusGrupo = `⚠️ Sem 3º | Eliminados: ${eliminados.join(', ')}`;
                statusCor = '#ff9800';
            } else {
                statusGrupo = '⚪ Nenhum marcado';
                statusCor = '#999';
            }
            
            html += `<div style="font-size: 10px; color: ${statusCor}; text-align: center; margin-top: 5px; font-style: italic;">${statusGrupo}</div>`;
            
            html += `
            <div style="text-align: center; margin-top: 8px;">
                <button onclick="salvarGrupoTerceiros('${grupo}')" 
                        style="background: #1565c0; padding: 4px 12px; font-size: 11px; border-radius: 5px;">
                    💾 Salvar Grupo ${grupo}
                </button>
            </div>
            `;
            
            div.innerHTML = html;
            container.appendChild(div);
        });
        
        console.log("✅ 3º colocados carregados com sucesso!");
    }).catch(function(err) {
        console.error("❌ Erro ao carregar 3º colocados:", err);
        container.innerHTML = "<p style='grid-column: 1 / -1; text-align: center; color: #c62828;'>❌ Erro ao carregar dados</p>";
    });
}

function marcarTerceiro(grupo, time, checked) {
    if (!window.terceirosTemp) window.terceirosTemp = {};
    if (!window.terceirosTemp[grupo]) window.terceirosTemp[grupo] = {};
    
    if (checked) {
        window.terceirosTemp[grupo][time] = 'terceiro';
        const elimCheckbox = document.getElementById(`eliminado_${grupo}_${time}`);
        if (elimCheckbox) elimCheckbox.checked = false;
    } else {
        delete window.terceirosTemp[grupo][time];
    }
    
    carregarTerceirosColocados();
    
    const statusDiv = document.getElementById("statusTerceiros");
    if (statusDiv) {
        const salvos = window.terceirosTemp[grupo] || {};
        const terceiros = Object.keys(salvos).filter(key => salvos[key] === 'terceiro');
        const eliminados = Object.keys(salvos).filter(key => salvos[key] === 'eliminado');
        
        let msg = `📌 Grupo ${grupo}: `;
        if (terceiros.length > 0) msg += `🔵 ${terceiros.join(', ')} (3º) `;
        if (eliminados.length > 0) msg += `🔴 ${eliminados.join(', ')} (Eliminados)`;
        if (terceiros.length === 0 && eliminados.length === 0) msg += 'Nenhum marcado';
        
        statusDiv.innerHTML = msg;
        statusDiv.style.color = "#1565c0";
    }
}

function marcarEliminado(grupo, time, checked) {
    if (!window.terceirosTemp) window.terceirosTemp = {};
    if (!window.terceirosTemp[grupo]) window.terceirosTemp[grupo] = {};
    
    if (checked) {
        window.terceirosTemp[grupo][time] = 'eliminado';
        const terceiroCheckbox = document.getElementById(`terceiro_${grupo}_${time}`);
        if (terceiroCheckbox) terceiroCheckbox.checked = false;
    } else {
        delete window.terceirosTemp[grupo][time];
    }
    
    carregarTerceirosColocados();
    
    const statusDiv = document.getElementById("statusTerceiros");
    if (statusDiv) {
        const salvos = window.terceirosTemp[grupo] || {};
        const terceiros = Object.keys(salvos).filter(key => salvos[key] === 'terceiro');
        const eliminados = Object.keys(salvos).filter(key => salvos[key] === 'eliminado');
        
        let msg = `📌 Grupo ${grupo}: `;
        if (terceiros.length > 0) msg += `🔵 ${terceiros.join(', ')} (3º) `;
        if (eliminados.length > 0) msg += `🔴 ${eliminados.join(', ')} (Eliminados)`;
        if (terceiros.length === 0 && eliminados.length === 0) msg += 'Nenhum marcado';
        
        statusDiv.innerHTML = msg;
        statusDiv.style.color = "#1565c0";
    }
}

function salvarGrupoTerceiros(grupo) {
    if (!window.terceirosTemp || !window.terceirosTemp[grupo]) {
        document.getElementById("statusTerceiros").innerHTML = `⚠️ Nenhuma alteração no grupo ${grupo}!`;
        document.getElementById("statusTerceiros").style.color = "#ff9800";
        return;
    }
    
    const salvos = window.terceirosTemp[grupo] || {};
    const terceiros = Object.keys(salvos).filter(key => salvos[key] === 'terceiro');
    
    if (terceiros.length > 1) {
        document.getElementById("statusTerceiros").innerHTML = 
            `⚠️ Grupo ${grupo} tem ${terceiros.length} terceiros! Marque apenas 1.`;
        document.getElementById("statusTerceiros").style.color = "#c62828";
        return;
    }
    
    if (terceiros.length === 0 && Object.keys(salvos).length === 0) {
        document.getElementById("statusTerceiros").innerHTML = 
            `⚠️ Grupo ${grupo} não tem nenhuma marcação!`;
        document.getElementById("statusTerceiros").style.color = "#ff9800";
        return;
    }
    
    database.ref("terceirosColocados").once('value', function(snapshot) {
        const dadosAtuais = snapshot.val() || {};
        
        dadosAtuais[grupo] = window.terceirosTemp[grupo];
        
        database.ref("terceirosColocados").set(dadosAtuais)
            .then(function() {
                document.getElementById("statusTerceiros").innerHTML = `✅ Grupo ${grupo} salvo com sucesso!`;
                document.getElementById("statusTerceiros").style.color = "#2e7d32";
                
                delete window.terceirosTemp[grupo];
                
                carregarTerceirosColocados();
                
                setTimeout(function() {
                    if (document.getElementById("classificacaoGrupos")) {
                        carregarClassificacaoGrupos(window.grupoSelecionado || 'A');
                    }
                }, 300);
            })
            .catch(function(err) {
                document.getElementById("statusTerceiros").innerHTML = `❌ Erro ao salvar grupo ${grupo}: ${err.message}`;
                document.getElementById("statusTerceiros").style.color = "#c62828";
                console.error("Erro ao salvar:", err);
            });
    });
}

function salvarTodosTerceirosColocados() {
    if (!window.terceirosTemp) {
        document.getElementById("statusTerceiros").innerHTML = "⚠️ Nenhuma alteração feita!";
        document.getElementById("statusTerceiros").style.color = "#ff9800";
        return;
    }
    
    const gruposComAlteracoes = Object.keys(window.terceirosTemp).filter(grupo => {
        return Object.keys(window.terceirosTemp[grupo]).length > 0;
    });
    
    if (gruposComAlteracoes.length === 0) {
        document.getElementById("statusTerceiros").innerHTML = "⚠️ Nenhum grupo foi modificado!";
        document.getElementById("statusTerceiros").style.color = "#ff9800";
        return;
    }
    
    let gruposInvalidos = [];
    
    gruposComAlteracoes.forEach(function(grupo) {
        const salvos = window.terceirosTemp[grupo] || {};
        const terceiros = Object.keys(salvos).filter(key => salvos[key] === 'terceiro');
        
        if (terceiros.length > 1) {
            gruposInvalidos.push(`${grupo} (${terceiros.length} terceiros)`);
        }
    });
    
    if (gruposInvalidos.length > 0) {
        document.getElementById("statusTerceiros").innerHTML = 
            `⚠️ Grupos com mais de 1 terceiro: ${gruposInvalidos.join(', ')}`;
        document.getElementById("statusTerceiros").style.color = "#c62828";
        return;
    }
    
    database.ref("terceirosColocados").once('value', function(snapshot) {
        const dadosAtuais = snapshot.val() || {};
        
        gruposComAlteracoes.forEach(function(grupo) {
            dadosAtuais[grupo] = window.terceirosTemp[grupo];
        });
        
        database.ref("terceirosColocados").set(dadosAtuais)
            .then(function() {
                document.getElementById("statusTerceiros").innerHTML = 
                    `✅ ${gruposComAlteracoes.length} grupo(s) salvos com sucesso: ${gruposComAlteracoes.join(', ')}`;
                document.getElementById("statusTerceiros").style.color = "#2e7d32";
                
                window.terceirosTemp = {};
                
                carregarTerceirosColocados();
                
                setTimeout(function() {
                    if (document.getElementById("classificacaoGrupos")) {
                        carregarClassificacaoGrupos(window.grupoSelecionado || 'A');
                    }
                }, 300);
            })
            .catch(function(err) {
                document.getElementById("statusTerceiros").innerHTML = "❌ Erro: " + err.message;
                document.getElementById("statusTerceiros").style.color = "#c62828";
                console.error("Erro ao salvar:", err);
            });
    });
}

function resetarTerceirosColocados() {
    if (confirm("⚠️ Resetar todos os 3º colocados?")) {
        database.ref("terceirosColocados").remove()
            .then(function() {
                document.getElementById("statusTerceiros").innerHTML = "✅ Todos os 3º colocados foram resetados!";
                document.getElementById("statusTerceiros").style.color = "#2e7d32";
                window.terceirosTemp = {};
                carregarTerceirosColocados();
                
                setTimeout(function() {
                    if (document.getElementById("classificacaoGrupos")) {
                        carregarClassificacaoGrupos(window.grupoSelecionado || 'A');
                    }
                }, 300);
            })
            .catch(function(err) {
                document.getElementById("statusTerceiros").innerHTML = "❌ Erro: " + err.message;
                document.getElementById("statusTerceiros").style.color = "#c62828";
            });
    }
}

function classificarAutomaticamenteTerceiros() {
    if (!window.terceirosTemp) window.terceirosTemp = {};
    
    database.ref("resultados").once('value', function(snapshot) {
        const resultados = snapshot.val() || {};
        
        Object.keys(gruposTimes).forEach(function(grupo) {
            const times = gruposTimes[grupo];
            const nomesTimes = times.map(t => t.nome);
            const classificacao = calcularClassificacaoGrupo(nomesTimes, resultados);
            
            if (!window.terceirosTemp[grupo]) window.terceirosTemp[grupo] = {};
            
            classificacao.forEach(function(item, index) {
                if (index === 2) {
                    window.terceirosTemp[grupo][item.time] = 'terceiro';
                } else if (index > 2) {
                    window.terceirosTemp[grupo][item.time] = 'eliminado';
                }
            });
        });
        
        carregarTerceirosColocados();
        document.getElementById("statusTerceiros").innerHTML = "🤖 Classificação automática aplicada! Clique em 'Salvar Grupo' ou 'Salvar Todos' para confirmar.";
        document.getElementById("statusTerceiros").style.color = "#1565c0";
    });
}

// =====================
// ADMIN - VISUALIZAR E EDITAR PALPITES DOS USUÁRIOS
// =====================

function carregarUsuariosSelect() {
    const selectUsuario = document.getElementById("selecionarUsuarioPalpite");
    if (!selectUsuario) return;
    
    database.ref("usuarios").once('value', snapshot => {
        const usuarios = snapshot.val() || {};
        selectUsuario.innerHTML = '<option value="">Selecione um usuário</option>';
        
        Object.keys(usuarios).forEach(nome => {
            const option = document.createElement("option");
            option.value = nome;
            option.textContent = nome;
            selectUsuario.appendChild(option);
        });
    });
}

function carregarFasesSelect() {
    const selectFase = document.getElementById("selecionarFasePalpite");
    if (!selectFase) return;
    
    const todasFases = window.rodadas || [];
    selectFase.innerHTML = '<option value="">Selecione a fase</option>';
    
    todasFases.forEach((fase, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = fase.nome;
        selectFase.appendChild(option);
    });
}

function carregarPalpitesUsuario() {
    const usuario = document.getElementById("selecionarUsuarioPalpite").value;
    const faseIndex = document.getElementById("selecionarFasePalpite").value;
    const container = document.getElementById("palpitesUsuarioContainer");
    
    if (!usuario || faseIndex === "") {
        alert("Selecione um usuário e uma fase!");
        return;
    }
    
    const todasFases = window.rodadas || [];
    const fase = todasFases[parseInt(faseIndex)];
    
    if (!fase || !fase.jogos) {
        container.innerHTML = "<p style='color:red;'>Erro ao carregar fase.</p>";
        return;
    }
    
    container.innerHTML = "<div class='loading'>🔄 Carregando palpites...</div>";
    
    Promise.all([
        database.ref(`palpites/${usuario}`).once('value'),
        database.ref("resultados").once('value')
    ]).then(([palpitesSnap, resultadosSnap]) => {
        const palpites = palpitesSnap.val() || {};
        const resultados = resultadosSnap.val() || {};
        
        let html = `<h4>📝 Palpites de <strong style="color:#0d47a1;">${usuario}</strong> - ${fase.nome}</h4>`;
        html += `<div style="max-height: 300px; overflow-y: auto;">`;
        
        fase.jogos.forEach(jogo => {
            const palpite = palpites[jogo.id] || { casa: "", fora: "", classificado: "" };
            const resultado = resultados[jogo.id];
            const temResultado = resultado && resultado.casa !== "";
            
            let infoExtra = "";
            if (jogo.data) {
                infoExtra = `<div style="font-size:10px; color:#666;">📅 ${jogo.data} | 📍 ${jogo.local}</div>`;
            }
            
            let classificacaoInfo = "";
            if (palpite.classificado) {
                const texto = palpite.classificado === 'casa' ? 'Casa' : 'Visitante';
                classificacaoInfo = `<div style="font-size:10px; color:#1565c0;">🏆 Classificado: ${texto}</div>`;
            }
            
            html += `
            <div class="jogo" style="margin-bottom: 10px; padding: 10px; background: white; border-radius: 8px;">
                <div style="flex:1;">
                    <strong>${jogo.casa}</strong> x <strong>${jogo.fora}</strong>
                    ${infoExtra}
                    ${temResultado ? `<div style="font-size:11px; color:#2e7d32;">Resultado oficial: ${resultado.casa} - ${resultado.fora}</div>` : '<div style="font-size:11px; color:#ff9800;">Aguardando resultado</div>'}
                    ${classificacaoInfo}
                </div>
                <div class="placar">
                    <input type="number" id="edit_casa_${jogo.id}" value="${palpite.casa}" min="0" placeholder="?" style="width:60px;">
                    <span>x</span>
                    <input type="number" id="edit_fora_${jogo.id}" value="${palpite.fora}" min="0" placeholder="?" style="width:60px;">
                </div>
            </div>
            `;
        });
        
        html += `</div>`;
        html += `<input type="hidden" id="edit_usuario" value="${usuario}">`;
        html += `<input type="hidden" id="edit_faseIndex" value="${faseIndex}">`;
        
        container.innerHTML = html;
    }).catch(err => {
        container.innerHTML = `<p style='color:red;'>Erro: ${err.message}</p>`;
    });
}

function salvarAlteracaoPalpite() {
    const usuario = document.getElementById("edit_usuario")?.value;
    const faseIndex = document.getElementById("edit_faseIndex")?.value;
    
    if (!usuario) {
        alert("Selecione um usuário primeiro!");
        return;
    }
    
    const todasFases = window.rodadas || [];
    const fase = todasFases[parseInt(faseIndex)];
    
    if (!fase) return;
    
    const palpitesAtualizados = {};
    
    fase.jogos.forEach(jogo => {
        const casaInput = document.getElementById(`edit_casa_${jogo.id}`);
        const foraInput = document.getElementById(`edit_fora_${jogo.id}`);
        
        if (casaInput && foraInput) {
            palpitesAtualizados[jogo.id] = {
                casa: casaInput.value || "",
                fora: foraInput.value || ""
            };
        }
    });
    
    database.ref(`palpites/${usuario}`).update(palpitesAtualizados)
        .then(() => {
            alert(`✅ Palpites de ${usuario} atualizados com sucesso!`);
            carregarPalpitesUsuario();
            if (document.getElementById("ranking")) {
                mostrarRanking();
            }
        })
        .catch(err => alert("Erro ao salvar: " + err));
}

// =====================
// ADMIN - RESETAR PALPITES
// =====================

function carregarResetUsuarios() {
    const select = document.getElementById("resetUsuarioSelect");
    if (!select) return;
    
    database.ref("usuarios").once('value', snapshot => {
        const usuarios = snapshot.val() || {};
        select.innerHTML = '<option value="">Selecione um usuário</option>';
        
        Object.keys(usuarios).forEach(nome => {
            const option = document.createElement("option");
            option.value = nome;
            option.textContent = nome;
            select.appendChild(option);
        });
    });
}

function carregarResetFases() {
    const select = document.getElementById("resetFaseSelect");
    if (!select) return;
    
    const todasFases = window.rodadas || [];
    select.innerHTML = '<option value="">Selecione a fase</option>';
    
    todasFases.forEach((fase, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = fase.nome;
        select.appendChild(option);
    });
}

function carregarResetJogos() {
    const usuario = document.getElementById("resetUsuarioSelect").value;
    const faseIndex = document.getElementById("resetFaseSelect").value;
    const selectJogo = document.getElementById("resetJogoSelect");
    const status = document.getElementById("resetStatus");
    
    if (!selectJogo) return;
    
    if (!usuario || faseIndex === "") {
        selectJogo.innerHTML = '<option value="">Selecione o jogo</option>';
        return;
    }
    
    const todasFases = window.rodadas || [];
    const fase = todasFases[parseInt(faseIndex)];
    
    if (!fase || !fase.jogos) {
        selectJogo.innerHTML = '<option value="">Nenhum jogo</option>';
        return;
    }
    
    selectJogo.innerHTML = '<option value="">Selecione o jogo</option>';
    
    database.ref(`palpites/${usuario}`).once('value', snapshot => {
        const palpites = snapshot.val() || {};
        
        fase.jogos.forEach(jogo => {
            const temPalpite = palpites[jogo.id] && palpites[jogo.id].casa !== "";
            const option = document.createElement("option");
            option.value = jogo.id;
            option.textContent = temPalpite ? `✅ ${jogo.casa} x ${jogo.fora}` : `⬜ ${jogo.casa} x ${jogo.fora}`;
            selectJogo.appendChild(option);
        });
    });
}

function resetarPalpiteUsuario() {
    const usuario = document.getElementById("resetUsuarioSelect").value;
    const jogoId = document.getElementById("resetJogoSelect").value;
    const status = document.getElementById("resetStatus");
    
    if (!usuario) {
        status.innerHTML = "⚠️ Selecione um usuário!";
        status.style.color = "#c62828";
        return;
    }
    
    if (!jogoId) {
        status.innerHTML = "⚠️ Selecione um jogo!";
        status.style.color = "#c62828";
        return;
    }
    
    if (!confirm(`Tem certeza que quer resetar o palpite de ${usuario} para este jogo?`)) return;
    
    database.ref(`palpites/${usuario}/${jogoId}`).remove()
        .then(() => {
            status.innerHTML = `✅ Palpite de ${usuario} resetado com sucesso!`;
            status.style.color = "#2e7d32";
            carregarResetJogos();
            if (document.getElementById("areaJogos")) carregarJogos();
        })
        .catch(err => {
            status.innerHTML = `❌ Erro: ${err.message}`;
            status.style.color = "#c62828";
        });
}

function resetarPalpitesDia() {
    const usuario = document.getElementById("resetUsuarioSelect").value;
    const faseIndex = document.getElementById("resetFaseSelect").value;
    const status = document.getElementById("resetStatus");
    
    if (!usuario) {
        status.innerHTML = "⚠️ Selecione um usuário!";
        status.style.color = "#c62828";
        return;
    }
    
    if (faseIndex === "") {
        status.innerHTML = "⚠️ Selecione uma fase/dia!";
        status.style.color = "#c62828";
        return;
    }
    
    const todasFases = window.rodadas || [];
    const fase = todasFases[parseInt(faseIndex)];
    
    if (!fase || !fase.jogos) {
        status.innerHTML = "⚠️ Fase não encontrada!";
        status.style.color = "#c62828";
        return;
    }
    
    if (!confirm(`Tem certeza que quer resetar TODOS os palpites de ${usuario} para "${fase.nome}"?`)) return;
    
    const updates = {};
    fase.jogos.forEach(jogo => {
        updates[`palpites/${usuario}/${jogo.id}`] = null;
    });
    
    database.ref().update(updates)
        .then(() => {
            status.innerHTML = `✅ Todos os palpites de ${usuario} para "${fase.nome}" foram resetados!`;
            status.style.color = "#2e7d32";
            carregarResetJogos();
            if (document.getElementById("areaJogos")) carregarJogos();
        })
        .catch(err => {
            status.innerHTML = `❌ Erro: ${err.message}`;
            status.style.color = "#c62828";
        });
}

function resetarTodosPalpitesUsuario() {
    const usuario = document.getElementById("resetUsuarioSelect").value;
    const status = document.getElementById("resetStatus");
    
    if (!usuario) {
        status.innerHTML = "⚠️ Selecione um usuário!";
        status.style.color = "#c62828";
        return;
    }
    
    if (!confirm(`⚠️ ATENÇÃO! Isso vai apagar TODOS os palpites de ${usuario}! Deseja continuar?`)) return;
    if (!confirm(`🔴 TEM CERTEZA? Essa ação não pode ser desfeita!`)) return;
    
    database.ref(`palpites/${usuario}`).remove()
        .then(() => {
            status.innerHTML = `✅ Todos os palpites de ${usuario} foram removidos!`;
            status.style.color = "#2e7d32";
            carregarResetJogos();
            if (document.getElementById("areaJogos")) carregarJogos();
        })
        .catch(err => {
            status.innerHTML = `❌ Erro: ${err.message}`;
            status.style.color = "#c62828";
        });
}

function resetarPalpitesTodosUsuariosDia() {
    const faseIndex = document.getElementById("resetFaseSelect").value;
    const status = document.getElementById("resetStatus");
    
    if (faseIndex === "") {
        status.innerHTML = "⚠️ Selecione uma fase/dia!";
        status.style.color = "#c62828";
        return;
    }
    
    const todasFases = window.rodadas || [];
    const fase = todasFases[parseInt(faseIndex)];
    
    if (!fase || !fase.jogos) {
        status.innerHTML = "⚠️ Fase não encontrada!";
        status.style.color = "#c62828";
        return;
    }
    
    if (!confirm(`⚠️ ATENÇÃO! Isso vai resetar os palpites de TODOS os usuários para "${fase.nome}"! Deseja continuar?`)) return;
    if (!confirm(`🔴 TEM CERTEZA? Essa ação afeta todos os participantes!`)) return;
    
    database.ref("usuarios").once('value', snapshot => {
        const usuarios = snapshot.val() || {};
        const usuariosArray = Object.keys(usuarios);
        
        if (usuariosArray.length === 0) {
            status.innerHTML = "⚠️ Nenhum usuário cadastrado!";
            status.style.color = "#c62828";
            return;
        }
        
        const updates = {};
        usuariosArray.forEach(nome => {
            fase.jogos.forEach(jogo => {
                updates[`palpites/${nome}/${jogo.id}`] = null;
            });
        });
        
        database.ref().update(updates)
            .then(() => {
                status.innerHTML = `✅ Palpites de TODOS os usuários para "${fase.nome}" foram resetados!`;
                status.style.color = "#2e7d32";
                carregarResetJogos();
                if (document.getElementById("areaJogos")) carregarJogos();
            })
            .catch(err => {
                status.innerHTML = `❌ Erro: ${err.message}`;
                status.style.color = "#c62828";
            });
    });
}

// =====================
// CLASSIFICAÇÃO DOS GRUPOS
// =====================

function carregarClassificacaoGrupos(grupoSelecionado) {
    const container = document.getElementById("classificacaoGrupos");
    if (!container) {
        console.log("❌ Elemento classificacaoGrupos não encontrado");
        return;
    }
    
    if (!grupoSelecionado) {
        grupoSelecionado = window.grupoSelecionado || 'A';
    }
    window.grupoSelecionado = grupoSelecionado;
    
    console.log(`🔄 Carregando classificação do grupo ${grupoSelecionado}...`);
    
    if (!gruposTimes[grupoSelecionado]) {
        container.innerHTML = `<p style='text-align:center;color:red;font-size:11px;'>Grupo ${grupoSelecionado} não existe</p>`;
        return;
    }
    
    Promise.all([
        database.ref("resultados").once('value'),
        database.ref("terceirosColocados").once('value')
    ]).then(function([resultadosSnap, terceirosSnap]) {
        const resultados = resultadosSnap.val() || {};
        const terceirosColocados = terceirosSnap.val() || {};
        
        const timesDoGrupo = gruposTimes[grupoSelecionado].map(t => t.nome);
        const classificacao = calcularClassificacaoGrupo(timesDoGrupo, resultados);
        const salvosGrupo = terceirosColocados[grupoSelecionado] || {};
        
        let terceiroLimpo = "";
        let eliminados = [];
        
        if (typeof salvosGrupo === 'object') {
            const keys = Object.keys(salvosGrupo);
            for (let key of keys) {
                if (salvosGrupo[key] === 'terceiro') {
                    terceiroLimpo = limparNomeTime(key);
                } else if (salvosGrupo[key] === 'eliminado') {
                    eliminados.push(limparNomeTime(key));
                }
            }
        }
        
        let html = `
        <div style="background: white; border-radius: 8px; padding: 10px; box-shadow: 0 1px 4px rgba(0,0,0,0.08);">
            <div style="text-align: center; font-weight: bold; font-size: 12px; color: #0d47a1; margin-bottom: 5px;">Grupo ${grupoSelecionado}</div>
            <table style="width: 100%; font-size: 10px; border-collapse: collapse;">
                <thead>
                    <tr style="background: #1565c0; color: white;">
                        <th style="padding: 2px 3px; text-align: left; font-size: 9px;">Time</th>
                        <th style="padding: 2px 3px; text-align: center; font-size: 9px;">P</th>
                        <th style="padding: 2px 3px; text-align: center; font-size: 9px;">J</th>
                        <th style="padding: 2px 3px; text-align: center; font-size: 9px;">V</th>
                        <th style="padding: 2px 3px; text-align: center; font-size: 9px;">E</th>
                        <th style="padding: 2px 3px; text-align: center; font-size: 9px;">D</th>
                        <th style="padding: 2px 3px; text-align: center; font-size: 9px;">SG</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        classificacao.forEach(function(item, index) {
            const temJogos = item.jogos > 0;
            let corFundo = '';
            let destaque = '';
            let statusIcon = '';
            let statusText = '';
            
            const itemLimpo = limparNomeTime(item.time);
            
            const isTerceiro = (terceiroLimpo && itemLimpo === terceiroLimpo);
            const isEliminado = eliminados.some(function(elim) {
                return elim === itemLimpo;
            });
            
            if (isTerceiro) {
                corFundo = 'background: #e3f2fd;';
                destaque = 'font-weight: bold;';
                statusIcon = ' 🔵';
                statusText = '3º Classificado';
            } else if (isEliminado) {
                corFundo = 'background: #ffebee;';
                statusIcon = ' ❌';
                statusText = 'Eliminado';
            } else if (index < 2 && temJogos) {
                corFundo = 'background: #e8f5e9;';
                destaque = 'font-weight: bold;';
                statusIcon = ' 🟢';
                statusText = 'Classificado';
            }
            
            const jogosDisplay = temJogos ? item.jogos : '-';
            const pontosDisplay = temJogos ? item.pontos : '-';
            const vitoriasDisplay = temJogos ? item.vitorias : '-';
            const empatesDisplay = temJogos ? item.empates : '-';
            const derrotasDisplay = temJogos ? item.derrotas : '-';
            const saldoDisplay = temJogos ? item.saldoGols : '-';
            
            let nomeComBandeira = item.time;
            for (let grupo in gruposTimes) {
                const encontrado = gruposTimes[grupo].find(t => t.nome === item.time);
                if (encontrado) {
                    nomeComBandeira = `<span class="${encontrado.bandeira}"></span> ${encontrado.nome}`;
                    break;
                }
            }
            
            let title = statusText ? ` title="${statusText}"` : '';
            
            html += `
                <tr style="${corFundo}"${title}>
                    <td style="padding: 2px 3px; text-align: left; ${destaque}; font-size: 10px;">${index+1} ${nomeComBandeira}${statusIcon}</td>
                    <td style="padding: 2px 3px; text-align: center; ${destaque}; font-size: 10px;">${pontosDisplay}</td>
                    <td style="padding: 2px 3px; text-align: center; font-size: 10px;">${jogosDisplay}</td>
                    <td style="padding: 2px 3px; text-align: center; font-size: 10px;">${vitoriasDisplay}</td>
                    <td style="padding: 2px 3px; text-align: center; font-size: 10px;">${empatesDisplay}</td>
                    <td style="padding: 2px 3px; text-align: center; font-size: 10px;">${derrotasDisplay}</td>
                    <td style="padding: 2px 3px; text-align: center; ${destaque}; font-size: 10px;">${saldoDisplay}</td>
                </tr>
            `;
        });
        
        html += `
                </tbody>
            </table>
            <div style="font-size: 8px; color: #999; text-align: center; margin-top: 4px;">
                🟢 1º/2º | 🔵 3º Classificado | ❌ Eliminado | P=Pontos | J=Jogos | SG=Saldo
            </div>
        </div>
        `;
        
        container.innerHTML = html;
        console.log("✅ Classificação carregada com sucesso!");
        
    }).catch(function(err) {
        console.error("❌ Erro ao carregar classificação:", err);
        container.innerHTML = `<p style='text-align:center;color:red;font-size:11px;'>❌ Erro: ${err.message}</p>`;
    });
}

function calcularClassificacaoGrupo(times, resultados) {
    const stats = {};
    times.forEach(function(time) {
        const nomeLimpo = limparNomeTime(time);
        const nomeOriginal = typeof time === 'object' && time.nome ? time.nome : time;
        stats[nomeLimpo] = {
            timeOriginal: nomeOriginal,
            pontos: 0,
            jogos: 0,
            vitorias: 0,
            empates: 0,
            derrotas: 0,
            golsPro: 0,
            golsContra: 0,
            saldoGols: 0
        };
    });
    
    const todasFases = window.rodadas || [];
    
    Object.keys(resultados).forEach(function(id) {
        const resultado = resultados[id];
        if (!resultado || resultado.casa === undefined || resultado.fora === undefined) return;
        
        let timeCasa = null;
        let timeFora = null;
        
        for (let i = 0; i < todasFases.length; i++) {
            const fase = todasFases[i];
            for (let j = 0; j < fase.jogos.length; j++) {
                const jogo = fase.jogos[j];
                if (jogo.id == id) {
                    timeCasa = limparNomeTime(jogo.casa);
                    timeFora = limparNomeTime(jogo.fora);
                    break;
                }
            }
            if (timeCasa) break;
        }
        
        if (!timeCasa || !timeFora) return;
        
        const casaNoGrupo = Object.keys(stats).some(function(t) {
            return t.toLowerCase() === timeCasa.toLowerCase();
        });
        const foraNoGrupo = Object.keys(stats).some(function(t) {
            return t.toLowerCase() === timeFora.toLowerCase();
        });
        
        if (!casaNoGrupo && !foraNoGrupo) return;
        
        const golsCasa = parseInt(resultado.casa);
        const golsFora = parseInt(resultado.fora);
        
        if (casaNoGrupo) {
            const timeKey = Object.keys(stats).find(function(t) {
                return t.toLowerCase() === timeCasa.toLowerCase();
            });
            if (timeKey) {
                stats[timeKey].jogos++;
                stats[timeKey].golsPro += golsCasa;
                stats[timeKey].golsContra += golsFora;
                
                if (golsCasa > golsFora) {
                    stats[timeKey].vitorias++;
                    stats[timeKey].pontos += 3;
                } else if (golsCasa === golsFora) {
                    stats[timeKey].empates++;
                    stats[timeKey].pontos += 1;
                } else {
                    stats[timeKey].derrotas++;
                }
            }
        }
        
        if (foraNoGrupo) {
            const timeKey = Object.keys(stats).find(function(t) {
                return t.toLowerCase() === timeFora.toLowerCase();
            });
            if (timeKey) {
                stats[timeKey].jogos++;
                stats[timeKey].golsPro += golsFora;
                stats[timeKey].golsContra += golsCasa;
                
                if (golsFora > golsCasa) {
                    stats[timeKey].vitorias++;
                    stats[timeKey].pontos += 3;
                } else if (golsFora === golsCasa) {
                    stats[timeKey].empates++;
                    stats[timeKey].pontos += 1;
                } else {
                    stats[timeKey].derrotas++;
                }
            }
        }
    });
    
    Object.keys(stats).forEach(function(time) {
        stats[time].saldoGols = stats[time].golsPro - stats[time].golsContra;
    });
    
    const classificacao = Object.keys(stats).map(function(time) {
        return {
            time: stats[time].timeOriginal,
            pontos: stats[time].pontos,
            jogos: stats[time].jogos,
            vitorias: stats[time].vitorias,
            empates: stats[time].empates,
            derrotas: stats[time].derrotas,
            golsPro: stats[time].golsPro,
            golsContra: stats[time].golsContra,
            saldoGols: stats[time].saldoGols
        };
    });
    
    classificacao.sort(function(a, b) {
        if (a.jogos === 0 && b.jogos > 0) return 1;
        if (a.jogos > 0 && b.jogos === 0) return -1;
        if (b.pontos !== a.pontos) return b.pontos - a.pontos;
        if (b.saldoGols !== a.saldoGols) return b.saldoGols - a.saldoGols;
        return b.golsPro - a.golsPro;
    });
    
    return classificacao;
}

// =====================
// CALCULAR PONTOS (CORRIGIDO PARA MATA-MATA)
// =====================
function calcularPontos(pc, pf, rc, rf, classificado, classificadoReal) {
    pc = parseInt(pc);
    pf = parseInt(pf);
    rc = parseInt(rc);
    rf = parseInt(rf);
    
    if (isNaN(pc) || isNaN(pf) || isNaN(rc) || isNaN(rf)) return 0;
    
    let pontos = 0;
    
    // 1. Pontos do placar
    if (pc === rc && pf === rf) {
        // PLACAR EXATO - 3 pontos
        pontos += 3;
    } else {
        // Verificar tendência (vencedor/empate)
        let palpiteTendencia, resultadoTendencia;
        
        if (pc > pf) palpiteTendencia = "C";
        else if (pc < pf) palpiteTendencia = "F";
        else palpiteTendencia = "E";
        
        if (rc > rf) resultadoTendencia = "C";
        else if (rc < rf) resultadoTendencia = "F";
        else resultadoTendencia = "E";
        
        // Acertou o vencedor/empate - 1 ponto
        if (palpiteTendencia === resultadoTendencia) {
            pontos += 1;
        }
    }
    
    // 2. Ponto extra para MATA-MATA: se acertou o classificado
    // Verifica se o resultado foi empate (rc === rf) E se o palpite foi empate (pc === pf)
    // E se o usuário selecionou um classificado e acertou
    const isResultadoEmpate = rc === rf;
    const isPalpiteEmpate = pc === pf;
    
    // Só dá o bônus se:
    // 1. O jogo terminou empatado no tempo normal
    // 2. O usuário palpou empate
    // 3. O usuário selecionou um classificado
    // 4. O usuário acertou o classificado
    if (isResultadoEmpate && isPalpiteEmpate && classificado && classificadoReal && classificado === classificadoReal) {
        pontos += 1;
    }
    
    console.log(`📊 Cálculo: ${pc}x${pf} vs ${rc}x${rf} | Classif: ${classificado} vs ${classificadoReal} | Pontos: ${pontos}`);
    
    return pontos;
}

// =====================
// RANKING
// =====================
function mostrarRanking(filtro) {
    const tabela = document.getElementById("ranking");
    if (!tabela) return;
    
    const filtroUsar = filtro || window.filtroRankingAtual || 'geral';
    
    tabela.innerHTML = "<tr><td colspan='3'>Carregando...</td></tr>";
    
    const todasFases = window.rodadas || [];
    const idsGrupos = [];
    const idsMataMata = [];
    
    todasFases.forEach((fase, index) => {
        if (index < 17) {
            fase.jogos.forEach(jogo => idsGrupos.push(jogo.id));
        } else {
            fase.jogos.forEach(jogo => idsMataMata.push(jogo.id));
        }
    });
    
    let idsFiltrados = null;
    if (filtroUsar === 'grupos') {
        idsFiltrados = idsGrupos;
    } else if (filtroUsar === 'mata') {
        idsFiltrados = idsMataMata;
    }
    
    database.ref("resultados").once('value', function(snapshotResultados) {
        const resultados = snapshotResultados.val() || {};
        
        database.ref("palpites").once('value', function(snapshotPalpites) {
            const palpitesTodos = snapshotPalpites.val() || {};
            
            database.ref("usuarios").once('value', function(snapshotUsuarios) {
                const usuarios = snapshotUsuarios.val() || {};
                const participantes = Object.keys(usuarios);
                
                if (participantes.length === 0) {
                    tabela.innerHTML = "<tr><td colspan='3'>Nenhum usuário cadastrado</td></tr>";
                    return;
                }
                
                const ranking = [];
                
                participantes.forEach(function(nome) {
                    let pontos = 0;
                    const palpites = palpitesTodos[nome] || {};
                    
                    Object.keys(resultados).forEach(function(id) {
                        if (idsFiltrados !== null && !idsFiltrados.includes(parseInt(id))) {
                            return;
                        }
                        
                        const resultado = resultados[id];
                        const palpite = palpites[id];
                        
                        if (palpite && resultado && resultado.casa !== undefined && resultado.casa !== "") {
                            const classificado = palpite.classificado || "";
                            const classificadoReal = resultado.classificado || "";
                            
                            pontos += calcularPontos(
                                parseInt(palpite.casa), 
                                parseInt(palpite.fora), 
                                parseInt(resultado.casa), 
                                parseInt(resultado.fora),
                                classificado,
                                classificadoReal
                            );
                        }
                    });
                    ranking.push({ nome: nome, pontos: pontos });
                });
                
                ranking.sort(function(a, b) { return b.pontos - a.pontos; });
                tabela.innerHTML = "";
                
                if (ranking.length === 0 || ranking.every(function(item) { return item.pontos === 0; })) {
                    tabela.innerHTML = "<tr><td colspan='3'>Nenhum ponto registrado nesta fase</td></tr>";
                    return;
                }
                
                ranking.forEach(function(item, index) {
                    let medalha = '';
                    if (index === 0) medalha = ' 🏆';
                    else if (index === 1) medalha = ' 🥈';
                    else if (index === 2) medalha = ' 🥉';
                    
                    tabela.innerHTML += `
                    <tr>
                        <td>${index + 1}º${medalha}</td>
                        <td>${item.nome}</td>
                        <td><strong>${item.pontos} ponto${item.pontos !== 1 ? 's' : ''}</strong></td>
                    </tr>
                    `;
                });
            });
        });
    });
}

// =====================
// VERIFICAR ACESSO ADMIN
// =====================
function verificarAcessoAdmin() {
    if (window.location.pathname.includes("admin.html")) {
        const senha = prompt("🔐 Digite a senha de administrador:");
        if (senha !== "copa2026") {
            document.body.innerHTML = "<h1 style='text-align:center;color:red;margin-top:50px;'>🚫 Acesso Negado</h1>";
            return false;
        }
        return true;
    }
    return true;
}

// =====================
// INIT
// =====================
document.addEventListener("DOMContentLoaded", function() {
    console.log("🔄 Inicializando aplicação...");
    console.log("📊 Fases carregadas:", window.rodadas ? window.rodadas.length : 0);
    console.log("📋 Grupos disponíveis:", Object.keys(gruposTimes));
    
    window.filtroRankingAtual = 'geral';
    
    carregarResultadosOficiais();
    
    if (document.getElementById("classificacaoGrupos")) {
        console.log("📊 Inicializando classificação dos grupos...");
        setTimeout(function() {
            carregarClassificacaoGrupos('A');
        }, 500);
        
        database.ref("resultados").on('value', function() {
            carregarClassificacaoGrupos(window.grupoSelecionado || 'A');
        });
        
        database.ref("terceirosColocados").on('value', function() {
            console.log("🔄 Listener do terceirosColocados disparado!");
            carregarClassificacaoGrupos(window.grupoSelecionado || 'A');
        });
    }
    
    if (!window.location.pathname.includes("index.html")) {
        const usuarioLogado = verificarLogin();
        if (!verificarAcessoAdmin()) return;
        
        carregarStatusTrava();
        
        if (document.getElementById("areaJogos")) {
            console.log("📝 Inicializando página de palpites...");
            inicializarInterfaceDias();
        }
        
        if (document.getElementById("adminJogos")) {
            console.log("⚙️ Inicializando página admin...");
            montarAdmin();
            carregarUsuarios();
            carregarUsuariosSelect();
            carregarFasesSelect();
            carregarResetUsuarios();
            carregarResetFases();
        }
        
        if (document.getElementById("terceirosColocados")) {
            console.log("📋 Inicializando 3º colocados...");
            setTimeout(function() {
                carregarTerceirosColocados();
            }, 700);
        }
        
        if (document.getElementById("ranking")) {
            console.log("🏅 Inicializando ranking...");
            mostrarRanking('geral');
            database.ref("resultados").on('value', function() {
                mostrarRanking(window.filtroRankingAtual);
            });
            database.ref("palpites").on('value', function() {
                mostrarRanking(window.filtroRankingAtual);
            });
        }
    }
    
    console.log("✅ Aplicação inicializada com sucesso!");
});