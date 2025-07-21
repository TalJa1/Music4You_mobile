/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import React, { useState, useRef } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AppColor from '../../services/styles/AppColor';

const ChatTabView = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I am your AI music assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { sender: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'bot', text: 'This is a placeholder response. (Connect to AI API for real answers!)' }]);
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 800);
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.chatArea}
          contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((msg, idx) => (
            <View key={idx} style={[styles.message, msg.sender === 'user' ? styles.userMsg : styles.botMsg]}>
              <Text style={msg.sender === 'user' ? styles.userText : styles.botText}>{msg.text}</Text>
            </View>
          ))}
        </ScrollView>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            placeholderTextColor={AppColor.textSecondary}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend} disabled={!input.trim()}>
            <Icon name="send" size={24} color={input.trim() ? AppColor.buttonText : AppColor.textSecondary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatTabView;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColor.background,
  },
  container: {
    flex: 1,
    backgroundColor: AppColor.background,
    justifyContent: 'flex-end',
  },
  chatArea: {
    flex: 1,
    backgroundColor: AppColor.card,
    borderRadius: 12,
    margin: 12,
    marginBottom: 10,
  },
  message: {
    marginBottom: 12,
    maxWidth: '80%',
    borderRadius: 10,
    padding: 10,
  },
  userMsg: {
    alignSelf: 'flex-end',
    backgroundColor: AppColor.primary,
  },
  botMsg: {
    alignSelf: 'flex-start',
    backgroundColor: AppColor.border,
  },
  userText: {
    color: AppColor.buttonText,
    fontSize: 16,
  },
  botText: {
    color: AppColor.text,
    fontSize: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: AppColor.background,
    borderTopWidth: 1,
    borderColor: AppColor.border,
  },
  input: {
    flex: 1,
    backgroundColor: AppColor.card,
    color: AppColor.text,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: AppColor.border,
    marginRight: 8,
  },
  sendBtn: {
    backgroundColor: AppColor.primary,
    borderRadius: 20,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
