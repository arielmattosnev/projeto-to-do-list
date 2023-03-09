import { useEffect,useState } from "react"
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill } from "react-icons/bs";

const API = "http://localhost:5000"

function App() {
''
  const [title, setTitle] = useState("")
  const [time, setTime] = useState("")
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadData = async() => {
      setLoading(true)

      const res = await fetch(API + "/todos").then(res => res.json()).then(data => data).catch(e => console.log(e))
    
      setLoading(false)

      setTodos(res)
    
    }

    loadData()

  }, [])
  
  const handleSubmit = async(e) => {
    e.preventDefault()
    
    const todo = {
      id: Math.random(),
      title,
      time,
      done: false
    }

    await fetch(API + "/todos", {
      method: "POST",
      body: JSON.stringify(todo),
      headers: {
        "Content-type": "application/json"
      }
    })

    setTodos((prevState) => [...prevState, todo])
    
    setTitle("")
    setTime("")
  }

  const handleDelete = async(id) => {
    await fetch(API + "/todos/" + id, {
      method: "DELETE",
      })

      setTodos((prevState) => prevState.filter((todo) => todo.id !== id))
  }

  const handleEdit = async(todo) => {
    todo.done = !todo.done

    const data = await fetch(API + "/todos/" + todo.id, {
      method: "PUT",
      body: JSON.stringify(todo),
      headers: {
        "Content-type": "application/json"
      }
      })

      setTodos((prevState) => prevState.map((t) => (t.id === data.id ? (t = data) : t)))
  }


  if(loading) {
    return <p>Carregando...</p>
  }
  
  return (
    <div className="w-2/5 my-8 mx-auto bg-gray-600 rounded-md text-white font-bold">

      <div className="p-2 border-b-2 border-gray-600 text-center">
        <h1 className="m-0 text-3xl">React to do</h1>
      </div>

      <div className="">
        <h2 className="text-2xl ml-2 mb-4 text-center">Insira a sua próxima tarefa:</h2>
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col items-center justify-center space-y-2 mb-4">
              <label htmlFor="title">O que você vai fazer?</label>
              <input type="text" 
                     className="text-black w-8/12 h-8 p-4 rounded-lg" 
                     id="title" 
                     placeholder="Titulo da tarefa" 
                     onChange={(e) => setTitle(e.target.value)} value={title || ""} 
                     required/>
            </div>
        </form>
      </div>

      <div className="">
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col items-center justify-center space-y-2 mb-4">
              <label htmlFor="time">Duração:</label>
              <input type="text" 
                     className="text-black w-8/12 h-8 p-4 rounded-lg" 
                     id="time" 
                     placeholder="Duração da tarefa" 
                     onChange={(e) => setTime(e.target.value)} value={time || ""} 
                     required/>
              <button type="submit" className="w-auto h-auto md:w-1/4 p-2 mt-3 bg-gray-800 hover:bg-gray-900 rounded-lg" onSubmit={handleSubmit}>Criar tarefa</button>
            </div>
        </form>
      </div>

      <div className="">
        <h2 className="text-2xl ml-2 mb-4 text-center">Lista de tarefas:</h2>
        {todos.length === 0 && <p>Não há tarefas adicionadas!</p>}
        {todos.map((todo) => (
          <div className="flex items-center justify-center space-x-3 text-center text-xl space-y-1" key={todo.id}>
            <h3>{todo.title}</h3>
            <p>Duração:{todo.time}</p>

            <div className="flex space-x-1">
              <span className="cursor-pointer" onClick={() => handleEdit(todo)}>
                {!todo.done ? <BsBookmarkCheck /> : <BsBookmarkCheckFill />}
              </span>
              <BsTrash className="cursor-pointer" onClick={() => handleDelete(todo.id) } />
            </div>

          </div>
          ))}
      </div>

    </div>
    ) 
}

export default App
