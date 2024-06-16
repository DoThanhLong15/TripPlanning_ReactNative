import { View, Text, Image, ScrollView, Platform, KeyboardAvoidingView, TouchableOpacity } from "react-native";
import { Button, HelperText, TextInput, TouchableRipple } from "react-native-paper";
import MyStyles from "../../styles/MyStyles";
import * as ImagePicker from 'expo-image-picker';
import React from "react";
import APIs, { endpoints } from "../../configs/APIs";

const Register = ({navigation}) => {
    const [user, setUser] = React.useState({});
    const fields = [{
        "label": "Tên",
        "icon": "text",
        "name": "first_name"
    }, {
        "label": "Họ và tên lót",
        "icon": "text",
        "name": "last_name"
    }, {
        "label": "Tên đăng nhập",
        "icon": "account",
        "name": "username"
    }, {
        "label": "Mật khẩu",
        "icon": "eye",
        "secureTextEntry": true,
        "name": "password"
    },  {
        "label": "Xác nhận mật khẩu",
        "icon": "eye",
        "secureTextEntry": true,
        "name": "confirm"
    }];
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);

    const picker = async () => {
        let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert("Permissions denied!");
        } else {
            const result = await ImagePicker.launchImageLibraryAsync();
            if (!result.canceled)
                setUser(current => {
                    return {...current, "avatar": result.assets[0]}
                });
        }
    }

    const register = async () => {
        if (user?.password !== user?.confirm) {
            setError(true);
            return;
        } else
            setError(false);

        setLoading(true)
        try {
            let form = new FormData();
            for (let key in user)
                if (key !== 'confirm')
                    if (key === 'avatar') {
                        form.append(key, {
                            uri: user.avatar.uri,
                            name: user.avatar.fileName,
                            type: user.avatar.mimeType
                        })
                    } else {
                        form.append(key, user[key]);
                    }
            
            let res = await APIs.post(endpoints['register'], form, {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            })

            if (res.status === 201)
                navigation.navigate("Login", {
                    "toast": {
                        "type": "success",
                        "message": "Đăng ký tài khoản thành công!"
                    }
                });
            
                setUser({})

        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    }
    

    const updateState = (field, value) => {
        setUser(current => {
            return {...current, [field]: value}
        })
    }

    const goLogin = () => {
        navigation.navigate("Login")
    }

    return (
        
        <View style={[MyStyles.container, MyStyles.margin]}>
            <ScrollView>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    {fields.map(f => <TextInput value={user[f.name]} onChangeText={t => updateState(f.name, t)} key={f.label} style={MyStyles.margin} label={f.label} secureTextEntry={f.secureTextEntry} right={<TextInput.Icon icon={f.icon} />} />)}
                    
                    <TouchableRipple onPress={picker}>
                        <Text style={MyStyles.description}>Chọn hình đại diện...</Text>
                    </TouchableRipple>

                    <HelperText type="error" visible={error}>
                        Mật khẩu không khớp!
                    </HelperText>

                    {user?.avatar && <Image source={{uri: user.avatar.uri }} style={MyStyles.avatar} />}

                    <Button style={MyStyles.margin} icon="account" mode="contained" loading={loading} onPress={register}>
                        Đăng ký
                    </Button>

                    <TouchableOpacity onPress={goLogin}>
                        <Text style={[MyStyles.margin, MyStyles.linkText]}>Đã có tài khoản</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </ScrollView>
        </View>
        
    );
}

export default Register;