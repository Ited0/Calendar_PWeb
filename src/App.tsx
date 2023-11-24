import { SnackbarProvider } from "notistack";
import { AppRoutes } from "./routes";
import { ThemeProvider } from "./components/theme-provider";
import { ModalProvider } from "./components/modal-provider";

function App() {
  return (
    <SnackbarProvider
      anchorOrigin={{
        horizontal: "right",
        vertical: "bottom",
      }}
    >
      <ModalProvider>
        <ThemeProvider defaultTheme="dark" storageKey="calendar-theme">
          <AppRoutes />
        </ThemeProvider>
      </ModalProvider>
    </SnackbarProvider>
  );
}

export default App;
