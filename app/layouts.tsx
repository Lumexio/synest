import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="home"
        options={{
          // Hide the header for all other routes.
          headerShown: false,
        }}
      />
    </Stack>
  );
}
