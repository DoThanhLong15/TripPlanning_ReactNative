import GoBackButton from "../utils/GoBackButton";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { TimeField, TextFields } from "./TripFields";
import { useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import TripForm from "./TripForm";
import MyStyles from "../../styles/MyStyles";
import { ChangeDataToForm, CheckEmptyInput, ErrorMessageShow } from "../utils/Utils";
import { endpoints } from "../../configs/APIs";

const NewTrip = ({navigation, route}) => {
    const [error, setError] = useState({visible: false});
    const [trip, setTrip] = useState(true);

    const [saveButton, setSaveButton] = useState([
        {
            key: "save",
            text: "Lưu điểm đến",
            loading: false,
            disable: false
        },
        {
            key: "createMore",
            text: "Tạo thêm điểm đến",
            loading: false,
            disable: false
        }
    ])
    const textFields = TextFields;
    const timeField = TimeField;

    const saveHandle = (key, loading, disable) => {
        setSaveButton(current => {
            return current.map(item => {
                if(item.key === key) {
                    return {...item, "loading": loading}
                } else {
                    return {...item, "disable": disable};
                }
            })
        })
    }

    const imagePicker = async () => {
        let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert("Permissions denied!");
        } else {
            const result = await ImagePicker.launchImageLibraryAsync();
            if (!result.canceled)
                setTrip(current => {
                    return {...current, "image": result.assets[0]}
                });
        }
    }

    const updateState = (field, value) => {
        setTrip(current => {
            return { ...current, [field]: value }
        })
    }
    
    const checkInput = (obj, field) => {
        let validateFields = CheckEmptyInput(obj, field)
        setError(validateFields)

        if(error.visible)
            return true

        return false;
    }

    const postTrip = async (key) => {
        if(checkInput(trip, textFields))
            return;
        console.log(error)
        if(trip[timeField.name] === undefined){
            setError(ErrorMessageShow("Vui lòng chọn thời gian di chuyển"));
            return;
        }

        try {
            saveHandle(key, true, true)

            let form = ChangeDataToForm(trip)
            console.log(form)
            let url = `${endpoints['tripplans']}/${route.params.tripplan.id}/trip/`;
            let token = await AsyncStorage.getItem('access-token');
            // let res = await APIs.post(url, form, {
            //     header: {
            //         'Content-Type': 'multipart/form-data',
            //         'Authorization': 'Bearer ' + token
            //     }
            // })

        } catch(ex) {

        } finally {
            saveHandle(key, false, false)
        }
        
    }

    return (
        <View style={MyStyles.margin}>
            <GoBackButton navigation={navigation} 
                title="Trip" 
                buttonText="Hủy" 
                dataChange={{
                    "tripplan": route.params.tripplan
                }}/>

            <ScrollView>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <TripForm timeField={timeField} 
                        textFields={textFields}
                        instance={{
                            "trip": trip,
                            "error": error,
                            "update_state": (field, value) => updateState(field, value),
                            "imgPicker": () => imagePicker()
                        }}
                        button={saveButton}
                        saveHandle={(key) => postTrip(key)}/>
                </KeyboardAvoidingView>
            </ScrollView>
        </View>
    )
}

export default NewTrip;