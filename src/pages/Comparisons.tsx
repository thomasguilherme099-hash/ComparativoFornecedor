
import React, { useState } from 'react'
import {TrendingUp, TrendingDown, Minus, Search, Filter, Calendar, Download} from 'lucide-react'

interface PriceComparison {
  id: string
  productName: string
  productSku: string
  targetPrice: number
  competitors: {
    name: string
    price: number
    lastUpdated: string
    trend: 'up' | 'down' | 'stable'
    availability: boolean
  }[]
  bestPrice: number
  worstPrice: number
  averagePrice: number
  priceVariation: number
  lastAnalysis: string
}

const Comparisons: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [sortBy, setSortBy] = useState('priceVariation')

  // Mock data - em produção viria de uma API
  const [comparisons] = useState<PriceComparison[]>([
    {
      id: '1',
      productName: 'iPhone 15 Pro',
      productSku: 'IPH15PRO256',
      targetPrice: 8999.99,
      competitors: [
        {
          name: 'TechStore Brasil',
          price: 8799.00,
          lastUpdated: '2024-01-15T10:30:00',
          trend: 'down',
          availability: true
        },
        {
          name: 'Eletrônicos Mega',
          price: 9199.99,
          lastUpdated: '2024-01-15T09:15:00',
          trend: 'up',
          availability: true
        },
        {
          name: 'Casa dos Smartphones',
          price: 8950.00,
          lastUpdated: '2024-01-15T11:45:00',
          trend: 'stable',
          availability: false
        }
      ],
      bestPrice: 8799.00,
      worstPrice: 9199.99,
      averagePrice: 8982.33,
      priceVariation: 4.56,
      lastAnalysis: '2024-01-15T12:00:00'
    },
    {
      id: '2',
      productName: 'Samsung Galaxy S24',
      productSku: 'SGS24256',
      targetPrice: 7499.99,
      competitors: [
        {
          name: 'TechStore Brasil',
          price: 7299.00,
          lastUpdated: '2024-01-15T10:30:00',
          trend: 'down',
          availability: true
        },
        {
          name: 'Eletrônicos Mega',
          price: 7599.99,
          lastUpdated: '2024-01-15T09:15:00',
          trend: 'stable',
          availability: true
        }
      ],
      bestPrice: 7299.00,
      worstPrice: 7599.99,
      averagePrice: 7449.50,
      priceVariation: 4.12,
      lastAnalysis: '2024-01-15T12:00:00'
    }
  ])

  const filteredComparisons = comparisons.filter(comparison => {
    const matchesSearch = comparison.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comparison.productSku.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDate = !dateFilter || comparison.lastAnalysis.startsWith(dateFilter)
    
    return matchesSearch && matchesDate
  })

  const sortedComparisons = [...filteredComparisons].sort((a, b) => {
    switch (sortBy) {
      case 'priceVariation':
        return b.priceVariation - a.priceVariation
      case 'productName':
        return a.productName.localeCompare(b.productName)
      case 'targetPrice':
        return b.targetPrice - a.targetPrice
      case 'lastAnalysis':
        return new Date(b.lastAnalysis).getTime() - new Date(a.lastAnalysis).getTime()
      default:
        return 0
    }
  })

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-red-500" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-green-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-red-600'
      case 'down':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR')
  }

  const getPriceStatus = (price: number, targetPrice: number) => {
    const difference = ((price - targetPrice) / targetPrice) * 100
    
    if (difference < -5) {
      return { color: 'text-green-600', label: 'Muito abaixo' }
    } else if (difference < 0) {
      return { color: 'text-green-500', label: 'Abaixo' }
    } else if (difference < 5) {
      return { color: 'text-yellow-600', label: 'Próximo' }
    } else {
      return { color: 'text-red-600', label: 'Acima' }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Comparações de Preços</h1>
          <p className="mt-2 text-gray-600">
            Análise comparativa de preços entre concorrentes
          </p>
        </div>
        <button className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          <Download className="h-5 w-5 mr-2" />
          Exportar Relatório
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Date Filter */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="priceVariation">Maior Variação</option>
              <option value="productName">Nome do Produto</option>
              <option value="targetPrice">Preço Alvo</option>
              <option value="lastAnalysis">Última Análise</option>
            </select>
          </div>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSearchTerm('')
              setDateFilter('')
              setSortBy('priceVariation')
            }}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Limpar Filtros
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Produtos Analisados</p>
              <p className="text-2xl font-bold text-gray-900">{comparisons.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <TrendingDown className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Oportunidades</p>
              <p className="text-2xl font-bold text-gray-900">
                {comparisons.filter(c => c.bestPrice < c.targetPrice).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-lg p-3">
              <Minus className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Variação Média</p>
              <p className="text-2xl font-bold text-gray-900">
                {(comparisons.reduce((acc, c) => acc + c.priceVariation, 0) / comparisons.length).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Última Atualização</p>
              <p className="text-sm font-bold text-gray-900">
                {formatDateTime(comparisons[0]?.lastAnalysis || new Date().toISOString()).split(' ')[1]}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Comparisons List */}
      <div className="space-y-6">
        {sortedComparisons.map((comparison) => (
          <div key={comparison.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Product Header */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{comparison.productName}</h3>
                  <p className="text-sm text-gray-500">SKU: {comparison.productSku}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Preço Alvo</p>
                  <p className="text-lg font-semibold text-gray-900">{formatPrice(comparison.targetPrice)}</p>
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Melhor Preço</p>
                  <p className="text-xl font-bold text-green-600">{formatPrice(comparison.bestPrice)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Pior Preço</p>
                  <p className="text-xl font-bold text-red-600">{formatPrice(comparison.worstPrice)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Preço Médio</p>
                  <p className="text-xl font-bold text-gray-900">{formatPrice(comparison.averagePrice)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Variação</p>
                  <p className="text-xl font-bold text-blue-600">{comparison.priceVariation.toFixed(1)}%</p>
                </div>
              </div>
            </div>

            {/* Competitors Details */}
            <div className="px-6 py-4">
              <h4 className="text-sm font-medium text-gray-900 mb-4">Detalhes por Concorrente</h4>
              <div className="space-y-3">
                {comparison.competitors.map((competitor, index) => {
                  const priceStatus = getPriceStatus(competitor.price, comparison.targetPrice)
                  return (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium text-gray-900">{competitor.name}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`text-sm ${priceStatus.color}`}>
                              {priceStatus.label}
                            </span>
                            <span className="text-xs text-gray-500">•</span>
                            <span className={`text-xs ${competitor.availability ? 'text-green-600' : 'text-red-600'}`}>
                              {competitor.availability ? 'Disponível' : 'Indisponível'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            {getTrendIcon(competitor.trend)}
                            <span className={`font-semibold ${getTrendColor(competitor.trend)}`}>
                              {formatPrice(competitor.price)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Atualizado: {formatDateTime(competitor.lastUpdated).split(' ')[1]}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Analysis Footer */}
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Última análise: {formatDateTime(comparison.lastAnalysis)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sortedComparisons.length === 0 && (
        <div className="text-center py-12">
          <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma comparação encontrada</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || dateFilter 
              ? 'Tente ajustar os filtros de busca'
              : 'Adicione produtos e concorrentes para começar as análises'
            }
          </p>
        </div>
      )}
    </div>
  )
}

export default Comparisons
