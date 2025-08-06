import {Routes, Route} from 'react-router-dom';
import Multiplication from './Pages/Multiplication.jsx';

const App = () => {
  return (
     <Routes>
        <Route path='/multiplication' element={<Multiplication />}/>
     </Routes>
  )
}

export default App