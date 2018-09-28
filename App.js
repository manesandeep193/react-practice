import React, { Component, Fragment } from 'react';
// We use Pure Component when we do not need to call render function if states are same
//import React, { Component, Fragment, PureComponent } from 'react';
import './App.css';
import User from './component/user';
import UniqueId from 'react-html-id';
import Child from './component/child';
import SimpleForm from './component/forms';

// All import function are hoisted so even if we add at bottom it works
// All imports are single ton and they are live means once one value is incremented by one component
// other compoennt will see d new value
// names imports
import { add, substraction } from './component/importPractice';
// or
//import * as importPractice from './component/importPractice';
// {importPractice.add(1,2)}

// import annonymous function
// try to use single export in annonymous function
// import mul from 'path of file' ---> single export
// import mul, {x} from 'path of file --> multiple export
/*export default (x, y) => {
  return x*y;
}
export let x = 1;
import Car from ''
export default class Car {
  constructor(name){
    this.name = name;
  }
}
*/

// Rounting
//1. Install react-router-dom
//2. Import BrowserRouter & Route
//3. Wrap your app in Router tag
// 4. Use nav link for styling active visited link
import {BrowserRouter as Router, Link, NavLink, Redirect, Prompt} from 'react-router-dom';
import Route from 'react-router-dom/Route';

const Temp = () => {
  return ([
    <div key="1">Hi</div>,
    <div key="2">Hello</div>,
    <div>{ add(1,2) }</div>,
    <div>{ substraction(2,1) }</div>
  ])
}

const TempFragmanet = () => {
  return(
    <Fragment>
      <div>Hi Fragment</div>
      <div>Hello Fragment</div>
    </Fragment>
  )  
}
const DetailsPage = (params) => {  
  return(
    <p><b>Welcome {params.username}</b></p>
  )
}
const NoRenders = (props) => {
  console.log('render Pure component')
  return (
    <div>{props.val}</div>
  )
}
//class App extends PureComponent
class App extends Component {
  state = {
    users: [
      {
        id: '1',
        name:'John',
        age: 30,
      }    
    ]
  }
  constructor(){
    super();
    console.log('life cycle - constructor only once---parent');
    UniqueId.enableUniqueIds(this);    
    this.state = {
      users: [
        {
          id: this.nextUniqueId(),
          name:'John',
          age: 30,
        },
        {
          id: this.nextUniqueId(),
          name:'Jill',
          age: 40,
        },
        {
          id: this.nextUniqueId(),
          name:'Hill',
          age: 50,
        }
      ],
      val:1,
      loggedIn: false
    }
    //console.log(this.state);
  }
  componentWillMount(){
    if(window.innerWidth > 500 ){
      this.setState({innerWidth: window.innerWidth});
    }
    console.log('life cycle - componentWillMount only once-parent');
  }
  componentDidMount(){
    console.log('life cycle - componentDidMount only once-parent');

    // any ajax or asynch call goes here
    /*setInterval(() =>{
      this.setState(() =>{
        return {val:1}
      });
    },2000); */   
  }
  shouldComponentUpdate(nextProps, nextState){
    console.log('nextProps..'+nextProps);
    console.log('nextState..'+nextState);
    console.log('life cycle - shouldComponentUpdate -parent');
    // stop rendering if state doesnt change
    //return (this.state.val == nextState.val ? false : true);
    return true;
  }
  
  componentWillUpdate(){
    console.log('life cycle - componentWillUpdate -parent');
  }
  componentDidUpdate(prevProps, prevState){
    console.log('life cycle - componentDidUpdate -parent');
  }
  unmountChild(){
    this.setState({name:'unmount'});
  }
  state = {
    users: [
      {
        id: '2',
        name:'sandeep',
        age: 30,
      }    
    ]
  }  
  /*state = {
    users: [
      {
        id: 'emp_1',
        name:'John',
        age: 30,
      },
      {
        id: 'emp_2',
        name:'Jill',
        age: 40,
      },
      {
        id:'emp_3',
        name:'Hill',
        age: 50,
      }
    ]
  }*/
  deleteUser = (index) => {
    const users = Object.assign([], this.state.users);
    users.splice(index, 1);
    this.setState({users: users});
    console.log('life cycle - changes in state-parent');
  }
  changeUserName = (id, event) => {
    const index = this.state.users.findIndex((user) =>{
      return user.id === id;
    });
    const user = Object.assign({}, this.state.users[index]);
    user.name = event.target.value;

    const users = Object.assign([], this.state.users);
    users[index] = user;
    this.setState(
      {
        users:users
      }
    );
    console.log('life cycle - changes in state-parent');
  }
  loginHandler = () => {
    const loginStatus = !this.state.loggedIn;
    this.setState(() => {
      return {loggedIn: loginStatus}
    })
  };
  render() {
    console.log('life cycle - render--parent');
    return (
      <Router>
        <div className="App">
          <button onClick={this.loginHandler.bind(this)}>{this.state.loggedIn ? 'Log out': 'Log in'}</button>
          <Temp></Temp>
          <TempFragmanet></TempFragmanet>
          <Child></Child>
          <NoRenders val={this.state.val}></NoRenders>
          {this.state.innerWidth}
          <Route path="/" exact render={
            ()=>{
              return (<h1>Welcome Home...Please login to view profile of users</h1>)
            }
          }>
          </Route>
          <Route path="/about" exact strict render={
            ()=>{              
              // Use /about/ & /about/me to understand strict, exact
              return (<h1>Welcome About</h1>)
            }
          }>
          </Route>
          <Route path="/component" exact component={TempFragmanet}></Route>
          <Route path="/user/:username" exact strict render={
            ({match})=>(
              this.state.loggedIn ? (<DetailsPage username={match.params.username}/>) : (<Redirect to="/"/>)
            )}/>            
          <Link to="/about">About</Link>
          <NavLink to="/user/john"
            activeStyle={
              {color:'green',fontWeight:'bold'}
            }>
            User John
          </NavLink>
          <NavLink to="/user/jill">User Jill</NavLink>
          <Prompt
            when={!this.state.loggedIn}
            //message='Are you sure'
            message = {(location) => {
              return (location.pathname.startsWith('/user')) ? 'Are you sure': true;
            }}
          />
          <ul>
            {
              this.state.users.map((user, index) => {
                return (<User 
                    deltEvent = {this.deleteUser.bind(this, index)}
                    changeName = {this.changeUserName.bind(this, user.id)} 
                    age = {user.age}
                    key = {user.id}>
                    {user.name}
                  </User>
                );
              })
            }
          </ul>
          <SimpleForm/>
        </div>
      </Router>      
    );
  }
}

export default App;
