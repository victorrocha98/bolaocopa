// =====================
// VARIÁVEIS GLOBAIS
// =====================
let usuarioAtual = null;
let diaAtivoIndex = 0;
let palpitesBloqueados = false;
let resultadosOficiais = {};

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
// GERENCIAR USUÁRIOS (Admin)
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
            html += `
            <div style="display: flex; justify-content: space-between; align-items: center; background: #f5f5f5; padding: 10px; border-radius: 8px;">
                <span><strong>${nome}</strong></span>
                <button onclick="excluirUsuario('${nome}')" style="background: #c62828; padding: 5px 10px;">🗑️ Excluir</button>
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
            })
            .catch(err => alert("Erro: " + err));
    }
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
                statusDiv.innerHTML = "🔓 PALPITES ABERTOS - Você pode alterar seus palpites!";
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
    });
}

// =====================
// INTERFACE DE ABAS (FASES)
// =====================
function inicializarInterfaceDias() {
    const filtro = document.getElementById("filtroDias");
    if (!filtro) return;
    
    // Pega as fases do arquivo jogos.js
    const todasFases = window.rodadas || [];
    
    if (todasFases.length === 0) {
        console.error("Nenhuma fase encontrada!");
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
// CARREGAR JOGOS (Palpites)
// =====================
function carregarJogos() {
    const area = document.getElementById("areaJogos");
    if (!area) return;
    
    const usuario = localStorage.getItem("usuarioLogado");
    if (!usuario) return;
    
    const todasFases = window.rodadas || [];
    const blocoRodada = todasFases[diaAtivoIndex];
    
    if (!blocoRodada || !blocoRodada.jogos || blocoRodada.jogos.length === 0) {
        area.innerHTML = "<div style='text-align:center; padding:40px; background:white; border-radius:15px;'>📭 Nenhum jogo nesta fase ainda.<br>O administrador vai adicionar os jogos em breve!</div>";
        return;
    }
    
    area.innerHTML = "<div class='loading'>🔄 Carregando jogos...</div>";
    
    Promise.all([
        database.ref(`palpites/${usuario}`).once('value'),
        database.ref("resultados").once('value')
    ]).then(([palpitesSnap, resultadosSnap]) => {
        const palpites = palpitesSnap.val() || {};
        const resultados = resultadosSnap.val() || {};
        
        let html = `<div class="rodada"><h2>📅 ${blocoRodada.nome}</h2>`;
        html += `<p style="color:#666; margin-bottom:15px;">Faça seus palpites para os jogos abaixo:</p>`;
        
        blocoRodada.jogos.forEach(jogo => {
            const palpite = palpites[jogo.id] || { casa: "", fora: "" };
            const resultado = resultados[jogo.id];
            const temResultado = resultado && resultado.casa !== "" && resultado.casa !== undefined;
            
            let statusCor = "";
            let mensagemStatus = "";
            
            if (temResultado && palpite.casa !== "" && palpite.casa !== undefined) {
                const palpiteCasa = parseInt(palpite.casa);
                const palpiteFora = parseInt(palpite.fora);
                const resultCasa = parseInt(resultado.casa);
                const resultFora = parseInt(resultado.fora);
                
                if (palpiteCasa === resultCasa && palpiteFora === resultFora) {
                    statusCor = "palpite-correto";
                    mensagemStatus = "✅ ACERTOU! +1 ponto";
                } else {
                    statusCor = "palpite-errado";
                    mensagemStatus = `❌ Errou! Resultado oficial: ${resultado.casa} - ${resultado.fora}`;
                }
            }
            
            let desabilitado = palpitesBloqueados || temResultado;
            let disabledAttr = desabilitado ? 'disabled' : '';
            
            html += `
            <div class="jogo ${statusCor}" id="jogo_${jogo.id}">
                <div style="flex:1;">
                    <strong>${jogo.casa}</strong> 
                    <span style="font-size:20px;">⚽</span> 
                    <strong>${jogo.fora}</strong>
                    ${temResultado ? `<div style="font-size:11px; color:#2e7d32; margin-top:5px;">📊 PLACAR OFICIAL: ${resultado.casa} - ${resultado.fora}</div>` : ''}
                    ${mensagemStatus ? `<div style="font-size:12px; margin-top:3px; font-weight:bold;">${mensagemStatus}</div>` : ''}
                </div>
                <div class="placar">
                    <input type="number" id="casa_${jogo.id}" value="${palpite.casa}" min="0" placeholder="?" ${disabledAttr}>
                    <span>x</span>
                    <input type="number" id="fora_${jogo.id}" value="${palpite.fora}" min="0" placeholder="?" ${disabledAttr}>
                </div>
            </div>
            `;
        });
        
        html += `</div>`;
        area.innerHTML = html;
        
        const btnSalvar = document.getElementById("btnSalvarPalpites");
        if (btnSalvar) {
            btnSalvar.style.display = palpitesBloqueados ? "none" : "block";
        }
    }).catch(err => {
        console.error("Erro:", err);
        area.innerHTML = "<div style='text-align:center;color:red;padding:20px;background:white;border-radius:15px;'>❌ Erro ao carregar jogos</div>";
    });
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
    const palpitesAtualizados = {};
    
    blocoRodada.jogos.forEach(jogo => {
        const casaInput = document.getElementById(`casa_${jogo.id}`);
        const foraInput = document.getElementById(`fora_${jogo.id}`);
        
        if (casaInput && foraInput && !casaInput.disabled) {
            palpitesAtualizados[jogo.id] = {
                casa: casaInput.value || "0",
                fora: foraInput.value || "0"
            };
        }
    });
    
    if (Object.keys(palpitesAtualizados).length === 0) {
        alert("Nenhum palpite para salvar!");
        return;
    }
    
    database.ref(`palpites/${usuario}`).update(palpitesAtualizados)
        .then(() => alert(`✅ Palpites salvos com sucesso!`))
        .catch(err => alert("Erro: " + err));
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
            
            let html = `<div class="rodada"><h2>📅 ${bloco.nome}</h2>`;
            
            bloco.jogos.forEach(jogo => {
                const resultado = resultados[jogo.id] || { casa: "", fora: "" };
                const temResultado = resultado.casa !== "" && resultado.casa !== undefined;
                
                html += `
                <div class="jogo" id="admin_jogo_${jogo.id}" style="${temResultado ? 'background:#e8f5e9;' : ''}">
                    <div style="flex:1;">
                        <strong>${jogo.casa}</strong> x <strong>${jogo.fora}</strong>
                        ${temResultado ? '<span style="color:#2e7d32; font-size:11px; margin-left:10px;">✅ Resultado salvo</span>' : '<span style="color:#ff9800; font-size:11px; margin-left:10px;">⏳ Pendente</span>'}
                    </div>
                    <div class="placar">
                        <input type="number" id="rcasa_${jogo.id}" value="${temResultado ? resultado.casa : ''}" min="0" placeholder="?" style="width:70px;">
                        <span>x</span>
                        <input type="number" id="rfora_${jogo.id}" value="${temResultado ? resultado.fora : ''}" min="0" placeholder="?" style="width:70px;">
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
    
    todasFases.forEach(bloco => {
        if (!bloco.jogos) return;
        
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
                        resultados[jogo.id] = { casa: casaNum, fora: foraNum };
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

// =====================
// PONTOS E RANKING
// =====================
function calcularPontos(pc, pf, rc, rf) {
    pc = parseInt(pc);
    pf = parseInt(pf);
    rc = parseInt(rc);
    rf = parseInt(rf);
    if (isNaN(pc) || isNaN(pf) || isNaN(rc) || isNaN(rf)) return 0;
    if (pc === rc && pf === rf) return 1;
    return 0;
}

function mostrarRanking() {
    const tabela = document.getElementById("ranking");
    if (!tabela) return;
    
    tabela.innerHTML = "<tr><td colspan='3'>Carregando...</td></tr>";
    
    database.ref("resultados").once('value', snapshotResultados => {
        const resultados = snapshotResultados.val() || {};
        
        database.ref("palpites").once('value', snapshotPalpites => {
            const palpitesTodos = snapshotPalpites.val() || {};
            
            database.ref("usuarios").once('value', snapshotUsuarios => {
                const usuarios = snapshotUsuarios.val() || {};
                const participantes = Object.keys(usuarios);
                
                if (participantes.length === 0) {
                    tabela.innerHTML = "<tr><td colspan='3'>Nenhum usuário cadastrado</td></tr>";
                    return;
                }
                
                const ranking = [];
                
                participantes.forEach(nome => {
                    let pontos = 0;
                    const palpites = palpitesTodos[nome] || {};
                    
                    Object.keys(resultados).forEach(id => {
                        const resultado = resultados[id];
                        const palpite = palpites[id];
                        if (palpite && resultado && resultado.casa !== undefined && resultado.casa !== "") {
                            pontos += calcularPontos(palpite.casa, palpite.fora, resultado.casa, resultado.fora);
                        }
                    });
                    ranking.push({ nome, pontos });
                });
                
                ranking.sort((a, b) => b.pontos - a.pontos);
                tabela.innerHTML = "";
                
                ranking.forEach((item, index) => {
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
// FUNÇÃO PARA RECARREGAR JOGOS DO MATA-MATA (Admin)
// =====================
function carregarJogosMataMata() {
    const container = document.getElementById("jogosMataMataList");
    if (!container) return;
    
    // Mostrar as fases disponíveis no jogos.js
    const todasFases = window.rodadas || [];
    const fasesMata = todasFases.filter(f => f.nome.includes("🏆") || f.nome.includes("🥉"));
    
    if (fasesMata.length === 0) {
        container.innerHTML = "<p>Nenhum jogo do mata-mata cadastrado no jogos.js ainda.</p>";
        return;
    }
    
    let html = "";
    fasesMata.forEach(fase => {
        html += `<h5 style="margin-top: 15px; color: #0d47a1;">${fase.nome}</h5>`;
        html += `<div style="margin-left: 15px; margin-bottom: 15px;">`;
        
        fase.jogos.forEach((jogo, idx) => {
            html += `
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px; background: #f5f5f5; padding: 8px; border-radius: 8px;">
                <span><strong>${jogo.casa}</strong> x <strong>${jogo.fora}</strong></span>
                <span style="color:#666; font-size:12px;">(ID: ${jogo.id})</span>
            </div>
            `;
        });
        
        html += `</div>`;
    });
    
    container.innerHTML = html;
}

// =====================
// INIT
// =====================
document.addEventListener("DOMContentLoaded", () => {
    console.log("Inicializando...");
    console.log("Fases carregadas:", window.rodadas);
    
    carregarResultadosOficiais();
    
    if (!window.location.pathname.includes("index.html")) {
        const usuarioLogado = verificarLogin();
        if (!verificarAcessoAdmin()) return;
        
        carregarStatusTrava();
        
        if (document.getElementById("areaJogos")) {
            inicializarInterfaceDias();
        }
        
        if (document.getElementById("adminJogos")) {
            montarAdmin();
            carregarUsuarios();
            carregarJogosMataMata();
        }
        
        if (document.getElementById("ranking")) {
            mostrarRanking();
            database.ref("resultados").on('value', () => mostrarRanking());
            database.ref("palpites").on('value', () => mostrarRanking());
        }
    }
});