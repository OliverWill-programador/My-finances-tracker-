// Variáveis Globais
let currentDate = new Date();
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let connectedBanks = JSON.parse(localStorage.getItem('connectedBanks')) || [];
let bankAccounts = JSON.parse(localStorage.getItem('bankAccounts')) || {};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeDashboardViews();
    setupCharts();
    loadConnectedBanks();
    updateAllViews();
});

// Navegação Principal
function initializeNavigation() {
    const menuItems = document.querySelectorAll('.sidebar li');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            menuItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            const pageId = this.getAttribute('data-page');
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });
            
            document.getElementById(pageId)?.classList.add('active');
        });
    });
}

// Navegação do Dashboard
function initializeDashboardViews() {
    const viewButtons = document.querySelectorAll('.view-button');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            viewButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const viewId = this.getAttribute('data-view');
            document.querySelectorAll('.dashboard-view').forEach(view => {
                view.classList.remove('active');
            });
            document.getElementById(viewId)?.classList.add('active');
        });
    });
}

// Funções do Modal de Transação
function openTransactionModal(type = 'general') {
    const modal = document.getElementById('transactionModal');
    modal.style.display = 'flex';
    if (type === 'income') {
        document.getElementById('type').value = 'income';
    } else if (type === 'expense') {
        document.getElementById('type').value = 'expense';
    }
}

function closeTransactionModal() {
    const modal = document.getElementById('transactionModal');
    modal.style.display = 'none';
    document.getElementById('transactionForm').reset();
}

// Funções dos Botões de Ação
function addIncome() {
    openTransactionModal('income');
}

function addExpense() {
    openTransactionModal('expense');
}

function addInvestment() {
    alert('Funcionalidade de investimento em desenvolvimento');
}

function showBalanceDetails() {
    alert('Detalhes do saldo em desenvolvimento');
}

function showIncomeDetails() {
    alert('Detalhes de receitas em desenvolvimento');
}

function showExpenseDetails() {
    alert('Detalhes de despesas em desenvolvimento');
}

function showInvestmentDetails() {
    alert('Detalhes de investimentos em desenvolvimento');
}

// Funções de Navegação Temporal
function previousDay() {
    currentDate.setDate(currentDate.getDate() - 1);
    updateDailyView();
}

function nextDay() {
    currentDate.setDate(currentDate.getDate() + 1);
    updateDailyView();
}

function previousMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateMonthlyView();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateMonthlyView();
}

// Funções de Atualização de View
function updateAllViews() {
    updateOverview();
    updateDailyView();
    updateMonthlyView();
}

function updateOverview() {
    const income = calculateTotal('income');
    const expenses = calculateTotal('expense');
    const balance = income - expenses;

    document.querySelector('#overview .balance').textContent = formatCurrency(balance);
    document.querySelector('#overview .income').textContent = formatCurrency(income);
    document.querySelector('#overview .expenses').textContent = formatCurrency(expenses);
    
    updateCharts();
}

function updateDailyView() {
    const dateStr = formatDateFull(currentDate);
    document.getElementById('currentDate').textContent = dateStr;

    const dailyTransactions = getDailyTransactions(currentDate);
    const income = calculateTotal('income', dailyTransactions);
    const expenses = calculateTotal('expense', dailyTransactions);
    const balance = income - expenses;

    document.getElementById('dailyIncome').textContent = formatCurrency(income);
    document.getElementById('dailyExpenses').textContent = formatCurrency(expenses);
    document.getElementById('dailyBalance').textContent = formatCurrency(balance);

    updateDailyTransactionsTable(dailyTransactions);
}

function updateMonthlyView() {
    const monthStr = formatMonth(currentDate);
    document.getElementById('currentMonth').textContent = monthStr;

    const monthlyTransactions = getMonthlyTransactions(currentDate);
    const income = calculateTotal('income', monthlyTransactions);
    const expenses = calculateTotal('expense', monthlyTransactions);
    const balance = income - expenses;

    document.getElementById('monthlyIncome').textContent = formatCurrency(income);
    document.getElementById('monthlyExpenses').textContent = formatCurrency(expenses);
    document.getElementById('monthlyTotal').textContent = formatCurrency(balance);

    updateMonthlyCharts(monthlyTransactions);
}

// Funções de Cálculo
function calculateTotal(type, transactionList = transactions) {
    return transactionList
        .filter(t => t.type === type)
        .reduce((sum, t) => sum + t.amount, 0);
}

// Funções de Filtro
function getDailyTransactions(date) {
    return transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.toDateString() === date.toDateString();
    });
}

function getMonthlyTransactions(date) {
    return transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === date.getMonth() && 
               tDate.getFullYear() === date.getFullYear();
    });
}

// Funções de Formatação
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function formatDateFull(date) {
    return date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatMonth(date) {
    return date.toLocaleDateString('pt-BR', {
        month: 'long',
        year: 'numeric'
    });
}

// Funções de Integração Bancária
function connectNewBank() {
    document.getElementById('bankConnectionModal').style.display = 'flex';
}

function closeBankModal() {
    document.getElementById('bankConnectionModal').style.display = 'none';
}

function startBankConnection(bankId) {
    // Simulação de conexão com banco
    showLoadingIndicator();
    setTimeout(() => {
        const newBank = {
            id: bankId,
            name: getBankName(bankId),
            connected: true,
            lastSync: new Date().toISOString()
        };

        connectedBanks.push(newBank);
        bankAccounts[bankId] = {
            balance: Math.random() * 10000,
            transactions: []
        };

        localStorage.setItem('connectedBanks', JSON.stringify(connectedBanks));
        localStorage.setItem('bankAccounts', JSON.stringify(bankAccounts));

        loadConnectedBanks();
        closeBankModal();
        hideLoadingIndicator();
        showSuccessMessage('Banco conectado com sucesso!');
    }, 1500);
}

// Funções de UI
function showLoadingIndicator() {
    // Implementar indicador de loading
    console.log('Loading...');
}

function hideLoadingIndicator() {
    // Implementar remoção do loading
    console.log('Loading complete');
}

function showSuccessMessage(message) {
    alert(message); // Substituir por uma notificação mais elegante
}

// Handlers de Formulário
document.getElementById('transactionForm')?.addEventListener('submit', function(e) {
    e.preventDefault();

    const transaction = {
        description: document.getElementById('description').value,
        amount: parseFloat(document.getElementById('amount').value),
        type: document.getElementById('type').value,
        category: document.getElementById('category').value,
        date: new Date().toISOString()
    };

    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    updateAllViews();
    closeTransactionModal();
    this.reset();
    showSuccessMessage('Transação adicionada com sucesso!');
});

// Event Listeners Globais
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

// Configuração Inicial dos Gráficos
function setupCharts() {
    setupBalanceChart();
    setupExpensesChart();
    setupMonthlyCharts();
}

// Funções dos Gráficos (implementar conforme necessário)
function setupBalanceChart() {
    const ctx = document.getElementById('balanceChart')?.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
            datasets: [{
                label: 'Saldo',
                data: [0, 0, 0, 0, 0, 0],
                borderColor: '#2563eb',
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function setupExpensesChart() {
    const ctx = document.getElementById('expensesChart')?.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Alimentação', 'Transporte', 'Moradia', 'Outros'],
            datasets: [{
                data: [0, 0, 0, 0],
                backgroundColor: ['#059669', '#d97706', '#dc2626', '#2563eb']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function setupMonthlyCharts() {
    // Implementar gráficos mensais
}

function updateCharts() {
    // Implementar atualização dos gráficos
}

// Funções de Exportação de Dados
function exportData() {
    const data = {
        transactions: transactions,
        bankAccounts: bankAccounts,
        date: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financas_${formatDateForFile(new Date())}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function exportDailyReport() {
    const dailyTransactions = getDailyTransactions(currentDate);
    const data = {
        date: formatDateFull(currentDate),
        transactions: dailyTransactions,
        summary: {
            income: calculateTotal('income', dailyTransactions),
            expenses: calculateTotal('expense', dailyTransactions),
            balance: calculateTotal('income', dailyTransactions) - calculateTotal('expense', dailyTransactions)
        }
    };

    downloadReport(data, `relatorio_diario_${formatDateForFile(currentDate)}`);
}

function exportMonthlyReport() {
    const monthlyTransactions = getMonthlyTransactions(currentDate);
    const data = {
        month: formatMonth(currentDate),
        transactions: monthlyTransactions,
        summary: {
            income: calculateTotal('income', monthlyTransactions),
            expenses: calculateTotal('expense', monthlyTransactions),
            balance: calculateTotal('income', monthlyTransactions) - calculateTotal('expense', monthlyTransactions)
        },
        categories: getCategoryTotals(monthlyTransactions)
    };

    downloadReport(data, `relatorio_mensal_${formatDateForFile(currentDate)}`);
}

// Funções de Gerenciamento de Orçamento
function setBudget() {
    const budget = prompt('Digite o valor do orçamento mensal:');
    if (budget && !isNaN(budget)) {
        localStorage.setItem('monthlyBudget', budget);
        updateBudgetIndicators();
        showSuccessMessage('Orçamento definido com sucesso!');
    }
}

function setDailyBudget() {
    const budget = prompt('Digite o valor do orçamento diário:');
    if (budget && !isNaN(budget)) {
        localStorage.setItem('dailyBudget', budget);
        updateBudgetIndicators();
        showSuccessMessage('Orçamento diário definido com sucesso!');
    }
}

function updateBudgetIndicators() {
    const monthlyBudget = localStorage.getItem('monthlyBudget') || 0;
    const dailyBudget = localStorage.getItem('dailyBudget') || 0;
    
    // Atualiza indicadores mensais
    const monthlyExpenses = calculateTotal('expense', getMonthlyTransactions(currentDate));
    const monthlyProgress = (monthlyExpenses / monthlyBudget) * 100;
    updateProgressBar('monthly', monthlyProgress);

    // Atualiza indicadores diários
    const dailyExpenses = calculateTotal('expense', getDailyTransactions(currentDate));
    const dailyProgress = (dailyExpenses / dailyBudget) * 100;
    updateProgressBar('daily', dailyProgress);
}

// Funções de Filtro e Ordenação
function filterTransactions(type = 'all') {
    let filtered = [...transactions];
    
    switch(type) {
        case 'income':
            filtered = filtered.filter(t => t.type === 'income');
            break;
        case 'expense':
            filtered = filtered.filter(t => t.type === 'expense');
            break;
        case 'today':
            filtered = getDailyTransactions(new Date());
            break;
        case 'thisMonth':
            filtered = getMonthlyTransactions(new Date());
            break;
    }

    return filtered;
}

function sortTransactions(field = 'date', order = 'desc') {
    const sorted = [...transactions].sort((a, b) => {
        if (field === 'amount') {
            return order === 'desc' ? b.amount - a.amount : a.amount - b.amount;
        }
        if (field === 'date') {
            return order === 'desc' 
                ? new Date(b.date) - new Date(a.date)
                : new Date(a.date) - new Date(b.date);
        }
        return 0;
    });

    updateTransactionsTable(sorted);
}

// Funções de Atualização da UI
function updateProgressBar(type, percentage) {
    const progressBar = document.querySelector(`#${type} .progress`);
    if (progressBar) {
        progressBar.style.width = `${Math.min(percentage, 100)}%`;
        progressBar.style.backgroundColor = percentage > 100 ? 'var(--danger-color)' : 'var(--primary-color)';
    }
}

function updateTransactionsTable(transactions) {
    const tableBody = document.getElementById('dailyTransactionsTable');
    if (!tableBody) return;

    tableBody.innerHTML = transactions.map(t => `
        <tr>
            <td>${new Date(t.date).toLocaleTimeString('pt-BR')}</td>
            <td>${t.description}</td>
            <td>${t.category}</td>
            <td class="${t.type}">${formatCurrency(t.amount)}</td>
            <td>
                <div class="actions">
                    <i class="fas fa-edit action-icon" onclick="editTransaction('${t.id}')"></i>
                    <i class="fas fa-trash action-icon" onclick="deleteTransaction('${t.id}')"></i>
                </div>
            </td>
        </tr>
    `).join('');
}

// Funções de Manipulação de Transações
function editTransaction(id) {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;

    // Preenche o modal com os dados da transação
    document.getElementById('description').value = transaction.description;
    document.getElementById('amount').value = transaction.amount;
    document.getElementById('type').value = transaction.type;
    document.getElementById('category').value = transaction.category;

    // Abre o modal em modo de edição
    openTransactionModal();
    currentEditingId = id;
}

function deleteTransaction(id) {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
        transactions = transactions.filter(t => t.id !== id);
        localStorage.setItem('transactions', JSON.stringify(transactions));
        updateAllViews();
        showSuccessMessage('Transação excluída com sucesso!');
    }
}

// Funções Auxiliares
function formatDateForFile(date) {
    return date.toISOString().split('T')[0];
}

function downloadReport(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function getCategoryTotals(transactionList) {
    return transactionList.reduce((acc, t) => {
        if (!acc[t.category]) acc[t.category] = 0;
        acc[t.category] += t.amount;
        return acc;
    }, {});
}

// Melhorias na UI
function showNotification(message, type = 'success') {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Adicionar ao DOM
    document.body.appendChild(notification);

    // Remover após 3 segundos
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Adicionar estilos para notificações
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 6px;
        color: white;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    }
    
    .notification.success {
        background-color: var(--success-color);
    }
    
    .notification.error {
        background-color: var(--danger-color);
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
`;
document.head.appendChild(style);