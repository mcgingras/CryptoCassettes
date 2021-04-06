import React, { useEffect, useState } from 'react';
import SpotifyPlayer from "../components/SpotifyPlayer";
import {next, previous, play} from '../spotify';

const Den = () => {
  const savedToken = localStorage.getItem('spotify_token');
  const [tape, setTape] = useState(undefined);
  const [uris, setUris] = useState([]);
  const [token, setToken] = useState(savedToken || "");
  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    let id = window.location.pathname.substring(window.location.pathname.length - 1)
    fetchTapes(id)
    .then(results => {
      console.log(results);
      setTape(results);
    })
  }, [])

  useEffect(() => {
    if (token) {
      setLoggedIn(true);
    }
    else {
    let urlstring = window.location.href;
    let url = new URL(urlstring);
    let c = url.searchParams.get('access_token');
    console.log(c);

    if (c) {
      setLoggedIn(true);
      setToken(c);
    }
  }
  }, []);

  useEffect(() => {
    if(tape){
      const uris = tape.songs.map((song) => { return song.uri })
      setUris(uris);
    }
  }, [tape])

  return (
      <div>
        { !isLoggedIn
          ?
          <div>you need to be logged in</div>
          :
          <div className="grid grid-cols-4 h-screen">
            <div className="col-span-3 bg-yellow-500">
              <SpotifyPlayer uris={uris} />
            </div>
            { tape &&
              <div className="col-span-1 bg-gray-900 p-4">
                <h2 className="text-white text-2xl">{ tape.songs[0].name}</h2>
                <button className="text-white" onClick={() => {next(token)}}>next</button>
              </div>
            }
          </div>
        }
      </div>
  )
}

export default Den;

const fetchTapes = (id) => {
  return fetch(`http://localhost:1234/tape/${id}`, {
    method: 'GET'
  })
  .then(res => res.json())
}