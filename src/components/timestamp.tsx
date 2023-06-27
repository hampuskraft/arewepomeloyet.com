import {useEffect, useState} from 'react';

export default function Timestamp({value}: {value: number}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <strong>{new Date(value * 1000).toLocaleString()}</strong>;
}
