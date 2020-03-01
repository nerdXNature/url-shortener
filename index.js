const express = require("express");
const cors = require("cors");
const app = express();
const slug = require("randomstring");
const { Pool } = require("pg");
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(
  cors({
    origin: "*"
  })
);

app.set('view engine', 'ejs')

app.listen(process.env.PORT || 5000, () => {
  console.log("URL Shortner Started");
});

// Getting config variables from Heroku
const dbUrl = process.env.DATABASE_URL;
const shortDomain = process.env.SHORT_DOMAIN;
const name = process.env.NAME;
let ssl = process.env.SSL || "TRUE";

if (ssl === "TRUE") {
  ssl = true;
} else {
  ssl = false;
}

// Defining full short url based on config variables
const full_url = `${ssl ? 'https://' : 'http://'}${shortDomain}/`;
const siteData = { name: name, url: shortDomain, full_url }

// Defining Heroku database options
const herokuDbOptions = {
  connectionString: dbUrl,
  ssl: true
};

const pool = new Pool(herokuDbOptions);

function query(text, params, callback) {
  return pool.query(text, params, callback);

}

// Getting short link information using the short link slug
async function getDataBySlug(slug) {
  return query("SELECT * FROM short_links WHERE slug=$1", [slug]).then(
    res => res.rows[0]
  );
}

// Creating a new short link
async function createNewShortLink(full_url, slug) {
  return query(
    "INSERT INTO short_links (full_url, slug) VALUES ($1, $2) RETURNING *",
    [full_url, slug]
  ).then(res => res.rows[0]);
}

// Updating the number clicks when someone clicks on the link
async function updateClicks(slug) {
  return query(`UPDATE short_links SET clicks = clicks + 1 WHERE slug = $1`, [
    slug
  ]).then(res => res.rowCount > 0);
}

// Rendering the main page
app.get('/', (req, res) => {
  res.render('index', { siteData })
});

// Rendering stats page for a specific short link
app.get('/short/:slug', async (req, res) => {

  // Checking if there is a slug and redirecting to the main page if there is not.
  if (!req.params.slug) {
    res.redirect('/');
    return;
  }

  // Getting the information of the shortlink
  let shortData = await getDataBySlug(req.params.slug)

  // Redirecting to main page if that shortlink does not exist in the database
  if (!shortData) {
    res.redirect('/');
    return;
  }

  // Formatting data before passing it to the render function
  short_url = full_url + req.params.slug;
  shortData = {
    ...shortData,
    short_url,
    shortDomain
  }

  // Rendering the page with the shortlink data
  res.render('shortened', { siteData, shortData })
});

// The POST from the form on the main page.
app.post('/shorten', async (req, res) => {

  // Checking if there is a fullUrl sent
  if (!req.body.fullUrl) {
    res.sendStatus(400);
    return;
  }

  // Generating the shortlink slug
  let short_slug = slug.generate({
    length: 4,
    charset: 'abdefhjkmnprstuvwxyz234579'
  })

  // Inserting the new shortlink into the database
  await createNewShortLink(req.body.fullUrl, short_slug)

  // Redirecting to the stats page for the shortlink that was just created
  res.redirect(`/short/${short_slug}`);
  return;

});

// Main redirecting function
app.get('/:slug', async (req, res) => {

  //  Checking if there is a slug present and redirecting to the main page if there is not
  if (!req.params.slug) {
    res.redirect('/');
    return;
  }

  // Getting shortlink information
  let shortData = await getDataBySlug(req.params.slug)

  // Redirecting to main page if the shortlink does not exist
  if (!shortData) {
    res.redirect('/');
    return;
  }

  // Updating the number of clicks in the database
  await updateClicks(req.params.slug);

  // Redirecting to the full url from the database
  res.redirect(shortData.full_url);
  return;
});