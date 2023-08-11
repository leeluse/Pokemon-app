import React, { useEffect, useState } from 'react'
import { Type } from '../components/Type'
const DamageRelations = ({ damages }) => {
  const [damagePokemonsForm, setdamagePokemonsForm] = useState();


  
  useEffect(() => {
    const arrayDamage = damages.map((damage) => 
    separateObjectBetweenToAndFrom(damage))

    if (arrayDamage.length === 2) {
      // Type이 2개일 때
        const obj = joinDamageRelations(arrayDamage);
        setdamagePokemonsForm(reduceDuplitcateValue(postDamageValue(obj.from)));
        
    } else {
      // Type이 1개일 때
      setdamagePokemonsForm(postDamageValue(arrayDamage[0].from));
    }
  }, [])
  
  const reduceDuplitcateValue = (props) => {
    const duplicateValues = {
          double_damage: '4x',
          half_damage: '1/4x',
          no_damage: '0x'
    }

    return Object.entries(props)
      .reduce((acc, [keyName, value]) => {
        const key = keyName;
        const verifiedValue = filterForUniqueValues (
          value,
          duplicateValues[key]
        )

        return ((acc = {[keyName]: verifiedValue, ...acc}));
      }, {})
  }

  const filterForUniqueValues = (valueForFiltering, damageValue) => {

    return valueForFiltering.reduce((acc, currentValue)=>{
      const { url, name } = currentValue;

      // a.name과 name이 같지 않으면 filter
      const filterACC = acc.filter((a) => a.name !== name);

      // filtering한 acc와 그냥 acc의 길이가 같으면.length(중복이 없는 경우)
      return filterACC.length === acc.length
      ? (acc = [currentValue, ...acc])
      : (acc = [{damageValue: damageValue, name, url}, ...filterACC])
    }, [])
  }


  const joinDamageRelations = (props) => {
    return {
      to: joinObjects(props, 'to'),
      from: joinObjects(props, 'from')
      
    }
  } 

  const joinObjects = (props, string) => {
    const key = string;
    const firstArrayValue = props[0][key];
    const secondArrayValue = props[1][key];

    const result = Object.entries(secondArrayValue)
          .reduce((acc, [keyName, value]) => {
            const result = firstArrayValue[keyName].concat(value);
            return (acc = { [keyName] : result, ...acc });
    }, {})
    return result;

}


  const separateObjectBetweenToAndFrom = (damage) => {
    const from = filterDamageRelations('_from', damage)
    const to = filterDamageRelations('_to', damage)
    return {from, to}
  }

  function filterDamageRelations(valueFilter, damage) {
    const result = Object.entries(damage)
      .filter(([keyName, value]) => {
        // half_damage_from [{name: 'poison', url...}]

        // half_damage_from에서 _from을 포함하나?
        return keyName.includes(valueFilter)
        // _from true or false true 인 것만 아래로 계속 진행
      })
      .reduce((acc, [keyName, value]) => {
        // {double_damage_Array(2)} (2) {'half_damage_to', [Array(4)]} (4)
        const keyWithValueFilterRemove = keyName.replace(
          valueFilter,
          '',
        )
        // half_damage  _to를 제거하기
        return (acc = { [keyWithValueFilterRemove] : value, ...acc })
        // {half_damage: Array(4), double_damage: Array(2)}
      }, {})

      return result
  }

  
  const postDamageValue = (props) => {
    const result = Object.entries(props)
      .reduce((acc, [keyName, value]) => {
        const key = keyName;
        const valueOfKeyName = {
          double_damage: '2x',
          half_damage: '1/2x',
          no_damage: '0x'
        };

        return (acc = {
          // i : damageValue, name, url 표시
          [keyName] : value.map(i => ({
          damageValue: valueOfKeyName[key],
          ...i
          })),
          ...acc
       })
      }, {})
      return result;
  }

  return (
    <div className='flex gap-2 flex-col'>
      {damagePokemonsForm ? (
        <>
          {Object.entries(damagePokemonsForm)
            .map(([keyName, value])  => {
                const key = keyName;
                const valueOfKeyName = {
                  double_damage: 'Week',
                  half_damage: 'Resitant',
                  no_damage: 'Immune'}
                return (
                  <div key={key}>
                    <h3 className='capitalize font-medium text-sm md:text-base text-slat-500 text-center'>
                      {valueOfKeyName[key]}
                    </h3>
                    <div className='flex flex-wrap gap-1 justify-center'>
                      {value.length > 0 ? (
                        value.map(({name, url, damageValue}) => {
                          return (
                            <Type 
                            type = {name}
                            key={url}
                            damageValue ={damageValue}
                            />
                          )
                        })
                      ) : (
                      <Type type = {'none'} key={'none'}/>
                        )}
                    </div>
                  </div>
                )

            })}
        </>
      ): <div></div>
    }
      </div>
  )
}

export default DamageRelations