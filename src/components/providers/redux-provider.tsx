"use client";

import { store } from "@/store/store";
import { Provider } from "react-redux";
import MainProvider from "./main-provider";

interface ReduxProviderProps {
  children: React.ReactNode;
}

export default function ReduxProvider({ children }: ReduxProviderProps) {
  return (
    <Provider store={store}>
      <MainProvider>{children}</MainProvider>
    </Provider>
  );
}
