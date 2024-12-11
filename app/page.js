import Loader from "./components/Loader";
// import toast from 'react-hot-toast';

export default function Home() {
  return (
    <>
      <div>
        Home page
        <Loader show/>
        {/* <button onClick={() => toast.success('Hello from toast')}>Toast</button> */}
      </div>
    </>
  );
}