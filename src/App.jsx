import {Routes, Route} from 'react-router-dom';
import Multiplication from './Pages/Multiplication.jsx';
import Division from './Pages/Division.jsx';

const App = () => {
  return (
     <Routes>
        <Route path='/multiplication' element={<Multiplication />}/>
        <Route path='/division' element={<Division />}/>
     </Routes>
  )
}

export default App