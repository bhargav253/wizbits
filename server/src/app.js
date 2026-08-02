import "dotenv/config";

import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import express from "express";
import rateLimit from "express-rate-limit";
import session from "express-session";
import helmet from "helmet";
import connectPgSimple from "connect-pg-simple";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { WebSocketServer } from "ws";

import { pool, query } from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../..");
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "127.0.0.1";
const avatars = ["Fox", "Bunny", "Tiger", "Panda", "Penguin", "Bee", "Deer", "Parrot"];

const app = express();
const PgSession = connectPgSimple(session);

app.set("trust proxy", 1);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    limit: 120,
  }),
);
app.use(
  session({
    store: new PgSession({
      pool,
      schemaName: "wizbits",
      tableName: "sessions",
      createTableIfMissing: false,
    }),
    name: "wizbits.sid",
    secret: process.env.SESSION_SECRET || "dev-only-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 14,
    },
  }),
);

function requireLogin(req, res, next) {
  if (!req.session.userId) {
    res.status(401).json({ error: "login_required" });
    return;
  }
  next();
}

function randomAvatar() {
  return avatars[Math.floor(Math.random() * avatars.length)];
}

function friendCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

async function createUniqueFriendCode() {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const code = friendCode();
    const existing = await query("select id from wizbits.users where friend_code = $1", [code]);
    if (existing.rowCount === 0) return code;
  }
  throw new Error("Could not create a unique friend code");
}

async function currentUser(userId) {
  const result = await query(
    `select u.id, u.username, u.friend_code, u.avatar, p.xp, p.wiz_bucks, p.battle_points,
            p.pet_seeds, p.hearts, p.owned_mascots, p.equipped_mascot, p.owned_pets,
            p.active_pet_by_element, p.pet_stats, p.adventure_progress
       from wizbits.users u
       join wizbits.profiles p on p.user_id = u.id
      where u.id = $1`,
    [userId],
  );
  return result.rows[0] || null;
}

app.post("/api/register", async (req, res, next) => {
  try {
    const username = String(req.body.username || "").trim();
    const password = String(req.body.password || "");

    if (username.length < 3 || password.length < 8) {
      res.status(400).json({ error: "invalid_username_or_password" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const code = await createUniqueFriendCode();
    const avatar = randomAvatar();

    const created = await query(
      `insert into wizbits.users (username, password_hash, friend_code, avatar)
       values ($1, $2, $3, $4)
       returning id`,
      [username, passwordHash, code, avatar],
    );

    await query("insert into wizbits.profiles (user_id) values ($1)", [created.rows[0].id]);
    req.session.userId = created.rows[0].id;

    res.status(201).json({ user: await currentUser(req.session.userId) });
  } catch (error) {
    if (error.code === "23505") {
      res.status(409).json({ error: "username_taken" });
      return;
    }
    next(error);
  }
});

app.post("/api/login", async (req, res, next) => {
  try {
    const username = String(req.body.username || "").trim();
    const password = String(req.body.password || "");
    const result = await query("select id, password_hash from wizbits.users where username = $1", [
      username,
    ]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      res.status(401).json({ error: "invalid_login" });
      return;
    }

    req.session.userId = user.id;
    res.json({ user: await currentUser(user.id) });
  } catch (error) {
    next(error);
  }
});

app.post("/api/logout", (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      next(error);
      return;
    }
    res.json({ ok: true });
  });
});

app.get("/api/me", requireLogin, async (req, res, next) => {
  try {
    res.json({ user: await currentUser(req.session.userId) });
  } catch (error) {
    next(error);
  }
});

app.get("/api/profile", requireLogin, async (req, res, next) => {
  try {
    res.json({ profile: await currentUser(req.session.userId) });
  } catch (error) {
    next(error);
  }
});

app.put("/api/profile", requireLogin, async (req, res, next) => {
  try {
    const profile = req.body.profile || {};
    await query(
      `update wizbits.profiles
          set xp = coalesce($2, xp),
              wiz_bucks = coalesce($3, wiz_bucks),
              battle_points = coalesce($4, battle_points),
              pet_seeds = coalesce($5, pet_seeds),
              hearts = coalesce($6, hearts),
              owned_mascots = coalesce($7::jsonb, owned_mascots),
              equipped_mascot = coalesce($8, equipped_mascot),
              owned_pets = coalesce($9::jsonb, owned_pets),
              active_pet_by_element = coalesce($10::jsonb, active_pet_by_element),
              pet_stats = coalesce($11::jsonb, pet_stats),
              adventure_progress = coalesce($12::jsonb, adventure_progress),
              updated_at = now()
        where user_id = $1`,
      [
        req.session.userId,
        profile.xp,
        profile.wiz_bucks,
        profile.battle_points,
        profile.pet_seeds,
        profile.hearts,
        profile.owned_mascots ? JSON.stringify(profile.owned_mascots) : null,
        profile.equipped_mascot,
        profile.owned_pets ? JSON.stringify(profile.owned_pets) : null,
        profile.active_pet_by_element ? JSON.stringify(profile.active_pet_by_element) : null,
        profile.pet_stats ? JSON.stringify(profile.pet_stats) : null,
        profile.adventure_progress ? JSON.stringify(profile.adventure_progress) : null,
      ],
    );
    res.json({ profile: await currentUser(req.session.userId) });
  } catch (error) {
    next(error);
  }
});

app.post("/api/friends/add-code", requireLogin, async (req, res, next) => {
  try {
    const code = String(req.body.code || "").trim().toUpperCase();
    const friend = await query("select id from wizbits.users where friend_code = $1", [code]);
    const friendId = friend.rows[0]?.id;

    if (!friendId || friendId === req.session.userId) {
      res.status(404).json({ error: "friend_not_found" });
      return;
    }

    await query(
      `insert into wizbits.friendships (user_id, friend_user_id)
       values ($1, $2), ($2, $1)
       on conflict (user_id, friend_user_id) do nothing`,
      [req.session.userId, friendId],
    );

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.get("/api/friends", requireLogin, async (req, res, next) => {
  try {
    const friends = await query(
      `select u.id, u.username, u.friend_code, u.avatar
         from wizbits.friendships f
         join wizbits.users u on u.id = f.friend_user_id
        where f.user_id = $1
        order by u.username`,
      [req.session.userId],
    );
    res.json({ friends: friends.rows });
  } catch (error) {
    next(error);
  }
});

app.post("/api/battles/request", requireLogin, async (req, res, next) => {
  try {
    const toUserId = req.body.toUserId;
    const created = await query(
      `insert into wizbits.battle_requests (from_user_id, to_user_id)
       values ($1, $2)
       returning *`,
      [req.session.userId, toUserId],
    );
    res.status(201).json({ battleRequest: created.rows[0] });
  } catch (error) {
    next(error);
  }
});

app.post("/api/battles/accept", requireLogin, async (req, res, next) => {
  try {
    const id = req.body.id;
    const accepted = await query(
      `update wizbits.battle_requests
          set status = 'accepted'
        where id = $1 and to_user_id = $2
        returning *`,
      [id, req.session.userId],
    );
    res.json({ battleRequest: accepted.rows[0] || null });
  } catch (error) {
    next(error);
  }
});

app.use(express.static(projectRoot));

app.use((error, req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: "server_error" });
});

const server = app.listen(port, host, () => {
  console.log(`WizBits server listening on http://${host}:${port}`);
});

const wss = new WebSocketServer({ server, path: "/ws" });
const sockets = new Map();

wss.on("connection", (socket) => {
  const id = randomUUID();
  sockets.set(id, socket);

  socket.on("message", (raw) => {
    let message;
    try {
      message = JSON.parse(raw.toString());
    } catch {
      return;
    }

    if (message.type === "ping") {
      socket.send(JSON.stringify({ type: "pong" }));
    }
  });

  socket.on("close", () => {
    sockets.delete(id);
  });
});
