const _ = require('lodash');

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  let likes = 0;
  blogs.forEach((blog) => {
    likes = likes + blog.likes;
  });

  return likes;
};

const favoriteBlog = (blogs) => {
  if (blogs.length > 0) {
    let favorite = blogs[0];
    blogs.forEach((blog) => {
      if (blog.likes > favorite.likes) {
        favorite = blog;
      }
    });

    return favorite;
  } else {
    return 'no blogs given';
  }
};

const mostBlogs = (blogs) => {
  if (blogs.length > 0) {
    // Get the most frequent author in blogs with lodash
    // countBy() defines which object key is counted, entries() holds key-value pairs of the count of each author,
    // maxBy() gets the biggest value of that array
    const mostFrequentAuthor = _.head(
      _(blogs).countBy('author').entries().maxBy()
    );

    let numberOfBlogs = 0;

    blogs.forEach((blog) => {
      if (blog.author === mostFrequentAuthor) {
        numberOfBlogs = numberOfBlogs + 1;
      }
    });

    return { author: mostFrequentAuthor, blogs: numberOfBlogs };
  } else {
    return 'no blogs given';
  }
};

const mostLikes = (blogs) => {
  if (blogs.length > 0) {
    // Group the blogs by author using lodash
    const groupedByAuthor = _.groupBy(blogs, 'author');
    // console.log('Grouped: ', groupedByAuthor);

    // Turn the grouped object into an array so it can be manipulated with map
    const groupedAsArray = Object.entries(groupedByAuthor);
    // console.log('As array: ', groupedAsArray);

    // Map the array into a new array of objects, where each object is authors name and their likes {author: 'authors name', likes: 'number of likes'}
    const authorsWithLikes = groupedAsArray.map((item) => {
      const author = item[0];
      let likesForAuthor = 0;

      // Calculate all likes for the author, by going through each of their blogs
      item[1].forEach((blog) => {
        likesForAuthor = likesForAuthor + blog.likes;
      });

      // Return an object for each author with their name and likes
      return {
        author: author,
        likes: likesForAuthor,
      };
    });

    // console.log('Mapped: ', authorsWithLikes);

    // Find the author with most likes by going through each author and compare their likes with the previous author
    const mostLikedAuthor = authorsWithLikes.reduce(
      (previousAuthor, currentAuthor) => {
        return previousAuthor.likes > currentAuthor.likes
          ? previousAuthor
          : currentAuthor;
      }
    );

    return mostLikedAuthor;

    // console.log('Most liked author: ', mostLikedAuthor);
  } else {
    return 'no blogs given';
  }
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
