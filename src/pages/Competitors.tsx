
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {Plus, Search, Edit, Trash2, Users, Globe, Filter} from 'lucide-react'
import toast from 'react-hot-toast'

interface Competitor {
  id: string
  name: string
  website: string
  type: 'online' | 'physical' | 'marketplace'
  status: 'active' | 'inactive'
  description: string
  contactEmail: string
  phone: string
  address: string
  createdAt: string
}

const Competitors: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // Mock data - em produção viria de uma API
  const [competitors] = useState<Competitor[]>([
    {
      id: '1',
      name: 'TechStore Brasil',
      website: 'https://techstore.com.br',
      type: 'online',
      status: 'active',
      description: 'Loja especializada em eletrônicos e informática',
      contactEmail: 'contato@techstore.com.br',
      phone: '(11) 99999-9999',
      address: 'São Paulo, SP',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Eletrônicos Mega',
      website: 'https://eletronicosmega.com',
      type: 'marketplace',
      status: 'active',
      description: 'Marketplace com diversos vendedores',
      contactEmail: 'parceiros@eletronicosmega.com',
      phone: '(21) 88888-8888',
      address: 'Rio de Janeiro, RJ',
      createdAt: '2024-01-14'
    },
    {
      id: '3',
      name: 'Casa dos Smartphones',
      website: 'https://casadossmartphones.com.br',
      type: 'physical',
      status: 'inactive',
      description: 'Loja física especializada em smartphones',
      contactEmail: 'vendas@casadossmartphones.com.br',
      phone: '(31) 77777-7777',
      address: 'Belo Horizonte, MG',
      createdAt: '2024-01-13'
    }
  ])

  const competitorTypes = [
    { value: 'online', label: 'Loja Online' },
    { value: 'physical', label: 'Loja Física' },
    { value: 'marketplace', label: 'Marketplace' }
  ]

  const filteredCompetitors = competitors.filter(competitor => {
    const matchesSearch = competitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         competitor.website.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = !typeFilter || competitor.type === typeFilter
    const matchesStatus = !statusFilter || competitor.status === statusFilter
    
    return matchesSearch && matchesType && matchesStatus
  })

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o concorrente "${name}"?`)) {
      toast.success('Concorrente excluído com sucesso!')
    }
  }

  const getTypeLabel = (type: string) => {
    const typeObj = competitorTypes.find(t => t.value === type)
    return typeObj ? typeObj.label : type
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'online':
        return <Globe className="h-4 w-4" />
      case 'physical':
        return <Users className="h-4 w-4" />
      case 'marketplace':
        return <Search className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Concorrentes</h1>
          <p className="mt-2 text-gray-600">
            Gerencie os concorrentes para monitoramento de preços
          </p>
        </div>
        <Link
          to="/competitors/new"
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Novo Concorrente
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar concorrentes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Type Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="">Todos os tipos</option>
              {competitorTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos os status</option>
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>
          </div>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSearchTerm('')
              setTypeFilter('')
              setStatusFilter('')
            }}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Limpar Filtros
          </button>
        </div>
      </div>

      {/* Competitors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCompetitors.map((competitor) => (
          <div key={competitor.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 rounded-lg p-2">
                    {getTypeIcon(competitor.type)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{competitor.name}</h3>
                    <p className="text-sm text-gray-500">{getTypeLabel(competitor.type)}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  competitor.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {competitor.status === 'active' ? 'Ativo' : 'Inativo'}
                </span>
              </div>

              <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                {competitor.description}
              </p>

              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Globe className="h-4 w-4 mr-2" />
                  <a 
                    href={competitor.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 truncate"
                  >
                    {competitor.website}
                  </a>
                </div>
                
                {competitor.contactEmail && (
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="h-4 w-4 mr-2">✉</span>
                    <span className="truncate">{competitor.contactEmail}</span>
                  </div>
                )}

                {competitor.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="h-4 w-4 mr-2">📞</span>
                    <span>{competitor.phone}</span>
                  </div>
                )}

                {competitor.address && (
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="h-4 w-4 mr-2">📍</span>
                    <span>{competitor.address}</span>
                  </div>
                )}
              </div>

              <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Criado em {new Date(competitor.createdAt).toLocaleDateString('pt-BR')}
                </p>
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/competitors/edit/${competitor.id}`}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Editar concorrente"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(competitor.id, competitor.name)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Excluir concorrente"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCompetitors.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum concorrente encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || typeFilter || statusFilter 
              ? 'Tente ajustar os filtros de busca'
              : 'Comece adicionando um novo concorrente'
            }
          </p>
          {!searchTerm && !typeFilter && !statusFilter && (
            <div className="mt-6">
              <Link
                to="/competitors/new"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Adicionar Concorrente
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Competitors
