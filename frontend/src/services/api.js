export const fetchPosts = (isLoadMore = false) => {
    const newOffset = isLoadMore ? offset + LIMIT : 0;

    fetch(`http://localhost:5003/posts?limit=${LIMIT}&offset=${newOffset}`)
        .then(res => res.json())
        .then(data => {
            if (isLoadMore) {
                // GLUE the new posts to the end of the old ones
                setPosts(prev => [...prev, ...data.posts]);
            } else {
                // Fresh start
                setPosts(data.posts);
            }
            const totalPosts = data.totalPosts;
            setTotalPosts(totalPosts);
            console.log("Auto-opening post:", data.posts[0]);
            console.log(selectedPost);
            setOffset(newOffset);})
        .catch(err => console.error("Error:", err));
};