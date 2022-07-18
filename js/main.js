document.querySelector('.poster-header__nav').addEventListener('click', (e) => {
  e.preventDefault();
  const { target } = e;
  const { id } = target;
  const findDash = id.indexOf('-');
  const IDsliced = id.slice(findDash + 1, findDash.length);
  showArtistPoster(IDsliced);
});

async function showArtistPoster(artistID) {
  try {
    let artist = await fetch(
      `https://api.artic.edu/api/v1/artists/${artistID}`
    );
    let artistObject = await artist.json();

    const randomIndex = Math.floor(
      Math.random() * (artistObject.data.artwork_ids.length - 1) + 1
    );
    const randomObjectID = artistObject.data.artwork_ids[randomIndex];
    console.log(randomObjectID);

    let artwork = await fetch(
      `https://api.artic.edu/api/v1/artworks/${randomObjectID}`
    );
    let artworkObject = await artwork.json();

    const poster = new Poster(artworkObject);
    await poster.servePoster();
  } catch (err) {
    console.error(`Could not get poster: ${err}`);
  }
}

class Poster {
  constructor(artworkInfo) {
    this.description = artworkInfo.data.thumbnail.alt_text;
    this.artistName = artworkInfo.data.artist_title;
    this.department = artworkInfo.data.department_title;
    this.dimensions = artworkInfo.data.dimensions;
    this.artworkID = artworkInfo.data.id;
    this.title = artworkInfo.data.title;
    this.iiifURL = artworkInfo.config['iiif_url'];
    this.imageID = artworkInfo.data['image_id'];
    this.thumbnail = artworkInfo.data.thumbnail;
    this.color = artworkInfo.data.color;
  }

  async servePoster() {
    await this.displayImage();
    await this.addTitle();
    await this.addArtist();
    await this.addAlt();
    await this.addDimensions();
    await this.addDepartment();
    await this.changeTextShadow();
  }

  async displayImage() {
    return new Promise((resolve) => {
      const image = document.querySelector('#poster-main__img');

      if (this.thumbnail === null || this.thumbnail === undefined) {
        image.src =
          'https://raw.githubusercontent.com/heyjochen/Posters-Chicago/main/assets/210422_js_STI6262.jpg';
      } else {
        const imagePath = '/full/843,/0/default.jpg';
        const imageURL = `${this.iiifURL}/${this.imageID}${imagePath}`;
        image.src = imageURL;
      }
      image.addEventListener('load', () => {
        resolve(image);
      });
    });
  }

  async addTitle() {
    const title = document.querySelector('.poster-main__h1');
    title.textContent = this.title;
  }

  async addArtist() {
    const artistName = document.querySelector('#poster-main__artistName');
    artistName.innerHTML = this.artistName;
  }

  async addAlt() {
    if (this.description !== null) {
      document.querySelector('.poster-main__h2').textContent = this.description;
    }
  }

  async addDimensions() {
    document.querySelector('.poster-main__h3').textContent = this.dimensions;
  }

  async addDepartment() {
    document.getElementById('poster-main__department').textContent =
      this.department;
  }

  async changeTextShadow() {
    if (this.color !== null) {
      document.querySelector(
        '.poster-main__imgInfo'
      ).style.textShadow = `1px 1px 0px hsl(${this.color.h}, ${this.color.s}%, ${this.color.l}%)`;
    }
  }
}
