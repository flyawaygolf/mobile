import { View } from "react-native";
import { Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { AvailabilitySlot } from "../../Services/Client/Managers/Interfaces/Me";
import { messageFormatDate } from "../../Services";

type SectionProps = {
    schedule: AvailabilitySlot[]
}
export default function ShowAvailability({ schedule }: SectionProps) {
    const { t } = useTranslation();

    const formatTime = (time: Date) => {
        return messageFormatDate(time).time()
    };

    return (
        schedule.map((availability) => (
            <View key={availability.id}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 16,
                    paddingBottom: 0
                }}>
                    <Text variant="bodyLarge">
                        {t(`premium.day_${availability.id}`)}
                    </Text>
                    {availability.available ? (
                        <Text>
                            {formatTime(availability.start)} - {formatTime(availability.end)}
                        </Text>
                    ) : (
                        <Text>{t("premium.not_available")}</Text>
                    )}
                </View>
            </View>
        ))
    );
}