// Cache Components requires request-time work to sit inside a Suspense boundary;
// this file provides one for "/" and every route nested under it.
export default function Loading() {
  return <p className="text-gray-500">Carregando…</p>;
}