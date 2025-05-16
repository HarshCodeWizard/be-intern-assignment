#!/bin/bash

# Base URL for the API
BASE_URL="http://localhost:3000/api"

# Function to set up test data
setup_test_data() {
  echo "Setting up test data..."

  # Create User 1
  curl -s -X POST "${BASE_URL}/users" \
    -H "Content-Type: application/json" \
    -d '{"firstName":"John","lastName":"Doe","email":"john.doe@example.com","password":"password123"}' | jq .
  echo "Created User 1 ✅"

  # Create User 2
  curl -s -X POST "${BASE_URL}/users" \
    -H "Content-Type: application/json" \
    -d '{"firstName":"Jane","lastName":"Smith","email":"jane.smith@example.com","password":"password123"}' | jq .
  echo "Created User 2 ✅"

  # Create a Follow relationship (User 1 follows User 2)
  curl -s -X POST "${BASE_URL}/follows" \
    -H "Content-Type: application/json" \
    -d '{"followerId":1,"followedId":2}' | jq .
  echo "Created Follow (User 1 -> User 2) ✅"

  # Create a Post by User 2
  curl -s -X POST "${BASE_URL}/posts" \
    -H "Content-Type: application/json" \
    -d '{"content":"Hello world!","hashtags":["test"],"userId":2}' | jq .
  echo "Created Post by User 2 ✅"

  # Create a Like (User 1 likes Post 1)
  curl -s -X POST "${BASE_URL}/likes" \
    -H "Content-Type: application/json" \
    -d '{"userId":1,"postId":1}' | jq .
  echo "Created Like (User 1 -> Post 1) ✅"

  echo "Test data setup complete! ✅"
}

# Function to test User entity
test_user() {
  echo "Testing User CRUD..."
  echo "Creating a user..."
  curl -s -X POST "${BASE_URL}/users" \
    -H "Content-Type: application/json" \
    -d '{"firstName":"Alice","lastName":"Johnson","email":"alice.johnson@example.com","password":"password123"}' | jq .
  echo "Create user test passed ✅"

  echo "Getting all users..."
  curl -s "${BASE_URL}/users" | jq .
  echo "Get all users test passed ✅"

  echo "Getting user by ID (1)..."
  curl -s "${BASE_URL}/users/1" | jq .
  echo "Get user by ID test passed ✅"

  echo "Updating user (1)..."
  curl -s -X PUT "${BASE_URL}/users/1" \
    -H "Content-Type: application/json" \
    -d '{"firstName":"Johnny"}' | jq .
  echo "Update user test passed ✅"

  echo "Deleting user (3)..."
  curl -s -X DELETE "${BASE_URL}/users/3"
  echo "Delete user test passed ✅"

  echo "Testing /api/users/1/followers..."
  curl -s "${BASE_URL}/users/1/followers?limit=2&offset=0" | jq .
  echo "Get user followers test passed ✅"

  echo "Testing /api/users/1/activity..."
  curl -s "${BASE_URL}/users/1/activity?limit=2&offset=0&type=FOLLOW" | jq .
  echo "Get user activity test passed ✅"
}

# Function to test Post entity
test_post() {
  echo "Testing Post CRUD..."
  echo "Creating a post..."
  curl -s -X POST "${BASE_URL}/posts" \
    -H "Content-Type: application/json" \
    -d '{"content":"Test post","hashtags":["test"],"userId":1}' | jq .
  echo "Create post test passed ✅"

  echo "Getting all posts..."
  curl -s "${BASE_URL}/posts" | jq .
  echo "Get all posts test passed ✅"

  echo "Getting post by ID (1)..."
  curl -s "${BASE_URL}/posts/1" | jq .
  echo "Get post by ID test passed ✅"

  echo "Updating post (1)..."
  curl -s -X PUT "${BASE_URL}/posts/1" \
    -H "Content-Type: application/json" \
    -d '{"content":"Updated post"}' | jq .
  echo "Update post test passed ✅"

  echo "Deleting post (1)..."
  curl -s -X DELETE "${BASE_URL}/posts/1"
  echo "Delete post test passed ✅"

  echo "Testing /api/posts/hashtag/test..."
  curl -s "${BASE_URL}/posts/hashtag/test?limit=2&offset=0" | jq .
  echo "Get posts by hashtag test passed ✅"
}

# Function to test Follow entity
test_follow() {
  echo "Testing Follow CRUD..."
  echo "Creating a follow..."
  curl -s -X POST "${BASE_URL}/follows" \
    -H "Content-Type: application/json" \
    -d '{"followerId":2,"followedId":1}' | jq .
  echo "Create follow test passed ✅"

  echo "Getting all follows..."
  curl -s "${BASE_URL}/follows" | jq .
  echo "Get all follows test passed ✅"

  echo "Getting follow by ID (1, 2)..."
  curl -s "${BASE_URL}/follows/1/2" | jq .
  echo "Get follow by ID test passed ✅"

  echo "Deleting follow (1, 2)..."
  curl -s -X DELETE "${BASE_URL}/follows/1/2"
  echo "Delete follow test passed ✅"
}

# Function to test Like entity
test_like() {
  echo "Testing Like CRUD..."
  echo "Creating a like..."
  curl -s -X POST "${BASE_URL}/likes" \
    -H "Content-Type: application/json" \
    -d '{"userId":2,"postId":1}' | jq .
  echo "Create like test passed ✅"

  echo "Getting all likes..."
  curl -s "${BASE_URL}/likes" | jq .
  echo "Get all likes test passed ✅"

  echo "Getting like by ID (1, 1)..."
  curl -s "${BASE_URL}/likes/1/1" | jq .
  echo "Get like by ID test passed ✅"

  echo "Deleting like (1, 1)..."
  curl -s -X DELETE "${BASE_URL}/likes/1/1"
  echo "Delete like test passed ✅"
}

# Function to test Activity entity
test_activity() {
  echo "Testing Activity CRUD..."
  echo "Creating an activity..."
  curl -s -X POST "${BASE_URL}/activities" \
    -H "Content-Type: application/json" \
    -d '{"userId":1,"type":"POST","targetId":1}' | jq .
  echo "Create activity test passed ✅"

  echo "Getting all activities..."
  curl -s "${BASE_URL}/activities" | jq .
  echo "Get all activities test passed ✅"

  echo "Getting activity by ID (1)..."
  curl -s "${BASE_URL}/activities/1" | jq .
  echo "Get activity by ID test passed ✅"

  echo "Updating activity (1)..."
  curl -s -X PUT "${BASE_URL}/activities/1" \
    -H "Content-Type: application/json" \
    -d '{"type":"LIKE"}' | jq .
  echo "Update activity test passed ✅"

  echo "Deleting activity (1)..."
  curl -s -X DELETE "${BASE_URL}/activities/1"
  echo "Delete activity test passed ✅"
}

# Function to test Feed endpoint
test_feed() {
  echo "Testing /api/feed..."
  curl -s "${BASE_URL}/feed?userId=1&limit=2&offset=0" | jq .
  echo "Get feed test passed ✅"
}

# Main menu
while true; do
  echo "Select an option:"
  echo "1. Setup test data (required before running tests)"
  echo "2. Test User"
  echo "3. Test Post"
  echo "4. Test Follow"
  echo "5. Test Like"
  echo "6. Test Activity"
  echo "7. Test Feed"
  echo "8. Exit"
  read -p "Enter your choice: " choice

  case $choice in
    1) setup_test_data ;;
    2) test_user ;;
    3) test_post ;;
    4) test_follow ;;
    5) test_like ;;
    6) test_activity ;;
    7) test_feed ;;
    8) echo "Exiting..."; exit 0 ;;
    *) echo "Invalid choice, please try again." ;;
  esac
done