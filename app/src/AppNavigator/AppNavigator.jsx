import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Welcome from "../components/WelcomeScreen/Welcome";
import { NavigationContainer } from "@react-navigation/native";
import MainScreen from "../components/mainScreen/MainScreen";
import chatScreen from "../components/chatScreen/chatScreen";
import linkShare from "../components//linkShare/linkShare";
import * as Linking from "expo-linking";
import { Text } from "react-native";
import { useEffect } from "react";
import WelcomeScreen, {
  handleUrl,
} from "../components/WelcomeScreen/WelcomeScreens/WelcomeScreen";
import LandingScreen from "../components/WelcomeScreen/WelcomeScreens/LandingScreen";
import RegistrationScreen from "../components/WelcomeScreen/WelcomeScreens/RegistrationScreen";
import VerificationPage from "../components/InviteScreen/VerificationPage";
import ChooseLanguage from "../components/chooseLanguage/chooseLanguage";

const Stack = createNativeStackNavigator();

const prefix = Linking.createURL("/");
const AppNavigator = ({ navigation }) => {
  const linking = {
    prefixes: [
      "https://babel-mf43trwll-satyam9798s-projects.vercel.app/app",
      "babelon://",
      "",
      "/",
    ],
    config: {
      screens: {
        WelcomeScreen: "WelcomeScreen",
        main: "main",
        chat: {
          path: "chat/:userType/:roomId/:chatType/:linkType",
          parse: {
            userType: (userType) => `${userType}`,
            roomId: (roomId) => `${roomId}`,
            chatType: (chatType) => `${chatType}`,
            linkType: (linkType) => `${linkType}`,
          },
        },
      },
    },
  };
  useEffect(() => {
    const handleDeepLink = ({ url }) => {
      const route = url.replace(/.*?:\/\//g, "");
      const routeName = route.split("/")[0];
      console.log("incoming param", routeName);
    };
    Linking.addEventListener("url", (event) => {
      handleDeepLink(event);
    });
  }, []);
  return (
    <NavigationContainer
      independent={true}
      linking={linking}
      fallback={<Text>Loading...</Text>}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="main"
      >
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        <Stack.Screen name="LandingScreen" component={LandingScreen} />
        <Stack.Screen
          name="RegistrationScreen"
          component={RegistrationScreen}
        />
        <Stack.Screen name="otpverify" component={VerificationPage} />
        <Stack.Screen name="language" component={ChooseLanguage} />
        <Stack.Screen name="main" component={MainScreen} />
        <Stack.Screen name="linkShare" component={linkShare} />
        <Stack.Screen name="chat" component={chatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
