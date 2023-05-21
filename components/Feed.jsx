'use client'

import { useState, useEffect } from "react";

import PromptCard from './PromptCard'

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  )
}

const Feed = () => {

  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);

  const [allPosts, setAllPosts] = useState([]);

  

  useEffect(() => {
    const fetchPost = async () => {
      const response = await fetch('/api/prompt');  // Fetch para obtener los prompts de bd
      const data = await response.json();
      setAllPosts( data );
    }
    fetchPost()
  },[]);

  const filterPrompts = (searchtext) => {      // Toma un texto de búsqueda y filtra la matriz allPosts devolviendo solo los elementos que tienen una coincidencia  
    const regex = new RegExp(searchtext, "i"); // 'i' flag for case-insensitive search
    return allPosts.filter(
      (item) =>
        regex.test(item.creator.username) ||
        regex.test(item.tag) ||
        regex.test(item.prompt)
    );
  };

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    const newSearchText = e.target.value; 
    setSearchText(newSearchText);                           // Estado del input de busqueda

    // debounce method
    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterPrompts(newSearchText);  // Rdo de la busqueda basado en filterPrompts
        setSearchedResults(searchResult);                   // Estado del rdo de la busqueda 
      }, 500)
    );
  };

  const handleTagClick = (tagName) => {
    setSearchText(tagName);

    const searchResult = filterPrompts(tagName);
    setSearchedResults(searchResult);
  };


  return (
    <section className="feed">
      <form className="relative w-full flex-center">  
        <input 
          type="text" 
          placeholder="Search for a tag or username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className='search_input peer'
        />
      </form>  


      {searchText ? (
        <PromptCardList 
          data={searchedResults}
          handleTagClick={handleTagClick}
        />
      ) : (
        <PromptCardList 
          data={allPosts}
          handleTagClick={handleTagClick}
        />
      
      )}

    </section>
  )
}

export default Feed