# iPlayMusic

Opgaven går ud på at opsætte et website der primært er mobiltvenligt, og er drevet af en simpel datastruktur.
Opgaven er tiltænkt som en **individuel opgave**, men I må selvfølgelig gerne vende ideer og koncepter med hinanden.


![alt text](https://github.com/rts-cmk-wuhf02/iPlayMusic/blob/master/iplaymusic.png "iPlayMusic hero")

# Del 1 - Layout
Fokus er at omsætte designet til funktionel ```html/css/javascript```, ud fra det ud har lært ind til videre. Designet skal følges så tæt som muligt, og fungere på kryds og tværs af flere mobil-skærmstørrelser. Det skal være muligt at skifte mellem lyst og mørkt tema men det er **ikke** et krav adressebaren er skjult som i en native app.

Der er elementer på hjemmesiden som går igen på flere af siderne, dem skal du trække ud i individuelle ```.ejs``` filer som ```templates``` der placeres i partials ```mappen``` og inkluderes efter behov. Udfordringen ligger i at splitte designet op i fornuftige og logiske dele, samt at gennemskue hvilke elementer der gentages på flere sider. Det vil også være ok at oprette templates for enkeltstående elementer.



### Views som skal produceres: 
*Navnene herunder: featured, albums etc. kan du bruge til at finde det rigtige view i Adobe XD filen. Er du itvivl så spørg!*

1. Featured (index) - *Præsenter featured albums. **OBS:** Dette view skal senere integrerer lazyload*
2. Albums - *Præsentere featured albums og new releases(albums)*
3. Album Details - *liste traks for et valgt album*
4. Categories - *liste alle kategorier*
5. Playlists - *listes tracks fra en valgt playliste*
6. Player - *"Afspil" et valgt track*

### Navigation:
Fra venstre: Albums, playlists, featured, farve tema, categories(find evt. et mere passende ikon). 
Afspilleren og album details er dybe links fra henholdsvis albums og playlists/album.  
![alt text](https://github.com/rts-cmk-wuhf02/iPlayMusic/blob/master/navigation.png "navigation")

### Font, farve og ikoner:
**Se styleguide:** https://github.com/rts-cmk-wuhf02/iPlayMusic/blob/master/styleguide.png 
**OBS:** Ikonerne er fra ionic frameworket som vi ikke arbejder med. Eksporter derfor ikoner fra XD eller integrer en anden ikon løsning ie. font-awesome eller ligende.

### Du skal bruge følgende i løsningen:
1. ```gulp```
2. ```ejs``` 
3. ```sass```
      * ```variabler```

# Tidsramme
Der er afsat 1 arbejds uge til opgaven, dvs aflevering på fredag kl 13.30 (den sidste commit til github inden fredag kl 13.30, bliver afleveringen).
