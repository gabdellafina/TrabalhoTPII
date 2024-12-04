import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import '../app/globals.css';

export default function Produtos() {
    const router = useRouter();
    const [selectedOption, setSelectedOption] = useState(null);
    const [isPriceListOpen, setIsPriceListOpen] = useState(false);
    const [isStockQuantityOpen, setIsStockQuantityOpen] = useState(false);
    const [produtos, setProdutos] = useState([]);
    const [produtosFiltrados, setProdutosFiltrados] = useState([]);
    const [valorTotalEstoque, setValorTotalEstoque] = useState(0);
    const { lojaId } = router.query;
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [modalType, setModalType] = useState("add"); // "add" para adicionar, "edit" para editar
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);

    const openAddModal = () => {
    setModalType("add");
    setProdutoSelecionado(null); // Limpa os dados de produto
    setIsAddModalOpen(true);
    
    };

    const openEditModal = (produto) => {
    setModalType("edit");
    setProdutoSelecionado(produto); // Define o produto a ser editado
    setIsEditModalOpen(true);
    editarProduto(produto);
    };

    const closeAddModal = () => {
    setIsAddModalOpen(false);
    setProdutoSelecionado(null);
    };

    const closeEditModal = () => {
    setIsEditModalOpen(false);
    setProdutoSelecionado(null);
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setNovoProduto({ ...novoProduto, [name]: value });
    };

    const [novoProduto, setNovoProduto] = useState({
        codigo: '',
        nome: '',
        preco: '',
        quantidade: '',
        loja: '',
    });

    useEffect(() => {
        fetch('https://ec2-44-199-209-196.compute-1.amazonaws.com:8443/produtos/ordenadosPorNome')
            .then((res) => res.json())
            .then((data) => {
                setProdutos(data);
                setProdutosFiltrados(data);
            })
            .catch((error) => {
                console.error('Erro ao buscar produtos:', error);
            });
    }, []);

    useEffect(() => {
        fetchValorTotalEstoque();
    }, []);
    
    const fetchValorTotalEstoque = async () => {
        const reponse = await fetch('https://ec2-44-199-209-196.compute-1.amazonaws.com:8443/produtos/valorTotalEstoque');
        const data = await reponse.json();
        setValorTotalEstoque(data);
    };

    const fetchLojas = async () => {
        fetch('https://ec2-44-199-209-196.compute-1.amazonaws.com:8443/lojas')
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
    };

    const [lojas, setLojas] = useState([]);

    useEffect(() => {
        fetchLojas();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://ec2-44-199-209-196.compute-1.amazonaws.com:8443/produtos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(novoProduto),
            });

            if (response.ok) {
                const produtoCriado = await response.json();
                setProdutos((prev) => [...prev, produtoCriado]);
                setProdutosFiltrados((prev) => [...prev, produtoCriado]);
                fetchValorTotalEstoque(); // Atualizar o valor total do estoque
                closeAddModal(); // Fechar o modal
                setNovoProduto({ nome: '', preco: '', quantidade: '', codigo: '' }); // Limpar os campos
            } else {
                console.error('Erro ao criar produto:', await response.text());
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
        }
    };

    const excluirProduto = async (codigo) => {
        try {
          const response = await fetch(
            'https://ec2-44-199-209-196.compute-1.amazonaws.com:8443/produtos/${codigo}',
            {
              method: "DELETE",
            }
          );
      
          if (response.ok) {
            // Atualiza a lista de produtos após excluir o produto
            setProdutosFiltrados((prevProdutos) => 
              prevProdutos.filter((produto) => produto.codigo !== codigo) // Filtra o produto excluído
            );
            alert("Produto excluído com sucesso!");
          } else {
            const errorData = await response.json();
            console.error("Erro ao excluir:", errorData);
            alert("Erro ao excluir o produto.");
          }
        } catch (error) {
          console.error("Erro na exclusão:", error);
          alert("Erro ao excluir o produto.");
        }
      };

    const filtrarPorPreco = (tipo) => {
        const filtrados = [...produtos].sort((a, b) =>
            tipo === 'menor' ? a.preco - b.preco : b.preco - a.preco
        );
        setProdutosFiltrados(filtrados);
    };

    const filtrarPorEstoque = (tipo) => {
        const filtrados = [...produtos].sort((a, b) =>
            tipo === 'menor' ? a.quantidade - b.quantidade : b.quantidade - a.quantidade
        );
        setProdutosFiltrados(filtrados);
    };
    

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        if (option === 'estoque') setIsStockQuantityOpen(!isStockQuantityOpen);
        else setIsStockQuantityOpen(false);
        if (option === 'preco') setIsPriceListOpen(!isPriceListOpen);
        else setIsPriceListOpen(false);
    };

    useEffect(() => {
        if (lojaId) {
            fetch(`https://ec2-44-199-209-196.compute-1.amazonaws.com:8443/produtos?lojaId=${lojaId}`)
                .then((res) => res.json())
                .then((data) => setProdutos(data))
                .catch((error) => console.error('Erro ao buscar produtos:', error));
        }
    }, [lojaId]);

    const editarProduto = async (produto) => {
        try {
            // Defina os dados do produto que serão enviados na atualização
            const dadosAtualizacao = {
                novoEstoque: produto.novoEstoque,
                novoPreco: produto.novoPreco,
            };
    
            // Primeira chamada: Atualizar o produto
            const atualizarResponse = await fetch(
                `https://ec2-44-199-209-196.compute-1.amazonaws.com:8443/estoque/atualizar/${produto.codigoProduto}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dadosAtualizacao),
                }
            );
    
            if (!atualizarResponse.ok) {
                console.error('Erro ao atualizar produto:', await atualizarResponse.text());
                return;
            }
    
            const produtoAtualizado = await atualizarResponse.json();
            console.log('Produto atualizado:', produtoAtualizado);
    
            // Segunda chamada: Associar o produto a uma loja
            if (produto.lojaId) {
                const associarResponse = await fetch(
                    `https://ec2-44-199-209-196.compute-1.amazonaws.com:8443/estoque/associarProduto?lojaId=${produto.lojaId}`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(produtoAtualizado),
                    }
                );
    
                if (!associarResponse.ok) {
                    console.error('Erro ao associar produto à loja:', await associarResponse.text());
                    return;
                }
    
                const produtoAssociado = await associarResponse.json();
                console.log('Produto associado à loja:', produtoAssociado);
            }
    
            alert('Produto atualizado e associado à loja com sucesso!');
        } catch (error) {
            console.error('Erro durante a edição do produto:', error);
        }
    };
    

    return (
        <>
            {/* Navegação */}
            <nav className="flex justify-between p-5 items-center">
                <a href="/homepage" className="ml-1 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Voltar para a Home Page
                </a>
                <h1 className="text-3xl font-bold text-white text-center">Produtos</h1>
                <button
                onClick={openAddModal}
                className="bg-sky-400 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded max-w-md flex items-center gap-2"
                >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Adicionar produto
                </button>
                
            </nav>



      {isAddModalOpen && (
        <div
          id="crud-modal"
          className="fixed top-0 left-0 right-0 z-50 w-full h-full flex justify-center items-center backdrop-blur-lg"
        >
          <div className="relative bg-black bg-opacity-8 backdrop-blur-lg p-4 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Cadastro de produto
              </h3>
              <button
                onClick={closeAddModal}
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
            <label htmlFor="codigo" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Código do produto
            </label>
            <input
                type="text"
                name="codigo"
                id="codigo"
                value={novoProduto.codigo}
                onChange={handleChange}
                className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Digite o código do produto"
                required
            />
        </div>
        <div className="col-span-2">
            <label htmlFor="nome" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Nome do produto
            </label>
            <input
                type="text"
                name="nome"
                id="nome"
                value={novoProduto.nome}
                onChange={handleChange}
                className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Digite o nome do produto"
                required
            />
        </div>
        <div className="col-span-2">
            <label htmlFor="loja" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Loja do produto
            </label>
            <select
                name="loja"
                id="loja"
                value={novoProduto.loja}
                onChange={handleChange}
                className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
                <option value="">Selecione uma loja</option>
                {lojas.map((loja) => (
                    <option key={loja.id} value={loja.id}>
                        {loja.nome}
                    </option>
                ))}
            </select>
        </div>
        <div className="col-span-2 sm:col-span-1">
            <label htmlFor="preco" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Preço
            </label>
            <input
                type="number"
                name="preco"
                id="preco"
                value={novoProduto.preco}
                onChange={handleChange}
                className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="R$9999"
                required
            />
        </div>
        <div className="col-span-2 sm:col-span-1">
            <label htmlFor="quantidade" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Quantidade
            </label>
            <input
                type="number"
                name="quantidade"
                id="quantidade"
                value={novoProduto.quantidade}
                onChange={handleChange}
                className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Digite a quantidade"
                required
            />
        </div>
    </div>
    <button
        type="submit" onClick={handleSubmit}
        className="bg-sky-400 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded max-w-md flex items-center gap-2"
    >
        Adicionar produto
    </button>
</form>

          </div>
        </div>
      )}

      {isEditModalOpen && (
          <div
            id="crud-modal"
            className="fixed top-0 left-0 right-0 z-50 w-full h-full flex justify-center items-center backdrop-blur-lg"
            >
            <div className="relative bg-black bg-opacity-8 backdrop-blur-lg p-4 rounded-lg shadow-lg max-w-md w-full">
                <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Editar informações de produto
                </h3>
                <button
                    onClick={closeEditModal}
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
                <label htmlFor="loja" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Loja do produto
                </label>
                <select
                    name="loja"
                    id="loja"
                    value={produtos.loja}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                    <option value="">Selecione uma loja</option>
                    {lojas.map((loja) => (
                        <option key={loja.id} value={loja.id}>
                            {loja.nome}
                        </option>
                    ))}
                </select>
            </div>
            <div className="col-span-2 sm:col-span-1">
                <label htmlFor="preco" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Preço
                </label>
                <input
                    type="number"
                    name="preco"
                    id="preco"
                    value={produtos.preco}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="R$9999"
                    required
                />
            </div>
            <div className="col-span-2 sm:col-span-1">
                <label htmlFor="quantidade" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Quantidade
                </label>
                <input
                    type="number"
                    name="quantidade"
                    id="quantidade"
                    value={produtos.quantidade}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Digite a quantidade"
                    required
                />
            </div>
        </div>
        <button
            type="submit"
            className="bg-sky-400 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded max-w-md flex items-center gap-2"
        >
            Editar produto
        </button>
        </form>

          </div>
        </div>
      )}

            {/* Filtros */}
            <div className="flex items-center justify-center py-4 md:py-8 flex-wrap">
                <button
                    type="button"
                    onClick={() => { setProdutosFiltrados(produtos); setSelectedOption('todos'); }}
                    className={`${
                        selectedOption === 'todos' ? 'bg-sky-500' : 'bg-sky-400'
                    } text-white hover:bg-sky-500 focus:ring-4 focus:outline-none focus:ring-sky-300 rounded-full text-base font-medium px-5 py-2.5 text-center me-3 mb-3`}
                >
                    Todos os produtos
                </button>
                <button
                    type="button"
                    onClick={() => handleOptionClick('estoque')}
                    className={`${
                        selectedOption === 'estoque' ? 'bg-sky-500' : 'bg-sky-400'
                    } text-white hover:bg-sky-500 focus:ring-4 focus:outline-none focus:ring-sky-300 rounded-full text-base font-medium px-5 py-2.5 text-center me-3 mb-3`}
                >
                    Por Estoque
                </button>
                <button
                    type="button"
                    onClick={() => handleOptionClick('preco')}
                    className={`${
                        selectedOption === 'preco' ? 'bg-sky-500' : 'bg-sky-400'
                    } text-white hover:bg-sky-500 focus:ring-4 focus:outline-none focus:ring-sky-300 rounded-full text-base font-medium px-5 py-2.5 text-center me-3 mb-3`}
                >
                    Por Preço
                </button>
            </div>

            {/* Listas suspensas */}
            {isStockQuantityOpen && (
                <div className="flex gap-4 justify-center items-center">
                    <button
                        onClick={() => filtrarPorEstoque('menor')}
                        className="bg-sky-400 hover:bg-sky-500 text-white font-medium py-2 px-4 rounded"
                    >
                        Menor Estoque
                    </button>
                    <button
                        onClick={() => filtrarPorEstoque('maior')}
                        className="bg-sky-400 hover:bg-sky-500 text-white font-medium py-2 px-4 rounded"
                    >
                        Maior Estoque
                    </button>
                </div>
            )}
            {isPriceListOpen && (
                <div className="flex gap-4 justify-center items-center">
                    <button
                        onClick={() => filtrarPorPreco('menor')}
                        className="bg-sky-400 hover:bg-sky-500 text-white font-medium py-2 px-4 rounded"
                    >
                        Menor Preço
                    </button>
                    <button
                        onClick={() => filtrarPorPreco('maior')}
                        className="bg-sky-400 hover:bg-sky-500 text-white font-medium py-2 px-4 rounded"
                    >
                        Maior Preço
                    </button>
                </div>
            )}

            <div className="flex justify-center items-center mt-5" >
                <p className='mx-2'>Quantidade de produtos: {produtosFiltrados.length} </p>
                <p className='mx-2'>Valor total: R$ {valorTotalEstoque.toFixed(2)}</p>
            </div>

            {/* Exibição dos Produtos */}
            <div className="relative overflow-x-auto mt-5 mx-10">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Ações</th>
                            <th scope="col" className="px-6 py-3">Código</th>
                            <th scope="col" className="px-6 py-3">Nome do Produto</th>
                            <th scope="col" className="px-6 py-3">Preço</th>
                            <th scope="col" className="px-6 py-3">Quantidade em Estoque</th>
                        </tr>
                    </thead>
                    <tbody>
                        {produtosFiltrados.map((produto, index) => (
                            <tr
                                key={produto.id}
                                className={`${
                                    index % 2 === 0
                                        ? "bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                        : "bg-gray-50 dark:bg-gray-700 dark:border-gray-700"
                                }`}
                            >
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => excluirProduto(produto.codigoProduto)}
                                        className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-3 rounded"
                                    >
                                        Excluir
                                    </button>
                                    <button
                                        onClick={() => openEditModal(produto)}
                                        className="bg-sky-400 hover:bg-sky-500 text-white font-medium py-1 px-3 rounded ms-2"
                                    >
                                        Editar
                                    </button>

                                </td>
                                <td className="px-6 py-4">{produto.codigo}</td>
                                <th
                                    scope="row"
                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                >
                                    {produto.nome}
                                </th>
                                <td className="px-6 py-4">R$ {produto.preco.toFixed(2)}</td>
                                <td className="px-6 py-4">{produto.quantidade}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </>
    );
};
