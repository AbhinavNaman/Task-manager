import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getData,
  addListToBoard,
  updateListName,
  deleteList,
  addCardToList,
  deleteCard,
  updateCard,
  moveCard,
} from "../utils/storage";
import { CopyPlus, Pencil, SquarePlus, Trash } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function Board() {
  const { id: boardId } = useParams();
  const navigate = useNavigate();

  const [board, setBoard] = useState(null);
  const [newListName, setNewListName] = useState("");
  const [cardInputs, setCardInputs] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const data = getData();
    const found = data.boards.find((board) => board.id === boardId);

    if (!found) {
      navigate("/dashboard");
    } else {
      setBoard(found);
    }
  }, [boardId, navigate]);

  const handleUIupdate = () => {
    const updatedBoard = getData().boards.find((board) => board.id === boardId);
    setBoard(updatedBoard);
  };

  const handleAddList = () => {
    if (!newListName.trim()) return;
    addListToBoard(boardId, newListName);
    setNewListName("");
    handleUIupdate();
  };

  const handleRenameList = (listId) => {
    const newName = prompt("Enter new list name:");
    if (!newName?.trim()) return;
    updateListName(boardId, listId, newName);
    handleUIupdate();
  };

  const handleDeleteList = (listId) => {
    if (!confirm("Delete this list and all its cards?")) return;
    deleteList(boardId, listId);
    handleUIupdate();
  };

  const handleCardInputChange = (listId, field, value) => {
    setCardInputs((prev) => ({
      ...prev,
      [listId]: {
        ...prev[listId],
        [field]: value,
      },
    }));
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    moveCard(
      boardId,
      source.droppableId,
      destination.droppableId,
      source.index,
      destination.index
    );
    handleUIupdate();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{board?.name}</h1>

      {/* Add new list */}
      <div className="flex gap-2 mb-6">
        <input
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="New list name"
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleAddList}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          <SquarePlus />
        </button>
      </div>
      <div className="mb-4">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search tasks..."
          className="border p-2 rounded w-full"
        />
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto">
          {board?.lists.map((list) => {
            const cardTitle = cardInputs[list.id]?.title || "";
            const cardDesc = cardInputs[list.id]?.desc || "";

            const handleAddCard = () => {
              if (!cardTitle.trim()) return;
              addCardToList(boardId, list.id, cardTitle, cardDesc);
              handleCardInputChange(list.id, "title", "");
              handleCardInputChange(list.id, "desc", "");
              handleUIupdate();
            };

            const handleDeleteCard = (cardId) => {
              deleteCard(boardId, list.id, cardId);
              handleUIupdate();
            };

            const handleEditCard = (cardId) => {
              const newTitle = prompt("Enter new title:");
              const newDesc = prompt("Enter new description:");
              if (!newTitle?.trim()) return;

              updateCard(boardId, list.id, cardId, {
                title: newTitle,
                description: newDesc || "",
              });
              handleUIupdate();
            };

            return (
              <div
                key={list.id}
                className="bg-gray-100 p-4 rounded w-64 flex-shrink-0 flex flex-col shadow"
              >
                {/* List header */}
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold">{list.name}</h2>
                  <div className="space-x-1">
                    <button
                      onClick={() => handleRenameList(list.id)}
                      className="text-blue-500 text-sm rounded-full hover:bg-blue-100 p-2 bg-gray-200"
                    >
                      <Pencil />
                    </button>
                    <button
                      onClick={() => handleDeleteList(list.id)}
                      className="text-red-500 text-sm rounded-full hover:bg-blue-100 p-2 bg-gray-200 ml-2"
                    >
                      <Trash />
                    </button>
                  </div>
                </div>

                {/* Cards with Drag & Drop */}
                <Droppable droppableId={list.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="flex flex-col gap-2 min-h-[20px]"
                    >
                      {list.cards
                        .filter((card) =>
                          card.title
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                        )
                        .map((card, index) => (
                          <Draggable
                            key={card.id}
                            draggableId={card.id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="bg-white p-2 rounded shadow text-sm"
                              >
                                <div className="font-medium">{card.title}</div>
                                {card.description && (
                                  <div className="text-gray-500 text-xs">
                                    {card.description}
                                  </div>
                                )}
                                <div className="mt-1 flex gap-1 justify-end">
                                  <button
                                    onClick={() => handleEditCard(card.id)}
                                    className="text-blue-500 text-xs bg-gray-200 rounded p-1"
                                  >
                                    <Pencil size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCard(card.id)}
                                    className="text-red-500 text-xs bg-gray-200 rounded p-1"
                                  >
                                    <Trash size={14} />
                                  </button>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                {/* Add card input */}
                <div className="mt-2">
                  <input
                    value={cardTitle}
                    onChange={(e) =>
                      handleCardInputChange(list.id, "title", e.target.value)
                    }
                    placeholder="Add card..."
                    className="border p-2 rounded w-full text-sm mb-2"
                  />
                  <input
                    value={cardDesc}
                    onChange={(e) =>
                      handleCardInputChange(list.id, "desc", e.target.value)
                    }
                    placeholder="Add card desc..."
                    className="border p-2 rounded w-full text-sm mb-2"
                  />
                  <button
                    onClick={handleAddCard}
                    className="bg-green-600 text-white w-full py-2 rounded flex items-center justify-center gap-2 text-sm"
                  >
                    Add Card <CopyPlus size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}

export default Board;
