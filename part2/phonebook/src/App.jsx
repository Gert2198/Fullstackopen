import { useState } from 'react'

const Filter = ({ onFilterChange }) => {
  return (
    <>
      filter shown with <input onChange={onFilterChange}/>
    </>
  )
}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.onSubmit}>
      <div>
        name: <input onChange={props.onNameChange}/>
      </div>
      <div>
        number: <input onChange={props.onNumberChange}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({persons, filter}) => {
  return (
    <div>
      {persons.filter((person) => person.name.toLowerCase().includes(filter.toLowerCase()))
        .map((person) => 
        <div key={person.name}>
          {person.name} {person.number}<br></br>
        </div>
      )}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [filter, setFilter] = useState('')

  const addName = (event) => {
    event.preventDefault()
    
    if (persons.map((person) => person.name).includes(newName))
      alert(`${newName} is already added to phonebook`)
    else {
      const newId = persons.length + 1
      setPersons(persons.concat({name: newName, number: newPhone, id: newId}))
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter onFilterChange={(event) => setFilter(event.target.value)}/>
      
      <h3>add a new</h3>
      
      <PersonForm 
        onSubmit={addName} 
        onNameChange={(event) => {
          setNewName(event.target.value)
        }}
        onNumberChange={(event) => {
          setNewPhone(event.target.value)
        }} />
      
      <h3>Numbers</h3>

      <Persons persons={persons} filter={filter} />
    </div>
  )
}

export default App