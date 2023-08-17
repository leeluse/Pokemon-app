import {useEffect, useState} from 'react'

interface LazyimageProps {
  url: string;
  alt: string;

}

const Lazyimage = ({url, alt}: LazyimageProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [opacity, setOpacity] = useState<string>('opacity-0');
  
  useEffect(() => {
    isLoading ? setOpacity('opacity-0') : setOpacity('opacity-100');
  }, [isLoading])
  // [third] => isLoading이 바뀔 때마다 실행한다

  return (
    <>
    {isLoading && (
      <div className='absolute h-full z-10 w-full flex items-center justify-center'>
        ...loading
      </div>
    )}
    <img 
      src={url}
      alt={alt}
      width="100%"
      height="auto"
      loading="lazy"
      onLoad={() => setIsLoading(false)}
      className={`object-contain h-full ${opacity}`}
    />
    </>
  )
}

export default Lazyimage