import React from 'react'

const LoginPage = () => {
  return (
    <section className='bg-gray-50 min-h-[90wh] flex items-center justify-center'>
      <div className='bg-gray-100 flex rounded shadow-lg max-w-2xl p-5 items-center'>
      <div className='md:w-1/2 px-8 md:px-16'>
        <h2 className='font-bold text-2xl'>pokemon</h2>
        <p className='text-xs mt-4 text-[#002D74]'>포켓몬 사이트에 오신 걸</p>
        <p className='text-xs mt-4 text-[#002D74]'>환영합니다.</p>
        <p className='text-xs mt-4 text-[#002D74]'>로그인 해 주세요.</p>
      </div>
      <div className='md:block hidden w-1/2'>
      <img 
      src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png" 
      className='rounded-2xl '
      alt='login'
      />
      </div>
      </div>
    </section>
    )
}

export default LoginPage

