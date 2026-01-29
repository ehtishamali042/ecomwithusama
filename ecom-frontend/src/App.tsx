import { BrowserRouter as Router } from "react-router-dom";
import MainRoutes from "./pages/MainRoutes";

function App() {
  return (
    <Router>
      <MainRoutes />
    </Router>
  );
}

export default App;
