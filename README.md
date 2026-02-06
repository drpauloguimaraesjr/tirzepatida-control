# 💉 Tirzepatida Control

Sistema de Gestão de Estoque de Tirzepatida para clínicas médicas.

## ✨ Funcionalidades

### Dashboard

- 📊 **Gauge de estoque** com indicação visual (verde/amarelo/vermelho)
- 📈 **Gráfico de projeção** mostrando quando o estoque vai acabar
- 📉 **Gráfico de consumo** diário/semanal/mensal
- ⚠️ **Alertas automáticos** quando estoque baixo

### Gestão de Pacientes

- 📋 Cadastro individual ou via **importação CSV**
- 🔄 Status ativo/inativo
- 💊 Dose e intervalo personalizados por paciente

### Registro de Aplicações

- ✅ Registro rápido com auto-preenchimento
- 📅 Cálculo automático da próxima aplicação
- 📊 Desconto automático do estoque

### Fornecedores

- 🚚 Cadastro com tempo de entrega
- 💰 Preço por mg
- 🔔 **Recomendação automática** de quando fazer pedido

## 🚀 Como Usar

### Modo Demo (Sem Firebase)

1. Abra o arquivo `index.html` no navegador
2. O sistema carrega com dados de demonstração
3. Os dados são salvos no localStorage do navegador

### Com Firebase (Produção)

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com)
2. Ative **Authentication** (Email/Password)
3. Ative **Firestore Database**
4. Copie as credenciais para `firebase-config.js`
5. Remova os comentários no arquivo para ativar

## 📁 Estrutura de Arquivos

```
tirzepatida-control/
├── index.html          # Página principal
├── styles.css          # Estilos (dark theme premium)
├── app.js              # Lógica da aplicação
├── firebase-config.js  # Configuração do Firebase
├── pacientes_exemplo.csv  # CSV de exemplo para importação
└── README.md           # Este arquivo
```

## 📝 Formato do CSV para Importação

```csv
nome,dose_mg,intervalo_dias,telefone,email
Maria Silva,2.5,7,11999999999,maria@email.com
```

### Colunas obrigatórias:

- `nome` - Nome completo do paciente
- `dose_mg` - Dose em miligramas (1.0, 1.5, 2.0, 2.5, 3.5, 5.0, 7.5, 10.0)
- `intervalo_dias` - Intervalo entre aplicações (7, 10, 14)

### Colunas opcionais:

- `telefone` - Número de telefone
- `email` - Email do paciente

## 🔜 Deploy

### Frontend (Vercel)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
cd tirzepatida-control
vercel
```

### Backend (Railway) - Futuro

Para integração com API própria ou sistema de prontuário.

## 📊 Algoritmo de Previsão

O sistema calcula:

```
Consumo Médio Diário = Soma das doses (30 dias) / 30

Dias Restantes = Estoque Atual / Consumo Médio Diário

Data Limite Pedido = Hoje + Dias Restantes - Tempo Entrega - Margem Segurança
```

## 🔒 Segurança

- Autenticação via Firebase Auth
- Dados isolados por usuário
- Sem dados sensíveis de pacientes expostos

## 📄 Licença

Uso interno - Clínica Dr. Paulo Guimarães Jr.

---

Desenvolvido com ❤️ usando HTML, CSS, JavaScript e Chart.js
