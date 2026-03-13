import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只支持 POST' });
  }
  
  try {
    await client.connect();
    const db = client.db('yysls');
    const collection = db.collection('messages'); // 新建一个集合专门存留言
    
    const { name, content } = req.body;
    const message = {
      name: name || '匿名鱼鱼',
      content,
      time: new Date(),
    };
    
    await collection.insertOne(message);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await client.close();
  }
}