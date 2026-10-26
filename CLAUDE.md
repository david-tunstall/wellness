# Fettle: Project Brief

**App name: Fettle** (as in "in fine fettle", meaning in good shape). Use this name for the app title, PWA manifest (name and short_name), home screen icon label, page titles and README. Suggested repo and Netlify site name: `fettle`.

Personal fitness and food tracking app for Dave. One user (me), UK based, used mainly on my phone.
Repo lives under my personal GitHub account (david-tunstall), not a business organisation.

## Philosophy (read this first)
- This is a light touch helper, not something to live by. Food tracking is a rough guide only.
- No streaks, guilt, nagging notifications, red warnings or "you went over" messages.
- Quick to use: logging a meal or starting a workout should take seconds.
- Plain, friendly UK English. Units: kg, kcal, grams.

## Tech approach
- Progressive Web App (installable to the phone home screen, works offline for workouts).
- Hosted free on Netlify (I already use Netlify for my studio website).
- Frontend: React + Vite + TypeScript, Tailwind for styling. Mobile first, dark mode supported.
- Data stored on the device (IndexedDB via Dexie) for phase 1. Add an export/import backup (JSON) so nothing is lost if I change phone. Cloud sync can come later if I want it.
- Any API keys live in Netlify environment variables and are only used from Netlify Functions, never shipped to the browser.

## Feature 1: Workouts

Two big buttons on the home screen: **Gym** and **Home**. I pick one each time I train.

### Gym mode
- Pick a focus (Upper, Lower, Push, Pull, Full body) or let the app choose based on what I did last time so muscle groups rotate.
- Generates 5 to 7 exercises with sets, reps and rest times, using standard gym kit (barbell, dumbbells, cable machine, common machines).
- Swap button on any exercise to get an alternative for the same muscle (for when a machine is taken).
- Log the weight and reps I actually did. Next time, suggest a small increase if I hit all my reps.

### Home mode (no equipment)
- The button is labelled simply **Home**. I'll also use it when staying in hotels, so the workouts must suit a hotel room too.
- Must fit a small space (roughly a towel's length) and stay quiet enough for a hotel room or neighbours below. Anything needing furniture uses a chair or bed edge as the alternative to a sofa.
- Low impact and quiet. **No jumping**: no burpees, jump squats, jumping jacks, tuck jumps etc.
- Built around things like: press ups (and easier/harder variations: incline on a sofa, knee, wide, diamond, decline), planks and side planks, squats, split squats, lunges, glute bridges, wall sits, chair dips, superman holds, dead bugs, bird dogs, calf raises, mountain climbers done slowly.
- Choose a length: 15, 25 or 40 minutes. App builds a circuit to fit.
- Timer screen for timed holds (planks, wall sits) and rest periods, with a simple beep or vibration.

### Shared
- Exercise library with a short plain description of how to do each move and the muscles it works.
- Difficulty adjusts gently over time based on what I log (e.g. plank time goes up, press up variation gets harder).
- Workout history: simple list and a calendar view showing which days I trained.
- Optional short warm up before each session.

## Feature 2: Food tracking (rough guide only)

Three ways to add food:

1. **Barcode scan**: use the phone camera (html5-qrcode or ZXing, must work in iPhone Safari and Android Chrome). Look the product up on the Open Food Facts API (free, no key, good UK coverage). Show name, calories, protein, carbs, fat per portion; let me adjust the portion. If not found, fall back to manual entry and remember it for next time.
2. **Photo estimate**: take a photo of a plate of food, send it to a Netlify Function that calls the Claude API (vision) to estimate what the food is and the approximate calories, protein, carbs and fat. Always show the result as an estimate I can edit before saving.
3. **Quick add / favourites**: search my recent and saved foods, or just type a name and a rough calorie number.

Daily view: simple totals for the day (calories and protein mainly), grouped loosely by meal. A weekly average is more useful than any single day.
Optional daily target that I can set myself or leave blank. If blank, just show totals with no judgement.

## Feature 3: Simple progress
- Optional weigh-in log (kg) with a basic line chart. Weekly average, not daily noise.
- Workouts per week chart.
- Personal bests (most press ups in a set, longest plank, heaviest lift per exercise).
- Private progress photos, stored on the device only, never uploaded.

## Feature 4: iPhone Health data (steps etc.)
A web app cannot read Apple Health directly, so use an iOS Shortcut as a bridge:
- A Netlify Function endpoint (`/api/health-sync`) accepts a POST with JSON: date, steps, walking distance (km), active calories, resting heart rate, sleep hours, and body weight if recorded.
- Protect it with a long secret token sent in a request header (stored as Netlify env var `HEALTH_SYNC_TOKEN`). Reject anything without it.
- Store the readings in Netlify Blobs (one record per day, upserted so re-sends don't duplicate).
- The app fetches these readings on open and shows them on the home screen and progress charts (steps per day, weekly average).
- If a weight reading comes from Health, use it for the weigh-in chart instead of manual entry.
- Write step by step instructions (in the app's Settings screen and in README.md) for building the iPhone Shortcut: Find Health Samples for each metric for today, build the JSON, Get Contents of URL (POST with the token header), then set a Personal Automation to run it daily at about 9pm without asking.
- Include a "Sync now" option: the same Shortcut can be run by hand.

## Feature 5: Making it easy to stick with
- **Mobility sessions**: 10 minute stretch and mobility routines for hips, lower back and shoulders. Good for rest days and after physical work days (I'm an electrician, lots of lofts, kneeling and overhead work).
- **Niggles and injuries**: in Settings I can flag areas (knees, lower back, shoulders, wrists). The generators then avoid or swap exercises that load those areas.
- **Gym session length**: choose 30, 45 or 60 minutes, and the gym workout is sized to fit.
- **Form tips**: two or three short cues per exercise.
- **Easy weeks**: after about 4 to 6 weeks of steady progress, suggest a lighter week.
- **Weekly plan**: pick the days I'm aiming to train; the home screen suggests gym or home for today.
- **Daily check-in**: one tap for energy (good, okay, rubbish). On a rubbish day, offer a shorter, lighter session or mobility instead of skipping.
- **Saved meals**: log a usual breakfast or lunch in one tap.
- **Protein first**: the daily food view leads with protein, calories second.
- **Simple meal ideas**: a short list of quick, decent meals I can tap to log.

Not wanted for now: Google Calendar integration.

## Build order
1. Project setup, PWA config, Netlify deploy, local database, navigation shell.
2. Exercise library and Home workout generator with timer.
3. Gym workout generator with logging and progression.
4. Food logging: manual entry and favourites.
5. Barcode scanning with Open Food Facts.
6. Photo estimate via Netlify Function and Claude API.
7. Progress charts, personal bests, progress photos, data export/import.
8. iPhone Health sync (Netlify Function, Blobs storage, Shortcut instructions).
9. Mobility sessions, injury settings, weekly plan, daily check-in, saved meals and meal ideas.

Build one phase at a time, deploy it, and check with me before moving on.

## Things I need to provide
- Netlify account (existing) and a new site for this app.
- An Anthropic API key for the photo estimate feature (phase 6), added as a Netlify environment variable `ANTHROPIC_API_KEY`.
- A secret token for Health sync (phase 8), added as `HEALTH_SYNC_TOKEN`. Claude Code can generate one for me.
- My iPhone, to set up the Shortcut and allow it to read Health data.
