import React from 'react';

const Formulario = () => {
  return (
    <div className="flex items-center justify-center h-full mt-16">
      <div className="bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-lg shadow-lg max-w-md w-full">
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-white">
              ID do Funcionário
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite seu ID"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-white">
              Senha
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite sua senha"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 mt-4 font-semibold text-white bg-sky-400 rounded-md transition-transform transform hover:scale"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Formulario;
