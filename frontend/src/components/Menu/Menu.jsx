import './Menu.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Menu({ setMenuItem }) {
  const [activeComponent, setActiveComponent] = useState('plants');
  const navigate = useNavigate();
  const location = useLocation();

  const clickOnMenu = (value) => {
    // eg when we are on some subpage
    if (location.pathname !== '/') {
      navigate('/');
    }

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
