import React from "react";
import personService from "../services/persons";


const AddPerson = ({persons, setPersons, setNewName, setNewNumber, newName,
                       handleNameChange, newNumber, handleNumberChange,
                            setNotification, notificationClass, setNotificationClass}) => {

    const addPerson = (event) => {
        event.preventDefault()
        const personObj = {
            name: newName,
            number: newNumber,
        }

        // etsitään henkilö nimen perusteella
        const person = persons.find(p => p.name === newName)

        if (person) {
            if (window.confirm("Replace " + newName +  "'s number?")) {

                // kopio alkuperäisstä henkilöstä
                const updatedPerson = {...person, number: person.number = newNumber}

                personService
                    .update(person.id, updatedPerson)
                    .then(returnedPerson => {
                        setPersons(persons.map(person => person.id
                            ? person
                            : returnedPerson))
                    })
                    .catch(error => {
                        // päivittäminen ei onnistunut, esim. henkilö oli ehditty jo poistaa eri selainikkunassa
                        setNotificationClass('error')
                        setNotification(`Error ${error}: ${newName} has already been deleted`, {notificationClass})
                        setTimeout(() => {
                            setNotification(null)
                        }, 5000)
                    })

                // ilmoitus onnistuneesta lisäyksestä
                setNotificationClass('update')
                setNotification(`Updated ${newName} number to ${newNumber}`, {notificationClass})
                setTimeout(() => {
                    setNotification(null)
                }, 5000)

                // luettelon refresh vain päivitetyn henkilön osalta
                setPersons(persons.filter(n => n.id !== person.id))
                setNewName('')
                setNewNumber('')

            }
        }
        // luodaan uusi henkilö
        else {
            personService
                .create(personObj)
                .then(returnedPerson => {
                    setPersons(persons.concat(returnedPerson))
                    setNewName('')
                    setNewNumber('')
                })

            // ilmoitus lisäämisestä
            setNotificationClass('success')
            setNotification(`Added ${newName}`, {notificationClass})
            setTimeout(() => {
                setNotification(null)
            }, 2000)
        }
    }

    return (
        <div>
            <form onSubmit={addPerson}>
                <div>
                    name: <input value={newName} onChange={handleNameChange}/>
                </div>
                <div>
                    number: <input value={newNumber} onChange={handleNumberChange}/>
                </div>
                <div>
                    <button
                        type="submit">
                        add
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddPerson