import React, { useEffect, useState } from 'react';
import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";
import {useDebounce} from "react-use";
import {getTrendingMovies, updateSearchCount} from "./appwrite.js";

const API_BASE_URL = 'https://ott-details.p.rapidapi.com';
const API_KEY = import.meta.env.VITE_X_RAPIDAPI_KEY;
const HOST = import.meta.env.VITE_X_RAPIDAPI_HOST;

const API_OPTIONS = {
    method: 'GET',
    headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': HOST,
    }
};

function App() {
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [movieList, setMovieList] = useState([]);
    const [trendingMovies, setTrendingMovies] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

    useDebounce(()=>setDebouncedSearchTerm(searchTerm),3000,[searchTerm])

    const fetchMovies = async (query) => {
        setIsLoading(true);
        setErrorMessage('');

        try {
            const endpoint =query? `${API_BASE_URL}/search?title=${query}&page=1`:`${API_BASE_URL}/advancedsearch?max_imdb=50&type=movie&page=1`;
            const response = await fetch(endpoint, API_OPTIONS);

            if (!response.ok) {
                throw new Error('Failed to fetch movies from API');
            }

            const movies = await response.json()

            if(movies.Response==='False'){
                setErrorMessage(movies.Error || 'Failed to fetch movies from API');
                setMovieList([])
            }
            console.log(movies)
            setMovieList(movies.results || []);

           if(query && movies.results.length > 0) {
               await updateSearchCount(query,movies.results[0]);
            }
        } catch (error) {
            console.error(`Error fetching movies: ${error}`);
            setErrorMessage('Error fetching movies. Try again later');
        } finally {
            setIsLoading(false);
        }
    };

    const  loadTrendingMovies=async ()=>{
        try {
            const movies = await getTrendingMovies();
            setTrendingMovies(movies);
        } catch (error){
            console.error(`Error fetching trending movies from API: ${error}`);
        }
    }

    useEffect(() => {
        fetchMovies(debouncedSearchTerm)
    }, [debouncedSearchTerm]);

    useEffect(()=>{
        loadTrendingMovies()
    },[])

    return (
        <main>
            <div className="pattern" />
            <div className="wrapper">
                <header>
                    <img src={'./hero.png'} alt={'Hero Banner'} />
                    <h1>Find <span className='text-gradient'>Movies</span> you'll enjoy without the hassle</h1>
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </header>

                {trendingMovies.length > 0 &&(
                    <section className="trending">
                        <h2>Trending Movies</h2>

                        <ul>
                            {trendingMovies.map((movie,index)=>(
                                <li key={movie.$id}>
                                    <p>{index+1}</p>
                                    <img src={movie.poster_url} alt={movie.title}/>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                <section className={'all-movies'}>
                    <h2 className={'mt-[40px]'}>All movies</h2>
                    {isLoading ? (
                        <Spinner/>
                    ) : errorMessage ? (
                        <p className={'text-red-500'}>{errorMessage}</p>
                    ) : (
                        <ul>
                            {movieList.map((movie) => (
                                <MovieCard key={movie.imdbid} movie={movie} />
                                ))}
                        </ul>
                    )}
                </section>
            </div>
        </main>
    );
}

export default App;
