import { useEffect, useState } from 'react'
import axios from 'axios' 
import PokeCard from '../../components/PokeCard.jsx'
import AutoComplete from '../../components/AutoComplete.jsx';
import { PokemonData, PokemonNameAndUrl } from '../../types/PokemonData.js';

function MainPage() {
  // 모든 포켓몬 데이터를 갖고 있는 State
  const [allPokemons, setAllpokemons] = useState<PokemonNameAndUrl[]>([])
  // 실제로 리스트로 보여주는 포켓몬 데이터를 갖고 있는 State
  const [displayedPokemons, setDisplayedPokemons] = useState<PokemonNameAndUrl[]>([])


  // 한 번에 보여 주는 포켓몬 State
  const limitNum = 20;
  const url = `https://pokeapi.co/api/v2/pokemon/?limit=1008&offset=0`;



  // const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    fetchPokeData();
  }, [])

  // useEffect(() => {
  //  handleSearchInput(debouncedSearchTerm)
  // }, [debouncedSearchTerm])
  
  const filterDisplayedPokemonData = (
    allpokemons: PokemonNameAndUrl[],
    displayedPokemons: PokemonNameAndUrl[] = []
    ) => {
    const limit = displayedPokemons.length + limitNum
    // 모든 포켓몬 데이터에서 limitNum 만큼 더 가져오기
    const array = allpokemons.filter((_, index) => index +1 <= limit);
    return array;

  }

  const fetchPokeData = async () => {
    try {
     // 1008개의 포켓몬 데이터를 받아오기
     const response = await axios.get<PokemonData>(url);
     // console.log(response.data.results);
     // 모든 포켓몬 데이터 기억하기
     setAllpokemons(response.data.results);
     // 실제로 화면에 보여줄 포켓몬 리스트 기억하기
     setDisplayedPokemons(filterDisplayedPokemonData(response.data.results));
    } catch (error) {
      console.error(error)
      
    }
  }


  const handleSearchInput = async (searchTerm) => {
    
    if (searchTerm.length > 0) {
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${searchTerm}`);
        const pokemonData = {
          url: `https://pokeapi.co/api/v2/pokemon/${response.data.id}`,
          name: searchTerm

        }
        setPokemons([pokemonData])
      } catch (error) {
        setPokemons([]);
        console.error(error);
      }
    } else {
      fetchPokeData(true);
    }
  }

  return (
    <article className='pt-6'>
      <header className='flex flex-col gap-2 w-full px-4 z-50'>
        <AutoComplete 
          allPokemons = {allPokemons}
          setDisplayedPokemons = {setDisplayedPokemons}
        />
      </header>
      <section className='pt-6 flex flex-col justify-content items-center overflow-auto z-0'>
        <div className='flex flex-row flex-wrap gap-[16px] items-center justify-center px-2 max-w-4xl'>
          { displayedPokemons.length > 0 ? 
            ( 
              displayedPokemons.map(({url, name}: PokemonNameAndUrl) => (
              <PokeCard key={url} url={url} name={name} />
            )) 
            ) : 
            ( <h2 className='font-medium text-lg text-slate-900 mb-1'>
              포켓몬이 없습니다. 
              </h2>
            )}
          </div>
      </section>
      <div className='text-center'>
        {(allPokemons.length > displayedPokemons.length) && (displayedPokemons.length !== 1) && (
         <button 
         onClick={() => setDisplayedPokemons(filterDisplayedPokemonData(allPokemons, displayedPokemons))}
         className='bg-slate-800 px-6 py-2 my-4 text-base rounded-lg font-bold text-white'>
           더 보기
         </button>
        )}
       
      </div>
      </article>
  )
}

export default MainPage
