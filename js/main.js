var nextPage = 2;
var actualPage = 1;
const githubReposUrl = 'https://api.github.com/search/repositories';

searchButtons();
prevNextPage();

function axiosCall(url) {
    const searchTerm = document.querySelector("input").value;
    document.querySelector(".result").textContent = "sending request with axios...";

  axios.get(url)
    .then(response => {
      console.log("AJAX request finished correctly :)");
      const data = response.data;

      var totalPages = Number(response.data.total_count) / 20;
      var resto = totalPages % 20;
      totalPages = parseInt(totalPages);
      console.log(totalPages);
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

function searchButtons() {
    var searchButton = document.querySelector(".search button");
    var orderButtons = $('.order input');

    searchButton.onclick = function () {
        const searchTerm = document.querySelector(".search input").value;
        if (searchButton) {
            const checked = $('input[name="order"]:checked').val();
            const url = githubReposUrl + '?q=' + searchTerm + '&per_page=20&order=' + checked;
            axiosCall(url);
        }
    }

    orderButtons.click( function () {
        const searchTerm = document.querySelector(".search input").value;
        if (searchButton) {
            const checked = $('input[name="order"]:checked').val();
            const url = githubReposUrl + '?q=' + searchTerm + '&per_page=20&order=' + checked;
            axiosCall(url);
        }
    });
}


function prevNextPage(totalPages) {
    var prev = document.querySelector(".prev");
    var next = document.querySelector(".next");
    const searchTerm = document.querySelector(".search input").value;
    const checked = $('input[name="order"]:checked').val();
    if (totalPages > 1) {
        next.style.visibility = "visible";
        prev.style.visibility = "visible";
    }

    next.onclick = function () {
        const url = githubReposUrl + '?q=' + searchTerm + '&per_page=20&order=' + checked + '&page=' + nextPage;
        nextPage++;
        actualPage++;
        if (nextPage >= totalPages) {
            nextPage = totalPages;
            actualPage = totalPages;
        };
        axiosCall(url);
    };

    prev.onclick = function () {
        const url = githubReposUrl + '?q=' + searchTerm + '&per_page=20&order=' + checked + '&page=' + (actualPage - 1);
        actualPage--;
        if (actualPage <= 1) {
            actualPage = 1;
        };
        axiosCall(url);
    };
}


function fillTable(data) {
    var htmlRow = '';
    for(repo of data.items) {
        htmlRow += '<tr>' + fillRowInTable(repo) + '</tr>';
  };
    document.querySelector("tbody").innerHTML = htmlRow;
}


function fillRowInTable(repo) {
    var htmlColumns = '<td>' +  repo.id + ' (stars: ' + repo.stargazers_count + ')</td>';
    htmlColumns += '<td>' + repo.name + '</td>';
    htmlColumns += '<td>' + repo.url + '</td>';
    htmlColumns += '<td>' + repo.owner.login + '</td>';
    return htmlColumns;
};
