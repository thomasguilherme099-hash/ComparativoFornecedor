
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {ArrowLeft, Save, Package} from 'lucide-react'
import toast from 'react-hot-toast'

interface ProductFormData {
  name: string
  category: string
  brand: string
  description: string
  targetPrice: string
  status: 'active' | 'inactive'
  sku: string
  minPrice: string
  maxPrice: string
}

const ProductForm: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    category: '',
    brand: '',
    description: '',
    targetPrice: '',
    status: 'active',
    sku: '',
    minPrice: '',
    maxPrice: ''
  })

  const [errors, setErrors] = useState<Partial<ProductFormData>>({})
  const [isLoading, setIsLoading] = useState(false)

  const categories = [
    'Smartphones',
    'Notebooks',
    'Tablets',
    'Acessórios',
    'Eletrônicos',
    'Informática',
    'Games',
    'Casa e Decoração'
  ]

  useEffect(() => {
    if (isEditing && id) {
      // Simular carregamento de dados do produto para edição
      setFormData({
        name: 'iPhone 15 Pro',
        category: 'Smartphones',
        brand: 'Apple',
        description: 'Smartphone premium com câmera profissional',
        targetPrice: '8999.99',
        status: 'active',
        sku: 'IPH15PRO256',
        minPrice: '8000.00',
        maxPrice: '10000.00'
      })
    }
  }, [isEditing, id])

  const validateForm = (): boolean => {
    const newErrors: Partial<ProductFormData> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nome do produto é obrigatório'
    }

    if (!formData.category) {
      newErrors.category = 'Categoria é obrigatória'
    }

    if (!formData.brand.trim()) {
      newErrors.brand = 'Marca é obrigatória'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória'
    }

    if (!formData.targetPrice) {
      newErrors.targetPrice = 'Preço alvo é obrigatório'
    } else if (isNaN(Number(formData.targetPrice)) || Number(formData.targetPrice) <= 0) {
      newErrors.targetPrice = 'Preço alvo deve ser um número válido maior que zero'
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU é obrigatório'
    }

    if (formData.minPrice && (isNaN(Number(formData.minPrice)) || Number(formData.minPrice) < 0)) {
      newErrors.minPrice = 'Preço mínimo deve ser um número válido'
    }

    if (formData.maxPrice && (isNaN(Number(formData.maxPrice)) || Number(formData.maxPrice) < 0)) {
      newErrors.maxPrice = 'Preço máximo deve ser um número válido'
    }

    if (formData.minPrice && formData.maxPrice && Number(formData.minPrice) > Number(formData.maxPrice)) {
      newErrors.maxPrice = 'Preço máximo deve ser maior que o preço mínimo'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Por favor, corrija os erros no formulário')
      return
    }

    setIsLoading(true)

    try {
      // Simular chamada de API
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast.success(isEditing ? 'Produto atualizado com sucesso!' : 'Produto cadastrado com sucesso!')
      navigate('/products')
    } catch (error) {
      toast.error('Erro ao salvar produto. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name as keyof ProductFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/products')}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Editar Produto' : 'Novo Produto'}
          </h1>
          <p className="mt-2 text-gray-600">
            {isEditing 
              ? 'Atualize as informações do produto' 
              : 'Preencha os dados para cadastrar um novo produto'
            }
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Package className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Informações do Produto</h2>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Produto *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: iPhone 15 Pro"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-2">
                SKU *
              </label>
              <input
                type="text"
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.sku ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: IPH15PRO256"
              />
              {errors.sku && (
                <p className="mt-1 text-sm text-red-600">{errors.sku}</p>
              )}
            </div>

            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
                Marca *
              </label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.brand ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: Apple"
              />
              {errors.brand && (
                <p className="mt-1 text-sm text-red-600">{errors.brand}</p>
              )}
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Categoria *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Selecione uma categoria</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Descrição *
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Descreva as principais características do produto..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="targetPrice" className="block text-sm font-medium text-gray-700 mb-2">
                Preço Alvo (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                id="targetPrice"
                name="targetPrice"
                value={formData.targetPrice}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.targetPrice ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.targetPrice && (
                <p className="mt-1 text-sm text-red-600">{errors.targetPrice}</p>
              )}
            </div>

            <div>
              <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-2">
                Preço Mínimo (R$)
              </label>
              <input
                type="number"
                step="0.01"
                id="minPrice"
                name="minPrice"
                value={formData.minPrice}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.minPrice ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.minPrice && (
                <p className="mt-1 text-sm text-red-600">{errors.minPrice}</p>
              )}
            </div>

            <div>
              <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-2">
                Preço Máximo (R$)
              </label>
              <input
                type="number"
                step="0.01"
                id="maxPrice"
                name="maxPrice"
                value={formData.maxPrice}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.maxPrice ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.maxPrice && (
                <p className="mt-1 text-sm text-red-600">{errors.maxPrice}</p>
              )}
            </div>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isLoading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Cadastrar')}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProductForm
