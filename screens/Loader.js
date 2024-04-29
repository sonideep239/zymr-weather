import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native';

const Loader = ({ visible }) => {
    return (
        <Modal
            transparent={true}
            animationType="none"
            visible={visible}
        >
            <View style={styles.container}>
                <View style={styles.loader}>
                    <Text style={styles.loaderText}>Please Wait ....</Text>
                    <ActivityIndicator color={"#0000ff"} />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000bb',
    },
    loader: {
        minWidth: "50%",
        flexDirection: 'row',
        width: 80,
        height: 80,
        backgroundColor: 'white',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loaderText: {
        color: '#000',
        paddingHorizontal: 10
    }
});

export default Loader;
