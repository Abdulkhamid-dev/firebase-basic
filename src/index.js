import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCQcGhtQM4FvEVVbgt0vcWvWjUn9odFflg",
  authDomain: "fir-todo-7e61c.firebaseapp.com",
  projectId: "fir-todo-7e61c",
  storageBucket: "fir-todo-7e61c.appspot.com",
  messagingSenderId: "313562579031",
  appId: "1:313562579031:web:d4c14f41125b89cc99e312",
};

initializeApp(firebaseConfig);

const db = getFirestore();
const auth = getAuth();

const colRef = collection(db, "tasks");

const q = query(colRef, orderBy("createdAt"));

//  get documents

onSnapshot(q, (snapshot) => {
  let tasks = [];
  snapshot.docs.forEach((doc) => {
    tasks.push({ ...doc.data(), id: doc.id });
  });
  console.log(tasks);
  const menuWrap = document.getElementById("menu");
  menuWrap.innerHTML = "";
  tasks.forEach((item) => {
    menuWrap.innerHTML += `
    <li id=${item.id}>${item.task}</li>
    `;
  });
});

//  Add document

const addingForm = document.querySelector(".add");
addingForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addDoc(colRef, {
    task: addingForm.task.value,
    createdAt: serverTimestamp(),
  }).then(() => {
    addingForm.reset();
  });
});

// Search document

const searchForm = document.querySelector(".search");
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchRes = searchForm.task.value;
  const q = query(colRef, where("task", "==", searchRes));
  onSnapshot(q, (snapshot) => {
    let tasks = [];
    snapshot.docs.forEach((doc) => {
      tasks.push({ ...doc.data(), id: doc.id });
    });
    console.log(tasks);
    const menuWrap = document.getElementById("menu");
    menuWrap.innerHTML = "";
    tasks.forEach((item) => {
      console.log(item);
      menuWrap.innerHTML += `
      <li id=${item.id}>${item.task}</li>
      `;
    });
  });
});

// Delete document

const deleteForm = document.querySelector(".delete");
deleteForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const docRef = doc(db, "tasks", deleteForm.id.value);

  deleteDoc(docRef).then(() => {
    deleteForm.reset();
  });
});

//  get single document

const hs = doc(db, "tasks", "L4249GNJheyefniF0Y6O");
// const menuWrapSing = document.getElementById('menuSing')
onSnapshot(hs, (doc) => {
  console.log(doc);
  console.log(doc.data(), doc.id);
});

//  update document

const updateForm = document.querySelector(".update");
updateForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const updateRef = doc(db, "tasks", updateForm.id.value);

  updateDoc(updateRef, {
    task: updateForm.task.value,
  }).then(() => {
    updateForm.reset();
  });
});

//  Auth

const signForm = document.querySelector(".signin");
signForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = signForm.email.value;
  const password = signForm.password.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      console.log("user", cred.user);
      signForm.reset();
    })
    .catch((err) => {
      console.log(err.message);
    });
});

//  Log out

const logOut = document.querySelector(".logout");
logOut.addEventListener("click", () => {
  signOut(auth)
  .then(() => {
    console.log("Log out");
  })
  .catch((err) => {
    console.log(err.message);
  })
});

//  Log in 
const logIn = document.querySelector(".login");
logIn.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = logIn.email.value;
  const password = logIn.password.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      console.log("user", cred.user);
      logIn.reset();
    })
    .catch((err) => {
      console.log(err.message);
    });
});