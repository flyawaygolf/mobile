import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, Dialog, Portal, RadioButton, Text, TouchableRipple } from "react-native-paper";

import { modifI } from "../../Screens/Profile/ProfileEditScreen";
import { handicapNumbersFloat, handicapNumbersInt } from "../../Services/handicapNumbers";
import styles from "../../Style/style";

type PropsType = {
    handicap: number;
    visible: boolean;
    hideModal: () => void;
    setModif: (params: modifI) => void;
    modif: modifI;
}

const HandicapModal = ({ handicap, visible, hideModal, setModif, modif }: PropsType) => {
    const [hcp, setHcp] = useState<{
        int: number,
        float: number;
    }>({
        int: Math.floor(parseFloat(((handicap) / 10).toFixed(1))),
        float: parseFloat(((handicap - Math.floor(handicap)) / 10).toFixed(1)),
    });

    const displayHCP = () => {
        if (hcp.int < 0) return `+${(hcp.float - hcp.int)}`;
        else return hcp.float + hcp.int;
    }

    const displayIntHCP = (hcp: number) => {
        if (hcp < 0) return `+${-(hcp)}`;
        else return hcp;
    }

    const confirm = () => {
        let to_register = 0;

        if (hcp.int < 0) to_register = -(hcp.float - hcp.int) * 10;
        else to_register = (hcp.float + hcp.int) * 10;

        setModif({ ...modif, golf_info: { ...modif.golf_info, handicap: to_register } })
        hideModal()
    }

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={hideModal}>
                <Dialog.Title style={{
                    textAlign: 'center',
                }}>{displayHCP()}</Dialog.Title>
                <Dialog.ScrollArea style={{ paddingHorizontal: 0, flexDirection: "row" }}>
                    <ScrollView style={{ paddingHorizontal: 24, height: 200, margin: 10 }}>
                        {
                            handicapNumbersInt.map((v, idx) => (
                                <TouchableRipple key={idx} onPress={() => setHcp({ ...hcp, int: v })}>
                                    <View style={styles.row}>
                                        <View pointerEvents="none">
                                            <RadioButton
                                                value={v.toFixed(1)}
                                                status={hcp.int === v ? 'checked' : 'unchecked'}
                                            />
                                        </View>
                                        <Text style={{ paddingLeft: 8 }}>{displayIntHCP(v)}</Text>
                                    </View>
                                </TouchableRipple>
                            ))
                        }
                    </ScrollView>
                    <ScrollView style={{ paddingHorizontal: 24, height: 200, margin: 10 }}>
                        {
                            handicapNumbersFloat.map((v, idx) => (
                                <TouchableRipple disabled={hcp.int === 54} key={idx} onPress={() => setHcp({ ...hcp, float: v })}>
                                    <View style={styles.row}>
                                        <View pointerEvents="none">
                                            <RadioButton
                                                disabled={hcp.int === 54}
                                                value={v.toFixed(1)}
                                                status={hcp.float === v ? 'checked' : 'unchecked'}
                                            />
                                        </View>
                                        <Text disabled={hcp.int === 54} style={{ paddingLeft: 8 }}>{v}</Text>
                                    </View>
                                </TouchableRipple>
                            ))
                        }
                    </ScrollView>
                </Dialog.ScrollArea>
                <Dialog.Actions>
                    <Button onPress={() => hideModal()}>Cancel</Button>
                    <Button onPress={() => confirm()}>Confirm</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}

export default HandicapModal;
