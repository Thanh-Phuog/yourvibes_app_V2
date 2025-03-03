import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '@/src/context/auth/useAuth';
import useColor from '@/src/hooks/useColor';

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const { brandPrimary } = useColor();

  useEffect(() => {
    const checkAuth = async () => {
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={brandPrimary} />
      </View>
    );
  }

  return (
    <>
      {isAuthenticated ? (
        <Redirect href={'/(tabs)/home'} />
      ) : (
        <Redirect href={'/login'} />
      )}
    </>
  );
};

export default App;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Background color for loading screen
  },
});
