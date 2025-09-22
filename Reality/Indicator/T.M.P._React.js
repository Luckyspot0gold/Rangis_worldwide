// File: /app/components/McCreaPulse.js
import { View, Text, Button } from 'react-native';
import { Haptics } from 'expo-haptics';
import * as Audio from 'expo-audio';

export default function McCreaPulse() {
    const [tmpData, setTmpData] = useState(null);

    const fetchPulseData = async () => {
        try {
            const response = await fetch('https://your-api.execute-api.us-east-1.amazonaws.com/prod/fear-greed');
            const data = await response.json();
            setTmpData(data);
        } catch (error) {
            console.error("Couldn't fetch TMP data", error);
        }
    };

    const playPulse = async () => {
        if (!tmpData) return;

        // 1. Trigger the Haptic Pattern
        switch (tmpData.hapticPattern) {
            case 'warning':
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                break;
            case 'alert':
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                break;
            default:
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }

        // 2. Play the Tone
        const { sound } = await Audio.Sound.createAsync(
            { uri: `https://your-audio-server.com/generate-tone?freq=${tmpData.tmpFrequency}` } // See Phase 3
            // Alternatively, generate the tone locally with a library like `tone.js`
        );
        await sound.playAsync();
    };

    return (
        <View>
            <Text>The McCrea Pulse</Text>
            <Text>Market Sentiment: {tmpData?.classification} ({tmpData?.fearGreedValue})</Text>
            <Text>Current Pulse: {tmpData?.tmpFrequency?.toFixed(2)} Hz</Text>
            <Button title="Check the Market's Pulse" onPress={fetchPulseData} />
            <Button title="Feel the Pulse" onPress={playPulse} disabled={!tmpData} />
        </View>
    );
}
