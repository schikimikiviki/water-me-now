import { useState } from 'react';
import './App.css';
import Menu from './components/Menu/Menu';
import PlantList from './components/PlantList/PlantList';
import PestList from './components/PestList/PestList';
import TaskList from './components/TaskList/TaskList';
import Admin from './components/Admin/Admin';
import Header from './components/Header/Header';

function App() {
  const [activeItemMenu, setActiveItemMenu] = useState('');

  const handleChangeMenuItem = (value) => {
    setActiveItemMenu(value);
    console.log(value);
  };

  return (
    <div>
      <Header />
      <div className='main-div'>
        <Menu setMenuItem={handleChangeMenuItem} />
        {activeItemMenu == 'plants' ? (
          <PlantList />
        ) : activeItemMenu == 'pests' ? (
          <PestList />
        ) : activeItemMenu == 'tasks' ? (
          <TaskList />
        ) : (
          <Admin />
        )}
      </div>
    </div>
  );
}

export default App;
