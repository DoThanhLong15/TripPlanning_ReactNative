import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import MyStyles from "../../styles/MyStyles";
import GoBackButton from "../utils/GoBackButton";
import { useState } from "react";
import { TextFields, TimeField } from "./TripFields";
import Title from "../utils/Title";
import * as ImagePicker from 'expo-image-picker';
import TripForm from "./TripForm";
import { ChangeDataToForm, ErrorMessageShow } from "../utils/Utils";
import APIs, { endpoints } from "../../configs/APIs";
import AsyncStorage from "@react-native-async-storage/async-storage";


const EditTrip = ({navigation, route}) => {
    const currentTrip = route.params.trip;
    const [newTrip, setNewTrip] = useState({})
    const [error, setError] = useState({visible: false})
    const [saveButton, setSaveButton] = useState([
        {
            key: "save",
            text: "Lưu",
            loading: false,
            disable: false
        }])
    const newData = {
        "tripplan": route.params.tripplan,
        "editTrip": currentTrip
    }

    const textFields = TextFields
    const timeField = TimeField

    const updateState = (field, value) => {
        setNewTrip(current => {
            return { ...current, [field]: value }
        })
    }

    const imagePicker = async () => {
        let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert("Permissions denied!");
        } else {
            const result = await ImagePicker.launchImageLibraryAsync();
            if (!result.canceled)
                setNewTrip(current => {
                    return {...current, "image": result.assets[0]}
                });
        }
    }

    const saveHandle = (loading) => {
        setSaveButton(current => {
            current[0].loading = loading
            return current
        })
    }

    const checkValidInput = (obj) => {
        for(let key in obj) {
            if(obj[key] === "" && key != "image"){
                delete obj[key];
            }
        }
        if(Object.keys(obj).length <= 0){
            setError(ErrorMessageShow(`Không được để trống!`))
            return false;
        }
        return true;
    }

    const editTrip = async (key) => {
        if(Object.keys(newTrip).length > 0){
            if(!checkValidInput(newTrip))
                return;

            try{
                saveHandle(true);
                if(newTrip.image){
                    let image = {
                        uri: newTrip.image.uri,
                        name: newTrip.image.fileName,
                        type: newTrip.image.mimeType
                    }
                    newTrip.image = image
                }
                let form = ChangeDataToForm(newTrip)
                let url = `${endpoints['trips']}/${currentTrip.id}/update/`;
                let token = await AsyncStorage.getItem('access-token');
                let res = await APIs.patch(url, form, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': 'Bearer ' + token
                    }
                })

                newData.editTrip = res.data
                newData.toast = {
                    message: "Cập nhật thành công",
                    type: "success"
                }

            } catch(ex) {
                console.error(ex);
            } finally {
                saveHandle(false);
            }
        }
        navigation.navigate("Trip", newData)
    }

    return (
        <View style={MyStyles.margin}>
            <GoBackButton navigation={navigation} 
                title="Trip" 
                buttonText="Hủy"
                dataChange={newData}/>

            <Title title="Chỉnh sửa điểm đến"/>

            <ScrollView>
                <KeyboardAvoidingView Viewbehavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <TripForm timeField={timeField} 
                        textFields={textFields}
                        instance={{
                            "new_trip": newTrip,
                            "trip": currentTrip,
                            "error": error,
                            "update_state": (field, value) => updateState(field, value),
                            "imgPicker": () => imagePicker()
                        }}
                        button={saveButton}
                        saveHandle={(key) => editTrip(key)}/>
                </KeyboardAvoidingView>
            </ScrollView>
        </View>
    );
}

export default EditTrip;