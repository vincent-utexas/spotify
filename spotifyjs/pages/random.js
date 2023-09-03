import { Track, Flex, Ranking } from "./game_components";
import { getTracksofPlaylist } from "./api/spotifyapi";
import { useState, useEffect } from "react";

export default function Game() {
    const [tracks, setTracks] = useState(null); // Array[object] for tracks (id, album, name, img, preview)
    const [activeTracks, setActiveTracks] = useState([null, null]); // Array[str] for the active tracks
    const [rank, setRank] = useState([]); // Array[str] for tracks dropped first --> last 
    
    useEffect( () => {
        const album = localStorage.getItem('album');
        const fetchTracks = async () => {
            const response = await getTracksofPlaylist(album);
            setTracks(response);
        }

        fetchTracks();
    }, [])

    useEffect( () => {
        setActiveTracks(getRandomTracks(tracks));
    }, [tracks])

    function handleClick(id) {
        // @param: id of saved track
        let drop = activeTracks[0] === id ? activeTracks[1] : activeTracks[0]; //? get the track to be dropped
        let next = tracks;
        drop = next.splice(tracks.indexOf(drop), 1)[0];

        setRank([...rank, drop]);
        setTracks(next);
        setActiveTracks(getRandomTracks(tracks));

    }

    return (
        <>
            <Flex>
                {activeTracks[0] && <Track track={activeTracks[0]} key={activeTracks[0].id} onClick={() => handleClick(activeTracks[0])}/>}
                {activeTracks[1] && <Track track={activeTracks[1]} key={activeTracks[1].id} onClick={() => handleClick(activeTracks[1])}/>}
                {(tracks && tracks.length <= 1) && <Ranking rank={rank.concat(tracks)} />}
            </Flex>
        </>
    )
}

function getRandomTracks(tracks) {
    if (tracks && tracks.length >= 2) {
        let possible = [];
        possible.push(choice(tracks)); // add a random track
        possible.push(choice(tracks));

        while (possible[0] === possible[1]) { // if the tracks are the same
            possible.splice(0, 1);
            possible.push(choice(tracks));
        }
        return possible;
    }
    return [null, null];

}

function choice(list) {
    return list[Math.floor(Math.random() * list.length)];
}