import React, { useState, useRef, useEffect } from "react";
import { View, Text, Button, StyleSheet, Animated } from "react-native";

const flashcards = [
  { front: "うみ", back: "Umi (Sea)" },
  { front: "ふね", back: "Fune (Ship)" },
  { front: "たから", back: "Takara (Treasure)" },
  { front: "かいぞく", back: "Kaizoku (Pirate)" },
  { front: "なかま", back: "Nakama (Crew/Comrade)" },
  { front: "ぼうけん", back: "Bōken (Adventure)" },
  { front: "つよい", back: "Tsuyoi (Strong)" },
  { front: "ぼうけん", back: "Bōken (Adventure)" },
  { front: "なかよし", back: "Nakayoshi (Friendly)" },
  { front: "じゆう", back: "Jiyū (Freedom)" },
];

const shuffle = (array) => {
  let shuffledDeck = [...array];
  return shuffledDeck.sort(() => Math.random() - 0.5);
};

export default function App() {
  const [shuffledDeck, setShuffledDeck] = useState(flashcards);
  const [ndx, setNdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [intID, setIntID] = useState(null);

  const slideAnim = useRef(new Animated.Value(0)).current;

  const shuffleDeck = () => {
    setShuffledDeck(shuffle(shuffledDeck));
    setNdx(0);
    setIsFlipped(false);
  };

  const nextCard = () => {
    Animated.timing(slideAnim, {
      toValue: -300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setNdx((prevNdx) => (prevNdx + 1) % shuffledDeck.length);
      setIsFlipped(false);
      slideAnim.setValue(300);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  const prevCard = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setNdx(
        (prevNdx) => (prevNdx - 1 + shuffledDeck.length) % shuffledDeck.length
      );
      setIsFlipped(false);
      slideAnim.setValue(-300);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  const flipCard = () => {
    setIsFlipped((prevIsFlipped) => !prevIsFlipped);
  };

  const toggleAutoplay = () => {
    if (isAutoplay) {
      clearInterval(intID);
      setIntID(null);
      setIsAutoplay(false);
    } else {
      const id = setInterval(() => {
        nextCard();
      }, 3000);
      setIntID(id);
      setIsAutoplay(true);
    }
  };

  useEffect(() => {
    return () => clearInterval(intID);
  }, [intID]);

  return (
    <View style={styles.container}>
      <View style={styles.otherContainer}>
        <Text style={styles.mainText}>Flash.</Text>
        <Text style={styles.subText}>Powered by Mary</Text>
      </View>
      <Animated.View
        style={[
          styles.card,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <Text style={styles.text}>
          {isFlipped ? shuffledDeck[ndx].back : shuffledDeck[ndx].front}
        </Text>
        <Button
          title={isFlipped ? "Flip Front" : "Flip Back"}
          onPress={flipCard}
          color="black"
        />
      </Animated.View>

      <View style={styles.buttons}>
        <Button title="Previous" onPress={prevCard} color="black" />
        <Button title="Next" onPress={nextCard} color="black" />
        <Button title="Shuffle" onPress={shuffleDeck} color="black" />
        <Button
          title={isAutoplay ? "Stop Auto" : "Start Auto"}
          onPress={toggleAutoplay}
          color="black"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mainText: {
    fontSize: 80,
    fontWeight: "800",
  },
  subText: {
    marginBottom: "10%",
  },

  card: {
    width: 300,
    height: 350,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    margin: 10,
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 30,
    marginBottom: 10,
    fontWeight: "700",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 20,
  },
});
