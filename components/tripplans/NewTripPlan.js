import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import MyStyles from "../../styles/MyStyles";
import { useState } from "react";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ChangeDataToForm, CheckEmptyInput, ErrorMessageHide, ErrorMessageShow } from "../utils/Utils";
import APIs, { endpoints } from "../../configs/APIs";
import GoBackButton from "../utils/GoBackButton";
import { DatetimeFields, TextFields } from "./TripPlanFields";
import TripPlanForm from "./TripPlanForm";
import Title from "../utils/Title";


const NewTripPlan = ({navigation}) => {
    const [tripplan, setTripPlan] = useState({});
    const [error, setError] = useState({"visible": false});
    const [loading, setLoading] = useState(false);

    const fields = TextFields
    const datetimeFields = DatetimeFields

    const checkTimeValid = () => {
        let startTime = tripplan.startTime
        let endTime = tripplan.endTime
        let today = moment()

        if(moment(startTime).isBefore(today)){
            setError(ErrorMessageShow("Thời gian khởi hành phải sau thời điểm hiện tại!"))
            return false;
        }

        if(moment(startTime).isAfter(endTime)){
            setError(ErrorMessageShow("Thời gian kết thúc phải sau thời gian khởi hành!"))
            return false;
        }

        setError(ErrorMessageHide())
        
        return true;
    }

    const checkNumValid = (number) => {
        if(Number.isNaN(number)){
            setError(ErrorMessageShow("Vui lòng nhập số!"))
            return false;
        }

        setError(ErrorMessageHide())

        return true;
    }

    const postTripPlan = async () => {
        if(tripplan.expectCost === undefined || tripplan.expectCost === ""){
            updateState("expectCost")
            return;
        }

        let validateFields = CheckEmptyInput(tripplan, fields)
        setError(validateFields)

        if(validateFields.visible){
            return;
        }
        
        validateFields = CheckEmptyInput(tripplan, datetimeFields)
        setError(validateFields)
        if(validateFields.visible)
            return;

        if(!checkTimeValid()){
            return;
        }

        try{
            setLoading(true);

            let form = await ChangeDataToForm(tripplan)
            let token = await AsyncStorage.getItem('access-token')
            let res = await APIs.post(endpoints['create-tripplan'], form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer ' + token
                }
            })
            
            navigation.navigate("TripPlan", {
                "toast": {
                    "message": "Tạo mới hành trình thành công",
                    "type": "success"
                }, "reload": true
            })

        } catch(ex) {
            console.error(ex);
        } finally{
            setLoading(false)
        }
    }

    const updateState = (field, value) => {
        if(field == "expectCost"){
            if(!checkNumValid(parseInt(value))){
                value = 0
            }
            else {
                value = parseInt(value.replace(/\s/g, ''))
            }
        }

        setTripPlan(current => {
            return { ...current, [field]: value }
        })
    }

    return (
        <View style={MyStyles.margin}>
            <GoBackButton navigation={navigation} title="TripPlan" buttonText="Hủy bỏ"/>

            <Title title="Tạo hành trình"/>

            <ScrollView>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <TripPlanForm textFields={fields} datetimeFields={datetimeFields} 
                        instance={{
                            "tripplan": tripplan,
                            "error": error,
                            "update_state": (field, value) => updateState(field, value),
                            "loading": loading
                        }} 
                        button={{
                            "text": "Tạo hành trình",
                            "on_press": () => postTripPlan()
                        }}/>
                </KeyboardAvoidingView>
            </ScrollView>
        </View>
    );
}

export default NewTripPlan;