import { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from './components/Menu/Menu';
import PlantList from './components/PlantList/PlantList';
import PestList from './components/PestList/PestList';
import TaskList from './components/TaskList/TaskList';
import Admin from './components/Admin/Admin';
import Header from './components/Header/Header';
import PlantPage from './components/PlantPage/PlantPage';

function App() {
  const [activeItemMenu, setActiveItemMenu] = useState('');

  const handleChangeMenuItem = (value) => {
    setActiveItemMenu(value);
  };

  return (
    <div>
      <Router>
        <Header />
        <div className='main-div'>
          <Menu setMenuItem={handleChangeMenuItem} />
          <Routes>
            <Route
              path='/'
              element={
                activeItemMenu == 'pests' ? (
                  <PestList />
                ) : activeItemMenu == 'tasks' ? (
                  <TaskList />
                ) : activeItemMenu == 'admin' ? (
                  <Admin />
                ) : (
                  <PlantList />
                )
              }
            />

            <Route path='/plants/:id' element={<PlantPage />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
