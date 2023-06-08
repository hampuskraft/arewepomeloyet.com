'use client';

export default function Timestamp({value}: {value: number}) {
  return <strong>{new Date(value).toLocaleString()}</strong>;
}
