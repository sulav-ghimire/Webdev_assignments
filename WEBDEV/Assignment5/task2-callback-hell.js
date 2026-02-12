// Task 2: Callback Hell Example

function getUser(id, callback) {
    setTimeout(() => {
        console.log("User fetched");
        callback({ id: id, name: "Ram" });
    }, 1000);
}

function getPosts(userId, callback) {
    setTimeout(() => {
        console.log("Posts fetched");
        callback(["post1", "post2"]);
    }, 1000);
}

function getComments(post, callback) {
    setTimeout(() => {
        console.log("Comments fetched");
        callback(["nice", "good"]);
    }, 1000);
}

// NESTED CALLBACKS = callback hell
getUser(1, (user) => {
    getPosts(user.id, (posts) => {
        getComments(posts[0], (comments) => {
            console.log("User:", user);
            console.log("Posts:", posts);
            console.log("Comments:", comments);
        });
    });
});
