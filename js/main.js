var nextPage = 2;
var actualPage = 1;
const githubReposUrl = 'https://api.github.com/search/repositories?sort=stars&';

searchButtons();

//this method does the axios call and calculates the total pages to be shown
function axiosCall(url) {
    const searchTerm = document.querySelector("input").value;
    document.querySelector(".result").textContent = "sending request with axios...";

  axios.get(url)
    .then(response => {
      console.log("AJAX request finished correctly :)");
      const data = response.data;

      var totalPages = response.data.total_count / 20;
      var resto = totalPages % 20;
      totalPages = parseInt(totalPages);
	  
      if (resto > 1) {
          totalPages = totalPages + 1;
      }
      prevNextPage(totalPages);

      const result = `Found ${response.data.total_count} repositories about ${searchTerm}`;
      document.querySelector(".result").textContent = result;
      fillTable(data);
    })
    .catch(error => {
      console.log("AJAX request finished with an error :(");
      const result = `There was an error: ${error}`;
      document.querySelector(".result").textContent = result;
    });
}

//this method constructs a url with the input text and checked value to be searched on github repositories
function searchButtons() {
    var searchButton = document.querySelector(".search button");
    var orderButtons = $('.order input');

    searchButton.onclick = function () {
        const searchTerm = document.querySelector(".search input").value;
		nextPage = 2;
		actualPage = 1;
        if (searchButton) {
            const checked = $('input[name="order"]:checked').val();
            const url = githubReposUrl + 'q=' + searchTerm + '&per_page=20&order=' + checked;
            axiosCall(url);
        }
    }

    orderButtons.click( function () {
        const searchTerm = document.querySelector(".search input").value;
        if (searchButton) {
            const checked = $('input[name="order"]:checked').val();
            const url = githubReposUrl + 'q=' + searchTerm + '&per_page=20&order=' + checked;
            axiosCall(url);
        }
    });
}

//this method aplicates 'prev' and 'next' buttons (with functionality page down and page up) if there is more than one page to be shown
function prevNextPage(totalPages) {
    var prev = document.querySelector(".prev");
    var next = document.querySelector(".next");
    const searchTerm = document.querySelector(".search input").value;
    const checked = $('input[name="order"]:checked').val();
	
	if (totalPages == 0 || totalPages == 1) {
		next.style.visibility = "hidden";
		prev.style.visibility = "hidden";
	}
    if (totalPages > 1) {
        next.style.visibility = "visible";
    }

    if (actualPage > 1) {
        prev.style.visibility = "visible";
        prev.style.display = "initial";
    }

    if (actualPage == 1) {
        prev.style.display = "none";
    }

    next.onclick = function () {
        const url = githubReposUrl + 'q=' + searchTerm + '&per_page=20&order=' + checked + '&page=' + nextPage;
        nextPage++;
        actualPage++;
        if (nextPage >= totalPages) {
            nextPage = totalPages;
            actualPage = totalPages;
        };
        console.log('Page up, now on page ' + actualPage);
        axiosCall(url);
    };

    prev.onclick = function () {
        const url = githubReposUrl + 'q=' + searchTerm + '&per_page=20&order=' + checked + '&page=' + (actualPage - 1);
        actualPage--;
        nextPage = actualPage + 1;
        if (actualPage <= 1) {
            actualPage = 1;
            nextPage = 2;
        };
        console.log('Page down, now on page ' + actualPage);
        axiosCall(url);
    };
}

//this method paints the table with the data received from method fillRowInTable(repo)
function fillTable(data) {
    var htmlRow = '';
    for(repo of data.items) {
        htmlRow += '<tr>' + fillRowInTable(repo) + '</tr>';
  };
    document.querySelector("tbody").innerHTML = htmlRow;
}

//this method createst a table row with the selected data
function fillRowInTable(repo) {
    var htmlColumns = '<td>' +  repo.id + ' (stars: ' + repo.stargazers_count + ')</td>';
    htmlColumns += '<td>' + repo.name + '</td>';
    htmlColumns += '<td>' + repo.url + '</td>';
    htmlColumns += '<td>' + repo.owner.login + '</td>';
    return htmlColumns;
};
