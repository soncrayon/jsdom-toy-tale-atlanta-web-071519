
// YOUR CODE HERE

const toysURL = 'http://localhost:3000/toys'; 

class Toy{
  constructor(toyObj){
    this.id = toyObj.id;
    this.name = toyObj.name;
    this.image = toyObj.image;
    this.likes = toyObj.likes; 
  }

  render(){
    const toyDiv = document.createElement('div');
    toyDiv.className = 'card';
    toyDiv.dataset.id = this.id; 
    const toyName = document.createElement('h2');
    toyName.innerText = this.name;
    const toyAvatar = document.createElement('img');
    toyAvatar.className = 'toy-avatar'; 
    toyAvatar.src = this.image; 
    const toyLikesTitle = document.createElement('p');
    toyLikesTitle.innerText = 'Likes:'; 
    const toyLikes = document.createElement('p');
    toyLikes.className = 'toy-likes'; 
    toyLikes.dataset.id = this.id; 
    toyLikes.innerText = this.likes; 
    const likeBtn = document.createElement('button');
    likeBtn.className = 'like-btn'; 
    likeBtn.dataset.id = this.id; 
    likeBtn.innerText = 'Like!'
    toyDiv.append(toyName);
    toyDiv.append(toyAvatar);
    toyDiv.append(toyLikesTitle); 
    toyDiv.append(toyLikes);
    toyDiv.append(likeBtn); 
    const toyCollectionDiv = document.querySelector('#toy-collection');
    toyCollectionDiv.append(toyDiv); 
  }
}

const renderToy = (toy) => {
  const newToy = new Toy(toy); 
  newToy.render(); 
}

const renderToys = (toysObj) => { 
  toysObj.forEach((toy) => {
    renderToy(toy); 
  })
  addSiteListeners();
}

const fetchAndysToys = () => {
  fetch(toysURL)
    .then(resp => resp.json())
    .then(toysObj => {
      renderToys(toysObj); 
    })
}

const addToy = (formData) => {   
  const reqObj = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData)
  }

  fetch(toysURL, reqObj)
    .then(resp => resp.json())
    .then(toyObj => {
      console.log(toyObj); 
    })
  renderToys(formData); 
}

const addAddToyBtnListener = () => {
  const addBtn = document.querySelector('#new-toy-btn')
  const toyFormContainer = document.querySelector('.container')
  let addToy = false

  addBtn.addEventListener('click', () => {
    // hide & seek with the form
    addToy = !addToy
    if (addToy) {
      toyFormContainer.style.display = 'block'
    } else {
      toyFormContainer.style.display = 'none'
    }
  })
}

const scrapeFormData = (e) => {   
  const toyName = e.target[0].value;
  const toyImg = e.target[1].value;

  return {name:toyName, image:toyImg, likes:0}; 
}

const handleSubmit = (e) => {
  const formData = scrapeFormData(e);
  addToy(formData); 
}

const addToyFormListener = () => {
  const toyForm = document.querySelector('.add-toy-form'); 

  toyForm.addEventListener('submit', (e) => { 
    handleSubmit(e); 
  })
}

const updateLikeCount = (likeCount, toyId) => { 
  const reqObj = {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "likes":likeCount
    })
  }

  fetch(toysURL + `/${toyId}`, reqObj)
    .then(resp => resp.json())
    .then(toyObj => {
      console.log(toyObj); 
    })
}

const addLikeListeners = () => { 
   
  const likeBtns = document.querySelectorAll('.like-btn');

  likeBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const toyLikesArray = document.querySelectorAll('.toy-likes'); 
      const likeBtn = e.target;
      toyLikesArray.forEach((likeField) => {
        if (likeField.dataset.id === likeBtn.dataset.id){
          const likesToUpdate = likeField;
          likesToUpdate.innerText++; 
          const likeCount = likesToUpdate.innerText; 
          const toyId = likesToUpdate.dataset.id; 
          updateLikeCount(likeCount, toyId); 
        }
      })
    })
  })
}

const addSiteListeners = () => {
  addAddToyBtnListener();
  addToyFormListener(); 
  addLikeListeners(); 
}

const main = () => {
  document.addEventListener('DOMContentLoaded', () =>{
    fetchAndysToys(); 
  })
}

main(); 
