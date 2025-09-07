import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PackageList from "./pages/PackageList"
import PackageDetails from "./pages/PackageDetails"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PackageList />}/>
        <Route path="/packages/:id" element={<PackageDetails />}/>
      </Routes>
    </Router>
  );
}

export default App;