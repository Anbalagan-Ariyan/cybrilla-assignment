import React from 'react';
import { BrowserRouter as Router, Route,Switch, withRouter } from 'react-router-dom';
import Cart from './components/cart';
import Product from './components/product';
class App extends React.Component {
  
render(){
  return (
    <div>
      <Router >       
         <Switch>
             <Route exact  path="/"><Product /> </Route>
             <Route exact  path="/cart" ><Cart /></Route>
        </Switch>
      </Router>
    </div>
  );
}
}
export default App;
