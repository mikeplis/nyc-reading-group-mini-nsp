import React from 'react';
import ReactDOM from 'react-dom';

import './styles.css';

function ProductList({ products, onDeleteProduct }) {
  return (
    <div>
      <h2>Product List</h2>
      <ul>
        {products &&
          products.map(product => (
            <li key={product.id}>
              <div>{product.name}</div>
              <button onClick={() => onDeleteProduct(product)}>Delete</button>
            </li>
          ))}
      </ul>
    </div>
  );
}

function AddProductForm({ onAddProduct }) {
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [error, setError] = React.useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (name === '') {
      setError('Name is required');
    } else {
      onAddProduct({ name, description });
      setName('');
      setDescription('');
      setError(null);
    }
  }

  return (
    <React.Fragment>
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name:{' '}
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Description:{' '}
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </label>
        </div>
        <button type="submit">Add Product</button>
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </form>
    </React.Fragment>
  );
}

function productsReducer(products, action) {
  switch (action.type) {
    case 'ADD_PRODUCT':
      return [...products, action.product];
    case 'DELETE_PRODUCT':
      return products.filter(product => product.id !== action.product.id);
    default:
      return products;
  }
}

// function userProductsReducer(userProducts, action) {
//   switch (action.type) {
//     case 'ADD_PRODUCT': {
//       const { user, product } = action;
//       return {
//         ...userProducts,
//         [user]: [...(userProducts[user] || []), product],
//       };
//     }
//     case 'DELETE_PRODUCT': {
//       const { user, product } = action;
//       return {
//         ...userProducts,
//         [user]: userProducts[user].filter(
//           userProduct => userProduct.id !== product.id
//         ),
//       };
//     }
//     default:
//       return userProducts;
//   }
// }

function Home({ user, onLogOut }) {
  const [productId, setProductId] = React.useState(0);
  const [userProducts, dispatch] = React.useReducer(productsReducer, []);
  const products = userProducts[user];
  const greeting = user ? `Hello ${user}` : 'Hello';

  function handleAddProduct(newProduct) {
    const product = { ...newProduct, id: productId };
    dispatch({ type: 'ADD_PRODUCT', product });
    setProductId(prevProductId => prevProductId + 1);
  }

  function handleDeleteProduct(product) {
    dispatch({ type: 'DELETE_PRODUCT', product });
  }

  return (
    <div>
      <div>
        <div>{greeting}</div>
        <button onClick={onLogOut}>Log Out</button>
      </div>
      <ProductList products={products} onDeleteProduct={handleDeleteProduct} />
      <AddProductForm onAddProduct={handleAddProduct} />
    </div>
  );
}

const SECRET_PASSWORD = '123';

function SignIn({ onSignIn }) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (username === '') {
      setError('Username is required');
    } else if (password !== SECRET_PASSWORD) {
      setError('Incorrect password');
    } else {
      setUsername('');
      setPassword('');
      setError(null);
      onSignIn(username);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Username:{' '}
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Password:{' '}
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </label>
      </div>
      <button type="submit">Sign In</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
}

function appReducer(state, action) {
  switch (action.type) {
    case 'SIGN_IN':
      return { user: action.user, page: 'HOME' };
    case 'LOG_OUT':
      return { user: null, page: 'SIGN_IN' };
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = React.useReducer(appReducer, {
    user: null,
    page: 'SIGN_IN',
  });

  function handleSignIn(username) {
    dispatch({ type: 'SIGN_IN', user: username });
  }

  function handleLogOut() {
    dispatch({ type: 'LOG_OUT' });
  }

  switch (state.page) {
    case 'SIGN_IN':
      return <SignIn onSignIn={handleSignIn} />;
    case 'HOME':
      return <Home user={state.user} onLogOut={handleLogOut} />;
    default:
      return <div>Unknown page</div>;
  }
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
