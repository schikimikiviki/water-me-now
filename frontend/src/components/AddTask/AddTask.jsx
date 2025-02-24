import { useState, useEffect } from 'react';

// this is for adding a big boy task, eg. "Prepare for winter"
const AddTask = ({ plantListFromParent }) => {
  const [plantList, setPlantList] = useState([]);
  const [name, setName] = useState('');
  const [imageFile, setImageFile] = useState('');
  const [todo, setTodo] = useState('');
  const [date, setDate] = useState('');

  //TODO: Plant tasks need to be added in form
  //

  useEffect(() => {
    console.log('Received plant list:', plantListFromParent);
    setPlantList(plantListFromParent);
  }, [plantListFromParent]);

  const handleTodoChange = (e) => {
    setTodo(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleAddTask = async (e) => {};

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
        <label htmlFor='imageFile' className='custom-file-upload'>
          Choose Image
        </label>
        <input
          type='file'
          id='imageFile'
          name='imageFile'
          accept='image/*'
          onChange={(e) => setImageFile(e.target.files[0])}
          required
          style={{ display: 'none' }} // Hide default input
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
        <br />

        <button type='submit'>Post</button>
      </form>
    </div>
  );
};

export default AddTask;
