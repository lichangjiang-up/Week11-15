import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'FoodJournal.db', location: 'default' },
  () => console.log('Database connected'),
  (error) => console.log('Database error', error)
);

const initDatabase = () => {
  db.transaction((tx) => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, password TEXT);',
      [],
      () => console.log('Users table created'),
      (error) => console.log('Error creating users table', error)
    );

    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS journals (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER, image TEXT, description TEXT, date TEXT, category TEXT);',
      [],
      () => console.log('Journals table created'),
      (error) => console.log('Error creating journals table', error)
    );
  });
};

export { db, initDatabase };