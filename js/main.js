//Grab artist name on button
document.querySelector('.poster-header__nav').addEventListener('click', e=>{
    e.preventDefault()
    const {target} = e
    const {id} = target
    const findDash = id.indexOf('-')
    const IDsliced = id.slice(findDash+1, findDash.length)
    getArtworkIDs(IDsliced)

})

//Grab all Artworks that have an image
function getArtworkIDs (artistID){
    fetch(`https://api.artic.edu/api/v1/artists/${artistID}`)
    .then(res => res.json()) 
    .then(object => { 
    
        //generate  random ID
        const randomIndex = Math.floor(Math.random()* (object.data.artwork_ids.length - 1) + 1)
        console.log(randomIndex)
        const randomObjectID = object.data.artwork_ids[randomIndex]
        console.log(randomObjectID)
        getArtwork(randomObjectID)
    })

    .catch(err => {
        console.log(`error ${err}`)
    });
}


function getArtwork (ID){
    fetch(`https://api.artic.edu/api/v1/artworks/${ID}`)
    .then(res => res.json())
    .then(artworkDetails => { console.log(artworkDetails)
        const poster = new Poster(artworkDetails)
        poster.displayImage()
        poster.addTitle()
        poster.addArtist()
        poster.addAlt()
        poster.addDimensions()
        poster.addDepartment()
    })

    .catch(err => {
        console.log(`error ${err}`)
    });
}

class Poster{
    constructor (artworkInfo) {
        this.description = artworkInfo.data.thumbnail.alt_text
        this.artistName = artworkInfo.data.artist_title
        this.credit = artworkInfo.data.credit_line
        this.date = artworkInfo.data.date_display
        this.department = artworkInfo.data.department_title
        this.dimensions = artworkInfo.data.dimensions
        this.artworkID = artworkInfo.data.id
        this.updated = artworkInfo.data.last_updated
        this.medium = artworkInfo.data.medium_display
        this.origin = artworkInfo.data.place_of_origin
        this.title= artworkInfo.data.title
        this.iiifURL = artworkInfo.config["iiif_url"]
        this.imageID = artworkInfo.data["image_id"]
        this.thumbnail = artworkInfo.data.thumbnail

    }

    displayImage(){
        // check if this.thumbnail === null, if so display placeholderimage
        if (this.thumbnail === null || this.thumbnail === undefined) {
            document.querySelector('#poster-main__img').src = 'https://images.unsplash.com/photo-1651098527823-d24f680f3f09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY1MTUxMzQ2MA&ixlib=rb-1.2.1&q=80&w=1080'
        } else {
        const imagePath = '/full/843,/0/default.jpg'
        const imageURL = `${this.iiifURL}/${this.imageID}${imagePath}`
        document.querySelector('#poster-main__img').src = imageURL
        }
    }

    addTitle(){
        const title = document.querySelector('.poster-main__h1').textContent = this.title
    }

    addArtist(){
        const artist = document.querySelector('#poster-main__artistName').innerHTML = this.artistName 
    }

    addAlt(){
        const altText = document.querySelector('.poster-main__h2').textContent = this.description
    }

    addDimensions(){
        const dimensions = document.querySelector('.poster-main__h3').textContent = this.dimensions
    }

    addDepartment(){
        const department = document.getElementById('poster-main__department').textContent = this.department
    }


}
