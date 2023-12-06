import React from 'react';
import { WebView } from 'react-native-webview';

const KakaoMapScreen = () => {
  return (
    <WebView
      source={{ uri: 'https://localhost:8000/your-map-page.html' }}
      style={{ flex: 1 }}
    />
  );
};

export default KakaoMapScreen;