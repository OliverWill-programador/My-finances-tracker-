// Variáveis Globais
let currentDate = new Date();
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let cardTransactions = JSON.parse(localStorage.getItem('cardTransactions')) || [];
let investments = JSON.parse(localStorage.getItem('investments')) || [];
let goals = JSON.parse(localStorage.getItem('goals')) || [];

// Formatação
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('pt-BR');
}

function formatDateFull(date) {
    return new Date(date).toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Navegação entre períodos
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

function previousYear() {
    currentDate.setFullYear(currentDate.getFullYear() - 1);
    updateYearlyView();
}

function nextYear() {
    currentDate.setFullYear(currentDate.getFullYear() + 1);
    updateYearlyView();
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

function getYearlyTransactions(date) {
    return transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getFullYear() === date.getFullYear();
    });
}

// Atualização das Visões
function updateDailyView() {
    const dailyTransactions = getDailyTransactions(currentDate);
    
    // Atualiza data atual
    document.getElementById('currentDate').textContent = formatDateFull(currentDate);
    
    // Calcula totais
    const income = dailyTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = dailyTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = income - expenses;

    // Atualiza cards
    document.getElementById('dailyIncome').textContent = formatCurrency(income);
    document.getElementById('dailyExpenses').textContent = formatCurrency(expenses);
    document.getElementById('dailyBalance').textContent = formatCurrency(balance);

    // Atualiza tabela de transações
    const tableBody = document.getElementById('dailyTransactionsTable');
    tableBody.innerHTML = dailyTransactions
        .map(t => `
            <tr>
                <td>${new Date(t.date).toLocaleTimeString('pt-BR')}</td>
                <td>${t.description}</td>
                <td>${t.category || '-'}</td>
                <td class="${t.type === 'income' ? 'income' : 'expenses'}">
                    ${formatCurrency(t.amount)}
                </td>
            </tr>
        `).join('');
}

function updateMonthlyView() {
    const monthlyTransactions = getMonthlyTransactions(currentDate);
    
    // Atualiza mês atual
    document.getElementById('currentMonth').textContent = currentDate.toLocaleDateString('pt-BR', {
        month: 'long',
        year: 'numeric'
    });

    // Calcula totais
    const income = monthlyTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = monthlyTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = income - expenses;

    // Atualiza cards
    document.getElementById('monthlyIncome').textContent = formatCurrency(income);
    document.getElementById('monthlyExpenses').textContent = formatCurrency(expenses);
    document.getElementById('monthlyTotal').textContent = formatCurrency(balance);

    // Atualiza gráficos mensais
    updateMonthlyCharts(monthlyTransactions);
}

function updateYearlyView() {
    const yearlyTransactions = getYearlyTransactions(currentDate);
    
    // Atualiza ano atual
    document.getElementById('currentYear').textContent = currentDate.getFullYear();

    // Calcula totais anuais
    const yearlyTotals = Array(12).fill(0).map((_, month) => {
        const monthTransactions = yearlyTransactions.filter(t => {
            const tDate = new Date(t.date);
            return tDate.getMonth() === month;
        });

        const income = monthTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const expenses = monthTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        return income - expenses;
    });

    // Calcula média mensal
    const average = yearlyTotals.reduce((sum, val) => sum + val, 0) / 12;

    // Atualiza cards
    document.getElementById('yearlyTotal').textContent = formatCurrency(
        yearlyTotals.reduce((sum, val) => sum + val, 0)
    );
    document.getElementById('monthlyAverage').textContent = formatCurrency(average);

    // Atualiza gráficos anuais
    updateYearlyCharts(yearlyTotals);
}

// Variáveis Globais
let currentDate = new Date();
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let cardTransactions = JSON.parse(localStorage.getItem('cardTransactions')) || [];
let investments = JSON.parse(localStorage.getItem('investments')) || [];
let goals = JSON.parse(localStorage.getItem('goals')) || [];

// Formatação
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('pt-BR');
}

function formatDateFull(date) {
    return new Date(date).toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Navegação entre períodos
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

function previousYear() {
    currentDate.setFullYear(currentDate.getFullYear() - 1);
    updateYearlyView();
}

function nextYear() {
    currentDate.setFullYear(currentDate.getFullYear() + 1);
    updateYearlyView();
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

function getYearlyTransactions(date) {
    return transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getFullYear() === date.getFullYear();
    });
}

// Atualização das Visões
function updateDailyView() {
    const dailyTransactions = getDailyTransactions(currentDate);
    
    // Atualiza data atual
    document.getElementById('currentDate').textContent = formatDateFull(currentDate);
    
    // Calcula totais
    const income = dailyTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = dailyTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = income - expenses;

    // Atualiza cards
    document.getElementById('dailyIncome').textContent = formatCurrency(income);
    document.getElementById('dailyExpenses').textContent = formatCurrency(expenses);
    document.getElementById('dailyBalance').textContent = formatCurrency(balance);

    // Atualiza tabela de transações
    const tableBody = document.getElementById('dailyTransactionsTable');
    tableBody.innerHTML = dailyTransactions
        .map(t => `
            <tr>
                <td>${new Date(t.date).toLocaleTimeString('pt-BR')}</td>
                <td>${t.description}</td>
                <td>${t.category || '-'}</td>
                <td class="${t.type === 'income' ? 'income' : 'expenses'}">
                    ${formatCurrency(t.amount)}
                </td>
            </tr>
        `).join('');
}

function updateMonthlyView() {
    const monthlyTransactions = getMonthlyTransactions(currentDate);
    
    // Atualiza mês atual
    document.getElementById('currentMonth').textContent = currentDate.toLocaleDateString('pt-BR', {
        month: 'long',
        year: 'numeric'
    });

    // Calcula totais
    const income = monthlyTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = monthlyTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = income - expenses;

    // Atualiza cards
    document.getElementById('monthlyIncome').textContent = formatCurrency(income);
    document.getElementById('monthlyExpenses').textContent = formatCurrency(expenses);
    document.getElementById('monthlyTotal').textContent = formatCurrency(balance);

    // Atualiza gráficos mensais
    updateMonthlyCharts(monthlyTransactions);
}

function updateYearlyView() {
    const yearlyTransactions = getYearlyTransactions(currentDate);
    
    // Atualiza ano atual
    document.getElementById('currentYear').textContent = currentDate.getFullYear();

    // Calcula totais anuais
    const yearlyTotals = Array(12).fill(0).map((_, month) => {
        const monthTransactions = yearlyTransactions.filter(t => {
            const tDate = new Date(t.date);
            return tDate.getMonth() === month;
        });

        const income = monthTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const expenses = monthTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        return income - expenses;
    });

    // Calcula média mensal
    const average = yearlyTotals.reduce((sum, val) => sum + val, 0) / 12;

    // Atualiza cards
    document.getElementById('yearlyTotal').textContent = formatCurrency(
        yearlyTotals.reduce((sum, val) => sum + val, 0)
    );
    document.getElementById('monthlyAverage').textContent = formatCurrency(average);

    // Atualiza gráficos anuais
    updateYearlyCharts(yearlyTotals);
}

