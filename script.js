// =====================
// VARIÁVEIS GLOBAIS
// =====================
let usuarioAtual = null;
let diaAtivoIndex = 0;
let palpitesBloqueados = false;
let resultadosOficiais = {};

// =====================
// GRUPOS E TIMES
// =====================
const gruposTimes = {
    "A": ["México", "África do Sul", "Coreia do Sul", "República Tcheca"],
    "B": ["Canadá", "Bósnia e Herzegovina", "Catar", "Suíça"],
    "C": ["Brasil", "Marrocos", "Haiti", "Escócia"],
    "D": ["Estados Unidos", "Paraguai", "Austrália", "Turquia"],
    "E": ["Alemanha", "Curaçau", "Costa do Marfim", "Equador"],
    "F": ["Holanda", "Japão", "Suécia", "Tunísia"],
    "G": ["Bélgica", "Egito", "Irã", "Nova Zelândia"],
    "H": ["Espanha", "Cabo Verde", "Arábia Saudita", "Uruguai"],
    "I": ["França", "Senegal", "Iraque", "Noruega"],
    "J": ["Argentina", "Argélia", "Áustria", "Jordânia"],
    "K": ["Portugal", "RD Congo", "Uzbequistão", "Colômbia"],
    "L": ["Inglaterra", "Croácia", "Gana", "Panamá"]
};

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
        
        if (blocoRodada.jogos[0] && blocoRodada.jogos[0].data) {
            html += `<p style="color:#666; margin-bottom:15px; text-align:center; font-size:13px;">📅 Confrontos do mata-mata</p>`;
        } else {
            html += `<p style="color:#666; margin-bottom:15px;">Faça seus palpites para os jogos abaixo:</p>`;
        }
        
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
            
            let infoExtra = "";
            if (jogo.data) {
                infoExtra = `<div style="font-size:11px; color:#666; margin-top:3px;">📅 ${jogo.data} | 📍 ${jogo.local}</div>`;
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
    
    if (!blocoRodada || !blocoRodada.jogos || blocoRodada.jogos.length === 0) {
        alert("⚠️ Nenhum jogo nesta fase!");
        return;
    }
    
    // Verificar se é fase de grupos (até o dia 17) ou mata-mata
    const isFaseGrupos = diaAtivoIndex < 17;
    
    // Coletar palpites preenchidos
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
                palpitesAtualizados[jogo.id] = {
                    casa: casaVal,
                    fora: foraVal
                };
                palpitesPreenchidos++;
            } else {
                palpitesVazios++;
            }
        }
    });
    
    // Verificar se pelo menos 1 palpite foi preenchido
    if (palpitesPreenchidos === 0) {
        alert("⚠️ Preencha pelo menos 1 palpite antes de salvar!");
        return;
    }
    
    // Para fase de grupos: obriga a preencher todos
    if (isFaseGrupos && palpitesVazios > 0) {
        alert(`⚠️ Na fase de grupos você deve preencher TODOS os ${blocoRodada.jogos.length} jogos do dia! Faltam ${palpitesVazios} jogo(s).`);
        return;
    }
    
    // Verificar se algum palpite já foi salvo anteriormente (apenas para fase de grupos)
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
            
            // Salvar palpites
            database.ref(`palpites/${usuario}`).update(palpitesAtualizados)
                .then(() => {
                    alert(`✅ ${palpitesPreenchidos} palpite(s) do dia salvos com sucesso!`);
                    carregarJogos();
                })
                .catch(err => alert("Erro: " + err));
        });
    } else {
        // MATA-MATA: Salvar apenas os palpites preenchidos (jogo por jogo)
        // Verificar se o usuário já tem palpites salvos para estes jogos
        database.ref(`palpites/${usuario}`).once('value', function(snapshot) {
            const palpitesExistentes = snapshot.val() || {};
            
            // Verificar quais jogos já foram salvos
            let jogosJaSalvos = [];
            let jogosNovos = [];
            
            Object.keys(palpitesAtualizados).forEach(function(jogoId) {
                if (palpitesExistentes[jogoId] && palpitesExistentes[jogoId].casa !== "" && palpitesExistentes[jogoId].casa !== undefined) {
                    jogosJaSalvos.push(jogoId);
                } else {
                    jogosNovos.push(jogoId);
                }
            });
            
            // Se algum jogo já foi salvo, perguntar se quer substituir
            if (jogosJaSalvos.length > 0) {
                const confirmar = confirm(
                    `⚠️ Você já tem palpites salvos para ${jogosJaSalvos.length} jogo(s) desta fase.\n\n` +
                    `Deseja SOBRESCREVER os palpites antigos pelos novos?\n` +
                    `(Clique em OK para substituir, Cancelar para manter os antigos)`
                );
                
                if (!confirmar) {
                    // Remover os jogos que já estavam salvos para não substituir
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
            
            // Salvar apenas os palpites novos (ou todos se confirmou substituir)
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
            
            let html = `<div class="rodada"><h2>${bloco.nome}</h2>`;
            
            bloco.jogos.forEach(jogo => {
                const resultado = resultados[jogo.id] || { casa: "", fora: "" };
                const temResultado = resultado.casa !== "" && resultado.casa !== undefined;
                
                let infoExtra = "";
                if (jogo.data) {
                    infoExtra = `<div style="font-size:11px; color:#666; margin-top:3px;">📅 ${jogo.data} | 📍 ${jogo.local}</div>`;
                }
                
                html += `
                <div class="jogo" id="admin_jogo_${jogo.id}" style="${temResultado ? 'background:#e8f5e9;' : ''}">
                    <div style="flex:1;">
                        <strong>${jogo.casa}</strong> x <strong>${jogo.fora}</strong>
                        ${infoExtra}
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
// GERENCIAR 3º COLOCADOS (ADMIN) - COM CHECKBOXES
// =====================

// =====================
// GERENCIAR 3º COLOCADOS (ADMIN) - COM BOTÃO INDIVIDUAL POR GRUPO
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
                const status = salvosGrupo[time] || '';
                
                let checkedTerceiro = status === 'terceiro' ? 'checked' : '';
                let checkedEliminado = status === 'eliminado' ? 'checked' : '';
                let bgColor = '';
                
                if (status === 'terceiro') {
                    bgColor = 'background: #e3f2fd;';
                } else if (status === 'eliminado') {
                    bgColor = 'background: #ffebee;';
                }
                
                html += `
                <div style="display: flex; align-items: center; padding: 4px 0; border-bottom: 1px solid #eee; font-size: 12px; ${bgColor}">
                    <span style="flex: 1; font-weight: normal;">${time}</span>
                    <div style="display: flex; gap: 8px; align-items: center;">
                        <label style="display: flex; align-items: center; gap: 3px; font-size: 11px; cursor: pointer;">
                            <input type="checkbox" id="terceiro_${grupo}_${time}" value="terceiro" ${checkedTerceiro} 
                                   onchange="marcarTerceiro('${grupo}', '${time}', this.checked)">
                            🔵 3º
                        </label>
                        <label style="display: flex; align-items: center; gap: 3px; font-size: 11px; cursor: pointer;">
                            <input type="checkbox" id="eliminado_${grupo}_${time}" value="eliminado" ${checkedEliminado}
                                   onchange="marcarEliminado('${grupo}', '${time}', this.checked)">
                            🔴 Elim
                        </label>
                    </div>
                </div>
                `;
            });
            
            // Contar status do grupo
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
            
            // Botão Salvar Grupo Individual
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
    
    atualizarStatusVisual(grupo);
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
    
    atualizarStatusVisual(grupo);
}

function atualizarStatusVisual(grupo) {
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
    // Verificar se o grupo tem alterações
    if (!window.terceirosTemp || !window.terceirosTemp[grupo]) {
        document.getElementById("statusTerceiros").innerHTML = `⚠️ Nenhuma alteração no grupo ${grupo}!`;
        document.getElementById("statusTerceiros").style.color = "#ff9800";
        return;
    }
    
    const salvos = window.terceirosTemp[grupo] || {};
    const terceiros = Object.keys(salvos).filter(key => salvos[key] === 'terceiro');
    
    // Verificar se tem exatamente 1 terceiro colocado
    if (terceiros.length === 0) {
        document.getElementById("statusTerceiros").innerHTML = 
            `⚠️ Grupo ${grupo} não tem 3º colocado! Marque 1 time como 3º.`;
        document.getElementById("statusTerceiros").style.color = "#c62828";
        return;
    }
    
    if (terceiros.length > 1) {
        document.getElementById("statusTerceiros").innerHTML = 
            `⚠️ Grupo ${grupo} tem ${terceiros.length} terceiros! Marque apenas 1.`;
        document.getElementById("statusTerceiros").style.color = "#c62828";
        return;
    }
    
    // Buscar dados atuais do Firebase
    database.ref("terceirosColocados").once('value', function(snapshot) {
        const dadosAtuais = snapshot.val() || {};
        
        // Atualizar apenas o grupo específico
        dadosAtuais[grupo] = window.terceirosTemp[grupo];
        
        // Salvar no Firebase
        database.ref("terceirosColocados").set(dadosAtuais)
            .then(function() {
                document.getElementById("statusTerceiros").innerHTML = `✅ Grupo ${grupo} salvo com sucesso!`;
                document.getElementById("statusTerceiros").style.color = "#2e7d32";
                
                // Limpar o temp apenas para esse grupo
                delete window.terceirosTemp[grupo];
                
                // Recarregar
                carregarTerceirosColocados();
                
                // Atualizar classificação
                if (document.getElementById("classificacaoGrupos")) {
                    carregarClassificacaoGrupos(window.grupoSelecionado || 'A');
                }
            })
            .catch(function(err) {
                document.getElementById("statusTerceiros").innerHTML = `❌ Erro ao salvar grupo ${grupo}: ${err.message}`;
                document.getElementById("statusTerceiros").style.color = "#c62828";
            });
    });
}

function salvarTodosTerceirosColocados() {
    if (!window.terceirosTemp) {
        document.getElementById("statusTerceiros").innerHTML = "⚠️ Nenhuma alteração feita!";
        document.getElementById("statusTerceiros").style.color = "#ff9800";
        return;
    }
    
    // Pegar apenas os grupos que têm alterações
    const gruposComAlteracoes = Object.keys(window.terceirosTemp).filter(grupo => {
        return Object.keys(window.terceirosTemp[grupo]).length > 0;
    });
    
    if (gruposComAlteracoes.length === 0) {
        document.getElementById("statusTerceiros").innerHTML = "⚠️ Nenhum grupo foi modificado!";
        document.getElementById("statusTerceiros").style.color = "#ff9800";
        return;
    }
    
    // Verificar apenas os grupos que foram modificados
    let gruposInvalidos = [];
    let gruposSemTerceiro = [];
    
    gruposComAlteracoes.forEach(function(grupo) {
        const salvos = window.terceirosTemp[grupo] || {};
        const terceiros = Object.keys(salvos).filter(key => salvos[key] === 'terceiro');
        
        if (terceiros.length === 0) {
            gruposSemTerceiro.push(grupo);
        } else if (terceiros.length > 1) {
            gruposInvalidos.push(`${grupo} (${terceiros.length} terceiros)`);
        }
    });
    
    // Verificar se há grupos modificados sem terceiro
    if (gruposSemTerceiro.length > 0) {
        document.getElementById("statusTerceiros").innerHTML = 
            `⚠️ Os grupos ${gruposSemTerceiro.join(', ')} foram modificados mas não têm 3º colocado! Marque 1 time como 3º em cada.`;
        document.getElementById("statusTerceiros").style.color = "#c62828";
        return;
    }
    
    // Verificar grupos com mais de 1 terceiro
    if (gruposInvalidos.length > 0) {
        document.getElementById("statusTerceiros").innerHTML = 
            `⚠️ Grupos com mais de 1 terceiro: ${gruposInvalidos.join(', ')}`;
        document.getElementById("statusTerceiros").style.color = "#c62828";
        return;
    }
    
    // Buscar dados atuais do Firebase
    database.ref("terceirosColocados").once('value', function(snapshot) {
        const dadosAtuais = snapshot.val() || {};
        
        // Atualizar apenas os grupos que foram modificados
        gruposComAlteracoes.forEach(function(grupo) {
            dadosAtuais[grupo] = window.terceirosTemp[grupo];
        });
        
        // Salvar no Firebase
        database.ref("terceirosColocados").set(dadosAtuais)
            .then(function() {
                document.getElementById("statusTerceiros").innerHTML = 
                    `✅ ${gruposComAlteracoes.length} grupo(s) salvos com sucesso: ${gruposComAlteracoes.join(', ')}`;
                document.getElementById("statusTerceiros").style.color = "#2e7d32";
                window.terceirosTemp = {};
                carregarTerceirosColocados();
                
                if (document.getElementById("classificacaoGrupos")) {
                    carregarClassificacaoGrupos(window.grupoSelecionado || 'A');
                }
            })
            .catch(function(err) {
                document.getElementById("statusTerceiros").innerHTML = "❌ Erro: " + err.message;
                document.getElementById("statusTerceiros").style.color = "#c62828";
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
                
                if (document.getElementById("classificacaoGrupos")) {
                    carregarClassificacaoGrupos(window.grupoSelecionado || 'A');
                }
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
            const classificacao = calcularClassificacaoGrupo(times, resultados);
            
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
            const palpite = palpites[jogo.id] || { casa: "", fora: "" };
            const resultado = resultados[jogo.id];
            const temResultado = resultado && resultado.casa !== "";
            
            let infoExtra = "";
            if (jogo.data) {
                infoExtra = `<div style="font-size:10px; color:#666;">📅 ${jogo.data} | 📍 ${jogo.local}</div>`;
            }
            
            html += `
            <div class="jogo" style="margin-bottom: 10px; padding: 10px; background: white; border-radius: 8px;">
                <div style="flex:1;">
                    <strong>${jogo.casa}</strong> x <strong>${jogo.fora}</strong>
                    ${infoExtra}
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
        
        const timesDoGrupo = gruposTimes[grupoSelecionado];
        const classificacao = calcularClassificacaoGrupo(timesDoGrupo, resultados);
        const salvosGrupo = terceirosColocados[grupoSelecionado] || {};
        
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
            
            const status = salvosGrupo[item.time] || '';
            
            if (status === 'terceiro') {
                corFundo = 'background: #e3f2fd;';
                destaque = 'font-weight: bold;';
                statusIcon = ' 🔵';
                statusText = '3º Classificado';
            } else if (status === 'eliminado') {
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
            
            let nomeTime = item.time;
            if (nomeTime.length > 14) {
                nomeTime = nomeTime.substring(0, 12) + '...';
            }
            
            let title = statusText ? ` title="${statusText}"` : '';
            
            html += `
                <tr style="${corFundo}"${title}>
                    <td style="padding: 2px 3px; text-align: left; ${destaque}; font-size: 10px;">${index+1} ${nomeTime}${statusIcon}</td>
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
        
        const casaNoGrupo = times.some(function(t) {
            return limparNomeTime(t).toLowerCase() === timeCasa.toLowerCase();
        });
        const foraNoGrupo = times.some(function(t) {
            return limparNomeTime(t).toLowerCase() === timeFora.toLowerCase();
        });
        
        if (!casaNoGrupo && !foraNoGrupo) return;
        
        const golsCasa = parseInt(resultado.casa);
        const golsFora = parseInt(resultado.fora);
        
        if (casaNoGrupo) {
            const timeKey = times.find(function(t) {
                return limparNomeTime(t).toLowerCase() === timeCasa.toLowerCase();
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
            const timeKey = times.find(function(t) {
                return limparNomeTime(t).toLowerCase() === timeFora.toLowerCase();
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
            time: time,
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
                        if (idsFiltrados !== null && !idsFiltrados.includes(parseInt(id))) {
                            return;
                        }
                        
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
                
                if (ranking.length === 0 || ranking.every(item => item.pontos === 0)) {
                    tabela.innerHTML = "<tr><td colspan='3'>Nenhum ponto registrado nesta fase</td></tr>";
                    return;
                }
                
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
document.addEventListener("DOMContentLoaded", function() {
    console.log("🔄 Inicializando aplicação...");
    console.log("📊 Fases carregadas:", window.rodadas ? window.rodadas.length : 0);
    console.log("📋 Grupos disponíveis:", Object.keys(gruposTimes));
    
    window.filtroRankingAtual = 'geral';
    
    carregarResultadosOficiais();
    
    // CLASSIFICAÇÃO DOS GRUPOS
    if (document.getElementById("classificacaoGrupos")) {
        console.log("📊 Inicializando classificação dos grupos...");
        setTimeout(function() {
            carregarClassificacaoGrupos('A');
        }, 500);
        
        database.ref("resultados").on('value', function() {
            carregarClassificacaoGrupos(window.grupoSelecionado || 'A');
        });
        
        database.ref("terceirosColocados").on('value', function() {
            carregarClassificacaoGrupos(window.grupoSelecionado || 'A');
        });
    }
    
    // PÁGINAS PROTEGIDAS (exceto index.html)
    if (!window.location.pathname.includes("index.html")) {
        const usuarioLogado = verificarLogin();
        if (!verificarAcessoAdmin()) return;
        
        carregarStatusTrava();
        
        // PÁGINA DE PALPITES
        if (document.getElementById("areaJogos")) {
            console.log("📝 Inicializando página de palpites...");
            inicializarInterfaceDias();
        }
        
        // PÁGINA ADMIN
        if (document.getElementById("adminJogos")) {
            console.log("⚙️ Inicializando página admin...");
            montarAdmin();
            carregarUsuarios();
            carregarUsuariosSelect();
            carregarFasesSelect();
            carregarResetUsuarios();
            carregarResetFases();
        }
        
        // 3º COLOCADOS (ADMIN)
        if (document.getElementById("terceirosColocados")) {
            console.log("📋 Inicializando 3º colocados...");
            setTimeout(function() {
                carregarTerceirosColocados();
            }, 700);
        }
        
        // RANKING
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