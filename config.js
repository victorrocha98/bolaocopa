// Configuração do Firebase - SUBSTITUA PELAS SUAS
const firebaseConfig = {
    apiKey: "AIzaSyCPIG44HF5DskCgof8AIr2ItE0VB576fDs",
    authDomain: "bolaocopa-22293.firebaseapp.com",
    databaseURL: "https://bolaocopa-22293-default-rtdb.firebaseio.com",
    projectId: "bolaocopa-22293",
    storageBucket: "bolaocopa-22293.firebasestorage.app",
    messagingSenderId: "1013217115229",
    appId: "1:1013217115229:web:89133acdbc898f017c61b4"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Usuários padrão
const usuariosPadrao = {
    "Victor": "123456",
    "Paulo": "123456",
    "Levi": "123456",
    "Isaac": "123456",
    "Gabriel": "123456"
};

// Inicializar usuários no banco
function inicializarUsuarios() {
    for (let [nome, senha] of Object.entries(usuariosPadrao)) {
        database.ref(`usuarios/${nome}`).once('value', snapshot => {
            if (!snapshot.exists()) {
                database.ref(`usuarios/${nome}`).set({ senha, podeAlterar: true });
            }
        });
    }
}
inicializarUsuarios();
