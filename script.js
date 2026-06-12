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
                                })
                                .catch(err => alert("Erro: " + err));
                        } else {
                            database.ref(`usuarios/${nomeAntigo}`).remove();
                            alert(`✅ Usuário "${nomeAntigo}" renomeado para "${novoNome}"!`);
                            carregarUsuarios();
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
                statusDiv.innerHTML = "🔓 PALPITES ABERTOS - VOCÊ NÃO PODE ALTERAR SEUS PALPITES!";
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
// CARREGAR JOGOS (PALPITES) - COM NOVA PONTUAÇÃO
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
                    // Verificar se acertou o vencedor/empate (tendência)
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
// CALCULAR PONTOS (NOVA PONTUAÇÃO)
// =====================
function calcularPontos(pc, pf, rc, rf) {
    pc = parseInt(pc);
    pf = parseInt(pf);
    rc = parseInt(rc);
    rf = parseInt(rf);
    
    if (isNaN(pc) || isNaN(pf) || isNaN(rc) || isNaN(rf)) return 0;
    
    // Acertou o placar exato? 3 pontos
    if (pc === rc && pf === rf) {
        return 3;
    }
    
    // Verificar se acertou o vencedor ou empate (tendência) - 1 ponto
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
        }
        
        if (document.getElementById("ranking")) {
            mostrarRanking();
            database.ref("resultados").on('value', () => mostrarRanking());
            database.ref("palpites").on('value', () => mostrarRanking());
        }
    }
});
