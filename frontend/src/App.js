import React from 'react';
// import { render } from 'react-dom';
import './App.css';

class App extends React.Component{
  constructor(props){
    super(props);
      this.state = {
        todoList:[],
        activeItem:{
          id:null,
          title:'',
          complete:false,
        },
        editing:false,
      }
      this.fetchTasks = this.fetchTasks.bind(this)
      this.handleChange=this.handleChange.bind(this)
      this.handleSubmit=this.handleSubmit.bind(this)
      this.startEdit=this.startEdit.bind(this)
      this.deleteItem=this.deleteItem.bind(this)
      this.strike=this.strike.bind(this)
  };

  
  componentWillMount(){
    this.fetchTasks()
  }

  fetchTasks(){
    console.log('hello')

    fetch('http://127.0.0.1:8000/api/task-list/')
    .then(response => response.json())
    .then(data =>
      this.setState({
        todoList:data
      })
      // console.log('Data:',data)
      )
  }
  handleChange(e){
    var name = e.target.name
    var value = e.target.value
    console.log('name',name)
    console.log('value',value)

    this.setState({
      activeItem:{
        ...this.state.activeItem,
        title:value
      }
    })
  }

  handleSubmit(e){
    e.preventDefault()
    console.log('ITEM:', this.state.activeItem)


    var url ='http://127.0.0.1:8000/api/task-create'


    if(this.state.editing === true){
      var li ='http://127.0.0.1:8000/api/task-update/'+ this.state.activeItem.id
      url = li
      this.setState({
        editing:false
      })
    }




    fetch(url, {
      method:'POST',
      headers:{
        'Content-type':'application/json',
        // 'X-CSRFToken': csrftoken,
      },
      body:JSON.stringify(this.state.activeItem),
    }).then((response) => {
      this.fetchTasks()
      this.setState({
        activeItem:{
          id:null,
          title:'',
          complete:false,
        },
      }).catch(function(error){console.log('ERROR:',error)})
    })
  }

  startEdit(task){
    this.setState({
      activeItem:task,
      editing:true,
    })
  }

  deleteItem(task){
    var ll ='http://127.0.0.1:8000/api/task-delete/'+task.id
    
    fetch(ll,{
      method:'DELETE',
      headers:{
        'Content-type':'application/json',
      },

    }).then((response) =>{
      this.fetchTasks()
    } )
  }

  strike(task){
    task.complete =! task.complete
    // task.complete =false
    var ll ='http://127.0.0.1:8000/api/task-update/'+task.id
    var url = ll
    fetch(url,{
      method:'POST',
      headers:{
        'content-type':'application/json',
      },
      body:JSON.stringify({'completed':task.complete, 'title':task.title})
    }).then(()=>{
      this.fetchTasks()
    })
    
    console.log('Task:', task.complete)

  }

  render(){
    var tasks = this.state.todoList
    var self = this
    return(
      <div className='container' >
        <div id='task-container' >
          <div id='form-wrapper' >
            <form onSubmit={this.handleSubmit} id='form'>
              <div className='flex-wrapper' >
                <div style={{flex:6}} >
                  <input onChange={this.handleChange} className='form-control' id='title' value={this.state.activeItem.title} type="text" name="title" placeholder="Add task" />
                </div>
                <div style={{flex: 1}} >
                  <input id='submit' className='btn btn-warning' type="submit" name="Add"  />
                </div>
              </div>
            </form>
          </div>
          <div id='list-wrapper' >
            {tasks.map(function(task, index){
              return(
                <div key={index} className="task-wrapper flex-wrapper" >
                  <div onClick={()=> self.strike(task)} style={{flex:7}}  >
                    {task.complete === true?(
                      <strike>{task.title}</strike>
                    ):(
                      <span>{task.title}</span>
                    )
                  }
                  {/*  */}

                    
                  </div>
                  <div style={{flex:1}} >
                    <button onClick={()=> self.startEdit(task)} className='btn btn-sm btn-outline-info'>Edit</button>
                  </div>
                  <div style={{flex:1}} >
                  <button onClick={()=> self.deleteItem(task)} className='btn btn-sm btn-outline-dark delete'>delete</button>
                  </div>
                </div>
              )
            })


            }

      
          </div>
        </div>

      </div>
    )
  }
}


export default App;
