export default {
  "Query": {
    "viewer": {
      "type": "User"
    }
  },
  "User": {
    "posts": {
      "type": "Post"
    }
  },
  "Post": {
    "user": {
      "type": "User"
    },
    "comments": {
      "type": "Comment"
    }
  },
  "Comment": {
    "post": {
      "type": "Post"
    }
  }
}