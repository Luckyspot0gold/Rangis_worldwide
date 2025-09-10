import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { AbstraxionProvider, useMetaAccount } from "@burnt-labs/abstraxion-react-native";
import * as Haptics from "expo-haptics";
import { Audio } from "expo-av";
import { MINTSCAN_API_KEY } from "@env";

// 🎵 Play Harmonic Tone (432Hz)
async function playTone(frequency = 432) {
  console.log(`Playing tone at ${frequency} Hz`);
  const sound = new Audio.Sound();
  try {
    await sound.loadAsync(require("./assets/432hz.mp3")); // put a 432hz.mp3 file in assets/
    await sound.playAsync();
  } catch (error) {
    console.error("Audio error", error);
  }
}

function MarketDemo() {
  const { connect, account } = useMetaAccount();
  const [price, setPrice] = useState(null);

  useEffect(() => {
    async function fetchPrice() {
      try {
        // 🔥 Replace CoinGecko with Mintscan later using API key
        const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd", {
          headers: {
            Authorization: `Bearer ${MINTSCAN_API_KEY}`, // not used by CoinGecko but placeholder for Mintscan
          }
        });
        const data = await res.json();
        setPrice(data.bitcoin.usd);

        // Trigger Tone + Haptic Feedback
        await playTone(432);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      } catch (err) {
        console.error("Price fetch failed", err);
      }
    }

    fetchPrice();
    const interval = setInterval(fetchPrice, 15000);
    return () => clearInterval(interval);
  }, []);

  if (!account) {
    return (
      <View style={styles.container}>
        <Button title="Login / Connect Wallet" onPress={() => connect()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Connected: {account.address}</Text>
      <Text style={styles.price}>BTC/USD: ${price}</Text>
      <Button title="Play Harmonic Tone" onPress={() => playTone(432)} />
      <Button
        title="Trigger Haptic"
        onPress={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)}
      />
    </View>
  );
}

export default function App() {
  return (
    <AbstraxionProvider>
      <MarketDemo />
    </AbstraxionProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111",
  },
  text: {
    color: "white",
    fontSize: 16,
    marginBottom: 10,
  },
  price: {
    color: "lime",
    fontSize: 20,
    marginVertical: 10,
  },
});
