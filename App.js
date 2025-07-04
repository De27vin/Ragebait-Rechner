import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from "react-native";
import { Accelerometer } from "expo-sensors";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

const originalButtons = [
  "/", "*", "-", "+",
  "1", "2", "3", "C",
  "4", "5", "6", "←",
  "7", "8", "9", "=",
  ".", "0",
];

const shuffleButtons = (buttonsArray) => {
  const shuffled = [...buttonsArray];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function App() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [buttons, setButtons] = useState([...originalButtons]);
  const [isFlat, setIsFlat] = useState(false);

  useEffect(() => {
    registerForPushNotificationsAsync();

    const notificationInterval = setInterval(() => {
      scheduleNotification();
    }, 30000); 

    return () => clearInterval(notificationInterval);
  }, []);

  useEffect(() => {
    Accelerometer.setUpdateInterval(500);
    const subscription = Accelerometer.addListener(({ x, y, z }) => {
      if (z < -0.9 && Math.abs(x) < 0.2 && Math.abs(y) < 0.2) {
        setIsFlat(true);
      } else {
        setIsFlat(false);
      }
    });

    return () => subscription.remove();
  }, []);

  const handlePress = (button) => {
    if (button === "C") {
      setInput("");
      setResult("");
    } else if (button === "←") {
      setInput(input.slice(0, -1));
    } else if (button === "=") {
      try {
        const evalResult = eval(input);
        setResult("= " + evalResult);

        if (!isFlat) {
          setButtons(shuffleButtons([...originalButtons]));
        }
      } catch (e) {
        setResult("Error");
      }
    } else {
      setInput(input + button);
    }

    if (isFlat) {
      setButtons(shuffleButtons([...originalButtons]));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.display}>
        <Text style={styles.input}>{input}</Text>
        <Text style={styles.result}>{result}</Text>
      </View>

      <View style={styles.buttonContainer}>
        {buttons.map((button, index) => (
          <TouchableOpacity
            key={index}
            style={styles.button}
            onPress={() => handlePress(button)}
          >
            <Text style={styles.buttonText}>{button}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

async function registerForPushNotificationsAsync() {
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("Permission for notifications not granted.");
      return;
    }

    const token = await Notifications.getExpoPushTokenAsync();
    console.log("Expo Push Token:", token.data);
  } else {
    alert("Must use a physical device for notifications");
  }
}

async function scheduleNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "📲 Calculator Reminder",
      body: "Tap me! Your buttons may have moved 😏",
    },
    trigger: null, 
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    justifyContent: "flex-start",
    padding: 20,
  },
  display: {
    minHeight: 120,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingBottom: 20,
    borderBottomColor: "#444",
    borderBottomWidth: 1,
  },
  input: {
    fontSize: 32,
    color: "#fff",
  },
  result: {
    fontSize: 24,
    color: "#0f0",
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 20,
  },
  button: {
    width: "22%",
    margin: "1.5%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 28,
    color: "#fff",
  },
});
