import { useEffect } from "react";

// handler -> setIsModalOpen을 False로 바꿔 주는 핸들러 
export default function useOnClickOutside(ref, handler) {

  useEffect(() => {
    const listner = (event) => {
      // 내부 클릭 시

      //ref의 current가 존재하지 않을 경우 || 또는 event.target을 contains 하지 않을 경우
      // -> ref 설정을 모달 창 내부만 하였기 때문에
      console.log(event.target);
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      // 외부 클릭 시
      // -> handler 호출
        handler();
    }
    
    document.addEventListener('mousedown', listner);
  
    return () => {
      document.removeEventListener('mousedown', listner);
      
    }
    // ref 또는 handler 변경 시 useEffect 호출
  }, [ref, handler])
  
}