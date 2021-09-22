let accessToken;
const clientID='3116828c98b74676be2faa893f020b9f';
const redirectURI='http://localhost:3000/'//'http://codecademy_jammming.surge.sh/';

const Spotify={
    getAccessToken: ()=> {
        if (accessToken){
            return accessToken
        }
        // check for access token match
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
        if (accessTokenMatch && expiresInMatch) {
            accessToken=accessTokenMatch[1];
            let expiresIn=Number(expiresInMatch[1]);
            /*set access token to expre at the value for expiration time */
            /*clear the parameters from the URL */
            window.setTimeout(()=> accessToken='', expiresIn*1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            const accessURL=`https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
            window.location=accessURL;
        }
    },
    search: (term)=>{
        const accessToken = Spotify.getAccessToken();

        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            if (!jsonResponse.tracks) {
                return []
            } 
            return jsonResponse.tracks.items.map(track => {
                return {
                id: track.id,
                name: track.name,
                artists: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
                }
            })
        }

        )
    },
    savePlaylist(playlistName, trackURIs){
        if (!playlistName || !trackURIs.length){
            return;
        }
        const accessToken = Spotify.getAccessToken();
        const header={Authorization: `Bearer ${accessToken}`}
        let userID;

        return fetch('https://api.spotify.com/v1/me', 
        {headers: header}
        ).then(response => response.json()
        ).then(responseJson => {
            userID=responseJson.id;
            return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`,
            {
                headers:header,
                method: 'POST',
                body:JSON.stringify({name:playlistName})
            }).then(response=> response.json()
            ).then(responseJson=> {
                const playlistID=responseJson.id;
                return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`,
                {
                    headers:header,
                    method:'POST',
                    body: JSON.stringify({
                        uris:trackURIs
                    })
                })
            })
        })
    }
};

export {Spotify};
