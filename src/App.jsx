import "./App.css";
import Calendar from "./components/Calendar";
import Header from "./components/Header";
import headerimage from "./assets/headerimage.jpg";
function App() {

  return (
    <>
      <div className="bg-gray-100 min-h-screen bg-opacity-85 border shadow-2xl rounded-t-full rounded-b-full ">
        <img
                src={headerimage}
                alt="Header"
                className="w-9/12 md:w-5/12 xl:w-4/12 rounded-full justify-items-center flex mx-auto my-4 shadow-xl h-60 md:h-64 lg:h-96 xl:h-120px object-cover border-2 border-gray-300 hover:scale-105 transition-transform duration-300 ease-in-out"
              />
        <Header />
        <div className="">
         
        <Calendar />
         </div>
      </div>
    </>
  );
}

export default App;
