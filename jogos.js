// ============================================
// FASES DE GRUPOS (COM DATAS DA COPA 2026)
// ============================================
const fasesGrupos = [
    {
        nome: "12/06/2026 - Dia 1",
        jogos: [
            { id: 1, casa: "México", fora: "África do Sul" },
            { id: 2, casa: "Coreia do Sul", fora: "República Tcheca" }
        ]
    },
    {
        nome: "13/06/2026 - Dia 2",
        jogos: [
            { id: 3, casa: "Canadá", fora: "Bósnia e Herzegovina" },
            { id: 4, casa: "Estados Unidos", fora: "Paraguai" }
        ]
    },
    {
        nome: "14/06/2026 - Dia 3",
        jogos: [
            { id: 5, casa: "Haiti", fora: "Escócia" },
            { id: 6, casa: "Austrália", fora: "Turquia" },
            { id: 7, casa: "Brasil", fora: "Marrocos" },
            { id: 8, casa: "Catar", fora: "Suíça" }
        ]
    },
    {
        nome: "15/06/2026 - Dia 4",
        jogos: [
            { id: 9, casa: "Costa do Marfim", fora: "Equador" },
            { id: 10, casa: "Alemanha", fora: "Curaçau" },
            { id: 11, casa: "Holanda", fora: "Japão" },
            { id: 12, casa: "Suécia", fora: "Tunísia" }
        ]
    },
    {
        nome: "16/06/2026 - Dia 5",
        jogos: [
            { id: 13, casa: "Arábia Saudita", fora: "Uruguai" },
            { id: 14, casa: "Espanha", fora: "Cabo Verde" },
            { id: 15, casa: "Irã", fora: "Nova Zelândia" },
            { id: 16, casa: "Bélgica", fora: "Egito" }
        ]
    },
    {
        nome: "17/06/2026 - Dia 6",
        jogos: [
            { id: 17, casa: "França", fora: "Senegal" },
            { id: 18, casa: "Iraque", fora: "Noruega" },
            { id: 19, casa: "Argentina", fora: "Argélia" },
            { id: 20, casa: "Áustria", fora: "Jordânia" }
        ]
    },
    {
        nome: "18/06/2026 - Dia 7",
        jogos: [
            { id: 21, casa: "Gana", fora: "Panamá" },
            { id: 22, casa: "Inglaterra", fora: "Croácia" },
            { id: 23, casa: "Portugal", fora: "RD Congo" },
            { id: 24, casa: "Uzbequistão", fora: "Colômbia" }
        ]
    },
    {
        nome: "19/06/2026 - Dia 8",
        jogos: [
            { id: 25, casa: "República Tcheca", fora: "África do Sul" },
            { id: 26, casa: "Suíça", fora: "Bósnia e Herzegovina" },
            { id: 27, casa: "Canadá", fora: "Catar" },
            { id: 28, casa: "México", fora: "Coreia do Sul" }
        ]
    },
    {
        nome: "20/06/2026 - Dia 9",
        jogos: [
            { id: 29, casa: "Brasil", fora: "Haiti" },
            { id: 30, casa: "Escócia", fora: "Marrocos" },
            { id: 31, casa: "Turquia", fora: "Paraguai" },
            { id: 32, casa: "Estados Unidos", fora: "Austrália" }
        ]
    },
    {
        nome: "21/06/2026 - Dia 10",
        jogos: [
            { id: 33, casa: "Alemanha", fora: "Costa do Marfim" },
            { id: 34, casa: "Equador", fora: "Curaçau" },
            { id: 35, casa: "Holanda", fora: "Suécia" },
            { id: 36, casa: "Tunísia", fora: "Japão" }
        ]
    },
    {
        nome: "22/06/2026 - Dia 11",
        jogos: [
            { id: 37, casa: "Uruguai", fora: "Cabo Verde" },
            { id: 38, casa: "Espanha", fora: "Arábia Saudita" },
            { id: 39, casa: "Bélgica", fora: "Irã" },
            { id: 40, casa: "Nova Zelândia", fora: "Egito" }
        ]
    },
    {
        nome: "23/06/2026 - Dia 12",
        jogos: [
            { id: 41, casa: "Noruega", fora: "Senegal" },
            { id: 42, casa: "França", fora: "Iraque" },
            { id: 43, casa: "Argentina", fora: "Áustria" },
            { id: 44, casa: "Jordânia", fora: "Argélia" }
        ]
    },
    {
        nome: "24/06/2026 - Dia 13",
        jogos: [
            { id: 45, casa: "Inglaterra", fora: "Gana" },
            { id: 46, casa: "Panamá", fora: "Croácia" },
            { id: 47, casa: "Portugal", fora: "Uzbequistão" },
            { id: 48, casa: "Colômbia", fora: "RD Congo" }
        ]
    },
    {
        nome: "25/06/2026 - Dia 14",
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
        nome: "26/06/2026 - Dia 15",
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
        nome: "27/06/2026 - Dia 16",
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
        nome: "28/06/2026 - Dia 17",
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
// FASES DO MATA-MATA (VOCÊ PREENCHE QUANDO CHEGAR)
// ============================================

const dezesseisAvos = {
    nome: "🏆 16 Avos de Final",
    jogos: []
};

const oitavas = {
    nome: "🏆 Oitavas de Final",
    jogos: []
};

const quartas = {
    nome: "🏆 Quartas de Final",
    jogos: []
};

const semifinais = {
    nome: "🏆 Semifinais",
    jogos: []
};

const terceiroLugar = {
    nome: "🥉 Disputa de 3º Lugar",
    jogos: []
};

const final = {
    nome: "🏆 FINAL",
    jogos: []
};

// ============================================
// JUNTANDO TODAS AS FASES
// ============================================

let rodadas = [...fasesGrupos];

function adicionarFaseSeTiverJogos(fase) {
    if (fase.jogos && fase.jogos.length > 0) {
        rodadas.push(fase);
    }
}

adicionarFaseSeTiverJogos(dezesseisAvos);
adicionarFaseSeTiverJogos(oitavas);
adicionarFaseSeTiverJogos(quartas);
adicionarFaseSeTiverJogos(semifinais);
adicionarFaseSeTiverJogos(terceiroLugar);
adicionarFaseSeTiverJogos(final);

if (typeof window !== 'undefined') {
    window.rodadas = rodadas;
    window.fasesGrupos = fasesGrupos;
}

console.log(`✅ ${rodadas.length} fases carregadas!`);