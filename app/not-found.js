import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <main className="bg-white px-6 py-8 mb-4 m-4 text-center">
      <h1 className="text-xl font-bold">404 - That page does not seem to exist...</h1>
      <Link href="/" className="text-navy">
        <button>Go Home</button>
      </Link>

      <Image
        src="/giphy.gif"
        width={500}
        height={500}
        alt="Missing Episode 9 GIF by The Simpsons"
        className="m-auto pt-10"
      />
  </main>
  )
}