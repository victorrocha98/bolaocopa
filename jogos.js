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
            { id: 1, casa: "México <span class='fi fi-mx'></span>", fora: "<span class='fi fi-za'></span> África do Sul", data: "11/06 - 16h", local: "Estádio Azteca (Cidade do México, México)" },
            { id: 2, casa: "Coreia do Sul <span class='fi fi-kr'></span>", fora: "<span class='fi fi-cz'></span> República Tcheca", data: "11/06 - 23h", local: "Estadio Akron (Guadalajara, México)" }
        ]
    },
    {
        nome: "12/06/2026 - Dia 2",
        jogos: [
            { id: 3, casa: "Canadá <span class='fi fi-ca'></span>", fora: "<span class='fi fi-ba'></span> Bósnia e Herzegovina", data: "12/06 - 16h", local: "BMO Field (Toronto, Canadá)" },
            { id: 4, casa: "Estados Unidos <span class='fi fi-us'></span>", fora: "<span class='fi fi-py'></span> Paraguai", data: "12/06 - 22h", local: "SoFi Stadium (Los Angeles, EUA)" }
        ]
    },
    {
        nome: "13/06/2026 - Dia 3",
        jogos: [
            { id: 5, casa: "Haiti <span class='fi fi-ht'></span>", fora: "<span class='fi fi-gb-sct'></span> Escócia", data: "13/06 - 21h30", local: "Gillette Stadium (Boston, EUA)" },
            { id: 6, casa: "Brasil <span class='fi fi-br'></span>", fora: "<span class='fi fi-ma'></span> Marrocos", data: "13/06 - 19h", local: "MetLife Stadium (New York/Nova Jersey, EUA)" },
            { id: 7, casa: "Catar <span class='fi fi-qa'></span>", fora: "<span class='fi fi-ch'></span> Suíça", data: "13/06 - 16h", local: "Levi's Stadium (Santa Clara, EUA)" }
        ]
    },
    {
        nome: "14/06/2026 - Dia 4",
        jogos: [
            { id: 8, casa: "Austrália <span class='fi fi-au'></span>", fora: "<span class='fi fi-tr'></span> Turquia", data: "14/06 - 01h", local: "BC Place (Vancouver, Canadá)" },
            { id: 9, casa: "Costa do Marfim <span class='fi fi-ci'></span>", fora: "<span class='fi fi-ec'></span> Equador", data: "14/06 - 20h", local: "Lincoln Financial Field (Filadélfia, EUA)" },
            { id: 10, casa: "Alemanha <span class='fi fi-de'></span>", fora: "<span class='fi fi-cw'></span> Curaçau", data: "14/06 - 14h", local: "NRG Stadium (Houston, EUA)" },
            { id: 11, casa: "Holanda <span class='fi fi-nl'></span>", fora: "<span class='fi fi-jp'></span> Japão", data: "14/06 - 17h", local: "AT&T Stadium (Dallas, EUA)" },
            { id: 12, casa: "Suécia <span class='fi fi-se'></span>", fora: "<span class='fi fi-tn'></span> Tunísia", data: "14/06 - 23h", local: "Estadio BBVA (Monterrey, México)" }
        ]
    },
    {
        nome: "15/06/2026 - Dia 5",
        jogos: [
            { id: 13, casa: "Arábia Saudita <span class='fi fi-sa'></span>", fora: "<span class='fi fi-uy'></span> Uruguai", data: "15/06 - 19h", local: "Hard Rock Stadium (Miami, EUA)" },
            { id: 14, casa: "Espanha <span class='fi fi-es'></span>", fora: "<span class='fi fi-cv'></span> Cabo Verde", data: "21/06 - 13h", local: "Mercedes-Benz Stadium (Atlanta, EUA)" },
            { id: 15, casa: "Irã <span class='fi fi-ir'></span>", fora: "<span class='fi fi-nz'></span> Nova Zelândia", data: "15/06 - 22h", local: "SoFi Stadium (Los Angeles, EUA)" },
            { id: 16, casa: "Bélgica <span class='fi fi-be'></span>", fora: "<span class='fi fi-eg'></span> Egito", data: "15/06 - 16h", local: "Lumen Field (Seattle, EUA)" }
        ]
    },
    {
        nome: "16/06/2026 - Dia 6",
        jogos: [
            { id: 17, casa: "França <span class='fi fi-fr'></span>", fora: "<span class='fi fi-sn'></span> Senegal", data: "16/06 - 16h", local: "MetLife Stadium (New York/Nova Jersey, EUA)" },
            { id: 18, casa: "Iraque <span class='fi fi-iq'></span>", fora: "<span class='fi fi-no'></span> Noruega", data: "16/06 - 19h", local: "Gillette Stadium (Boston, EUA)" },
            { id: 19, casa: "Argentina <span class='fi fi-ar'></span>", fora: "<span class='fi fi-dz'></span> Argélia", data: "16/06 - 22h", local: "Arrowhead Stadium (Kansas City, EUA)" }
        ]
    },
    {
        nome: "17/06/2026 - Dia 7",
        jogos: [
            { id: 20, casa: "Áustria <span class='fi fi-at'></span>", fora: "<span class='fi fi-jo'></span> Jordânia", data: "17/06 - 01h", local: "Levi's Stadium (Santa Clara, EUA)" },
            { id: 21, casa: "Gana <span class='fi fi-gh'></span>", fora: "<span class='fi fi-pa'></span> Panamá", data: "17/06 - 20h", local: "BMO Field (Toronto, Canadá)" },
            { id: 22, casa: "Inglaterra <span class='fi fi-gb-eng'></span>", fora: "<span class='fi fi-hr'></span> Croácia", data: "17/06 - 17h", local: "AT&T Stadium (Dallas, EUA)" },
            { id: 23, casa: "Portugal <span class='fi fi-pt'></span>", fora: "<span class='fi fi-cd'></span> RD Congo", data: "17/06 - 14h", local: "NRG Stadium (Houston, EUA)" },
            { id: 24, casa: "Uzbequistão <span class='fi fi-uz'></span>", fora: "<span class='fi fi-co'></span> Colômbia", data: "17/06 - 23h", local: "Estádio Azteca (Cidade do México, México)" }
        ]
    },
    {
        nome: "18/06/2026 - Dia 8",
        jogos: [
            { id: 25, casa: "República Tcheca <span class='fi fi-cz'></span>", fora: "<span class='fi fi-za'></span> África do Sul", data: "18/06 - 13h", local: "Mercedes-Benz Stadium (Atlanta, EUA)" },
            { id: 26, casa: "Suíça <span class='fi fi-ch'></span>", fora: "<span class='fi fi-ba'></span> Bósnia e Herzegovina", data: "18/06 - 16h", local: "SoFi Stadium (Los Angeles, EUA)" },
            { id: 27, casa: "Canadá <span class='fi fi-ca'></span>", fora: "<span class='fi fi-qa'></span> Catar", data: "18/06 - 19h", local: "BC Place (Vancouver, Canadá)" },
            { id: 28, casa: "México <span class='fi fi-mx'></span>", fora: "<span class='fi fi-kr'></span> Coreia do Sul", data: "18/06 - 22h", local: "Estadio Akron (Guadalajara, México)" }
        ]
    },
    {
        nome: "19/06/2026 - Dia 9",
        jogos: [
            { id: 29, casa: "Brasil <span class='fi fi-br'></span>", fora: "<span class='fi fi-ht'></span> Haiti", data: "19/06 - 22h", local: "Lincoln Financial Field (Filadélfia, EUA)" },
            { id: 30, casa: "Escócia <span class='fi fi-gb-sct'></span>", fora: "<span class='fi fi-ma'></span> Marrocos", data: "19/06 - 19h", local: "Gillette Stadium (Boston, EUA)" },
            { id: 31, casa: "Estados Unidos <span class='fi fi-us'></span>", fora: "<span class='fi fi-au'></span> Austrália", data: "19/06 - 16h", local: "Lumen Field (Seattle, EUA)" }
        ]
    },
    {
        nome: "20/06/2026 - Dia 10",
        jogos: [
            { id: 32, casa: "Turquia <span class='fi fi-tr'></span>", fora: "<span class='fi fi-py'></span> Paraguai", data: "20/06 - 01h", local: "Levi's Stadium (Santa Clara, EUA)" },
            { id: 33, casa: "Alemanha <span class='fi fi-de'></span>", fora: "<span class='fi fi-ci'></span> Costa do Marfim", data: "20/06 - 17h", local: "BMO Field (Toronto, Canadá)" },
            { id: 34, casa: "Equador <span class='fi fi-ec'></span>", fora: "<span class='fi fi-cw'></span> Curaçau", data: "20/06 - 21h", local: "Arrowhead Stadium (Kansas City, EUA)" },
            { id: 35, casa: "Holanda <span class='fi fi-nl'></span>", fora: "<span class='fi fi-se'></span> Suécia", data: "20/06 - 14h", local: "NRG Stadium (Houston, EUA)" }
        ]
    },
    {
        nome: "21/06/2026 - Dia 11",
        jogos: [
            { id: 36, casa: "Tunísia <span class='fi fi-tn'></span>", fora: "<span class='fi fi-jp'></span> Japão", data: "20/06 - 01h", local: "Estadio BBVA (Monterrey, México)" },
            { id: 37, casa: "Uruguai <span class='fi fi-uy'></span>", fora: "<span class='fi fi-cv'></span> Cabo Verde", data: "21/06 - 19h", local: "Hard Rock Stadium (Miami, EUA)" },
            { id: 38, casa: "Espanha <span class='fi fi-es'></span>", fora: "<span class='fi fi-sa'></span> Arábia Saudita", data: "21/06 - 13h", local: "Mercedes-Benz Stadium (Atlanta, EUA)" },
            { id: 39, casa: "Bélgica <span class='fi fi-be'></span>", fora: "<span class='fi fi-ir'></span> Irã", data: "21/06 - 16h", local: "SoFi Stadium (Los Angeles, EUA)" },
            { id: 40, casa: "Nova Zelândia <span class='fi fi-nz'></span>", fora: "<span class='fi fi-eg'></span> Egito", data: "21/06 - 22h", local: "BC Place (Vancouver, Canadá)" }
        ]
    },
    {
        nome: "22/06/2026 - Dia 12",
        jogos: [
            { id: 41, casa: "Noruega <span class='fi fi-no'></span>", fora: "<span class='fi fi-sn'></span> Senegal", data: "22/06 - 21h", local: "MetLife Stadium (New York/Nova Jersey, EUA)" },
            { id: 42, casa: "França <span class='fi fi-fr'></span>", fora: "<span class='fi fi-iq'></span> Iraque", data: "22/06 - 18h", local: "Lincoln Financial Field (Filadélfia, EUA)" },
            { id: 43, casa: "Argentina <span class='fi fi-ar'></span>", fora: "<span class='fi fi-at'></span> Áustria", data: "22/06 - 14h", local: "AT&T Stadium (Dallas, EUA)" }
        ]
    },
    {
        nome: "23/06/2026 - Dia 13",
        jogos: [
            { id: 44, casa: "Jordânia <span class='fi fi-jo'></span>", fora: "<span class='fi fi-dz'></span> Argélia", data: "22/06 - 00h", local: "Levi's Stadium (Santa Clara, EUA)" },
            { id: 45, casa: "Inglaterra <span class='fi fi-gb-eng'></span>", fora: "<span class='fi fi-gh'></span> Gana", data: "23/06 - 17h", local: "Gillette Stadium (Boston, EUA)" },
            { id: 46, casa: "Panamá <span class='fi fi-pa'></span>", fora: "<span class='fi fi-hr'></span> Croácia", data: "23/06 - 20h", local: "BMO Field (Toronto, Canadá)" },
            { id: 47, casa: "Portugal <span class='fi fi-pt'></span>", fora: "<span class='fi fi-uz'></span> Uzbequistão", data: "23/06 - 14h", local: "NRG Stadium (Houston, EUA)" },
            { id: 48, casa: "Colômbia <span class='fi fi-co'></span>", fora: "<span class='fi fi-cd'></span> RD Congo", data: "23/06 - 23h", local: "Estadio Akron (Guadalajara, México)" }
        ]
    },
    {
        nome: "24/06/2026 - Dia 14",
        jogos: [
            { id: 49, casa: "Escócia <span class='fi fi-gb-sct'></span>", fora: "<span class='fi fi-br'></span> Brasil", data: "24/06 - 19h", local: "Hard Rock Stadium (Miami, EUA)" },
            { id: 50, casa: "Marrocos <span class='fi fi-ma'></span>", fora: "<span class='fi fi-ht'></span> Haiti", data: "24/06 - 19h", local: "Mercedes-Benz Stadium (Atlanta, EUA)" },
            { id: 51, casa: "Suíça <span class='fi fi-ch'></span>", fora: "<span class='fi fi-ca'></span> Canadá", data: "24/06 - 16h", local: "BC Place (Vancouver, Canadá)" },
            { id: 52, casa: "Bósnia e Herzegovina <span class='fi fi-ba'></span>", fora: "<span class='fi fi-qa'></span> Catar", data: "24/06 - 16h", local: "Lumen Field (Seattle, EUA)" },
            { id: 53, casa: "República Tcheca <span class='fi fi-cz'></span>", fora: "<span class='fi fi-mx'></span> México", data: "24/06 - 22h", local: "Estádio Azteca (Cidade do México, México)" },
            { id: 54, casa: "África do Sul <span class='fi fi-za'></span>", fora: "<span class='fi fi-kr'></span> Coreia do Sul", data: "24/06 - 22h", local: "Estadio BBVA (Monterrey, México)" }
        ]
    },
    {
        nome: "25/06/2026 - Dia 15",
        jogos: [
            { id: 55, casa: "Curaçau <span class='fi fi-cw'></span>", fora: "<span class='fi fi-ci'></span> Costa do Marfim", data: "25/06 - 17h", local: "Lincoln Financial Field (Filadélfia, EUA)" },
            { id: 56, casa: "Equador <span class='fi fi-ec'></span>", fora: "<span class='fi fi-de'></span> Alemanha", data: "25/06 - 17h", local: "MetLife Stadium (New York/Nova Jersey, EUA)" },
            { id: 57, casa: "Japão <span class='fi fi-jp'></span>", fora: "<span class='fi fi-se'></span> Suécia", data: "25/06 - 20h", local: "AT&T Stadium (Dallas, EUA)" },
            { id: 58, casa: "Tunísia <span class='fi fi-tn'></span>", fora: "<span class='fi fi-nl'></span> Holanda", data: "25/06 - 20h", local: "Arrowhead Stadium (Kansas City, EUA)" },
            { id: 59, casa: "Turquia <span class='fi fi-tr'></span>", fora: "<span class='fi fi-us'></span> Estados Unidos", data: "25/06 - 23h", local: "SoFi Stadium (Los Angeles, EUA)" },
            { id: 60, casa: "Paraguai <span class='fi fi-py'></span>", fora: "<span class='fi fi-au'></span> Austrália", data: "25/06 - 23h", local: "Levi's Stadium (Santa Clara, EUA)" }
        ]
    },
    {
        nome: "26/06/2026 - Dia 16",
        jogos: [
            { id: 61, casa: "Noruega <span class='fi fi-no'></span>", fora: "<span class='fi fi-fr'></span> França", data: "26/06 - 16h", local: "Gillette Stadium (Boston, EUA)" },
            { id: 62, casa: "Senegal <span class='fi fi-sn'></span>", fora: "<span class='fi fi-iq'></span> Iraque", data: "26/06 - 16h", local: "BMO Field (Toronto, Canadá)" },
            { id: 63, casa: "Cabo Verde <span class='fi fi-cv'></span>", fora: "<span class='fi fi-sa'></span> Arábia Saudita", data: "26/06 - 21h", local: "NRG Stadium (Houston, EUA)" },
            { id: 64, casa: "Uruguai <span class='fi fi-uy'></span>", fora: "<span class='fi fi-es'></span> Espanha", data: "26/06 - 21h", local: "Estadio Akron (Guadalajara, México)" }
        ]
    },
    {
        nome: "27/06/2026 - Dia 17",
        jogos: [
            { id: 65, casa: "Egito <span class='fi fi-eg'></span>", fora: "<span class='fi fi-ir'></span> Irã", data: "27/06 - 00h", local: "Lumen Field (Seattle, EUA)" },
            { id: 66, casa: "Panamá <span class='fi fi-pa'></span>", fora: "<span class='fi fi-gb-eng'></span> Inglaterra", data: "27/06 - 18h", local: "MetLife Stadium (New York/Nova Jersey, EUA)" },
            { id: 67, casa: "Croácia <span class='fi fi-hr'></span>", fora: "<span class='fi fi-gh'></span> Gana", data: "27/06 - 18h", local: "Lincoln Financial Field (Filadélfia, EUA)" },
            { id: 68, casa: "Argélia <span class='fi fi-dz'></span>", fora: "<span class='fi fi-at'></span> Áustria", data: "27/06 - 23h", local: "Arrowhead Stadium (Kansas City, EUA)" },
            { id: 69, casa: "Jordânia <span class='fi fi-jo'></span>", fora: "<span class='fi fi-ar'></span> Argentina", data: "27/06 - 23h", local: "AT&T Stadium (Dallas, EUA)" },
            { id: 70, casa: "Colômbia <span class='fi fi-co'></span>", fora: "<span class='fi fi-pt'></span> Portugal", data: "27/06 - 20h30", local: "Hard Rock Stadium (Miami, EUA)" },
            { id: 71, casa: "RD Congo <span class='fi fi-cd'></span>", fora: "<span class='fi fi-uz'></span> Uzbequistão", data: "27/06 - 20h30", local: "Mercedes-Benz Stadium (Atlanta, EUA)" },
            { id: 72, casa: "Nova Zelândia <span class='fi fi-nz'></span>", fora: "<span class='fi fi-be'></span> Bélgica", data: "27/06 - 00h", local: "BC Place (Vancouver, Canadá)" }
        ]
    }
];

// ============================================
// FASES DO MATA-MATA
// ============================================

// ============================================
// 16 AVOS DE FINAL (CONFRONTOS REAIS COM ESTÁDIOS)
// ============================================

// ============================================
// 16 AVOS DE FINAL (CONFRONTOS REAIS COM ESTÁDIOS)
// ============================================

const dezesseisAvos = {
    nome: "🏆 16 Avos de Final",
    jogos: [
        // Domingo, 28 de junho
        { id: 73, casa: "África do Sul <span class='fi fi-za'></span>", fora: "<span class='fi fi-ca'></span> Canadá", data: "28/06 - 16h", local: "SoFi Stadium (Los Angeles, EUA)" },
        
        // Segunda-feira, 29 de junho
        { id: 74, casa: "Brasil <span class='fi fi-br'></span>", fora: "<span class='fi fi-jp'></span> Japão", data: "29/06 - 14h", local: "NRG Stadium (Houston, EUA)" },
        { id: 75, casa: "Alemanha <span class='fi fi-de'></span>", fora: "3º (A/B/C/D/F)", data: "29/06 - 17h30", local: "Gillette Stadium (Boston, EUA)" },
        { id: 76, casa: "Holanda <span class='fi fi-nl'></span>", fora: "<span class='fi fi-ma'></span> Marrocos", data: "29/06 - 22h", local: "Estadio BBVA (Monterrey, México)" },
        
        // Terça-feira, 30 de junho
        { id: 77, casa: "Costa do Marfim <span class='fi fi-ci'></span>", fora: "2º I", data: "30/06 - 14h", local: "AT&T Stadium (Dallas, EUA)" },
        { id: 78, casa: "1º I", fora: "3º (C/D/F/G/H)", data: "30/06 - 18h", local: "MetLife Stadium (New York/Nova Jersey, EUA)" },
        { id: 79, casa: "México <span class='fi fi-mx'></span>", fora: "3º (C/E/F/H/I)", data: "30/06 - 22h", local: "Estádio Azteca (Cidade do México, México)" },
        
        // Quarta-feira, 1º de julho
        { id: 80, casa: "1º L", fora: "3º (E/H/I/J/K)", data: "01/07 - 13h", local: "Mercedes-Benz Stadium (Atlanta, EUA)" },
        { id: 81, casa: "1º G", fora: "3º (A/E/H/I/J)", data: "01/07 - 17h", local: "Lumen Field (Seattle, EUA)" },
        { id: 82, casa: "Estados Unidos <span class='fi fi-us'></span>", fora: "<span class='fi fi-ba'></span> Bósnia e Herzegovina", data: "01/07 - 21h", local: "Levi's Stadium (Santa Clara, EUA)" },
        
        // Quinta-feira, 2 de julho
        { id: 83, casa: "1º H", fora: "2º J", data: "02/07 - 16h", local: "SoFi Stadium (Los Angeles, EUA)" },
        { id: 84, casa: "2º K", fora: "2º L", data: "02/07 - 20h", local: "BMO Field (Toronto, Canadá)" },
        
        // Sexta-feira, 3 de julho
        { id: 85, casa: "Suíça <span class='fi fi-ch'></span>", fora: "3º (E/F/G/I/J)", data: "03/07 - 00h", local: "BC Place (Vancouver, Canadá)" },
        { id: 86, casa: "Austrália <span class='fi fi-au'></span>", fora: "2º G", data: "03/07 - 15h", local: "AT&T Stadium (Dallas, EUA)" },
        { id: 87, casa: "Argentina <span class='fi fi-ar'></span>", fora: "2º H", data: "03/07 - 19h", local: "Hard Rock Stadium (Miami, EUA)" },
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