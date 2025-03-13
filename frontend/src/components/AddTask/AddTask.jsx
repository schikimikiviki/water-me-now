import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import UploadImage from '../UploadImage/UploadImage';

// this is for adding a big boy task, eg. "Prepare for winter"
const AddTask = () => {
  const [name, setName] = useState('');
  const [imageFile, setImageFile] = useState('');
  const [todo, setTodo] = useState('');
  const [date, setDate] = useState('');

  const handleTodoChange = (e) => {
    setTodo(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('imageFile', imageFile);
    formData.append('todo', todo);
    formData.append('date', date);

    console.log('Posting with this data :');
    for (var pair of formData.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }

    try {
      const authToken = localStorage.getItem('authToken');

      const response = await api.post('/tasks/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Basic ${authToken}`,
        },
      });
      console.log('Task added:', response.data);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleUpload = (e) => {
    console.log('bbbb');
    setImageFile(e);
  };

  return (
    <div>
      <h2> ✨ Add a new task ✨</h2>
      <form className='form-add' onSubmit={handleAddTask} role='form'>
        <input
          type='text'
          id='name'
          name='name'
          placeholder='Enter a task name'
          value={name}
          onChange={handleNameChange}
          required
        />
        <UploadImage id='upload2' onUploadImage={handleUpload} />
        <hr className='hr-styled' />
        <input
          type='text'
          id='todo'
          name='todo'
          placeholder='Enter a todo'
          value={todo}
          onChange={handleTodoChange}
          required
        />
        <hr className='hr-styled' />
        <label>Select a Date 📅</label>
        <input type='date' value={date} onChange={handleDateChange} />

        <hr className='hr-styled' />
        <br />

        <button type='submit'>Post</button>
      </form>
    </div>
  );
};

export default AddTask;
