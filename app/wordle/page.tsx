"use client";
import { useState, useEffect, useCallback } from "react";

const WORDS = ["about","above","abuse","actor","acute","admit","adopt","adult","after","again","agent","agree","ahead","alarm","album","alert","alien","align","alike","alive","allay","allow","alone","along","alter","amaze","among","ample","angel","anger","angle","angry","anime","apart","apple","apply","arena","argue","arise","armor","array","aside","asset","audio","audit","avoid","awake","award","aware","badge","basic","basin","basis","batch","beach","beard","beast","begin","being","below","bench","berry","birth","black","blade","blame","blank","blast","blaze","bleed","blend","bless","blind","block","blood","bloom","blown","board","bonus","booth","bound","brain","brand","brave","bread","break","breed","brick","bride","brief","bring","broad","broke","brown","brush","buddy","build","bunch","burst","buyer","cabin","candy","carry","catch","cause","chain","chair","chaos","charm","chart","chase","cheap","check","cheek","cheer","chess","chest","chief","child","china","chunk","civic","civil","claim","clash","class","clean","clear","clerk","climb","cling","clock","clone","close","cloth","cloud","coach","coast","color","comic","coral","count","court","cover","crack","craft","crane","crash","crazy","cream","creek","crime","cross","crowd","crown","cruel","crush","curve","cycle","daily","dance","death","debut","delay","delta","dense","depot","depth","derby","devil","dirty","disco","donor","doubt","dough","draft","drain","drama","drank","drawn","dream","dress","dried","drift","drink","drive","droit","drone","drove","drunk","dryer","dying","eager","early","earth","eight","elect","elite","embed","ember","empty","endow","enemy","enjoy","enter","entry","equal","equip","error","essay","ethic","event","every","exact","exert","exile","exist","extra","faith","false","fancy","fatal","fault","feast","fiber","field","fifth","fifty","fight","final","first","fixed","flame","flash","fleet","flesh","flick","float","flood","floor","flour","fluid","flush","focal","focus","force","forge","forth","forum","found","frame","frank","fraud","fresh","front","frost","fruit","fully","funny","gamma","genre","ghost","giant","given","glass","globe","gloom","glory","glove","going","grace","grade","grain","grand","grant","grape","graph","grasp","grass","grave","great","green","greet","grief","gross","group","grove","grown","guard","guess","guest","guide","guild","guilt","given","habit","happy","harsh","heart","heavy","hence","hobby","honey","honor","horse","hotel","house","human","humor","hurry","hyper","ideal","image","imply","index","indie","infer","inner","input","inter","irony","issue","ivory","jewel","joint","judge","juice","knack","kneel","knife","knock","known","label","labor","lance","large","laser","later","laugh","layer","learn","lease","leave","legal","lemon","level","light","limit","linen","liver","lobby","local","logic","loose","lover","lower","loyal","lucky","lunar","lunch","lyric","magic","major","maker","manga","manor","maple","march","marry","match","maybe","mayor","media","mercy","merge","merit","metal","meter","midst","might","minor","minus","mixed","model","money","month","moral","mount","mouse","mouth","movie","muddy","music","naked","nerve","never","night","noble","noise","north","noted","novel","nurse","nylon","ocean","offer","often","olive","onset","opera","orbit","order","organ","other","outer","onset","owner","oxide","ozone","paint","panel","panic","paper","party","pasta","patch","pause","peace","peach","pearl","pedal","penny","phase","phone","photo","piano","piece","pilot","pitch","pixel","pizza","place","plain","plane","plant","plate","plaza","plead","pluck","plumb","plume","plump","plunge","point","polar","porch","posed","pound","power","press","price","pride","prime","print","prior","probe","prone","proof","prose","proud","prove","proxy","punch","pupil","purse","queen","quest","quick","quiet","quota","quote","radar","radio","rally","ranch","range","rapid","ratio","reach","ready","realm","rebel","refer","reign","relax","reply","rider","ridge","rifle","right","rigid","risky","rival","river","robot","rocky","roman","roomy","rough","round","route","royal","rugby","ruled","ruler","rural","sadly","saint","salad","sauce","scale","scene","scent","scope","score","scout","screw","sense","serve","setup","seven","shade","shake","shall","shame","shape","share","shark","sharp","shave","sheep","sheer","sheet","shelf","shell","shift","shine","shirt","shock","shoot","shore","short","shout","sight","sigma","since","sixth","sixty","sized","skill","skull","slate","slave","sleep","slice","slide","slope","smart","smell","smile","smoke","snack","snake","solar","solid","solve","sorry","sound","south","space","spare","spark","speak","speed","spend","spice","spine","spite","split","spoke","spoon","sport","spray","squad","stack","staff","stage","stain","stake","stalk","stall","stamp","stand","stark","start","state","stave","steal","steam","steel","steep","steer","stern","stick","stiff","still","stock","stone","stood","store","storm","story","stove","strap","straw","strip","stuck","study","stuff","style","sugar","suite","sunny","super","surge","swamp","swear","sweep","sweet","swift","swing","sword","syrup","table","taste","teach","teeth","thank","theme","there","thick","thing","think","third","those","three","threw","throw","thumb","tidal","tiger","tight","timer","tired","title","today","token","total","touch","tough","towel","tower","toxic","trace","track","trade","trail","train","trait","trash","treat","trend","trial","tribe","trick","troop","truck","truly","trump","trunk","trust","truth","tumor","twice","twist","ultra","uncle","under","union","unite","unity","until","upper","upset","urban","usage","usual","utter","valid","value","valve","venue","verse","video","vigor","vinyl","viral","virus","visit","vista","vital","vivid","vocal","vodka","voice","voter","waist","waste","watch","water","weary","weave","weigh","weird","wheat","wheel","where","which","while","white","whole","whose","wider","witch","woman","world","worry","worse","worst","worth","would","wound","wrath","write","wrong","wrote","yacht","yield","young","youth","zebra"];

const VALID = new Set(WORDS);

type LetterState = "correct" | "present" | "absent" | "empty";

export default function Wordle() {
  const [target, setTarget] = useState(() => WORDS[Math.floor(Math.random() * WORDS.length)]);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [shake, setShake] = useState(false);
  const [stats, setStats] = useState({ played: 0, won: 0, streak: 0, maxStreak: 0 });

  useEffect(() => {
    const s = localStorage.getItem("wordle-stats");
    if (s) setStats(JSON.parse(s));
  }, []);

  const saveStats = (w: boolean) => {
    const s = { ...stats, played: stats.played + 1, won: w ? stats.won + 1 : stats.won, streak: w ? stats.streak + 1 : 0, maxStreak: w ? Math.max(stats.maxStreak, stats.streak + 1) : stats.maxStreak };
    setStats(s);
    localStorage.setItem("wordle-stats", JSON.stringify(s));
  };

  const getStates = (guess: string): LetterState[] => {
    const states: LetterState[] = Array(5).fill("absent");
    const targetArr = target.split("");
    const remaining = [...targetArr];
    for (let i = 0; i < 5; i++) {
      if (guess[i] === target[i]) { states[i] = "correct"; remaining[i] = ""; }
    }
    for (let i = 0; i < 5; i++) {
      if (states[i] === "correct") continue;
      const idx = remaining.indexOf(guess[i]);
      if (idx !== -1) { states[i] = "present"; remaining[idx] = ""; }
    }
    return states;
  };

  const keyStates = useCallback(() => {
    const m: Record<string, LetterState> = {};
    guesses.forEach(g => {
      const states = getStates(g);
      g.split("").forEach((l, i) => {
        if (states[i] === "correct") m[l] = "correct";
        else if (states[i] === "present" && m[l] !== "correct") m[l] = "present";
        else if (!m[l]) m[l] = "absent";
      });
    });
    return m;
  }, [guesses, target]);

  const submit = () => {
    if (current.length !== 5) return;
    if (!VALID.has(current)) { setShake(true); setTimeout(() => setShake(false), 500); return; }
    const newGuesses = [...guesses, current];
    setGuesses(newGuesses);
    setCurrent("");
    if (current === target) { setWon(true); setGameOver(true); saveStats(true); }
    else if (newGuesses.length >= 6) { setGameOver(true); saveStats(false); }
  };

  const handleKey = useCallback((key: string) => {
    if (gameOver) return;
    if (key === "Enter") submit();
    else if (key === "Backspace") setCurrent(p => p.slice(0, -1));
    else if (/^[a-z]$/.test(key) && current.length < 5) setCurrent(p => p + key);
  }, [current, gameOver, guesses, target]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => handleKey(e.key.toLowerCase() === "enter" ? "Enter" : e.key.toLowerCase() === "backspace" ? "Backspace" : e.key.toLowerCase());
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleKey]);

  const newGame = () => {
    setTarget(WORDS[Math.floor(Math.random() * WORDS.length)]);
    setGuesses([]); setCurrent(""); setGameOver(false); setWon(false);
  };

  const shareResults = () => {
    const lines = guesses.map(g => getStates(g).map(s => s === "correct" ? "🟩" : s === "present" ? "🟨" : "⬛").join(""));
    navigator.clipboard.writeText(`Wordle ${guesses.length}/6\n${lines.join("\n")}\ndevtools-site-delta.vercel.app/wordle`);
  };

  const stateColor = (s: LetterState) => s === "correct" ? "bg-emerald-600" : s === "present" ? "bg-yellow-600" : s === "absent" ? "bg-gray-700" : "bg-[var(--bg-secondary)] border-2 border-[var(--border)]";
  const KEYS = [["q","w","e","r","t","y","u","i","o","p"], ["a","s","d","f","g","h","j","k","l"], ["Enter","z","x","c","v","b","n","m","Backspace"]];
  const ks = keyStates();

  return (
    <div className="space-y-4">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-1">Wordle</h1>
        <p className="text-sm text-[var(--text-secondary)]">Guess the 5-letter word in 6 tries</p>
      </section>

      <div className="flex justify-center gap-4 text-xs text-[var(--text-secondary)]">
        <span>Played: {stats.played}</span>
        <span>Win%: {stats.played > 0 ? Math.round(stats.won / stats.played * 100) : 0}</span>
        <span>Streak: {stats.streak}</span>
        <span>Max: {stats.maxStreak}</span>
      </div>

      <div className="flex flex-col items-center gap-1">
        {Array.from({ length: 6 }, (_, row) => {
          const guess = guesses[row];
          const isCurrent = row === guesses.length && !gameOver;
          const letters = guess ? guess.split("") : isCurrent ? current.padEnd(5).split("") : Array(5).fill("");
          const states = guess ? getStates(guess) : Array(5).fill("empty");
          return (
            <div key={row} className={`flex gap-1 ${isCurrent && shake ? "animate-pulse" : ""}`}>
              {letters.map((l, i) => (
                <div key={i} className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center text-xl font-bold uppercase rounded ${stateColor(states[i] as LetterState)} transition-all`}>
                  {l.trim()}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {gameOver && (
        <div className="text-center">
          <p className={`text-lg font-bold ${won ? "text-emerald-400" : "text-red-400"}`}>
            {won ? `Solved in ${guesses.length}/6!` : `The word was: ${target.toUpperCase()}`}
          </p>
          <div className="flex gap-2 justify-center mt-2">
            <button onClick={newGame} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold">New Game</button>
            {won && <button onClick={shareResults} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-bold">Share</button>}
          </div>
        </div>
      )}

      <div className="flex flex-col items-center gap-1">
        {KEYS.map((row, ri) => (
          <div key={ri} className="flex gap-1">
            {row.map(k => (
              <button key={k} onClick={() => handleKey(k)}
                className={`${k.length > 1 ? "px-2 text-xs" : "w-8 md:w-9"} h-10 md:h-12 rounded font-bold uppercase flex items-center justify-center
                  ${ks[k] === "correct" ? "bg-emerald-600 text-white" : ks[k] === "present" ? "bg-yellow-600 text-white" : ks[k] === "absent" ? "bg-gray-800 text-gray-400" : "bg-[var(--bg-secondary)] border border-[var(--border)] hover:bg-[var(--bg-primary)]"}`}>
                {k === "Backspace" ? "⌫" : k}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
