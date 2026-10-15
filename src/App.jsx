import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Productos from './pages/Productos';
import Ofertas from './pages/Ofertas';
import Carrito from './pages/Carrito';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Productos /> } />
        <Route path="/ofertas" element={<Ofertas /> } />
        <Route path="/carrito" element={<Carrito /> } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;