import React, { useState } from "react";
import PetSearchBar from "./SearchBar/SearchBar";

const Search: React.FC = () => {
    // Input fields:
        // breeds - autocomplete, multiple options
            // -> /dogs/breeds we can use for autocomplete here
        // zipCodes - autocomplete, multiple options
            // -> /locations will return 100 zip codes, we can use for autocomplete
        // ageMin - number
        // ageMax - number
    return <PetSearchBar />
}

export default Search;
// Show search page here
    // we want to here fetch all the dogs
    // show paginated result of all the dogs
    // have a search bar
        // call search api and update shown result
    // a button to sort ascending/descending (FontAwesomeIcon)

// We can build a separate filter component
    // here fetch all the dog breeds
    // this can be a side menu or a dropdown menu, find a good design
    

// Helper component to show a Dog
    // we can have it click to open "info" for the dog
    // see where to add a favorites option 
    // like giphy or dribbble

// Redux Store Setup
    // we probably want a store to save favorites
    // do we want to also store the dogs and breeds so it doesn't have to fetch again? Might be hard on memory though if not needed
    // maybe just store breeds?


// Design Notes
    // We should build a map view like zillow
    // on the right, show all options resulting from the search from general search input fields
    // we can display these on the map, with the map zoomed out to the search's bounding box

    // If the user moves the map around or zooms in, we can call /locations/search to the given bounding box
    // we do want to limit the size here so it doesn't take too much loading time
        // -> this will return Location objects, and then we can call the /dogs/search api with those zipcodes 
        // // along with the previous breeds and age filters to update results 
        // and we add markers for this on the map