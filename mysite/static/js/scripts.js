document.addEventListener("DOMContentLoaded", () => {
    const postsContainer = document.getElementById('postsContainer');

    // Load existing posts from localStorage
    const loadPosts = () => {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        posts.forEach(post => {
            createPostElement(post.title, post.content, post.comments, post.likes);
        });
    };

    // Save posts to localStorage
    const savePosts = () => {
        const posts = Array.from(postsContainer.children).map(postElement => {
            const title = postElement.querySelector('.card-title').textContent;
            const content = postElement.querySelector('.card-text').textContent;
            const comments = Array.from(postElement.querySelectorAll('.alert-info')).map(comment => comment.textContent);
            const likes = postElement.querySelector('.like-count').textContent;
            return { title, content, comments, likes };
        });
        localStorage.setItem('posts', JSON.stringify(posts));
    };

    // Create and add a new post element to the DOM
    const createPostElement = (title, content, comments = [], likes = 0) => {
        const postElement = document.createElement('div');
        postElement.className = 'card mb-3';
        postElement.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${title}</h5>
                <p class="card-text">${content}</p>
                <hr>
                <h6>Comentarios:</h6>
                <div class="comments-container">
                    ${comments.map(comment => `<div class="alert alert-info">${comment}</div>`).join('')}
                </div>
                <form class="comment-form">
                    <div class="form-group">
                        <label for="comment">Añadir un comentario:</label>
                        <input type="text" class="form-control comment-input" placeholder="Escribe tu comentario aquí..." required>
                    </div>
                    <button type="submit" class="btn btn-secondary">Comentar</button>
                </form>
                <hr>
                <button class="btn btn-primary like-button">
                    <span class="like-count">${likes}</span> Me gusta
                </button>
            </div>
        `;

        // Add the new post to the container
        postsContainer.prepend(postElement);

        // Add event listener to the comment form
        const commentForm = postElement.querySelector('.comment-form');
        const commentsContainer = postElement.querySelector('.comments-container');
        commentForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const commentInput = commentForm.querySelector('.comment-input');
            const commentText = commentInput.value;

            // Create a new comment element
            const commentElement = document.createElement('div');
            commentElement.className = 'alert alert-info';
            commentElement.textContent = commentText;

            // Add the new comment to the comments container
            commentsContainer.appendChild(commentElement);

            // Clear the comment input
            commentInput.value = '';

            // Save posts to localStorage after adding a comment
            savePosts();
        });

        // Add event listener to the like button
        const likeButton = postElement.querySelector('.like-button');
        likeButton.addEventListener('click', () => {
            const likeCount = postElement.querySelector('.like-count');
            let likes = parseInt(likeCount.textContent);
            likes += likeButton.classList.contains('liked') ? -1 : 1;
            likeButton.classList.toggle('liked');
            likeCount.textContent = likes;

            // Save posts to localStorage after liking
            savePosts();
        });
    };

    // Load posts from localStorage when the page loads
    loadPosts();
});
