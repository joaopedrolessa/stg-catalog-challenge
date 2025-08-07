/* 
🔧 ARQUIVO PARA CRIAR: src/app/teste/page.tsx
📝 PÁGINA DE TESTE PARA EXIBIR PRODUTOS DO SUPABASE
*/

'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/services/supabaseClient'
import Image from 'next/image'

interface Product {
  uuid: string
  price: number
  image_url: string
  category: string
  quantity: number
  created_at: string
}

export default function TestePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Função para buscar todos os produtos
  const fetchAllProducts = async () => {
    try {
      console.log('🔍 Buscando todos os produtos...')
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      console.log('📊 Resposta do Supabase:', { data, error })

      if (error) {
        console.error('❌ Erro:', error)
        setError(error.message)
        return
      }

      console.log('✅ Produtos carregados:', data?.length || 0)
      setProducts(data || [])
    } catch (err) {
      console.error('❌ Erro inesperado:', err)
      setError('Erro inesperado ao carregar produtos')
    } finally {
      setLoading(false)
    }
  }

  // Carregar produtos quando a página carregar
  useEffect(() => {
    fetchAllProducts()
  }, [])

  // Função para formatar preço
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  // Função para formatar data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🧪 Página de Teste - Produtos Supabase
          </h1>
          <p className="text-gray-600">
            Esta página exibe todos os produtos diretamente da tabela do Supabase
          </p>
          
          {/* Botão para recarregar */}
          <button
            onClick={fetchAllProducts}
            disabled={loading}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors disabled:bg-gray-400"
          >
            {loading ? '🔄 Carregando...' : '🔄 Recarregar Produtos'}
          </button>
        </div>

        {/* Status de Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando produtos...</p>
          </div>
        )}

        {/* Status de Erro */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-red-400 text-xl">❌</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Erro ao carregar produtos
                </h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
                <button
                  onClick={fetchAllProducts}
                  className="mt-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                >
                  Tentar Novamente
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Estatísticas */}
        {!loading && !error && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">📊 Estatísticas</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{products.length}</div>
                <div className="text-sm text-gray-600">Total de Produtos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {products.filter(p => p.quantity > 0).length}
                </div>
                <div className="text-sm text-gray-600">Em Estoque</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {products.filter(p => p.quantity === 0).length}
                </div>
                <div className="text-sm text-gray-600">Esgotados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {new Set(products.map(p => p.category)).size}
                </div>
                <div className="text-sm text-gray-600">Categorias</div>
              </div>
            </div>
          </div>
        )}

        {/* Lista de Produtos */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">📭</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum produto encontrado
            </h3>
            <p className="text-gray-600">
              A tabela produtos está vazia ou não foi possível acessá-la.
            </p>
          </div>
        )}

        {/* Grid de Produtos */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.uuid}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                {/* Imagem */}
                <div className="relative h-48 bg-gray-100">
                  <Image
                    src={product.image_url || 'https://via.placeholder.com/300x200?text=Produto'}
                    alt={`Produto ${product.category}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Sem+Imagem'
                    }}
                  />
                  
                  {/* Badge de Categoria */}
                  <div className="absolute top-2 left-2">
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      {product.category}
                    </span>
                  </div>

                  {/* Badge de Estoque */}
                  <div className="absolute top-2 right-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      product.quantity > 0 
                        ? product.quantity > 10
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.quantity > 0 ? `${product.quantity}` : 'Esgotado'}
                    </span>
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="p-4">
                  {/* UUID */}
                  <p className="text-xs text-gray-500 mb-2 font-mono">
                    ID: {product.uuid}
                  </p>

                  {/* Título */}
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Produto {product.category}
                  </h3>

                  {/* Preço */}
                  <div className="text-xl font-bold text-green-600 mb-2">
                    {formatPrice(product.price)}
                  </div>

                  {/* Detalhes */}
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Categoria:</span>
                      <span className="font-medium">{product.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quantidade:</span>
                      <span className="font-medium">{product.quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Criado em:</span>
                      <span className="font-medium">{formatDate(product.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Dados Raw (JSON) */}
        {!loading && !error && products.length > 0 && (
          <div className="mt-8 bg-gray-900 rounded-lg p-4">
            <h3 className="text-white text-lg font-semibold mb-4">
              📋 Dados Raw (JSON) - Primeiros 3 produtos
            </h3>
            <pre className="text-green-400 text-xs overflow-x-auto">
              {JSON.stringify(products.slice(0, 3), null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}