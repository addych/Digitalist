import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getItem, deleteItem } from '../api/ItemService';
import { toastError, toastSuccess } from '../api/ToastService';

const ItemDetail = ({ updateItem, updateImg, getAllItems }) => {
  const inputRef = useRef();
  const navigate = useNavigate();
  const [item, setItem] = useState({
    id: '',
    itemName: '',
    category: '',
    quantity: '',
    description: '',
    addedBy: '',
    imageUrl: ''
  });

  const { id } = useParams();

  const fetchItem = async (id) => {
    try {
      const { data } = await getItem(id);
      setItem(data);
      console.log(data);
    } catch (error) {
      console.log(error);
      toastError(error.message);
    }
  };

  const selectImage = () => {
    inputRef.current.click();
  };

  const updateImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file, file.name);
      formData.append('id', id);
      await updateImg(formData);
      setItem((prev) => ({ ...prev, imageUrl: `${prev.imageUrl}?updated_at=${new Date().getTime()}` }));
      console.log('data');
      toastSuccess('Image updated successfully');
      await getAllItems(); // Add this line to update the list
    } catch (error) {
      console.log(error);
      toastError(error.message);
    }
  };

  const onChange = (event) => {
    setItem({ ...item, [event.target.name]: event.target.value });
  };

  const onUpdateItem = async (event) => {
    event.preventDefault();
    await updateItem(item);
    fetchItem(id);
    toastSuccess('Item updated successfully');
    await getAllItems(); // Add this line to update the list
  };

  const onDeleteItem = async () => {
    try {
      await deleteItem(id);
      toastSuccess('Item deleted successfully');
      navigate('/items');
      await getAllItems(); // Add this line to update the list
    } catch (error) {
      console.log(error);
      toastError(error.message);
    }
  };

  useEffect(() => {
    fetchItem(id);
  }, [id]);

  return (
    <>
      <Link to={'/items'} className='link'><i className='bi bi-arrow-left'></i>Voltar</Link>
      <div className='profile'>
        <div className='profile__settings'>
          <div>
            <form onSubmit={onUpdateItem} className="form">
              <div className="user-details">
                <div className="input-box">
                  <span className="details">Nome</span>
                  <input type="text" value={item.itemName} onChange={onChange} name='itemName' maxLength="15" required />
                </div>
                <div className="input-box">
                  <span className="details">Categoria</span>
                  <input type="text" value={item.category} onChange={onChange} name='category' maxLength="15" required />
                </div>
                <div className="input-box">
                  <span className="details">Quantidade</span>
                  <input type="number" value={item.quantity} onChange={onChange} name='quantity' required />
                </div>
                <div className="input-box">
                  <span className="details">Descrição</span>
                  <input type="text" value={item.description} onChange={onChange} name='description' maxLength="255" />
                </div>
                <div className="input-box">
                  <span className="details">Adicionado por</span>
                  <input type="text" value={item.addedBy} onChange={onChange} name='addedBy' maxLength="15" required />
                </div>
              </div>
              <div className="form_footer">
                <button type="submit" className="btn">Salvar</button>
                <button type="button" onClick={onDeleteItem} className="btn btn-danger">Apagar</button>
              </div>
            </form>
          </div>
        </div>
        <div className='profile__details'>
          <img src={item.imageUrl} alt={`Image of item ${item.itemName}`} />
          <div className='profile__metadata'>
            <p className='profile__name'>{item.itemName}</p>
            <p className='profile__muted'>JPG ou PNG. Máximo de 10MB</p>
            <button onClick={selectImage} className='btn'><i className='bi bi-cloud-upload'></i> Mudar Imagem</button>
          </div>
        </div>
      </div>
      <form style={{ display: 'none' }}>
        <input type='file' ref={inputRef} onChange={(event) => updateImage(event.target.files[0])} name='file' accept='image/*'></input>
      </form >
    </>
  )
}

export default ItemDetail;