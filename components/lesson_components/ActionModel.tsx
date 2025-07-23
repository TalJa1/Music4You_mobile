
import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native';
import React from 'react';
import AppColor from '../../services/styles/AppColor';

interface ActionModelProps {
  visible: boolean;
  onClose: () => void;
}

const ActionModel: React.FC<ActionModelProps> = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Practice Actions</Text>
          {/* Add your action buttons or content here */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ActionModel;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    backgroundColor: AppColor.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: AppColor.accent,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: AppColor.accent,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  closeButtonText: {
    color: AppColor.buttonText,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
