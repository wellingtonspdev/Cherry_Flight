import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRound,jumpRound,stepRound,advancePairs,LEVELS} from '../../src/game/engineV2.js';
let seed=20261027;const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/2**32);
const results=[];
for(const level of LEVELS){
 const round=createRound({width:844,height:354,levelId:level.id},random), resumeSeed=seed;
 const forecast=structuredClone(round), pairs=new Map();
 const collect=()=>{for(const p of [...forecast.pairs,...forecast.future])pairs.set(p.worldX,{...p});};collect();
 while(pairs.size<level.targetScore+8){advancePairs(forecast,0.25,random);collect();}
 const obstacles=[...pairs.values()].sort((a,b)=>a.worldX-b.worldX),dt=1/60;
 let beam=[{y:round.player.y,v:-390,parent:null,jump:false,cost:0}],final=null,frames=0;
 for(let frame=1;frame<6000;frame++){
  const distance=round.params.speed*frame*dt;
  const near=obstacles.filter(p=>p.worldX+p.width-distance>round.player.x+6&&p.worldX-distance<round.player.x+42);
  const target=obstacles.find(p=>p.worldX+p.width-distance>round.player.x+6);
  const center=target.gapY+target.gapSize/2-24;
  const states=new Map();
  for(const state of beam)for(const jump of [false,true]){
   const old=jump?-390:state.v,v=Math.min(580,old+1050*dt),y=state.y+(old+v)*dt/2;
   if(y+6<=0||y+42>=round.height||near.some(p=>y+6<p.gapY||y+42>p.gapY+p.gapSize))continue;
   const node={y,v,parent:state,jump,cost:state.cost+Math.abs(y-center)*0.04+(jump?1:0)};
   const key=`${Math.round(y)}:${Math.round(v/17.5)}`;
   if(!states.has(key)||states.get(key).cost>node.cost)states.set(key,node);
  }
  assert.ok(states.size,`No planned trajectory at Level${level.id},frame${frame}; planner bins remain a limitation.`);
  beam=[...states.values()].sort((a,b)=>a.cost-b.cost).slice(0,1600);
  if(round.player.x+6>obstacles[level.targetScore-1].worldX+obstacles[level.targetScore-1].width-distance){final=beam[0];frames=frame;break;}
 }
 assert.ok(final);const actions=[];while(final.parent){actions.push(final.jump);final=final.parent;}actions.reverse();
 seed=resumeSeed;jumpRound(round);let inputs=1;
 for(const jump of actions){if(jump){jumpRound(round);inputs++;}stepRound(round,dt,random);}
 const result={level:level.id,status:round.status,score:round.score,elapsed:round.elapsed,inputs,frames,collision:round.collision};results.push(result);console.log(JSON.stringify(result));
 assert.equal(round.status,'LEVEL_COMPLETE');assert.equal(round.score,level.targetScore);
}
fs.writeFileSync('audit-evidence/v2/campaign-planned-trajectories.json',JSON.stringify({evidence:'Actual engine replay of input-only planned paths. Deterministic sampled layouts, not all random layouts or twelve browser completions.',results},null,2));
