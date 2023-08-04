import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { Loading } from '../../assets/Loading';
import { LessThan } from '../../assets/LessThan';
import { GreaterThan } from '../../assets/GreaterThan';
import { ArrowLeft } from '../../assets/ArrowLeft';
import { Balance } from '../../assets/Balance'
import { Vector } from '../../assets/Vector'
import { Type } from '../../components/Type'
import { BaseStat } from '../../components/BaseStat';
import DamageRelations from '../../components/DamageRelations';

const DetailPage = () => {
  const [pokemon, setPokemon] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const pokemonID = params.id; 
  const baseUrl = `https://pokeapi.co/api/v2/pokemon/`;
  useEffect(() => {
    fetchPokemonData();    
  }, [])

  async function fetchPokemonData() {
    const url = `${baseUrl}${pokemonID}`

    try {
      // data를 pokemonData라는 이름으로 갖고 오기
      const { data: pokemonData } = await axios.get(url);
      if (pokemonData) {
        // pokemonData에서 아래 데이터들을 갖고 오기
        const { name, id, types, weight, height, stats, abilities } = pokemonData;
        const nextAndPreviousPokemon = await getNextnextAndPreviousPokemon(id);
        
        const DamageRelations = await Promise.all(
          types.map(async (i) => {
            const type = await axios.get(i.type.url);
            return type.data.damage_relations
          })
        )

        // 포켓몬 데이터 포맷팅
        const formattedPokemonData = {
          id,
          name,
          types: types.map(type => type.type.name),
          weight: weight / 10,
          height: height / 10,
          previous: nextAndPreviousPokemon.previous,
          next: nextAndPreviousPokemon.next,
          abilities: formatPokemonAbilities(abilities),
          stats: formatPokemonStats(stats),
          DamageRelations
        }


        setPokemon(formattedPokemonData);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error)
      setIsLoading(false);

      
    }
  }

  // filter를 이용해 ability 생성
  const formatPokemonAbilities = (abilities) => {
    // abilities의 index가 1보다 작거나 같은 것만 filter해서 ability에 넣기
    return abilities.filter((ability, index) => index <= 1)
            // map을 이용해서 -를 공백으로 모두 변경
            .map((obj) => obj.ability.name.replaceAll('-', ' '))
  }
  // filter를 이용해 Stat 생성
  const formatPokemonStats = ([
    statHP,
    statATK,
    StatDEP,
    statSATK,
    statSDEP,
    statSPD
  ]) => [
    {name: 'Hit Points', baseStat: statHP.base_stat},
    {name: 'Attack', baseStat: statATK.base_stat},
    {name: 'Defense', baseStat: StatDEP.base_stat},
    {name: 'Special Attack', baseStat: statSATK.base_stat},
    {name: 'Special Defense', baseStat: statSDEP.base_stat},
    {name: 'Speed', baseStat: statSPD.base_stat}
  ]


  async function getNextnextAndPreviousPokemon(id) {
    const urlPokemon = `${baseUrl}?limit=1&offset=${id - 1}`;
    const {data: pokemonData} = await axios.get(urlPokemon);
    const nextResponse = pokemonData.next && (await axios.get(pokemonData.next))
    const previousResponse = pokemonData.previous && (await axios.get(pokemonData.previous))
    
    
    return {
     // nextResponse가 있으면?.data가 있으면?.results가 있으면? [0]가 있으면? .name 갖고 와라
      next: nextResponse?.data?.results?.[0]?.name,
      previous: previousResponse?.data?.results?.[0].name
      } 
    }
    if (isLoading) {
      return (
        <div className={
          `absolute h-auto w-auto top-1/3 -translate-1/2 left-1/2 z-50`
        }>
          <Loading className='w-12 h-12 z-50 animate-spin text-slate-900' />
        </div>
      )
    }

    if (!isLoading && !pokemon) {
      return (
        <div>...NOT FOUND</div>
      )
    }
    const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon?.id}.png`
    const bg = `bg-${pokemon?.types?.[0]}`;
    const text = `text-${pokemon?.types?.[0]}`;
    

    return (
      <article className='flex items-center gap-1 flex-col w-full'>
        <div
          className={
            `${bg} w-auto h-full flex flex-col z-0 items-center justify-center relative overflow-hidden`}>

              {/* 이전 페이지 화살표 */}
              {pokemon.next && (
                <Link 
                  className='absolute top-[40%] -translate-y-1/2 z-50 left-1'
                  to={`/pokemon/${pokemon.previous}`}
                >
                  <LessThan className='w-5 h-8 p-1' />
                </Link>
              )}

              {/* 다음 페이지 화살표 */}
              {pokemon.next && (
                <Link 
                  className='absolute top-[40%] -translate-y-1/2 z-50 right-1'
                  to={`/pokemon/${pokemon.next}`}
                >
                  <GreaterThan className='w-5 h-8 p-1' />
                </Link>
              )}

                <section className='w-full flex flex-col z-20 items-center justify-end relative h-full'>
                  <div className='absolute z-30 top-6 flex itmes-center w-full justify-between px-2' >
                    <div className='flex items-center gap-1'>
                      <Link to="/">
                        <ArrowLeft className='w-6 h-8 text-zinc-200' />
                      </Link>
                      {/* capitalize : 첫글자 대문자로 변경 */}
                      <h1 className='text-zinc-200 font-bold text-xl capitalize'>
                          {pokemon.name}
                      </h1>
                    </div>
                    <div className='text-zinc-200 font-bold text-md'>
                      #{pokemon.id.toString().padStart(3, '00')}
                    </div>
                  </div>
                  
                  <div className='relative h-auto max-w-[15.5rem] z-20 mt-6 -mb-16'>
                    <img 
                        src={img}
                        width="100%"
                        height="auto"
                        loading="lazy"
                        alt={pokemon.name}
                        className={`object-contain h-full`}
                      />
                    </div>
                  </section>

                  <section className='w-full min-h-[65%] h-full bg-gray-800 z-10 pt-14 flex flex-col items-center gap-3 px-5 pb-4'>
                      <div className='flex items-center justify-center gap-4'>
                        {/* 포켓몬 타입 */}
                        {pokemon.types.map((type) => (
                          <Type key={type} type={type} />
                        ))}

                      </div>

                      <h2 className={`text-base font-semibold ${text}`}>
                        정보
                      </h2>

                  <div className='flex w-full items-center justify-between max-w-[400px] text-center '>
                      <div className='w-full'>
                        <h4 className='text-[0.5rem] text-zinc-100'>Weight</h4>
                        <div className='text-sm flex gap-2 justify-center text-zinc-200'>
                          <Balance />
                          {pokemon.weight}kg
                        </div>
                      </div>
                      
                      <div className='w-full'>
                        <h4 className='text-[0.5rem] text-zinc-100'>Height</h4>
                        <div className='text-sm flex gap-2 justify-center text-zinc-200'>
                          <Vector />
                          {pokemon.height}m
                        </div>
                      </div>

                      <div className='w-full'>
                        <h4 className='text-[0.5rem] text-zinc-100'>Ability</h4>
                          {pokemon.abilities.map((ability) => (
                            <div key={ability} className='text-[0.5rem] text-zinc-100 capitalize' >{ability}</div>
                          ))}
                        </div>
                  </div>

                  <h2 className={`text-base font-semibold ${text}`}>
                        기본 능력치
                  </h2>
                      <div className='w-full'>


                        <table>
                          <tbody>
                            {pokemon.stats.map((stat) => (
                              <BaseStat 
                                key={stat.name}
                                valueStat={stat.baseStat}
                                nameStat={stat.name}
                                type={pokemon.types[0]}
                              />
                            ))}
                          </tbody>
                        </table>
  
  
                      </div>

                      {pokemon.DamageRelations && (
                        <div className='w-10/12'>
                          <h2 className={`text-base text-center font-semibold ${text}`}>
                              <DamageRelations 
                                damages = {pokemon.DamageRelations}
                              />
                            </h2>
                            데미지
                        </div>

                      )}



                  </section>

        </div>
      </article>

      )
   
}



  
export default DetailPage