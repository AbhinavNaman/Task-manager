import {useEffect, useState} from "react";
import { useParams, useNavigate } from "react-router-dom";
import {getData, addListToBoard, updateListName, deleteList} from "../utils/storage";

function Board() {
    const {id: boardId} = useParams();
    const navigate = useNavigate();

    const [board, setBoard] = useState(null);
    const [newListName, setNewListName] = useState("");

    useEffect(()=>{
        const data = getData(); //all board data will be fetched here
        const found = data.boards.find(board => board.id === boardId);

        if(!found){
            navigate("/dashboard");
        }
        else{
            setBoard(found);
        }
    },[boardId, navigate])

    //function 1: add list
    const handleAddList =()=> {
        if(!newListName.trim()) return;

        //adding to LS
        const newList = addListToBoard(boardId, newListName);

        //updating UI
        // const updatedBoard = getData().boards.find(board => board.id === boardId);
        // setBoard(updatedBoard);
        handleUIupdate();
    }

    //function 2: rename list
    const handleRenameList =(listId)=>{
        const newName = prompt("enter the new name");
        if(!newName || !newName.trim()) return;
        updateListName(boardId, listId, newName);

        //updating UI
        // const updatedBoard = getData().boards.find(board => board.id === boardId);
        // setBoard(updatedBoard);
        handleUIupdate();
    }
    //function 3: delete list
    const handleDeleteList =(listId)=>{
        //confirm it using alert
        if(!confirm("delete?")) return;
        deleteList(boardId, listId);

        //updating UI
        handleUIupdate();
    }

    //function 4: UI update
    const handleUIupdate =()=>{
        const updatedBoard = getData().boards.find(board => board.id === boardId);
        setBoard(updatedBoard);
    }
 return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{board?.name}</h1>

      {/* Add new list */}
      <div className="flex gap-2 mb-4">
        <input
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="New list name"
          className="border p-2 rounded"
        />
        <button
          onClick={handleAddList}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add List
        </button>
      </div>

      {/* Show Lists */}
      <div className="flex gap-4 overflow-x-auto">
        {board?.lists.map((list) => (
          <div
            key={list.id}
            className="bg-gray-100 p-4 rounded w-64 flex-shrink-0"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">{list.name}</h2>
              <div className="space-x-1">
                <button
                  onClick={() => handleRenameList(list.id)}
                  className="text-blue-500 text-sm"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDeleteList(list.id)}
                  className="text-red-500 text-sm"
                >
                  🗑️
                </button>
              </div>
            </div>

            {/* Cards will be added here later */}
            <p className="text-gray-500 text-sm italic">
              (cards will appear here)
            </p>
          </div>
        ))}
      </div>
    </div>
  );

}

export default Board;