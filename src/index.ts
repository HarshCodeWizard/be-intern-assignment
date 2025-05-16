import express from 'express';
import { AppDataSource } from './data-source';
import userRoutes from './routes/user.routes'; // Adjust based on your routes
import followRoutes from './routes/follow.routes';
import postRoutes from './routes/posts.routes';
import likeRoutes from './routes/like.routes';
import activityRoutes from './routes/activity.routes';
import feedRoutes from './routes/feed.routes';

const app = express();

app.use(express.json());

// Initialize the database connection
AppDataSource.initialize()
  .then(() => {
    console.log('Database connection initialized successfully');

    // Register routes
    app.use('/api/users', userRoutes);
    app.use('/api/follows', followRoutes);
    app.use('/api/posts', postRoutes);
    app.use('/api/likes', likeRoutes);
    app.use('/api/activities', activityRoutes);
    app.use('/api/feed', feedRoutes);

    // Start the server
    const PORT = 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error initializing database connection:', error);
    process.exit(1);
  });