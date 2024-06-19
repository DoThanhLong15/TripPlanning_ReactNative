import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import 'moment/locale/vi';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-paper";
import TripPlan from "./components/tripplans/TripPlan";
import Register from "./components/users/Register";
import Login from "./components/users/Login";
import UserProfile from './components/users/UserProfile';
import { MyDispatcherContext, MyUserContext } from './configs/Contexts';
import { MyUserReducer } from './configs/Reducers';
import React, { useContext, useReducer } from 'react';
import Trip from "./components/tripplans/Trip";
import EditUser from "./components/users/EditUser";
import NewTripPlan from "./components/tripplans/NewTripPlan";
import EditTripPlan from "./components/tripplans/EditTripPlan";
import NewTrip from "./components/tripplans/NewTrip";
import EditTrip from "./components/tripplans/EditTrip";
import JoinedTripPlan from "./components/users/JoinedTripPlan";
import ReportUser from "./components/tripplans/ReportUser";

const Stack = createNativeStackNavigator();

const TripPlanStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="TripPlan" component={TripPlan} options={{title: "Danh sách chuyển đi"}}/>
      <Stack.Screen name="NewTripPlan" component={NewTripPlan} options={{title: "Tạo hành trình"}}/>
      <Stack.Screen name="EditTripPlan" component={EditTripPlan} options={{title: "Chỉnh sửa hành trình"}}/>

      <Stack.Screen name="Trip" component={Trip} options={{title: "Chi tiết chuyến đi"}}/>
      <Stack.Screen name="NewTrip" component={NewTrip} options={{title: "Tạo điểm đến"}}/>
      <Stack.Screen name="EditTrip" component={EditTrip} options={{title: "Chỉnh sửa điểm đến"}}/>
      <Stack.Screen name="ReportUser" component={ReportUser} options={{title: "Báo cáo vi phạm"}}/>
    </Stack.Navigator>
  );
}

const UserProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="UserProfile" component={UserProfile} options={{title: "Trang cá nhân"}}/>
      <Stack.Screen name="EditUser" component={EditUser} options={{title: "Sửa trang cá nhân"}}/>
      <Stack.Screen name="JoinedTripPlan" component={JoinedTripPlan} 
        options={{title: "Danh sách các hành trình đã tham gia"}}/>
    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator();
const MyTab = () => {
  const user = useContext(MyUserContext);

  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={TripPlanStack} options={{title: "Danh mục chuyến đi", tabBarIcon: () => <Icon source="home" size={30} color="blue"/>}} />
      {user === null ? <>
        <Tab.Screen name="Register" component={Register} options={{title: "Đăng ký", tabBarIcon: () => <Icon source="account" size={30} color="blue" />}} />
        <Tab.Screen name="Login" component={Login} options={{title: "Đăng nhập", tabBarIcon: () => <Icon source="login" size={30}  color="blue" />}} />
      </> : <>
      <Tab.Screen name='Profile' component={UserProfileStack} options={{ tabBarIcon: () => <Icon color='blue' size={30} source="account" /> }} />
      </> }
      
      
    </Tab.Navigator>
  );
}

const App = () => {
  const [user, dispatch] = useReducer(MyUserReducer, null);
  return (
    <NavigationContainer>
      <MyUserContext.Provider value={user}>
        <MyDispatcherContext.Provider value={dispatch}>
          <MyTab/>
        </MyDispatcherContext.Provider>
      </MyUserContext.Provider>
    </NavigationContainer>
  );
}

export default App;
