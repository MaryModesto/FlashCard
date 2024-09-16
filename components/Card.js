import { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const Card = ({ card }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <View style={styles.card}>
      <Text style={styles.text}>{isFlipped ? card.front : card.back}</Text>
      <Button title="Flip" onPress={() => setIsFlipped(!isFlipped)} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    justifyContent: "center",
    padding: "5%",
    borderWidth: 1,
    borderBlockColor: "black",
    borderRadius: 10,
    margin: "2%",
  },

  text: {
    fontSize: 20,
    marginBottom: 10,
  },
});

export default Card;
