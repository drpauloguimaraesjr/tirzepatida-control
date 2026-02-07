// ================================================
// FIREBASE CONFIGURATION - Tirzepatida Control
// ================================================

// Firebase Web SDK Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDAzawF7tSNqvTad7nB30pAYq3LffTRhy0",
    authDomain: "tirzecontrol.firebaseapp.com",
    projectId: "tirzecontrol",
    storageBucket: "tirzecontrol.firebasestorage.app",
    messagingSenderId: "267444805340",
    appId: "1:267444805340:web:3a353b2ec3a3cef64d5e19"
};

// Initialize Firebase
let app = null;
let db = null;
let auth = null;

try {
    // Check if Firebase SDK is loaded
    if (typeof firebase !== 'undefined') {
        app = firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        auth = firebase.auth();
        
        console.log('✅ Firebase inicializado com sucesso!');
        console.log('📊 Projeto:', firebaseConfig.projectId);
    } else {
        console.warn('⚠️ Firebase SDK não carregado. Usando modo local.');
    }
} catch (error) {
    console.error('❌ Erro ao inicializar Firebase:', error);
}

// Export for use in other modules (if using ES modules later)
// export { app, db, auth, firebaseConfig };
