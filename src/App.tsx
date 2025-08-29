
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import ProductForm from './pages/ProductForm'
import Competitors from './pages/Competitors'
import CompetitorForm from './pages/CompetitorForm'
import Comparisons from './pages/Comparisons'

function App() {
  return (
    <Router>
      <div className="App">
        <Toaster position="top-right" />
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/new" element={<ProductForm />} />
            <Route path="/products/edit/:id" element={<ProductForm />} />
            <Route path="/competitors" element={<Competitors />} />
            <Route path="/competitors/new" element={<CompetitorForm />} />
            <Route path="/competitors/edit/:id" element={<CompetitorForm />} />
            <Route path="/comparisons" element={<Comparisons />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  )
}

export default App
