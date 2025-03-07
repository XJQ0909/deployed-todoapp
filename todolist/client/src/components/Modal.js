import {useState} from 'react'
import {useCookies} from 'react-cookie'
import axios from 'axios'

const Modal =({mode,setShowModal, getData,task}) => {
  const [cookies,setCookie, removeCookie] =useCookies(null)
 
  const editMode= mode==='edit'? true:false;

  const [data, setData] = useState({
    user_name: editMode?task.user_name:cookies.Username,
    title: editMode ? task.title:"",
    completed: editMode ? task?.completed:false ,
    date: editMode?task.date:new Date()
  })


  const postData = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVERURL}/todos`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.status === 200) {
        console.log('WORKED');
        setShowModal(false);
        getData();
      }
    } catch (error) {
      console.error(error);
    }
  };



  const editData = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_SERVERURL}/todos/${task.id}`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.status === 200) {
        setShowModal(false);
        getData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) =>{
  
    const{name,value} = e.target
    setData(data=>({
      ...data,
      [name]:value
    }))
    console.log(data)
  }

    return (
      <div className ="overlay">
        <div className="modal">
          <div className="form-title-container">
            <h3>let's {mode} your task</h3>
            <button onClick ={()=>setShowModal(false)}> X </button>
          </div>

          <form>
            <input
              required
              maxLength={30}
              placeholder="List item"
              name = "title"
              value = {data.title}
              onChange ={handleChange}
            />
            <br/>
           
            <input className={mode}
            type="submit" onClick={editMode?editData:postData}/>
          </form>

        </div>
      </div>
    );
  }
  
  export default Modal;
