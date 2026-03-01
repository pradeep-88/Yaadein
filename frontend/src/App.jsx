import React from 'react';
import AppRouter from "./router/index";
import { Toaster } from 'react-hot-toast';
import { ConfirmDialogProvider } from './ConfirmDialogContext'; // ✅ global confirm provider

function App() {
  return (
    <ConfirmDialogProvider>
      <Toaster position="top-right" />
      <AppRouter />
    </ConfirmDialogProvider>
  );
}

export default App;
