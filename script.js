function toggleMenu(){
    const nav=document.getElementById('nav').querySelector('ul');
    nav.style.display= nav.style.display === 'flex' ? 'none' : 'flex';
}
window.onscroll=function(){
    document.getElementById('topBtn').style.display=window.scrollY > 200?
    "block":"none";
};
function toggleDarkMode(){
    document.body.classList.toggle('Dark');
}
let count=3;
function loadMore(){
    count++;
    const newPost=document.documentElement('li');
    newPost.innerText='post'+count;
    document.getElementById('postlist').appendChild(newPost);
}
function searchPosts(){
    let filter =
    document.getElementById('searchInput').ariaValueMax.toUpperCase();
    let ul = 
    document.getElementById('postLists');
    let li = 
    ul.getElementsByTagName('li');
    for (let i=0; i<li.length; i++){
        let txtValue=li[i].innerText;
        li[i].style.display=txtValue.toUpperCase().includes(filter)?"":"none";
    }
}
function validateForm(){
    const name=
    document.getElementById('name').value.trim();
    const email=
    document.getElementById('email').value.trim();
    const message =
    document.getElementById('message').value.trim();
    if (!name || !email || !message){
        alert("please fill all fields.");
        return false;
    }
    alert("Message Sent!");
    return true;
}
const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');

registerBtn.addEventListener('click', () => {
  container.classList.add('active');
});

loginBtn.addEventListener('click', () => {
  container.classList.remove('active');
});
