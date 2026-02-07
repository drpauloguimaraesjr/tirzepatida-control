// ================================================
// TIRZEPATIDA CONTROL - Main Application
// ================================================

// ================================================
// STATE MANAGEMENT
// ================================================
const state = {
    currentStock: 0,
    maxStock: 500,
    criticalLevel: 50,
    warningLevel: 100,
    patients: [],
    applications: [],
    suppliers: [],
    stockHistory: [],
    users: [],
    products: [],
    lots: [],
    user: null,
    useLocalStorage: true // Toggle for demo mode without Firebase
};

// ================================================
// OWNER CONFIG - Email com acesso total ao sistema
// ================================================
const OWNER_EMAIL = 'drpauloguimaraesjr@gmail.com';

// ================================================
// PERMISSIONS CONFIG
// ================================================
const PERMISSIONS = {
    admin: {
        viewDashboard: true,
        registerApplication: true,
        addPatient: true,
        editPatient: true,
        restockInventory: true,
        importCSV: true,
        manageSuppliers: true,
        exportData: true,
        manageUsers: true,
        viewSettings: true
    },
    gestora: {
        viewDashboard: true,
        registerApplication: true,
        addPatient: true,
        editPatient: true,
        restockInventory: true,
        importCSV: true,
        manageSuppliers: true,
        exportData: true,
        manageUsers: false,
        viewSettings: false
    },
    enfermeira: {
        viewDashboard: true,
        registerApplication: true,
        addPatient: true,
        editPatient: false,
        restockInventory: false,
        importCSV: false,
        manageSuppliers: false,
        exportData: false,
        manageUsers: false,
        viewSettings: false
    },
    tecnica: {
        viewDashboard: true,
        registerApplication: false,
        addPatient: false,
        editPatient: false,
        restockInventory: false,
        importCSV: false,
        manageSuppliers: false,
        exportData: false,
        manageUsers: false,
        viewSettings: false
    }
};

const ROLE_LABELS = {
    admin: 'Administrador',
    gestora: 'Gestora',
    enfermeira: 'Enfermeira',
    tecnica: 'Técnica'
};

const PERMISSION_LABELS = {
    viewDashboard: 'Ver Dashboard',
    registerApplication: 'Registrar Aplicação',
    addPatient: 'Adicionar Paciente',
    editPatient: 'Editar Paciente',
    restockInventory: 'Entrada de Estoque',
    importCSV: 'Importar CSV',
    manageSuppliers: 'Gerenciar Fornecedores',
    exportData: 'Exportar Dados',
    manageUsers: 'Gerenciar Usuários',
    viewSettings: 'Ver Configurações'
};

// ================================================
// DEMO DATA (for testing without Firebase)
// ================================================
const demoData = {
    patients: [
        { id: '1', name: 'Maria Silva', dose: 2.5, interval: 7, phone: '11999999999', email: 'maria.silva@email.com', status: 'active', nextApplication: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString() },
        { id: '2', name: 'João Santos', dose: 5.0, interval: 7, phone: '11988888888', email: 'joao.santos@email.com', status: 'active', nextApplication: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() },
        { id: '3', name: 'Ana Carolina Oliveira', dose: 2.5, interval: 10, phone: '11977777777', email: 'ana.oliveira@email.com', status: 'active', nextApplication: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString() },
        { id: '4', name: 'Carlos Alberto Pereira', dose: 7.5, interval: 7, phone: '11966666666', email: 'carlos.pereira@email.com', status: 'active', nextApplication: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() },
        { id: '5', name: 'Beatriz Lima Costa', dose: 3.5, interval: 7, phone: '11955555555', email: 'beatriz.lima@email.com', status: 'inactive', nextApplication: null },
        { id: '6', name: 'Roberto Mendes', dose: 5.0, interval: 14, phone: '11944444444', email: 'roberto.mendes@email.com', status: 'active', nextApplication: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString() },
        { id: '7', name: 'Fernanda Souza', dose: 2.5, interval: 7, phone: '11933333333', email: 'fernanda.souza@email.com', status: 'active', nextApplication: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
        { id: '8', name: 'Lucas Rodrigues', dose: 7.5, interval: 7, phone: '11922222222', email: 'lucas.rodrigues@email.com', status: 'active', nextApplication: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString() },
        { id: '9', name: 'Patricia Almeida', dose: 5.0, interval: 10, phone: '11911111111', email: 'patricia.almeida@email.com', status: 'pending', nextApplication: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString() },
        { id: '10', name: 'Marcelo Ferreira', dose: 2.5, interval: 7, phone: '11900000000', email: 'marcelo.ferreira@email.com', status: 'active', nextApplication: new Date(Date.now() + 0 * 24 * 60 * 60 * 1000).toISOString() },
    ],
    suppliers: [
        { id: '1', name: 'Farmácia Express', deliveryDays: 2, pricePerMg: 45.00, contact: '11999001122' },
        { id: '2', name: 'Distribuidora Médica SP', deliveryDays: 5, pricePerMg: 38.00, contact: '11998877665' },
        { id: '3', name: 'MedSupply Brasil', deliveryDays: 7, pricePerMg: 32.00, contact: '11997766554' },
        { id: '4', name: 'BioFarma Importados', deliveryDays: 10, pricePerMg: 28.50, contact: '11996655443' },
    ],
    users: [
        { id: 'user-1', name: 'Dr. Paulo Guimarães Jr', email: 'drpauloguimaraesjr@gmail.com', password: '123456', role: 'admin' },
        { id: 'user-2', name: 'Amanda Costa', email: 'amanda@clinica.com', password: '123456', role: 'gestora' },
        { id: 'user-3', name: 'Carla Enfermeira', email: 'carla@clinica.com', password: '123456', role: 'enfermeira' },
        { id: 'user-4', name: 'Julia Técnica', email: 'julia@clinica.com', password: '123456', role: 'tecnica' },
    ],
    products: [
        { id: 'prod-1', name: 'Tirzepatida 2.5mg', brand: 'Mounjaro', manufacturer: 'Eli Lilly', concentration: '2.5mg/0.5mL', presentation: 'Caneta aplicadora', activeIngredient: 'Tirzepatida', status: 'active' },
        { id: 'prod-2', name: 'Tirzepatida 5mg', brand: 'Mounjaro', manufacturer: 'Eli Lilly', concentration: '5mg/0.5mL', presentation: 'Caneta aplicadora', activeIngredient: 'Tirzepatida', status: 'active' },
        { id: 'prod-3', name: 'Tirzepatida 7.5mg', brand: 'Mounjaro', manufacturer: 'Eli Lilly', concentration: '7.5mg/0.5mL', presentation: 'Caneta aplicadora', activeIngredient: 'Tirzepatida', status: 'active' },
        { id: 'prod-4', name: 'Tirzepatida 10mg', brand: 'Mounjaro', manufacturer: 'Eli Lilly', concentration: '10mg/0.5mL', presentation: 'Caneta aplicadora', activeIngredient: 'Tirzepatida', status: 'active' },
        { id: 'prod-5', name: 'Tirzepatida 12.5mg', brand: 'Mounjaro', manufacturer: 'Eli Lilly', concentration: '12.5mg/0.5mL', presentation: 'Caneta aplicadora', activeIngredient: 'Tirzepatida', status: 'active' },
        { id: 'prod-6', name: 'Tirzepatida 15mg', brand: 'Mounjaro', manufacturer: 'Eli Lilly', concentration: '15mg/0.5mL', presentation: 'Caneta aplicadora', activeIngredient: 'Tirzepatida', status: 'active' },
    ],
    lots: [
        { id: 'lot-1', productId: 'prod-1', lotNumber: 'MJ2024A001', expiryDate: '2025-06-30', quantity: 20, quantityUsed: 8, supplierId: '1', purchaseDate: '2024-01-15', unitPrice: 450.00, status: 'active' },
        { id: 'lot-2', productId: 'prod-2', lotNumber: 'MJ2024A002', expiryDate: '2025-08-15', quantity: 15, quantityUsed: 5, supplierId: '1', purchaseDate: '2024-02-10', unitPrice: 520.00, status: 'active' },
        { id: 'lot-3', productId: 'prod-3', lotNumber: 'MJ2024B001', expiryDate: '2025-04-20', quantity: 10, quantityUsed: 7, supplierId: '2', purchaseDate: '2024-01-20', unitPrice: 580.00, status: 'active' },
        { id: 'lot-4', productId: 'prod-1', lotNumber: 'MJ2024C001', expiryDate: '2026-02-28', quantity: 25, quantityUsed: 2, supplierId: '3', purchaseDate: '2024-03-01', unitPrice: 420.00, status: 'active' },
        { id: 'lot-5', productId: 'prod-4', lotNumber: 'MJ2024B002', expiryDate: '2025-03-10', quantity: 8, quantityUsed: 8, supplierId: '2', purchaseDate: '2024-01-05', unitPrice: 650.00, status: 'depleted' },
        { id: 'lot-6', productId: 'prod-2', lotNumber: 'MJ2023D001', expiryDate: '2024-12-31', quantity: 5, quantityUsed: 5, supplierId: '4', purchaseDate: '2023-11-20', unitPrice: 490.00, status: 'expired' },
    ],
    applications: [],
    stockHistory: []
};

// Generate demo applications
function generateDemoApplications() {
    const apps = [];
    const now = new Date();
    
    for (let i = 30; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        // Random 1-3 applications per day
        const numApps = Math.floor(Math.random() * 3) + 1;
        for (let j = 0; j < numApps; j++) {
            const patient = demoData.patients[Math.floor(Math.random() * 4)]; // Only active patients
            apps.push({
                id: `app-${i}-${j}`,
                patientId: patient.id,
                patientName: patient.name,
                dose: patient.dose,
                date: date.toISOString(),
                nextDate: new Date(date.getTime() + patient.interval * 24 * 60 * 60 * 1000).toISOString(),
                appliedBy: 'Dr. Paulo'
            });
        }
    }
    
    return apps.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Generate demo stock history
function generateDemoStockHistory() {
    const history = [];
    let stock = 450;
    const now = new Date();
    
    for (let i = 30; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        // Daily consumption (random between 5-20mg)
        const consumed = Math.floor(Math.random() * 15) + 5;
        stock -= consumed;
        
        // Occasional restock
        if (stock < 100 && Math.random() > 0.7) {
            stock += 200;
        }
        
        history.push({
            date: date.toISOString(),
            stock: Math.max(stock, 0)
        });
    }
    
    return history;
}

// ================================================
// INITIALIZATION
// ================================================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    setDefaultFormValues();
    
    // Check if Firebase is available
    if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
        console.log('🔥 Firebase detectado - usando modo online');
        state.useLocalStorage = false;
        initializeFirebaseMode();
    } else {
        console.log('📦 Firebase não disponível - usando modo local');
        state.useLocalStorage = true;
        initializeLocalMode();
    }
}

function initializeLocalMode() {
    console.log('Running in local mode (no Firebase)');
    
    // Set owner as default user in demo mode
    state.user = {
        email: OWNER_EMAIL,
        name: 'Dr. Paulo Guimarães Jr',
        role: 'admin'
    };
    console.log('👑 Modo demo - Proprietário configurado como admin');
    
    // Load from localStorage or use demo data
    const savedData = localStorage.getItem('tirzepatidaData');
    
    if (savedData) {
        const data = JSON.parse(savedData);
        state.patients = data.patients || [];
        state.applications = data.applications || [];
        state.suppliers = data.suppliers || [];
        state.stockHistory = data.stockHistory || [];
        state.currentStock = data.currentStock || 0;
        state.users = data.users || [];
        state.products = data.products || [];
        state.lots = data.lots || [];
        state.maxStock = data.maxStock || 500;
        state.warningLevel = data.warningLevel || 100;
        state.criticalLevel = data.criticalLevel || 50;
    } else {
        // Use demo data for first run
        state.patients = demoData.patients;
        state.suppliers = demoData.suppliers;
        state.users = demoData.users;
        state.products = demoData.products;
        state.lots = demoData.lots;
        state.applications = generateDemoApplications();
        state.stockHistory = generateDemoStockHistory();
        state.currentStock = state.stockHistory[state.stockHistory.length - 1]?.stock || 200;
        saveToLocalStorage();
    }
    
    // Skip login for demo
    showApp();
    applyPermissions(); // Apply admin permissions
    updateDashboard();
}

function initializeFirebaseMode() {
    // Listen for auth state changes
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            console.log('✅ Usuário autenticado:', user.email);
            state.user = {
                uid: user.uid,
                email: user.email,
                role: 'admin' // Will be loaded from Firestore
            };
            
            // Load user role from Firestore
            await loadUserRole(user.uid);
            
            // Load all data from Firestore
            await loadDataFromFirestore();
            
            showApp();
            applyPermissions();
            updateDashboard();
        } else {
            console.log('❌ Usuário não autenticado');
            state.user = null;
            showLogin();
        }
    });
}

// Load user role from Firestore
async function loadUserRole(uid) {
    try {
        // Owner email always gets admin role
        if (state.user.email === OWNER_EMAIL) {
            state.user.role = 'admin';
            state.user.name = 'Dr. Paulo Guimarães Jr';
            console.log('👑 Proprietário identificado - acesso total concedido');
            
            // Ensure owner is saved in Firestore with admin role
            await db.collection('users').doc(uid).set({
                email: OWNER_EMAIL,
                name: 'Dr. Paulo Guimarães Jr',
                role: 'admin',
                isOwner: true,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            return;
        }
        
        const userDoc = await db.collection('users').doc(uid).get();
        if (userDoc.exists) {
            const userData = userDoc.data();
            state.user.role = userData.role || 'tecnica';
            state.user.name = userData.name || state.user.email;
        } else {
            // First time user - create with default role (tecnica - lowest permission)
            await db.collection('users').doc(uid).set({
                email: state.user.email,
                name: state.user.email.split('@')[0],
                role: 'tecnica', // New users get lowest permission
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            state.user.role = 'tecnica';
        }
    } catch (error) {
        console.error('Erro ao carregar role:', error);
        state.user.role = 'tecnica'; // Default to lowest permission
    }
}

// Load all data from Firestore
async function loadDataFromFirestore() {
    try {
        console.log('📥 Carregando dados do Firestore...');
        
        // Load settings
        const settingsDoc = await db.collection('settings').doc('stock').get();
        if (settingsDoc.exists) {
            const settings = settingsDoc.data();
            state.currentStock = settings.currentStock || 0;
            state.maxStock = settings.maxStock || 500;
            state.warningLevel = settings.warningLevel || 100;
            state.criticalLevel = settings.criticalLevel || 50;
        }
        
        // Load patients
        const patientsSnap = await db.collection('patients').orderBy('name').get();
        state.patients = patientsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Load applications (last 100)
        const appsSnap = await db.collection('applications')
            .orderBy('date', 'desc')
            .limit(100)
            .get();
        state.applications = appsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Load suppliers
        const suppliersSnap = await db.collection('suppliers').get();
        state.suppliers = suppliersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Load users
        const usersSnap = await db.collection('users').get();
        state.users = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Load stock history (last 60 days)
        const historySnap = await db.collection('stockHistory')
            .orderBy('date', 'desc')
            .limit(60)
            .get();
        state.stockHistory = historySnap.docs.map(doc => doc.data()).reverse();
        
        console.log('✅ Dados carregados:', {
            patients: state.patients.length,
            applications: state.applications.length,
            suppliers: state.suppliers.length,
            users: state.users.length
        });
        
        // If database is empty, populate with demo data
        if (state.patients.length === 0) {
            console.log('📊 Banco vazio - populando com dados demo...');
            await populateFirestoreWithDemoData();
        }
        
    } catch (error) {
        console.error('❌ Erro ao carregar dados:', error);
        showToast('Erro ao carregar dados do servidor', 'error');
    }
}

// Populate Firestore with demo data for presentation
async function populateFirestoreWithDemoData() {
    try {
        showToast('Populando banco com dados de demonstração...', 'info');
        
        // Add stock settings
        await db.collection('settings').doc('stock').set({
            currentStock: 285.5,
            maxStock: 500,
            warningLevel: 100,
            criticalLevel: 50,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Add patients
        for (const patient of demoData.patients) {
            await db.collection('patients').doc(patient.id).set({
                ...patient,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        
        // Add suppliers
        for (const supplier of demoData.suppliers) {
            await db.collection('suppliers').doc(supplier.id).set({
                ...supplier,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        
        // Add demo applications (last 30 days)
        const demoApps = generateDemoApplications();
        for (const app of demoApps.slice(0, 50)) { // Limit to 50 for speed
            await db.collection('applications').add({
                ...app,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        
        // Add stock history
        const demoHistory = generateDemoStockHistory();
        for (const entry of demoHistory) {
            await db.collection('stockHistory').add(entry);
        }
        
        console.log('✅ Dados demo populados com sucesso!');
        showToast('Dados de demonstração carregados!', 'success');
        
        // Reload data
        await loadDataFromFirestore();
        updateDashboard();
        
    } catch (error) {
        console.error('❌ Erro ao popular dados demo:', error);
        showToast('Erro ao carregar dados demo', 'error');
    }
}

// Save to Firestore (individual collections)
async function saveToFirestore(collection, docId, data) {
    if (state.useLocalStorage) {
        saveToLocalStorage();
        return;
    }
    
    try {
        if (docId) {
            await db.collection(collection).doc(docId).set(data, { merge: true });
        } else {
            const docRef = await db.collection(collection).add(data);
            return docRef.id;
        }
    } catch (error) {
        console.error(`Erro ao salvar em ${collection}:`, error);
        showToast('Erro ao salvar dados', 'error');
    }
}

// Update stock settings in Firestore
async function updateStockInFirestore() {
    if (state.useLocalStorage) {
        saveToLocalStorage();
        return;
    }
    
    try {
        await db.collection('settings').doc('stock').set({
            currentStock: state.currentStock,
            maxStock: state.maxStock,
            warningLevel: state.warningLevel,
            criticalLevel: state.criticalLevel,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    } catch (error) {
        console.error('Erro ao atualizar estoque:', error);
    }
}

// ================================================
// AUTH HANDLERS
// ================================================
function showApp() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    
    // Update header with user info
    const userEmail = state.user?.email || 'Modo Demo';
    const userName = state.user?.name || userEmail;
    document.getElementById('user-email').textContent = userName;
    
    // Update role badge
    const roleBadge = document.getElementById('user-role-badge');
    if (roleBadge && state.user?.role) {
        roleBadge.textContent = ROLE_LABELS[state.user.role] || state.user.role;
        roleBadge.className = `role-badge ${state.user.role}`;
    }
}

function showLogin() {
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('app').classList.add('hidden');
}

// ================================================
// EVENT LISTENERS
// ================================================
function setupEventListeners() {
    // Login form
    document.getElementById('login-form')?.addEventListener('submit', handleLogin);
    document.getElementById('logout-btn')?.addEventListener('click', handleLogout);
    
    // Application form
    document.getElementById('application-form')?.addEventListener('submit', handleApplicationSubmit);
    
    // Restock form
    document.getElementById('restock-form')?.addEventListener('submit', handleRestockSubmit);
    
    // Patient form
    document.getElementById('patient-form')?.addEventListener('submit', handlePatientSubmit);
    
    // Supplier form
    document.getElementById('supplier-form')?.addEventListener('submit', handleSupplierSubmit);
    
    // Import form
    document.getElementById('import-form')?.addEventListener('submit', handleImportSubmit);
    document.getElementById('csv-file')?.addEventListener('change', handleCSVPreview);
    
    // Search inputs
    document.getElementById('search-applications')?.addEventListener('input', filterApplications);
    document.getElementById('search-patients')?.addEventListener('input', filterPatients);
    
    // Consumption period selector
    document.getElementById('consumption-period')?.addEventListener('change', updateConsumptionChart);
    
    // Close modals on backdrop click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modal.id);
        });
    });
}

function setDefaultFormValues() {
    // Set current date/time for application form
    const now = new Date();
    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
    
    const appDateInput = document.getElementById('app-date');
    if (appDateInput) appDateInput.value = localDateTime;
    
    const restockDateInput = document.getElementById('restock-date');
    if (restockDateInput) restockDateInput.value = new Date().toISOString().split('T')[0];
}

// ================================================
// AUTH HANDLERS
// ================================================
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const name = document.getElementById('register-name')?.value || '';
    const loginBtn = e.target.querySelector('button[type="submit"]');
    
    // Show loading state
    const originalText = loginBtn.querySelector('span')?.textContent || 'Entrar';
    const btnSpan = loginBtn.querySelector('span');
    if (btnSpan) btnSpan.textContent = isRegistering ? 'Criando...' : 'Entrando...';
    loginBtn.disabled = true;
    
    if (state.useLocalStorage) {
        // Demo mode - just show the app
        state.user = { email, name: name || email, role: 'admin' };
        showApp();
        updateDashboard();
        showToast('Bem-vindo ao modo demo!', 'success');
        if (btnSpan) btnSpan.textContent = originalText;
        loginBtn.disabled = false;
    } else {
        // Firebase Auth
        try {
            if (isRegistering) {
                // Registration
                await handleRegister(email, password, name);
            } else {
                // Login
                await auth.signInWithEmailAndPassword(email, password);
                showToast('Login realizado com sucesso!', 'success');
            }
        } catch (error) {
            console.error('Erro na autenticação:', error);
            let errorMessage = 'Erro ao fazer login';
            
            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage = 'Usuário não encontrado';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Senha incorreta';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Email inválido';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Muitas tentativas. Tente novamente mais tarde';
                    break;
                case 'auth/invalid-credential':
                    errorMessage = 'Email ou senha incorretos';
                    break;
            }
            
            showToast(errorMessage, 'error');
        } finally {
            if (btnSpan) btnSpan.textContent = originalText;
            loginBtn.disabled = false;
        }
    }
}

async function handleLogout() {
    if (state.useLocalStorage) {
        state.user = null;
        showLogin();
        showToast('Você saiu do sistema', 'success');
    } else {
        try {
            await auth.signOut();
            showToast('Você saiu do sistema', 'success');
        } catch (error) {
            console.error('Erro ao sair:', error);
            showToast('Erro ao sair', 'error');
        }
    }
}

// Auth mode toggle (login vs register)
let isRegistering = false;

function toggleAuthMode(e) {
    e.preventDefault();
    isRegistering = !isRegistering;
    
    const registerFields = document.getElementById('register-fields');
    const authBtnText = document.getElementById('auth-btn-text');
    const toggleText = document.getElementById('toggle-auth-text');
    const toggleLink = document.getElementById('toggle-auth-link');
    
    if (isRegistering) {
        registerFields?.classList.remove('hidden');
        if (authBtnText) authBtnText.textContent = 'Criar Conta';
        if (toggleText) toggleText.textContent = 'Já tem conta?';
        if (toggleLink) toggleLink.textContent = 'Fazer login';
    } else {
        registerFields?.classList.add('hidden');
        if (authBtnText) authBtnText.textContent = 'Entrar';
        if (toggleText) toggleText.textContent = 'Primeiro acesso?';
        if (toggleLink) toggleLink.textContent = 'Criar conta';
    }
}
window.toggleAuthMode = toggleAuthMode;

// Handle registration
async function handleRegister(email, password, name) {
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Create user document in Firestore
        await db.collection('users').doc(user.uid).set({
            email: email,
            name: name || email.split('@')[0],
            role: 'admin', // First registered user is admin
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            status: 'active'
        });
        
        showToast('Conta criada com sucesso!', 'success');
        return true;
    } catch (error) {
        console.error('Erro no registro:', error);
        let errorMessage = 'Erro ao criar conta';
        
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = 'Este email já está em uso';
                break;
            case 'auth/weak-password':
                errorMessage = 'Senha muito fraca (mínimo 6 caracteres)';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Email inválido';
                break;
        }
        
        showToast(errorMessage, 'error');
        return false;
    }
}

// ================================================
// DASHBOARD UPDATE
// ================================================
function updateDashboard() {
    updateStockGauge();
    updateStatsCards();
    updateAlertBanner();
    updateStockProjectionChart();
    updateConsumptionChart();
    updateSupplierRecommendations();
    updateApplicationsTable();
    updatePatientsTable();
    updateProductsTable();
    updateLotsTable();
    updatePatientSelect();
    updateSupplierSelect();
}

function updateStockGauge() {
    const percentage = Math.min((state.currentStock / state.maxStock) * 100, 100);
    const circumference = 2 * Math.PI * 54; // r=54 from SVG
    const offset = circumference - (percentage / 100) * circumference;
    
    const gaugeFill = document.getElementById('stock-gauge-fill');
    if (gaugeFill) {
        gaugeFill.style.strokeDashoffset = offset;
        
        // Color based on level
        let color = '#10b981'; // green
        if (state.currentStock <= state.criticalLevel) {
            color = '#ef4444'; // red
        } else if (state.currentStock <= state.warningLevel) {
            color = '#f59e0b'; // orange
        }
        gaugeFill.style.stroke = color;
    }
    
    document.getElementById('stock-percentage').textContent = `${Math.round(percentage)}%`;
    document.getElementById('current-stock').textContent = state.currentStock.toFixed(1);
    document.getElementById('max-stock').textContent = state.maxStock;
}

function updateStatsCards() {
    // Active patients
    const activePatients = state.patients.filter(p => p.status === 'active').length;
    document.getElementById('active-patients').textContent = activePatients;
    
    // Average daily consumption
    const avgConsumption = calculateAverageConsumption();
    document.getElementById('avg-consumption').textContent = avgConsumption.toFixed(1);
    
    // Days remaining
    const daysRemaining = avgConsumption > 0 ? Math.floor(state.currentStock / avgConsumption) : '--';
    document.getElementById('days-remaining').textContent = daysRemaining;
}

function calculateAverageConsumption() {
    // Calculate based on last 30 days of applications
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentApps = state.applications.filter(app => 
        new Date(app.date) >= thirtyDaysAgo
    );
    
    const totalConsumed = recentApps.reduce((sum, app) => sum + parseFloat(app.dose), 0);
    return totalConsumed / 30;
}

function updateAlertBanner() {
    const banner = document.getElementById('alert-banner');
    const title = document.getElementById('alert-title');
    const message = document.getElementById('alert-message');
    
    if (state.currentStock <= state.criticalLevel) {
        banner.classList.remove('hidden', 'warning');
        title.textContent = 'ESTOQUE CRÍTICO!';
        message.textContent = `Apenas ${state.currentStock.toFixed(1)}mg restantes. Faça o pedido imediatamente!`;
    } else if (state.currentStock <= state.warningLevel) {
        banner.classList.remove('hidden');
        banner.classList.add('warning');
        title.textContent = 'Atenção!';
        message.textContent = `Estoque baixo: ${state.currentStock.toFixed(1)}mg. Considere fazer um pedido.`;
    } else {
        banner.classList.add('hidden');
    }
}

function closeAlert() {
    document.getElementById('alert-banner').classList.add('hidden');
}

// ================================================
// CHARTS
// ================================================
let stockProjectionChart = null;
let consumptionChart = null;

function updateStockProjectionChart() {
    const ctx = document.getElementById('stock-projection-chart');
    if (!ctx) return;
    
    const avgConsumption = calculateAverageConsumption();
    
    // Historical data (last 30 days)
    const historicalData = state.stockHistory.slice(-30).map(h => ({
        x: new Date(h.date),
        y: h.stock
    }));
    
    // Projection data (next 30 days)
    const projectionData = [];
    let projectedStock = state.currentStock;
    const today = new Date();
    
    for (let i = 0; i <= 30; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        projectionData.push({
            x: date,
            y: Math.max(projectedStock, 0)
        });
        projectedStock -= avgConsumption;
    }
    
    // Critical level line
    const criticalLine = [];
    const startDate = historicalData.length > 0 ? historicalData[0].x : new Date();
    const endDate = projectionData[projectionData.length - 1]?.x || new Date();
    criticalLine.push({ x: startDate, y: state.criticalLevel });
    criticalLine.push({ x: endDate, y: state.criticalLevel });
    
    if (stockProjectionChart) {
        stockProjectionChart.destroy();
    }
    
    stockProjectionChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [
                {
                    label: 'Histórico',
                    data: historicalData,
                    borderColor: '#18181b',
                    backgroundColor: 'rgba(24, 24, 27, 0.06)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: '#ffffff',
                    pointHoverBorderColor: '#18181b',
                    pointHoverBorderWidth: 2,
                    borderWidth: 2
                },
                {
                    label: 'Projeção',
                    data: projectionData,
                    borderColor: '#a1a1aa',
                    borderDash: [5, 5],
                    fill: false,
                    tension: 0.4,
                    pointRadius: 0,
                    borderWidth: 1.5
                },
                {
                    label: 'Nível Crítico',
                    data: criticalLine,
                    borderColor: '#ef4444',
                    borderDash: [10, 5],
                    fill: false,
                    pointRadius: 0,
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#18181b',
                    titleColor: '#ffffff',
                    bodyColor: '#a1a1aa',
                    borderColor: '#3f3f46',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: false,
                    titleFont: {
                        weight: '500'
                    },
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)} mg`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day',
                        displayFormats: {
                            day: 'dd/MM'
                        }
                    },
                    grid: {
                        color: '#f4f4f5',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#71717a',
                        font: {
                            size: 11
                        },
                        maxTicksLimit: 10
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#f4f4f5',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#71717a',
                        font: {
                            size: 11
                        },
                        callback: function(value) {
                            return value + ' mg';
                        }
                    }
                }
            }
        }
    });
}

function updateConsumptionChart() {
    const ctx = document.getElementById('consumption-chart');
    if (!ctx) return;
    
    const period = parseInt(document.getElementById('consumption-period')?.value || 30);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);
    
    // Group applications by day
    const dailyConsumption = {};
    state.applications
        .filter(app => new Date(app.date) >= startDate)
        .forEach(app => {
            const dateKey = new Date(app.date).toISOString().split('T')[0];
            dailyConsumption[dateKey] = (dailyConsumption[dateKey] || 0) + parseFloat(app.dose);
        });
    
    const labels = [];
    const data = [];
    
    for (let i = period - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateKey = date.toISOString().split('T')[0];
        labels.push(date);
        data.push(dailyConsumption[dateKey] || 0);
    }
    
    if (consumptionChart) {
        consumptionChart.destroy();
    }
    
    consumptionChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Consumo (mg)',
                data: data,
                backgroundColor: 'rgba(24, 24, 27, 0.15)',
                hoverBackgroundColor: 'rgba(24, 24, 27, 0.4)',
                borderColor: '#18181b',
                borderWidth: 1,
                borderRadius: 6,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#18181b',
                    titleColor: '#ffffff',
                    bodyColor: '#a1a1aa',
                    borderColor: '#3f3f46',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: false,
                    callbacks: {
                        title: function(context) {
                            return new Date(context[0].label).toLocaleDateString('pt-BR');
                        },
                        label: function(context) {
                            return `Consumo: ${context.parsed.y.toFixed(1)} mg`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day',
                        displayFormats: {
                            day: 'dd/MM'
                        }
                    },
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#71717a',
                        font: {
                            size: 11
                        },
                        maxTicksLimit: 7
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#f4f4f5',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#71717a',
                        font: {
                            size: 11
                        },
                        callback: function(value) {
                            return value + ' mg';
                        }
                    }
                }
            }
        }
    });
}

// ================================================
// SUPPLIER RECOMMENDATIONS
// ================================================
function updateSupplierRecommendations() {
    const container = document.getElementById('supplier-recommendations');
    if (!container) return;
    
    const avgConsumption = calculateAverageConsumption();
    const daysRemaining = avgConsumption > 0 ? state.currentStock / avgConsumption : 999;
    const safetyMargin = 3; // days
    
    const recommendations = state.suppliers.map(supplier => {
        const orderByDay = daysRemaining - supplier.deliveryDays - safetyMargin;
        const orderByDate = new Date();
        orderByDate.setDate(orderByDate.getDate() + Math.max(0, Math.floor(orderByDay)));
        
        return {
            ...supplier,
            orderByDay,
            orderByDate,
            isUrgent: orderByDay <= 0,
            isSoon: orderByDay <= 3
        };
    }).sort((a, b) => a.orderByDay - b.orderByDay);
    
    if (recommendations.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>Nenhum fornecedor cadastrado</p>
                <button class="btn btn-outline" onclick="openModal('supplier-modal')">Adicionar Fornecedor</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = recommendations.map(supplier => `
        <div class="supplier-item ${supplier.isUrgent ? 'urgent' : ''}">
            <div class="supplier-info">
                <span class="supplier-name">${supplier.name}</span>
                <span class="supplier-meta">
                    Entrega em ${supplier.deliveryDays} dias • R$ ${supplier.pricePerMg?.toFixed(2) || '--'}/mg
                </span>
            </div>
            <div class="supplier-action">
                <span class="order-date ${supplier.isUrgent ? 'text-danger' : supplier.isSoon ? 'text-warning' : ''}">
                    ${supplier.isUrgent ? 'AGORA!' : supplier.orderByDate.toLocaleDateString('pt-BR')}
                </span>
                <span class="order-label">Pedir até</span>
            </div>
        </div>
    `).join('');
}

// ================================================
// TABLES
// ================================================
function updateApplicationsTable() {
    const tbody = document.getElementById('applications-tbody');
    if (!tbody) return;
    
    const recentApps = state.applications.slice(0, 20);
    
    if (recentApps.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state">Nenhuma aplicação registrada</td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = recentApps.map(app => `
        <tr>
            <td>${formatDateTime(app.date)}</td>
            <td><strong>${app.patientName}</strong></td>
            <td>${parseFloat(app.dose).toFixed(1)} mg</td>
            <td>${formatDate(app.nextDate)}</td>
            <td>${app.appliedBy || '--'}</td>
        </tr>
    `).join('');
}

function updatePatientsTable() {
    const tbody = document.getElementById('patients-tbody');
    if (!tbody) return;
    
    if (state.patients.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">Nenhum paciente cadastrado</td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = state.patients.map(patient => `
        <tr>
            <td><strong>${patient.name}</strong></td>
            <td>${parseFloat(patient.dose).toFixed(1)} mg</td>
            <td>${patient.interval} dias</td>
            <td>${patient.nextApplication ? formatDate(patient.nextApplication) : '--'}</td>
            <td>
                <span class="status-badge ${patient.status}">
                    ${patient.status === 'active' ? 'Ativo' : 'Inativo'}
                </span>
            </td>
            <td class="table-actions-cell">
                <button class="btn-icon" onclick="editPatient('${patient.id}')" title="Editar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                    </svg>
                </button>
                <button class="btn-icon" onclick="togglePatientStatus('${patient.id}')" title="Alternar Status">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
                    </svg>
                </button>
            </td>
        </tr>
    `).join('');
}

// ================================================
// PRODUCTS & LOTS TABLES
// ================================================
function updateProductsTable() {
    const tbody = document.getElementById('products-tbody');
    if (!tbody) return;
    
    if (state.products.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state">Nenhum produto cadastrado</td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = state.products.map(product => `
        <tr>
            <td><strong>${product.name}</strong></td>
            <td>${product.brand}</td>
            <td>${product.concentration}</td>
            <td>${product.manufacturer}</td>
            <td>
                <span class="status-badge ${product.status}">
                    ${product.status === 'active' ? 'Ativo' : 'Inativo'}
                </span>
            </td>
        </tr>
    `).join('');
}

function updateLotsTable() {
    const tbody = document.getElementById('lots-tbody');
    if (!tbody) return;
    
    if (state.lots.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">Nenhum lote cadastrado</td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = state.lots.map(lot => {
        const product = state.products.find(p => p.id === lot.productId);
        const supplier = state.suppliers.find(s => s.id === lot.supplierId);
        const remaining = lot.quantity - lot.quantityUsed;
        const expiryDate = new Date(lot.expiryDate);
        const today = new Date();
        const daysToExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
        
        let expiryClass = 'active';
        let expiryLabel = formatDate(lot.expiryDate);
        
        if (lot.status === 'expired' || daysToExpiry < 0) {
            expiryClass = 'expired';
            expiryLabel = 'Vencido';
        } else if (daysToExpiry <= 30) {
            expiryClass = 'warning';
            expiryLabel = `${daysToExpiry}d restantes`;
        } else if (daysToExpiry <= 90) {
            expiryClass = 'pending';
        }
        
        let statusClass = lot.status;
        let statusLabel = lot.status === 'active' ? 'Disponível' : 
                          lot.status === 'depleted' ? 'Esgotado' : 'Vencido';
        
        return `
        <tr>
            <td><strong>${lot.lotNumber}</strong></td>
            <td>${product?.name || 'N/A'}</td>
            <td><span class="status-badge ${expiryClass}">${expiryLabel}</span></td>
            <td>${remaining} un</td>
            <td>${supplier?.name || 'N/A'}</td>
            <td><span class="status-badge ${statusClass}">${statusLabel}</span></td>
        </tr>
    `}).join('');
}

function updatePatientSelect() {
    const select = document.getElementById('app-patient');
    if (!select) return;
    
    const activePatients = state.patients.filter(p => p.status === 'active');
    
    select.innerHTML = '<option value="">Selecione...</option>' + 
        activePatients.map(p => `
            <option value="${p.id}" data-dose="${p.dose}" data-interval="${p.interval}">
                ${p.name}
            </option>
        `).join('');
    
    // Auto-fill dose and interval when patient is selected
    select.addEventListener('change', function() {
        const option = this.options[this.selectedIndex];
        if (option.dataset.dose) {
            document.getElementById('app-dose').value = option.dataset.dose;
        }
        if (option.dataset.interval) {
            document.getElementById('app-interval').value = option.dataset.interval;
        }
    });
}

function updateSupplierSelect() {
    const select = document.getElementById('restock-supplier');
    if (!select) return;
    
    select.innerHTML = '<option value="">Selecione...</option>' +
        state.suppliers.map(s => `
            <option value="${s.id}">${s.name}</option>
        `).join('');
}

function filterApplications(e) {
    const query = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#applications-tbody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
    });
}

function filterPatients(e) {
    const query = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#patients-tbody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
    });
}

// ================================================
// FORM HANDLERS
// ================================================
function handleApplicationSubmit(e) {
    e.preventDefault();
    
    const patientId = document.getElementById('app-patient').value;
    const patient = state.patients.find(p => p.id === patientId);
    const dose = parseFloat(document.getElementById('app-dose').value);
    const date = document.getElementById('app-date').value;
    const interval = parseInt(document.getElementById('app-interval').value);
    const notes = document.getElementById('app-notes').value;
    
    if (!patient) {
        showToast('Selecione um paciente', 'error');
        return;
    }
    
    if (dose > state.currentStock) {
        showToast('Estoque insuficiente!', 'error');
        return;
    }
    
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + interval);
    
    const application = {
        id: generateId(),
        patientId,
        patientName: patient.name,
        dose,
        date: new Date(date).toISOString(),
        nextDate: nextDate.toISOString(),
        appliedBy: state.user?.email || 'Sistema',
        notes
    };
    
    // Add to applications
    state.applications.unshift(application);
    
    // Update stock
    state.currentStock -= dose;
    
    // Update patient's next application
    const patientIndex = state.patients.findIndex(p => p.id === patientId);
    if (patientIndex !== -1) {
        state.patients[patientIndex].nextApplication = nextDate.toISOString();
        state.patients[patientIndex].dose = dose;
        state.patients[patientIndex].interval = interval;
    }
    
    // Update stock history
    state.stockHistory.push({
        date: new Date().toISOString(),
        stock: state.currentStock
    });
    
    saveToLocalStorage();
    updateDashboard();
    closeModal('application-modal');
    e.target.reset();
    setDefaultFormValues();
    showToast('Aplicação registrada com sucesso!', 'success');
}

function handleRestockSubmit(e) {
    e.preventDefault();
    
    const amount = parseFloat(document.getElementById('restock-amount').value);
    const supplierId = document.getElementById('restock-supplier').value;
    const date = document.getElementById('restock-date').value;
    const price = parseFloat(document.getElementById('restock-price').value) || 0;
    const notes = document.getElementById('restock-notes').value;
    
    // Add to stock
    state.currentStock += amount;
    
    // Update max stock if exceeded
    if (state.currentStock > state.maxStock) {
        state.maxStock = Math.ceil(state.currentStock / 100) * 100;
    }
    
    // Update stock history
    state.stockHistory.push({
        date: new Date(date).toISOString(),
        stock: state.currentStock,
        type: 'restock',
        amount,
        supplierId,
        price,
        notes
    });
    
    saveToLocalStorage();
    updateDashboard();
    closeModal('restock-modal');
    e.target.reset();
    setDefaultFormValues();
    showToast(`Entrada de ${amount}mg registrada!`, 'success');
}

function handlePatientSubmit(e) {
    e.preventDefault();
    
    const patient = {
        id: generateId(),
        name: document.getElementById('patient-name').value,
        dose: parseFloat(document.getElementById('patient-dose').value),
        interval: parseInt(document.getElementById('patient-interval').value),
        phone: document.getElementById('patient-phone').value,
        email: document.getElementById('patient-email').value,
        status: 'active',
        nextApplication: null,
        createdAt: new Date().toISOString()
    };
    
    state.patients.push(patient);
    saveToLocalStorage();
    updateDashboard();
    closeModal('patient-modal');
    e.target.reset();
    showToast('Paciente adicionado com sucesso!', 'success');
}

function handleSupplierSubmit(e) {
    e.preventDefault();
    
    const supplier = {
        id: generateId(),
        name: document.getElementById('supplier-name').value,
        deliveryDays: parseInt(document.getElementById('supplier-delivery').value),
        pricePerMg: parseFloat(document.getElementById('supplier-price').value) || null,
        contact: document.getElementById('supplier-contact').value
    };
    
    state.suppliers.push(supplier);
    saveToLocalStorage();
    updateSupplierRecommendations();
    updateSupplierSelect();
    e.target.reset();
    showToast('Fornecedor adicionado!', 'success');
}

function handleCSVPreview(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(event) {
        const csv = event.target.result;
        const lines = csv.split('\n').filter(line => line.trim());
        
        const preview = document.getElementById('import-preview');
        const content = document.getElementById('preview-content');
        
        if (lines.length > 1) {
            const patients = parseCSV(lines);
            content.innerHTML = `
                <p><strong>${patients.length}</strong> pacientes encontrados:</p>
                <ul>
                    ${patients.slice(0, 5).map(p => `<li>${p.name} - ${p.dose}mg / ${p.interval} dias</li>`).join('')}
                    ${patients.length > 5 ? `<li>... e mais ${patients.length - 5}</li>` : ''}
                </ul>
            `;
            preview.classList.remove('hidden');
        }
    };
    reader.readAsText(file);
}

function handleImportSubmit(e) {
    e.preventDefault();
    
    const file = document.getElementById('csv-file').files[0];
    if (!file) {
        showToast('Selecione um arquivo CSV', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(event) {
        const csv = event.target.result;
        const lines = csv.split('\n').filter(line => line.trim());
        
        if (lines.length > 1) {
            const patients = parseCSV(lines);
            patients.forEach(p => {
                p.id = generateId();
                p.status = 'active';
                p.nextApplication = null;
                p.createdAt = new Date().toISOString();
            });
            
            state.patients = [...state.patients, ...patients];
            saveToLocalStorage();
            updateDashboard();
            closeModal('import-modal');
            document.getElementById('import-preview').classList.add('hidden');
            e.target.reset();
            showToast(`${patients.length} pacientes importados!`, 'success');
        }
    };
    reader.readAsText(file);
}

function parseCSV(lines) {
    const patients = [];
    const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
        
        if (values.length >= 2) {
            const patient = {
                name: values[headers.indexOf('nome')] || values[0],
                dose: parseFloat(values[headers.indexOf('dose_mg')] || values[1]) || 2.5,
                interval: parseInt(values[headers.indexOf('intervalo_dias')] || values[2]) || 7,
                phone: values[headers.indexOf('telefone')] || values[3] || '',
                email: values[headers.indexOf('email')] || values[4] || ''
            };
            patients.push(patient);
        }
    }
    
    return patients;
}

// ================================================
// PATIENT ACTIONS
// ================================================
function editPatient(patientId) {
    const patient = state.patients.find(p => p.id === patientId);
    if (!patient) return;
    
    document.getElementById('patient-name').value = patient.name;
    document.getElementById('patient-dose').value = patient.dose;
    document.getElementById('patient-interval').value = patient.interval;
    document.getElementById('patient-phone').value = patient.phone || '';
    document.getElementById('patient-email').value = patient.email || '';
    
    // Change form to edit mode
    const form = document.getElementById('patient-form');
    form.dataset.editId = patientId;
    
    openModal('patient-modal');
    document.querySelector('#patient-modal .modal-header h2').textContent = 'Editar Paciente';
}

function togglePatientStatus(patientId) {
    const index = state.patients.findIndex(p => p.id === patientId);
    if (index !== -1) {
        state.patients[index].status = 
            state.patients[index].status === 'active' ? 'inactive' : 'active';
        saveToLocalStorage();
        updateDashboard();
        showToast('Status atualizado!', 'success');
    }
}

// ================================================
// MODAL MANAGEMENT
// ================================================
function openModal(modalId) {
    document.getElementById(modalId)?.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        
        // Reset edit mode for patient form
        if (modalId === 'patient-modal') {
            const form = document.getElementById('patient-form');
            delete form.dataset.editId;
            document.querySelector('#patient-modal .modal-header h2').textContent = 'Adicionar Paciente';
        }
    }
}

// ================================================
// UTILITIES
// ================================================
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatDate(dateStr) {
    if (!dateStr) return '--';
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
}

function formatDateTime(dateStr) {
    if (!dateStr) return '--';
    const date = new Date(dateStr);
    return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    
    toast.className = `toast ${type}`;
    toastMessage.textContent = message;
    
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

function saveToLocalStorage() {
    if (!state.useLocalStorage) return;
    
    const data = {
        patients: state.patients,
        applications: state.applications,
        suppliers: state.suppliers,
        stockHistory: state.stockHistory,
        currentStock: state.currentStock,
        maxStock: state.maxStock,
        warningLevel: state.warningLevel,
        criticalLevel: state.criticalLevel,
        users: state.users,
        products: state.products,
        lots: state.lots
    };
    
    localStorage.setItem('tirzepatidaData', JSON.stringify(data));
}

function exportApplications() {
    const headers = ['Data', 'Paciente', 'Dose (mg)', 'Próxima Aplicação', 'Aplicador'];
    const rows = state.applications.map(app => [
        formatDateTime(app.date),
        app.patientName,
        app.dose,
        formatDate(app.nextDate),
        app.appliedBy || ''
    ]);
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadCSV(csv, 'aplicacoes_tirzepatida.csv');
}

function downloadCSV(content, filename) {
    const blob = new Blob(['\ufeff' + content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

// Make functions available globally
window.openModal = openModal;
window.closeModal = closeModal;
window.closeAlert = closeAlert;
window.editPatient = editPatient;
window.togglePatientStatus = togglePatientStatus;
window.exportApplications = exportApplications;
window.copyRawData = copyRawData;
window.exportRawCSV = exportRawCSV;

// ================================================
// RAW EDITOR FUNCTIONS
// ================================================

// Override openModal to update raw editor when opened
const originalOpenModal = openModal;
function openModal(modalId) {
    document.getElementById(modalId)?.classList.add('active');
    
    // If opening raw editor, populate it
    if (modalId === 'raw-editor-modal') {
        updateRawEditor();
    }
}
window.openModal = openModal;

function updateRawEditor() {
    const content = document.getElementById('raw-editor-content');
    const totalPatientsEl = document.getElementById('raw-total-patients');
    const activePatientsEl = document.getElementById('raw-active-patients');
    const totalConsumptionEl = document.getElementById('raw-total-consumption');
    
    if (!content) return;
    
    // Calculate stats
    const activePatients = state.patients.filter(p => p.status === 'active');
    const weeklyConsumption = activePatients.reduce((sum, p) => {
        const dosesPerWeek = 7 / p.interval;
        return sum + (p.dose * dosesPerWeek);
    }, 0);
    
    // Update stats bar
    if (totalPatientsEl) totalPatientsEl.textContent = `${state.patients.length} pacientes`;
    if (activePatientsEl) activePatientsEl.textContent = `${activePatients.length} ativos`;
    if (totalConsumptionEl) totalConsumptionEl.textContent = `${weeklyConsumption.toFixed(1)} mg/semana`;
    
    // Sort patients: active first, then by name
    const sortedPatients = [...state.patients].sort((a, b) => {
        if (a.status === 'active' && b.status !== 'active') return -1;
        if (a.status !== 'active' && b.status === 'active') return 1;
        return a.name.localeCompare(b.name);
    });
    
    // Generate raw rows
    content.innerHTML = sortedPatients.map(patient => {
        const delay = calculateDelay(patient);
        const delayClass = getDelayClass(delay);
        const rowClass = patient.status === 'active' 
            ? (delay > 0 ? 'delayed' : 'active')
            : 'inactive';
        
        return `
            <div class="raw-row ${rowClass}">
                <span class="raw-cell name" style="width: 25%">${patient.name}</span>
                <span class="raw-cell dose" style="width: 10%">${parseFloat(patient.dose).toFixed(1)}mg</span>
                <span class="raw-cell interval" style="width: 10%">${patient.interval}d</span>
                <span class="raw-cell next-date" style="width: 15%">${formatRawDate(patient.nextApplication)}</span>
                <span class="raw-cell delay ${delayClass}" style="width: 12%">${formatDelay(delay)}</span>
                <span class="raw-cell status ${patient.status === 'active' ? 'active-status' : 'inactive-status'}" style="width: 10%">${patient.status === 'active' ? 'ATIVO' : 'INATIVO'}</span>
                <span class="raw-cell contact" style="width: 18%">${patient.phone || patient.email || '--'}</span>
            </div>
        `;
    }).join('');
}

function calculateDelay(patient) {
    if (!patient.nextApplication || patient.status !== 'active') return null;
    
    const nextDate = new Date(patient.nextApplication);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    nextDate.setHours(0, 0, 0, 0);
    
    const diffTime = today - nextDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays; // Positive = delayed, negative = days until next
}

function getDelayClass(delay) {
    if (delay === null) return '';
    if (delay > 7) return 'danger';
    if (delay > 0) return 'warning';
    return 'on-time';
}

function formatDelay(delay) {
    if (delay === null) return '--';
    if (delay > 0) return `+${delay}d ATRASO`;
    if (delay === 0) return 'HOJE';
    return `${Math.abs(delay)}d`;
}

function formatRawDate(dateStr) {
    if (!dateStr) return '--';
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit'
    });
}

function copyRawData() {
    const lines = state.patients.map(patient => {
        const delay = calculateDelay(patient);
        const delayStr = formatDelay(delay);
        const status = patient.status === 'active' ? 'ATIVO' : 'INATIVO';
        
        return `${patient.name} | ${patient.dose}mg | ${patient.interval}d | ${formatRawDate(patient.nextApplication)} | ${delayStr} | ${status}`;
    });
    
    const header = 'PACIENTE | DOSE | INTERVALO | PRÓXIMA | ATRASO | STATUS';
    const separator = '─'.repeat(70);
    const text = [header, separator, ...lines].join('\n');
    
    navigator.clipboard.writeText(text).then(() => {
        showToast('Dados copiados para a área de transferência!', 'success');
    }).catch(() => {
        showToast('Erro ao copiar dados', 'error');
    });
}

function exportRawCSV() {
    const headers = ['Nome', 'Dose (mg)', 'Intervalo (dias)', 'Próxima Aplicação', 'Dias Atraso', 'Status', 'Telefone', 'Email'];
    
    const rows = state.patients.map(patient => {
        const delay = calculateDelay(patient);
        return [
            patient.name,
            patient.dose,
            patient.interval,
            patient.nextApplication ? new Date(patient.nextApplication).toLocaleDateString('pt-BR') : '',
            delay !== null ? delay : '',
            patient.status === 'active' ? 'Ativo' : 'Inativo',
            patient.phone || '',
            patient.email || ''
        ];
    });
    
    const csv = [headers.join(','), ...rows.map(r => r.map(cell => `"${cell}"`).join(','))].join('\n');
    downloadCSV(csv, 'pacientes_tirzepatida.csv');
    showToast('CSV exportado com sucesso!', 'success');
}

// ================================================
// ADMIN PANEL FUNCTIONS
// ================================================

// Check if user has permission
function hasPermission(permission) {
    const userRole = state.user?.role || 'admin'; // Default to admin for demo
    return PERMISSIONS[userRole]?.[permission] ?? false;
}

// Apply permissions to UI
function applyPermissions() {
    const userRole = state.user?.role || 'admin';
    const permissions = PERMISSIONS[userRole];
    
    // Update role badge
    const roleBadge = document.getElementById('user-role-badge');
    if (roleBadge) {
        roleBadge.textContent = ROLE_LABELS[userRole] || userRole;
        roleBadge.className = `role-badge ${userRole}`;
    }
    
    // Show/hide admin button
    const adminBtn = document.getElementById('admin-btn');
    if (adminBtn) {
        adminBtn.style.display = permissions.manageUsers ? '' : 'none';
    }
    
    // You can add more UI control here based on permissions
    // For example, hiding buttons that the user can't use
}

// Switch admin tabs
function switchAdminTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.closest('.admin-tab')?.classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.admin-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`admin-tab-${tabName}`)?.classList.add('active');
    
    // Load data for the tab
    if (tabName === 'users') {
        updateUsersList();
    } else if (tabName === 'settings') {
        loadSettingsValues();
    }
}

// Show add user form
function showAddUserForm() {
    document.getElementById('add-user-form')?.classList.remove('hidden');
    document.getElementById('user-form')?.reset();
    document.getElementById('permission-preview')?.classList.add('hidden');
}

// Hide add user form
function hideAddUserForm() {
    document.getElementById('add-user-form')?.classList.add('hidden');
}

// Update permission preview when role is selected
function updatePermissionPreview() {
    const role = document.getElementById('user-role')?.value;
    const preview = document.getElementById('permission-preview');
    const list = document.getElementById('permission-list');
    
    if (!role || !preview || !list) {
        preview?.classList.add('hidden');
        return;
    }
    
    preview.classList.remove('hidden');
    const permissions = PERMISSIONS[role];
    
    list.innerHTML = Object.entries(permissions).map(([key, allowed]) => `
        <span class="permission-item ${allowed ? 'allowed' : 'denied'}">
            ${allowed ? '✓' : '✗'} ${PERMISSION_LABELS[key] || key}
        </span>
    `).join('');
}

// Handle user form submission
function handleUserSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('user-name').value;
    const email = document.getElementById('user-email-input').value;
    const role = document.getElementById('user-role').value;
    const password = document.getElementById('user-password').value;
    
    // Check if email already exists
    if (state.users.some(u => u.email === email)) {
        showToast('Este email já está cadastrado', 'error');
        return;
    }
    
    const newUser = {
        id: generateId(),
        name,
        email,
        role,
        password, // In production, this would be hashed!
        createdAt: new Date().toISOString(),
        status: 'active'
    };
    
    state.users.push(newUser);
    saveToLocalStorage();
    
    hideAddUserForm();
    updateUsersList();
    showToast(`Usuário ${name} criado com sucesso!`, 'success');
}

// Update users list
function updateUsersList() {
    const container = document.getElementById('users-list');
    if (!container) return;
    
    // Add default admin if no users exist
    if (state.users.length === 0) {
        state.users = [{
            id: 'admin-default',
            name: 'Dr. Paulo Guimarães Jr',
            email: 'dr.paulo@clinica.com',
            role: 'admin',
            status: 'active',
            createdAt: new Date().toISOString()
        }];
        saveToLocalStorage();
    }
    
    container.innerHTML = state.users.map(user => {
        const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        const isCurrentUser = state.user?.email === user.email;
        
        return `
            <div class="user-card ${user.status === 'inactive' ? 'inactive' : ''}">
                <div class="user-card-info">
                    <div class="user-avatar" style="background: ${getRoleColor(user.role)}">${initials}</div>
                    <div class="user-details">
                        <span class="user-name">${user.name} ${isCurrentUser ? '(você)' : ''}</span>
                        <span class="user-email-display">${user.email}</span>
                    </div>
                    <span class="role-badge ${user.role}">${ROLE_LABELS[user.role] || user.role}</span>
                </div>
                <div class="user-card-actions">
                    ${!isCurrentUser ? `
                        <button class="btn btn-ghost btn-small" onclick="toggleUserStatus('${user.id}')" title="${user.status === 'active' ? 'Desativar' : 'Ativar'}">
                            ${user.status === 'active' ? '🔒' : '🔓'}
                        </button>
                        <button class="btn btn-ghost btn-small" onclick="deleteUser('${user.id}')" title="Remover">
                            🗑️
                        </button>
                    ` : '<span class="text-muted" style="font-size: 0.75rem">Conta atual</span>'}
                </div>
            </div>
        `;
    }).join('');
}

// Get role gradient color
function getRoleColor(role) {
    const colors = {
        admin: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
        gestora: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
        enfermeira: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
        tecnica: 'linear-gradient(135deg, #64748b 0%, #94a3b8 100%)'
    };
    return colors[role] || colors.tecnica;
}

// Toggle user status
function toggleUserStatus(userId) {
    const user = state.users.find(u => u.id === userId);
    if (user) {
        user.status = user.status === 'active' ? 'inactive' : 'active';
        saveToLocalStorage();
        updateUsersList();
        showToast(`Usuário ${user.status === 'active' ? 'ativado' : 'desativado'}`, 'success');
    }
}

// Delete user
function deleteUser(userId) {
    if (!confirm('Tem certeza que deseja remover este usuário?')) return;
    
    const userIndex = state.users.findIndex(u => u.id === userId);
    if (userIndex > -1) {
        const userName = state.users[userIndex].name;
        state.users.splice(userIndex, 1);
        saveToLocalStorage();
        updateUsersList();
        showToast(`Usuário ${userName} removido`, 'success');
    }
}

// Load settings values
function loadSettingsValues() {
    document.getElementById('settings-max-stock').value = state.maxStock;
    document.getElementById('settings-warning-level').value = state.warningLevel;
    document.getElementById('settings-critical-level').value = state.criticalLevel;
}

// Save stock settings
function saveStockSettings() {
    state.maxStock = parseInt(document.getElementById('settings-max-stock').value) || 500;
    state.warningLevel = parseInt(document.getElementById('settings-warning-level').value) || 100;
    state.criticalLevel = parseInt(document.getElementById('settings-critical-level').value) || 50;
    
    saveToLocalStorage();
    updateDashboard();
    showToast('Configurações salvas!', 'success');
}

// Export all data
function exportAllData() {
    const allData = {
        exportDate: new Date().toISOString(),
        patients: state.patients,
        applications: state.applications,
        suppliers: state.suppliers,
        stockHistory: state.stockHistory,
        users: state.users.map(u => ({ ...u, password: undefined })), // Don't export passwords
        settings: {
            currentStock: state.currentStock,
            maxStock: state.maxStock,
            warningLevel: state.warningLevel,
            criticalLevel: state.criticalLevel
        }
    };
    
    const json = JSON.stringify(allData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `tirzepatida_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showToast('Backup exportado com sucesso!', 'success');
}

// Confirm reset data
function confirmResetData() {
    if (!confirm('⚠️ ATENÇÃO: Isso irá apagar TODOS os dados do sistema!\n\nTem certeza que deseja continuar?')) return;
    if (!confirm('Esta ação NÃO pode ser desfeita!\n\nClique OK para confirmar o reset total.')) return;
    
    localStorage.removeItem('tirzepatidaData');
    location.reload();
}

// Override openModal to handle admin modal
const baseOpenModal = openModal;
function openModal(modalId) {
    document.getElementById(modalId)?.classList.add('active');
    
    if (modalId === 'raw-editor-modal') {
        updateRawEditor();
    } else if (modalId === 'admin-modal') {
        updateUsersList();
        loadSettingsValues();
    }
}
window.openModal = openModal;

// Add new global functions
window.switchAdminTab = switchAdminTab;
window.showAddUserForm = showAddUserForm;
window.hideAddUserForm = hideAddUserForm;
window.updatePermissionPreview = updatePermissionPreview;
window.handleUserSubmit = handleUserSubmit;
window.toggleUserStatus = toggleUserStatus;
window.deleteUser = deleteUser;
window.saveStockSettings = saveStockSettings;
window.exportAllData = exportAllData;
window.confirmResetData = confirmResetData;

