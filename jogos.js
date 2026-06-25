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

// ============================================
// 16 AVOS DE FINAL (CONFRONTOS REAIS)
// ============================================

const dezesseisAvos = {
    nome: "🏆 16 Avos de Final",
    jogos: [
        // Domingo, 28 de junho
        { id: 73, casa: "África do Sul 🇿🇦", fora: "🇨🇦 Canadá", data: "28/06 - 16h", local: "Los Angeles" },
        
        // Segunda-feira, 29 de junho
        { id: 74, casa: "Brasil 🇧🇷", fora: "2º F", data: "29/06 - 14h", local: "Houston" },
        { id: 75, casa: "Alemanha 🇩🇪", fora: "3º (A/B/C/D/F)", data: "29/06 - 17h30", local: "Boston" },
        { id: 76, casa: "1º F", fora: "🇲🇦 Marrocos", data: "29/06 - 22h", local: "Monterrey" },
        
        // Terça-feira, 30 de junho
        { id: 77, casa: "2º E", fora: "2º I", data: "30/06 - 14h", local: "Dallas" },
        { id: 78, casa: "1º I", fora: "3º (C/D/F/G/H)", data: "30/06 - 18h", local: "Nova York/Nova Jersey" },
        { id: 79, casa: "México 🇲🇽", fora: "3º (C/E/F/H/I)", data: "30/06 - 22h", local: "Cidade do México" },
        
        // Quarta-feira, 1º de julho
        { id: 80, casa: "1º L", fora: "3º (E/H/I/J/K)", data: "01/07 - 13h", local: "Atlanta" },
        { id: 81, casa: "1º G", fora: "3º (A/E/H/I/J)", data: "01/07 - 17h", local: "Seattle" },
        { id: 82, casa: "Estados Unidos 🇺🇸", fora: "3º (B/E/F/I/J)", data: "01/07 - 21h", local: "Santa Clara" },
        
        // Quinta-feira, 2 de julho
        { id: 83, casa: "1º H", fora: "2º J", data: "02/07 - 16h", local: "Los Angeles" },
        { id: 84, casa: "2º K", fora: "2º L", data: "02/07 - 20h", local: "Toronto" },
        
        // Sexta-feira, 3 de julho
        { id: 85, casa: "Suíça 🇨🇭", fora: "3º (E/F/G/I/J)", data: "03/07 - 00h", local: "Vancouver" },
        { id: 86, casa: "1º D", fora: "2º G", data: "03/07 - 15h", local: "Dallas" },
        { id: 87, casa: "Argentina 🇦🇷", fora: "2º H", data: "03/07 - 19h", local: "Miami" },
        { id: 88, casa: "1º K", fora: "3º (D/E/I/J/L)", data: "03/07 - 22h30", local: "Kansas City" }
    ]
};

// ============================================
// FASES DO MATA-MATA (OITAVAS EM DIANTE)
// ============================================

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
console.log(`📊 ${dezesseisAvos.jogos.length} jogos nos 16 avos de final!`);
