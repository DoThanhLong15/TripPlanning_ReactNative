import { Button, HelperText, TextInput } from "react-native-paper";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import MyStyles from "../../styles/MyStyles";
import moment from "moment";
import { useState } from "react";


const TripPlanForm = ({textFields, datetimeFields, instance, button}) => {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [timeName, setTimeName] = useState("");
    const tripplan = instance.tripplan;
    const newTripPlan = instance.new_tripplan;

    const showDatePicker = (inputName) => {
        setTimeName(inputName)
        setDatePickerVisibility(true);
    };

    const hideDatePicker = (cancel) => {
        if(cancel){
            instance.update_state(timeName, "")
        }
        setDatePickerVisibility(false);
    };

    const handleConfirmDatetime = (date) => {
        instance.update_state(timeName, moment(date).format("YYYY-MM-DD HH:mm:ss"))
        hideDatePicker(false);
    };

    const formatNumber = (field) => {
        let temp = newTripPlan && newTripPlan[field] !== undefined ? newTripPlan[field]: tripplan[field];

        if(field == "expectCost" && temp != undefined) {
            temp = temp.toLocaleString().replace(/,/g," ",)
        }
        
        return temp;
    }


    return (
        <>
            {/* text fields  */}
            {textFields.map(f => <TextInput style={MyStyles.margin} key={f.name} 
                value={formatNumber(f.name)}
                label={f.label} 
                right={<TextInput.Icon icon={f.icon}/>} 
                keyboardType={f.type} 
                onChangeText={t => instance.update_state(f.name, t)}
            />)}
            
           
            {/* datetime fields  */}
            {datetimeFields.map(f => <TextInput style={MyStyles.margin} 
                label={f.label} 
                key={f.name} showSoftInputOnFocus={false} 
                value={formatNumber(f.name)}
                right={<TextInput.Icon icon={f.icon}/>}
                onPressIn={() => showDatePicker(f.name)}/>)}
        
            <DateTimePickerModal mode="datetime"
                isVisible={isDatePickerVisible} 
                onConfirm={handleConfirmDatetime}
                onCancel={() => hideDatePicker(true)}
            />


            {/* error area  */}
            <HelperText type="error" visible={instance.error.visible}>
                {instance.error.message}
            </HelperText>


            {/* button save  */}
            <Button style={MyStyles.margin} mode="contained" loading={instance.loading} 
                onPress={() => button.on_press()}>{button.text}
            </Button>
        </>
    );
}

export default TripPlanForm;