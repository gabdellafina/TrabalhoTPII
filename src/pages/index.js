import Image from "next/image";
import { React, useState } from "react";
import Logistics from '../public/img/Logistics.png';
import '../app/globals.css';
const [nome, setNome] = useState("");
const [senha, setSenha] = useState("");
const [mensagem, setMensagem] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:8080/usuarios/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ nome, senha }).toString(),
    });

    const textoResposta = await response.text();
    setMensagem(textoResposta);
  } catch (error) {
    setMensagem("Erro ao tentar realizar o login. Tente novamente.");
  }
};

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <div>
        <h1 className="text-3xl font-bold text-center mt-16 text-white">Controle de Estoque</h1>
      </div>

      <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Login</h2>
        <div className="mb-4">
          <label htmlFor="nome" className="block text-gray-700 font-medium mb-2">
            Nome
          </label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="Digite seu nome"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="senha" className="block text-gray-700 font-medium mb-2">
            Senha
          </label>
          <input
            type="password"
            id="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="Digite sua senha"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200"
        >
          Entrar
        </button>
        {mensagem && (
          <p className="mt-4 text-center text-gray-700">{mensagem}</p>
        )}
      </form>
    </div>

      <div className="absolute bottom-0 left-0">
        <Image
          src={Logistics}
          alt="Logística"
          width={500}
          height={500}
        />
      </div>
    </div>
  );
}
