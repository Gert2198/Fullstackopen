import { useState, useEffect } from 'react'
import personService from './services/persons'

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

const Persons = ({persons, filter, onClick}) => {
  return (
    <div>
      {persons.filter((person) => person.name.toLowerCase().includes(filter.toLowerCase()))
        .map((person) => 
        <div key={person.name}>
          {person.name} {person.number} <button onClick={() => onClick(person.id)}>delete</button><br></br>
        </div>
      )}
    </div>
  )
}

const Notification = ({ message, className }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={className}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [className, setClassName] = useState('')

  useEffect(() => {
    personService.getAll().then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])

  const addName = (event) => {
    event.preventDefault()
    
    if (persons.map((person) => person.name).includes(newName)) {
      if (!window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) return
      const person = persons.find(p => p.name === newName)
      personService.update(person.id, {id: person.id, name: person.name, number: newPhone})
        .then(updatedPerson => {
          setMessage(`Updated ${updatedPerson.name}`)
          setClassName('notif')
          setTimeout(() => {
            setMessage(null)
          }, 5000)
          setPersons(persons.map(p => p.id === person.id ? updatedPerson : p))
        })
        .catch((error) => {
          setMessage(`Information of ${person.name} has already been removed from server`)
          setClassName('error')
          setTimeout(() => {
            setMessage(null)
          }, 5000)
          personService.getAll().then(newPersons => {
            setPersons(newPersons)
          })
        })
    }
    else {
      personService.create({name: newName, number: newPhone}).then(newPerson => {
        setMessage(`Added ${newPerson.name}`)
        setClassName('notif')
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        setPersons(persons.concat(newPerson))
      })
    }
  }

  const removePerson = (id) => {
    if (!window.confirm('Delete this person?')) return
    const deletedPerson = persons.find(p => p.id === id)
    personService.remove(id)
      .then(() => {
        setMessage(`Removed ${deletedPerson.name}`)
        setClassName('notif')
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        setPersons(persons.filter(p => p.id !== id))
      })
      .catch(error => {
        setMessage(`Information of ${deletedPerson.name} has already been removed from server`)
        setClassName('error')
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        personService.getAll().then(newPersons => {
          setPersons(newPersons)
        })
      })

  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={message} className={className} />

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

      <Persons 
        persons={persons} 
        filter={filter} 
        onClick={removePerson} />
    </div>
  )
}

export default App