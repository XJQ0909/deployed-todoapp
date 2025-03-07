import ListHeader  from "./components/ListHeader";
import ListItem from "./components/ListItem"
import Auth from './components/Auth'
import { useEffect, useState} from 'react'
import {useCookies} from 'react-cookie'
import axios from 'axios';

const App =() => {
  const [cookies,setCookie, removeCookie] =useCookies(null)
  const authToken = cookies.AuthToken
  const userName = cookies.Username
  
  const [ tasks, setTasks] = useState(null)
  
  const getData = async () =>{
  
    try {
      // const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todos/${userName}`)
      // const json = await  response.json()
      // setTasks(json)

      axios.defaults.withCredentials = true;
      const response = await axios.get(`${process.env.REACT_APP_SERVERURL}/todos/${userName}`);
      setTasks(response.data);
      
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(()=>{
    if(authToken){
      getData()
    }},[])

  //console.log(tasks)

  //sort by date
  const sortedTasks = tasks?.sort((a,b) => new Date(a.date)- new Date(b.date))

  return (
    <div className="app">
      {!authToken && <Auth/>}

      { authToken && 
      <>
        <ListHeader listName ={'To-Do List'} getData={getData}/>
        <p>Welcome back {userName}</p>
        {sortedTasks?.map((task) => <ListItem key={task.id} task={task} getData={getData}/>)}
        </>}
      
      
    </div>
  );
}

export default App;
