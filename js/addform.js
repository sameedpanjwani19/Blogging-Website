import{ signInFirebase, signUpFirebase, postBlogToDb,uploadImage,getRealTimeBlogs} from '../config/firebase.js'

getBlogs()
window.signUp = async function(){
    event.preventDefault();
    console.log("working");
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const fullName = document.getElementById("name").value;
    const age = document.getElementById("age").value;
    console.log({email, password, fullName, age});

    try {
        await signUpFirebase({email, password, fullName, age});
        alert('Registered successfully');
        window.location.href = '../index.html';
    } catch(e) {
        console.error("Error during sign-up:", e);
        alert("Registration failed: " + e.message); // Optional: Provide feedback to the user
    }
}


window.signIn = async function(){
    event.preventDefault();
    console.log("working");
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try{
        await signInFirebase(email,password)
        window.location.href = '../index.html'
    }catch(e){
        console.error("Error during sign-up:", e);
        alert("Registration failed: " + e.message); // Optional: Provide feedback to the user
    }
}

window.postBlog = async function(){
    event.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const image = document.getElementById('image').files[0];

    console.log(title,description,image)

    if (!title  || !description || !image) {
        alert("Please fill in all fields and select an image.");
        return;
    }

    try {
        const imageUrl = await uploadImage(image)
        await postBlogToDb(title, description,imageUrl);
        alert('Ad posted successfully');
        window.location.href = '../index.html';
    } catch(e) {
        console.error("Error during ad posting:", e);
        alert("Ad posting failed: " + e.message);
    }
}

function getBlogs(){
    getRealTimeBlogs((Blogs)=>{
        const blogsElem = document.getElementById('blogs')
        blogsElem.innerHTML = ''
        for(let item of Blogs){
            blogsElem.innerHTML += `<div class="card"">
            <img src=${item.imageUrl} alt="...">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
              <p class="card-text">${item.description} </p>
            </div>
            </div>`
        }
    }) 
}

