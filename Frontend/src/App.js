import { getItem, saveItem, udpateItem, udpateImage, deleteItem } from './api/ItemService';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import { getItems } from './api/ItemService';
import { useEffect, useRef, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ItemList from './components/ItemList';
import ItemDetail from './components/ItemDetail';
import { toastError, toastSuccess } from './api/ToastService';
import { ToastContainer } from 'react-toastify';

function App() {
  const modalRef = useRef();
  const fileRef = useRef();
  const [data, setData] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [file, setFile] = useState(undefined);
  const [values, setValues] = useState({
    itemName: '',
    category: '',
    quantity: '',
    description: '',
    addedBy: '',
  });

  const getAllItems = async (page = 0, size = 8) => {
    try {
      setCurrentPage(page);
      const { data } = await getItems(page, size);
      setData(data);
      console.log(data);
    } catch (error) {
      console.log(error);
      toastError(error.message);
    }
  };

  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleNewItem = async (event) => {
    event.preventDefault();
    try {
      const item = {
        itemName: values.itemName,
        category: values.category,
        quantity: values.quantity,
        description: values.description,
        addedBy: values.addedBy,
        imageUrl: file ? URL.createObjectURL(file) : undefined
      };

      // Save the item and get the response data
      const { data: savedItem } = await saveItem([item]); // Wrap item in an array

      // Check if the item was saved successfully and has an ID
      if (savedItem && savedItem[0] && savedItem[0].id) {
        const formData = new FormData();
        formData.append('file', file, file.name);
        formData.append('id', savedItem[0].id);

        // Upload the image
        const { data: imageUrl } = await udpateImage(formData);
        console.log(imageUrl);
      } else {
        throw new Error('Item was not saved correctly');
      }
      toggleModal(false);
      setFile(undefined);
      fileRef.current.value = null;
      setValues({
        itemName: '',
        category: '',
        quantity: '',
        description: '',
        addedBy: '',
      });
      getAllItems();
    } catch (error) {
      console.log(error);
      toastError(error.message);
    }
  };

  const updateItem = async (item) => {
    try {
      const { data } = await udpateItem(item);
      getAllItems();
      console.log(data);
      toastSuccess('Item updated successfully');
    } catch (error) {
      console.log(error);
      toastError(error.message);
    }
  };

  const updateImg = async (formData) => {
    try {
      const { data: imageUrl } = await udpateImage(formData);
      toastSuccess('Image updated successfully');
    } catch (error) {
      toastError(error.message);
    }
  };

  const toggleModal = show => show ? modalRef.current.showModal() : modalRef.current.close();

  useEffect(() => {
    getAllItems();
  }, []);

  return (
    <>
      <Header toggleModal={toggleModal} numItems={data.totalElements} />
      <main className='main'>
        <div className='container'>
          <Routes>
            <Route path='/' element={<Navigate to={'/items'} />} />
            <Route path='/items' element={<ItemList data={data} currentPage={currentPage} getAllItems={getAllItems} />} />
            <Route path='/items/:id' element={<ItemDetail updateItem={updateItem} updateImg={updateImg} getAllItems={getAllItems} />} />
          </Routes>
        </div>
      </main>

      {/* Modal */}
      <dialog ref={modalRef} className="modal" id="modal">
        <div className="modal__header">
          <h3>Novo Item</h3>
          <i onClick={() => toggleModal(false)} className="bi bi-x-lg"></i>
        </div>
        <div className="divider"></div>
        <div className="modal__body">
          <form onSubmit={handleNewItem}>
            <div className="user-details">
              <div className="input-box">
                <span className="details">Nome</span>
                <input type="text" value={values.itemName} onChange={onChange} name='itemName' maxLength="15" required />
              </div>
              <div className="input-box">
                <span className="details">Categoria</span>
                <input type="text" value={values.category} onChange={onChange} name='category' maxLength="15" required />
              </div>
              <div className="input-box">
                <span className="details">Quantidade</span>
                <input type="number" value={values.quantity} onChange={onChange} name='quantity' required />
              </div>
              <div className="input-box">
                <span className="details">Descrição</span>
                <input type="text" value={values.description} onChange={onChange} name='description' maxLength="255" />
              </div>
              <div className="input-box">
                <span className="details">Adicionado por:</span>
                <input type="text" value={values.addedBy} onChange={onChange} name='addedBy' maxLength="15" required />
              </div>
              <div className="file-input">
                <span className="details">Imagem</span>
                <input type="file" onChange={(event) => setFile(event.target.files[0])} ref={fileRef} name='imageUrl' required />
              </div>
            </div>
            <div className="form_footer">
              <button onClick={() => toggleModal(false)} type='button' className="btn btn-danger">Cancel</button>
              <button type='submit' className="btn">Save</button>
            </div>
          </form>
        </div>
      </dialog>
      <ToastContainer />
    </>
  );
}

export default App;