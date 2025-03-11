import React from 'react'

function MovieCard({movie:{title,imdbrating,imageurl,released}}) {
    return (
        <div className="movie-card">
            <img src={imageurl?imageurl[0]:'/no-movie.png'} alt={title}/>
            <div className="mt-4">
                <h3>{title}</h3>
                <div className="content">
                    <div className="rating">
                        <img src="star.svg" alt="Star Icon"/>
                        <p>{imdbrating?imdbrating.toFixed(1):'N/A'}</p>
                      </div>
                    <span>·</span>
                    <p className="lang">English</p>
                    <span>·</span>
                    <p className="year">{released}</p>
                </div>
            </div>
        </div>
    )
}

export default MovieCard
