import { Alert } from "react-native";
import Toast from "react-native-toast-message";

export const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
};

export const ChangeDataToForm = (data) => {
  let form = new FormData();
  for (let key in data){
    form.append(key, data[key]);
  }
  return form;
}

export const ErrorMessageShow = (message) => {
  return {
    "visible": true,
    "message": message
  }
}

export const ErrorMessageHide = () => {
  return {
    "visible": false
  }
}
 
export const CheckEmptyInput = (data, fields) => {
  for(let value of fields){
    if(data[value.name] == undefined || data[value.name] === ""){
      return ErrorMessageShow(`${value.label} không được để trống!`)
    }
  }
  
  return ErrorMessageHide()
}

export const ToastShow = (message, type) => {
  Toast.show({
    type: type,
    text1: message,
    visibilityTime: 3000,
    autoHide: true
  })
}

export const CheckToastMessage = (route) => {
  if(route.params && route.params.toast){
    let toast = route.params.toast
    ToastShow(toast.message, toast.type)
    route.params.toast = undefined
  }
}

export const ShowAlert = (title, message, callback) => {
  Alert.alert(
    title,
    message,
    [
        {
            text: "Cancel",
            style: "cancel"
        },
        {
            text: "OK",
            onPress: () => callback()
        }
    ], { cancelable: false }
  );
}