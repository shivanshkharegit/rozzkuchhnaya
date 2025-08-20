
  function toggleMenu() {
    document.getElementById("navLinks").classList.toggle("active");
  }

window.onscroll=function(){
    document.getElementById('topBtn').style.display=window.scrollY > 200?
    "block":"none";
};

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


document.getElementById('commentForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Form ko roke bina backend ke
  
  const commentText = document.getElementById('commentInput').value.trim();
  
  if(commentText !== "") {
    const li = document.createElement('li');
    li.textContent = commentText;
    document.getElementById('commentList').appendChild(li);
    
    document.getElementById('thankYouMessage').style.display = 'block';
    
    this.submit(); // Ab original form submit karo (email ke liye)
  }
});




