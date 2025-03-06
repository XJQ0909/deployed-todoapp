import {useState} from 'react'
import {useCookies} from 'react-cookie'
import axios from 'axios';

const Auth =() => {
  const[cookies, setCookie, removeCookie] = useCookies(null)
  const[isLogin, setIsLogin] = useState(true)

  const[username,setUsername] = useState(null)
  const[password, setPassword] = useState(null)
  const[confirmPassword, setConfirmPassword]=useState(null)

  const[error,setError] = useState(null)

  const viewLogin = (status ) =>{
    setError(null)
    setIsLogin(status)
  }

  const handleSubmit = async (e,endpoint)=>{
    e.preventDefault()
    if(!isLogin && password !==confirmPassword){
      setError('Make sure passwords match')
      return
    }

    // const response = await fetch(`${process.env.REACT_APP_SERVERURL}/${endpoint}`,{
    //   method: 'POST',
    //   headers: {'Content-Type':'application/json'},
    //   body: JSON.stringify({username,password})
    // })

    axios.defaults.withCredentials = true;
    const response = await axios.post(
      `${process.env.REACT_APP_SERVERURL}/${endpoint}`,
      { username, password },
      { headers: { 'Content-Type': 'application/json' } }
    );

    //const data = await response.json()
    const data = response.data;
    console.log(data)

    if(data.detail){
      setError(data.detail)
    }else{
      setCookie('Username',data.username)
      setCookie('AuthToken',data.token)

      window.location.reload()
    }
   

  }
  
    return (
      <div className ="auth-container">
        <div className ="auth-container-box">
          <form>
            <h2>{isLogin?'Please log in':'Please sign up'}</h2>
              <input 
              type="username" 
              placeholder="username" 
              id="username" 
              onChange={(e)=>setUsername(e.target.value)}/>

              <input 
              type="password" 
              placeholder="password" 
              id="password" 
              onChange={(e)=>setPassword(e.target.value)}
              />
              {!isLogin && 
              <input 
              type="password" 
              placeholder="confirm your password" 
              id="passwordconfirm"
              onChange={(e)=>setConfirmPassword(e.target.value)}
              />}
              <input type="submit" className="create" id="submit" onClick={(e)=>handleSubmit(e,isLogin?'login':'signup')}/>
             {error && <p>{error}</p>} 
          </form>

          <div className="auth-options">
            <button onClick={()=>viewLogin(false)}>Sign Up</button>
            <button onClick={()=>viewLogin(true)}>Login</button>
          </div>

        </div>
      </div>
    );
  }
  
  export default Auth;