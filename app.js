//Movie class and its properties
class Movie {
  constructor(title, year, rating, dateOfWatch) {
    this.title = title;
    this.year = year;
    this.rating = rating;
    this.dateOfWatch = dateOfWatch;

  }
}

class UI {
  addMovie(movie) {
    const list = document.querySelector('#movie-list');
    //Create tr 
    const content = document.createElement('tr');
    //Insert values
    content.innerHTML = `
        <td id="movie-title">${movie.title}</td>
        <td>${movie.year}</td>
        <td>${movie.rating}</td>
        <td>${movie.dateOfWatch}</td>
        <td><a href="#" class="delete-item secondary-content"><i class="fa fa-trash"></i></a></td>
      `;

    list.appendChild(content);

  }

  //One Method for all alerts 
  showAlert(m, className) {
    const message = document.createElement('div');
    message.className = `alert ${className} `;
    message.appendChild(document.createTextNode(m));
    //console.log(message);
    const cardContent = document.querySelector('.row');
    const form = document.querySelector('#movie-form');
    cardContent.insertBefore(message, form);
    //Alert dissapers after 2 seconds
    setTimeout(function () {
      document.querySelector('.alert').remove();
    }, 2000);
  }

  delMovie(target) {
    if (target.className === 'fa fa-trash') {
      target.parentElement.parentElement.parentElement.remove();
    }
  }

  delAll() {
    const movieList = document.querySelector('#movie-list');
    while (movieList.firstChild) {
      movieList.removeChild(movieList.firstChild);
    }
  }

  clearInputs() {
    document.getElementById('title').value = '';
    document.getElementById('year').value = '';
    document.getElementById('rating').value = '';
    document.getElementById('date').value = '';
  }

  filterMovies(e) {
    //Typed filter value to lowercase
    const text = e.target.value.toLowerCase();
    //Get All movie titles
    document.querySelectorAll('#movie-title').forEach(function (title) {
      //Title in lowercase     
      const t = title.textContent.toLowerCase();
      if (t.indexOf(text) != -1) {
        //if =-1 there is no match if !=-1 ther is match
        // default display value is 'table-row'
        title.parentElement.style.display = 'table-row';
      } else {
        //hide it
        title.parentElement.style.display = 'none';
      }
    });
  }
  
}

//Class for Local Storage
class Storage {

  //get Movies from local storage return it as array
  static get() {
    let movies;
    //If localstorage is empty
    if (localStorage.getItem('movies') === null) {
      movies = [];
    } else {
      movies = JSON.parse(localStorage.getItem('movies'));
    }
    return movies;
  }

  static display() {
    const movies = Storage.get();
    movies.forEach(function (movie) {
      const ui = new UI;
      //Pass movie to UI
      ui.addMovie(movie);
    });
  }

  static add(movie) {
    //Get the movies , push the new one in array, save it in local storage
    const movies = Storage.get();
    movies.push(movie);
    localStorage.setItem('movies', JSON.stringify(movies));
  }

  //Delete by using movie title
  static remove(title) {
    const movies = Storage.get();
    movies.forEach(function (movie, index) {
      //if titles match
      if (movie.title === title) {
       //Delete it from array
        movies.splice(index, 1);
      }
    });
    //Pass array in local storage
    localStorage.setItem('movies', JSON.stringify(movies));

  }

  static removeAll() {
    localStorage.clear();
  }

}

//DOM Load Event
document.addEventListener('DOMContentLoaded', loader);

function loader() {
  Storage.display();
  //Loader is displayed for 2,5 seconds
  setTimeout(function () {
    console.log('loading');
    //Show results
    document.getElementById('results').style.display = 'block';
    //Hide Loader
    document.getElementById('loader').style.display = 'none';
  }, 2000);
}



//Event Listeners to Add
document.getElementById('movie-form').addEventListener('submit',
  function (e) {
    //console.log('Submit Works');
    //Get values from HTML
    const title = document.getElementById('title').value,
      year = document.getElementById('year').value,
      rating = document.querySelector('input[type=range]').value,
      dateOfWatch = document.getElementById('date').value

    //Instantiate movie
    const movie = new Movie(title, year, rating, dateOfWatch);
    console.log(movie);
  
    //Instantiate UI
    const ui = new UI();
    //Validation
    if (title === '' || year === '' || rating === '' || dateOfWatch === '') {
      ui.showAlert('Please fill the fields', 'error');
    } else {
      ui.showAlert('Movie has been added succesfully', 'success');
      //Add movie into list
      ui.addMovie(movie);

      //Add to Local Storage (no need to Instantiate since it is static)
      Storage.add(movie);

      //Clear Input Fields
      ui.clearInputs();
    }
    e.preventDefault();
  }
);


//Delete a movie
document.getElementById('movie-list').addEventListener('click',
  function (e) {
    const ui = new UI();
    //Delete
    ui.delMovie(e.target);

    //Delete from Local Storage        
    const tr = e.target.parentElement.parentElement.parentElement;
    //Get movie title
    const title = tr.children[0].innerHTML;
    Storage.remove(title);

    ui.showAlert('Movie has been removed!', 'success')
    e.preventDefault();
  }
);


//Delete all movies
document.querySelector('.clear-tasks').addEventListener('click',
  function (e) {

    const ui = new UI();
    //Delete All from UI
    ui.delAll();
    //Delete All from Local Storage 
    Storage.removeAll();
    e.preventDefault();
  });


//Filter Movies
document.querySelector('#filter').addEventListener('keyup',
function (e) {
  const ui = new UI();
   ui.filterMovies(e);
   e.preventDefault();
});