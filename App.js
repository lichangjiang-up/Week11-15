import React, {useEffect, useState} from 'react';
import {View, Text, Button, ActivityIndicator, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AuthScreen from './components/auth/authScreen';
import HomeScreen from './screens/homeScreen';
import {initDatabase} from './components/database/database';

const Stack = createStackNavigator();

const App = () => {
    const [dbInitialized, setDbInitialized] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initializeApp = async () => {
            try {
                // First try to initialize database
                await initDatabase();
                setDbInitialized(true);
            } catch (err) {
                console.error('Initialization error:', err);
                setError(err);
            }
        };

        initializeApp();
    }, []);

    if (error) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text>Database initialization failed</Text>
                <Text>{error.message}</Text>
                <Button
                    title="Retry"
                    onPress={() => {
                        setError(null);
                        setDbInitialized(false);
                    }}
                />
            </View>
        );
    }

    if (!dbInitialized) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size="large"/>
                <Text>Initializing database...</Text>
            </View>
        );
    }

    return (
        <NavigationContainer>
            <StatusBar
                backgroundColor="#EEEEEE"
                translucent
                barStyle="dark-content"
            />
            <Stack.Navigator>
                <Stack.Screen name="Auth" component={AuthScreen}/>
                <Stack.Screen name="Home" component={HomeScreen}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;