import React, { Component} from "react";

import Cart from './components/Cart';
import 'antd/dist/antd.css';
import "./App.css";


class App extends Component{
  render(){
    return(
      <div className="App">
        <Cart name="world" />
      </div>
    );
  }
}

export default App;