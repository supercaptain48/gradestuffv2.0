import { AuthContext } from '@/utils/authContext';
import { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, StatusBar } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';

const InputWithLabel = ({ label, ...props }) => {
    return (
        <View className='mb-4'>
            <Text className='text-lg font-bold'>{label}</Text>
            <TextInput {...props} className='border-2 rounded-md p-2' />
        </View>
    )
}

export default function LoginScreen() {
    const authContext = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    NavigationBar.setBackgroundColorAsync('#f0f0f0');

    return (
        <View className='flex-1 justify-center items-center'>
            <StatusBar backgroundColor={'#f0f0f0'} barStyle='dark-content' />
            <View className='bg-white p-8 rounded-2xl shadow-lg'>
                <Text className='text-7xl font-bold text-center my-10 text-blue-600'>gradestuff</Text>
                {authContext.wrongCredentials && <Text className='text-red-600'>Username or password incorrect</Text>}
                <InputWithLabel label='Username' placeholder='Username' onChangeText={setUsername} />
                <InputWithLabel label='Password' placeholder='Password' onChangeText={setPassword} secureTextEntry={true} autoCapitalize='none' />
                <TouchableOpacity 
                    onPress={() => authContext.logIn(username, password)} 
                    className='bg-blue-600 w-24 h-14 rounded-lg mt-4 mx-auto justify-center'
                    activeOpacity={0.7}>
                    {authContext.isLoading ? <ActivityIndicator size="large" color="white" /> : 
                        <Text className='text-2xl font-bold text-center text-white'>Login</Text>}
                </TouchableOpacity>
            </View>
        </View>
    )
}