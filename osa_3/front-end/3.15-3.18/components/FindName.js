import React, {useEffect} from "react";

const FindName = ({ setSearchNull, persons, setSearchResults,
                      searchTerm, handleFindName }) => {

    // tarkistus onko hakukenttä tyhjä, jotta Display osaa renderöidä oikein
    useEffect(() => {
        if (searchTerm !== '')
            setSearchNull(false)
        else
            setSearchNull(true)
    })

    useEffect(() => {
        const found = persons.filter(person =>
            person.name.toLowerCase().includes(searchTerm)
        )
        setSearchResults(found)
    }, [persons, setSearchResults, searchTerm])

    return (
        <form>
            <div>
                Filter by name:
                <input placeholder='Search:' value={searchTerm} onChange={handleFindName}/>
            </div>
        </form>
    )
}

export default FindName