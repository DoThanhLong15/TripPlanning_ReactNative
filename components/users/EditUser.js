import { Image, KeyboardAvoidingView, Platform, View} from "react-native";
import MyStyles from "../../styles/MyStyles";
import { Button, Text, TextInput, TouchableRipple } from "react-native-paper";
import React, { useContext, useState } from 'react';
import { MyUserContext, MyDispatcherContext } from './../../configs/Contexts';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';
import APIs, { endpoints } from "../../configs/APIs";
import GoBackButton from "../utils/GoBackButton";

const EditUser = ({navigation}) => {
    const user = useContext(MyUserContext);
    const dispatch = useContext(MyDispatcherContext);
    const [newUser, setNewUser] = useState({})
    const [loading, setLoading] = useState(false);

    const data = [{
        label: `Tên`,
        icon: 'text',
        name: 'first_name'
    },{
        label: `Họ và tên lót`,
        icon: 'text',
        name: 'last_name'
    },{
        label: `Tên đăng nhập`,
        icon: 'account',
        name: 'username'
    },{
        label: `Email`,
        icon: 'email',
        name: 'email'
    },{
        label: `Mật khẩu`,
        icon: 'eye',
        name: 'password',
        secureTextEntry: true,
    }]

    const picker = async () => {
        let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert("Permissions denied!");
        } else {
            const result = await ImagePicker.launchImageLibraryAsync();
            if (!result.canceled)
                setNewUser(current => {
                    return {...current, "avatar": result.assets[0]}
                });
        }
    }

    const updateState = (field, value) => {
        setNewUser(current => {
            return {...current, [field]: value}
        })
    }

    const update = async () => {
        setLoading(true)
        try {
            let form = new FormData();
            for (let key in newUser)
                if (key === 'avatar') {
                    form.append(key, {
                        uri: newUser.avatar.uri,
                        name: newUser.avatar.fileName,
                        type: newUser.avatar.mimeType
                    })
                } else {
                    form.append(key, newUser[key]);
                }

            if(Object.keys(newUser).length > 0) {
                let token = await AsyncStorage.getItem('access-token')
                let res = await APIs.patch(endpoints['current-user'], form, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': 'Bearer ' + token
                    }
                })  
    
                AsyncStorage.setItem('user', JSON.stringify(res.data));
    
                dispatch({
                    "type": "login",
                    "payload": res.data
                });
            }
            goUserInfo()

        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    }

    const goUserInfo = () => navigation.navigate("UserProfile")

    return (
        <View style={[MyStyles.margin]}> 
            <GoBackButton navigation={navigation} buttonText="Hủy bỏ" title="UserProfile" />

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                {data.map(f => <TextInput value={newUser[f.name] === undefined ? user[f.name]: newUser[f.name]} onChangeText={t => updateState(f.name, t)} key={f.name} style={MyStyles.margin} label={f.label} secureTextEntry={f.secureTextEntry} right={<TextInput.Icon icon={f.icon} />} />)}

                <TouchableRipple onPress={picker}>
                    <Text style={MyStyles.description}>Chọn hình đại diện...</Text>
                </TouchableRipple>

                {newUser.avatar !== undefined ? <Image source={{uri: newUser.avatar.uri }} style={MyStyles.avatar} /> : <Image source={{uri: user.avatar }} style={MyStyles.avatar} />}

                <Button style={MyStyles.margin} mode="contained" loading={loading} onPress={update}>
                    Lưu thay đổi
                </Button>
            </KeyboardAvoidingView>
        </View>
    );
}

export default  EditUser;
