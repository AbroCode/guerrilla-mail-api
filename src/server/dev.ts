import app from './index';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`API Server running at http://localhost:${PORT}`);
  console.log(`API Base URL: http://localhost:${PORT}/api/v1`);
  console.log(`Health Check: http://localhost:${PORT}/health`);
});
