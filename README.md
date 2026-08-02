# WizBits

WizBits is a kid-friendly math and pet battle game inspired by classroom battle games. Players collect pets, build a four-pet elemental team, solve math questions, match element tiles, earn rewards, and unlock new modes through adventure, challenges, events, matchmaking, and local friend battles.

The current browser game is built with HTML, CSS, JavaScript, and Three.js. A small Node/Express backend scaffold is included for the next Neon/Postgres and Linode hosting step.

## Snapshots

These snapshots show the main flows in the game.

![Home screen](docs/snapshots/home.svg)

![Pet battle](docs/snapshots/battle.svg)

![Battle shop](docs/snapshots/shop.svg)

## Features

- Player registration and password login with PostgreSQL save data
- Home screen with mascot, shop, backpack, My Pets, Grow Pets, and Battle a Friend
- Adventure mode with locked progression across zones
- Challenges and events battle modes
- Matchmaking battles with Battle Points rewards
- Local friend code screen for adding saved local profiles as friends
- Four-element pet teams: Fire, Water, Electric, and Grass
- Element strengths:
  - Fire beats Grass
  - Grass beats Electric
  - Electric beats Water
  - Water beats Fire
- Connect adjacent matching tiles, including diagonals, to attack
- Fourth-grade-style math questions with timed challenges
- Pet shop, mascot shop, backpack, and My Pets team selection
- Grow Pets flow using Pet Seeds
- Battle Shop purchases using Battle Points

## How To Run With Login And Cloud Saves

WizBits uses PostgreSQL locally so development and Neon run the same SQL. Install Docker Engine
with the Compose plugin, then from the project folder run:

```bash
npm install
cp .env.example .env
npm run db:up
npm run db:schema
npm start
```

Then open:

```text
http://127.0.0.1:3000/
```

The local database is exposed only on `127.0.0.1:5433`. Its files live in the Docker volume
`wizbits-postgres` and survive container restarts.

Useful database commands:

```bash
npm run db:up       # start local PostgreSQL
npm run db:schema   # create or update tables
npm run db:down     # stop PostgreSQL without deleting its data
```

To use Neon, replace `DATABASE_URL` in `.env`, run `npm run db:schema`, and restart the server.
Use a direct Neon connection for `db:schema` and the pooled connection for the running application.

## How Login Works

- A player creates an account with a unique player name and a password of at least 8 characters.
- The server hashes the password with bcrypt; the original password is never stored.
- After login, the browser receives an HTTP-only session cookie that JavaScript cannot read.
- Sessions and profiles live in PostgreSQL, so an account works on another browser or device.
- Progress is cached locally and sent to the server after a short debounce.
- Sessions last up to 14 days. Logging out clears the browser's session.
- Existing browser progress is imported when an account is created with the same player name.

## How To Play

1. Enter a player name on the login screen.
2. Use the red play button to open the play menu.
3. Pick a mode: Adventure, Matchmaking, Challenges, Events, Quiz Mode, My Pets, Grow Pets, or Battle vs Friend.
4. In battle, choose an opposing pet target.
5. Connect matching element tiles on the board. Longer chains do more damage.
6. After a few attacks, solve the math question to continue.
7. Win battles to earn XP, Wiz Bucks, Pet Seeds, or Battle Points depending on the mode.

## Rewards

- Adventure wins give XP, Wiz Bucks, and Pet Seeds.
- Matchmaking wins give Battle Points, up to the daily cap.
- Battle Points can buy Pet XP and Pet Seeds in the Battle Shop.
- Pet Seeds can grow a new pet when the Grow Pets counter reaches `10/10`.

## Project Structure

```text
index.html       Main page and screens
style.css        Game layout, menus, battle UI, shop UI
main.js          Game state, battle logic, shop logic, saves
assets/          Runtime game assets tracked in Git
server/          Express, Neon Postgres, and WebSocket hosting scaffold
docs/snapshots/  README snapshot previews
plan/            Local planning notes and rough reference material, ignored by Git
```

## Notes

The browser keeps a local cache, but authenticated progress is saved in PostgreSQL.

The `plan/` folder is ignored by Git. Production assets used by the game should live under `assets/` so they are available after cloning and deployment.
