import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import '../app/globals.css';

export default function Lojas() {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [adicionar, setadicionar] = useState({
        nome: '',
      });

    const [lojas, setLojas] = useState([]);

    const handleNavigateToProdutos = (loja) => {
        router.push(`/produtos?lojaId=${encodeURIComponent(loja.id)}`);
    };




      useEffect(() => {
        fetch('http://ec2-44-199-209-196.compute-1.amazonaws.com:8080/lojas')
            .then((res) => res.json())
            .then((data) => {
                const lojasCorrigidas = data.map((loja) => {
                    if (typeof loja === 'string') {
                        try {
                            return JSON.parse(loja);
                        } catch (error) {
                            console.error('Erro ao fazer o parse da loja:', loja, error);
                            return loja; // Retorna o valor original em caso de erro
                        }
                    }
                    return loja; // Se já for um objeto, retorna como está
                });
                setLojas(lojasCorrigidas);
            })
            .catch((error) => {
                console.error('Erro ao buscar lojas:', error);
            });
    }, []);
    
    
      
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://ec2-44-199-209-196.compute-1.amazonaws.com:8080/lojas/adicionar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nome: adicionar.nome }),

            });
            
    
            if (response.ok) {
                const lojaCriada = await response.json();
                setLojas((prev) => [...prev, lojaCriada]);
                closeModal();
                setadicionar({ nome: '' });
            }
             else {
                console.error('Erro ao criar loja:', await response.text());
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
        }
    };
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setadicionar((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        fetch('http://ec2-44-199-209-196.compute-1.amazonaws.com:8080/lojas/listarProdutosPorLoja')
            .then((res) => res.json())
            .then((data) => {
                
            })
    }, []);
    

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            {/* Navegação */}
            <nav className="flex justify-between p-5 items-center">
                <a href="/homepage" className="ml-1 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Voltar para a Home Page
                </a>
                <h1 className="text-3xl font-bold text-white text-center">Lojas</h1>
                <button
                onClick={openModal}
                className="bg-sky-400 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded max-w-md flex items-center gap-2"
                >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Adicionar loja
                </button>
            </nav>

            {isModalOpen && (
        <div
          id="crud-modal"
          className="fixed top-0 left-0 right-0 z-50 w-full h-full flex justify-center items-center backdrop-blur-lg"
        >
          <div className="relative bg-black bg-opacity-8 backdrop-blur-lg p-4 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Cadastro de loja
              </h3>
              <button
                onClick={closeModal}
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              >
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <form className="p-4 md:p-5" onSubmit={handleSubmit}>
    <div className="grid gap-4 mb-4 grid-cols-2">
        <div className="col-span-2">
            <label htmlFor="nome" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Nome da loja
            </label>
            <input
                type="text"
                name="nome"
                id="nome"
                value={adicionar.nome}
                onChange={handleChange}
                className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Digite o nome da loja"
                required
            />
        </div>
    </div>
    <button
        type="submit"
        className="bg-sky-400 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded max-w-md flex items-center gap-2"
    >
        Adicionar loja
    </button>
</form>


          </div>
        </div>
      )}

<h2 className="text-center text-2xl font-bold mt-5 mb-8">Conheça nossas lojas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lojas.map((loja) => (
                <div key={loja.id} className="bg-gray-800 p-4 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold">
                        {loja.nome || 'Loja sem nome'}
                    </h3>

                    <button
                        onClick={() => handleNavigateToProdutos(loja)}
                        className="mt-2 text-blue-500 hover:underline"
                    >
                        Ver produtos
                    </button>
                </div>
            ))}

        </div>

        </div>
    );
}
