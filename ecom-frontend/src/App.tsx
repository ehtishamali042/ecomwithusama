import { BrowserRouter as Router } from "react-router-dom";
import MainRoutes from "./pages/MainRoutes";
import { ToasterProvider } from "@/provider/ToasterProvider";
import { useInitUser } from "@/hooks/useInitUser";
import { useEffect } from "react";

function App() {
  const { initUser } = useInitUser();

  useEffect(() => {
    initUser();
  }, [initUser]);

  return (
    <ToasterProvider>
      <Router>
        <MainRoutes />
      </Router>
    </ToasterProvider>
  );
}

export default App;
