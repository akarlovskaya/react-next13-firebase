import SearchBar from '../components/SearchBar';

const HeroBanner = () => {
  return (
    <>
    <section className="bg-navy py-20 mb-4">
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="text-center">
          <h1
            className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
            Step into journey of transforming physically and mentally
          </h1>
          <p className="my-4 text-xl text-white">
            Find Fitness classes that fit your schedule and needs
          </p>
          <SearchBar />
        </div>
      </div>
    </section>
    </>
  )
}

export default HeroBanner;
