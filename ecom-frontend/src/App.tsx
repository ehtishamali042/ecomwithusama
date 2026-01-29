import { BrowserRouter as Router } from "react-router-dom";
import MainRoutes from "./pages/MainRoutes";

import { useInitUser } from "@/hooks/useInitUser";
import { useEffect } from "react";

function App() {
  const { initUser } = useInitUser();

  useEffect(() => {
    initUser();
  }, [initUser]);

  return (
    <Router>
      <MainRoutes />
    </Router>
  );
}

export default App;
