import React, { useState } from "react";
import {StyleSheet, Text, View, TouchableOpacity, SafeAreaView,} from "react-native";

export default function App() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const buttons = [
    "/", "*", "-", "+",
    "1", "2", "3", "C",
    "4", "5", "6", "←",
    "7", "8", "9", "=",
    ".", "0",
  ];

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
      } catch (e) {
        setResult("Error");
      }
    } else {
      setInput(input + button);
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
