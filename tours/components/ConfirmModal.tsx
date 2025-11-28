import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type Props = {
  visible: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({ visible, title = 'Confirmar', message = '', confirmText = 'OK', cancelText = 'Cancelar', onConfirm, onCancel }: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.backdrop}>
        <View style={styles.box}>
          <Text style={styles.title}>{title}</Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}

          <View style={styles.buttons}>
            <TouchableOpacity style={[styles.btn, styles.btnCancel]} onPress={onCancel}>
              <Text style={styles.btnCancelText}>{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.btn, styles.btnConfirm]} onPress={onConfirm}>
              <Text style={styles.btnConfirmText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  box: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    elevation: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  message: {
    color: '#444',
    marginBottom: 16,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  btn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnCancel: {
    backgroundColor: '#f1f1f1',
  },
  btnConfirm: {
    backgroundColor: '#e11d48',
  },
  btnCancelText: {
    color: '#333',
    fontWeight: '600',
  },
  btnConfirmText: {
    color: '#fff',
    fontWeight: '600',
  },
});
