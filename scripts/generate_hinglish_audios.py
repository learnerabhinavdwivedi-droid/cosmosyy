import os
import sys
import json
import asyncio
import edge_tts

MISSIONS_DIR = os.path.abspath("content/missions")
HERITAGE_AUDIO_DIR = os.path.abspath("public/audio/heritage")
NARRATION_AUDIO_DIR = os.path.abspath("public/audio/narration")

HINDI_TUTOR_VOICE = "hi-IN-SwaraNeural"

HINGLISH_HERITAGE = {
    "apollo-11": {
        "descent-stage": "Namaste Commander! Dekhiye, yeh hai Apollo 11 ka historic Eagle Descent Stage. Neil Armstrong aur Buzz Aldrin ne isi rocket base ke sahare Sea of Tranquility par land kiya tha. Landing ke waqt inke paas sirf 12 seconds ka fuel bacha tha! Astronauts to wapas laut gaye, par ye golden base hamesha ke liye yahin chhod diya gaya. Iske paanv par ek stainless-steel plaque laga hai jispar likha hai: Hum manavta ke liye shanti ka sandesh lekar aaye the.",
        "flag": "Commander, saamne dekhiye — yeh hai chaand par gaada gaya pehla American flag! Neil aur Buzz ne isko 1969 me lagaya tha. Chaand par hawa to hoti nahi, isliye flag ko failaane ke liye ek horizontal rod lagayi gayi thi. Pachaas se zyada saalon ki tez solar radiation aur dhoop ne iske saare rang uda diye hain, aur ab ye poori tarah safed ho chuka hai.",
        "lrrr": "Yeh dekhiye! Yeh hai Laser Ranging Retroreflector. Isme 100 quartz prisms lage hain. Sabse hairatangez baat yeh hai ki isme koi battery ya bijli nahi lagti, phir bhi ye aaj bhi 100% active hai! Earth se scientist roz raat ispar laser beam maarte hain, aur ye us roshni ko wapas bhejta hai. Isi se hume pata chala ki chaand har saal humse 4 centimeter door ja raha hai.",
        "psep": "Yeh box chaand ka pehla seismometer tha — yaani chaand ke bhukamp ko sunne wala instrument. Buzz Aldrin ne ise lagaya tha. Isne 21 dino tak chaand ke andar hone wali halki si thartharahat aur meteorites ki takkar ko record karke Earth par data bheja.",
        "tv-camera": "Yeh wahi legendary black-and-white camera hai jisne Neil Armstrong ke pehle kadam ko duniya bhar ke 60 crore logon tak live telecast kiya tha. Internet se pehle ke zamaane ka yeh sabse bada global live event tha!",
        "mesa": "MESA ek equipment bay tha jo Lunar Module ki seedhiyon ke paas khulta tha. Isme chaand ke patthar chunne wale tools, sample bags, aur television camera pack kiya gaya tha.",
        "swc": "Yeh ek special aluminium foil sheet thi jo Suraj ki taraf rukh karke lagayi gayi thi. Isne Suraj se aane wali solar wind ke particles — jaise Helium aur Neon — ko apne andar capture kiya."
    },
    "apollo-12": {
        "descent-stage": "Apollo 12 ka Intrepid Lunar Module! Pete Conrad aur Alan Bean ne isko Ocean of Storms me bilkul target par utara tha. NASA yeh test karna chahti thi ki kya hum chaand par exact pinpoint landing kar sakte hain.",
        "surveyor-3": "Yeh hai robotic Surveyor 3 lander jo astronaut se do saal pehle 1967 me chaand par utara tha. Apollo 12 ke astronauts iske paas paidal chal kar gaye aur iska camera kaat kar wapas Earth le aaye.",
        "flag": "Apollo 12 ka flag jo Ocean of Storms ki dhool me lagaya gaya tha. Pete Conrad ise lagate waqt continuously has rahe the kyunki latch thoda phas gaya tha.",
        "alsep": "ALSEP science station me nuclear-powered battery lagi hui thi. Isne kayi saalon tak Ocean of Storms ke tapmaan aur moonquakes ka data bina ruke Earth bheja."
    },
    "apollo-14": {
        "descent-stage": "Fra Mauro ki unchi pahadiyon par utra Antares Descent Stage. Alan Shepard ne 47 saal ki umar me is mission ki command sambhali aur safal landing ki.",
        "golf-balls": "Yeh chaand ki sabse mazedaar dharohar hai! Commander Alan Shepard ne chupke se ek six-iron golf club head pocket me chhipa liya tha. Unhone chaand par do golf balls ko hit kiya jo kam gravity ki wajah se meelon door jakar giri!",
        "met": "Modular Equipment Transporter — chaand ka pehla thela! Astronauts isme apne bhaari patthar aur tools rakh kar Fra Mauro ke craters tak kheench kar le gaye the."
    },
    "apollo-15": {
        "lrv": "Beep beep! Yeh hai Chaand ki pehli Gaadi — Lunar Roving Vehicle! Dave Scott aur Jim Irwin ne is electric moon buggy ko 12 km/h ki speed se Hadley Rille ke kinare chalaya. Isne chaand par 28 kilometer ka safar tay kiya.",
        "fallen-astronaut": "Yeh chaand par bani ek matra memorial art hai. Ek 8.5 centimeter ka aluminium astronaut aur ek plaque jispar space exploration me shaheed hue 14 astronauts aur kosmonauts ke naam darj hain.",
        "descent-stage": "Falcon Descent Stage! Yeh 15,000 feet unche Apennine pahadon ke beech Hadley ke maidan me utra tha."
    },
    "mars-pathfinder": {
        "sojourner": "Ares Vallis ke laal maidan me dekhiye! Yeh hai Sojourner — Mangal grah par chalne wala itihaas ka pehla rover! Iska vajan sirf 10 kilogram tha. Isne 1997 me Mars par pahiye ghumakar naya itihaas racha.",
        "lander-petals": "Pathfinder lander ke teen triangular petals jo airbags par bounce hone ke baad phool ki tarah khul gaye the. Inhe Carl Sagan Memorial Station naam diya gaya tha."
    },
    "mars-spirit": {
        "sp-rover": "Gusev Crater me khada hamara veer rover Spirit! Iski life sirf 90 dino ki tay ki gayi thi, lekin isne saalon tak tufano aur pattharile pahadon ka mukabla kiya aur pramaan diya ki yahan kabhi garm paani tha."
    },
    "mars-opportunity": {
        "op-rover": "Opportunity rover! Isne Mars par poori marathon se bhi zyada, 45 kilometer se adhik drive kiya. 2018 ke vishal dust storm me isne aakhri sandesh bheja: Mera battery kam hai, aur andhera ho raha hai."
    },
    "mars-curiosity": {
        "cu-rover": "Gale Crater me Curiosity rover — nuclear powered moving science laboratory! Isne Mount Sharp ki chadhai karte hue yeh sabit kiya ki Mars par ancient time me micro-organisms ke jeene laayak vatavaran tha."
    },
    "mars-perseverance": {
        "pe-rover": "Jezero Crater ka badshah — Perseverance rover! Yeh Mars se sabse shuddh sample tubes me mitti aur patthar pack kar raha hai. Yahan MOXIE instrument se Mars ki hawa se saans lene laayak Oxygen banayi gayi!",
        "pe-ingenuity": "Ginny — yaani Ingenuity helicopter! Mars par udan bharna namumkin maana jata tha. Lekin Ingenuity ne apne carbon blades ko 2400 RPM par ghumaya aur 72 historic udanein bhari! Isme Wright Brothers ke 1903 ke pehle plane ka kapda laga hai."
    },
    "mars-viking1": {
        "v1-lander-body": "Chryse Planitia me 1976 me utra Viking 1 lander! Yeh Mangal grah par safalta se kaam karne wala pehla American lander tha. Isne hume Mars ki pehli clear color tasveerein bheji."
    },
    "mars-viking2": {
        "v2-lander-body": "Utopia Planitia par Viking 2 lander! Isne 4 saal tak Mars ke mausam aur sardiyon me padne wale barfile frost ko apni aankhon se dekha aur document kiya."
    },
    "mars-phoenix": {
        "phoenix-lander-body": "Vastitas Borealis ke polar plains me Phoenix lander! Isne robotic arm se zameen khodkar shuddh safed paani ki barf ko chuwa aur laboratory oven me pighla kar check kiya."
    },
    "mars-insight": {
        "insight-lander-body": "Elysium Planitia par InSight lander! Iska kaam ghoomna nahi, balki sunna tha. Isne golden dome wale SEIS instrument se 1,300 se zyada marsquakes sune aur Mars ke core ka pata lagaya."
    },
    "deepspace-pioneer": {
        "pioneer-plaque": "Sone ke rang me ranga hua Pioneer Plaque! Carl Sagan aur Frank Drake ne is par manavta ka cosmic pata aur do insaanon ka shanti-sandesh banaya tha. Yeh solar system se baahar Milky Way me tair raha hai.",
        "pioneer-dish": "Pioneer 10 ka 2.74 meter ka silver dish antenna, jisne Jupiter ke sabse pehle nazdeeki photo bheje the."
    },
    "deep-voyager": {
        "golden-record": "Voyager 1 par laga Golden Record! Isme 55 bhashaon me namaste, samundari leharon aur whales ki aawazein, aur maa-bacche ki aawaz darj hai. Yeh 38,000 miles per hour ki speed se taaron ke beech ja raha hai."
    },
    "deep-dawn": {
        "dawn-spacecraft": "Dawn spacecraft jo Asteroid Belt me giant asteroid Vesta aur dwarf planet Ceres dono ki parikrama karke unke rahasya khol chuka hai."
    },
    "deep-near": {
        "near-spacecraft": "NEAR Shoemaker spacecraft jo 2001 me asteroid 433 Eros par utra tha. Yeh kisi asteroid par utarne wala manav itihaas ka sabse pehla spacecraft tha."
    },
    "deep-kepler": {
        "kepler-telescope": "Kepler Space Telescope! Isne andhere aakash me 150,000 taaron ko dekha aur 2,600 se zyada naye planets khoj nikale jo doosre taaron ka chakkar laga rahe hain."
    }
}

HINGLISH_FLIGHT = {
    "flight": {
        "moon": "Namaste Commander! Rocket engine full power par fire ho chuka hai. Hum Earth ki gravity chhodkar Chaand ki taraf Trans-Lunar Injection par aage badh rahe hain.",
        "mars": "Namaste Commander! Spacecraft Earth se nikal chuka hai. Mangal grah tak 40 crore kilometer ka lamba safar ab shuru hota hai.",
        "deep-space": "Namaste Commander! Escape velocity prapt kar li gayi hai. Hum solar system ke anant andhere aur taaron ki oor badh rahe hain."
    },
    "coast": {
        "moon": "Translunar coast jaari hai. Chaand ab aakash me bada aur chamkila dikhne laga hai. Landing systems ready hain.",
        "mars": "Antriksh me interplanetary cruise shant aur sthir hai. Solar panels poori tarah khule hain aur communications lock hain.",
        "deep-space": "Cruising speed 38,000 miles per hour hai. Suraj ab piche ek chote sitare ki tarah dikh raha hai."
    },
    "orbit": {
        "moon": "Lunar Orbit Insertion safal! Chaand ki pichli shant satah ke baad ab landing site hamari khidki me bhar chuki hai.",
        "mars": "Mars Orbit Insertion complete! Laal grah ke vishal craters aur laal dhoondh ab humare theek neeche hai.",
        "deep-space": "Proximity encounter corridor me pravesh! Gravitational lock sthapit ho chuka hai."
    },
    "targetLocked": {
        "moon": "Landing target lock ho chuka hai! Descent engines taiyar hain. Landing radar on karein.",
        "mars": "Martian target locked! Atmospheric entry ke liye heatshield aage ki taraf kar diya gaya hai.",
        "deep-space": "Target telemetry synchronized! Space probe observation trajectory par set hai."
    },
    "descent": {
        "moon": "Descent engine fire ho raha hai! Boulders aur craters se bachate hue rocket manual control me dhool udate hue neeche aa raha hai.",
        "mars": "Seven minutes of terror! Supersonic parachute khul gaya hai, retro-thrusters fire ho rahe hain. Dheere-dheere satah kareeb aa rahi hai.",
        "deep-space": "Gravitational encounter maneuvers chal rahe hain. Sensors data collect kar rahe hain."
    },
    "touchdown": {
        "moon": "Contact light! Engine stop! Chaand ki satah par landing safal hui! Houston, Tranquility Base yahan hai.",
        "mars": "Touchdown confirm! Hum Mangal grah ki laal mitti par safalta se utar chuke hain! Mission Control cheer kar raha hai.",
        "deep-space": "Trajectory encounter complete! Spacecraft anant antriksh me apna itihaas rach chuka hai."
    },
    "stepOut": {
        "moon": "Hatch khol diya gaya hai. Chaand ki dhool par kadam rakhiye, Commander. Yeh poori manavta ke liye ek giant leap hai.",
        "mars": "Instruments deploy ho chuke hain. Mangal grah ke maidan me aage badhiye aur purani machines ko scan kijiye.",
        "deep-space": "Sensors on hain. Cosmic radiation aur interstellar space ki aawaz suniye."
    },
    "explore": {
        "moon": "Chaand ki satah ka anveshan kijiye. Boulders, craters aur scientific packages ko dhoondhiye.",
        "mars": "Mangal grah ki dharohar ka anveshan kijiye. Laal dhool me purane rovers ko scan kijiye.",
        "deep-space": "Deep space sensors inspect kijiye. Cosmic dharohar ko scan kijiye."
    },
    "flagReady": {
        "moon": "Surface survey complete! Apna mission flag lagane ki taiyari kijiye.",
        "mars": "Mangal grah ka anveshan safal! Yahan apna mission marker lagaiye.",
        "deep-space": "Cosmic survey safal! Apna mission sign sthapit kijiye."
    },
    "flagPlanted": {
        "moon": "Flag chaand ki mitti me lag chuka hai! Chaand ki satah par hamara nishan hamesha rahega.",
        "mars": "Mangal grah ki laal dhool me mission marker lag chuka hai!",
        "deep-space": "Anant antriksh me mission marker lag chuka hai!"
    },
    "launch": {
        "moon": "Ascent stage engine fire! Chaand se Earth wapas lautne ki yatra shuru.",
        "mars": "Ascent capsule launch ho chuka hai! Mangal grah se Earth ke liye safar shuru.",
        "deep-space": "Data uplink complete! Mission command vessel ki taraf laut rahe hain."
    }
}

sem = asyncio.Semaphore(2)

async def generate_audio(text: str, output_path: str, voice=HINDI_TUTOR_VOICE):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    if os.path.exists(output_path) and os.path.getsize(output_path) > 1000:
        return
    async with sem:
        for attempt in range(4):
            try:
                print(f"Generating: {os.path.relpath(output_path)}", flush=True)
                communicate = edge_tts.Communicate(text, voice, rate="-4%")
                await communicate.save(output_path)
                return
            except Exception as e:
                if attempt == 3:
                    print(f"Failed {output_path}: {e}", flush=True)
                await asyncio.sleep(2.0)

async def main():
    print("="*60, flush=True)
    print("🎙️ Cosmosyy Hinglish Audio Generator (Retry Safe 2x)", flush=True)
    print("="*60, flush=True)

    mission_files = [f for f in os.listdir(MISSIONS_DIR) if f.endswith(".json")]
    tasks = []

    # 1. Collect Heritage Audio Tasks
    for mf in mission_files:
        with open(os.path.join(MISSIONS_DIR, mf), "r", encoding="utf-8") as f:
            data = json.load(f)
        mid = data["id"]
        objects = data.get("objects", [])

        for obj in objects:
            oid = obj["id"]
            audio_path = os.path.join(HERITAGE_AUDIO_DIR, mid, f"{oid}_hi.mp3")
            if not os.path.exists(audio_path) or os.path.getsize(audio_path) < 1000:
                m_set = HINGLISH_HERITAGE.get(mid, {})
                text = m_set.get(oid)
                if not text:
                    name = obj.get("name", "historic artifact")
                    disc = obj.get("scienceDiscovery", "")
                    leg = obj.get("legacy", "")
                    text = f"Namaste Commander! Dekhiye yeh hai {name}. {disc}. {leg}. Space exploration ki yeh dharohar hamesha yaad rakhi jayegi."
                tasks.append(generate_audio(text, audio_path))

    # 2. Collect Flight Narration Tasks
    for mf in mission_files:
        with open(os.path.join(MISSIONS_DIR, mf), "r", encoding="utf-8") as f:
            data = json.load(f)
        mid = data["id"]
        planet = data.get("planet", "moon")
        if planet not in ["moon", "mars", "deep-space"]:
            planet = "moon"

        for phase, planet_dict in HINGLISH_FLIGHT.items():
            script = planet_dict.get(planet, planet_dict.get("moon"))
            audio_path = os.path.join(NARRATION_AUDIO_DIR, mid, f"{phase}_hi.mp3")
            if not os.path.exists(audio_path) or os.path.getsize(audio_path) < 1000:
                tasks.append(generate_audio(script, audio_path))

    print(f"Remaining files to generate: {len(tasks)}", flush=True)
    if tasks:
        await asyncio.gather(*tasks)

    print("="*60, flush=True)
    print("🎉 All Hinglish audio files successfully created and verified!", flush=True)
    print("="*60, flush=True)

if __name__ == "__main__":
    asyncio.run(main())
