# 1 Fix dependencies

## 1.1 Upgrade all dependencies to match the installed SDK version.

```shell
npm install
npx expo install --fix
npm clean 
npm install
```

## 1.2 Try run android

run command: `npm run android | expo start`

**Debug run time error**
![RNGestureHandlerModule-Err.png](readme/RNGestureHandlerModule-Err.png)

```log
(NOBRIDGE) ERROR  Invariant Violation: TurboModuleRegistry.getEnforcing(...): 'RNGestureHandlerModule' could not be found. Verify that a module by this name is registered in the native binary.
```

**Add react-native-gesture-handler to the dependency**

run command: `npx expo install react-native-gesture-handler`

# 2 Fix Expo-Sqlite

## 2.1 TypeError: Cannot read property 'execAsync' of undefined

![execAsync-of-undefined.png](readme/execAsync-of-undefined.png)
`Database initialization error: [TypeError: Cannot read property 'execAsync' of undefined]`
`Initialization error: [TypeError: Cannot read property 'execAsync' of undefined]`

![create-dir-err.png](readme/create-dir-err.png)
`npx expo install expo-sqlite`

`npx expo prebuild --clean`

**try fix:**`components/database/database.js`

```js
await db.withTransactionAsync(async () => {
    // tx -> db
    await db.execAsync(
        `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT, 
          email TEXT UNIQUE, 
          password TEXT
        );`
    );
    // ......
})
```

## 2.2 TypeError: Cannot read property 'xxx' of undefined

![xxxx-of-undefined.png](readme/xxxx-of-undefined.png)
`Database error: [TypeError: Cannot read property 'rows' of undefined]`

`TypeError: Cannot read property 'insertId' of undefined`

**try fix:**`components/database/database.js`

```js
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
```

`ERROR Database error: [TypeError: Cannot read property 'length' of undefined]
![length-of-undefined.png](readme/length-of-undefined.png)

**try fix:**`components/auth/authScreen.js`

```js
 try {
    if (isLogin) {
        // Login logic
        const result = await executeSql(
            'SELECT id FROM users WHERE email = ? AND password = ?',
            [email, password],
            true,
        );
        if (result) {
            navigation.navigate('Home', {userId: result.id});
        } else {
            Alert.alert('Authentication Failed', 'Invalid email or password');
        }
    } else {
        const insertResult = await executeSql(
            'INSERT INTO users (email, password) VALUES (?, ?)',
            [email, password]
        );
        navigation.navigate('Home', {userId: insertResult.lastInsertRowId});
    }
} catch (error) {
    if (error?.toString()?.includes('UNIQUE constraint failed: users.email')) {
        Alert.alert('Registration Failed', 'Email already exists');
        return;
    }
    console.error('Database error:', error);
    Alert.alert('Error', 'An unexpected error occurred. Please try again.');
} finally {
    setIsLoading(false);
}
```

## 2.3 ERROR  Warning: ReferenceError: Property 'Button' doesn't exist

![button-doesn't-exist.png](readme/button-doesn%27t-exist.png)

```js
import {Button} from 'react-native';
```

# 3 Fix Expo-Camera


## 3.1 ERROR  Warning: React.jsx: type is invalid

`ERROR  Warning: React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: object.`
![typeisinvalid.png](readme/typeisinvalid.png)

[Expo-Camera](https://docs.expo.dev/versions/latest/sdk/camera/)

**Try add in app.json:**

```json
[
  "expo-camera",
  {
    "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera",
    "microphonePermission": "Allow $(PRODUCT_NAME) to access your microphone",
    "recordAudioAndroid": true
  }
]
```

**Try fix** `screens/homeScreen.js`:

```jsx
<CameraView
    style={styles.camera}
    ref={(ref) => setCamera(ref)}
    ratio="16:9"
/>
```

# 4 Interaction optimization

