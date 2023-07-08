const searchInput = document.querySelector('.search-input');
const searchAutocoplete = document.querySelector('.search-autocomplete');
const debounce = (func, debTime) => {
    let time;
    return function () {
        const funcApply = () => func.apply(this, arguments);
        clearTimeout(time)
        time = setTimeout(funcApply, debTime);
    }
};

function createEl(listener, element) {
    const repList = document.querySelector('.repository-list');
    listener.addEventListener('click', () => {
        searchInput.value = '';
        searchAutocoplete.innerHTML = '';

        const repListItem = document.createElement('li');
        repListItem.classList.add('repository-list_item');
        const container = document.createElement('div');
        const name = document.createElement('p');
        name.classList.add('repository-list_item-inner');
        name.textContent = `Name: ${element.name}`;

        const owner = document.createElement('p');
        owner.classList.add('repository-list_item-inner');
        owner.textContent = `Owner: ${element.full_name.split('/')[0]}`;

        const stars = document.createElement('p');
        stars.classList.add('repository-list_item-inner');
        stars.textContent = `Stars: ${element.stargazers_count}`;

        container.appendChild(name);
        container.appendChild(owner);
        container.appendChild(stars);

        const delBtn = document.createElement('button');
        delBtn.classList.add('repository-list_delete');
        const delIcon = document.createElement('img');
        delIcon.src = './image/delete.svg';
        delBtn.appendChild(delIcon);

        repListItem.appendChild(container);
        repListItem.appendChild(delBtn);
        repList.prepend(repListItem);
        delBtn.addEventListener('click', () => repListItem.remove());
    })
}

function updateRepositoryList(repositories) {
    if (repositories.length === 0) {
        const message = document.createElement('p');
        message.classList.add('message-not-found');
        message.textContent = 'not found';

        searchAutocoplete.appendChild(message);
    }
    searchAutocoplete.innerHTML = '';
    repositories.forEach(el => {
        const autocomplete = document.createElement('li');
        autocomplete.classList.add('autocomplete-list');
        autocomplete.textContent = el.name;
        createEl(autocomplete, el);
        searchAutocoplete.appendChild(autocomplete);
    });
}

const debouncedSearch = debounce((e) => {
    if (e.target.value === '') {
        searchAutocoplete.innerHTML = ''
        return
    } else if (e.target.value.trim() === '') {
        searchAutocoplete.innerHTML = ''
        return
    }
    fetch(`https://api.github.com/search/repositories?q="${e.target.value}";per_page=5`).then(r => r.json()).then(result => updateRepositoryList(result.items))
}, 1000)

searchInput.addEventListener("input", (e) => {
    debouncedSearch(e)
})