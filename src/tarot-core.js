export const MAJORS = [
["The Fool",["new journey","innocence","spontaneity"],["recklessness","naïveté","hesitation"]],
["The Magician",["willpower","manifestation","skill"],["manipulation","trickery","unused power"]],
["The High Priestess",["intuition","mystery","inner voice"],["secrets","disconnect","hidden motives"]],
["The Empress",["nurture","abundance","creativity"],["smothering","block","overdependence"]],
["The Emperor",["structure","authority","stability"],["rigidity","control","domineering"]],
["The Hierophant",["tradition","ethics","study"],["rebellion","unorthodox","question dogma"]],
["The Lovers",["union","values","choice"],["misalignment","temptation","disharmony"]],
["The Chariot",["drive","focus","victory"],["scattered","aggression","stall"]],
["Strength",["courage","compassion","self-mastery"],["doubt","impatience","force"]],
["The Hermit",["solitude","wisdom","guidance"],["isolation","withdrawal","loneliness"]],
["Wheel of Fortune",["cycles","fate","turning point"],["resistance","bad turn","clinging"]],
["Justice",["truth","cause & effect","fairness"],["injustice","bias","avoidance"]],
["The Hanged Man",["surrender","new view","pause"],["martyrdom","stalling","indecision"]],
["Death",["ending","transformation","rebirth"],["stagnation","fear","dragging out"]],
["Temperance",["moderation","alchemy","balance"],["excess","imbalance","overcorrect"]],
["The Devil",["bondage","material","shadow"],["release","awareness","detachment"]],
["The Tower",["upheaval","revelation","collapse"],["aftermath","resistance","aftershocks"]],
["The Star",["hope","healing","guidance"],["discouragement","doubt","dim vision"]],
["The Moon",["uncertainty","dreams","intuition"],["clarity","truth out","grounding"]],
["The Sun",["joy","vitality","success"],["overexposure","ego","temporary cloud"]],
["Judgement",["awakening","reckoning","absolution"],["self-criticism","avoid call","stasis"]],
["The World",["completion","integration","wholeness"],["incomplete","delay","loose ends"]]
];
export const SUITS = [
["Wands",["spark","will","inspiration"],["burnout","impulse","misdirection"]],
["Cups",["emotion","relationships","flow"],["block","co‑dependence","mood"]],
["Swords",["mind","truth","communication"],["anxiety","conflict","overthink"]],
["Pentacles",["material","work","body"],["instability","attachment","delay"]]
];
export const RANKS = [
["Ace",["seed","new start","potential"],["false start","hesitation","misfire"]],
["Two",["duality","choice","balance"],["imbalance","stalemate","indecision"]],
["Three",["growth","collab","expression"],["misalign","delay","third‑party"]],
["Four",["stability","rest","foundation"],["stagnation","apathy","rigidity"]],
["Five",["challenge","loss","conflict"],["recovery","lesson","adapt"]],
["Six",["support","memories","harmony"],["stuck past","strings","uneven"]],
["Seven",["assessment","strategy","vision"],["impatient","shortcuts","escapism"]],
["Eight",["mastery","movement","dedication"],["restless","distraction","drift"]],
["Nine",["fruition","resilience","near end"],["fatigue","paranoia","overburden"]],
["Ten",["culmination","legacy","transition"],["overload","spilling","ending"]],
["Page",["curiosity","news","messenger"],["immature","mixed signals","scattered"]],
["Knight",["pursuit","momentum","quest"],["reckless","inconsistent","stall"]],
["Queen",["nurture","command","intuition"],["smother","mood‑driven","overcontrol"]],
["King",["authority","vision","lead"],["rigid","domineer","detached"]]
];

export function buildDeck(){
const deck=[];
MAJORS.forEach(([name,up,rev],i)=>deck.push({id:i,arcana:"Major",name,upright:up,reversed:rev}));
let id=22;
for (const [suit,suUp,suRev] of SUITS){
for (const [rank,rUp,rRev] of RANKS){
const name=`${rank} of ${suit}`;
deck.push({ id:id++, arcana:"Minor", name, suit, rank, upright:[...rUp,...suUp], reversed:[...rRev,...suRev] });
}
}
return deck;
}

export function rng(seed){
if (!seed) return Math.random;
let h = 2166136261 ^ seed.length;
for (let i=0;i<seed.length;i++){ h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); }
let s = (h>>>0) || 0x9e3779b9;
return ()=>{ s^=s<<13; s>>>=0; s^=s>>>17; s>>>=0; s^=s<<5; s>>>=0; return (s>>>0)/0xFFFFFFFF; };
}

export function shuffle(arr, rnd){ const a=arr.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(rnd()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a; }

export const CELTIC_POSITIONS = [
["1. Heart of the Matter","present core energy"],
["2. Crossing / Challenge","obstacle or friction"],
["3. Below / Unconscious","root / underlying drive"],
["4. Past / Behind","recent influence fading"],
["5. Above / Conscious","aim / best you can do"],
["6. Before / Near Future","what’s emerging soon"],
["7. Self","you / attitude / stance"],
["8. Environment","others / context / field"],
["9. Hopes & Fears","projections / anxieties"],
["10. Outcome (trajectory)","if nothing changes"]
];

export function drawCelticCross({seed=null, allowReversals=true}={}){
const rnd = rng(seed);
const deck = shuffle(buildDeck(), rnd);
const drawn = deck.slice(0,10).map(c=>{
const reversed = allowReversals ? (rnd()<0.5) : false;
return { id:c.id, name:c.name, arcana:c.arcana, suit:c.suit||null, rank:c.rank||null, reversed, keywords:(reversed?c.reversed:c.upright).slice(0,5) };
});
return { seed: seed || "crypto-random", allowReversals, timestamp: new Date().toISOString(), positions: CELTIC_POSITIONS.map((p,i)=>({ position:p[0], meaning:p[1], card: drawn[i] })) };
}

export function analyze(spread){
const cards = spread.positions.map(p=>p.card);
const counts = { majors:0, minors:0, reversals:0, suits:{Wands:0,Cups:0,Swords:0,Pentacles:0} };
for (const c of cards){
if (c.arcana==="Major") counts.majors++; else counts.minors++;
if (c.reversed) counts.reversals++;
if (c.suit) counts.suits[c.suit]++;
}
const domSuitEntry = Object.entries(counts.suits).sort((a,b)=>b[1]-a[1])[0];
const themes = [];
if (counts.majors >= 4) themes.push("major arcana heavy → fate/turning points");
else if (counts.majors >= 2) themes.push("archetypal current with personal agency required");
if (domSuitEntry && domSuitEntry[1] >= 3) {
const map = { Wands:"creative drive / will / momentum", Cups:"emotional processing / bonds / healing", Swords:"mental clarity vs anxiety / communication", Pentacles:"material stability / body / work cadence" };
themes.push(`dominant suit: ${domSuitEntry[0]} → ${map[domSuitEntry[0]]}`);
}
if (counts.reversals >= 5) themes.push("many reversals → inner blocks / course correction");
else if (counts.reversals >= 3) themes.push("mixed winds → adjust stance, pace, expectations");
const tip = c => `${c.name}${c.reversed?" (rev)":""}: ${c.keywords.slice(0,3).join(", ")}`;
const advice = [ tip(spread.positions[0].card), tip(spread.positions[1].card), tip(spread.positions[5].card), tip(spread.positions[9].card) ];
const suit = domSuitEntry ? domSuitEntry[0] : "Wands";
const haikuBySuit = { Wands: ["Spark writes in dry wood—","footsteps drum on ember paths,","new suns learn your name."], Cups: ["Moon in a deep cup—","tides rinse the old ache clean,","pearls remember light."], Swords:["Dawn sharp as a thought—","truth parts the fog without blood,","breath returns to wings."], Pentacles:["Roots hum under stone—","patience teaches green to rise,","harvest meets your hands."] };
return { counts, domSuit: domSuitEntry ? { suit, count: domSuitEntry[1] } : null, themes, advice, haiku: haikuBySuit[suit] };
}

export function toChat(spread, analysis){
const lines=[];
lines.push(`🃏 Celtic Cross — Seed: ${spread.seed} | Reversals: ${spread.allowReversals ? "on" : "off"} | ${new Date(spread.timestamp).toLocaleString()}`);
lines.push("");
for (const slot of spread.positions){
const rev = slot.card.reversed ? " (reversed)" : "";
lines.push(`${slot.position} — ${slot.meaning}`);
lines.push(`  ${slot.card.name}${rev}`);
lines.push(`  keywords: ${slot.card.keywords.join(", ")}`);
lines.push("");
}
lines.push("— Energy Reading —");
const { counts, domSuit, themes, advice, haiku } = analysis;
lines.push(`Majors: ${counts.majors} | Minors: ${counts.minors} | Reversals: ${counts.reversals}`);
if (domSuit) lines.push(`Dominant suit: ${domSuit.suit} (${domSuit.count})`);
if (themes.length) lines.push(`Themes: ${themes.join(" • ")}`);
lines.push("Advice:");
for (const a of advice) lines.push(`  • ${a}`);
lines.push("");
lines.push("Haiku:");
lines.push(`  ${haiku[0]}`);
lines.push(`  ${haiku[1]}`);
lines.push(`  ${haiku[2]}`);
return lines.join("\n");
}
