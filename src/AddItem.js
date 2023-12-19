import {FaPlus} from 'react-icons/fa'
import { useRef } from 'react'

const AddItem = ({newItem, setNewItem, handleSubmit}) => {
    const inputRef = useRef(); //after we click the button of add item, we need to shift the focus of the curson back to the form
    return(
        <form className="addForm" onSubmit={handleSubmit}>
            <label htmlFor="addItem">Add Item</label>
            <input
                autoFocus
                ref={inputRef}
                id="addItem"
                type="text"
                placeholder="Add Item"
                required
                value={newItem}
                onChange={(e)=>setNewItem(e.target.value)}
            />
            <button
                type="submit"
                aria-label="Add Item"
                onClick={()=>inputRef.current.focus()} //cursor will point back to form after click event is completed, because every ref hook will have current value.
            ><FaPlus/></button>
        </form>
    )
}

export default AddItem