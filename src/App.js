import logo from "./logo.svg";
// import './App.css';
import "./index.css";
import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Rohit",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [show, setShow] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriends, setSelectedFriends] = useState(null);
  function handleShow() {
    setShow((show) => !show);
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShow(false);
  }

  function handleSelection(friend) {
    setSelectedFriends((cur) => (cur?.id === friend.id ? null : friend));
    setShow(false);
  }

  function handleSplitBill(value) {
    console.log(value);
    setFriends((friends) =>
      friends.map((friend) => {
        return friend.id === selectedFriends.id
          ? { ...friend, balance: friend.balance + value }
          : friend;
      })
    );
    setSelectedFriends(null)
  }

  return (
    <div className="app">
      
      <div className="sidebar">
      
        <FriendList
          friends={friends}
          selectedFriends={selectedFriends}
          onSelection={handleSelection}
        />

        {show && <FormAddFriend show={show} onAddFriend={handleAddFriend} />}

        <Button onClick={handleShow}>{show ? "Close" : "Add Friend"}</Button>
      </div>
      {selectedFriends && (
        <FormSplitBill
          selectedFriends={selectedFriends}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}


function FriendList({ friends, onSelection, selectedFriends }) {
  return (
    <ul>
      {friends.map((friend) => {
        return (
          <Friends
            friend={friend}
            key={friend.id}
            selectedFriends={selectedFriends}
            onSelection={onSelection}
          />
        );
      })}
    </ul>
  );
}

function Friends({ friend, onSelection, selectedFriends }) {
  const isSeleted = selectedFriends?.id === friend.id;

  return (
    <li className={isSeleted ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance > 0 && (
        <p className="red">
          You owe {friend.name} {friend.balance}
        </p>
      )}
      {friend.balance < 0 && (
        <p className="green">
          {friend.name} owe you {Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button onClick={() => onSelection(friend)}>
        {isSeleted ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FormAddFriend({ friends, onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    setName("");
    setImage("https://i.pravatar.cc/48");

    onAddFriend(newFriend);
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👭 Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      ></input>
      <label>🏜 Image Url</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      ></input>
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriends, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [expense, setExpense] = useState("");
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  const paidByUser = bill ? bill - expense : "";

  function handleSubmitBill(e) {
    e.preventDefault();
    if (!bill || !expense) return;
    onSplitBill(whoIsPaying === "user" ? paidByUser : -expense);
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmitBill}>
      <h2>Split a bill with {selectedFriends.name}</h2>
      <label>💸 Bill Value</label>
      <input
        type="text"
        vlaue={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      ></input>

      <label>🙎‍♂️ Your Expense</label>
      <input
        type="text"
        value={expense}
        onChange={(e) =>
          setExpense(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      ></input>

      <label>👭 {selectedFriends.name} Expense</label>
      <input type="text" disabled value={paidByUser}></input>

      <label>😍 Who is paying the bill</label>
      <select
        vlaue={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="you">You</option>
        <option value="friend">{selectedFriends.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
