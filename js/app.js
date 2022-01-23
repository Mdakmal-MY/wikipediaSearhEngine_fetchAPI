const searchTermElem = document.querySelector('#searchTerm');
const searchResultElem = document.querySelector('#searchResult');

searchTermElem.select();

searchTermElem.addEventListener('input', function (event){
   search(event.target.value);
});

const debounce = (fn, delay=500) => {
    let timeoutId;

    return (...args) => {  
        timeoutId ? clearTimeout(timeoutId): false;

        timeoutId = setTimeout( () => {
            fn.apply(null, args);
        }, delay)
    };
};

const search = debounce(async (searchTerm) => {
    !searchTerm ? searchResultElem.innerHTML = '': searchTerm;
    
    try {
        const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info|extracts&inprop=url&utf8=&format=json&origin=*&srlimit=10&srsearch=${searchTerm}`;
        const response = await fetch(url);
        const searchResult = await response.json();
        console.log(searchTerm);
        const searchResultHtml = generateHtml(searchResult.query.search, searchTerm);
        searchResultElem.innerHTML = searchResultHtml;
    } catch (error) {
        console.log(error);
    }
});



const stripHtml = (html) => {
    let div = document.createElement('div');
    div.textContent = html;
    return div.textContent;
};

const highlight = (str, keyword, className = "highlight") => {
    const h1 = `<span class="${className}">${keyword}</span`;
    return str.replace(new RegExp(keyword, 'gi'), h1);
};

const generateHtml = (results, searchTerm) => {
    return results
    .map( result => {
        const title = highlight(stripHtml(result.title), searchTerm);
        const snippet = highlight(stripHtml(result.snippet), searchTerm);
        return `<article><a href="https://en.wikipedia.org/?curid=${result.pageid}"<h2>${title}</h2></a><div class="summary">${snippet}...</div></article>`;
    }).join('');
}