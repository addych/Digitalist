import React from 'react'

const Header = ({ toggleModal, numItems }) => {
  return (
    <header className='header'>
      <div className='container'>
        <h1>Lista de Compras ({numItems})</h1>
        <button onClick={() => toggleModal(true)} className='btn'>
          <i className="bi bi-plus-lg">&nbsp;&nbsp;&nbsp;</i> Adicionar Item
        </button>
      </div>
    </header>
  )
}

export default Header