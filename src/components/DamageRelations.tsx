import React, { useEffect, useState } from 'react'
import { Type } from './Type'
import { DamageRelations as DamageRelationProps } from '../types/DamageRelationOfPoekmonTypes';
import { Damage, DamageFromAndTo, SeparateDamages } from '../types/SeparateDamageRelations';

interface DamageModalProps {
  damages: DamageRelationProps[];
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

interface Info {
  name: string;
  url: string;
}

const DamageRelations = ({ damages }: DamageModalProps) => {
  const [damagePokemonsForm, setdamagePokemonsForm] = useState<SeparateDamages>();

  
    
  
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
  
  const reduceDuplitcateValue = (props: SeparateDamages) => {
    const duplicateValues = {
          double_damage: '4x',
          half_damage: '1/4x',
          no_damage: '0x'
    }

    return Object.entries(props)
      .reduce((acc, [keyName, value]) => {
        const key = keyName as keyof typeof props;
        const verifiedValue = filterForUniqueValues (
          value,
          duplicateValues[key]
        )

        return ((acc = {[keyName]: verifiedValue, ...acc}));
      }, {})
  }

  const filterForUniqueValues = (valueForFiltering: Damage[], damageValue: string) => {

    const initialArray: Damage[] = [];
    return valueForFiltering.reduce((acc, currentValue)=>{
      const { url, name } = currentValue;

      // a.name과 name이 같지 않으면 filter
      const filterACC = acc.filter((a) => a.name !== name);

      // filtering한 acc와 그냥 acc의 길이가 같으면.length(중복이 없는 경우)
      return filterACC.length === acc.length
      ? (acc = [currentValue, ...acc])
      : (acc = [{damageValue: damageValue, name, url}, ...filterACC])
    }, initialArray)
  }


  const joinDamageRelations = (props: DamageFromAndTo[]) => {
    return {
      to: joinObjects(props, 'to'),
      from: joinObjects(props, 'from')
      
    }
  } 

  const joinObjects = (props: DamageFromAndTo[], string: string) => {
    const key = string as keyof typeof props[0];
    const firstArrayValue = props[0][key];
    const secondArrayValue = props[1][key];

    const result = Object.entries(secondArrayValue)
          .reduce((acc, [keyName, value]: [string, Damage]) => {
            const key = keyName as keyof typeof firstArrayValue; // secondArrayValue
            const result = firstArrayValue[key]?.concat(value);
            return (acc = { [keyName] : result, ...acc });
    }, {})
    return result;

}


  const separateObjectBetweenToAndFrom = (damage: DamageRelationProps): DamageFromAndTo => {
    const from = filterDamageRelations('_from', damage)
    const to = filterDamageRelations('_to', damage)
    return {from, to}
  }

  function filterDamageRelations(valueFilter: string, damage: DamageRelationProps) {
    const result: SeparateDamages = Object.entries(damage)
      .filter(([keyName, _]) => {
        // half_damage_from [{name: 'poison', url...}]

        // half_damage_from에서 _from을 포함하나?
        return keyName.includes(valueFilter)
        // _from true or false true 인 것만 아래로 계속 진행
      })
      .reduce((acc, [keyName, value]): SeparateDamages => {
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

  
  const postDamageValue = (props: SeparateDamages): SeparateDamages => {
    const result = Object.entries(props)
      .reduce((acc, [keyName, value]) => {

        const key = keyName as keyof typeof props;
        const valueOfKeyName = {
          double_damage: '2x',
          half_damage: '1/2x',
          no_damage: '0x'
        };

        return (acc = {
          // i : damageValue, name, url 표시
          [keyName] : value.map((i: Info[]) => ({
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
            .map(([keyName, value]: [string, Damage[]])  => {
                const key = keyName as keyof typeof damagePokemonsForm;
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
                      <Type type={'none'} key={'none'}/>
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