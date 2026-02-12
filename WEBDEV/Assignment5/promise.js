// Task 3: Using Promises

function getUser() {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("User fetched");
            resolve({ id: 1, name: "Ram" });
        }, 1000);
    });
}

function getPosts(userId) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Posts fetched");
            resolve(["post1", "post2"]);
        }, 1000);
    });
}

function getComments(post) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Comments fetched");
            resolve(["nice", "good"]);
        }, 1000);
    });
}

// Using .then()
getUser()
    .then((user) => {
        return getPosts(user.id).then((posts) => ({ user, posts }));
    })
    .then((data) => {
        return getComments(data.posts[0]).then((comments) => ({ ...data, comments }));
    })
    .then((finalData) => {
        console.log("User:", finalData.user);
        console.log("Posts:", finalData.posts);
        console.log("Comments:", finalData.comments);
    })
    .catch((err) => console.log("Error:", err));
