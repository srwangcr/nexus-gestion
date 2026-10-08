import React, { useState } from 'react';
import './SupplierForm.css';

const SupplierForm = ({ onSubmit, initialData = null }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [contact, setContact] = useState(initialData?.contact || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [address, setAddress] = useState(initialData?.address || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, contact, email, phone, address });
    // Limpiar formulario
    setName('');
    setContact('');
    setEmail('');
    setPhone('');
    setAddress('');
  };

  return (
    <form className="supplier-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Nombre del Proveedor</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre de la empresa"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="contact">Persona de Contacto</label>
        <input
          type="text"
          id="contact"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="Nombre del contacto"
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Correo Electrónico</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="correo@proveedor.com"
        />
      </div>

      <div className="form-group">
        <label htmlFor="phone">Teléfono</label>
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+1 234 567 890"
        />
      </div>

      <div className="form-group">
        <label htmlFor="address">Dirección</label>
        <textarea
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Dirección completa"
          rows="2"
        />
      </div>

      <button type="submit" className="btn-submit">
        {initialData ? 'Actualizar Proveedor' : 'Agregar Proveedor'}
      </button>
    </form>
  );
};

export default SupplierForm;