import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import ArchitectForm from './ArchitectForm';


function App() {
  const [showForm, setShowForm] = useState(true);

  const onCompleted = () => {
    toast.success('Success');
    setShowForm(false);
  }

  const successContent = (
    <div className="mx-auto w-11/12 md:w-1/3 px-6 py-10 text-center border my-20 rounded">
      <p className='text-lg font-semibold'>Your submission was successful</p>
      <p className='opacity-50'>A member of BMH would get back to you soon</p>
    </div>
  )

  return (
    <div className="App">
      <header className="App-header">
        { showForm ? <ArchitectForm onCompleted={onCompleted} /> : successContent }
      </header>

      <ToastContainer />
    </div>
  );
}

export default App;
