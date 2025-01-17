import Link from 'next/link';
import HomePageCard from './HomePageCard';

const HomePageCardsWrapper = () => {
  return (
    <section className="py-4">
      <div className="container-xl lg:container m-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg">
          <HomePageCard bg='bg-orange-100'>
            <h2 className="text-2xl font-bold">For Participants</h2>
            <p className="mt-2 mb-4">
              Find fitness classes near you
            </p>
            <Link
              href=""
              className="inline-block bg-navy text-white rounded-lg px-4 py-2 hover:bg-gray-900"
            >
              Browse Classes
            </Link>
          </HomePageCard>
          <HomePageCard bg='bg-orange-100'>
            <h2 className="text-2xl font-bold">For Fitness Professionals</h2>
            <p className="mt-2 mb-4">
              List your classes to help others discover them
            </p>
            <Link
              href="/admin"
              className="inline-block bg-navy text-white rounded-lg px-4 py-2 hover:bg-gray-900"
            >
              Add Class
            </Link>
          </HomePageCard>
        </div>
      </div>
    </section>
  )
}

export default HomePageCardsWrapper;
