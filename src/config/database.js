const mongoose = require('mongoose');


function buildNonSrvUriFromSrv(srvUri) {
  const parsedUri = new URL(srvUri);
  const host = parsedUri.hostname;

  if (host !== 'cluster0.ehi9tvk.mongodb.net') {
    throw new Error(
      'SRV URI detected but non-SRV host mapping is unknown. Set MONGODB_URI_NON_SRV in .env',
    );
  }

  const authSegment = srvUri
    .slice('mongodb+srv://'.length)
    .split('@')[0];
  const hasAuth = srvUri.includes('@');
  const authority = hasAuth ? `${authSegment}@` : '';
  const dbName = parsedUri.pathname || '/';

  const params = new URLSearchParams(parsedUri.searchParams);
  params.set('tls', 'true');
  params.set('authSource', 'admin');
  params.set('replicaSet', 'atlas-fxukx0-shard-0');

  const hosts = [
    'ac-wemi5uv-shard-00-00.ehi9tvk.mongodb.net:27017',
    'ac-wemi5uv-shard-00-01.ehi9tvk.mongodb.net:27017',
    'ac-wemi5uv-shard-00-02.ehi9tvk.mongodb.net:27017',
  ].join(',');

  return `mongodb://${authority}${hosts}${dbName}?${params.toString()}`;
}

function resolveMongoUri() {
  const explicitNonSrv =
    process.env.MONGODB_URI_NON_SRV || process.env.MONGO_URI_NON_SRV;
  if (explicitNonSrv) {
    return explicitNonSrv;
  }

  const defaultUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!defaultUri) {
    throw new Error(
      'Missing MongoDB connection string. Set MONGODB_URI_NON_SRV (preferred) or MONGODB_URI in .env',
    );
  }

  if (defaultUri.startsWith('mongodb+srv://')) {
    return buildNonSrvUriFromSrv(defaultUri);
  }

  return defaultUri;
}

async function connectDB() {
try {
  const mongoUri = resolveMongoUri();

  await mongoose.connect(mongoUri)
  console.log('Connected to MongoDB');
} catch (error) {
  console.error('Error connecting to MongoDB:', error);
  throw error;
}
}

module.exports = connectDB;