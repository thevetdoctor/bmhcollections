/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import ArchitectForm from './ArchitectForm';
import QuickList from './QuickList';
import ArchitectDataForm from './ArchitectDataForm';

function App() {
  const [showForm, setShowForm] = useState(true);

  const onCompleted = () => {
    // toast.success('Success');
    setShowForm(false);
  }

  const successContent = (
    <div className="mx-auto w-11/12 md:w-1/3 px-6 py-10 text-center border my-20 rounded">
      <p className='text-lg font-semibold'>Your submission was successful</p>
      <p className='opacity-50'>Please check your email for the next steps!</p>
    </div>
  )

  const uploadSuccessContent = (
    <div className="mx-auto w-11/12 md:w-1/3 px-6 py-10 text-center border my-20 rounded">
      <p className='text-lg font-semibold'>Your submission was successful</p>
      <p className='opacity-50 mt-4'>Now you are set to be featured on BuildMyHouseAfrica!</p>
    </div>
  )
 
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Switch>
            <Route path='/profileupdate/:dyno'>
              { showForm ? <ArchitectDataForm onCompleted={onCompleted} /> : uploadSuccessContent }
            </Route>
            <Route exact path='/'>
              { showForm ? <ArchitectForm onCompleted={onCompleted} /> : successContent }
            </Route>
            <Route exact path='/quicklist'>
              <QuickList onCompleted={onCompleted} />
            </Route>
          </Switch>
        </Router>
      </header>

      <ToastContainer />
    </div>
  );
}

export default App;
