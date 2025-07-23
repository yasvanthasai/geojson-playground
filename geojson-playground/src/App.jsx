import React, { useState } from 'react'
import GeoJSONMap from './components/GeoJSONMap'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('basic')

  const tabs = [
    { id: 'basic', label: 'Basic Shapes' },
    { id: 'points', label: 'Points' },
    { id: 'lines', label: 'Lines' },
    { id: 'polygons', label: 'Polygons' }
  ]

  return (
    <div className="app">
      <header style={{ 
        textAlign: 'center', 
        padding: '20px 0',
        backgroundColor: '#007bff',
        color: 'white',
        marginBottom: 20
      }}>
        <h1 style={{ margin: 0, fontSize: '2rem' }}>
          GeoJSON Playground
        </h1>
      </header>

      <main style={{ 
        maxWidth: '1000px', 
        margin: '0 auto', 
        padding: '0 20px' 
      }}>
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          marginBottom: '20px',
          borderBottom: '2px solid #e9ecef',
          paddingBottom: '10px'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '6px 6px 0 0',
                backgroundColor: activeTab === tab.id ? '#007bff' : '#f8f9fa',
                color: activeTab === tab.id ? 'white' : '#333',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <GeoJSONMap activeTab={activeTab} />
      </main>
    </div>
  )
}

export default App
