// localStorage 값 하나를 useSyncExternalStore로 구독할 수 있는 저장소로 만든다
// - 값의 출처는 localStorage 한 곳이고, React는 읽기만 한다 (React 상태에 따로 복사하지 않음)
// - 서버 렌더링·하이드레이션에서는 parse(null) 값을 쓴다 (localStorage는 브라우저에만 있음)
// - 다른 탭에서 바뀌면(storage 이벤트) 구독 중인 컴포넌트가 다시 읽는다
// - 쓰기에 실패하면(저장소 접근 차단, 저장 공간 초과 등) 이 탭의 메모리에만 유지한다
export const createLocalStorageStore = <T>(key: string, parse: (raw: string | null) => T) => {
  const listeners = new Set<() => void>();
  const emptyValue = parse(null);

  // 쓰기에 실패했을 때 대신 들고 있는 값 (JSON 문자열)
  let fallbackRaw: string | null = null;
  // 저장값(문자열)이 같으면 같은 객체를 돌려주기 위한 캐시
  // (getSnapshot이 호출될 때마다 새 값을 만들면 React가 바뀐 것으로 보고 무한히 다시 렌더링한다)
  let cachedRaw: string | null = null;
  let cachedValue = emptyValue;

  const readRaw = (): string | null => {
    if (fallbackRaw !== null) return fallbackRaw;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  };

  const notify = () => listeners.forEach((listener) => listener());

  return {
    subscribe: (onChange: () => void) => {
      listeners.add(onChange);
      window.addEventListener('storage', onChange);
      return () => {
        listeners.delete(onChange);
        window.removeEventListener('storage', onChange);
      };
    },

    getSnapshot: (): T => {
      const raw = readRaw();
      if (raw !== cachedRaw) {
        cachedRaw = raw;
        cachedValue = parse(raw);
      }
      return cachedValue;
    },

    getServerSnapshot: (): T => emptyValue,

    write: (value: T) => {
      const raw = JSON.stringify(value);
      try {
        localStorage.setItem(key, raw);
        fallbackRaw = null;
      } catch {
        fallbackRaw = raw;
      }
      notify();
    },
  };
};
