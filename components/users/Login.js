import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";
import MyStyles from "../../styles/MyStyles";
import React, { useContext } from "react";
import APIs, { authAPI, endpoints } from "../../configs/APIs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MyDispatcherContext } from "../../configs/Contexts";
import { ToastShow, CheckEmptyInput, CheckToastMessage } from "../utils/Utils";
import Toast from "react-native-toast-message";


const Login = ({navigation, route}) => {
    const [user, setUser] = React.useState({});
    const fields = [{
        "label": "Tên đăng nhập",
        "icon": "account",
        "name": "username"
    }, {
        "label": "Mật khẩu",
        "icon": "eye",
        "secureTextEntry": true,
        "name": "password"
    }];
    const [error, setError] = React.useState({"visible": false});
    const [loading, setLoading] = React.useState(false);
    const dispatch = useContext(MyDispatcherContext);

    const login = async () => {
        let temp = CheckEmptyInput(user, fields)
        setError(temp)
        if(temp.visible){
            return;
        }

        try {
            setLoading(true);

            let res = await APIs.post(endpoints['login'], {
                ...user,
                'client_id':`${process.env.REACT_APP_API_KEY}`,
                'client_secret': `${process.env.REACT_APP_API_SECRET}`,
                'grant_type': 'password'
            });
            
            AsyncStorage.setItem('access-token', res.data.access_token);

            setTimeout(async () => {
                let token = await AsyncStorage.getItem('access-token');
                let user = await authAPI(token).get(endpoints['current-user']);

                AsyncStorage.setItem('user', JSON.stringify(user.data));

                dispatch({
                    "type": "login",
                    "payload": user.data
                });

                navigation.navigate('TripPlan', {
                    "toast": {
                        "type": "success",
                        "message": "Đăng nhập thành công!"
                    }
                });
            }, 100);

        } catch (ex) {
            ToastShow("Tài khoản không tồn tại hoặc mật khẩu không đúng!", "error");
            setUser({
                "username": "",
                "password": ""
            })
        } finally {
            setLoading(false);
        }
    }

    const updateState = (field, value) => {
        setUser(current => {
            return { ...current, [field]: value }
        })
    }

    const goRegister = () => navigation.navigate("Register")

    React.useEffect(() => {
        CheckToastMessage(route)
    })

    return (
        <View style={[MyStyles.container, MyStyles.margin]}>
            <ScrollView>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    {fields.map(f => <TextInput value={user[f.name]} onChangeText={t => updateState(f.name, t)} key={f.label} style={MyStyles.margin} label={f.label} secureTextEntry={f.secureTextEntry} right={<TextInput.Icon icon={f.icon} />} />)}

                    <Toast position="top" topOffset={0}/>

                    <HelperText type="error" visible={error.visible}>{error.message}</HelperText>

                    <Button style={MyStyles.margin} loading={loading} icon="account" mode="contained" onPress={login}>
                        Đăng nhập
                    </Button>

                    <TouchableOpacity onPress={goRegister}>
                        <Text style={[MyStyles.margin, MyStyles.linkText]}>Chưa có tài khoản</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>

            </ScrollView>

            <Toast position="top" topOffset={0}/>
        </View>
    );
}

export default Login;