import { Track, Flex, Ranking, Counter } from "./game_components";
import { getTracksofPlaylist } from "./api/spotifyapi";
import { useState, useEffect, useRef } from "react";

export default function Game() {
    const [tracks, setTracks] = useState(null); // Object for tracks
    const [activeTracks, setActiveTracks] = useState([null, null]); // Array[str] for the active tracks
    const audio = useRef([null, null]); // Array[audio] for audio

    // Initializers
    useEffect( () => {
        const album = localStorage.getItem('album');
        const fetchTracks = async () => {
            const response = await getTracksofPlaylist(album);

            // Add rank to each track
            response.forEach(track => track.rank = 0);
            setTracks({...tracks, tracklist: pairAll(response)});
        }

        fetchTracks();
    }, [])

    useEffect( () => {
        setActiveTracks(tracks.tracklist[0]);
    }, [tracks])

    useEffect( () => {
        let urls = [activeTracks[0] && activeTracks[0].preview,
                    activeTracks[1] && activeTracks[1].preview];
        audio.current = [
            {
                sound: new Audio(urls[0]),
                muted: true
            },
            {
                sound: new Audio([urls[1]]),
                muted: true
            }
        ];
    })

    function handleClick(id) {
        // @param: id of saved track
        let drop = activeTracks[0] === id ? activeTracks[1] : activeTracks[0]; //? get the track to be dropped

        //setRank([...rank, drop]);
        setActiveTracks(tracks.tracklist[0][0]);
    }

    function handlePlayAudio(track) {
        switch (track) {
            case 0:
                audio.current[1].sound.pause();
                audio.current[1].muted = true;
                audio.current[track].sound.play();
                audio.current[track].muted = false;

            case 1:
                audio.current[0].sound.pause();
                audio.current[0].muted = true;
                audio.current[track].sound.play();
                audio.current[track].muted = false;    
        }
    }

    function mute() {
        audio.current[0].sound.pause();
        audio.current[1].sound.pause();
    }

    return (
        <>
            <Flex>
                {activeTracks[0] && 
                    <Track
                        track={activeTracks[0]}
                        key={activeTracks[0].id}
                        onClick={() => handleClick(activeTracks[0])}
                        onPlay={() => handlePlayAudio(0)}
                        onMute={mute}
                    />
                }
                {(tracks && tracks.index < tracks.tracklist.length ) && <Counter num={tracks.tracklist - tracks.index} />}
                {activeTracks[1] && 
                    <Track
                        track={activeTracks[1]}
                        key={activeTracks[1].id}
                        onClick={() => handleClick(activeTracks[1])}
                        onPlay={() => handlePlayAudio(1)}
                        onMute={mute}
                    />
                }
                {(tracks && tracks.index >= 9999) && <Ranking rank={tracks.tracklist} />}
            </Flex>
        </>
    )
}

function pairAll(list) {
    if (list && list.length >= 2) {
        let pairs = []
        for (let i = 0; i < list.length - 1; i ++) {
            for (let j = i + 1; j < list.length; j ++) {
                pairs.push([list[i], list[j]]);
            }
        }
        return pairs;
    }
    return [null, null];
}
