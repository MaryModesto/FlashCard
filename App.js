import React, { useState, useRef, useEffect } from "react";
import { View, Text, Button, StyleSheet, Animated } from "react-native";

// Predefined flashcards data
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
  // Add more flashcards here
];

// Function to shuffle an array
const shuffleArray = (array) => {
  let shuffledArray = [...array]; // Clone the array to avoid modifying the original
  return shuffledArray.sort(() => Math.random() - 0.5);
};

export default function App() {
  const [shuffledFlashcards, setShuffledFlashcards] = useState(flashcards);
  const [index, setIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  const slideAnim = useRef(new Animated.Value(0)).current; // Animation value for sliding

  // Function to shuffle the flashcards
  const handleShuffle = () => {
    setShuffledFlashcards(shuffleArray(shuffledFlashcards));
    setIndex(0); // Reset index to 0 after shuffling
    setShowBack(false); // Reset to show front side
  };

  // Function to slide the card in from the right (next)
  const slideNext = () => {
    Animated.timing(slideAnim, {
      toValue: -300, // Slide out to the left
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIndex((prevIndex) => (prevIndex + 1) % shuffledFlashcards.length);
      setShowBack(false); // Reset to show front side of the next card
      slideAnim.setValue(300); // Reset the position to the right
      Animated.timing(slideAnim, {
        toValue: 0, // Slide in from the right
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  // Function to slide the card in from the left (previous)
  const slidePrevious = () => {
    Animated.timing(slideAnim, {
      toValue: 300, // Slide out to the right
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIndex(
        (prevIndex) =>
          (prevIndex - 1 + shuffledFlashcards.length) %
          shuffledFlashcards.length
      );
      setShowBack(false); // Reset to show front side of the previous card
      slideAnim.setValue(-300); // Reset the position to the left
      Animated.timing(slideAnim, {
        toValue: 0, // Slide in from the left
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  // Function to flip the flashcard
  const flipCard = () => {
    setShowBack((prevShowBack) => !prevShowBack);
  };

  // Toggle autoplay on/off
  const toggleAutoplay = () => {
    if (isAutoplay) {
      // Stop autoplay
      clearInterval(intervalId);
      setIntervalId(null);
      setIsAutoplay(false);
    } else {
      // Start autoplay
      const id = setInterval(() => {
        slideNext(); // Use the slide animation when autoplay is on
      }, 3000); // 3 second interval
      setIntervalId(id);
      setIsAutoplay(true);
    }
  };

  // Stop autoplay when the component unmounts or when autoplay is toggled off
  useEffect(() => {
    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [intervalId]);

  return (
    <View style={styles.container}>
      {/* Flashcard display with animation */}
      <Animated.View
        style={[
          styles.card,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <Text style={styles.text}>
          {showBack
            ? shuffledFlashcards[index].back
            : shuffledFlashcards[index].front}
        </Text>
        <Button
          title={showBack ? "Show Front" : "Show Back"}
          onPress={flipCard}
        />
      </Animated.View>

      {/* Navigation buttons */}
      <View style={styles.buttons}>
        <Button title="Previous" onPress={slidePrevious} />
        <Button title="Next" onPress={slideNext} />
      </View>

      {/* Shuffle button */}
      <View style={styles.shuffleButton}>
        <Button title="Shuffle" onPress={handleShuffle} />
      </View>

      {/* Autoplay button */}
      <View style={styles.autoplayButton}>
        <Button
          title={isAutoplay ? "Stop Autoplay" : "Start Autoplay"}
          onPress={toggleAutoplay}
        />
      </View>
    </View>
  );
}

// Styling for the components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: 300,
    height: 200,
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
    fontSize: 20,
    marginBottom: 10,
  },
  buttons: {
    flexDirection: "row",
    marginTop: 20,
  },
  shuffleButton: {
    marginTop: 20,
  },
  autoplayButton: {
    marginTop: 20,
  },
});
