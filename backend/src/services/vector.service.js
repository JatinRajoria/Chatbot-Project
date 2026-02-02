const { Pinecone } = require('@pinecone-database/pinecone');

const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
});

const chatGPTIndex = pc.Index('chat-gpt');

async function createMemory({vectors, metadata, messageId}){
    await chatGPTIndex.upsert([{
        id: messageId,
        values: vectors,
        metadata
    }]);
}

async function queryMemory({queryVector, limit = 5, metadata}){
    const data = await chatGPTIndex.query({
        vector: queryVector,
        topK: limit,
        filter: metadata? metadata : undefined,
        includeMetadata: true
    });
    return data.matches;
}

// services/vector.service.js
async function deleteByIDs(idsArray) {
    try {
        // IDs se delete karne mein 'Illegal Condition' error kabhi nahi aayega
        // Kyunki IDs hamesha indexed hoti hain
        await chatGPTIndex.deleteMany(idsArray);
    } catch (err) {
        console.error("Pinecone ID Delete Error:", err.message);
        throw err;
    }
}

module.exports = { createMemory, queryMemory, deleteByIDs }
