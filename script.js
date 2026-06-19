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
        html += `<p style="color:#666; margin-bottom:15px;">Faça seus palpites para os jogos abaixo:</p>`;
        
        blocoRodada.jogos.forEach(jogo => {
            const palpite = palpites[jogo.id] || { casa: "", fora: "" };
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
            
            html += `
            <div class="jogo ${statusCor}" id="jogo_${jogo.id}">
                <div style="flex:1;">
                    <strong>${jogo.casa}</strong> 
                    <span style="font-size:20px;">⚽</span> 
                    <strong>${jogo.fora}</strong>
                    ${temResultado ? `<div style="font-size:11px; color:#2e7d32; margin-top:5px;">📊 PLACAR OFICIAL: ${resultado.casa} - ${resultado.fora}</div>` : ''}
                    ${mensagemStatus ? `<div style="font-size:12px; margin-top:3px; font-weight:bold;">${mensagemStatus}</div>` : ''}
                    ${palpiteJaSalvo && !temResultado ? `<div style="font-size:11px; color:#ff9800; margin-top:3px;">🔒 Palpite já salvo - não pode mais alterar</div>` : ''}
                </div>
                <div class="placar">
                    <input type="number" id="casa_${jogo.id}" value="${palpite.casa}" min="0" placeholder="?" ${disabledAttr} ${estiloInput}>
                    <span>x</span>
                    <input type="number" id="fora_${jogo.id}" value="${palpite.fora}" min="0" placeholder="?" ${disabledAttr} ${estiloInput}>
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

function salvarPalpites() {
    const usuario = localStorage.getItem("usuarioLogado");
    if (!usuario) return;
    
    if (palpitesBloqueados) {
        alert("⚠️ Os palpites estão bloqueados pelo admin!");
        return;
    }
    
    const todasFases = window.rodadas || [];
    const blocoRodada = todasFases[diaAtivoIndex];
    
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
        
        const palpitesAtualizados = {};
        let todosPreenchidos = true;
        
        blocoRodada.jogos.forEach(jogo => {
            const casaInput = document.getElementById(`casa_${jogo.id}`);
            const foraInput = document.getElementById(`fora_${jogo.id}`);
            
            if (casaInput && foraInput && !casaInput.disabled) {
                if (casaInput.value === "" || foraInput.value === "") {
                    todosPreenchidos = false;
                } else {
                    palpitesAtualizados[jogo.id] = {
                        casa: casaInput.value || "0",
                        fora: foraInput.value || "0"
                    };
                }
            }
        });
        
        if (!todosPreenchidos) {
            alert("⚠️ Preencha TODOS os palpites do dia antes de salvar!");
            return;
        }
        
        if (Object.keys(palpitesAtualizados).length === 0) {
            alert("⚠️ Nenhum palpite para salvar!");
            return;
        }
        
        database.ref(`palpites/${usuario}`).update(palpitesAtualizados)
            .then(() => {
                alert(`✅ Palpites do dia salvos com sucesso! Agora eles estão bloqueados.`);
                carregarJogos();
            })
            .catch(err => alert("Erro: " + err));
    });
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
            
            let html = `<div class="rodada"><h2>${bloco.nome}</h2>`;
            
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
            const palpite = palpites[jogo.id] || { casa: "", fora: "" };
            const resultado = resultados[jogo.id];
            const temResultado = resultado && resultado.casa !== "";
            
            html += `
            <div class="jogo" style="margin-bottom: 10px; padding: 10px; background: white; border-radius: 8px;">
                <div style="flex:1;">
                    <strong>${jogo.casa}</strong> x <strong>${jogo.fora}</strong>
                    ${temResultado ? `<div style="font-size:11px; color:#2e7d32;">Resultado oficial: ${resultado.casa} - ${resultado.fora}</div>` : '<div style="font-size:11px; color:#ff9800;">Aguardando resultado</div>'}
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

const gruposTimes = {
    "Grupo A": ["México", "África do Sul", "Coreia do Sul", "República Tcheca"],
    "Grupo B": ["Canadá", "Bósnia e Herzegovina", "Catar", "Suíça"],
    "Grupo C": ["Brasil", "Marrocos", "Haiti", "Escócia"],
    "Grupo D": ["Estados Unidos", "Paraguai", "Austrália", "Turquia"],
    "Grupo E": ["Alemanha", "Curaçau", "Costa do Marfim", "Equador"],
    "Grupo F": ["Holanda", "Japão", "Suécia", "Tunísia"],
    "Grupo G": ["Bélgica", "Egito", "Irã", "Nova Zelândia"],
    "Grupo H": ["Espanha", "Cabo Verde", "Arábia Saudita", "Uruguai"],
    "Grupo I": ["França", "Senegal", "Iraque", "Noruega"],
    "Grupo J": ["Argentina", "Argélia", "Áustria", "Jordânia"],
    "Grupo K": ["Portugal", "RD Congo", "Uzbequistão", "Colômbia"],
    "Grupo L": ["Inglaterra", "Croácia", "Gana", "Panamá"]
};

function limparNomeTime(nome) {
    if (!nome) return '';
    let nomeLimpo = nome.replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '').trim();
    nomeLimpo = nomeLimpo.replace(/[\u{1F3F4}\u{E0067}\u{E0062}\u{E0077}\u{E006C}\u{E0073}\u{E007F}]/gu, '').trim();
    nomeLimpo = nomeLimpo.replace(/[\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}]/gu, '').trim();
    nomeLimpo = nomeLimpo.replace(/[^a-zA-ZÀ-ÿ\s]/g, '').trim();
    return nomeLimpo;
}

function carregarClassificacaoGrupos(grupoSelecionado) {
    const container = document.getElementById("classificacaoGrupos");
    if (!container) return;
    
    if (!grupoSelecionado) {
        grupoSelecionado = window.grupoSelecionado || 'A';
    }
    window.grupoSelecionado = grupoSelecionado;
    
    database.ref("resultados").once('value', snapshot => {
        const resultados = snapshot.val() || {};
        
        let grupoEncontrado = null;
        let timesDoGrupo = [];
        
        Object.keys(gruposTimes).forEach(grupo => {
            if (grupo.includes(grupoSelecionado)) {
                grupoEncontrado = grupo;
                timesDoGrupo = gruposTimes[grupo];
            }
        });
        
        if (!grupoEncontrado || timesDoGrupo.length === 0) {
            container.innerHTML = "<p style='text-align:center;color:red;font-size:11px;'>Grupo não encontrado</p>";
            return;
        }
        
        const classificacao = calcularClassificacaoGrupo(timesDoGrupo, resultados);
        
        let html = `
        <div style="background: white; border-radius: 8px; padding: 10px; box-shadow: 0 1px 4px rgba(0,0,0,0.08);">
            <div style="text-align: center; font-weight: bold; font-size: 12px; color: #0d47a1; margin-bottom: 5px;">${grupoEncontrado}</div>
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
        
        classificacao.forEach((item, index) => {
            const temJogos = item.jogos > 0;
            const corFundo = index < 2 && temJogos ? 'background: #e8f5e9;' : '';
            const destaque = index < 2 && temJogos ? 'font-weight: bold;' : '';
            
            const jogosDisplay = temJogos ? item.jogos : '-';
            const pontosDisplay = temJogos ? item.pontos : '-';
            const vitoriasDisplay = temJogos ? item.vitorias : '-';
            const empatesDisplay = temJogos ? item.empates : '-';
            const derrotasDisplay = temJogos ? item.derrotas : '-';
            const saldoDisplay = temJogos ? item.saldoGols : '-';
            
            let nomeTime = item.time;
            if (nomeTime.length > 14) {
                nomeTime = nomeTime.substring(0, 12) + '...';
            }
            
            let classificacaoIcon = '';
            if (index < 2 && temJogos) {
                classificacaoIcon = ' 🟢';
            }
            
            html += `
                <tr style="${corFundo}">
                    <td style="padding: 2px 3px; text-align: left; ${destaque}; font-size: 10px;">${index+1} ${nomeTime}${classificacaoIcon}</td>
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
                🟢 Classificados | P=Pontos | J=Jogos | SG=Saldo
            </div>
        </div>
        `;
        
        container.innerHTML = html;
    }).catch(err => {
        console.error("Erro:", err);
        container.innerHTML = "<p style='text-align:center;color:red;font-size:11px;'>❌ Erro ao carregar</p>";
    });
}

function calcularClassificacaoGrupo(times, resultados) {
    const stats = {};
    times.forEach(time => {
        stats[time] = {
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
    
    Object.keys(resultados).forEach(id => {
        const resultado = resultados[id];
        if (!resultado || resultado.casa === undefined || resultado.fora === undefined) return;
        
        let timeCasa = null;
        let timeFora = null;
        
        for (let fase of todasFases) {
            for (let jogo of fase.jogos) {
                if (jogo.id == id) {
                    timeCasa = limparNomeTime(jogo.casa);
                    timeFora = limparNomeTime(jogo.fora);
                    break;
                }
            }
            if (timeCasa) break;
        }
        
        if (!timeCasa || !timeFora) return;
        
        const casaNoGrupo = times.some(t => limparNomeTime(t).toLowerCase() === timeCasa.toLowerCase());
        const foraNoGrupo = times.some(t => limparNomeTime(t).toLowerCase() === timeFora.toLowerCase());
        
        if (!casaNoGrupo && !foraNoGrupo) return;
        
        const golsCasa = parseInt(resultado.casa);
        const golsFora = parseInt(resultado.fora);
        
        if (casaNoGrupo) {
            const timeKey = times.find(t => limparNomeTime(t).toLowerCase() === timeCasa.toLowerCase());
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
            const timeKey = times.find(t => limparNomeTime(t).toLowerCase() === timeFora.toLowerCase());
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
    
    Object.keys(stats).forEach(time => {
        stats[time].saldoGols = stats[time].golsPro - stats[time].golsContra;
    });
    
    const classificacao = Object.keys(stats).map(time => ({
        time: time,
        pontos: stats[time].pontos,
        jogos: stats[time].jogos,
        vitorias: stats[time].vitorias,
        empates: stats[time].empates,
        derrotas: stats[time].derrotas,
        golsPro: stats[time].golsPro,
        golsContra: stats[time].golsContra,
        saldoGols: stats[time].saldoGols
    }));
    
    classificacao.sort((a, b) => {
        if (a.jogos === 0 && b.jogos > 0) return 1;
        if (a.jogos > 0 && b.jogos === 0) return -1;
        if (b.pontos !== a.pontos) return b.pontos - a.pontos;
        if (b.saldoGols !== a.saldoGols) return b.saldoGols - a.saldoGols;
        return b.golsPro - a.golsPro;
    });
    
    return classificacao;
}

// =====================
// CALCULAR PONTOS
// =====================
function calcularPontos(pc, pf, rc, rf) {
    pc = parseInt(pc);
    pf = parseInt(pf);
    rc = parseInt(rc);
    rf = parseInt(rf);
    
    if (isNaN(pc) || isNaN(pf) || isNaN(rc) || isNaN(rf)) return 0;
    
    if (pc === rc && pf === rf) {
        return 3;
    }
    
    let palpiteTendencia, resultadoTendencia;
    
    if (pc > pf) {
        palpiteTendencia = "C";
    } else if (pc < pf) {
        palpiteTendencia = "F";
    } else {
        palpiteTendencia = "E";
    }
    
    if (rc > rf) {
        resultadoTendencia = "C";
    } else if (rc < rf) {
        resultadoTendencia = "F";
    } else {
        resultadoTendencia = "E";
    }
    
    if (palpiteTendencia === resultadoTendencia) {
        return 1;
    }
    
    return 0;
}

// =====================
// RANKING
// =====================
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
// INIT
// =====================
document.addEventListener("DOMContentLoaded", () => {
    console.log("Inicializando...");
    console.log("Fases carregadas:", window.rodadas);
    
    carregarResultadosOficiais();
    
    if (document.getElementById("classificacaoGrupos")) {
        setTimeout(function() {
            carregarClassificacaoGrupos('A');
        }, 500);
        
        database.ref("resultados").on('value', function() {
            carregarClassificacaoGrupos(window.grupoSelecionado || 'A');
        });
    }
    
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
            carregarUsuariosSelect();
            carregarFasesSelect();
            carregarResetUsuarios();
            carregarResetFases();
        }
        
        if (document.getElementById("ranking")) {
            mostrarRanking();
            database.ref("resultados").on('value', () => mostrarRanking());
            database.ref("palpites").on('value', () => mostrarRanking());
        }
    }
});