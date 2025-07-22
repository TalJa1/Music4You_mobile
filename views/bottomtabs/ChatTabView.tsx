/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView, StatusBar } from 'react-native';
import Markdown from 'react-native-markdown-display';
import React, { useState, useRef } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AppColor from '../../services/styles/AppColor';

const ChatTabView = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I am your AI music assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setMessages(prev => [...prev, { sender: 'bot', text: 'Thinking...' }]);
    scrollViewRef.current?.scrollToEnd({ animated: true });

    try {
      const response = await fetch('https://api.lenguyenbaolong.art/api/v1/chats_openai/07e10f265e6411f0ae912ec3e04057e5/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ragflow-Y3YzI5M2Q0MjdlZjExZjBiMDBkNzZlNT',
        },
        body: JSON.stringify({
          model: 'deepseek-chat@DeepSeek',
          messages: [{ role: 'user', content: userMsg.text }],
          max_tokens: 2048,
          stream: false,
        }),
      });
      const data = await response.json();
      let botReply = 'No response.';
      if (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
        botReply = data.choices[0].message.content;
      }
      setMessages(prev => {
        // Remove the loading message and add the real reply
        const msgs = prev.slice(0, -1);
        return [...msgs, { sender: 'bot', text: botReply }];
      });
      scrollViewRef.current?.scrollToEnd({ animated: true });
    } catch (err) {
      setMessages(prev => {
        // Remove the loading message and add error
        const msgs = prev.slice(0, -1);
        return [...msgs, { sender: 'bot', text: 'An error occurred while calling the API.' }];
      });
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={AppColor.background} />
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.chatArea}
          contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((msg, idx) => (
            <View key={idx} style={[styles.message, msg.sender === 'user' ? styles.userMsg : styles.botMsg]}>
              {msg.sender === 'user' ? (
                <Text style={styles.userText}>{msg.text}</Text>
              ) : (
                <Markdown
                  style={{
                    body: styles.botText,
                    code_inline: {
                      color: '#333',
                      backgroundColor: '#f5f5f5',
                      fontSize: 16,
                      borderRadius: 4,
                      padding: 2,
                    },
                    code_block: {
                      color: '#333',
                      backgroundColor: '#f5f5f5',
                      fontSize: 16,
                      borderRadius: 4,
                      padding: 8,
                    },
                  }}
                >
                  {msg.text}
                </Markdown>
              )}
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
