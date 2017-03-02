import jump from '../../vendor/jump/jump.js';

const links = document.querySelectorAll('a');

//Filename of current page
const fileName = location.href.split("/").pop().split("#")[0];

links.forEach((a) => {
  //check if it's a link to another location on the page
  if (~a.href.indexOf(fileName + '#')) {
    const link = '#' + a.href.split('#').pop();
    a.onclick = () => jump(link);
  }
}

);