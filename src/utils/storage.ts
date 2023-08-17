const storage = {
  set: (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value))
  },
  // 제네릭으로 설정
  get: <T>(key: string, defaultValue?: T): T => {
    const value = localStorage.getItem(key);
    
    return (value ? JSON.parse(value) : defaultValue) as T
  },
  remove: (key: string) => {
    localStorage.removeItem(key)

  }
}

export default storage;

