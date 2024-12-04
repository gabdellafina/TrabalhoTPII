import Image from "next/image";
import cart from '../public/img/cart.png';
import store from '../public/img/store.png';
import '../app/globals.css';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <div>
        <h1 className="text-3xl font-bold text-center mt-10 text-white">Acesse:</h1>
      </div>
      
      <div className="flex items-center justify-center h-full mt-16">
        <a href="/produtos">
          <div className="bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-lg shadow-lg max-w-md transition-transform transform hover:scale-105 hover:border-4 hover:border-sky-400 hover:shadow-lg hover:shadow-sky-400 hover:scale-105">
            <Image
              src={cart}
              alt="Produtos"
              width={200}
              height={200}
            />
            <h2 className="text-2xl font-bold text-center mt-4 text-white">Produtos</h2>
          </div>
        </a>

        <a href="/lojas">
          <div className="bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-lg shadow-lg max-w-md ml-8 transition-transform transform hover:scale-105 hover:border-4 hover:border-sky-400 hover:shadow-lg hover:shadow-sky-400 hover:scale-105">
            <Image
              src={store}
              alt="Lojas"
              width={200}
              height={200}
            />
            <h2 className="text-2xl font-bold text-center mt-4 text-white">Lojas</h2>
          </div>
        </a>
      </div>
    </div>
  );
}