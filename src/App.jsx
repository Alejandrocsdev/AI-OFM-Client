// CSS
import './assets/css/fonts.css';
import './assets/css/global.css';
// Libraries
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// Components
import Layout from './components/Layout';
// Pages
import Home from './pages/Home';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
