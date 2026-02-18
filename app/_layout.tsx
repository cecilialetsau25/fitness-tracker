import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "./store";

export default function RootLayout() {
  return (
    <Provider store={store}>
      {/* This ensures NO headers appear anywhere by default */}
      <Stack screenOptions={{ headerShown: false }} />
    </Provider>
  );
}
