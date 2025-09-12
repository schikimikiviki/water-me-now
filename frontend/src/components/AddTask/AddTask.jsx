import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import UploadImage from '../UploadImage/UploadImage';

// this is for adding a big boy task, eg. "Prepare for winter"
const AddTask = () => {
  const [name, setName] = useState('');
  const [imageFile, setImageFile] = useState('');
  const [todo, setTodo] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');
  const [postCompleted, setIsPostCompleted] = useState(false);
  const [isRepeated, setIsRepeated] = useState(false);
  const [repetition, setRepetition] = useState('WEEKLY');

  const handleTodoChange = (e) => {
    setTodo(e.target.value);
  };

  const handleIsRepeatedChange = (e) => {
    setIsRepeated(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleDateChange = (e) => {
    //console.log(e.target.value);
    setDate(e.target.value);
  };

  const handleRepetitionChange = (e) => {
    setRepetition(e.target.value);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('imageFile', imageFile);
    formData.append('todo', todo);
    formData.append('date', date);
    formData.append('isRepeated', isRepeated);
    formData.append('repetition', repetition);

    console.log('Posting with this data :');
    for (var pair of formData.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }

    try {
      const response = await api.post('/tasks/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      console.log('Task added:', response.data);
      setMessage('Task added successfully! 🌷');

      setTimeout(() => {
        document.querySelector('.message').classList.add('fade-out');
        setTimeout(() => setMessage(''), 500);
      }, 4500);

      //reset fields
      setName('');
      setImageFile('');
      setTodo('');
      setDate('');
      setIsPostCompleted(true);
    } catch (error) {
      console.error('Error adding task:', error);
      setMessage('Error posting to the database. ❌');
      setTimeout(() => {
        document.querySelector('.message').classList.add('fade-out');
        setTimeout(() => setMessage(''), 500);
      }, 4500);
    }
  };

  const handleUpload = (e) => {
    setIsPostCompleted(false);
    setImageFile(e);
  };

  return (
    <div>
      <div className='message-container'>
        {message.length > 0 && (
          <div
            className={`message ${message.length > 0 ? 'fade-in' : 'fade-out'}`}
          >
            {message}
          </div>
        )}
      </div>
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
        <UploadImage
          id='upload2'
          onUploadImage={handleUpload}
          postCompleted={postCompleted}
        />
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
        <label htmlFor='isRepeated'>Is this task a repeated task ?</label>
        <select
          value={isRepeated}
          onChange={handleIsRepeatedChange}
          name='isRepeated'
          id='isRepeated'
        >
          <option value='true'>yes</option>
          <option value='false'>no</option>
        </select>

        <hr className='hr-styled' />
        <label htmlFor='repetition'>Choose repetition cycle:</label>
        <select
          value={repetition}
          onChange={handleRepetitionChange}
          name='repetition'
          id='repetition'
        >
          <option value='WEEKLY'>Weekly</option>
          <option value='DAILY'>Daily</option>
          <option value='MONTHLY'>Monthly</option>
          <option value='EVERY_QUARTER'>Every quarter</option>
        </select>
        <br />
        <br />
        <hr className='hr-styled' />
        <button type='submit'>Post</button>
      </form>
    </div>
  );
};

export default AddTask;
