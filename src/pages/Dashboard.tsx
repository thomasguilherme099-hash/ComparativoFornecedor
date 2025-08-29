
import React from 'react'
import { Link } from 'react-router-dom'
import {Package, Users, TrendingUp, Plus, BarChart3} from 'lucide-react'

const Dashboard: React.FC = () => {
  const stats = [
    {
      name: 'Total de Produtos',
      value: '12',
      icon: Package,
      color: 'bg-blue-500',
      href: '/products'
    },
    {
      name: 'Concorrentes Ativos',
      value: '8',
      icon: Users,
      color: 'bg-green-500',
      href: '/competitors'
    },
    {
      name: 'Comparações Realizadas',
      value: '24',
      icon: TrendingUp,
      color: 'bg-purple-500',
      href: '/comparisons'
    },
    {
      name: 'Análises Hoje',
      value: '6',
      icon: BarChart3,
      color: 'bg-orange-500',
      href: '/comparisons'
    }
  ]

  const recentActivity = [
    {
      id: 1,
      action: 'Produto adicionado',
      item: 'iPhone 15 Pro',
      time: '2 horas atrás'
    },
    {
      id: 2,
      action: 'Concorrente atualizado',
      item: 'TechStore Brasil',
      time: '4 horas atrás'
    },
    {
      id: 3,
      action: 'Comparação realizada',
      item: 'Samsung Galaxy S24',
      time: '6 horas atrás'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Visão geral do sistema de comparação de preços
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Link
            to="/products/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Novo Produto
          </Link>
          <Link
            to="/competitors/new"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Novo Concorrente
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.name}
              to={stat.href}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div className={`${stat.color} rounded-lg p-3`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Atividade Recente</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.item}</p>
                </div>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
          <div className="space-y-3">
            <Link
              to="/products"
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Package className="h-5 w-5 text-blue-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">Gerenciar Produtos</span>
            </Link>
            <Link
              to="/competitors"
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Users className="h-5 w-5 text-green-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">Gerenciar Concorrentes</span>
            </Link>
            <Link
              to="/comparisons"
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <TrendingUp className="h-5 w-5 text-purple-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">Ver Comparações</span>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo de Preços</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Menor Preço Encontrado</span>
              <span className="text-sm font-semibold text-green-600">R$ 2.499,99</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Maior Preço Encontrado</span>
              <span className="text-sm font-semibold text-red-600">R$ 8.999,99</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Preço Médio</span>
              <span className="text-sm font-semibold text-blue-600">R$ 5.249,99</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
