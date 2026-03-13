import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '只支持 GET' });
  }
  
  try {
    await client.connect();
    const db = client.db('yysls');
    const collection = db.collection('messages');
    
    const messages = await collection
      .find({})
      .sort({ time: -1 })
      .limit(50)  // 只显示最近50条
      .toArray();
    
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await client.close();
  }
}