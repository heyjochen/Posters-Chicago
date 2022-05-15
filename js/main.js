//Grab artist name on button
document.querySelector('.poster-header__nav').addEventListener('click', e=>{
    e.preventDefault()
    const {target} = e
    const {id} = target
    const findDash = id.indexOf('-')
    const IDsliced = id.slice(findDash+1, findDash.length)
    showArtistPoster(IDsliced)

})

//Grab an artists artworks
async function showArtistPoster(artistID) {

    try {
    //read artist JSON
    let artist = await fetch(`https://api.artic.edu/api/v1/artists/${artistID}`)
    let artistObject = await artist.json()

    //generate  random Artwork ID
    const randomIndex = Math.floor(Math.random() * (artistObject.data.artwork_ids.length - 1) + 1)
    const randomObjectID = artistObject.data.artwork_ids[randomIndex]
    console.log(randomObjectID)

    //read Artwork JSON itself
    let artwork = await fetch(`https://api.artic.edu/api/v1/artworks/${randomObjectID}`)
    let artworkObject = await artwork.json()

    const poster = new Poster(artworkObject)
    poster.displayImage()
    poster.addTitle()
    poster.addArtist()
    poster.addAlt()
    poster.addDimensions()
    poster.addDepartment()
    poster.changeTextShadow()
    }
    catch(err) {
        console.error(`Could not get poster: ${err}`);
    }
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
        this.color = artworkInfo.data.color

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
        const title = document.querySelector('.poster-main__h1')
        title.textContent = this.title
    }

    addArtist(){
        document.querySelector('#poster-main__artistName').innerHTML = this.artistName 
    }

    addAlt(){
        if (this.description !== null){
        document.querySelector('.poster-main__h2').textContent = this.description
        }
    }

    addDimensions(){
        document.querySelector('.poster-main__h3').textContent = this.dimensions
    }

    addDepartment(){
        document.getElementById('poster-main__department').textContent = this.department
    }

    changeTextShadow(){
        if (this.color !== null) {
        document.querySelector('.poster-main__imgInfo').style.textShadow = `1px 1px 0px hsl(${this.color.h}, ${this.color.s}%, ${this.color.l}%)`
        }
    }


}
