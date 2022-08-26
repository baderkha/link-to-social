import React, { useState } from "react"
import SearchBar from "../../components/Searchbar"
import { isSubstring } from "../../util/subString"


export type ExploreProps = {

}
const dummyExploreData = [
    {
        image: 'poop',
        profileName: 'pooper',
        more: 'poopy'
    },

]

export const Explore = () => {

    const [searchQuery, setSearchQuery] = useState("")

    const filteredExplore = dummyExploreData.filter(
        data => 
        isSubstring(data.image || '', searchQuery) ||
        isSubstring(data.profileName || '', searchQuery) ||
        isSubstring(data.more || '', searchQuery)
    )
    return (
        <div>
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
            {filteredExplore.map((el) => {
              return (
                <div>
                    {el.image}
                    {el.profileName}
                    {el.more}
                </div>
              )  
            })}
        </div>
    )
}