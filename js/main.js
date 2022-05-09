//Grab artist name on button
document.querySelector('.poster-header__nav').addEventListener('click', e=>{
    e.preventDefault()
    const {target} = e
    const {id} = target
    const findDash = id.indexOf('-')
    console.log(findDash)
    const IDsliced = id.slice(findDash, findDash.length-1)
    console.log(IDsliced)
    getArtworkIDs(IDsliced)

})

//Grab all Artworks that have an image
function getArtworkIDs (artistID){
    fetch(`https://api.artic.edu/api/v1/artists/${artistID}`)
    .then(res => res.json()) 
    .then(object => { 
        console.log(object)        
        //generate  random ID
        // const randomIndex = Math.floor(Math.random()* (object.objectIDs.length - 1) + 1)

        // const randomObjectID = object.objectIDs[randomIndex]
        // getArtwork(randomObjectID)
    })

    .catch(err => {
        console.log(`error ${err}`)
    });
}


function getArtwork (ID){
    fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${ID}`)
    .then(res => res.json())
    .then(artworkDetails => { console.log(artworkDetails)
        const poster = new Poster(artworkDetails)
    })

    .catch(err => {
        console.log(`error ${err}`)
    });
}

class Poster{
    constructor (artworkInfo) {
       this.artistName = artworkInfo.artistDisplayName
       this.artistNationality = artworkInfo.artistNationality
       this.department = artworkInfo.department
       this.dimensions = artworkInfo.dimensions
       this.medium = artworkInfo.medium
       
    }
}
