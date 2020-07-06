import Person from "./Person";
import React from "react";

const Display = ( {searchNull, persons, setPersons, namesToShow,
                      setNotification, notificationClass, setNotificationClass}) => {

    // hakukenttä on tyhjä, näytetään kaikki henkilöt
    if (searchNull) {
        return(
            <div>
                <ul>
                    {persons.map((person, i) =>
                        <Person
                            key={i}
                            person={person}
                            persons={persons}
                            setPersons={setPersons}
                            setNotification={setNotification}
                            notificationClass={notificationClass}
                            setNotificationClass={setNotificationClass}
                        />
                    )}
                </ul>
            </div>
        )
    }
    // näytetään vain hakukentän mukaiset henkilöt
    else {
        return(
            <div>
                <ul>
                    {namesToShow.map((person, i) =>
                        <Person
                            key={i}
                            person={person}
                            persons={persons}
                            setPersons={setPersons}
                            setNotification={setNotification}
                            notificationClass={notificationClass}
                            setNotificationClass={setNotificationClass}
                        />
                    )}
                </ul>
            </div>
        )
    }
}

export default Display