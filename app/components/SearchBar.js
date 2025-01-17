import { CiSearch } from "react-icons/ci";

const SearchBar = () => {
  return (
    <section className="py-4 h-1/4">
        <form className="max-w-lg mx-auto">   
            <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
            <div className="relative overflow-hidden">                
                <input 
                    type="search" 
                    id="default-search" 
                    className="block w-full p-4 ps-10 text-base text-gray-900 rounded-lg 
                    border-2 border-white" 
                    placeholder="Search by city, workout or instructor name..."
                    />
                <button 
                    type="submit" 
                    className="absolute flex justify-center items-center end-0 bottom-0 text-white border-2 border-white  
                      rounded-lg bg-navy px-5 py-4 hover:bg-gray-900">
                        <CiSearch className="text-lg mr-2"/> Search
                </button>
            </div>
        </form>
    </section>
  )
}

export default SearchBar;
