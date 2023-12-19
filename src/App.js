import Header from './Header';
import SearchItem from './SearchItem';
import AddItem from './AddItem';
import Content from './Content';
import Footer from './Footer';
import { useState, useEffect } from 'react';
import apiRequest from './apiRequest';

function App() {
  const API_URL = 'http://localhost:3500/items';

  const [items, setItems] = useState([]); //creating an empty array to make sure an empty array stays(after reloading of page) even if the shopping list array is deleted in console
  const[newItem, setNewItem] = useState('');
  const[search, setSearch] = useState('');
  const[fetchError, setFetchError] = useState(null);
  const[isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async() => {
      try {
        const response = await fetch(API_URL);
        if(!response.ok) throw Error('Did not receive expected data');
        const listItems = await response.json();
        setItems(listItems);
        setFetchError(null);
      } catch(err){
        setFetchError(err.message);
      } finally{
        setIsLoading(false);
      }
    }
    setTimeout(() => { fetchItems() }, 2000)
  }, []) //creating a empty array to prevent render of the component wihtout any operations made on items

  const addItem = async (item) => {
    const id = items.length ? items[items.length - 1].id + 1 : 1;
    const myNewItem = {id, checked: false, item};
    const listItems = [...items, myNewItem];
    setItems(listItems);

    const postOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(myNewItem)
    }
    const result = await apiRequest(API_URL, postOptions);
    if(result) setFetchError(result);

  }

  const handleCheck = async (id) => {
    const listItems = items.map((item) => item.id === id ? {...item, checked: !item.checked } : item);
    setItems(listItems);

    const myItems = listItems.filter((item) => item.id === id);
    const updateOptions = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ checked: myItems[0].checked })
    };
    const reqUrl = `${API_URL}/${id}`;
    const result = await apiRequest(reqUrl, updateOptions);
    if(result) setFetchError(result);
  }

  const handleDelete = async (id) => {
    const listItems = items.filter((item) => item.id !== id);
    setItems(listItems);

    const deleteOptions = {method: 'DELETE'};
    const reqUrl = `${API_URL}/${id}`;
    const result = await apiRequest(reqUrl, deleteOptions);
    if(result) setFetchError(result);
  }

  const handleSubmit = (e) => {
    e.preventDefault();//to prevent default loading of the page
    if(!newItem) return; //if the item added is invalid, the code will end
    addItem(newItem); //addItem
    setNewItem(''); //after submitting the valid item, the box will be reset to empty
  }

    return (
      <div className="App">
        <Header title="Groceries"/>
        <AddItem
          newItem={newItem}
          setNewItem={setNewItem}
          handleSubmit={handleSubmit}
        />
        <SearchItem
          search={search}
          setSearch={setSearch}
        />
        <main>
          {isLoading && <p>Loading Items...</p>}
          {fetchError && <p style={{color:"red"}}>{`Error: ${fetchError}`}</p>}
          {!fetchError && !isLoading && <Content
          items={items.filter(item => ((item.item).toLowerCase()).includes(search.toLowerCase()))}
          handleCheck={handleCheck}
          handleDelete={handleDelete}
          />}
        </main>
        <Footer length={items.length} />
      </div>
    );
  }

export default App;
