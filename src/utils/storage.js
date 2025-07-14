const STORAGE_KEY = "task-manager-data";

// LOCAL STORAGE UTILS ----------------------------------------------------------------------------------------------------
export const getData = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    return JSON.parse(data);
  } else {
    return {
      boards: [],
    };
  }
};

export const saveData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const updateData = (updaterFn) => {
  //1. getting the current data
  const data = getData();
  //2. updating the data using the updater function by passing the current data
  const updatedData = updaterFn(data);
  //3. saving the updated data
  saveData(updatedData);
};

// BOARD UTILS -----------------------------------------------------------------------------------------------------------------------
export const addBoard = (boardName) => {
  const newBoard = {
    id: `board-${Date.now()}`,
    name: boardName,
    lists: [
      { id: `list-${Date.now()}-1`, name: "To Do", cards: [] },
      { id: `list-${Date.now()}-2`, name: "In Progress", cards: [] },
      { id: `list-${Date.now()}-3`, name: "Done", cards: [] },
    ],
  };

  updateData((data) => ({
    ...data,
    boards: [...data.boards, newBoard],
  }));

  return newBoard;
};

export const deleteBoard = (boardId) => {
  updateData((data) => ({
    ...data,
    boards: data.boards.filter((b) => b.id !== boardId),
  }));
};

// LIST UTILS -----------------------------------------------------------------------------------------------------------------------

export const addListToBoard = (boardId, listName) => {
  updateData((data) => {
    const board = data.boards.find((board) => board.id === boardId);
    board.lists.push({
      id: `list-${Date.now()}`,
      name: listName,
      cards: [], //empty array of cards
    });

    return data;
  });
};

export const updateListName = (boardId, listId, newName) => {
  updateData((data) => {
    const board = data.boards.find((board) => board.id === boardId);
    const list = board.lists.find((list) => list.id === listId);
    if (list) {
      list.name = newName; //directlty changing the object
    }
    return data;
  });
};

export const deleteList = (boardId, listId) => {
  updateData((data) => {
    const board = data.boards.find((board) => board.id === boardId);
    board.lists = board.lists.filter((list) => list.id !== listId);
    return data;
  });
};

export const addCardToList = (boardId, ListId, cardTitle, cardDesc) => {
  updateData((data) => {
    const board = data.boards.find((board) => board.id === boardId);
    const list = board.lists.find((list) => list.id === ListId);
    if (list && Array.isArray(list.cards)) {
      list.cards.push({
        id: `card-${Date.now()}`,
        title: cardTitle,
        description: cardDesc || "",
      });
    }

    return data;
  });
};

export const updateCard = (boardId, listId, cardId, updates) => {
  updateData((data) => {
    const board = data.boards.find((board) => board.id === boardId);
    const list = board.lists.find((list) => list.id === listId);
    const card = list.cards.find((card) => card.id === cardId);

    if (card) {
      Object.assign(card, updates); //update the card with new values
    }

    return data;
  });
};

export const deleteCard = (boardId, listId, cardId) => {
  updateData((data) => {
    const board = data.boards.find((board) => board.id === boardId);
    const list = board.lists.find((list) => list.id === listId);
    list.cards = list.cards.filter((card) => card.id !== cardId);
    return data;
  });
};

export const moveCard = (
  boardId,
  sourceListId,
  destListId,
  sourceIndex,
  destIndex
) => {
  updateData((data) => {
    const board = data.boards.find((b) => b.id === boardId);
    if (!board) return data;

    const sourceList = board.lists.find((l) => l.id === sourceListId);
    const destList = board.lists.find((l) => l.id === destListId);
    if (!sourceList || !destList) return data;

    if (
      sourceIndex < 0 ||
      sourceIndex >= sourceList.cards.length ||
      destIndex < 0
    ) {
      return data; // prevent crash on bad indexes
    }

    const [movedCard] = sourceList.cards.splice(sourceIndex, 1);
    destList.cards.splice(destIndex, 0, movedCard);

    return data;
  });
};

