import {useState} from 'react'
import Modal from './Modal'
import axios from 'axios'


const ListItem =({task, getData}) => {
  const [showModal, setShowModal]=useState(false)

  axios.defaults.withCredentials = true;
  const deleteItem = async () => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_SERVERURL}/todos/${task.id}`);
      if (response.status === 200) {
        getData();
      }
    } catch (error) {
      console.error(error);
    }
  };


  // completed or not
  axios.defaults.withCredentials = true;
  const updateTaskStatus = async (isChecked) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_SERVERURL}/todos/${task.id}/status`,
        {
          completed: isChecked,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.status === 200) {
        getData(); // Refresh data after updating
      }
    } catch (error) {
      console.error(error);
    }
  };



  // Ensure task.completed is always a boolean (not undefined)
  const completedStatus = task.completed === undefined ? false : task.completed;

    return (
      <li className="list-item">

      <div className="info-container">
        <label className="checkbox-container">
          <input
            type="checkbox"
            className="checkbox-input"
            checked={completedStatus} // Reflect the task's completion status
            onChange={(e) => updateTaskStatus(e.target.checked)} // Update task status when checkbox is toggled
          />
          <p className="task-title">{task.title}</p>
        </label>
      </div>
 
        <div className="button-container">
          <button className="edit" onClick={()=>setShowModal(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
          </button>
          <button className="delete" onClick={deleteItem}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
          </button>
        </div>

        {showModal && <Modal mode={'edit'} setShowModal={setShowModal} getData={getData} task={task}/>}
      </li>
    );
  }
  
  export default ListItem;
