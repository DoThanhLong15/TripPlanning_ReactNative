import { Button, HelperText, Text, TextInput, TouchableRipple } from "react-native-paper";
import MyStyles from "../../styles/MyStyles";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Image, View } from "react-native";
import { useState } from "react";
import moment from "moment";


const TripForm = ({timeField, textFields, instance, button, saveHandle}) => {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    
    const trip = instance.trip;
    const newTrip = instance.new_trip;

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirmDatetime = (date) => {
        instance.update_state(timeField.name, moment(date).format("HH:mm:ss"))
        hideDatePicker(false);
    };

    const showImage = () => {
        if(newTrip && newTrip.image){
            return <Image source={{uri: newTrip.image.uri}} style={MyStyles.pic_full} />
        }

        if(trip.image){
            if(trip.image.uri)
                return <Image source={{uri: trip.image.uri}} style={MyStyles.pic_full} />
            return <Image source={{uri: trip.image}} style={MyStyles.pic_full} />
        }
    }

    const showValueInput = (field) => {
        let temp = newTrip && newTrip[field] !== undefined ? newTrip[field]: trip[field];
        
        return temp;
    }


    return (
        <>
            {/* text fields  */}
            {textFields.map(field => <TextInput style={MyStyles.margin} key={field.name} 
                value={showValueInput(field.name)}
                label={field.label} 
                right={<TextInput.Icon icon={field.icon}/>} 
                onChangeText={text => instance.update_state(field.name, text)}
            />)}
            

            {/* time fields  */}
            <TextInput style={MyStyles.margin} 
                label={timeField.label} 
                key={timeField.name} showSoftInputOnFocus={false} 
                value={showValueInput(timeField.name)}
                right={<TextInput.Icon icon={timeField.icon}/>}
                onPressIn={showDatePicker}/>

            <TouchableRipple onPress={instance.imgPicker}>
                <Text style={[MyStyles.description, MyStyles.margin]}>Chọn hình điểm đến...</Text>
            </TouchableRipple>

            {newTrip || trip.image ? showImage(): <Text>Không có hình ảnh</Text>}

            <DateTimePickerModal 
                mode="time"
                isVisible={isDatePickerVisible} 
                onConfirm={handleConfirmDatetime}
                onCancel={hideDatePicker}/>


            {/* error area  */}
            <HelperText type="error" visible={instance.error.visible}>
                {instance.error.message}
            </HelperText>


            {/* save button  */}
            <View style={MyStyles.flex_row}>
                {button.map(value => <Button style={[MyStyles.w_45, MyStyles.comment]} 
                        key={value.key}
                        onPress={() => saveHandle(value.key)}
                        loading={value.loading} 
                        disabled={value.disable}>{value.text}
                    </Button>)}
            </View>
        </>
    );
}

export default TripForm;