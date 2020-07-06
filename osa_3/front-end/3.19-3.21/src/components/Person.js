import React from "react";
import personService from "../services/persons";

const Person = ({ person, setPersons, setNotification, notificationClass, setNotificationClass }) => {

    const handleDelete = () => {
        if (window.confirm("Delete " + person.name + " from contacts?")) {
            personService
                .deletePerson(person.id)
                .then(() => {
                    // päivitetään näkymä
                    personService
                        .getAll()
                        .then(returnedPersons => {
                            setPersons(returnedPersons)
                        })
                })

            // ilmoitus poistamisesta
            setNotificationClass('update')
            setNotification(`Deleted ${person.name} from contacts`, {notificationClass})
            setTimeout(() => {
                setNotification(null)
            }, 2000)
        }
    }

    return (
        <div>
            <li className='person'>
                {person.name} : {person.number}
                <button onClick={handleDelete}>
                    delete
                </button>
            </li>
        </div>
    )
}

export default Person