import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Accelerometer } from "expo-sensors";

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
    Accelerometer.setUpdateInterval(500); 
    const subscription = Accelerometer.addListener((data) => {
      const { x, y, z } = data;
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
