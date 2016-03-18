export default {
  "Query": {
    "viewer": {
      "type": "User"
    }
  },
  "User": {
    "posts": {
      "type": "PostConnection"
    }
  },
  "Post": {
    "user": {
      "type": "User"
    },
    "comments": {
      "type": "CommentConnection"
    }
  },
  "PostConnection": {
    "nodes": {
      "type": "Post"
    }
  },
  "Comment": {
    "post": {
      "type": "Post"
    }
  },
  "CommentConnection": {
    "nodes": {
      "type": "Comment"
    }
  }
}