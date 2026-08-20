import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";

// function Home() {
//   return (
//     <main>
//       <h1 className="text-3xl font-bold underline">
//         Hello world!
//       </h1>
//     </main>
//   );
// }

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;