import Dexie from "https://unpkg.com/dexie@3/dist/dexie.mjs";

// --- DATABASE INITIALIZATION ---
const db = new Dexie('financeAppDB');
db.version(1).stores({
    transactions: '++id, type, description, amount, date'
});

// --- DATABASE FUNCTIONS (CRUD) ---

export async function addTransactionToDB(transaction) {
    return await db.transactions.add(transaction);
}

export async function deleteTransactionFromDB(id) {
    return await db.transactions.delete(id);
}

export async function getAllTransactions() {
    return await db.transactions.toArray();
}

export async function getMonthlyData() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const transactions = await db.transactions
        .where('date')
        .between(startOfMonth, endOfMonth, true, true)
        .toArray();

    const monthlyIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const monthlyExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    return { monthlyIncome, monthlyExpenses };
}

