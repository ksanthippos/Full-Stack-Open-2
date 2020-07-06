import React, {useEffect, useState} from 'react'
import AddPerson from "./components/AddPerson";
import FindName from "./components/FindName";
import Display from "./components/Display";
import Notification from "./components/Notification";
import personService from "./services/persons"

// OSA 2
// PUHELINLUETTELO
// tehtävät 2.19 - 2.20

const App = () => {

    const [ persons, setPersons] = useState([])
    const [ newName, setNewName ] = useState('')
    const [ newNumber, setNewNumber ] = useState('')
    const [ searchTerm, setSearchTerm ] = useState('')
    const [ searchResults, setSearchResults ] = useState([])
    const [ searchNull, setSearchNull ] = useState(true)
    const [ notificationClass, setNotificationClass ] = useState('success')
    const [ notification, setNotification ] = useState(null, notificationClass)

    useEffect(() => {
        personService
            .getAll()
            .then(returnedPersons => {
                setPersons(returnedPersons)
            })
    }, [])

    const handleNameChange = (event) => { setNewName(event.target.value) }

    const handleNumberChange = (event) => { setNewNumber(event.target.value) }

    const handleFindName = (event) => { setSearchTerm(event.target.value) }

    return (
        <div>
            <h1>Phonebook</h1>
            <Notification message={notification} notificationClass={notificationClass}/>
            <FindName setSearchNull={setSearchNull}
                      persons={persons}
                      setSearchResults={setSearchResults}
                      searchTerm={searchTerm}
                      handleFindName={handleFindName}
            />
            <h2>Add new</h2>
            <AddPerson namesToShow={searchResults}
                       persons={persons}
                       setPersons={setPersons}
                       setNewName={setNewName}
                       newName={newName}
                       handleNameChange={handleNameChange}
                       newNumber={newNumber}
                       setNewNumber={setNewNumber}
                       handleNumberChange={handleNumberChange}
                       setNotification={setNotification}
                       notificationClass={notificationClass}
                       setNotificationClass={setNotificationClass}
            />
            <h2>Numbers</h2>
            <Display searchNull={searchNull}
                     persons={persons}
                     setPersons={setPersons}
                     namesToShow={searchResults}
                     setNotification={setNotification}
                     notificationClass={notificationClass}
                     setNotificationClass={setNotificationClass}
            />
            ...
        </div>
    )
}

export default App
