import {Client, Databases, ID, Query} from "appwrite";

const  PROJECT_ID=import.meta.env.VITE_APPWRITE_PROJECT_ID;
const  DATABASE_ID=import.meta.env.VITE_APPWRITE_DATABASE_ID;
const  COLLECTION_ID=import.meta.env.VITE_APPWRITE_COLLECTION_ID;


const client = new Client().setEndpoint('https://cloud.appwrite.io/v1').setProject(PROJECT_ID);

const database = new Databases(client)

export  const  updateSearchCount = async (searchTerm,movie)=>{
    try {
    const results = await database.listDocuments(DATABASE_ID,COLLECTION_ID,[Query.equal('searchTerm', searchTerm)]);

    if(results.documents.length > 0){
        const  doc = results.documents[0]
        await database.updateDocument(DATABASE_ID,COLLECTION_ID,doc.$id,{count:doc.count + 1})
    }
    else {
        await database.createDocument(DATABASE_ID,COLLECTION_ID,ID.unique(),{
            searchTerm,
            count:1,
            movie_id:movie.imdbid,
            poster_url:movie.imageurl[0]
        })}
    }
    catch(error){
        console.error(error)
    }
}

export  const getTrendingMovies = async ()=>{
    try {
        const result=await database.listDocuments(DATABASE_ID,COLLECTION_ID,[Query.limit(5),Query.orderDesc('count')])
        return result.documents;
    }
    catch(error){
        console.error(error)
    }
}