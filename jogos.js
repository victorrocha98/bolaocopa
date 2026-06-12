// ============================================
// FASES DE GRUPOS (JÁ EXISTENTES)
// ============================================
const fasesGrupos = [
    {
        nome: "Dia 1",
        jogos: [
            { id: 1, casa: "México", fora: "África do Sul" },
            { id: 2, casa: "Coreia do Sul", fora: "República Tcheca" }
        ]
    },
    {
        nome: "Dia 2",
        jogos: [
            { id: 3, casa: "Canadá", fora: "Bósnia e Herzegovina" },
            { id: 4, casa: "Estados Unidos", fora: "Paraguai" }
        ]
    },
    {
        nome: "Dia 3",
        jogos: [
            { id: 5, casa: "Haiti", fora: "Escócia" },
            { id: 6, casa: "Austrália", fora: "Turquia" },
            { id: 7, casa: "Brasil", fora: "Marrocos" },
            { id: 8, casa: "Catar", fora: "Suíça" }
        ]
    },
    {
        nome: "Dia 4",
        jogos: [
            { id: 9, casa: "Costa do Marfim", fora: "Equador" },
            { id: 10, casa: "Alemanha", fora: "Curaçau" },
            { id: 11, casa: "Holanda", fora: "Japão" },
            { id: 12, casa: "Suécia", fora: "Tunísia" }
        ]
    },
    {
        nome: "Dia 5",
        jogos: [
            { id: 13, casa: "Arábia Saudita", fora: "Uruguai" },
            { id: 14, casa: "Espanha", fora: "Cabo Verde" },
            { id: 15, casa: "Irã", fora: "Nova Zelândia" },
            { id: 16, casa: "Bélgica", fora: "Egito" }
        ]
    },
    {
        nome: "Dia 6",
        jogos: [
            { id: 17, casa: "França", fora: "Senegal" },
            { id: 18, casa: "Iraque", fora: "Noruega" },
            { id: 19, casa: "Argentina", fora: "Argélia" },
            { id: 20, casa: "Áustria", fora: "Jordânia" }
        ]
    },
    {
        nome: "Dia 7",
        jogos: [
            { id: 21, casa: "Gana", fora: "Panamá" },
            { id: 22, casa: "Inglaterra", fora: "Croácia" },
            { id: 23, casa: "Portugal", fora: "RD Congo" },
            { id: 24, casa: "Uzbequistão", fora: "Colômbia" }
        ]
    },
    {
        nome: "Dia 8",
        jogos: [
            { id: 25, casa: "República Tcheca", fora: "África do Sul" },
            { id: 26, casa: "Suíça", fora: "Bósnia e Herzegovina" },
            { id: 27, casa: "Canadá", fora: "Catar" },
            { id: 28, casa: "México", fora: "Coreia do Sul" }
        ]
    },
    {
        nome: "Dia 9",
        jogos: [
            { id: 29, casa: "Brasil", fora: "Haiti" },
            { id: 30, casa: "Escócia", fora: "Marrocos" },
            { id: 31, casa: "Turquia", fora: "Paraguai" },
            { id: 32, casa: "Estados Unidos", fora: "Austrália" }
        ]
    },
    {
        nome: "Dia 10",
        jogos: [
            { id: 33, casa: "Alemanha", fora: "Costa do Marfim" },
            { id: 34, casa: "Equador", fora: "Curaçau" },
            { id: 35, casa: "Holanda", fora: "Suécia" },
            { id: 36, casa: "Tunísia", fora: "Japão" }
        ]
    },
    {
        nome: "Dia 11",
        jogos: [
            { id: 37, casa: "Uruguai", fora: "Cabo Verde" },
            { id: 38, casa: "Espanha", fora: "Arábia Saudita" },
            { id: 39, casa: "Bélgica", fora: "Irã" },
            { id: 40, casa: "Nova Zelândia", fora: "Egito" }
        ]
    },
    {
        nome: "Dia 12",
        jogos: [
            { id: 41, casa: "Noruega", fora: "Senegal" },
            { id: 42, casa: "França", fora: "Iraque" },
            { id: 43, casa: "Argentina", fora: "Áustria" },
            { id: 44, casa: "Jordânia", fora: "Argélia" }
        ]
    },
    {
        nome: "Dia 13",
        jogos: [
            { id: 45, casa: "Inglaterra", fora: "Gana" },
            { id: 46, casa: "Panamá", fora: "Croácia" },
            { id: 47, casa: "Portugal", fora: "Uzbequistão" },
            { id: 48, casa: "Colômbia", fora: "RD Congo" }
        ]
    },
    {
        nome: "Dia 14",
        jogos: [
            { id: 49, casa: "Escócia", fora: "Brasil" },
            { id: 50, casa: "Marrocos", fora: "Haiti" },
            { id: 51, casa: "Suíça", fora: "Canadá" },
            { id: 52, casa: "Bósnia e Herzegovina", fora: "Catar" },
            { id: 53, casa: "República Tcheca", fora: "México" },
            { id: 54, casa: "África do Sul", fora: "Coreia do Sul" }
        ]
    },
    {
        nome: "Dia 15",
        jogos: [
            { id: 55, casa: "Curaçau", fora: "Costa do Marfim" },
            { id: 56, casa: "Equador", fora: "Alemanha" },
            { id: 57, casa: "Japão", fora: "Suécia" },
            { id: 58, casa: "Tunísia", fora: "Holanda" },
            { id: 59, casa: "Turquia", fora: "Estados Unidos" },
            { id: 60, casa: "Paraguai", fora: "Austrália" }
        ]
    },
    {
        nome: "Dia 16",
        jogos: [
            { id: 61, casa: "Noruega", fora: "França" },
            { id: 62, casa: "Senegal", fora: "Iraque" },
            { id: 63, casa: "Egito", fora: "Irã" },
            { id: 64, casa: "Nova Zelândia", fora: "Bélgica" },
            { id: 65, casa: "Cabo Verde", fora: "Arábia Saudita" },
            { id: 66, casa: "Uruguai", fora: "Espanha" }
        ]
    },
    {
        nome: "Dia 17",
        jogos: [
            { id: 67, casa: "Panamá", fora: "Inglaterra" },
            { id: 68, casa: "Croácia", fora: "Gana" },
            { id: 69, casa: "Argélia", fora: "Áustria" },
            { id: 70, casa: "Jordânia", fora: "Argentina" },
            { id: 71, casa: "Colômbia", fora: "Portugal" },
            { id: 72, casa: "RD Congo", fora: "Uzbequistão" }
        ]
    }
];

// ============================================
// FASES DO MATA-MATA (VOCÊ VAI PREENCHENDO AQUI!)
// ============================================

// 🏆 16 AVOS DE FINAL (Primeira fase do mata-mata)
const dezesseisAvos = {
    nome: "🏆 16 Avos de Final",
    jogos: [
        // VOCÊ VAI ADICIONAR OS JOGOS AQUI!
        // Exemplo: { id: 73, casa: "Brasil", fora: "Chile" },
        // Exemplo: { id: 74, casa: "Argentina", fora: "Uruguai" },
    ]
};

// 🏆 OITAVAS DE FINAL
const oitavas = {
    nome: "🏆 Oitavas de Final",
    jogos: [
        // VOCÊ VAI ADICIONAR OS JOGOS AQUI!
        // Exemplo: { id: 75, casa: "Time A", fora: "Time B" },
        // Exemplo: { id: 76, casa: "Time C", fora: "Time D" },
    ]
};

// 🏆 QUARTAS DE FINAL
const quartas = {
    nome: "🏆 Quartas de Final",
    jogos: [
        // VOCÊ VAI ADICIONAR OS JOGOS AQUI!
        // Exemplo: { id: 77, casa: "Vencedor 1", fora: "Vencedor 2" },
    ]
};

// 🏆 SEMIFINAIS
const semifinais = {
    nome: "🏆 Semifinais",
    jogos: [
        // VOCÊ VAI ADICIONAR OS JOGOS AQUI!
        // Exemplo: { id: 78, casa: "Vencedor A", fora: "Vencedor B" },
    ]
};

// 🏆 DISPUTA DE 3º LUGAR
const terceiroLugar = {
    nome: "🥉 Disputa de 3º Lugar",
    jogos: [
        // VOCÊ VAI ADICIONAR O JOGO AQUI!
        // Exemplo: { id: 79, casa: "Perdedor SF1", fora: "Perdedor SF2" },
    ]
};

// 🏆 FINAL
const final = {
    nome: "🏆 FINAL",
    jogos: [
        // VOCÊ VAI ADICIONAR O JOGO AQUI!
        // Exemplo: { id: 80, casa: "Vencedor SF1", fora: "Vencedor SF2" },
    ]
};

// ============================================
// JUNTANDO TODAS AS FASES
// ============================================

// Primeiro as fases de grupos
let rodadas = [...fasesGrupos];

// Função para adicionar fases do mata-mata (só se tiver jogos)
function adicionarFaseSeTiverJogos(fase) {
    if (fase.jogos && fase.jogos.length > 0) {
        rodadas.push(fase);
    }
}

// Adicionar as fases do mata-mata (só aparece se você preencher os jogos)
adicionarFaseSeTiverJogos(dezesseisAvos);
adicionarFaseSeTiverJogos(oitavas);
adicionarFaseSeTiverJogos(quartas);
adicionarFaseSeTiverJogos(semifinais);
adicionarFaseSeTiverJogos(terceiroLugar);
adicionarFaseSeTiverJogos(final);

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.rodadas = rodadas;
    window.fasesGrupos = fasesGrupos;
}

// Mostrar no console quantas fases foram carregadas
console.log(`✅ ${rodadas.length} fases carregadas!`);
console.log("Fases disponíveis:", rodadas.map(f => f.nome));