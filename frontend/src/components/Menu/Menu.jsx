import { useState } from 'react';
import './Menu.css';

function Menu({ setMenuItem }) {
  const [activeComponent, setActiveComponent] = useState('plants');

  const clickOnMenu = (value) => {
    // console.log(value);
    setActiveComponent(value);
    setMenuItem(value);
  };

  return (
    <div className='menu-div'>
      <button onClick={() => clickOnMenu('plants')}>Plants</button>
      <button onClick={() => clickOnMenu('tasks')}>Tasks</button>
      <button onClick={() => clickOnMenu('pests')}>Common pests</button>
      <button onClick={() => clickOnMenu('admin')}>Admin area</button>
    </div>
  );
}

export default Menu;
