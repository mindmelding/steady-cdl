import json,re,collections,csv
r=json.load(open('reviews_raw.json'))
T={
# hates
'H_paywall_price':r"pay ?wall|paywall|too expensive|expensive|pricey|overpriced|\$\s?\d|per month|a month|costs?|charge.*to use|not free|isn.t free|wants? (me to )?pay|have to pay|force[sd]? (you )?to pay|money|greed",
'H_cant_cancel_billing':r"cancel|unsubscri|still charg|keeps? charg|charged me|charging|refund|auto.?renew|unauthori[sz]ed|took money|stole",
'H_free_trial_bait':r"free trial|trial|bait|appeared to be free|supposed to be free|said free|free test.*pay|scam",
'H_ads':r"\bads?\b|advert|commercial|pop ?ups?|temu",
'H_ads_block_results':r"(ad|ads|commercial).{0,80}(can.?t|won.?t|couldn.?t|unable).{0,30}(close|review|see|skip)|lose (my )?progress",
'H_wrong_answers':r"wrong answer|incorrect|inaccura|typo|mistake|errors?\b|not correct|dead wrong|contradict|answer key",
'H_not_on_real_test':r"not on the (actual |real )?test|weren.?t (on|in)|not (in|on) (the )?(app|exam|test)|didn.?t see|never saw|not one question|none of the questions|different (questions|on the actual)|not the same question|outdated|not updated|update (the|your) questions|irrelevant|not (based on|in) the (cdl )?manual|no coinciden",
'H_repetitive':r"repeat|repetitive|same question|same two|multiple times|over and over",
'H_state_gap':r"\bstate\b|texas|illinois|california|virginia|\bva\b|new york|\bny\b|florida|washington|wisconsin|kansas|iowa|district of columbia|south carolina|pennsylvania|\bpa\b|new jersey|\bnj\b|connecticut|\bct\b|indiana",
'H_endorsement_gap':r"hazmat|haz ?mat|hamzat|tanker|passenger|school bus|doubles|triples|air ?br[ae]ak|combination|metal coil|endorse",
'H_bugs_crash':r"crash|won.?t (open|load)|doesn.?t load|not load|freez|glitch|bug|stuck|force close|blank|reset|progress (is )?gone|lost (my )?progress",
'H_restore_lifetime':r"lifetime|restore|lost (my )?subscription|says i (have no|don.?t have)|still locked",
'H_review_nag':r"rate (the|your) app|review every|5.star.{0,30}(ads|remove)|five.star.{0,30}(ads|remove)|asking me to rate|harass",
'H_no_study_material':r"no (actual )?(lessons|manual|videos|study material)|doesn.?t (really )?have study|no explanation|doesn.?t tell why|explanation",
'H_confusing_wording':r"confus|poorly worded|wording|grammar|vague|trick|translated|google translate|ai art|\bai\b",
'H_spanish_language':r"spanish|español|espanol|idioma|traduc|english",
'H_pretrip_skills':r"pre.?trip|pretrip|inspection|skills test|road test|backing",
'H_eldt_certificate':r"eldt|certificate|theory|entry.level",
'H_audio':r"audio|listen|read (it )?(out )?loud|voice|headphone|hands.free",
# loves
'L_matches_real_test':r"word for word|exact|identical|same (questions|as)|on the (actual|real) test|almost (verbatim|identical|exact)|verbatim|spot on|accurate|matched|just like",
'L_passed':r"pass(ed)?\b",
'L_first_try':r"first (try|time|attempt)|1st try",
'L_fast':r"\d+ (days?|hours?|weeks?)|in a (day|week)|over the weekend|24 hours",
'L_free':r"\bfree\b",
'L_explanations':r"explain|explanation|why|chapter|section",
'L_easy':r"easy|simple|straight ?forward|user friendly|convenient",
'L_endorsements':r"hazmat|tanker|passenger|school bus|doubles|triples|air ?br[ae]ak|combination|endorse",
'L_flashcards_modes':r"flash ?card|exam mode|quiz|missed questions|review",
'L_worth_paying':r"worth (it|every|the money)|well worth|would pay|gladly pay|paid app",
}
rx={k:re.compile(v,re.I) for k,v in T.items()}
def txt(x): return (x['title']+' '+x['text'])
for x in r: x['themes']=[k for k,v in rx.items() if v.search(txt(x))]
recent=[x for x in r if x['date']>='2025-01-01']
low=[x for x in recent if x['stars']<=3]; high=[x for x in recent if x['stars']>=4]
out={'n_total':len(r),'n_recent':len(recent),'n_recent_low':len(low),'n_recent_high':len(high)}
def cnt(S,prefix): 
  c=collections.Counter(t for x in S for t in x['themes'] if t.startswith(prefix)); return c
cl=cnt(low,'H_'); ch=cnt(high,'L_')
out['hate_low_recent']={k:(v,round(100*v/len(low),1)) for k,v in cl.most_common()}
out['love_high_recent']={k:(v,round(100*v/len(high),1)) for k,v in ch.most_common()}
# per app low-star theme
pa={}
for a in sorted({x['app'] for x in r}):
  L=[x for x in low if x['app']==a]; H=[x for x in high if x['app']==a]
  c=cnt(L,'H_'); pa[a]={'recent_low':len(L),'recent_high':len(H),'top':c.most_common(5)}
out['per_app']=pa
# all-time star share
out['star_all']=dict(collections.Counter(x['stars'] for x in r))
json.dump(out,open('theme_counts.json','w'),indent=1)
json.dump(r,open('reviews_coded.json','w'),indent=0)
with open('reviews_coded.csv','w',newline='') as f:
  w=csv.writer(f); w.writerow(['app','store','date','stars','version','title','text','themes'])
  for x in r: w.writerow([x['app'],x['store'],x['date'],x['stars'],x['version'],x['title'],x['text'],';'.join(x['themes'])])
print(json.dumps(out,indent=1))
