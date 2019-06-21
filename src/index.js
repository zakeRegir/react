import React from 'react';
import ReactDOM from 'react-dom';

//引入BrowserRouter组件，重命名为Router
import { BrowserRouter as Router } from 'react-router-dom';

import App from './App'

ReactDOM.render(<Router><App/></Router>, document.getElementById('root'))