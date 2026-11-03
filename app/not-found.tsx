import Link from "next/link";

export default function NotFound() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold">Tarefa não encontrada</h1>
      <Link href="/" className="text-blue-600">Voltar para a lista</Link>
    </div>
  );
}