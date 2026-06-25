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
            { id: 1, casa: "México 🇲🇽", fora: "🇿🇦 África do Sul", data: "11/06 - 16h", local: "Estádio Azteca (Cidade do México)" },
            { id: 2, casa: "Coreia do Sul 🇰🇷", fora: "🇨🇿 República Tcheca", data: "11/06 - 23h", local: "Estadio Akron (Guadalajara, México)" }
        ]
    },
    {
        nome: "12/06/2026 - Dia 2",
        jogos: [
            { id: 3, casa: "Canadá 🇨🇦", fora: "🇧🇦 Bósnia e Herzegovina", data: "12/06 - 16h", local: "BMO Field (Toronto, Canadá)" },
            { id: 4, casa: "Estados Unidos 🇺🇸", fora: "🇵🇾 Paraguai", data: "12/06 - 22h", local: "SoFi Stadium (Los Angeles, EUA)" }
        ]
    },
    {
        nome: "13/06/2026 - Dia 3",
        jogos: [
            { id: 5, casa: "Haiti 🇭🇹", fora: "🏴󠁧󠁢󠁳󠁣󠁴󠁿 Escócia", data: "13/06 - 21h30", local: "Gillette Stadium (Boston, EUA)" },
            { id: 6, casa: "Brasil 🇧🇷", fora: "🇲🇦 Marrocos", data: "13/06 - 19h", local: "MetLife Stadium (New York/New Jersey, EUA)" },
            { id: 7, casa: "Catar 🇶🇦", fora: "🇨🇭 Suíça", data: "13/06 - 16h", local: "Levi's Stadium (San Francisco, EUA)" }
        ]
    },
    {
        nome: "14/06/2026 - Dia 4",
        jogos: [
            { id: 8, casa: "Austrália 🇦🇺", fora: "🇹🇷 Turquia", data: "14/06 - 01h", local: "BC Place (Vancouver, Canadá)" },
            { id: 9, casa: "Costa do Marfim 🇨🇮", fora: "🇪🇨 Equador", data: "14/06 - 20h", local: "Lincoln Financial Field (Filadélfia, EUA)" },
            { id: 10, casa: "Alemanha 🇩🇪", fora: "🇨🇼 Curaçau", data: "14/06 - 14h", local: "NRG Stadium (Houston, EUA)" },
            { id: 11, casa: "Holanda 🇳🇱", fora: "🇯🇵 Japão", data: "14/06 - 17h", local: "AT&T Stadium (Dallas, EUA)" },
            { id: 12, casa: "Suécia 🇸🇪", fora: "🇹🇳 Tunísia", data: "14/06 - 23h", local: "Estadio BBVA (Monterrey, México)" }
        ]
    },
    {
        nome: "15/06/2026 - Dia 5",
        jogos: [
            { id: 13, casa: "Arábia Saudita 🇸🇦", fora: "🇺🇾 Uruguai", data: "15/06 - 19h", local: "Hard Rock Stadium (Miami, EUA)" },
            { id: 14, casa: "Espanha 🇪🇸", fora: "🇨🇻 Cabo Verde", data: "21/06 - 13h", local: "Mercedes-Benz Stadium (Atlanta, EUA)" },
            { id: 15, casa: "Irã 🇮🇷", fora: "🇳🇿 Nova Zelândia", data: "15/06 - 22h", local: "SoFi Stadium (Los Angeles, EUA)" },
            { id: 16, casa: "Bélgica 🇧🇪", fora: "🇪🇬 Egito", data: "15/06 - 16h", local: "Lumen Field (Seattle, EUA)" }
        ]
    },
    {
        nome: "16/06/2026 - Dia 6",
        jogos: [
            { id: 17, casa: "França 🇫🇷", fora: "🇸🇳 Senegal", data: "16/06 - 16h", local: "MetLife Stadium (New York/New Jersey, EUA)" },
            { id: 18, casa: "Iraque 🇮🇶", fora: "🇳🇴 Noruega", data: "16/06 - 19h", local: "Gillette Stadium (Boston, EUA)" },
            { id: 19, casa: "Argentina 🇦🇷", fora: "🇩🇿 Argélia", data: "16/06 - 22h", local: "Arrowhead Stadium (Kansas City, EUA)" }
        ]
    },
    {
        nome: "17/06/2026 - Dia 7",
        jogos: [
            { id: 20, casa: "Áustria 🇦🇹", fora: "🇯🇴 Jordânia", data: "17/06 - 01h", local: "Levi's Stadium (San Francisco, EUA)" },
            { id: 21, casa: "Gana 🇬🇭", fora: "🇵🇦 Panamá", data: "17/06 - 20h", local: "BMO Field (Toronto, Canadá)" },
            { id: 22, casa: "Inglaterra 🏴󠁧󠁢󠁥󠁮󠁧󠁿", fora: "🇭🇷 Croácia", data: "17/06 - 17h", local: "AT&T Stadium (Dallas, EUA)" },
            { id: 23, casa: "Portugal 🇵🇹", fora: "🇨🇩 RD Congo", data: "17/06 - 14h", local: "NRG Stadium (Houston, EUA)" },
            { id: 24, casa: "Uzbequistão 🇺🇿", fora: "🇨🇴 Colômbia", data: "17/06 - 23h", local: "Estádio Azteca (Cidade do México)" }
        ]
    },
    {
        nome: "18/06/2026 - Dia 8",
        jogos: [
            { id: 25, casa: "República Tcheca 🇨🇿", fora: "🇿🇦 África do Sul", data: "18/06 - 13h", local: "Mercedes-Benz Stadium (Atlanta, EUA)" },
            { id: 26, casa: "Suíça 🇨🇭", fora: "🇧🇦 Bósnia e Herzegovina", data: "18/06 - 16h", local: "SoFi Stadium (Los Angeles, EUA)" },
            { id: 27, casa: "Canadá 🇨🇦", fora: "🇶🇦 Catar", data: "18/06 - 19h", local: "BC Place (Vancouver, Canadá)" },
            { id: 28, casa: "México 🇲🇽", fora: "🇰🇷 Coreia do Sul", data: "18/06 - 22h", local: "Estadio Akron (Guadalajara, México)" }
        ]
    },
    {
        nome: "19/06/2026 - Dia 9",
        jogos: [
            { id: 29, casa: "Brasil 🇧🇷", fora: "🇭🇹 Haiti", data: "19/06 - 22h", local: "Lincoln Financial Field (Filadélfia, EUA)" },
            { id: 30, casa: "Escócia 🏴󠁧󠁢󠁳󠁣󠁴󠁿", fora: "🇲🇦 Marrocos", data: "19/06 - 19h", local: "Gillette Stadium (Boston, EUA)" },
            { id: 31, casa: "Estados Unidos 🇺🇸", fora: "🇦🇺 Austrália", data: "19/06 - 16h", local: "Lumen Field (Seattle, EUA)" }
        ]
    },
    {
        nome: "20/06/2026 - Dia 10",
        jogos: [
            { id: 32, casa: "Turquia 🇹🇷", fora: "🇵🇾 Paraguai", data: "20/06 - 01h", local: "Levi's Stadium (San Francisco, EUA)" },
            { id: 33, casa: "Alemanha 🇩🇪", fora: "🇨🇮 Costa do Marfim", data: "20/06 - 17h", local: "BMO Field (Toronto, Canadá)" },
            { id: 34, casa: "Equador 🇪🇨", fora: "🇨🇼 Curaçau", data: "20/06 - 21h", local: "Arrowhead Stadium (Kansas City, EUA)" },
            { id: 35, casa: "Holanda 🇳🇱", fora: "🇸🇪 Suécia", data: "20/06 - 14h", local: "NRG Stadium (Houston, EUA)" }
        ]
    },
    {
        nome: "21/06/2026 - Dia 11",
        jogos: [
            { id: 36, casa: "Tunísia 🇹🇳", fora: "🇯🇵 Japão", data: "20/06 - 01h", local: "Estadio BBVA (Monterrey, México)" },
            { id: 37, casa: "Uruguai 🇺🇾", fora: "🇨🇻 Cabo Verde", data: "21/06 - 19h", local: "Hard Rock Stadium (Miami, EUA)" },
            { id: 38, casa: "Espanha 🇪🇸", fora: "🇸🇦 Arábia Saudita", data: "21/06 - 13h", local: "Mercedes-Benz Stadium (Atlanta, EUA)" },
            { id: 39, casa: "Bélgica 🇧🇪", fora: "🇮🇷 Irã", data: "21/06 - 16h", local: "SoFi Stadium (Los Angeles, EUA)" },
            { id: 40, casa: "Nova Zelândia 🇳🇿", fora: "🇪🇬 Egito", data: "21/06 - 22h", local: "BC Place (Vancouver, Canadá)" }
        ]
    },
    {
        nome: "22/06/2026 - Dia 12",
        jogos: [
            { id: 41, casa: "Noruega 🇳🇴", fora: "🇸🇳 Senegal", data: "22/06 - 21h", local: "MetLife Stadium (New York/New Jersey, EUA)" },
            { id: 42, casa: "França 🇫🇷", fora: "🇮🇶 Iraque", data: "22/06 - 18h", local: "Lincoln Financial Field (Filadélfia, EUA)" },
            { id: 43, casa: "Argentina 🇦🇷", fora: "🇦🇹 Áustria", data: "22/06 - 14h", local: "AT&T Stadium (Dallas, EUA)" }
        ]
    },
    {
        nome: "23/06/2026 - Dia 13",
        jogos: [
            { id: 44, casa: "Jordânia 🇯🇴", fora: "🇩🇿 Argélia", data: "22/06 - 00h", local: "Levi's Stadium (San Francisco, EUA)" },
            { id: 45, casa: "Inglaterra 🏴󠁧󠁢󠁥󠁮󠁧󠁿", fora: "🇬🇭 Gana", data: "23/06 - 17h", local: "Gillette Stadium (Boston, EUA)" },
            { id: 46, casa: "Panamá 🇵🇦", fora: "🇭🇷 Croácia", data: "23/06 - 20h", local: "BMO Field (Toronto, Canadá)" },
            { id: 47, casa: "Portugal 🇵🇹", fora: "🇺🇿 Uzbequistão", data: "23/06 - 14h", local: "NRG Stadium (Houston, EUA)" },
            { id: 48, casa: "Colômbia 🇨🇴", fora: "🇨🇩 RD Congo", data: "23/06 - 23h", local: "Estadio Akron (Guadalajara, México)" }
        ]
    },
    {
        nome: "24/06/2026 - Dia 14",
        jogos: [
            { id: 49, casa: "Escócia 🏴󠁧󠁢󠁳󠁣󠁴󠁿", fora: "🇧🇷 Brasil", data: "24/06 - 19h", local: "Hard Rock Stadium (Miami, EUA)" },
            { id: 50, casa: "Marrocos 🇲🇦", fora: "🇭🇹 Haiti", data: "24/06 - 19h", local: "Mercedes-Benz Stadium (Atlanta, EUA)" },
            { id: 51, casa: "Suíça 🇨🇭", fora: "🇨🇦 Canadá", data: "24/06 - 16h", local: "BC Place (Vancouver, Canadá)" },
            { id: 52, casa: "Bósnia e Herzegovina 🇧🇦", fora: "🇶🇦 Catar", data: "24/06 - 16h", local: "Lumen Field (Seattle, EUA)" },
            { id: 53, casa: "República Tcheca 🇨🇿", fora: "🇲🇽 México", data: "24/06 - 22h", local: "Estádio Azteca (Cidade do México)" },
            { id: 54, casa: "África do Sul 🇿🇦", fora: "🇰🇷 Coreia do Sul", data: "24/06 - 22h", local: "Estadio BBVA (Monterrey, México)" }
        ]
    },
    {
        nome: "25/06/2026 - Dia 15",
        jogos: [
            { id: 55, casa: "Curaçau 🇨🇼", fora: "🇨🇮 Costa do Marfim", data: "25/06 - 17h", local: "Lincoln Financial Field (Filadélfia, EUA)" },
            { id: 56, casa: "Equador 🇪🇨", fora: "🇩🇪 Alemanha", data: "25/06 - 17h", local: "MetLife Stadium (New York/New Jersey, EUA)" },
            { id: 57, casa: "Japão 🇯🇵", fora: "🇸🇪 Suécia", data: "25/06 - 20h", local: "AT&T Stadium (Dallas, EUA)" },
            { id: 58, casa: "Tunísia 🇹🇳", fora: "🇳🇱 Holanda", data: "25/06 - 20h", local: "Arrowhead Stadium (Kansas City, EUA)" },
            { id: 59, casa: "Turquia 🇹🇷", fora: "🇺🇸 Estados Unidos", data: "25/06 - 23h", local: "SoFi Stadium (Los Angeles, EUA)" },
            { id: 60, casa: "Paraguai 🇵🇾", fora: "🇦🇺 Austrália", data: "25/06 - 23h", local: "Levi's Stadium (San Francisco, EUA)" }
        ]
    },
    {
        nome: "26/06/2026 - Dia 16",
        jogos: [
            { id: 61, casa: "Noruega 🇳🇴", fora: "🇫🇷 França", data: "26/06 - 16h", local: "Gillette Stadium (Boston, EUA)" },
            { id: 62, casa: "Senegal 🇸🇳", fora: "🇮🇶 Iraque", data: "26/06 - 16h", local: "BMO Field (Toronto, Canadá)" },
            { id: 63, casa: "Cabo Verde 🇨🇻", fora: "🇸🇦 Arábia Saudita", data: "26/06 - 21h", local: "NRG Stadium (Houston, EUA)" },
            { id: 64, casa: "Uruguai 🇺🇾", fora: "🇪🇸 Espanha", data: "26/06 - 21h", local: "Estadio Akron (Guadalajara, México)" }
        ]
    },
    {
        nome: "27/06/2026 - Dia 17",
        jogos: [
            { id: 65, casa: "Egito 🇪🇬", fora: "🇮🇷 Irã", data: "27/06 - 00h", local: "Lumen Field (Seattle, EUA)" },
            { id: 66, casa: "Panamá 🇵🇦", fora: "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Inglaterra", data: "27/06 - 18h", local: "MetLife Stadium (New York/New Jersey, EUA)" },
            { id: 67, casa: "Croácia 🇭🇷", fora: "🇬🇭 Gana", data: "27/06 - 18h", local: "Lincoln Financial Field (Filadélfia, EUA)" },
            { id: 68, casa: "Argélia 🇩🇿", fora: "🇦🇹 Áustria", data: "27/06 - 23h", local: "Arrowhead Stadium (Kansas City, EUA)" },
            { id: 69, casa: "Jordânia 🇯🇴", fora: "🇦🇷 Argentina", data: "27/06 - 23h", local: "AT&T Stadium (Dallas, EUA)" },
            { id: 70, casa: "Colômbia 🇨🇴", fora: "🇵🇹 Portugal", data: "27/06 - 20h30", local: "Hard Rock Stadium (Miami, EUA)" },
            { id: 71, casa: "RD Congo 🇨🇩", fora: "🇺🇿 Uzbequistão", data: "27/06 - 20h30", local: "Mercedes-Benz Stadium (Atlanta, EUA)" },
            { id: 72, casa: "Nova Zelândia 🇳🇿", fora: "🇧🇪 Bélgica", data: "27/06 - 00h", local: "BC Place (Vancouver, Canadá)" }
        ]
    }
];

// ============================================
// FASES DO MATA-MATA
// ============================================

// ============================================
// 16 AVOS DE FINAL (CONFRONTOS REAIS COM ESTÁDIOS)
// ============================================

const dezesseisAvos = {
    nome: "🏆 16 Avos de Final",
    jogos: [
        // Domingo, 28 de junho
        { id: 73, casa: "África do Sul 🇿🇦", fora: "🇨🇦 Canadá", data: "28/06 - 16h", local: "SoFi Stadium (Los Angeles, EUA)" },
        
        // Segunda-feira, 29 de junho
        { id: 74, casa: "Brasil 🇧🇷", fora: "2º F", data: "29/06 - 14h", local: "NRG Stadium (Houston, EUA)" },
        { id: 75, casa: "Alemanha 🇩🇪", fora: "3º (A/B/C/D/F)", data: "29/06 - 17h30", local: "Gillette Stadium (Boston, EUA)" },
        { id: 76, casa: "1º F", fora: "🇲🇦 Marrocos", data: "29/06 - 22h", local: "Estadio BBVA (Monterrey, México)" },
        
        // Terça-feira, 30 de junho
        { id: 77, casa: "2º E", fora: "2º I", data: "30/06 - 14h", local: "AT&T Stadium (Dallas, EUA)" },
        { id: 78, casa: "1º I", fora: "3º (C/D/F/G/H)", data: "30/06 - 18h", local: "MetLife Stadium (New York/Nova Jersey, EUA)" },
        { id: 79, casa: "México 🇲🇽", fora: "3º (C/E/F/H/I)", data: "30/06 - 22h", local: "Estádio Azteca (Cidade do México, México)" },
        
        // Quarta-feira, 1º de julho
        { id: 80, casa: "1º L", fora: "3º (E/H/I/J/K)", data: "01/07 - 13h", local: "Mercedes-Benz Stadium (Atlanta, EUA)" },
        { id: 81, casa: "1º G", fora: "3º (A/E/H/I/J)", data: "01/07 - 17h", local: "Lumen Field (Seattle, EUA)" },
        { id: 82, casa: "Estados Unidos 🇺🇸", fora: "3º (B/E/F/I/J)", data: "01/07 - 21h", local: "Levi's Stadium (Santa Clara, EUA)" },
        
        // Quinta-feira, 2 de julho
        { id: 83, casa: "1º H", fora: "2º J", data: "02/07 - 16h", local: "SoFi Stadium (Los Angeles, EUA)" },
        { id: 84, casa: "2º K", fora: "2º L", data: "02/07 - 20h", local: "BMO Field (Toronto, Canadá)" },
        
        // Sexta-feira, 3 de julho
        { id: 85, casa: "Suíça 🇨🇭", fora: "3º (E/F/G/I/J)", data: "03/07 - 00h", local: "BC Place (Vancouver, Canadá)" },
        { id: 86, casa: "1º D", fora: "2º G", data: "03/07 - 15h", local: "AT&T Stadium (Dallas, EUA)" },
        { id: 87, casa: "Argentina 🇦🇷", fora: "2º H", data: "03/07 - 19h", local: "Hard Rock Stadium (Miami, EUA)" },
        { id: 88, casa: "1º K", fora: "3º (D/E/I/J/L)", data: "03/07 - 22h30", local: "Arrowhead Stadium (Kansas City, EUA)" }
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