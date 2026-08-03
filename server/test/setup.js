require('dotenv').config();
const path = require('path');
const mongoose = require('mongoose');

let mongod;
let usingMemoryServer = false;
const cacheDir = path.resolve(__dirname, '..', 'node_modules', '.cache', 'mongodb-memory-server');

const getMongoUri = async () => {
  const envUri = process.env.MONGODB_URI?.trim();
  if (envUri) {
    console.log('[Test Setup] Using existing MONGODB_URI from environment.');
    return envUri;
  }

  if (process.env.MONGODB_USE_LOCAL === 'true') {
    const localUri = 'mongodb://127.0.0.1:27017/kronos_test';
    try {
      console.log('[Test Setup] Attempting local MongoDB at', localUri);
      await mongoose.connect(localUri, {
        serverSelectionTimeoutMS: 2000,
        socketTimeoutMS: 45000,
      });
      await mongoose.disconnect();
      console.log('[Test Setup] Local MongoDB is available.');
      return localUri;
    } catch (err) {
      console.warn('[Test Setup] Local MongoDB not available, falling back to mongodb-memory-server:', err.message);
      await mongoose.disconnect().catch(() => {});
    }
  }

  process.env.MONGOMS_DOWNLOAD_DIR = process.env.MONGOMS_DOWNLOAD_DIR || cacheDir;
  process.env.MONGOMS_VERSION = process.env.MONGOMS_VERSION || '6.0.14';
  process.env.MONGOMS_RUNTIME_DOWNLOAD = process.env.MONGOMS_RUNTIME_DOWNLOAD || 'true';

  const { MongoMemoryServer } = require('mongodb-memory-server');
  console.log('[Test Setup] Starting mongodb-memory-server using cache dir:', process.env.MONGOMS_DOWNLOAD_DIR);
  mongod = await MongoMemoryServer.create({
    binary: {
      version: process.env.MONGOMS_VERSION,
    },
  });

  usingMemoryServer = true;
  const uri = mongod.getUri();
  console.log('[Test Setup] mongodb-memory-server started at', uri);
  return uri;
};

beforeAll(async () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'test';
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret_kronos';

  const uri = await getMongoUri();
  process.env.MONGODB_URI = uri;

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  });
});

afterEach(async () => {
  if (mongoose.connection.readyState !== 1) {
    return;
  }

  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    if (usingMemoryServer) {
      try {
        await mongoose.connection.dropDatabase();
      } catch (err) {
        console.warn('[Test Setup] dropDatabase failed:', err.message);
      }
    }
    await mongoose.connection.close();
  }

  if (mongod) {
    await mongod.stop();
  }
});
