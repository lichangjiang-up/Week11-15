import * as SQLite from 'expo-sqlite';

// Database instance with initialization flag
let db;
let isInitialized = false;

// Initialize the database
const initDatabase = async () => {
    try {
        if (isInitialized) return db;

        // Open database connection
        db = await SQLite.openDatabaseAsync('FoodJournal.db');
        console.log('Database instance:', db);

        // Create tables
        await db.execAsync('PRAGMA journal_mode = WAL');

        await db.withTransactionAsync(async () => {
            await db.execAsync(
                `CREATE TABLE IF NOT EXISTS users (
                          id INTEGER PRIMARY KEY AUTOINCREMENT, 
                          email TEXT UNIQUE, 
                          password TEXT);`
            );

            await db.execAsync(
                `CREATE TABLE IF NOT EXISTS journals (
                          id INTEGER PRIMARY KEY AUTOINCREMENT, 
                          userId INTEGER, 
                          image TEXT, 
                          description TEXT, 
                          date TEXT, 
                          category TEXT, 
                          FOREIGN KEY(userId) REFERENCES users(id)
                        );`
            );
        });

        isInitialized = true;
        console.log('Database initialized successfully');
        return db;
    } catch (error) {
        console.error('Database initialization error:', error);
        throw error;
    }
};

// Execute SQL queries with automatic initialization
const executeSql = async (query, params = [], isFirst = false) => {
    try {
        if (!isInitialized) {
            await initDatabase();
        }
        if (isFirst) {
            return await db.getFirstAsync(query, params);
        }
        if (query.trim().startsWith('SELECT')) {
            return await db.getAllAsync(query, params);
        }
        return await db.runAsync(query, params);
    } catch (error) {
        console.log('SQL execution error:', error);
        throw error;
    }
};

export {initDatabase, executeSql};