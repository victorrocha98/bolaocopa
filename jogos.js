// ============================================
// FASES DE GRUPOS (COM DATAS DA COPA 2026 E BANDEIRAS À DIREITA)
// GRUPOS CORRETOS:
// A: México, África do Sul, Coreia do Sul, Tchéquia
// B: Canadá, Bósnia, Catar, Suíça
// C: Brasil, Marrocos, Haiti, Escócia
// D: Estados Unidos, Paraguai, Austrália, Turquia
// E: Alemanha, Curaçao, Costa do Marfim, Equador
// F: Holanda, Japão, Suécia, Tunísia
// G: Bélgica, Egito, Irã, Nova Zelândia
// H: Espanha, Cabo Verde, Arábia Saudita, Uruguai
// I: França, Senegal, Iraque, Noruega
// J: Argentina, Argélia, Áustria, Jordânia
// K: Portugal, RD Congo, Uzbequistão, Colômbia
// L: Inglaterra, Croácia, Gana, Panamá
// ============================================
const fasesGrupos = [
    {
        nome: "11/06/2026 - Dia 1",
        jogos: [
            { id: 1, casa: "México 🇲🇽", fora: "🇿🇦 África do Sul" },
            { id: 2, casa: "Coreia do Sul 🇰🇷", fora: "🇨🇿 República Tcheca" }
        ]
    },
    {
        nome: "12/06/2026 - Dia 2",
        jogos: [
            { id: 3, casa: "Canadá 🇨🇦", fora: "🇧🇦 Bósnia e Herzegovina" },
            { id: 4, casa: "Estados Unidos 🇺🇸", fora: "🇵🇾 Paraguai" }
        ]
    },
    {
        nome: "13/06/2026 - Dia 3",
        jogos: [
            { id: 5, casa: "Haiti 🇭🇹", fora: "🏴󠁧󠁢󠁳󠁣󠁴󠁿 Escócia" },
            { id: 6, casa: "Brasil 🇧🇷", fora: "🇲🇦 Marrocos" },
            { id: 7, casa: "Catar 🇶🇦", fora: "🇨🇭 Suíça" }
        ]
    },
    {
        nome: "14/06/2026 - Dia 4",
        jogos: [
            { id: 8, casa: "Austrália 🇦🇺", fora: "🇹🇷 Turquia" },
            { id: 9, casa: "Costa do Marfim 🇨🇮", fora: "🇪🇨 Equador" },
            { id: 10, casa: "Alemanha 🇩🇪", fora: "🇨🇼 Curaçau" },
            { id: 11, casa: "Holanda 🇳🇱", fora: "🇯🇵 Japão" },
            { id: 12, casa: "Suécia 🇸🇪", fora: "🇹🇳 Tunísia" }
        ]
    },
    {
        nome: "15/06/2026 - Dia 5",
        jogos: [
            { id: 13, casa: "Arábia Saudita 🇸🇦", fora: "🇺🇾 Uruguai" },
            { id: 14, casa: "Espanha 🇪🇸", fora: "🇨🇻 Cabo Verde" },
            { id: 15, casa: "Irã 🇮🇷", fora: "🇳🇿 Nova Zelândia" },
            { id: 16, casa: "Bélgica 🇧🇪", fora: "🇪🇬 Egito" }
        ]
    },
    {
        nome: "16/06/2026 - Dia 6",
        jogos: [
            { id: 17, casa: "França 🇫🇷", fora: "🇸🇳 Senegal" },
            { id: 18, casa: "Iraque 🇮🇶", fora: "🇳🇴 Noruega" },
            { id: 19, casa: "Argentina 🇦🇷", fora: "🇩🇿 Argélia" }
        ]
    },
    {
        nome: "17/06/2026 - Dia 7",
        jogos: [
            { id: 20, casa: "Áustria 🇦🇹", fora: "🇯🇴 Jordânia" },
            { id: 21, casa: "Gana 🇬🇭", fora: "🇵🇦 Panamá" },
            { id: 22, casa: "Inglaterra 🏴󠁧󠁢󠁥󠁮󠁧󠁿", fora: "🇭🇷 Croácia" },
            { id: 23, casa: "Portugal 🇵🇹", fora: "🇨🇩 RD Congo" },
            { id: 24, casa: "Uzbequistão 🇺🇿", fora: "🇨🇴 Colômbia" }
        ]
    },
    {
        nome: "18/06/2026 - Dia 8",
        jogos: [
            { id: 25, casa: "República Tcheca 🇨🇿", fora: "🇿🇦 África do Sul" },
            { id: 26, casa: "Suíça 🇨🇭", fora: "🇧🇦 Bósnia e Herzegovina" },
            { id: 27, casa: "Canadá 🇨🇦", fora: "🇶🇦 Catar" },
            { id: 28, casa: "México 🇲🇽", fora: "🇰🇷 Coreia do Sul" }
        ]
    },
    {
        nome: "19/06/2026 - Dia 9",
        jogos: [
            { id: 29, casa: "Brasil 🇧🇷", fora: "🇭🇹 Haiti" },
            { id: 30, casa: "Escócia 🏴󠁧󠁢󠁳󠁣󠁴󠁿", fora: "🇲🇦 Marrocos" },
            { id: 31, casa: "Estados Unidos 🇺🇸", fora: "🇦🇺 Austrália" }
        ]
    },
    {
        nome: "20/06/2026 - Dia 10",
        jogos: [
            { id: 32, casa: "Turquia 🇹🇷", fora: "🇵🇾 Paraguai" },
            { id: 33, casa: "Alemanha 🇩🇪", fora: "🇨🇮 Costa do Marfim" },
            { id: 34, casa: "Equador 🇪🇨", fora: "🇨🇼 Curaçau" },
            { id: 35, casa: "Holanda 🇳🇱", fora: "🇸🇪 Suécia" }
        ]
    },
    {
        nome: "21/06/2026 - Dia 11",
        jogos: [
            { id: 36, casa: "Tunísia 🇹🇳", fora: "🇯🇵 Japão" },
            { id: 37, casa: "Uruguai 🇺🇾", fora: "🇨🇻 Cabo Verde" },
            { id: 38, casa: "Espanha 🇪🇸", fora: "🇸🇦 Arábia Saudita" },
            { id: 39, casa: "Bélgica 🇧🇪", fora: "🇮🇷 Irã" },
            { id: 40, casa: "Nova Zelândia 🇳🇿", fora: "🇪🇬 Egito" }
        ]
    },
    {
        nome: "22/06/2026 - Dia 12",
        jogos: [
            { id: 41, casa: "Noruega 🇳🇴", fora: "🇸🇳 Senegal" },
            { id: 42, casa: "França 🇫🇷", fora: "🇮🇶 Iraque" },
            { id: 43, casa: "Argentina 🇦🇷", fora: "🇦🇹 Áustria" }
        ]
    },
    {
        nome: "23/06/2026 - Dia 13",
        jogos: [
            { id: 44, casa: "Jordânia 🇯🇴", fora: "🇩🇿 Argélia" },
            { id: 45, casa: "Inglaterra 🏴󠁧󠁢󠁥󠁮󠁧󠁿", fora: "🇬🇭 Gana" },
            { id: 46, casa: "Panamá 🇵🇦", fora: "🇭🇷 Croácia" },
            { id: 47, casa: "Portugal 🇵🇹", fora: "🇺🇿 Uzbequistão" },
            { id: 48, casa: "Colômbia 🇨🇴", fora: "🇨🇩 RD Congo" }
        ]
    },
    {
        nome: "24/06/2026 - Dia 14",
        jogos: [
            { id: 49, casa: "Escócia 🏴󠁧󠁢󠁳󠁣󠁴󠁿", fora: "🇧🇷 Brasil" },
            { id: 50, casa: "Marrocos 🇲🇦", fora: "🇭🇹 Haiti" },
            { id: 51, casa: "Suíça 🇨🇭", fora: "🇨🇦 Canadá" },
            { id: 52, casa: "Bósnia e Herzegovina 🇧🇦", fora: "🇶🇦 Catar" },
            { id: 53, casa: "República Tcheca 🇨🇿", fora: "🇲🇽 México" },
            { id: 54, casa: "África do Sul 🇿🇦", fora: "🇰🇷 Coreia do Sul" }
        ]
    },
    {
        nome: "25/06/2026 - Dia 15",
        jogos: [
            { id: 55, casa: "Curaçau 🇨🇼", fora: "🇨🇮 Costa do Marfim" },
            { id: 56, casa: "Equador 🇪🇨", fora: "🇩🇪 Alemanha" },
            { id: 57, casa: "Japão 🇯🇵", fora: "🇸🇪 Suécia" },
            { id: 58, casa: "Tunísia 🇹🇳", fora: "🇳🇱 Holanda" },
            { id: 59, casa: "Turquia 🇹🇷", fora: "🇺🇸 Estados Unidos" },
            { id: 60, casa: "Paraguai 🇵🇾", fora: "🇦🇺 Austrália" }
        ]
    },
    {
        nome: "26/06/2026 - Dia 16",
        jogos: [
            { id: 61, casa: "Noruega 🇳🇴", fora: "🇫🇷 França" },
            { id: 62, casa: "Senegal 🇸🇳", fora: "🇮🇶 Iraque" },
            { id: 63, casa: "Cabo Verde 🇨🇻", fora: "🇸🇦 Arábia Saudita" },
            { id: 64, casa: "Uruguai 🇺🇾", fora: "🇪🇸 Espanha" }
        ]
    },
    {
        nome: "27/06/2026 - Dia 17",
        jogos: [
            { id: 65, casa: "Egito 🇪🇬", fora: "🇮🇷 Irã" },
            { id: 66, casa: "Panamá 🇵🇦", fora: "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Inglaterra" },
            { id: 67, casa: "Croácia 🇭🇷", fora: "🇬🇭 Gana" },
            { id: 68, casa: "Argélia 🇩🇿", fora: "🇦🇹 Áustria" },
            { id: 69, casa: "Jordânia 🇯🇴", fora: "🇦🇷 Argentina" },
            { id: 70, casa: "Colômbia 🇨🇴", fora: "🇵🇹 Portugal" },
            { id: 71, casa: "RD Congo 🇨🇩", fora: "🇺🇿 Uzbequistão" },
            { id: 72, casa: "Nova Zelândia 🇳🇿", fora: "🇧🇪 Bélgica" }
        ]
    }
];

// ============================================
// FASES DO MATA-MATA
// ============================================

const dezesseisAvos = {
    nome: "🏆 16 Avos de Final",
    jogos: [
        { id: 73, casa: "Brasil 🇧🇷", fora: "🇨🇱 Chile" },
        { id: 74, casa: "Argentina 🇦🇷", fora: "🇺🇾 Uruguai" },
        { id: 75, casa: "França 🇫🇷", fora: "🇩🇪 Alemanha" },
        { id: 76, casa: "Portugal 🇵🇹", fora: "🇪🇸 Espanha" },
        { id: 77, casa: "Inglaterra 🏴󠁧󠁢󠁥󠁮󠁧󠁿", fora: "🇳🇱 Holanda" },
        { id: 78, casa: "Bélgica 🇧🇪", fora: "🇭🇷 Croácia" },
        { id: 79, casa: "Itália 🇮🇹", fora: "🇸🇪 Suécia" },
        { id: 80, casa: "Dinamarca 🇩🇰", fora: "🇨🇭 Suíça" }
    ]
};

const oitavas = {
    nome: "🏆 Oitavas de Final",
    jogos: [
        // 📌 ADICIONE OS JOGOS AQUI QUANDO CHEGAR
    ]
};

const quartas = {
    nome: "🏆 Quartas de Final",
    jogos: [
        // 📌 ADICIONE OS JOGOS AQUI QUANDO CHEGAR
    ]
};

const semifinais = {
    nome: "🏆 Semifinais",
    jogos: [
        // 📌 ADICIONE OS JOGOS AQUI QUANDO CHEGAR
    ]
};

const terceiroLugar = {
    nome: "🥉 Disputa de 3º Lugar",
    jogos: [
        // 📌 ADICIONE O JOGO AQUI QUANDO CHEGAR
    ]
};

const final = {
    nome: "🏆 FINAL",
    jogos: [
        // 📌 ADICIONE O JOGO AQUI QUANDO CHEGAR
    ]
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